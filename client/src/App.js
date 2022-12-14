import { AuthProvider } from "./contexts/auth-context";
import { CollectionProvider } from "./contexts/collection-context";
import { Routes, Route, useLocation } from "react-router-dom";
import MainNav from "./pages/MainNav";
import Collection from "./pages/Collection";
import NFT from "./pages/NFT";
import Attributes from "./containers/Attributes";
import Login from "./pages/Login";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import { useState, useEffect } from "react";
import SignUp from "./pages/SignUp";

function App() {
  const { state } = useLocation();
  const { collectionId } = state || {};
  //const [currPath, setCurrPath] = useState(window.location.pathname);

  /*useEffect(() => {
    setCurrPath(window.location.pathname);
    // eslint-disable-next-line
  }, [window.location.pathname]);
  */

  //  {currPath !== "/login" && currPath !== "/signup" && <MainNav />}
  return (
    <AuthProvider>
      <div className="mx-10 my-6">
        <Routes>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="collection" element={<MainNav />}>
            <Route
              index
              element={
                <CollectionProvider>
                  <ProtectedRoute>
                    <Collection />
                  </ProtectedRoute>
                </CollectionProvider>
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
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
