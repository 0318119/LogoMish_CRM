import React, { useState } from 'react'
import showPwdImg from '../components/assets/images/show.svg';
import hidePwdImg from '../components/assets/images/hide.svg';
import logo from '../assets/images/logoMish.png'
import { Link, useNavigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage';
import '../components/assets/css/changePwd.css'
// =======================================================================
const config = require('../components/config.json')

function ChangePwdCom() {
    const [error, setError,] = useState();
    const [loading, setLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()
    const [isClientEmail, setClientEmail] = useState();
    const [isClientOldPwd, setClientOldPwd] = useState();
    const [isClientNewPwd, setClientNewPwd] = useState()
    const [isRevealPwd, setIsRevealPwd] = useState(false);
    const [isConfirmRevealPwd, setIsConfirmRevealPwd] = useState(false);
    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    const changePwd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/users/ChangePasswordForUsers`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "email": isClientEmail,
                    "password": isClientOldPwd,
                    "newpassword": isClientNewPwd
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/users/ChangePasswordForUsers`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "email": isClientEmail,
                            "password": isClientOldPwd,
                            "newpassword": isClientNewPwd
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
                            showAlert(response.messsage, "success")
                            setTimeout(() => {
                                navigate('/Dashboard')
                            }, 1000);
                        }
                    }).catch((errs) => {
                        showAlert(errs.messsage, "warning")
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
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
                        showAlert(response.messsage, "success")
                        setTimeout(() => {
                            navigate('/Dashboard')
                        }, 1000);
                    }
                }
            })
        } catch (error) {
            showAlert(error.messsage, "warning")
            setLoading(false);
            setBtnEnaledAndDisabled(false);
        }
    }
    return (
        <>
            <section className='changePwdSection'>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="changePwdBox">
                                <div className="changePwd_head">
                                    <ul>
                                        {error && (
                                            <li className={`alert alert-${error.type}` + " " + "m-3"}>{`${error.message}`}</li>
                                        )}
                                    </ul>
                                    <span className="logoBox">
                                        <img src={logo} alt="" />
                                    </span>
                                    <h5>We Are Logo Mish</h5>
                                    <span>Welcome back, please change your password</span>
                                </div>
                                <form onSubmit={changePwd}>
                                    
                                    <div className="form-group">
                                        <label htmlFor="">Email Address</label>
                                        <input type="email" className='form-control' required
                                            value={isClientEmail} placeholder='Enter Your Email'
                                            onChange={(e) => { setClientEmail(e.target.value) }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Old Password</label>
                                        <input type={isRevealPwd ? "text" : "password"} className='form-control' required
                                            value={isClientOldPwd} placeholder='Enter Your Old Password'
                                            onChange={(e) => { setClientOldPwd(e.target.value) }}
                                        />
                                        <img
                                            title={isRevealPwd ? "Hide password" : "Show password"}
                                            src={isRevealPwd ? hidePwdImg : showPwdImg}
                                            onClick={() => setIsRevealPwd(prevState => !prevState)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">New Password</label>
                                        <input type={isConfirmRevealPwd ? "text" : "password"} className='form-control' required
                                            value={isClientNewPwd} placeholder='Enter Your New Password'
                                            onChange={(e) => { setClientNewPwd(e.target.value) }}
                                        />
                                        <img
                                            title={isConfirmRevealPwd ? "Hide password" : "Show password"}
                                            src={isConfirmRevealPwd ? hidePwdImg : showPwdImg}
                                            onClick={() => setIsConfirmRevealPwd(prevState => !prevState)}
                                        />
                                    </div>
                                    <div className="changePwdbtnBox">
                                        <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Change Password"} </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ChangePwdCom