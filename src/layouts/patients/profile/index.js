import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDAvatar from "components/MDAvatar";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/patients/profile/components/Header";

// Images
import profileImage from "assets/images/profile.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Overview() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        // Fetch basic patient data
        const patientResponse = await fetch(
          `http://localhost:5212/api/Workflow/patient/${patientId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );

        if (!patientResponse.ok) {
          throw new Error("Failed to fetch patient");
        }
        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Fetch workflow status
        const workflowResponse = await fetch(
          `http://localhost:5212/api/PatientRelation/${patientId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );

        if (!workflowResponse.ok) {
          throw new Error("Failed to fetch workflow status");
        }
        const workflowData = await workflowResponse.json();
        console.log("Workflow Status Data:", workflowData); // Add this line
        setWorkflowStatus(workflowData);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar(error.message, { variant: "error" });
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, enqueueSnackbar]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getProgressValue = () => {
    if (!workflowStatus) return 0;

    switch (workflowStatus.table) {
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

  const handleWorkflow = () => {
    if (!workflowStatus) {
      enqueueSnackbar("Workflow status not available", { variant: "error" });
      return;
    }

    const { table } = workflowStatus;
    console.log("Current workflow status:", workflowStatus); // Debug log

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

  if (loading) {
    return (
      <DashboardLayout>
        <MDBox mb={2} />
        <Header>
          <MDBox mt={5} mb={3}>
            <MDTypography>Loading patient data...</MDTypography>
          </MDBox>
        </Header>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <MDBox mb={2} />
        <Header>
          <MDBox mt={5} mb={3}>
            <MDTypography>Patient not found</MDTypography>
          </MDBox>
        </Header>
        <Footer />
      </DashboardLayout>
    );
  }

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center" justifyContent="center" mt={3} mb={3}>
      <MDBox width="100%" mx={4}>
        <MDTypography variant="h6" textAlign="center" mb={1}>
          Patient Workflow Progress
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <MDBox width="100%">
            <MDProgress variant="gradient" color={color} value={value} />
          </MDBox>
          <MDBox ml={1}>
            <MDTypography variant="button" color="text" fontWeight="medium">
              {value}%
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" mt={1}>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Patient
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Lesion
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Image
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Prediction
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Diagnosis
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Treatment
          </MDTypography>
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Follow-up
          </MDTypography>
        </MDBox>
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

  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <MDBox position="relative" mb={5}>
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="5.55rem"
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "50%",
            overflow: "hidden",
          }}
        />
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <MDAvatar src={profileImage} alt="profile-image" size="xl" shadow="sm" />
            </Grid>
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {`${patient.firstName} ${patient.lastName}`}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  {`Patient ID: ${patient.patientId}`}
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </Card>
      </MDBox>
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Personal Information"
              description={`${patient.firstName}'s personal details`}
              info={{
                "Full Name": `${patient.firstName} ${patient.lastName}`,
                "Date of Birth": formatDate(patient.dateOfBirth),
                Gender: patient.gender,
                Address: patient.physicalAddress,
                Email: patient.emailAddress,
              }}
              social={[
                {
                  link: "https://www.facebook.com/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
          <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Contact & Medical Info"
              description={`${patient.firstName}'s medical details`}
              info={{
                "Phone Number": patient.phoneNumber,
                "Medical History": patient.medicalHistory,
                "Family History": patient.familyHistory,
                "Skin Type": patient.skinType,
              }}
              social={[
                {
                  link: "https://www.facebook.com/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
          <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Appointment Details"
              description={`${patient.firstName}'s appointment information`}
              info={{
                "Is Scheduled": patient.isScheduled ? "Yes" : "No",
                "Scheduled Date": formatDate(patient.scheduled),
                "Date Created": formatDate(patient.dateCreated),
                "Last Updated": formatDate(patient.dateUpdated),
              }}
              social={[
                {
                  link: "https://www.facebook.com/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </Grid>
      </MDBox>
      <Progress color="info" value={getProgressValue()} />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6} lg={12}>
          <MDButton variant="gradient" color="info" onClick={handleWorkflow} fullWidth>
            Continue Patient Workflow
          </MDButton>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
