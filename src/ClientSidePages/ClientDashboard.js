import React, { useState } from 'react'
import EarningPerDayChart from '../ClientComponents/EarningPerDayChart'
import SalesProgress from '../ClientComponents/SalesProgress'
import VisitorsChart from '../ClientComponents/VisitorsChart'
import OneMonthSaleProgress from '../ClientComponents/OneMonthSaleProgress'
import OneMonthOrder from '../ClientComponents/OneMonthOrder'
import ClientSideBar from '../ClientComponents/ClientSideBar'
import ClientTopBar from '../ClientComponents/ClientTopBar'
import ClientFooter from '../ClientComponents/ClientFooter'
import PastProgress from '../ClientComponents/PastProgress'
import ProjectProgress from '../ClientComponents/ProjectProgress'

function ClientDashboard() {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const hideShowMenuClick = () => {
    setMenuOpen(current => !current)
  }
  return (
    <>
      <div className="allPages">
          <ClientSideBar
            {...{isMenuOpen,setMenuOpen,hideShowMenuClick}}
          />
       <div className="innerBox">
          <ClientTopBar
            {...{ hideShowMenuClick }}
          />
          <div className="container">
            <div className="row">
              <SalesProgress />
              <PastProgress />
              <ProjectProgress />
              <OneMonthOrder />
            </div>
          </div>
          <ClientFooter />
       </div>
      </div>
    </>
  )
}

export default ClientDashboard