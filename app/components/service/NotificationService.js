/**
 * Created by Hendra on 9/7/2016.
 */

angular
    .module('altairApp')
    .service('NotificationService', function ($http, $q, $log, ServerConfig, USER_INFO) {
        var service = {};


        service.setInfoMessage = function (message) {
            UIkit.notify("<i class='uk-icon-info uk-icon-medium' style='color:#fff; margin-right:10px;'></i>  " + message, {
                status: 'info',
                pos: 'top-right'
            });
        };

        service.setWarningMessage = function (message) {
            UIkit.notify("<i class='uk-icon-warning uk-icon-medium' style='color:#fff; margin-right:10px;'></i>  " + message, {
                status: 'warning',
                pos: 'top-right'
            });
        };
        service.setErrorMessage = function (message) {
            UIkit.notify("<i class='uk-icon-minus-circle uk-icon-medium' style='color:#fff; margin-right:10px;'></i>  " + message, {
                status: 'danger',
                pos: 'top-right'
            });
        };

        service.setSuccessMessage = function (message) {
            UIkit.notify("<i class='uk-icon-thumbs-up uk-icon-medium' style='color:#fff; margin-right:10px;'></i>  " + message, {
                status: 'success',
                pos: 'top-right'
            });
        };
        return service;

    });
