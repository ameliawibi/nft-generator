import CollectionList from "../containers/CollectionList";
import { useAuth } from "../hooks/useAuth";

export default function Collection() {
  const { token } = useAuth();
  return (
    <>
      <div>Authenticated as {token} </div>
      <CollectionList />
    </>
  );
}
