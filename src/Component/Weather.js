import Error from './Error'
import { Checkbox, TableContainer, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { Paper, Table } from '@mui/material'
import React, { useState } from 'react';

function Weather(props) {
    const [fahrenheit, setFahrenheit] = useState(false);

    const search = props.search
    const mapList = props.mapList

    const checkedFahrenheit = () => {
        setFahrenheit(!fahrenheit);
    }

    return(
        <div className='weather-container'>
            <div className='fahrenheit'>
            <label>Fahrenheit</label>
            <Checkbox checked={fahrenheit} onChange={checkedFahrenheit} label='Fahrenheit'></Checkbox>
            </div>
            <h2>Weather Forecast</h2>
            <h3 className='location'>{search ? 'Searched Location' : 'Current Location'}</h3>
            <div>
            <Error/>
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
    )
}

export default Weather