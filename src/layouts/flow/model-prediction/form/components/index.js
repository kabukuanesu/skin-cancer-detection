import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { useSnackbar } from "notistack";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress";

export default function PredictionForm() {
  const { id } = useParams(); // imageId from URL
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    predictionResult: "",
    confidenceScore: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [infoSB, setInfoSB] = useState(false);

  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Model Prediction"
      content="Prediction recorded successfully"
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Clear previous results when new file is selected
    setFormData({
      predictionResult: "",
      confidenceScore: "",
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar("Please select a file first!", { variant: "error" });
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5212/api/Prediction/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const predictionData = await response.json();

      // Auto-populate form fields with prediction results
      setFormData({
        predictionResult: predictionData.predicted_class,
        confidenceScore: predictionData.confidence_score.toString(),
      });

      enqueueSnackbar("Prediction completed successfully", { variant: "success" });
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPrediction = async () => {
    if (!formData.predictionResult || !formData.confidenceScore) {
      enqueueSnackbar("Please upload and predict an image first", { variant: "error" });
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData || !userData.userId) {
        throw new Error("User data not found");
      }

      const predictionData = {
        userId: userData.userId,
        imageId: parseInt(id),
        predictionResult: formData.predictionResult,
        confidenceScore: parseFloat(formData.confidenceScore),
      };

      const response = await fetch("http://localhost:5212/api/Workflow/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save prediction data");
      }

      setInfoSB(true);
      enqueueSnackbar("Prediction saved successfully", { variant: "success" });

      // Reset form fields after successful save
      setFormData({
        predictionResult: "",
        confidenceScore: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => navigate("/final-diagnosis");
  const handleExit = () => navigate("/patients");

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Box component="form" sx={{ mb: 4 }} noValidate autoComplete="off">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
              <MDButton variant="gradient" color="info" component="span" fullWidth>
                Select Image
              </MDButton>
            </label>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              fullWidth
            >
              {uploading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Predicting...
                </>
              ) : (
                "Upload & Predict"
              )}
            </MDButton>
          </Grid>

          {selectedFile && (
            <Grid item xs={12}>
              <MDTypography variant="body2">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </MDTypography>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          {Object.keys(formData).map((key) => (
            <Grid item xs={12} md={6} key={key}>
              <TextField
                fullWidth
                id={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                value={formData[key]}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          ))}

          <Grid item xs={12} container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={4} md={3}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleAddPrediction}
                fullWidth
                disabled={!formData.predictionResult || saving}
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </MDButton>
              {renderInfoSB}
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleNext}
                fullWidth
                disabled={!formData.predictionResult}
              >
                Next
              </MDButton>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <MDButton variant="gradient" color="info" onClick={handleExit} fullWidth>
                Exit
              </MDButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  function handleInputChange(event) {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  }
}
