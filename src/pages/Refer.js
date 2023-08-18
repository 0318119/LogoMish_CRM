import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import TopBar from '../components/topBar'
import Footer from '../components/Footer'
import ReferComp from '../components/ReferComp'

function Refer() {
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
                                <ReferComp />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Refer