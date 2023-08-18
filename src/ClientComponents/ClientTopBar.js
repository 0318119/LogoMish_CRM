import React, { useState } from 'react'
import './assets/css/clienttopBar.css'
import { AiOutlineAlignRight as Bar_ico} from "react-icons/ai";
import ClientNotifyBox from './ClientNotifyBox';
import ClientUserProfile from './ClientUserProfile';


function ClientTopBar(props) {

  return (
    <>
    <div className="client_topBarBox">
        <span className='client_barIco'>
            <Bar_ico 
              onClick={props.hideShowMenuClick}
            />
        </span>
        <div className="client_leftAreaBoxTopBar">
            {/* <ClientNotifyBox/> */}
            <ClientUserProfile/>
        </div>
    </div>
    </>
  )
}

export default ClientTopBar