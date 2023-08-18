import React, { useEffect, useState, useRef } from 'react'
import '../ClientComponents/assets/css/clientchat.css'
import { AiOutlineSearch as Search_ico } from "react-icons/ai";
import user from '../ClientComponents/assets/images/chat/03.jpg'
import { BsCheck2 as Check_ico } from "react-icons/bs";
import { BsCheck2All as Doublecheck_ico } from "react-icons/bs";
import { AiOutlineSetting as Setting_ico} from "react-icons/ai";
import { BsFillSendFill as Sent_ico} from "react-icons/bs";
import { GrFormClose as Close_ico } from "react-icons/gr";
import { MdDeleteOutline as Delete_ico } from "react-icons/md";



function ClientChatCom() {
    var userTitle = "Demian Leyon";
    var msgtext = "It should be Bootstrap 4 compatible.";
    const [childCount, setchildCount] = useState(null)
    const [isActiveChat, setActiveChat] = useState(false)
    const [isActionBox, setActionBox] = useState(false)
    const refOne = useRef();

    useEffect(() => {
        const maybeHandler = (e) => {
            if (!refOne.current.contains(e.target)) {
                setActionBox(false)
            }
        }

        document.addEventListener("mousedown", maybeHandler, true);
        return () => {
            document.removeEventListener("mousedown", maybeHandler, true)
        }
    }, [])

    useEffect(() => {
        var div = document.getElementById('client_chatBodyScrollBox')
        setchildCount(div.childElementCount)
    }, [])


    const activeChat = () => {
        setActiveChat(current => !current)
    }

    const chatActionBox = () => {
        setActionBox(current => !current)
    }
  return (
    <>
        <div className="client_chatFlexBox">
            <div className="client_chatLeftSideBox">
                <div className="client_chatSearchBox" >
                    <input type="search" placeholder='Search...' />
                    <Search_ico />
                </div>

                <div className="client_chatBodyScrollBox" id="client_chatBodyScrollBox"
                style={{
                    height: childCount == null || childCount < 4 ? 'fit-content' : '400px',
                    overflowY: childCount == null || childCount < 4 ? 'hidden' : 'scroll'
                }}>
                    <div className="client_chatTxtBody" id={isActiveChat ? "client_activeChatBox" : "false"} onClick={activeChat}>
                        <div className="client_chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="client_chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>
                                    <Check_ico className='client_msgSending'/>
                                    {msgtext.slice(0,18)}...
                                </p>
                            </div>
                        </div>
                        <div className="client_chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="client_chatTxtBody" id={isActiveChat ? "client_activeChatBox" : "false"} onClick={activeChat}>
                        <div className="client_chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="client_chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>
                                    <Doublecheck_ico  className='client_hasSent'/>
                                    {msgtext.slice(0,18)}...
                                </p>
                            </div>
                        </div>
                        <div className="client_chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="client_chatTxtBody" id={isActiveChat ? "client_activeChatBox" : "false"} onClick={activeChat}>
                        <div className="client_chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="client_chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="client_chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="client_chatTxtBody" id={isActiveChat ? "client_activeChatBox" : "false"} onClick={activeChat}>
                        <div className="client_chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="client_chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="client_chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="client_chatTxtBody" id={isActiveChat ? "client_activeChatBox" : "false"} onClick={activeChat}>
                        <div className="client_chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="client_chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="client_chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="client_chatRightSideBox">
                <div className="client_chatTopBar">
                    <div className="client_userOnlineStatus">
                        <h4>Demian Leyon</h4>
                        <span>Online</span>
                    </div>
                    <div className="client_chatSetting">
                        <Setting_ico onClick={chatActionBox}/>
                        <div className={`client_chatActionsBox  ${isActionBox ? "client_ShowBox" : false}`} ref={refOne}>
                            <ul>
                                <li>
                                    <Close_ico />
                                    <span>Close</span>
                                </li>
                                <li>
                                    <Delete_ico />
                                    <span>Delete</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="client_chatRightScrollBox">
                    <div className="client_chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="client_chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="client_chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Doublecheck_ico className='client_Doublecheck_ico'/>
                            </div>
                        </p>
                    </div>

                    {/* =============================================== */}
                    <div className="client_chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="client_chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="client_chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div><div className="client_chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="client_chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='client_signleCheck'/>
                            </div>
                        </p>
                    </div>
                </div>
                <div className="client_inputChatbox">
                    <input type="text" placeholder='Type Here...'/>
                    <Sent_ico />
                </div>
            </div>
        </div>
    </>
  )
}

export default ClientChatCom