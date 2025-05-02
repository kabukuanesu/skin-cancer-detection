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
    email: "",
    phoneNumber: "",
    role: "",
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
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleAddUser = () => {
    const token = localStorage.getItem("authToken");
    const userData = {
      ...formData,
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
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }
        console.log(response);
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
          phoneNumber: "",
          role: "",
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
  const handleNext = () => navigate("/users");

  // Fields that should be displayed in the form
  const displayFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "physicalAddress",
    "email",
    "phoneNumber",
    "role",
  ];

  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      {displayFields.map((key) => (
        <TextField
          key={key}
          id={key}
          label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          value={formData[key]}
          onChange={handleInputChange}
          required
        />
      ))}

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
