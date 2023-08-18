import React,{useState,useEffect} from 'react'
import '../components/assets/css/websiteQuotations.css'
import OrderDataTable from 'react-data-table-component'
import secureLocalStorage from "react-secure-storage";
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { useNavigate,Link } from 'react-router-dom';
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { GrFormView as View_ico } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
const config = require('../components/config.json')



function OrderQuotationsCom() {
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [error, setError,] = useState();
    const [isId,setId] = useState()
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    const navigate = useNavigate()
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isOrdersData));


    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    async function getRequestOrder() {
        await fetch(`${config['baseUrl']}/clients/getClients/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/clients/getClients/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data)
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
                setOrdersData(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
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
                {row.payment_method  == "stripe" ?
                <img src={stripe_logo} alt="" />
                :row.payment_method  == "paypal"?
                <img src={paypal_logo} alt="" />
                :row.payment_method  == "upwork" ?
                <img src={upwork_logo} alt="" />
                :row.payment_method == "Stripe" ?
                <img src={stripe_logo} alt="" />
                :row.payment_method == "Paypal" ?
                <img src={paypal_logo} alt="" />
                :row.payment_method == "Upwork" ?
                <img src={upwork_logo} alt="" />
                :<span className="notFoundMsg">Not Found</span>
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
            name: "Discount",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <span className='mb-2 mt-2 package_name' data-tooltip-id='total_discount' data-tooltip-content={`Discount :`+ " " +`$${row.total_discount}`}>
                     {`$`+row.total_discount}</span> 
                     <Tooltip
                    id="total_discount"
                    place="bottom"
                />
            </div>
        },
        {
            name : "View Request", 
            grow: 0,
            selector: (row) =>
            <div className='dataTableIconBox'>
                <Link to={`/ViewOrderRequest?email=${row.email}`} target='_blank' className='row-View-ico'>
                     <View_ico />
                </Link>
                <Tooltip
                    anchorSelect=".row-View-ico"
                    place="bottom"
                    content="View Oders Request"
                />
            </div>
        //     <div className='dataTableBox'>
        //     {row.invoice ?
        //         <a href={`https://payments-api.logomish.com/${row.invoice}`} target='_blank'>
        //             <span><View_ico className='mr-1' style={{fontSize:"18px"}}/> 
        //             {row.invoice.split('uploads/')[1].slice(0, 7)}
        //             </span> 
        //         </a>
        //         :
        //         <span className="notFoundMsg">Not Found</span>}
        //         <Tooltip
        //             anchorSelect=".row-invoice"
        //             place="bottom"
        //             content="View Invoice"
        //         />
        // </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) =>
            <div className=''>
                {row.created_at?
                 <span>{row.created_at.slice(0,10)}</span>  :
                <span className="notFoundMsg">Not Found</span>}
            </div>
        }
    ]

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getRequestOrder(page)
    }, [page])


    const OrderSearchFilter = (e) => {
        if (e.target.value == ' '){
            setOrdersData(isFilterOrder)
        }else{
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item => 
                item.name.toLowerCase().includes(e.target.value.toLowerCase())
                || item.description.toLowerCase().includes(e.target.value.toLowerCase())
                || item.created_at.toLowerCase().includes(e.target.value.toLowerCase())
                )
                setOrdersData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    const gotoNextPage = async (e) => {
        var get_id = e.currentTarget.getAttribute('data-id');
        var get_client_id = e.currentTarget.getAttribute('data-client-id');
        navigate(`/OrderReply?id=${get_id}&client_id=${get_client_id}`);
    }


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (isOrdersData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"ORDER REQUEST LIST",
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
            <div className="webQuotBox">
                <h4 className='webQuotBoxOne'>Order Request</h4>
                <div className="innerWebQuotBox">
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
                    <h4 className='webQuotBoxTwo'>Order Request</h4>
                    <SearchBar 
                        {...{OrderSearchFilter,isFilterValue}}
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
                    <OrderDataTable
                        columns={columns}
                        data={isOrdersData}
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
                )}
                
                {dataLoader && (
                        <div ref={componentRef}  id='hidediv' style={{display: "none"}}>
                            <table style={{width: "100%"}}>
                            <thead className='printTableHead'>
                                <tr>
                                    <th>Customer Details</th>
                                    <th>Phone</th>
                                    <th>Pack Details</th>
                                    <th>Payment</th>
                                    <th>Agent name</th>
                                    <th>Discount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody className='printTableBody'>
                                {isOrdersData?.map((items)=> {
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
                                                <span>{items?.package_name? items?.package_name : "Not Found Package Name"}</span>
                                                <span>{items?.price ? `${"$"+items?.price}` : "Not Found Price"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.payment_method ? items?.payment_method : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.agent_name ? items?.agent_name : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.total_discount ? `${"$"+items?.total_discount}` : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.created_at ? items?.created_at.slice(0,10) : "Not Found"}</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                
                            </tbody>
                            </table>
                        </div>
                )}
            </div>
        </>
    )
}

export default OrderQuotationsCom