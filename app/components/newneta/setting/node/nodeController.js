angular
    .module('altairApp')
    .controller('nodeCtrl', [
        '$stateParams',
        '$scope',
        'ReconstructMenu',
        function ($stateParams,$scope,ReconstructMenu) {
            ReconstructMenu.Init();
        }
    ]);