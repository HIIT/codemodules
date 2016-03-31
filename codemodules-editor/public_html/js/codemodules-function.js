app.controller("FunctionController", function($scope, Evaluator, CommonInit) {
    
    // remember to have this on each template!
    $scope.showJSGuide = false;
    $scope.toggleJSGuide = function() {
        $scope.showJSGuide = !$scope.showJSGuide;
        var btn = $("#toggle-jsguide");
        if (btn.html() == "Avaa koodiohje") btn.html("Sulje koodiohje");
        else btn.html("Avaa koodiohje");
    }
    
    $scope.template_intro = 'partials/fun/intro.html';
    $scope.template_outro = 'partials/fun/outro.html';
    $scope.visual_example = 'partials/fun/visual_example.html';
    $scope.visual_exercise = 'partials/fun/visual_exercise.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.codes = [
        "funktio = function(luku) {\n    return 1;\n}",
        "funktio = function(luku) {\n    return luku - 1;\n}",
        "funktio = function(luku) {\n    //kirjoita koodisi tämän rivin alle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n}",
        "funktio = function(luku) {\n    //kirjoita koodisi tämän rivin alle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n}",
        "funktio = function(luku) {\n    //kirjoita koodisi tämän rivin alle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n}",
        "funktio = function(luku) {\n    //kirjoita koodisi tämän rivin alle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n}",
        "funktio = function(luku) {\n    //kirjoita koodisi tämän rivin alle\n    return 0;\n    //kirjoita koodisi tämän rivin yläpuolelle\n}"
    ];
    
    $scope.sessions = [];
    $scope.valueTables = [];
    
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
            $scope.valueTables[i] =  [
                {number: -5, value: 0},
                {number: -1, value: 0},
                {number:  0, value: 0},
                {number:  1, value: 0},
                {number:  2, value: 0},
                {number:  5, value: 0}
            ];
            
            
            var event = {target: $("#visual-"+i+".button.btn.btn-primary")};
            $scope.run(event, i);
        }
        
        // DOJO: these are needed?
        //$scope.session.setValue( this.code );
        
        //eval( $scope.code );
    };
    
    
    
    
    $scope.run = function($event, index) {

        $scope.assess($event, index);

        $scope.valueTables[index].forEach( function(element){
            element.value = window.funktio( element.number );
        } );

    };
    
    $scope._assess = function() {

        for( var i = -10; i < 10; i++ ) {
            var correct = this.guide[ this.state ].correct( i );
            var user = window.funktio( i );
            
            if( user != correct ) {
                $('#guide').effect("pulsate");
                return false;
            }
        }
        
        return true;
    
    };
    
    $scope.examples = [
        {
            text: "Funktiokone palauttaa jokaisella syötteellä arvon yksi."
        },
        {
            text: "Funktiokone palauttaa syötteen arvon pienennettyään sitä yhdellä."
        }
    ];
    
    $scope.guide = [
        {
            // DOJO: rehaul these descriptions!
            text: "Funktiokone palauttaa jokaisella syötteellä arvon viisi.",
            correct: function(x) { return 5; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun joka on kaksinkertainen.",
            correct: function(x) { return 2*x; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun johon on lisätty kolme.",
            correct: function(x) { return x+3; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun neliön.",
            correct: function(x) { return x*x; }
        },
        {
            text: "Funktiokone palauttaa jokaisella syötteellä luvun itseisarvon.",
            correct: function(x) { return Math.abs(x); }
        }
        
    ];

});
