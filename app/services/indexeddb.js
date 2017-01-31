//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var request = window.indexedDB.open("indexedDB", 1);

request.onerror = function(event) {
   console.log("error: ");
};

request.onsuccess = function(event) {
   db = request.result;
   console.log("success: "+ db);
};

request.onupgradeneeded = function(event) {
   var db = event.target.result;
   var objectStore = db.createObjectStore("preference", {keyPath: "name"});
}

function read(name) {
   var transaction = db.transaction(["preference"]);
   var objectStore = transaction.objectStore("preference");
   var request = objectStore.get(name);
   
   request.onerror = function(event) {
      //alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
         return request.result;
      }
      else {
         return -1;
      }
   };
}


function readAll() {
   return new Promise(resolve => {
      var userApps = [];
      var objectStore = db.transaction("preference").objectStore("preference");
      
      objectStore.openCursor().onsuccess = function(event) {
         var cursor = event.target.result;
         
         if (cursor) {
            //alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
            userApps.push(cursor.value);
            cursor.continue();
         }
         else{
            resolve(userApps);
         }
      };
   });
}
         
function add(app) {
   var request = db.transaction(["preference"], "readwrite")
   .objectStore("preference")
   .put(app);
   
   request.onsuccess = function(event) {
      return 201;
   };
   
   request.onerror = function(event) {
      if (event.srcElement.error.code == 0) {
         console.log("update");
      }
      console.log(event);
      //alert(event);
      //alert("Unable to add data\r\nKenny is aready exist in your database! ");
   }
}

function remove() {
   var request = db.transaction(["preference"], "readwrite")
   .objectStore("preference")
   .delete("00-03");
   
   request.onsuccess = function(event) {
      console.log(event);
      //alert(event);
      //alert("Kenny's entry has been removed from your database.");
   };
}

function dropDB()
{
   var req = db.deleteDatabase("preference");
   req.onsuccess = function () {
       console.log("Deleted database successfully");
   };
   req.onerror = function () {
       console.log("Couldn't delete database");
   };
   req.onblocked = function () {
       console.log("Couldn't delete database due to the operation being blocked");
   };
}

function upsert(app)
{
   var objectStore = db.transaction(["preference"], "readwrite").objectStore("preference");
   var request = objectStore.get(app.name);
   request.onerror = function(event) {
      return 500;
   };
   request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = event.target.result;
      if (data) {
         app.frequency = data.frequency + 1;
      }
      else
      {
         app.frequency = 1;
      }

      // Put this updated object back into the database.
      var requestUpdate = objectStore.put(app);
      requestUpdate.onerror = function(event) {
        // Do something with the error
        return 500;
      };

      requestUpdate.onsuccess = function(event) {
        // Success - the data is updated!
        return 200;
      };
   };

}