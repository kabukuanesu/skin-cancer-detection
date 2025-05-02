/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryQuestion, setRecoveryQuestion] = useState("");
  const [recoveryAnswer, setRecoveryAnswer] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    isError: false,
  });

  const [infoSB, setInfoSB] = useState(false);
  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon={notification.isError ? "warning" : "check"}
      title={notification.isError ? "Update Failed" : "Update Successful"}
      content={notification.message}
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
      color={notification.isError ? "error" : "success"}
    />
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    setNotification({ message: "", isError: false });

    if (!agreeTerms) {
      setNotification({
        message: "You must agree to the terms and conditions",
        isError: true,
      });
      setInfoSB(true);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5212/api/Authentication/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          recoveryQuestion,
          recoveryAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      setNotification({
        message: data.message || "Authentication details updated successfully!",
        isError: false,
      });
      setInfoSB(true);

      // Clear form fields
      setCurrentPassword("");
      setNewPassword("");
      setRecoveryQuestion("");
      setRecoveryAnswer("");
    } catch (err) {
      setNotification({
        message: err.message || "An error occurred during update",
        isError: true,
      });
      setInfoSB(true);
      console.error("Update error:", err);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Update Authentication
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your new password and recovery question to continue!
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleUpdate}>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Current Password"
                variant="standard"
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="New Password"
                variant="standard"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Recovery Question"
                variant="standard"
                fullWidth
                value={recoveryQuestion}
                onChange={(e) => setRecoveryQuestion(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Recovery Answer"
                variant="standard"
                fullWidth
                value={recoveryAnswer}
                onChange={(e) => setRecoveryAnswer(e.target.value)}
                required
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={!agreeTerms}
                sx={{
                  position: "relative", // Required for z-index to work
                  zIndex: 1, // Brings button to foreground
                  // ... other styles ...
                }}
              >
                update
              </MDButton>
              {renderInfoSB}
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already updated?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
