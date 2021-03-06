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


altairApp
    .factory('windowDimensions', [
        '$window',
        function($window) {
            return {
                height: function() {
                    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                },
                width: function() {
                    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                }
            }
        }
    ])
    .factory('utils', [
        function () {
            return {
                // Util for finding an object by its 'id' property among an array
                findByItemId: function findById(a, id) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].item_id == id) return a[i];
                    }
                    return null;
                },
                // serialize form
                serializeObject: function (form) {
                    var o = {};
                    var a = form.serializeArray();
                    $.each(a, function () {
                        if (o[this.name] !== undefined) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    });
                    return o;
                },
                // high density test
                isHighDensity: function () {
                    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
                },
                // touch device test
                isTouchDevice: function () {
                    return !!('ontouchstart' in window);
                },
                // local storage test
                lsTest: function () {
                    var test = 'test';
                    try {
                        localStorage.setItem(test, test);
                        localStorage.removeItem(test);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                // show/hide card
                card_show_hide: function (card, begin_callback, complete_callback, callback_element) {
                    $(card)
                        .velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 400,
                            easing: [0.4, 0, 0.2, 1],
                            // on begin callback
                            begin: function () {
                                if (typeof begin_callback !== 'undefined') {
                                    begin_callback(callback_element);
                                }
                            },
                            // on complete callback
                            complete: function () {
                                if (typeof complete_callback !== 'undefined') {
                                    complete_callback(callback_element);
                                }
                            }
                        })
                        .velocity('reverse');
                }
            };
        }]
    )
;

angular
    .module("ConsoleLogger", [])
    // router.ui debug
    // app.js (run section "PrintToConsole")
    .factory("PrintToConsole", [
        "$rootScope",
        function ($rootScope) {
            var handler = { active: false };
            handler.toggle = function () { handler.active = !handler.active; };

            if (handler.active) {
                console.log($state + ' = ' + $state.current.name);
                console.log($stateParams + '=' + $stateParams);
                console.log($state_full_url + '=' + $state.$current.url.source);
                console.log(Card_fullscreen + '=' + card_fullscreen);

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                    console.log("$viewContentLoading --- event, viewConfig");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                    console.log("$viewContentLoaded --- event");
                    console.log(arguments);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
                    console.log(arguments);
                });
            }

            return handler;
        }
    ])
;
altairApp
    .service('detectBrowser', [
        '$window',
        function($window) {
            // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
            return function() {
                var userAgent = $window.navigator.userAgent,
                    browsers  = {
                        chrome  : /chrome/i,
                        safari  : /safari/i,
                        firefox : /firefox/i,
                        ie      : /internet explorer/i
                    };

                for ( var key in browsers ) {
                    if ( browsers[key].test(userAgent) ) {
                        return key;
                    }
                }
                return 'unknown';
            }
        }
    ])
    .service('preloaders', [
        '$rootScope',
        '$timeout',
        'utils',
        function($rootScope,$timeout,utils) {
            $rootScope.content_preloader_show = function(style,container) {
                var $body = $('body');
                if(!$body.find('.content-preloader').length) {
                    var image_density = utils.isHighDensity() ? '@2x' : '' ;

                    var preloader_content = (typeof style !== 'undefined' && style == 'regular')
                        ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                        : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                    var thisContainer = (typeof container !== 'undefined') ? container : $body;

                    thisContainer.append('<div class="content-preloader">' + preloader_content + '</div>');
                    $timeout(function() {
                        $('.content-preloader').addClass('preloader-active');
                    });
                }
            };
            $rootScope.content_preloader_hide = function() {
                var $body = $('body');
                if($body.find('.content-preloader').length) {
                    // hide preloader
                    $('.content-preloader').removeClass('preloader-active');
                    // remove preloader
                    $timeout(function() {
                        $('.content-preloader').remove();
                    }, 500);
                }
            };

        }
    ])
;
/*
*  Altair Admin AngularJS
*  directives
*/
;'use strict';

