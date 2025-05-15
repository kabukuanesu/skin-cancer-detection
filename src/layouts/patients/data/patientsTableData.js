/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import { useSnackbar } from "notistack";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Image
import profile from "assets/images/profile.jpg";

export default function data() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age + " years";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filterRecentPatients = (patientsData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);

    return patientsData.filter((patient) => {
      if (!patient.scheduled) return true; // Keep unscheduled patients

      const scheduledDate = new Date(patient.scheduled);
      scheduledDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

      return scheduledDate >= fiveDaysAgo;
    });
  };

  const sortPatientsByScheduledDate = (patientsData) => {
    return [...patientsData].sort((a, b) => {
      // Handle cases where scheduled date might be null
      if (!a.scheduled && !b.scheduled) return 0;
      if (!a.scheduled) return 1; // Patients without scheduled date go to bottom
      if (!b.scheduled) return -1; // Patients without scheduled date go to bottom

      const dateA = new Date(a.scheduled);
      const dateB = new Date(b.scheduled);
      return dateA - dateB; // Earlier dates will come first
    });
  };

  const fetchPatients = () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    fetch("http://localhost:5212/api/Workflow/patients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        return response.json();
      })
      .then((data) => {
        const filteredPatients = filterRecentPatients(data);
        const sortedPatients = sortPatientsByScheduledDate(filteredPatients);
        setPatients(sortedPatients);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        enqueueSnackbar(error.message, { variant: "error" });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const Patient = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Gender = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  if (loading) {
    return {
      columns: [
        { Header: "patient", accessor: "patient", width: "45%", align: "left" },
        { Header: "gender", accessor: "gender", align: "left" },
        { Header: "contact", accessor: "contact", align: "center" },
        { Header: "scheduled date", accessor: "scheduled", align: "center" },
        { Header: "action", accessor: "action", align: "center" },
      ],
      rows: [
        {
          patient: <MDTypography>Loading patients...</MDTypography>,
          gender: "",
          contact: "",
          scheduled: "",
          action: "",
        },
      ],
    };
  }

  return {
    columns: [
      { Header: "patient", accessor: "patient", width: "45%", align: "left" },
      { Header: "gender", accessor: "gender", align: "left" },
      { Header: "contact", accessor: "contact", align: "center" },
      { Header: "scheduled date", accessor: "scheduled", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: patients.map((patient) => ({
      patient: (
        <Patient
          image={profile}
          name={`${patient.firstName} ${patient.lastName}`}
          email={patient.emailAddress}
        />
      ),
      gender: <Gender title={patient.gender} description={calculateAge(patient.dateOfBirth)} />,
      contact: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {patient.phoneNumber}
        </MDTypography>
      ),
      scheduled: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {formatDate(patient.scheduled)}
        </MDTypography>
      ),
      action: (
        <>
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            onClick={(e) => handleMenuOpen(e, patient)}
            sx={{ cursor: "pointer" }}
          >
            <Icon>more_vert</Icon>
          </MDTypography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl && selectedPatient?.patientId === patient.patientId)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
              Delete
            </MenuItem>
          </Menu>
        </>
      ),
    })),
  };
}
