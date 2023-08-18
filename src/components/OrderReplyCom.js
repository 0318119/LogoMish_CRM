import React, { useEffect, useState } from 'react'
import '../components/assets/css/orderReply.css'
import secureLocalStorage from 'react-secure-storage';
import { useNavigate, useLocation } from 'react-router-dom';
import Moment from 'react-moment';
import user_ico from '../assets/images/userProfileIco.webp'
const config = require('../components/config.json')



function OrderReplyCom() {
    const search = useLocation().search
    var ids = new URLSearchParams(search).get('id')
    var cids = new URLSearchParams(search).get('client_id')
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isDes, setDes] = useState()
    const [error, setError,] = useState();
    const [isOrdersData, setOrdersData] = useState([]);
    const [isOrderReply, setOrderReply] = useState([]);
    const [RepEdit, setRepEdit] = useState('')
    const [editId, setEdit] = useState()
    const [editDes, setEditDes] = useState()

    const [isReplyBox, setReplyBox] = useState(false)
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
        await fetch(`${config['baseUrl']}/request/getOrderRequestForAdmin`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/getOrderRequestForAdmin`, {
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
        await fetch(`${config['baseUrl']}/request/getOrderRequestReplyForAdmin`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/getOrderRequestReplyForAdmin`, {
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

    const replyBox = () => {
        setReplyBox(true)
    }

    const sentReply = async () => {
        await fetch(`${config['baseUrl']}/request/CreateOrderRequestReply`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "request_id": ids,
                "user_id": cids,
                "description": isDes
            })
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/CreateOrderRequestReply`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "request_id": ids,
                        "user_id": cids,
                        "description": isDes
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                })
            }
            else {
                showAlert(response.message, "success")
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }

    const editReply = () => {
        setReplyBox(true)
    }

    const updateReply = async () => {
        await fetch(`${config['baseUrl']}/request/UpdateOrderRequestReply`, {
            method: "POST",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
            body: JSON.stringify({
                "id": editId,
                "description": isDes
            })
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/UpdateOrderRequestReply`, {
                    method: "POST",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                    body: JSON.stringify({
                        "id": editId,
                        "description": isDes
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        showAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                })
            }
            else {
                showAlert(response.message, "success")
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        })
    }

    useEffect(() => {
        getRequestOrder()
        getOrderReply()
    }, [])

    return (
        <>
            <div className="orderReplyMainBox">
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
                            isOrdersData && isOrdersData.length > 0 ? isOrdersData.filter((data) => data.id == ids && data.client_id == cids).map((items) => (
                                <>
                                    <div className="orderReplyProfileBox">
                                        <div className="orderReplyProfileInnerBox">
                                            <img src={user_ico} alt="" />
                                            <h5>
                                                <span>{items.name}</span>
                                                <span>{items.email}</span>
                                            </h5>
                                        </div>
                                        <div className="orderReplyTimeBox">
                                            <span>{items.created_at.slice(0, 10)}</span>
                                            <span>(<Moment fromNow ago date={items.created_at} />) </span>
                                        </div>
                                    </div>
                                    <div className="orderReplyDesBox">
                                        <div className="orderReplyDesBody">
                                            <span>{items.name}</span>
                                            <p>{items.description}</p>
                                        </div>
                                        <div className="orderReplyBox">
                                            {
                                                isOrderReply && isOrderReply.length > 0 ? isOrderReply.filter(data => data.request_id == ids && data.user_id == cids).length > 0 ?
                                                    <h6>Your Reply</h6>
                                                    :
                                                    "" : ""
                                            }

                                            {
                                                isOrderReply && isOrderReply.length > 0 ? isOrderReply.filter(data => data.request_id == ids && data.user_id == cids).map((items) => (
                                                    <>
                                                        <li>
                                                            {items.description}
                                                            <span
                                                                onClick={() => {
                                                                    editReply()
                                                                    setRepEdit('edit')
                                                                    setEdit(items.id)
                                                                    setDes(items.description)
                                                                }}
                                                            >Edit</span>
                                                        </li>
                                                    </>

                                                )) : "Reply not found"
                                            }
                                        </div>
                                        <div className="orderReplyBtnBox">
                                            <button onClick={() => {
                                                replyBox()
                                                setRepEdit('rep')
                                            }}>Reply</button>
                                        </div>
                                    </div>
                                </>
                            )) : "data not found"
                        }
                    </>
                )}
            </div>

            {isReplyBox && (
                <>
                    <div className='orderReplyBoxModal'>
                        {
                            isOrdersData && isOrdersData.length > 0 ? isOrdersData.filter(data => data.id == ids && data.client_id == cids).map(items => (
                                <>
                                    <h5>{items.name}</h5>
                                </>
                            )) : "data not found"
                        }
                        <textarea onChange={(e) => { setDes(e.target.value) }} value={isDes}></textarea>
                        <div className="orderreplyModalbtnBox">
                            <button onClick={() => {
                                if (RepEdit == 'rep') { sentReply() }
                                else { updateReply() }
                            }}>Sent</button>
                            <button onClick={() => { setReplyBox(false) }}>cancel</button>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default OrderReplyCom