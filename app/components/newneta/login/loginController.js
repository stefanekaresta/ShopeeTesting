angular
    .module('altairApp')
    .controller('newnetaLoginCtrl',
        function ($scope,$rootScope,utils,$cookies,$log,$location,CommonService,SecurityModuleFactory,NotificationService) {
            ////$log.info('masuk ke login newneta controller');
            $cookies.put('isAuthenticated',false);

            $scope.login_username = '';
            $scope.login_password = '';

            $scope.registerFormActive = false;

            $scope.$on('someEvent', function(event, mass) {console.log(mass)});

            $scope.loginButton = function() {
                ////$log.info('Masuk ke Login Button');
                alert('aaa');
                $log.info("HALLO INI HENDRA")
                //$log.info("username: "+$scope.login_username);
                //$log.info("username: "+$scope.login_password);
                var success_login = function(data) {
                    ////$log.info('LOGIN_SUCCESS');
                    // update loggedInUser
                    $cookies.put('isAuthenticated',1);
                    $cookies.put('username',$scope.login_username);

                    CommonService.SetData('menuSideBar', data);
                    // redirect to dashboard
                    $location.path('/dashboard1');
                };
                var error_login = function(data) {
                    //$log.info('LOGIN_ERROR');
                    NotificationService.setErrorMessage("Username/Password incorrect");
                };
                //loginFactory.Login($scope.login_username,$scope.login_password).then(success_login,error_login);
               // SecurityModuleFactory.Login($scope.login_username,$scope.login_password).then(success_login,error_login);

                var success_menu=function(data){
                    //$log.info('LOGIN_SUCCESS: '+data);
                    CommonService.SetData('menuSideBar', data);
                    $cookies.put('isAuthenticated',1);
                    $cookies.put('username',$scope.login_username);
                    $location.path('/dashboard1');
                };

                SecurityModuleFactory.getMenu('hendrar').then(success_menu,error_login);

            };

            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function() {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function() {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function() {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function() {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            $scope.loginHelp = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,login_help_show,undefined);
            };

            $scope.backToLogin = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card,undefined,login_form_show,undefined);
            };

            $scope.registerForm = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card,undefined,register_form_show,undefined);
            };

            $scope.passwordReset = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,password_reset_show,undefined);
            };

        }
    )
;