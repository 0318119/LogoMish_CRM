import React from "react";
import formImg from "../assets/images/login.svg";
import "../components/assets/css/register.css";

const Register = () => {
  return (
    <section className="registerFormSection">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 p-5">
            <div className="registerFormBox">
              <form action="/Dashboard">
                <div className="formtxtBox">
                  <h4>We Are Logo Mish</h4>
                  <span>Welcome, Please create your account.</span>
                </div>
                <div className="registerFlexBox mt-3">
                  <div className="form-group">
                    <label>First Name*</label>
                    <input type="text" className="form-control mt-2" placeholder="Enter First Name" required/>
                  </div>
                  <div className="form-group">
                    <label>Last Name*</label>
                    <input type="text" className="form-control mt-2" placeholder="Enter Last Name" required/>
                  </div>
                </div>
                <div className="form-group mt-3">
                  <label>Email*</label>
                  <input type="text" className="form-control mt-2" placeholder="Enter Email" required/>
                </div>
                <div className="form-group mt-3">
                  <label>User Name*</label>
                  <input type="text" className="form-control mt-2" placeholder="Enter User Name" required/>
                </div>
                <div className="form-group mt-3">
                  <label>Password*</label>
                  <input type="password" className="form-control mt-2" placeholder="Enter User password" required/>
                </div>
                <div className="formRememberBox mt-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="accept" required/>
                    <label className="form-check-label" htmlFor="accept">I accept terms & policy</label>
                  </div>
                </div>

                <div className="signInBtnBox mt-5">
                  <button type="submit">sign up</button><br />
                  <span clas>Already have an account?<a href="">Sign In</a></span>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 p-2">
            <div className="registerformImgBox">
              <img src={formImg} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
