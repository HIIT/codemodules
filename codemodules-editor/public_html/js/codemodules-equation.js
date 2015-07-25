app.controller("EquationController", function($scope, Evaluator, CommonInit) {
    
    $scope.template = 'partials/equation.html';
    
    CommonInit.init( $scope, Evaluator );
    
    
    $scope.code = "onkoOikein = function(vasenVakio, vasenKerron, oikeaVakio, oikeaKerroin, arvaus) {\n return true; \n}";
    
    $scope.init = function() {
        
        $scope.numLeft = 3;
        $scope.varLeft = 5;
        $scope.numRight = 4;
        $scope.varRight = 5;
        $scope.x = 9000;
        $scope.session.setValue( this.code );
        
        eval( $scope.code );
    };
    
    $scope.checkAnswer = function(varX) {
                
        var res = onkoOikein( $scope.numLeft, $scope.varLeft, $scope.numRight, $scope.varRight, varX);
        
        if( res ) {
            $scope.answer_status = "Vastaus on oikein";
        } else {
            $scope.answer_status = "Vastaus on väärin";
        }

        // new variables
        
        var r = function(){ return Math.round( Math.random() * 5 ) + 1; };
        
        $scope.numLeft = r();
        $scope.varLeft = r();
        $scope.numRight = r();
        $scope.varRight = r();
        $scope.varX = "";
        
    };
    
    $scope._assess = function(numLeft, varLeft, numRight, varRight, varX) {
        
        numLeft = parseInt(numLeft);
        varLeft = parseInt(varLeft);
        numRight = parseInt(numRight);
        varRight = parseInt(varRight);
        varX = parseInt( varX );

        var res = onkoOikein(numLeft, varLeft, numRight, varRight, varX);
        
        console.log( this.guide[ this.state ].correct );
        
        if( res === this.guide[ this.state ].correct() ) {
            return true;
        }
        
        return false;
    
    };
    
    $scope.guide = [
        {
            text: "Muokkaa koodia siten, että kaikki vastaukset ovat väärin",
            correct: function() { return false; }
        },
        {
            text: "Palauta yhtälön vasen vakio",
            correct: function() { return $scope.numLeft; }
        },
        {
            text: "Palauta yhtälön oikean ja vasemman vakion erotus",
            correct: function() { return $scope.numRight - $scope.numLeft; }
        },
        {
            text: "Palauta yhtälön oikean ja vasemman kertoimen erotus",
            correct: function() { return $scope.varRight - $scope.varLeft; }
        },
        {
            text: "Palauta yhtälön vakioiden erotuksen ja kertoimien erotusten osamäärä",
            correct: function() { return ($scope.numRight - $scope.numLeft) / ($scope.varRight - $scope.varLeft); }
        },
        {
            text: "Tarkista, onko arvaus sama kuin erotusten osamäärä",
            correct: function() { return $scope.varX == ($scope.numRight - $scope.numLeft) / ($scope.varRight - $scope.varLeft); }
        }
    ];

});
