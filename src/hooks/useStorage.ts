/* eslint-disable no-console */
import { useState } from "react";

type Options = {
  storage: "localStorage" | "sessionStorage";
};

const useStorage = (
  key: string,
  initialValue: any,
  options: Options = {
    storage: "localStorage",
  }
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storages = {
        localStorage: window.localStorage,
        sessionStorage: window.sessionStorage,
      };
      const item = storages[options.storage].getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const storages = {
        localStorage: window.localStorage,
        sessionStorage: window.sessionStorage,
      };
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storages[options.storage].setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log({ error });
    }
  };
  return [storedValue, setValue];
};

export default useStorage;
