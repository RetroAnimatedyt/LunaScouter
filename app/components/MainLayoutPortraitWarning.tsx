import React, { useState, useEffect } from "react";

export default function MainLayoutPortraitWarning() {
  const [forcePortrait, setForcePortrait] = useState<boolean>(false);

  const [isPortrait, setIsPortrait] = useState<boolean>(
    window.matchMedia("(orientation: portrait)").matches
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return (
    <>
      {isPortrait && !forcePortrait && (
        <div
          style={{
            width: "100dvw",
            height: "100dvh",
            animation: "pulseBackgroundOpacity 2s ease-in-out infinite",
            position: "absolute",
            top: "0dvh",
            left: "0dvw",
            zIndex: "3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "7dvw",
              fontWeight: "600",
              textAlign: "center",
              paddingLeft: "2dvw",
              paddingRight: "2dvw",
            }}
          >
            This app is meant to be viewed in landscape mode.
            Please rotate your device.
          </h1>
          <div
            style={{
              marginTop: "2dvh",
              padding: "1dvh 2dvw",
              backgroundColor: "#4A4A4A",
              color: "white",
              border: "1.63dvh solid #1D1E1E",
              borderRadius: "3.49dvh",
            }}
            onClick={() => setForcePortrait(true)}
          >
            Ignore
          </div>
        </div>
      )}
    </>
  );
};
