/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useSnackbar } from "notistack";

export default function data() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5212/api/Workflow/images", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error:", error);
        enqueueSnackbar("Failed to fetch images", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [enqueueSnackbar]);

  const ImageDetails = ({ title, description }) => (
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
      rows: [{ loading: <MDTypography>Loading images...</MDTypography> }],
    };
  }

  return {
    columns: [
      { Header: "identification", accessor: "identification", width: "25%", align: "left" },
      { Header: "image details", accessor: "imageDetails", width: "25%", align: "left" },
      { Header: "technical specs", accessor: "technicalSpecs", width: "25%", align: "left" },
      { Header: "dates", accessor: "dates", width: "25%", align: "left" },
    ],
    rows: images.map((image) => ({
      identification: (
        <>
          <ImageDetails title="Image ID" description={image.imageId} />
          <ImageDetails title="Lesion ID" description={image.lesionId} />
          <ImageDetails title="User ID" description={image.userId} />
        </>
      ),
      imageDetails: (
        <>
          <ImageDetails title="Type" description={image.imageType} />
          <ImageDetails title="Description" description={image.imageDescription} />
        </>
      ),
      technicalSpecs: (
        <>
          <ImageDetails title="Resolution" description={image.resolution} />
          <ImageDetails title="Camera Model" description={image.cameraModel} />
          <ImageDetails title="Illumination" description={image.illuminationType} />
        </>
      ),
      dates: (
        <>
          <ImageDetails title="Date Taken" description={formatDate(image.dateTaken)} />
          <ImageDetails title="Last Updated" description={formatDate(image.dateUpdated)} />
        </>
      ),
    })),
  };
}
