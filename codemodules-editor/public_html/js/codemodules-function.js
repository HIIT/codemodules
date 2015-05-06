app.controller("FunctionController", function($scope, Evaluator, CommonInit) {
    
    $scope.template = 'partials/function.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.code = "funktio = function(luku) {\n return 0; \n}";
    
    $scope.init = function() {
        
        $scope.values =  [
            {number: -5, value: 0},
            {number: -1, value: 0},
            {number:  0, value: 0},
            {number:  1, value: 0},
            {number:  2, value: 0},
            {number:  5, value: 0}
        ];
        
        $scope.session.setValue( this.code );
        
        eval( $scope.code );
    };
    
    $scope.run = function() {
      
      $scope.values.forEach( function(element){
          element.value = window.funktio( element.number );
      } );

    };
    
    $scope._assess = function() {

        for( var i = -10; i < 10; i++ ) {
            var correct = this.guide[ this.state ].correct( i );
            var user = window.funktio( i );
            
            if( user != correct ) {
                return false;
            }
        }
        
        return true;
    
    };
    
    $scope.guide = [
        {
            text: "Funktiokone palauttaa jokaisella syötteellä arvon viisi",
            correct: function(x) { return 5; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun joka on kaksinkertainen",
            correct: function(x) { return 2*x; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun johon on lisätty kolme",
            correct: function(x) { return x+3; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun neliön",
            correct: function(x) { return x*x; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun etäisyyden nollasta",
            correct: function(x) { return Math.abs(x); }
        }
        
    ];

});
