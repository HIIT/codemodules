app.controller("TaxController", function($scope, Evaluator, CommonInit) {
    
    // remember to have this on each template!
    $scope.showJSGuide = false;
    $scope.toggleJSGuide = function() {
        $scope.showJSGuide = !$scope.showJSGuide;
        var btn = $("#toggle-jsguide");
        if (btn.html() == "Avaa koodiohje") btn.html("Sulje koodiohje");
        else btn.html("Avaa koodiohje");
    }
    
    $scope.template_intro = 'partials/tax/intro.html';
    $scope.template_outro = 'partials/tax/outro.html';
    $scope.visual_example = 'partials/tax/visual_example.html';
    $scope.visual_exercise = 'partials/tax/visual_exercise.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.codes = [
        "laskeVerot = function(vuosipalkka) {\n    return 300;\n};",
        "laskeVerot = function(vuosipalkka) {\n    if (vuosipalkka < 20000) {\n        return 0;\n    } else {\n        return 400;\n    }\n};",
        "laskeVerot = function(vuosipalkka) {\n    return vuosipalkka * 0.11;\n};",
        "laskeVerot = function(vuosipalkka) {\n    //kirjoita koodisi tämän rivin alapuolelle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n};",
        "laskeVerot = function(vuosipalkka) {\n    //kirjoita koodisi tämän rivin alapuolelle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n};",
        "laskeVerot = function(vuosipalkka) {\n    //kirjoita koodisi tämän rivin alapuolelle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n};",
        "laskeVerot = function(vuosipalkka) {\n    //kirjoita koodisi tämän rivin alapuolelle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n};",
        "laskeVerot = function(vuosipalkka) {\n    //kirjoita koodisi tämän rivin alapuolelle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n};"
    ];
    
    $scope.sessions = [];
    
    $scope.init = function() {
        var index = $scope.sessions.length-1;
        
        // FAILSAFE: something has gone badly wrong, should get properly fixed >.<
        if (index >= $scope.codes.length) {
            index = index % $scope.codes.length;
        }
        $scope.sessions[index].setValue( $scope.codes[index] );
        eval( $scope.codes[index] ); //DOJO - why this should be done?
    };
    
    $scope.onLoad = function() {
        var count = $scope.examples.length + $scope.guide.length;
        for (var i=0; i < count; ++i) {
            var event = {target: $("#visual-"+i+".button.btn.btn-primary")};
            $scope.plot(event, i);
        }
    };
    
    $scope.plot = function( $event, index) {
        
        $scope.assess($event, index);
    
        var amount = [];
        var share = [];
        
        for (var i = 500; i < 5000; i+= 100) {
            var salary = i * 12;
            
            amount.push( [i, laskeVerot( salary ) / 12 ] );
            share.push( [i, laskeVerot( salary ) / salary * 100 ]);
        }
        
        $.plot("#tax-plot-"+index, [
            { data: amount, label: 'Veron määrä kuussa' },
            { data: share, label: 'Veron määrä tuloista (%)', yaxis: 2 }
        ], {
            legend: { container: $('#legend-'+index)  },
            yaxes: [ {}, {
                 position: "right",   
            }]
        } );
        
    };
    
    $scope._assess = function() {
        var f = this.guide[ this.state ].correct;
    
        for( var i = 500; i < 500000; i += 100 ) {
            
            if( window.laskeVerot(i) != f(i) ) {
                $('#tasks').effect('pulsate'); // DOJO
                return false;
            }
        }
        
        return true;
    
    };
    
    
    $scope.examples = [
        {
            text: "Kaikki maksavat 300 euroa veroja."
        },
        {
            text: "Kaikki maksavat 400 euroa veroja. Mikäli vuoden tulot ovat alle 20 000 euroa, veroja ei tarvitse maksaa."
        },
        {
            text: "Kaikki maksavat tasaveron, 11 prosenttia tuloistaan."
        }
    ];
    
    $scope.guide = [
        {
            text: "Toteuta verotus, jossa kaikki maksavat aina 600 euroa veroja.",
            correct: function(salary) { return 600; }
            
        },
        {
            text: "Toteuta verotus, jossa verojen määrä riippuu vuosituloista. Mikäli vuositulot ovat alle 30 000 euroa, veroja maksetaan 600 euroa. Mikäli vuositulot ovat 30 000 euroa tai enemmän, veroja maksetaan 1000 euroa.",
            correct: function(salary) {
                if( salary < 30000 ) {
                    return 600;
                } else {
                    return 1000
                };
            }
        },
        {
            text: "Toteuta edellinen verotus, mutta muuta sitä siten, että alle 16 700 euroa vuodessa tienaavat ovat verovapaita.",
            correct: function(salary) { 
                if( salary < 16700 ) return 0;
                if( salary < 30000 ) return 600;
                return 1000;
            }
        },
        {
            text: "Toteuta seuraava: 16 700 euroa vuodessa tienaavat eivät maksa veroja. 16 700 ja 25 000 euron välillä tienaavat maksavat 8 euroa sekä 6.5 prosenttia siitä osuudesta tulojaan, joka ylittää 16 700 euroa. Yli 25 000 vuodessa tienaavat maksavat 1000 euron tasaveron.",
            correct: function(salary) { 
                if( salary < 16700 ) return 0;
                if( salary < 25000 ) return 8 + (salary-16700)*0.065;
                return 1000;
            }
        },
        {
            //text: "Toteuta vuoden 2016 tulovero. Veroportaat löydät <a href='https://www.vero.fi/fi-FI/Syventavat_veroohjeet/Henkiloasiakkaan_tuloverotus/Valtion_tuloveroasteikko_2016(38905)'>verohallinnon sivuilta</a>.",
            text: "Toteuta vuoden 2016 tulovero. Veroportaat löydät osoitteesta https://www.vero.fi/fi-FI/Syventavat_veroohjeet/Henkiloasiakkaan_tuloverotus/Valtion_tuloveroasteikko_2016(38905)",
            correct: function(salary) { 
                if( salary < 16700 ) return 0;
                if( salary < 25000 ) return 8 + (salary-16700)*0.065;
                if( salary < 40800 ) return 547.50 + (salary-25000)*0.175;
                if( salary < 72300 ) return 3312.50 + (salary-40800)*0.215;
                return 10085+(salary-72300)*0.3175;
            }
        }
    ];

});
