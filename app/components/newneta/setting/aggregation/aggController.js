angular
    .module('altairApp')
    .controller('aggCtrl', [
        '$compile',
        '$scope',
        '$timeout',
        'DTOptionsBuilder',
        'DTColumnBuilder',
        'DTColumnDefBuilder',
        '$log',
        '$filter',
        'AggregationFactory',
        'ReconstructMenu',
        function ($compile, $scope, $timeout, DTOptionsBuilder,DTColumnBuilder,
                  DTColumnDefBuilder, $log, $filter, AggregationFactory,ReconstructMenu) {
            ReconstructMenu.Init();
            ////$log.info('Aggregation Controller');
            var vm = this;

            vm.dtColumns = [
                DTColumnBuilder.newColumn('aggId', 'Aggregation ID').withOption('searchable', true),
                DTColumnBuilder.newColumn('fileTypeId', 'File Type ID').withOption('searchable', true),
                DTColumnBuilder.newColumn('recordId', 'Record ID').withOption('searchable', true),
                DTColumnBuilder.newColumn('sortBy', 'Sort By').withOption('searchable', true),
                DTColumnBuilder.newColumn('datePattern', 'Date Pattern').withOption('searchable', true),
                DTColumnBuilder.newColumn('checkTime', 'Chect Time').withOption('searchable', true)
            ];

            vm.dtInstance = {};

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('aggId'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('fileTypeId'),
                DTColumnDefBuilder.newColumnDef(2).withTitle('recordId'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('sortBy'),
                DTColumnDefBuilder.newColumnDef(4).withTitle('datePattern'),
                DTColumnDefBuilder.newColumnDef(5).withTitle('checkTime')
            ];


            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withFnServerData(serverData)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('paging', true)
                //.withOption('rowCallback', rowCallback)
                .withPaginationType('numbers')
                .withDisplayLength(10)
                .withColumnFilter({
                    aoColumns: [
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        },
                        {
                            type: 'text',
                            bRegex: true,
                            bSmart: true
                        }
                    ]
                })
                .withDOM('<"top">t<i"bottom"p><"clear">')

            ;

            function serverData(sSource, aoData, fnCallback, oSettings) {

                var draw = aoData[0].value;
                var columns = aoData[1].value;
                var order = aoData[2].value;
                var start = aoData[3].value;
                var length = aoData[4].value;

                var page = start/length;

                var f_aggId= $filter('filter')(columns, {data: 'aggId'})[0].search.value;
                var f_fileTypeId= $filter('filter')(columns, {data: 'fileTypeId'})[0].search.value;
                var f_recordId= $filter('filter')(columns, {data: 'recordId'})[0].search.value;
                var f_sortBy= $filter('filter')(columns, {data: 'sortBy'})[0].search.value;
                var f_datePattern= $filter('filter')(columns, {data: 'datePattern'})[0].search.value;
                var f_checkTime= $filter('filter')(columns, {data: 'checkTime'})[0].search.value;

                //$log.info('order : '+JSON.stringify(order));

                /*//$log.info('f_recordId : '+f_recordId);
                 //$log.info('f_fieldName : '+f_fieldName);
                 //$log.info('f_fieldType : '+f_fieldType);
                 //$log.info('f_fileTypeId : '+f_fileTypeId);
                 */
                var tmp = {
                    "size": 10,
                    "page": page,
                    "aggId": f_aggId,
                    "fileTypeId": f_fileTypeId,
                    "recordId": f_recordId,
                    "sortBy": f_sortBy,
                    "datePattern": f_datePattern,
                    "checkTime": f_checkTime
                };

                AggregationFactory.AggregationRulesCustom(tmp)
                    .then(function(data){
                        ////$log.info('success, data : '+JSON.stringify(data));
                        data.draw = draw;
                        data.recordsFiltered = data.recordsTotal;
                        ////$log.info('data.recordsTotal : '+data.recordsTotal);
                        ////$log.info('data.recordsFiltered : '+data.recordsFiltered);
                        fnCallback(data);
                    }, function(data){
                        //$log.info('error, data : '+data);
                    });


            }

        }
    ])
    .factory('AggregationFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var aggregation_rules_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/aggregation_rules_custom',
            headers: {},
            params:{}
        };

        service.AggregationRulesCustom = function(data) {
            var deffered = $q.defer();

            aggregation_rules_custom.data = data;

            $http(aggregation_rules_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    });