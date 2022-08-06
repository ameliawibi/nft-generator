import { s3 } from "../../s3";
import model from "../models";
import generateContents from "../utils/generateContents";
import generateNFTs from "../utils/generateNFTs";
const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async generateNFT(req, res) {
    try {
      const traits = await model.Attribute.findAll({
        collectionId: 12,
      });
      const attributes = traits.map((Item) => ({ ...Item.dataValues }));

      const layers = await generateContents(attributes);

      generateNFTs(
        2,
        `${req.cookies.userId}/layers.zip/nft/`,
        layers,
        `${req.cookies.userId}/layers.zip/`
      );

      res.status(200).json({
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
      const attributes = traits.map((Item) => ({ ...Item.dataValues }));

      res.status(200).json({
        attributes,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
