import React, { useState } from 'react'
import UserStatisticsCom from '../ClientComponents/UserStatisticsCom'
import ClientSideBar from '../ClientComponents/ClientSideBar'
import ClientTopBar from '../ClientComponents/ClientTopBar'
import ClientFooter from '../ClientComponents/ClientFooter'

function UserStatistics() {
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
                                <UserStatisticsCom />
                            </div>
                        </div>
                    </div>
                    {/* <ClientFooter /> */}
                </div>
            </div>
        </>
    )
}

export default UserStatistics