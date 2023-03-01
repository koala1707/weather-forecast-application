import './App.css';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, TableContainer, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { Paper, Table } from '@mui/material'
import json from './db.json'


// Data which is fetched from API is formated such as [Date, Temperature]
function collectData(weatherData) {
  var restoreData = []
  var i = 0
  for(var index in weatherData){
    let date = weatherData[index]["dt_txt"].split(" ")[0]
    let temp = weatherData[index]["main"]["temp"]
    if(index == 0){
      restoreData.push([date, temp])
    }
    else if(restoreData[i][0] == date){
      restoreData[i].push(temp)
    }
    else{
      restoreData.push([date, temp])
      i += 1
    }
  }
  var allWeatherData = calculateAverageTemperature(restoreData)
  return allWeatherData;
}

// Calculate the average temperature and restore the data into useState.
function calculateAverageTemperature(data) {
  var aveTempList = [];
  for(var key in data) {
    let temparatures = data[key].slice(1)
    let sumTemperature = temparatures.reduce((a, b) => (a + b))
    let averageTemperature = sumTemperature / temparatures.length
    let calculateFahrenheit = (averageTemperature * 1.8) + 32
    aveTempList.push({date: data[key][0], cel: averageTemperature.toFixed(2), fah: calculateFahrenheit.toFixed(2)})
  }
  return aveTempList
}


function App() {
  const [location, setLocation] = useState('');
  const [fahrenheit, setFahrenheit] = useState(false);
  const [mapList, setMapList] = useState([])
  const [search, setSearch] = useState(false)

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const API_KEY = 'c2b5525f2a4aac7825c56f17fa158fe0'

  const [error, setError] = useState('');
  
  const searchNewWeather = () => {
    setSearch(true)
  }

  const checkedFahrenheit = () => {
    setFahrenheit(!fahrenheit);
  }

  useEffect(() => {
    setSearch(false)
  },[location])

  // To get the current position 
  // refer to this website to find the current location: https://www.pluralsight.com/guides/how-to-use-geolocation-call-in-reactjs
  useEffect(() => {
    // Search a location
    if(search){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`)
      .then((res) => res.json()
      .then((geo) => {
        // console.log("geo", geo)
        setLatitude(geo.coord.lat)
        setLongitude(geo.coord.lon)
      }))
    }
    // Current Location
    else{
      navigator.geolocation.getCurrentPosition(function(currentLocation){
        setLatitude(currentLocation.coords.latitude);
        setLongitude(currentLocation.coords.longitude);
      });
    }
  },[latitude, longitude, search]);

  useEffect(() => {
    if(latitude && longitude != null){
      console.log("latitude: ", latitude);
      console.log("longitude: ", longitude);
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      .then(response => {
        if(!response.ok){
          throw Error(`Cannot fetch data from API. Error(${response.status})`)
        }
        return response.json()
      })
      .then(weatherResult => {
        let collectedData = collectData(weatherResult['list'])
        setMapList(collectedData)
      })
      .catch (error => {
        setError(error.message)
      })
    }
  },[latitude, longitude])

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
        <h3 className='location'>{search ? 'Searched Location' : 'Current Location'}</h3>
        <div>
          {error && <div className='payment-error'>{ error }</div>}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300}} aria-label="test">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Temperature</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mapList.map((d, i) => {
                  console.log("d", d)
                  return(
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">{d.date}</TableCell>
                      <TableCell>{fahrenheit ? `${d.fah}F` : `${d.cel}C`}</TableCell>
                    </TableRow>          
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export { collectData, calculateAverageTemperature }
export default App;
