import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import TopBar from '../components/topBar'
import Footer from '../components/Footer'
import ProfileCom from '../components/ProfileCom'

function Profile() {
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
                    <div className="container p-0">
                        <div className="row justify-content-center">
                            <div className="col-10">
                                <ProfileCom />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default Profile