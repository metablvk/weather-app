import {ChangeEvent, KeyboardEvent, useState} from 'react';
import './App.css';
import {Res} from './types';
import axios from 'axios';

const App = () => {
  const [forecast, setForecast] = useState<Res | null>(null);
  const [city, setCity] = useState('');

  const handleChange = (e: ChangeEvent) => {
    const {value} = e.target as HTMLInputElement;
    setCity(value);
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${
          import.meta.env.VITE_OW_API_KEY
        }`
      );
      const {data: geo} = await res;
      if (geo) {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${
            geo[0].lat
          }&lon=${geo[0].lon}&appid=${import.meta.env.VITE_OW_API_KEY}`
        );
        const {data: forecast} = await res;
        console.log(forecast);
        setForecast(forecast);
      }
    }
  };

  const convKToC = (k: number) => Math.floor(k - 273.15);
  return (
    <div className="bg-blue-600 h-screen p-8 grid grid-cols-12 gap-2">
      <div className="col-span-12 md:col-span-6 md:col-start-3 lg:col-span-4 lg:col-start-5">
        <h1 className="text-3xl mb-4 font-semibold text-white">Weather App</h1>
        <input
          className="w-full p-2 text-white border-b bg-transparent border-white focus:outline-none"
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          defaultValue={city}
          placeholder="Search your city"
        />
        <div className="temp font-bold text-6xl mt-4 flex justify-between items-center">
          <p className="text-white">
            {forecast ? `${convKToC(forecast.main.temp)}°C` : '0°C'}
          </p>
          {forecast && (
            <img
              src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
              alt={`An image of ${forecast.weather[0].description}`}
            />
          )}
        </div>
        <div className="desc mt-8">
          <h2 className="text-white">Weather Forecast</h2>
          <p className="text-white font-medium text-2xl">
            {forecast && forecast.weather[0].description}
          </p>
        </div>
        <div className="city mt-4">
          <p className="text-white">{forecast && forecast.name}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
