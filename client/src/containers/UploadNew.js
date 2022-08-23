import { useCollection } from "../hooks/useCollection";
import { useState } from "react";
import Button from "@mui/material/Button";

export default function UploadNew() {
  const [theMessage, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadCollection } = useCollection();

  const onChange = (e) => {
    // Update the state
    setSelectedFile(e.target.files[0]);
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
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        htmlFor="file_input"
      >
        Upload file
      </label>
      <p
        class="mt-1 text-sm text-gray-500 dark:text-gray-300"
        id="file_input_help"
      >
        ZIP File (Max 90 MB)
      </p>
      <input
        class="block w-1/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-2"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={onChange}
      />

      <Button variant="outlined" component="label" onClick={uploadFile}>
        Upload
      </Button>
      <p className="text-xs text-gray-600"> {theMessage}</p>
    </div>
  );
}
