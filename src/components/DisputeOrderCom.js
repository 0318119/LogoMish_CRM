import React, { useEffect, useState,useRef } from 'react'
import '../components/assets/css/DisputeOrder.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { useNavigate } from 'react-router-dom';
import { FiCopy as Copy_ico } from "react-icons/fi";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import secureLocalStorage from 'react-secure-storage';
import { Tooltip } from "react-tooltip";
import { GrFormView as View_ico } from "react-icons/gr";
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
const config = require('../components/config.json')


function DisputeOrderCom() {
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError,] = useState();
    const[isDisputeOrder,setDisputeOrder] = useState()
    const navigate = useNavigate()
    const [isFilterOrder, setFilterOrder] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    async function getOrders() {
        await fetch(`${config['baseUrl']}/order/GetOrdersDispute/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/order/GetOrdersDispute/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setDisputeOrder(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                }).finally(() => { setLoading(false) })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setDisputeOrder(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        }).finally(() => { setLoading(false) })
    }

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getOrders(page)
    }, [page])

    const [isCopied, setCopied] = useClipboard(JSON.stringify(isDisputeOrder));
    const countPerPage = 5;
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
                        <span data-tooltip-id='row-name' data-tooltip-content={`Name :`+ " " +row.name} className='tableName'>  
                            {row.name}
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
                            row.amount ?
                            <span data-tooltip-id='amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Amount:`+ " " +`$${row.amount}`}>
                                {`$${row.amount}`}</span> :
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
            name: "Received Amount",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {row.received_amount?
                <span className='mb-2 mt-2 package_name' 
                 data-tooltip-id='received_amount' data-tooltip-content={`Received Amount :`+ " " +`$${row.received_amount}`}>
                   {`$${row.received_amount}`}</span>  :
                <span className="mb-2 mt-2 notFoundMsg">Not Found</span>}
                <Tooltip
                    id="received_amount"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Remaining Amount",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {row.remaining_amount?
                <span className='mb-2 mt-2 package_name'
                 data-tooltip-id='remaining_amount' data-tooltip-content={`Remaining Amount :`+ " " +`$${row.remaining_amount}`}>
                    {`$${row.remaining_amount}`}</span>  :
                <span className="mb-2 mt-2 notFoundMsg">Not Found</span>}
                <Tooltip
                    id="remaining_amount"
                    place="bottom"
                />
            </div>
        },
        {
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.status ?
                    <span  className="mb-2 mt-2 package_name" data-tooltip-id='status' data-tooltip-content={`status:`+ " " +row.status}
                    > {row.status}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="status"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Invoice",
            grow: 0,
            minWidth: "62px",
            selector: (row) =>
            <div className='dataTableIconBox'>
                {row.invoice ?
                    <a href={`https://payments-api.logomish.com${row.invoice!==null&&row.invoice!==undefined&&row.invoice!==""?row.invoice.split('/uploads')[1]:""}`} target='_blank'>
                       <View_ico/>
                    </a>
                    :
                    <span className="notFoundMsg">Not Found</span>}
                    <Tooltip
                        anchorSelect=".row-invoice"
                        place="bottom"
                        content="View Invoice"
                    />
            </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) =>
                <div className=''>
                    {row.created_at ?
                        <span>{row.created_at.slice(0,10)}</span> :
                        <span className="notFoundMsg">Not Found</span>}
                </div>
        },
        
    ]

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setDisputeOrder(isFilterOrder)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item => 
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.email.toLowerCase().includes(e.target.value.toLowerCase())||
                    item.number.toLowerCase().includes(e.target.value.toLowerCase())
                    || item.package_name.toLowerCase().includes(e.target.value.toLowerCase()) || 
                    item.amount.includes(e.target.value) ||
                    `${item.received_amount}`.includes(e.target.value) ||
                    `${item.remaining_amount}`.includes(e.target.value) ||
                    item.payment_method.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.created_at.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.status.toLowerCase().includes(e.target.value.toLowerCase()) 
                    )
                setDisputeOrder(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (isDisputeOrder);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"DISPUTE ORDERS",
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
            <div className="disputeOrders">
            <h4 className='disputeOrdersHeadOne'>dispute Orders</h4>
                <div className="innerDisputeOrdersBox">
                    <div className="btnBox">
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
                    <h4 className='disputeOrdersHeadTwo'>dispute Orders</h4>
                    <SearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
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
                            data={isDisputeOrder}
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
                
                {/* {dataLoader && (
                    <div ref={componentRef}  id='hidediv' style={{display: "none"}}>
                        <table style={{width: "100%"}}>
                        <thead className='printTableHead'>
                            <tr>
                                <th>Customer Details</th>
                                <th>Phone</th>
                                <th>Pack Details</th>
                                <th>Agent name</th>
                                <th>Discount</th>
                                <th>Totaol Received</th>
                                <th>Totaol remaining</th>
                                <th>Payment</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className='printTableBody'>
                            {isDisputeOrder?.map((items)=> {
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
                                            <span> {items?.package_name ? `${"$" + items?.package_name}` : "Not Found package Name"}</span>
                                            <span>{items?.price ? `${"$" + items?.price}` : "Not Found package Price"}</span>
                                        </td>
                                        <td >
                                            <span> {items?.agent_name ? items?.agent_name : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.total_discount ? `${"$" + items?.total_discount}` : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.TotalAmount ? `${"$" + items?.TotalAmount}` : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.total_remaining_amount ? `${"$" + items?.total_remaining_amount}` : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.payment_method}</span>
                                        </td>
                                        <td>
                                            <span>{items?.created_at.slice(0,10)}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                        </table>
                    </div>
                )} */}
            </div>
        </>
    )
}

export default DisputeOrderCom