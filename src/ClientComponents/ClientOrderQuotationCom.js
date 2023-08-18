import React, { useEffect, useState } from 'react'
import ClientSearchBar from '../ClientComponents/ClientSearchBar'
import './assets/css/clienttopBar.css'
import '../ClientComponents/assets/css/websiteQuotations.css'
import ClientCreateOrder from '../ClientComponents/modals/ClientCreateOrderRequest'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'
import OrderDataTable from 'react-data-table-component'
import { FaRegEdit as Edit_ico } from "react-icons/fa";
import ClientUpdateOrderReq from './modals/ClientUpdateOrderReq'
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import { FaUserAlt as User_ico } from "react-icons/fa";
import { MdOpenInNew as Description_ico } from "react-icons/md";
import { Tooltip } from "react-tooltip";
const config = require('../ClientComponents/Clientconfig')



function ClientOrderQuotationCom() {
    const [modalShow, toggleModal] = useState(false)
    const [isModal, setModal] = useState(false)
    const [error, setError] = useState()
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder, setFilterOrder] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    const [isEditId, setEditId] = useState()
    // ========
    const [isErrGetAllPkgs, setErrGetAllPkgs] = useState();
    const [isErrGetPkgs, setErrGetPkgs] = useState();
    // ==========
    const [isGetAllSubPakages, setGetAllSubPakages] = useState([]);
    const [isGetPackages, setGetPackages] = useState([]);
    // ==========
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_user_id = secureLocalStorage.getItem("user_id");

    const navigate = useNavigate()
    // =========

    const showAlert = (message, type) => {
        setError({
            message: message,
            type: type,
        })
    }
    async function getAllSubPakages() {
        await fetch(`${config['baseUrl']}/packages/getAllSubPakagesClient`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/packages/getAllSubPakagesClient`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetAllSubPakages(response.data)
                }).catch((errs) => {
                    setErrGetAllPkgs(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetAllSubPakages(response.data)
            }
        }).catch((errs) => {
            setErrGetAllPkgs(errs.message)
        })
    }
    async function getPackages() {
        await fetch(`${config['baseUrl']}/packages/getPackagesClient`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/packages/getPackagesClient`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setGetPackages(response.data)
                }).catch((errs) => {
                    setErrGetPkgs(errs.message)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setGetPackages(response.data)
            }
        }).catch((errs) => {
            setErrGetPkgs(errs.message)
        })
    }
    async function getRequestOrder() {
        await fetch(`${config['baseUrl']}/request/getOrderRequestForClient/${get_user_id}/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/request/getOrderRequestForClient/${get_user_id}/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrdersData(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    showAlert(errs.message, "warning")
                }).finally(() => { setLoading(false) })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setOrdersData(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            showAlert(errs.message, "warning")
        }).finally(() => { setLoading(false) })
    }
    const openOrderModal = () => {
        toggleModal(!modalShow)
    }
    const customStyles = {
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderTop: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                borderBottom: "1px solid #80808021",
                borderLeft: "1px solid #80808021",
                borderRight: "1px solid #80808021",
            },
        },
    };
    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1,
            grow: 0,
            minWidth: "50px",
        },
        {
            name: "Name",
            selector: (row) =>
                <div className='pacDetailsBox'>
                    {
                        row.name ?
                            <span className='mb-2 mt-2 package_name' data-tooltip-id='name-row' data-tooltip-content={`Email:` + " " + row.name}
                            >{row.name}</span> :
                            <span className='mb-2 mt-2 notFoundMsg'>Not Found</span>
                    }
                    <Tooltip
                        id="name-row"
                        place="bottom"
                    />
                </div>

        },
        {
            name: "Description",
            selector: (row) =>
                <div className='pacDetailsBox' onClick={gotoNextPage} data-id={row.id} data-client-id={row.client_id}>
                    {row.description ?
                        <span className='mb-2 mt-2 package_name' data-tooltip-id='Description' data-tooltip-content="See Description"
                        >{row.description.slice(0, 10)}...
                        </span> :
                        <span className="mb-2 mt-2 notFoundMsg">Not Found</span>
                    }
                    <Tooltip
                        id="Description"
                        place="bottom"
                    />
                </div>
        },
        {
            name: "Action",
            selector: (row) => <div className="dataTableIconBox" onClick={ShowUpdateModal} data-id={row.id}>
                <button className="order-request-update updateAlert" >
                    <Edit_ico />
                </button>
                <Tooltip
                    anchorSelect=".order-request-update"
                    place="bottom"
                    content="Order Request Update"
                />
            </div>
        },
        {
            name: "Date",
            selector: (row) =>
                <div className=''>
                    {row.created_at ?
                        <span>{row.created_at.slice(0, 10)}</span> :
                        <span className="notFoundMsg">Not Found</span>}
                </div>
        }
    ]
    const ShowUpdateModal = (e) => {
        setModal(!isModal)
        var edit_id = e.currentTarget.getAttribute('data-id');
        setEditId(edit_id)
    }
    const gotoNextPage = async (e) => {
        var get_id = e.currentTarget.getAttribute('data-id');
        var get_client_id = e.currentTarget.getAttribute('data-client-id');
        navigate(`/ClientOrderReply?id=${get_id}&client_id=${get_client_id}`);
    }
    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getRequestOrder(page)
    }, [page])
    useEffect(() => {
        getAllSubPakages()
        getPackages()
    }, [])

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setOrdersData(isFilterOrder)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item =>
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item.created_at.toLowerCase().includes(e.target.value.toLowerCase())
                )
                setOrdersData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    return (
        <>
            <div className="webQuotBox">
                <h4 className='webQuotBoxOne'>Order Request Details</h4>
                <div className="innerWebQuotBox">
                    <div className="btnBox">
                        <button onClick={openOrderModal}><Add_ico /> Create Order Request</button>
                    </div>
                    <h4 className='webQuotBoxTwo'>Order Request Details</h4>
                    <ClientSearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                    )}
                    {isErrGetAllPkgs && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetAllPkgs}`}</li>
                    )}
                    {isErrGetPkgs && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetPkgs}`}</li>
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
                    <OrderDataTable
                        columns={columns}
                        data={isOrdersData}
                        highlightOnHover
                        pagination
                        paginationServer
                        paginationTotalRows={Isrows}
                        paginationComponentOptions={{
                            noRowsPerPage: true,
                        }}
                        customStyles={customStyles}
                        onChangePage={handlePageChange}
                    />
                )}
            </div>
            <ClientCreateOrder
                close={() => { toggleModal(false) }}
                {...{ modalShow, isGetAllSubPakages, isGetPackages }}
            />

            <ClientUpdateOrderReq
                close={() => { setModal(false) }}
                {...{ isEditId, isModal, isGetAllSubPakages, isGetPackages }}
            />
        </>
    )
}

export default ClientOrderQuotationCom