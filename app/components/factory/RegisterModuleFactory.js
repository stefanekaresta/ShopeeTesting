
angular
    .module('altairApp')
    .factory('RegisterModuleFactory', function ($http, $q, $log, ServerConfig, USER_INFO, $cookies,SessionConstruct) {

        var userid = $cookies.get('userid');
        var adit = localStorage.getItem('data_user_employee');
        var data = JSON.parse(adit);
        var jwt = "Bearer" +' ' + data.token;
        var headers = {"Authorization": jwt};

        var service = {};

        var response = {
            success: false,
            message: ''
        };


        var registeradmin = {
            method: 'POST',
            url: ServerConfig.production + '/apisolday/api/v1/registeradmin',
            headers: headers,
            data: ''
        };

        service.registeradminAPI = function (entity) {
            var deffered = $q.defer();
            registeradmin.data = entity;

            $http(registeradmin).success(function (data, status, headers) {
                SessionConstruct.init();
                deffered.resolve(data);
            }).error(function (data, status) {
                SessionConstruct.init();
                $log.error(status);
            });
            return deffered.promise;
        };

        var registereo = {
            method: 'POST',
            url: ServerConfig.production + '/apisolday/api/v1/registereo',
            headers: headers,
            data: ''
        };

        service.registereoAPI = function (entity) {
            var deffered = $q.defer();
            registereo.data = entity;

            $http(registereo).success(function (data, status, headers) {
                SessionConstruct.init();
                deffered.resolve(data);
            }).error(function (data, status) {
                SessionConstruct.init();
                $log.error(status);
            });
            return deffered.promise;
        };

        var registerots = {
            method: 'POST',
            url: ServerConfig.production + '/apisolday/api/v1/registerots',
            headers: headers,
            data: ''
        };

        service.registerotsAPI = function (entity) {
            var deffered = $q.defer();
            registerots.data = entity;

            $http(registerots).success(function (data, status, headers) {
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

