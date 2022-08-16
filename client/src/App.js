import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { CollectionProvider } from "./contexts/collection-context";
import { Routes, Route } from "react-router-dom";
import MainNav from "./pages/MainNav";
import Collection from "./pages/Collection";
import Attributes from "./containers/Attributes";
import { useLocation } from "react-router-dom";

function App() {
  const { state } = useLocation();
  const { collectionId } = state || {};
  console.log(state);

  useEffect(() => {
    axios.get("/getuser").then((_res) => console.log("Logged in!"));
  }, []);

  return (
    <CollectionProvider>
      <div className="App">
        <Routes>
          <Route path="/*" element={<MainNav />} />
        </Routes>
      </div>
      <div>
        <Routes>
          <Route index element={<Collection />} />
          <Route path="collection" element={<Collection />}>
            <Route
              path="attribute"
              element={<Attributes collectionId={collectionId} />}
            />
          </Route>
        </Routes>
      </div>
    </CollectionProvider>
  );
}

export default App;
