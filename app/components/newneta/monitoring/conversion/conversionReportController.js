angular
    .module('altairApp')
    .controller('conversionReportCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, ConversionReportFactory,ReconstructMenu) {
        ReconstructMenu.Init();
        var vm = this;

        vm.dtColumns = [
            DTColumnBuilder.newColumn('fileName', 'File Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('stepName', 'Step Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('convertedRecord', 'Converted Record').withOption('searchable', true),
            DTColumnBuilder.newColumn('validRecord', 'Valid Record').withOption('searchable', true),
            DTColumnBuilder.newColumn('elapsedTime', 'Elapsed Time').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('fileName'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('stepName'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('convertedRecord'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('validRecord'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('elapsedTime')
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

            var f_fileName= $filter('filter')(columns, {data: 'fileName'})[0].search.value;
            var f_stepName= $filter('filter')(columns, {data: 'stepName'})[0].search.value;
            var f_elapsedTime= $filter('filter')(columns, {data: 'elapsedTime'})[0].search.value;

            ////$log.info('order : '+JSON.stringify(order));

            /*//$log.info('f_recordId : '+f_recordId);
             //$log.info('f_fieldName : '+f_fieldName);
             //$log.info('f_fieldType : '+f_fieldType);
             //$log.info('f_fileTypeId : '+f_fileTypeId);
             */
            var tmp = {
                "size": 10,
                "page": page,
                "fileName": f_fileName,
                "stepName": f_stepName,
                "elapsedTime": f_elapsedTime
            };

            ConversionReportFactory.ConversionReportCustom(tmp)
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

).factory('ConversionReportFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var conversion_report_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/conversion_report_custom',
            headers: {},
            params:{}
        };

        service.ConversionReportCustom = function(data) {
            var deffered = $q.defer();

            conversion_report_custom.data = data;

            $http(conversion_report_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    });