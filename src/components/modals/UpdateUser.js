import React, { useEffect, useState } from 'react'
import './assets/css/addUserModal.css'
import logo from '../../assets/images/logoMish.png'
import secureLocalStorage from "react-secure-storage";
import showPwdImg from '../../components/assets/images/show.svg';
import hidePwdImg from '../../components/assets/images/hide.svg';
import { useNavigate } from 'react-router-dom'

// =======================================================================
const config = require('../config.json')


function UpdateUser(props) {
    const [error, setError,] = useState();
    const [loading, setLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const [isRevealPwd, setIsRevealPwd] = useState(false);
    const [getByidErr,setgetByidErr] = useState(false)

    // =====================
    const [isUserName, setUserName] = useState();
    const [fetchIdDesignation, setFetchIdDesignation] = useState([]);
    const [isUserEmail, setUserEmail] = useState();
    const [isUserPwd, setUserPwd] = useState();
    const [getorleOfId, setGetorleOfId] = useState()
    // =========================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    // ===============================
    const navigate = useNavigate()

    async function getByid() {
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
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setFetchIdDesignation(response.data)
                    }
                }).catch((errs) => {
                    setgetByidErr(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setFetchIdDesignation(response.data)
            }
        }).catch((errs) => {
            setgetByidErr(errs.message)
        })
    }
    
    useEffect(() => {
        getByid()
    }, [])


    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    const UpdatingUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/users/UpdateUser`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "name": isUserName ? isUserName : props?.isFullName,
                    "email": isUserEmail ? isUserEmail : props?.isEmail,
                    "id": props?.isUserId,
                    "role_id": getorleOfId ? getorleOfId : props?.isUserRoleId,
                    "view_permission": 0,
                    "edit_permission" : 0,
                    "delete_permission": 0 ,
                    "password": isUserPwd,
                    "number": ""
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/users/UpdateUser`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "name": isUserName ? isUserName : props?.isFullName,
                            "email": isUserEmail ? isUserEmail : props?.isEmail,
                            "id": props?.isUserId,
                            "role_id": getorleOfId ? getorleOfId : props?.isUserRoleId,
                            "view_permission": 0,
                            "edit_permission" : 0,
                            "delete_permission": 0 ,
                            "password": isUserPwd,
                            "number": ""
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        if(response.message == "Email already created."){
                            setLoading(false);
                            setBtnEnaledAndDisabled(false);
                            showAlert(response.message, "warning")
                        }else{
                            setLoading(false);
                            setBtnEnaledAndDisabled(false);
                            showAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                        }
                    }).catch((errs) => {
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(errs.message, "warning")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    if(response.message == "Email already created."){
                        showAlert(response.message, "warning")
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                    }else{
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }
            })
        } catch (error) { 
            setLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert("Something went wrong.", "warning")
        }
    }



    return props.modalShownUpdateUser ? (
        <>
            <div className="addUserModalBox" >
                <div className="addUserBox">
                    <ul>
                        {error && (
                            <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>

                        )}
                        {getByidErr && (
                            <li className={`alert alert-warning` + " " + "mt-4"}>{`${getByidErr}`}</li>
                        )}
                    </ul>
                    <h4>
                        <img src={logo} alt="" className=''/>
                    </h4>
                    <form onSubmit={UpdatingUser}>
                        <div className="addUserScrollBox">
                            <div className="inneraddUserBox">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" placeholder="Name here!" required
                                        onChange={e => setUserName(e.target.value)} 
                                        defaultValue={isUserName ? isUserName : props.isFullName} />
                                </div>
                                <div className="form-group">
                                    <label>User Type</label>
                                    <select onChange={(e) => setGetorleOfId(e.target.value)} className="form-select" required="required">
                                        {fetchIdDesignation?.map((item) => {
                                            // <option value="">Select a user type</option>
                                            <option>
                                                {       
                                                    fetchIdDesignation>0 ?
                                                    fetchIdDesignation.filter(data=>data.role_id==props.isUserType) ?
                                                    fetchIdDesignation.filter(data=>data.role_id==props.isUserType)?.role_name : "Select a user type"
                                                    : "Select a user type"
                                                }
                                            </option>
                                            return (
                                                item.id == 1 ? "" :
                                                    <option key={item.id} value={item.id}>{item.role_name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="inneraddUserBox">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" placeholder="Email here!" required
                                        onChange={e => setUserEmail(e.target.value)} 
                                        defaultValue={isUserEmail ? isUserEmail : props.isEmail}  readOnly/>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input className="form-control" placeholder="Password here!" required
                                        onChange={e => setUserPwd(e.target.value)} value={isUserPwd}
                                        type={isRevealPwd ? "text" : "password"} />
                                    <img
                                        title={isRevealPwd ? "Hide password" : "Show password"}
                                        src={isRevealPwd ? hidePwdImg : showPwdImg}
                                        onClick={() => setIsRevealPwd(prevState => !prevState)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="addUserBtnBox">
                            <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Submit"} </button><br />
                            <button onClick={() => { 
                                setUserName("")
                                setUserEmail("")
                                setGetorleOfId("")
                                props.setisFullName("")
                                props.setUserType("")
                                props.setEmail("")
                                props.close()
                                }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : null
}



export default UpdateUser