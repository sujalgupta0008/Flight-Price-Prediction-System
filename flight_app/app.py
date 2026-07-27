from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

# Load the trained pipeline (falls back to demo mode if model file is missing)
pipeline = None
try:
    import joblib
    pipeline = joblib.load("../Models/flight_price_pipeline.pkl")
except Exception:
    pass


def demo_predict(df):
    """Dummy prediction used ONLY in this preview (no .pkl here).
    In your project the real pipeline will be used automatically."""
    base = 4500
    airline_add = {
        "Jet Airways": 6500, "Vistara": 4200, "Air India": 3800,
        "Multiple carriers": 5200, "IndiGo": 2400, "SpiceJet": 2100, "GoAir": 2000,
    }
    stops_add = {"non-stop": 0, "1 stop": 2200, "2 stops": 4100, "3 stops": 5600, "4 stops": 7000}
    row = df.iloc[0]
    price = base + airline_add.get(row["Airline"], 3000) + stops_add.get(row["Total_Stops"], 0)
    price += row["Duration_Minutes"] * 2.1 + row["Journey_Month"] * 45
    return price


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    airline = request.form["airline"]
    source = request.form["source"]
    destination = request.form["destination"]
    journey_date = request.form["journey_date"]
    dep_time = request.form["dep_time"]
    arrival_time = request.form["arrival_time"]
    stops = request.form["stops"]

    additional_info = "No info"

    journey_date = pd.to_datetime(journey_date)
    journey_day = journey_date.day
    journey_month = journey_date.month

    dep_time = pd.to_datetime(dep_time)
    departure_hour = dep_time.hour
    departure_minute = dep_time.minute

    arrival_time = pd.to_datetime(arrival_time)
    arrival_hour = arrival_time.hour
    arrival_minute = arrival_time.minute

    duration_minutes = (
        (arrival_hour * 60 + arrival_minute)
        - (departure_hour * 60 + departure_minute)
    )
    if duration_minutes < 0:
        duration_minutes += 24 * 60

    input_df = pd.DataFrame({
        "Airline": [airline],
        "Source": [source],
        "Destination": [destination],
        "Total_Stops": [stops],
        "Additional_Info": [additional_info],
        "Journey_Day": [journey_day],
        "Journey_Month": [journey_month],
        "Departure_Hour": [departure_hour],
        "Departure_Minute": [departure_minute],
        "Arrival_Hour": [arrival_hour],
        "Arrival_Minute": [arrival_minute],
        "Duration_Minutes": [duration_minutes]
    })

    if pipeline is not None:
        prediction = pipeline.predict(input_df)[0]
    else:
        prediction = demo_predict(input_df)

    prediction = round(float(prediction), 2)

    return render_template(
        "index.html",
        prediction_text=f"₹ {prediction:,.2f}",
        form_data=request.form
    )


if __name__ == "__main__":
    app.run(debug=True)
