import React, { useState } from 'react'
import Footer from '../components/Footer'
import TopBar from '../components/topBar'
import SideBar from '../components/SideBar'
import AllProfilesCom from '../components/AllProfilesCom'

function AllProfiles() {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const hideShowMenuClick = () => {
      setMenuOpen(current => !current)
    }
  return (
    <>
    <div className="allPages">
                <SideBar
                    {...{ isMenuOpen, setMenuOpen }}
                />
                <div className="innerBox">
                    <TopBar
                        {...{ hideShowMenuClick }}
                    />
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <AllProfilesCom />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
    </>
  )
}

export default AllProfiles