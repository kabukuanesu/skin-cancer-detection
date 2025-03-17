import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import TextFields from "./components";

export default function AddForm() {
  return (
    <MDBox p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <MDBox
            borderRadius="lg"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            sx={{
              border: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            }}
          >
            <TextFields />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
