import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Universe() {
    const navigate = useNavigate();
    return (
        <div>
            <div className='container mt-5 '>
                <div className='row text-center'>
                    <h1>The Zerodha Universe</h1>
                    <p>Extend your trading and investment experience even further with our partner platforms</p>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/smallcaseLogo.png" className='mb-3'></img>
                        <p className='ext-small text-muted fs-6'>Thematic investment platform</p>
                    </div>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/streakLogo.png" style={{ width: "30%" }} className='mb-3'></img>
                        <p className='ext-small text-muted fs-6'>Algo & strategy platform</p>
                    </div>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/sensibullLogo.svg" style={{ width: "50%" }} className='mb-3'></img>
                        <p className='ext-small text-muted fs-6'>Optios trading platform</p>
                    </div>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/zerodhaFundhouse.png" style={{ width: "40%" }} className='mb-3' ></img>
                        <p className='ext-small text-muted fs-6'>Optios trading platform</p>
                    </div>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/goldenpiLogo.png" className='mb-3'></img>
                        <p className='ext-small text-muted fs-6'>Optios trading platform</p>
                    </div>
                    <div className='col-4 p-3 mt-5'>
                        <img src="media/images/dittoLogo.png" style={{ width: "20%" }} className='mb-3'></img>
                        <p className='ext-small text-muted fs-6'>Optios trading platform</p>
                    </div>

                    <button
                        onClick={() => navigate("/signup")}
                        className="p-2 btn btn-primary fs-5 mb-5"
                        style={{ width: "20%", margin: "0 auto" }}
                    >
                        Signup Now
                    </button>
                </div>
            </div>
        </div>
    )
}
