import React, { useEffect, useState } from 'react'
import ClientSearchBar from './ClientSearchBar'
import './assets/css/clienttopBar.css'
import '../ClientComponents/assets/css/websiteQuotations.css'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'
import OrderDataTable from 'react-data-table-component'
import { BiMessageSquareAdd as Add_ico } from "react-icons/bi";
import ClientCreateReferRequest from './modals/ClientCreateReferRequest'
import { Tooltip } from "react-tooltip";

const config = require('../ClientComponents/Clientconfig')



function ClientReferComp() {
    const [modalShow, toggleModal] = useState(false)
    const [error, setError] = useState()
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOrdersData, setOrdersData] = useState([]);
    const [isFilterOrder,setFilterOrder] = useState([])
    const [isFilterValue,setFilterValue] = useState("");
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
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

    async function getRequestOrder() {
        await fetch(`${config['baseUrl']}/referal/getRefersForClient/${get_user_id}/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/referal/getRefersForClient/${get_user_id}/${parseInt(page)}`, {
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
            grow:0,
            minWidth: "50px",
        },
        {
            name: "Refer Email",
            selector: (row) => 
            <div className='pacDetailsBox'>
                {
                    row.email ?
                    <span className='mb-2 mt-2 package_name' data-tooltip-id='email' data-tooltip-content={`Email:`+ " " +row.email}
                    >{row.email}</span> :
                    <span className='mb-2 mt-2 package_name notFoundMsg'>Not Found</span>
                }
                <Tooltip
                    id="email"
                    place="bottom"
                />
            </div>

        },      
        {
            name: "Date",
            selector: (row) => 
            <div className='dataTableBox'>
                {row.updated_at?
                <span>{row.created_at.slice(0,10)}</span> :
                <span className="notFoundMsg">Not Found</span>}
            </div>
        }
    ]
    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getRequestOrder(page)
    }, [page])

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' '){
            setOrdersData(isFilterOrder)
        }else{
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item => 
                item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
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
             <h4 className='webQuotBoxOne'>Refer Details</h4>
                <div className="innerWebQuotBox">
                    <div className="btnBox">
                        <button onClick={openOrderModal}><Add_ico /> Create Refer</button>
                    </div>
                    <h4 className='webQuotBoxTwo'>Refer Details</h4>
                    <ClientSearchBar 
                        {...{OrderSearchFilter,isFilterValue}}
                    />
                </div>
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
            <ClientCreateReferRequest
                close={() => { toggleModal(false) }}
                {...{ modalShow }}
            />
        </>
    )
}

export default ClientReferComp