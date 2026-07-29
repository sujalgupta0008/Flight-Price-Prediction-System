import { useState } from "react";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const AIRLINES = ["Air Asia","Air India","GoAir","IndiGo","Jet Airways","Jet Airways Business","Multiple carriers","Multiple carriers Premium economy","SpiceJet","Trujet","Vistara","Vistara Premium economy"];
const SOURCES = ["Banglore","Chennai","Delhi","Kolkata","Mumbai"];
const DESTINATIONS = ["Banglore","Cochin","Delhi","Hyderabad","Kolkata","New Delhi"];
const STOPS = ["non-stop","1 stop","2 stops","3 stops","4 stops"];
const ADDITIONAL = ["No Info","No check-in baggage included","In-flight meal not included","No info","1 Short layover","1 Long layover","2 Long layover","Change airports","Business class","Red-eye flight"];

export default function App() {
  const [form, setForm] = useState({
    Airline: "", Source: "", Destination: "",
    Total_Stops: "", Additional_Info: "No Info",
    journeyDate: "", departureTime: "", arrivalTime: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const date = new Date(form.journeyDate);
      const [depH, depM] = form.departureTime.split(":").map(Number);
      const [arrH, arrM] = form.arrivalTime.split(":").map(Number);
      const depTotal = depH * 60 + depM;
      const arrTotal = arrH * 60 + arrM;
      const duration = arrTotal >= depTotal ? arrTotal - depTotal : (1440 - depTotal) + arrTotal;

      const payload = {
        Airline: form.Airline,
        Source: form.Source,
        Destination: form.Destination,
        Total_Stops: form.Total_Stops,
        Additional_Info: form.Additional_Info,
        Journey_Day: date.getDate(),
        Journey_Month: date.getMonth() + 1,
        Departure_Hour: depH,
        Departure_Minute: depM,
        Arrival_Hour: arrH,
        Arrival_Minute: arrM,
        Duration_Minutes: duration,
      };

      const res = await axios.post(`${BACKEND_URL}/api/predict`, payload);
      setResult(res.data.predicted_price);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="globe-bg"></div>
      <div className="content">
        <div className="left">
          <div className="badge">
            <span className="dot"></span>
            Predict Flight Prices Before You Book.
          </div>
          <h1 className="headline">
            Know your fare<br />
            <span className="purple">before </span>
            <span className="cyan">you fly.</span>
          </h1>
          <p className="subtext">
            Machine learning model trained on thousands of historical
            flight records across India to deliver fast and accurate ticket
            price predictions in real time
          </p>
          <div className="stats">
            <div className="stat">
              <span className="stat-num">10,463</span>
              <span className="stat-label">FLIGHTS ANALYSED</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-num">0.92</span>
              <span className="stat-label">R² SCORE</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-num">&lt;1s</span>
              <span className="stat-label">PREDICTION TIME</span>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">✈</div>
              <div>
                <div className="form-title">Predict your fare</div>
                <div className="form-subtitle">Fill flight details below</div>
              </div>
            </div>
            <form onSubmit={submit}>
              <div className="field-group">
                <label>AIRLINE</label>
                <select name="Airline" value={form.Airline} onChange={handle} required>
                  <option value="">Select Airline</option>
                  {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="row-2">
                <div className="field-group">
                  <label>SOURCE</label>
                  <select name="Source" value={form.Source} onChange={handle} required>
                    <option value="">From</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label>DESTINATION</label>
                  <select name="Destination" value={form.Destination} onChange={handle} required>
                    <option value="">To</option>
                    {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="row-2">
                <div className="field-group">
                  <label>JOURNEY DATE</label>
                  <input type="date" name="journeyDate" value={form.journeyDate} onChange={handle} required />
                </div>
                <div className="field-group">
                  <label>TOTAL STOPS</label>
                  <select name="Total_Stops" value={form.Total_Stops} onChange={handle} required>
                    <option value="">Select Stops</option>
                    {STOPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="row-2">
                <div className="field-group">
                  <label>DEPARTURE TIME</label>
                  <input type="time" name="departureTime" value={form.departureTime} onChange={handle} required />
                </div>
                <div className="field-group">
                  <label>ARRIVAL TIME</label>
                  <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handle} required />
                </div>
              </div>
              <div className="field-group">
                <label>ADDITIONAL INFO</label>
                <select name="Additional_Info" value={form.Additional_Info} onChange={handle}>
                  {ADDITIONAL.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <button type="submit" className="predict-btn" disabled={loading}>
                {loading ? "Predicting..." : "Predict Price \u2192"}
              </button>
            </form>
            {result !== null && (
              <div className="result-box">
                <div className="result-label">Estimated Flight Price</div>
                <div className="result-price">&#8377; {result.toLocaleString("en-IN")}</div>
                <div className="result-note">* Based on historical flight data</div>
              </div>
            )}
            {error && <div className="error-box">⚠️ {error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
