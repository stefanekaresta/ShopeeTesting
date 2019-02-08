angular
    .module('altairApp')
    .controller('fileDetailInCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,
                                             ReconstructMenu,FileDetailInputProcess,$filter) {
        ReconstructMenu.Init();
        ////$log.info('File Detail Input Controller');

        $scope.dataListInputAll = [];
        $scope.selectedData = {};

        $scope.show = {
            main:true,
            detail:false,
            edit:false
        };

        var success_get_data = function(data) {
            $scope.dataListInputAll = data;
        };
        var error_get_data = function(data) {
            $log.error('data : '+data,data);
        };
        $timeout(function(){
            FileDetailInputProcess.GetListData().then(success_get_data,error_get_data);
        },500);

        $scope.showDetail = function(data) {
            $scope.selectedData = data;
            $scope.show.main = false;
            $scope.show.detail = true;
            $scope.show.edit = false;
        };

        $scope.back = function() {
            /*$scope.selectedData = {};
            $scope.show.main = true;
            $scope.show.detail = false;
            $scope.show.edit = false;*/
            RefreshData();
        };

        $scope.editDetail = function(data) {
            $scope.show.main = false;
            $scope.show.detail = false;
            $scope.show.edit = true;
            $scope.selectedData = data;
        };

        $scope.RemoveData = function(item) {
            var index = $scope.selectedData.path.indexOf(item);
            $scope.selectedData.path.splice(index, 1);
        };
        $scope.AddData = function(item) {
            if (angular.isUndefined($filter('filter')($scope.selectedData.path,item)[0])) {
                $scope.selectedData.path.push(item);
            } else {
                //$log.info('duplicate entry');
            }
        };

        $scope.saveData = function() {
            //$log.info('editted data -> '+JSON.stringify($scope.selectedData));
            var success_edit = function(data) {
                //$log.info('success edited data');
                // reload datalist
                FileDetailInputProcess.GetListData().then(success_get_data,error_get_data);
                // success notification
                UIkit.modal.alert('Update Success!');
                // refresh data
                RefreshData();
            };
            var error_edit = function(data) {
                $log.error('Error When update, message : '+JSON.stringify(data));
                UIkit.modal.alert('Update Error!');
            };
            FileDetailInputProcess.UpdateData($scope.selectedData).then(success_edit,error_edit);
        };

        function RefreshData() {
            $scope.selectedData = {};
            $scope.show.main = true;
            $scope.show.detail = false;
            $scope.show.edit = false;
        }

    }
)
    .factory('FileDetailInputProcess', function($timeout,$log,$http,ServerConfig,$q){
        var service = {};

        var agent_process = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/search/file_detail_input_all',
            headers: {}
        };
        service.GetListData = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(agent_process).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };


        var update_data = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/update/file_detail_input',
            data:{},
            headers: {}
        };
        service.UpdateData = function(data) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            update_data.data = data;
            $http(update_data).
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