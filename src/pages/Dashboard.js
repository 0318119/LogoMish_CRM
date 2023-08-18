import React, { useState } from 'react'
import EarningPerDayChart from '../components/EarningPerDayChart'
import SalesProgress from '../components/SalesProgress'
import SideBar from '../components/SideBar'
import TopBar from '../components/topBar'
import VisitorsChart from '../components/VisitorsChart'
import OneMonthSaleProgress from '../components/OneMonthSaleProgress'
import OneMonthOrder from '../components/OneMonthOrder'
import Footer from '../components/Footer'
import secureLocalStorage from 'react-secure-storage'
import GetLeadsByPerDayChart from '../components/LeadsChart/GetLeadsByPerDayChart'
import GetLeadsByPerWeakChart from '../components/LeadsChart/GetLeadsByPerWeakChart'
import GetLeadsByPerMonthChart from '../components/LeadsChart/GetLeadsByPerMonthChart'

function Dashboard() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  var get_role = secureLocalStorage.getItem("role_id")
  const hideShowMenuClick = () => {
    setMenuOpen(!isMenuOpen)
  }
  return (
    <>
      <div className="allPages">
        <SideBar
          {...{ isMenuOpen, setMenuOpen, hideShowMenuClick, }}
        />
        <div className="innerBox">
          <TopBar
            {...{ hideShowMenuClick }}
          />
          <div className="container" style={{ marginTop: "100px" }} id="scrollBody">
            <div className="row">
              <h4 className='dashboraHead'>Dashboard</h4>
              {get_role == 1 ?
                <>
                  <VisitorsChart />
                  <EarningPerDayChart />
                  <SalesProgress />
                  <OneMonthSaleProgress />
                  <OneMonthOrder />
                 
                </> : <>
                  {
                    get_role == 2 ?
                      <>
                        <VisitorsChart />
                        <EarningPerDayChart />
                        <SalesProgress />
                        <OneMonthSaleProgress />
                        <OneMonthOrder />
                      </> : <>
                        {
                          get_role == 3 ?
                            <>
                              <VisitorsChart />
                              <EarningPerDayChart />
                              <SalesProgress />
                              <OneMonthSaleProgress />
                              <OneMonthOrder />
                            </> : <>

                              {
                                get_role == 4 ?
                                  <>
                                    <VisitorsChart />
                                    <EarningPerDayChart />
                                    <SalesProgress />
                                    <OneMonthSaleProgress />
                                    <OneMonthOrder />
                                  </> : <>

                                    {
                                      get_role == 5 ?
                                        <>
                                          <VisitorsChart />
                                          <EarningPerDayChart />
                                          <SalesProgress />
                                          <OneMonthSaleProgress />
                                          <OneMonthOrder />
                                        </> : <>
                                          {
                                            get_role == 6 ?
                                              <>
                                                <VisitorsChart />
                                                <EarningPerDayChart />
                                                <SalesProgress />
                                                <OneMonthSaleProgress />
                                                <OneMonthOrder />
                                              </> : <>
                                                {
                                                  get_role == 7 ?
                                                    <>
                                                        <GetLeadsByPerDayChart />
                                                        <GetLeadsByPerWeakChart />
                                                        <GetLeadsByPerMonthChart />
                                                    </> : false
                                                }
                                              </>
                                          }
                                        </>
                                    }
                                  </>
                              }
                            </>
                        }
                      </>
                  }
                </>
              }
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Dashboard