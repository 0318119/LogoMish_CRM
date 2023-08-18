import React,{useState,useEffect, useRef} from 'react'
import '../components/assets/css/websiteQuotations.css'
import OrderDataTable from 'react-data-table-component'
import secureLocalStorage from "react-secure-storage";
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { RxCross2 as Cross_ico } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import { MdDiscount as Discount_ico } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import userImg from '../assets/images/icons/userIco.png'
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
const config = require('../components/config.json')



function ReferComp() {
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [error, setError,] = useState();
    const[isDiscountId,setDiscountId] = useState();
    const[isDiscountModal, setDiscountModal] = useState(false)
    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const[isDiscountMess,setDiscountMess] = useState();
    const[isDisValue,setDisValue] = useState();
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
        await fetch(`${config['baseUrl']}/referal/getRefersForAdmin/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/referal/getRefersForAdmin/${parseInt(page)}`, {
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
            name: "Client Details",
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
                        <span data-tooltip-id='row-email' data-tooltip-content={`Email :`+ " " +row.client_email} className='tableEmail'>
                            {row.client_email}
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
            name: "Refer Email",
            selector: (row) => <div className='dataTableBox'>
                {row.email?
                <span className=''data-tooltip-id='emailInfo' data-tooltip-content={`Email :`+ " " +row.email}>
                   {row.email}</span> :
                 <span className="notFoundMsg">Not Found</span>}
                  <Tooltip
                    id="emailInfo"
                    place="bottom"
                />
            </div>
        },
        {
            name : "Create Discount", 
            grow: 0,
            minWidth: "120px",
            selector: (row) =>
            <div className='dataTableIconBox'>
                <button className='makeDiscount' onClick={makeDiscount}  data-key={row.client_id} >
                    <Discount_ico className='fileViewIcon'/>
                </button>
                <Tooltip
                    anchorSelect=".makeDiscount"
                    place="bottom"
                    content="Make Discount"
                />
            </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) => 
            <div className=''>
                {row.updated_at?
                <span>{row.created_at.slice(0,10)}</span> :
                <span className="notFoundMsg">Not Found</span>}
            </div>
        },
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
                    item.cutomer_name.toLowerCase().includes(e.target.value.toLowerCase())
                    || item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.client_email.toLowerCase().includes(e.target.value.toLowerCase()) 
                    ||  item.created_at.toLowerCase().includes(e.target.value.toLowerCase()) 
                )

                setOrdersData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

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
      documentTitle:"Refer List",
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
                <h4 className='webQuotBoxOne'>Refer Details</h4>
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
                    <h4 className='webQuotBoxTwo'>Refer Details</h4>
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
                                    <th>Client Details</th>
                                    <th>Refer Email</th>
                                </tr>
                            </thead>
                            <tbody className='printTableBody'>
                                {isOrdersData?.map((items)=> {
                                    console.log(items)
                                    return(
                                        <tr key={items?.id}>
                                            <td style={{display: "flex",flexDirection: "column"}}>
                                                <span>{items?.cutomer_name? items?.cutomer_name : "Not Found Name"}</span>
                                                <span>{items?.client_email? items?.client_email : "Not Found Email"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.email ? items?.email : "Not Found Email"}</span>
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

export default ReferComp