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




    



