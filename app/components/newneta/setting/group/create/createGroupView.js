angular
    .module('altairApp')
    .controller('createGroupCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,ReconstructMenu) {
        ReconstructMenu.Init();
        //$log.info('CREATE GROUP CONTROLLER');
    }
)
;