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

export default function TextFields() {
  const { id } = useParams(); // finalDiagnosisId from URL
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    treatmentType: "",
    treatmentDescription: "",
  });

  const [finalDiagnosisDetails, setFinalDiagnosisDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFinalDiagnosisDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5212/api/Workflow/finaldiagnosis/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch final diagnosis details");
        }

        const data = await response.json();
        setFinalDiagnosisDetails(data);
      } catch (error) {
        console.error("Error fetching final diagnosis details:", error);
        enqueueSnackbar("Failed to load final diagnosis details", { variant: "error" });
      }
    };

    fetchFinalDiagnosisDetails();
  }, [id, enqueueSnackbar]);

  const closeInfoSB = () => setInfoSB(false);
  const handleDetailsDialogOpen = () => setDetailsDialogOpen(true);
  const handleDetailsDialogClose = () => setDetailsDialogOpen(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Treatment Details"
      content="Treatment details saved successfully"
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

  const handleAddTreatment = async () => {
    if (!formData.treatmentType || !formData.treatmentDescription) {
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

      const treatmentData = {
        finalDiagnosisId: parseInt(id),
        userId: userData.userId,
        treatmentType: formData.treatmentType,
        treatmentDescription: formData.treatmentDescription,
        isFollowUp: true,
      };

      const response = await fetch("http://localhost:5212/api/Workflow/treatment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify(treatmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save treatment data");
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
        treatmentType: "",
        treatmentDescription: "",
      });
      enqueueSnackbar("Treatment saved successfully", { variant: "success" });
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
              required={key === "treatmentType" || key === "treatmentDescription"}
            />
          </Grid>
        ))}

        <Grid item xs={12} container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm={4} md={3}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleAddTreatment}
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
              disabled={!finalDiagnosisDetails}
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

      {/* Final Diagnosis Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Final Diagnosis Details</DialogTitle>
        <DialogContent dividers>
          {finalDiagnosisDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Final Result:</strong> {finalDiagnosisDetails.finalResult}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Description:</strong> {finalDiagnosisDetails.finalResultDescription}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading final diagnosis details...</Typography>
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
