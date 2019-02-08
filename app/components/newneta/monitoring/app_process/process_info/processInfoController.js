angular
    .module('altairApp')
    .controller('agentMonitoringCtrl', [
        '$stateParams',
        '$scope',
        '$rootScope',
        'ReconstructMenu',
        'ActionProcess',
        '$log',
        '$window',
        '$cookies',
        '$state',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnBuilder',
        'DTColumnDefBuilder',
        '$filter',
        '$compile',
        '$http',
        'ServerProcess',
        '$interval',
        '$timeout',
        '$cookies',
        function ($stateParams,$scope,$rootScope,ReconstructMenu,ActionProcess,$log,$window,$cookies,$state,$resource,
                  DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$filter,$compile,$http,ServerProcess,$interval,$timeout,$cookies) {
            ReconstructMenu.Init();
            //----------------------------------------------------------------------------------------------------------
            ////$log.info('Monitoring detail');
            $scope.action = $stateParams.action;
            $scope.agentId = $stateParams.agentId;
            //console.log('$scope.agentId : '+$scope.agentId);
            //$scope.action = 'AGENT_REPROCESS';
            ////$log.info('action : '+$scope.action);
            $scope.listData = [];
            //----------------------------------------------------------------------------------------------------------
            if ($scope.action == 'AGENT_REPROCESS') {
                $timeout(function() {
                    console.log('after timeout, agentId : '+$scope.agentId);
                    reprocessData($scope.agentId);
                }, 500);

            } else if ($scope.action == 'AGENT_REOUTPUT') {
                $timeout(function() {
                    console.log('after timeout');
                    reOutputData($scope.agentId);
                }, 500);

            } else if ($scope.action == 'AGENT_REDISPATCH') {
                $timeout(function() {
                    console.log('after timeout');
                    reDispatchData($scope.agentId);
                }, 500);

            }
            //----------------------------------------------------------------------------------------------------------
            function reprocessData(data) {
                ////$log.info('reprocessData, with agentId : '+$scope.agentId);
                var list_runnig_reprocess = {
                    method: 'GET',
                    url: ServerProcess.production + '/neta/process/get_running_reprocess_agentid',
                    headers: {},
                    params:{username:'',agentId:''}
                };
                list_runnig_reprocess.params.agentId = data;
                list_runnig_reprocess.params.username = $cookies.get('username');
                console.log(JSON.stringify(list_runnig_reprocess));
                $http(list_runnig_reprocess).
                    success(function(data,status,headers) {
                        $scope.listData = data;
                    }).error(function(data,status){
                        $log.error(status);
                    });
            }
            function reOutputData(data) {
                //$log.info('reOutputData');
                var list_runnig_reprocess = {
                    method: 'GET',
                    url: ServerProcess.production + '/neta/process/get_running_reprocess_output_agentid',
                    headers: {},
                    params:{username:'',agentId:''}
                };
                list_runnig_reprocess.params.agentId = data;
                list_runnig_reprocess.params.username = $cookies.get('username');
                console.log(JSON.stringify(list_runnig_reprocess));
                $http(list_runnig_reprocess).
                    success(function(data,status,headers) {
                        $scope.listData = data;
                    }).error(function(data,status){
                        $log.error(status);
                    });
            }
            function reDispatchData(data) {
                //$log.info('reDispatchData');
                var list_runnig_reprocess = {
                    method: 'GET',
                    url: ServerProcess.production + '/neta/process/get_running_reprocess_dispatch_agentid',
                    headers: {},
                    params:{username:'',agentId:''}
                };
                list_runnig_reprocess.params.agentId = data;
                list_runnig_reprocess.params.username = $cookies.get('username');
                console.log(JSON.stringify(list_runnig_reprocess));
                $http(list_runnig_reprocess).
                    success(function(data,status,headers) {
                        $scope.listData = data;
                    }).error(function(data,status){
                        $log.error(status);
                    });
            }
            //----------------------------------------------------------------------------------------------------------
            // autorefresh function
            var auto = $interval(function() {
                ////$log.info('refreshInterfal');
                if ($scope.action == 'AGENT_REPROCESS') {
                    reprocessData($scope.agentId);
                } else if ($scope.action == 'AGENT_REOUTPUT') {
                    reOutputData($scope.agentId);
                } else if ($scope.action == 'AGENT_REDISPATCH') {
                    reDispatchData($scope.agentId);
                }
            }, 1000);
            //----------------------------------------------------------------------------------------------------------
            // destroy function
            $scope.$on('$destroy', function () {
                $interval.cancel(auto);
            });
            //----------------------------------------------------------------------------------------------------------
        }
    ])
    .factory('ActionProcess', function($timeout,$log,$http,ServerConfig,$q,ServerProcess,$cookies){
        var service = {};

        var list_runnig_reprocess = {
            method: 'GET',
            url: ServerProcess.production + '/neta/process/get_running_reprocess',
            headers: {},
            params:{}
        };

        service.GetListRunningReprocess = function() {
            //$log.info('masuk ke services');
            var deffered = $q.defer();
            $http(list_runnig_reprocess).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var list_runnig_reprocess_agent = {
            method: 'GET',
            url: ServerProcess.production + '/neta/process/get_running_reprocess',
            headers: {},
            params:{agentId:''}
        };

        service.GetListRunningReprocessWithAgentId = function(agentid) {
            var deffered = $q.defer();
            list_runnig_reprocess_agent.params.agentId = agentid;
            $http(list_runnig_reprocess_agent).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    })
;