import React from "react";
import { useState, useEffect } from "react";

export default function TotalPortValue({totalValue, setTotalValue}){
    const userID = sessionStorage.getItem("user_id");
    const [PNL, setPNL] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            fetch('/portvalue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID})
            }).then(response => response.json().then(
                thing => {setTotalValue(thing)}
            ))
        }, 2000)
        return () => clearInterval(timer)
    })

    let id = ""
    if (PNL >= 0){
        id = 'money'
    }
    else{
        id = 'loss'
    }
    return (
        <div className="box" id="other">
        <div className="title">Total Portfolio Value</div>
        <div className="some-info" id={id}>${totalValue}</div>
        <div className="some-image">
          <img />
        </div>
      </div>
    )
}