# ✈️ Flight Price Analysis & Prediction Dashboard

<p align="center">
  <img src="https://media.giphy.com/media/yLPIupXMTIz8Q/giphy.gif" width="410"/>
</p>

<h1 align="center">
  ✈️ Flight Price Intelligence System
</h1>

<p align="center">
  A complete End-to-End Data Analytics & Business Intelligence project to analyze airline pricing patterns, discover travel insights, and build an interactive Power BI dashboard and a website.
</p>

<p align="center">
  🚀 Python • SQL • Power BI • Data Visualization • Analytics • Machine Learning
</p>

---

# 🌐 Project Overview

Flight ticket prices change continuously based on multiple factors such as:

* ✈️ Airline
* 🛫 Source & Destination
* 🕒 Departure Time
* 🛬 Arrival Time
* 📅 Journey Duration
* 🔁 Number of Stops
* 📆 Days Before Departure

This project transforms raw flight data into meaningful business insights using **Data Cleaning, Exploratory Data Analysis, SQL Analysis, Feature Engineering, Model Training, Model Deployment, Power BI Dashboard Development and Website Deployment**.

The final dashboard provides an interactive experience to understand pricing trends and identify factors affecting flight costs.

---

# 🎨 Dashboard Preview

<p align="center">
  <img src="Images/Executive_Overview.png" width="900">
</p>

### Dashboard Features

✨ Interactive airline analysis
✨ Route-wise price comparison
✨ Cheapest & expensive flight insights
✨ Price trend visualization
✨ Source-Destination filtering
✨ Flight duration analysis
✨ Stop-wise pricing behavior

---

# 🧠 Project Architecture

```
                 Raw Flight Dataset
                         |
                         ↓
              Data Cleaning & Processing
                         |
                         ↓
              Exploratory Data Analysis
                         |
                         ↓
              SQL Business Analysis
                         |
                         ↓
              Power BI Data Modeling
                         |
                         ↓
          Interactive Flight Intelligence Dashboard
                         |
                         ↓
                      Website
                         |
                         ↓
                 Website Deployment
```

---

# 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| 🐍 Python | Data Cleaning, EDA & Machine Learning |
| 🐼 Pandas | Data Processing & Feature Engineering |
| 📊 Matplotlib / Seaborn | Exploratory Data Visualization |
| 🧮 Scikit-learn | Model Training & Prediction |
| 🤖 Machine Learning | Flight Price Prediction Model |
| 🗄️ SQL | Data Analysis & Business Queries |
| ⚡ Power BI | Interactive Business Dashboard |
| 🌐 HTML / CSS / JavaScript | Website Development |
| 🚀 Flask / Streamlit | ML Model Deployment |
| 📁 Excel / CSV | Dataset Storage & Management |
| 🔧 Git & GitHub | Version Control & Project Management |

</div>

---

# 📂 Project Structure

```
Flight-Price-Analysis/

│
├── App/
│   ├── frontend
│   └── backend
│   └── flight_app
│
├── Data/
│   ├── Flight_Price.xlsx
│   └── Clean_Flight_Data.csv
│
├── Images/
│   ├── Airline_Analysis.png
│   └── Executive_Overview.png
│   └── Route_Analysis.png
│   └── Website_Overview.png
│
├── Models/
│   └── flight_price_pipeline.pkl
│
├── Python/
│   ├── 01_Data_Preprocessing_EDA.ipynb
│   └── 02_Machine_Learning.ipynb
│   └── 03_Model_Pipeline.ipynb
│
├── SQL/
│   └── Flight_Price_SQL_Queries.sql
│
├── Power BI/
│   └── Flight_Price_Dashboard.pbix
│
└── README.md
└── requirements.txt
```

---

# 🔍 Data Analysis Workflow

## 1️⃣ Data Collection

Collected flight information containing:

* Airline details
* Route information
* Flight timings
* Duration
* Stops
* Ticket prices

---

## 2️⃣ Data Cleaning

Performed:

✔ Missing value handling
✔ Duplicate removal
✔ Data type correction
✔ Feature transformation
✔ Column standardization

---

## 3️⃣ Exploratory Data Analysis

Analyzed:

📌 Average flight price
📌 Airline performance
📌 Popular routes
📌 Price distribution
📌 Journey duration impact
📌 Number of stops effect

---

# 📊 Power BI Dashboard Pages

