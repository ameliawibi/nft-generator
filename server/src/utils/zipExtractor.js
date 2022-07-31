import stream from "stream";
import yauzl from "yauzl";
import { s3 } from "../../s3";

const Bucket = process.env.AWS_BUCKET_NAME;
const Key = "1/layers.zip";

let paths = [];

const uploadStream = ({ Bucket, Key }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
  };
};

const extractZip = (Bucket, buffer) => {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
      if (err) reject(err);
      zipfile.readEntry();
      zipfile.on("entry", function (entry) {
        if (/\/$/.test(entry.fileName)) {
          // Directory entry
          paths.push(entry.fileName);
          // skip to the next entry
          zipfile.readEntry();
        } else {
          // file entry
          zipfile.openReadStream(entry, function (err, readStream) {
            if (err) reject(err);
            const fileNames = entry.fileName.split(".");
            const { writeStream, promise } = uploadStream({
              Bucket,
              Key: `1/${fileNames[0]}.${fileNames[fileNames.length - 1]}`,
            });
            readStream.pipe(writeStream);
            promise.then(() => {
              paths.push(entry.fileName);
              //console.log(paths);
              console.log(entry.fileName + " Uploaded successfully!");

              zipfile.readEntry();
            });
          });
        }
      });

      zipfile.on("end", () => {
        console.log(paths);
        createObjectsFromPathArrays();
        resolve("end");
      });
    });
  });
};

export const handler = async () => {
  //console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event
  /*const Key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  */
  const params = { Bucket, Key };

  try {
    const object = await s3.getObject(params).promise();
    const result = await extractZip(Bucket, object.Body);
    //console.log(paths);

    return {
      status: result && 200,
      response: result && "OK",
    };
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${Key} from bucket ${Bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};

// Extract a filename from a path
function getFilename(path) {
  return path
    .split("/")
    .filter(function (value) {
      return value && value.length;
    })
    .reverse()[0];
}
// Find sub paths
function findSubPaths(path, pathArray) {
  // slashes need to be escaped when part of a regexp
  let rePath = path.replace("/", "\\/");
  let re = new RegExp("^" + rePath + "[^\\/]*\\/?$");
  return pathArray.filter(function (i) {
    return i !== path && re.test(i);
  });
}

// Build tree recursively
function buildTree(path) {
  path = path || "";
  //console.log(path)
  let nodeList = [];
  findSubPaths(path, paths).forEach(function (subPath) {
    let nodeName = getFilename(subPath);
    //console.log(nodeName);
    if (/\/$/.test(subPath) && nodeName) {
      let node = {};
      node[nodeName] = buildTree(subPath);
      nodeList.push(node);
    } else {
      nodeList.push(nodeName);
    }
  });
  return nodeList;
}

function createObjectsFromPathArrays() {
  // Build tree from root
  let tree = buildTree();

  //console.log(tree);
  // By default, tree is an array
  // If it contains only one element which is an object,
  // return this object instead to match OP request
  if (tree.length == 1 && typeof tree[0] === "object") {
    tree = tree[0];
  }
  // Serialize tree for debug purposes
  //console.log(tree);
  console.log(JSON.stringify(tree, null, 2));
  /*fs.writeFileSync(
    path.join(outputPath, `layers.json`),
    JSON.stringify(tree, null, 2)
  );
  */
}

//handler():
