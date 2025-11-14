import React from 'react';

function RightSection({productName, productDescription, learnMore, imageURL}) {
    return ( 
        <div className='container my-5 '>
            <div className='row align-items-center'>
                <div className='col-6 mt-5 p-5'>
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <a href={learnMore} style = {{ textDecoration : "none"}}>{learnMore}<i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div className='col-6'>
                    <img src={imageURL} ></img>
                </div>
            </div>
        </div>
     );
}

export default RightSection;