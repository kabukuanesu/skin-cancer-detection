/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [lesions, setLesions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchLesions = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/lesions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lesions");
        }

        const data = await response.json();
        setLesions(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch lesions", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchLesions();
  }, [enqueueSnackbar]);

  const LesionDetails = ({ title, description }) => (
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

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading lesions...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "identification", accessor: "identification", width: "25%", align: "left" },
      { Header: "location & dates", accessor: "locationDates", width: "25%", align: "left" },
      { Header: "description", accessor: "description", width: "25%", align: "left" },
      { Header: "examination", accessor: "examination", width: "25%", align: "left" },
    ],
    rows: lesions.map((lesion) => ({
      identification: (
        <>
          <LesionDetails title="Lesion ID" description={lesion.lesionId} />
          <LesionDetails title="Patient ID" description={lesion.patientId} />
          <LesionDetails title="User ID" description={lesion.userId} />
        </>
      ),
      locationDates: (
        <>
          <LesionDetails title="Location" description={lesion.lesionLocation} />
          <LesionDetails title="Detection Date" description={formatDate(lesion.dateOfDetection)} />
          <LesionDetails
            title="Examination Date"
            description={formatDate(lesion.dateOfExamination)}
          />
        </>
      ),
      description: (
        <>
          <LesionDetails title="Description" description={lesion.lesionDescription} />
          <LesionDetails title="Dermoscopic Features" description={lesion.dermoscopicFeatures} />
        </>
      ),
      examination: (
        <>
          <LesionDetails title="Biopsy Required" description={formatBoolean(lesion.isBiopsy)} />
        </>
      ),
    })),
  };
}
