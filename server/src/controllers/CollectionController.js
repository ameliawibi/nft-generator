import { s3 } from "../../s3";
const bucketName = process.env.AWS_BUCKET_NAME;

export default {
  async uploadCollection(req, res) {
    let file = req.file;
    //console.log(file.key);

    if (file == null) {
      return res.status(400).json({ message: "Please choose the file" });
    }
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
  },

  async getCollection(_req, res) {
    s3.listObjects(
      {
        Bucket: bucketName,
      },
      function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          let updatedData = data.Contents;
          updatedData.forEach((item, index) => {
            let urlToAdd = s3.getSignedUrl("getObject", {
              Bucket: bucketName,
              Key: item.Key,
              Expires: 60 * 5,
            });
            updatedData[index].SignedUrl = urlToAdd;
          });

          //console.log(updatedData);
          return res.json({ files: updatedData });
        }
      }
    );
  },
};
