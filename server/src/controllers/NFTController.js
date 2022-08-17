import { s3 } from "../../s3";
import model from "../models";
import generateContents from "../utils/generateContents";
import generateNFTs from "../utils/generateNFTs";
import zipNFTs from "../utils/zipNFTs";
const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async generateNFT(req, res) {
    const { collectionId } = req.params;
    const { collectionName, num } = req.body;

    try {
      const traits = await model.Attribute.findAll({
        where: {
          collectionId: collectionId,
        },
      });
      const attributes = traits.map((Item) => ({ ...Item.dataValues }));

      const layers = await generateContents(attributes);

      res.status(200).json({
        message: "Success!",
        layers,
      });

      await generateNFTs(
        num,
        `${req.cookies.userId}/${collectionName}/nft/`,
        layers,
        `${req.cookies.userId}/${collectionName}/`
      );

      await model.Collection.update(
        { isNFTGenerated: true },
        { where: { id: collectionId } }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async getNFTCollections(req, res) {
    try {
      const collectionsWithNFT = await model.Collection.findAll({
        where: {
          userId: req.cookies.userId,
          isNFTGenerated: true,
        },
      });

      if (collectionsWithNFT.length === 0) {
        res.status(204).json({
          message: "Please generate NFTs",
        });
      }

      const NFTList = collectionsWithNFT.map((Item) => ({
        ...Item.dataValues,
      }));

      res.status(200).json({ message: "Your NFTs", NFTList });
    } catch (error) {
      console.log(error);
    }
  },

  async downloadNFT(req, res) {
    try {
      const { collectionId } = req.params;

      const collectionByPk = await model.Collection.findByPk(collectionId);

      const collectionName = collectionByPk.dataValues.collectionName;

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
