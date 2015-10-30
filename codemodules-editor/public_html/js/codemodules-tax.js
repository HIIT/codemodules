
app.controller("TaxController", function($scope, Evaluator, CommonInit) {
    
    $scope.template = 'partials/tax.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.code = "laskeVerot = function(vuosipalkka) {\n //  \n return 500; \n}";
    
    $scope.init = function() {
        $scope.session.setValue( this.code );
        
        eval( $scope.code );
    };
    
    $scope.loaded = function() {
        $scope.plot();
    };
    
    $scope.plot = function() {
      
        var amount = [];
        var share = []
        
        for (var i = 500; i < 5000; i+= 100) {
            var salary = i * 12;
            
            amount.push( [i, laskeVerot( salary ) / 12 ] );
            share.push( [i, laskeVerot( salary ) / salary * 100 ])
        }
	
        $.plot("#tax-plot", [
            { data: amount, label: 'Veron määrä kuussa' },
            { data: share, label: 'Veron määrä tuloista (%)', yaxis: 2 }
        ], {
            legend: { container: $('#legend')  },
            yaxes: [ {}, {
                 position: "right",   
            }]
        } );
        
    };
    
    $scope._assess = function() {
        
        var f = this.guide[ this.state ].correct;
        
        for( var i = 500; i < 500000; i += 100 ) {
            
            if( window.laskeVerot(i) != f(i) ) {
                $('#tasks').effect('pulsate')
                return false;
            }
        }
        
        return true;
    
    };
    
    $scope.guide = [
        {
            text: "Muokkaa verojen laskentaa siten, kaikki maksavat 600 euron tasaveron",
            correct: function(salary) { return 600; }
            
        },
        {
            text: "Progressiivisessa verotuksessa verot mukautuvat tulojen suhteen, määritellään että alle 30000 euron vuosituloilla veroja maksetaan 600 euroa, muutoin 1000 euroa.",
            correct: function(salary) { if( salary < 30000 ) { return 600; } else { return 1000 }; }
        },
        {
            text: "Alle 16 300 euron tuloista ei kanneta veroa valtion verotuksessa",
            correct: function(salary) { 
                if( salary < 16300 ) return 0;
                if( salary < 30000 ) return 600;
                return 1000;
            }
        },
        {
            text: "16 300 euron ja 24 300 euron välillä veroa maksetaan 8 euroa sekä 6.5 prosenttia kustakin ylittävästä osuudesta. Muut maksavat 1000 euron tasaveron.",
            correct: function(salary) { 
                if( salary < 16300 ) return 0;
                if( salary < 24300 ) return 8 + (24300-salary)*0.065;
                return 1000;
            }
        },
        {
            text: "Lisää myös muut tulotasot verohallinnon ohjeen mukaisesti",
            correct: function(salary) { 
                if( salary < 16300 ) return 0;
                if( salary < 24300 ) return 8 + (salary-16300)*0.065;
                if( salary < 39700 ) return 528 + (salary-24300)*0.175;
                if( salary < 71400 ) return 3223 + (salary-39700)*0.215;
                if( salary < 100000 ) return 10038.5 + (salary-71400)*0.2975;
                return 18547+(salary-100000)*0.3175;
            }
        }
    ];

});
