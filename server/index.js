import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { useState } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    }), /* @__PURE__ */ jsx("div", {
      id: "offline-indicator",
      style: {
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 1e3,
        background: "#f87171",
        color: "white",
        borderRadius: "50%",
        width: "48px",
        height: "48px",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "none"
      },
      title: "You are offline",
      children: /* @__PURE__ */ jsxs("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [/* @__PURE__ */ jsx("circle", {
          cx: "12",
          cy: "12",
          r: "10"
        }), /* @__PURE__ */ jsx("line", {
          x1: "8",
          y1: "15",
          x2: "16",
          y2: "15"
        })]
      })
    }), /* @__PURE__ */ jsx("script", {
      dangerouslySetInnerHTML: {
        __html: `
        function updateOfflineIndicator() {
          var el = document.getElementById('offline-indicator');
          if (!navigator.onLine) {
            el.style.display = 'flex';
          } else {
            el.style.display = 'none';
          }
        }
        window.addEventListener('online', updateOfflineIndicator);
        window.addEventListener('offline', updateOfflineIndicator);
        updateOfflineIndicator();
      `
      }
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const lunatecsImg = "/LunaScouter/assets/lunatecs-DYXrR15G.jpg";
const githubLogo = "/LunaScouter/assets/Github-Dr8lduzb.png";
const initialCounters = {
  "auto-l4": 0,
  "auto-l3": 0,
  "auto-l2": 0,
  "auto-l1": 0,
  "auto-net": 0,
  "auto-processor": 0,
  "teleop-l1": 0,
  "teleop-l2": 0,
  "teleop-l3": 0,
  "teleop-l4": 0,
  "teleop-net": 0,
  "teleop-processor": 0,
  "auto-algea-removed": 0,
  "teleop-algea-removed": 0
};
const actions = ["Parked", "Deep", "Shallow", "None"];
const scouting = UNSAFE_withComponentProps(function Scouting() {
  const [deleteCode, setDeleteCode] = useState(typeof window !== "undefined" && window.localStorage ? () => localStorage.getItem("scouting-delete-code") || "1234" : () => "1234");
  const [tab, setTab] = useState("scouting");
  const [teams, setTeams] = useState([]);
  const [scoutingData, setScoutingData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [match, setMatch] = useState("");
  const [color, setColor] = useState("blue");
  const [counters, setCounters] = useState({
    ...initialCounters
  });
  const [movedFromStart, setMovedFromStart] = useState(false);
  const [defense, setDefense] = useState(false);
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [selected, setSelected] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [bgColor, setBgColor] = useState("gray");
  const [deleteInput, setDeleteInput] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [newDeleteCode, setNewDeleteCode] = useState("");
  const [algeaRemovedAuto, setAlgeaRemovedAuto] = useState(false);
  const [algeaRemovedTeleop, setAlgeaRemovedTeleop] = useState(false);
  const motivationalQuotes = ["You are making a difference!", "Every click counts!", "Great scouts build great teams!", "Keep up the awesome work!", "Your data powers the drive team!", "Scouting wins championships!", "Stay focused and scout on!", "You rock!", "One more match, one more win!", "Your effort matters!", "you are the backbone of the team!", "Keep pushing forward!", "your making Noah proud!"];
  const [showMotivationBtn, setShowMotivationBtn] = useState(false);
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [motivationText, setMotivationText] = useState("");
  function triggerMotivationBtn(duration = 2500) {
    setShowMotivationBtn(true);
    setTimeout(() => setShowMotivationBtn(false), duration);
  }
  function showRandomMotivation() {
    const idx = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivationText(motivationalQuotes[idx]);
    setShowMotivationModal(true);
  }
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    const storedTeams = localStorage.getItem("scouting-teams");
    if (storedTeams) setTeams(JSON.parse(storedTeams));
    const storedData = localStorage.getItem("scouting-data");
    if (storedData) setScoutingData(JSON.parse(storedData));
    const storedDarkMode = localStorage.getItem("scouting-darkmode");
    if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
    const storedBgColor = localStorage.getItem("scouting-bgcolor");
    if (storedBgColor) setBgColor(storedBgColor);
  }, []);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-teams", JSON.stringify(teams));
  }, [teams]);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-data", JSON.stringify(scoutingData));
  }, [scoutingData]);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-darkmode", String(darkMode));
  }, [darkMode]);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-bgcolor", bgColor);
  }, [bgColor]);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-delete-code", deleteCode);
  }, [deleteCode]);
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    document.body.classList.remove("bg-red-900", "bg-blue-900", "bg-gray-100");
    if (bgColor === "red") {
      document.body.classList.add("bg-red-900");
    } else if (bgColor === "blue") {
      document.body.classList.add("bg-blue-900");
    } else {
      document.body.classList.add("bg-gray-100");
    }
  }, [darkMode, bgColor]);
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch(() => {
        });
      });
    }
  }, []);
  function getThemeColor(base) {
    if (darkMode) {
      if (base === "bg") return "bg-gray-900";
      if (base === "text") {
        if (bgColor === "red") return "text-red-400";
        if (bgColor === "blue") return "text-blue-400";
        return "text-gray-300";
      }
      if (base === "btn") return "bg-gray-800 text-white hover:bg-gray-700";
      if (base === "section") return "bg-gray-800";
      if (base === "border") return "border-gray-700";
      return "";
    }
    if (bgColor === "red") {
      if (base === "bg") return "bg-red-100";
      if (base === "text") return "text-red-700";
      if (base === "btn") return "bg-red-600 text-white hover:bg-red-700";
      if (base === "section") return "bg-red-50";
      if (base === "border") return "border-red-300";
      return "";
    }
    if (bgColor === "blue") {
      if (base === "bg") return "bg-blue-100";
      if (base === "text") return "text-blue-700";
      if (base === "btn") return "bg-blue-600 text-white hover:bg-blue-700";
      if (base === "section") return "bg-blue-50";
      if (base === "border") return "border-blue-300";
      return "";
    }
    if (base === "bg") return "bg-gray-100";
    if (base === "text") return "text-gray-700";
    if (base === "btn") return "bg-gray-600 text-white hover:bg-gray-700";
    if (base === "section") return "bg-gray-100";
    if (base === "border") return "border-gray-300";
    return "";
  }
  function renderTabs() {
    return /* @__PURE__ */ jsx("div", {
      className: `nav-tabs flex ${getThemeColor("bg")} border-b ${getThemeColor("border")} mb-6`,
      children: [{
        key: "configuration",
        label: "Configuration"
      }, {
        key: "scouting",
        label: "Scouting"
      }, {
        key: "data",
        label: "Data"
      }].map((tabObj) => /* @__PURE__ */ jsx("button", {
        className: `nav-tab flex-1 py-4 text-xl font-semibold rounded-t-lg transition-all ${tab === tabObj.key ? `bg-white ${getThemeColor("text")} border-b-4 ${bgColor === "red" ? "border-red-500" : bgColor === "blue" ? "border-blue-500" : "border-gray-500"}` : `${getThemeColor("bg")} ${getThemeColor("text")}`}`,
        onClick: () => setTab(tabObj.key),
        children: tabObj.label
      }, tabObj.key))
    });
  }
  function updateCounter(id, delta) {
    setCounters((c) => ({
      ...c,
      [id]: Math.max(0, (c[id] || 0) + delta)
    }));
  }
  function resetCounters() {
    setCounters({
      ...initialCounters
    });
  }
  function saveScoutingResult() {
    if (!selectedTeam || !match) return;
    setScoutingData((prev) => [...prev, {
      team: selectedTeam,
      match,
      color,
      counters: {
        ...counters
      },
      movedFromStart,
      defense,
      action,
      notes,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      algeaRemovedAuto,
      algeaRemovedTeleop
    }]);
    setMatch("");
    setColor("blue");
    resetCounters();
    setMovedFromStart(false);
    setDefense(false);
    setAction("");
    setNotes("");
    setAlgeaRemovedAuto(false);
    setAlgeaRemovedTeleop(false);
    triggerMotivationBtn(2500);
  }
  function renderScoutingTab() {
    return /* @__PURE__ */ jsxs("div", {
      className: "scouting-container flex flex-wrap gap-8 relative",
      children: [showMotivationBtn && /* @__PURE__ */ jsx("button", {
        className: "fixed top-8 right-8 z-50 bg-yellow-400 hover:bg-yellow-500 text-black text-2xl font-extrabold px-8 py-4 rounded-full shadow-lg border-4 border-yellow-600 animate-bounce",
        style: {
          minWidth: 200
        },
        type: "button",
        tabIndex: 0,
        onClick: showRandomMotivation,
        children: "MOTIVATE ME!"
      }), showMotivationModal && /* @__PURE__ */ jsx("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60",
        children: /* @__PURE__ */ jsxs("div", {
          className: "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-3xl font-bold text-yellow-600 mb-4",
            children: "💪 Motivation!"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xl text-center text-black mb-6",
            children: motivationText
          }), /* @__PURE__ */ jsx("button", {
            className: "mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full border-2 border-yellow-600",
            onClick: () => setShowMotivationModal(false),
            children: "Close"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "scouting-left flex-1 min-w-[320px] flex flex-col gap-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "match-info flex gap-4 mb-2",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "info-group flex-1",
            children: [/* @__PURE__ */ jsx("label", {
              className: "info-label font-semibold mb-1",
              children: "Team"
            }), /* @__PURE__ */ jsxs("select", {
              className: "info-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200",
              value: selectedTeam,
              onChange: (e) => setSelectedTeam(e.target.value),
              children: [/* @__PURE__ */ jsx("option", {
                value: "",
                children: "Select a team..."
              }), [...teams].sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10)).map((t, i) => /* @__PURE__ */ jsxs("option", {
                value: t.number,
                children: ["#", t.number, " - ", t.name]
              }, i))]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "info-group flex-1",
            children: [/* @__PURE__ */ jsx("label", {
              className: "info-label font-semibold mb-1",
              children: "Match"
            }), /* @__PURE__ */ jsx("input", {
              className: "info-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200",
              type: "number",
              value: match,
              onChange: (e) => setMatch(e.target.value.replace(/[^0-9]/g, "")),
              placeholder: "Match Number",
              min: "0"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "info-group flex-1",
            children: [/* @__PURE__ */ jsx("label", {
              className: "info-label font-semibold mb-1",
              children: "Color"
            }), /* @__PURE__ */ jsxs("div", {
              className: "color-toggle flex gap-2 mt-1",
              children: [/* @__PURE__ */ jsx("button", {
                className: `color-btn flex-1 py-2 rounded-full font-bold border-2 transition-all ${color === "blue" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"}`,
                type: "button",
                onClick: () => setColor("blue"),
                "aria-pressed": color === "blue",
                style: {
                  boxShadow: color === "blue" ? "0 0 0 3px #3b82f6" : void 0
                },
                children: "Blue"
              }), /* @__PURE__ */ jsx("button", {
                className: `color-btn flex-1 py-2 rounded-full font-bold border-2 transition-all ${color === "red" ? "bg-red-600 text-white border-red-700" : "bg-white text-red-700 border-red-300 hover:bg-red-100"}`,
                type: "button",
                onClick: () => setColor("red"),
                "aria-pressed": color === "red",
                style: {
                  boxShadow: color === "red" ? "0 0 0 3px #ef4444" : void 0
                },
                children: "Red"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "scoring-sections flex gap-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: `auto-section flex-1 ${getThemeColor("section")} rounded-xl p-4`,
            children: [/* @__PURE__ */ jsxs("div", {
              className: "checkbox-item flex items-center mb-4",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                id: "moved-start",
                className: "mr-2 w-5 h-5",
                checked: movedFromStart,
                onChange: (e) => setMovedFromStart(e.target.checked)
              }), /* @__PURE__ */ jsx("label", {
                htmlFor: "moved-start",
                className: "font-medium",
                children: "Moved from Start"
              })]
            }), /* @__PURE__ */ jsx("h3", {
              className: "section-title text-lg font-bold mb-2",
              children: "Auto"
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-[120px_1fr_1fr_1fr] gap-y-2 gap-x-4",
              children: [[4, 3, 2, 1].map((l) => /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "level-label col-span-1 flex items-center font-semibold text-black",
                  children: ["L", l]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`auto-l${l}`, 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters[`auto-l${l}`]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`auto-l${l}`, -1),
                  children: "-"
                })]
              }, `auto-l${l}`)), ["net", "processor"].map((type) => /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "level-label col-span-1 flex items-center font-semibold capitalize text-black",
                  children: type
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`auto-${type}`, 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters[`auto-${type}`]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`auto-${type}`, -1),
                  children: "-"
                })]
              }, `auto-${type}`)), /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "level-label col-span-1 flex items-center font-semibold text-black",
                  children: "Algea removed"
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter("auto-algea-removed", 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters["auto-algea-removed"]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter("auto-algea-removed", -1),
                  children: "-"
                })]
              }, "auto-algea-removed")]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: `teleop-section flex-1 ${getThemeColor("section")} rounded-xl p-4`,
            children: [/* @__PURE__ */ jsxs("div", {
              className: "checkbox-item flex items-center mb-4",
              children: [/* @__PURE__ */ jsx("input", {
                type: "checkbox",
                id: "defense",
                className: "mr-2 w-5 h-5",
                checked: defense,
                onChange: (e) => setDefense(e.target.checked)
              }), /* @__PURE__ */ jsx("label", {
                htmlFor: "defense",
                className: "font-medium",
                children: "Defense"
              })]
            }), /* @__PURE__ */ jsx("h3", {
              className: "section-title text-lg font-bold mb-2",
              children: "Teleop"
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid grid-cols-[120px_1fr_1fr_1fr] gap-y-2 gap-x-4",
              children: [[4, 3, 2, 1].map((l) => /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsxs("span", {
                  className: "level-label col-span-1 flex items-center font-semibold text-black",
                  children: ["L", l]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`teleop-l${l}`, 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters[`teleop-l${l}`]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`teleop-l${l}`, -1),
                  children: "-"
                })]
              }, `teleop-l${l}`)), ["net", "processor"].map((type) => /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "level-label col-span-1 flex items-center font-semibold capitalize text-black",
                  children: type
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`teleop-${type}`, 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters[`teleop-${type}`]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter(`teleop-${type}`, -1),
                  children: "-"
                })]
              }, `teleop-${type}`)), /* @__PURE__ */ jsxs(React.Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: "level-label col-span-1 flex items-center font-semibold text-black",
                  children: "Algea removed"
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter("teleop-algea-removed", 1),
                  children: "+"
                }), /* @__PURE__ */ jsx("div", {
                  className: "counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black",
                  children: counters["teleop-algea-removed"]
                }), /* @__PURE__ */ jsx("button", {
                  className: `counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? "bg-black text-white hover:bg-gray-800" : "bg-gray-600 text-white hover:bg-gray-700"}`,
                  type: "button",
                  onClick: () => updateCounter("teleop-algea-removed", -1),
                  children: "-"
                })]
              }, "teleop-algea-removed")]
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "game-actions flex flex-wrap gap-2 my-2",
          children: actions.map((a) => /* @__PURE__ */ jsx("button", {
            className: `action-btn px-4 py-2 rounded-full font-semibold ${action === a ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`,
            type: "button",
            onClick: () => setAction(a),
            children: a
          }, a))
        }), /* @__PURE__ */ jsxs("div", {
          className: "notes-section flex-1",
          children: [/* @__PURE__ */ jsx("label", {
            className: "info-label font-semibold",
            children: "Notes"
          }), /* @__PURE__ */ jsx("textarea", {
            className: "notes-textarea w-full h-28 border rounded p-2 mt-1",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: "Additional notes about team performance..."
          })]
        }), /* @__PURE__ */ jsx("button", {
          className: `action-button export-btn w-full mt-4 py-3 text-lg font-bold ${getThemeColor("btn")}`,
          type: "button",
          onClick: saveScoutingResult,
          children: "Save Data"
        })]
      })]
    });
  }
  function renderConfigurationTab() {
    function addTeam() {
      if (!teamName.trim() || !teamNumber.trim()) return;
      if (teams.some((t) => t.number === teamNumber.trim())) return;
      setTeams((prev) => [...prev, {
        name: teamName.trim(),
        number: teamNumber.trim()
      }]);
      setTeamName("");
      setTeamNumber("");
    }
    function deleteTeam(idx) {
      setTeams((prev) => prev.filter((_, i) => i !== idx));
    }
    function importTeams(e) {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data)) {
            setTeams(data.filter((t) => t.name && t.number));
          } else if (data.teams && Array.isArray(data.teams)) {
            setTeams(data.teams.filter((t) => t.name && t.number));
          }
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
    return /* @__PURE__ */ jsxs("div", {
      className: "configuration-container flex flex-col md:flex-row gap-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: `settings-section flex-1 ${getThemeColor("section")} rounded-xl p-6 mb-6 md:mb-0`,
        children: [/* @__PURE__ */ jsx("h2", {
          className: `section-title text-xl font-bold mb-4 ${getThemeColor("text")}`,
          children: "Settings"
        }), /* @__PURE__ */ jsxs("div", {
          className: "form-group mb-4",
          children: [/* @__PURE__ */ jsx("label", {
            className: "form-label font-semibold text-blue-700",
            children: "Dark Mode"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4 mt-2",
            children: [/* @__PURE__ */ jsx("button", {
              className: `px-4 py-2 rounded ${darkMode ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`,
              onClick: () => setDarkMode(true),
              type: "button",
              children: "On"
            }), /* @__PURE__ */ jsx("button", {
              className: `px-4 py-2 rounded ${!darkMode ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`,
              onClick: () => setDarkMode(false),
              type: "button",
              children: "Off"
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "form-group mb-4",
          children: [/* @__PURE__ */ jsx("label", {
            className: "form-label font-semibold text-blue-700",
            children: "Background Color"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4 mt-2",
            children: [/* @__PURE__ */ jsx("button", {
              className: `px-4 py-2 rounded ${bgColor === "red" ? "bg-red-700 text-white" : "bg-gray-200 text-black"}`,
              onClick: () => setBgColor("red"),
              type: "button",
              children: "Red"
            }), /* @__PURE__ */ jsx("button", {
              className: `px-4 py-2 rounded ${bgColor === "blue" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`,
              onClick: () => setBgColor("blue"),
              type: "button",
              children: "Blue"
            }), /* @__PURE__ */ jsx("button", {
              className: `px-4 py-2 rounded ${bgColor === "gray" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`,
              onClick: () => setBgColor("gray"),
              type: "button",
              children: "Gray"
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: `add-team-section flex-1 ${getThemeColor("section")} rounded-xl p-6`,
        children: [/* @__PURE__ */ jsx("h2", {
          className: `section-title text-xl font-bold mb-4 ${getThemeColor("text")}`,
          children: "Add a Team"
        }), /* @__PURE__ */ jsxs("div", {
          className: "form-group mb-2",
          children: [/* @__PURE__ */ jsx("label", {
            className: "form-label font-semibold text-blue-700",
            children: "Name"
          }), /* @__PURE__ */ jsx("input", {
            type: "text",
            className: "form-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200",
            value: teamName,
            onChange: (e) => setTeamName(e.target.value),
            placeholder: "Team Name"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "form-group mb-2",
          children: [/* @__PURE__ */ jsx("label", {
            className: "form-label font-semibold text-blue-700",
            children: "Number"
          }), /* @__PURE__ */ jsx("input", {
            type: "number",
            className: "form-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200",
            value: teamNumber,
            onChange: (e) => setTeamNumber(e.target.value),
            placeholder: "Team Number"
          })]
        }), /* @__PURE__ */ jsx("button", {
          className: `add-team-btn w-full py-2 rounded mt-2 ${getThemeColor("btn")}`,
          onClick: addTeam,
          children: "ADD+"
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-4 flex flex-col gap-2",
          children: [/* @__PURE__ */ jsx("label", {
            className: "form-label font-semibold text-blue-700",
            children: "Import Teams (JSON)"
          }), /* @__PURE__ */ jsx("button", {
            type: "button",
            className: `add-team-btn w-full py-2 rounded ${getThemeColor("btn")}`,
            onClick: () => {
              var _a;
              return (_a = document.getElementById("import-teams-input")) == null ? void 0 : _a.click();
            },
            children: "Import JSON"
          }), /* @__PURE__ */ jsx("input", {
            id: "import-teams-input",
            type: "file",
            accept: ".json",
            className: "hidden",
            onChange: importTeams
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "middle-section flex-1",
        children: [/* @__PURE__ */ jsx("h3", {
          className: "text-center font-bold mb-2",
          children: "Team List"
        }), /* @__PURE__ */ jsx("div", {
          className: `${getThemeColor("section")} rounded-xl p-4 min-h-[200px] text-black`,
          children: teams.length === 0 ? /* @__PURE__ */ jsx("p", {
            className: "text-gray-500 text-center",
            children: "Added teams will appear here"
          }) : /* @__PURE__ */ jsx("ul", {
            children: teams.map((team, idx) => /* @__PURE__ */ jsxs("li", {
              className: "team-item flex justify-between items-center mb-2 bg-gray-50 rounded p-2 text-black",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "team-info",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "team-name font-semibold",
                  children: team.name
                }), /* @__PURE__ */ jsxs("div", {
                  className: "team-number text-gray-500 text-sm",
                  children: ["Team #", team.number]
                })]
              }), /* @__PURE__ */ jsx("button", {
                className: "delete-team-btn bg-red-600 text-white px-2 py-1 rounded text-xs",
                onClick: () => deleteTeam(idx),
                children: "Delete"
              })]
            }, idx))
          })
        })]
      })]
    });
  }
  function renderDataTab() {
    function exportCSV() {
      if (scoutingData.length === 0) return;
      let csv = "Team,Match,Color,Auto L4,Auto L3,Auto L2,Auto L1,Auto Net,Auto Processor,Teleop L4,Teleop L3,Teleop L2,Teleop L1,Teleop Net,Teleop Processor,Moved from Start,Defense,Action,Notes,Timestamp\n";
      scoutingData.forEach((d) => {
        csv += `${d.team},${d.match},${d.color},${d.counters["auto-l4"]},${d.counters["auto-l3"]},${d.counters["auto-l2"]},${d.counters["auto-l1"]},${d.counters["auto-net"]},${d.counters["auto-processor"]},${d.counters["teleop-l4"]},${d.counters["teleop-l3"]},${d.counters["teleop-l2"]},${d.counters["teleop-l1"]},${d.counters["teleop-net"]},${d.counters["teleop-processor"]},${d.movedFromStart},${d.defense},${d.action},"${d.notes.replace(/"/g, '""')}",${d.timestamp}
`;
      });
      const blob = new Blob([csv], {
        type: "text/csv"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scouting_data_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    const teamOptions = Array.from(new Set(scoutingData.map((d) => d.team)));
    const teamData = scoutingData.filter((d) => d.team === selected);
    return /* @__PURE__ */ jsxs("div", {
      className: "data-container flex flex-col md:flex-row gap-8",
      children: [/* @__PURE__ */ jsx("style", {
        children: `
          .dark .all-scouting-table th,
          .dark .all-scouting-table td {
            color: #000 !important;
          }
          .dark select.team-dropdown,
          .dark select.info-input,
          .dark select.team-dropdown option,
          .dark select.info-input option {
            color: #000 !important;
            background: #fff !important;
          }
        `
      }), /* @__PURE__ */ jsxs("div", {
        className: "data-left flex-1",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "mb-4",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "mb-2 font-bold",
            children: "All Scouting Data"
          }), /* @__PURE__ */ jsx("div", {
            className: "overflow-x-auto rounded-xl border border-gray-300 mb-6",
            children: /* @__PURE__ */ jsxs("table", {
              className: "all-scouting-table min-w-full text-xs text-left",
              children: [/* @__PURE__ */ jsx("thead", {
                className: "bg-gray-200",
                children: /* @__PURE__ */ jsxs("tr", {
                  children: [/* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Team"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Match"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Color"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Auto L4"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Auto L3"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Auto L2"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Auto L1"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Teleop L4"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Teleop L3"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Teleop L2"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Teleop L1"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Action"
                  }), /* @__PURE__ */ jsx("th", {
                    className: "px-2 py-1",
                    children: "Notes"
                  })]
                })
              }), /* @__PURE__ */ jsx("tbody", {
                children: scoutingData.length === 0 ? /* @__PURE__ */ jsx("tr", {
                  children: /* @__PURE__ */ jsx("td", {
                    colSpan: 13,
                    className: "text-center text-gray-400 py-2",
                    children: "No scouting data"
                  })
                }) : scoutingData.slice().reverse().map((d, i) => /* @__PURE__ */ jsxs("tr", {
                  className: "odd:bg-white even:bg-gray-50",
                  children: [/* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.team
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.match
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.color
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["auto-l4"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["auto-l3"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["auto-l2"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["auto-l1"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["teleop-l4"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["teleop-l3"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["teleop-l2"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.counters["teleop-l1"]
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.action
                  }), /* @__PURE__ */ jsx("td", {
                    className: "px-2 py-1",
                    children: d.notes
                  })]
                }, i))
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "team-selector mb-4",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "mb-2 font-bold",
            children: "Select a Team"
          }), /* @__PURE__ */ jsxs("select", {
            className: "team-dropdown w-full border rounded p-2",
            value: selected,
            onChange: (e) => setSelected(e.target.value),
            children: [/* @__PURE__ */ jsx("option", {
              value: "",
              children: "Choose a team..."
            }), teamOptions.map((num, i) => /* @__PURE__ */ jsxs("option", {
              value: num,
              children: ["Team ", num]
            }, i))]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: `${getThemeColor("section")} rounded-xl p-4 min-h-[200px] ${getThemeColor("text")}`,
          children: !selected ? /* @__PURE__ */ jsx("p", {
            className: "text-gray-500",
            children: "Select a team above to view their performance data"
          }) : teamData.length === 0 ? /* @__PURE__ */ jsxs("p", {
            className: "text-gray-500",
            children: ["No data found for Team ", selected]
          }) : /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("h4", {
              className: "font-bold mb-2",
              children: ["Team ", selected, " Performance"]
            }), /* @__PURE__ */ jsxs("p", {
              children: [/* @__PURE__ */ jsx("b", {
                children: "Matches Scouted:"
              }), " ", teamData.length]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-2",
              children: [/* @__PURE__ */ jsx("b", {
                children: "Average Scores:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "ml-4 list-disc",
                children: [/* @__PURE__ */ jsxs("li", {
                  children: ["Auto L4: ", (teamData.reduce((sum, d) => sum + d.counters["auto-l4"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Auto L3: ", (teamData.reduce((sum, d) => sum + d.counters["auto-l3"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Auto L2: ", (teamData.reduce((sum, d) => sum + d.counters["auto-l2"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Auto L1: ", (teamData.reduce((sum, d) => sum + d.counters["auto-l1"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Teleop L4: ", (teamData.reduce((sum, d) => sum + d.counters["teleop-l4"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Teleop L3: ", (teamData.reduce((sum, d) => sum + d.counters["teleop-l3"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Teleop L2: ", (teamData.reduce((sum, d) => sum + d.counters["teleop-l2"], 0) / teamData.length).toFixed(1)]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Teleop L1: ", (teamData.reduce((sum, d) => sum + d.counters["teleop-l1"], 0) / teamData.length).toFixed(1)]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-2",
              children: [/* @__PURE__ */ jsx("b", {
                children: "Recent Matches:"
              }), /* @__PURE__ */ jsx("ul", {
                className: "ml-4 list-disc",
                children: teamData.slice(-3).map((d, i) => /* @__PURE__ */ jsxs("li", {
                  children: ["Match ", d.match, " (", d.color, ") - Action: ", d.action]
                }, i))
              })]
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "data-right w-full md:w-[300px] flex flex-col gap-4 mt-4 md:mt-0",
        children: [/* @__PURE__ */ jsx("button", {
          className: `action-button export-btn py-3 rounded ${getThemeColor("btn")}`,
          onClick: exportCSV,
          children: "Export as CSV"
        }), /* @__PURE__ */ jsxs("div", {
          className: "delete-section mt-6 p-4 rounded-xl border border-red-400 bg-red-50",
          children: [/* @__PURE__ */ jsx("h4", {
            className: "font-bold text-red-600 mb-2",
            children: "Delete All Scouting Data"
          }), !showDelete ? /* @__PURE__ */ jsx("button", {
            className: "bg-red-600 text-white px-4 py-2 rounded font-bold w-full",
            onClick: () => setShowDelete(true),
            children: "Delete Scouting Data"
          }) : /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("label", {
              className: "block mb-1 font-semibold",
              children: "Enter Delete Code:"
            }), /* @__PURE__ */ jsx("input", {
              type: "password",
              className: "border rounded p-2 w-full mb-2 text-black",
              value: deleteInput,
              onChange: (e) => setDeleteInput(e.target.value),
              placeholder: "Enter code to confirm"
            }), /* @__PURE__ */ jsx("button", {
              className: "bg-red-600 text-white px-4 py-2 rounded font-bold w-full mb-2",
              onClick: () => {
                if (deleteInput === deleteCode) {
                  setScoutingData([]);
                  setShowDelete(false);
                  setDeleteInput("");
                  alert("All scouting data deleted.");
                } else {
                  alert("Incorrect code.");
                }
              },
              children: "Confirm Delete"
            }), /* @__PURE__ */ jsx("button", {
              className: "bg-gray-300 text-black px-4 py-2 rounded w-full",
              onClick: () => {
                setShowDelete(false);
                setDeleteInput("");
              },
              children: "Cancel"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block mb-1 font-semibold",
              children: "Change Delete Code:"
            }), /* @__PURE__ */ jsx("input", {
              type: "password",
              className: "border rounded p-2 w-full mb-2 text-black",
              value: deleteInput,
              onChange: (e) => setDeleteInput(e.target.value),
              placeholder: "Current code"
            }), /* @__PURE__ */ jsx("input", {
              type: "password",
              className: "border rounded p-2 w-full mb-2 text-black",
              value: newDeleteCode,
              onChange: (e) => setNewDeleteCode(e.target.value),
              placeholder: "New code"
            }), /* @__PURE__ */ jsx("button", {
              className: "bg-blue-600 text-white px-4 py-2 rounded w-full",
              onClick: () => {
                if (deleteInput !== deleteCode) {
                  alert("Incorrect current code.");
                  return;
                }
                if (newDeleteCode.length < 3) {
                  alert("Code must be at least 3 characters.");
                  return;
                }
                setDeleteCode(newDeleteCode);
                setNewDeleteCode("");
                setDeleteInput("");
                alert("Delete code updated.");
              },
              children: "Set New Code"
            })]
          })]
        })]
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: `max-w-6xl mx-auto p-4 ${darkMode ? "bg-gray-900 text-white" : `${getThemeColor("bg")} ${getThemeColor("text")}`}`,
    style: {
      position: "relative"
    },
    children: [/* @__PURE__ */ jsx("a", {
      href: "https://lunatecs.org/",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 100
      },
      children: /* @__PURE__ */ jsx("img", {
        src: lunatecsImg,
        alt: "Lunatecs Logo",
        style: {
          width: 56,
          height: 56,
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          border: "2px solid #fff",
          background: "#fff"
        }
      })
    }), /* @__PURE__ */ jsx("a", {
      href: "https://github.com/Lunatecs",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        textDecoration: "none"
      },
      "aria-label": "View on GitHub",
      children: /* @__PURE__ */ jsx("img", {
        src: githubLogo,
        alt: "GitHub Logo",
        style: {
          width: 44,
          height: 44,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          border: "2px solid #fff",
          background: "#fff"
        }
      })
    }), renderTabs(), tab === "scouting" && renderScoutingTab(), tab === "configuration" && renderConfigurationTab(), tab === "data" && renderDataTab()]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: scouting
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/LunaScouterassets/entry.client-GYH6YEgi.js", "imports": ["/LunaScouterassets/chunk-NL6KNZEE-b53XU3gX.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/LunaScouterassets/root-tizIqZt0.js", "imports": ["/LunaScouterassets/chunk-NL6KNZEE-b53XU3gX.js"], "css": ["/LunaScouterassets/root--px6QPx_.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/scouting": { "id": "routes/scouting", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/LunaScouterassets/scouting-s9gC2W9a.js", "imports": ["/LunaScouterassets/chunk-NL6KNZEE-b53XU3gX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/LunaScouterassets/manifest-03fc99b6.js", "version": "03fc99b6", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/LunaScouter";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/scouting": {
    id: "routes/scouting",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
