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


function getCurrentTime() {

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert 24-hour time to 12-hour time
    const formattedHours = hours % 12 || 12;
  
    // Pad the minutes with a leading zero if they are less than 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  }

export default function MarketStatus(){
    const [time, setTime] = useState(new Date())
    const [day, setDay] = useState(() => {
        return days[time.getDay()]
    })
    const [marketStatus, setMarketStatus] = useState(() => {
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let day = time.getDay()

        if ((hours===9) && (minutes < 30) && (day>=1 && day<=5)){
            return 'Closed';
        } else if (((hours>=9 && hours<=16)&&(day>=1 && day<=5))){
            if ((hours === 16) && (minutes >= 0)){
                return 'Closed'
            }
            return 'Open';
        } else {
            return 'Closed';
        }
    })

    useEffect(() => {
        setInterval(() => {
            setTime(new Date())
            let hours = time.getHours()
            let minutes = time.getMinutes()
            let day = time.getDay()
            if ((hours===9) && (minutes < 30) && (day>=1 && day<=5)){
                return 'Closed';
            } else if (((hours>=9 && hours<=16)&&(day>=1 && day<=5))){
                if ((hours === 16) && (minutes >= 0)){
                    return 'Closed'
                }
                return 'Open';
            } else {
                return 'Closed';
            }
            setDay(days[time.getDay()])
        }, 60000)
    })

    const things = getCurrentTime();

    return (
    
        <div className="box">
        <div className="title">{day} - {things}</div>
        <div className="some-info">Market Status - {marketStatus}</div>
        <div className="some-image">
          <img />
        </div>
      </div>


    )
}