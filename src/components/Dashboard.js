// import React, {useState, useEffect} from 'react'
// import { Navigate } from 'react-router-dom';

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import OrderData from "./OrderDataComponent";
import Portfolio from "./Portfolio";
import PortChart from "./StockChart";
import PlaceOrder from "./PlaceOrder";
import PortfolioValue from "./PortfolioValue";
import MarketTime from "./MarketTime";
import MarketStatus from "./MarketStatus";
import Sidebar from "./Sidebar";
import CashOnHand from "./CashOnHand";
import TotalPNL from "./TotalPNL";
import FirstCard from "./FirstCard";
import TotalPortValue from "./TotalPortValue";

export default function MainScreen(){
    const userID = sessionStorage.getItem("user_id");
    const username = sessionStorage.getItem("username");
    const password = sessionStorage.getItem("password");
    const authentication = {userID, username, password}

    const [port, setPort] = useState(null);
    const [orders, setOrders] = useState(null);
    const [theTicker, setTheTicker] = useState('N/A')
    const [tickerPrice, setTickerPrice] = useState(0)
    const [cash, setCash] = useState(0)
    const [totalValue, setTotalValue] = useState(0)



    return (

        <div className="container">

<>
        <Sidebar />
    <div className="main">
        <Navbar />

        <div className="overall">
            
            <CashOnHand setCash={setCash} cash={cash}/>
            <TotalPNL />
            <TotalPortValue totalValue={totalValue} setTotalValue={setTotalValue}/>
            <MarketStatus />

        </div>

        <div className="splitData">
            <Portfolio />
            <OrderData />
        </div>

        <div className="splitData">
            <PortChart theTicker={theTicker} tickerPrice={tickerPrice}/>
            <PlaceOrder setTheTicker={setTheTicker} theTicker={theTicker} setTickerPrice={setTickerPrice}/>
        </div>


  </div>
</>


            {/* <Sidebar />
            <Navbar />
            
            <div className="overall">
                <CashOnHand />
                <TotalPNL />
                <MarketStatus />
            </div> */}
        
        </div>


            

        // <div>
        //     <Navbar />
        //     <div className="dataBox">
        //         <PortfolioValue />
        //         <MarketTime />
        //         <MarketStatus />
        //         <Portfolio />
        //         <OrderData />
        //         <PlaceOrder setTheTicker={setTheTicker}/>
        //         <PortChart theTicker={theTicker}/>
        //     </div>
        // </div>

    )
}
