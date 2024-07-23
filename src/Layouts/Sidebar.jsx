import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";


function Sidebar(props) {
  const { isLoggedIn } = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (isLoggedIn !== null && user !== null) {
    // user_permissions=user.permissions.data.map((item)=>{
    //     return item.name;
    // })
  }

  return (
    <>
      <div>
        <strong className="logo">
          <img src={logo} alt="Logo" />
        </strong>
        <div className="nav flex-column">
          <ul className="nav nav-pills flex-column" id="menu">
            <li>
              <NavLink
                exact
                to="/"
                activeClassName="is-active"
                className="nav-link px-0 align-middle mb-1"
              >
                <i className="fa fa-dashboard"></i>{" "}
                <span className="d-none d-md-inline">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/forms"
                activeClassName="is-active"
                className="nav-link px-0 align-middle mb-1"
              >
                <i className="fa fa-list-alt"></i>{" "}
                <span className="d-none d-md-inline">Formularios</span>
              </NavLink>
            </li>
            {user.roleId === 1 && (
              <>
                <li>
                  <NavLink
                    to="/users"
                    activeClassName="is-active"
                    className="nav-link px-0 align-middle mb-1"
                  >
                    <i className="fa fa-user"></i>{" "}
                    <span className="d-none d-md-inline">Usuarios</span>
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to="/logs"
                activeClassName="is-active"
                className="nav-link px-0 align-middle mb-1"
              >
                <i className="fa fa-book"></i>{" "}
                <span className="d-none d-md-inline">Bitacoras</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/location"
                activeClassName="is-active"
                className="nav-link px-0 align-middle mb-1"
              >
                <i className="fa fa-map-marker"></i>{" "}
                <span className="d-none d-md-inline">Ubicaciones</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
