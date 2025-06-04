import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
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
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Images
import profileImage from "assets/images/profile.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.userId || 0;

      try {
        const response = await fetch(`http://localhost:5212/api/UserProfile/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userProfile = await response.json();
        setUser(userProfile);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar(error.message, { variant: "error" });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [enqueueSnackbar]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <MDBox mb={2} />
        <MDBox mt={5} mb={3}>
          <MDTypography>Loading user profile...</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <MDBox mb={2} />
        <MDBox mt={5} mb={3}>
          <MDTypography>User profile not found</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <MDBox position="relative" mb={5}>
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="10.55rem"
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
                  {`${user.firstName} ${user.lastName}`}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  {`Role: ${user.role}`}
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
              description="User's personal details"
              info={{
                "Full Name": `${user.firstName} ${user.lastName}`,
                "Date of Birth": formatDate(user.dateOfBirth),
                Gender: user.gender,
                Address: user.physicalAddress,
                Email: user.emailAddress,
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
              title="Contact Information"
              description="User's contact details"
              info={{
                "Phone Number": user.phoneNumber,
                "Physical Address": user.physicalAddress,
                "Email Address": user.emailAddress,
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
              title="Account Information"
              description="User's account details"
              info={{
                Role: user.role,
                "User ID": user.userId,
                "Date Created": formatDate(user.dateCreated),
                "Last Updated": formatDate(user.dateUpdated),
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
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6} lg={12}>
          <MDButton variant="gradient" color="info" onClick={handleBack} fullWidth>
            BACK TO DASHBOARD
          </MDButton>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default UserProfile;
