angular
    .module('altairApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        function ($timeout, $scope, $rootScope) {
            $rootScope.$broadcast('someEvent', [1, 2, 3]);

            $scope.testDataEvent = [];

            /*$scope.$on('someEvent', function(event, data) {
                $scope.testDataEvent = data;
            });*/

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function () {
                    if (!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');

                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function () {
                            var $this = $(this);

                            $this.attr('title', $this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });

            // language switcher
            $scope.langSwitcherModel = 'gb';
            var langData = $scope.langSwitcherOptions = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'French', value: 'fr'},
                {id: 3, title: 'Chinese', value: 'cn'},
                {id: 4, title: 'Dutch', value: 'nl'},
                {id: 5, title: 'Italian', value: 'it'},
                {id: 6, title: 'Spanish', value: 'es'},
                {id: 7, title: 'German', value: 'de'},
                {id: 8, title: 'Polish', value: 'pl'}
            ];

            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function (langData, escape) {

                        return '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function (langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function (selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                }
            };

            //$rootScope.$broadcast('someEvent', [1,2,3]);

            $scope.menuSideBar = [];
            var adit = localStorage.getItem('data_user_employee');
            var data = JSON.parse(adit);
            var roles = localStorage.getItem('roles');
            $scope.dataroles = JSON.parse(roles);
            //console.log("roles" + $scope.dataroles);


            // menu entries
            $rootScope.sections = $scope.sections = [];
            $rootScope.sectionseo = $scope.sectionseo = [];

            $rootScope.sections = $scope.sections = [

                {
                    id: 01,
                    title: 'Home',
                    icon: '&#xE88A',
                    link: 'newneta.dashboard1'
                },
                {
                    id: 02,
                    title: 'List All Customer',
                    icon: '&#xe7fb',
                    link: 'digi.allcustomer'
                },
                {
                    id: 03,
                    title: 'List Need Approve',
                    icon: '&#xE85D',
                    link: 'digi.nonapproved'
                },
                {
                    id: 04,
                    title: 'List Approved',
                    icon: '&#xE85D',
                    link: 'digi.approved'
                },
                {
                    id: 05,
                    title: 'Register Admin',
                    icon: '&#xe616',
                    link: 'digi.registeradmin'
                },
                {
                    id: 06,
                    title: 'Register Customer',
                    icon: '&#xe616',
                    link: 'digi.registerots'
                },
                {
                    id: 07,
                    title: 'Register EO',
                    icon: '&#xe616',
                    link: 'digi.registereo'
                },

            ]

            $rootScope.sectionseo = $scope.sectionseo = [

                {
                    id: 01,
                    title: 'Home',
                    icon: '&#xE88A',
                    link: 'newneta.dashboard1'
                },
                {
                    id: 04,
                    title: 'List Approved',
                    icon: '&#xE85D',
                    link: 'digi.approved'
                },
                {
                    id: 06,
                    title: 'Register Customer',
                    icon: '&#xe616',
                    link: 'digi.registerots'
                }


            ]

            if ($scope.dataroles != null || $scope.dataroles != undefined) {
                if ($scope.dataroles == "admo") {

                    $scope.isimenu = $scope.sections;

                }
                else if($scope.dataroles == "eo") {
                    $scope.isimenu = $scope.sectionseo;
                }

                $scope.menuSideBar = $scope.isimenu;
               // console.log('msd -> $scope.menuSideBar : '+JSON.stringify($scope.menuSideBar));
                $rootScope.sections = $scope.sections = $scope.isimenu;

            }


            function removeByKey(array, params){
                array.some(function(item, index) {
                    return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
                });
                return array;
            }
        }
    ])
;