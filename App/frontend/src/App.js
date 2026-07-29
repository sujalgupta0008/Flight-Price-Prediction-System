import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const AIRLINES = ["Air Asia","Air India","GoAir","IndiGo","Jet Airways","Jet Airways Business","Multiple carriers","Multiple carriers Premium economy","SpiceJet","Trujet","Vistara","Vistara Premium economy"];
const SOURCES = ["Banglore","Chennai","Delhi","Kolkata","Mumbai"];
const DESTINATIONS = ["Banglore","Cochin","Delhi","Hyderabad","Kolkata","New Delhi"];
const STOPS = ["non-stop","1 stop","2 stops","3 stops","4 stops"];
const ADDITIONAL = ["No Info","No check-in baggage included","In-flight meal not included","No info","1 Short layover","1 Long layover","2 Long layover","Change airports","Business class","Red-eye flight"];

const AIRPORT_CODE = {
  Banglore: "BLR", Chennai: "MAA", Delhi: "DEL", Kolkata: "CCU",
  Mumbai: "BOM", Cochin: "COK", Hyderabad: "HYD", "New Delhi": "DEL",
};

// Stylised low-poly node positions inside a 300x340 viewBox (not to scale)
const CITY_POS = {
  Delhi: [95, 81], "New Delhi": [95, 81], Mumbai: [50, 202],
  Banglore: [99, 278], Chennai: [126, 277], Kolkata: [210, 157],
  Hyderabad: [109, 222], Cochin: [86, 316],
};

const INDIA_OUTLINE = "M83,13 L259,113 L210,157 L186,189 L126,277 L98,339 L50,202 L5,145 Z";

