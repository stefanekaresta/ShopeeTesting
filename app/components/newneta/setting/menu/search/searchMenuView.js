angular
    .module('altairApp')
    .controller('searchMenuCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,ReconstructMenu) {
        ReconstructMenu.Init();
        //$log.info('SEARCH MENU CONTROLLER');
    }
)
;