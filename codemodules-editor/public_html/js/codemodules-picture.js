app.controller("PictureController", function($scope, Evaluator, CommonInit) {
    
    $scope.template = 'partials/picture.html';
    
    CommonInit.init( $scope, Evaluator );
    
    $scope.code = "muutaPikseli = function(pun, sin, kel) {\n // Jokainen pikseli tallennetaan 3:lla eri väriarvolla \n //(punanen, sininen, keltainen) ja nämä vaihtelevat 0 ja 255 välillä \n var p = pun;\n var s = sin;\n var k = kel;\n return [p,s,k];\n};";
    
    $scope.init = function() {
        
        $scope.session.setValue( this.code );
        
        eval( $scope.code );
        
    };
    
    $scope.loaded = function() {
       
        var canvas = document.getElementById('canvas');
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
            
        image.onload = function() {
            context = canvas.getContext('2d');
            context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            $scope.canvas = canvas;
            $scope.context = context;
            $scope.image = context.getImageData(0, 0, canvas.width, canvas.height );
 
            }
        
    };
    
    $scope.loadFile = function() {
        
        var event = window.event;
        var file = event.target.files[0];
        
        var fr = new FileReader();
        
        var image = new Image();
        
        var canvas = document.getElementById('canvas');
        
        var height = canvas.height;
        var width = canvas.width;
        
        context = canvas.getContext('2d');
        
        fr.onload = function() {
            image.src = fr.result;
            
            // $scope.$apply( function() {
            // $scope.original = fr.result;
            // });
        };
        
        image.onload = function() {
            
            // scale image
            var ratio = 1;
            
            if( image.width > width ) ratio = width / image.width;
            if( image.height > height ) ratio = height / image.height;
            
            // scale canvas
            canvas.width = image.width * ratio;
            canvas.height = image.height * ratio;
            
            // set image and scale it
            context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            $scope.canvas = canvas;
            $scope.context = context;
            $scope.image = context.getImageData(0, 0, canvas.width, canvas.height );
        };
        
        fr.readAsDataURL( file );
        
    };
    
    $scope.reset = function() {
        $scope.context.putImageData( $scope.image , 0, 0);
    };
    
    
    $scope.run = function() {
        
        console.log( $scope.canvas.width );
        
        var image = $scope.context.getImageData(0, 0, $scope.canvas.width, $scope.canvas.height );
        
        var d;
        for( var i = 0; i < image.data.length; i += 4 ) {
            d = window.muutaPikseli( image.data[i], image.data[i+1], image.data[i+2] );
            image.data[i] = d[0];
            image.data[i+1] = d[1];
            image.data[i+2] = d[2];   
        }
        
        $scope.context.putImageData( image , 0, 0);
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
    
    $scope.checkAnswer = function() {};
    
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
                            return false;
                        }
                    }
                    
                    
                }
            }
        }
        
        return true;
    
    };
    
    $scope.guide = [
        {
            text: "Muuta kaikki punaiset värit mustaksi",
            correct: function(r,g,b) { return [0, g, b]; }
        },
        {
            text: "Käännä punainen väri ympäri: tummasta valkoista ja valkoisesta tummaa",
            correct: function(r,g,b) { return [255-r, g, b]; }
        },
        {
            text: "Korvaa merkittävästi punaisen sävyiset (punainen yli 100) valkoisella",
            correct: function(r,g,b) { if( r > 100 ) return [255,255,255]; return [r,g,b]; }
        },
        {
            text: "Korvaa merkittävästi punaisen sävyiset (punainen yli 100) saman vahvuisella vastavärillä",
            correct: function(r,g,b) { if( r > 100 ) return [g,r,b]; return [r,g,b]; }
        }
    ];

});
