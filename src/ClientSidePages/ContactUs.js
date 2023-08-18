import React, { useState } from 'react'
import ContactUsForm from '../ClientComponents/ContactUsForm'
import SideBar from '../ClientComponents/ClientSideBar'
import TopBar from '../ClientComponents/ClientTopBar'
import Footer from '../components/Footer'

function ContactUs() {
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
                                <ContactUsForm />
                            </div>
                        </div>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        </>
    )
}

export default ContactUs