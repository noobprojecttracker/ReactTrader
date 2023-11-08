import React from "react";


export default function FirstCard(){
    return (
        <div className="cards">
  <div className="firstCard">
    <h1>Portfolio Data</h1>
    <div className="card-info">
      <h3>View all your holdings in one place.</h3>
      <div className="card-body">
        <table className="portfolio">
          <tbody>
            <tr id="one">
              <td>AAPL</td>
              <td>50 Shares</td>
              <td>$102.58</td>
            </tr>
            <tr id="other">
              <td>MSFT</td>
              <td>20 Shares</td>
              <td>$201.18</td>
            </tr>
            <tr id="one">
              <td>SPY</td>
              <td>100 Shares</td>
              <td>$270.93</td>
            </tr>
            <tr id="other">
              <td>SBUX</td>
              <td>150 Shares</td>
              <td>$70.57</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

    )
}