## ✈️ Page 1: Flight Price Overview

Key Metrics:

* Total Flights
* Average Price
* Minimum Price
* Maximum Price
* Most Active Airline

Visuals:

* KPI Cards
* Airline Distribution
* Price Analysis Charts

---

## 🌍 Page 2: Route Analysis

Insights:

* Most Popular Routes
* Source-Destination Analysis
* Route-wise Pricing Pattern

Filters:

🎛 Source
🎛 Destination
🎛 Route

---

## ⏱ Page 3: Time & Duration Analysis

Analyzes:

* Departure Time Impact
* Arrival Time Pattern
* Flight Duration vs Price

---

# 🤖 Machine Learning Workflow

## 1️⃣ Data Preprocessing

Prepared data for ML by:

✔ Converting duration to minutes
✔ Extracting departure/arrival hour features
✔ One-Hot Encoding of categorical variables (Airline, Source, Destination, Stops, etc.)
✔ Train-Test Split: **80% training / 20% testing**

---

## 2️⃣ Model Training & Results

Three regression models were trained and evaluated on the same dataset:

### 📊 Model Comparison

| Model | MAE | RMSE | R² Score |
|-------|-----|------|----------|
| Linear Regression | ₹1,740.33 | ₹2,577.11 | 0.6817 |
| Decision Tree | ₹988.78 | ₹2,150.57 | 0.7783 |
| **Random Forest** ✅ | **₹903.83** | **₹1,892.43** | **0.8284** |

> **Random Forest** was selected as the final model — it achieved the highest R² Score of **0.8284** and the lowest prediction error of **₹903.83 MAE**, outperforming all other models across every metric.

---

## 3️⃣ Key Feature Importances

The Random Forest model identified the most influential predictors of ticket price:

🔹 **Duration** — longer flights generally cost more
🔹 **Airline** — pricing varies significantly across carriers
🔹 **Total Stops** — non-stop vs connecting flights drive major price differences
🔹 **Destination** — route-specific demand affects pricing
🔹 **Journey Month** — seasonal patterns influence fares

---

## 4️⃣ Model Evaluation

Evaluated using:

📊 MAE (Mean Absolute Error) — average prediction error in ₹
📊 RMSE (Root Mean Squared Error) — penalizes larger errors
📊 R² Score — proportion of price variation explained by the model

---

## 5️⃣ Deployment

The trained Random Forest model was saved as a pipeline (`flight_price_pipeline.pkl`) and integrated into the web application for real-time flight price prediction.

---

# 🌐 Website Development Workflow

## 1️⃣ Frontend Development

Created an interactive UI using:

🎨 HTML
🎨 CSS
⚡ JavaScript

## 2️⃣ Backend Integration

Connected the website with ML model using:

🚀 Flask / Streamlit

## 3️⃣ Prediction System

Workflow:

```
User Input → Web Interface → Random Forest Model → Flight Price Prediction
```

## 4️⃣ Deployment

Deployed the application for real-time user predictions.

---

# 📈 Key Insights

🔹 Airline selection significantly impacts ticket prices.

🔹 Flights with fewer stops generally have higher prices.

🔹 Longer journey duration does not always mean cheaper tickets.

🔹 Popular routes show strong pricing variation.

🔹 Advance booking patterns influence ticket cost.

🔹 Random Forest explains **82.84%** of ticket price variation — demonstrating that pricing is driven by multiple interacting factors, not a single variable.

---

# 🎯 Business Applications

This project can help:

✈️ Airlines optimize pricing strategies
🧳 Travelers find better booking options
📊 Businesses understand market trends
📈 Analysts identify pricing patterns

---

# 📸 Project Gallery

### 📊 Power BI Dashboard

<p align="center">
  <img src="Images/Executive_Overview.png" width="45%">
  <img src="Images/Airline_Analysis.png" width="45%">
</p>

<p align="center">
  <img src="Images/Route_Analysis.png" width="45%">
</p>

## 🌐 Web Application

<p align="center">
  <img src="Images/Website_Overview.png" width="70%">
</p>

---

# 👨‍💻 Author

**Sujal Gupta**
Data Analytics Student | Python • SQL • Power BI • Machine Learning

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/sujal90585)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/sujalgupta0008)

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Your feedback and suggestions are always welcome!

---

<p align="center">
  ✈️ Turning Flight Data into Business Intelligence 🚀
</p>
