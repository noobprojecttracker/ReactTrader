import React, { useEffect, useState } from "react";
import PortPiece from "./PortPiece";

export default function Portfolio(){
    const userID = sessionStorage.getItem("user_id");
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    const authentication = {userID, username, password}
    const [portfolio, setPortfolio] = useState([]);


    // set initial portfolio state from database
    useEffect(() => {
        const fetchPort = () => fetch('/portfolio', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authentication)
        }).then(
            response => 
            {
                response.json().then(
                thing => {
                    console.log('port is ' + thing)
                    setPortfolio(thing)
                }
            )}
        )
        fetchPort();
        const intervalId = setInterval(fetchPort, 1000);
    
        return () => {
          clearInterval(intervalId);
        };
    }, [])



    if (!(portfolio==='Null')){
        return (
            <div className="cards">
            <div className="firstCard">
              <h1>Portfolio Data</h1>
              <div className="card-info">
                <h3>View all your holdings in one place.</h3>
                <div className="card-body">
                  <table className="portfolio">
                    <tbody>
                      <tr id="purple">
                        <td>Ticker</td>
                        <td>Shares</td>
                        <td>Entry Price</td>
                      </tr>

                    
                    {
                    portfolio.map((piece, index) => {
                        return (
                            <PortPiece data={piece} counter={index}/>
                        )
                    })
                    } 

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
    }
    else{
        return (
            <div className="cards">
            <div className="firstCard">
              <h1>Portfolio Data</h1>
              <div className="card-info">
                <h3>Your portfolio is empty. Start trading to build it up!</h3>
                <div className="card-body">
                  <table className="portfolio">
                    <tbody>
                      <tr id="purple">
                        <td>Ticker</td>
                        <td>Shares</td>
                        <td>Entry Price</td>
                      </tr>

                      <tr id="other">
                        <td>Your</td>
                        <td>Portfolio</td>
                        <td>Is</td>
                      </tr>

                      <tr id="one">
                        <td>Empty</td>
                        <td>Begin</td>
                        <td>Trading</td>
                      </tr>

                      <tr id="other">
                        <td>To</td>
                        <td>Fill</td>
                        <td>It!</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
    }



}