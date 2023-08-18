import React, { useState } from 'react'
import ClientAllOrdersCom from '../ClientComponents/ClientAllOrdersCom';
import ClientFooter from '../ClientComponents/ClientFooter';
import ClientTopBar from '../ClientComponents/ClientTopBar';
import ClientSideBar from '../ClientComponents/ClientSideBar';


function ClientAllOrders() {



    const [isMenuOpen, setMenuOpen] = useState(false)
    const hideShowMenuClick = () => {
      setMenuOpen(current => !current)
    }
    return (
        <>
            <div className="allPages">
                <ClientSideBar
                    {...{ isMenuOpen, setMenuOpen }}
                />
                <div className="innerBox">
                    <ClientTopBar
                        {...{ hideShowMenuClick }}
                    />
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <ClientAllOrdersCom />
                            </div>
                        </div>
                    </div>
                    <ClientFooter />
                </div>
            </div>
        </>
    )
}

export default ClientAllOrders