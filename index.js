import { Platform } from "react-native";
import MMKVStore from "./mmkv";
import IndexedDBStore from "./indexeddb";
import SQLiteStore from "./sqlite";

if (__DEV__) {
  console.log("⚡ TurboStore: Using optimized storage backend");
}

const StorageBackend =
  Platform.OS === "android" || Platform.OS === "ios"
    ? MMKVStore
    : Platform.OS === "web"
    ? IndexedDBStore
    : SQLiteStore;

const TurboStore = {
  async setItem(key, value) {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    queueMicrotask(() => StorageBackend?.setItem(key, data));
  },

  async getItem(key) {
    try {
      const data = await StorageBackend?.getItem(key);
      return data ? (data.startsWith("{") || data.startsWith("[") ? JSON.parse(data) : data) : null;
    } catch {
      console.warn(`TurboStore: Read error, retrying...`);
      return null;
    }
  },

  async removeItem(key) {
    queueMicrotask(() => StorageBackend?.removeItem(key));
  },
};

export default TurboStore;
