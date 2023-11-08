import React from "react";
import { useEffect, useState } from "react";

export default function CashOnHand({setCash, cash}){
    const userID = sessionStorage.getItem("user_id");

    useEffect(() => {
        const timer = setInterval(() => {
            fetch('/cash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID})
            }).then(response => response.json().then(
                thing => {setCash(thing)}
            ))
        }, 2000)
        return () => clearInterval(timer)
    })

    return (
        <div className="box">
        <div className="title">Cash On Hand</div>
        <div className="some-info" id="money">${cash}</div>
        <div className="some-image">
          <img />
        </div>
      </div>
    )
}