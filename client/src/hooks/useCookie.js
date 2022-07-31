import { useState } from "react";
/**
 * Custom hook to retrieve and store cookies for our application.
 * @param {String} key The key to store our data to
 * @param {String} defaultValue The default value to return in case the cookie doesn't exist
 */

const useCookie = (key, defaultValue) => {
  const getCookie = () => getCookie(key) || defaultValue;
  const [cookie, setCookie] = useState(getCookie);
  // TODO: Add custom functions for cookie management.
  return [cookie];
};
export default useCookie;
