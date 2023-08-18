import React, { useState, useEffect, useRef } from 'react'
import OrderDataTable from 'react-data-table-component'
import '../components/assets/css/ordersTable.css'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import stripe_logo from '../assets/images/stripelogo.webp'
import paypal_logo from '../assets/images/paypal.webp'
import upwork_logo from '../assets/images/upworklogo.webp'
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { GrFormView as View_ico } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import { FiCopy as Copy_ico } from "react-icons/fi";
import { RiFileExcel2Fill as Excel_ico } from "react-icons/ri";
import { FiPrinter as Print_ico } from "react-icons/fi";
import userImg from '../assets/images/icons/userIco.png'

import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import { useReactToPrint } from 'react-to-print';
const config = require('../components/config.json')


function OneMonthOrder() {
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    const navigate = useNavigate()
    const [isdata, setdata] = useState([])
    const [isFilterOrder, setFilterOrder] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    // LOADERS 
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);

    async function getOneMonthOrders() {
        await fetch(`${config['baseUrl']}/orders/GetCurrentMonthOrders/0`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orders/GetCurrentMonthOrders/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setdata(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                }).finally(() => { setLoading(false) })
            }
            else if (response.messsage == "timeout error") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = '/'
            }
            else {
                setdata(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
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

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getOneMonthOrders(page)
    }, [page])


    const [isCopied, setCopied] = useClipboard(JSON.stringify(isdata));

    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1,
            grow: 0,
            minWidth: "50px",
        },
        {
            name: "Customer Details",
            grow: 0,
            minWidth: "400px",
            left: true,
            selector: (row) =>
                <div className='dataTableBox'>
                    <div className='dataTableFlexBox'>
                        <h5>
                            <img src={userImg} />
                        </h5>
                        <h6>
                            <span data-tooltip-id='row-name' data-tooltip-content={`Name :` + " " + row.name} className='tableName'>
                                {row.name}
                            </span>
                            <span data-tooltip-id='row-email' data-tooltip-content={`Email :` + " " + row.email} className='tableEmail'>
                                {row.email}
                            </span>
                        </h6>
                    </div>
                    <Tooltip
                        id="row-name"
                        place="bottom"
                    />
                    <Tooltip
                        id="row-email"
                        place="bottom"
                    />
                    <Tooltip
                        id="row-number"
                        place="bottom"
                    />
                </div>
        },
        {
            name: "Phone",
            grow: 0,
            left: true,
            selector: (row) =>
                <div className='dataTableBox'>
                    <span style={{ fontSize: "11px" }}
                        data-tooltip-id='row-number'
                        data-tooltip-content={`Number :` + " " + row.number}>{row.number}
                    </span>

                    <Tooltip
                        id="row-number"
                        place="bottom"
                    />
                </div>
        },
        {
            name: "Package Details",
            selector: (row) =>
                <div className='pacDetailsBox'>
                    <>
                        {
                            row.package_name ?
                                <span className="mt-2 package_name" data-tooltip-id='package_name' data-tooltip-content={`Package name :` + " " + row.package_name}>
                                    {row.package_name}
                                </span> :
                                <span className="notFoundMsg">Not Found</span>
                        }
                        {
                            row.amount ?
                                <span data-tooltip-id='amount' className='mb-2 mt-2 package_name' data-tooltip-content={`Amount:` + " " + `$${row.amount}`}>
                                    {`$${row.amount}`}</span> :
                                <span className="notFoundMsg">Not Found</span>
                        }
                    </>
                    <Tooltip
                        id="package_name"
                        place="bottom"
                    />
                    <Tooltip
                        id="amount"
                        place="bottom"
                    />
                </div>
        },
        {
            name: "Payment",
            grow: 0,
            selector: (row) =>
                <div className='dataTableBox'>
                    {row.payment_method == "stripe" ?
                        <img src={stripe_logo} alt="" />
                        : row.payment_method == "paypal" ?
                            <img src={paypal_logo} alt="" />
                            : row.payment_method == "upwork" ?
                                <img src={upwork_logo} alt="" />
                                : row.payment_method == "Stripe" ?
                                    <img src={stripe_logo} alt="" />
                                    : row.payment_method == "Paypal" ?
                                        <img src={paypal_logo} alt="" />
                                        : row.payment_method == "Upwork" ?
                                            <img src={upwork_logo} alt="" />
                                            : <span className="notFoundMsg">Not Found</span>
                    }
                </div>
        },
        {
            name: "Invoice",
            grow: 0,
            minWidth: "62px",
            selector: (row) =>
                <div className='dataTableIconBox'>
                    {row.invoice ?
                        <a href={`https://payments-api.logomish.com${row.invoice !== null && row.invoice !== undefined && row.invoice !== "" ? row.invoice.split('/uploads')[1] : ""}`} target='_blank'>
                            <View_ico />
                        </a>
                        :
                        <span className="notFoundMsg">Not Found</span>}
                    <Tooltip
                        anchorSelect=".row-invoice"
                        place="bottom"
                        content="View Invoice"
                    />
                </div>
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "90px",
            selector: (row) =>
                <div className=''>
                    {row.created_at ?
                        <span>{row.created_at.slice(0, 10)}</span> :
                        <span className="notFoundMsg">Not Found</span>}
                </div>
        }


    ]

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setdata(isFilterOrder)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()) || item.payment_method.toLowerCase().includes(e.target.value.toLowerCase()))
                setdata(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(isdata);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "data" + fileExtension);
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "One Month Order Details",
        pageStyle: "print",
    });

    const handlehideShow = () => {
        document.getElementById('hidediv').style.display = 'block'
        setTimeout(() => {
            document.getElementById('hidediv').style.display = 'none'
        }, 1);
    }

    return (
        <>
            <div className="oneMonthOrderBox mt-5">
                <div className="innerOrderBox">
                    <div className="btnBox">
                        <button onClick={setCopied} className='copyBelow'><Copy_ico /></button>
                        <button className='makeExcelFile' onClick={(e) => { exportToExcel() }}><Excel_ico /></button>
                        <button className='PrintFile' onClick={() => {
                            handlehideShow()
                            handlePrint()
                        }}><Print_ico /></button>
                        <Tooltip
                            anchorSelect=".copyBelow"
                            place="bottom"
                            content="Copy Below Data"
                            style={{ zIndex: "9999" }}
                        />
                        <Tooltip
                            anchorSelect=".makeExcelFile"
                            place="bottom"
                            content="Make Excel File of below Data"
                            style={{ zIndex: "9999" }}
                        />
                        <Tooltip
                            anchorSelect=".PrintFile"
                            place="bottom"
                            content="Print out of below data"
                            style={{ zIndex: "9999" }}
                        />
                    </div>
                    <SearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <div className="oneMonthDataTableScrollBox">
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
                        <OrderDataTable
                            columns={columns}
                            data={isdata}
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

                    {dataLoader && (
                        <div ref={componentRef} id='hidediv' style={{ display: "none" }}>
                            <table style={{ width: "100%", padding: "50px" }}>
                                <thead className='printTableHead'>
                                    <tr>
                                        <th>Customer Details</th>
                                        <th>Phone</th>
                                        <th>Pack Details</th>
                                        <th>Payment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody className='printTableBody'>
                                    {isdata?.map((items) => {
                                        return (
                                            <tr key={items?.id}>
                                                <td style={{ display: "flex", flexDirection: "column" }}>
                                                    <span> {items?.name ? items?.name : "Not Found Name"}</span>
                                                    <span>{items?.email ? items?.email : "Not Found Email"}</span>
                                                </td>
                                                <td>
                                                    <span>{items?.number}</span>
                                                </td>
                                                <td style={{ display: "flex", flexDirection: "column" }}>
                                                    <span> {items?.package_name ? items?.package_name : "Not Found package name"}</span>
                                                    <span>{items?.amount ? `${"$" + items?.amount}` : ""}</span>
                                                </td>
                                                <td>
                                                    <span>{items?.payment_method ? items?.payment_method : "Not Found Payment Method"}</span>
                                                </td>
                                                <td>
                                                    <span> {items?.created_at ? items?.created_at.slice(0, 10) : "Not Found"}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default OneMonthOrder