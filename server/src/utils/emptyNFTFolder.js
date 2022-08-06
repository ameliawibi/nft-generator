import { s3 } from "../../s3";

export async function emptyNFTFolder(bucket, folder) {
  let params = {
    Bucket: bucket,
    Prefix: folder,
  };

  s3.listObjects(params, function (err, data) {
    if (err) return console.log(err);

    if (data.Contents.length == 0) {
      return;
    }

    params = { Bucket: bucket };
    params.Delete = { Objects: [] };

    data.Contents.forEach(function (content) {
      params.Delete.Objects.push({ Key: content.Key });
    });

    s3.deleteObjects(params, function (err2, data2) {
      if (err2) return console.log(err2);
      if (data.IsTruncated) {
        emptyFolder(bucket, folder);
      } else {
        console.log(data2);
      }
    });
  });
}
