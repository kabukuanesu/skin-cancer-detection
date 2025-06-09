/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import profile from "assets/images/profile.jpg";
import { useSnackbar } from "notistack";

export default function data() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/User", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch users", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [enqueueSnackbar]);

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

  const UserDetails = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading users...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "user", accessor: "user", width: "25%", align: "left" },
      { Header: "details", accessor: "details", width: "25%", align: "left" },
      { Header: "contact", accessor: "contact", width: "25%", align: "left" },
      { Header: "dates", accessor: "dates", width: "25%", align: "left" },
    ],
    rows: users.map((user) => ({
      user: (
        <User
          image={profile}
          name={`${user.firstName} ${user.lastName}`}
          email={user.emailAddress}
        />
      ),
      details: (
        <>
          <UserDetails title="Role" description={user.role} />
          <UserDetails title="Gender" description={user.gender} />
          <UserDetails title="DOB" description={user.dateOfBirth} />
          <UserDetails title="Address" description={user.physicalAddress} />
        </>
      ),
      contact: (
        <>
          <UserDetails title="Phone" description={user.phoneNumber} />
          <UserDetails title="User ID" description={user.userId} />
        </>
      ),
      dates: (
        <>
          <UserDetails title="Created" description={new Date(user.dateCreated).toLocaleString()} />
          <UserDetails title="Updated" description={new Date(user.dateUpdated).toLocaleString()} />
        </>
      ),
    })),
  };
}
