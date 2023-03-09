import React, { useState, useEffect } from 'react';


function Error(props) {
    const error = props.error

    return(
        <>
            {error && <div className='payment-error'>{ error }</div>}
        </>
    )
}

export default Error