altairApp
    // page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'Altair Admin';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).actual('width') : $(elem).actual('width')/2,
                                h = !utils.isHighDensity() ? $(elem).actual('height') : $(elem).actual('height')/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // hide sidebar
                            $rootScope.primarySidebarActive = false;
                            $rootScope.primarySidebarOpen = false;
                            // wait for dialog to fully hide
                            $timeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                        $(window).resize();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // check table row
    .directive('tableCheckAll', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $checkRow = $(elem).closest('table').find('.check_row');

                    $(elem)
                        .on('ifChecked',function() {
                            $checkRow.iCheck('check');
                        })
                        .on('ifUnchecked',function() {
                            $checkRow.iCheck('uncheck');
                        });

                }
            }
        }
    ])
    // table row check
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
    // dynamic form fields
    .directive('formDynamicFields', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);
                    // clone section
                    $this.on('click','.btnSectionClone', function(e) {
                        e.preventDefault();
                        var $this = $(this),
                            section_to_clone = $this.attr('data-section-clone'),
                            section_number = $(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added') ? parseInt($(section_to_clone).parent().children('[data-section-added]:last').attr('data-section-added')) + 1 : 1,
                            cloned_section = $(section_to_clone).clone();

                        cloned_section
                            .attr('data-section-added',section_number)
                            .removeAttr('id')
                            // inputs
                            .find('.md-input').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name');

                                $thisInput
                                    .val('')
                                    .attr('name',name ? name + '[s_'+section_number +':i_'+ index +']' : '[s_'+section_number +':i_'+ index +']')

                                //altair_md.update_input($thisInput);
                            })
                            .end()
                            // replace clone button with remove button
                            .find('.btnSectionClone').replaceWith('<a href="#" class="btnSectionRemove"><i class="material-icons md-24">&#xE872;</i></a>')
                            .end()
                            // clear checkboxes
                            .find('[data-md-icheck]:checkbox').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index,
                                    newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                $inputLabel.attr('for', newId);
                            })
                            .end()
                            // clear radio
                            .find('.dynamic_radio').each(function(index) {
                                var $this = $(this),
                                    thisIndex = index;

                                $this.find('[data-md-icheck]').each(function(index) {
                                    var $thisInput = $(this),
                                        name = $thisInput.attr('name'),
                                        id = $thisInput.attr('id'),
                                        $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                        newName = name ? name + '-s'+section_number +':cb'+ thisIndex +'' : '[s'+section_number +':cb'+ thisIndex,
                                        newId = id ? id + '-s'+section_number +':cb'+ index +'' : 's'+section_number +':cb'+ index;

                                    $thisInput
                                        .attr('name', newName)
                                        .attr('id', newId)
                                        .attr('data-parsley-multiple', newName)
                                        .removeAttr('data-parsley-id')
                                        .removeAttr('style').removeAttr('checked').unwrap().next('.iCheck-helper').remove();

                                    $inputLabel.attr('for', newId);
                                })
                            })
                            .end()
                            // switchery
                            .find('[data-switchery]').each(function(index) {
                                var $thisInput = $(this),
                                    name = $thisInput.attr('name'),
                                    id = $thisInput.attr('id'),
                                    $inputLabel = cloned_section.find('label[for="'+ id +'"]'),
                                    newName = name ? name + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index,
                                    newId = id ? id + '-s'+section_number +':sw'+ index +'' : 's'+section_number +':sw'+ index;

                                $thisInput
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeAttr('style').removeAttr('checked').next('.switchery').remove();

                                $inputLabel.attr('for', newId);

                            })
                            .end()
                            // selectize
                            .find('[data-md-selectize]').each(function(index) {
                            var $thisSelect = $(this),
                                name = $thisSelect.attr('name'),
                                id = $thisSelect.attr('id'),
                                orgSelect = $('#'+id),
                                newName = name ? name + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index,
                                newId = id ? id + '-s'+section_number +':sel'+ index +'' : 's'+section_number +':sel'+ index;

                            // destroy selectize
                            var selectize = orgSelect[0].selectize;
                            if(selectize) {
                                selectize.destroy();
                                orgSelect.val('').next('.selectize_fix').remove();
                                var clonedOptions = orgSelect.html();
                                altair_forms.select_elements(orgSelect.parent());

                                $thisSelect
                                    .html(clonedOptions)
                                    .attr('name', newName)
                                    .attr('id', newId)
                                    .removeClass('selectized')
                                    .next('.selectize-control').remove()
                                    .end()
                                    .next('.selectize_fix').remove();
                            }

                        });

                        $(section_to_clone).before(cloned_section);

                        var $newSection = $(section_to_clone).prev();

                        if($newSection.hasClass('form_section_separator')) {
                            $newSection.after('<hr class="form_hr">')
                        }

                        // reinitialize checkboxes
                        //altair_md.checkbox_radio($newSection.find('[data-md-icheck]'));
                        // reinitialize switches
                        //altair_forms.switches($newSection);
                        // reinitialize selectize
                        //altair_forms.select_elements($newSection);

                    });

                    // remove section
                    $this.on('click', '.btnSectionRemove', function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        $this
                            .closest('.form_section')
                            .next('hr').remove()
                            .end()
                            .remove();
                    })

                }
            }
        }
    ])
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }

                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function () {

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                       }
                    });

                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },290);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                },290);
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').on('click', 'li', function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h,
                                'left': mdCard_offset.left,
                                'top': mdCard_offset.top - body_scroll_top
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //altair_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                            // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // fullscren on card click
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    };
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // card toolbar progress
    .directive('cardProgress', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    var $this = $(el).children('.md-card-toolbar'),
                        bg_percent = parseInt(attrs.cardProgress);


                    function updateCard(percent) {
                        var bg_color_default = $this.attr('card-bg-default');

                        var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
                        if(!bg_color_default) {
                            $this.attr('card-bg-default',bg_color)
                        }

                        $this
                            .css({ 'background': '-moz-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': '-webkit-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': 'linear-gradient(to right,  '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'});


                        scope.cardPercentage = percent;
                    }

                    updateCard(bg_percent);

                    scope.$watch(function() {
                        return $(el).attr('card-progress')
                    }, function(newValue) {
                        updateCard(newValue);
                    });

                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                        return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                        return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        function (variables) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    $(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(elem).trigger('click');
                        });
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                       if($rootScope.pageLoaded) {
                           var children = parent_el.children(),
                               children_length = children.length;

                           $timeout(function() {
                               add_animation(children,children_length)
                           },560)

                       }
                    });

                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    strokeWidth: '=',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
    .directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }
    ])

