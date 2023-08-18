import React, { useState, useEffect,useRef } from 'react'
import '../components/assets/css/platformSaveOrders.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { RxCross2 as Cross_ico } from "react-icons/rx";
import logo from '../assets/images/logoMish.png'
import { useNavigate,Link } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { FiCopy as Copy_ico } from "react-icons/fi";
import { CgDanger as Danger_ico } from "react-icons/cg";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { BsFileEarmarkPdf as PDF_ico } from "react-icons/bs";
import { FiPrinter as Print_ico } from "react-icons/fi";
import { Tooltip } from 'react-tooltip';
import { FaUserAlt as User_ico } from "react-icons/fa";
import { VscFeedback as FeedBack_ico } from "react-icons/vsc";
import { TbStatusChange as Status_ico } from "react-icons/tb";
import { BiListPlus as Charge_ico } from "react-icons/bi";
import { MdOutlineAttachMoney as Earn_ico } from "react-icons/md";
import { BsHourglassTop as Hours_ico } from "react-icons/bs";
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import { MdDeleteOutline as Delete_ico } from 'react-icons/md';
import { CiEdit as Update_ico } from 'react-icons/ci';
import { DiGoogleCloudPlatform as Platform_ico } from 'react-icons/di';
import { BsCalendar2Date as Date_ico } from 'react-icons/bs';

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';

const config = require('../components/config.json')

