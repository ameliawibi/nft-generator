import model from "../models";
import { listOfObjects, getLayersUrl } from "../utils/randomlySelectLayers";
import { getFilename } from "../utils/fileName";

export default {
  async getTraits(req, res) {
    const { collectionId } = req.params;
    try {
      const oneCollection = await model.Collection.findByPk(collectionId);

      const collectionName = oneCollection.dataValues.collectionName;

      const URL = await listOfObjects(
        `${req.cookies.userId}/${collectionName}/`
      );

      const traits = await model.Attribute.findAll({
        where: { collectionId: Number(collectionId) },
      });

      if (traits.length === 0) {
        res.status(404).json({
          message: "Collection not found",
        });
      }

      const attributesList = traits.map((Item) => ({ ...Item.dataValues }));

      for (const item of URL) {
        let foundURL = await getLayersUrl(getFilename(item.Key), URL);
        for (const attribute of attributesList) {
          attribute.subtrait === getFilename(item.Key)
            ? (attribute.signedURL = foundURL)
            : attribute;
        }
      }
      //console.log(attributesList);

      res.status(200).json({
        message: "Success!",
        attributesList,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async updateTraits(req, res) {
    const { attributesList } = req.body;
    //const attributesJSON = JSON.parse(attributes);
    //console.log(attributesJSON[0].id);
    try {
      const attributes = await model.Attribute.bulkCreate(attributesList, {
        updateOnDuplicate: [
          "trait_type",
          "probability",
          "subtrait",
          "rarity",
          "collectionId",
        ],
      });
      res.status(200).json({ message: "Success!", attributes });
    } catch (error) {
      console.log(error);
    }
  },
};
