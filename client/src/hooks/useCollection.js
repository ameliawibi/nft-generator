import { useContext } from "react";
import { CollectionContext } from "../contexts/collection-context";

export const useCollection = () => useContext(CollectionContext);
