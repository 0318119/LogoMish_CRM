import React, { useEffect, useState, useRef } from 'react'
import { MdNotificationsNone as Notify_ico } from "react-icons/md";
import ChatPicture from '../components/assets/images/chat/03.jpg'
import secureLocalStorage from 'react-secure-storage';
import logo from '../assets/images/logoMish.png'
import { RxCross2 as Cross_ico } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
const config = require('../components/config.json')


function NotifyBox() {
    const navigate = useNavigate()
    const [isErrGetAllPkgs, setErrGetAllPkgs] = useState();
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isMasModal, setMasModal] = useState(true);
    const [childCount, setchildCount] = useState(null)
    const [count, setcount] = useState(0)
    const [countlength, setcountlength] = useState(false)
    const refOne = useRef();
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const [notifyModal, setnotifyModal] = useState(false)
    const [getNotifyData, setgetNotifyData] = useState([])
    const [getLeadInfo, setgetLeadInfo] = useState(false)
    const [notifyId, setnotifyId] = useState("")
    const [isErrGetLeadsById, setErrGetLeadsById] = useState();
    const [issugCustomerName, setsugCustomerName] = useState("");
    const [issugEmailAddress, setsugEmailAddress] = useState("");
    const [issugPhoneNumber, setsugPhoneNumber] = useState("");
    const [issugPackageId, setsugPackageId] = useState("");
    const [issugCustomPackageName, setsugCustomPackageName] = useState("");
    const [issugPrice, setsugPrice] = useState(0);
    const [issugPriceReceived, setsugPriceReceived] = useState(0);
    const [issugAgentName, setsugAgentName] = useState("");
    const [issugPaymentMethod, setsugPaymentMethod] = useState("");
    const [issugbudget, setsugbudget] = useState("")
    const [issugaboutproject, setsugaboutproject] = useState("")
    const [issugleadSource, setsugleadSource] = useState("")
    const [issugaddRemarks, setsugaddRemarks] = useState("")

    async function getAllSubPakages() {
        await fetch(`${config['baseUrl']}/packages/getAllSubPakages`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/packages/getAllSubPakages`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetAllSubPakages(response.data)
                }).catch((errs) => {
                    setErrGetAllPkgs(errs.message)
                })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setGetAllSubPakages(response.data)
            }
        }).catch((errs) => {
            setErrGetAllPkgs(errs.message)
        })
    }

    useEffect(() => {
        getAllSubPakages()
        const maybeHandler = (e) => {
            if (!refOne.current.contains(e.target)) {
                setMasModal(true)
            }
        }
        document.addEventListener("mousedown", maybeHandler, true);
        return () => {
            document.removeEventListener("mousedown", maybeHandler, true)
        }
    }, [])

    const handleModal = () => {
        setMasModal(current => !current)
    }

    const applyStyle = () => {
        var div = document.getElementById('scrollBoxNotifyModal11')
        setchildCount(div.childElementCount)
    }

    async function GetNotifications() {
        await fetch(`${config['baseUrl']}/notifications/GetNotifications`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/notifications/GetNotifications`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setgetNotifyData(response.data)
                    applyStyle()
                }).catch((errs) => {
                    console.log("Get Notify Error", errs.messsage)
                })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setgetNotifyData(response.data)
                applyStyle()
            }
        }).catch((errs) => {
            console.log("Get Notify Error", errs.messsage)
        })
    }

    async function GetNotificationCount() {
        await fetch(`${config['baseUrl']}/notifications/GetNotificationCount`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/notifications/GetNotificationCount`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                }).catch((errs) => {
                    console.log("Get Notification Count", errs.messsage)
                })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setcount(response.count)
                if (localStorage.getItem('count') == response.count) {

                }
                else {
                    if (countlength == false) {
                        setnotifyModal(true)
                    }
                    else {
                        setcountlength(false)
                    }
                    localStorage.setItem('count', response.count)
                }
            }
        }).catch((errs) => {
            console.log("Get Notification Count", errs.messsage)
        })
    }

    async function UpdateNotificationCount() {
        await fetch(`${config['baseUrl']}/notifications/updateNotificationCount`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/notifications/updateNotificationCount`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                }).catch((errs) => {
                    console.log("Update Notification Count", errs.messsage)
                })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setnotifyModal(false)
                setcountlength(true)
                localStorage.setItem('count', 0)
                GetNotificationCount()

            }
        }).catch((errs) => {
            console.log("Update Notification Count", errs.messsage)
        })
    }
    
    const getLeadsById = async (e) => {
        await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsById/${e}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsById/${e}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setsugCustomerName(response?.data[0]?.cutomer_name)
                        setsugEmailAddress(response?.data[0]?.email)
                        setsugPhoneNumber(response?.data[0]?.number)
                        setsugPackageId(response?.data[0]?.package_id)
                        setsugCustomPackageName(response?.data[0]?.custom_package)
                        setsugPrice(response?.data[0]?.price)
                        setsugPriceReceived(response?.data[0]?.price)
                        setsugbudget(response?.data[0]?.budget)
                        setsugAgentName(response?.data[0]?.agent_name)
                        setsugPaymentMethod(response?.data[0]?.payment_method)
                        setsugaboutproject(response?.data[0]?.about_project)
                        setsugleadSource(response?.data[0]?.lead_source)
                        setsugaddRemarks(response?.data[0]?.remarks)
                    }
                }).catch((errs) => {
                    setErrGetLeadsById(errs.message)
                })
            }
            else {
                setsugCustomerName(response?.data[0]?.cutomer_name)
                setsugEmailAddress(response?.data[0]?.email)
                setsugPhoneNumber(response?.data[0]?.number)
                setsugPackageId(response?.data[0]?.package_id)
                setsugCustomPackageName(response?.data[0]?.custom_package)
                setsugPrice(response?.data[0]?.price)
                setsugPriceReceived(response?.data[0]?.price)
                setsugbudget(response?.data[0]?.budget)
                setsugAgentName(response?.data[0]?.agent_name)
                setsugPaymentMethod(response?.data[0]?.payment_method)
                setsugaboutproject(response?.data[0]?.about_project)
                setsugleadSource(response?.data[0]?.lead_source)
                setsugaddRemarks(response?.data[0]?.remarks)
            }
        }).catch((errs) => {
            setErrGetLeadsById(errs.message)
        })
    }

    useEffect(() => {
        if (localStorage.getItem('count') == null || localStorage.getItem('count') == undefined || localStorage.getItem('count') == '') {
            localStorage.setItem('count', 0)
        }
        GetNotifications()
        GetNotificationCount()
    }, [])


    useEffect(() => {
        const intervalID = setInterval(() => {
            GetNotifications()
            GetNotificationCount()
        }, 3000);

        return () => clearInterval(intervalID);
    }, []);


    return (
        <>
            <div className="notifyBox" ref={refOne}>
                <span className='notifyBoxIco'>
                    <Notify_ico onClick={() => {
                        UpdateNotificationCount()
                        handleModal()
                    }} />
                    <span className='notificateCount'>{count}</span>
                </span>
                <div className="notifyModal" id={isMasModal ? "hideNotifyModal" : "showNotifyModal"}>
                    <div className="modalHeader">
                        <h6 className='notifyCount'>Notifications</h6>
                        {/* <button>clear all</button> */}
                    </div>
                    <div className="scrollBoxNotifyModal" id='scrollBoxNotifyModal11'
                        style={{
                            height: childCount == null || childCount < 4 ? 'fit-content' : '250px',
                            overflowY: childCount == null || childCount < 4 ? 'hidden' : 'scroll'
                        }}>

                        {getNotifyData?.map((getItems) => {
                            return (
                                <>
                                    <div className="notifyContent" key={getItems?.id} onClick={() => {
                                        setnotifyId(getItems?.id)
                                        setgetLeadInfo(!getLeadInfo)
                                        getLeadsById(getItems?.lead_id)
                                    }}>
                                        {/* <img src={ChatPicture} alt="" /> */}
                                        <div className="userContent">
                                            <span className='userName'>{getItems?.heading}</span>
                                            <p className='userDescription'>{getItems?.description}</p>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                    <div className="notifyFooter">
                        <Link to="/ViewAllNotifications">View all notifications</Link>
                    </div>
                </div>
            </div>
            {notifyModal && (
                <div className="showLeadEmailAlertBox">
                    <Cross_ico onClick={() => setnotifyModal(false)} />
                    <span>you have {count} new notifications</span>
                </div>
            )}

            {getLeadInfo && (
                <div className="addLeadsModalBox">
                    <div className="addLeadsBox">
                        <Cross_ico onClick={() => {
                            setgetLeadInfo(false)
                            setnotifyId("")
                        }}
                            style={{
                                position: "absolute", top: "15px", right: "20px",
                                color: "#a09494", fontSize: "22px",
                                border: "1px solid #a09494", padding: "0 3px", borderRadius: "10px"
                            }}
                        />
                        <h4 style={{ marginTop: "30px", marginBottom: "10px" }}>
                            <img src={logo} alt="" className='' />
                        </h4>
                        {/* <ul>
                            {error && (
                                <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                            )}
                        </ul> */}
                        <form>
                            <div className="leadsScrollBox">
                                <div className="inneraddLeadsBox">
                                    <div className="form-group">
                                        <label>Customer Name</label>
                                        <input type="text" className="form-control" value={issugCustomerName !== "" ? issugCustomerName : "Customer Name"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="text" className="form-control" value={issugEmailAddress !== "" ? issugEmailAddress : "Email Address"} readOnly />
                                    </div>
                                </div>
                                <div className="inneraddLeadsBox">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="text" className="form-control" value={issugPhoneNumber !== "" ? issugPhoneNumber : "Phone Number"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Package</label>
                                        <input type="text" className="form-control" value={issugPackageId !== "" ? isGetAllSubPakages.length > 0 ? isGetAllSubPakages.filter(data => data.id == issugPackageId).length > 0 ? isGetAllSubPakages.filter(data => data.id == issugPackageId)[0].name : "Package" : "Package" : "Package"} readOnly />
                                    </div>
                                </div>
                                <div className="inneraddLeadsBox">
                                    <div className="form-group">
                                        <label>Custom Package Name</label>
                                        <input type="text" className="form-control" value={issugCustomPackageName !== "" ? issugCustomPackageName : "Custom Package Name"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Price</label>
                                        <input type="text" className="form-control" value={issugPrice !== 0 ? issugPrice : "Price"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Budget</label>
                                        <input type="text" className="form-control" value={issugbudget !== "" ? issugbudget : "Budget"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>About project</label>
                                        <input type="text" className="form-control" value={issugaboutproject !== "" ? issugaboutproject : "About project"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Lead Source</label>
                                        <input type="text" className="form-control" value={issugleadSource !== "" ? issugleadSource : "Lead Source"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Remarks</label>
                                        <input type="text" className="form-control" value={issugaddRemarks !== "" ? issugaddRemarks : "Remarks"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Amount Received</label>
                                        <input type="text" className="form-control" value={issugPriceReceived !== 0 ? issugPriceReceived : "Amount Received"} readOnly />
                                    </div>
                                </div>
                                <div className="inneraddLeadsBox">
                                    <div className="form-group">
                                        <label>Agent Name</label>
                                        <input type="text" className="form-control" value={issugAgentName !== "" ? issugAgentName : "Agent Name"} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <input type="text" className="form-control" value={issugPaymentMethod !== "" ? issugPaymentMethod : "Payment Method"} readOnly />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default NotifyBox