/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import AddUser from "layouts/add-user";
import AddPatient from "layouts/add-patient";
import Users from "layouts/users";
import Patients from "layouts/patients";
import Logs from "layouts/logs";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Workflow pages
import Lesion from "layouts/flow/lesion";
import Biopsy from "layouts/flow/biopsy";
import Diagnosis from "layouts/flow/diagnosis";
import Image from "layouts/flow/image";
import ModelPrediction from "layouts/flow/model-prediction";
import FinalDiagnosis from "layouts/flow/final-diagnosis";
import Treatment from "layouts/flow/treatment";
import FollowUp from "layouts/flow/follow-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Staff Registration",
    key: "add-user",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/add-user",
    component: <AddUser />,
  },
  {
    type: "collapse",
    name: "Staff Members",
    key: "users",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "title",
    name: "Add Lesion",
    key: "lesion",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/lesion",
    component: <Lesion />,
  },
  {
    type: "title",
    name: "Add Image",
    key: "image",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/image",
    component: <Image />,
  },
  {
    type: "title",
    name: "Add Prediction",
    key: "add-prediction",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/add-prediction",
    component: <ModelPrediction />,
  },
  {
    type: "title",
    name: "Add Biopsy",
    key: "biopsy",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/biopsy",
    component: <Biopsy />,
  },
  {
    type: "title",
    name: "Add Diagnosis",
    key: "diagnosis",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/diagnosis",
    component: <Diagnosis />,
  },
  {
    type: "title",
    name: "Final Diagnosis",
    key: "final-diagnosis",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/final-diagnosis",
    component: <FinalDiagnosis />,
  },
  {
    type: "title",
    name: "Treatment",
    key: "treatment",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/treatment",
    component: <Treatment />,
  },
  {
    type: "title",
    name: "Follow Up",
    key: "follow-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/follow-up",
    component: <FollowUp />,
  },
  {
    type: "collapse",
    name: "Start Workflow",
    key: "add-patient",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/add-patient",
    component: <AddPatient />,
  },
  {
    type: "collapse",
    name: "Patients",
    key: "patients",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/patients",
    component: <Patients />,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "logs",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/logs",
    component: <Logs />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Support",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "title",
    name: "Education",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "title",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "title",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
];

export default routes;
