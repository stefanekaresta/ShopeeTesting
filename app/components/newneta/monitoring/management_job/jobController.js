angular
    .module('altairApp')
    .controller('jobCtrl', [
        '$stateParams',
        '$scope',
        'ReconstructMenu',
        function ($stateParams,$scope,ReconstructMenu) {
            ReconstructMenu.Init();
        }
    ]);