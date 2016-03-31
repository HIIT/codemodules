app.controller("PictureController", function($scope, Evaluator, CommonInit) {
    
    // remember to have on each template! -DOJO
    $scope.showJSGuide = false;
    $scope.toggleJSGuide = function() {
        $scope.showJSGuide = !$scope.showJSGuide;
        var btn = $("#toggle-jsguide");
        if (btn.html() == "Avaa koodiohje") btn.html("Sulje koodiohje");
        else btn.html("Avaa koodiohje");
    }
    
    $scope.template_intro = 'partials/rgb/intro.html';
    $scope.template_outro = 'partials/rgb/outro.html';
    $scope.visual_example = 'partials/rgb/visual_example.html';
    $scope.visual_exercise = 'partials/rgb/visual_exercise.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.codes = [
        "muutaPikseli = function(pun, vih, sin) {\n    var p = 0;\n    var v = 0;\n    var s = 0;\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    var p = pun;\n    var v = 0;\n    var s = sin;\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    var p = sin;\n    var v = vih;\n    var s = pun;\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    //tee muutoksesi tämän rivin alapuolelle\n    var p = pun;\n    var v = vih;\n    var s = sin;\n    //tee muuutoksesi tämän rivin yläpuolelle\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    //tee muutoksesi tämän rivin alapuolelle\n    var p = pun;\n    var v = vih;\n    var s = sin;\n    //tee muuutoksesi tämän rivin yläpuolelle\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    //tee muutoksesi tämän rivin alapuolelle\n    var p = pun;\n    var v = vih;\n    var s = sin;\n    //tee muuutoksesi tämän rivin yläpuolelle\n    return [p,v,s];\n};",
        "muutaPikseli = function(pun, vih, sin) {\n    //tee muutoksesi tämän rivin alapuolelle\n    var p = pun;\n    var v = vih;\n    var s = sin;\n    //tee muuutoksesi tämän rivin yläpuolelle\n    return [p,v,s];\n};"
    ];
    
    $scope.sessions = [];
    $scope.canvases = [];
    $scope.contexts = [];
    $scope.images = [];
    
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
            $scope.onLoadLogic(i);
        }
    };
    
    $scope.onLoadLogic = function(i) {
        $scope.canvases.push(null);
        $scope.contexts.push(null);
        $scope.images.push(null);
        
        var canvas = document.getElementById("canvas-"+i);
        var height = canvas.height;
        var width = canvas.width;
        
        var image = new Image();
        image.src = './res/Mona_Lisa.jpg';
        image.width = 134;
        image.height = 200;
        
        // scale image
        var ratio = 1;
            
        if( image.width > width ) ratio = width / image.width;
        if( image.height > height ) ratio = height / image.height;
            
        // scale canvas
        canvas.width = image.width * ratio;
        canvas.height = image.height * ratio;
        
        image.onload = function(event, index=i) { // DOJO - works for all browsers?
            context = canvas.getContext('2d');
            context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            $scope.canvases[index] = canvas;
            $scope.contexts[index] = context;
            $scope.images[index] = context.getImageData(0, 0, canvas.width, canvas.height ); 
        };
    }
    
    $scope.loadFile = function(canvasIndex) {
        
        var event = window.event;
        var file = event.target.files[0];
        
        var fr = new FileReader();
        
        var image = new Image();
        
        var canvas = document.getElementById('canvas-'+canvasIndex);
        
        var height = canvas.height;
        var width = canvas.width;
        
        context = canvas.getContext('2d');
        
        fr.onload = function() {
            image.src = fr.result;
            
            // $scope.$apply( function() {
            // $scope.original = fr.result;
            // });
        };
        
        image.onload = function(index=canvasIndex) {
            
            // scale image
            var ratio = 1;
            
            if( image.width > width ) ratio = width / image.width;
            if( image.height > height ) ratio = height / image.height;
            
            // scale canvas
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            
            // set image and scale it
            context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            $scope.canvases[index] = canvas;
            $scope.contexts[index] = context;
            $scope.images[index] = context.getImageData(0, 0, canvas.width, canvas.height );
        };
        
        fr.readAsDataURL( file );
        
    };
    
    $scope.reset = function(index) { // TODO terminology index vs canvasindex vs ???
        $scope.contexts[index].putImageData( $scope.images[index] , 0, 0);
    };
    
    
    $scope.run = function($event, index) {
        
        $scope.assess($event, index);
        
        var image = $scope.contexts[index].getImageData(0, 0, $scope.canvases[index].width, $scope.canvases[index].height );
        
        var d;
        for( var i = 0; i < image.data.length; i += 4 ) {
            d = window.muutaPikseli( image.data[i], image.data[i+1], image.data[i+2] );
            image.data[i] = d[0];
            image.data[i+1] = d[1];
            image.data[i+2] = d[2];   
        }
        
        $scope.contexts[index].putImageData( image , 0, 0);
    };
    
    // we can use this some day
    /* 
    window.annaPikseli = function( x, y ) {
       var image = $scope.image;
       
       if( x < 0 || x > image.height ) {
           alert("X on liian suuri tai liian pieni");
           return [0,0,0];
       }
       
       if( y < 0 || y > image.width ) {
           alert("Y on liian suuri tai liian pieni");
           return [0,0,0];
       }
       
       var index = (x + y * image.width) * 4;
       
       return [
           image.data[ index ],
           image.data[ index + 1 ],
           image.data[ index + 2 ]
       ];
    };
    
    window.asetaPikseli = function( x, y, r, g, b ) {
        var image = $scope.image;
        
        console.log( x + ',' + y );
        
        if( x < 0 || x > 200 ) {
           alert("X on liian suuri tai liian pieni");
           return [0,0,0];
        }
       
        if( y < 0 || y > 200 ) {
           alert("Y on liian suuri tai liian pieni");
           return [0,0,0];
        }
        
        var index = (x + y * image.width) * 4;
        
        image.data[ index ] = r;
        image.data[ index + 1] = g;
        image.data[ index + 2] = b;
        
        $scope.image = image;
    };
    
    window.paivitaKuva = function() {
        $scope.canvas.putImageData( $scope.image , 0, 0);
    } */
    
    // TODO: apparently obsolete line:
    // $scope.checkAnswer = function() {};
    
    $scope._assess = function() {
        
        var f = this.guide[ this.state ].correct;
        
        for(var r = 0; r <= 255; r += 10) {
            for( var g = 0; g <= 255; g+= 10 ) {
                for( var b = 0; b <= 255; b+= 10) {
                    
                    var user = window.muutaPikseli(r,g,b);
                    var correct = f(r,g,b);
                   
                    if( user.length != 3 ) {
                        return false;
                    }
                    
                    for( var i = 0; i < 3; i++ ){
                        
                        if( user[i] != correct[i] ) {
                            $('#tasks').effect('pulsate'); // DOJO - FIXME?
                            return false;
                        }
                    }
                    
                }
            }
        }
        
        return true;
    
    };
    
    $scope.examples = [
        {
            text: "Muutetaan kaikki värit mustaksi."
        },
        {
            text: "Otetaan väristä vihreä komponentti pois."
        },
        {
            text: "Vaihdetaan sininen ja punainen komponentti keskenään."
        }
    ]
    
    $scope.guide = [
        {
            text: "Ota väristä kaikki punaisuus pois.",
            correct: function(r,g,b) { return [0, g, b]; }
            
        },
        {
            text: "Käännä punaisuuden määrä vastakkaiseksi: esimerkiksi punaisen arvosta 200 tulisi 55, ja punaisen arvosta 10 tulisi 245.",
            correct: function(r,g,b) { return [255-r, g, b]; }
        },
        {
            text: "Korvaa punaisensävyiset värit (punaisen määrä yli 100) valkoisella",
            correct: function(r,g,b) { if( r > 100 ) return [255,255,255]; return [r,g,b]; }
        },
        {
            text: "Muokkaa värejä siten, että kaikista väreistä tulee ääriarvoja: jos punaisen määrä on alle 100, vaihda se nollaan, muuten vaihda punaisen määrä arvoon 255. Toista sama vihreän ja sinisen määrälle.",
            correct: function(r,g,b) {
                if ( r < 100 ) r = 0;
                else r = 255;
                if ( g < 100 ) g = 0;
                else g = 255;
                if ( b < 100 ) b = 0;
                else b = 255;
                return [r,g,b];
            }
        }
    ];

});
