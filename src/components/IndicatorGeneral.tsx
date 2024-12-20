import React from "react";
import DataGeneral from "../interface/DataGeneral"; // Importar la interfaz


const WeatherIndicators: React.FC<DataGeneral> = ({
  city,
  date,
  temperature,
  minTemperature,
  description,
  imagen,
  feelsLike,
}) => {
  return (
    <div className="weather-indicators">
      <div className="weather-header">
        <span className="weather-location">📍 {city}</span>
      </div>
      <div className="weather-details">
        <div className="weather-date">
          <h1>{date.split(",")[0]}</h1>
          <p>{date.split(",")[1]}</p>
        </div>
        <div className="weather-icon">
          <img src={imagen} alt="weather-icon" />
        </div>
        <div className="weather-info">
          <h1>{temperature}°C</h1>
          <p>/{minTemperature}°C</p>
          <p>{description}</p>
          <p>Sensación térmica {feelsLike}°</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherIndicators;

