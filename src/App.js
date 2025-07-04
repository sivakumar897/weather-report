import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

 const getWeather = async (loc) => {
  setLoading(true);
  try {
    const geoRes = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${loc}&limit=1&appid=${API_KEY}`
    );

    if (geoRes.data.length === 0) {
      alert('City not found!');
      return;
    }

    const { lat, lon, name, country } = geoRes.data[0];
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    setForecast(weatherRes.data.list.filter((_, idx) => idx % 8 === 0));
    setCity(`${name}, ${country}`);
  } catch (error) {
    alert('Something went wrong!');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      setForecast(res.data.list.filter((_, idx) => idx % 8 === 0));
      setCity(res.data.city.name);
    });
  }, []);

  return (
    <div className="app">
      <h1>5-Day Weather Forecast</h1>
      <div className="search-box">
  <input
    type="text"
    placeholder="Enter city"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
  />
  <button onClick={() => getWeather(location)}>Search</button>
</div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>{city}</h2>
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="weather-card">
                <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="weather icon"
                />
                <p>{day.weather[0].description}</p>
                <p>{day.main.temp}°C</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
