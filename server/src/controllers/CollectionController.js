import { s3 } from "../../s3";
import model from "../models";
import { extractZip } from "../utils/zipExtractor";
import emptyNFTFolder from "../utils/emptyNFTFolder";

const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async uploadCollection(req, res) {
    res.connection.setTimeout(15 * 60 * 1000);

    let file = req.file;

    if (file == null) {
      return res.status(400).json({ message: "Please choose the file" });
    }

    const duplicateCollection = await model.Collection.findOne({
      where: {
        collectionName: file.originalname,
        userId: req.cookies.userId,
      },
    });

    if (duplicateCollection) {
      console.log("duplicate found");
      res.status(409).send({ message: "Duplicate collection found" });
    } else {
      console.log("duplicate not found");
      const t = await model.sequelize.transaction();
      try {
        const newCollection = await model.Collection.create(
          {
            userId: req.cookies.userId,
            collectionName: file.originalname,
          },
          { transaction: t }
        );

        const params = { Bucket: bucketName, Key: file.key };

        const object = await s3.getObject(params).promise();
        const result = await extractZip(
          bucketName,
          object.Body,
          file.originalname,
          req.cookies.userId
        );

        const layersJson = await JSON.parse(result).layers;

        let objectKeys = [];

        for (let i = 0; i < layersJson.length; i++) {
          objectKeys.push(...Object.keys(layersJson[i]));
          for (const element of layersJson[i][objectKeys[i]]) {
            await model.Attribute.create(
              {
                collectionId: newCollection.dataValues.id,
                trait_type: objectKeys[i],
                probability: 1,
                subtrait: element,
                rarity: 1,
              },
              { transaction: t }
            );
          }
        }

        await t.commit();

        res.status(201).json({
          message: "Uploaded!",
          files: newCollection,
        });
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
    }
  },

  async getOneCollection(req, res) {
    const { collectionId } = req.params;
    try {
      const oneCollection = await model.Collection.findByPk(collectionId);
      return res.json({ files: oneCollection });
    } catch (error) {
      console.log(error);
    }
  },

  async getCollection(req, res) {
    try {
      const allCollections = await model.Collection.findAll({});
      return res.json({ files: allCollections });
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCollection(req, res) {
    const { collectionId, collectionName } = req.params;
    try {
      emptyNFTFolder(bucketName, `${req.cookies.userId}/${collectionName}`);
      const deleted = await model.Collection.destroy({
        where: { id: collectionId },
      });
      if (!deleted) {
        res.status(204).json({ message: "Collection not found" });
      }

      res.status(202).json({ message: "Deleted!" });
    } catch (error) {
      console.log(error);
    }
  },
};
