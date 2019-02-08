angular
    .module('altairApp')
    .controller('outputReportCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, OutputReportFactory,ReconstructMenu) {
        ReconstructMenu.Init();
        var vm = this;

        vm.dtColumns = [
            DTColumnBuilder.newColumn('filenameInput', 'File Name Input').withOption('searchable', true),
            DTColumnBuilder.newColumn('filenameOutput', 'File Name Output').withOption('searchable', true),
            DTColumnBuilder.newColumn('stepName', 'Step Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('fileOutputId', 'File Output ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('delimiter', 'Delimeter').withOption('searchable', true),
            DTColumnBuilder.newColumn('controlFileName', 'Control File Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('directoryOutput', 'directoryOutput').withOption('searchable', true),
            DTColumnBuilder.newColumn('numOfOutput', 'Output Number').withOption('searchable', true),
            DTColumnBuilder.newColumn('filenameOutputSize', 'Output Size').withOption('searchable', true),
            DTColumnBuilder.newColumn('elapsedTime', 'Elapsed Time').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('filenameInput'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('filenameOutput'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('stepName'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('fileOutputId'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('delimiter'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('controlFileName'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('directoryOutput'),
            DTColumnDefBuilder.newColumnDef(7).withTitle('numOfOutput'),
            DTColumnDefBuilder.newColumnDef(8).withTitle('filenameOutputSize'),
            DTColumnDefBuilder.newColumnDef(9).withTitle('elapsedTime')
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
                "f_filenameOutput": f_filenameOutput,
                "fileOutputId": f_fileOutputId
            };

            OutputReportFactory.OutputReportCustom(tmp)
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

).factory('OutputReportFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var collection_report_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/output_report_custom',
            headers: {},
            params:{}
        };

        service.OutputReportCustom = function(data) {
            var deffered = $q.defer();

            collection_report_custom.data = data;

            $http(collection_report_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    });