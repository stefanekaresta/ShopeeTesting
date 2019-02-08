angular
    .module('altairApp')
    .controller('detailOutCtrl',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,DTColumnBuilder,
             DTColumnDefBuilder, $log,ngTableParams, $filter, DetailOutFactory,ReconstructMenu) {
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
            DTColumnBuilder.newColumn('outputFileTypeId', 'Output File Type ID').withOption('searchable', true),
            DTColumnBuilder.newColumn('fieldSequence', 'Field Sequence').withOption('searchable', true),
            DTColumnBuilder.newColumn('fieldName', 'FieldName').withOption('searchable', true)
        ];

        vm.dtInstance = {};

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(1).withTitle('outputFileTypeId'),
            DTColumnDefBuilder.newColumnDef(2).withTitle('fieldSequence'),
            DTColumnDefBuilder.newColumnDef(3).withTitle('fieldName')
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
                    {},
                    {
                        type: 'text',
                        bRegex: true,
                        bSmart: true
                    }
                ]
            });

        function serverData(sSource, aoData, fnCallback, oSettings) {

            var draw = aoData[0].value;
            var columns = aoData[1].value;
            var order = aoData[2].value;
            var start = aoData[3].value;
            var length = aoData[4].value;

            var page = start/length;

            var f_outputFileTypeId= $filter('filter')(columns, {data: 'outputFileTypeId'})[0].search.value;
            var f_fieldName= $filter('filter')(columns, {data: 'fieldName'})[0].search.value;

            //$log.info('order : '+JSON.stringify(order));

            var tmp = {
                "size": 10,
                "page": page,
                "outputFileTypeId": f_outputFileTypeId,
                "fieldName": f_fieldName,
            };

            DetailOutFactory.FileTypeDetalOutputCustom(tmp)
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

).factory('DetailOutFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var file_type_detail_output_custom = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/file_type_detail_output_custom',
            headers: {},
            params:{}
        };

        service.FileTypeDetalOutputCustom = function(data) {
            var deffered = $q.defer();

            file_type_detail_output_custom.data = data;

            $http(file_type_detail_output_custom).
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