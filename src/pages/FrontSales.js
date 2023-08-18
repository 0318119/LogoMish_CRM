import React, { useState } from 'react'
import SideBar from '../components/SideBar';
import TopBar from '../components/topBar';
import FrontSaleCom from '../components/FrontSaleCom';
import Footer from '../components/Footer';


function FrontSales() {



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
                                <FrontSaleCom />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default FrontSales