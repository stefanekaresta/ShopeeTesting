angular
    .module('altairApp')
    .controller('main_headerCtrl',
        function ($timeout, $scope, $window, $state, $location, $cookies, $log, $interval, SessionConstruct) {
            //console.log("HEADER CONTROLLER");
            var oke = $cookies.get('session_iserve');
            //console.log("MY SESSION UNTIL: "+oke);

            if (true) {
                var adit = localStorage.getItem('data_user_employee');
                if (adit != null && adit != '' && adit != undefined) {
                    var data = JSON.parse(adit);
                    //console.log("ivanlog" + JSON.stringify(data))
                    $scope.defaultProfilePict = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8NDw8QDw8OEA4PDw8NEA8QDw8ODxAPFhIXFiARExMYHSggGBolHRUTITIhJykrLi4uFx8zODMuNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAMwAzAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABAUGAwEC/8QANBABAAIBAQUFBgUEAwAAAAAAAAECAxEEBSExUSJBYXGBEhMyobHBBlJy0eEjQmKRM5Ki/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AN6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACdsO7b5eM9mnWec+UAhJGLYct+WO2nWezHzaLZthx4vhrGv5p42/2kgzcbnzdK/8AZ833Tmj+2J8phpgGPy4bU+Ktq+cTDm2VqxMaTETHSeMK3bNz0txx9i3T+2f2Bnx0zYbY7TW0TEx8/JzAAAAAAAAAAAAAAABI2DZpzXivdztPSoJm6N3e87d47HdH5p/ZfxGjylYrERHCIjSIfQAAAAAAI+2bJXNXS3Put3xLL7RhtjtNbRxj5x1hsFdvnZPeU9qI7VOPnXvgGcAAAAAAAAAAAAAAX+4MOlJv32nSP0x/OqgazYKezixx/jAJAAAAAAAADyXoDJ7fh93kvXu11jynijrX8QU0yVnrX6SqgAAAAAAAAAAAAGw2f4Kfpr9GPardmT2sOOfDSfOOAJQAAAAAAAAAKP8AEXPH5WU6z39k1yxH5a6es8VYAAAAAAAAAAAAAuvw/n+LHP64+k/ZSumz5Zx2raOcTr5+ANgOWzZ65KxavKflPR1AAAAAAAfN7RETM8ojWX0p9+bZpHuqzxn4vCOgKjacvvL2tP8AdMz6OQAAAAAAAAAAAAAAAmbu26cNutJ+Kv3hpMGauSsWrOsSyERry4ytt27DnrMWi3u474njrHjUF6PIegAAAjbbjyXrpjvFZ8Y5+vcCPvLeUYomtdJyfKvjP7M7a0zMzM6zM6zPi7bTsuTFPbrMePOJ9XAAAAAAAAAAAAAAABK2LYb5p4cKxztPL+Zdd2bvnNPtW4Y4n1t4Q0eOkViIrEREcogEfZNhx4Y7Ma277Txn+EoAAAAAAAfNqxaNJiJie6eMKjb9z87YuH+Gv0lcgMZaJiZiY0mOEw8aXeW7ozRrGkZI5T18JZzJSazMTGkxOkwD5AAAAAAAAAAS93bHOa3SkcbT9kbHSbTFYjWZnSIavYtmjDSKx6z1nqDrjpFYiIjSI4RHR9AAAAAAAAAAAArt7bB72vtVj+pX/wBR0WIDGPFrvvY/Yt7ysdm06W8LdfVVAAAAAAAA9rGsxEc5nSAXG4Nl1mckxy7NfPvlduOy4fd0rWO6NPV2AAAAAAAAAAAAAABz2jDGStqzymNPLxZLLjmlrVnnWZiWxUO/8Glq3jlbhPnH8fQFSAAAAAAnbmw+3mr0r20Fd/h3HwyW8YrH1/YFyAAAAAAAAAAAAAAAAh72w+3ht1r2o9Ex5aNYmJ5TGgMYPrJX2ZmJ5xMxPnEvkAAAABpNx10wx42tP2+zNtRur/hx+X3BMAAAAAAAAAAAAAAAAB4DLbzrpmyfq1/3GqKn77j+tbyr9EAAAH//2Q==';

                    var userprofile = data.npk;
                    $scope.dataemployee = data.account.name;
                    if (userprofile != null && userprofile != ''
                        && userprofile != undefined) {
                        $scope.profilepicture = 'http://iserveu.ag-it.com:30120/download/profpict/' + userprofile + '.png' + '.1';
                    } else {
                        $scope.profilepicture = $scope.defaultProfilePict;
                    }
                } else {
                    //console.log("LOCAL STORAGE EMPLOYEE UNDEFINED;");
                    clearSession();
                }
            } else {
                //console.log("SESSION UNDEFINED;");
               // clearSession();
            }

            function clearSession() {
                SessionConstruct.destroy();
            }


            $scope.loggedOut = function () {
                //$log.info('logged out');
                //$cookies.put('isAuthenticated',0);

                localStorage.clear();

                var cookies = $cookies.getAll();
                angular.forEach(cookies, function (v, k) {
                    $cookies.remove(k);
                });
                $location.path('/login');
                $state.go('login');
                $timeout(function () {
                    $window.location.reload();
                }, 500);
            };

            $scope.user_data = {
                name: "Lue Feest",
                avatar: "assets/img/avatars/avatar_11_tn.png",
                alerts: [],
                messages: []
            };


            $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function () {
                $timeout(function () {
                    $($window).resize();
                }, 280)
            });

            // autocomplete
            $('.header_main_search_form').on('click', '#autocomplete_results .item', function (e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr('href'));
                $('.header_main_search_input').val('');
            })

            $scope.counter = 0;
            $scope.inAction = false;
            var increaseCounter = function () {
                if ($scope.inAction == false) {
                    $scope.inAction = true;
                    var oke = $cookies.get('session_iserve');
                    var session = new Date(oke);
                    var dateNow = new Date();

                    if (oke != undefined && oke != '' && oke != null) {
                        if (session.getTime() < dateNow.getTime()) {
                            clearSession();
                            alert("Your session is expired");
                            $timeout(function () {
                                $window.location.reload();
                            }, 500);
                        } else {

                            //console.log("SESSION STILL VALID UNTIL: " + oke);
                        }
                    } else {
                        clearSession();
                    }

                    $scope.inAction = false;
                }
            }

            $interval(increaseCounter, 1000);

        }
    )
;