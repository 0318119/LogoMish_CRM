import React, { useEffect, useState } from "react";
import formImg from "../assets/images/login.svg";
import logo from '../assets/images/logoMish.png'
import "../ClientComponents/assets/css/clientforgotPwdSteps.css";
import showPwdImg from '../ClientComponents/assets/images/show.svg';
import hidePwdImg from '../ClientComponents/assets/images/hide.svg';
import otpImg from '../ClientComponents/assets/images/otpImg.svg'
import { useNavigate } from 'react-router-dom'
import secureLocalStorage from "react-secure-storage";
// =======================================================================
const config = require('../ClientComponents/Clientconfig.json')



function ClientForgotPasswordSteps() {
  const [forgotEmail, setforgotEmail] = useState("");
  const [isOtp, setOtp] = useState();
  // ===============================
  const [error, setError,] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
  // ===================
  const [isFirstStep, setFirstStep] = useState(true)
  const [isScdStep, setScdStep] = useState(false)
  const [isThirdStep, setThirdStep] = useState(false)
  // ===================================
  const [isPassword, setPassword] = useState();
  const [isConfirmPassword, setConfirmPassword] = useState();
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [isConfirmRevealPwd, setIsConfirmRevealPwd] = useState(false);

  // ======================================

  const navigate = useNavigate()

  const showAlert = (message, type) => {
    setError({
      message: message,
      type: type,
    })
  }
  // ============================================
  const HandleFirstStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBtnEnaledAndDisabled(true);
    try {
      await fetch(`${config['baseUrl']}/clients/ForgetPasswordEmailClient`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          "email": forgotEmail
        })
      }).then((response) => {
        return response.json()
      }).then((response) => {
        setLoading(false);
        setBtnEnaledAndDisabled(false);
        if (response.status == 200) {
          showAlert(response.message, "success")
          setTimeout(() => {
            setFirstStep(false)
            setScdStep(true)
            showAlert("", false)
          }, 1000);
        } else {
          showAlert(response.message, "warning")
        }
      })
    } catch (error) {
      showAlert("Something went wrong.", "warning")
      setLoading(false);
      setBtnEnaledAndDisabled(false);
    }

  }

  // ==============================================
  const OtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBtnEnaledAndDisabled(true);
    try {
      await fetch(`${config['baseUrl']}/clients/ForgetPasswordEmailOtpClient`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          "otp": isOtp
        })
      }).then((response) => {
        return response.json()
      }).then((response) => {
        setLoading(false);
        setBtnEnaledAndDisabled(false);
        if (response.status == 200) {
          showAlert(response.message, "success")
          setTimeout(() => {
            setFirstStep(false)
            setScdStep(false)
            setThirdStep(true)
            showAlert("", false)
          }, 1000);
        } else {
          showAlert(response.message, "warning")
        }
      })
    } catch (error) {
      showAlert("Something went wrong.", "warning")
      setLoading(false);
      setBtnEnaledAndDisabled(false);
    }
  }


  // ==============================================
  const pwdChangeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBtnEnaledAndDisabled(true);
    if (isPassword !== isConfirmPassword) {
      showAlert("Your Password not match!", "warning")
      setLoading(false);
      setBtnEnaledAndDisabled(false);
    }
    else {
      try {
        await fetch(`${config['baseUrl']}/clients/ChangePasswordForgetClient`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            "email": forgotEmail,
            "password": isPassword
          })
        }).then((response) => {
          return response.json()
        }).then((response) => {
          setLoading(false);
          setBtnEnaledAndDisabled(false);
          if (response.status == 200) {
            showAlert(response.message, "success")
            setTimeout(() => {
              setFirstStep(false)
              setScdStep(false)
              setThirdStep(true)
              navigate("/ClientLogin")
            }, 1000);
          } else {
            showAlert(response.message, "warning")
          }
        })
      } catch (error) {
        showAlert("Something went wrong.", "warning")
        console.log(error)
        setLoading(false);
        setBtnEnaledAndDisabled(false);
      }
    }
  }


  return (
    <>
      {isFirstStep ?
        <section className="Client_forgotpwdForgotStep">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 p-5">
                <div className="Client_forgotpwdStepsBox">
                  <span className="logoBox">
                    <img src={logo} alt="" />
                  </span>

                  <form onSubmit={HandleFirstStep}>
                    <div className="Client_formtxtBox">
                      <h4>We Are Logo Mish</h4>
                      <span>Welcome back, please login to your account.</span>
                      <ul>
                        {error && (
                          <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                        )}
                      </ul>
                    </div>
                    <div className="form-group mt-5">
                      <label>Email Address*</label>
                      <input type="email"
                        value={forgotEmail}
                        onChange={e => setforgotEmail(e.target.value)}
                        className="form-control" required placeholder="Email Address" />
                    </div>
                    <div className="Client_pwdSentBox mt-5">
                      <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Forgot Password"} </button><br />
                    </div>
                  </form>

                </div>
              </div>

              <div className="col-lg-6 p-2">
                <div className="Client_formImgBox">
                  <img src={formImg} alt="" className="img-fluid" />
                </div>
              </div>


            </div>
          </div>
        </section>
        : null}


      {isScdStep ?
        <section className="Client_otpSection">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-5 Client_otpCol">
                <form className="Client_otpBox" onSubmit={OtpHandler}>
                  <span className="logoBox">
                    <img src={logo} alt="" />
                  </span>
                  <div className="Client_otpImgBox">
                    <img src={otpImg} alt="" />
                  </div>
                  <div className="form-group mt-5">
                    <label >OTP</label>
                    <ul>
                      {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                      )}
                    </ul>
                    <input type="number"
                      value={isOtp}
                      onChange={e => setOtp(e.target.value)}
                      className="mt-4 form-control" required placeholder="Enter Your OTP" />
                  </div>
                  <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Submit"} </button><br />
                </form>
              </div>
            </div>
          </div>
        </section>
        : null}



      {isThirdStep ?
        <section className="Client_forgotpwdChangeStep">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 p-5">
                <div className="Client_forgotpwdChangeStepInnerBox">
                  <span className="logoBox">
                    <img src={logo} alt="" />
                  </span>
                  <form onSubmit={pwdChangeHandler}>
                    <div className="Client_forgotpwdChangeHeadBox">
                      <h4>We Are Logo Mish</h4>
                      <span>Welcome back, please change to your account password.</span>
                      <ul>
                        {error && (
                          <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                        )}
                      </ul>
                    </div>

                    <div className="form-group mt-5">
                      <label>New Password</label>
                      <input type={isRevealPwd ? "text" : "password"}
                        value={isPassword}
                        onChange={e => setPassword(e.target.value)}
                        className="form-control" required placeholder="New Password" />
                      <img
                        title={isRevealPwd ? "Hide password" : "Show password"}
                        src={isRevealPwd ? hidePwdImg : showPwdImg}
                        onClick={() => setIsRevealPwd(prevState => !prevState)}
                      />
                    </div>
                    <div className="form-group mt-5">
                      <label>Confirm Password</label>
                      <input type={isConfirmRevealPwd ? "text" : "password"}
                        value={isConfirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="form-control" required placeholder="Confirm Password" />
                      <img
                        title={isConfirmRevealPwd ? "Hide password" : "Show password"}
                        src={isConfirmRevealPwd ? hidePwdImg : showPwdImg}
                        onClick={() => setIsConfirmRevealPwd(prevState => !prevState)}
                      />
                    </div>

                    <div className="Client_pwdChangebtn mt-5">
                      <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Change Password"} </button><br />
                    </div>

                  </form>

                </div>
              </div>

              <div className="col-lg-6 p-2">
                <div className="Client_formImgBox">
                  <img src={formImg} alt="" className="img-fluid" />
                </div>
              </div>


            </div>
          </div>
        </section>
        : null}
    </>
  );
}

export default ClientForgotPasswordSteps;
