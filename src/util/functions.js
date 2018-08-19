import { camelCase as lodashCamelCase } from "lodash";

export function camelCase(string) {
  return string[0].toUpperCase() + lodashCamelCase(string).substring(1);
}

export function tryTo(object, functionName, ...args) {
  if(typeof object[functionName] === "function") {
    return object[functionName](...args);
  } else {
    return null;
  }
}
