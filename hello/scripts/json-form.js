$(document).ready(function () {

    var container = document.getElementById('jsoneditor');
    var options = {
        mode: 'code',
        modes: ['code', 'form', 'text', 'tree', 'view']
    };

    var editor = new JSONEditor(container, options);


    var defaultJson = {
        'firstname': "",
        'lastname': "",
        'punchline': ""
    };

    $.ajax({
        type: "GET",
        url: "api/people/me",
        success: function (json) {
            editor.set(json || defaultJson)
        },
        error: function () {
            editor.set(defaultJson)
        }
    });

    $('#submit-json').on('click', function (e) {
        e.preventDefault();
        try {
            var json = editor.get();
            $.ajax({
                type: "POST",
                url: "api/people",
                data: {
                    data: JSON.stringify(json, null)
                },
                success: function (json) {
                    $("#successModal").modal();
                    editor.set(json);
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        catch (e) {
            alert(e);
        }
    })
});

