import React from "react";
import { useEffect, useState } from "react";
import OrderComponent from "./OrderDataPiece";

export default function PortfolioData(){
        const userID = sessionStorage.getItem("user_id");
        const username = sessionStorage.getItem("username");
        const password = sessionStorage.getItem("password");
        const authentication = {userID, username, password}
        const [orders, setOrders] = useState([]);


        useEffect(() => {
            const fetchOrders = () => {
              fetch('/orderhistory', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(authentication),
              })
                .then((response) => response.json())
                .then((thing) => {
                  setOrders(thing);
                });
            };
        
            fetchOrders();
            const intervalId = setInterval(fetchOrders, 1000);
        
            return () => {
              clearInterval(intervalId);
            };
          }, []);


    if (!(orders==='Null')){
        return (
            <div className="cards" id="some">
      <div className="firstCard">
        <h1>Order history</h1>
        <div className="card-info">
          <h3>View all your order history, sorted.</h3>
          <div className="card-body">
            <table className="portfolio">
              <tbody>
                <tr id="purple">
                  <td>Type</td>
                  <td>Ticker</td>
                  <td>Price</td>
                  <td>Shares</td>
                  <td>Value</td>
                  <td>Date</td>
                </tr>
                
                {
                orders.map((piece, index) => {
                        return (
                            <OrderComponent orderData={piece} counter={index}/>
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
    return (
        <div className="cards" id="some">
        <div className="firstCard">
          <h1>Order history</h1>
          <div className="card-info">
            <h3>You have no order history.</h3>
            <div className="card-body">
              <table className="portfolio">
                <tbody>
                  <tr id="purple">
                    <td>Type</td>
                    <td>Ticker</td>
                    <td>Price</td>
                    <td>Shares</td>
                    <td>Value</td>
                    <td>Date</td>
                  </tr>
                  
  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}