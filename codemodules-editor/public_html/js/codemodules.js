function println(str) {
    if (!str) {
        str = "";
    }

    print(str + "<br/>");
}

function print(str) {
    if (!str) {
        str = "";
    }

    var data = document.getElementById("output").innerHTML;
    document.getElementById("output").innerHTML = data + str;
}


var app = angular.module('codemodulesApp', ['ngRoute', 'ui.bootstrap', 'ui.ace']);

app.config(['$routeProvider', '$httpProvider', function($routeProvider) {
        
        $routeProvider
        .when('/', {
            templateUrl: 'partials/index.html'
        }) 
        .when('/yhtalö', {
            controller: 'EquationController',
            templateUrl: 'partials/main.html'
        })
        .when('/funktiokone', {
            controller: 'FunctionController',
            templateUrl: 'partials/main.html'
        })
        .when('/verotus', {
            controller: 'TaxController',
            templateUrl: 'partials/main.html'
        })
        .when('/kuva', {
            controller: 'PictureController',
            templateUrl: 'partials/main.html'
        }) 
        .otherwise({redirectTo: '/'});
        
}]);