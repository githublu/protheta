/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('MinionCraft')
	.factory('userPreference', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('userPreference');
			});
	})

	.factory('api', function ($http) {
		'use strict';

		var store = {
			todos: [],

			clearCompleted: function () {
				var originalTodos = store.todos.slice(0);

				var completeTodos = [];
				var incompleteTodos = [];
				store.todos.forEach(function (todo) {
					if (todo.completed) {
						completeTodos.push(todo);
					} else {
						incompleteTodos.push(todo);
					}
				});

				angular.copy(incompleteTodos, store.todos);

				return $http.delete('/api/todos')
					.then(function success() {
						return store.todos;
					}, function error() {
						angular.copy(originalTodos, store.todos);
						return originalTodos;
					});
			},

			delete: function (todo) {
				var originalTodos = store.todos.slice(0);

				store.todos.splice(store.todos.indexOf(todo), 1);

				return $http.delete('/api/todos/' + todo.id)
					.then(function success() {
						return store.todos;
					}, function error() {
						angular.copy(originalTodos, store.todos);
						return originalTodos;
					});
			},

			get: function () {
				return $http.get('/api/todos')
					.then(function (resp) {
						angular.copy(resp.data, store.todos);
						return store.todos;
					});
			},

			getAll: function () {
				return null;
			},

			insert: function (key, todo) {
				var originalTodos = store.todos.slice(0);

				return $http.post('/api/todos', todo)
					.then(function success(resp) {
						todo.id = resp.data.id;
						store.todos.push(todo);
						return store.todos;
					}, function error() {
						angular.copy(originalTodos, store.todos);
						return store.todos;
					});
			},

			put: function (todo) {
				var originalTodos = store.todos.slice(0);

				return $http.put('/api/todos/' + todo.id, todo)
					.then(function success() {
						return store.todos;
					}, function error() {
						angular.copy(originalTodos, store.todos);
						return originalTodos;
					});
			}
		};

		return store;
	})

	.factory('userPreference', function ($q) {
		'use strict';

		var indexedDB = {

			_getFromDb: function (key) {
				return JSON.parse(localStorage.getItem(key) || '[]');
			},

			_deleteFromDb: function (key) {
				return JSON.parse(localStorage.removeItem(key) || '[]');
			},

			_saveToDb: function (key, todos) {
				localStorage.setItem(key, JSON.stringify(todos));
			},

			__init: function ()
			{
         		var request = window.indexedDB.open("indexeddb", 1);
         		//db = checkDbRequest(request);

         		request.onerror = function(event) {
		           console.log("error: ");
		        };
		        
		        request.onsuccess = function(event) {
		           db = request.result;
		           console.log("success: "+ db);
		        };
		        
		        request.onupgradeneeded = function(event) {
		           var db = event.target.result;
		           var objectStore = db.createObjectStore("preference", {keyPath: "key"});
		        }

         		// if (db == -2) 
         		// {
         		// 	return -2;
         		// }

         		return 0;
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				return deferred.promise;
			},

			delete: function (todo) {
				var deferred = $q.defer();

				return deferred.promise;
			},

			get: function (key) {
				var transaction = db.transaction(["indexeddb"]);
				var objectStore = transaction.objectStore("preference");
				var request = objectStore.get(key);
				return checkDbRequest(request);
			},

			getAll: function () {
				var deferred = $q.defer();

				return deferred.promise;
			},

			insert: function (app) {
				if (indexedDB.__init() == 0)
				{
					var request = db.transaction(["indexeddb"], "readwrite")
					.objectStore("preference")
					.add(app);
					            request.onsuccess = function(event) {
               alert("Kenny has been added to your database.");
            };
            
            request.onerror = function(event) {
               alert("Unable to add data\r\nKenny is aready exist in your database! ");
            }
					//return checkDbRequest(request);
				}
				else
				{
					return -1;
				}
			},

			put: function (todo, index) {
				var deferred = $q.defer();

				return deferred.promise;
			}
		};

		return indexedDB;
	});

function checkDbRequest(request)
{
	request.onerror = function(event) {
		return -2;
	};
	request.onsuccess = function(event) {
		return request.result;
	};
}