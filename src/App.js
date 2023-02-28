import './App.css';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox } from '@material-ui/core';

function App() {

  const [location, setLocation] = useState('');
  const [fahrenheit, setFahrenheit] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const searchNewWeather = (event) => {

  }

  const checkedFahrenheit = (event) => {
    setFahrenheit(!fahrenheit);
  }

    // To get the current position 
  // refer to this website: https://www.pluralsight.com/guides/how-to-use-geolocation-call-in-reactjs
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(currentLocation){
      setLatitude(currentLocation.coords.latitude);
      setLongitude(currentLocation.coords.longitude);
    });
    console.log("latitude: ", latitude);
    console.log("longitude: ", longitude);
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
        <p>LOCATION</p>
      </div>
    </div>
  );
}

export default App;
