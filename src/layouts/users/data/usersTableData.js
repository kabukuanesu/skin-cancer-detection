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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Image
import profile from "assets/images/profile.jpg";
import { useEffect, useState } from "react";

export default function data() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

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
      { Header: "gender", accessor: "status", align: "center" },
      { Header: "last active", accessor: "lastseen", align: "center" },
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
      position: <Position title={user.role} description={user.phoneNumber} />,
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={user.gender} color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      lastseen: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {formatDate(user.dateUpdated)}
        </MDTypography>
      ),
      action: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </MDTypography>
      ),
    })),
  };
}
