import React from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from "react";
import Navbar from "./Navbar";


function checkIfUserTaken(username){

}



export default function Signup(){

    const navigate = useNavigate();

    const [userID, setUserID] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)
    const [fields, setFields] = useState(false)
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [user, setUser] = useState()
    const [pass, setPass] = useState()
    const [blank, setBlank] = useState(false)


    function handleSubmit(e){
        e.preventDefault();
        const username = (user)
        const password = (pass)
        if (username && password){
        fetch('/newuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        }).then(response => response.json().then(
            thing => {
                if (thing == 'True'){
                    fetch('/newID', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({username})
                    }).then(response2 => response2.json().then(
                        thing2 => {
                            setUserID(thing2)
                            console.log('thing2 is ' + thing2)
                            setAuthenticated(true);
                            sessionStorage.setItem("username", username)
                            sessionStorage.setItem("password", password)
                            sessionStorage.setItem("user_id", thing2)
                            navigate("/dashboard");
                        }
                    ))
                }
                else{
                    setIsUsernameTaken(true)
                    setBlank(false)
                    console.log(thing)
                }
            console.log(thing)
            }
        ))
        }
        else{
            setBlank(true)
            setIsUsernameTaken(false)
        }
    }



    return (
        <div className='firstPage'>
        <div className='signText'>
            <h1>First time?</h1>
            <h1>Sign up here!</h1>
        </div>
        <form className='sign-in-form'>
            <input placeholder='Enter username here' className='username' onChange={(e) => {
                setUser(e.target.value)
            }}/>
            <br></br>
            <input placeholder='Enter password here' className='password' onChange={(e) => {
                setPass(e.target.value)
            }}/>
            <br></br>
            <button className='login' onClick={handleSubmit} type="submit">Sign Up</button>
            <br></br>
        </form> 
        {isUsernameTaken && (
        <div className="failedLogin" style={{ color: 'red' }}>
        Username already taken.
 
        </div>
        )}

        {blank && (
        <div className="failedLogin" style={{ color: 'red' }}>
        Both fields must be entered.
 
        </div>

        )}
    </div>
    )
}