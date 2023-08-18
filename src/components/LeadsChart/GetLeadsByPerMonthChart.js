import React, { useState, useEffect } from 'react'
import { ComposedChart, Tooltip, CartesianGrid, Legend, Area, Bar, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import { BsArrowRightShort as Right_ico } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
const config = require('../../components/config.json')

function GetLeadsByPerMonthChart() {
  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");
  const navigate = useNavigate()
  const [data, setdata] = useState([])
  const [total, settotal] = useState(null)
  // LOADERS 
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const[error,setError] = useState();

  async function getLeadsByPerMonth() {
    await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsByMonth`, {
      method: "GET",
      headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
    }).then((response) => {
      return response.json()
    }).then(async (response) => {
      if (response.messsage == "unauthorized") {
        await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsByMonth`, {
          method: "GET",
          headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
        }).then(response => {
          return response.json()
        }).then(response => {
          if (response.messsage == "timeout error") { navigate('/') }
          else {
            secureLocalStorage.setItem("refresh", response.referesh_token);
            secureLocalStorage.setItem("access_token", response.access_token);
            setdata(response.data)
            settotal(response.total_visitors)
            setDataLoader(true)
          }
        }).catch((errs) => {
          setError("Something went wrong.")
        }).finally(() => { setLoading(false) })
      }
      else {
        setdata(response.data)
        settotal(response.total_visitors)
        setDataLoader(true)
      }
    }).catch((errs) => {
      setError("Something went wrong.")
    }).finally(() => { setLoading(false) })
  }

  useEffect(() => {
    getLeadsByPerMonth()
  }, [])


  return (
    <>
      <div className="col-12">
        <div className="OneMonSalesProgress">
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
           <ul>
                {error && (
                    <li className={`alert alert-warning` + " " + "mt-4"}>{`${error}`}</li>
                )}
            </ul>
          {dataLoader && (
            <>
                <div className="OneMonSalesProgressHead">
                  <span>Sales Progress</span>
                  <h5>Performance <Right_ico /> {new Date().toString().split(' ')[1].split(' ')[0]}, {new Date().getFullYear()}</h5>
                  <div className="OneMonInnerBox">
                    <span>Sale Till Now $35</span>
                  </div>
                </div>
                <div className="OneMonsalesProgressChartBox">
                  <ResponsiveContainer className={"OneMonsalesProgressChart"} width="100%" aspect={3.6}>
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

export default GetLeadsByPerMonthChart