angular
    .module('altairApp')
    .controller('newnetaLoginCtrl',
        function ($scope, $rootScope, utils, $cookies, $log, $location, CommonService, SecurityModuleFactory, NotificationService, md5, SessionConstruct, $timeout, $window) {
            ////$log.info('masuk ke login newneta controller');
            $cookies.put('isAuthenticated', false);
            $scope.errormessage = undefined;
            $scope.login_username = '';
            $scope.login_password = '';
           // UIkit.modal.blockUI('<div class=\'uk-text-center\' id=\'mymodal2\'>Please Wait ... <button type="button" class=\'uk-modal-close uk-close\' ng-click=\'closed()\' style="float: right;"></button><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            $scope.registerFormActive = false;
            $scope.$on('someEvent', function (event, mass) {
                ////console.log(mass)
            });


            $scope.closed = function () {
                UIkit.modal("#mymodal2").hide()
            };

            $scope.loginButton = function () {

                if ($scope.login_username == undefined || $scope.login_username == "") {
                    // $scope.errormessage="Username is required";
                    NotificationService.setWarningMessage("Username is required");
                } else {
                    if ($scope.login_password == undefined || $scope.login_password == "") {
                        NotificationService.setWarningMessage("Password is required");
                    } else {
                        // var pass = md5.createHash($scope.login_password);
                        var pass = $scope.login_password;
                        var success_login = function (data) {
                        // console.log("izuk" + JSON.stringify(data))
                            if(data.success == true){
                                var token = data.token;
                                var decoded = jwt_decode(token);
                                $scope.roles = decoded.roles;
                                // console.log("hasildecoded" + JSON.stringify(decoded));
                                // console.log("ivanlogheader" + JSON.stringify(data));
                                // console.log("rolesuser" + JSON.stringify($scope.roles) )

                                localStorage.setItem('roles', JSON.stringify($scope.roles));

                                if($scope.roles != "cus"){
                                    CommonService.SetData('menuSideBar', data);
                                    localStorage.setItem('menuSideBar', JSON.stringify(data));
                                    // console.log("ozil"+$rootScope.returnToState)

                                    SessionConstruct.init();
                                    $location.path('/dashboard1');


                                    localStorage.setItem('data_user_employee', JSON.stringify(data));
                                    $cookies.put('isAuthenticated', 1);
                                    $cookies.put('username', $scope.login_username);

                                }
                                else{
                                    NotificationService.setWarningMessage("Not Allowed");
                                }
                            }
                            else{
                                NotificationService.setWarningMessage(data.message);
                            }


                        };

                        var error_login = function (data) {
                            //$log.info('LOGIN_ERROR');
                        };

                        SecurityModuleFactory.login($scope.login_username, pass).then(success_login, error_login);

                    }
                }


            };


            $scope.loginButton1 = function () {
                //console.log("ozil"+$rootScope.returnToState)
                if ($rootScope.returnToState == "/asset/management/:id") {
                    //alert("masuk")

                    //console.log("parameter" + $rootScope.returnToStateParams )
                    // $location.path('/dashboard1');
                    $location.path("/asset/management/" + $rootScope.returnToStateParams);
                    // console.log("link" + "/asset/management/" + $rootScope.returnToStateParams)
                } else {
                    //redirect all others after login to /rooms
                    //$location.path('/rooms');
                    $location.path('/dashboard1');

                }
            };
            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function () {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function () {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function () {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function () {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            $scope.loginHelp = function ($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card, undefined, login_help_show, undefined);
            };

            $scope.backToLogin = function ($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card, undefined, login_form_show, undefined);
            };

            $scope.registerForm = function ($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card, undefined, register_form_show, undefined);
            };

            $scope.passwordReset = function ($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card, undefined, password_reset_show, undefined);
            };

        }
    );