import React, { useRef, useState } from 'react'
import '../components/assets/css/CustomersLeads.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from 'react-router-dom';
import Pdf from "react-to-pdf";
import { useEffect } from 'react';
// ================================================
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico } from "react-icons/ri";
import { BsFileEarmarkPdf as PDF_ico } from "react-icons/bs";
import { FiPrinter as Print_ico } from "react-icons/fi";
import userImg from '../assets/images/icons/userIco.png'
import { Tooltip } from "react-tooltip";
// =================================================
const config = require('../components/config.json')


function OrderLeadsCom() {
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    // ===============================
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLeadsData, setLeadsData] = useState([]);
    const [isFilterLeads, setFilterLeads] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    // ================================================
    const [isErrGetUserLeads, setErrGetUserLeads] = useState();
    const [isTable,setTable] = useState(false)
    // ================================================
    const navigate = useNavigate()
    const ref = useRef();
    const countPerPage = 5;

    // ==================================
    async function getUserLeads() {
        await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsByUserIdWhichIsInOrder`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            console.log("hellooo1",response)
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/GetCustomerLeadsByUserIdWhichIsInOrder`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setLeadsData(response.data)
                        setFilterLeads(response.data)
                        setDataLoader(true)
                    }
                }).catch((errs) => {
                    setErrGetUserLeads(errs.message)
                }).finally(() => { setLoading(false) })
            }
            else {
                setLeadsData(response.data)
                setFilterLeads(response.data)
                console.log("helloooooo", response)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setErrGetUserLeads(errs.message)
        }).finally(() => { setLoading(false) })
    }
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
                 <span style={{fontSize: "11px"}}
                    data-tooltip-id='row-number' 
                    data-tooltip-content={`Number :`+ " " +row.number}>{row.number}
                </span>
                
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
                            row.package_name ?
                            <span className="mt-2 package_name" data-tooltip-id='package_name' data-tooltip-content={`Package name :`+ " " +row.package_name}>
                                {row.package_name}
                            </span> :
                            <span className="notFoundMsg">Not Found</span>
                        }
                        {
                            row.price ?
                            <span data-tooltip-id='amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Amount:`+ " " +`$${row.price}`}>
                                {`$${row.price}`}</span> :
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
            name: "Total Discount",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <span className='mb-2 mt-2 package_name' data-tooltip-id='total_discount' data-tooltip-content={`Total Discount :`+ " " + `$${row.total_discount}`}>
                    {`$`+row.total_discount}
                </span>
                <Tooltip
                    id="total_discount"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Status",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.status ?
                    <span className='mb-2 mt-2 package_name'data-tooltip-id='status' data-tooltip-content={`status:`+ " " +row.status}
                    >{row.status}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="status"
                    place="bottom"
                />
            </div>
        },
    ]
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isLeadsData));

    useEffect(() => {
        getUserLeads()
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
    const handlehideShow=()=>{
        document.getElementById('hidediv').style.display='block'
        setTimeout(() => {
            document.getElementById('hidediv').style.display='none'
        }, 1);
    }
const copyData = () => {
    setCopied(isLeadsData)
    alert("Data Copy successfully")
}
const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [4,2]
};
    return (
        <>
            <div className="CusLeadsBox">
                <div className="innerCusLeadsBox">
                    <div className="btnBox">
                        <button className='copyBelow' onClick={copyData}><Copy_ico /></button>
                        <button className='makeExcelFile' ><Excel_ico /></button>
                        <Pdf targetRef={ref} filename="document.pdf" options={options} x={100} y={100} scale={2}>
                            {({ toPdf }) => (
                            <button onClick={()=>{
                                handlehideShow()
                                toPdf()
                           }} className="button">
                                Generate PDF
                            </button>
                            )}
                        </Pdf>
                        <button className='makePDFFile'><PDF_ico /></button>
                        <button className='PrintFile'><Print_ico /></button>
                        <Tooltip
                            anchorSelect=".copyBelow"
                            place="bottom"
                            content="Copy Below Data"
                            style={{ zIndex: "9999" }}
                        />
                        <Tooltip
                            anchorSelect=".makeExcelFile"
                            place="bottom"
                            content="Make Excel File of below Data"
                            style={{ zIndex: "9999" }}
                        />
                        <Tooltip
                            anchorSelect=".makePDFFile"
                            place="bottom"
                            content="Make PDF File of below Data"
                            style={{ zIndex: "9999" }}
                        />
                        <Tooltip
                            anchorSelect=".PrintFile"
                            place="bottom"
                            content="Print out of below data"
                            style={{ zIndex: "9999" }}
                        />
                    </div>
                    <SearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
               
                <ul>
                    {isErrGetUserLeads && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetUserLeads.message}`}</li>
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
                    </div>
                )}
                {dataLoader && (
                    <>
                        <OrderDataTable
                            columns={columns}
                            data={isLeadsData}
                            highlightOnHover
                            pagination={false}
                            paginationServer
                            paginationPerPage={countPerPage}
                            paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                            customStyles={customStyles}
                        />
                        <div ref={ref} style={{maxHeight: "500px",display:"none"}} id='hidediv'>
                            <OrderDataTable
                                columns={columns}
                                data={isLeadsData}
                                highlightOnHover
                                pagination={false}
                                paginationServer
                                paginationPerPage={countPerPage}
                                paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                                customStyles={customStyles}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default OrderLeadsCom