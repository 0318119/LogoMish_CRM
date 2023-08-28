import React, { useEffect } from 'react'
import './assets/css/addLeadsModal.css'
import  secureLocalStorage  from  "react-secure-storage";
import { useState } from 'react'
import logo from '../../assets/images/logoMish.png'
import { useNavigate } from 'react-router-dom';
// ================================================
const config = require('../../components/config.json')
// =================================================


function AddTaskModal(props) {
    const [isTitle,setTitle] = useState("")
    const [isSummary,setSummary] = useState("")
    const [isEstimateTime,setEstimateTime] = useState(null)
    const [isAssignTouser,setAssignTouser] = useState(null)
    const [isTaskPriority,setTaskPriority] = useState("")
    const [isProjectId,setProjectId] = useState(null)

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
    const createTask = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/tasks/createTask`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "summary": isSummary,
                "assignee": isAssignTouser,
                "estimated_time": isEstimateTime,
                "project_id": isProjectId,
                "title": isTitle,
                "priority": isTaskPriority
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/tasks/createTask`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "summary": isSummary,
                        "assignee": isAssignTouser,
                        "estimated_time": isEstimateTime,
                        "project_id": isProjectId,
                        "title": isTitle,
                        "priority": isTaskPriority
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
                    console.log("response.failed",response)
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

    var data = {
        "summary": isSummary? isSummary: props?.isSummarySug,
        "assignee":  isAssignTouser? isAssignTouser : props?.isAssignTouserSug?.Assign_id,
        "estimated_time": isEstimateTime? isEstimateTime : props?.isEstimateTimeSug,
        "project_id": isProjectId? isProjectId: props?.isProjectIdSug?.Project_id,
        "title": isTitle? isTitle: props?.isTitleSug,
        "priority": isTaskPriority? isTaskPriority : props?.isTaskPrioritySug,
        "id": props?.isTaskId
    }
    const updateTask = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/tasks/UpdateTasks`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify(data)
        }).then((response) => {
            console.log(response)
            return response.json()
        }).then( async (response) => {
            console.log(response)
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/tasks/UpdateTasks`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify(data)
                }).then(response => {
                    return response.json()
                }).then(response => {
                    console.log(response)
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
                    console.log(errs)
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
            console.log(errs)
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
                    <form onSubmit={props?.isTextEqual == "addNewTask" ? createTask : updateTask}>
                        <div className="leadsScrollBox">
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Task Title</label>
                                    <input type="text" className="form-control" placeholder="Task title here!" required 
                                     onChange={(e) => {setTitle(e.target.value)}}
                                      defaultValue={props?.isTitleSug ? props?.isTitleSug : isTitle}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Task Summary</label>
                                    <input type="text" className="form-control" placeholder="Task summary here!" required 
                                     onChange={(e) => {setSummary(e.target.value)}}
                                      defaultValue={props?.isSummarySug ? props?.isSummarySug : isSummary}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estimate Time</label>
                                    <input type="datetime-local" className="form-control" placeholder="Estimate time here!" required 
                                    onChange={(e) => {setEstimateTime(e.target.value)}}
                                    defaultValue={props?.isEstimateTimeSug ? props?.isEstimateTimeSug : isEstimateTime}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project Name</label>
                                    <select className="form-select" 
                                        onChange={(e)=>setProjectId(e.target.value)} 
                                        defaultValue={props?.isProjectIdSug? props?.isProjectIdSug?.Project_id : isProjectId} 
                                    >
                                        <option selected>{props?.isProjectIdSug?.Project_id? props?.isProjectIdSug?.Project_name : "Select the project name"}</option>
                                        {props.isAllProject?.map((items) => {
                                            return (
                                                <>
                                                 <option  value={items.id}>{items.name}</option>
                                                </>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Assign to user</label>
                                    <select className="form-select" 
                                    onChange={(e)=>setAssignTouser(e.target.value)} 
                                    defaultValue={props?.isAssignTouserSug? props?.isAssignTouserSug?.Assign_id : isAssignTouser}
                                    >
                                        <option selected>{props?.isAssignTouserSug?.Assign_id ? props?.isAssignTouserSug?.Assign_name : "Select the user name"}</option>
                                        {props.isUsers?.map((items) => {
                                            return (
                                                <>
                                                 <option  value={items.id}>{items.name}</option>
                                                </>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select class="form-select" onChange={(e)=> setTaskPriority(e.target.value)}
                                    defaultValue={props?.isTaskPrioritySug? props?.isTaskPrioritySug : isTaskPriority}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option> 
                                        <option value="Normal">Normal</option> 
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="addLeadsBtnBox">
                            <button  type="submit" disabled={btnEnaledAndDisabled}>  
                            {loading ? "A moment please..." : props?.isTextEqual == "addNewTask" ? "Submit" : "Update"}
                            </button>
                            <button onClick={() => { 
                                props?.toggleModal(false)
                                props?.setTitleSug("")
                                props?.setSummarySug("")
                                props?.setEstimateTimeSug("")
                                props?.setAssignTouserSug("")
                                props?.setTaskPrioritySug("")
                                props?.setProjectIdSug("")
                             }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : null
}



export default AddTaskModal