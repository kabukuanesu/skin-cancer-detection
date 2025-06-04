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

// @mui material components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import profile from "assets/images/profile.jpg";

export default function usePatientTableData() {
  const [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  });
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userRole = userData?.role || "";

      try {
        // Fetch all patients
        const patientsResponse = await fetch("http://localhost:5212/api/Workflow/patients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!patientsResponse.ok) {
          throw new Error("Failed to fetch patients");
        }
        const patients = await patientsResponse.json();

        // Fetch workflow status for each patient (limited to 5 patients)
        const patientsToDisplay = patients.slice(0, 5);
        const patientsWithWorkflow = await Promise.all(
          patientsToDisplay.map(async (patient) => {
            try {
              const workflowResponse = await fetch(
                `http://localhost:5212/api/PatientRelation/${patient.patientId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    accept: "*/*",
                  },
                }
              );

              if (!workflowResponse.ok) {
                return { ...patient, workflowStatus: null };
              }
              const workflowStatus = await workflowResponse.json();
              return { ...patient, workflowStatus };
            } catch (error) {
              console.error(`Error fetching workflow for patient ${patient.patientId}:`, error);
              return { ...patient, workflowStatus: null };
            }
          })
        );

        // Filter patients based on user role
        let filtered = [];
        switch (userRole) {
          case "Dermatologist":
            filtered = patientsWithWorkflow; // Show all patients
            break;
          case "Admin":
            filtered = patientsWithWorkflow.filter(
              (patient) => patient.workflowStatus?.table === "Treatment"
            );
            break;
          case "Doctor":
          case "Nurse":
            filtered = patientsWithWorkflow.filter(
              (patient) =>
                patient.workflowStatus?.table === "Lesion" ||
                patient.workflowStatus?.table === "Image"
            );
            break;
          default:
            filtered = patientsWithWorkflow; // Show limited set for unknown roles
            break;
        }

        // Calculate age from date of birth
        const calculateAge = (dateOfBirth) => {
          if (!dateOfBirth) return "Unknown";
          const birthDate = new Date(dateOfBirth);
          const ageDifMs = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDifMs);
          return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
        };

        // Get progress value based on workflow stage
        const getProgressValue = (table) => {
          if (!table) return 10;

          switch (table) {
            case "FollowUp":
              return 100;
            case "Treatment":
              return 95;
            case "FinalDiagnosis":
              return 75;
            case "ModelPrediction":
              return 60;
            case "Image":
              return 40;
            case "Lesion":
              return 25;
            default:
              return 10; // Patient with no further relationships
          }
        };

        // Patient component for the table cell
        const Patient = ({ image, name }) => (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
              {name}
            </MDTypography>
          </MDBox>
        );

        // Prepare table data
        const columns = [
          { Header: "patients", accessor: "patients", width: "45%", align: "left" },
          { Header: "gender", accessor: "gender", width: "10%", align: "left" },
          { Header: "age", accessor: "age", align: "center" },
          { Header: "completion", accessor: "completion", align: "center" },
        ];

        const rows = filtered.map((patient) => ({
          patients: <Patient image={profile} name={`${patient.firstName} ${patient.lastName}`} />,
          gender: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {patient.gender}
            </MDTypography>
          ),
          age: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {calculateAge(patient.dateOfBirth)}
            </MDTypography>
          ),
          completion: (
            <MDBox width="8rem" textAlign="left">
              <MDProgress
                value={getProgressValue(patient.workflowStatus?.table)}
                color="info"
                variant="gradient"
                label={false}
              />
            </MDBox>
          ),
        }));

        setTableData({ columns, rows });
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar(error.message, { variant: "error" });
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  if (loading) {
    return {
      columns: [
        { Header: "patients", accessor: "patients", width: "45%", align: "left" },
        { Header: "gender", accessor: "gender", width: "10%", align: "left" },
        { Header: "age", accessor: "age", align: "center" },
        { Header: "completion", accessor: "completion", align: "center" },
      ],
      rows: [
        {
          patients: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Loading...
            </MDTypography>
          ),
          gender: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Loading...
            </MDTypography>
          ),
          age: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              Loading...
            </MDTypography>
          ),
          completion: (
            <MDBox width="8rem" textAlign="left">
              <MDProgress value={0} color="info" variant="gradient" label={false} />
            </MDBox>
          ),
        },
      ],
    };
  }

  return tableData;
}
