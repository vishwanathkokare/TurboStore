const DB_NAME = "TurboStore";
const STORE_NAME = "storage";

let db;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("❌ IndexedDB Open Error:", event.target.error);
      reject(event.target.error);
    };
  });
};

const IndexedDBStore = {
  async setItem(key, value) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async getItem(key) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (event) => reject(event.target.error);
    });
  },

  async removeItem(key) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  },
};

export default IndexedDBStore;
