import React, { useState } from "react";
import UploadComponent from "../components/UploadComponent";
import { useCollection } from "../hooks/useCollection";

export default function UploadCollection() {
  const [theMessage, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadCollection } = useCollection();

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
      <h1>Upload collection</h1>
      <UploadComponent
        onChange={(e) => onChange(e)}
        onSubmit={(e) => uploadFile(e)}
      />
      <p> {theMessage}</p>
    </div>
  );
}
