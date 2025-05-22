/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import profile from "assets/images/profile.jpg";

export default function data() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState("");
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    physicalAddress: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [infoSB, setInfoSB] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
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
        enqueueSnackbar("Failed to fetch users", { variant: "error" });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      password: "Cancer@123",
      recoveryQuestion: "Who are we?",
      recoveryAnswer: "Skin Cancer",
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
        setSuccessMessage("Password reset successfully");
        setInfoSB(true);
        fetchUsers();
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
    if (!selectedUser) return;
    navigate(`/user-profile/${selectedUser.userId}`);
    handleMenuClose();
  };

  const handleEditDetails = () => {
    if (!selectedUser) return;
    setEditFormData({
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      dateOfBirth: selectedUser.dateOfBirth,
      gender: selectedUser.gender,
      physicalAddress: selectedUser.physicalAddress,
      email: selectedUser.emailAddress,
      phoneNumber: selectedUser.phoneNumber,
      role: selectedUser.role,
    });
    setEditOpen(true);
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setDeleteOpen(true);
    setDeleteConfirmId("");
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("authToken");
    const userData = {
      ...editFormData,
      password: "Cancer@123",
      recoveryQuestion: "Who are we?",
      recoveryAnswer: "Skin Cancer",
    };

    try {
      const response = await fetch(`http://localhost:5212/api/User/${selectedUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSuccessMessage("User details updated successfully");
        setInfoSB(true);
        fetchUsers();
        setEditOpen(false);
      } else {
        const errorData = await response.json();
        enqueueSnackbar(errorData.message || "Failed to update user details", { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      enqueueSnackbar("An error occurred while updating user details", { variant: "error" });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser || deleteConfirmId !== selectedUser.userId.toString()) {
      enqueueSnackbar("Please enter the correct User ID to confirm deletion", { variant: "error" });
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:5212/api/User/${selectedUser.userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage("User deleted successfully");
        setInfoSB(true);
        fetchUsers();
        setDeleteOpen(false);
      } else {
        const errorData = await response.json();
        enqueueSnackbar(errorData.message || "Failed to delete user", { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      enqueueSnackbar("An error occurred while deleting user", { variant: "error" });
    }
  };

  const closeInfoSB = () => setInfoSB(false);

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="User Management"
      content={successMessage}
      dateTime="Just Now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

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

  const EditDialog = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: 2,
            }}
            noValidate
            autoComplete="off"
          >
            {Object.entries(editFormData).map(([key, value]) => (
              <TextField
                key={key}
                name={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                value={value}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="error" onClick={() => setEditOpen(false)}>
            Cancel
          </MDButton>
          <MDButton variant="gradient" color="success" onClick={handleEditSubmit}>
            Submit
          </MDButton>
        </DialogActions>
      </Dialog>
    );
  };

  const DeleteDialog = () => (
    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Confirm User Deletion</DialogTitle>
      <DialogContent>
        <MDTypography variant="body1" mb={2}>
          Are you sure you want to delete user {selectedUser?.userId}? Please confirm ID below.
        </MDTypography>
        <TextField
          fullWidth
          id="delete-confirm-id"
          name="deleteConfirmId"
          label="Enter User ID to confirm"
          value={deleteConfirmId}
          onChange={(e) => setDeleteConfirmId(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <MDButton variant="gradient" color="success" onClick={() => setDeleteOpen(false)}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="error" onClick={handleDeleteSubmit}>
          Delete
        </MDButton>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return {
      columns: [
        { Header: "user", accessor: "user", width: "45%", align: "left" },
        { Header: "position", accessor: "position", align: "left" },
        { Header: "contact", accessor: "status", align: "center" },
        { Header: "user id", accessor: "lastseen", align: "center" },
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
            <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
            <MenuItem onClick={handleEditDetails}>Edit Details</MenuItem>
            <MenuItem onClick={handleResetPassword}>Reset Password</MenuItem>
            <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
              Delete User
            </MenuItem>
          </Menu>
        </>
      ),
    })),
    dialogs: (
      <>
        {renderInfoSB}
        <EditDialog />
        <DeleteDialog />
      </>
    ),
  };
}
