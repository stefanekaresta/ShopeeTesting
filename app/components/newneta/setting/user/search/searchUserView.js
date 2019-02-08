angular
    .module('altairApp')
    .controller('searchUserCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,ReconstructMenu,showuserFactory) {
            ReconstructMenu.Init();
            ////$log.info('File Detail Input Controller');

            $scope.dataListUser = [];

            $scope.show = {
                main:true,
                detail:false
            };

            $timeout(function(){
                var success_get_data = function(data) {
                    $scope.dataListUser = data;
                };
                var error_get_data = function(data) {
                    $log.error('data : '+data,data);
                };
                showuserFactory.GetListData().then(success_get_data,error_get_data);
            },500);

            $scope.showDetail = function(data) {
                $scope.selectedData = data;
                $scope.show.main = false;
                $scope.show.detail = true;
            };

            $scope.back = function() {
                $scope.selectedData = {};
                $scope.show.main = true;
                $scope.show.detail = false;
            }

        }
    )
    .factory('showuserFactory', function($timeout,$log,$http,ServerConfig,$q){
        var service = {};

        var searchUser = {
            method: 'GET',
           // url: ServerConfig.production + '/neta/wifiid/search/file_detail_input_all',
            url: ServerConfig.production + '/neta/wifiid/search/search_user',

            headers: {}
        };


        service.GetListData = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(searchUser).
            success(function(data,status,headers) {
                deffered.resolve(data);
                //$log.info('hasil = ',JSON.stringify(data));

            }).error(function(data,status){
                $log.error(status);
            });
            return deffered.promise;
        };
        return service;
    })
;