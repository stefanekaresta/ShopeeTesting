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