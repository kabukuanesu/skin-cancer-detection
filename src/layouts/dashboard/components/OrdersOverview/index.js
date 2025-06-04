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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:5212/api/Dashboard/upcoming-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }

        const data = await response.json();
        setUpcomingEvents(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        enqueueSnackbar(error.message, { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [enqueueSnackbar]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day} ${month} ${hours}:${minutes} ${ampm}`;
  };

  const getEventColor = (type) => {
    return type === "Appointment" ? "success" : "info";
  };

  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const paginatedEvents = upcomingEvents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h6" fontWeight="medium">
            Upcoming Events
          </MDTypography>
          <MDBox mt={0} mb={2}>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Loading events...
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Upcoming Events
        </MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Showing {paginatedEvents.length} of {upcomingEvents.length} events
          </MDTypography>
          <MDBox display="flex">
            <IconButton size="small" onClick={handlePrevPage} disabled={currentPage === 0}>
              <Icon>chevron_left</Icon>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <Icon>chevron_right</Icon>
            </IconButton>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event, index) => (
            <TimelineItem
              key={event.id}
              color={getEventColor(event.type)}
              icon="notifications"
              title={event.description}
              dateTime={formatDateTime(event.date)}
              lastItem={index === paginatedEvents.length - 1}
            />
          ))
        ) : (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            No upcoming events found
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