function OtherPlatformSaveOrdersCom() {
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [btnloading, setbtnLoading] = useState(false);
    const [isCustomersData, setCustomersData] = useState([]);
    const [isFilterCustomer,setFilterCustomer] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isCustomersData));
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    const [error, setError,] = useState();
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    // =====================================
    var get_user_id = secureLocalStorage.getItem("user_id");
    const [isReference,setReference] = useState("");
    const [isclient_name,setclient_name] = useState("");
    const [isprovider_name,setprovider_name] = useState("");
    const [isstatus,setstatus] = useState("");
    const [isstart_date,setstart_date] = useState(null);
    const [isend_date,setend_date] = useState(null);
    const [istotal_hours,settotal_hours] = useState(null);
    const [istotal_charge,settotal_charge] = useState(null);
    const [istotal_earnings,settotal_earnings] = useState(null);
    const [istotal_hours_billed,settotal_hours_billed] = useState(null);
    const [istotal_charge_billed,settotal_charge_billed] = useState(null);
    const [istotal_earnings_billed,settotal_earnings_billed] = useState(null);
    const [isfeedback,setfeedback] = useState("");
    const [isplatfrom,setplatfrom] = useState("");
    const [isDeleteAlertShow, setDeleteAlertShow] = useState(false);
    const [isSaveAddOrder,setSaveAddOrder] = useState(false)
    const [isScdSaveAddOrder,setScdSaveAddOrder] = useState(false)
    const [isid,setid] = useState(false)

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    async function getSaveOrders() {
        await fetch(`${config['baseUrl']}/order/GetOtherPlatformOrder/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/order/GetOtherPlatformOrder/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setCustomersData(response.data)
                    setFilterCustomer(response.data)
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
                setCustomersData(response.data)
                setFilterCustomer(response.data)
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
            name: "Client Name",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.client_name ?
                    <span className='mb-2 mt-2 package_name'data-tooltip-id='client_name' data-tooltip-content={`Client Name :`+ " " +row.client_name}> 
                    {row.client_name}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="client_name"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Provider Name",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.provider_name ?
                    <span className='mb-2 mt-2 package_name ' data-tooltip-id='provider_name' data-tooltip-content={`Provider Name :`+ " " +row.provider_name}
                    >{row.provider_name}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="provider_name"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Reference",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.reference ?
                    <span className='mb-2 mt-2 package_name 'data-tooltip-id='reference_name' data-tooltip-content={`Reference:`+ " " +row.reference}
                    > {row.reference}</span> :
                    <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="reference_name"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Platfrom",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.platfrom ?
                    <span className='mb-2 mt-2 package_name' data-tooltip-id='platfrom_name' data-tooltip-content={`Platfrom Name:`+ " " +row.platfrom}
                    >{row.platfrom}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="platfrom_name"
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
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="status"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Feedback",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.feedback ?
                    <span className='mb-2 mt-2 package_name' data-tooltip-id='feedback' data-tooltip-content={`Feedback:`+ " " +row.feedback}
                    > {row.feedback}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="feedback"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Total Charge",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_charge ?
                    <span className='mb-2 mt-2 package_name'data-tooltip-id='total_charge' data-tooltip-content={`Total charge:`+ " " +"$"+row.total_charge}
                    >{"$"+row.total_charge}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_charge"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Charge Billed",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_charge_billed ?
                    <span className='mb-2 mt-2 package_name'data-tooltip-id='total_charge_billed' data-tooltip-content={`Total Charge Billed:`+ " " +"$"+row.total_charge_billed}
                    >{"$"+row.total_charge_billed}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_charge_billed"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Total Earnings",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_earnings ?
                    <span className='mb-2 mt-2 package_name'style={{overflow: "hidden",textOverflow: "ellipsis",whiteSpace: "nowrap"}}
                    data-tooltip-id='total_earnings' data-tooltip-content={`Total Earnings:`+ " " +"$"+row.total_earnings}
                    > {"$"+row.total_earnings}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_earnings"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Earnings Billed",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_earnings_billed ?
                    <span className='mb-2 mt-2 package_name'data-tooltip-id='total_earnings_billed' data-tooltip-content={`Total Earnings Billed:`+ " " +"$"+row.total_earnings_billed}
                    > {"$"+row.total_earnings_billed}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_earnings_billed"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Total Hours",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_hours ?
                    <span className='mb-2 mt-2 package_name' data-tooltip-id='total_hours' data-tooltip-content={`Total Hours:`+ " " +row.total_hours}
                    > {row.total_hours}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_hours"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Hours Billed",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {
                    row.total_hours_billed ?
                    <span className='mb-2 mt-2 package_name' data-tooltip-id='total_hours_billed' data-tooltip-content={`Total Hours Billed:`+ " " +"$"+row.total_hours_billed}
                    >{"$"+row.total_hours_billed}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="total_hours_billed"
                    place="bottom"
                />
            </div>
        },
        {
            name: "Action",
            grow: 0,
            minWidth: "120px",
            selector: (row) =>
            <div className='dataTableIconBox'>
                <button className='updateAlert' onClick={openModalUpdate} data-id={row.id}><Update_ico/></button>
                <button className='deleteAlert' onClick={deleteAlert} data-id={row.id}><Delete_ico/></button>
                <Tooltip
                    anchorSelect=".updateAlert"
                    place="bottom"
                    content="Update Order"
                />
                <Tooltip
                    anchorSelect=".deleteAlert"
                    place="bottom"
                    content="Delete Order"
                />
            </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) =>
            <div className=''>
                {
                    row.created_at ?
                    <span>{row.created_at.slice(0,10)}</span> :
                    <span className='notFoundMsg'>Not Found</span>
                }
            </div>
        },
    ]


    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getSaveOrders(page)
    }, [page])


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

    const addSaveOrder = () => {
        setSaveAddOrder(!isSaveAddOrder)
    }
    const createOrder = async (e) =>{
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/order/CreateOtherPlatformOrder`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "user_id": get_user_id,
                "reference": isReference,
                "client_name": isclient_name,
                "provider_name": isprovider_name,
                "status": isstatus,
                "start_date": isstart_date,
                "end_date": isend_date,
                "total_hours": istotal_hours,
                "total_charge": istotal_charge,
                "total_earnings" : istotal_earnings,
                "total_charge_billed" : istotal_charge_billed,
                "total_earnings_billed" : istotal_earnings_billed,
                "feedback" : isfeedback,
                "total_hours_billed":istotal_hours_billed,
                "platfrom" : isplatfrom,
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            console.log(response)
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/order/CreateOtherPlatformOrder`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "user_id": get_user_id,
                        "reference": isReference,
                        "client_name": isclient_name,
                        "provider_name": isprovider_name,
                        "status": isstatus,
                        "start_date": isstart_date,
                        "end_date": isend_date,
                        "total_hours": istotal_hours,
                        "total_charge": istotal_charge,
                        "total_earnings" : istotal_earnings,
                        "total_charge_billed" : istotal_charge_billed,
                        "total_earnings_billed" : istotal_earnings_billed,
                        "feedback" : isfeedback,
                        "total_hours_billed":istotal_hours_billed,
                        "platfrom" : isplatfrom,
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") {navigate('/')}
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message,"warning")
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {console.log("errors", errs)})
            }
            else {
                showAlert(response.message,"success")
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message,"success")
        })
    }
    const openModalUpdate = (e) => {
        var get_id = e.currentTarget.getAttribute('data-id');
        setScdSaveAddOrder(!isScdSaveAddOrder)
        setid(get_id)
    }
    const UpdateOrder = async (e) =>{
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/order/UpdateOtherPlatformOrder`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "user_id": get_user_id,
                "reference": isReference,
                "client_name": isclient_name,
                "provider_name": isprovider_name,
                "status": isstatus,
                "start_date": isstart_date,
                "end_date": isend_date,
                "total_hours": istotal_hours,
                "total_charge": istotal_charge,
                "total_earnings" : istotal_earnings,
                "total_charge_billed" : istotal_charge_billed,
                "total_earnings_billed" : istotal_earnings_billed,
                "feedback" : isfeedback,
                "total_hours_billed":istotal_hours_billed,
                "platfrom" : isplatfrom,
                "id":isid,
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            console.log(response)
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/order/UpdateOtherPlatformOrder`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "user_id": get_user_id,
                        "reference": isReference,
                        "client_name": isclient_name,
                        "provider_name": isprovider_name,
                        "status": isstatus,
                        "start_date": isstart_date,
                        "end_date": isend_date,
                        "total_hours": istotal_hours,
                        "total_charge": istotal_charge,
                        "total_earnings" : istotal_earnings,
                        "total_charge_billed" : istotal_charge_billed,
                        "total_earnings_billed" : istotal_earnings_billed,
                        "feedback" : isfeedback,
                        "total_hours_billed":istotal_hours_billed,
                        "platfrom" : isplatfrom,
                        "id":isid,
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") {navigate('/')}
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message,"warning")
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {console.log("errors", errs)})
            }
            else {
                showAlert(response.message,"success")
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message,"success")
        })
    }

    const deleteAlert = async (e) => {
        var deleteID = e.currentTarget.getAttribute('data-id');
        setid(deleteID)
        setDeleteAlertShow(!isDeleteAlertShow)
        console.log(isid)
    }
    const deleteUser = async (e) => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/order/DeleteOtherPlatformOrder`, {
              method: "POST",
              headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
              body: JSON.stringify({
                "id" : isid
              })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/order/DeleteOtherPlatformOrder`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id" : isid
                          })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        if (response.messsage == "timeout error") {navigate('/')}
                        else {
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            showAlert(response.message,"success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch((errs) => {
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(errs.message,"warning")
                    })
                }
                else {
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlert(response.message,"success")
                    setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                }
            })
        } catch (error) { 
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(error.message,"warning")
        }
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
      documentTitle:"other platForm save orders",
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
            <div className="saveOrderList">
                 <h4 className='saveOrderListHeadOne'>Save Orders</h4> 
                <div className="innersaveOrderList">
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
                    <h4 className='saveOrderListHeadTwo'>Save Orders</h4> 
                    <SearchBar 
                        {...{OrderSearchFilter,isFilterValue}}
                    />
                </div>
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
                                    <th>Customer Name</th>
                                    <th>Provider Name</th>
                                    <th>Reference</th>
                                    <th>Platfrom</th>
                                    <th>Feedback</th>
                                    <th>Total Earnings</th>
                                    <th>Date</th>

                                </tr>
                            </thead>
                            <tbody className='printTableBody'>
                                {isCustomersData?.map((items)=> {
                                    console.log(items)
                                    return(
                                        <tr key={items?.id}>
                                            <td>
                                               <span> {items?.client_name ? items?.client_name : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.provider_name ? items?.provider_name : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.reference ? items?.reference : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.platfrom ? items?.platfrom : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.feedback ? items?.feedback : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.total_earnings ? `${"$"+items?.total_earnings}` : "Not Found"}</span>
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
            {isSaveAddOrder && (
                <>
                    <div className="AddSaveModal">
                        <div className="innerAddSaveModal">
                            <h4>
                                <img src={logo} alt="" />
                            </h4>
                            <ul>
                                {error && (
                                    <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                                )}
                            </ul>
                            <form onSubmit={createOrder}>
                                <div className="AddSaveModalScrollBox">
                                    <div className="form-group">
                                        <label><User_ico /> Reference Name</label>
                                        <input type="text" className="form-control" placeholder="Reference Name here!" required 
                                            onChange={(e) => {setReference(e.target.value)}} value={isReference}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><User_ico /> Client Name</label>
                                        <input type="text" className="form-control" placeholder="Client Name here!" required 
                                            onChange={(e) => {setclient_name(e.target.value)}} value={isclient_name}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><User_ico /> Provider Name</label>
                                        <input type="text" className="form-control" placeholder="Provider Name here!" required 
                                            onChange={(e) => {setprovider_name(e.target.value)}} value={isprovider_name}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Status_ico /> Status</label>
                                        <input type="text" className="form-control" placeholder="Status here!" required 
                                            onChange={(e) => {setstatus(e.target.value)}} value={isstatus}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Date_ico />Start Date</label>
                                        <input type="date" className="form-control" placeholder="Start Date here!" required 
                                            onChange={(e) => {setstart_date(e.target.value)}} value={isstart_date}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Date_ico /> End Date</label>
                                        <input type="date" className="form-control" placeholder="End Date here!" required 
                                            onChange={(e) => {setend_date(e.target.value)}} value={isend_date}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Hours_ico />Total Hours</label>
                                        <input type="number" className="form-control" placeholder="Total Hours here!" required 
                                            onChange={(e) => {settotal_hours(e.target.value)}} value={istotal_hours}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Charge_ico /> Total Charge</label>
                                        <input type="number" className="form-control" placeholder="Total Charge here!" required 
                                            onChange={(e) => {settotal_charge(e.target.value)}} value={istotal_charge}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Earn_ico /> Total Earnings</label>
                                        <input type="number" className="form-control" placeholder="Total Earnings here!" required 
                                            onChange={(e) => {settotal_earnings(e.target.value)}} value={istotal_earnings}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Hours_ico /> Total Hours Billed</label>
                                        <input type="number" className="form-control" placeholder="Total Hours Billed here!" required 
                                            onChange={(e) => {settotal_hours_billed(e.target.value)}} value={istotal_hours_billed}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Charge_ico /> Total Charge Billed</label>
                                        <input type="number" className="form-control" placeholder="Total Charge Billed here!" required 
                                            onChange={(e) => {settotal_charge_billed(e.target.value)}} value={istotal_charge_billed}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Earn_ico />Total Earnings Billed</label>
                                        <input type="number" className="form-control" placeholder="Total Earnings Billed here!" required 
                                            onChange={(e) => {settotal_earnings_billed(e.target.value)}} value={istotal_earnings_billed}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><FeedBack_ico /> Feedback</label>
                                        <input type="text" className="form-control" placeholder="feedback here!" required 
                                            onChange={(e) => {setfeedback(e.target.value)}} value={isfeedback}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Platform_ico /> Platfrom</label>
                                        <input type="text" className="form-control" placeholder="platfrom here!" required 
                                            onChange={(e) => {setplatfrom(e.target.value)}} value={isplatfrom}
                                        />
                                    </div>
                                </div>
                                <div className="AddSaveModalBtnBox">
                                    <button  type="submit" disabled={btnEnaledAndDisabled}>  {btnloading ? "A moment please..." : "Save"}</button>
                                    <button onClick={() => {setSaveAddOrder(false)}}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
            {/* UPDATE MODAL */}
            {isScdSaveAddOrder && (
                <>
                    <div className="AddSaveModal">
                        <div className="innerAddSaveModal">
                            <h4>
                                <img src={logo} alt="" />
                            </h4>
                            <ul>
                                {error && (
                                    <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                                )}
                            </ul>
                                <form onSubmit={UpdateOrder}>
                                    <div className="AddSaveModalScrollBox">
                                        <div className="form-group">
                                            <label><User_ico /> Reference Name</label>
                                            <input type="text" className="form-control" placeholder="Reference Name here!" required 
                                                onChange={(e) => {setReference(e.target.value)}} value={isReference}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><User_ico /> Client Name</label>
                                            <input type="text" className="form-control" placeholder="Client Name here!" required 
                                                onChange={(e) => {setclient_name(e.target.value)}} value={isclient_name}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><User_ico /> Provider Name</label>
                                            <input type="text" className="form-control" placeholder="Provider Name here!" required 
                                                onChange={(e) => {setprovider_name(e.target.value)}} value={isprovider_name}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Status_ico /> Status</label>
                                            <input type="text" className="form-control" placeholder="Status here!" required 
                                                onChange={(e) => {setstatus(e.target.value)}} value={isstatus}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Date_ico />Start Date</label>
                                            <input type="date" className="form-control" placeholder="Start Date here!" required 
                                                onChange={(e) => {setstart_date(e.target.value)}} value={isstart_date}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Date_ico /> End Date</label>
                                            <input type="date" className="form-control" placeholder="End Date here!" required 
                                                onChange={(e) => {setend_date(e.target.value)}} value={isend_date}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Hours_ico />Total Hours</label>
                                            <input type="number" className="form-control" placeholder="Total Hours here!" required 
                                                onChange={(e) => {settotal_hours(e.target.value)}} value={istotal_hours}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Charge_ico /> Total Charge</label>
                                            <input type="number" className="form-control" placeholder="Total Charge here!" required 
                                                onChange={(e) => {settotal_charge(e.target.value)}} value={istotal_charge}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Earn_ico /> Total Earnings</label>
                                            <input type="number" className="form-control" placeholder="Total Earnings here!" required 
                                                onChange={(e) => {settotal_earnings(e.target.value)}} value={istotal_earnings}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Hours_ico /> Total Hours Billed</label>
                                            <input type="number" className="form-control" placeholder="Total Hours Billed here!" required 
                                                onChange={(e) => {settotal_hours_billed(e.target.value)}} value={istotal_hours_billed}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Charge_ico /> Total Charge Billed</label>
                                            <input type="number" className="form-control" placeholder="Total Charge Billed here!" required 
                                                onChange={(e) => {settotal_charge_billed(e.target.value)}} value={istotal_charge_billed}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Earn_ico />Total Earnings Billed</label>
                                            <input type="number" className="form-control" placeholder="Total Earnings Billed here!" required 
                                                onChange={(e) => {settotal_earnings_billed(e.target.value)}} value={istotal_earnings_billed}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><FeedBack_ico /> Feedback</label>
                                            <input type="text" className="form-control" placeholder="feedback here!" required 
                                                onChange={(e) => {setfeedback(e.target.value)}} value={isfeedback}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label><Platform_ico /> Platfrom</label>
                                            <input type="text" className="form-control" placeholder="platfrom here!" required 
                                                onChange={(e) => {setplatfrom(e.target.value)}} value={isplatfrom}
                                            />
                                        </div>
                                    </div>
                                    <div className="AddSaveModalBtnBox">
                                        <button  type="submit" disabled={btnEnaledAndDisabled}>  {btnloading ? "A moment please..." : "Save"}</button>
                                        <button onClick={() => {setScdSaveAddOrder(false)}}>Cancel</button>
                                    </div>
                                </form>
                            
                        </div>
                    </div>
                </>
            )}
            {/* DELETE MODAL */}
            {isDeleteAlertShow && (
                <>
                    <div className="deleteAlertBox">
                        <div className="deleteAlertBoxInner">
                            <ul>
                                {error && (
                                    <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                                )}
                            </ul>
                            <Cross_ico onClick={() => { setDeleteAlertShow(false) }} className='closeIco' />
                            <div className="deleteAlertIconBox">
                                <Danger_ico />
                            </div>
                            <span>are you sure, you want to delete this user.</span>
                            <div className="deleteBtnBox">
                                <button  type="submit" onClick={deleteUser} disabled={btnEnaledAndDisabled}>  {btnloading ? "A moment please..." : "Delete"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default OtherPlatformSaveOrdersCom