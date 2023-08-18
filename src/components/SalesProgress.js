import React, { useState, useEffect } from 'react'
import { ComposedChart, Tooltip, CartesianGrid, Legend, Area, Bar, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
const config = require('../components/config.json')

function SalesProgress() {

  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");
  const navigate = useNavigate()
  const [data, setdata] = useState([])
  const [total, settotal] = useState(null)
  // LOADERS 
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getWeeklyVisitors() {
    await fetch(`${config['baseUrl']}/dashboard/GetLast12MonthsPerformance`, {
      method: "GET",
      headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
    }).then((response) => {
      return response.json()
    }).then(async (response) => {
      if (response.messsage == "unauthorized") {
        await fetch(`${config['baseUrl']}/dashboard/GetLast12MonthsPerformance`, {
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
      <div className="col-12">
        <div className="SalesProgress">
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
                  <div className="SalesProgressHead">
                    <span>Sales Progress ({new Date().getFullYear()})</span>
                    <h5>Last 12 Months Performance</h5>
                  </div>
                  <div className="salesProgressChartBox">
                    <ResponsiveContainer className={"salesProgressChart"} width="100%" aspect={3.6}>
                      <ComposedChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Area type="monotone" dataKey="amount" fill="#8884d8" stroke="#8884d8" />
                        <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </>
            )}
        </div>
      </div>
    </>
  )
}

export default SalesProgress
