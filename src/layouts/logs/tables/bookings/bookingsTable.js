/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("authToken");
      try {
        // Fetch both endpoints in parallel
        const [patientsResponse, followupsResponse] = await Promise.all([
          fetch("http://localhost:5212/api/Workflow/patients", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }),
          fetch("http://localhost:5212/api/Workflow/followups", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }),
        ]);

        if (!patientsResponse.ok || !followupsResponse.ok) {
          throw new Error("Failed to fetch bookings data");
        }

        const patients = await patientsResponse.json();
        const followups = await followupsResponse.json();
        const today = new Date();

        // Process and combine the data
        const combinedData = [
          // Filter and map patients with scheduled appointments
          ...patients
            .filter((patient) => patient.isScheduled && new Date(patient.scheduled) > today)
            .map((patient) => ({
              type: "appointment",
              id: patient.patientId,
              userId: patient.userId,
              name: `${patient.firstName} ${patient.lastName}`,
              date: patient.scheduled,
              description: `Patient appointment`,
              relatedId: patient.patientId,
            })),

          // Filter and map follow-ups
          ...followups
            .filter((followup) => followup.isFollowUp && new Date(followup.followingUpDate) > today)
            .map((followup) => ({
              type: "followup",
              id: followup.followUpId,
              userId: followup.userId,
              name: `Follow-up for treatment ${followup.treatmentId}`,
              date: followup.followingUpDate,
              description: followup.followUpDescription || "Follow-up visit",
              relatedId: followup.treatmentId,
            })),
        ];

        // Sort by date (earliest first)
        combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setBookings(combinedData);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch bookings", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [enqueueSnackbar]);

  const BookingDetails = ({ title, description }) => (
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
      rows: [{ loading: <MDTypography>Loading bookings...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "booking type", accessor: "type", width: "15%", align: "left" },
      { Header: "details", accessor: "details", width: "35%", align: "left" },
      { Header: "date/time", accessor: "dateTime", width: "25%", align: "left" },
      { Header: "description", accessor: "description", width: "25%", align: "left" },
    ],
    rows: bookings.map((booking) => ({
      type: (
        <BookingDetails
          title="Type"
          description={booking.type === "appointment" ? "Appointment" : "Follow-up"}
        />
      ),
      details: (
        <>
          <BookingDetails title="ID" description={booking.id} />
          <BookingDetails title="User ID" description={booking.userId} />
          <BookingDetails title="Related ID" description={booking.relatedId} />
        </>
      ),
      dateTime: <BookingDetails title="Scheduled For" description={formatDate(booking.date)} />,
      description: <BookingDetails title="Description" description={booking.description} />,
    })),
  };
}
