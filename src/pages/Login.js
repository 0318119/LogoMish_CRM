import React, { useState } from "react";
import formImg from "../assets/images/login.svg";
import logo from '../assets/images/logoMish.png'
import "../components/assets/css/login.css";
import showPwdImg from '../components/assets/images/show.svg';
import hidePwdImg from '../components/assets/images/hide.svg';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'
import  secureLocalStorage  from  "react-secure-storage";
import { useCookies } from 'react-cookie';
// =======================================================================
const config = require('../components/config.json')



function Login() {
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
      await fetch(`${config['baseUrl']}/users/Login`, {
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

            secureLocalStorage.setItem("user_name", response.data[0].name);
            var get_user_name = secureLocalStorage.getItem("user_name");

            secureLocalStorage.setItem("user_email", response.data[0].email);
            var get_user_email = secureLocalStorage.getItem("user_email");

            secureLocalStorage.setItem("role_id", response.data[0].role_id);
            var get_user_role_id = secureLocalStorage.getItem("role_id");

            secureLocalStorage.setItem("type", "user");
            var get_user = secureLocalStorage.getItem("type");

            // =====================
            response.data[0].role_id == 1 ?
            window.location.href='/Dashboard'
            // project manager
            : response.data[0].role_id == 2 ?
            window.location.href='/Dashboard'
            // team lead
            : response.data[0].role_id == 3 ?
            window.location.href='/Dashboard'
            // closer
            : response.data[0].role_id == 4 ?
            window.location.href='/Dashboard'
            // back office
            : response.data[0].role_id == 5 ?
            window.location.href='/Dashboard'
            // fresher
            : response.data[0].role_id == 6 ?
            window.location.href='/CustomersList'
            // Lead generation
            : response.data[0].role_id == 7 ?
            window.location.href='/Dashboard'
            :  window.location.href='/'

            
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
      <section className="loginFormSection" >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 p-5">
              <div className="loginFormBox">

                <form onSubmit={HandleLogin}>
                  <div className="formtxtBox">
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
                      value={loginEmail}
                      onChange={(e) => {
                        e.stopPropagation();
                        setloginEmail(e.target.value)
                      }}
                      className="form-control" required />
                  </div>
                  <div className="form-group mt-3 pwdBoxOfLogin">
                    <label>Password*</label>
                    <input value={loginPassword}
                      onChange={(e) => {
                        e.stopPropagation();
                        setloginrPassword(e.target.value)
                      }}
                      type={isRevealPwd ? "text" : "password"}
                      className="form-control" required />
                    <img
                      title={isRevealPwd ? "Hide password" : "Show password"}
                      src={isRevealPwd ? hidePwdImg : showPwdImg}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRevealPwd(!isRevealPwd)
                      }}
                    />
                  </div>
                  <div className="formRememberBox mt-4">
                    <div className="form-check">
                      <input onChange={() => {
                          setCookie('Email', loginEmail, { path: '/' });
                          setCookie('Password', loginPassword, { path: '/' });
                      }} type="checkbox" className="form-check-input" id="Remember" />
                      <label className="form-check-label" htmlFor="Remember">Remember Me</label>
                    </div>
                    <Link to="/ForgotPasswordSteps">Forgot Password?</Link>
                  </div>
                  <div className="signInBtnBox mt-5">
                    <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Sign in"} </button><br />
                  </div>
                </form>

              </div>
            </div>
            <div className="col-lg-6 p-2">
              <div className="formImgBox">
                <img src={formImg} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
