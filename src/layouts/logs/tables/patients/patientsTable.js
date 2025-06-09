/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import profile from "assets/images/profile.jpg";
import { useSnackbar } from "notistack";

export default function data() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/patients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch patients", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [enqueueSnackbar]);

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

  const PatientDetails = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description || "N/A"}</MDTypography>
    </MDBox>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading patients...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "patient", accessor: "patient", width: "20%", align: "left" },
      { Header: "personal info", accessor: "personalInfo", width: "25%", align: "left" },
      { Header: "medical info", accessor: "medicalInfo", width: "25%", align: "left" },
      { Header: "contact", accessor: "contact", width: "15%", align: "left" },
      { Header: "dates", accessor: "dates", width: "15%", align: "left" },
    ],
    rows: patients.map((patient) => ({
      patient: (
        <Patient
          image={profile}
          name={`${patient.firstName} ${patient.lastName}`}
          email={patient.emailAddress}
        />
      ),
      personalInfo: (
        <>
          <PatientDetails title="Patient ID" description={patient.patientId} />
          <PatientDetails title="User ID" description={patient.userId} />
          <PatientDetails title="Gender" description={patient.gender} />
          <PatientDetails title="DOB" description={patient.dateOfBirth} />
        </>
      ),
      medicalInfo: (
        <>
          <PatientDetails title="Skin Type" description={patient.skinType} />
          <PatientDetails title="Medical History" description={patient.medicalHistory} />
          <PatientDetails title="Family History" description={patient.familyHistory} />
          <PatientDetails
            title="Scheduled"
            description={patient.isScheduled ? formatDate(patient.scheduled) : "Not scheduled"}
          />
        </>
      ),
      contact: (
        <>
          <PatientDetails title="Phone" description={patient.phoneNumber} />
          <PatientDetails title="Address" description={patient.physicalAddress} />
        </>
      ),
      dates: (
        <>
          <PatientDetails title="Created" description={formatDate(patient.dateCreated)} />
          <PatientDetails title="Updated" description={formatDate(patient.dateUpdated)} />
        </>
      ),
    })),
  };
}
