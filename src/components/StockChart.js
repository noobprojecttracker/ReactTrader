import React from "react";
import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale } from "chart.js/auto";
import { Chart, Line, Bar } from "react-chartjs-2";
import PlaceOrder from "./PlaceOrder";




export default function PortChart({theTicker, tickerPrice}){
    const [theLabels, setLabels] = useState(['10-22', '10-23', '10-24', '10-25', '10-26'])
    const [theData, setTheData] = useState([25000,25700,24200,23900,24300])
    const [datasets, setDatasets]= useState(
            {
                label: "Ticker Value",
                data: theData,
                backgroundColor: '#9BD0F5',
                borderColor: '#F11036',
                borderWidth: 2,
                tension: 0.2,
                pointRadius: 0.
            }
    )
    const [options, setOptions] = useState(
        {
            plugins: {
                legend: {
                    display: false
                },
            },
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        maxTicksLimit: 8,
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 8,
                    },
                    grid: {
                        display: false
                    }
                }
            },

            
        },
        
    )
    
    let data = {
        labels: theLabels,
        datasets: [datasets],
    }

    useEffect(() => {
        setDatasets(
            {
                label: "Ticker Value",
                data: theData,
                backgroundColor: '#9BD0F5',
                borderColor: 'rgb(35, 39, 60)',
                borderWidth: 3,
                tension: 0.2,
                pointRadius: 0.3,
                fill: {
                    target: 'origin',
                    above: 'rgb(35, 39, 60)',
                  }
            },
            
        )
    }, [theData])
    
    const [value, setValue] = useState('N/A')
    
    useEffect(() => {
        fetch('/tickerprice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({theTicker})
        }).then(response => response.json().then(
            thing => {setValue(thing)}
        ))
    }, [theTicker])
    



    return (
        <div className="order" id="theChart">
        <div className="cards" id="cardsSplit X">
          <div className="orderCard" id="order">
            <h1>${theTicker}</h1>
            <div className="card-info">
              <h3>Current price - ${tickerPrice}</h3>
              <div className="line-chart">
                <Line data={data} id="line-chart" options={options}/>
                <div className="chartButtons">
                <button className="chartButton" onClick={() => {
                    let window_size = '1D'
                    fetch('/chartdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({theTicker, window_size})
                    }).then(response => response.json().then(
                        thing => {
                            setTheData(thing[0])
                            setLabels(thing[1])
                        }
                    ))
                }}>1D</button>


                <button className="chartButton"
                
                onClick={() => {
                    let window_size = '5D'
                    fetch('/chartdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({theTicker, window_size})
                    }).then(response => response.json().then(
                        thing => {
                            setTheData(thing[0])
                            setLabels(thing[1])
                        }
                    ))
                }}
                >5D</button>

                <button className="chartButton"
                 onClick={() => {
                    let window_size = '30D'
                    fetch('/chartdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({theTicker, window_size})
                    }).then(response => response.json().then(
                        thing => {
                            setTheData(thing[0])
                            setLabels(thing[1])
                        }
                    ))
                }}
                >30D</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    )
}
