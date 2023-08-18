import React, { useState } from 'react'
import ClientFooter from '../ClientComponents/ClientFooter';
import ClientTopBar from '../ClientComponents/ClientTopBar';
import ClientSideBar from '../ClientComponents/ClientSideBar';
import ClientOrderReplyCom from '../ClientComponents/ClientOrderReplyCom';


function ClientOrderReply() {
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
                                <ClientOrderReplyCom/>
                            </div>
                        </div>
                    </div>
                    <ClientFooter />
                </div>
            </div>
        </>
    )
}

export default ClientOrderReply