var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl: './login.html',
            controller: 'loginCntrl'
        })
        .when('/register', {
            templateUrl: './register.html',
            controller: 'regCntrl'
        })
        .when('/home', {
            templateUrl: './home.html',
            controller: 'homeCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        })
        .when('/postjob', {
            templateUrl: './postjob.html',
            controller: 'postjobCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        })
        .when('/searchjob', {
            templateUrl: './searchjob.html',
            controller: 'searchjobCntrl',
            resolve: {
                message: function(storeService){
                    return storeService.checkValidity();
                }
            }
        });
    //for removing hash
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('postjobCntrl',['$scope','$location','$http','$window', function ($scope, $location, $http,$window) {
    var obj = {};
    var uid = $window.sessionStorage.getItem("userId");
    $scope.reg = function(validity) {
        $scope.submitted = false;
        if (validity) {
            obj.title = this.jobtitle;
            obj.description = this.jobdescription;
            obj.location = this.location;
            $http({
                method: 'POST',
                url: 'job/new',
                headers: {
                    'authorization' : uid
                  },
                data: obj,
               
            }).then(function(response){
                if(response.data.data) {
                    alert("Job added successfully");
                } else {
                    alert("Error adding job");
                }
            });;
            
            $scope.jobtitle = "";
            $scope.jobdescription = "";
            $scope.location = "";
        }
        else
            $scope.submitted = true;
    };

    $scope.back = function () {
        $location.path('/home');
    }

    $scope.hide = function () {
        $scope.appliedTab = false;
    }

    $scope.applied = function () {

        
        var uid = $window.sessionStorage.getItem("userId");
        $http({
            method: 'GET',
            url: 'jobapplication/applied',
            headers: {
                'authorization' : uid
              },
        }).then(function(response){
    
            $scope.messages = response.data.data;
        });
        $scope.appliedTab = true;
    }
}]);

app.controller('homeCntrl',['$scope','$location','$http','$window', function ($scope, $location, $http,$window) {
    var uid = $window.sessionStorage.getItem("userId");
   
    $http({
        method: 'GET',
        url: 'user/' + uid
    }).then(function(response){

        var resObj = [];
        resObj = response.data.data;
        $scope.name = resObj.user.name;
      
        if(resObj.user.role === 1) {
            $scope.postj = true; $scope.sj = false;
        }
        else{
            $scope.postj = false; $scope.sj = true;
        }
    });

    $scope.prof = function () {
        $location.path('/postjob');
    };

    $scope.searchjob = function () {
        $location.path('/searchjob');
    };

    $scope.logout = function () {
        $window.sessionStorage.clear();
        $location.path('/');
    };
}]);

app.controller('searchjobCntrl',['$scope','$location','$http','$window', function ($scope, $location, $http,$window) {

    var uid = $window.sessionStorage.getItem("userId");
    $http({
        method: 'GET',
        url: 'job/all',
        headers: {
            'authorization' : uid
          },
    }).then(function (response) {
        $scope.messages = response.data.data;
    });

    $scope.back = function () {
        $location.path('/home');
    };

    $scope.reset = function () {
        $scope.searchFish.jobtitle = "";
    };

    $scope.apply = function (jid) {
        var obj = {};
        obj.jid = jid;
        $http({
            method: 'POST',
            url: 'jobapplication/apply',
            headers: {
                'authorization' : uid,
              },
            data:obj
           
        }).then(function(response){
            if(response.data.data) {
                alert("Job applied successfully");
            } else {
                alert("Error applying job");
            }
        });;
        $location.path('/home');
    };
}]);

app.controller('loginCntrl',['$scope','$location','$http','$window', function ($scope, $location, $http,$window) {

    $scope.verify = function () {
        var obj = {
            username: $scope.uname,
            password: $scope.password
        };
        $http({
            method: 'POST',
            url: 'auth/login',
            data: obj
        }).then(function(response){
            if(response.data.uid) {
                $window.sessionStorage.setItem("userId",parseInt(response.data.uid));
              
                $location.path('/home');
            } else {
                $scope.alrt = 0;
            }
        });
    };

    $scope.register = function () {
        $location.path('/register');
    };
}]);

app.controller('regCntrl',['$scope','$location','$http', function ($scope, $location, $http) {
    var obj = {};
    var temp;
    $scope.toggleDiv = function(){
        if(this.usertype === "1")
        {
            $scope.rec = true;
        }else{
            $scope.can = true;
        }
    }
    $scope.reg = function(validity) {
        $scope.submitted = false;
        if (validity) {
            obj.firstName = this.firstname;
            obj.lastName = this.lastname;
            obj.password = this.password;
            obj.email = this.email;
            obj.mobile = this.phone;
            obj.userType = this.usertype;
            obj.position = this.position;
            obj.company = this.company;
            obj.highestEducation = this.education;
            obj.experience = this.experience;
            var flag = 0;
            $http.post('user/new', obj).then(function(response){
                if(response.data.data) {
                    alert("Registration Successful!!! Please login");
                    $location.path('/');
                    
                } else {
                    alert("user already exists, please change name and email");
                }
            });
        }
    }}]);

app.factory('storeService',['$q','$http','$window', function($q, $http,$window){
    var store = {
        checkValidity: function(){
            var defer = $q.defer();
            var uid = $window.sessionStorage.getItem("userId");

            $http({
                method: 'GET',
                url: 'user/' + uid
            }).then(function (response) {
                if(response.data)
                    defer.resolve();
                else
                    defer.reject();
            });
            return defer.promise;
        }
    };
    return store;
}]);

