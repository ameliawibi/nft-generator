import { useCollection } from "../hooks/useCollection";
import { useState } from "react";
import Button from "@mui/material/Button";

export default function UploadNew() {
  const [theMessage, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState({ type: null, size: 0 });
  const { uploadCollection } = useCollection();

  const onChange = (e) => {
    // Update the state
    setSelectedFile(
      e.target.files[0] ? e.target.files[0] : { type: null, size: 0 }
    );
    setMessage("");
  };

  const uploadFile = (e) => {
    e.preventDefault();

    // Create an object of formData
    let formData = new FormData();

    // Update the formData object

    formData.append("file", selectedFile);

    uploadCollection(formData, setMessage);
  };

  return (
    <div>
      <label
        className="block mb-2 text-md font-medium text-gray-900 dark:text-gray-300"
        htmlFor="file_input"
      >
        Upload collection
      </label>
      <p
        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        ZIP File (Max 90 MB)
      </p>
      <input
        className="block w-2/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-2"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={onChange}
      />
      {theMessage && (
        <p className="mb-2 text-xs text-gray-600"> {theMessage}</p>
      )}
      <Button
        variant="outlined"
        disabled={
          selectedFile.size <= 90000000 &&
          selectedFile.type === "application/zip"
            ? false
            : true
        }
        component="label"
        onClick={uploadFile}
      >
        Upload
      </Button>
    </div>
  );
}
