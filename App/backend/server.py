from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "Models" / "flight_price_pipeline.pkl"

try:
    pipeline = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully")
except Exception as e:
    print(f"Model load failed: {e}")
    pipeline = None

app = FastAPI(title="Flight Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FlightInput(BaseModel):
    Airline: str
    Source: str
    Destination: str
    Total_Stops: str
    Additional_Info: str
    Journey_Day: int
    Journey_Month: int
    Departure_Hour: int
    Departure_Minute: int
    Arrival_Hour: int
    Arrival_Minute: int
    Duration_Minutes: int

@app.get("/")
def root():
    return {"status": "Flight Price Prediction API is running"}

@app.get("/api/health")
def health():
    return {"model_loaded": pipeline is not None}

@app.post("/api/predict")
def predict(data: FlightInput):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    input_df = pd.DataFrame([{
        "Airline": data.Airline,
        "Source": data.Source,
        "Destination": data.Destination,
        "Total_Stops": data.Total_Stops,
        "Additional_Info": data.Additional_Info,
        "Journey_Day": data.Journey_Day,
        "Journey_Month": data.Journey_Month,
        "Departure_Hour": data.Departure_Hour,
        "Departure_Minute": data.Departure_Minute,
        "Arrival_Hour": data.Arrival_Hour,
        "Arrival_Minute": data.Arrival_Minute,
        "Duration_Minutes": data.Duration_Minutes,
    }])
    try:
        price = pipeline.predict(input_df)[0]
        return {"predicted_price": round(float(price), 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
