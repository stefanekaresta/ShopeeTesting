angular
    .module('altairApp')
    .controller('dashboard1Ctrl',function ($rootScope,$scope,$interval,$timeout,$compile,
                                           variables,$log,$filter,$window,
                                           CommonService, ReconstructMenu, $state) {
        //----------------------------------------------------------------------------------------------------------
       //$log.info("COnstruct Menu");
        ReconstructMenu.Init();
        //----------------------------------------------------------------------------------------------------------


    }
);