import CollectionTable from "../components/CollectionTable";
import { useCollection } from "../hooks/useCollection";

export default function CollectionList() {
  const { collectionList, deleteCollection } = useCollection();
  return (
    <>
      <h1>Collection List</h1>
      <CollectionTable
        rows={collectionList}
        deleteCollection={deleteCollection}
      />
    </>
  );
}
