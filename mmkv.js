import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const MMKVStore = {
  async setItem(key, value) {
    try {
      storage.set(key, value);
      return Promise.resolve(); // Ensures async consistency
    } catch (error) {
      console.error(`MMKV Error: Failed to set "${key}"`, error);
    }
  },

  async getItem(key) {
    try {
      return Promise.resolve(storage.getString(key) || null);
    } catch (error) {
      console.error(`MMKV Error: Failed to get "${key}"`, error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      storage.delete(key);
      return Promise.resolve();
    } catch (error) {
      console.error(`MMKV Error: Failed to remove "${key}"`, error);
    }
  },
};

export default MMKVStore;
