
app.service('Evaluator', function($http) {

    this.evaluate = function(code) {
        try {
            eval.call(window, code);
        } catch (e) {
        }

        return "ok";
    };
    
});

app.service('CommonInit', function($http) {
    
    this.init = function ($scope, Evaluator) {

        $scope.proceed = function () {
            if ($scope.state >= this.guide.length) {
                //alert("that's all folks");
            }

            this.guide[$scope.state].done = true;
            $scope.state++;
        }

        $scope.aceLoaded = function (_editor) {
            var session = _editor.getSession();
            session.setUndoManager(new ace.UndoManager());
            
            $scope.sessions.push(session);
            $scope.init();
        };

        $scope.aceChanged = function (e) {
            // DOJO - slow
            for (var i=0; i!=$scope.sessions.length; ++i) {
                Evaluator.evaluate($scope.sessions[i].getValue());
            }
        };


        $scope.state = 0;

        $scope.assess = function ( $event, sessionIndex ) {
            
            var target = $( $event.target );
   
            target.button('loading');
            
            setTimeout( function() {
                target.button('reset');
            }, 5000 );
            
            Evaluator.evaluate($scope.sessions[ (sessionIndex % $scope.codes.length) ].getValue());//still doubled >.<

            // do not evaluate examples, exercises only
            
            if (sessionIndex >= $scope.examples.length) {
                if ($scope._assess()) {
                    $scope.proceed();
                }
            }

            setTimeout( function() { // timeout ensures that the loading text is visible for at least some time!
                target.button('reset');
            }, 500 );
        }
    }
})