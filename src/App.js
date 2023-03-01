import './App.css';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox } from '@material-ui/core';
import json from './db.json'

var restoreData = [];
var aveTempList = [];


// Data which is fetched from API is formated such as [Date, Temperature]
function collectData(weatherData) {
  var i = 0
  for(var index in weatherData){
    let date = weatherData[index]["time"].split("T")[0]
    if(index == 0){
      restoreData.push([date,weatherData[index]["airTemperature"]["noaa"]])
    }
    else if(restoreData[i][0] == date){
      restoreData[i].push(weatherData[index]["airTemperature"]["noaa"])
    }
    else{
      restoreData.push([date, weatherData[index]["airTemperature"]["noaa"]])
      i += 1
    }
  }
  return restoreData;
}

// Calculate the average temperature and restore the data into useState.
function calculateAverageTemperature(data) {
  for(var key in data) {
    // console.log("res",data[key][1])
    let temparatures = data[key].slice(1)
    let sumTemperature = temparatures.reduce((a, b) => (a + b))
    let averageTemperature = sumTemperature / temparatures.length
    let calculateFahrenheit = (averageTemperature * 1.8) + 32
    aveTempList.push([restoreData[key][0],averageTemperature.toFixed(2), calculateFahrenheit.toFixed(2)])
  }
  return aveTempList
}


function App() {
  const [location, setLocation] = useState('');
  const [fahrenheit, setFahrenheit] = useState(false);
  const [weatherList, setWeatherList] = useState([])
  const [mapList, setMapList] = useState([])
  const [search, setSearch] = useState(false)

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const params = 'waveHeight,airTemperature';

  const GEO_API = 'c2b5525f2a4aac7825c56f17fa158fe0'

  const [error, setError] = useState('');
  
  const searchNewWeather = (event) => {
    setSearch(true)
  }

  const checkedFahrenheit = (event) => {
    setFahrenheit(!fahrenheit);
  }

  useEffect(() => {
    setSearch(false)
  },[location])

  // To get the current position 
  // refer to this website to find the current location: https://www.pluralsight.com/guides/how-to-use-geolocation-call-in-reactjs
  useEffect(() => {
    if(search){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${GEO_API}`)
      .then((res) => res.json()
      .then((geo) => {
        setLatitude(geo.coord.lat)
        setLongitude(geo.coord.lon)
      }))
    }
    else{
      navigator.geolocation.getCurrentPosition(function(currentLocation){
        setLatitude(currentLocation.coords.latitude);
        setLongitude(currentLocation.coords.longitude);
      });
      
    }
    console.log("latitude: ", latitude);
    console.log("longitude: ", longitude);
      
    if(latitude && longitude != null){
      fetch(`https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${params}`, {
      headers: {
        'Authorization': '5c1f56e4-b685-11ed-bce5-0242ac130002-5c1f5856-b685-11ed-bce5-0242ac130002'
      }
    })
    .then(response => {
      if(!response.ok){
        if(response.status == 402){
          throw Error('API runs over 5 times. Need to pay.')
        }
        else{
          throw Error(`Error ${response.status}. Couldn't fetch data.`)
        }
      }
      return response.json()
    })
    .then(weatherResult => {
      setWeatherList(weatherResult["hours"])
      let collectedData = collectData(weatherList)
      // Problem: First a couple of days are broken down into 24 hours not just a day.
      // Solution: Restore data to calculate the average temparature. 
      let allData = calculateAverageTemperature(collectedData)
      allData.map((data, index) => {
        setMapList(mapList => mapList.concat({date: data[0], cdegree: data[1], fdegree: data[2]}));
      })
    })
    .catch (error => {
      setError(error.message)
      // console.log(error.message);
    })
    console.log("weather", weatherList)
    console.log("map",mapList)
    }
    
    
  },[latitude, longitude, search])

  return (
    <div>
      <h1 className='app-title'>Weather App</h1>
      <div className='search-location'>
      <TextField id='outlined-basic' label='Location' variant='outlined' value={location} onChange={(e) => setLocation(e.target.value)}/>
      <Button className='submit-button' variant='contained' color='secondary' onClick={searchNewWeather}>Submit</Button>
      </div>
      
      <div className='weather-container'>
        <div className='fahrenheit'>
          <label>Fahrenheit</label>
          <Checkbox checked={fahrenheit} onChange={checkedFahrenheit} label='Fahrenheit'></Checkbox>
        </div>
        <h2>Weather Forecast</h2>
        <div>
          {error && <div className='payment-error'>{ error }</div>}
        {mapList.slice(0,7).map((d, i) => {
          return(
          <div key={i}>
            <li>Date</li>
            <p>{d.date}</p>
            <li>Temperature</li>
            <p>{fahrenheit ? `${d.fdegree}F` : `${d.cdegree}C` }</p>
          </div>
          )})}
        </div>
      </div>
    </div>
  );
}

export default App;
