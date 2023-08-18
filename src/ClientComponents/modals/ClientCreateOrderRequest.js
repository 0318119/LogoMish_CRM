import React, { useState } from 'react'
import './assets/css/clientcreateModal.css'
import logo from '../../assets/images/logoMish.png'
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
const config = require('../../ClientComponents/Clientconfig.json')


function ClientCreateOrderRequest(props) {

    const [isPackage_id, setPackage_id] = useState()
    const [isCustom_package, setCustom_package] = useState();
    const [isPaymentMethod, setPaymentMethod] = useState()
    const [isDescription, setDescription] = useState()
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
        await fetch(`${config['baseUrl']}/request/CreateOrderRequest`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "name": get_user_name,
                "email" : get_user_email,
                "number" : get_phone_number,
                "package_id" : isPackage_id,
                "custom_package" : isCustom_package,
                "method" : isPaymentMethod,
                "client_id" : get_client_id,
                "description" : isDescription
            })
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/CreateOrderRequest`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "name": get_user_name,
                        "email" : get_user_email,
                        "number" : get_phone_number,
                        "package_id" : isPackage_id,
                        "custom_package" : isCustom_package,
                        "method" : isPaymentMethod,
                        "client_id" : get_client_id,
                        "description" : isDescription
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message, "success")
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {showAlert(errs.message, "warning")})
            }
            else {
                showAlert(response.message, "success")
                setLoading(false);
                setBtnEnaledAndDisabled(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }

    return props.modalShow ? (
        <>
            <div className="client_addOrderModalBox" >
                <div className="client_addOrderBox">
                        <h4>
                            <img src={logo} alt="" className=''/>
                        </h4>
                        <ul>
                        {error && (
                            <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                        )}
                        </ul>
                        <form onSubmit={createReqHandler}>
                            <div className="client_OrderScrollBox">
                                <div className="client_inneraddOrderBox">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="read" className="form-control" 
                                        placeholder="Customer Name here!" value={get_user_name} 
                                        required/>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" className="form-control" placeholder="Email Address here!" value={get_user_email} 
                                        required readOnly
                                        />
                                    </div>
                                </div>
                                <div className="client_inneraddOrderBox">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="number" className="form-control" placeholder="Phone Number here!" value={get_phone_number} 
                                        required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Package</label>
                                        <select className="form-select" required="true" onChange={(e) => { setPackage_id(e.target.value) }}>
                                            <option selected disabled value="">Select a Package</option>
                                            {props.isGetPackages?.map((items,index) => {
                                                return (
                                                    <>
                                                        <option className="valueOptionTag" disabled key={index + 2}>{items.name} Packages</option>
                                                        {
                                                            props.isGetAllSubPakages.filter(data=>data.package_id==items.id).map(ii=>(
                                                                <option  key={index + 4} value={ii.id}>{ii.name}</option>
                                                            ))
                                                        }
                                                    </>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="client_inneraddOrderBox">
                                    <div className="form-group">
                                        <label>Custom Package Name</label>
                                        <input type="text" className="form-control" placeholder="Custom Package Name!" required
                                            onChange={(e) => { setCustom_package(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className="client_inneraddOrderBox">
                                    <div className="form-group">
                                        <label>Payment Method</label>
                                        <select className="form-select" required="true" onChange={(e) => { setPaymentMethod(e.target.value) }}>
                                            <option selected disabled value="">Select a Payment Method</option>
                                            <option value="Paypal">Paypal</option>
                                            <option value="Stripe">Stripe</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="client_inneraddOrderBox">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea className='form-control' required="true" onChange={(e) => { setDescription(e.target.value) }}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="client_orderBtnBox">
                                <button  type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Submit"}</button>
                                <button onClick={() => { props.close() }}>Cancel</button>
                            </div>
                        </form>
                </div>
            </div>
        </>
    ) : null
}

export default ClientCreateOrderRequest