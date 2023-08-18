import React,{useState,useEffect} from 'react'
import '../components/assets/css/websiteQuotations.css'
import OrderDataTable from 'react-data-table-component'
import secureLocalStorage from "react-secure-storage";
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { CSVLink } from "react-csv";
import { useNavigate,useLocation } from 'react-router-dom';
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { BsFileEarmarkPdf as PDF_ico } from "react-icons/bs";
import { FiPrinter as Print_ico } from "react-icons/fi";
import { MdOpenInNew as Description_ico  } from "react-icons/md";
import { FaUserAlt as User_ico } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
const config = require('../components/config.json')



function ViewOrderQuotationsCom() {
    const search = useLocation().search
    var emails = new URLSearchParams(search).get('email')
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [error, setError,] = useState();
    const [isId,setId] = useState()
    const countPerPage = 5;
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
        await fetch(`${config['baseUrl']}/request/getOrderRequestForAdmin`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/getOrderRequestForAdmin`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data.filter(data=>data.email==emails))
                    setFilterOrder(response.data.filter(data=>data.email==emails))
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
                setOrdersData(response.data.filter(data=>data.email==emails))
                setFilterOrder(response.data.filter(data=>data.email==emails))
                setDataLoader(true)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        }).finally(() => { setLoading(false) })
    }

    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1
        },
        {
            name: "Name",
            selector: (row) => 
            <div className='dataTableBox'>
                <span className='row-name Cusname'> <User_ico /> {row.name}</span>
                <Tooltip
                    anchorSelect=".row-name"
                    place="bottom"
                    content="Customer Name"
                />
            </div>

        },
        {
            name: "Description",
            selector: (row) => <div className='dataTableBox' onClick={gotoNextPage} data-id={row.id} data-client-id={row.client_id}>
            {row.description?
                <span className='row-description allOrdersDetailsTag Cusemail'><Description_ico /> {row.description.slice(0,10)}...</span> :
                <span className="notFoundMsg">Not Found</span>}
                <Tooltip
                    anchorSelect=".row-description"
                    place="bottom"
                    content="Description"
                />
            </div>
        },
        {
            name: "Create at",
            selector: (row) => 
            <div className=''>
                {row.created_at?
                <span>{row.created_at.slice(0,10)}</span> :
                <span className="notFoundMsg">Not Found</span>}
            </div>
        }
    ]
    // const [isCopied, setCopied] = useClipboard(JSON.stringify(isOrdersData));

    useEffect(() => {
        getRequestOrder()
    }, [])


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

    return (
        <>
            <div className="webQuotBox">
                <h4 className='webQuotBoxOne'>Order Request Details</h4>
                <div className="innerWebQuotBox">
                    {/* <div className="btnBox">
                        <button className='copyBelow' onClick={setCopied}><Copy_ico /></button>
                        <button className='makeExcelFile'><Excel_ico /></button>
                        <button className='makePDFFile'><PDF_ico /></button>
                        <button className='PrintFile'><Print_ico /></button>
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
                    </div> */}
                    <h4 className='webQuotBoxTwo mx-3'>Order Request Details</h4>
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
                    <OrderDataTable
                        columns={columns}
                        data={isOrdersData}
                        highlightOnHover
                        pagination={false}
                        paginationServer
                        paginationPerPage={countPerPage}
                        paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                    />
                )}
            </div>
        </>
    )
}

export default ViewOrderQuotationsCom