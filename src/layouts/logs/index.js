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
  const handleViewPatients = () => navigate("/log-patients");
  const handleViewLesions = () => navigate("/log-lesions");
  const handleViewImages = () => navigate("/log-images");
  const handleViewPredictions = () => navigate("/log-predictions");
  const handleViewDiagnoses = () => navigate("/log-diagnoses");
  const handleViewTreatments = () => navigate("/log-treatments");
  const handleViewBookings = () => navigate("/log-bookings");
  const handleViewLicence = () => navigate("/log-licenses");
  const handleViewTc = () => navigate("/log-tc");
  const handleViewUserLogs = () => navigate("/user-logs");
  const handleViewPatientLogs = () => navigate("/patient-logs");

  const handleDownloadAppUsers = () => navigate(0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewAppUsers} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="App Users"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "System Users",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewPatients} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="groups"
                title="Patients"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Patients Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewLesions} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="person_add"
                title="Lesions"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Lesions Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewImages} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="camera"
                title="Images"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Images Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewPredictions} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="screen_search_desktop"
                title="Predictions"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Predictions Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewDiagnoses} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="sensor_occupied"
                title="Diagnoses"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Diagnoses Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewTreatments} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="content_paste"
                title="Treatments"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Treatments Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewBookings} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="info"
                icon="bookmark_added"
                title="Bookings"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Bookings Data",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewLicence} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="secondary"
                icon="copyright"
                title="Licenses"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "License Agreements",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewTc} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="secondary"
                icon="thumb_up"
                title="Terms and Conditions"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Agreed T&C's",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewUserLogs} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="secondary"
                icon="description"
                title="User Logs"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Search User",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleViewPatientLogs} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="secondary"
                icon="description"
                title="Patient Logs"
                count=""
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Search Patient",
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
