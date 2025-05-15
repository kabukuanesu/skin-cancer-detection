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
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    physicalAddress: "",
    emailAddress: "",
    phoneNumber: "",
    medicalHistory: "",
    familyHistory: "",
    skinType: "",
    isScheduled: false,
    scheduled: "",
  });

  const [infoSB, setInfoSB] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    content: "",
    isError: false,
  });
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon={notification.isError ? "warning" : "check"}
      title={notification.title}
      content={notification.content}
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
      color={notification.isError ? "error" : "success"}
    />
  );

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const updatedFormData = {
      ...formData,
      [id]: value,
    };

    // Automatically set isScheduled based on scheduled date
    if (id === "scheduled") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      updatedFormData.isScheduled = selectedDate > today;
    }

    setFormData(updatedFormData);
  };

  const handleAddPatient = () => {
    // Validate scheduled date is not before today
    if (formData.scheduled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.scheduled);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setNotification({
          title: "Validation Error",
          content: "Scheduled date cannot be before today",
          isError: true,
        });
        setInfoSB(true);
        return;
      }
    }

    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId || 0;

    const patientData = {
      userId: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      physicalAddress: formData.physicalAddress,
      emailAddress: formData.emailAddress,
      phoneNumber: formData.phoneNumber,
      medicalHistory: formData.medicalHistory,
      familyHistory: formData.familyHistory,
      skinType: formData.skinType,
      isScheduled: formData.isScheduled,
      scheduled: formData.scheduled || new Date().toISOString(),
    };

    fetch("http://localhost:5212/api/Workflow/patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
      body: JSON.stringify(patientData),
    })
      .then(async (response) => {
        const textResponse = response.clone();
        const textData = await textResponse.text();

        if (!response.ok) {
          throw new Error(textData || "Registration failed");
        }

        try {
          const jsonData = JSON.parse(textData);
          return jsonData;
        } catch (e) {
          return { message: textData };
        }
      })
      .then((data) => {
        setNotification({
          title: "Patient Management",
          content: data.message || "Patient registered successfully",
          isError: false,
        });
        setInfoSB(true);
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          physicalAddress: "",
          emailAddress: "",
          phoneNumber: "",
          medicalHistory: "",
          familyHistory: "",
          skinType: "",
          isScheduled: false,
          scheduled: "",
        });
      })
      .catch((error) => {
        setNotification({
          title: "Registration Error",
          content: error.message || "An error occurred during registration",
          isError: true,
        });
        setInfoSB(true);
        console.error("Error posting data:", error);
      });
  };

  const navigate = useNavigate();
  const handleNext = () => navigate("/lesion");
  const handleExit = () => navigate("/patients");

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      {Object.keys(formData)
        .filter((key) => key !== "isScheduled") // Remove isScheduled from the fields to render
        .map((key) => (
          <TextField
            key={key}
            id={key}
            label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            value={formData[key]}
            onChange={handleInputChange}
            required={key !== "scheduled"} // Make scheduled optional
            type={key === "dateOfBirth" || key === "scheduled" ? "date" : "text"}
            InputLabelProps={key === "dateOfBirth" || key === "scheduled" ? { shrink: true } : {}}
            inputProps={key === "scheduled" ? { min: today } : {}} // Prevent selecting dates before today
          />
        ))}

      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleAddPatient} fullWidth>
          Register
        </MDButton>
        {renderInfoSB}
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleExit} fullWidth>
          Exit
        </MDButton>
      </Grid>
    </Box>
  );
}
