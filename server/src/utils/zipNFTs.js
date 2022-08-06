import { s3 } from "../../s3";
import XmlStream from "xml-stream";
import stream from "stream";
import archiver from "archiver";
const bucketName = process.env.AWS_BUCKET_NAME;

//const sourceFolder = "1/layers.zip/nft/";
//const zipFolder = "1/layers.zip/zippedNFTs";
//const zipFileName = "firstCollection";

const filesArray = [];

export default async function zipNFTs(zipFolder, zipFileName, sourceFolder) {
  const files = s3
    .listObjects({ Bucket: bucketName, Prefix: sourceFolder })
    .createReadStream();
  const xml = new XmlStream(files);
  xml.collect("Key");
  xml.on("endElement: Key", function (item) {
    filesArray.push(item["$text"].substr(sourceFolder.length));
  });

  xml.on("end", function () {
    zipFunction(zipFolder, zipFileName, sourceFolder);
  });
}

async function zipFunction(zipFolder, zipFileName, sourceFolder) {
  console.log(filesArray);
  const s3FileDwnldStreams = filesArray.map((item) => {
    console.log(`${sourceFolder}${item}`);
    const pass = s3
      .getObject({ Bucket: bucketName, Key: `${sourceFolder}${item}` })
      .createReadStream();
    return {
      stream: pass,
      fileName: `${item}`,
    };
  });

  const streamPassThrough = new stream.PassThrough();

  const uploadParams = {
    Body: streamPassThrough,
    ContentType: "application/zip",
    Key: `${zipFolder}${zipFileName}`,
    Bucket: bucketName,
  };

  const s3Upload = s3.upload(uploadParams, (err, data) => {
    if (err) console.error("upload error", err);
    else {
      console.log("upload done", data);
    }
  });
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
  archive.on("error", (error) => {
    throw new Error(
      `${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`
    );
  });

  await new Promise((resolve, reject) => {
    s3Upload.on("close", resolve());
    s3Upload.on("end", resolve());
    s3Upload.on("error", reject());

    archive.pipe(streamPassThrough);
    s3FileDwnldStreams.forEach((s3FileDwnldStream) => {
      archive.append(s3FileDwnldStream.stream, {
        name: s3FileDwnldStream.fileName,
      });
    });
    archive.finalize();
  }).catch((error) => {
    throw new Error(`${error.code} ${error.message} ${error.data}`);
  });
}
