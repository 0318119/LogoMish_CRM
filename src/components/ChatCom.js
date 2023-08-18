import React, { useEffect, useState, useRef } from 'react'
import '../components/assets/css/chat.css'
import { AiOutlineSearch as Search_ico } from "react-icons/ai";
import user from '../components/assets/images/chat/03.jpg'
import { BsCheck2 as Check_ico } from "react-icons/bs";
import { BsCheck2All as Doublecheck_ico } from "react-icons/bs";
import { AiOutlineSetting as Setting_ico} from "react-icons/ai";
import { BsFillSendFill as Sent_ico} from "react-icons/bs";
import { MdDriveFileRenameOutline as Rename_ico } from "react-icons/md";
import { GrFormClose as Close_ico } from "react-icons/gr";
import { MdDeleteOutline as Delete_ico } from "react-icons/md";



function ChatCom() {
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
        var div = document.getElementById('chatBodyScrollBox')
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
        <div className="chatFlexBox">
            <div className="chatLeftSideBox">
                <div className="chatSearchBox" >
                    <input type="search" placeholder='Search...' />
                    <Search_ico />
                </div>

                <div className="chatBodyScrollBox" id="chatBodyScrollBox"
                style={{
                    height: childCount == null || childCount < 4 ? 'fit-content' : '400px',
                    overflowY: childCount == null || childCount < 4 ? 'hidden' : 'scroll'
                }}>
                    <div className="chatTxtBody" id={isActiveChat ? "activeChatBox" : "false"} onClick={activeChat}>
                        <div className="chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>
                                    <Check_ico className='msgSending'/>
                                    {msgtext.slice(0,18)}...
                                </p>
                            </div>
                        </div>
                        <div className="chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="chatTxtBody" id={isActiveChat ? "activeChatBox" : "false"} onClick={activeChat}>
                        <div className="chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>
                                    <Doublecheck_ico  className='hasSent'/>
                                    {msgtext.slice(0,18)}...
                                </p>
                            </div>
                        </div>
                        <div className="chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="chatTxtBody" id={isActiveChat ? "activeChatBox" : "false"} onClick={activeChat}>
                        <div className="chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="chatTxtBody" id={isActiveChat ? "activeChatBox" : "false"} onClick={activeChat}>
                        <div className="chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                    <div className="chatTxtBody" id={isActiveChat ? "activeChatBox" : "false"} onClick={activeChat}>
                        <div className="chatTxtInnerBody">
                            <img src={user} alt="" />
                            <div className="chatContentBox">
                                <span>{userTitle.slice(0,10)}</span>
                                <p>{msgtext.slice(0,18)}...</p>
                            </div>
                        </div>
                        <div className="chatTimeLineAndNotificateBox">
                            <span>Just Now</span>
                            <h4>5</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chatRightSideBox">
                <div className="chatTopBar">
                    <div className="userOnlineStatus">
                        <h4>Demian Leyon</h4>
                        <span>Online</span>
                    </div>
                    <div className="chatSetting">
                        <Setting_ico onClick={chatActionBox}/>
                        <div className={`chatActionsBox  ${isActionBox ? "ShowBox" : false}`} ref={refOne}>
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
                <div className="chatRightScrollBox">
                    <div className="chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="chatContentBoxRightOne">
                        <img src={user} alt="" />
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Doublecheck_ico className='Doublecheck_ico'/>
                            </div>
                        </p>
                    </div>

                    {/* =============================================== */}
                    <div className="chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Check_ico className='signleCheck'/>
                            </div>
                        </p>
                    </div>
                    <div className="chatContentBoxRightTwo">
                        <p>
                            Hey John, I am looking for the best admin template.Could you please help me to find it out?
                            <div className="chatTimeBox">
                                <span>4:16 AM</span>
                                <Doublecheck_ico className='Doublecheck_ico'/>
                            </div>
                        </p>
                    </div>
                </div>
                <div className="inputChatbox">
                    <input type="text" placeholder='Type Here...'/>
                    <Sent_ico />
                </div>
            </div>
        </div>
    </>
  )
}

export default ChatCom