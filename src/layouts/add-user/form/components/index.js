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
    email: "",
    phoneNumber: "+263",
    role: "",
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

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Dermatologist", label: "Dermatologist" },
    { value: "Doctor", label: "Doctor" },
    { value: "Nurse", label: "Nurse" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.physicalAddress.trim()) newErrors.physicalAddress = "Address is required";
    if (!formData.email.includes("@skincancer.com") || !formData.email.split("@")[0])
      newErrors.email = "Valid email is required";
    if (formData.phoneNumber.length < 13) newErrors.phoneNumber = "Valid phone number is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "email") {
      // Ensure the email always ends with @skincancer.com
      const userPart = value.split("@")[0];
      const newValue = userPart ? `${userPart}@skincancer.com` : "@skincancer.com";
      setFormData((prev) => ({
        ...prev,
        [id]: newValue,
      }));
    } else if (id === "phoneNumber") {
      // Ensure phone number starts with +263 and has proper length
      let newValue = value;
      if (!value.startsWith("+263")) {
        newValue = `+263${value.replace(/^\+263/, "")}`;
      }
      // Limit to 13 characters (including +263 and 9 digits)
      newValue = newValue.substring(0, 13);
      setFormData((prev) => ({
        ...prev,
        [id]: newValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleDropdownChange = (field) => (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOption.value,
    }));
  };

  const handleAddUser = () => {
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
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      physicalAddress: formData.physicalAddress.trim(),
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
      password: "Cancer@123",
      recoveryQuestion: "Who are we?",
      recoveryAnswer: "Skin Cancer",
    };

    fetch("http://localhost:5212/api/User", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorMessage = "Registration failed";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        setNotification({
          title: "User Management",
          content: data.message || "User registered successfully",
          isError: false,
        });
        setInfoSB(true);
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          physicalAddress: "",
          email: "",
          phoneNumber: "+263",
          role: "",
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
  const handleNext = () => navigate("/users");

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
      <TextField
        id="firstName"
        label="First Name *"
        value={formData.firstName}
        onChange={handleInputChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        fullWidth
      />

      <TextField
        id="lastName"
        label="Last Name *"
        value={formData.lastName}
        onChange={handleInputChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        fullWidth
      />

      <TextField
        id="dateOfBirth"
        label="Date of Birth *"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

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

      <TextField
        id="physicalAddress"
        label="Physical Address *"
        value={formData.physicalAddress}
        onChange={handleInputChange}
        error={!!errors.physicalAddress}
        helperText={errors.physicalAddress}
        fullWidth
      />

      <TextField
        id="email"
        label="Email *"
        value={formData.email}
        onChange={handleInputChange}
        error={!!errors.email}
        helperText={errors.email || "Must end with @skincancer.com"}
        fullWidth
      />

      <TextField
        id="phoneNumber"
        label="Phone Number *"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber || "Must start with +263"}
        fullWidth
      />

      <div>
        <Dropdown
          options={roleOptions}
          onChange={handleDropdownChange("role")}
          value={formData.role || ""}
          placeholder="Role *"
          className={errors.role ? "Mui-error" : ""}
        />
        {errors.role && (
          <p style={{ color: "#d32f2f", fontSize: "0.75rem", margin: "3px 14px 0" }}>
            {errors.role}
          </p>
        )}
      </div>

      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleAddUser} fullWidth>
          Register
        </MDButton>
        {renderInfoSB}
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <MDButton variant="gradient" color="info" onClick={handleNext} fullWidth>
          View Staff Members
        </MDButton>
      </Grid>
    </Box>
  );
}
