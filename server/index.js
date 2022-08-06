import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import AuthController from "./src/controllers/AuthController";
import CollectionController from "./src/controllers/CollectionController";
import { upload } from "./src/middlewares/upload";
import NFTController from "./src/controllers/NFTController";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/getuser", AuthController.getUser);

app.get("/getfiles", CollectionController.getCollection);

app.get("/getnft", NFTController.generateNFT);

app.get("/gettraits", NFTController.getTraits);

app.post(
  "/uploadfile",
  upload.single("file"),
  CollectionController.uploadCollection
);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
