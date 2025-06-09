/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPredictions = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/predictions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch predictions");
        }

        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch predictions", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [enqueueSnackbar]);

  const PredictionDetails = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description || "N/A"}</MDTypography>
    </MDBox>
  );

  const formatConfidenceScore = (score) => {
    return score ? `${(score * 100).toFixed(2)}%` : "N/A";
  };

  const formatPredictionResult = (result) => {
    if (!result) return "N/A";
    // Convert prediction codes to readable format
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
    };
    return resultMap[result.toLowerCase()] || result.toUpperCase();
  };

  if (loading) {
    return {
      columns: [{ Header: "Loading...", accessor: "loading", align: "center" }],
      rows: [{ loading: <MDTypography>Loading predictions...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "identification", accessor: "identification", width: "25%", align: "left" },
      { Header: "prediction details", accessor: "predictionDetails", width: "50%", align: "left" },
      { Header: "confidence", accessor: "confidence", width: "25%", align: "left" },
    ],
    rows: predictions.map((prediction) => ({
      identification: (
        <>
          <PredictionDetails title="Prediction ID" description={prediction.modelPredictionId} />
          <PredictionDetails title="Image ID" description={prediction.imageId} />
          <PredictionDetails title="User ID" description={prediction.userId} />
        </>
      ),
      predictionDetails: (
        <>
          <PredictionDetails
            title="Result"
            description={formatPredictionResult(prediction.predictionResult)}
          />
        </>
      ),
      confidence: (
        <>
          <PredictionDetails
            title="Confidence Score"
            description={formatConfidenceScore(prediction.confidenceScore)}
          />
        </>
      ),
    })),
  };
}
