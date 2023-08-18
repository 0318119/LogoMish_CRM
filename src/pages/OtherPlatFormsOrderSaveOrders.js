import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import TopBar from '../components/topBar';
import Footer from '../components/Footer';
import OtherPlatformSaveOrdersCom from '../components/OtherPlatformSaveOrdersCom';


function OtherPlatFormsOrderSaveOrders() {
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
                                <OtherPlatformSaveOrdersCom />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}
export default OtherPlatFormsOrderSaveOrders