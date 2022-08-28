import axios from "axios";
import { listOfObjects } from "../utils/randomlySelectLayers";
import { getFileExt } from "../utils/fileName";
import model from "../models";
import uploadJsonToS3 from "../utils/uploadJsonToS3";

function printJSON(path) {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(path);
    resolve(response.data);
  });
}

export default {
  async replaceBaseURI(req, res) {
    const { collectionId } = req.params;
    const { baseURI } = req.body;

    const collectionList = await model.Collection.findByPk(collectionId);

    const NFTFolder = `${req.cookies.userId}/${collectionList.dataValues.collectionName}/nft/`;

    const NFTArr = await listOfObjects(NFTFolder);

    let jsonList = [];

    NFTArr.forEach((item) => {
      if (getFileExt(item.Key) === ".json") {
        jsonList.push(item);
      }
    });

    const replaceBaseURIJson = async () => {
      Promise.all(
        jsonList.map(async (_obj, index) => {
          let newJson = await printJSON(jsonList[index].SignedUrl);
          newJson.image = `ipfs://${baseURI}/${newJson.id}.png`;
          console.log(newJson);
          uploadJsonToS3(newJson, `${newJson.id}.json`, NFTFolder);
        })
      ).then((_response) =>
        res.status(200).json({ message: "Success replacing base URI" })
      );
    };
    await replaceBaseURIJson();
  },
};
