import React, { useState } from "react";
import UploadComponent from "../components/UploadComponent";
import { useCollection } from "../hooks/useCollection";

export default function UploadCollection() {
  const [theMessage, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadCollection, collectionList } = useCollection();

  const onChange = (e) => {
    // Update the state
    setSelectedFile(e.target.files[0]);
    setMessage(e.target.files[0].name);
  };
  const uploadFile = (e) => {
    e.preventDefault();

    // Create an object of formData
    let formData = new FormData();

    // Update the formData object

    formData.append("file", selectedFile);
    //console.log(formData);
    uploadCollection(formData, setMessage);
  };

  return (
    <div>
      <UploadComponent
        onChange={(e) => onChange(e)}
        onSubmit={(e) => uploadFile(e)}
      />
      <p> {theMessage}</p>
      <ul className="font-bold underline">
        {collectionList.map((item, index) => (
          <li key={index}>{item.Key}</li>
        ))}
      </ul>
    </div>
  );
}
