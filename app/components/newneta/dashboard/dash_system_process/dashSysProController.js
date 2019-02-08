angular
    .module('altairApp')
    .controller('appCtrl', [
        '$stateParams','$scope','ReconstructMenu','ActionProcess','$log','$window','refreshService',
        'show_file_queue_value_waiting', 'show_file_queue_value_finished','$timeout',
        'show_file_queue_value_processing', 'show_file_queue_value_all','variables','$state',
        function ($stateParams,$scope,ReconstructMenu,ActionProcess,$log,$window,refreshService,
                  show_file_queue_value_waiting, show_file_queue_value_finished,$timeout,
                  show_file_queue_value_processing, show_file_queue_value_all,variables,$state) {
            //----------------------------------------------------------------------------------------------------------
            ReconstructMenu.Init();
            //----------------------------------------------------------------------------------------------------------
            // init c3 donut
            $scope.file_queue_waiting = {
                barColor:'#c3824a',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut,
                data:0,
                dataPersen:'',
                dataList:[]
            };
            $scope.file_queue_finished = {
                barColor:'#4a8bc3',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut,
                data:0,
                dataPersen:'',
                dataList:[]
            };
            $scope.file_queue_processing = {
                barColor:'#8bc34a',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut,
                data:0,
                dataPersen:'',
                dataList:[]
            };
            $scope.file_queue_all = {
                barColor:'#c34a8b',
                scaleColor: false,
                trackColor: '#f5f5f5',
                lineWidth: 5,
                size: 110,
                easing: variables.bez_easing_swiftOut,
                data:0,
                dataPersen:'',
                dataList:[]
            };
            // init variable
            $scope.file_queue_temp = {
                waiting:0,
                finished:0,
                processing:0,
                all:0,
            };
            $scope.file_queue_temp.waiting = show_file_queue_value_waiting;
            $scope.file_queue_temp.finished = show_file_queue_value_finished;
            $scope.file_queue_temp.processing = show_file_queue_value_processing;
            $scope.file_queue_temp.all = show_file_queue_value_all;
            $scope.clock = new Date(); // initialise the time variable
            $scope.show = {
                file_queue_detail:false,
                file_queue_detail_info:false,
                main_dashboard:true
            };
            $scope.legendMessage = {
                waiting:{msg:'Jumlah file tunggu yang akan diproses pada batch selanjutnya'},
                finished:{msg:'Jumlah file yang telah selesai diproses'},
                processing:{msg:'Jumlah file yang sedang diproses dalam batch ini'},
                all:{msg:'Jumlah dari semua file dalam bulan in'}
            };
            $scope.dataList = [];
            //----------------------------------------------------------------------------------------------------------
            // init c3 chart
            var memory_monitoring_id = '#memory_monitoring';
            var cpu_monitoring_id = '#cpu_monitoring';
            var memory_monitoring_stacked = c3.generate({
                bindto: memory_monitoring_id,
                data: {
                    x: 'x',
                    columns: [
                        ['x'],
                        ['freePhysical'],
                        ['totalPhysical'],
                        ['freeSwap'],
                        ['totalSwap']
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%X'
                        }
                    }
                }
            });
            var cpu_monitoring_stacked = c3.generate({
                bindto: cpu_monitoring_id,
                data: {
                    x: 'x',
                    columns: [
                        ['x'],
                        ['processCPULoad'],
                        ['systemCPULoad']
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%X'
                        }
                    }
                }
            });
            //----------------------------------------------------------------------------------------------------------
            // destroy all
            $($window).on('debouncedresize', [
                    memory_monitoring_stacked.resize(),
                    cpu_monitoring_stacked.resize()
                ]);
            $scope.$on('$destroy', function () {
                //$log.info('on destroy');
                $($window).off('debouncedresize', [
                    memory_monitoring_stacked.resize(),
                    cpu_monitoring_stacked.resize()
                ]);
                memory_monitoring_stacked.destroy();
                cpu_monitoring_stacked.destroy();
                $timeout.cancel(refresh_sch); // --> to destroy scheduling refresh for the dashboard
            });
            //----------------------------------------------------------------------------------------------------------
            // refresh function
            var success_refresh_w = function(data) {
                $scope.file_queue_temp.waiting = data;
                $scope.file_queue_waiting.data = $scope.file_queue_temp.waiting;
                $scope.file_queue_waiting.dataPersen = ''+(($scope.file_queue_temp.waiting*100)/($scope.file_queue_temp.processing+$scope.file_queue_temp.waiting));
            };
            var success_refresh_f = function(data) {
                $scope.file_queue_temp.finished = data;
                $scope.file_queue_finished.data = $scope.file_queue_temp.finished;
                $scope.file_queue_finished.dataPersen = ''+(($scope.file_queue_temp.finished*100)/$scope.file_queue_temp.all);
            };
            var success_refresh_p = function(data) {
                $scope.file_queue_temp.processing = data;
                $scope.file_queue_processing.data = $scope.file_queue_temp.processing;
                $scope.file_queue_processing.dataPersen = ''+(($scope.file_queue_temp.processing*100)/($scope.file_queue_temp.processing+$scope.file_queue_temp.waiting));
            };
            var success_refresh_a = function(data) {
                $scope.file_queue_temp.all = data;
                $scope.file_queue_all.data = $scope.file_queue_temp.all;
                $scope.file_queue_all.dataPersen = ''+((($scope.file_queue_temp.waiting+$scope.file_queue_temp.processing+$scope.file_queue_temp.finished)*100)/$scope.file_queue_temp.all);
            };
            var error_refresh = function(data) {
                $log.error('data_f : '+JSON.stringify(data));
            };
            // 1st init
            refreshService.refresh_waiting().then(success_refresh_w,error_refresh);
            refreshService.refresh_finish().then(success_refresh_f,error_refresh);
            refreshService.refresh_processing().then(success_refresh_p,error_refresh);
            refreshService.refresh_all().then(success_refresh_a,error_refresh);
            // refresh schedule
            $scope.refreshInterval = 1000*10;
            var refresh = function() {
                $scope.clock = Date.now(); // get the current time
                refreshService.refresh_waiting().then(success_refresh_w,error_refresh);
                refreshService.refresh_finish().then(success_refresh_f,error_refresh);
                refreshService.refresh_processing().then(success_refresh_p,error_refresh);
                refreshService.refresh_all().then(success_refresh_a,error_refresh);
                ActionProcess.GetMemoryMonitoringLastReport().then(success_memory_monitoring,error_memory_monitoring);
                ActionProcess.GetCPUMonitoringLastReport().then(success_cpu_monitoring,error_cpu_monitoring);
                ActionProcess.GetListAgent().then(success_getdata_process,error_getdata_process);
                //$timeout(refresh, $scope.refreshInterval);
                refresh_sch;
            };
            var refresh_sch = $timeout(refresh, $scope.refreshInterval);
            refresh_sch;
            //----------------------------------------------------------------------------------------------------------
            var success_memory_monitoring = function(data) {
                /*memory_monitoring_stacked.unload({
                    ids: ['x','freePhysical','totalPhysical','freeSwap','totalSwap']
                });*/
                memory_monitoring_stacked.load({
                    columns: [
                        data.axis,
                        data.freePhysical,
                        data.totalPhysical,
                        data.freeSwap,
                        data.totalSwap
                    ]
                });

            };
            var error_memory_monitoring = function(data) {
                $log.error('error get data'+data,data);
            };
            ActionProcess.GetMemoryMonitoringLastReport().then(success_memory_monitoring,error_memory_monitoring);
            //----------------------------------------------------------------------------------------------------------
            var success_cpu_monitoring = function(data) {
                /*cpu_monitoring_stacked.unload({
                    ids: ['x','processCPULoad','systemCPULoad']
                });*/
                cpu_monitoring_stacked.load({
                    columns: [
                        data.axis,
                        data.processCPULoad,
                        data.systemCPULoad
                    ]
                });

            };
            var error_cpu_monitoring = function(data) {
                $log.error('error get data'+data,data);
            };
            ActionProcess.GetCPUMonitoringLastReport().then(success_cpu_monitoring,error_cpu_monitoring);
            //----------------------------------------------------------------------------------------------------------
            var success_dash_storage_info_custom = function (result) {
                ////$log.info('success, data : '+JSON.stringify(result));
                var in_total = result.in_total;
                var in_free = result.in_free;
                var app_total = result.app_total;
                var app_free = result.app_free;
                var db_total = result.db_total;
                var db_free = result.db_free;

                $scope.disk_usage_list = [
                    {
                        id: '1',
                        title: 'I/O (Available Space)',
                        count: in_free,
                        count_total: in_total,
                        chart_data: [ in_free+'/'+in_total ],
                        chart_options: {
                            height: 24,
                            width: 24,
                            fill: ["#c3824a", "#eee"]
                        }
                    },
                    {
                        id: '2',
                        title: 'Application (Available Space)',
                        count: app_free,
                        count_total: app_total,
                        chart_data: [ app_free+'/'+app_total ],
                        chart_options: {
                            height: 24,
                            width: 24,
                            fill: ["#4a8bc3", "#eee"]
                        }
                    },
                    {
                        id: '3',
                        title: 'Database (Available Space)',
                        count: db_free,
                        count_total: db_total,
                        chart_data: [ db_free+'/'+db_total ],
                        chart_options: {
                            height: 24,
                            width: 24,
                            fill: ["#8bc34a", "#eee"]
                        }
                    }
                ];

            }
            var error_dash_storage_info_custom = function (data) {
                //$log.info('error, data : '+data);
            }
            ActionProcess.StorageInfoCustom().then(success_dash_storage_info_custom, error_dash_storage_info_custom);
            //----------------------------------------------------------------------------------------------------------
            var success_getdata_process = function(data) {
                $scope.dataList = data;
            };
            var error_getdata_process = function(data) {
                $log.error('error get data'+data,data);
            };
            ActionProcess.GetListAgent().then(success_getdata_process,error_getdata_process);
            //----------------------------------------------------------------------------------------------------------
            $scope.getDetailData = function(action) {
                ////$log.info('goto : '+action+" detail page");
                $state.go('newneta.detail',{'action':action});
            };
            //----------------------------------------------------------------------------------------------------------



        }
    ])
    .factory('ActionProcess', function($timeout,$log,$http,ServerConfig,$q){
        var service = {};

        var agent_process = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/agent/list_agent',
            headers: {}
        };

        service.GetListAgent = function() {
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

        var storage_info_custom = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/storage_info_custom',
            headers: {},
            params:{}
        };

        service.StorageInfoCustom = function() {
            var deffered = $q.defer();
            $http(storage_info_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var monitoring_cpu_last_report = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/cpu_info_last_update',
            headers: {}
        };

        service.GetCPUMonitoringLastReport = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(monitoring_cpu_last_report).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var monitoring_memory_last_report = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/memory_info_last_update',
            headers: {}
        };

        service.GetMemoryMonitoringLastReport = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(monitoring_memory_last_report).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    })
    .factory('refreshService', function($timeout,$log,$http,ServerConfig,$q){
        var service = {};

        var param_config_ui_waiting = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Waiting',
            headers: {}
        };

        var param_config_ui_finish = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Finished',
            headers: {}
        };

        var param_config_ui_processing = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Processing',
            headers: {}
        };

        var param_config_ui_all = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=All',
            headers: {}
        };

        service.refresh_waiting = function(param) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(param_config_ui_waiting).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };
        service.refresh_finish = function(param) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(param_config_ui_finish).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };
        service.refresh_processing = function(param) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(param_config_ui_processing).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };
        service.refresh_all = function(param) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(param_config_ui_all).
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