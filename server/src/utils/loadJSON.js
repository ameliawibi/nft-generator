const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export default async function loadJSON(path, error) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      let obj = {};
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
        } else {
          error(xhr);
        }
        resolve(obj);
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  });
}
