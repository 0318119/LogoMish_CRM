import React, { useEffect, useState } from 'react'
import '../components/assets/css/sideBar.css'
import logo from '../assets/images/logoMish.png'
import { RiDashboardLine as Dashboard_ico } from "react-icons/ri";
import { SlBasket as Order_ico } from "react-icons/sl";
import { BsFillChatSquareTextFill as Chat_ico } from "react-icons/bs";
import { FaClipboardList as CustomerList_ico } from "react-icons/fa";
import { RiErrorWarningLine as Warning_ico } from "react-icons/ri";
import { FiUserMinus as UserList_ico } from "react-icons/fi";
import { TbSteam as Customer_leads_ico } from "react-icons/tb";
import { BsBodyText as Customer_quotation_ico } from "react-icons/bs";
import { RiProfileLine as Profile_ico } from "react-icons/ri";
import { AiOutlineAlignRight as Bar_ico } from "react-icons/ai";
import { TbLogout as Logout_ico } from "react-icons/tb";
import secureLocalStorage from 'react-secure-storage';
import { useNavigate, NavLink } from 'react-router-dom'
import { AiOutlineBlock as Password_ico } from "react-icons/ai";
import { BsBoxFill as FrontSales_ico } from "react-icons/bs";
import { BsBoxArrowInUpRight as Upsale_ico } from "react-icons/bs";
import { BiSave as Save_ico } from "react-icons/bi";
import { VscReferences as Refer_ico } from "react-icons/vsc";
import { ImProfile as  User_profiles_ico } from "react-icons/im";
import { Tooltip } from 'react-tooltip';
export default function (props) {
    const [isRole, setRole] = useState(secureLocalStorage.getItem("user_name"))
    var get_role = secureLocalStorage.getItem("role_id")
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
            <div className="scrollBoxSideBar" id={props.isMenuOpen ? "scrollBoxSideBarShow" : "scrollBoxSideBarHide"}>
                <div>
                    <div className='sideBarBox' id={props.isMenuOpen ? "sideBarShow" : "sideBarHide"}>
                        <div className="logoBox">
                            <span className='barIco'>
                                <Bar_ico onClick={() => { props.setMenuOpen(false) }} />
                            </span>
                            <a href="#">
                                <img src={logo} alt="" id={props.isMenuOpen ? "showLogo" : "hideLogo"} />
                            </a>
                        </div>
                        <div className="menuBox" id='menuli'>
                            <ul>
                                {
                                    get_role == 1 ?
                                        <>
                                            <li className="mt-3">
                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />
                                            </li>
                                            <li className="">
                                                <NavLink to="/AllOrders" className="sideBarLinksActive">
                                                    <Order_ico className='Orders' />
                                                    <span id='hideTxt'>Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Orders"
                                                    place="bottom"
                                                    content="Orders"
                                                />
                                            </li>

                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Refer" className="sideBarLinksActive">
                                                    <Refer_ico className='Refers' />
                                                    <span id='hideTxt'>Refers</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/OtherPlatFormsOrderSaveOrders" className="sideBarLinksActive">
                                                    <Save_ico className='Refers' />
                                                    <span id='hideTxt'>Save Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            {/* <li>
                                    <Chat_ico />
                                    <Link to="/Chat" id='hideTxt'>Chat</Link>
                                </li> */}
                                            <li>
                                                <NavLink to="/FrontSales" className="sideBarLinksActive">
                                                    <FrontSales_ico className='save' />
                                                    <span id='hideTxt'>Front Sale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".save"
                                                    place="bottom"
                                                    content="Save Orders"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UpSales" className="sideBarLinksActive">
                                                    <Upsale_ico className='UpSale' />
                                                    <span id='hideTxt'>UpSale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UpSale"
                                                    place="bottom"
                                                    content="UpSale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/DisputeOrder" className="sideBarLinksActive">
                                                    <Warning_ico className='DisputeOrder' />
                                                    <span id='hideTxt'>Dispute Order</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".DisputeOrder"
                                                    place="bottom"
                                                    content="Dispute Order"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/OrderQuotations" className="sideBarLinksActive">
                                                    <Customer_quotation_ico className='OrderQuotations' />
                                                    <span id='hideTxt'>Order Request</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderQuotations"
                                                    place="bottom"
                                                    content="Order Quotations"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />

                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />
                                                </li> : false
                                            }
                                        </>
                                    // project manager
                                    : get_role == 2 ?
                                        <>
                                            <li className='mt-3'>
                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/AllOrders" className="sideBarLinksActive">
                                                    <Order_ico className='AllOrders' />
                                                    <span id='hideTxt'>Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".AllOrders"
                                                    place="bottom"
                                                    content="Orders"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Refer" className="sideBarLinksActive">
                                                    <Refer_ico className='Refers' />
                                                    <span id='hideTxt'>Refers</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/OtherPlatFormsOrderSaveOrders" className="sideBarLinksActive">
                                                    <Save_ico className='Refers' />
                                                    <span id='hideTxt'>Save Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            {/* <li>
                                <Chat_ico />
                                <Link to="/Chat" id='hideTxt'>Chat</Link>
                            </li> */}
                                            <li>
                                                <NavLink to="/OtherPlatFormsOrderSaveOrders" className="sideBarLinksActive">
                                                    <CustomerList_ico className='Refers' />
                                                    <span id='hideTxt'>Save Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UpSales" className="sideBarLinksActive">
                                                    <Upsale_ico className='UpSales' />
                                                    <span id='hideTxt'>UpSale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UpSales"
                                                    place="bottom"
                                                    content="UpSale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/DisputeOrder" className="sideBarLinksActive">
                                                    <Warning_ico className='DisputeOrder' />
                                                    <span id='hideTxt'>Dispute Order</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".DisputeOrder"
                                                    place="bottom"
                                                    content="Dispute Order"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/OrderQuotations" className="sideBarLinksActive">
                                                    <Customer_quotation_ico className='OrderQuotations' />
                                                    <span id='hideTxt'>Order Request</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderQuotations"
                                                    place="bottom"
                                                    content="Order Quotations"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />
                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />
                                                </li> : false
                                            }
                                        </>
                                    // team lead
                                    : get_role == 3 ?
                                        <>
                                            <li className='mt-3'>
                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/AllOrders" className="sideBarLinksActive">
                                                    <Order_ico className='AllOrders' />
                                                    <span id='hideTxt'>Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".AllOrders"
                                                    place="bottom"
                                                    content="Orders"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Refer" className="sideBarLinksActive">
                                                    <Refer_ico className='Refers' />
                                                    <span id='hideTxt'>Refers</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/OtherPlatFormsOrderSaveOrders" className="sideBarLinksActive">
                                                    <Save_ico className='Refers' />
                                                    <span id='hideTxt'>Save Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            {/* <li>
                            <Chat_ico />
                            <Link to="/Chat" id='hideTxt'>Chat</Link>
                        </li> */}
                                            <li>
                                                <NavLink to="/FrontSales" className="sideBarLinksActive">
                                                    <FrontSales_ico className='FrontSales' />
                                                    <span id='hideTxt'>Front Sale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".FrontSales"
                                                    place="bottom"
                                                    content="Front Sale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UpSales" className="sideBarLinksActive">
                                                    <Upsale_ico className='UpSales' />
                                                    <span id='hideTxt'>UpSale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UpSales"
                                                    place="bottom"
                                                    content="UpSale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/DisputeOrder" className="sideBarLinksActive">
                                                    <Warning_ico className='DisputeOrder' />
                                                    <span id='hideTxt'>Dispute Order</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".DisputeOrder"
                                                    place="bottom"
                                                    content="Dispute Order"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/OrderQuotations" className="sideBarLinksActive">
                                                    <Customer_quotation_ico className='OrderQuotations' />
                                                    <span id='hideTxt'>Order Request</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderQuotations"
                                                    place="bottom"
                                                    content="Order Quotations"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />

                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />
                                                </li> : false
                                            }
                                        </>
                                    // closer
                                    : get_role == 4 ?
                                        <>
                                            <li className='mt-3'>

                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/AllOrders" className="sideBarLinksActive">
                                                    <Order_ico className='AllOrders' />
                                                    <span id='hideTxt'>Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".AllOrders"
                                                    place="bottom"
                                                    content="Orders"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/Refer" className="sideBarLinksActive">
                                                    <Refer_ico className='Refers' />
                                                    <span id='hideTxt'>Refers</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refers"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            {/* <li>
                                                    <Chat_ico />
                                                    <Link to="/Chat" id='hideTxt'>Chat</Link>
                                                </li> */}
                                            <li>
                                                <NavLink to="/FrontSales" className="sideBarLinksActive">
                                                    <FrontSales_ico className='FrontSales' />
                                                    <span id='hideTxt'>Front Sale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".FrontSales"
                                                    place="bottom"
                                                    content="Front Sale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UpSales" className="sideBarLinksActive">
                                                    <Upsale_ico className='UpSales' />
                                                    <span id='hideTxt'>UpSale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UpSales"
                                                    place="bottom"
                                                    content="UpSale"
                                                />
                                            </li>
                                            {/* <li>
                                                <Warning_ico />
                                                <Link to="/DisputeOrder" id='hideTxt'>Dispute Order</Link>
                                            </li> */}
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/OrderQuotations" className="sideBarLinksActive">
                                                    <Customer_quotation_ico className='OrderQuotations' />
                                                    <span id='hideTxt'>Order Request</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderQuotations"
                                                    place="bottom"
                                                    content="Order Quotations"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />

                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />
                                                </li> : false
                                            }
                                        </>
                                    // back office
                                    : get_role == 5 ?
                                        <>
                                            <li className='mt-3'>
                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/AllOrders" className="sideBarLinksActive">
                                                    <Order_ico className='AllOrders' />
                                                    <span id='hideTxt'>Orders</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".AllOrders"
                                                    place="bottom"
                                                    content="Orders"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Refer" className="sideBarLinksActive">
                                                    <CustomerList_ico className='Refer' />
                                                    <span id='hideTxt'>Refers</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Refer"
                                                    place="bottom"
                                                    content="Refers"
                                                />
                                            </li>
                                            {/* <li>
                                                    <Chat_ico />
                                                    <Link to="/Chat" id='hideTxt'>Chat</Link>
                                                </li> */}
                                            <li>
                                                <NavLink to="/FrontSales" className="sideBarLinksActive">
                                                    <FrontSales_ico className='FrontSales' />
                                                    <span id='hideTxt'>Front Sale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".FrontSales"
                                                    place="bottom"
                                                    content="Front Sale"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UpSales" className="sideBarLinksActive">
                                                    <Upsale_ico className='UpSales' />
                                                    <span id='hideTxt'>UpSale</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UpSales"
                                                    place="bottom"
                                                    content="UpSale"
                                                />

                                            </li>
                                            {/* <li>
                                                    <Warning_ico />
                                                    <Link to="/DisputeOrder" id='hideTxt'>Dispute Order</Link>
                                                </li> */}
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/OrderQuotations" className="sideBarLinksActive">
                                                    <Customer_quotation_ico className='OrderQuotations' />
                                                    <span id='hideTxt'>Order Request</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderQuotations"
                                                    place="bottom"
                                                    content="Order Quotations"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />
                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />

                                                </li> : false
                                            }
                                        </>
                                    // fresher
                                    : get_role == 6 ?
                                        <>
                                            <li>
                                                <NavLink to="/CustomersList" className="sideBarLinksActive">
                                                    <CustomerList_ico className='CustomersList' />
                                                    <span id='hideTxt'>Customer's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomersList"
                                                    place="bottom"
                                                    content="Customer's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/UsersList" className="sideBarLinksActive">
                                                    <UserList_ico className='UsersList' />
                                                    <span id='hideTxt'>User's List</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".UsersList"
                                                    place="bottom"
                                                    content="User's List"
                                                />
                                            </li>
                                            <li>
                                                <NavLink to="/ChangePwd" className="sideBarLinksActive">
                                                    <Password_ico className='ChangePwd' />
                                                    <span id='hideTxt'>Change Password</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".ChangePwd"
                                                    place="bottom"
                                                    content="Change Password"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/CustomerLeads" className="sideBarLinksActive">
                                                    <Customer_leads_ico className='CustomerLeads' />
                                                    <span id='hideTxt'>Customer's leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".CustomerLeads"
                                                    place="bottom"
                                                    content="Customer's leads"
                                                />

                                            </li>
                                            <li>
                                                <NavLink to="/Profile" className="sideBarLinksActive">
                                                    <User_profiles_ico className='Profile' />
                                                    <span id='hideTxt'>My profile</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Profile"
                                                    place="bottom"
                                                    content="My profile"
                                                />

                                            </li>
                                            {
                                                isRole == "admin" ? <li>
                                                    <NavLink to="/AllProfiles" className="sideBarLinksActive">
                                                        <Profile_ico className='AllProfiles' />
                                                        <span id='hideTxt'>All Profiles</span>
                                                    </NavLink>
                                                    <Tooltip
                                                        anchorSelect=".AllProfiles"
                                                        place="bottom"
                                                        content="All Profiles"
                                                    />

                                                </li> : false
                                            }
                                        </>
                                    // Lead Generation
                                    : get_role == 7 ?
                                        <>
                                            <li className='mt-3'>
                                                <NavLink to="/Dashboard" className="sideBarLinksActive">
                                                    <Dashboard_ico className='Dashboard' />
                                                    <span id='hideTxt'>Dashboard</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".Dashboard"
                                                    place="bottom"
                                                    content="Dashboard"
                                                />

                                            </li>
                                            <li className=''>
                                                <NavLink to="/LeadsGeneration" className="sideBarLinksActive">
                                                    <CustomerList_ico className='LeadsGeneration' />
                                                    <span id='hideTxt'>All Leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".LeadsGeneration"
                                                    place="bottom"
                                                    content="All Leads"
                                                />

                                            </li>
                                            <li className=''>
                                                <NavLink to="/OrderLeads" className="sideBarLinksActive">
                                                    <Order_ico className='OrderLeads' />
                                                    <span id='hideTxt'>Order Leads</span>
                                                </NavLink>
                                                <Tooltip
                                                    anchorSelect=".OrderLeads"
                                                    place="bottom"
                                                    content="Order Leads"
                                                />
                                            </li>
                                        </>
                                        :
                                        ""
                                }
                                <li className=''>
                                    <NavLink onClick={userLogout} >
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
