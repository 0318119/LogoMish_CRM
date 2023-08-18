import React, { useEffect } from 'react'
import './assets/css/addLeadsModal.css'
import  secureLocalStorage  from  "react-secure-storage";
import { useState } from 'react'
import logo from '../../assets/images/logoMish.png'
import { useNavigate } from 'react-router-dom';
// ================================================
const config = require('../../components/config.json')
// =================================================


function AddLeadsModal(props) {
    const [isCustomerName, setCustomerName] = useState("");
    const [isEmailAddress, setEmailAddress] = useState("");
    const [isPhoneNumber, setPhoneNumber] = useState("");
    const [isPackageId,setPackageId] = useState(0);
    const [isCustomPackageName, setCustomPackageName] = useState("");
    const [isPrice, setPrice] = useState(0);
    const [isPriceReceived, setPriceReceived] = useState(0);
    const [isAgentName, setAgentName] = useState("");
    const [isPaymentMethod, setPaymentMethod] = useState("");
    const [isbudget,setbudget]= useState(0)
    const [aboutproject,setaboutproject] = useState("")
    const [leadSource,setleadSource] = useState("")
    const [addRemarks,setaddRemarks] = useState("")

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
    const createLeadHandler = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/lead/CreateCustomerLeads`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "cutomer_name": isCustomerName,
                "email": isEmailAddress,
                "number": isPhoneNumber,
                "package_id": isPackageId,
                "custom_package": isCustomPackageName,
                "price": isPrice,
                "user_id": get_user_id,
                "agent_name": isAgentName,
                "payment_method": isPaymentMethod,
                "to_received" : isPriceReceived,
                "budget": isbudget,
                "remarks": addRemarks,
                "about_project" : aboutproject,
                "lead_source": leadSource
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/CreateCustomerLeads`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "cutomer_name": isCustomerName,
                        "email": isEmailAddress,
                        "number": isPhoneNumber,
                        "package_id": isPackageId,
                        "custom_package": isCustomPackageName,
                        "price": isPrice,
                        "user_id": get_user_id,
                        "agent_name": isAgentName,
                        "payment_method": isPaymentMethod,
                        "to_received" : isPriceReceived,
                        "budget": isbudget,
                        "remarks": addRemarks,
                        "about_project" : aboutproject,
                        "lead_source": leadSource
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

    const updateLeadCall = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/lead/UpdateCustomerLeads`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "id" : props.updateLeadId,
                "cutomer_name": isCustomerName || props?.issugCustomerName,
                "email": isEmailAddress || props?.issugEmailAddress,
                "number": isPhoneNumber || props?.issugPhoneNumber,
                "package_id": isPackageId || props?.issugPackageId,
                "custom_package": isCustomPackageName || props?.issugCustomPackageName,
                "price": isPrice || props?.issugPrice,
                "user_id": get_user_id,
                "agent_name": isAgentName || props?.issugAgentName,
                "payment_method": isPaymentMethod || props?.issugPaymentMethod,
                "to_received" : isPriceReceived || props?.issugPriceReceived,
                "budget": isbudget || props?.issugbudget,
                "remarks": addRemarks || props?.issugaddRemarks,
                "about_project" : aboutproject || props?.issugaboutproject,
                "lead_source": leadSource || props?.issugleadSource
            })
        }).then((response) => {
            return response.json()
        }).then( async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/lead/UpdateCustomerLeads`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "id" : props.updateLeadId,
                        "cutomer_name": isCustomerName || props?.issugCustomerName,
                        "email": isEmailAddress || props?.issugEmailAddress,
                        "number": isPhoneNumber || props?.issugPhoneNumber,
                        "package_id": isPackageId || props?.issugPackageId,
                        "custom_package": isCustomPackageName || props?.issugCustomPackageName,
                        "price": isPrice || props?.issugPrice,
                        "user_id": get_user_id,
                        "agent_name": isAgentName || props?.issugAgentName,
                        "payment_method": isPaymentMethod || props?.issugPaymentMethod,
                        "to_received" : isPriceReceived || props?.issugPriceReceived,
                        "budget": isbudget || props?.issugbudget,
                        "remarks": addRemarks || props?.issugaddRemarks,
                        "about_project" : aboutproject || props?.issugaboutproject,
                        "lead_source": leadSource || props?.issugleadSource
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
            }
        }).catch((errs) => {
            setLoading(false);
            setBtnEnaledAndDisabled(false);
            showAlert(errs.message,"warning")
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
                    <form onSubmit={props.updateLeadId!==null && props.isTextEqual=="updateLead"? updateLeadCall : createLeadHandler}>
                        <div className="leadsScrollBox">
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Customer Name</label>
                                    <input type="text" className="form-control" placeholder="Customer Name here!" required 
                                     onChange={(e) => {setCustomerName(e.target.value)}}
                                      defaultValue={isCustomerName ? isCustomerName : props?.issugCustomerName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" className="form-control" placeholder="Email Address here!" required 
                                    onChange={(e) => {setEmailAddress(e.target.value)}} 
                                    defaultValue={isEmailAddress? isEmailAddress : props?.issugEmailAddress  }
                                    />
                                </div>
                            </div>
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="number" className="form-control" placeholder="Phone Number here!" required 
                                     onChange={(e) => {setPhoneNumber(e.target.value)}} 
                                     defaultValue={isPhoneNumber?isPhoneNumber:props?.issugPhoneNumber}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Package</label>
                                    <select className="form-select" onChange={(e)=>setPackageId(e.target.value)} 
                                    defaultValue={isPackageId?isPackageId:props?.issugPackageId}>
                                        <option>
                                            {       
                                                props.isGetAllSubPakages.length>0 ?
                                                props.isGetAllSubPakages.filter(data=>data.package_id==props?.issugPackageId) ?
                                                props.isGetAllSubPakages.filter(data=>data.package_id==props?.issugPackageId)[0]?.name : "Select Packages"
                                                : "Select Packages"
                                            }
                                        </option>

                                        {props.isGetPackages?.map((items) => {
                                            return (
                                                <>
                                                    <option className="valueOptionTag" disabled>{items.name} Packages</option>
                                                    {
                                                        props.isGetAllSubPakages.filter(data=>data.package_id==items.id).map(ii=>(
                                                            <option  value={ii.id}>{ii.name}</option>
                                                        ))
                                                    }
                                                </>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Custom Package Name</label>
                                    <input type="text" className="form-control" placeholder="Custom Package Name!" 
                                    onChange={(e)=>setCustomPackageName(e.target.value) } 
                                    defaultValue={isCustomPackageName?isCustomPackageName : props?.issugCustomPackageName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input type="number" className="form-control" placeholder="Price here!" 
                                    onChange={(e)=>setPrice(e.target.value) } 
                                    defaultValue={isPrice?isPrice : props?.issugPrice}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Budget</label>
                                    <input type="text" className="form-control" placeholder="budget here!" required 
                                    onChange={(e)=>setbudget(e.target.value) } 
                                    defaultValue={isbudget? isbudget:props?.issugbudget}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>About project</label>
                                    <textarea className='form-control' placeholder="About project!" required
                                        onChange={(e)=> setaboutproject(e.target.value) } 
                                        defaultValue={aboutproject? aboutproject : props?.issugaboutproject}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Lead Source</label>
                                    <input type="text" className="form-control" placeholder="Lead Source here!"  
                                    onChange={(e)=>setleadSource(e.target.value) } 
                                    defaultValue={leadSource? leadSource : props?.issugleadSource}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Remarks</label>
                                    <select className="form-select" onChange={(e)=>setaddRemarks(e.target.value) } 
                                    value={addRemarks? addRemarks : props?.issugaddRemarks}>
                                        <option selected disabled value="">Select a Remark</option>
                                        <option value="Voicemail">Voicemail</option>
                                        <option value="Successfull">Successfull</option>
                                        <option value="Followup">Followup</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Amount Received</label>
                                    <input type="number" className="form-control" placeholder="Price here!" 
                                    onChange={(e)=>setPriceReceived(e.target.value) } 
                                    defaultValue={isPriceReceived? isPriceReceived : props?.issugPriceReceived}
                                    />
                                </div>
                            </div>
                            <div className="inneraddLeadsBox">
                                <div className="form-group">
                                    <label>Agent Name</label>
                                    <input type="text" className="form-control" placeholder="Agent Name!"
                                    onChange={(e)=>setAgentName(e.target.value) } 
                                    defaultValue={isAgentName? isAgentName : props?.issugAgentName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select className="form-select" onChange={(e)=>setPaymentMethod(e.target.value)} 
                                        defaultValue={isPaymentMethod? isPaymentMethod : props?.issugPaymentMethod}>
                                        <option selected disabled value="">Select a Payment Method</option>
                                        <option value="paypal">Paypal</option>
                                        <option value="stripe">Stripe</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="addLeadsBtnBox">
                            <button  type="submit" disabled={btnEnaledAndDisabled}>  
                            {loading ? "A moment please..." :props.isTextEqual=="addNewLead"? "Submit" : props.isTextEqual=="updateLead"? "Update" : ""}
                            </button>
                            <button onClick={() => { 
                                props.close()
                                setCustomerName();
                                setEmailAddress();
                                setPhoneNumber();
                                setPackageId();
                                setCustomPackageName();
                                setPriceReceived();
                                setbudget();
                                setaboutproject();
                                setleadSource();
                                setaddRemarks();
                                setPrice();
                                setAgentName();
                                setPaymentMethod();
                             }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : null
}



export default AddLeadsModal