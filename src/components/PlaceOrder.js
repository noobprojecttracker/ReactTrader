import React from "react";
import { useEffect, useState } from "react";
import PortChart from "./StockChart";
import StockChart from "./StockChart";

export default function PlaceOrder({setTheTicker, setTickerPrice}){
    const [buyOrder, setBuyOrder] = useState(false)
    const [sellOrder, setSellOrder] = useState(false)
    const [buyColor, setBuyColor] = useState('white')
    const [sellColor, setSellColor] = useState('white')
    const [ticker, setTicker] = useState('Ticker')
    const [shares, setShares] = useState('Shares')
    const [cost, setCost] = useState(0)
    const [type, setType] = useState()
    const [insufficient, setInsufficient] = useState(false)
    const [enough, setEnough] = useState(false)
    const userID = sessionStorage.getItem("user_id");

    function handleSubmit(e){
        if (e.target.innerHTML === 'Buy'){
            setBuyOrder(true)
            setSellOrder(false)
        }
        else if (e.target.innerHTML === 'Sell'){
            setSellOrder(true)
            setBuyOrder(false)
        } 
    }

    useEffect(() => {
        if (buyOrder){
            setBuyColor('grey')
            setSellColor('white')
            setType('Buy')
        }
        else if (sellOrder){
            setSellColor('grey')
            setBuyColor('white')
            setType('Sell')
        }
    }, [buyOrder, sellOrder])

    function handleOrder(e){
        e.preventDefault()
        fetch('/handleOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ticker, shares, userID, type})
        }).then(response => response.json().then(
            thing => {
                if (thing==='Funds'){
                    setInsufficient(true)
                    setEnough(false)
                }
                else if (thing==='Enough'){
                    setEnough(true)
                    setInsufficient(false)
                }
                else{
                setInsufficient(false)
                setEnough(false)
                }}
        ))
    }

    useEffect(() => {
        const price = setInterval(() => {
            if (shares >= 0){
                fetch('/estimatedCost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ticker, shares})
                }).then(response => response.json().then(
                    thing => {
                        if (!(thing==='error')){
                            setCost(thing[0])
                            console.log(thing)
                            setTickerPrice(thing[1])
                        }
                    }
                )).catch(err => console.log(err))
            }
        }, 2000)
        return () => clearInterval(price)
    }, [ticker, shares])

    return (
            <div className="cards" id="cardsSplit">
            <div className="orderCard" id="order">
              <h1>Place order</h1>
              <div className="card-info" id="">
                <h3>Place an order.</h3>
                <div className="card-body" id="placeOrder">
                <form className="tradeForm">
                    <div className="row">
                  <input placeholder="Ticker" type="text" onBlur={(e) => {
                    setTheTicker(e.target.value) 
                    setTicker(e.target.value)}
                    }/>
                  <button id="button" onClick={(e) => {
                        e.preventDefault()
                        setBuyColor('grey')
                        setSellColor('white')
                        setBuyOrder(true)
                        setSellOrder(false)
                    }} style={{backgroundColor: buyColor}}>Buy</button>
                    </div>
                    <div className="row">
                  <input placeholder="Shares" type="number" min="0" onChange={(e) => {setShares(e.target.value)}}/>
                    <button id="button" onClick={(e) => {
                        e.preventDefault()
                        setBuyColor('white')
                        setSellColor('grey')
                        setSellOrder(true)
                        setBuyOrder(false)
                    }} style={{backgroundColor: sellColor}}>Sell</button>
                    </div>
                  <button id="place" onClick={handleOrder}>Place Order</button>
                  </form>
                  <h3 className="estimatedCost">Estimated Cost: ${cost}</h3>
                  {insufficient && <div id="loss">Insufficient funds!</div>}
                  {enough && <div id="loss">You don't own enough shares to complete this order!</div>}
                </div>
              </div>
            </div>
          </div>
    )
}