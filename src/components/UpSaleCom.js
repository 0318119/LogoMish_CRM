import React, { useState, useEffect, useRef } from 'react'
import '../components/assets/css/customersList.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { RxCross2 as Cross_ico } from "react-icons/rx";
import { useNavigate,Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { Tooltip } from 'react-tooltip';
import { MdViewInAr as View_ico } from "react-icons/md";
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
const config = require('../components/config.json')

function UpSaleCom() {
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()

    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCustomersData, setCustomersData] = useState([]);
    const [isFilterCustomer,setFilterCustomer] = useState([])
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterValue,setFilterValue] = useState("");
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isCustomersData));
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    const [error, setError,] = useState();
    const[isDiscountId,setDiscountId] = useState();
    const[isDiscountModal, setDiscountModal] = useState(false)
    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const[isDiscountMess,setDiscountMess] = useState();
    const[isDisValue,setDisValue] = useState();

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    async function getOrders() {
        await fetch(`${config['baseUrl']}/sales/GetUpSales/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/sales/GetUpSales/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data)
                    getCustomers(response.data)
                    setRows(response.totalRows)
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
                getCustomers(response.data)
               
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        }).finally(() => { setLoading(false) })
    }
    
    async function getCustomers(arr) {
        await fetch(`${config['baseUrl']}/clients/getClients/1000`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/clients/getClients/1000`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    const tempinarray=[]
                    if(arr&&arr.length>0){
                    for(var i of response.data){
                        if(arr.filter(data=>data.email==i.email).length>1){
                            tempinarray.push(i)
                        }
                    }
                }
                    setCustomersData(tempinarray)
                    setFilterCustomer(tempinarray)
                    setRows(tempinarray.length)
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
                const tempinarray=[]
                if(arr&&arr.length>0){
                for(var i of response.data){
                    if(arr.filter(data=>data.email==i.email).length>1){
                        tempinarray.push(i)
                    }
                }
            }
                setRows(tempinarray.length)
                setCustomersData(tempinarray)
                setFilterCustomer(tempinarray)
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
                            <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
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
            name: "Agent Name",
            grow: 0,
            minWidth: "90px",
            selector: (row) => 
            <div className='pacDetailsBox'>
                {row.agent_name?
                <span className='mb-2 mt-2 package_name' data-tooltip-id='agent_name' data-tooltip-content={`Agent name :`+ " " +row.agent_name}>
                 {row.agent_name}</span>  :
                <span className="notFoundMsg">Not Found</span>}
                <Tooltip
                    id="agent_name"
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
            name: "Discount",
            grow: 0,
            minWidth: "100px",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <span data-tooltip-id='total_discount' className='mb-2 mt-2 package_name' data-tooltip-content={`Discount :`+ " " +`$${row.total_discount}`}>
                     {`$`+row.total_discount}</span> 
                     <Tooltip
                    id="total_discount"
                    place="bottom"
                />
            </div>

        },
        {
            name: "Totaol Received",
            grow: 0,
            minWidth: "100px",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <span data-tooltip-id='TotalAmount' className='mb-2 mt-2 package_name' data-tooltip-content={`Totaol Received Amount:`+ " " +`$${row.TotalAmount}`}>
                     {`$`+row.TotalAmount}</span> 
                     <Tooltip
                    id="TotalAmount"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Totaol remaining ",
            grow: 0,
            minWidth: "100px",
            selector: (row) =>
            <div className='pacDetailsBox'>
                <span data-tooltip-id='total_remaining_amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Total remaining amount :`+ " " +`$${row.total_remaining_amount}`}>
                     {`$`+row.total_remaining_amount}</span> 
                     <Tooltip
                    id="total_remaining_amount"
                    place="bottom"
                />
            </div>
        },
        {
            name : "Order Count", 
            selector: (row) =>
            <div className='dataTableIconBox'>
                <span  className='mt-3' data-tooltip-id='emailCheck' data-tooltip-content={`Total Orders :`+ " " + isOrdersData.filter(data=>data.email==row.email).length}>
                   {isOrdersData.filter(data=>data.email==row.email).length}</span> 
                <Tooltip
                    id="emailCheck"
                    place="bottom"
                />
            </div>
        },
        {
            name : "View Order", 
            selector: (row) =>
            <div className='dataTableIconBox'>
                <Link to={`/ViewUpsaleorder?email=${row.email}`} target='_blank' className='mt-2'>
                    <span><View_ico className='OrderViewIco'/></span>
                </Link>
                <Tooltip
                    anchorSelect=".row-View_ico"
                    place="bottom"
                    content="View Up Sales"
                />
            </div>
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
    useEffect( () => {
        getOrders(page)
    }, [page])
    useEffect( () => {
        getCustomers()
    }, [])

    const discountHandler = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/referal/CreateDiscount`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "discount": isDisValue,
                "id": isDiscountId
            })

        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/referal/CreateDiscount`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "discount": isDisValue,
                        "id": isDiscountId
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    setDiscountMess(response.message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }).catch((errs) => {
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    setDiscountMess(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                setDiscountMess(response.message)
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            setDiscountMess(errs.message)
        })
    }
    const makeDiscount = (e) => {
        var discountid = e.currentTarget.getAttribute('data-key');
        setDiscountId(discountid)
        setDiscountModal(!isDiscountModal)
    }

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' '){
            setCustomersData(isFilterCustomer)
        }else{
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterCustomer.filter(item => 
                    item.cutomer_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.number.toLowerCase().includes(e.target.value.toLowerCase())
                    || item.package_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    `${item.price}`.includes(e.target.value) ||
                    item.agent_name.toLowerCase().includes(e.target.value.toLowerCase()) || 
                    item.payment_method.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    `${item.total_discount}`.includes(e.target.value) ||
                    item.created_at.toLowerCase().includes(e.target.value.toLowerCase())
                )
                setCustomersData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (isCustomersData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"Up Sales",
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
            <div className="customersList">
                <h4 className='customersListHeadOne'>Up Sales</h4> 
                <div className="innerCusListBox">
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
                    <h4 className='customersListHeadTwo'>Up Sales</h4> 
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
                        {/* <span>Loading...</span> */}
                    </div>
                )}
                {dataLoader && (
                    <div className='customerDataTableScrollBox'>
                        <OrderDataTable
                            columns={columns}
                            data={isCustomersData}
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
                    </div>
                )}
                {dataLoader && (
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
                                {isCustomersData?.map((items)=> {
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
                )}
            </div>

            {isDiscountModal && (
                <>
                   
                    <div className="customerMakeDiscountModal">
                        <div className="customerMakeDisInnerModalBox">
                                <ul>
                                    {isDiscountMess && (
                                        <li className={`alert alert-success` + " " + "m-3"}>{`${isDiscountMess}`}</li>
                                    )}
                                </ul>
                                <form onSubmit={discountHandler} className='w-100'>
                                <Cross_ico onClick={() => {setDiscountModal(false) }} className='closeIco' />
                                <h4>Create Discount</h4>
                                <div className="form-group w-100">
                                    <input type="number" className="form-control" placeholder="Discount here!" required="true"
                                        onChange={e => setDisValue(e.target.value)} value={isDisValue} />
                                        
                                </div>
                                <div className="cusDisBtnBox">
                                    <button  disabled={btnEnaledAndDisabled}>
                                        {btnloading ? "A moment please..." : "Create Discount"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            </>
            )}
        </>
    )
}

export default UpSaleCom