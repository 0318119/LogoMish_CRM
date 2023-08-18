import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, AreaChart, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './assets/css/homeFile.css'

function VisitorsChart() {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>

      <div className="col-lg-5  mt-5">
        <div className="visitorsChart">
          <h5 className="visitorsChartHead">Total Visitors</h5>
          <div className="innerVisitChartBox">
            <ResponsiveContainer
              className={"chart"}
              width="100%" aspect={1.1}>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 2,
                  right: 10,
                  bottom: 0,
                }}
              >
                <Tooltip />
                <Bar dataKey="pv" fill="#429cf0" />
                <Bar dataKey="uv" fill="red" style={{ color: "#green" }} />
              </BarChart>
            </ResponsiveContainer>
            <div className="visitCountPerWeek">
              <h6>145,55</h6>
              <span>Weekly Visitor</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-1"></div>
    </>
  )
}

export default VisitorsChart