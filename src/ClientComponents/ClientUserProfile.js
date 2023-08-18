import React, { useEffect, useRef, useState } from 'react'
import user_avatar from '../assets/images/user.webp'
import { GoPrimitiveDot as Online_ico } from "react-icons/go";
import { RiLogoutCircleLine as Logout_ico } from "react-icons/ri";


import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
const config = require('../ClientComponents/Clientconfig.json')


function ClientUserProfile() {
  const [isOpenProfileBox, setOpenProfileBox] = useState(false)
  // ==============================
  const refOne = useRef();
  const navigate = useNavigate()
  // ===========================
  const handleProfileBox = () => {
    setOpenProfileBox(current => !current)
  }

  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");
  var get_user_id = secureLocalStorage.getItem("user_id");
  // =======================================
  const [isFullName, setFullName] = useState('');
  const [isEmail, setEmail] = useState('');
  const [isPicture, setPicture] = useState('');

  async function getUserProfileInfoById() {
    fetch(`${config['baseUrl']}/profile_client/getProfilesClientByUserId/${get_user_id}`, {
      method: "GET",
      headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
    }).then((response) => {
      return response.json()
    }).then((response) => {
      if (response.messsage == "unauthorized") {
        fetch(`${config['baseUrl']}/profile_client/getProfilesClientByUserId/${get_user_id}`, {
          method: "GET",
          headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
        }).then(response => {
          return response.json()
        }).then(response => {
          secureLocalStorage.setItem("refresh", response.referesh_token);
          secureLocalStorage.setItem("access_token", response.access_token);
          if (response.data.length > 0) {
            setFullName(response?.data?.[0]?.name)
            setEmail(response?.data?.[0]?.email)
            setPicture(`https://payments-api.logomish.com${response?.data[0].image!==null&&response.data[0].image!==undefined&&response.data[0].image!==""?response.data[0].image.split('/uploads')[1]:""}`)
          }
        }).catch((errs) => {})
      }
      else if(response.messsage == "timeout error"){
          localStorage.clear()
          sessionStorage.clear()
          window.location.href='/'
      }
      else {
        if (response.data.length > 0) {
            setFullName(response?.data?.[0]?.name)
            setEmail(response?.data?.[0]?.email)
            setPicture(`https://payments-api.logomish.com${response?.data[0].image!==null&&response.data[0].image!==undefined&&response.data[0].image!==""?response.data[0].image.split('/uploads')[1]:""}`)
        }
      }
    }).catch((errs) => {})
  }

    useEffect(() => {
      getUserProfileInfoById()
    }, [])


  useEffect(() => {
    const maybeHandler = (e) => {
      if (!refOne.current.contains(e.target)) {
        setOpenProfileBox(false)
      }
    }
    document.addEventListener("mousedown", maybeHandler, true)
    return () => {
      document.removeEventListener("mousedown", maybeHandler, true)
    }
  }, [])

  const userLogout = () => {
    secureLocalStorage.clear()
    window.location.href='/'
  }

  return (
    <>
      <div className='client_userProfileBox' ref={refOne}>
        <div className="client_userInfo" onClick={handleProfileBox}>
          <h5>
            <span className='client_userName'>{isFullName}</span>
            <span className='client_userDesig'>{isEmail}</span>
          </h5>
          <div className="client_userActiveBox">
            {/* <Online_ico /> */}
            <img src={isPicture? isPicture : user_avatar} alt="" />
          </div>
        </div>

        {/* ====================================================================== */}
        <div className="client_userProfileModal" id={isOpenProfileBox ? "client_showProfile" : "client_hideProfile"}>
          <div className="client_profileHeader">
            <h5>
              <span className='client_userName'>{isFullName}</span>
              <span className='client_emailUser'>{isEmail}</span>
            </h5>
            <div className="">
              <Logout_ico onClick={userLogout}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientUserProfile