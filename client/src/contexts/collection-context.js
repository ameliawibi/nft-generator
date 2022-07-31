import React, { useReducer, useEffect, createContext } from "react";
import axios from "axios";

// Step 1: Initial State and Actions
const initialState = {
  collectionList: [],
};

const actions = {
  INITIALIZE: "INITIALIZE",
  UPLOAD: "UPLOAD",
  DELETE: "DELETE",
};

function reducer(state, action) {
  switch (action.type) {
    case actions.INITIALIZE:
      return {
        ...state,
        collectionList: action.payload,
      };
    case actions.UPLOAD:
      return {
        ...state,
        collectionList: [...state.collectionList, action.payload],
      };
    case actions.DELETE:
      return {
        ...state,
        collectionList: state.collectionList.filter(
          (_item, index) => index !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Step 3: Create the Context and Provider to Dispatch the Actions.

export const CollectionContext = createContext({
  actions: actions,
  ...initialState,
  uploadCollection: () => Promise.resolve(),
  deleteCollection: () => Promise.resolve(),
});

export const CollectionProvider = ({ children }) => {
  //Here we pass the reducer function and theinitialState to the useReducer hook. This will return state and dispatch. The state will have the initialState. And the dispatch is used to trigger our actions, just like in redux.
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(`/getfiles`).then((response) => {
      dispatch({
        type: actions.INITIALIZE,
        payload: response.data.files,
      });
    });
  }, []);

  if (!state) return null;

  const uploadCollection = async (formData, setMessage) => {
    console.log(formData);
    axios
      .post("/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res) {
          //console.log(res.data.files);
          setMessage("File uploaded successfully");
          dispatch({
            type: actions.UPLOAD,
            payload: res.data.files,
          });
        }
      })
      .catch((error) => {
        console.error(error.response);
        setMessage("Please select a file");
      });
  };

  const deleteCollection = async (fileName, index) => {
    console.log(fileName);
    axios
      .get(`/deletefile?filename=${fileName}`)
      .then((res) => {
        console.log(res);
        dispatch({ type: actions.DELETE, payload: index });
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  return (
    <CollectionContext.Provider
      value={{
        actions: actions,
        collectionList: state.collectionList,
        uploadCollection,
        deleteCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
