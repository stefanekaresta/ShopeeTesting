/*
 *  Altair Admin AngularJS
 */
;"use strict";

var altairApp = angular.module('altairApp', [
    'ui.router',
    'oc.lazyLoad',
    'ngSanitize',
    'ngRetina',
    'ncy-angular-breadcrumb',
    'ConsoleLogger',
    'ngTable',
    'angular-md5',
    'ngMap',
    'ngFileUpload',
    'ngCookies',
    'naif.base64',
    'fxpicklist',
    'ivh.treeview',
    'geolocation'
    // 'kendo.directives'
]);

altairApp.constant('variables', {
    header_main_height: 48,
    easing_swiftOut: [0.4, 0, 0.2, 1],
    bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
});


altairApp.constant('ServerConfig', {

    development: 'http://' + 'localhost' + '',
    production: 'http://' + 'localhost' + '',

});

altairApp.constant('ServerProcess', {

    development: 'http://' + '103.65.96.238::' + '',
    production: 'http://' + '103.65.96.238::' + '10510'

});

altairApp.constant('USER_INFO', {
    email: '',
    password: '',
    name:''
});

altairApp.config(function (ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        idAttribute: 'id',
        labelAttribute: 'label',
        childrenAttribute: 'children',
        selectedAttribute: 'selected',
        useCheckboxes: true,
        disableCheckboxSelectionPropagation: true,
        expandToDepth: 2,
        indeterminateAttribute: '__ivhTreeviewIndeterminate',
        expandedAttribute: '__ivhTreeviewExpanded',
        defaultSelectedState: true,
        validate: false,
        twistieExpandedTpl: '(-)',
        twistieCollapsedTpl: '(+)',
        twistieLeafTpl: 'o'

    });
});

altairApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'https://w.soundcloud.com/**'
    ]);
});

// breadcrumbs
altairApp.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: 'restricted.dashboard',
        templateUrl: 'app/templates/breadcrumbs.tpl.html'
    });
});

altairApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

altairApp.factory('SecurityModuleFactory', function ($http, $q, $log, ServerConfig, USER_INFO, $cookies, SessionConstruct) {
    var service = {};

    var response = {
        success: false,
        message: ''
    };


    //LOGIN METHOD
    //-------------------------------------
    var login_request = {
        method: 'POST',
        // url:'http://103.65.96.238/apisolday/api/v1/login',
        url: ServerConfig.production + '/apisolday/api/v1/login',

        headers: {'content-type' : 'application/json'},
        data: USER_INFO
    };

    service.login = function (email, password) {
        var deffered = $q.defer();
         // $log.info("LOGIN FACTORY");
        USER_INFO.email = email;
        USER_INFO.password = password;
        //
        // console.log(login_request);
        $http(login_request).success(function (data, status, headers) {

            localStorage.setItem('data_user_employee', JSON.stringify(data));
            deffered.resolve(data);

            $cookies.put('name', data.account.username);

            // console.log("LOIGIN=>" +  $cookies.get('name'))
        }).error(function (data, status) {
            $log.error(status);
        });
        return deffered.promise;
    };
    /*
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

     };*/

    //GET MENU
    //-------------------------------------
    // url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/get/menu/',
    var menu_request = {
        method: 'GET',
        url: ServerConfig.production + ServerConfig.port_agitmodule_security + '/security/get/menu/',
        headers: {USERNAME: ''},
        params: {}
    };

    service.getMenu = function (username) {
        // console.log("get menuuuuu")
        var deffered = $q.defer();

        $cookies.put('username', username);
        var s = $cookies.get('username');


        menu_request.headers.USERNAME = username;

        $http(menu_request).success(function (data, status, headers) {
            deffered.resolve(data);

        }).error(function (data, status) {
            $log.error(status);
        });
        return deffered.promise;
    };

    return service;

});

altairApp.factory('CommonService', function () {
    var headInfo = [];
    return {
        SetData: function (key, data) {
            headInfo[key] = data;
        },
        GetData: function (key) {
            return headInfo[key];
        }
    }
});

altairApp.factory('ReconstructMenu', function (CommonService, $rootScope, $timeout, $log, $location, $state, $cookies, SessionConstruct) {

    return {
        Init: function () {
            $timeout(function () {
                try {

                    var test_data_service = CommonService.GetData('menuSideBar');
                    var menu = localStorage.getItem('menuSideBar');
                    var objMenu = JSON.parse(menu);
                    if (objMenu != null && objMenu != undefined) {
                        SessionConstruct.init();
                        $rootScope.$broadcast('menuSideBar', objMenu);
                    } else {
                        SessionConstruct.destroy();
                    }
                }
                catch (err) {
                    $log.error(err);

                }
            }, 500);
        }
    }
});

altairApp.factory('SessionConstruct', function (CommonService, $rootScope, $timeout, $log, $location, $state, $cookies, $window) {

    return {
        init: function () {
            $timeout(function () {
                try {

                    var now = new Date();
                    now.setMinutes(now.getMinutes() + 200);
                    //console.log("aa" + now)
                    $cookies.put('session_iserve', now);
                }
                catch (err) {
                    $log.error(err);

                }
            }, 500);
        },
        destroy: function () {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
            localStorage.clear();
            $location.path('/login');
            $state.go('login');
            // $timeout(function () {
            //     $window.location.reload();
            // }, 500);

        }
    }
});


