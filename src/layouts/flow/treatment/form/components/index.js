import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

export default function TextFields() {
  const [formData, setFormData] = React.useState({
    treatmentType: "",
    treatmentDescription: "",
    isFollowUp: "",
    followUpDate: "",
  });

  const [infoSB, setInfoSB] = useState(false);
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Treatment Prescription"
      content="Treatment prescribed successfully"
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleAddTreatment = () => {
    fetch("http://localhost:5013/api/Treatment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        // Handle the response from the API if needed
        console.log("Data posted successfully!");
        setInfoSB(true);
        setFormData({
          treatmentType: "",
          treatmentDescription: "",
          isFollowUp: "",
          followUpDate: "",
        });
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  const navigate = useNavigate();
  const handleNext = () => navigate("/dashboard");

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      {Object.keys(formData).map((key) => (
        <TextField
          key={key}
          id={key}
          label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          value={formData[key]}
          onChange={handleInputChange}
        />
      ))}

      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleAddTreatment} fullWidth>
          Prescribe
        </MDButton>
        {renderInfoSB}
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleNext} fullWidth>
          Next
        </MDButton>
      </Grid>
    </Box>
  );
}
