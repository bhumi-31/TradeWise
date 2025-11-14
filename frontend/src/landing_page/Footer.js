import React from 'react';

function Footer() {
    return (
        <div style={{ backgroundColor: "#f2f2f2", width: "100%" }}>
            <div className='container border-top mt-5' >
                <div className='row mt-5'>
                    <div className='col'>
                        <img src="media/images/logo.jpeg" style={{ width: "50%" }}></img>
                        <p>&copy; 2010 - 2025, TradeWise Broking Ltd.All rights reserved.</p>
                    </div>
                    <div className='col'>
                        <p>Company</p>
                        <a href="" className='footer-link'>About</a>
                        <a href="" className='footer-link'>Products</a>
                        <a href="" className='footer-link'>Pricing</a>
                        <a href="" className='footer-link'>Referral Programme</a>
                        <a href="" className='footer-link'>Careers</a>
                        <a href="" className='footer-link'>TradeWise.tech</a>
                        <a href="" className='footer-link'>Press & media</a>
                        <a href="" className='footer-link'>TradeWise cares (CSR)</a>
                    </div>

                    <div className='col'>
                        <p>Support</p>
                        <a href="" className='footer-link'>Contact</a><br></br>
                        <a href="" className='footer-link'>Support Portal</a><br></br>
                        <a href="" className='footer-link'>Z-connect blog</a><br></br>
                        <a href="" className='footer-link'>List of charges</a><br></br>
                        <a href="" className='footer-link'>Downloads & resources</a><br></br>
                    </div>
                    <div className='col'>
                        <p>Account</p>
                        <a href="" className='footer-link'>Open an account</a><br></br>
                        <a href="" className='footer-link'>Fund transfer</a><br></br>
                        <a href="" className='footer-link'>60 day challenge</a><br></br>
                    </div>
                </div>
                <div className='mt-5 text-muted' style={{ fontSize: "14px" }}>
                    <p>TradeWise Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration no.: INZ000031633 CDSL/NSDL: Depository services through TradeWise Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Registered Address: TradeWise Broking Ltd., #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any complaints pertaining to securities broking please write to complaints@tradewise.com, for DP related to dp@tradewise.com. Please ensure you carefully read the Risk Disclosure Document as prescribed by SEBI | ICF</p>
                    <p>Procedure to file a complaint on SEBI SCORES: Register on SCORES portal. Mandatory details for filing complaints on SCORES: Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective Communication, Speedy redressal of the grievances</p>
                    <p>Smart Online Dispute Resolution | Grievances Redressal Mechanism</p>
                    <p>Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>
                    <p>Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.</p>
                    <p>India's largest broker based on networth as per NSE. NSE broker factsheet</p>
                    <p>"Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of TradeWise and offering such services, please create a ticket here.</p>
                </div>
            <div className='row p-3 footer-bottom text-center'>
                <div className='col'><a href="">NSE</a></div>
                <div className='col'><a href="">BSE</a></div>
                <div className='col'><a href="">MCX</a></div>
                <div className='col'><a href="">Terms & Conditions</a></div>
                <div className='col'><a href="">Policies & Procedures</a></div>
                <div className='col'><a href="">Privacy Policy</a></div>
                <div className='col'><a href="">Disclosure</a></div>
                <div className='col'><a href="">For Investor's Attention</a></div>
                <div className='col'><a href="">Investor Charter</a></div>
            </div>
            </div>

        </div>
    );
}

export default Footer;