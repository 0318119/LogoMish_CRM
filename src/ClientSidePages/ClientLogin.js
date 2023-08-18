import React, { useState } from "react";
import formImg from "../assets/images/login.svg";
import "../ClientComponents/assets/css/ClientLogin.css";
import showPwdImg from '../ClientComponents/assets/images/show.svg';
import hidePwdImg from '../ClientComponents/assets/images/hide.svg';
import logo from '../assets/images/logoMish.png'
import { Link, useNavigate } from 'react-router-dom'
import  secureLocalStorage  from  "react-secure-storage";
import { useCookies } from 'react-cookie';
// =======================================================================
const config = require('../ClientComponents/Clientconfig.json')



function ClientLogin() {
  const [loginEmail, setloginEmail] = useState("");
  const [loginPassword, setloginrPassword] = useState("");
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  // ===============================
  const [error, setError,] = useState();
  const [loading, setLoading] = useState(false);
  const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
  // ===================
  const navigate = useNavigate()

  const showAlert = (message, type) => {
    setError({
      message: message,
      type: type,
    })
  }

  const HandleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBtnEnaledAndDisabled(true);
    try {
      await fetch(`${config['baseUrl']}/clients/Login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          "email": loginEmail,
          "password": loginPassword
        })
      }).then((response) => {
          return response.json()
      }).then((response) => {
          setLoading(false);
          setBtnEnaledAndDisabled(false);
          if (response.success) {
            showAlert(response.message, "success")

            secureLocalStorage.setItem("refresh", response.referesh_token);
            var get_referesh_token = secureLocalStorage.getItem("refresh");

            secureLocalStorage.setItem("access_token", response.access_token);
            var get_access_token = secureLocalStorage.getItem("access_token");

            secureLocalStorage.setItem("user_id", response.data[0].id);
            var get_user_id = secureLocalStorage.getItem("user_id");

            secureLocalStorage.setItem("user_email", response.data[0].email);
            var get_user_email = secureLocalStorage.getItem("user_email");

            secureLocalStorage.setItem("user_name", response.data[0].cutomer_name);
            var get_user_name = secureLocalStorage.getItem("user_name");

            secureLocalStorage.setItem("phone_number", response.data[0].number);
            var get_phone_number = secureLocalStorage.getItem("phone_number");

            secureLocalStorage.setItem("package_id", response.data[0].package_id);
            var get_id = secureLocalStorage.getItem("package_id");

            secureLocalStorage.setItem("custom_package", response.data[0].custom_package);
            var get_custom_package = secureLocalStorage.getItem("custom_package");

            secureLocalStorage.setItem("payment_method", response.data[0].payment_method);
            var get_payment_method = secureLocalStorage.getItem("payment_method");
            
            secureLocalStorage.setItem("client_id", response.data[0].id);
            var get_client_id = secureLocalStorage.getItem("client_id");

            secureLocalStorage.setItem("type", "client");
            var get_user = secureLocalStorage.getItem("type");
            console.log("response",response)

            window.location.href='/ClientDashboard'

          } else {
              showAlert(response.message, "warning")
              setLoading(false);
              setBtnEnaledAndDisabled(false);
          }
      })
    } catch (error) {
        showAlert("Something went wrong.", "warning")
        setLoading(false);
        setBtnEnaledAndDisabled(false);
    }

  }

  return (
    <>
      <section className="client_loginFormSection">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 p-5">
              <div className="client_loginFormBox">

                <form onSubmit={HandleLogin}>
                  <div className="client_formtxtBox">
                    <span className="logoBox">
                      <img src={logo} alt="" />
                    </span>
                    <h4>We Are Logo Mish</h4>
                    <span>Welcome back, please login to your account.</span>
                    <ul>
                      {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                      )}
                    </ul>
                  </div>
                  <div className="form-group mt-5">
                    <label>User Name*</label>
                    <input type="email"
                      id="emplogemail"
                      value={loginEmail} name="registerEmail"
                      onChange={e => setloginEmail(e.target.value)}
                      className="form-control" required />
                  </div>
                  <div className="form-group mt-3 client_pwdBoxOfLogin">
                    <label>Password*</label>
                    <input id="password-field4" value={loginPassword} name="registerPassword"
                      onChange={e => setloginrPassword(e.target.value)}
                      type={isRevealPwd ? "text" : "password"}
                      className="form-control" required />
                    <img
                      title={isRevealPwd ? "Hide password" : "Show password"}
                      src={isRevealPwd ? hidePwdImg : showPwdImg}
                      onClick={() => setIsRevealPwd(!isRevealPwd)}
                    />
                  </div>
                  <div className="client_formRememberBox mt-4">
                    <div className="form-check">
                      <input onChange={() => {
                        setCookie('Email', loginEmail, { path: '/' });
                        setCookie('Password', loginPassword, { path: '/' });
                      }} type="checkbox" className="form-check-input" id="Remember" />
                      <label className="form-check-label" htmlFor="Remember">Remember Me</label>
                    </div>
                    <Link to="/ClientForgotPasswordSteps">Forgot Password?</Link>
                  </div>
                  <div className="client_signInBtnBox mt-5">
                    <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Sign in"} </button><br />
                  </div>
                </form>

              </div>
            </div>
            <div className="col-lg-6 p-2">
              <div className="client_formImgBox">
                <img src={formImg} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ClientLogin;
