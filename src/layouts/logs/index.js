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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function Logs() {
  const navigate = useNavigate();
  const handleView = () => navigate("/dashboard");
  const handleDownload = () => navigate("/profile");
  const handleSearch = () => navigate("/pending");

  const handleViewAppUsers = () => navigate("/app-users");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="App Users"
                count={
                  <span onClick={handleViewAppUsers} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Patients Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Lesions Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Images Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Predictions Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Diagnoses Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Treatments Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Bookings Data"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Licenses"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Terms and Conditions"
                count={
                  <span onClick={handleView} style={{ cursor: "pointer" }}>
                    View
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleDownload} style={{ cursor: "pointer" }}>
                      Download
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="User Logs"
                count={
                  <span onClick={handleSearch} style={{ cursor: "pointer" }}>
                    Search
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleSearch} style={{ cursor: "pointer" }}>
                      Search User
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Patient Logs"
                count={
                  <span onClick={handleSearch} style={{ cursor: "pointer" }}>
                    Search
                  </span>
                }
                percentage={{
                  color: "success",
                  amount: "",
                  label: (
                    <span onClick={handleSearch} style={{ cursor: "pointer" }}>
                      Search Patient
                    </span>
                  ),
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Logs;
