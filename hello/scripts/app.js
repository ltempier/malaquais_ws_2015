var app = angular.module('hello', []);

app.controller("app-controller", ["$scope", "$http", function ($scope, $http) {

    $http.get('api/people')
        .success(function (people) {
            angular.extend($scope, {people: people})
        })
        .error(function (data) {
        });
}]);