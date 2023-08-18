import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
const config = require('../components/config.json')


function EarningPerDayChart() {

    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()
    const [data, setdata] = useState([])
    const [total, settotal] = useState(null)
    // LOADERS 
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);


    async function getWeeklyVisitors() {
        await fetch(`${config['baseUrl']}/dashboard/GetEarningPerDay`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/dashboard/GetWeeklyVisitors`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setdata(response.data)
                    settotal(response.total_visitors)
                    setDataLoader(true)
                }).catch((errs) => {
                }).finally(() => { setLoading(false) })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setdata(response.data)
                settotal(response.total_visitors)
                setDataLoader(true)
            }
        }).catch((errs) => {
        }).finally(() => { setLoading(false) })
    }

    useEffect(() => {
        getWeeklyVisitors()
    }, [])
    return (
        <>
            <div className="col-lg-6  mt-5">
                <div className="earningChartBox">
                    {loading && (
                        <div className="loaderBox">
                            <div className="loader">
                                <div className="one"></div>
                                <div className="two"></div>
                                <div className="three"></div>
                                <div className="four"></div>
                            </div>
                        </div>
                    )}  
                   {dataLoader && (
                    <>
                         <div className="earningPerDayBox">
                            <h3>569</h3>
                            <span>Earning Per Day</span>
                        </div>
                        <div className="innerChartBox">
                            <ResponsiveContainer
                                className={"earningChart"} width="100%" aspect={2.8}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                   )}
                </div>
            </div>
        </>
    )
}

export default EarningPerDayChart