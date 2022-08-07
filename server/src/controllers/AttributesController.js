import model from "../models";

export default {
  async getTraits(req, res) {
    const { collectionId } = req.params;
    try {
      const traits = await model.Attribute.findAll({
        where: { collectionId: Number(collectionId) },
      });

      if (traits.length === 0) {
        res.status(404).json({
          message: "Collection not found",
        });
      }

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
          "collectionId",
        ],
      });
      res.status(200).json({ message: "Success!", attributesList });
    } catch (error) {
      console.log(error);
    }
  },
};
