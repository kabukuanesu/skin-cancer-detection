/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/finaldiagnoses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch diagnoses");
        }

        const data = await response.json();
        setDiagnoses(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch diagnoses", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [enqueueSnackbar]);

  const DiagnosisDetails = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description || "N/A"}</MDTypography>
    </MDBox>
  );

  const formatDiagnosisResult = (result) => {
    if (!result) return "N/A";
    const resultMap = {
      bcc: "Basal Cell Carcinoma",
      mel: "Melanoma",
      scc: "Squamous Cell Carcinoma",
      nv: "Melanocytic Nevus",
      ak: "Actinic Keratosis",
      bkl: "Benign Keratoses",
      akiec: "Actinic Keratoses",
      vasc: "Vascular Lesions",
      df: "Dermatofibroma",
      positive: "Positive Diagnosis",
      negative: "Negative Diagnosis",
      final: "Confirmed Diagnosis",
    };
    return resultMap[result.toLowerCase()] || result;
  };

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading diagnoses...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "diagnosis info", accessor: "diagnosisInfo", width: "30%", align: "left" },
      { Header: "references", accessor: "references", width: "30%", align: "left" },
      { Header: "diagnosis details", accessor: "diagnosisDetails", width: "40%", align: "left" },
    ],
    rows: diagnoses.map((diagnosis) => ({
      diagnosisInfo: (
        <>
          <DiagnosisDetails title="Final Diagnosis ID" description={diagnosis.finalDiagnosisId} />
          <DiagnosisDetails title="Diagnosis ID" description={diagnosis.diagnosisId} />
          <DiagnosisDetails title="User ID" description={diagnosis.userId} />
        </>
      ),
      references: (
        <>
          <DiagnosisDetails title="Model Prediction ID" description={diagnosis.modelPredictionId} />
        </>
      ),
      diagnosisDetails: (
        <>
          <DiagnosisDetails
            title="Final Result"
            description={formatDiagnosisResult(diagnosis.finalResult)}
          />
          <DiagnosisDetails title="Description" description={diagnosis.finalResultDescription} />
        </>
      ),
    })),
  };
}
