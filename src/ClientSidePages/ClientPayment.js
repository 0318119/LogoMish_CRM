import React, { useEffect, useState, useRef } from 'react'
import '../assets/css/payment.css'
import logo from '../assets/images/logoMish.png'
import { HiTemplate as Items_ico } from "react-icons/hi";
import { TbMoneybag as Money_ico } from "react-icons/tb";
import { AiOutlineUserSwitch as User_ico } from "react-icons/ai";
import { FiUsers as Customer_ico } from "react-icons/fi";
import { AiOutlineMail as Email_ico } from "react-icons/ai";
import LogoMishStripe from './LogoMishStripe';
import secureLocalStorage from 'react-secure-storage';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoMishPaypal from './LogoMishPaypal';
const config = require('../ClientComponents/Clientconfig.json')


function ClientPayment() {
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError,] = useState();
    const [isGetLeadsData, setGetLeadsData] = useState([])
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

    async function getLeadData() {
        try {
            await fetch(`${config['baseUrl']}/packages/getLeadById/${ids}`, {
                method: "GET",
                headers: { "content-type": "application/json" }
            }).then((response) => {
                return response.json()
            }).then((response) => {
                setDataLoader(true)
                setGetLeadsData(response.data[0])
                console.log("han bay",response.data[0])
            }).catch(() => { }).finally(() => { setLoading(false) })
        } catch (error) {
            setLoading(false)
        }
    }

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


        getLeadData()
        getPac()

    }, [])


    return (
        <>

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
                    <section id='hello' className='paymentSection'>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-6">
                                    <div className="paymentFormBox">
                                        <img src={logo} alt="" />
                                        <h5>PAY USING Credit/Debit Card</h5>
                                        <div className='paymentItemsBox'>
                                            <h6>
                                                <Items_ico />
                                                <span>Items:</span>
                                            </h6>
                                            <span>
                                                {isGetLeadsData && isGetId && isGetId.length > 0 ? isGetId.filter(data => data.id == isGetLeadsData.package_id).length > 0 ? isGetId.filter(data => data.id == isGetLeadsData.package_id)[0].name : "" : ""}
                                            </span>
                                        </div>
                                        <div className='paymentItemsBox'>
                                            <h6>
                                                <Money_ico />
                                                <span>Amount:</span>
                                            </h6>
                                            <span>${isGetLeadsData.to_received}</span>
                                        </div>
                                        <div className='paymentItemsBox'>
                                            <h6>
                                                <User_ico />
                                                <span>Agent Name::</span>
                                            </h6>
                                            <span>{isGetLeadsData.agent_name}</span>
                                        </div>
                                        <div className='paymentItemsBox'>
                                            <h6>
                                                <Customer_ico />
                                                <span>Customer Name:</span>
                                            </h6>
                                            <span>{isGetLeadsData.cutomer_name}</span>
                                        </div>
                                        <div className='paymentItemsBox'>
                                            <h6>
                                                <Email_ico />
                                                <span>Email:</span>
                                            </h6>
                                            <span>{isGetLeadsData.email}</span>
                                        </div>
                                        {
                                            isGetLeadsData && isGetLeadsData.payment_method.toLowerCase() == "stripe" ?
                                                <LogoMishStripe name={isGetLeadsData && isGetId && isGetId.length > 0 ? isGetId.filter(data => data.id == isGetLeadsData.package_id).length > 0 ? isGetId.filter(data => data.id == isGetLeadsData.package_id)[0].name : "" : ""}
                                                    amount={isGetLeadsData.price}
                                                    received_amount={isGetLeadsData?.to_received}
                                                    id={isGetLeadsData.id} cus_name={isGetLeadsData.cutomer_name}
                                                    pkg_id={isGetLeadsData.package_id} method={isGetLeadsData.payment_method}
                                                    cus_email={isGetLeadsData.email} cus_number={isGetLeadsData.number}
                                                />
                                                :
                                                <LogoMishPaypal />
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}


        </>
    )
}

export default ClientPayment