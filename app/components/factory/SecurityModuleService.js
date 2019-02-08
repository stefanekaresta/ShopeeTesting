/**
 * Created by Hendra on 9/1/2016.
 */

/*

angular
    .module('altairApp')
    .factory('SecurityModuleFactory', function ($http,$q, $log,ServerConfig,USER_INFO) {
        var service = {};

        var response = {
            success: false,
            message: ''
        };


        //LOGIN METHOD
        //-------------------------------------
        var login_request = {
            method: 'POST',
            url: ServerConfig.production +ServerConfig.port_agitmodule_security + '/login',
            data: USER_INFO,
            headers: {"TOKEN-ID":"000","SERIES-ID":"000","OWNER-COMPANY-ID":"000"}
        };

        function Login(username,password) {
            var deffered = $q.defer();

            USER_INFO.username = username;
            USER_INFO.password = password;
            $http(login_request).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                    var rememberMeTime = 24800;
                    /!*SetCredentialsServer(username,password,data.grantedAuths, headers('TOKEN-ID'),
                        headers("SERIES-ID"),rememberMeTime,data.orgId);*!/

                }).error(function(data,status){
                    $log.error(status);
                });
        };
/!*
        function SetCredentialsServer(username, password, grantedAuths, tokenid, seriesid, rememberMeTime, orgId) {
            $cookieStore.put(SecurityToken.securityEncode('username'),SecurityToken.securityEncode(username));
            $cookieStore.put(SecurityToken.securityEncode('tokenid'),SecurityToken.securityEncode(SecurityToken.encodeKey(tokenid)));
            $cookieStore.put(SecurityToken.securityEncode('seriesid'),SecurityToken.securityEncode(seriesid));
            $cookieStore.put(SecurityToken.securityEncode('authdata'),SecurityToken.securityEncode(username + ':' + password));
            $cookieStore.put(SecurityToken.securityEncode('grantedAuths'),grantedAuths);
            $cookieStore.put(SecurityToken.securityEncode('isAuthenticated'),SecurityToken.securityEncode('true'));
            $cookieStore.put(SecurityToken.securityEncode('rememberMeTime'),SecurityToken.securityEncode(''+rememberMeTime));
            if (angular.isUndefined(orgId)) {

            } else if (orgId === 'null') {

            } else {
                $cookieStore.put(SecurityToken.securityEncode('orgid'),SecurityToken.securityEncode(orgId));
            }

        };*!/

        //GET MENU
        //-------------------------------------
        var menu_request = {
            method: 'GET',
            url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/get/menu/',
            headers: {USERNAME:''},
            params:{}
        };

        service.getMenu = function(username) {
            var deffered = $q.defer();

            menu_request.headers.USERNAME = username;

            $http(menu_request).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;

    });*/
