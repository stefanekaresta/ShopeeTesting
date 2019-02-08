angular
    .module('altairApp')
    .controller('detailInCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, DetailInFactory,ReconstructMenu) {
        ReconstructMenu.Init();
        var vm = this;


        vm.testService = function() {
            //$log.info('Masuk ke testService');
            var tmp = {
                "size": 10,
                "page": 0,
                "recordId": "132",
                "recordName": null,
                "fieldName": null,
                "fieldType": null,
                "fieldTypeId": null
            };
            DetailInFactory.FileTypeDetalInputCustom(tmp)
                .then(function(data){
                    //$log.info('success, data : '+JSON.stringify(data));
                }, function(data){
                    //$log.info('error, data : '+data);
                });
        };

        vm.dtColumns = [
            DTColumnBuilder.newColumn('recordId', 'Record ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('fieldName', 'Field Name').withOption('searchable', true),
            DTColumnBuilder.newColumn('fieldType', 'Field Type').withOption('searchable', true),
            DTColumnBuilder.newColumn('fileTypeId', 'File Type ID').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(1).withTitle('recordId'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('fieldName'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('fieldType'),
            DTColumnDefBuilder.newColumnDef(4).withTitle('fileTypeId')
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
                        type: 'select',
                        bRegex: false,
                        values: ['1', '2','3']
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

            var f_recordId= $filter('filter')(columns, {data: 'recordId'})[0].search.value;
            var f_fieldName= $filter('filter')(columns, {data: 'fieldName'})[0].search.value;
            var f_fieldType= $filter('filter')(columns, {data: 'fieldType'})[0].search.value;
            var f_fileTypeId= $filter('filter')(columns, {data: 'fileTypeId'})[0].search.value;

            //$log.info('order : '+JSON.stringify(order));

            /*//$log.info('f_recordId : '+f_recordId);
            //$log.info('f_fieldName : '+f_fieldName);
            //$log.info('f_fieldType : '+f_fieldType);
            //$log.info('f_fileTypeId : '+f_fileTypeId);
            */
            var tmp = {
                "size": 10,
                "page": page,
                "recordId": f_recordId,
                "fieldName": f_fieldName,
                "fieldType": f_fieldType,
                "fieldTypeId": f_fileTypeId
            };

            DetailInFactory.FileTypeDetalInputCustom(tmp)
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

).factory('DetailInFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var file_type_detail_input_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/file_type_detail_input_custom',
            headers: {},
            params:{}
        };

        service.FileTypeDetalInputCustom = function(data) {
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