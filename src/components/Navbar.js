import React, { useEffect } from "react";
import { useState } from "react";

export default function Navbar(){
    const username = sessionStorage.getItem('username').charAt(0).toUpperCase() + sessionStorage.getItem('username').slice(1)

    const [name, setName] = useState('Logged out')
    const isLogged = sessionStorage.getItem("username")
    useEffect(() => {
        if (isLogged)
        setName('Welcome back')
    }, [])



    return (
        <div className="top">
        <div className="top-bar">
          <h2>{username}'s Primary Dashboard</h2>
          <img className="pfp" src="/pfp.png" />
        </div>
      </div>

    )



}