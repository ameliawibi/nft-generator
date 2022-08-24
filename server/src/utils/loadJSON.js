import { XMLHttpRequest } from "xmlhttprequest";
const env = process.env.NODE_ENV || "development";

export default async function loadJSON(path, error) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      let obj = {};
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          obj = JSON.parse(xhr.responseText);
        } else {
          console.log(error);
        }
        resolve(obj);
      }
    };
    if (env === "production") {
      const herokuKey = btoa(":" + process.env.HEROKU_LOADJSON_TOKEN + "\n");
      xhr.open("GET", path, true);
      xhr.setRequestHeader("Accept", "application/vnd.heroku+json; version=3");
      xhr.setRequestHeader("Authorization", herokuKey);
      xhr.send();
    } else {
      xhr.open("GET", path, true);
      xhr.send();
    }
  });
}
