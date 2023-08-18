import React, { useState } from 'react'
import './assets/css/ClientReferModal.css'
import logo from '../../assets/images/logoMish.png'
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
const config = require('../../ClientComponents/Clientconfig.json')


function ClientCreateReferRequest(props) {

    const [isPackage_id, setPackage_id] = useState()
    const [isCustom_package, setCustom_package] = useState();
    const [isPaymentMethod, setPaymentMethod] = useState()
    const [isDescription, setDescription] = useState()
    const [email,setemail]=useState('')
    var get_user_name = secureLocalStorage.getItem("user_name");
    var get_user_email = secureLocalStorage.getItem("user_email");
    var get_phone_number = secureLocalStorage.getItem("phone_number");
    var get_client_id = secureLocalStorage.getItem("client_id");
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const [error, setError,] = useState();
    const [loading, setLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const navigate = useNavigate()


    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    const createReqHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        await fetch(`${config['baseUrl']}/referal/CreateRefer`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "email": email
            })
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/referal/CreateRefer`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "email": email
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        if(response.message == "already created"){
                            showAlert(" 'Already created'! PLease enter a different email", "warning")
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
                }).catch((errs) => {showAlert(errs.message, "warning")})
            }
            else {
                if(response.message == "already created"){
                    showAlert(" 'Already created'! PLease enter a different email", "warning")
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
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }

    return props.modalShow ? (
        <>
            <div className="client_ReferModalBox" >
                <div className="client_ReferBox">
                        <h4>
                            <img src={logo} alt="" className=''/>
                        </h4>
                        <ul>
                        {error && (
                            <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                        )}
                        </ul>
                    <form onSubmit={createReqHandler}>
                        <div className="client_ReferScrollBox">
                            <div className="client_ReferInnerBox">
                                <div className="form-group">
                                    <label>Referal Email</label>
                                    <input onChange={(e)=>setemail(e.target.value)} type="text" 
                                    className="form-control" placeholder="Referal Email" required />
                                </div>
                                </div>
                        </div>
                        <div className="client_ReferBtnBox">
                            <button  type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Submit"}</button>
                            <button onClick={() => { props.close() }}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    ) : null
}

export default ClientCreateReferRequest