angular
    .module('altairApp')
    .controller('createUserCtrl',function ($rootScope,$scope,$interval,$timeout,$compile,$log,
                                           ReconstructMenu,$filter,get_menu_roles_list,CreateUserFactory) {
        ReconstructMenu.Init();
        //$log.info('CREATE USER CONTROLLER');
        //--------------------------------------------------------------------------------------------------------------
        // validation form for create user
        var $formCreateUser = $('#form_create_user');
        $formCreateUser
            .parsley()
            .on('form:validated',function() {
                $scope.$apply();
            })
            .on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });
        //--------------------------------------------------------------------------------------------------------------
        // Init Variable
        $scope.user = {
            username:'',
            password:'',
            startDate:null,
            endDate:null,
            enable:false,
            expired:false,
            credentialExpired:false,
            firstname:'',
            middlename:'',
            lastname:'',
            address:[],
            phone:[],
            mobilephone:[],
            fax:[],
            email:'',
            re_password:'',
            selectedMenuRoles:''
        };
        $scope.startdate=null;
        $scope.enddate=null;
        $scope.notification = {
            password_validation_wrong:false,
            password_validation_right:false
        };
        // Init List MenuRoles
        $scope.listRolesMenu = [];
        $scope.selectedRolesMenu = {};
        var rolesMenu = {id:'',title:'',value:''};
        var InitListMenuRoles = function() {
            angular.forEach(get_menu_roles_list, function(value, key) {
                ////$log.info('value : '+JSON.stringify(value)+'key : '+key);
                rolesMenu = {id:'',title:'',value:''};
                rolesMenu.id = key;
                rolesMenu.title = value.rolesName;
                rolesMenu.value = value.menuRolesId;
                $scope.listRolesMenu.push(rolesMenu);
            });
        };
        InitListMenuRoles();
        //--------------------------------------------------------------------------------------------------------------
        // action config
        $scope.selectize_a_config = {
            plugins: {
                'disable_options': {
                    disableOptions: ["a1","c2"]
                }
            },
            create: false,
            maxItems: 1,
            placeholder: 'Select one...',
            optgroupField: 'parent_id',
            optgroupLabelField: 'title',
            optgroupValueField: 'ogid',
            valueField: 'value',
            labelField: 'title',
            searchField: 'title'
        };
        //--------------------------------------------------------------------------------------------------------------
        // action button
        $scope.changeDate = function(action,date){
            var myDate = null;
            var pattern = /(\d{4})(\d{2})(\d{2})/;
            if (action == 'start') {
                myDate = new Date(date.replace(pattern, '$1-$2-$3'));
                $scope.user.startDate = myDate;
                //myDate = $filter('date')($scope.user.startDate, "dd-MM-yyyy");
            } else if(action == 'end') {
                //myDate = $filter('date')($scope.user.endDate, "dd-MM-yyyy");
                myDate = new Date(date.replace(pattern, '$1-$2-$3'));
                $scope.user.endDate = myDate;
            }
        };
        $scope.StartValidation = function() {
            //$log.info('start validation');
        };
        $scope.PassValidation = function(){
            if ($scope.user.password != $scope.user.re_password) {
                //$log.info('not match');
                $scope.notification.password_validation_wrong = true;
            } else {
                //$log.info('match');
                $scope.notification.password_validation_right = true;
            }
            //$log.info(JSON.stringify($scope.notification));
        };
        $scope.AddData = function(action,data) { //--> to add data into list object dto
            if (action === 'phone') {
                if (angular.isUndefined($filter('filter')($scope.user.phone,data)[0])) {
                    $scope.user.phone.push(data);
                } else {
                    //$log.info('duplicate entry');
                }
            } else if (action === 'mobile_phone') {
                if (angular.isUndefined($filter('filter')($scope.user.mobilephone,data)[0])) {
                    $scope.user.mobilephone.push(data);
                } else {
                    //$log.info('duplicate entry');
                }
            } else if (action === 'address') {
                if (angular.isUndefined($filter('filter')($scope.user.address,data)[0])) {
                    $scope.user.address.push(data);
                } else {
                    //$log.info('duplicate entry');
                }
            } else if (action === 'fax') {
                if (angular.isUndefined($filter('filter')($scope.user.fax,data)[0])) {
                    $scope.user.fax.push(data);
                } else {
                    //$log.info('duplicate entry');
                }
            }
        };
        $scope.RemoveData = function(action,item) {
            if (action === 'phone') {
                var index = $scope.user.phone.indexOf(item);
                $scope.user.phone.splice(index, 1);
            } else if (action === 'mobile_phone') {
                var index = $scope.user.mobilephone.indexOf(item);
                $scope.user.mobilephone.splice(index, 1);
            } else if (action === 'address') {
                var index = $scope.user.address.indexOf(item);
                $scope.user.address.splice(index, 1);
            } else if (action === 'fax') {
                var index = $scope.user.fax.indexOf(item);
                $scope.user.fax.splice(index, 1);
            }
        };
        $scope.SubmitData = function() {
            //$log.info('user : '+JSON.stringify($scope.user));
            var success_user_insert = function(data) {
                //$log.info('Insert Success : '+data);
                $scope.user = {username:'',password:'',startDate:null,endDate:null,enable:false,expired:false,credentialExpired:false,firstname:'',middlename:'',lastname:'',address:[],phone:[],mobilephone:[],fax:[],email:'',re_password:'',selectedMenuRoles:''};
                $scope.startdate=null;
                $scope.enddate=null;
                $scope.address = "";
                $scope.phone = "";
                $scope.mobile_phone = "";
                $scope.fax = "";
                UIkit.modal.alert('Success!');
            };
            var error_user_insert = function(data) {
                $log.error('INSERT ERROR, '+JSON.stringify(data));
                UIkit.modal.alert('Success!');
            };
            CreateUserFactory.CreateUser($scope.user).then(success_user_insert,error_user_insert);

        };

        //--------------------------------------------------------------------------------------------------------------

        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------

    }
)
    .factory('CreateUserFactory', function($http,$q, $log,ServerConfig) {

        var service = {};

        var user_create = {
            method: 'POST',
            url: ServerConfig.production + '/neta/wifiid/insert/user',
            headers: {},
            params:{}
        };

        service.CreateUser = function(data) {
            var deffered = $q.defer();

            user_create.data = data;

            $http(user_create).
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