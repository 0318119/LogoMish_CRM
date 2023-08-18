import React, { useEffect, useState } from 'react'
import '../components/assets/css/profile.css'
import user_ico from '../assets/images/user.webp'
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { BsPhoneFill as Phone_ico } from "react-icons/bs";
import { MdEmail as Email_ico } from "react-icons/md";
import { FaAddressCard as Address_ico } from "react-icons/fa";
import { BsFillCalendarPlusFill as Birthday_ico } from "react-icons/bs";
import { BsPlusSquare as Plus_ico } from "react-icons/bs";
// ============================================
const config = require('../components/config.json')


function ProfileCom() {

  const [isFullName, setFullName] = useState('');
  const [isTitle, setTitle] = useState('');
  const [isPhoneNumber, setPhoneNumber] = useState();
  const [isEmail, setEmail] = useState('');
  const [isAddress, setAddress] = useState('');
  const [isBirthDay, setBirthDay] = useState();
  const [isPicture, setPicture] = useState('');
  const [isShowPicture, setShowPicture] = useState('');
  // =======================================
  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");
  var get_user_id = secureLocalStorage.getItem("user_id");
  // =======================================
  const navigate = useNavigate()
  // =======================================
  const [isGetProfileInfo, setGetProfileInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(true)
  const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
  // ==================================================================

  const [isGetInfo, setGetInfo] = useState()
  const [isProfileAlerts, setProfileAlert] = useState();
  const showAlert = (message, type) => {
    setProfileAlert({
      message: message,
      type: type,
    })
  }



  async function getUserProfileInfoById() {
    fetch(`${config['baseUrl']}/profile/getProfilesByUserId/${get_user_id}`, {
      method: "GET",
      headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
    }).then((response) => {
      return response.json()
    }).then((response) => {
      if (response.messsage == "unauthorized") {
        fetch(`${config['baseUrl']}/profile/getProfilesByUserId/${get_user_id}`, {
          method: "GET",
          headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
        }).then(response => {
          return response.json()
        }).then(response => {
          secureLocalStorage.setItem("refresh", response.referesh_token);
          secureLocalStorage.setItem("access_token", response.access_token);
          setGetProfileInfo(response.data)
          if (response.data.length > 0) {
            setDataLoader(true)
            setFullName(response.data[0].name)
            setTitle(response.data[0].title)
            setPhoneNumber(response.data[0].number)
            setEmail(response.data[0].email)
            setAddress(response.data[0].address)
            setBirthDay(response.data[0].dob)
            setPicture(`https://payments-api.logomish.com${response.data[0].image!==null&&response.data[0].image!==undefined&&response.data[0].image!==""?response.data[0].image.split('/uploads')[1]:""}`)
          }
        }).catch((errs) => {
          setGetInfo(errs.message)
        }).finally(() => { setLoadingLoader(false) })
      }
      else if(response.messsage == "timeout error"){
          localStorage.clear()
          sessionStorage.clear()
          window.location.href='/'
      }
      else {
        setGetProfileInfo(response.data)
        if (response.data.length > 0) {
          setDataLoader(true)
          setFullName(response.data[0].name)
          setTitle(response.data[0].title)
          setPhoneNumber(response.data[0].number)
          setEmail(response.data[0].email)
          setAddress(response.data[0].address)
          setBirthDay(response.data[0].dob)
          setPicture(`https://payments-api.logomish.com${response.data[0].image!==null&&response.data[0].image!==undefined&&response.data[0].image!==""?response.data[0].image.split('/uploads')[1]:""}`)
        }
      }
    }).catch((errs) => {
      setGetInfo(errs.message)
      setDataLoader(true)
    }).finally(() => { setLoadingLoader(false) })
  }


  useEffect(() => {
    getUserProfileInfoById()
  }, [])


  const updateProfile = async (e) => {
    e.preventDefault();
    if (isGetProfileInfo.length > 0) {
      setLoading(true);
      setBtnEnaledAndDisabled(true);

      let formData = new FormData();
      if (isPicture !== '') {
        formData.append("file", isPicture);
      }
      formData.append("name", isFullName);
      formData.append("title", isTitle);
      formData.append("number", isPhoneNumber);
      formData.append("email", isEmail);
      formData.append("address", isAddress);
      formData.append("dob", isBirthDay);
      formData.append("id", isGetProfileInfo[0].id);
      await axios.post(`https://payments-api.logomish.com/profile/updateProfiles`, formData, {
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Accept: "form-data",
        },
      }).then((response) => {
        setLoading(false);
        setBtnEnaledAndDisabled(false);
        if (response.status == 200) {
          showAlert("Your Profile has been updated", "success")
          setTimeout(() => {
            window.location.reload();
          }, 1000)
        }
      }).catch((errors) => {
        setLoading(false);
        setBtnEnaledAndDisabled(false);
        showAlert(errors.message, "warning")
      });

    } else {
      setLoading(true);
      setBtnEnaledAndDisabled(true);
      let formData = new FormData();
      formData.append("file", isPicture);
      formData.append("user_id", get_user_id);
      formData.append("name", isFullName);
      formData.append("title", isTitle);
      formData.append("number", isPhoneNumber);
      formData.append("email", isEmail);
      formData.append("address", isAddress);
      formData.append("dob", isBirthDay);
      if (isPicture == '') {
        showAlert("please select the your profile picture", "warning")
        setLoading(false);
        setBtnEnaledAndDisabled(false);
      } else {
        await axios.post(`https://payments-api.logomish.com/profile/profileInsert`, formData, {
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Accept: "form-data",
          },
        }).then((response) => {
          setLoading(false);
          setBtnEnaledAndDisabled(false);
          if (response.status == 200) {
            showAlert("Your Profile has been Created", "success")
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          }
        }).catch((errors) => {
          setLoading(false);
          setBtnEnaledAndDisabled(false);
          showAlert(errors.message, "warning")
        });
      }
    }
  }
  return (
    <>
      
      <div className="profileMainBox">
        {loadingLoader && (
          <div className="loaderBox">
            <div className="loader">
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
              <div className="four"></div>
            </div>
            {/* <span>Loading...</span> */}
          </div>
        )}

        {dataLoader && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-4 p-0">
                  <div className="leftProfileBox">
                    <div className="leftProfilePictureBox">
                      <img src={isPicture ? isPicture : user_ico} alt="" />
                    </div>
                    <div className="leftProfileDesignationBox">
                      <span>{isFullName}</span>
                      <p>{isTitle}</p>
                    </div>
                    <div className="leftInfoProfile">
                      <h6>
                        <Phone_ico />
                        <div className="leftProfileInfoBox">
                          <p>Phone</p>
                          <span>{isPhoneNumber}</span>
                        </div>
                      </h6>
                      <h6>
                        <Email_ico />
                        <div className="leftProfileInfoBox">
                          <p>Email Address</p>
                          <span>{isEmail}</span>
                        </div>
                      </h6>
                      <h6>
                        <Address_ico />
                        <div className="leftProfileInfoBox">
                          <p>Your Address</p>
                          <span>{isAddress}</span>
                        </div>
                      </h6>
                      <h6>
                        <Birthday_ico />
                        <div className="leftProfileInfoBox">
                          <p>Your Birthday</p>
                          <span>{isBirthDay}</span>
                        </div>
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 p-0">
                  <div className="rightSideProfileBox">
                  <ul className='p-0'>
                    {isGetInfo && (
                      <li className={`alert alert-warning` + " " + "mt-4"}>{`${isGetInfo}`}</li>
                    )}
                    {isProfileAlerts && (
                      <li className={`alert alert-${isProfileAlerts.type}` + " " + "mt-4"}>{`${isProfileAlerts.message}`}</li>
                    )}
                  </ul>
                    <h4>My Profile</h4>
                    <form onSubmit={updateProfile}>
                      <div className="rightPictureUploadBox">
                        <Plus_ico />
                        <input type="file" 
                          onChange={(e) => { setPicture(e.target.files[0]) }}
                        />
                      </div>
                      <div className="rigthProfileInputBox">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input type="text" className="form-control"
                            placeholder="Enter Your full name" value={isFullName}
                            onChange={(e) => { setFullName(e.target.value) }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Title</label>
                          <input type="text" className="form-control" 
                            placeholder="Enter Your title" value={isTitle}
                            onChange={(e) => { setTitle(e.target.value) }}
                          />
                        </div>
                      </div>
                      <div className="rigthProfileInputBox">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input type="number" className="form-control" 
                            placeholder="Enter Your phone number" value={isPhoneNumber}
                            onChange={(e) => { setPhoneNumber(e.target.value) }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" className="form-control" disabled
                            placeholder="Enter Your Email" value={isEmail ? isEmail : isEmail}
                            onChange={(e) => { setEmail(e.target.value) }}
                          />
                        </div>
                      </div>
                      <div className="rigthProfileInputBox">
                        <div className="form-group">
                          <label>Your Address</label>
                          <input type="text" className="form-control" 
                            placeholder="Enter Your Address" value={isAddress}
                            onChange={(e) => { setAddress(e.target.value) }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Birthday</label>
                          <input type="date" className="form-control" placeholder='Enter Your Birthday'
                          value={isBirthDay}
                            onChange={(e) => { setBirthDay(e.target.value) }}
                          />
                        </div>
                      </div>
                      <div className="rigthProfileInputBox">
                        <button type="submit" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Update Information"} </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
         )}
      </div>
    </>
  )
}

export default ProfileCom