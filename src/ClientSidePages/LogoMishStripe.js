import React, { useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { useLocation } from "react-router-dom"
// import STRIPE_PUBLISHABLE from "./stripe"
import Modal from "react-modal";
import { Link } from "react-router-dom"
import axios from "axios"
import {toast,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const config = require('../ClientComponents/Clientconfig.json');


const LogoMishStripe = (props) => {
  console.log("hello  propsa",props)
  const [BilingmodalIsOpen3, setBilingModalIsOpen3] = useState(false);
  const [load, setload] = useState(false)
  const totalAmount = parseInt(props.received_amount)*100
  const search=useLocation().search
  var ids=new URLSearchParams(search).get('id')
  const [packageName,setpackageName] = useState("")
  const [product,setproduct]=useState({
    "price":parseInt(props.received_amount),
    "name":props.name
  })
  const onToken = async(token, addresses) => {
    /// post request
    const response = await axios.post(`${config['baseUrl']}/checkout`,{token,product})
    .then((ress) => {
      console.log(ress)
      if(ress.data.charge){
      fetch(`${config['baseUrl']}/orders/CreateWithoutCustomerOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "name": props.cus_name,
          "package_id": props.pkg_id,
          "amount": parseInt(props.amount),
          "received_amount":parseInt(props.received_amount),
          "payment_method": props.method,
          "email": props.cus_email,
          "number":props.cus_number,
          "lead_id":props.id,
          "status":"success",
          "charge_id":ress.data.charge.id
      
        })
      }).then(res => {
        return res.json()
      }).then(response => {
        console.log(response)
        if(response.message=="Order created."){
          setBilingModalIsOpen3(true)
        }
      else{
        alert(response.message)
      }
      }).catch((error) => {
          console.log(error)
      })
    }
    })
    .catch((err) => {console.log(err)})
  };
  return (
    <>
     <ToastContainer />
      <StripeCheckout
        className="check"
        // style={{ background: "red !important" }}
        amount={parseInt(totalAmount)}
        name="Logo Mish Payment"
        stripeKey={"pk_test_51Iw2FFKl1ZAnnMNkMEtJGcvYDf19HGfk5Jns9Akj5omsZb4xfxsPyOEs3AZBi1UHnmdoL9yP3gWBpr1c1gbFRq7h00LYMbXXN5"}
        token={onToken}
        locale='auto'
        // zipCode
      />




      <Modal
        isOpen={BilingmodalIsOpen3}
        onRequestClose={() => setBilingModalIsOpen3(true)}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "100",
          },
          content: {
            position: "absolute",
            margin: "0 auto",
            width: "450px",
            height: "210px",
            top: "200px",
            left: "0",
            right: "0",
            bottom: "100px",

            background: "#fff",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",

            borderRadius: "20px",
            background: "#fff",
            border: "1px solid #fff",
          },
        }}
      >
        <div className="text-center mt-3">
          <h5>Congratulations! You have successfully subscribed to the {props.name} package.</h5>
          <div className="d-flex mt-3 align-items-center justify-content-center search-session">
            <Link className="fgh" onClick={() => setBilingModalIsOpen3(false)}>OK</Link>
          </div>
        </div>
      </Modal>
    </>
  )

}

export default LogoMishStripe