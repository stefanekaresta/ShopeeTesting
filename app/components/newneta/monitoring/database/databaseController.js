angular
    .module('altairApp')
    .controller('databaseCtrl', [
        '$stateParams',
        '$scope','ReconstructMenu',
        function ($stateParams,$scope,ReconstructMenu) {
            ReconstructMenu.Init();
        }
    ]);