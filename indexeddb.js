const DB_NAME = "TurboStoreDB";
const STORE_NAME = "keyValueStore";
const MAX_RETRIES = 3;
let isIndexedDBAvailable = true;

// Open IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn("IndexedDB failed! Falling back to LocalStorage.");
      isIndexedDBAvailable = false;
      reject(request.error);
    };
  });
};

const IndexedDBStore = {
  async setItem(key, value) {
    if (!isIndexedDBAvailable) {
      localStorage.setItem(key, value);
      return;
    }

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        store.put(value, key);
        return;
      } catch (error) {
        retries++;
        console.warn(`IndexedDB Error (Attempt ${retries}):`, error);
      }
    }

    // Fallback to LocalStorage if IndexedDB fails
    console.warn("IndexedDB failed completely! Using LocalStorage.");
    isIndexedDBAvailable = false;
    localStorage.setItem(key, value);
  },

  async getItem(key) {
    if (!isIndexedDBAvailable) {
      return localStorage.getItem(key);
    }

    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch (error) {
      console.warn("IndexedDB read failed! Falling back to LocalStorage.");
      isIndexedDBAvailable = false;
      return localStorage.getItem(key);
    }
  },

  async removeItem(key) {
    if (!isIndexedDBAvailable) {
      localStorage.removeItem(key);
      return;
    }

    try {
      const db = await openDB();
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
    } catch (error) {
      console.warn("IndexedDB delete failed! Falling back to LocalStorage.");
      isIndexedDBAvailable = false;
      localStorage.removeItem(key);
    }
  },
};

export default IndexedDBStore;
        
