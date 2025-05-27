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

export default function LesionForm() {
  const { patientId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    lesionLocation: "",
    lesionDescription: "",
    dermoscopicFeatures: "",
  });

  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5212/api/Workflow/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }

        const data = await response.json();
        setPatientDetails(data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        enqueueSnackbar("Failed to load patient details", { variant: "error" });
      }
    };

    fetchPatientDetails();
  }, [patientId, enqueueSnackbar]);

  const closeInfoSB = () => setInfoSB(false);
  const handleDetailsDialogOpen = () => setDetailsDialogOpen(true);
  const handleDetailsDialogClose = () => setDetailsDialogOpen(false);

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

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
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleDetailsDialogOpen}
              fullWidth
              disabled={!patientDetails}
            >
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

      {/* Patient Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={handleDetailsDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent dividers>
          {patientDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>First Name:</strong> {patientDetails.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Last Name:</strong> {patientDetails.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Age:</strong> {calculateAge(patientDetails.dateOfBirth)} years
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Gender:</strong> {patientDetails.gender}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Physical Address:</strong> {patientDetails.physicalAddress}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {patientDetails.emailAddress}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Phone:</strong> {patientDetails.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Medical History:</strong> {patientDetails.medicalHistory}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Family History:</strong> {patientDetails.familyHistory}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <strong>Skin Type:</strong> {patientDetails.skinType}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading patient details...</Typography>
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
