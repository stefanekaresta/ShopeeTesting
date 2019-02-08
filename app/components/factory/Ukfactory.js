angular
    .module('altairApp')
    .factory('Ukfactory', function ($http, $q, $log, ServerConfig, USER_INFO,SessionConstruct) {
            var service = {};

            var response = {
                success: false,
                message: ''
            };

            var headers = {"TOKEN-ID": "000", "SERIES-ID": "000", "USERNAME": "sample"};

            var urlinsertmapping = {
                method: 'POST',
                url: ServerConfig.production + ServerConfig.port_agitmodule_assignment + '/assignment/insertMapping',
                data: '',
                headers: headers
            };
            var urlsearchMapping = {
                method: 'POST',
                url: ServerConfig.production + ServerConfig.port_agitmodule_assignment + '/assignment/searchmapping',
                data: '',
                headers: headers
            };
            var urlDownloadQrcode = {
                method: 'POST',
                url: ServerConfig.production + ServerConfig.port_agitmodule_assignment + '/assignment/downloadPDF',
                data: '',
                headers: headers
            };


            service.downloadQrcode = function (entity) {
                var deffered = $q.defer();
                var objd = {
                    "mappingid": entity
                };
                urlDownloadQrcode.data = objd;
                $http(urlDownloadQrcode)
                    .success(function (data, status, headers) {
                        SessionConstruct.init();
                        deffered.resolve(status);
                    }).error(function (data, status) {
                    SessionConstruct.init();
                    $log.error(status);
                });

                return deffered.promise;

            };

            service.searchmapping = function (entity) {
                var deffered = $q.defer();
                urlsearchMapping.data = entity;
                //console.log(JSON.stringify(urlsearchMapping));
                $http(urlsearchMapping)
                    .success(function (data, status, headers) {
                        SessionConstruct.init();
                        deffered.resolve(data);
                        //console.log(data);
                    }).error(function (data, status) {
                    SessionConstruct.init();
                    $log.error(status);
                });

                return deffered.promise;
            };


            service.insertmapping = function (entity) {
                var deffered = $q.defer();
                var obj = {
                    customerid: entity.customerid,
                    customername: entity.customername,
                    siteid: entity.siteid,
                    sitename: entity.sitename,
                    lotitude: entity.lotitude,
                    longitude: entity.longitude,
                    maxradius: entity.maxradius,
                    "detailmapping": entity.detaillist
                };
                urlinsertmapping.data = obj;
                //console.log(JSON.stringify(urlinsertmapping));
                //console.log("INI DIKIRIM KE BELAKANG" + entity.detaillist);

                $http(urlinsertmapping)
                    .success(function (data, status, headers) {
                        SessionConstruct.init();
                        deffered.resolve(data);
                        //console.log(status);
                    }).error(function (data, status) {
                    SessionConstruct.init();
                    $log.error(status);
                });
                return deffered.promise;

            };

            var detail_mapping = {
                method: 'POST',
                url: ServerConfig.production + ServerConfig.port_agitmodule_assignment + '/assignment/viewDetailMapping',
                params: {prmUser: ''},
                headers: headers
            };

            service.viewDetailMapping = function (entity) {
                var deffered = $q.defer();

                detail_mapping.params.prmUser = entity;
                //console.log(JSON.stringify(detail_mapping));
                $http(detail_mapping).success(function (data, status, headers) {
                    SessionConstruct.init();
                    deffered.resolve(data);

                }).error(function (data, status) {
                    SessionConstruct.init();
                    $log.error(status);
                });
                return deffered.promise;
            };

            var update_mapping = {
                method: 'POST',
                url: ServerConfig.production + ServerConfig.port_agitmodule_assignment + '/assignment/updateMapping',
                data: '',
                headers: headers
            };

            service.updateMapping = function (entity) {
                var deffered = $q.defer();
                var obj = {
                    mappingid: entity.mappingid,
                    customerid: entity.customerid,
                    customername: entity.customername,
                    siteid: entity.siteid,
                    sitename: entity.sitename,
                    lotitude: entity.lotitude,
                    longitude: entity.longitude,
                    maxradius: entity.maxradius,
                    "detailmapping": entity.detaillist
                };
                update_mapping.data = obj;
                //console.log("KIRIM KE BELAKANG" + JSON.stringify(update_mapping));
                //update_mapping.params.prmUser=entity;

                $http(update_mapping).success(function (data, status, headers) {
                    SessionConstruct.init();
                    deffered.resolve(data);

                }).error(function (data, status) {
                    SessionConstruct.init();
                    $log.error(status);
                });
                return deffered.promise;
            };

            return service;

        }
    );
