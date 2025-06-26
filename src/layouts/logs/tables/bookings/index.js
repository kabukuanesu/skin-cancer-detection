import { useNavigate } from "react-router-dom";
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import bookingsTable from "layouts/logs/tables/bookings/bookingsTable";

function Tables() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { columns, rows } = bookingsTable();

  const handleBack = () => navigate(-1);
  const handleSaveAsClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDownload = async (type) => {
    try {
      const token = localStorage.getItem("authToken");
      const endpoint =
        type === "pdf"
          ? "http://localhost:5212/api/export/followups/pdf"
          : "http://localhost:5212/api/export/followups/csv";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download ${type} file`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename based on type and current date
      const date = new Date().toISOString().split("T")[0];
      link.download = `followups_${date}.${type}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      handleMenuClose();
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      alert(`Failed to download ${type} file`);
    }
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
                  Bookings Data
                </MDTypography>
                <MDBox display="flex" gap={1}>
                  <MDButton
                    variant="gradient"
                    color="light"
                    onClick={handleSaveAsClick}
                    aria-controls={open ? "save-as-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    Save As...
                  </MDButton>
                  <Menu
                    id="save-as-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "save-as-button",
                    }}
                  >
                    <MenuItem onClick={() => handleDownload("pdf")}>Save as PDF</MenuItem>
                    <MenuItem onClick={() => handleDownload("csv")}>Save as CSV</MenuItem>
                  </Menu>
                  <MDButton variant="gradient" color="light" onClick={handleBack}>
                    Back
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
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
