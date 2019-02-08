angular
    .module('altairApp')
    .controller('filteringReportCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, FilteringReportFactory,ReconstructMenu) {
        ReconstructMenu.Init();
        var vm = this;

        vm.dtColumns = [
            DTColumnBuilder.newColumn('filenameInput', 'File Name Input').withOption('searchable', true),
            DTColumnBuilder.newColumn('filenameOutput', 'File Name Output').withOption('searchable', true),
            DTColumnBuilder.newColumn('stepName', 'Step Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('fileOutputId', 'File Output ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('filterId', 'Filter ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('filteringType', 'Filter Type').withOption('searchable', true),
            DTColumnBuilder.newColumn('numOfFiltered', 'Number Of Filtered').withOption('searchable', true),
            DTColumnBuilder.newColumn('elapsedTime', 'Elapsed Time').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('filenameInput'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('filenameOutput'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('fileOutputId'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('filterId'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('filteringType')
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

            var f_filenameInput= $filter('filter')(columns, {data: 'filenameInput'})[0].search.value;
            var f_filenameOutput= $filter('filter')(columns, {data: 'filenameOutput'})[0].search.value;
            var f_fileOutputId= $filter('filter')(columns, {data: 'fileOutputId'})[0].search.value;
            var f_filterId= $filter('filter')(columns, {data: 'filterId'})[0].search.value;
            var f_filteringType= $filter('filter')(columns, {data: 'filteringType'})[0].search.value;

            ////$log.info('order : '+JSON.stringify(order));

            /*//$log.info('f_recordId : '+f_recordId);
             //$log.info('f_fieldName : '+f_fieldName);
             //$log.info('f_fieldType : '+f_fieldType);
             //$log.info('f_fileTypeId : '+f_fileTypeId);
             */
            var tmp = {
                "size": 10,
                "page": page,
                "filenameInput": f_filenameInput,
                "filenameOutput": f_filenameOutput,
                "fileOutputId": f_fileOutputId,
                "filterId": f_filterId,
                "filteringType": f_filteringType
            };

            FilteringReportFactory.FilteringReportCustom(tmp)
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

).factory('FilteringReportFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var filtering_report_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/filtering_report_custom',
            headers: {},
            params:{}
        };

        service.FilteringReportCustom = function(data) {
            var deffered = $q.defer();

            filtering_report_custom.data = data;

            $http(filtering_report_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    });