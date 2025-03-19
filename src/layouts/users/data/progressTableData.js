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

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Image
import persona from "assets/images/profile.jpg";

export default function data() {
  const User = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

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

  return {
    columns: [
      { Header: "user", accessor: "user", width: "30%", align: "left" },
      { Header: "position", accessor: "position", align: "left" },
      { Header: "email address", accessor: "emailaddress", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        user: <User image={persona} name="Asana" />,
        position: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            $2,500
          </MDTypography>
        ),
        emailaddress: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            working
          </MDTypography>
        ),
        status: <Progress color="info" value={60} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        user: <User image={persona} name="Github" />,
        position: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            $5,000
          </MDTypography>
        ),
        emailaddress: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            done
          </MDTypography>
        ),
        status: <Progress color="success" value={100} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
      {
        user: <User image={persona} name="Atlassian" />,
        position: (
          <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
            $3,400
          </MDTypography>
        ),
        emailaddress: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            canceled
          </MDTypography>
        ),
        status: <Progress color="error" value={30} />,
        action: (
          <MDTypography component="a" href="#" color="text">
            <Icon>more_vert</Icon>
          </MDTypography>
        ),
      },
    ],
  };
}
