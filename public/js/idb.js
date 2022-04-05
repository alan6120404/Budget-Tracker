// create variable to hold db connection
let db;
// establish a connection to IndexedDB database 
const request = indexedDB.open('transaction', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table), set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('transaction', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

// This function will be executed if we attempt to submit a new transaction and there's no internet connection
function saveRecord(record) {
    const transaction = db.transaction(['transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('transaction');
  
    // add record to your store with add method
    transactionObjectStore.add(record);
  }