import React from 'react';

function Hero() {
    return ( 
        <div className='container-fluid' id = "supportHero" >
            <div className='p-5 ' id = "supportWrapper">
                <h4>Support Portal</h4>
                <a href = "">Track Tickets</a>
            </div>
            <div className='row p-5 m-3'>
                <div className='col-6 p-5'>
                    <h1 className='fs-3'>Search for an answer or browser help topics to create a ticket</h1>
                    <input placeholder='Eg. how do I activate F&O, why is my order getting rejected..'/><br/>
                    <a href = "">Track account opening</a>
                    <a href = "">Track segment activation</a>
                    <a href = "">Intraday margins</a>
                    <a href = "">Kite user manual</a>
                </div>
                <div className='col-6 p-5'>
                    <h4>Featured</h4>
                    <ol>
                        <li><a href = "">Current Takeovers and Delisting - January2024</a></li>
                        <li><a href = "">Latest Intraday levarages - MIS & CO</a></li>
                    </ol>
                    
                </div>
            </div>
        </div>
     );
}

export default Hero;