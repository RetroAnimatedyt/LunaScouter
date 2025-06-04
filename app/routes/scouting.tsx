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

export default function Scouting() {
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
  // --- Move these up from tab renderers ---
  const [teamName, setTeamName] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [selected, setSelected] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [bgColor, setBgColor] = useState("gray");

  // Load from localStorage on mount
  React.useEffect(() => {
    const storedTeams = localStorage.getItem("scouting-teams");
    if (storedTeams) setTeams(JSON.parse(storedTeams));
    const storedData = localStorage.getItem("scouting-data");
    if (storedData) setScoutingData(JSON.parse(storedData));
  }, []);

  // Save teams to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem("scouting-teams", JSON.stringify(teams));
  }, [teams]);

  // Save scouting data to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem("scouting-data", JSON.stringify(scoutingData));
  }, [scoutingData]);

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

  // Tab switching
  function renderTabs() {
    return (
      <div className="nav-tabs flex bg-gray-100 border-b border-gray-200 mb-6">
        {[
          { key: "configuration", label: "Configuration" },
          { key: "scouting", label: "Scouting" },
          { key: "data", label: "Data" }
        ].map(tabObj => (
          <button
            key={tabObj.key}
            className={`nav-tab flex-1 py-4 text-xl font-semibold rounded-t-lg transition-all ${tab === tabObj.key ? "bg-white text-blue-600 border-b-4 border-blue-500" : "bg-gray-200 text-gray-700"}`}
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
  }

  // Scouting tab UI
  function renderScoutingTab() {
    return (
      <div className="scouting-container flex flex-wrap gap-8">
        <div className="scouting-left flex-1 min-w-[320px] flex flex-col gap-6">
          <div className="match-info flex gap-4 mb-2">
            <div className="info-group flex-1">
              <label className="info-label font-semibold mb-1">Team</label>
              <select
                className="info-input w-full border rounded p-2"
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
                className="info-input w-full border rounded p-2"
                value={match}
                onChange={e => setMatch(e.target.value)}
                placeholder="Match Number"
              />
            </div>
            <div className="info-group flex-1">
              <label className="info-label font-semibold mb-1">Color</label>
              <div className="color-toggle flex gap-2 mt-1">
                <button
                  className={`color-btn blue flex-1 py-2 rounded-full font-bold ${color === "blue" ? "" : "inactive"}`}
                  type="button"
                  onClick={() => setColor("blue")}
                >
                  Blue
                </button>
                <button
                  className={`color-btn red flex-1 py-2 rounded-full font-bold ${color === "red" ? "" : "inactive"}`}
                  type="button"
                  onClick={() => setColor("red")}
                >
                  Red
                </button>
              </div>
            </div>
          </div>

          <div className="scoring-sections flex gap-4">
            <div className="auto-section flex-1 bg-gray-100 rounded-xl p-4">
              <h3 className="section-title text-lg font-bold mb-2">Auto</h3>
              {[1, 2, 3, 4].map(l => (
                <div className="scoring-row flex items-center gap-2 mb-2" key={`auto-l${l}`}> 
                  <span className="level-label w-12 font-semibold text-black">L{l}</span>
                  <button className="counter-btn plus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`auto-l${l}`, 1)}>+</button>
                  <div className="counter-display w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`auto-l${l}`]}</div>
                  <button className="counter-btn minus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`auto-l${l}`, -1)}>-</button>
                </div>
              ))}
              <div className="net-processor mt-4 pt-2 border-t border-gray-300">
                {["net", "processor"].map(type => (
                  <div className="scoring-row flex items-center gap-2 mb-2" key={`auto-${type}`}> 
                    <span className="level-label w-20 font-semibold capitalize text-black">{type}</span>
                    <button className="counter-btn plus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`auto-${type}`, 1)}>+</button>
                    <div className="counter-display w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`auto-${type}`]}</div>
                    <button className="counter-btn minus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`auto-${type}`, -1)}>-</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="teleop-section flex-1 bg-gray-100 rounded-xl p-4">
              <h3 className="section-title text-lg font-bold mb-2">Teleop</h3>
              {[1, 2, 3, 4].map(l => (
                <div className="scoring-row flex items-center gap-2 mb-2" key={`teleop-l${l}`}> 
                  <span className="level-label w-12 font-semibold text-black">L{l}</span>
                  <button className="counter-btn plus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`teleop-l${l}`, 1)}>+</button>
                  <div className="counter-display w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`teleop-l${l}`]}</div>
                  <button className="counter-btn minus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`teleop-l${l}`, -1)}>-</button>
                </div>
              ))}
              <div className="net-processor mt-4 pt-2 border-t border-gray-300">
                {["net", "processor"].map(type => (
                  <div className="scoring-row flex items-center gap-2 mb-2" key={`teleop-${type}`}> 
                    <span className="level-label w-20 font-semibold capitalize text-black">{type}</span>
                    <button className="counter-btn plus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`teleop-${type}`, 1)}>+</button>
                    <div className="counter-display w-16 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center bg-gray-50 text-lg font-bold text-black">{counters[`teleop-${type}`]}</div>
                    <button className="counter-btn minus bg-gray-600 text-white" type="button" onClick={() => updateCounter(`teleop-${type}`, -1)}>-</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="checkbox-group my-4">
            <div className="checkbox-item flex items-center mb-2">
              <input type="checkbox" id="moved-start" className="mr-2 w-5 h-5" checked={movedFromStart} onChange={e => setMovedFromStart(e.target.checked)} />
              <label htmlFor="moved-start" className="font-medium">Moved from Start</label>
            </div>
            <div className="checkbox-item flex items-center mb-2">
              <input type="checkbox" id="defense" className="mr-2 w-5 h-5" checked={defense} onChange={e => setDefense(e.target.checked)} />
              <label htmlFor="defense" className="font-medium">Defense</label>
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
            className="action-button export-btn w-full mt-4 py-3 text-lg font-bold"
            type="button"
            onClick={saveScoutingResult}
          >
            Save Data
          </button>
        </div>
        <div className="scouting-right min-w-[280px] max-w-[350px] flex-1">
          <h3 className="mb-4 font-bold text-lg">Scouting Data</h3>
          <div className="bg-gray-100 rounded-xl p-4 min-h-[200px] text-black">
            {scoutingData.length === 0 ? (
              <p className="text-gray-500">Team scouting data will appear here</p>
            ) : (
              <ul className="space-y-2">
                {scoutingData.slice(-5).reverse().map((d, i) => (
                  <li key={i} className="bg-white rounded p-2 shadow text-xs text-black">
                    <div><b>Team:</b> {d.team} <b>Match:</b> {d.match} <b>Color:</b> {d.color}</div>
                    <div><b>Auto:</b> L1:{d.counters["auto-l1"]} L2:{d.counters["auto-l2"]} ...</div>
                    <div><b>Teleop:</b> L1:{d.counters["teleop-l1"]} L2:{d.counters["teleop-l2"]} ...</div>
                    <div><b>Action:</b> {d.action} <b>Notes:</b> {d.notes}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
        <div className="settings-section flex-1 bg-gray-100 rounded-xl p-6 mb-6 md:mb-0">
          <h2 className="section-title text-xl font-bold mb-4 text-blue-700">Settings</h2>
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
        <div className="add-team-section flex-1 bg-gray-100 rounded-xl p-6">
          <h2 className="section-title text-xl font-bold mb-4 text-blue-700">Add a Team</h2>
          <div className="form-group mb-2">
            <label className="form-label font-semibold text-blue-700">Name</label>
            <input type="text" className="form-input w-full border rounded p-2 text-black" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Name" />
          </div>
          <div className="form-group mb-2">
            <label className="form-label font-semibold text-blue-700">Number</label>
            <input type="number" className="form-input w-full border rounded p-2 text-black" value={teamNumber} onChange={e => setTeamNumber(e.target.value)} placeholder="Team Number" />
          </div>
          <button className="add-team-btn bg-blue-600 text-white w-full py-2 rounded mt-2" onClick={addTeam}>ADD+</button>
          <div className="mt-4 flex flex-col gap-2">
            <label className="form-label font-semibold text-blue-700">Import Teams (JSON)</label>
            <button
              type="button"
              className="add-team-btn bg-blue-500 hover:bg-blue-700 text-white w-full py-2 rounded"
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
          <div className="team-list bg-white rounded-xl p-4 min-h-[200px] text-black">
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
        <div className="data-left flex-1">
          <div className="team-selector mb-4">
            <h3 className="mb-2 font-bold">Select a Team</h3>
            <select className="team-dropdown w-full border rounded p-2" value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="">Choose a team...</option>
              {teamOptions.map((num, i) => (
                <option key={i} value={num}>Team {num}</option>
              ))}
            </select>
          </div>
          <div className="data-display bg-white rounded-xl p-4 min-h-[200px] text-black">
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
          <button className="action-button export-btn bg-green-600 text-white py-3 rounded" onClick={exportCSV}>Export as CSV</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {renderTabs()}
      {tab === "scouting" && renderScoutingTab()}
      {tab === "configuration" && renderConfigurationTab()}
      {tab === "data" && renderDataTab()}
    </div>
  );
}
