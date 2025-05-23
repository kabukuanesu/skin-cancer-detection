import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { useSnackbar } from "notistack";

export default function LesionForm() {
  const { patientId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    lesionLocation: "",
    lesionDescription: "",
    dermoscopicFeatures: "",
  });

  const [loading, setLoading] = useState(false);
  const [infoSB, setInfoSB] = useState(false);

  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Lesion Diagnosis"
      content="Lesion captured successfully"
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

  const handleAddLesion = async () => {
    if (!formData.lesionLocation || !formData.lesionDescription) {
      enqueueSnackbar("Please fill in all required fields", { variant: "error" });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData || !userData.userId) {
        throw new Error("User data not found");
      }

      const lesionData = {
        patientId: parseInt(patientId),
        userId: userData.userId,
        lesionLocation: formData.lesionLocation,
        lesionDescription: formData.lesionDescription,
        dermoscopicFeatures: formData.dermoscopicFeatures,
        isBiopsy: false,
      };

      const response = await fetch("http://localhost:5212/api/Workflow/lesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify(lesionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save lesion data");
      }

      setInfoSB(true);
      setFormData({
        lesionLocation: "",
        lesionDescription: "",
        dermoscopicFeatures: "",
      });
      enqueueSnackbar("Lesion saved successfully", { variant: "success" });
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => navigate(`/image/${patientId}`);
  const handleExit = () => navigate(-1);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={2}>
        {Object.keys(formData).map((key) => (
          <Grid item xs={12} md={6} key={key}>
            <TextField
              fullWidth
              id={key}
              label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              value={formData[key]}
              onChange={handleInputChange}
              variant="outlined"
              required={key === "lesionLocation" || key === "lesionDescription"}
            />
          </Grid>
        ))}

        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={4} md={3}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleAddLesion}
              fullWidth
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </MDButton>
            {renderInfoSB}
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MDButton variant="gradient" color="info" onClick={handleNext} fullWidth>
              Details
            </MDButton>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MDButton variant="gradient" color="info" onClick={handleExit} fullWidth>
              Back
            </MDButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
