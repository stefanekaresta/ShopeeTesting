angular
    .module('altairApp')
    .controller('processMonitoringCtrl', ProcessMonitoringCtrl)
    .factory('ProcessMonitoringFactory', ProcessMonitoringFactory);

function ProcessMonitoringCtrl($scope, $resource,
                               DTOptionsBuilder,DTColumnBuilder,
                               DTColumnDefBuilder, $log, $filter,
                               ProcessMonitoringFactory,ReconstructMenu) {
    ReconstructMenu.Init();
    var vm = this;
    //$log.info('Masuk ke ProcessMonitoringCtrl ');

    vm.dtColumns = [
        DTColumnBuilder.newColumn('fileId', 'File ID').withOption('searchable', true),
        DTColumnBuilder.newColumn('filenameInput', 'File Name Input').withOption('searchable', true),
        DTColumnBuilder.newColumn('stepName', 'Step Name').withOption('searchable', true),
        DTColumnBuilder.newColumn('state', 'State').withOption('searchable', true),
        DTColumnBuilder.newColumn('startTime', 'Start Time').withOption('searchable', true),
        DTColumnBuilder.newColumn('lStartTime', 'l Start Time').withOption('searchable', true),
        DTColumnBuilder.newColumn('endTime', 'End Time').withOption('searchable', true),
        DTColumnBuilder.newColumn('elapsedTime', 'Elapsed Time').withOption('searchable', true)
    ];

    vm.dtInstance = {};

    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).withTitle('fileId'),
        DTColumnDefBuilder.newColumnDef(1).withTitle('filenameInput'),
        DTColumnDefBuilder.newColumnDef(3).withTitle('stepName'),
        DTColumnDefBuilder.newColumnDef(4).withTitle('state'),
        DTColumnDefBuilder.newColumnDef(5).withTitle('startTime'),
        DTColumnDefBuilder.newColumnDef(6).withTitle('lStartTime'),
        DTColumnDefBuilder.newColumnDef(7).withTitle('endTime'),
        DTColumnDefBuilder.newColumnDef(8).withTitle('elapsedTime')
    ];


    vm.dtOptions = DTOptionsBuilder
        .newOptions()
        .withFnServerData(serverData)
        .withDataProp('data')
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('paging', true)
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

        var f_fileId= $filter('filter')(columns, {data: 'fileId'})[0].search.value;
        var f_filenameInput= $filter('filter')(columns, {data: 'filenameInput'})[0].search.value;
        var f_stepName= $filter('filter')(columns, {data: 'stepName'})[0].search.value;
        var f_state= $filter('filter')(columns, {data: 'state'})[0].search.value;

        ////$log.info('order : '+JSON.stringify(order));

        /*//$log.info('f_recordId : '+f_recordId);
         //$log.info('f_fieldName : '+f_fieldName);
         //$log.info('f_fieldType : '+f_fieldType);
         //$log.info('f_fileTypeId : '+f_fileTypeId);
         */
        var tmp = {
            "size": 10,
            "page": page,
            "fileId": f_fileId,
            "filenameInput": f_filenameInput,
            "stepName": f_stepName,
            "state": f_state
        };

        ProcessMonitoringFactory.ProcessMonitoringCustom(tmp)
            .then(function(data){
                //$log.info('Success');
                data.draw = draw;
                data.recordsFiltered = data.recordsTotal;
                fnCallback(data);
            }, function(data){
                //$log.info('error, data : '+data);
            });


    }
}

function ProcessMonitoringFactory($http,$q, $log,ServerConfig) {
    var service = {};

    var process_monitoring_custom = {
        method: 'POST',
        url: ServerConfig.production + '/neta/wifiid/search/process_monitoring_custom',
        headers: {},
        params:{}
    };

    service.ProcessMonitoringCustom= function(data) {
        var deffered = $q.defer();

        process_monitoring_custom.data = data;

        $http(process_monitoring_custom).
            success(function(data,status,headers) {
                deffered.resolve(data);
            }).error(function(data,status){
                $log.error(status);
            });
        return deffered.promise;
    };

    return service;
}