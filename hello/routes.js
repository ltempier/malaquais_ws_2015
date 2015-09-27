var _ = require('underscore'),
    ObjectID = require('mongodb').ObjectID;

module.exports = function (app) {
    app.route('/')
        .get(function (req, res) {
            res.render('form');
        });

    app.route('/web')
        .get(function (req, res) {
            var people = __db.collection('people');
            people.find({}).toArray(function (err, array) {
                if (err)
                    res.status(500).json({err: err});
                else
                    res.render('web', {people: array})
            });
        });

    app.route('/app')
        .get(function (req, res) {
            res.render('app');
        });

    app.route('/json')
        .get(function (req, res) {
            res.render('json-form');
        });

    app.route('/data')
        .get(function (req, res) {
            var people = __db.collection('people');
            people.find({}).toArray(function (err, array) {
                if (err)
                    res.status(500).json({err: err});
                else
                    res.render('data', {people: formatRender(array)})
            });
        });

    app.use('/api', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.route('/api/people')
        .post(function (req, res) {

            var people = __db.collection('people');

            var person = formatDb(req.body);
            people.findOne({
                firstname: person.firstname,
                lastname: person.lastname
            }, function (err, doc) {
                if (err)
                    res.status(500).json({err: err});
                else if (doc && doc._id) {

                    person = _.extend(doc, person);

                    req.session.personId = person._id;
                    req.session.save();

                    people.updateOne(
                        {_id: doc._id},
                        person,
                        function (err) {
                            if (err)
                                res.status(500).json({err: err});
                            else
                                res.status(200).json(formatRender(person));
                        })
                } else {
                    people.insert(
                        person,
                        function (err) {
                            req.session.personId = person._id;
                            req.session.save();

                            if (err)
                                res.status(500).json({err: err});
                            else
                                res.status(200).json(formatRender(person));
                        })
                }
            })
        })
        .get(function (req, res) {
            var people = __db.collection('people');
            people.find(formatDb(req.query)).toArray(function (err, array) {
                if (err)
                    res.status(500).json({err: err});
                else
                    res.status(200).json(array)
            });
        });

    app.route('/api/people/me')
        .get(function (req, res) {
            if (req.session.personId) {
                var people = __db.collection('people');
                people.findOne({_id: new ObjectID(req.session.personId)}, function (err, person) {
                    if (err)
                        res.status(500).json({err: err});
                    else
                        res.status(200).json(formatRender(person))
                })
            }
            else
                res.status(200).json(null)
        });

    app.route('/api/people/:id')
        .get(function (req, res) {
            var people = __db.collection('people');

            people.findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
                if (err)
                    res.status(500).json({err: err});
                else
                    res.status(200).json(formatRender(doc))
            })
        });

    function formatDb(person) {
        if (person.data && _.isString(person.data))
            person = JSON.parse(person.data);
        var fields = ['firstname', 'lastname', 'punchline'];
        _.each(person, function (value, key) {
            if (fields.indexOf(key) >= 0)
                person[key] = capitalizeFirstLetter(person[key])
        });
        return person;

        function capitalizeFirstLetter(string) {
            if (typeof string === 'string')
                return string.charAt(0).toUpperCase() + string.slice(1);
            return string
        }
    }

    function formatRender(person) {
        var rejectFields = ['_id'];
        if (_.isArray(person))
            return _.map(person, formatRender);
        return _.omit(person, rejectFields)
    }
};
