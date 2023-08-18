import React, { useState } from 'react'
import ClientSideBar from '../ClientComponents/ClientSideBar'
import ClientTopBar from '../ClientComponents/ClientTopBar'
import ClientOrderQuotationCom from '../ClientComponents/ClientOrderQuotationCom'
import ClientFilesCom from '../ClientComponents/ClientFilesCom'
import ClientFooter from '../ClientComponents/ClientFooter'

function ClientFiles() {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const hideShowMenuClick = () => {
        setMenuOpen(current => !current)
    }
  return (
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
                                <ClientFilesCom />
                            </div>
                        </div>
                    </div>
                    <ClientFooter />
                </div>
            </div>
  )
}

export default ClientFiles