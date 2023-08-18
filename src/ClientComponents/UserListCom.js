import React, { useEffect, useState } from 'react'
import '../ClientComponents/assets/css/userList.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { CSVLink } from "react-csv";
import AddUserModal from './modals/AddUserModal';
import UpdateUser from './modals/UpdateUser';
import  secureLocalStorage  from  "react-secure-storage";
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
// ================================================
const config = require('../ClientComponents/config.json')



function UserListCom() {
    const [modalShownAddUser, toggleModalAddUser] = useState(false);
    const [modalShownUpdateUser, toggleModalUpdateUser] = useState(false);
    const [error, setError,] = useState();
    const [fetchIdDesignation,setFetchIdDesignation] = useState([]);
    const [UserData, setUserData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [getUpdateUser, setUpdateUser] = useState([])
    // =========================
    const [isErrGetUser, setErrGetUser] = useState();
    const [isErrGetroleById , setErrGetroleById] = useState();
    const [isErrDeleteUser, setErrDeleteUser] = useState();
    const [isUserDeleteId, setUserDeleteId] = useState();
    const [isDeleteAlertShow, setDeleteAlertShow] = useState(false);
    // =========================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    // ===============================
    const countPerPage = 5;
    const navigate = useNavigate()
    const [isCopied, setCopied] = useClipboard(JSON.stringify(UserData));
    const showAlert = (message, type) => {
        setError({
          message: message,
          type: type,
        })
      }


    async function getUserData(){
        fetch(`${config['baseUrl']}/users/GetUsers`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.messsage == "unauthorized") {
                fetch(`${config['baseUrl']}/users/GetUsers`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") {navigate('/')}
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setUserData(response.data)
                        setDataLoader(true)
                    }
                }).catch((errs) => {
                    setErrGetUser(errs.message)
                }).finally(() => { setLoading(false)})
            }
            else {
                setUserData(response.data)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setErrGetUser(errs.message)
        }).finally(() => { setLoading(false)})
    }

    async function getRoleByid(){
        fetch(`${config['baseUrl']}/role/getRoles`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.messsage == "unauthorized") {
                fetch(`${config['baseUrl']}/role/getRoles`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") {navigate('/')}
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setFetchIdDesignation(response.data)
                    }
                }).catch((errs) => {
                    setErrGetroleById(errs.messsage)
                })
            }
            else {
                setFetchIdDesignation(response.data)
            }
        }).catch((errs) => {
            setErrGetroleById(errs.messsage)
        })
    }
    
    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1
        },
        {
            name: "Name",
            selector: (row) => <span>{row.name?row.name: "Not Found"}</span>

        },
        {
            name: "Rights",
            selector: (row) => <div>
                {row.view_permission == 1 ? 
             <><span className='persmissionsTag veiwPer'>View Permission</span><br /></>
             :""   
            }
                {row.edit_permission == 1 ? 
             <><span className='persmissionsTag updatePer'>Edit Permission</span><br /></>
             :""   
            }
                {row.delete_permission == 1 ? 
             <><span className='persmissionsTag deletePer'>Delete Permission</span><br /></>
             :""   
            }
            </div>
        },
        {
            name: "Status",
            selector: (row) => <span className='userStatusTag'>{row.role_id ? fetchIdDesignation&&fetchIdDesignation.length>0?fetchIdDesignation.filter(data=>data.id==row.role_id).length>0?fetchIdDesignation.filter(data=>data.id==row.role_id)[0].role_name:"No Status Found":"No Status Found" : "Not Found"}</span>
        },
        {
            name: "Register Date/Time",
            selector: (row) => <span className='registerTimeTag'>
                {row.created_at? <Moment fromNow ago date={row.created_at} /> : "Not Found"}
            </span>
        },
        {
            name : "Actions",
            cell : (row) => <div className='actionsBtns'>
                <button className='upadteBtn' data-key={row.id} onClick={updateUser}>Update</button>
                <button type="submit" className='deletePer' data-key={row.id} onClick={deleteAlert}> Delete </button><br />
            </div>
        }
    ]
    const deleteAlert = async (e) => {
        var deleteID = e.currentTarget.getAttribute('data-key');
        setUserDeleteId(deleteID)
        setDeleteAlertShow(!isDeleteAlertShow)
    }
    const deleteUser = async (e) => {
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
                        if (response.messsage == "timeout error") {navigate('/')}
                        else {
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            showAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch((errs) => {
                        showAlert(errs.message, "success")
                    })
                }
                else {
                    showAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                }
            })
        } catch (error) { showAlert(error.message, "warning")}
    }

    const addUser = () => {
        toggleModalAddUser(!modalShownAddUser);
    }

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
                        if (response.messsage == "timeout error") {navigate('/')}
                        else {
                            secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            setUpdateUser(response.data)
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                            
                        }
                    }).catch((errs) => {
                        showAlert(errs.message, "warning")
                    })
                }
                else {
                    setUpdateUser(response.data)
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            })
        } catch (error) {showAlert(error.message, "warning")}
    }


    useEffect(() => {
        getUserData()
        getRoleByid()
    }, [])


    return (
        <>
        
            <div className="userListBox">
            
                <button className="addUserBtn" onClick={addUser}>Add User</button>
                <div className="innerUserListBox">
                    <div className="btnBox">
                        <button onClick={setCopied}> Copy</button>
                        {/* <CSVLink data={UserData} filename={"LeadFile.csv"}>CSV</CSVLink> */}
                        <button>Excel</button>
                        <button>PDF</button>
                        <button>Print</button>
                    </div>
                    <SearchBar />
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
                            paginationPerPage={countPerPage}
                            paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </>
                )}
               
            </div>
            <AddUserModal close={() => {toggleModalAddUser(false)}}
            {...{modalShownAddUser,}}/>
             <UpdateUser close={() => {toggleModalUpdateUser(false)}}
            {...{modalShownUpdateUser,getUpdateUser}}/>

            {isDeleteAlertShow && (
                <>
                    <div className="userDeleteAlertBox">
                        <div className="userDeleteAlertBoxInner">
                            <span>are you sure, you want to delete this user.</span>
                            <div className="userDeleteBtnBox">
                                <button onClick={deleteUser}>Ok</button>
                                <button onClick={() => { setDeleteAlertShow(false) }} >cancel</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UserListCom