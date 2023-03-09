import '../App.css'
import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import App from '../App'

function SearchLocation(props){
    // const [location, setLocation] = useState('');
    // const [search, setSearch] = useState(false)
    const location = props.location
    const locationName = props.locationName
    const searchNewWeather = props.searchNewWeather

    // const searchNewWeather = () => {
    //     setSearch(true)
    // }

    


    return (
        <div className='search-location'>
            <TextField id='outlined-basic' label='Location' variant='outlined' value={location} onChange={locationName}/>
            {/* <Button className='submit-button' variant='contained' color='secondary' onClick={searchNewWeather}>Submit</Button> */}
            <button className='submit-button' onClick={searchNewWeather}>Submit</button>
        </div>
    )
}

export default SearchLocation