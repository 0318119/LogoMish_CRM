import React, { useState } from 'react'
import '../components/assets/css/CustomersLeads.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { CSVLink } from "react-csv";
import AddLeadsModal from './modals/AddLeadsModal';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// ================================================
import { RxCross2 as Cross_ico } from "react-icons/rx";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { MdDeleteOutline as Delete_ico } from "react-icons/md";
import { BsFillSendFill as MailSent_ico } from "react-icons/bs";
import { AiOutlineAppstoreAdd as AddCommint_ico } from "react-icons/ai";
import { MdViewInAr as ViewCommint_ico } from "react-icons/md";
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico } from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import { CgDanger as Danger_ico } from "react-icons/cg";
import { BiCreditCardFront as View_parials_payment_ico } from "react-icons/bi";
import { MdSystemUpdateAlt as Update_ico } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
// =================================================
const config = require('../components/config.json')


function CustomerLeadCom() {
    const [modalShown, toggleModal] = useState(false);
    const [isLeadDelete, setLeadDelete] = useState(false)
    const [isClosureId, setClosureId] = useState("")
    const [isLeadId, setLeadId] = useState("")
    const [isLeadComment, setLeadComment] = useState(false)
    const [isLeadCommentView, setLeadCommentView] = useState(false)
    const [isUpdatePaymentView, setUpdatePaymentView] = useState(false)
    const [isAddCloserModule, setAddCloserModule] = useState(false)
    const [comments, setcomments] = useState('')
    const [isDeleteId, setDeleteId] = useState()
    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    // =========================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_role = secureLocalStorage.getItem("role_id");

    // ===============================
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isGetPackages, setGetPackages] = useState([]);
    const [isGetClosures, setGetClosures] = useState([]);
    const [isGetComments, setGetComments] = useState([]);
    const [isLeadUpdateSuggestions, setLeadUpdateSuggestions] = useState([])
    //  ===============================================
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLeadsData, setLeadsData] = useState([]);
    const [isOrderLogsData, setOrderLogsData] = useState([]);
    const [isFilterLeads, setFilterLeads] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    // ================================================
    const [isErrGetAllPkgs, setErrGetAllPkgs] = useState();
    const [isErrGetAllClosures, setErrGetAllClosures] = useState();
    const [isErrGetPkgs, setErrGetPkgs] = useState();
    const [isErrGetUserLeads, setErrGetUserLeads] = useState();
    // ================================================
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    // ===============================
    const [isShowLeadAlert, setShowLeadAlert] = useState(false);
    const [isLeadEmailSent, setLeadEmailSent] = useState('')
    const [isAssignLeadResponse, setAssignLeadResponse] = useState('')
    // ===============================
    const [to_received, setto_received] = useState('')
    const [orderLogLeadId, setorderLogLeadId] = useState('')
    // ===============================
    const [error, setError,] = useState(false);
    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    const showAlertScd = (message, type) => {
        setAssignLeadResponse({
            message: message,
            type: type,
        })
    }

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
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetAllSubPakages(response.data)
            }
        }).catch((errs) => {
            setErrGetAllPkgs(errs.message)
        })
    }
    async function getAllOrderLogs() {
        await fetch(`${config['baseUrl']}/orders/GetOrder_logs`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orders/GetOrder_logs`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrderLogsData(response.data)
                }).catch((errs) => {
                    setErrGetAllPkgs(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setOrderLogsData(response.data)
            }
        }).catch((errs) => {
            setErrGetAllPkgs(errs.message)
        })
    }
    async function getAllClosures() {
        await fetch(`${config['baseUrl']}/closures/GetClosures`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/closures/GetClosures`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetClosures(response.data)
                }).catch((errs) => {
                    setErrGetAllClosures(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetClosures(response.data)
            }
        }).catch((errs) => {
            setErrGetAllClosures(errs.message)
        })
    }
    // ==================================
    async function getPackages() {
        await fetch(`${config['baseUrl']}/packages/getPackages`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/packages/getPackages`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetPackages(response.data)
                }).catch((errs) => {
                    setErrGetPkgs(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetPackages(response.data)
            }
        }).catch((errs) => {
            setErrGetPkgs(errs.message)
        })
    }
    // ==================================
    async function getUserLeads() {
        await fetch(`${config['baseUrl']}/lead/GetCustomerLeads/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/GetCustomerLeads/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setLeadsData(response.data)
                    setFilterLeads(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    setErrGetUserLeads(errs.message)
                }).finally(() => { setLoading(false) })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setLeadsData(response.data)
                setFilterLeads(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setErrGetUserLeads(errs.message)
        }).finally(() => { setLoading(false) })
    }
    // ==================================
   
    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderTop: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderBottom: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
    };
    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1,
            grow:0,
            minWidth: "50px",
        },
        {
            name: "Customer Details",
            grow: 0,
            minWidth: "400px",
            left: true,
            selector: (row) => 
            <div className='dataTableBox'>
                <div className='dataTableFlexBox'>
                    <h5>
                        <img src={userImg}/>
                    </h5>
                    <h6>
                        <span data-tooltip-id='row-name' data-tooltip-content={`Name :`+ " " +row.cutomer_name} className='tableName'>  
                            {row.cutomer_name}
                        </span>
                        <span data-tooltip-id='row-email' data-tooltip-content={`Email :`+ " " +row.email} className='tableEmail'>
                            {row.email}
                        </span>
                    </h6>
                </div>
                <Tooltip
                    id="row-name"
                    place="bottom"
                />
                <Tooltip
                    id="row-email"
                    place="bottom"
                />
                <Tooltip
                    id="row-number"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Phone",
            grow: 0,
            left: true,
            selector: (row) => 
            <div className='dataTableBox'>
                {row.number? 
                    <span style={{fontSize: "11px"}}
                        data-tooltip-id='row-number' 
                        data-tooltip-content={`Number :`+ " " +row.number}>{row.number}
                    </span> : <span className="notFoundMsg">Not Found</span>
                }
                 
                
                <Tooltip
                    id="row-number"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Package Details",
            selector: (row) => 
            <div className='pacDetailsBox'>
                    <>
                        {
                            row.package_name || row.price ?
                            <>
                               <span className="mt-2 package_name" data-tooltip-id='package_name' data-tooltip-content={`Package name :`+ " " +row.package_name}>
                                    {row.package_name}
                                </span> 
                                <span data-tooltip-id='amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Amount:`+ " " +`$${row.price}`}>
                                {`$${row.price}`}</span>
                            </>
                            :
                            <span className="notFoundMsg">Not Found</span>
                        }
                    </>
                    <Tooltip
                        id="package_name"
                        place="bottom"
                    />
                    <Tooltip
                        id="amount"
                        place="bottom"
                    />
            </div>
        },
        {
            name: "Payment",
            grow: 0,
            minWidth: "75px",
            selector: (row) =>
                <div className='dataTableBox'>
                    {row.payment_method == "stripe" ?
                        <img src={stripe_logo} alt="" />
                        : row.payment_method == "paypal" ?
                            <img src={paypal_logo} alt="" />
                            : row.payment_method == "upwork" ?
                                <img src={upwork_logo} alt="" />
                                : row.payment_method == "Stripe" ?
                                    <img src={stripe_logo} alt="" />
                                    : row.payment_method == "Paypal" ?
                                        <img src={paypal_logo} alt="" />
                                        : row.payment_method == "Upwork" ?
                                            <img src={upwork_logo} alt="" />
                                            : <span className="notFoundMsg">Not Found</span>
                    }
                </div>
        },
        {
            name: "Agent Name",
            selector: (row) => 
            <div className='pacDetailsBox'>
                {row.agent_name?
                <span className='mb-2 mt-2 package_name' data-tooltip-id='agent_name' data-tooltip-content={`Agent name :`+ " " +row.agent_name}>
                  {row.agent_name}</span>  :
                <span className="mb-2 mt-2 notFoundMsg">Not Found</span>}
                <Tooltip
                    id="agent_name"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Email status",
            selector: (row) => <span>{row.email_sent == 0 ? "Not Sent" : "Sent"}</span>
        },
        {
            name: "Status",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.status ?
                    <span className='mb-2 mt-2 package_name'  data-tooltip-id='status' data-tooltip-content={`status:`+ " " +row.status}
                    >{row.status}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="status"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Remarks status",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.remarks ?
                    <span className='mb-2 mt-2 package_name'
                    >{row.remarks}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="status"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Update Remarks",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <select className="form-select" onChange={(e)=> {
                    updateRemarks(row.id,e.target.value)}}>
                    <option selected disabled value="">Select a Remark</option>
                    <option value="Voicemail">Voicemail</option>
                    <option value="Successfull">Successfull</option>
                    <option value="Followup">Followup</option>
                </select>
            </div>
        },
        {
            name: "Actions",
            grow: 0,
            minWidth: "260px",
            cell: (row) => <div className='dataTableIconBox'>
                <button className='update commintBtn' 
                onClick={() => {
                    getLeadsById(row.id)
                    updateLead(row.id)
                }}
                data-update-id={row.id}><Update_ico/></button>
                {get_role == 1 ? 
                <>
                    <button className='delete deleteAlert' onClick={showAlertDelete} data-id={row.id}><Delete_ico /></button>
                    <button className='sentEmail sentAlert' onClick={sentEmailOfLeads} data-id={row.id}><MailSent_ico /></button>
                    <button className='viewCommints commintBtn' onClick={showAlertCommentView} data-id={row.id}><ViewCommint_ico /></button>
                    <button className='view-partial-payment paymentBtn' onClick={() => {
                        setorderLogLeadId(row.id)
                        setUpdatePaymentView(!isUpdatePaymentView)
                    }} data-id={row.id}><View_parials_payment_ico /></button>
                    <button className='addCommints commintBtn' onClick={showAlertComment} data-id={row.id}><AddCommint_ico /></button>
                </> : <>
                {get_role == 2 || get_role == 3 ?
                    <>
                        <button className='sentEmail sentAlert' onClick={sentEmailOfLeads} data-id={row.id}><MailSent_ico /></button>
                        <button className='viewCommints commintBtn' onClick={showAlertCommentView} data-id={row.id}><ViewCommint_ico /></button>
                        <button className='view-partial-payment paymentBtn' onClick={() => {
                            setorderLogLeadId(row.id)
                            setUpdatePaymentView(!isUpdatePaymentView)
                        }} data-id={row.id}><View_parials_payment_ico /></button>
                        </> : <>
                        {get_role == 4 || get_role == 5 || get_role == 6? 
                            <>
                                <button className='viewCommints commintBtn' onClick={showAlertCommentView} data-id={row.id}><ViewCommint_ico /></button>
                                <button className='addCommints commintBtn' onClick={showAlertComment} data-id={row.id}><AddCommint_ico /></button>
                            </> : <>
                            <span>Not Provide Rights</span>
                            </>    
                        }
                        </>    
                }
                </>   
            }
               <Tooltip
                    anchorSelect=".update"
                    place="bottom"
                    content="Update Lead!"
                />
                <Tooltip
                    anchorSelect=".delete"
                    place="bottom"
                    content="Delete Lead"
                />
                <Tooltip
                    anchorSelect=".sentEmail"
                    place="bottom"
                    content="Sent Email of client"
                />
                <Tooltip
                    anchorSelect=".viewCommints"
                    place="bottom"
                    content="View Commint Box"
                />
                <Tooltip
                    anchorSelect=".view-partial-payment"
                    place="bottom"
                    content="View partial payment"
                />
                <Tooltip
                    anchorSelect=".addCommints"
                    place="bottom"
                    content="Add Commints"
                />
            </div>
        }
    ]

    const [updateLeadId,setupdateLeadId] = useState(null)
    const [isTextEqual,setTextEqual] = useState("")
    const updateLead = async (e) => {
        toggleModal(!modalShown);
        setupdateLeadId(e)
        setTextEqual("updateLead")

    }
    const addNewLead = (e) => {
        toggleModal(!modalShown);
        setTextEqual("addNewLead")
    }

    const addCloserModuleShowOf = () => {
        setAddCloserModule(!isAddCloserModule)
    }
    
    const showAlertDelete = async (e) => {
        var delete_id = e.currentTarget.getAttribute('data-id');
        setDeleteId(delete_id)
        setLeadDelete(!isLeadDelete)
    }
    const showAlertComment = async (e) => {
        var delete_id = e.currentTarget.getAttribute('data-id');
        setDeleteId(delete_id)
        setLeadComment(!isLeadComment)
    }
    const showAlertCommentView = async (e) => {
        var delete_id = e.currentTarget.getAttribute('data-id');
        setDeleteId(delete_id)
        await fetch(`${config['baseUrl']}/comments/getCommentByLeadId/${delete_id}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/comments/getCommentByLeadId/${delete_id}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setGetComments(response.data)
                        setLeadCommentView(!isLeadCommentView)
                    }
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                })
            }
            else {
                setGetComments(response.data)
                setLeadCommentView(!isLeadCommentView)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }
    const AssignLeadToClosure = async (e) => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/closures/AssignLeadToClosure`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "closure_id": isClosureId,
                "id": isLeadId
            })

        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/closures/AssignLeadToClosure`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "closure_id": isClosureId,
                        "id": isLeadId
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setTimeout(() => {
                            showAlertScd("Lead Assign To Closure", "success")
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlertScd("Something went wrong", "warning")
                })
            }
            else {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                setTimeout(() => {
                    showAlertScd("Lead Assign To Closure", "success")
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlertScd("Something went wrong", "warning")
        })
    }
    const sentEmailOfLeads = async (e) => {
        var lead_id = e.currentTarget.getAttribute('data-id');
        await fetch(`${config['baseUrl']}/lead/SendLeadEmail`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "id": lead_id
            })

        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/SendLeadEmail`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "id": lead_id
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setShowLeadAlert(true)
                        setTimeout(() => {
                            setLeadEmailSent("Email sent of customer")
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    setShowLeadAlert(true)
                    setLeadEmailSent(errs.message)
                })
            }
            else {
                setShowLeadAlert(true)
                setTimeout(() => {
                    setLeadEmailSent("Email sent of customer")
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            setShowLeadAlert(true)
            setLeadEmailSent(errs.message)
        })
    }
    const deleteLead = async () => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/lead/DeleteCustomerLeads`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "id": isDeleteId
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/lead/DeleteCustomerLeads`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id": isDeleteId
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        if (response.messsage == "timeout error") { navigate('/') }
                        else {
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            showAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500)
                        }
                    }).catch((errs) => {
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(errs.message, "warning")
                    })
                }
                else {
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    setLeadDelete(false)
                    showAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            })
        } catch (error) {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(error.message, "warning")
        }

    }
    const AddComment = async () => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/comments/CreateComment`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "lead_id": isDeleteId,
                    "comments": comments
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/comments/CreateComment`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "lead_id": isDeleteId,
                            "comments": comments
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        if (response.messsage == "timeout error") { navigate('/') }
                        else {
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            showAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch((errs) => {
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(errs.message, "warning")
                    })
                }
                else {
                    setLeadDelete(false)
                    showAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        } catch (error) {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(error.message, "warning")
        }

    }
    const UpdateReceived = async () => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/lead/UpdateCustomerLeadsReceivedPayment`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "to_received": to_received,
                    "id": orderLogLeadId
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/lead/UpdateCustomerLeadsReceivedPayment`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "to_received": to_received,
                            "id": orderLogLeadId
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        if (response.messsage == "timeout error") { navigate('/') }
                        else {
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            showAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch((errs) => {
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(errs.message, "warning")
                    })
                }
                else {
                    setLeadDelete(false)
                    showAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        } catch (error) {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(error.message, "warning")
        }

    }
    const dismissAlertBox = async () => {
        setShowLeadAlert(false)
    }
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isLeadsData));

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getUserLeads(page)
    }, [page])
    useEffect(() => {
        getAllSubPakages()
        getPackages()
        getAllClosures()
        getAllOrderLogs()
    }, [])

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setLeadsData(isFilterLeads)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterLeads.filter(item => 
                    item.cutomer_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.number.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.package_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    `${item.price}`.includes(e.target.value) ||
                    item.payment_method.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    `${item.total_discount}`.includes(e.target.value) ||
                    `${item.status}`.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.agent_name.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                setLeadsData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    const [isErrGetLeadsById, setErrGetLeadsById] = useState();
    const [issugCustomerName, setsugCustomerName] = useState("");
    const [issugEmailAddress, setsugEmailAddress] = useState("");
    const [issugPhoneNumber, setsugPhoneNumber] = useState("");
    const [issugPackageId,setsugPackageId] = useState("");
    const [issugCustomPackageName, setsugCustomPackageName] = useState("");
    const [issugPrice, setsugPrice] = useState(0);
    const [issugPriceReceived, setsugPriceReceived] = useState(0);
    const [issugAgentName, setsugAgentName] = useState("");
    const [issugPaymentMethod, setsugPaymentMethod] = useState("");
    const [issugbudget,setsugbudget]= useState(null)
    const [issugaboutproject,setsugaboutproject] = useState("")
    const [issugleadSource,setsugleadSource] = useState("")
    const [issugaddRemarks,setsugaddRemarks] = useState("")


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

    const updateRemarks = async (e,rmk) =>{
        await fetch(`${config['baseUrl']}/lead/UpdateCustomerLeadsRemarks`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "id" : e,
                "remarks": rmk,
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/UpdateCustomerLeadsRemarks`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "id" : e,
                        "remarks": rmk,
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") {navigate('/')}
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message,"success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    showAlert(errs.message,"warning")
                })
            }
            else {
                showAlert(response.message,"success")
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message,"warning")
        })
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (isLeadsData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"CUSTOMER LEADS LIST DETAILS",
      pageStyle:"print",
    });

    const handlehideShow=()=>{
        document.getElementById('hidediv').style.display='block'
        setTimeout(() => {
            document.getElementById('hidediv').style.display='none'
        }, 1);
    }

    return (
        <>
            <div className="CusLeadsBox">
                <h4 className='CusLeadsBoxHeadOne'>Customer Leads</h4>
                <div className="innerCusLeadsBox">
                    <div className="btnBox">
                        <button className="addLeadsBtn" onClick={addNewLead}><Add_ico /> Add New Lead</button>
                        <button onClick={setCopied} className='copyBelow'><Copy_ico /></button>
                        <button className='makeExcelFile'onClick={(e)=> {exportToExcel()}}><Excel_ico /></button>
                        <button className='PrintFile' onClick={()=>{
                            handlehideShow()
                            handlePrint()
                        }}><Print_ico /></button>
                        <Tooltip
                            anchorSelect=".copyBelow"
                            place="bottom"
                            content="Copy Below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".makeExcelFile"
                            place="bottom"
                            content="Make Excel File of below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".makePDFFile"
                            place="bottom"
                            content="Make PDF File of below Data"
                            style={{zIndex: "9999"}}
                        />
                        <Tooltip
                            anchorSelect=".PrintFile"
                            place="bottom"
                            content="Print out of below data"
                            style={{zIndex: "9999"}}
                        />
                    </div>
                <h4 className='CusLeadsBoxHeadTwo'>Customer Leads</h4>
                    <SearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "m-3"}>{`${error.message}`}</li>
                    )}
                    {isErrGetAllPkgs && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetAllPkgs}`}</li>
                    )}
                    {isErrGetAllClosures && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isGetClosures}`}</li>
                    )}
                    {isErrGetPkgs && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetPkgs}`}</li>
                    )}
                    {isErrGetUserLeads && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetUserLeads}`}</li>
                    )}
                    {isErrGetLeadsById && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetLeadsById}`}</li>
                    )}
                </ul>
                {loading && (
                    <div className="loaderBox">
                        <div className="loader">
                            <div className="one"></div>
                            <div className="two"></div>
                            <div className="three"></div>
                            <div className="four"></div>
                        </div>
                        {/* <span>Loading...</span> */}
                    </div>
                )}
                {dataLoader && (
                    <>
                        <OrderDataTable
                            columns={columns}
                            data={isLeadsData}
                            highlightOnHover
                            pagination
                            paginationServer
                            paginationTotalRows={Isrows}
                            paginationComponentOptions={{
                                noRowsPerPage: true,
                            }}
                            customStyles={customStyles}
                            onChangePage={handlePageChange}
                        />
                    </>
                )}
                {dataLoader && (
                        <div ref={componentRef}  id='hidediv' style={{display: "none"}}>
                            <table style={{width: "100%"}}>
                            <thead className='printTableHead'>
                                <tr>
                                    <th>Customer Details</th>
                                    <th>Phone</th>
                                    <th>Package Details</th>
                                    <th>Payment</th>
                                    <th>Agent Name</th>
                                    <th>Email status</th>
                                    <th>Remarks status</th>
                                </tr>
                            </thead>
                            <tbody className='printTableBody'>
                                {isLeadsData?.map((items)=> {
                                    console.log(items)
                                    return(
                                        <tr key={items?.id}>
                                            <td style={{display: "flex",flexDirection: "column"}}>
                                                <span>{items?.cutomer_name? items?.cutomer_name : "Not Found Name"}</span>
                                                <span>{items?.email ? items?.email : "Not Found Email"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.number ? items?.number : "Not Found"}</span>
                                            </td>
                                            <td style={{display: "flex",flexDirection: "column"}}>
                                               <span> {items?.package_name ? items?.package_name : "Not Found Package name"}</span>
                                               <span> {items?.price ? `${"$"+items?.price}` : "Not Found Price"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.payment_method ? items?.payment_method : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.agent_name ? items?.agent_name : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.email_sent == 1?  "Sent" : "Not sent"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.remarks ? items?.remarks : "Not Found"}</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                
                            </tbody>
                            </table>
                        </div>
                )}
            </div>
                <AddLeadsModal
                    close={() => { 
                        setsugCustomerName("")
                        setsugEmailAddress("")
                        setsugPhoneNumber("")
                        setsugPackageId("")
                        setsugCustomPackageName("")
                        setsugPrice("")
                        setsugPriceReceived("")
                        setsugbudget("")
                        setsugAgentName("")
                        setsugPaymentMethod("")
                        setsugaboutproject("")
                        setsugleadSource("")
                        setsugaddRemarks("")
                        toggleModal(false)
                     }}
                    {...{ modalShown, isGetPackages, setGetPackages, isGetAllSubPakages, setGetAllSubPakages,
                          updateLeadId,setupdateLeadId,isTextEqual,
                        // ======================================== UPDATE SUGGESTION STATES
                        issugCustomerName,issugEmailAddress,issugPhoneNumber,issugPackageId,issugCustomPackageName,
                        issugPrice,issugbudget,issugaboutproject,issugleadSource,issugPriceReceived,issugAgentName,issugPaymentMethod,
                        issugaddRemarks
                    }}
                />
            {isLeadDelete && (
                <>
                    <div className="deleteAlertBox">
                        <div className="deleteAlertBoxInner">
                            <Cross_ico onClick={() => { setLeadDelete(false) }} className='closeIco' />
                            <div className="deleteAlertIconBox">
                                <Danger_ico />
                            </div>
                            <span>are you sure, you want to delete this lead.</span>
                            <div className="deleteBtnBox">
                                <button onClick={deleteLead} disabled={btnEnaledAndDisabled}>{btnloading ? "A moment please..." : "Delete Lead"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isLeadComment && (
                <>
                    <div className="deleteAlertBox">
                        <div className="deleteAlertBoxInner addCommentBox">
                            <Cross_ico onClick={() => { setLeadComment(false) }} className='closeIco' />
                            <h5 className='commentHead'>Add Comment</h5>
                            <textarea name="" onChange={(e) => setcomments(e.target.value)} className='form-control' id='textareaBox'
                                required={true} placeholder='Add Your Commnet...'></textarea>
                            <div className="deleteBtnBox">
                                <button onClick={AddComment} disabled={btnEnaledAndDisabled}>{btnloading ? "A moment please..." : "Add Commint"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isLeadCommentView && (
                <>
                    <div className="deleteAlertBox">
                        <div className="deleteAlertBoxInner viewCommentBox">
                            <Cross_ico onClick={() => { setLeadCommentView(false) }} className='closeIco' />
                            <div id="viewCommentScrollBox">
                                {
                                    isGetComments && isGetComments.length > 0 ? isGetComments.map((res) => (
                                        <>
                                            <span className='commentDes'>{res.comments}</span>
                                        </>
                                    )) : "No comments"
                                }
                            </div>


                            <div className="deleteBtnBox">
                                <button onClick={() => { setLeadCommentView(false) }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isUpdatePaymentView && (
                <>
                    <div className="deleteAlertBox">
                        <div className="deleteAlertBoxInner viewCommentBox">
                            <Cross_ico onClick={() => { setUpdatePaymentView(false) }} className='closeIco' />
                            <div id="">
                                <table className='table table-bordered'>
                                    <tr  style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        color: "white"
                                    }}>
                                        <th>Total amount</th>
                                        <th>Received amount</th>
                                        <th>Remaining amount</th>
                                    </tr>

                                    {
                                        isOrderLogsData && isOrderLogsData.length > 0 ? isOrderLogsData.filter(data => data.lead_id == orderLogLeadId).map((res) => (
                                            <>
                                                <tr  style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    color: "white"
                                                }}>
                                                    <td>{res.amount}</td>
                                                    <td>{res.received_amount}</td>
                                                    <td>{res.remaining_amount}</td>
                                                </tr>
                                            </>
                                        )) : "No amount"
                                    }
                                </table>
                            </div>
                            <input type="text" className='form-control' onChange={(e) => setto_received(e.target.value)} placeholder='Received Payment' />
                            <div className="deleteBtnBox">
                                <button onClick={UpdateReceived}>Submit</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isShowLeadAlert && (
                <>
                    <div className="showLeadEmailAlertBox">
                        <Cross_ico onClick={dismissAlertBox} />
                        <span>{isLeadEmailSent}</span>
                    </div>
                </>
            )}

            {isAddCloserModule && (
                <div className='addCloserModuleBox'>
                    <div className="addCloserModuleInnerBox">
                        <Cross_ico onClick={() => { setAddCloserModule(false) }} />
                        {isAssignLeadResponse && (
                            <li className={`alert alert-${isAssignLeadResponse.type}` + " " + "m-3"}>{`${isAssignLeadResponse.message}`}</li>
                        )}
                        <div className="form-group">
                            <label>Selet Closer</label>
                            <select onChange={(e) => setClosureId(e.target.value)} className="form-select" required>
                                <option selected disabled>Select a Closer</option>
                                {isGetPackages?.map((items) => {
                                    return (
                                        <>
                                            {
                                                isGetClosures && isGetClosures.length > 0 ? isGetClosures.map(ii => (
                                                    <option value={ii.id}>{ii.name}</option>
                                                )) : <option value="">not found</option>
                                            }
                                        </>
                                    )
                                })}
                            </select>
                            <button onClick={AssignLeadToClosure} disabled={btnEnaledAndDisabled}>{btnloading ? "A moment please..." : "Add Closer"}</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default CustomerLeadCom