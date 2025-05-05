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

import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useSnackbar } from "notistack";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Image
import profile from "assets/images/profile.jpg";
import { useEffect } from "react";

export default function data() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("authToken");
    const resetData = {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      dateOfBirth: selectedUser.dateOfBirth,
      gender: selectedUser.gender,
      physicalAddress: selectedUser.physicalAddress,
      email: selectedUser.emailAddress,
      phoneNumber: selectedUser.phoneNumber,
      role: selectedUser.role,
      password: "Cancer@123", // Hardcoded password
      recoveryQuestion: "Who are we?", // Hardcoded recovery question
      recoveryAnswer: "Skin Cancer", // Hardcoded recovery answer
    };

    try {
      const response = await fetch(`http://localhost:5212/api/User/${selectedUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        enqueueSnackbar("Password reset successfully", { variant: "success" });
        // Refresh users data
        const updatedUsers = await fetch("http://localhost:5212/api/User", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }).then((res) => res.json());
        setUsers(updatedUsers);
      } else {
        const errorData = await response.json();
        enqueueSnackbar(errorData.message || "Failed to reset password", { variant: "error" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      enqueueSnackbar("An error occurred while resetting password", { variant: "error" });
    } finally {
      handleMenuClose();
    }
  };

  const handleViewProfile = () => {
    console.log("View profile for:", selectedUser);
    handleMenuClose();
  };

  const handleEditDetails = () => {
    console.log("Edit details for:", selectedUser);
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    console.log("Delete user:", selectedUser);
    handleMenuClose();
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:5212/api/User", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  const User = ({ image, name, email }) => (
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

  const Position = ({ title, description }) => (
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
        { Header: "user", accessor: "user", width: "45%", align: "left" },
        { Header: "position", accessor: "position", align: "left" },
        { Header: "status", accessor: "status", align: "center" },
        { Header: "last seen", accessor: "lastseen", align: "center" },
        { Header: "action", accessor: "action", align: "center" },
      ],
      rows: [
        {
          user: <MDTypography>Loading...</MDTypography>,
          position: "",
          status: "",
          lastseen: "",
          action: "",
        },
      ],
    };
  }

  return {
    columns: [
      { Header: "name", accessor: "user", width: "30%", align: "left" },
      { Header: "position", accessor: "position", align: "left" },
      { Header: "contact", accessor: "status", align: "center" },
      { Header: "user id", accessor: "lastseen", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: users.map((user) => ({
      user: (
        <User
          image={profile}
          name={`${user.firstName} ${user.lastName}`}
          email={user.emailAddress}
        />
      ),
      position: <Position title={user.role} description={user.gender} />,
      status: (
        <MDBox ml={-1}>
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {user.phoneNumber}
          </MDTypography>
        </MDBox>
      ),
      lastseen: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {user.userId}
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
            onClick={(e) => handleMenuOpen(e, user)}
            sx={{ cursor: "pointer" }}
          >
            <Icon>more_vert</Icon>
          </MDTypography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl && selectedUser?.userId === user.userId)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleResetPassword}>Reset Password</MenuItem>
            <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
            <MenuItem onClick={handleEditDetails}>Edit Details</MenuItem>
            <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
              Delete User
            </MenuItem>
          </Menu>
        </>
      ),
    })),
  };
}
