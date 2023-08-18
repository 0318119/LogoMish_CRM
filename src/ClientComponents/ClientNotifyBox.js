import React, { useEffect, useState, useRef } from 'react'
import { MdNotificationsNone as Notify_ico } from "react-icons/md";
import ChatPicture from '../ClientComponents/assets/images/chat/03.jpg'

function ClientNotifyBox() {
    const [isMasModal, setMasModal] = useState(true);
    const [childCount, setchildCount] = useState(null)
    const refOne = useRef();


    useEffect(() => {
        const maybeHandler = (e) => {
            if (!refOne.current.contains(e.target)) {
                setMasModal(true)
            }
        }
        document.addEventListener("mousedown", maybeHandler, true);
        return () => {
            document.removeEventListener("mousedown", maybeHandler, true)
        }
    }, [])

    const handleModal = () => {
        setMasModal(current => !current)
    }

    useEffect(() => {
        var div = document.getElementById('client_scrollBoxNotifyModal11')
        setchildCount(div.childElementCount)
    }, [])


    return (
        <>
            <div className="client_notifyBox" ref={refOne}>
                <span className='client_notifyBoxIco'>
                    <Notify_ico onClick={handleModal} />
                    <span className='client_notificateCount'>5</span>
                </span>
                <div className="client_notifyModal" id={isMasModal ? "client_hideNotifyModal" : "client_showNotifyModal"}>
                    <div className="client_modalHeader">
                        <h6 className='client_notifyCount'>Notifications</h6>
                        <button>clear all</button>
                    </div>
                    <div className="client_scrollBoxNotifyModal" id='client_scrollBoxNotifyModal11'
                        style={{
                            height: childCount == null || childCount < 4 ? 'fit-content' : '250px',
                            overflowY: childCount == null || childCount < 4 ? 'hidden' : 'scroll'
                        }}>
                        <div className="client_notifyContent">
                            <img src={ChatPicture} alt="" />
                            <div className="client_userContent">
                                <span className='client_userName'>Brianing Leyon</span>
                                <p className='client_userDescription'>You will sail along until you...</p>
                            </div>
                        </div>
                        <div className="client_notifyContent">
                            <img src={ChatPicture} alt="" />
                            <div className="client_userContent">
                                <span className='client_userName'>Brianing Leyon</span>
                                <p className='client_userDescription'>You will sail along until you...</p>
                            </div>
                        </div>
                        <div className="client_notifyContent">
                            <img src={ChatPicture} alt="" />
                            <div className="client_userContent">
                                <span className='client_userName'>Brianing Leyon</span>
                                <p className='client_userDescription'>You will sail along until you...</p>
                            </div>
                        </div>
                        <div className="client_notifyContent">
                            <img src={ChatPicture} alt="" />
                            <div className="client_userContent">
                                <span className='client_userName'>Brianing Leyon</span>
                                <p className='client_userDescription'>You will sail along until you...</p>
                            </div>
                        </div>
                    </div>
                    <div className="client_notifyFooter">
                        <a href="">View all notifications</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientNotifyBox