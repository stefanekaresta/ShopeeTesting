
angular
    .module('altairApp')
    .factory('ForeignManagementModuleFactory', function ($http, $q, $log, ServerConfig, USER_INFO, $cookies,SessionConstruct) {

        var service = {};

        var response = {
            success: false,
            message: ''
        };
        var getData = {
            method: 'GET',
            url: 'https://api.exchangeratesapi.io/latest?base=USD',
            data: ''
        };

        service.getDataCurrency = function (entity) {
            var deffered = $q.defer();
            getData.data = entity;

            $http(getData).success(function (data, status, headers) {
                SessionConstruct.init();
                deffered.resolve(data);
            }).error(function (data, status) {
                SessionConstruct.init();
                $log.error(status);
            });
            return deffered.promise;
        };

        return service;
    });

