import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function FinalDiagnosisForm() {
  const { id } = useParams(); // modelPredictionId from URL
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    finalResult: "",
    finalResultDescription: "",
  });

  const [predictionDetails, setPredictionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPredictionDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5212/api/Workflow/prediction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch prediction details");
        }

        const data = await response.json();
        setPredictionDetails(data);
      } catch (error) {
        console.error("Error fetching prediction details:", error);
        enqueueSnackbar("Failed to load prediction details", { variant: "error" });
      }
    };

    fetchPredictionDetails();
  }, [id, enqueueSnackbar]);

  const closeInfoSB = () => setInfoSB(false);
  const handleDetailsDialogOpen = () => setDetailsDialogOpen(true);
  const handleDetailsDialogClose = () => setDetailsDialogOpen(false);

  const formatConfidenceScore = (score) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Final Diagnosis Details"
      content="Final Diagnosis details saved successfully"
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

  const handleAddFinalDiagnosis = async () => {
    if (!formData.finalResult || !formData.finalResultDescription) {
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

      const finalDiagnosisData = {
        diagnosisId: 1, // Always 1
        modelPredictionId: parseInt(id),
        userId: userData.userId,
        finalResult: formData.finalResult,
        finalResultDescription: formData.finalResultDescription,
      };

      const response = await fetch("http://localhost:5212/api/Workflow/finaldiagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify(finalDiagnosisData),
      });

      if (!response.ok) {
        throw new Error("Failed to save final diagnosis data");
      }

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setInfoSB(true);
      setFormData({
        finalResult: "",
        finalResultDescription: "",
      });
      enqueueSnackbar("Final Diagnosis saved successfully", { variant: "success" });
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

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
              required={key === "finalResult" || key === "finalResultDescription"}
            />
          </Grid>
        ))}

        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={4} md={3}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleAddFinalDiagnosis}
              fullWidth
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </MDButton>
            {renderInfoSB}
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleDetailsDialogOpen}
              fullWidth
              disabled={!predictionDetails}
            >
              Details
            </MDButton>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <MDButton variant="gradient" color="info" onClick={handleExit} fullWidth>
              Exit
            </MDButton>
          </Grid>
        </Grid>
      </Grid>

      {/* Prediction Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Model Prediction Details</DialogTitle>
        <DialogContent dividers>
          {predictionDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Prediction Result:</strong> {predictionDetails.predictionResult}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Confidence Score:</strong>{" "}
                  {formatConfidenceScore(predictionDetails.confidenceScore)}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading prediction details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleDetailsDialogClose} color="info">
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