;
altairApp
    .filter('multiSelectFilter', function () {
        return function (items, filterData) {
            if(filterData == undefined)
                return items;
            var keys = Object.keys(filterData);
            var filtered = [];
            var populate = true;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                populate = true;
                for(var j = 0; j < keys.length ; j++){
                    if(filterData[keys[j]] != undefined){
                        if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
                            populate = true;
                        } else {
                            populate = false;
                            break;
                        }
                    }
                }
                if(populate){
                    filtered.push(item);
                }
            }
            return filtered;
        };
    })
    .filter("jsonDate", function() {
        return function(x) {
            if(x) return new Date(x);
            else return null;
        };
    })
    .filter("momentDate", function() {
        return function(x,date_format_i,date_format_o) {
            if(x) {
                if(date_format_i) {
                    return moment(x, date_format_i).format(date_format_o)
                } else {
                    return moment(new Date(x)).format(date_format_o)
                }
            }
            else return null;
        };
    })
    .filter("initials", function() {
        return function(x) {
            if(x) {
                return x.split(' ').map(function (s) {
                    return s.charAt(0);
                }).join('');
            } else {
                return null;
            }
        };
    })
    .filter('reverseOrder', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
;
altairApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            //Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/', '/StockExchange')
                .otherwise('/StockExchange');

            $stateProvider
            // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/views/error.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })

                // -- NEWNETA WIFIID --
                // -- login state --
                .state("login", {
                    url: "/StockExchange",
                    templateUrl: 'app/components/digi/ApprovalManagement/StockExchange/StokExchange.html',
                    controller: 'digiAllcustomer',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/ApprovalManagement/StockExchange/StockExchangeController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ForeignModuleFactory.js',
                                'lazy_KendoUI',
                                'lazy_uikit',
                                'lazy_selectizeJS',
                            ], {serie: true});
                        }]
                    },
                })

                .state("register", {
                    url: "/register",
                    templateUrl: 'app/components/digi/register/registerView.html',
                    controller: 'registrationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/digi/register/registerController.js',
                                'app/components/factory/SecurityModuleService.js',
                                'app/components/service/NotificationService.js'
                            ]);
                        }]
                    }
                })
                .state("activation", {
                    url: "/activation",
                    templateUrl: 'app/components/digi/register/activationView.html',
                    controller: 'activationController',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/factory/EmployeeMasterDataModuleFactory.js',
                                'app/components/digi/register/activationController.js',
                                'app/components/factory/SecurityModuleService.js',
                                'app/components/service/NotificationService.js'
                            ]);
                        }]
                    }
                })
                /*
                 * ========================================================
                 * Manage by hendra
                 * */

                /*
                 * User Management
                 * */
                // -- digi state --
                .state("digi", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js',
                                'bower_components/jwt-decode-master/jwt-decode-master/build/jwt-decode.min.js'
                            ]);
                        }]
                    }
                })
                // -- digi user management --
                .state("digi.createuser", {
                    url: "/user/create",
                    templateUrl: 'app/components/digi/usermanagement/create/form-create-user.html',
                    controller: 'digiCreateUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/digi/usermanagement/create/createUserController.js',
                                'app/components/factory/AccessModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/factory/OrganisationModuleFactory.js',
                                'app/components/factory/IntegrationModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'lazy_KendoUI',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Create User'
                    },
                    ncyBreadcrumb: {
                        label: 'Create User'
                    }
                })
                .state("digi.searchuser", {
                    url: "/user/search",
                    templateUrl: 'app/components/digi/usermanagement/view/view-user.html',
                    controller: 'digiViewUserCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/usermanagement/view/ViewUserController.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ConfigurationModuleFactory.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Search User'
                    },
                    ncyBreadcrumb: {
                        label: 'Search User'
                    }
                }).state("digi.viewdetailuser", {
                url: "/user/view/detail",
                templateUrl: 'app/components/digi/usermanagement/view-detail/view-detail-user.html',
                controller: 'digiViewDetailUserCtrl',
                params: {
                    userId: '000',

                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'bower_components/angular-resource/angular-resource.min.js',
                            'app/components/digi/usermanagement/view-detail/ViewDetailUserController.js',
                            'app/components/factory/AccessModuleFactory.js',
                            'app/components/factory/ConfigurationModuleFactory.js',
                            'app/components/factory/OrganisationModuleFactory.js',
                            'app/components/factory/IntegrationModuleFactory.js',
                            'app/components/factory/UserManagementModuleFactory.js',
                            'lazy_KendoUI',
                            'app/components/service/NotificationService.js'
                        ], {serie: true});
                    }]
                },
                data: {
                    pageTitle: 'View Detail User'
                },
                ncyBreadcrumb: {
                    label: 'View Detail User'
                }
            }).state("digi.updateuser", {
                url: "/user/update",
                templateUrl: 'app/components/digi/usermanagement/update/form-update-user.html',
                controller: 'digiUpdateUserCtrl',
                params: {
                    userId: '000',
                    organizationId: '000',
                    organizationName: '000'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/components/digi/usermanagement/update/updateUserController.js',
                            'app/components/factory/AccessModuleFactory.js',
                            'app/components/factory/ConfigurationModuleFactory.js',
                            'app/components/factory/OrganisationModuleFactory.js',
                            'app/components/factory/IntegrationModuleFactory.js',
                            'app/components/factory/UserManagementModuleFactory.js',
                            'lazy_KendoUI',
                            'app/components/service/NotificationService.js'
                        ], {serie: true});
                    }]
                },
                data: {
                    pageTitle: 'Update User'
                },
                ncyBreadcrumb: {
                    label: 'Update User'
                }
            })

            //---------------------------menunya newsevent-----------
                .state("digi.insertnewsevent", {
                    url: "/newsevent/insert",
                    templateUrl: 'app/components/digi/newsevent/create/f_insert_newsevent.html',
                    //controller: 'ctrl_insert_newsevent',
                    controller: 'ctrl_insert_newsevent',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/newsevent/create/ctrl_insert_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Create News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Create News & Event'
                    }
                })

                .state("digi.updatenewsevent", {
                    url: "/newsevent/update",
                    templateUrl: 'app/components/digi/newsevent/update/f_update_newsevent.html',
                    controller: 'ctrl_update_newsevent',
                    params: {
                        newsEventId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ckeditor',
                                'app/components/digi/newsevent/update/ctrl_update_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/ConfigurationModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Update News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Update News & Event'
                    }
                })
                .state("digi.viewnewsevent", {
                    url: "/newsevent/view",
                    templateUrl: 'app/components/digi/newsevent/view/f_view_newsevent.html',
                    controller: 'ctrl_view_newsevent',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/view/ctrl_view_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Search News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'Search News & Event'
                    }
                })
                .state("digi.detailnewsevent", {
                    url: "/newsevent/detail",
                    templateUrl: 'app/components/digi/newsevent/view-detail/f_detail_newsevent.html',
                    controller: 'ctrl_detail_newsevent',
                    params: {
                        newsEventId: '000',
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/newsevent/view-detail/ctrl_detail_newsevent.js',
                                'app/components/factory/NewsEventModuleFactory.js',
                                'app/components/factory/UserManagementModuleFactory.js',
                                'app/components/service/NotificationService.js'
                            ], {serie: true});
                        }],
                    },
                    data: {
                        pageTitle: 'Detail News & Event'
                    },
                    ncyBreadcrumb: {
                        label: 'View News & Event Detail'
                    }
                })
                /*
                 * =======================================================
                 * ASSIGNMENT
                 * */
                // .state("digi.searchassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Search Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Search Assignment'
                //     }
                // })
                // .state("digi.createassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Create Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Create Assignment'
                //     }
                // }).state("digi.updateassignment", {
                //     url: "/assignment/search",
                //     templateUrl: 'app/components/digi/assignment/search/view-assignment.html',
                //     controller: 'digiViewAssignmentCtrl',
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'bower_components/angular-resource/angular-resource.min.js',
                //                 'lazy_datatables',
                //                 'app/components/digi/assignment/search/ViewAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'Update Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'Update Assignment'
                //     }
                // }).state("digi.viewdetailassignment", {
                //     url: "/assignment/view/details",
                //     templateUrl: 'app/components/digi/assignment/viewdetail/view-detail-assignment.html',
                //     controller: 'digiViewDetailAssignmentCtrl',
                //     params: {
                //         assignmentId: '000'
                //     },
                //     resolve: {
                //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                //             return $ocLazyLoad.load([
                //                 'app/components/digi/assignment/viewdetail/ViewDetailAssignmentController.js',
                //                 'app/components/factory/AssignmentModuleFactory.js',
                //                 'app/components/service/NotificationService.js'
                //             ], {serie: true});
                //         }],
                //     },
                //     data: {
                //         pageTitle: 'View Detail Assignment'
                //     },
                //     ncyBreadcrumb: {
                //         label: 'View Detail Assignment'
                //     }
                // })


                /*
                 * ========================================================
                 * END
                 * */
                // -- newneta state --
                .state("newneta", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js'
                            ]);
                        }]
                    }
                })
                .state("newneta.dashboard_sys_pro", {
                    url: "/dashboard_sys_pro",
                    templateUrl: 'app/components/newneta/dashboard/dash_system_process/dashSysProView.html',
                    controller: 'appCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_charts_c3',
                                'app/components/newneta/dashboard/dash_system_process/dashSysProController.js']);
                        }],
                        show_file_queue_value_waiting: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Waiting',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        show_file_queue_value_finished: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Finished',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        show_file_queue_value_processing: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Processing',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {

                                    return data.data;
                                });
                        },
                        show_file_queue_value_all: function ($http, ServerConfig) {
                            var param_config_ui = {
                                method: 'GET',
                                url: ServerConfig.production + '/neta/wifiid/dashboard/value/file_queue?param=Error',
                                headers: {}
                            };
                            return $http(param_config_ui)
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard System & Process'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })
                // dashboard1
                .state("newneta.dashboard1", {
                    url: "/dashboard1",
                    templateUrl: 'app/components/digi/dashboard/dashboard1/dashboard1View.html',
                    controller: 'dashboard1Ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_tablesorter',
                                'lazy_charts_c3',
                                'lazy_datatables',
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/dashboard/dashboard1/dashboard1Controller.js'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'newNeta Dashboard 1'
                    },
                    ncyBreadcrumb: {
                        label: 'Dashboard System & Process'
                    }
                })
                .state("newneta.setting.user", {
                    url: "/user",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })

                // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'lazy_style_switcher',
                                'app/shared/header/headerController.js',
                                'app/shared/main_sidebar/main_sidebarController.js'
                            ]);
                        }]
                    }
                })
                // -- DASHBOARD --
                .state("restricted.dashboard", {
                    url: "/dashboard1",
                    templateUrl: 'app/components/dashboard/dashboardView.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_weathericons',
                                'lazy_clndr',
                                'app/components/dashboard/dashboardController.js',
                                'app/components/factory/BPILeaveRequestFactory.js',
                            ], {serie: true});
                        }],
                        sale_chart_data: function ($http) {
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function ($http) {
                            return $http({method: 'GET', url: 'data/user_data.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })

                .state("digi.nonapproved", {

                    url: "/list/nonapproved",
                    templateUrl: 'app/components/digi/ApprovalManagement/ListNonApproved/ListNonApprove.html',
                    controller: 'digiNonApproved',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/ApprovalManagement/ListNonApproved/ListNonApproveController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ApprovalModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'List Non Approved'
                    },
                    ncyBreadcrumb: {
                        label: 'List Non Approved'
                    }
                })

                .state("digi.approved", {

                    url: "/list/approved",
                    templateUrl: 'app/components/digi/ApprovalManagement/ListApproved/ListApproved.html',
                    controller: 'digiApproved',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/ApprovalManagement/ListApproved/ListApprovedController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ApprovalModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'List Approved'
                    },
                    ncyBreadcrumb: {
                        label: 'List Approved'
                    }
                })


                .state("digi.allcustomer", {

                    url: "/list/allcustomer",
                    templateUrl: 'app/components/digi/ApprovalManagement/ListAllCustomer/ListAllCustomer.html',
                    controller: 'digiAllcustomer',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'lazy_datatables',
                                'app/components/digi/ApprovalManagement/ListAllCustomer/ListAllCustomerController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/ApprovalModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'List All Customer'
                    },
                    ncyBreadcrumb: {
                        label: 'List All Customer'
                    }
                })

                .state("digi.registeradmin", {

                    url: "/register/admin",
                    templateUrl: 'app/components/digi/Register/Admin/RegisterAdmin.html',
                    controller: 'digiRegisterAdmin',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/Register/Admin/RegisterAdminController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/RegisterModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Register Admin'
                    },
                    ncyBreadcrumb: {
                        label: 'Register Admin'
                    }
                })

                .state("digi.registereo", {

                    url: "/register/eo",
                    templateUrl: 'app/components/digi/Register/RegisterEO/RegisterEO.html',
                    controller: 'digiRegisterEO',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/Register/RegisterEO/RegisterEOController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/RegisterModuleFactory.js',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Register EO'
                    },
                    ncyBreadcrumb: {
                        label: 'Register EO'
                    }
                })

                .state("digi.registerots", {

                    url: "/register/ots",
                    templateUrl: 'app/components/digi/Register/RegisterOTS/RegisterOTS.html',
                    controller: 'digiRegisterOTS',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/digi/Register/RegisterOTS/RegisterOTSController.js',
                                'app/components/service/NotificationService.js',
                                'app/components/factory/RegisterModuleFactory.js',
                                'bower_components/sweetalert/package/dist/sweetalert2.min.js',
                                'bower_components/sweetalert/package/dist/sweetalert2.css',
                                'lazy_KendoUI'
                            ], {serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Register On The Spot'
                    },
                    ncyBreadcrumb: {
                        label: 'Register On The Spot'
                    }
                })


        }
    ]);




    




