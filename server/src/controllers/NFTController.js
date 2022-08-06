import { s3 } from "../../s3";
import model from "../models";
import generateContents from "../utils/generateContents";
import generateNFTs from "../utils/generateNFTs";
import zipNFTs from "../utils/zipNFTs";
const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async generateNFT(req, res) {
    const { collectionId, collectionName, num } = req.body;

    try {
      const traits = await model.Attribute.findAll({
        collectionId: collectionId,
      });
      const attributes = traits.map((Item) => ({ ...Item.dataValues }));

      const layers = await generateContents(attributes);

      generateNFTs(
        num,
        `${req.cookies.userId}/${collectionName}/nft/`,
        layers,
        `${req.cookies.userId}/${collectionName}/`
      );

      res.status(200).json({
        message: "Success!",
        layers,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async getTraits(_req, res) {
    try {
      const traits = await model.Attribute.findAll({
        collectionId: 12,
      });
      const attributesList = traits.map((Item) => ({ ...Item.dataValues }));

      res.status(200).json({
        message: "Success!",
        attributesList,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async updateTraits(req, res) {
    const { attributes } = req.body;
    const attributesJSON = JSON.parse(attributes);
    //console.log(attributesJSON[0].id);
    try {
      const attributesList = await model.Attribute.bulkCreate(attributesJSON, {
        updateOnDuplicate: [
          "trait_type",
          "probability",
          "subtrait",
          "rarity",
          "updatedAt",
        ],
      });
      res.status(200).json({ message: "Success!", attributesList });
    } catch (error) {
      console.log(error);
    }
  },

  async downloadNFT(req, res) {
    try {
      const { collectionName } = req.body;

      const zipFolder = `${req.cookies.userId}/${collectionName}/zippedNFTs/`;
      const sourceFolder = `${req.cookies.userId}/${collectionName}/nft/`;
      const zipFileName = "myNFTs";

      await zipNFTs(zipFolder, zipFileName, sourceFolder);

      let nftUrl = s3.getSignedUrl("getObject", {
        Bucket: bucketName,
        Key: `${zipFolder}${zipFileName}`,
        Expires: 60 * 5,
      });

      res.status(200).json({ message: "Zipped!", url: nftUrl });
    } catch (error) {
      console.log(error);
    }
  },
};
