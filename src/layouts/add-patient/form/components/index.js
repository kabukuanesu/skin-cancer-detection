import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

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

  const [errors, setErrors] = React.useState({});
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

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const skinTypeOptions = [
    { value: "Normal", label: "Normal" },
    { value: "Dry", label: "Dry" },
    { value: "Oily", label: "Oily" },
    { value: "Combination", label: "Combination" },
    { value: "Sensitive", label: "Sensitive" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.physicalAddress.trim()) newErrors.physicalAddress = "Address is required";
    if (!formData.emailAddress) newErrors.emailAddress = "Email is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.medicalHistory.trim()) newErrors.medicalHistory = "Medical history is required";
    if (!formData.familyHistory.trim()) newErrors.familyHistory = "Family history is required";
    if (!formData.skinType) newErrors.skinType = "Skin type is required";

    // Validate scheduled date if provided
    if (formData.scheduled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.scheduled);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.scheduled = "Scheduled date cannot be before today";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleDropdownChange = (field) => (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption.value,
    }));
  };

  const handleAddPatient = () => {
    if (!validateForm()) {
      setNotification({
        title: "Validation Error",
        content: "Please fill all required fields correctly",
        isError: true,
      });
      setInfoSB(true);
      return;
    }

    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId || 0;

    const patientData = {
      userId: userId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      physicalAddress: formData.physicalAddress.trim(),
      emailAddress: formData.emailAddress.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      medicalHistory: formData.medicalHistory.trim(),
      familyHistory: formData.familyHistory.trim(),
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
          content: error.message || "Ooops! Unauthorized Action.",
          isError: true,
        });
        setInfoSB(true);
        console.error("Error posting data:", error);
      });
  };

  const navigate = useNavigate();
  const handleExit = () => navigate("/patients");

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split("T")[0];

  const textFields = [
    { id: "firstName", type: "text", required: true },
    { id: "lastName", type: "text", required: true },
    { id: "dateOfBirth", type: "date", required: true },
    { id: "physicalAddress", type: "text", required: true },
    { id: "emailAddress", type: "text", required: true },
    { id: "phoneNumber", type: "text", required: true },
    { id: "medicalHistory", type: "text", required: true },
    { id: "familyHistory", type: "text", required: true },
    { id: "scheduled", type: "date", required: false },
  ];

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "30ch" },
        ".Dropdown-root": {
          width: "100%",
          marginBottom: "12px",
          fontFamily: "inherit",
          fontSize: "16px",
        },
        ".Dropdown-control": {
          padding: "8px 52px 8px 10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "white",
        },
        ".Dropdown-menu": {
          border: "1px solid #ccc",
          boxShadow: "0 1px 0 rgba(0, 0, 0, 0.06)",
        },
      }}
      noValidate
      autoComplete="off"
    >
      {textFields.map((field) => (
        <TextField
          key={field.id}
          id={field.id}
          label={`${field.id.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}${
            field.required ? " *" : ""
          }`}
          value={formData[field.id]}
          onChange={handleInputChange}
          error={!!errors[field.id]}
          helperText={errors[field.id]}
          required={field.required}
          type={field.type}
          InputLabelProps={field.type === "date" ? { shrink: true } : {}}
          inputProps={field.id === "scheduled" ? { min: today } : {}}
          fullWidth
        />
      ))}

      <div>
        <Dropdown
          options={genderOptions}
          onChange={handleDropdownChange("gender")}
          value={formData.gender || ""}
          placeholder="Gender *"
          className={errors.gender ? "Mui-error" : ""}
        />
        {errors.gender && (
          <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
            {errors.gender}
          </p>
        )}
      </div>

      <div>
        <Dropdown
          options={skinTypeOptions}
          onChange={handleDropdownChange("skinType")}
          value={formData.skinType || ""}
          placeholder="Skin Type *"
          className={errors.skinType ? "Mui-error" : ""}
        />
        {errors.skinType && (
          <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
            {errors.skinType}
          </p>
        )}
      </div>

      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleAddPatient} fullWidth>
          Register
        </MDButton>
        {renderInfoSB}
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleExit} fullWidth>
          View Patients
        </MDButton>
      </Grid>
    </Box>
  );
}
