angular
    .module('altairApp')
    .controller('createMenuCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,ReconstructMenu) {
        ReconstructMenu.Init();
        //$log.info('CREATE MENU CONTROLLER');
    }
)
;