altairApp.filter('unique', function () {
    return function (collection, primaryKey) { //no need for secondary key
        var output = [],
            keys = [];
        var splitKeys = primaryKey.split('.'); //split by period


        angular.forEach(collection, function (item) {
            var key = {};
            angular.copy(item, key);
            for (var i = 0; i < splitKeys.length; i++) {
                key = key[splitKeys[i]];    //the beauty of loosely typed js :)
            }

            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

altairApp.filter('customCurrency', function () {

    return function (input, symbol, place) {

        // Ensure that we are working with a number
        if (isNaN(input)) {
            return input;
        } else {

            // Check if optional parameters are passed, if not, use the defaults
            var symbol = symbol || 'EUROS';
            var place = place === undefined ? true : place;

            // Perform the operation to set the symbol in the right location
            if (place === true) {
                return symbol + input;
            } else {
                return input + symbol;
            }

        }
    }

});

altairApp.filter('comma2decimal', [
    function () { // should be altered to suit your needs
        return function (input) {
            var ret = (input) ? input.toString().trim().replace(",", ".") : null;
            return parseFloat(ret);
        };
    }]);

/* Run Block */
altairApp
    .run(['$rootScope', '$state', '$stateParams', '$http', '$window', '$timeout', 'variables', '$log', '$cookies', '$location', 'CommonService', 'SecurityModuleFactory', 'ReconstructMenu',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout, variables, $log, $cookies, $location, CommonService, SecurityModuleFactory, ReconstructMenu) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function () {
                //console.log("State Change Success")
                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                $timeout(function () {
                    $rootScope.pageLoading = false;
                    // reinitialize uikit components
                    //$.UIkit.init($('body'));
                    //$($window).resize();
                }, 300);

                $timeout(function () {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                    // wave effects
                    $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
                    $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);

                    // IE fixes
                    if (typeof window.isLteIE9 != 'undefined') {
                        $('svg,canvas,video').each(function () {
                            var $this = $(this),
                                height = $(this).attr('height');
                            if (height) {
                                $this.css('height', height);
                            }
                            if ($this.hasClass('peity')) {
                                $this.prev('span').peity()
                            }
                        });
                    }
                }, 600);
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, $scope) {
                var location = $location.url();
                //console.log("State cahnage start 222")
                if (location == '/login') {
                    //console.log('it is in new neta login path');
                } else {
                    //console.log("===?????/")
                    var isAuthenticated = $cookies.get('isAuthenticated');
                    $rootScope.returnToState = toState.url;
                    $rootScope.returnToStateParams = toParams.id;
                    //console.log("isAuthenticated+" + $cookies.get('isAuthenticated')
                    // console.log("bb" +$rootScope.returnToState);
                    // console.log("aa" + $rootScope.returnToStateParams);
                    if (isAuthenticated == 1) {
                       // console.log('authenticatred is 1');
                        //console.log("TESSSS")
                        $cookies.put('isAuthenticated', 2);
                        $location.path('/dashboard1');

                    } else if (isAuthenticated == 0) {
                        //console.log('authenticatred is 0');
                        $location.path('/login');
                    } else if (isAuthenticated == 2) {
                        // console.log("TESSSS===")
                       // console.log('isAuth is 2');
                        var menu_scope = '' + $rootScope.sections;
                        //console.log('menu_scope length : '+menu_scope.length);
                        if (menu_scope == 'undefined') {
                            //console.log('it is undefined, data : ' + JSON.stringify(menu_scope));
                            var success_login = function (data) {
                                //console.log('request menu success');
                                //console.log('username : '+$cookies.get('username'));
                                $timeout(function () {
                                    // ini harusnya bisa di broadcast cuma kagak tau kenapa kagak muncul menunya, hahahahaha......//TODO banget ini mah
                                    $rootScope.$broadcast('menuSideBar', data);
                                    CommonService.SetData('menuSideBar', data);

                                    //console.log("smentara diredirect ke dashboard 1 dulu");
                                    //$scope.$state = $state;
                                    //console.log('current state : '+$location.url());
                                    //$state.go('newneta.dashboar1');
                                }, 1);
                                //$rootScope.$broadcast('menuSideBar', data);

                            };
                            var error_login = function (data) {
                                console.log('request menu failed');
                            };

                            var user_info = $cookies.get('username');
                            //$log.info("user_info: " + user_info);
                            //console.log("masukkklllll222")
                            //console.log('username');
                            if (user_info != undefined && user_info != '') {
                                //console.log("masukkklllll")
                                //SecurityModuleFactory.getMenu(user_info).then(success_login, error_login);
                            } else {
                                $location.path('/login');
                            }

                        }
                        /**/
                    }
                }


                /*if ($rootScope.loggedInUser == null) {
                 $location.path("/newneta_login");
                 }*/

                // main search
                $rootScope.mainSearchActive = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if ($($window).width() < 1220) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if (!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }

            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get('./package.json').success(function (response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function () {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = ($rootScope.largeScreen) ? true : false;

            $rootScope.pageLoading = true;

            // wave effects
            $window.Waves.init();

        }
    ])
    .run([
        'PrintToConsole',
        function (PrintToConsole) {
            // app debug
            PrintToConsole.active = false;
        }
    ])
;

