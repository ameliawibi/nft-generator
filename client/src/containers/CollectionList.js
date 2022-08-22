import CollectionTable from "../components/CollectionTable";
import { useCollection } from "../hooks/useCollection";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import UploadCollection from "./UploadCollection";
import { useEffect } from "react";

export default function CollectionList() {
  const { initialize, collectionList, deleteCollection } = useCollection();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigate = useNavigate();

  const handleNavigate = (collectionId) => {
    navigate(`/collection/attribute/${collectionId}`, {
      state: { collectionId },
    });
  };

  const downloadNFT = (collectionId) => {
    axios.get(`/${collectionId}/downloadNFT`).then((res) => {
      const link = document.createElement("a");
      link.href = res.data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div>
      <UploadCollection />
      <CollectionTable
        rows={collectionList}
        deleteCollection={deleteCollection}
        handleNavigate={handleNavigate}
        downloadNFT={downloadNFT}
      />
      <Outlet />
    </div>
  );
}
