import React, { useEffect } from 'react'
import '../ClientComponents/assets/css/clientsideBar.css'
import logo from '../assets/images/logoMish.png'
import { RiDashboardLine as Dashboard_ico } from "react-icons/ri";
import { SlBasket as Order_ico } from "react-icons/sl";
import { VscReferences as Refer_ico } from "react-icons/vsc";
import { VscGitPullRequestDraft as Request_ico } from "react-icons/vsc";
import { FaClipboardList as CustomerList_ico } from "react-icons/fa";
import { RiProfileLine as Profile_ico } from "react-icons/ri";
import { AiOutlineAlignRight as Bar_ico } from "react-icons/ai";
import { MdOutlineContactPage as Contact_ico } from "react-icons/md";
import { TbLogout as Logout_ico } from "react-icons/tb";
import secureLocalStorage from 'react-secure-storage';
import { AiOutlineBlock as Password_ico } from "react-icons/ai";
import { NavLink } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';


function ClientSideBar(props) {
    const userLogout = () => {
        secureLocalStorage.clear()
        window.location.href = '/'
    }
    // useEffect(() => {
    //     setTimeout(function(){
    //         secureLocalStorage.clear()
    //         // window.location.href = '/'
    //     },1000 * 60 * 60 );
    // })
    return (
        <>
            <div className="client_scrollBoxSideBar" id={props.isMenuOpen ? "client_scrollBoxSideBarShow" : "client_scrollBoxSideBarHide"}>
                <div>
                    <div className='client_sideBarBox' id={props.isMenuOpen ? "client_sideBarShow" : "client_sideBarHide"}>
                        <div className="client_logoBox">
                            <span className='client_barIco'>
                                <Bar_ico onClick={() => { props.setMenuOpen(false) }} />
                            </span>
                            <a href="#">
                                <img src={logo} alt="" id={props.isMenuOpen ? "client_showLogo" : "client_hideLogo"} />
                            </a>
                        </div>
                        <div className="client_menuBox" id='menuli'>
                            <ul>
                                <li className='mt-3'>
                                    <NavLink to="/ClientDashboard" className="sideBarLinksActive">
                                        <Dashboard_ico className='ClientDashboard' />
                                        <span id='hideTxt'>Dashboard</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientDashboard"
                                        place="bottom"
                                        content="Dashboard"
                                    />
                                </li>
                                <li>
                                    <NavLink to="/ClientAllOrders" className="sideBarLinksActive">
                                        <Order_ico className='ClientAllOrders' />
                                        <span id='hideTxt'>Orders</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientAllOrders"
                                        place="bottom"
                                        content="Orders"
                                    />

                                </li>
                                <li>
                                    <NavLink to="/ClientRefer" className="sideBarLinksActive">
                                        <Refer_ico className='ClientRefer' />
                                        <span id='hideTxt'>Refer</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientRefer"
                                        place="bottom"
                                        content="Refer"
                                    />


                                </li>
                                <li>
                                    <NavLink to="/ClientOrderQuotations" className="sideBarLinksActive">
                                        <Request_ico className='ClientOrderQuotations' />
                                        <span id='hideTxt'>Request Order</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientOrderQuotations"
                                        place="bottom"
                                        content="Request Order"
                                    />

                                </li>
                                <li>
                                    <NavLink to="/ClientFiles" className="sideBarLinksActive">
                                        <CustomerList_ico className='ClientFiles' />
                                        <span id='hideTxt'>Files</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientFiles"
                                        place="bottom"
                                        content="Files"
                                    />

                                </li>
                                {/* <li>
                                    <Chat_ico />
                                    <Link to="/ClientChat" id='client_hideTxt'>Chat</Link>
                                </li> */}
                                {/* <li>
                                    <Warning_ico />
                                    <Link to="/ClientDisputeOrder" id='client_hideTxt'>Dispute Order</Link>
                                </li> */}
                                <li>
                                    <NavLink to="/ClientChangePwd" className="sideBarLinksActive">
                                        <Password_ico className='ClientChangePwd' />
                                        <span id='hideTxt'>Change Password</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientChangePwd"
                                        place="bottom"
                                        content="Change Password"
                                    />

                                </li>
                                <li>

                                    <NavLink to="/ClientProfile" className="sideBarLinksActive">
                                        <Profile_ico className='ClientProfile' />
                                        <span id='hideTxt'>My profile</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ClientProfile"
                                        place="bottom"
                                        content="My profile"
                                    />

                                </li>
                                <li>
                                    <NavLink to="/ContactUs" className="sideBarLinksActive">
                                        <Contact_ico className='ContactUs' />
                                        <span id='hideTxt'>Contact us</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".ContactUs"
                                        place="bottom"
                                        content="Contact us"
                                    />

                                </li>
                                <li>
                                    <NavLink onClick={userLogout}>
                                        <Logout_ico className='logoOutAlert' onClick={userLogout}/>
                                        <span id='hideTxt' onClick={userLogout}>Log out</span>
                                    </NavLink>
                                    <Tooltip
                                        anchorSelect=".logoOutAlert"
                                        place="bottom"
                                        content="Log out"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientSideBar
