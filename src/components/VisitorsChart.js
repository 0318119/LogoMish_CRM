import React, { useState, useEffect } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, AreaChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './assets/css/homeFile.css'
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
const config = require('../components/config.json')

function VisitorsChart() {
  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");
  const navigate = useNavigate()
  const [data, setdata] = useState([])
  const [total, settotal] = useState(null)
  // LOADERS 
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState(true);


  async function getWeeklyVisitors() {
    await fetch(`${config['baseUrl']}/dashboard/GetWeeklyVisitors`, {
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
      <div className="col-lg-5  mt-5">
        <div className="visitorsChart">
          <h5 className="visitorsChartHead">Total Visitors</h5>
          <div className="innerVisitChartBox">
          {loading && (
                <div className="loaderBox">
                    <div className="loader">
                        <div className="one"></div>
                        <div className="two"></div>
                        <div className="three"></div>
                        <div className="four"></div>
                    </div>
                    {/* <span>Loading...</span> */}
                </div>
            )} 
            {dataLoader && (
                <>
                    <ResponsiveContainer className={"chart"} width="100%" aspect={1.1}>
                        <BarChart width={500} height={300}data={data}
                          margin={{
                            top: 2,
                            right: 10,
                            bottom: 0,
                          }}
                        >
                          <Tooltip />
                          <Bar dataKey="visitors" fill="red" style={{ color: "#green" }} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="visitCountPerWeek">
                      <h6>{total}</h6>
                      <span>Weekly Visitor</span>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
      <div className="col-1"></div>
    </>
  )
}

export default VisitorsChart