import path from "path";

export function getFilename(fullPath) {
  return fullPath.replace(/^.*[\\\/]/, "");
}

export function getFileExt(fullPath) {
  return path.parse(fullPath).ext;
}
