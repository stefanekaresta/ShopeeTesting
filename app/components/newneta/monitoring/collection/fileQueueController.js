angular
    .module('altairApp')
    .controller('fileQueueCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, FileQueueFactory,ReconstructMenu) {
        ReconstructMenu.Init();

        var vm = this;

        vm.dtColumns = [
            DTColumnBuilder.newColumn('filenameInput', 'File Name Input').withOption('searchable', true),
            DTColumnBuilder.newColumn('fileId', 'File ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('fileTypeId', 'File Type ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('checksum', 'Checksum').withOption('searchable', true),
            DTColumnBuilder.newColumn('nextJob', 'Next Job').withOption('searchable', true),
            DTColumnBuilder.newColumn('forSorting', 'For Sorting').withOption('searchable', true),
            DTColumnBuilder.newColumn('status', 'Status').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withTitle('filenameInput'),
            DTColumnDefBuilder.newColumnDef(1).withTitle('fileId'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('fileTypeId'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('checksum'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('nextJob'),
            DTColumnDefBuilder.newColumnDef(5).withTitle('forSorting'),
            DTColumnDefBuilder.newColumnDef(6).withTitle('status')
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
                    },{
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },{
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },{
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },{
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    },{
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
            var f_fileId= $filter('filter')(columns, {data: 'fileId'})[0].search.value;
            var f_fileTypeId= $filter('filter')(columns, {data: 'fileTypeId'})[0].search.value;
            var f_checksum= $filter('filter')(columns, {data: 'checksum'})[0].search.value;
            var f_nextJob= $filter('filter')(columns, {data: 'nextJob'})[0].search.value;
            var f_forSorting= $filter('filter')(columns, {data: 'forSorting'})[0].search.value;
            //var f_status= $filter('filter')(columns, {data: 'status'})[0].search.value;

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
                "fileId": f_fileId,
                "fileTypeId": f_fileTypeId,
                "checksum": f_checksum,
                "nextJob": f_nextJob,
                "forSorting": f_forSorting,
                "status": null
            };

            FileQueueFactory.FileQueueCustom(tmp)
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

).factory('FileQueueFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var file_type_detail_input_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/file_queue_custom',
            headers: {},
            params:{}
        };

        service.FileQueueCustom = function(data) {
            var deffered = $q.defer();

            file_type_detail_input_custom.data = data;

            $http(file_type_detail_input_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    });