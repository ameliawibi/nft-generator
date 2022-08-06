import mergeImages from "merge-images";
import { Canvas, Image } from "canvas";
import { s3 } from "../../s3";
import path from "path";
import randomlySelectLayers from "./randomlySelectLayers";
import emptyNFTFolder from "./emptyNFTFolder";
import uploadJsonToS3 from "./uploadJsonToS3";

const bucketName = process.env.AWS_BUCKET_NAME;

async function mergeLayersAndSave(layers, outputFile) {
  const image = await mergeImages(layers, { Canvas: Canvas, Image: Image });
  uploadToS3(image, outputFile);
}

function uploadToS3(base64PngImage, filename) {
  let base64 = base64PngImage.split(",")[1];
  let imageBuffer = new Buffer.from(base64, "base64");
  console.log(imageBuffer);
  s3.upload(
    {
      Bucket: bucketName,
      Key: filename,
      Body: imageBuffer,
      ContentEncoding: "base64",
      ContentType: "image/png",
    },
    function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("succesfully uploaded the image!");
      }
    }
  );
}

export default async function generateNFTs(
  num,
  NFTfolder,
  layersArray,
  layersFolder
) {
  await emptyNFTFolder(bucketName, NFTfolder);

  let generated = new Set();

  for (let i = 0; i < num; i++) {
    console.log(`Generating NFT #${i}`);
    let selection = await randomlySelectLayers(layersArray, layersFolder);

    const traitsGenerated = JSON.stringify(selection.selectedTraits);

    if (generated.has(traitsGenerated)) {
      console.log(`Duplicate NFT found. Skip...`);
      i--;
      continue;
    } else {
      generated.add(traitsGenerated);
      await mergeLayersAndSave(
        selection.imagesURL,
        path.join(NFTfolder, `${i}.png`)
      );

      let metadata = generateMetadata(i, selection.selectedTraits);

      uploadJsonToS3(metadata, `${i}.json`, NFTfolder);
      console.log(metadata);
    }
  }
}

function generateMetadata(tokenId, traits) {
  let attributes = [];
  for (const [trait_type, value] of Object.entries(traits)) {
    attributes.push({ trait_type, value });
  }
  return { tokenId, attributes };
}

//generateNFTs(2, "1/layers.zip/nft/", layers, prefix);
