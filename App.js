/*(function () {
    'use strict';
    
    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService',MenuSearchService);
    //.directive('foundItem', foundItem);
    

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var menu = this;
      var promise = MenuSearchService.getMenuCategories();
      
    
      promise.then(function (response) {
        menu.menu_items = response.data;
        console.log("then")
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });
    
      menu.logMenuItems = function (shortName) {
        console.log("short_nme")
        var promise = MenuSearchService.getMenuForCategory(shortName);
    
        promise.then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
      };
    
    }
    
    
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      console.log("kjdf2"); 
      var service = this;
      service.getMenuCategories = function () {
        var response = $http({
          method: "GET",  
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        });
    
        return response;
      };
    
    
      service.getMenuForCategory = function (shortName) {
        console.log("kjdf"); 
        var response = $http({
          method: "GET",
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json',
          params: {
            menu_items: shortName
          }
        });
        
        return response;
             };
    
    }
    
    })();*/
    
    (function () {
      'use strict';
      angular.module('NarrowItDownApp', [])
          .controller('NarrowItDownController', NarrowItDownController)
          .controller('FoundController', FoundController)
          .service('MenuSearchService', MenuSearchService)
          .directive('foundItems', FoundItems)
          .filter('match', getMatched);
  
  
  
      // Controller NarrowDown
      NarrowItDownController.$inject = ['MenuSearchService','$scope'];
      function NarrowItDownController(service) {
          var narrow = this;
          narrow.items = [];
          narrow.error = service.Message;
          narrow.keyValue = '';
        
         service.fetchData().then(
              (res) => {
                 // narrow.items = res.data.menu_items;
                  narrow.error = service.Message;
              }
          ).catch(
              (error) => narrow.error = error.message
          );
          narrow.search = () => {
            if(narrow.keyValue===""){
              narrow.errormsg="Please Enter Something....";
            }
            else{
              narrow.items = service.getMatchedMenuItems(narrow.keyValue);
              narrow.error = service.Message;
              narrow.errormsg="";
            }
              
          }
      }
  
  
      // Filter Match
      function getMatched() {
          return (des, keyValue, id) => {
              keyValue = keyValue || '';
              keyValue = keyValue.toLowerCase();
              if (keyValue !== '')
                  $('.description'+id).html(des.replace(keyValue, ('<span class=highlight>' + keyValue + '</span>')));
              else return des;
          }
      }
  
  
      // Directive for items Found
      function FoundItems() {
          var ddo = {
              templateUrl: 'foundItem.html',
              scope: {
                  items: '<',
                  keyValue: '<',
                  errorMsg: '<'
              },
              controller: FoundController,
              controllerAs: 'fitems',
              bindToController: true
          };
          return ddo;
      }
  
  
  
      // Directive Controller
      FoundController.$inject = ['MenuSearchService'];
      function FoundController(service) {
          var fitems = this;
          console.log(fitems.items);
          fitems.items = service.getMatchedMenuItems(fitems.keyValue);
          fitems.onRemove = (index) =>{
              var item = fitems.items.splice(index, 1);
          }
      }
  
  
  
      // Service 
      MenuSearchService.$inject = ['$http'];
      function MenuSearchService($http) {
          var service = this;
          var items = [];
          service.Message = "Loading...";
          service.fetchData = () => {
              console.log("Entered into FetchData");
              var response = $http({
                  method: 'GET',
                  url: 'https://davids-restaurant.herokuapp.com/menu_items.json',
              });
              response.then(
                  (res) => items = res.data.menu_items,
                  (res) => service.message = "something Went wrong !!!"
              )
              return response;
          }
          service.getMatchedMenuItems = function (keyValue) {
              var found = [];
              keyValue = keyValue || '';
              keyValue = keyValue.toLowerCase();
              if (items.length>0)
                  items.forEach(function (value) {
                      var des = value.description;
                      if (des.toLowerCase().indexOf(keyValue) !== -1) found.push(value);
                  });
              if (found.length <= 0) service.Message = "Element Not Found !!!";
              return found;
          }
      }
  })();