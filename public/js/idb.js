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

  function uploadTransaction() {
    // open a transaction on your db
    const transaction = db.transaction(['transaction'], 'readwrite');
  
    // access your object store
    const transactionObjectStore = transaction.objectStore('transaction');
  
    // get all records from store and set to a variable
    const getAll = transactionObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['transaction'], 'readwrite');
          // access the transaction object store
          const transactionObjectStore = transaction.objectStore('transaction');
          // clear all items in your store
          transactionObjectStore.clear();

          alert('All saved transaction has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  }

// listen for app coming back online
window.addEventListener('online', uploadTransaction);