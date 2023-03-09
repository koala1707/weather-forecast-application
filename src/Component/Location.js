import SearchLocation from "./SearchLocation"
import Error from "./Error"
import React, { useState, useEffect } from 'react';
import Weather from './Weather'

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


function Location() {
    const [location, setLocation] = useState('');
    const [search, setSearch] = useState(false)

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [error, setError] = useState('');

    const [mapList, setMapList] = useState([])

    const API_KEY = 'c2b5525f2a4aac7825c56f17fa158fe0'

    const locationName = (input) => {
        setLocation(input.target.value)
    }

    const searchNewWeather = () => {
        setSearch(true)
    }

    useEffect(() => {
        setSearch(false)
    },[location])

    useEffect(() => {
        setSearch(false)
    },[location])

    // To get the current position 
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

    return(
        <>
            <SearchLocation 
                locationName={locationName} 
                location={location}
                searchNewWeather={searchNewWeather}
            />
            <Error
                error={error}
            />
            <Weather 
                search={search}
                mapList={mapList}
            />
        </>
    )
}

export default Location