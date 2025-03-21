import { Platform } from "react-native";

if (__DEV__) {
  console.log("⚡ TurboStore: Using optimized storage backend");
}

const TurboStore = require(
  Platform.OS === "android" || Platform.OS === "ios"
    ? "./storage.native"
    : Platform.OS === "web"
    ? "./storage.web"
    : "./storage"
).default;

export default TurboStore;
