import React from "react";

export default function PortPiece({data, counter}){
    // make sure they own more than 0 shares
    if (data[2] > 0){

        const the_id = counter % 2 === 0 ? 'other' : 'one';


    return (
        <>

            <tr id={the_id}>
                <td>{data[1]}</td>
                <td>{data[2]}</td>
                <td>${data[3]}</td>
            </tr>



        </>
    )
    }
}