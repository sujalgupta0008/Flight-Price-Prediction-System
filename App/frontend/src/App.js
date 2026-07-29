import { useState } from "react";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const OPTIONS = {
  airlines: ["Air Asia","Air India","GoAir","IndiGo","Jet Airways","Jet Airways Business","Multiple carriers","Multiple carriers Premium economy","SpiceJet","Trujet","Vistara","Vistara Premium economy"],
  sources: ["Banglore","Chennai","Delhi","Kolkata","Mumbai"],
  destinations: ["Banglore","Cochin","Delhi","Hyderabad","Kolkata","New Delhi"],
  stops: ["non-stop","1 stop","2 stops","3 stops","4 stops"],
  additionalInfo: ["No Info","No check-in baggage included","In-flight meal not included","No info","1 Short layover","1 Long layover","2 Long layover","Change airports","Business class","Red-eye flight"],
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} required>
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function NumberInput({ label, name, value, onChange, min, max, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="number" name={name} value={value} onChange={onChange}
        min={min} max={max} placeholder={placeholder} required />
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    Airline: "", Source: "", Destination: "", Total_Stops: "", Additional_Info: "",
    Journey_Day: "", Journey_Month: "",
    Departure_Hour: "", Departure_Minute: "",
    Arrival_Hour: "", Arrival_Minute: "",
    Duration_Minutes: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const payload = { ...form };
      ["Journey_Day","Journey_Month","Departure_Hour","Departure_Minute",
       "Arrival_Hour","Arrival_Minute","Duration_Minutes"].forEach(k => {
        payload[k] = parseInt(payload[k]);
      });
      const res = await axios.post(${BACKEND_URL}/api/predict, payload);
      setResult(res.data.predicted_price);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <span className="plane">✈️</span>
          <h1>Flight Price Predictor</h1>
          <p>Get an instant price estimate for your flight</p>
        </div>
        <form onSubmit={submit} className="form">
          <div className="section-title">✈ Flight Details</div>
          <div className="grid-2">
            <Select label="Airline" name="Airline" value={form.Airline} onChange={handle} options={OPTIONS.airlines} />
            <Select label="Total Stops" name="Total_Stops" value={form.Total_Stops} onChange={handle} options={OPTIONS.stops} />
            <Select label="Source City" name="Source" value={form.Source} onChange={handle} options={OPTIONS.sources} />
            <Select label="Destination City" name="Destination" value={form.Destination} onChange={handle} options={OPTIONS.destinations} />
            <Select label="Additional Info" name="Additional_Info" value={form.Additional_Info} onChange={handle} options={OPTIONS.additionalInfo} />
          </div>
          <div className="section-title">📅 Journey Date</div>
          <div className="grid-2">
            <NumberInput label="Day" name="Journey_Day" value={form.Journey_Day} onChange={handle} min={1} max={31} placeholder="e.g. 15" />
            <div className="field">
              <label>Month</label>
              <select name="Journey_Month" value={form.Journey_Month} onChange={handle} required>
                <option value="">-- Select Month --</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="section-title">🕐 Departure Time</div>
          <div className="grid-2">
            <NumberInput label="Departure Hour (0-23)" name="Departure_Hour" value={form.Departure_Hour} onChange={handle} min={0} max={23} placeholder="e.g. 6" />
            <NumberInput label="Departure Minute (0-59)" name="Departure_Minute" value={form.Departure_Minute} onChange={handle} min={0} max={59} placeholder="e.g. 30" />
          </div>
          <div className="section-title">🕐 Arrival Time</div>
          <div className="grid-2">
            <NumberInput label="Arrival Hour (0-23)" name="Arrival_Hour" value={form.Arrival_Hour} onChange={handle} min={0} max={23} placeholder="e.g. 10" />
            <NumberInput label="Arrival Minute (0-59)" name="Arrival_Minute" value={form.Arrival_Minute} onChange={handle} min={0} max={59} placeholder="e.g. 45" />
          </div>
          <div className="section-title">⏱ Duration</div>
          <div className="grid-2">
            <NumberInput label="Total Duration (in minutes)" name="Duration_Minutes" value={form.Duration_Minutes} onChange={handle} min={0} placeholder="e.g. 255" />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Predicting..." : "🔍 Predict Price"}
          </button>
        </form>
        {result !== null && (
          <div className="result">
            <p className="result-label">Estimated Flight Price</p>
            <p className="result-price">₹ {result.toLocaleString("en-IN")}</p>
            <p className="result-note">* This is a model prediction based on historical data</p>
          </div>
        )}
        {error && <div className="error">⚠️ {error}</div>}
      </div>
    </div>
  );
}
