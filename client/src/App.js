import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { CollectionProvider } from "./contexts/collection-context";
import { Routes, Route } from "react-router-dom";
import MainNav from "./pages/MainNav";
import Collection from "./pages/Collection";
import NFT from "./pages/NFT";
import Attributes from "./containers/Attributes";
import { useLocation } from "react-router-dom";

function App() {
  const { state } = useLocation();
  const { collectionId } = state || {};

  useEffect(() => {
    axios.get("/getuser").then((_res) => console.log);
  }, []);

  return (
    <CollectionProvider>
      <div>
        <Routes>
          <Route path="/*" element={<MainNav />} />
        </Routes>
      </div>
      <div className="mx-10 my-6">
        <Routes>
          <Route index element={<Collection />} />
          <Route path="collection" element={<Collection />} />
          <Route
            exact
            path="/collection/attribute/:collectionId"
            element={<Attributes collectionId={collectionId} />}
          />
          <Route path="nft" element={<NFT />} />
        </Routes>
      </div>
    </CollectionProvider>
  );
}

export default App;
