import React from "react";
import { useNavigate } from "react-router-dom";
export default function Sidebar(){
    const navigate = useNavigate();
    return (
        <div className="sidebar">
        <img className="logo" src="/logo.png" />
        <ul className="menu">

          <li>Profile</li>

          <li onClick={() => {
            navigate('/dashboard')
            window.location.reload()
          }}>Dashboard</li>

          <li onClick={() => {
            navigate('/settings')
          }}>Settings</li>

          <li>Report</li>

          <li>FAQ</li>

          <li className="logout" onClick={() => {
            navigate('/login')
            sessionStorage.clear()
          }}>Logout</li>

          <li className="brand">Investify</li>

        </ul>
      </div>

    )
}