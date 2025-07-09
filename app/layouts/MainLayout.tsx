import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import MainLayoutPortraitWarning from "../components/MainLayoutPortraitWarning";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainLayout() {

  // Logic to reload the website if the user has been offline for more than 10 seconds (only on page load)
  useEffect(() => {
    const lastWebsiteGet = Number(localStorage.getItem("lastWebsiteGet")) || 0;
    const lastWebsiteGetOffset = (new Date().getTime() - lastWebsiteGet) / 1000; // in seconds

    if (
      lastWebsiteGetOffset >= 10 &&
      navigator.onLine
    ) {
      localStorage.setItem("lastWebsiteGet", new Date().getTime().toString());
      console.log("Reloading website after " + lastWebsiteGetOffset + " seconds");

      try {
        navigator.serviceWorker.getRegistrations()
          .then(async (registrations) => {
            for (const registration of registrations) {
              // Unregister the service worker
              await registration.unregister();
            }
          })
          .then(() => {
            toast.success("Website reloaded, please refresh the page.");
          });
      } catch (error) {
        console.error("Error during service worker update:", error);
      }
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#333640",
        height: window.innerHeight,
        width: "100dvw",
        overflow: "auto",
      }}
    >
      <ToastContainer />
      <MainLayoutPortraitWarning />
      <Outlet />
    </div>
  );
};
