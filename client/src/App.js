import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { CollectionProvider } from "./contexts/collection-context";
import { Routes, Route } from "react-router-dom";
import MainNav from "./pages/MainNav";
import Collection from "./pages/Collection";

function App() {
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
          <Route path="collection" element={<Collection />} />
        </Routes>
      </div>
    </CollectionProvider>
  );
}

export default App;
