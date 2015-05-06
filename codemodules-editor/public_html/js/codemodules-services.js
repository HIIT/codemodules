
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
                alert("that's all folks");
            }

            this.guide[$scope.state].done = true;
            $scope.state++;
        }

        $scope.aceLoaded = function (_editor) {
            $scope.session = _editor.getSession();
            $scope.session.setUndoManager(new ace.UndoManager());

            $scope.init();
        };

        $scope.aceChanged = function (e) {
            Evaluator.evaluate($scope.session.getValue());
        };


        $scope.state = 0;
        $scope.session = null;

        $scope.assess = function () {
  
            // TODO: UI code, should be directive?
            var target = window.event.target;
   
            $( target ).button('loading');
            
            setTimeout( function() {
                $( target ).button('reset');
            }, 5000 );
            
            Evaluator.evaluate($scope.session.getValue());

            if ($scope._assess()) {
                $scope.proceed();
            }
        }
    }
})