/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('mainCtrl', [
        function () {}
    ])
;

/* ocLazyLoad config */

altairApp
    .config([
        '$ocLazyLoadProvider',
        function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                modules: [
                    // ----------- UIKIT ------------------
                    {
                        name: 'lazy_uikit',
                        files: [
                            // uikit core
                            "bower_components/uikit/js/uikit.min.js",
                            // uikit components
                            "bower_components/uikit/js/components/accordion.min.js",
                            "bower_components/uikit/js/components/autocomplete.min.js",
                            "assets/js/custom/uikit_datepicker.min.js",
                            "bower_components/uikit/js/components/form-password.min.js",
                            "bower_components/uikit/js/components/form-select.min.js",
                            "bower_components/uikit/js/components/grid.min.js",
                            "bower_components/uikit/js/components/lightbox.min.js",
                            "bower_components/uikit/js/components/nestable.min.js",
                            "bower_components/uikit/js/components/notify.min.js",
                            "bower_components/uikit/js/components/slider.min.js",
                            "bower_components/uikit/js/components/slideshow.min.js",
                            "bower_components/uikit/js/components/sortable.min.js",
                            "bower_components/uikit/js/components/sticky.min.js",
                            "bower_components/uikit/js/components/tooltip.min.js",
                            "assets/js/custom/uikit_timepicker.min.js",
                            "bower_components/uikit/js/components/upload.min.js",
                            "assets/js/custom/uikit_beforeready.min.js",
                            // styles
                            "bower_components/uikit/css/uikit.almost-flat.min.css"
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    //-------- ANGULAR MD5 ------------------



                    // ----------- FORM ELEMENTS -----------
                    {
                        name: 'lazy_autosize',
                        files: [
                            'bower_components/autosize/dist/autosize.min.js',
                            'app/modules/angular-autosize.min.js'
                        ],
                        serie: true
                    },

                    {
                        name: 'lazy_iCheck',
                        files: [
                            "bower_components/iCheck/icheck.min.js",
                            'app/modules/angular-icheck.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_selectizeJS',
                        files: [
                            'bower_components/selectize/dist/js/standalone/selectize.min.js',
                            'app/modules/angular-selectize.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_switchery',
                        files: [
                            'bower_components/switchery/dist/switchery.min.js',
                            'app/modules/angular-switchery.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ionRangeSlider',
                        files: [
                            'bower_components/ion.rangeslider/js/ion.rangeSlider.min.js',
                            'app/modules/angular-ionRangeSlider.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_masked_inputs',
                        files: [
                             'bower_components/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js'
                        ]
                    },
                    {
                        name: 'lazy_character_counter',
                        files: [
                            'app/modules/angular-character-counter.min.js'
                        ]
                    },
                    {
                        name: 'lazy_parsleyjs',
                        files: [
                            'assets/js/custom/parsleyjs_config.min.js',
                            'bower_components/parsleyjs/dist/parsley.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_wizard',
                        files: [
                            'bower_components/angular-wizard/dist/angular-wizard.min.js'
                        ]
                    },
                    {
                        name: 'lazy_ckeditor',
                        files: [
                            'bower_components/ckeditor/ckeditor.js',
                            'app/modules/angular-ckeditor.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tinymce',
                        files: [
                            'bower_components/tinymce/tinymce.min.js',
                            'app/modules/angular-tinymce.min.js'
                        ],
                        serie: true
                    },

                    // ----------- CHARTS -----------
                    {
                        name: 'lazy_charts_chartist',
                        files: [
                            'bower_components/chartist/dist/chartist.min.css',
                            'bower_components/chartist/dist/chartist.min.js',
                            'app/modules/angular-chartist.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_easypiechart',
                        files: [
                            'bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.min.js'
                        ]
                    },
                    {
                        name: 'lazy_charts_metricsgraphics',
                        files: [
                            'bower_components/metrics-graphics/dist/metricsgraphics.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/metrics-graphics/dist/metricsgraphics.min.js',
                            'app/modules/angular-metrics-graphics.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_c3',
                        files: [
                            'bower_components/c3js-chart/c3.min.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/c3js-chart/c3.min.js',
                            'bower_components/c3-angular/c3-angular.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_peity',
                        files: [
                            'bower_components/peity/jquery.peity.min.js',
                            'app/modules/angular-peity.min.js'
                        ],
                        serie: true
                    },

                    // ----------- COMPONENTS -----------
                    {
                        name: 'lazy_countUp',
                        files: [
                            'bower_components/countUp.js/dist/countUp.min.js',
                            'app/modules/angular-countUp.min.js'
                        ],
                        serie: true
                    },
                    {
                        name:'treeview2',
                        files:[
                            'bower_components/treeview/ivh-treeview.css',
                            'bower_components/treeview/ivh-treeview-theme-basic.css',
                            // 'bower_components/treeview/angular-qrcode.js'

                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_clndr',
                        files: [
                            'bower_components/clndr/clndr.min.js',
                            'bower_components/angular-clndr/angular-clndr.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_google_maps',
                        files: [
                            'bower_components/ngmap/services/ng-map.js',
                            'bower_components/ngmap/directives/marker.js'
                        ],
                        serie: true
                    },
                        {
                        name: 'map2',
                        files: [
                            'bower_components/ngmap2/ng-map.min.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_weathericons',
                        files: [
                            'bower_components/weather-icons/css/weather-icons.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_prismJS',
                        files: [
                            "bower_components/prism/prism.js",
                            "bower_components/prism/components/prism-php.js",
                            "bower_components/prism/plugins/line-numbers/prism-line-numbers.js",
                            'app/modules/angular-prism.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dragula',
                        files: [
                            'bower_components/angular-dragula/dist/angular-dragula.min.js'
                        ]
                    },
                    {
                        name: 'lazy_pagination',
                        files: [
                            'bower_components/angularUtils-pagination/dirPagination.js'
                        ]
                    },
                    {
                        name: 'lazy_diff',
                        files: [
                            'bower_components/jsdiff/diff.min.js'
                        ]
                    },

                    // ----------- PLUGINS -----------
                    {
                        name: 'lazy_fullcalendar',
                        files: [
                            'bower_components/fullcalendar/fullcalendar.min.css',
                            'bower_components/fullcalendar/fullcalendar.min.js',
                            'bower_components/fullcalendar/gcal.js',
                            'bower_components/angular-ui-calendar/src/calendar.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_codemirror',
                        files: [
                            "bower_components/codemirror/lib/codemirror.css",
                            "assets/css/codemirror_themes.min.css",
                            "bower_components/codemirror/lib/codemirror.js",
                            "assets/js/custom/codemirror_fullscreen.min.js",
                            "bower_components/codemirror/addon/edit/matchtags.js",
                            "bower_components/codemirror/addon/edit/matchbrackets.js",
                            "bower_components/codemirror/addon/fold/xml-fold.js",
                            "bower_components/codemirror/mode/htmlmixed/htmlmixed.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/clike/clike.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "app/modules/angular-codemirror.min.js"
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_datatables',
                        files: [
                            'bower_components/datatables/media/js/jquery.dataTables.min.js',
                            'bower_components/datatables-colvis/js/dataTables.colVis.js',
                            'bower_components/datatables-tabletools/js/dataTables.tableTools.js',
                            'bower_components/angular-datatables/dist/angular-datatables.js',
                            'assets/js/custom/jquery.dataTables.columnFilter.js',
                            'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',
                            'assets/js/custom/datatables_uikit.js'
                        ],
                        serie: true
                    },
                    {
                        name:'tree_menu2',
                        files:[
                            'bower_components/angular-bootsrap-tree/jquery-2.1.4.js',
                            'bower_components/angular-bootsrap-tree/bootstrap.min.js',
                            'bower_components/angular-bootsrap-tree/bootstrap.min.js',
                            'bower_components/angular-bootsrap-tree/angular-bootstrap-tree.js',
                            'bower_components/angular-bootsrap-tree/angular-bootstrap-tree.css',
                            'bower_components/angular-bootsrap-tree/font-awesome.css'
                        ],
                        serie: true
                    },
                     {
                        name:'qrcode',
                        files:[
                            'bower_components/qrcode-generator/qrcode.js',
                            'bower_components/qrcode-generator/qrcode_UTF8.js',
                            'bower_components/angular-qrcode/angular-qrcode.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name:'autocom',
                        files:[
                            
                            'bower_components/autocomplete/angular-kendo.js'
                            
                        ],
                        serie: true
                    },
                    {
                        name:'moment',
                        files:[

                            'bower_components/moment/moment.js',
                            'bower_components/moment/min/moment.min.js',
                            'bower_components/moment/min/locales.js',
                            'bower_components/moment/min/locales.min.js',
                            'bower_components/moment/min/moment-with-locales.js',
                            'bower_components/moment/min/moment-with-locales.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'base64',
                        files:[

                            'bower_components/angular-base64/angular-base64.js',
                            'bower_components/angular-base64/angular-base64.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'base64upload',
                        files:[

                            'bower_components/angular-base64-upload/dist/angular-base64-upload.js',
                            'bower_components/angular-base64-upload/dist/angular-base64-upload.min.js',

                        ],
                        serie: true
                    },
                    {
                        name:'tree_menu_tes',
                        files:[
                            'bower_components/tree2/style.css'
                        ],
                        serie: true
                    },

                    {
                        name: 'lazy_gantt_chart',
                        files: [
                            <!-- jquery ui -->
                          'bower_components/jquery-ui/ui/minified/core.min.js',
                          'bower_components/jquery-ui/ui/minified/widget.min.js',
                          'bower_components/jquery-ui/ui/minified/mouse.min.js',
                          'bower_components/jquery-ui/ui/minified/resizable.min.js',
                          'bower_components/jquery-ui/ui/minified/draggable.min.js',
                          //   <!-- gantt chart -->
                          'assets/js/custom/gantt_chart.min.js',


                            // 'assets/js/custom/jquery-ui-1.8.4.css',
                            // 'assets/js/custom/jquery-ui-1.8.4.js',
                            // 'assets/js/custom/jquery.ganttView.js',
                            // 'assets/js/custom/jquery.ganttView.css',
                            // 'assets/js/custom/date.js',
                            // 'assets/js/custom/reset.css',
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tablesorter',
                        files: [
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.min.js',
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.widgets.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-alignChar.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-columnSelector.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-print.min.js',
                            'bower_components/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_vector_maps',
                        files: [
                            'bower_components/raphael/raphael-min.js',
                            'bower_components/jquery-mapael/js/jquery.mapael.js',
                            'bower_components/jquery-mapael/js/maps/world_countries.js',
                            'bower_components/jquery-mapael/js/maps/usa_states.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'font_awesome',
                        files: [

                            'bower_components/font_awesome/css/font-awesome.min.css',

                        ],
                        serie: true
                    },

                    {
                        name: 'font_bostrap',
                        files: [

                            'bower_components/boostrapfont/css/bootstrap.css',
                            'bower_components/boostrapfont/css/bootstrap-theme.css',


                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dropify',
                        files: [
                            'assets/skins/dropify/css/dropify.css',
                            'assets/js/custom/dropify/dist/js/dropify.min.js'
                        ],
                        insertBefore: '#main_stylesheet'
                    },
                    {
                        name: 'lazy_tree',
                        files: [
                            'assets/skins/jquery.fancytree/ui.fancytree.min.css',
                            <!-- jquery ui -->
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            <!-- fancytree -->
                            'bower_components/jquery.fancytree/dist/jquery.fancytree-all.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_idle_timeout',
                        files: [
                            'bower_components/ng-idle/angular-idle.min.js'
                        ]
                    },
                    {
                        name: 'lazy_tour',
                        files: [
                            'bower_components/enjoyhint/enjoyhint.min.js'
                        ]
                    },
                    {
                        name: 'lazy_filemanager',
                        files: [
                            'bower_components/jquery-ui/themes/smoothness/jquery-ui.min.css',
                            'file_manager/css/elfinder.min.css',
                            'file_manager/themes/material/css/theme.css',
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            'file_manager/js/elfinder.min.js'
                        ],
                        serie: true
                    },
                    // ----------- KENDOUI COMPONENTS -----------
                    {
                        name: 'lazy_KendoUI',
                        files: [
                            'bower_components/kendo-ui/js/kendo.core.min.js',
                            'bower_components/kendo-ui/js/kendo.color.min.js',
                            'bower_components/kendo-ui/js/kendo.data.min.js',
                            'bower_components/kendo-ui/js/kendo.calendar.min.js',
                            'bower_components/kendo-ui/js/kendo.popup.min.js',
                            'bower_components/kendo-ui/js/kendo.datepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.timepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.datetimepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.list.min.js',
                            //'bower_components/kendo-ui/js/kendo.listbox.min.js',
                            'bower_components/kendo-ui/js/kendo.fx.min.js',
                            'bower_components/kendo-ui/js/kendo.userevents.min.js',
                            'bower_components/kendo-ui/js/kendo.menu.min.js',
                            'bower_components/kendo-ui/js/kendo.draganddrop.min.js',
                            'bower_components/kendo-ui/js/kendo.slider.min.js',
                            'bower_components/kendo-ui/js/kendo.mobile.scroller.min.js',
                            'bower_components/kendo-ui/js/kendo.autocomplete.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.dropdownlist.min.js',
                            'bower_components/kendo-ui/js/kendo.colorpicker.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.maskedtextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.multiselect.min.js',
                            'bower_components/kendo-ui/js/kendo.numerictextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.toolbar.min.js',
                            'bower_components/kendo-ui/js/kendo.panelbar.min.js',
                            'bower_components/kendo-ui/js/kendo.window.min.js',
                            'bower_components/kendo-ui/js/kendo.angular.min.js',
                            'bower_components/kendo-ui/styles/kendo.common-material.min.css',
                            'bower_components/kendo-ui/styles/kendo.material.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    //HIGHCHARTS JS
                    {
                        name: 'lazy_HighChartsJS',
                        files: [
                            'bower_components/highcharts-ng/dist/highcharts-ng.css',
                            'bower_components/highcharts-ng/dist/highcharts-ng.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_pdf',
                        files: [
                            'bower_components/jsPDF/dist/jspdf.debug.js',
                            'bower_components/jsPDF/dist/jspdf.min.js',
                            'bower_components/jsPDF/dist/jspdf.plugin.autotable.min.js'
                        ],
                        serie: true
                    },
                    //ANGULAR CHARTS JS
                    {
                        name: 'lazy_AngularChartsJS',
                        files: [
                            'bower_components/angular-chart.js/dist/angular-chart.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_alert',
                        files: [
                            'bower_components/sweetalert/package/dist/sweetalert2.min.js',
                            'bower_components/sweetalert/package/dist/sweetalert2.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    // ----------- UIKIT HTMLEDITOR -----------
                    {
                        name: 'lazy_htmleditor',
                        files: [
                            "bower_components/codemirror/lib/codemirror.js",
                            "bower_components/codemirror/mode/markdown/markdown.js",
                            "bower_components/codemirror/addon/mode/overlay.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/gfm/gfm.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/marked/lib/marked.js",
                            "bower_components/uikit/js/components/htmleditor.js"
                        ],
                        serie: true
                    },

                    // ----------- THEMES -------------------
                    {
                        name: 'lazy_themes',
                        files: [
                            "assets/css/themes/_theme_a.min.css",
                            "assets/css/themes/_theme_b.min.css",
                            "assets/css/themes/_theme_c.min.css",
                            "assets/css/themes/_theme_d.min.css",
                            "assets/css/themes/_theme_e.min.css",
                            "assets/css/themes/_theme_f.min.css",
                            "assets/css/themes/_theme_g.min.css",
                            "assets/css/themes/_theme_h.min.css",
                            "assets/css/themes/_theme_i.min.css",
                            "assets/css/themes/_theme_dark.min.css"
                        ]
                    },

                    // ----------- STYLE SWITCHER -----------
                    {
                        name: 'lazy_style_switcher',
                        files: [
                            "assets/css/style_switcher.min.css",
                            "app/shared/style_switcher/style_switcher.js"
                        ]
                    }

                ]
            })
        }
    ]);