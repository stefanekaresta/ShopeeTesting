angular
    .module('altairApp')
    .controller('appCtrl', [
        '$stateParams',
        '$scope',
        'ReconstructMenu',
        'ActionProcess',
        '$log',
        '$window',
        '$cookies',
        '$state',
        function ($stateParams,$scope,ReconstructMenu,ActionProcess,$log,$window,$cookies,$state) {
            ReconstructMenu.Init();
            //----------------------------------------------------------------------------------------------------------

            //----------------------------------------------------------------------------------------------------------
            $scope.dataList = [];
            $scope.showErrorCollect = {};
            var success_getdata_process = function(data) {
                $scope.dataList = data;
            };
            var error_getdata_process = function(data) {
                $log.error('error get data'+data,data);
            };
            ActionProcess.GetListAgent().then(success_getdata_process,error_getdata_process);
            //----------------------------------------------------------------------------------------------------------
            $scope.dataListManual = [];
            var success_getdata_process_manual = function(data) {
                $scope.dataListManual = data;
            };
            var error_getdata_process_manual = function(data) {
                $log.error('error get data'+data,data);
            };
            ActionProcess.GetListAgentManual().then(success_getdata_process_manual,error_getdata_process_manual);
            //----------------------------------------------------------------------------------------------------------
            // action button
            $scope.actionUpdateButton = function(agent,action) {
                // action --> "start", "stop"
                var success_update_data = function(data) {
                    ////$log.info('success, message : '+JSON.stringify(data));
                    ActionProcess.GetListAgent().then(success_getdata_process,error_getdata_process);
                };
                var error_update_data = function(data) {
                    $log.error('error_msg : '+JSON.stringify(data));
                };
                ActionProcess.UpdateListAgent(agent,action,$cookies.get('username')).then(success_update_data,error_update_data);
            };
            $scope.actionShowError = function(agent,action) {
                // action --> "start", "stop"
                var success_get_data = function(data) {
                    //$log.info('success, message : '+JSON.stringify(data));
                    //$log.info('message : '+data);
                    var statusMessage = '';
                    angular.forEach(data, function(value, key) {
                        statusMessage += 'fileId:'+value.fileId+'->'+value.statusMessage+';';
                    });
                    UIkit.modal.alert('Error Message : '+statusMessage);
                };
                var error_get_data = function(data) {
                    $log.error('error_msg : '+JSON.stringify(data));
                    UIkit.modal.alert('Error Message : '+data.statusMessage);
                };
                ActionProcess.GetErrorAgent().then(success_get_data,error_get_data);
            };
            $scope.actionProcessManual = function(action) {
                //$log.info('actionProcessManual, action : '+action);
                $state.go('newneta.monitoring.detail',{'action':action});
            };
            //----------------------------------------------------------------------------------------------------------
        }
    ])
    .controller('appDetailCtrl', [
        '$stateParams',
        '$scope',
        '$rootScope',
        'ReconstructMenu',
        'ActionProcess',
        '$log',
        '$window',
        '$cookies',
        '$state',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnBuilder',
        'DTColumnDefBuilder',
        '$filter',
        '$compile',
        function ($stateParams,$scope,$rootScope,ReconstructMenu,ActionProcess,$log,$window,$cookies,$state,$resource,
                  DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,$filter,$compile) {
            ReconstructMenu.Init();
            //----------------------------------------------------------------------------------------------------------
            $rootScope.toBarActive = true;
            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });
            //----------------------------------------------------------------------------------------------------------
            // param
            $scope.action = $stateParams.action;
            //----------------------------------------------------------------------------------------------------------
            // init variable
            $scope.listData = []; // list temp_data
            $scope.listProcessed = [];
            $scope.notification = {
                error:false,
                errorMessage:''
            };
            //----------------------------------------------------------------------------------------------------------
            // function list
            var success_req_data= function(data) {
                $scope.listData = data;
            };
            var error_req_data= function(data) {
                $log.error('Error : '+JSON.stringify(data));
            };
            //----------------------------------------------------------------------------------------------------------
            // logic
            if ($scope.action == 'AGENT_REPROCESS') {
                ////$log.info('agent_reprocess');
                ActionProcess.FileQueueStatusNotNol().then(success_req_data,error_req_data);
            } else if ($scope.action == 'AGENT_REOUTPUT') {
                ActionProcess.FileQueueStatusSatu().then(success_req_data,error_req_data);
            } else if ($scope.action == 'AGENT_REDISPATCH') {
                ActionProcess.FileQueueStatusSatu().then(success_req_data,error_req_data);
            }
            //----------------------------------------------------------------------------------------------------------
            // action button
            $scope.addData = function(tmp) {
                if ($scope.listProcessed.indexOf(tmp) == -1) {
                    $scope.listProcessed.push(tmp);
                } else {
                    console.log('duplicate entries');
                }
            };
            $scope.removeData = function(tmp) {
                var index = $scope.listProcessed.indexOf(tmp);
                $scope.listProcessed.splice(index, 1);
            };
            $scope.startReprocess = function() {
                //$log.info('starting agent, data length : '+$scope.listProcessed.length);
                var success_starting_reprocess = function(data) {
                    //$log.info('success running, data : '+JSON.stringify(data));
                    //$state.go('newneta.monitoring.detail_process_info',{'agentId' : data.agentId});
                };
                var success_starting_reoutput = function(data) {
                    //$log.info('success running, data : '+JSON.stringify(data));
                    //$state.go('newneta.monitoring.detail_process_info',{'agentId' : data.agentId});
                };
                var success_starting_redispatch = function(data) {
                    //$log.info('success running, data : '+JSON.stringify(data));
                    //$state.go('newneta.monitoring.detail_process_info',{'agentId' : data.agentId});
                };
                var error_starting_reprocess = function(data) {
                    //$log.info('Error Running, data : '+JSON.stringify(data));
                };

                if ($scope.listProcessed.length > 0) {
                    $scope.notification.error = false;
                    $scope.notification.errorMessage = '';
                    var success_agent = function(data) {
                        //$log.info('data.agentId : '+data.agentId);

                        if ($scope.action == 'AGENT_REPROCESS') {
                            ActionProcess.RunMainReprocess($scope.listProcessed,data.agentId).then(success_starting_reprocess,error_starting_reprocess);
                        } else if ($scope.action == 'AGENT_REOUTPUT') {
                            ActionProcess.RunMainReoutput($scope.listProcessed,data.agentId).then(success_starting_reprocess,error_starting_reprocess);
                        } else if ($scope.action == 'AGENT_REDISPATCH') {
                            ActionProcess.RunMainRedispatch($scope.listProcessed,data.agentId).then(success_starting_reprocess,error_starting_reprocess);
                        }
                        $state.go('newneta.monitoring.process_info',{'action':$scope.action,'agentId':data.agentId});
                    };
                    var error_agent = function(data) {
                        //$log.info('Error Running, data : '+JSON.stringify(data));
                    };
                    //$log.info('get agentID');
                    ActionProcess.GetAgentId($scope.action).then(success_agent,error_agent);
                } else {
                    $scope.notification.error = true;
                    $scope.notification.errorMessage = 'Please Select Data to Process';
                }

            };
            //----------------------------------------------------------------------------------------------------------
            $scope.$on('onLastRepeat', function (scope, element, attrs) {

                var $ts_pager_filter = $("#ts_pager_filter"),
                    $ts_align = $('#ts_align'),
                    $ts_customFilters = $('#ts_custom_filters'),
                    $columnSelector = $('#columnSelector');

                // pager + filter
                if($(element).closest($ts_pager_filter).length) {

                    // define pager options
                    var pagerOptions = {
                        // target the pager markup - see the HTML block below
                        container: $(".ts_pager"),
                        // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
                        output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
                        // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
                        // table row set to a height to compensate; default is false
                        fixedHeight: true,
                        // remove rows from the table to speed up the sort of large tables.
                        // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
                        removeRows: false,
                        // go to page selector - select dropdown that sets the current page
                        cssGoto: '.ts_gotoPage'
                    };

                    // change popup print & close button text
                    $.tablesorter.language.button_print = "Print table";
                    $.tablesorter.language.button_close = "Cancel";

                    // print table
                    $('#printTable').on('click',function(e) {
                        e.preventDefault();
                        $ts_pager_filter.trigger('printTable');
                    });

                    // Initialize tablesorter
                    var ts_users = $ts_pager_filter
                        .tablesorter({
                            theme: 'altair',
                            widthFixed: true,
                            widgets: ['zebra', 'filter','print','columnSelector'],
                            headers: {
                                0: {
                                    sorter: false,
                                    parser: false
                                }
                            },
                            widgetOptions : {
                                // column selector widget
                                columnSelector_container : $columnSelector,
                                columnSelector_name : 'data-name',
                                columnSelector_layout : '<li class="padding_md"><input type="checkbox"><label class="inline-label">{name}</label></li>',
                                columnSelector_saveColumns: false,
                                // print widget
                                print_title      : '',          // this option > caption > table id > "table"
                                print_dataAttrib : 'data-name', // header attrib containing modified header name
                                print_rows       : 'f',         // (a)ll, (v)isible, (f)iltered, or custom css selector
                                print_columns    : 's',         // (a)ll, (v)isible or (s)elected (columnSelector widget)
                                print_extraCSS   : '',          // add any extra css definitions for the popup window here
                                print_styleSheet : '',          // add the url of your print stylesheet
                                print_now        : true,        // Open the print dialog immediately if true
                                // callback executed when processing completes - default setting is null
                                print_callback   : function(config, $table, printStyle){
                                    // hide sidebar
                                    $rootScope.primarySidebarActive = false;
                                    $rootScope.primarySidebarOpen = false;
                                    $timeout(function () {
                                        // print the table using the following code
                                        $.tablesorter.printTable.printOutput( config, $table.html(), printStyle );
                                    }, 300);
                                }
                            }
                        })
                        // initialize the pager plugin
                        .tablesorterPager(pagerOptions)
                        .on('pagerComplete', function(e, filter){
                            // update selectize value
                            if(typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                selectizePage = selectizeObj[0].selectize;
                                selectizePage.setValue($('select.ts_gotoPage option:selected').index() + 1, false);
                            }
                        });

                    // replace column selector checkboxes
                    $columnSelector.children('li').each(function(index) {
                        var $this = $(this);

                        var id = index == 0 ? 'auto' : index;
                        $this.children('input').attr('id','column_'+id);
                        $this.children('label').attr('for','column_'+id);

                        $this.children('input')
                            .prop('checked',true)
                            .iCheck({
                                checkboxClass: 'icheckbox_md',
                                radioClass: 'iradio_md',
                                increaseArea: '20%'
                            });

                        if(index != 0) {
                            $this.find('input')
                                .on('ifChanged', function (ev) {
                                    $(ev.target).toggleClass('checked').change();
                                })
                        }

                    });

                    $('#column_auto')
                        .on('ifChecked',function(ev) {
                            $(this)
                                .closest('li')
                                .siblings('li')
                                .find('input').iCheck('disable');
                            $(ev.target).removeClass('checked').change();
                        })
                        .on('ifUnchecked',function(ev) {
                            $(this)
                                .closest('li')
                                .siblings('li')
                                .find('input').iCheck('enable');
                            $(ev.target).addClass('checked').change();
                        });

                    // replace 'goto Page' select
                    function createPageSelectize() {
                        selectizeObj = $('select.ts_gotoPage')
                            .val($("select.ts_gotoPage option:selected").val())
                            .after('<div class="selectize_fix"></div>')
                            .selectize({
                                hideSelected: true,
                                onDropdownOpen: function($dropdown) {
                                    $dropdown
                                        .hide()
                                        .velocity('slideDown', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        })
                                },
                                onDropdownClose: function($dropdown) {
                                    $dropdown
                                        .show()
                                        .velocity('slideUp', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        });

                                    // hide tooltip
                                    $('.uk-tooltip').hide();
                                }
                            });
                    }
                    createPageSelectize();

                    // replace 'pagesize' select
                    $('.pagesize.ts_selectize')
                        .after('<div class="selectize_fix"></div>')
                        .selectize({
                            hideSelected: true,
                            onDropdownOpen: function($dropdown) {
                                $dropdown
                                    .hide()
                                    .velocity('slideDown', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    })
                            },
                            onDropdownClose: function($dropdown) {
                                $dropdown
                                    .show()
                                    .velocity('slideUp', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    });

                                // hide tooltip
                                $('.uk-tooltip').hide();

                                if(typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                    selectizePage = selectizeObj[0].selectize;
                                    selectizePage.destroy();
                                    $('.ts_gotoPage').next('.selectize_fix').remove();
                                    setTimeout(function() {
                                        createPageSelectize()
                                    })
                                }

                            }
                        });

                    // select/unselect table rows
                    $('.ts_checkbox_all')
                        .iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        })
                        .on('ifChecked',function() {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // check all checkboxes in table
                                .prop('checked',true)
                                .iCheck('update')
                                // add highlight to row
                                .closest('tr')
                                .addClass('row_highlighted');
                        })
                        .on('ifUnchecked',function() {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // uncheck all checkboxes in table
                                .prop('checked',false)
                                .iCheck('update')
                                // remove highlight from row
                                .closest('tr')
                                .removeClass('row_highlighted');
                        });

                    // select/unselect table row
                    $ts_pager_filter.find('.ts_checkbox')
                        .on('ifUnchecked',function() {
                            $(this).closest('tr').removeClass('row_highlighted');
                            $('.ts_checkbox_all').prop('checked',false).iCheck('update');
                        }).on('ifChecked',function() {
                            $(this).closest('tr').addClass('row_highlighted');
                        });

                    // remove single row
                    $ts_pager_filter.on('click','.ts_remove_row',function(e) {
                        e.preventDefault();

                        var $this = $(this);
                        UIkit.modal.confirm('Are you sure you want to delete this user?', function(){
                            $this.closest('tr').remove();
                            ts_users.trigger('update');
                        }, {
                            labels: {
                                'Ok': 'Delete'
                            }
                        });
                    });
                }

                // align widget example
                if($(element).closest($ts_align).length) {
                    $ts_align.tablesorter({
                        theme: 'altair',
                        widgets: ['zebra', 'alignChar'],
                        widgetOptions: {
                            alignChar_wrap: '<i/>',
                            alignChar_charAttrib: 'data-align-char',
                            alignChar_indexAttrib: 'data-align-index',
                            alignChar_adjustAttrib: 'data-align-adjust' // percentage width adjustments
                        }
                    });
                }

                // custom filters
                if($(element).closest($ts_customFilters).length) {
                    $ts_customFilters
                        .tablesorter({
                            theme: 'altair',
                            headerTemplate: '{content} {icon}',
                            widgets: ['zebra', 'filter'],
                            widgetOptions: {
                                filter_reset : 'button.ts_cf_reset',
                                filter_cssFilter: ['', 'ts_cf_range', 'ts_cf_select_single', 'ts_cf_datepicker']
                            }
                        })
                        .on('apply.daterangepicker', function(){
                            $table.trigger('search');
                        });

                    // rangeSlider
                    var slider = $('.ts_cf_range').ionRangeSlider({
                        "min": "0",
                        "max": "1000",
                        "type": "double",
                        "grid-num": "10",
                        "from-min": "10",
                        "from-max": "30",
                        "input_values_separator": " - "
                    }).data("ionRangeSlider");

                    // selectize
                    var $selectize = $('.ts_cf_select_single')
                        .after('<div class="selectize_fix"></div>')
                        .selectize({
                            hideSelected: true,
                            dropdownParent: 'body',
                            closeAfterSelect: true,
                            onDropdownOpen: function($dropdown) {
                                $dropdown
                                    .hide()
                                    .velocity('slideDown', {
                                        duration: 200,
                                        easing: [ 0.4,0,0.2,1 ]
                                    })
                            },
                            onDropdownClose: function($dropdown) {
                                $dropdown
                                    .show()
                                    .velocity('slideUp', {
                                        duration: 200,
                                        easing: [ 0.4,0,0.2,1 ]
                                    });
                            }
                        });
                    var cf_selectize = $selectize[0].selectize;

                    var modal = UIkit.modal("#modal_daterange", {
                        center: true
                    });

                    $('.ts_cf_datepicker').on('focus',function() {
                        if ( modal.isActive() ) {
                            modal.hide();
                        } else {
                            modal.show();
                        }
                    });

                    var $dp_start = $('#ts_dp_start'),
                        $dp_end = $('#ts_dp_end');

                    var start_date = UIkit.datepicker($dp_start, {
                        format:'MMM D, YYYY'
                    });

                    var end_date = UIkit.datepicker($dp_end, {
                        format:'MMM D, YYYY'
                    });

                    $dp_start.on('change',function() {
                        end_date.options.minDate = $dp_start.val();
                    });

                    $dp_end.on('change',function() {
                        start_date.options.maxDate = $dp_end.val();
                    });

                    $('#daterangeApply').on('click', function(e){
                        e.preventDefault();
                        modal.hide();
                        $('.ts_cf_datepicker').val(
                            $dp_start.val() + ' - ' + $dp_end.val()
                        ).change().blur();
                    });

                    $('button.ts_cf_reset').on('click', function() {
                        // reset selectize
                        cf_selectize.clear();
                        // slider reset
                        slider.reset();
                    })

                }

            });
            /*$scope.$on('onLastRepeat', function (scope, element, attrs) {
                // issues list tablesorter
                var $ts_issues = $("#ts_issues");
                if($(element).closest($ts_issues).length) {

                    // define pager options
                    var pagerOptions = {
                        // target the pager markup - see the HTML block below
                        container: $(".ts_pager"),
                        // output string - default is '{page}/{totalPages}'; possible variables: {page}, {totalPages}, {startRow}, {endRow} and {totalRows}
                        output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
                        // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
                        // table row set to a height to compensate; default is false
                        fixedHeight: true,
                        // remove rows from the table to speed up the sort of large tables.
                        // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
                        removeRows: false,
                        // go to page selector - select dropdown that sets the current page
                        cssGoto: '.ts_gotoPage'
                    };

                    // Initialize tablesorter
                    $ts_issues
                        .tablesorter({
                            theme: 'altair',
                            widthFixed: true,
                            widgets: ['zebra', 'filter']
                        })
                        // initialize the pager plugin
                        .tablesorterPager(pagerOptions)
                        .on('pagerComplete', function (e, filter) {
                            // update selectize value
                            if (typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                selectizePage = selectizeObj[0].selectize;
                                selectizePage.setValue($('select.ts_gotoPage option:selected').index() + 1, false);
                            }

                        });

                    // replace 'goto Page' select
                    function createPageSelectize() {
                        selectizeObj = $('select.ts_gotoPage')
                            .val($("select.ts_gotoPage option:selected").val())
                            .after('<div class="selectize_fix"></div>')
                            .selectize({
                                hideSelected: true,
                                onDropdownOpen: function ($dropdown) {
                                    $dropdown
                                        .hide()
                                        .velocity('slideDown', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        })
                                },
                                onDropdownClose: function ($dropdown) {
                                    $dropdown
                                        .show()
                                        .velocity('slideUp', {
                                            duration: 200,
                                            easing: variables.easing_swiftOut
                                        });

                                    // hide tooltip
                                    $('.uk-tooltip').hide();
                                }
                            });
                    }

                    createPageSelectize();

                    // replace 'pagesize' select
                    $('.pagesize.ts_selectize')
                        .after('<div class="selectize_fix"></div>')
                        .selectize({
                            hideSelected: true,
                            onDropdownOpen: function ($dropdown) {
                                $dropdown
                                    .hide()
                                    .velocity('slideDown', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    })
                            },
                            onDropdownClose: function ($dropdown) {
                                $dropdown
                                    .show()
                                    .velocity('slideUp', {
                                        duration: 200,
                                        easing: variables.easing_swiftOut
                                    });

                                // hide tooltip
                                $('.uk-tooltip').hide();

                                if (typeof selectizeObj !== 'undefined' && selectizeObj.data('selectize')) {
                                    selectizePage = selectizeObj[0].selectize;
                                    selectizePage.destroy();
                                    $('.ts_gotoPage').next('.selectize_fix').remove();
                                    setTimeout(function () {
                                        createPageSelectize()
                                    })
                                }

                            }
                        });
                }
            });*/
            //----------------------------------------------------------------------------------------------------------

        }
    ])
    .controller('dt_individual_search',
    function($compile, $scope, $timeout, $resource, DTOptionsBuilder,
             DTColumnDefBuilder,DTColumnBuilder,ActionProcess,ServerConfig,$q,$http) {
        var vm = this;

        vm.listData = [];
        vm.tmp = {};

        vm.dtOptions2 = DTOptionsBuilder
            .fromFnPromise(serverData2)
            .withDisplayLength(5)
            .withPaginationType('full_numbers')
        ;

        vm.dtColumns2 = [
            DTColumnBuilder.newColumn('id').withTitle('ID'),
            DTColumnBuilder.newColumn('filenameInput').withTitle('File Name'),
            DTColumnBuilder.newColumn('fileId').withTitle('Host ID'),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(actionsHtml2)
        ];

        vm.addData = addData;
        $scope.addData = addData;
        function addData(tmp) {
            console.log("Masuk ke sini");
            console.log('Add : '+JSON.stringify(tmp));

        }

        function actionsHtml2(data, type, full, meta) {
            vm.tmp[data.id.counter] = data;
            return '<a><i class="material-icons md-24 uk-text-primary" ng-click="vm.addData(vm.tmp[' + data.id.counter + '])">&#xE148;</i></a>';
        }

        function serverData2() {
            var defer = $q.defer();
            $http.get(ServerConfig.production + '/neta/wifiid/file_queue/status_not_1').then(function(result) {
                //console.log(JSON.stringify(result.data));
                defer.resolve(result.data);
            });
            return defer.promise;
        }



    }
)
    .factory('ActionProcess', function($timeout,$log,$http,ServerConfig,$q,ServerProcess,$cookies){
        var service = {};

        var get_agent_id = {
            method: 'GET',
            url: ServerProcess.production + '/neta/wifiid/get_agent_id',
            headers: {},
            params:{agentName:''}
        };
        service.GetAgentId = function(agentName) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            get_agent_id.params.agentName = agentName;
            $http(get_agent_id).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var get_file_queue_status_not_nol = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/file_queue/status_not_0',
            headers: {}
        };
        service.FileQueueStatusNotNol = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(get_file_queue_status_not_nol).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var get_error_agent = {
            method: 'GET',
            url: ServerProcess.production + '/neta/collect/monitor_job',
            headers: {}
        };
        service.GetErrorAgent = function() {
            var deffered = $q.defer();
            $http(get_error_agent).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };


        var get_file_queue_status_not_satu = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/file_queue/status_not_1',
            headers: {}
        };
        service.FileQueueStatusNotSatu = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(get_file_queue_status_not_satu).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var get_file_queue_status_all = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/file_queue/status_all',
            headers: {}
        };
        service.FileQueueStatusAll = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(get_file_queue_status_all).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var get_file_queue_status_satu = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/file_queue/status_1',
            headers: {}
        };
        service.FileQueueStatusSatu = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(get_file_queue_status_satu).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var get_file_queue_status_satu = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/file_queue/status_1',
            headers: {}
        };
        service.FileQueueStatusSatu = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(get_file_queue_status_satu).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var action_running_reprocess = {
            method: 'POST',
            url: ServerProcess.production + '/neta/process/main_reprocess',
            headers: {},
            params:{username:'',agentId:''}
        };

        service.RunMainReprocess = function(data,agentId) {
            var deffered = $q.defer();

            action_running_reprocess.data = data;
            action_running_reprocess.params.username = $cookies.get('username');
            action_running_reprocess.params.agentId = agentId;

            $http(action_running_reprocess).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var action_running_reoutput = {
            method: 'POST',
            url: ServerProcess.production + '/neta/process/main_reoutput',
            headers: {},
            params:{username:'',agentId:''}
        };

        service.RunMainReoutput = function(data,agentId) {
            var deffered = $q.defer();

            action_running_reoutput.data = data;
            action_running_reoutput.params.username = $cookies.get('username');
            action_running_reoutput.params.agentId = agentId;

            $http(action_running_reoutput).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var action_running_redispatch = {
            method: 'POST',
            url: ServerProcess.production + '/neta/process/main_redispatch',
            headers: {},
            params:{username:'',agentId:''}
        };

        service.RunMainRedispatch = function(data,agentId) {
            var deffered = $q.defer();

            action_running_redispatch.data = data;
            action_running_redispatch.params.username = $cookies.get('username');
            action_running_redispatch.params.agentId = agentId;

            $http(action_running_redispatch).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var file_type_detail_input_custom = {
            method: 'POST',
            //url: ServerConfig.production + '/neta/wifiid/search/file_queue_custom',
            url: ServerConfig.production + '/neta/wifiid/search/file_queue_custom_status',
            headers: {},
            params:{}
        };

        service.FileQueueCustom = function(data) {
            var deffered = $q.defer();

            file_type_detail_input_custom.data = data;

            $http(file_type_detail_input_custom).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var agent_process = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/agent/list_agent?action=FROM_SCH',
            headers: {}
        };
        service.GetListAgent = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(agent_process).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var agent_process_manual = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/agent/list_agent?action=MANUAL_ACTION',
            headers: {}
        };
        service.GetListAgentManual = function() {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            $http(agent_process_manual).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        var agent_process_update = {
            method: 'GET',
            url: ServerConfig.production + '/neta/wifiid/agent/update_list_agent',
            headers: {},
            params:{agentName:'',action:'',username:''}
        };
        service.UpdateListAgent = function(agent,action,username) {
            ////$log.info('param : '+param);
            var deffered = $q.defer();
            agent_process_update.params.agentName = agent;
            agent_process_update.params.action = action;
            agent_process_update.params.username = username;

            $http(agent_process_update).
                success(function(data,status,headers) {
                    deffered.resolve(data);
                }).error(function(data,status){
                    $log.error(status);
                });
            return deffered.promise;
        };

        return service;
    })
;