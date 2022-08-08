import CollectionList from "../containers/CollectionList";
import UploadCollection from "../containers/UploadCollection";

export default function Collection() {
  return (
    <div>
      <CollectionList />
      <UploadCollection />
    </div>
  );
}
