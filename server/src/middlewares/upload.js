import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../../s3";
const bucketName = process.env.AWS_BUCKET_NAME;

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, `${req.cookies.userId}/${file.originalname}`); //use Date.now() for unique file keys
    },
  }),
});
