import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDProgress from "components/MDProgress";

// Image
import profile from "assets/images/profile.jpg";

export default function usePatientData() {
  const [patientsData, setPatientsData] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

        // Fetch workflow status for each patient
        const patientsWithWorkflow = await Promise.all(
          patients.map(async (patient) => {
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
            filtered = []; // Unknown role - show nothing
            break;
        }

        setPatientsData(patientsWithWorkflow);
        setFilteredPatients(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar(error.message, { variant: "error" });
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Unknown";
    const birthDate = new Date(dateOfBirth);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
  };

  const getNextStage = (table) => {
    if (!table) return "Unknown";

    switch (table) {
      case "Patient":
        return "Lesion";
      case "Lesion":
        return "Image";
      case "Image":
        return "Model";
      case "ModelPrediction":
        return "Diagnosis";
      case "FinalDiagnosis":
        return "Treatment";
      case "Treatment":
        return "Follow";
      case "FollowUp":
        return "Treatment";
      default:
        return "Unknown";
    }
  };

  const getProgressValue = (table) => {
    if (!table) return 0;

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

  const handleContinue = (patient) => {
    const { patientId, workflowStatus } = patient;

    if (!workflowStatus) {
      navigate(`/lesion/${patientId}`);
      return;
    }

    const { table } = workflowStatus;
    let id;

    if (table === "ModelPrediction") {
      id = workflowStatus.modelPredictionId;
    } else if (table === "FinalDiagnosis") {
      id = workflowStatus.finalDiagnosisId;
    } else {
      id = workflowStatus[`${table.toLowerCase()}Id`] || patientId;
    }

    switch (table) {
      case "Patient":
        navigate(`/lesion/${patientId}`);
        break;
      case "Lesion":
        navigate(`/image/${id}`);
        break;
      case "Image":
        navigate(`/add-prediction/${id}`);
        break;
      case "ModelPrediction":
        navigate(`/final-diagnosis/${id}`);
        break;
      case "FinalDiagnosis":
        navigate(`/treatment/${id}`);
        break;
      case "Treatment":
        navigate(`/follow-up/${id}`);
        break;
      case "FollowUp":
        navigate(`/treatment/${id}`);
        break;
      default:
        navigate(`/lesion/${patientId}`);
        break;
    }
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

  Patient.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const Gender = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  Gender.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  Progress.propTypes = {
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]).isRequired,
    value: PropTypes.number.isRequired,
  };

  if (loading) {
    return {
      columns: [],
      rows: [],
      loading: true,
    };
  }

  const rows = filteredPatients.map((patient) => {
    const nextStage = patient.workflowStatus
      ? getNextStage(patient.workflowStatus.table)
      : "Lesion";
    const progressValue = patient.workflowStatus
      ? getProgressValue(patient.workflowStatus.table)
      : 10;

    return {
      patient: (
        <Patient
          image={profile}
          name={`${patient.firstName} ${patient.lastName}`}
          email={patient.emailAddress}
        />
      ),
      gender: <Gender title={patient.gender} description={calculateAge(patient.dateOfBirth)} />,
      stage: (
        <MDBox ml={-1}>
          <MDBadge
            badgeContent={nextStage}
            color={nextStage === "Unknown" ? "secondary" : "success"}
            variant="gradient"
            size="sm"
          />
        </MDBox>
      ),
      completion: <Progress color="info" value={progressValue} />,
      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleContinue(patient)}
          style={{ cursor: "pointer" }}
        >
          Continue
        </MDTypography>
      ),
    };
  });

  return {
    columns: [
      { Header: "patient", accessor: "patient", width: "30%", align: "left" },
      { Header: "gender", accessor: "gender", align: "left" },
      { Header: "next stage", accessor: "stage", align: "center" },
      { Header: "completion", accessor: "completion", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows,
    loading: false,
  };
}
