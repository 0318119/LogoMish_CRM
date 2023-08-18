import React, { useEffect, useState } from 'react'
import '../ClientComponents/assets/css/clientOrderReply.css'
import { useNavigate,useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import user_ico from '../assets/images/userProfileIco.webp'
import Moment from 'react-moment';
const config = require('../ClientComponents/Clientconfig.json')




function ClientOrderReplyCom() {
  const search=useLocation().search
  var ids=new URLSearchParams(search).get('id')
  var cids=new URLSearchParams(search).get('client_id')
  const [dataLoader, setDataLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError,] = useState();
  const [isOrdersData, setOrdersData] = useState([]);
  const [isOrderReply, setOrderReply] = useState([]);
  const navigate = useNavigate()
  var get_refresh_token = secureLocalStorage.getItem("refresh");
  var get_access_token = secureLocalStorage.getItem("access_token");


  const showAlert = (message, type) => {
      setError({
          message: message,
          type: type,
      })
  }

  async function getRequestOrder() {
    await fetch(`${config['baseUrl']}/request/getOrderRequestForClient/${cids}/1000`, {
        method: "GET",
        headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
    }).then((response) => {
        return response.json()
    }).then(async (response) => {
        if (response.messsage == "unauthorized") {
            await fetch(`${config['baseUrl']}/request/getOrderRequestForClient/${cids}/1000`, {
                method: "GET",
                headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
            }).then(response => {
                return response.json()
            }).then(response => {
                if (response.messsage == "timeout error") { navigate('/') }
                else {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data)
                    setDataLoader(true)
                }
            }).catch((errs) => {
                showAlert(errs.message, "warning")
            }).finally(() => { setLoading(false) })
        }
        else {
            setOrdersData(response.data)
            setDataLoader(true)
        }
    }).catch((errs) => {
        showAlert(errs.message, "warning")
    }).finally(() => { setLoading(false) })
  }
  async function getOrderReply() {
    await fetch(`${config['baseUrl']}/request/getOrderRequestReplyForClient`, {
        method: "GET",
        headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
    }).then((response) => {
        return response.json()
    }).then(async (response) => {
        if (response.messsage == "unauthorized") {
            await fetch(`${config['baseUrl']}/request/getOrderRequestReplyForClient`, {
                method: "GET",
                headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
            }).then(response => {
                return response.json()
            }).then(response => {
                if (response.messsage == "timeout error") { navigate('/') }
                else {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrderReply(response.data)
                    setDataLoader(true)
                }
            }).catch((errs) => {
                showAlert(errs.message, "warning")
            }).finally(() => { setLoading(false) })
        }
        else {
            setOrderReply(response.data)
            setDataLoader(true)
        }
    }).catch((errs) => {
        showAlert(errs.message, "warning")
    }).finally(() => { setLoading(false) })
  }
  useEffect(() => {
      getRequestOrder()
      getOrderReply()
  }, [])


  return (
    <>
      <div className="client_orderReplyMainBox">
          <ul>
              {error && (
                  <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
              )}
          </ul>
          {loading && (
              <div className="loaderBox">
                  <div className="loader">
                      <div className="one"></div>
                      <div className="two"></div>
                      <div className="three"></div>
                      <div className="four"></div>
                  </div>
              </div>
          )}

          {dataLoader && (
              <>
                  {
                      isOrdersData&&isOrdersData.length>0?isOrdersData.filter((data)=>data.id==ids&&data.client_id==cids).map((items)=>(
                      <>
                          <div className="client_orderReplyProfileBox">
                              <div className="client_orderReplyProfileInnerBox">
                                  <img src={user_ico} alt="" />
                                  <h5>
                                      <span>{items.name}</span>
                                      <span>{items.email}</span>
                                  </h5>
                              </div>
                              <div className="client_orderReplyTimeBox">
                                  <span>{items.created_at.slice(0,10)}</span>
                                  <span>(<Moment fromNow ago date={items.created_at} />) </span>
                              </div>
                          </div>
                          <div className="client_orderReplyDesBox">
                              <div className="client_orderReplyDesBody">
                                  <span>{items.name}</span>
                                  <p>{items.description}</p>
                              </div>
                              <div className="client_orderReplyBox">
                                  {
                                      isOrderReply&&isOrderReply.length>0?isOrderReply.filter(data=>data.request_id==ids&&data.user_id==cids).length>0?
                                      <h6>Agent Reply</h6>
                                      :
                                      "":""
                                  }

                                  {
                                      isOrderReply&&isOrderReply.length>0?isOrderReply.filter(data=>data.request_id==ids&&data.user_id==cids).map((items)=>( 
                                      <>
                                      <li>{items.description}</li>
                                      </>
                                      
                                      )):"Reply not found"
                                  }
                              </div>
                              {/* <div className="client_orderReplyBtnBox">
                                  {
                                     isOrdersData&&isOrdersData.length>0?isOrdersData.filter((data)=>data.id==ids&&data.client_id==cids).map((items)=>( 
                                      <>
                                        <button onClick={()=> {
                                        setEditBox(true)
                                        setDes(items.description)}}>Edit</button>
                                      </>
                                      )):""
                                  }
                              </div> */}
                          </div>
                      </>
                      )):"data not found"
                  } 
              </>  
          )}
      </div>

      {/* {showEditBox && (
            <>
            <div className='client_orderReplyBoxModal'>
            {
                isOrdersData&&isOrdersData.length>0?isOrdersData.filter(data=>data.id==ids&&data.client_id==cids).map(items=>(
                <>
                  <h5>{items.name}</h5>
                  <textarea onChange={(e)=> {setDes(e.target.value)}} value={isDes}></textarea>
                </>
                )):"data not found"
            }
            <div className="client_orderreplyModalbtnBox">
            <button  type="submit" disabled={btnEnaledAndDisabled} onClick={sentRequestEdit}>  {isBtnloading ? "A moment please..." : "sent"}</button>
                <button onClick={() => {setEditBox(false)}}>cancel</button>
            </div>
            </div>
            </>
        )} */}
    </>
  )
}

export default ClientOrderReplyCom