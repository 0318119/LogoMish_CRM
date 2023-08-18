import React, { useEffect, useState } from 'react'
import '../components/assets/css/userList.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import AddUserModal from './modals/AddUserModal';
import UpdateUser from './modals/UpdateUser';
import { RxCross2 as Cross_ico } from "react-icons/rx";
import  secureLocalStorage  from  "react-secure-storage";
import { useNavigate } from 'react-router-dom';
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico} from "react-icons/ri";
import { BsFileEarmarkPdf as PDF_ico } from "react-icons/bs";
import { FiPrinter as Print_ico } from "react-icons/fi";
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import { CgDanger as Danger_ico } from "react-icons/cg";
import { Tooltip } from "react-tooltip";
import { MdDeleteOutline as Delete_ico } from 'react-icons/md';
import { CiEdit as Update_ico } from 'react-icons/ci';
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import {useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
// ================================================
const config = require('../components/config.json')



function UserListCom() {
    const [modalShownAddUser, toggleModalAddUser] = useState(false);
    const [modalShownUpdateUser, toggleModalUpdateUser] = useState(false);
    const [error, setError,] = useState();
    const [UserData, setUserData] = useState([]);
    const [isFilterUser,setFilterUser] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    // =========================
    const [isErrGetUser, setErrGetUser] = useState();
    const [isErrGetroleById , setErrGetroleById] = useState();
    const [isErrDeleteUser, setErrDeleteUser] = useState();
    const [isUserDeleteId, setUserDeleteId] = useState();
    const [isDeleteAlertShow, setDeleteAlertShow] = useState(false);
    // =========================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_role = secureLocalStorage.getItem("role_id");
    const [isDeleteUserMess,setDeleteUserMess] = useState();
    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")

    // ===============================
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);

    const navigate = useNavigate()
    const [isCopied, setCopied] = useClipboard(JSON.stringify(UserData));

    const showAlert = (message, type) => {
        setError({
          message: message,
          type: type,
        })
      }


    async function getUserData(){
        fetch(`${config['baseUrl']}/users/GetUsers/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.messsage == "unauthorized") {
                fetch(`${config['baseUrl']}/users/GetUsers/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setUserData(response.data)
                    setFilterUser(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    setErrGetUser(errs.message)
                }).finally(() => { setLoading(false)})
            }
            else if(response.messsage == "timeout errorrrr"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setUserData(response.data)
                setFilterUser(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setErrGetUser(errs.message)
        }).finally(() => { setLoading(false)})
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
            name: "Role",
            selector: (row) =>
            <div className='pacDetailsBox'>
                {row.role_name?
                <span className='mb-2 mt-2 package_name' data-tooltip-id='Role' data-tooltip-content={`Role name :`+ " " +row.role_name}>
                    {row.role_name}</span>  :
                <span className="mb-2 mt-2 package_name notFoundMsg">Not Found</span>}
                <Tooltip
                    id="role_name"
                    place="bottom"
                />
            </div>
        },
        {
            name : "Actions",
            grow: 0,
            minWidth: "120px",
            cell : (row) => <div className='dataTableIconBox'>
                {get_role == 1 ?
                    <>
                        <button type="submit" className='updateBtnToolTip updateAlert' data-key={row.id} onClick={updateUser}>
                            <Update_ico />
                        </button> 
                        <button className='deleteBtnToolTip deleteAlert' data-key={row.id} onClick={deleteAlert}>
                        <Delete_ico />
                        </button>
                       
                    </> 
                    : <>{get_role == 2 || get_role == 3 ?
                        <button type="submit" className='deleteBtnToolTip updateAlert' data-key={row.id} onClick={deleteAlert}>
                            <Update_ico />
                        </button>  : <>
                        {get_role == 4 || get_role == 5 || get_role == 6 || get_role == 7 ? 
                        <>
                        <span>Not Provide Rights</span>
                        </> : <>
                        <span>Not Provide Rights</span>
                        </>
                        }
                        </>
                    } </>
            }
                
                <Tooltip
                    anchorSelect=".updateBtnToolTip"
                    place="bottom"
                    content="Update User"
                />
                <Tooltip
                    anchorSelect=".deleteBtnToolTip"
                    place="bottom"
                    content="Delete User"
                />
                
            </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) => <div className=''>
                {row.created_at?
                    <span>{row.created_at.slice(0,10)}</span>   :
                    <span className="notFoundMsg">Not Found</span>
                }
            </div>
        },
    ]
    const deleteAlert = async (e) => {
        var deleteID = e.currentTarget.getAttribute('data-key');
        setUserDeleteId(deleteID)
        setDeleteAlertShow(!isDeleteAlertShow)
    }
    const deleteUser = async (e) => {
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/users/DeleteUser`, {
              method: "POST",
              headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
              body: JSON.stringify({
                "id" : isUserDeleteId
              })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/users/DeleteUser`, {
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
    const addUser = () => {
        toggleModalAddUser(!modalShownAddUser);
    }


    const [isFullName,setisFullName] = useState("")
    const [isUserType,setUserType] = useState("")
    const [isEmail,setEmail] = useState("")
    const [isUserId,setUserId] = useState()
    const [isUserRoleId,setUserRoleId] = useState()


    const updateUser = async (e) => {
        e.preventDefault();
        toggleModalUpdateUser(!modalShownUpdateUser);
        const UpdateID = e.currentTarget.getAttribute('data-key');
        try {
            await fetch(`${config['baseUrl']}/users/GetUserById/${UpdateID}`, {
              method: "GET",
              headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/users/GetUserById/${UpdateID}`, {
                        method: "GET",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                    }).catch((errs) => {
                        showAlert(errs.message, "warning")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    setisFullName(response?.data[0]?.name)
                    setUserType(response?.data[0]?.role_id)
                    setEmail(response?.data[0]?.email)
                    setUserId(response?.data[0].id)
                    setUserRoleId(response?.data[0].role_id)
                }
            })
        } catch (error) {showAlert(error.message, "warning")}
    }

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }

    useEffect(() => {
        getUserData(page)
    }, [page])

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' '){
            setUserData(isFilterUser)
        }else{
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterUser.filter(item => 
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.number.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.role_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.created_at.toLowerCase().includes(e.target.value.toLowerCase())
                )
                setUserData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet (UserData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer= XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs (data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle:"USER LIST DETAILS",
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
        
            <div className="userListBox">
                <h4 className='userListBoxHeadOne'>User List</h4>
                <div className="innerUserListBox">
                    <div className="btnBox">
                        <button className="addUserBtn" onClick={addUser}><Add_ico /> Add User</button>
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
                    <h4 className='userListBoxHeadTwo'>User List</h4>
                    <SearchBar 
                        {...{OrderSearchFilter,isFilterValue}}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "m-3"}>{`${error.message}`}</li>
                    )}
                    {isErrGetUser && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetUser}`}</li>
                    )}
                    {isErrGetroleById && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetroleById}`}</li>
                    )}
                    {isErrGetroleById && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetroleById}`}</li>
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
                            data={UserData}
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
                                <th>Role</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className='printTableBody'>
                            {UserData?.map((items)=> {
                                return(
                                    <tr key={items?.id}>
                                        <td style={{display: "flex", flexDirection: "column"}}>
                                            <span>{items?.cutomer_name? items?.cutomer_name : "Not Found Name"}</span>
                                            <span>{items?.email ? items?.email : "Not Found Email"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.number ? items?.number : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.role_name ? items?.role_name : "Not Found"}</span>
                                        </td>
                                        <td>
                                            <span>{items?.created_at ? items?.created_at.slice(0,10) : "Not Found"}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                        </table>
                    </div>
                )}
               
            </div>
            <AddUserModal close={() => {toggleModalAddUser(false)}}
            {...{modalShownAddUser,}}/>
             <UpdateUser close={() => {
                 toggleModalUpdateUser(false)
            }}
            {...{modalShownUpdateUser,isFullName,isUserType,isEmail,setisFullName,setUserType,setEmail,isUserId,isUserRoleId}}/>

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
                            <span>are you sure, you want to delete this user.</span>
                            <div className="deleteBtnBox">
                                <button onClick={deleteUser} disabled={btnEnaledAndDisabled}>{btnloading ? "A moment please..." : "Delete Lead"}</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            
        </>
    )
}

export default UserListCom