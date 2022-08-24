import { s3 } from "../../s3";
import model from "../models";
import generateContents from "../utils/generateContents";
import generateNFTs from "../utils/generateNFTs";
import zipNFTs from "../utils/zipNFTs";
import { listOfObjects } from "../utils/randomlySelectLayers";
import { getFileExt } from "../utils/fileName";
import printJSON from "../utils/loadJson";

const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async generateNFT(req, res) {
    const { collectionId } = req.params;
    const { num } = req.body;

    const collectionList = await model.Collection.findByPk(collectionId);

    const collectionName = collectionList.dataValues.collectionName;

    try {
      await model.Collection.update(
        { isNFTGenerated: false },
        { where: { id: collectionId } }
      );

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

      res.status(200).json({ message: "Your Collections", NFTList });
    } catch (error) {
      console.log(error);
    }
  },

  async getNFTfromOneCollection(req, res) {
    const { collectionId } = req.params;

    const collectionList = await model.Collection.findByPk(collectionId);

    const NFTArr = await listOfObjects(
      `${req.cookies.userId}/${collectionList.dataValues.collectionName}/nft/`
    );

    let jsonList = [];
    let imageList = [];
    NFTArr.forEach((item) => {
      console.log(item);
      if (getFileExt(item.Key) === ".json") {
        jsonList.push(item);
      } else {
        imageList.push(item);
      }
    });

    const pushMetadataToImageList = async () => {
      Promise.all(
        imageList.map(async (_obj, index) => {
          imageList[index].jsonContent = await printJSON(
            jsonList[index].SignedUrl
          );
        })
      ).then((_response) =>
        res.status(200).json({ message: "Your NFTs", imageList })
      );
    };
    await pushMetadataToImageList();
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
