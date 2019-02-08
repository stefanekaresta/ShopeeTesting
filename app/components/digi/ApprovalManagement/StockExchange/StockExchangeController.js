angular
    .module('altairApp')
    .controller('digiAllcustomer',
        function ($scope, $rootScope, utils, $cookies, $log, $location, CommonService,
                  ReconstructMenu, $filter, $timeout, $window, NotificationService, ForeignManagementModuleFactory) {
            ReconstructMenu.Init();
            $scope.resultData = [];
            $scope.isidetail = [];
            $scope.currency = {
                options: []
            };
            $scope.vm = {};

            $scope.currency = {
                value: 10.00
            };

            $scope.showApp = false;
            $scope.showAdd = true;

            $scope.selectize_notebook_type_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Currency',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'id',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title'
            };

            getCurrency();
            $scope.currency.options = [
                {
                    id: "001",
                    title: "USD",
                    value: "USD",
                    desc: "USD - United States Dollar",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "002",
                    title: "CAD",
                    value: "CAD",
                    desc: "CAD - Canadian Dollar",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "003",
                    title: "IDR",
                    value: "IDR",
                    desc: "IDR - Indonesian Rupiah",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "004",
                    title: "GBP",
                    value: "GBP",
                    desc: "GBP - Pound sterling",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "005",
                    title: "CHF",
                    value: "CHF",
                    desc: "CHF - Swiss Franc",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "006",
                    title: "SGD",
                    value: "SGD",
                    desc: "SGD - Singapore Dollar",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "007",
                    title: "INR",
                    value: "INR",
                    desc: "INR - Indian Rupee",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "008",
                    title: "MYR",
                    value: "MYR",
                    desc: "MYR - Malaysian Ringgit",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "009",
                    title: "JPY",
                    value: "JPY",
                    desc: "JPY - Japanese Yen",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "010",
                    title: "KRW",
                    value: "KRW",
                    desc: "KRW - South Korean Won",
                    desc2 : "1 USD =",
                    parent_id: ""
                },
                {
                    id: "011",
                    title: "EUR",
                    value: "EUR",
                    desc: "EUR - EURO",
                    desc2 : "1 USD =",
                    parent_id: ""
                }
                ,
                {
                    id: "012",
                    title: "BRL",
                    value: "BRL",
                    desc: "BRL - Brazillian",
                    desc2 : "1 USD =",
                    parent_id: ""
                }
            ];

            function getCurrency() {
                var success = function (data) {
                    //alert("masuk employee");
                    var tampung = data.rates;
                    // console.log("awal" + JSON.stringify(tampung))
                };
            
                var error = function (data) {
                    //////console.log('Error');
                };

                ForeignManagementModuleFactory.getDataCurrency().then(success, error);
            }


            $scope.getCurrencyCount = function ()  {
                var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait ... <br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
                var success = function (data) {

                    var find = $scope.request.currency;
                    var data = data.rates;
                    $scope.HasilAkhir = data[find];
                    // console.log("balikan" + JSON.stringify($scope.HasilAkhir));
                    var result = $filter('filter')($scope.currency.options, {title: $scope.request.currency});
                    if (result.length > 0) {
                        var sg = result[0];
                        $scope.desc1 = sg.desc;
                        $scope.desc2 = sg.desc2;
                    }
                    $scope.desc2 =$scope.currency.options[0].desc2 + "" + $scope.HasilAkhir;
                    // alert($scope.HasilAkhir)
                    modal.hide();
                };

                var error = function (data) {
                    //////console.log('Error');
                };

                ForeignManagementModuleFactory.getDataCurrency().then(success, error);
            }


            $scope.submitData = function () {

                var x = $scope.currency.value;
                var aaa =  parseInt($scope.HasilAkhir);
                var jumlah = (x * $scope.HasilAkhir).toFixed(2);
                var output = (jumlah/1000).toFixed(3);
                var data = {
                    amount: formatNumber(jumlah),
                    desc1: $scope.desc1,
                    desc2: $scope.desc2,
                    currency: $scope.request.currency,
                    amountawal : $scope.HasilAkhir
                };
                $scope.isidetail.push(data);
                // console.log("aaaa" + JSON.stringify($scope.isidetail))
                $scope.showApp = false;
                $scope.showAdd = true;
                $scope.request.currency ="";
            };

            function formatNumber(num) {
                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }

            $scope.remove = function (item) {
                var index = $scope.isidetail.indexOf(item);
                $scope.isidetail.splice(index, 1);
            }

            $scope.addMore = function () {
                $scope.showApp = true;
                $scope.showAdd = false;
            }
            

            $scope.changeCurr = function () {
                for (var a = 0; a < $scope.isidetail.length; a++) {
                    var x = $scope.currency.value;
                    var aaa =  $scope.isidetail[a].amountawal;

                    var jumlah = (x * aaa).toFixed(2);;
                    var output = (jumlah/1000).toFixed(3);
                    $scope.isidetail[a].amount = formatNumber(jumlah);
                }
            }

        }
    );