function arcPath(a, b) {
  if (!a || !b) return "";
  const [ax, ay] = a, [bx, by] = b;
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const dx = bx - ax, dy = by - ay;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist, ny = dx / dist;
  const bulge = Math.min(dist * 0.3, 55);
  const cx = mx + nx * bulge, cy = my + ny * bulge;
  return `M${ax},${ay} Q${cx},${cy} ${bx},${by}`;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useCountUp(target, active, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
}

// Airport departure-board style digit reveal
function SplitFlap({ text }) {
  const chars = text.split("");
  const [display, setDisplay] = useState(chars.map(c => (/[0-9]/.test(c) ? "0" : c)));
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setDisplay(chars); return; }
    const timers = [];
    chars.forEach((c, i) => {
      if (!/[0-9]/.test(c)) {
        timers.push(setTimeout(() => {
          setDisplay(d => { const n = [...d]; n[i] = c; return n; });
        }, 90 * i));
        return;
      }
      const settleAt = 260 + i * 90;
      const interval = setInterval(() => {
        setDisplay(d => {
          const n = [...d];
          n[i] = String(Math.floor(Math.random() * 10));
          return n;
        });
      }, 45);
      timers.push(interval);
      timers.push(setTimeout(() => {
        clearInterval(interval);
        setDisplay(d => { const n = [...d]; n[i] = c; return n; });
      }, settleAt));
    });
    return () => timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced]);

  const isBoxed = (c) => /[0-9]/.test(c) || c === "₹";

  return (
    <div className="split-flap" aria-label={text}>
      {display.map((c, i) => (
        <span className={isBoxed(c) ? "flap" : "flap-sep"} key={i}>{c}</span>
      ))}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    Airline: "", Source: "", Destination: "",
    Total_Stops: "", Additional_Info: "No Info",
    journeyDate: "", departureTime: "", arrivalTime: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  const handle = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setResult(null);
  };

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

  const handleCardMove = (e) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const srcPos = CITY_POS[form.Source];
  const dstPos = CITY_POS[form.Destination];
  const hasRoute = Boolean(srcPos && dstPos && form.Source !== form.Destination);
  const demoRoute = !hasRoute;
  const pathD = hasRoute ? arcPath(srcPos, dstPos) : arcPath(CITY_POS.Delhi, CITY_POS.Banglore);
  const srcCode = AIRPORT_CODE[form.Source] || "———";
  const dstCode = AIRPORT_CODE[form.Destination] || "———";

  const flightsCount = useCountUp(10463, mounted);
  const r2 = useCountUp(0.92, mounted, 2);

  const priceText = result !== null ? `\u20b9${Math.round(result).toLocaleString("en-IN")}` : "";

  return (
    <div className="page">
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-glow" aria-hidden="true"></div>

      <div className="content">
        <div className={`left ${mounted ? "in" : ""}`}>
          <div className="badge">
            <span className="dot"></span>
            Live fare forecasting
          </div>
          <h1 className="headline">
            Know your fare<br />
            <span className="amber">before </span>
            <span className="teal">you fly.</span>
          </h1>
          <p className="subtext">
            A machine learning model trained on thousands of historical
            Indian domestic flights, built to estimate your ticket price
            in real time.
          </p>

          <div className="stats">
            <div className="stat">
              <span className="stat-num">{flightsCount}</span>
              <span className="stat-label">FLIGHTS ANALYSED</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-num">{r2}</span>
              <span className="stat-label">R² SCORE</span>
            </div>
            <div className="divider"></div>
            <div className="stat">
              <span className="stat-num">&lt;1s</span>
              <span className="stat-label">PREDICTION TIME</span>
            </div>
          </div>

          <div className="map-frame">
            <div className="map-frame-head">
              <span>ROUTE PREVIEW</span>
              <span className="map-route-code">{srcCode} <i>→</i> {dstCode}</span>
            </div>
            <svg className="map-svg" viewBox="0 0 300 340" aria-hidden="true">
              <defs>
                <radialGradient id="radarFade" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="rgba(45,214,192,0.35)" />
                  <stop offset="100%" stopColor="rgba(45,214,192,0)" />
                </radialGradient>
              </defs>
              <path className="india-outline" d={INDIA_OUTLINE} />
              {[0, 1, 2].map(i => (
                <circle key={i} className="radar-ring" cx="150" cy="170" r={40 + i * 45} />
              ))}
              {!reduced && (
                <g className="radar-sweep">
                  <path d="M150,170 L150,20 A150,150 0 0,1 260,80 Z" fill="url(#radarFade)" />
                </g>
              )}
              {Object.entries(CITY_POS).filter(([name]) => name !== "New Delhi").map(([name, pos]) => {
                const active = name === form.Source || name === form.Destination;
                return (
                  <g key={name} className={`city-node ${active ? "active" : ""}`}>
                    <circle cx={pos[0]} cy={pos[1]} r={active ? 5 : 3} />
                    <text x={pos[0] + 8} y={pos[1] + 4}>{AIRPORT_CODE[name]}</text>
                  </g>
                );
              })}
              <path
                key={pathD}
                id="routeArc"
                className={`route-arc ${demoRoute ? "demo" : ""}`}
                d={pathD}
              />
              {!reduced && (
                <g key={`${pathD}-plane`} className="plane-icon">
                  <path d="M0,-5 L4,0 L0,5 L-1,2 L-4,3 L-3,0 L-4,-3 L-1,-2 Z" />
                  <animateMotion dur={demoRoute ? "5s" : "3.2s"} repeatCount="indefinite" rotate="auto">
                    <mpath href="#routeArc" />
                  </animateMotion>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="right">
          <div
            className="form-card"
            ref={cardRef}
            onMouseMove={handleCardMove}
            onMouseLeave={resetTilt}
            style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <div className="form-header">
              <div className="form-header-left">
                <span className="eyebrow">BOARDING PASS</span>
                <div className="form-title">Predict your fare</div>
              </div>
              <div className="route-mini">
                <span>{srcCode}</span>
                <span className="route-mini-line"><span className="plane-glyph">✈</span></span>
                <span>{dstCode}</span>
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
                {loading ? (
                  <span className="taxi-bar"><span className="taxi-plane">✈</span></span>
                ) : (
                  <>Predict price <span className="btn-arrow">→</span></>
                )}
              </button>
            </form>

            <div className={`stub ${result !== null ? "show" : ""}`}>
              <div className="stub-perforation"></div>
              {result !== null && (
                <div className="result-box">
                  <div className="result-label">Estimated fare</div>
                  <SplitFlap text={priceText} />
                  <div className="result-note">Based on historical flight data · not a guarantee</div>
                </div>
              )}
            </div>

            {error && <div className="error-box">⚠ {error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
