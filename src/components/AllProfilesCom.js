import React, { useEffect, useState } from 'react'
import '../components/assets/css/allProfiles.css'
import secureLocalStorage from 'react-secure-storage'
import OrderDataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { BsFileEarmarkPdf as PDF_ico } from "react-icons/bs";
import { FiPrinter as Print_ico } from "react-icons/fi";
import useClipboard from "react-use-clipboard";
import SearchBar from './SearchBar';
import { Tooltip } from "react-tooltip";
const config = require('../components/config.json')


function AllProfilesCom() {
    const [isProfilesData, setProfilesData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError,] = useState();
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_user_name = secureLocalStorage.getItem("user_name")
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isProfilesData));
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);

    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const navigate = useNavigate()

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    async function getAllProfiles() {
        if (get_user_name == "admin") {
            fetch(`${config['baseUrl']}/profile/getProfiles/${parseInt(page)}`, {
                method: "GET",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/profile/getProfiles/${parseInt(page)}`, {
                        method: "GET",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setProfilesData(response.data)
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
                    setProfilesData(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }
            }).catch((errs) => {
                showAlert(errs.message, "warning")
            }).finally(() => { setLoading(false) })
        }
    }
    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getAllProfiles(page)
    }, [page])

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
            name: "Profile",
            grow:0,
            minWidth: "85px",
            selector: (row) => <>
                 <div className="dataTableBox">
                    <img src={`https://payments-api.logomish.com${row.image!==null&&row.image!==undefined&&row.image!==""?row.image.split('/uploads')[1]:""}`} 
                        className='profilePicture'/>
                </div>
            </>
        },
        {
            name: "Name",
            selector: (row) => <>
                <div className='pacDetailsBox'>
                    {row.name? 
                        <span className='mb-2 mt-2 package_name' >
                            {row.name}</span>  :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                </div>
                </>
        },
        {
            name: "Title",
            selector: (row) => 
            <>
                 <div className='pacDetailsBox'>
                    {row.title? 
                        <span className='mb-2 mt-2 package_name' >
                            {row.title}</span>  :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                </div>
            </>
            
            
        },
        {
            name: "Role",
            grow: 0,
            selector: (row) => 
                <>
                    <div className='pacDetailsBox'>
                        {row.role? 
                            <span className='mb-2 mt-2 package_name' >
                                {row.role}</span>  :
                            <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                        }
                    </div>
                </>
            
            
        },
        {
            name: "Number",
            grow: 0,
            left: true,
            selector: (row) => 
            <>
                <div className='pacDetailsBox'>
                    {row.number? 
                        <span className='mb-2 mt-2 package_name' >
                            {row.number}</span>  :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                </div>
            </>
            
        },
        {
            name: "Email",
            selector: (row) => 
            <>
                <div className='pacDetailsBox'>
                    {row.email? 
                        <span className='mb-2 mt-2 package_name' >
                            {row.email}</span>  :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                </div>
            </>
            
        },
        {
            name: "Birthday",
            grow: 0,
            minWidth: "90px",
            selector: (row) => 
            <>
                <div className='pacDetailsBox'>
                    {row.dob? 
                        <span className='mb-2 mt-2 package_name' >
                            {row.dob}</span>  :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                </div>
            </>
           
        }
    ]
    const OrderSearchFilter = (e) => {
        if (e.target.value == ' '){
            setProfilesData(isFilterOrder)
        }else{
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult1 = isFilterOrder.filter(item => 
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.title.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                setProfilesData(filterResult1)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }
    return (
        <>
        <div className="allProfileAdminBox">
            <ul>
                {error && (
                    <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                )}
            </ul>
            <h4 className='MobileViewHead'>User & Client Profiles</h4>
            <div className="innerallProfileAdminBox">
                    <div className="btnBox">
                        <button className='copyBelow' onClick={setCopied}><Copy_ico /></button>
                        {/* <CSVLink data={isOrdersData} filename={"LeadFile.csv"}>CSV</CSVLink> */}
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
                    </div>
                    <h4 className='DesktopViewHead'>User & Client Profiles</h4>
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
                </div>
            )}
            {dataLoader && (
                    <>
                        <OrderDataTable
                            columns={columns}
                            data={[isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,isProfilesData,]}
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
        </div>
        </>
    )
}

export default AllProfilesCom