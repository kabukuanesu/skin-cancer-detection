/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchTreatments = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/treatments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch treatments");
        }

        const data = await response.json();
        setTreatments(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch treatments", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [enqueueSnackbar]);

  const TreatmentDetails = ({ title, description }) => (
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
    return date.toLocaleDateString();
  };

  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };

  const formatTreatmentType = (type) => {
    if (!type) return "N/A";
    const typeMap = {
      pills: "Medication",
      surgery: "Surgical Procedure",
      therapy: "Therapy",
      cream: "Topical Cream",
      other: "Other Treatment",
    };
    return typeMap[type.toLowerCase()] || type;
  };

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading treatments...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "treatment info", accessor: "treatmentInfo", width: "30%", align: "left" },
      { Header: "treatment details", accessor: "treatmentDetails", width: "40%", align: "left" },
      { Header: "follow-up", accessor: "followUp", width: "30%", align: "left" },
    ],
    rows: treatments.map((treatment) => ({
      treatmentInfo: (
        <>
          <TreatmentDetails title="Treatment ID" description={treatment.treatmentId} />
          <TreatmentDetails title="Diagnosis ID" description={treatment.finalDiagnosisId} />
          <TreatmentDetails title="User ID" description={treatment.userId} />
        </>
      ),
      treatmentDetails: (
        <>
          <TreatmentDetails
            title="Treatment Type"
            description={formatTreatmentType(treatment.treatmentType)}
          />
          <TreatmentDetails title="Description" description={treatment.treatmentDescription} />
          <TreatmentDetails
            title="Treatment Date"
            description={formatDate(treatment.treatmentDate)}
          />
        </>
      ),
      followUp: (
        <>
          <TreatmentDetails
            title="Follow Up Required"
            description={formatBoolean(treatment.isFollowUp)}
          />
          <TreatmentDetails
            title="Follow Up Date"
            description={treatment.isFollowUp ? formatDate(treatment.followUpDate) : "N/A"}
          />
        </>
      ),
    })),
  };
}
