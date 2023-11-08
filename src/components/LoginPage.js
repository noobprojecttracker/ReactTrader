import React from 'react'
import { useState, useEffect } from 'react'
import MainScreen from './Dashboard';
import {Router} from 'react-router-dom'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';


export default function Login(){
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogged, setLogged] = useState(false);
    const [authenticated, setAuthenticated] = useState(null);
    const [signUp, setSignUp] = useState(false)
    const [failedSignUp, setFailedSignUp] = useState(false)
    console.log('username is ' + username)

    // what do we want to do when username and password change?
    useEffect(() => {

        
    }, [username, password])

    function handleSignUp(){
        setSignUp(true)
    }

    useEffect(() => {
        if (signUp){
        navigate('/sign-up')
        }
    }, [signUp])


    function handleSubmit(event){
        event.preventDefault();
        // this below is how to access values from form, index them
        const username = (event.target[0].value)
        const password = (event.target[1].value)
        const data = {username, password}
        fetch('/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json().then(thing => 
            // if isNaN returns false, this means that a user ID
            // was returned, so set authenticated to true
            {
                if (thing != 'Invalid'){
                    console.log(thing)
                    const userID = thing;
                    setAuthenticated(true);
                    sessionStorage.setItem("username", username)
                    sessionStorage.setItem("password", password)
                    sessionStorage.setItem("user_id", userID)
                    navigate("/dashboard");
                }
                else{
                    console.log(thing)
                    setFailedSignUp(true)
                }
            }))
        }


    return (
        <div className='firstPage'>
            <div className='signText'>
                <h1>Welcome to Investify.</h1>
                <h1>All your investments, all in one place.</h1>
            </div>
            <form className='sign-in-form' onSubmit={handleSubmit}>
                <input placeholder='Enter username here' className='username'/>
                <br></br>
                <input placeholder='Enter password here' className='password'/>
                <br></br>
                <button className='login'>Login</button>
                <br></br>
                <button className='new-user' onClick={handleSignUp}>Don't have an account? Sign up here</button>
            </form> 
            {failedSignUp && (
            <div className="failedLogin" style={{ color: 'red' }}>
            Username or password is incorrect.
            </div>
            )}
        </div>
    )
}