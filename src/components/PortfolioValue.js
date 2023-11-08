import React, { useEffect, useState } from "react";



export default function PortfolioValue(){
    const [value, setValue] = useState(0)
    const userID = sessionStorage.getItem('user_id')
    useEffect(() => {
        const getValue = setInterval(() => {
            fetch('/getvalue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID})
            }).then(response => {{
                if (!response.ok){
                    console.log('Network response was not ok');
                }
                else{
                    response.json().then(
                        thing => {
                            setValue(thing)
                            console.log(thing)
                        })
                }
            }
                
            }
            )
        }, 3000)

    }, [])

    return (
        <div className="portfolioValue">
            <h2>Current Value: ${value}</h2>
        </div>
    )
}