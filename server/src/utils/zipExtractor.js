import stream from "stream";
import yauzl from "yauzl";
import { s3 } from "../../s3";

let paths = [];

const uploadStream = ({ Bucket, Key }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
  };
};

export const extractZip = (bucketName, buffer, collectionName, userId) => {
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
              Bucket: bucketName,
              Key: `${userId}/${collectionName}/${fileNames[0]}.${
                fileNames[fileNames.length - 1]
              }`,
            });
            readStream.pipe(writeStream);
            promise.then(() => {
              paths.push(entry.fileName);

              console.log(entry.fileName + " Uploaded successfully!");

              zipfile.readEntry();
            });
          });
        }
      });

      zipfile.on("end", () => {
        const objJson = createObjectsFromPathArrays();
        resolve(objJson);
      });
    });
  });
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

  let nodeList = [];
  findSubPaths(path, paths).forEach(function (subPath) {
    let nodeName = getFilename(subPath);

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

  // By default, tree is an array
  // If it contains only one element which is an object,
  // return this object instead to match OP request
  if (tree.length == 1 && typeof tree[0] === "object") {
    tree = tree[0];
  }
  // Serialize tree for debug purposes

  return JSON.stringify(tree, null, 2);
}
