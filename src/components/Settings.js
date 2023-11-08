import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Settings(){
    return (
        <div className="container">
            <Sidebar />
            <div className="main">
            <Navbar />
                <div className="overall">
                    <div className="box">
                        <div className="title">
                            Some info
                            <div className="some-info">
                                Some more info
                            </div>
                        </div>
                    </div>

                    <div className="box">
                        <div className="title">
                            Some info
                            <div className="some-info">
                                Some more info
                            </div>
                        </div>
                    </div>

                    <div className="box">
                        <div className="title">
                            Some info
                            <div className="some-info">
                                Some more info
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}