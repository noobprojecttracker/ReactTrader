import React from "react";

export default function OrderComponent({orderData, counter}){
    const the_id = counter % 2 === 0 ? 'other' : 'one';
    return (
        <>
        <tr id={the_id}>
            <td className="one">{orderData[1]}</td>
            <td className="other">{orderData[2]}</td>
            <td className="one">${orderData[3]}</td>
            <td className="other">{orderData[4]}</td>
            <td className="one">${orderData[5]}</td>
            <td className="other">{orderData[6]}</td>
        </tr>

        </>
    )
}