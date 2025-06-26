import { useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Tables() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => navigate(-1);

  const handleSearch = async () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5212/api/Logs/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError("Failed to fetch user data. Please check the User ID and try again.");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderDataSection = (title, data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return null;
    }

    return (
      <MDBox mb={3}>
        <MDTypography variant="h6" gutterBottom>
          {title}
        </MDTypography>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "4px",
            overflowX: "auto",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  User Logs
                </MDTypography>
                <MDBox display="flex" gap={1}>
                  <MDButton variant="gradient" color="light" onClick={handleBack}>
                    Print
                  </MDButton>
                  <MDButton variant="gradient" color="light" onClick={handleBack}>
                    Back
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox p={3}>
                <MDBox display="flex" gap={2} mb={3}>
                  <TextField
                    label="Enter User ID"
                    variant="outlined"
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    fullWidth
                  />
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </MDButton>
                </MDBox>

                {error && (
                  <MDTypography variant="body2" color="error">
                    {error}
                  </MDTypography>
                )}

                {userData && (
                  <MDBox mt={3}>
                    <MDTypography variant="h5" gutterBottom>
                      User Data for ID: {userId}
                    </MDTypography>

                    {renderDataSection("User Details", userData.user)}
                    {renderDataSection("Authentication Details", userData.authentications)}
                    {renderDataSection("Patients", userData.patients)}
                    {renderDataSection("Bookings", userData.bookings)}
                    {renderDataSection("Lesions", userData.lesions)}
                    {renderDataSection("Workflows", userData.workflows)}
                    {renderDataSection("Biopsies", userData.biopsies)}
                    {renderDataSection("Images", userData.images)}
                    {renderDataSection("Workflow Stages", userData.workflowStages)}
                    {renderDataSection("Diagnoses", userData.diagnoses)}
                    {renderDataSection("Model Predictions", userData.modelPredictions)}
                    {renderDataSection("Final Diagnoses", userData.finalDiagnoses)}
                    {renderDataSection("Treatments", userData.treatments)}
                    {renderDataSection("Follow-ups", userData.followUps)}
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
