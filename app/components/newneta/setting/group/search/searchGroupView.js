angular
    .module('altairApp')
    .controller('searchGroupCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,ReconstructMenu) {
        ReconstructMenu.Init();
        //$log.info('SEARCH GROUP CONTROLLER');
    }
)
;