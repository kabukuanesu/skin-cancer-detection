"use client";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// My imports
import styles from "./styles/styles.global.module.css";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import BuildIcon from "@mui/icons-material/Build";
import { Link } from "react-router-dom";
import * as React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Logs() {
  const portalTabs = [
    {
      title: "Patients",
      description: "Application Overview",
      icon: <AccountBalanceIcon className={styles.iconStyles} />,
      path: "/patients",
    },
    {
      title: "Upload Image",
      description: "Detect Lesions Type",
      icon: <CameraAltIcon className={styles.iconStyles} />,
      path: "/gemini-vision",
    },
    {
      title: "Diagnosis",
      description: "Uploaded Image Analysis",
      icon: <LocalHospitalIcon className={styles.iconStyles} />,
      path: "/gemini-vision",
    },
    {
      title: "Signs & Symptoms Checker",
      description: "Skin Issues",
      icon: <VaccinesIcon className={styles.iconStyles} />,
      path: "/gemini-chat",
    },
    {
      title: "Ask Anything",
      description: "ChatBot",
      icon: <QuestionAnswerIcon className={styles.iconStyles} />,
      path: "/gemini-chatter",
    },
    {
      title: "Skin Health Library",
      description: "Learn More",
      icon: <VideoLibraryIcon className={styles.iconStyles} />,
      path: "/library",
    },
    {
      title: "My History",
      description: "Past Diagnosis",
      icon: <HistoryIcon className={styles.iconStyles} />,
      path: "/history",
    },
    {
      title: "Notifications",
      description: "Reminder",
      icon: <NotificationsIcon className={styles.iconStyles} />,
      path: "/reminder",
    },
    {
      title: "Profile",
      description: "My Information",
      icon: <AccountCircleIcon className={styles.iconStyles} />,
      path: "/profile",
    },
    {
      title: "Community Forum",
      description: "Support Each Other",
      icon: <PeopleIcon className={styles.iconStyles} />,
      path: "/community",
    },
    {
      title: "Help & Support",
      description: "Customer Support",
      icon: <ContactSupportIcon className={styles.iconStyles} />,
      path: "/support",
    },
    {
      title: "Settings",
      description: "Your Preferences",
      icon: <BuildIcon className={styles.iconStyles} />,
      path: "/settings",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Your content */}

            <br />
            <br />

            <br />
            <br />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 drop-shadow-md">
              {/* Using map function to iterate over the data array */}
              {portalTabs.map((item) => (
                <Link href={item.path} key={item.title}>
                  <div className="relative">
                    <div className={"h-5"}></div>
                    <div className="static bg-gray-800 shadow-2xl h-24 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-400">
                      <div className={"rounded-2xl h-14 text-white content-end grid grid-cols-2"}>
                        <div className={""}></div>
                      </div>
                      <div className="absolute top-0 left-0 h-12 w-12 rounded-2xl ml-5 px-3 py-3 bg-gradient-to-r from-gray-800 to-gray-400 text-white">
                        {item.icon}
                      </div>
                      <div className="grid grid-cols-1 divide-y">
                        <div className={"absolute left-0 bottom-4 pl-2"}>
                          <div className={"font-bold text-white"}>{item.title}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div
              id="bottom-banner"
              tabIndex={-1}
              className="fixed bottom-0 start-0 z-50 flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="flex items-center mx-auto">
                <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                  <span className="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18.435 7.546A2.32 2.32 0 0 1 17.7 5.77a3.354 3.354 0 0 0-3.47-3.47 2.322 2.322 0 0 1-1.776-.736 3.357 3.357 0 0 0-4.907 0 2.281 2.281 0 0 1-1.776.736 3.414 3.414 0 0 0-2.489.981 3.372 3.372 0 0 0-.982 2.49 2.319 2.319 0 0 1-.736 1.775 3.36 3.36 0 0 0 0 4.908A2.317 2.317 0 0 1 2.3 14.23a3.356 3.356 0 0 0 3.47 3.47 2.318 2.318 0 0 1 1.777.737 3.36 3.36 0 0 0 4.907 0 2.36 2.36 0 0 1 1.776-.737 3.356 3.356 0 0 0 3.469-3.47 2.319 2.319 0 0 1 .736-1.775 3.359 3.359 0 0 0 0-4.908ZM8.5 5.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 9.063a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.207-6.856-6 6a1 1 0 0 1-1.414-1.414l6-6a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="sr-only">Dashboard</span>
                  </span>
                  <span>
                    <b>Please note that further skin analysis is required.</b>{" "}
                    <a
                      href="/home-page"
                      className="flex items-center ms-0 text-sm font-medium text-blue-600 md:ms-1 md:inline-flex dark:text-blue-500 hover:underline"
                    >
                      Read this for more information{" "}
                      <svg
                        className="w-3 h-3 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Logs;
