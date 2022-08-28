import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import methodOverride from "method-override";
import AuthController from "./src/controllers/AuthController";
import CollectionController from "./src/controllers/CollectionController";
import { upload } from "./src/middlewares/upload";
import authJwt from "./src/middlewares/authJwt";
import NFTController from "./src/controllers/NFTController";
import AttributesController from "./src/controllers/AttributesController";
import replaceBaseURI from "./src/controllers/replaceBaseURI";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "90mb" }));
app.use(express.json());
app.use(methodOverride("_method"));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.post("/auth/signup", authJwt.verifySignUp, AuthController.signUp);

app.post("/auth/signin", AuthController.signIn);

app.get("/auth/logout", AuthController.getLogout);

app.get("/getfiles", authJwt.verifyToken, CollectionController.getCollection);

app.get(
  "/:collectionId/getfile",
  authJwt.verifyToken,
  CollectionController.getOneCollection
);

app.post(
  "/:collectionId/generateNFT",
  authJwt.verifyToken,
  NFTController.generateNFT
);

app.get(
  "/collectionWithNFT",
  authJwt.verifyToken,
  NFTController.getNFTCollections
);

app.get(
  "/:collectionId/getNFTs",
  authJwt.verifyToken,
  NFTController.getNFTfromOneCollection
);

app.get(
  "/:collectionId/downloadNFT",
  authJwt.verifyToken,
  NFTController.downloadNFT
);

app.get(
  "/collection/attribute/:collectionId/gettraits",
  authJwt.verifyToken,
  AttributesController.getTraits
);

app.post(
  "/updatetraits",
  authJwt.verifyToken,
  AttributesController.updateTraits
);

app.post(
  "/uploadfile",
  upload.single("file"),
  authJwt.verifyToken,
  CollectionController.uploadCollection
);

app.delete(
  "/:collectionId/:collectionName/delete",
  authJwt.verifyToken,
  CollectionController.deleteCollection
);

app.post("/:collectionId/replaceJSON", replaceBaseURI.replaceBaseURI);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
