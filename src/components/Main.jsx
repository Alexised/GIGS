import React from 'react';
import Sidebar from "../Layouts/Sidebar.jsx";
import Navbar from "../Layouts/Navbar.jsx";


function Main(props) {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="row flex-nowrap">
                    {user.roleId !== 2 && (
                        <div className="col-2 col-md-2 col-lg-2 d-md-block bg-sidebar">
                            <Sidebar />
                        </div>
                    )}
                    <div className="col-10 col-md-10 col-lg-10 py-3 main-part">
                        {props.component}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;