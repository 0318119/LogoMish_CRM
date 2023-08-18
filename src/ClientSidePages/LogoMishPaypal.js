import React, { useEffect, useState, useRef } from 'react'
import '../assets/css/payment.css'
import logo from '../assets/images/logoMish.png'
import Modal from "react-modal";
import { HiTemplate as Items_ico } from "react-icons/hi";
import { TbMoneybag as Money_ico } from "react-icons/tb";
import { AiOutlineUserSwitch as User_ico } from "react-icons/ai";
import { FiUsers as Customer_ico } from "react-icons/fi";
import { AiOutlineMail as Email_ico } from "react-icons/ai";
import LogoMishStripe from './LogoMishStripe';
import secureLocalStorage from 'react-secure-storage';
import { useLocation, useNavigate, Link } from 'react-router-dom';
const config = require('../ClientComponents/Clientconfig.json')


function LogoMishPaypal() {
    const [dataLoader, setDataLoader] = useState(false);
    const [BilingmodalIsOpen3, setBilingModalIsOpen3] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError,] = useState();
    const [isGetLeadsData, setGetLeadsData] = useState()
    const [isGetId, setGetId] = useState([])
    const search = useLocation().search
    const navigate = useNavigate()
    var ids = new URLSearchParams(search).get('id')

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }

    // async function getLeadData() {
    //     try {
    //         await fetch(`${config['baseUrl']}/packages/getLeadById/${ids}`, {
    //             method: "GET",
    //             headers: { "content-type": "application/json" }
    //         }).then((response) => {
    //             return response.json()
    //         }).then((response) => {
    //             setDataLoader(true)
    //             setGetLeadsData(response.data[0])
    //             console.log(response.data[0])
    //         }).catch(() => { }).finally(() => { setLoading(false) })
    //     } catch (error) {
    //         setLoading(false)
    //     }
    // }

    async function getPac() {
        try {
            await fetch(`${config['baseUrl']}/packages/getAllSubPakagestemp`, {
                method: "GET",
                headers: { "content-type": "application/json" }
            }).then((response) => {
                return response.json()
            }).then((response) => {
                setDataLoader(true)
                setGetId(response.data)
            }).catch(() => { }).finally(() => { setLoading(false) })
        } catch (error) {
            setLoading(false)
        }
    }

    const [paid, setPaid] = useState(false);
    const [error3, setError3] = useState(null);
    useEffect(() => {


        // getLeadData()
        getPac()

        fetch(`${config['baseUrl']}/packages/getLeadById/${ids}`, {
            method: "GET",
            headers: { "content-type": "application/json" }
        }).then((response) => {
            return response.json()
        }).then((response) => {
            setDataLoader(true)
            setGetLeadsData(response.data[0])
            console.log(response.data[0])

            //     const script = document.createElement("script");
            //     script.src = "https://www.paypal.com/sdk/js?client-id=AWWeSOTkEZTyzOScN7I34AfpLz4kM5jKbXDfw-rNRYgrbgWBE3s_rnlV6Hlpkwp8REp99fRGEXxM9eGS&currency=USD";


            // script.addEventListener("load", () => {
            // if(isGetLeadsData&&isGetLeadsData.payment_method=="Paypal"){
            window.paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: parseInt(response.data[0]?.to_received),
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        const order = await actions.order.capture();
                        setPaid(true);
                        console.log(order);
                        if (order.id !== null && order.id !== undefined && order.id !== "") {
                            fetch(`${config['baseUrl']}/orders/CreateWithoutCustomerOrder`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "name": response.data[0]?.cutomer_name,
                                    "package_id": response.data[0]?.package_id,
                                    "amount": parseInt(response.data[0]?.to_received),
                                    "received_amount": parseInt(response.data[0]?.to_received),
                                    "payment_method": response.data[0]?.payment_method,
                                    "email": response.data[0]?.email,
                                    "number": response.data[0]?.number,
                                    "lead_id": response.data[0]?.id,
                                    "status": "success",
                                    "charge_id": order.id

                                })
                            }).then(res => {
                                return res.json()
                            }).then(response => {
                                console.log(response)
                                if (response.message == "Order created.") {
                                    setBilingModalIsOpen3(true)
                                    setTimeout(() => {
                                        window.location.href = `/ClientPayment?id=${ids}`
                                    }, 2000);
                                }
                                else {
                                    alert(response.message)
                                }
                            }).catch((error) => {
                                console.log(error)
                            })
                        }
                    },
                    onError: (err) => {
                        // setError3(err);
                        console.log(err);
                    },
                    shipping_preference: "NO_SHIPPING",
                })
                .render('#paypal-button-container');
            console.log("render")
            // });
            // document.body.appendChild(script);

            var parentDiv = document.getElementById("paypal-button-container");

            var childNodes = parentDiv.childNodes;
            for (var i = 0; i <= 1; i++) {
                if (childNodes[i].nodeName == "DIV") {
                    childNodes[i].style.display = "none";
                    break;
                }
            }
        }).catch(() => { })
        // }
    }, [])


    return (
        <>

            <div>
                {error && <div>{error.message}</div>}
                {paid ? (
                    <div>Payment successful!</div>
                ) : (
                    <div id="paypal-button-container"></div>
                )}
            </div>

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
                    <h5>Congratulations! You have successfully subscribed to the {isGetLeadsData?.cutomer_name} package.</h5>
                    <div className="d-flex mt-3 align-items-center justify-content-center search-session">
                        <Link className="fgh" onClick={() => setBilingModalIsOpen3(false)}>OK</Link>
                    </div>
                </div>
            </Modal>

        </>
    )
}

export default LogoMishPaypal