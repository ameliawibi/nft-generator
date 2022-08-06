import { s3 } from "../../s3";
const bucketName = process.env.AWS_BUCKET_NAME;

export default async function uploadJsonToS3(obj, filename, foldername) {
  let buf = Buffer.from(JSON.stringify(obj));

  let params = {
    Bucket: bucketName,
    Key: `${foldername}${filename}`,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "application/json",
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      console.log("Error uploading data: ", data);
    } else {
      console.log(`JSON successfully uploaded ${data}`);
    }
  });
}
