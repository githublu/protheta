/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('MinionCraft')
	.factory('todoStorage', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
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

	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'todos-angularjs';

		var store = {
			todo: {},
			todos: [],
			todoKeys: [],
			apps: [],

			_getFromLocalStorage: function (key) {
				return JSON.parse(localStorage.getItem(key) || '[]');
			},

			_deleteFromLocalStorage: function (key) {
				return JSON.parse(localStorage.removeItem(key) || '[]');
			},

			_saveToLocalStorage: function (key, todos) {
				localStorage.setItem(key, JSON.stringify(todos));
			},

			_saveAppToLocalStorage: function (appName, app) {
				var existingApp = JSON.parse(localStorage.getItem(appName) || '[]');
				app.lastUpdateTime = new Date().toLocaleString();
				if (existingApp != []) {
					app.frequency = app.frequency + 1;
				}
				else
				{
					app.frequency = 1;
				}

				localStorage.setItem(appName, JSON.stringify(app));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var completeTodos = [];
				var incompleteTodos = [];
				store.todos.forEach(function (todo) {
					if (todo.completed) {
						store.delete(todo);
					}
				});
				
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			delete: function (todo) {
				var deferred = $q.defer();

				store.todos.splice(store.todos.indexOf(todo), 1);

				store._deleteFromLocalStorage(todo.key);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			deleteApp: function (appName) {
				var deferred = $q.defer();

				store._deleteFromLocalStorage(appName);
				deferred.resolve(true);

				return deferred.promise;
			},

			get: function (key) {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(key), store.todo);
				deferred.resolve(store.todo);

				return deferred.promise;
			},

			getAll: function () {
				var deferred = $q.defer();
				store.todoKeys = [];
				store.todos = [];
				for(var i=0, len=localStorage.length; i<len; i++) {
					var key = localStorage.key(i);
					if (key.length != 36) {continue;}
				    store.todoKeys[key] = localStorage[key];
    				store.todos.push(localStorage[key]);
				}
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			getAllApps: function () {
				var deferred = $q.defer();
				var apps = [];
				for(var i=0, len=localStorage.length; i<len; i++) {
					var key = localStorage.key(i);
					if (key.length == 36) {continue;}
				    apps.push(localStorage[key]);
				}
				deferred.resolve(apps);

				return deferred.promise;
			},

			insert: function (key, todo) {
				var deferred = $q.defer();

				store.todos[key] = todo;

				store._saveToLocalStorage(key, todo);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			put: function (todo, index) {
				var deferred = $q.defer();
				store.todos[index] = todo;

				store._saveToLocalStorage(index, todo);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			addUserPreferences: function(appName, app)
			{
				var deferred = $q.defer();

				store._saveAppToLocalStorage(appName, app);
				deferred.resolve(true);

				return deferred.promise;
			}
		};

		return store;
	});
