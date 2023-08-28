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
import { MdDeleteOutline as Delete_ico } from 'react-icons/md';
import { CiEdit as Update_ico } from 'react-icons/ci';
import { GrFormView as View_ico } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import userImg from '../assets/images/icons/userIco.png'
import { RxCross2 as Cross_ico } from "react-icons/rx";
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import { CgDanger as Danger_ico } from "react-icons/cg";
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import AddProjectModal from './modals/AddProjectModal';
const config = require('../components/config.json')



function AddProjectCom() {
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [error, setError,] = useState();
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    const [modalShown, toggleModal] = useState(false);
    const [isTextEqual,setTextEqual] = useState("")
    const navigate = useNavigate()
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const [isCopied, setCopied] = useClipboard(JSON.stringify(isOrdersData));
    const [isErrGetLeadsById, setErrGetLeadsById] = useState();

    const [isProjectNameSugg,setProjectNameSugg] = useState("")
    const [isProjectDesSugg,setProjectDesSugg] = useState("")
    const [isProjectId,setProjectId] = useState(null)

    const [isDeleteAlertShow, setDeleteAlertShow] = useState(false);
    const [isUserDeleteId, setUserDeleteId] = useState();
    const [isDeleteUserMess,setDeleteUserMess] = useState();

    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")



    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    async function getRequestOrder() {
        await fetch(`${config['baseUrl']}/projects/getProjectProcess/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/projects/getProjectProcess/${parseInt(page)}`, {
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
            name: "Name",
            selector: (row) => 
            <div className='pacDetailsBox'>
                {row.name?
                <span className='mb-2 mt-2 package_name'>
                  {row.name}</span>  :
                <span className="mb-2 mt-2 notFoundMsg">Not Found</span>}
            </div>
        },
        {
            name: "Description",
            grow: 0,
            minWidth: "400px",
            left: true,
            selector: (row) => 
            <div className='pacDetailsBox'>
                {row.description?
                <span className='mb-2 mt-2 package_name'>
                {row.description}</span>  :
                <span className="mb-2 mt-2 notFoundMsg">Not Found</span>}
            </div>
         
        },
        {
            name : "Actions",
            grow: 0,
            minWidth: "120px",
            cell : (row) => 
            <div className='dataTableIconBox'
            onClick={(e)=> {
                getProjectSugg(row.id)
                toggleModal(!modalShown);
            }}
            >
                <button type="submit" className='updateAlert'>
                    <Update_ico />
                </button> 
                <button className='deleteAlert' data-key={row.id} onClick={deleteAlert}>
                    <Delete_ico />
                </button>
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
    


    const getProjectSugg = async (e) => {
        await fetch(`${config['baseUrl']}/projects/getProjectProcessById/${e}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/projects/getProjectProcessById/${e}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setProjectNameSugg(response?.data?.[0]?.name)
                        setProjectDesSugg(response?.data?.[0]?.description)
                        setProjectId(response?.data?.[0]?.id)
                    }
                }).catch((errs) => {
                    setErrGetLeadsById(errs.message)
                })
            }
            else {
                setProjectNameSugg(response?.data?.[0]?.name)
                setProjectDesSugg(response?.data?.[0]?.description)
                setProjectId(response?.data?.[0]?.id)
            }
        }).catch((errs) => {
            setErrGetLeadsById(errs.message)
        })
    }
    const addProject = (e) => {
        toggleModal(!modalShown);
        setTextEqual("addNewProject")
    }

    const deleteAlert = async (e) => {
        var deleteID = e.currentTarget.getAttribute('data-key');
        setUserDeleteId(deleteID)
        setDeleteAlertShow(!isDeleteAlertShow)
    }


    const deleteProject = async (e) => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/projects/DeleteProjectProcess`, {
              method: "POST",
              headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
              body: JSON.stringify({
                "id" : isUserDeleteId
              })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/projects/DeleteProjectProcess`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id" : isUserDeleteId
                          })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setDeleteUserMess(response.message)
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }).catch((errs) => {
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setDeleteUserMess(errs.message)
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
                    setDeleteUserMess(response.message)
                    setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                }
            })
        } catch (error) { 
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            setDeleteUserMess(error.message)
        }
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
                <h4 className='webQuotBoxOne'>Add Project</h4>
                <div className="innerWebQuotBox">
                    <div className="btnBox">
                        <button onClick={addProject}><Add_ico/> Add Project</button>
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
                    <h4 className='webQuotBoxTwo'>Add Project</h4>
                    <SearchBar 
                        {...{OrderSearchFilter,isFilterValue}}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
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
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody className='printTableBody'>
                                {isOrdersData?.map((items)=> {
                                    return(
                                        <tr key={items?.id}>
                                            <td>
                                               <span> {items?.name ? items?.name : "Not Found"}</span>
                                            </td>
                                            <td>
                                               <span> {items?.description ? items?.description : "Not Found"}</span>
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
                <AddProjectModal
                    {...{
                        isTextEqual,modalShown,toggleModal,
                        isProjectNameSugg,isProjectDesSugg,isProjectId,
                        setProjectNameSugg,setProjectDesSugg,setProjectId
                    }}
                />
            </div>

            

            {isDeleteAlertShow && (
                <>
                    <div className="deleteAlertBox">
                   
                        <div className="deleteAlertBoxInner">
                            <Cross_ico onClick={() => { setDeleteAlertShow(false) }} className='closeIco' />
                            <ul>
                                {isDeleteUserMess && (
                                    <li className={`alert alert-warning` + " " + "m-3"}>{isDeleteUserMess}</li>
                                )}
                            </ul>
                            <div className="deleteAlertIconBox">
                                <Danger_ico />
                            </div>
                            <span>are you sure, you want to delete this Project.</span>
                            <div className="deleteBtnBox">
                                <button onClick={deleteProject} disabled={btnEnaledAndDisabled}>{btnloading ? "A moment please..." : "Delete Project"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default AddProjectCom