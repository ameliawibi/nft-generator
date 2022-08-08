import { s3 } from "../../s3";
import model from "../models";
import { extractZip } from "../utils/zipExtractor";
import { getFileExt, getFilename } from "../utils/fileName";
import emptyNFTFolder from "../utils/emptyNFTFolder";

const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async uploadCollection(req, res) {
    let file = req.file;
    //console.log(file.key);

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

        //console.log(newCollection.dataValues.id);

        const params = { Bucket: bucketName, Key: file.key };

        const object = await s3.getObject(params).promise();
        const result = await extractZip(
          bucketName,
          object.Body,
          file.originalname,
          req.cookies.userId
        );

        const layersJson = JSON.parse(result).layers;

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

        let urlToAdd = s3.getSignedUrl("getObject", {
          Bucket: bucketName,
          Key: file.key,
          Expires: 60 * 5,
        });

        let updatedData = {
          SignedUrl: urlToAdd,
          Key: file.key,
          type: file.mimetype,
          size: file.size,
        };

        res.status(201).json({
          message: "Uploaded!",
          files: updatedData,
        });
      } catch (error) {
        await t.rollback();
      }
    }
  },

  async getCollection(req, res) {
    try {
      s3.listObjects(
        {
          Bucket: bucketName,
          Prefix: `${req.cookies.userId}/`,
        },
        function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            let allFiles = data.Contents;
            let updatedData = [];

            allFiles.forEach((item, index) => {
              let urlToAdd = s3.getSignedUrl("getObject", {
                Bucket: bucketName,
                Key: item.Key,
                Expires: 60 * 5,
              });

              allFiles[index].SignedUrl = urlToAdd;
              allFiles[index].collectionName = getFilename(item.Key);

              if (getFileExt(item.Key) === ".zip") {
                updatedData.push(item);
              }
            });
            return res.json({ files: updatedData });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCollection(req, res) {
    const { collectionId } = req.params;
    const { collectionName } = req.body;
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