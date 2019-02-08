angular
    .module('altairApp')
    .controller('dashboard2Ctrl',
        function ($rootScope,$scope,SummaryReportFactory,$interval,$timeout,variables,$filter,$window,
                  $compile,$log,show_config_ui_month,show_config_ui_year,show_config_ui_file_id,ReconstructMenu) {
            ReconstructMenu.Init();

            var listDays = $scope.listDays = [];
            /*var listDays = $scope.listDays = [
             '01','02','03','04','05','06','07','08','09','20','21','22','23','24','25','26','27','28','29','30','31'
             ];
             */
            var listHours = $scope.listHours = [
                '00','01','02','03','04','05','06','07','08','09','20','21','22','23'
            ];

            $scope.dash_chart = {
                x:['hour'],
                y:['count']
            };

            var c3chart_test = 'c3_chart_spline_test';

            if ( $('#'+c3chart_test).length ) {

                var chart_test = c3.generate({
                    bindto: '#'+c3chart_test,
                    data: {
                        columns: [],
                        type: 'spline'
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: listHours
                        }
                    }
                });
            }

            /*$timeout(function(){
                chart_test.unload({
                    ids: 'data3'
                });
            },10000);

            $timeout(function(){
                chart_test.load({
                    columns: [
                        ['data3', 1135, 2500, 3500, 1900, 3090, 3058, 3150, 2160, 1750]
                    ]
                });
            },15000);*/




            // spline chart
            var c3chart_spline_id = 'c3_chart_spline';

            if ( $('#'+c3chart_spline_id).length ) {

                var c3chart_spline = c3.generate({
                    bindto: '#'+c3chart_spline_id,
                    data: {
                        columns: [
                            $scope.dash_chart.x,
                            $scope.dash_chart.y
                        ],
                        type: 'spline'
                    },
                    color: {
                        pattern: ['#5E35B1', '#FB8C00']
                    }
                });

                $($window).on('debouncedresize', c3chart_spline.resize());

                $scope.$on('$destroy', function () {
                    $($window).off('debouncedresize', c3chart_spline.resize());
                    c3chart_spline.destroy();
                });

            }

            $scope.notification = {
                select:true,
                mainTable:false,
                errorMsg: false,
                viewDetail:false
            };

            $scope.selectedData = {
                "_id":"1",
                "dateHour" : "",
                "fileId" : "",
                "fileOutputId" : "",
                "dataTargetName" : "",
                "date" : "",
                "hour" : "",
                "count" : 0,
                "outputFiles":[]
            };

            $scope.listYears = show_config_ui_year;
            $scope.listMonth = show_config_ui_month;
            $scope.listFileId = show_config_ui_file_id;

            $scope.listDataName = [
                {id:1,title:'TSEL',value:'TSEL'},
                {id:2,title:'DWH',value:'DWH'},
                {id:3,title:'BOINGO',value:'BOINGO'},
                {id:4,title:'SAMSUNG',value:'SAMSUNG'},
                {id:5,title:'RADNET',value:'RADNET'},
                {id:5,title:'IPASS_1',value:'IPASS_1'},
                {id:5,title:'IPASS_2',value:'IPASS_2'},
                {id:5,title:'NUSANET',value:'NUS'},
            ];

            $scope.selectize_a_config = {
                plugins: {
                    'disable_options': {
                        disableOptions: ["c1","c2"]
                    }
                },
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title'
            };




            var test_data = $scope.test_data = [];

            $scope.submit = function(v_year,v_month,v_fileId,v_dataTargetName) {
                //$rootScope.content_preloader_show();
                if (v_year == null || v_month == null || v_fileId == null || v_dataTargetName == null ) {
                    ////$log.info('select data first');
                    $scope.notification.errorMsg = true;
                    //$rootScope.content_preloader_hide();
                } else {
                    $scope.notification.errorMsg = false;
                    $scope.notification.mainTable = true;
                    var temp = {
                        //"date":v_year+v_month,
                        "dateHour":v_year+v_month,
                        "fileId":v_fileId,
                        "dataTargetName":v_dataTargetName
                    };
                    listDays = $scope.listDays = getDaysInMonth(parseInt(v_month)-1,parseInt(v_year));
                    SummaryReportFactory.SummaryCompletenessReport(temp)
                        .then(function(data){
                            var test_data = $scope.test_data = [];
                            angular.forEach(listDays, function(days) {
                                test_data[days]=[];
                                angular.forEach(listHours, function(hours) {
                                    var val_test = $filter('filter')(data, {dateHour:v_year+v_month+days+hours})[0];
                                    test_data[days][hours] = val_test;
                                });

                            });

                        }, function(data){
                            ////$log.info('error, data : '+data);
                            //$rootScope.content_preloader_hide();
                        });
                }
            };

            $scope.showDetail = function(data) {
                ////$log.info('data : '+JSON.stringify(data));
                $scope.selectedData = data;

                $scope.notification.mainTable = false;
                $scope.notification.viewDetail = true;
            };

            $scope.backToSearch = function() {
                $scope.notification.mainTable = true;
                $scope.notification.viewDetail = false;
                $scope.selectedData = {};
            };

            InitData();

            /////////////////////////////////////
            function getDaysInMonth(month, year) {
                var date = new Date(year, month, 1);
                var days = [];
                while (date.getMonth() === month) {
                    var t_date = ''+new Date(date).getDate();
                    var t_date_final = '';
                    if (t_date.length === 1) {
                        t_date_final = '0'+t_date;
                    } else {
                        t_date_final = ''+t_date;
                    }
                    days.push(t_date_final);
                    date.setDate(date.getDate() + 1);
                }
                return days;
            }

            function InitData() {
                var _d = new Date();
                var _month = _d.getMonth()+1;
                var _year = _d.getFullYear();
                var t_month = ''+_month;
                if (t_month.length == 1) {
                    t_month = '0'+_month;
                }
                var _yearMonth = ''+_year+''+t_month;
                $scope.notification.mainTable = true;

                $scope.selectedYear = ''+_year;
                $scope.selectedMonth = ''+t_month;
                $scope.selectedFileId = ''+$scope.listFileId[0];
                $scope.selectedTarget = ''+$scope.listDataName[0].value;

                var temp = {
                    "dateHour":_yearMonth,
                    "fileId":$scope.listFileId[0],
                    "dataTargetName":$scope.listDataName[0].value
                };
                listDays = $scope.listDays = getDaysInMonth(parseInt(t_month)-1,parseInt(_year));
                SummaryReportFactory.SummaryCompletenessReport(temp)
                    .then(function(data){
                        var test_data = $scope.test_data = [];
                        angular.forEach(listDays, function(days) {
                            test_data[days]=[];
                            //$scope.dash_chart.x.push(days);
                            angular.forEach(listHours, function(hours) {
                                var _temp_var = $filter('filter')(data, {dateHour:_year+t_month+days+hours})[0];
                                test_data[days][hours] = _temp_var;
                                //$scope.dash_chart.y.push(_temp_var);
                            });
                        });

                        // spline chart


                        //$rootScope.content_preloader_hide();
                    }, function(data){
                        ////$log.info('error, data : '+data);
                        //$rootScope.content_preloader_hide();
                        //$rootScope.content_preloader_hide();
                    });

            }

            /////////////////////////////////////////////////////////////////////////////////


            /////////////////////////////////////
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

        }

    )
    .factory('SummaryReportFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var summary_completeness_report = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/search/summary_completeness_report',
            headers: {},
            params:{}
        };

        service.SummaryCompletenessReport= function(data) {
            var deffered = $q.defer();

            summary_completeness_report.data = data;

            $http(summary_completeness_report).
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