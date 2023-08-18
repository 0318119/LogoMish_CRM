import React, { useState } from 'react'
import ClientDisputeOrderCom from '../ClientComponents/ClientDisputeOrderCom'
import ClientSideBar from '../ClientComponents/ClientSideBar'
import ClientTopBar from '../ClientComponents/ClientTopBar'
import ClientFooter from '../ClientComponents/ClientFooter'

function ClientDisputeOrder() {
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
                                <ClientDisputeOrderCom />
                            </div>
                        </div>
                    </div>
                    {/* <ClientFooter /> */}
                </div>
            </div>
        </>
    )
}

export default ClientDisputeOrder