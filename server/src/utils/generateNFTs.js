import mergeImages from "merge-images";
import { Canvas, Image } from "canvas";
import { s3 } from "../../s3";
import path from "path";
import { randomlySelectLayers } from "./randomlySelectLayers";
import emptyNFTFolder from "./emptyNFTFolder";
import uploadJsonToS3 from "./uploadJsonToS3";

const bucketName = process.env.AWS_BUCKET_NAME;

async function mergeLayersAndSave(layers, outputFile) {
  const image = await mergeImages(layers, { Canvas: Canvas, Image: Image });
  const nftUrl = await uploadToS3(image, outputFile);
  //console.log(nftUrl);

  return nftUrl;
}

async function uploadToS3(base64PngImage, filename) {
  return new Promise((resolve, reject) => {
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
          let nftUrl = s3.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: data.key,
            Expires: 60 * 24,
          });
          console.log("succesfully uploaded the image!");
          //console.log(nftUrl);
          resolve(nftUrl);
        }
      }
    );
  });
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
      const nftUrl = await mergeLayersAndSave(
        selection.imagesURL,
        path.join(NFTfolder, `${i}.png`)
      );

      let metadata = generateMetadata(
        i,
        selection.selectedTraits,
        `Collection of ${num} NFTs`,
        nftUrl,
        `My NFT`
      );

      uploadJsonToS3(metadata, `${i}.json`, NFTfolder);
      console.log(metadata);
    }
  }
}

function generateMetadata(
  tokenId,
  traits,
  description,
  nftUrl,
  collectionName
) {
  let attributes = [];
  for (const [trait_type, value] of Object.entries(traits)) {
    attributes.push({ trait_type, value });
  }
  return {
    attributes,
    description,
    id: tokenId,
    image: nftUrl,
    name: `${collectionName} #${tokenId}`,
  };
}

//generateNFTs(2, "1/layers.zip/nft/", layers, prefix);
