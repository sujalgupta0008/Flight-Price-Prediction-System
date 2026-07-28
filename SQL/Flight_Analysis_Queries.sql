-- ============================================================
-- FLIGHT PRICE ANALYSIS - SQL QUERIES
-- Database: FlightPriceDB | Table: flights
-- ============================================================

USE FlightPriceDB;

-- ============================================================
-- SECTION A: BASIC QUERIES (1-10)
-- ============================================================

-- Q1. Display all records
SELECT * FROM flights;

-- Q2. Select specific columns
SELECT Airline, Source, Destination, Price FROM flights;

-- Q3. Count total flights
SELECT COUNT(*) AS Total_Flights FROM flights;

-- Q4. List distinct airlines
SELECT DISTINCT Airline FROM flights;

-- Q5. List distinct source cities
SELECT DISTINCT Source FROM flights;

-- Q6. List distinct destination cities
SELECT DISTINCT Destination FROM flights;

-- Q7. Find minimum ticket price
SELECT MIN(Price) AS Min_Price FROM flights;

-- Q8. Find maximum ticket price
SELECT MAX(Price) AS Max_Price FROM flights;

-- Q9. Find average ticket price
SELECT ROUND(AVG(Price), 2) AS Avg_Price FROM flights;

-- Q10. Count flights for each airline
SELECT Airline, COUNT(*) AS Total_Flights
FROM flights
GROUP BY Airline
ORDER BY Total_Flights DESC;


-- ============================================================
-- SECTION B: INTERMEDIATE QUERIES (11-20)
-- ============================================================

-- Q11. Average price by airline
SELECT Airline, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Airline
ORDER BY Avg_Price DESC;

-- Q12. Average price by source
SELECT Source, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Source
ORDER BY Avg_Price DESC;

-- Q13. Average price by destination
SELECT Destination, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Destination
ORDER BY Avg_Price DESC;

-- Q14. Average price by number of stops
SELECT Total_Stops, ROUND(AVG(Price), 2) AS Avg_Price, COUNT(*) AS Total_Flights
FROM flights
GROUP BY Total_Stops
ORDER BY Avg_Price DESC;

-- Q15. Average duration by airline
SELECT Airline, Duration, COUNT(*) AS Flights
FROM flights
GROUP BY Airline, Duration
ORDER BY Airline;

-- Q16. Number of flights by month
SELECT Journey_Month, COUNT(*) AS Total_Flights
FROM flights
GROUP BY Journey_Month
ORDER BY Total_Flights DESC;

-- Q17. Number of flights by route
SELECT Route, COUNT(*) AS Total_Flights
FROM flights
GROUP BY Route
ORDER BY Total_Flights DESC;

-- Q18. Most expensive route
SELECT TOP 1 Route, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Route
ORDER BY Avg_Price DESC;

-- Q19. Cheapest airline
SELECT TOP 1 Airline, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Airline
ORDER BY Avg_Price ASC;

-- Q20. Top 5 most expensive airlines
SELECT TOP 5 Airline, ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Airline
ORDER BY Avg_Price DESC;


-- ============================================================
-- SECTION C: ADVANCED QUERIES (21-30)
-- ============================================================

-- Q21. Rank airlines by average price
SELECT Airline,
       ROUND(AVG(Price), 2) AS Avg_Price,
       RANK() OVER (ORDER BY AVG(Price) DESC) AS Price_Rank
FROM flights
GROUP BY Airline;

-- Q22. Top 10 expensive routes
SELECT TOP 10 Route,
       ROUND(AVG(Price), 2) AS Avg_Price,
       COUNT(*) AS Total_Flights
FROM flights
GROUP BY Route
ORDER BY Avg_Price DESC;

-- Q23. Average price by airline and stops
SELECT Airline, Total_Stops,
       ROUND(AVG(Price), 2) AS Avg_Price,
       COUNT(*) AS Total_Flights
FROM flights
GROUP BY Airline, Total_Stops
ORDER BY Airline, Avg_Price DESC;

-- Q24. Average price by month and airline
SELECT Journey_Month, Airline,
       ROUND(AVG(Price), 2) AS Avg_Price
FROM flights
GROUP BY Journey_Month, Airline
ORDER BY Journey_Month, Avg_Price DESC;

-- Q25. Most common route for each airline
WITH RouteCount AS (
    SELECT Airline, Route, COUNT(*) AS Total,
           RANK() OVER (PARTITION BY Airline ORDER BY COUNT(*) DESC) AS rnk
    FROM flights
    GROUP BY Airline, Route
)
SELECT Airline, Route, Total
FROM RouteCount
WHERE rnk = 1;

-- Q26. Airlines operating highest number of non-stop flights
SELECT Airline, COUNT(*) AS NonStop_Flights
FROM flights
WHERE Total_Stops = 'non-stop'
GROUP BY Airline
ORDER BY NonStop_Flights DESC;

-- Q27. Weekday vs Weekend average price
SELECT Journey_Day,
       CASE 
           WHEN Journey_Day IN ('Saturday', 'Sunday') THEN 'Weekend'
           ELSE 'Weekday'
       END AS Day_Type,
       ROUND(AVG(Price), 2) AS Avg_Price,
       COUNT(*) AS Total_Flights
FROM flights
GROUP BY Journey_Day,
         CASE 
             WHEN Journey_Day IN ('Saturday', 'Sunday') THEN 'Weekend'
             ELSE 'Weekday'
         END
ORDER BY Day_Type, Avg_Price DESC;

-- Q28. Flights above overall average price
SELECT Airline, Source, Destination, Price
FROM flights
WHERE Price > (SELECT AVG(Price) FROM flights)
ORDER BY Price DESC;

-- Q29. Highest-priced flight for each airline
SELECT Airline, MAX(Price) AS Max_Price
FROM flights
GROUP BY Airline
ORDER BY Max_Price DESC;

-- Q30. Monthly average price trend
SELECT Journey_Month,
       ROUND(AVG(Price), 2) AS Avg_Price,
       COUNT(*) AS Total_Flights
FROM flights
GROUP BY Journey_Month
ORDER BY Avg_Price DESC;