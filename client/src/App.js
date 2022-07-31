import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import UploadCollection from "./containers/UploadCollection";
import { CollectionProvider } from "./contexts/collection-context";

function App() {
  useEffect(() => {
    axios.get("/getuser").then((res) => console.log(res));
  }, []);

  return (
    <CollectionProvider>
      <div className="App">
        <h1>Hello world!</h1>
        <UploadCollection />
      </div>
    </CollectionProvider>
  );
}

export default App;
