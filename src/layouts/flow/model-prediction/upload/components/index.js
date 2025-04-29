import React, { useState } from "react";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function FileUpload() {
  const [infoSB, setInfoSB] = useState(false);
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Model Prediction"
      content="Uploaded successfully"
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Here you would typically make an API call to upload the file
    // Example using fetch:
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("There was an error uploading the file.");
      });
  };

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autocomplete="off"
    >
      <input type="file" onChange={handleFileChange} />

      {selectedFile && (
        <div>
          <p>File name: {selectedFile.name}</p>
          <p>File type: {selectedFile.type}</p>
          <p>File size: {selectedFile.size} bytes</p>
        </div>
      )}
      <Grid item xs={12} sm={6} lg={3}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleUpload}
          disabled={!selectedFile}
          fullWidth
        >
          Upload
        </MDButton>
      </Grid>
      {renderInfoSB}
    </Box>
  );
}

export default FileUpload;
