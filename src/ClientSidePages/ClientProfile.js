import React, { useState } from 'react'
import ClientSideBar from '../ClientComponents/ClientSideBar'
import ClientTopBar from '../ClientComponents/ClientTopBar'
import ClientFooter from '../ClientComponents/ClientFooter'
import ClientProfileCom from '../ClientComponents/ClientProfileCom'

function ClientProfile() {
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
                        <div className="row justify-content-center">
                            <div className="col-10">
                                <ClientProfileCom />
                            </div>
                        </div>
                    </div>
                    <ClientFooter />
                </div>
            </div>
        </>
    )
}

export default ClientProfile