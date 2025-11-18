import React from 'react';

function Team() {
    return (
        <div className='container'>

            <div className='row p-3 mt-5 mb-5 border-top'>
                <h1 className='text-center'>People</h1>
            </div>
            <div className='row p-3 text-muted' style={{ lineHeight: "1.8", fontSize: "1.2em" }}>
                <div className='col-6 p-3 text-center'>
                    <img src="media/images/Bhumika.jpg" style={{ borderRadius: "100%", width: "60%" }}></img>
                    <h4 className='mt-5'>Bhumika Narula</h4>
                    <h6>Full Stack Developer</h6>
                </div>
                <div className='col-6 p-3 mt-5'>
                    <p>Hey! I'm Bhumika Narula

                        <p>I'm a Full Stack Developer who loves turning ideas into reality
                        through code. I built this website as part of my journey to
                        becoming a better developer.</p>

                        <p><b>What I Do:</b></p>
                        I create modern, user-friendly websites using the MERN stack
                        (MongoDB, Express, React, Node.js). From concept to deployment,
                        I handle the complete development process.

                        <p><b>My Journey:</b></p>
                        Started coding in 2023, fell in love with web development,
                        and haven't looked back since. Each project teaches me something
                        new, and this one was no exception!

                        <p><b>Beyond Code:</b></p>
                        When I'm not debugging, you'll find me reading tech
                        blogs, watching tech talks, playing games, etc.

                        <p>Always excited to collaborate on interesting projects!.</p>
                        </p>


                    <p>Connect on <a href="https://www.linkedin.com/in/bhumika31/" style={{ textDecoration: "none" }}>LinkedIn</a> / <a href="https://x.com/BhumikaNarulaa" style={{ textDecoration: "none" }}>Twitter</a></p>
                </div>
            </div>
        </div>
    );
}

export default Team;