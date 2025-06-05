import React, { useState } from "react";

interface Team {
  name: string;
  number: string;
}

interface Counters {
  [key: string]: number;
}

interface ScoutingResult {
  team: string;
  match: string;
  color: "blue" | "red";
  counters: Counters;
  movedFromStart: boolean;
  defense: boolean;
  action: string;
  notes: string;
  timestamp: string;
}

const initialCounters: Counters = {
  "auto-l1": 0,
  "auto-l2": 0,
  "auto-l3": 0,
  "auto-l4": 0,
  "auto-net": 0,
  "auto-processor": 0,
  "teleop-l1": 0,
  "teleop-l2": 0,
  "teleop-l3": 0,
  "teleop-l4": 0,
  "teleop-net": 0,
  "teleop-processor": 0,
};

const actions = ["Parked", "Deep", "Shallow", "None"];

// Use a function to safely access localStorage only on the client
function getLocalStorageItem(key: string, fallback: string = "") {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem(key) || fallback;
  }
  return fallback;
}

export default function Scouting() {
  // Use lazy initialization for deleteCode to avoid SSR error
  const [deleteCode, setDeleteCode] = useState<string>(
    typeof window !== "undefined" && window.localStorage
      ? () => localStorage.getItem("scouting-delete-code") || "1234"
      : () => "1234"
  );
  // --- Move all other useState hooks below this line ---
  const [tab, setTab] = useState("scouting");
  const [teams, setTeams] = useState<Team[]>([]);
  const [scoutingData, setScoutingData] = useState<ScoutingResult[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [match, setMatch] = useState("");
  const [color, setColor] = useState<"blue" | "red">("blue");
  const [counters, setCounters] = useState<Counters>({ ...initialCounters });
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

  const motivationalQuotes = [
    "You are making a difference!",
    "Every click counts!",
    "Great scouts build great teams!",
    "Keep up the awesome work!",
    "Your data powers the drive team!",
    "Scouting wins championships!",
    "Stay focused and scout on!",
    "You rock!",
    "One more match, one more win!",
    "Your effort matters!",
    "you are the backbone of the team!",
    "Keep pushing forward!",
    "your making Noah proud!",

  ];
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

  // Load from localStorage on mount
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

  // Save teams to localStorage when changed
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-teams", JSON.stringify(teams));
  }, [teams]);

  // Save scouting data to localStorage when changed
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-data", JSON.stringify(scoutingData));
  }, [scoutingData]);

  // Save darkMode to localStorage when changed
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-darkmode", String(darkMode));
  }, [darkMode]);

  // Save bgColor to localStorage when changed
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-bgcolor", bgColor);
  }, [bgColor]);

  // Save delete code to localStorage when changed
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("scouting-delete-code", deleteCode);
  }, [deleteCode]);

  // Add effect to update body class for dark mode and background color
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

  // Register the service worker for offline support
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {});
      });
    }
  }, []);

  // Utility to get theme classes
  function getThemeColor(base: string) {
    if (darkMode) {
      if (base === "bg") return "bg-gray-900";
      // In dark mode, text color follows theme
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
    // gray
    if (base === "bg") return "bg-gray-100";
    if (base === "text") return "text-gray-700";
    if (base === "btn") return "bg-gray-600 text-white hover:bg-gray-700";
    if (base === "section") return "bg-gray-100";
    if (base === "border") return "border-gray-300";
    return "";
  }

  // Tab switching
  function renderTabs() {
    return (
      <div className={`nav-tabs flex ${getThemeColor("bg")} border-b ${getThemeColor("border")} mb-6`}>
        {[
          { key: "configuration", label: "Configuration" },
          { key: "scouting", label: "Scouting" },
          { key: "data", label: "Data" }
        ].map(tabObj => (
          <button
            key={tabObj.key}
            className={`nav-tab flex-1 py-4 text-xl font-semibold rounded-t-lg transition-all ${tab === tabObj.key ? `bg-white ${getThemeColor("text")} border-b-4 ${bgColor === "red" ? "border-red-500" : bgColor === "blue" ? "border-blue-500" : "border-gray-500"}` : `${getThemeColor("bg")} ${getThemeColor("text")}`}`}
            onClick={() => setTab(tabObj.key)}
          >
            {tabObj.label}
          </button>
        ))}
      </div>
    );
  }

  // Counter logic
  function updateCounter(id: string, delta: number) {
    setCounters(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  }
  function resetCounters() {
    setCounters({ ...initialCounters });
  }

  // Save scouting result
  function saveScoutingResult() {
    if (!selectedTeam || !match) return;
    setScoutingData(prev => [
      ...prev,
      {
        team: selectedTeam,
        match,
        color,
        counters: { ...counters },
        movedFromStart,
        defense,
        action,
        notes,
        timestamp: new Date().toISOString(),
      },
    ]);
    setMatch("");
    setColor("blue");
    resetCounters();
    setMovedFromStart(false);
    setDefense(false);
    setAction("");
    setNotes("");
    triggerMotivationBtn(2500);
  }

  // Scouting tab UI
  function renderScoutingTab() {
    return (
      <div className="scouting-container flex flex-wrap gap-8 relative">
        {/* Motivation Button appears for 2.5s after submit, and shows a quote when clicked */}
        {showMotivationBtn && (
          <button
            className="fixed top-8 right-8 z-50 bg-yellow-400 hover:bg-yellow-500 text-black text-2xl font-extrabold px-8 py-4 rounded-full shadow-lg border-4 border-yellow-600 animate-bounce"
            style={{ minWidth: 200 }}
            type="button"
            tabIndex={0}
            onClick={showRandomMotivation}
          >
            MOTIVATE ME!
          </button>
        )}
        {/* Motivation Modal */}
        {showMotivationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-600 mb-4">💪 Motivation!</span>
              <p className="text-xl text-center text-black mb-6">{motivationText}</p>
              <button
                className="mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full border-2 border-yellow-600"
                onClick={() => setShowMotivationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div className="scouting-left flex-1 min-w-[320px] flex flex-col gap-6">
          <div className="match-info flex gap-4 mb-2">
            <div className="info-group flex-1">
              <label className="info-label font-semibold mb-1">Team</label>
              <select
                className="info-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200"
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
              >
                <option value="">Select a team...</option>
                {teams.map((t, i) => (
                  <option key={i} value={t.number}>
                    #{t.number} - {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="info-group flex-1">
              <label className="info-label font-semibold mb-1">Match</label>
              <input
                className="info-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200"
                type="number"
                value={match}
                onChange={e => setMatch(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Match Number"
                min="0"
              />
            </div>
            <div className="info-group flex-1">
              <label className="info-label font-semibold mb-1">Color</label>
              <div className="color-toggle flex gap-2 mt-1">
                <button
                  className={`color-btn flex-1 py-2 rounded-full font-bold border-2 transition-all ${color === "blue" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-700 border-blue-300 hover:bg-blue-100"}`}
                  type="button"
                  onClick={() => setColor("blue")}
                  aria-pressed={color === "blue"}
                  style={{ boxShadow: color === "blue" ? "0 0 0 3px #3b82f6" : undefined }}
                >
                  Blue
                </button>
                <button
                  className={`color-btn flex-1 py-2 rounded-full font-bold border-2 transition-all ${color === "red" ? "bg-red-600 text-white border-red-700" : "bg-white text-red-700 border-red-300 hover:bg-red-100"}`}
                  type="button"
                  onClick={() => setColor("red")}
                  aria-pressed={color === "red"}
                  style={{ boxShadow: color === "red" ? "0 0 0 3px #ef4444" : undefined }}
                >
                  Red
                </button>
              </div>
            </div>
          </div>

          <div className="scoring-sections flex gap-4">
            {/* Auto Section */}
            <div className={`auto-section flex-1 ${getThemeColor("section")} rounded-xl p-4`}>
              <div className="checkbox-item flex items-center mb-4">
                <input type="checkbox" id="moved-start" className="mr-2 w-5 h-5" checked={movedFromStart} onChange={e => setMovedFromStart(e.target.checked)} />
                <label htmlFor="moved-start" className="font-medium">Moved from Start</label>
              </div>
              <h3 className="section-title text-lg font-bold mb-2">Auto</h3>
              <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-y-2 gap-x-4">
                {[1, 2, 3, 4].map(l => (
                  <React.Fragment key={`auto-l${l}`}> 
                    <span className="level-label col-span-1 flex items-center font-semibold text-black">L{l}</span>
                    <button className={`counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`auto-l${l}`, 1)}>+</button>
                    <div className="counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`auto-l${l}`]}</div>
                    <button className={`counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`auto-l${l}`, -1)}>-</button>
                  </React.Fragment>
                ))}
                {["net", "processor"].map(type => (
                  <React.Fragment key={`auto-${type}`}> 
                    <span className="level-label col-span-1 flex items-center font-semibold capitalize text-black">{type}</span>
                    <button className={`counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`auto-${type}`, 1)}>+</button>
                    <div className="counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`auto-${type}`]}</div>
                    <button className={`counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`auto-${type}`, -1)}>-</button>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Teleop Section */}
            <div className={`teleop-section flex-1 ${getThemeColor("section")} rounded-xl p-4`}>
              <div className="checkbox-item flex items-center mb-4">
                <input type="checkbox" id="defense" className="mr-2 w-5 h-5" checked={defense} onChange={e => setDefense(e.target.checked)} />
                <label htmlFor="defense" className="font-medium">Defense</label>
              </div>
              <h3 className="section-title text-lg font-bold mb-2">Teleop</h3>
              <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-y-2 gap-x-4">
                {[1, 2, 3, 4].map(l => (
                  <React.Fragment key={`teleop-l${l}`}> 
                    <span className="level-label col-span-1 flex items-center font-semibold text-black">L{l}</span>
                    <button className={`counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`teleop-l${l}`, 1)}>+</button>
                    <div className="counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`teleop-l${l}`]}</div>
                    <button className={`counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`teleop-l${l}`, -1)}>-</button>
                  </React.Fragment>
                ))}
                {["net", "processor"].map(type => (
                  <React.Fragment key={`teleop-${type}`}> 
                    <span className="level-label col-span-1 flex items-center font-semibold capitalize text-black">{type}</span>
                    <button className={`counter-btn plus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`teleop-${type}`, 1)}>+</button>
                    <div className="counter-display col-span-1 w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`teleop-${type}`]}</div>
                    <button className={`counter-btn minus col-span-1 w-12 h-12 flex items-center justify-center rounded-full text-3xl shadow-lg transition ${darkMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-600 text-white hover:bg-gray-700'}`} type="button" onClick={() => updateCounter(`teleop-${type}`, -1)}>-</button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="game-actions flex flex-wrap gap-2 my-2">
            {actions.map(a => (
              <button
                key={a}
                className={`action-btn px-4 py-2 rounded-full font-semibold ${action === a ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                type="button"
                onClick={() => setAction(a)}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="notes-section flex-1">
            <label className="info-label font-semibold">Notes</label>
            <textarea
              className="notes-textarea w-full h-28 border rounded p-2 mt-1"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes about team performance..."
            />
          </div>

          <button
            className={`action-button export-btn w-full mt-4 py-3 text-lg font-bold ${getThemeColor("btn")}`}
            type="button"
            onClick={saveScoutingResult}
          >
            Save Data
          </button>
        </div>
        {/* Remove the scouting data preview from the scouting tab */}
      </div>
    );
  }

  // Configuration tab UI (was Teams tab)
  function renderConfigurationTab() {
    function addTeam() {
      if (!teamName.trim() || !teamNumber.trim()) return;
      if (teams.some(t => t.number === teamNumber.trim())) return;
      setTeams(prev => [...prev, { name: teamName.trim(), number: teamNumber.trim() }]);
      setTeamName("");
      setTeamNumber("");
    }
    function deleteTeam(idx: number) {
      setTeams(prev => prev.filter((_, i) => i !== idx));
    }
    function importTeams(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (Array.isArray(data)) {
            setTeams(data.filter((t: any) => t.name && t.number));
          } else if (data.teams && Array.isArray(data.teams)) {
            setTeams(data.teams.filter((t: any) => t.name && t.number));
          }
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
    return (
      <div className="configuration-container flex flex-col md:flex-row gap-8">
        <div className={`settings-section flex-1 ${getThemeColor("section")} rounded-xl p-6 mb-6 md:mb-0`}>
          <h2 className={`section-title text-xl font-bold mb-4 ${getThemeColor("text")}`}>Settings</h2>
          <div className="form-group mb-4">
            <label className="form-label font-semibold text-blue-700">Dark Mode</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setDarkMode(true)}
                type="button"
              >
                On
              </button>
              <button
                className={`px-4 py-2 rounded ${!darkMode ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setDarkMode(false)}
                type="button"
              >
                Off
              </button>
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="form-label font-semibold text-blue-700">Background Color</label>
            <div className="flex items-center gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded ${bgColor === "red" ? "bg-red-700 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setBgColor("red")}
                type="button"
              >
                Red
              </button>
              <button
                className={`px-4 py-2 rounded ${bgColor === "blue" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setBgColor("blue")}
                type="button"
              >
                Blue
              </button>
              <button
                className={`px-4 py-2 rounded ${bgColor === "gray" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
                onClick={() => setBgColor("gray")}
                type="button"
              >
                Gray
              </button>
            </div>
          </div>
        </div>
        <div className={`add-team-section flex-1 ${getThemeColor("section")} rounded-xl p-6`}>
          <h2 className={`section-title text-xl font-bold mb-4 ${getThemeColor("text")}`}>Add a Team</h2>
          <div className="form-group mb-2">
            <label className="form-label font-semibold text-blue-700">Name</label>
            <input type="text" className="form-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Name" />
          </div>
          <div className="form-group mb-2">
            <label className="form-label font-semibold text-blue-700">Number</label>
            <input type="number" className="form-input w-full border rounded p-2 text-black bg-white dark:bg-gray-200" value={teamNumber} onChange={e => setTeamNumber(e.target.value)} placeholder="Team Number" />
          </div>
          <button className={`add-team-btn w-full py-2 rounded mt-2 ${getThemeColor("btn")}`} onClick={addTeam}>ADD+</button>
          <div className="mt-4 flex flex-col gap-2">
            <label className="form-label font-semibold text-blue-700">Import Teams (JSON)</label>
            <button
              type="button"
              className={`add-team-btn w-full py-2 rounded ${getThemeColor("btn")}`}
              onClick={() => document.getElementById('import-teams-input')?.click()}
            >
              Import JSON
            </button>
            <input
              id="import-teams-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={importTeams}
            />
          </div>
        </div>
        <div className="middle-section flex-1">
          <h3 className="text-center font-bold mb-2">Team List</h3>
          <div className={`${getThemeColor("section")} rounded-xl p-4 min-h-[200px] text-black`}>
            {teams.length === 0 ? (
              <p className="text-gray-500 text-center">Added teams will appear here</p>
            ) : (
              <ul>
                {teams.map((team, idx) => (
                  <li key={idx} className="team-item flex justify-between items-center mb-2 bg-gray-50 rounded p-2 text-black">
                    <div className="team-info">
                      <div className="team-name font-semibold">{team.name}</div>
                      <div className="team-number text-gray-500 text-sm">Team #{team.number}</div>
                    </div>
                    <button className="delete-team-btn bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => deleteTeam(idx)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Data tab UI
  function renderDataTab() {
    function exportCSV() {
      if (scoutingData.length === 0) return;
      let csv = 'Team,Match,Color,Auto L1,Auto L2,Auto L3,Auto L4,Auto Net,Auto Processor,Teleop L1,Teleop L2,Teleop L3,Teleop L4,Teleop Net,Teleop Processor,Moved from Start,Defense,Action,Notes,Timestamp\n';
      scoutingData.forEach(d => {
        csv += `${d.team},${d.match},${d.color},${d.counters["auto-l1"]},${d.counters["auto-l2"]},${d.counters["auto-l3"]},${d.counters["auto-l4"]},${d.counters["auto-net"]},${d.counters["auto-processor"]},${d.counters["teleop-l1"]},${d.counters["teleop-l2"]},${d.counters["teleop-l3"]},${d.counters["teleop-l4"]},${d.counters["teleop-net"]},${d.counters["teleop-processor"]},${d.movedFromStart},${d.defense},${d.action},"${d.notes.replace(/"/g, '""')}",${d.timestamp}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scouting_data_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    const teamOptions = Array.from(new Set(scoutingData.map(d => d.team)));
    const teamData = scoutingData.filter(d => d.team === selected);
    return (
      <div className="data-container flex flex-col md:flex-row gap-8">
        {/* Force black text for All Scouting Data table and team dropdowns in dark mode */}
        <style>{`
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
        `}</style>
        <div className="data-left flex-1">
          <div className="mb-4">
            <h3 className="mb-2 font-bold">All Scouting Data</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-300 mb-6">
              <table className="all-scouting-table min-w-full text-xs text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-1">Team</th>
                    <th className="px-2 py-1">Match</th>
                    <th className="px-2 py-1">Color</th>
                    <th className="px-2 py-1">Auto L1</th>
                    <th className="px-2 py-1">Auto L2</th>
                    <th className="px-2 py-1">Auto L3</th>
                    <th className="px-2 py-1">Auto L4</th>
                    <th className="px-2 py-1">Teleop L1</th>
                    <th className="px-2 py-1">Teleop L2</th>
                    <th className="px-2 py-1">Teleop L3</th>
                    <th className="px-2 py-1">Teleop L4</th>
                    <th className="px-2 py-1">Action</th>
                    <th className="px-2 py-1">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {scoutingData.length === 0 ? (
                    <tr><td colSpan={13} className="text-center text-gray-400 py-2">No scouting data</td></tr>
                  ) : (
                    scoutingData.slice().reverse().map((d, i) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        <td className="px-2 py-1">{d.team}</td>
                        <td className="px-2 py-1">{d.match}</td>
                        <td className="px-2 py-1">{d.color}</td>
                        <td className="px-2 py-1">{d.counters["auto-l1"]}</td>
                        <td className="px-2 py-1">{d.counters["auto-l2"]}</td>
                        <td className="px-2 py-1">{d.counters["auto-l3"]}</td>
                        <td className="px-2 py-1">{d.counters["auto-l4"]}</td>
                        <td className="px-2 py-1">{d.counters["teleop-l1"]}</td>
                        <td className="px-2 py-1">{d.counters["teleop-l2"]}</td>
                        <td className="px-2 py-1">{d.counters["teleop-l3"]}</td>
                        <td className="px-2 py-1">{d.counters["teleop-l4"]}</td>
                        <td className="px-2 py-1">{d.action}</td>
                        <td className="px-2 py-1">{d.notes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="team-selector mb-4">
            <h3 className="mb-2 font-bold">Select a Team</h3>
            <select className="team-dropdown w-full border rounded p-2" value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="">Choose a team...</option>
              {teamOptions.map((num, i) => (
                <option key={i} value={num}>Team {num}</option>
              ))}
            </select>
          </div>
          <div className={`${getThemeColor("section") } rounded-xl p-4 min-h-[200px] ${getThemeColor("text") }`}>
            {!selected ? (
              <p className="text-gray-500">Select a team above to view their performance data</p>
            ) : teamData.length === 0 ? (
              <p className="text-gray-500">No data found for Team {selected}</p>
            ) : (
              <div>
                <h4 className="font-bold mb-2">Team {selected} Performance</h4>
                <p><b>Matches Scouted:</b> {teamData.length}</p>
                <div className="mt-2">
                  <b>Average Scores:</b>
                  <ul className="ml-4 list-disc">
                    <li>Auto L1: {(teamData.reduce((sum, d) => sum + d.counters["auto-l1"], 0) / teamData.length).toFixed(1)}</li>
                    <li>Teleop L1: {(teamData.reduce((sum, d) => sum + d.counters["teleop-l1"], 0) / teamData.length).toFixed(1)}</li>
                  </ul>
                </div>
                <div className="mt-2">
                  <b>Recent Matches:</b>
                  <ul className="ml-4 list-disc">
                    {teamData.slice(-3).map((d, i) => (
                      <li key={i}>Match {d.match} ({d.color}) - Action: {d.action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="data-right w-full md:w-[300px] flex flex-col gap-4 mt-4 md:mt-0">
          <button className={`action-button export-btn py-3 rounded ${getThemeColor("btn")}`} onClick={exportCSV}>Export as CSV</button>
          <div className="delete-section mt-6 p-4 rounded-xl border border-red-400 bg-red-50">
            <h4 className="font-bold text-red-600 mb-2">Delete All Scouting Data</h4>
            {!showDelete ? (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded font-bold w-full"
                onClick={() => setShowDelete(true)}
              >
                Delete Scouting Data
              </button>
            ) : (
              <div>
                <label className="block mb-1 font-semibold">Enter Delete Code:</label>
                <input
                  type="password"
                  className="border rounded p-2 w-full mb-2 text-black"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Enter code to confirm"
                />
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded font-bold w-full mb-2"
                  onClick={() => {
                    if (deleteInput === deleteCode) {
                      setScoutingData([]);
                      setShowDelete(false);
                      setDeleteInput("");
                      alert("All scouting data deleted.");
                    } else {
                      alert("Incorrect code.");
                    }
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded w-full"
                  onClick={() => { setShowDelete(false); setDeleteInput(""); }}
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="mt-4">
              <label className="block mb-1 font-semibold">Change Delete Code:</label>
              <input
                type="password"
                className="border rounded p-2 w-full mb-2 text-black"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="Current code"
              />
              <input
                type="password"
                className="border rounded p-2 w-full mb-2 text-black"
                value={newDeleteCode}
                onChange={e => setNewDeleteCode(e.target.value)}
                placeholder="New code"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                onClick={() => {
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
                }}
              >
                Set New Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-4 ${darkMode ? "bg-gray-900 text-white" : `${getThemeColor("bg")} ${getThemeColor("text")}`}`}> 
      {renderTabs()}
      {tab === "scouting" && renderScoutingTab()}
      {tab === "configuration" && renderConfigurationTab()}
      {tab === "data" && renderDataTab()}
    </div>
  );
}
