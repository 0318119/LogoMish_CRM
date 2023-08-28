import React, { useEffect } from 'react'
import './assets/css/addLeadsModal.css'
import  secureLocalStorage  from  "react-secure-storage";
import { useState } from 'react'
import logo from '../../assets/images/logoMish.png'
import { useNavigate } from 'react-router-dom';
// ================================================
const config = require('../../components/config.json')
// =================================================


function AddProjectModal(props) {
  const [isProjectName,setProjectName] = useState("")
  const [isProjectDes,setProjectDes] = useState("")

    // =========================
    const [error, setError,] = useState();
    const [loading, setLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    // ==========================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_user_id = secureLocalStorage.getItem("user_id");
    // ===============================
    const navigate = useNavigate()
    // ===============================
    const showAlert = (message, type) => {
        setError({
          message: message,
          type: type,
        })
      }

    // =========================================
    const createProject = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/projects/CreateProjectProcess`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "name": isProjectName,
                "description": isProjectDes
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/projects/CreateProjectProcess`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "name": isProjectName,
                        "description": isProjectDes
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    if(response.failed == "failed"){
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert("Something went wrong!","warning")
                    }else{
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(response.message,"success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlert(errs.message,"warning")
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                if(response.failed == "failed"){
                    showAlert("Something went wrong!","warning")
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                }else{
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlert(response.message,"success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            }
        }).catch((errs) => {
            setLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(errs.message,"warning")
        })
    }
    const updateProject = async (e) =>{
        e.preventDefault();
        // console.log("isProjectName",isProjectName)
        // console.log("isProjectDes",isProjectDes)

        // return
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/projects/UpdateProjectProcess`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "name": props?.isProjectNameSugg ? props?.isProjectNameSugg : isProjectName,
                "description": props?.isProjectDesSugg? props.isProjectDesSugg :  isProjectDes,
                "id": props?.isProjectId
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/projects/UpdateProjectProcess`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "name": props?.isProjectNameSugg ? props?.isProjectNameSugg : isProjectName,
                        "description": props?.isProjectDesSugg? props.isProjectDesSugg :  isProjectDes,
                        "id": props?.isProjectId
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    if(response.failed == "failed"){
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert("Something went wrong!","warning")
                    }else{
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        showAlert(response.messsage,"success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlert(errs.messsage,"warning")
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                if(response.failed == "failed"){
                    showAlert("Something went wrong!","warning")
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                }else{
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                    showAlert(response.messsage,"success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            }
        }).catch((errs) => {
            setLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(errs.messsage,"warning")
        })
    }

    return props.modalShown ? (
        <>
            <div className="addLeadsModalBox" >
                <div className="addLeadsBox">
                    <h4>
                        <img src={logo} alt="" className=''/>
                    </h4>
                    <ul>
                      {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                      )}
                    </ul>
                    <form onSubmit={props?.isTextEqual == "addNewProject" ? createProject : updateProject}>
                        <div className="" style={{zIndex: "9999", padding: "0 15px", position: "relative"}}>
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Project Name</label>
                                    <input type="text" className="form-control" placeholder="Project name here!" required 
                                     onChange={(e) => {setProjectName(e.target.value)}}
                                      defaultValue={props?.isProjectNameSugg ? props?.isProjectNameSugg : isProjectName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project Description</label>
                                    <input type="text" className="form-control" placeholder="Description here!" required 
                                    onChange={(e) => {setProjectDes(e.target.value)}}
                                    defaultValue={props?.isProjectDesSugg ? props?.isProjectDesSugg : isProjectDes}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="addLeadsBtnBox">
                            <button  type="submit" disabled={btnEnaledAndDisabled}>  
                            {loading ? "A moment please..." : props?.isTextEqual == "addNewProject" ? "Submit" : "Update"}
                            </button>
                            <button onClick={() => { 
                                props?.toggleModal(false)
                                props?.setProjectNameSugg("")
                                props?.setProjectDesSugg("")
                                setProjectName("")
                                setProjectDes("")
                             }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : null
}



export default AddProjectModal