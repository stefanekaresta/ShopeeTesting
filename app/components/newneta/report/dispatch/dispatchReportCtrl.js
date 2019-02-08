angular
    .module('altairApp')
    .controller('dispatchReportingCtrl',[
        '$compile',
        '$scope',
        '$timeout',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnBuilder',
        'DTColumnDefBuilder',
        '$log',
        'ngTableParams',
        '$filter',
        'DispatchReportingFactory',
        'ReconstructMenu',
        function ($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
                  DTColumnDefBuilder, $log,ngTableParams, $filter, DispatchReportingFactory,ReconstructMenu) {
            ReconstructMenu.Init();
            var dispatchreport = this;
            $scope.notification = {
                select:true,
                mainTable:false,
                errorMsg: false,
                viewDetail:false
            };


            dispatchreport.dtColumns = [
                DTColumnBuilder.newColumn('filenameInput', 'File Name Input').withOption('searchable', true),
                DTColumnBuilder.newColumn('stepName', 'Step Name').withOption('searchable', true),
                //  DTColumnBuilder.newColumn('checksum', 'Checksum').withOption('searchable', true),
                DTColumnBuilder.newColumn('fileSize', 'File Size').withOption('searchable', true),
                // DTColumnBuilder.newColumn('elapsedTime', 'Elapsed Time').withOption('searchable', true)
            ];

            dispatchreport.dtInstance = {};
            $scope.dataResult=[];

            dispatchreport.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withTitle('filenameInput'),
                DTColumnDefBuilder.newColumnDef(1).withTitle('stepName'),
                //DTColumnDefBuilder.newColumnDef(2).withTitle('checksum'),
                DTColumnDefBuilder.newColumnDef(3).withTitle('fileSize'),
                //DTColumnDefBuilder.newColumnDef(4).withTitle('elapsedTime')
            ];
            dispatchreport.dtOptions = DTOptionsBuilder
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

                //$log.info('order : '+JSON.stringify(order));

                /*//$log.info('f_recordId : '+f_recordId);
                 //$log.info('f_fieldName : '+f_fieldName);
                 //$log.info('f_fieldType : '+f_fieldType);
                 //$log.info('f_fileTypeId : '+f_fileTypeId);
                 */
                var tmp = {
                    "size": 10,
                    "page": page,
                    "filenameInput": f_filenameInput
                };

                DispatchReportingFactory.DispatchReportCustom(tmp)
                    .then(function(data){
                        //$log.info('success, data dasdadsada : '+JSON.stringify(data));
                        //$log.info('success, data dasdadsada : '+JSON.stringify(data.data));
                        $scope.dataResult=data.data;
                        data.draw = draw;
                        data.recordsFiltered = data.recordsTotal;
                        ////$log.info('data.recordsTotal : '+data.recordsTotal);
                        ////$log.info('data.recordsFiltered : '+data.recordsFiltered);
                        fnCallback(data);
                    }, function(data){
                        //$log.info('error, data : '+data);
                    });


            }

            $scope.generateReport = function(){

                //$log.info('masuk generate report');
                var blob = new Blob([document.getElementById('exportable').innerHTML], {
                   // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    type: "application/vnd.ms-excel;charset=charset=utf-8"
                });
                saveAs(blob, "Dispatch Report.xls");
            };


            var listDataRep = $scope.listDataRep = [
                'Filename','Step Name','Status'
            ];
        }
   ] ).factory('DispatchReportingFactory', function($http,$q, $log,ServerConfig) {

    var service = {};

    var dispatch_report_custom = {
        method: 'POST',
        url: ServerConfig.production + '/neta/wifiid/search/dispatch_report_custom',
        headers: {},
        params:{}
    };

    service.DispatchReportCustom = function(data) {
        var deffered = $q.defer();

        dispatch_report_custom.data = data;

        $http(dispatch_report_custom).
        success(function(data,status,headers) {
            //$log.info('service 1 : '+JSON.stringify(data));

            //$log.info('service 2 : '+JSON.stringify(data.data));

            deffered.resolve(data);
        }).error(function(data,status){
            $log.error(status);
        });
        return deffered.promise;
    };

    return service;
});