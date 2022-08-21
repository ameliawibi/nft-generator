import { AuthProvider } from "./contexts/auth-context";
import { CollectionProvider } from "./contexts/collection-context";
import { Routes, Route, useLocation } from "react-router-dom";
import MainNav from "./pages/MainNav";
import Collection from "./pages/Collection";
import NFT from "./pages/NFT";
import Attributes from "./containers/Attributes";
import Login from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  const { state } = useLocation();
  const { collectionId } = state || {};

  /*useEffect(() => {
    axios.get("/getuser").then((_res) => console.log);
  }, []);
  */

  return (
    <AuthProvider>
      <h1>React Router</h1>
      <MainNav />
      <CollectionProvider>
        <div className="mx-10 my-6">
          <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route
              path="collection"
              element={
                <ProtectedRoute>
                  <Collection />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/collection/attribute/:collectionId"
              element={
                <ProtectedRoute>
                  <Attributes collectionId={collectionId} />
                </ProtectedRoute>
              }
            />
            <Route
              path="nft"
              element={
                <ProtectedRoute>
                  <NFT />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </CollectionProvider>
    </AuthProvider>
  );
}

export default App;
