import React, { useEffect } from "react";
import { useState } from "react";

const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}
let hours = [0,10,11,22,23]
export default function MarketTime(){
    const [time, setTime] = useState(new Date())
    const [theTimeString, setTheTimeString] = useState(() => {
        let string = time.toLocaleTimeString
        let currHour = time.getHours()
        if (hours.includes(currHour)){
            return time.toLocaleTimeString().slice(0,5)
        }
        else{
            return time.toLocaleTimeString().slice(0,4)
        }
    })
    const [meridiem, setMeridiem] = useState(() => {
        let hours = time.getHours()
        if (hours >= 12){
            return 'PM'
        }
        else{
            return 'AM'
        }
    })
    const [day, setDay] = useState()

    // find new time every minute
    useEffect(() => {
        setInterval(() => {
            setTime(new Date())
            let hours = time.getHours()
            if (hours >= 12){
                setMeridiem('PM')
            }
            else{
                setMeridiem('AM')
            }

            if (time.getHours() === 0 ||  10 || 11 || 22 || 23){
                setTheTimeString(time.toLocaleTimeString().slice(0,5))
            }
            else{
                setTheTimeString(time.toLocaleTimeString().slice(0,4))
            }
        }, 60000)
    })

    const currTime = new Date()


    return (
        <div className="marketInfo">
            <div className="marketTime">
            <h1>{days[time.getDay()]} {theTimeString}{meridiem}</h1>
            </div>
        </div>
    )
}

