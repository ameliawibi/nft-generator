import axios from "axios";

export default async function printJSON(path) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(path);
    resolve(response.data);
  });
}
