import React, { useState, useEffect } from 'react'
import '../components/assets/css/CustomersLeads.css'
import OrderDataTable from 'react-data-table-component'
import secureLocalStorage from "react-secure-storage";
import userImg from '../assets/images/icons/userIco.png'

// =================================================
const config = require('../components/config.json')

const ViewAllNotificationsCom = () => {
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLeadsData, setLeadsData] = useState([]);
    const [isFilterLeads, setFilterLeads] = useState([])
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_role = secureLocalStorage.getItem("role_id");
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);




    async function getNotifyofLeads() {
        await fetch(`${config['baseUrl']}/notifications/GetAllNotifications/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/notifications/GetAllNotifications/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setLeadsData(response.data)
                    setFilterLeads(response.data)
                    setDataLoader(true)
                    setRows(response.totalRows)
                }).catch((errs) => {
                    console.log("errs.data", errs)
                }).finally(() => { setLoading(false) })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setLeadsData(response.data)
                setFilterLeads(response.data)
                setDataLoader(true)
                setRows(response.totalRows)
                console.log("response.data", response.data)
            }
        }).catch((errs) => {
            console.log("errs.data", errs)
        }).finally(() => { setLoading(false) })
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
            name: "Leads Details",
            // grow: 0,
            // minWidth: "400px",
            // left: true,
            selector: (row) =>
                <div className='dataTableBox'>
                    <div className='dataTableFlexBox'>
                        <h5>
                            <img src={userImg} />
                        </h5>
                        <h6>
                            <span className='tableName'>
                                {row.heading}
                            </span>
                            <span className='tableEmail'>
                                {row.description}
                            </span>
                        </h6>
                    </div>
                </div>
        },
    ]
    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }

    useEffect(() => {
        getNotifyofLeads(page)
    }, [page])

    return (
        <>

            <div className="CusLeadsBox">
                <h4 className='CusLeadsBoxHeadOne'>Leads Notifications</h4>
                <div className="innerCusLeadsBox d-block">
                    <h4 className='CusLeadsBoxHeadTwo' style={{textAlign: "center"}}>Leads Notifications</h4>
                </div>
                <ul>
                    {/* {isErrGetAllPkgs && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isErrGetAllPkgs}`}</li>
                    )} */}

                </ul>
                {loading && (
                    <div className="loaderBox">
                        <div className="loader">
                            <div className="one"></div>
                            <div className="two"></div>
                            <div className="three"></div>
                            <div className="four"></div>
                        </div>
                        {/* <span>Loading...</span> */}
                    </div>
                )}
                {dataLoader && (
                    <>
                        <OrderDataTable
                            columns={columns}
                            data={isLeadsData}
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
                    </>
                )}
            </div></>
    )
}

export default ViewAllNotificationsCom