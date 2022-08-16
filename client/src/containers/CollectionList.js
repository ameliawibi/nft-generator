import CollectionTable from "../components/CollectionTable";
import { useCollection } from "../hooks/useCollection";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function CollectionList() {
  const { collectionList, deleteCollection } = useCollection();

  const navigate = useNavigate();

  const handleNavigate = (collectionId) => {
    navigate("/collection/attribute", { state: { collectionId } });
  };

  return (
    <>
      <h1>Collection List</h1>
      <CollectionTable
        rows={collectionList}
        deleteCollection={deleteCollection}
        handleNavigate={handleNavigate}
      />
      <Outlet />
    </>
  );
}
