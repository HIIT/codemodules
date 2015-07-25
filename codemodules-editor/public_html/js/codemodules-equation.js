app.controller("EquationController", function($scope, Evaluator, CommonInit) {
    
    $scope.template = 'partials/equation.html';
    
    CommonInit.init( $scope, Evaluator );
    
    
    $scope.code = "onkoOikein = function(vasenVakio, vasenKerroin, oikeaVakio, oikeaKerroin, arvaus) {\n return true; \n}";
    
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
        
        if( $scope.varLeft == $scope.varRight ) {
            $scope.varLeft + r();
        }
        
        $scope.varX = "";
        
    };
    
    $scope._assess = function() {
        
        var f = this.guide[ this.state ].correct;
        
        
        for( var a = -10; a <= 10; a ++ ) {
            for( var b = -10; b <= 10; b++ ) {
                for( var c = -10; c <= 10; c++ ) {
                    for( var d = -10; d <= 10; d++ ) {
                        for( var e = -10; e <= 10; e++) {
                            
                            var cor = f(a,b,c,d,e);
                            var student = onkoOikein(a,b,c,d,e);
                            
                            // division by zero is OK!
                            if( isNaN( cor ) && isNaN( student ) ) {
                                // go to next numbers
                            }
                            // check for correctness
                            else if( cor != student ) {
                                return false;
                            }
                            
                        }
                    }
                }
            }
        }
        
        return true;
    
    };
    
    $scope.guide = [
        {
            text: "Muokkaa koodia siten, että kaikki vastaukset ovat väärin",
            correct: function(a,b,c,d,e) { return false; }
        },
        {
            text: "Palauta yhtälön vasen vakio",
            correct: function(a,b,c,d,e) { return a; }
        },
        {
            text: "Palauta yhtälön vasemman ja oikean vakion erotus",
            correct: function(a,b,c,d,e) { return a - c; }
        },
        {
            text: "Palauta yhtälön vasemman ja oikean kertoimen erotus",
            correct: function(a,b,c,d,e) { return b - d; }
        },
        {
            text: "Palauta yhtälön vakioiden erotuksen ja kertoimien erotusten osamäärä",
            correct: function(a,b,c,d,e) { return (a-c) / (b -d ); }
        },
        {
            text: "Tarkista, onko arvaus sama kuin erotusten osamäärä",
            correct: function(a,b,c,d,e) { return e == (a-c) / (b -d ); }
        }
    ];

});
