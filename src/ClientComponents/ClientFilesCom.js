import React, { useEffect, useState } from 'react'
import ClientSearchBar from '../ClientComponents/ClientSearchBar'
import './assets/css/clienttopBar.css'
import '../ClientComponents/assets/css/clientFiles.css'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router-dom'
import OrderDataTable from 'react-data-table-component'
import word_ico from '../assets/images/icons/wordIco.webp'
import excel_ico from '../assets/images/icons/excel_ico.webp'
import { AiOutlineFileText as File_ico } from "react-icons/ai";
import { RxCrossCircled as Close_ico } from "react-icons/rx";
import { AiOutlineDownload as Download_ico } from "react-icons/ai";
import { FcImageFile as Picture_ico } from "react-icons/fc";
import { CgInsertBeforeR as Insert_cio } from "react-icons/cg";
import { BsLink45Deg as Insert_link_ico } from "react-icons/bs";
import { MdOutlineViewInAr as View_link_ico } from "react-icons/md";
import axios from 'axios'
import { Tooltip } from "react-tooltip";
const config = require('../ClientComponents/Clientconfig')



function ClientFilesCom() {
    const [error, setError] = useState()
    const [dataLoader, setDataLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isOrderData, setOrderData] = useState([])
    const [isFilterOrder, setFilterOrder] = useState([])
    const [isFilterValue, setFilterValue] = useState("");
    const [isOrderFiles, setOrderFiles] = useState([])
    const [isFiledialogueBox, setFiledialogueBox] = useState(false);
    const [isPicture, setPicture] = useState('');
    const [isInsertModule, setInsertModule] = useState(false);
    const [isInsertId, setInsertId] = useState();
    const [isUpdateId, setUpdateId] = useState();
    const [btnloading, setbtnLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const [isFilesError, setFilesError] = useState();
    const [ids, setids] = useState("")
    const [page, setPage] = useState(0)
    const [Isrows, setRows] = useState([]);
    // ==========
    const [isOrdersErr, setOrdersErr] = useState()
    const [isOrderFilesErr, setOrdersFilesErr] = useState()
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");
    var get_user_id = secureLocalStorage.getItem("user_id");
    var get_client_id = secureLocalStorage.getItem("client_id");


    const navigate = useNavigate()
    // =========

    const filesAlert = (message, type) => {
        setFilesError({
            message: message,
            type: type,
        })
    }
    async function getOrders() {
        await fetch(`${config['baseUrl']}/clients/GetClientOrders/${parseInt(page)}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/clients/GetClientOrders/${parseInt(page)}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrderData(response.data)
                    setFilterOrder(response.data)
                    setRows(response.totalRows)
                    setDataLoader(true)
                }).catch((errs) => {
                    setOrdersErr(errs.message)
                }).finally(() => {
                    setLoading(false)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setOrderData(response.data)
                setFilterOrder(response.data)
                setRows(response.totalRows)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setOrdersErr(errs.message)
        }).finally(() => {
            setLoading(false)
        })
    }
    async function getFiles() {
        await fetch(`${config['baseUrl']}/clients/getOrderfilesByClientId/${get_client_id}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/clients/getOrderfilesByClientId/${get_client_id}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    secureLocalStorage.setItem("refresh", response.referesh_token);
                    secureLocalStorage.setItem("access_token", response.access_token);
                    setOrderFiles(response.data)
                    setDataLoader(true)
                }).catch((errs) => {
                    setOrdersFilesErr(errs.message)
                }).finally(() => {
                    setLoading(false)
                })
            }
            else if(response.messsage == "timeout error"){
                localStorage.clear()
                sessionStorage.clear()
                window.location.href='/'
            }
            else {
                setOrderFiles(response.data)
                setDataLoader(true)
            }
        }).catch((errs) => {
            setOrdersFilesErr(errs.message)
        }).finally(() => {
            setLoading(false)
        })
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
                            <span className='mb-2 mt-2 package_name' data-tooltip-id='name-row' data-tooltip-content={`Name:` + " " + row.name}
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
            name: "Your Files",
            selector: (row) => <div className='dataTableIconBox' data-id={row.id} data-client-id={row.client_id}>
                <button className='UpdateFile commintBtn' onClick={() => {
                    filesHandler()
                    setids(row.id)
                }}><File_ico />
                </button>
                <Tooltip
                    anchorSelect=".UpdateFile"
                    place="bottom"
                    content="Update and view file Box"
                />
            </div>
        },
        {
            name: "Your Links",
            selector: (row) =>
                <div className='dataTableIconBox'>
                    <button className='UpdateLink commintBtn' onClick={() => {
                        getLinks(row.id)
                        // setUpdateLinkId(row.id)
                    }}><View_link_ico /></button>
                    <Tooltip
                        anchorSelect=".UpdateLink"
                        place="bottom"
                        content="Update and view Links Box"
                    />
                </div>
        },
        {
            name: "Insert File",
            selector: (row) => <div className='dataTableIconBox'>
                <button className='insertBtn updateAlert' onClick={insertClick} data-id={row.id} value={row.id}><Insert_cio /></button>
                <Tooltip
                    anchorSelect=".insertBtn"
                    place="bottom"
                    content="Insert File"
                />
            </div>
        },
        {
            name: "Insert Links",
            selector: (row) =>
                <div className='dataTableIconBox'>
                    <button className='insertlink updateAlert' onClick={OpenInsertBox} data-id={row.id}><Insert_link_ico /></button>
                    <Tooltip
                        anchorSelect=".insertlink"
                        place="bottom"
                        content="Insert Link"
                    />
                </div>
        }
    ]

    const handlePageChange = page => {
        setPage(parseInt(page) - 1)
    }
    useEffect(() => {
        getOrders(page)
    }, [page])
    useEffect(() => {
        getFiles()
    }, [])

    const OrderSearchFilter = (e) => {
        if (e.target.value == ' ') {
            setOrderData(isFilterOrder)
        } else {
            setLoading(true)
            setDataLoader(false)
            setTimeout(() => {
                const filterResult = isFilterOrder.filter(item =>
                    item.name.toLowerCase().includes(e.target.value.toLowerCase()))
                setOrderData(filterResult)
                setLoading(false)
                setDataLoader(true)
            }, 2000);
        }
        setFilterValue(e.target.value)
    }
    const filesHandler = () => {
        setFiledialogueBox(!isFiledialogueBox)
    }
    const insertClick = async (e) => {
        setInsertModule(!isInsertModule)
        setInsertId(e.currentTarget.getAttribute('data-id'))
    }
    const uploadFile = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);

        let formData = new FormData();
        formData.append("file", isPicture);
        formData.append("client_id", get_client_id);
        formData.append("order_id", isInsertId);
        await axios
            .post(`https://payments-api.logomish.com/clients/orderfileInsert`, formData, {
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    Accept: "form-data",
                },
            }).then((response) => {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                if (response.status == 503) {
                    filesAlert("Your Files Already exists", "warning")
                } else if (response.status == 200) {
                    filesAlert("Your File has been uploaded", "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            }).catch((errors) => {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                filesAlert(errors.message, "warning")
            });
    }
    const [getUpdateId, setgetUpdateId] = useState(null)
    const updateFile = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        setgetUpdateId(e.currentTarget.getAttribute('data-id'))
        var order_id = e.currentTarget.getAttribute('data-order-id')

        let formData = new FormData();
        formData.append("id", getUpdateId);
        formData.append("order_id", order_id);
        formData.append("file", isPicture);
        await axios
            .post(`https://payments-api.logomish.com/clients/updateOrderfiles`, formData, {
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    Accept: "form-data",
                },
            }).then((response) => {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                if (response.status == 503) {
                    filesAlert("Your Files Already exists", "warning")
                } if (response.status == 200) {
                    filesAlert("Your File has been updated", "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                }
            }).catch((errors) => {
                setbtnLoading(false);
                setBtnEnaledAndDisabled(false);
                filesAlert(errors.message, "warning")
            });
    }
    const [isInsertLinkBox, setisInsertLinkBox] = useState(false)
    const OpenInsertBox = (e) => {
        setisInsertLinkBox(!isInsertLinkBox)
        setInsertId(e.currentTarget.getAttribute('data-id'))
    }
    const [linktext, setlinktext] = useState("");
    const LinkHandler = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/orderlinks/CreateOrderLink`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "order_id": isInsertId,
                    "link": linktext
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/orderlinks/CreateOrderLink`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "order_id": isInsertId,
                            "link": linktext
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        filesAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }).catch((errors) => {
                        filesAlert(errors.message, "warning")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    setbtnLoading(false);
                    setBtnEnaledAndDisabled(false);
                    filesAlert(response.message, "success")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        } catch (errors) {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            filesAlert(errors.message, "warning")
        }
    }
    const [showUpdateLinkModule, setshowUpdateLinkModule] = useState(false)
    const [UpdateLinkId, setUpdateLinkId] = useState(null)
    const [linksData, setLinksData] = useState([]);
    const [linkGetErr, setlinkGetErr] = useState(false)
    const [linkdataLoader, setlinkDataLoader] = useState(false);
    const [linkloading, setlinkLoading] = useState(true);
    const getLinks = async (e) => {
        setshowUpdateLinkModule(!showUpdateLinkModule)
        await fetch(`${config['baseUrl']}/orderlinks/getOrderLinksByOrderIdForClient/${e}`, {
            method: "GET",
            headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` }
        }).then((response) => {
            return response.json()
        }).then(async (response) => {
            if (response.messsage == "unauthorized") {
                await fetch(`${config['baseUrl']}/orderlinks/getOrderLinksByOrderIdForClient/${e}`, {
                    method: "GET",
                    headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` }
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.messsage == "timeout error") { navigate('/') }
                    else {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        setLinksData(response?.data)
                        setlinkDataLoader(true)
                    }
                }).catch((errs) => {
                    setlinkGetErr(errs.message)
                })
                .finally(() => {
                    setlinkLoading(false)
                })
            }
            else {
                setLinksData(response?.data)
                setlinkDataLoader(true)
            }
        }).catch((errs) => {
            setlinkGetErr(errs.message)
        })
        .finally(() => {
            setlinkLoading(false)
        })
    }
    const [islinkOrderId, setLinkOrderId] = useState(null)
    const [islinkId, setLinkId] = useState(null)
    const updateLinkText = async (e) => {
        e.preventDefault();
        setbtnLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/orderlinks/UpdateOrderLink`, {
                method: "POST",
                headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
                body: JSON.stringify({
                    "id": islinkId,
                    "order_id": islinkOrderId,
                    "link": linktext
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/orderlinks/UpdateOrderLink`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "id": islinkId,
                            "order_id": islinkOrderId,
                            "link": linktext
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                        secureLocalStorage.setItem("access_token", response.access_token);
                        if(response.success){
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            filesAlert(response.message, "success")
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }else{
                            setbtnLoading(false);
                            setBtnEnaledAndDisabled(false);
                            filesAlert(response.message, "warning")
                        }
                    }).catch((errors) => {
                        filesAlert(errors.message, "warning")
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    if(response.success){
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        filesAlert(response.message, "success")
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }else{
                        setbtnLoading(false);
                        setBtnEnaledAndDisabled(false);
                        filesAlert(response.message, "warning")
                    }
                }
            })
        } catch (errors) {
            setbtnLoading(false);
            setBtnEnaledAndDisabled(false);
            filesAlert(errors.message, "warning")
        }
    }

    return (
        <>
            <div className="client_files">
                <h4>Your Order Files</h4>
                <div className="client_innerFilesBox">
                    <ClientSearchBar
                        {...{ OrderSearchFilter, isFilterValue }}
                    />
                </div>
                <ul>
                    {error && (
                        <li className={`alert alert-${error.type}` + " " + "mt-4"}>{`${error.message}`}</li>
                    )}
                    {isOrdersErr && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isOrdersErr}`}</li>
                    )}
                    {isOrderFilesErr && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${isOrderFilesErr}`}</li>
                    )}
                    {linkGetErr && (
                        <li className={`alert alert-warning` + " " + "m-3"}>{`${linkGetErr}`}</li>
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
                        data={isOrderData}
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
            {isFiledialogueBox && (
                <>
                    <div className="client_filesViewBox">
                        <div className="client_innerfilesViewBox">
                            <h3>
                                <Close_ico onClick={() => { setFiledialogueBox(false) }} />
                            </h3>
                            <h5>Your Files</h5>
                            {isFilesError && (
                                <li className={`alert alert-${isFilesError.type}` + " " + "mt-4"}>{`${isFilesError.message}`}</li>
                            )}
                            <div>
                                {
                                    isOrderFiles && isOrderFiles.length > 0 && isOrderFiles.filter(data => data.order_id == ids).length > 0 ? isOrderFiles.filter(data => data.order_id == ids).map((items) => {
                                        return (
                                            items.file?.match(/\.(jpg|jpeg|png|webp)$/) ?
                                                <>
                                                    <div className="client_fileItems">
                                                        <div className='client_fileFlex'>
                                                            <Picture_ico />
                                                            <span>{items.file.split('orderfiles/')[1].slice(0, 10)}</span>
                                                            <h5><a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} target='_blank' download={true}><Download_ico /></a></h5>
                                                        </div>
                                                        <div className="client_fileEditInputBox">
                                                            <input type="file" onChange={(e) => {
                                                                setPicture(e.target.files[0])
                                                            }} />
                                                            <button type="submit" onClick={updateFile} data-id={items.id} data-order-id={items.order_id} disabled={btnEnaledAndDisabled}>
                                                                {getUpdateId == items.id ? btnloading ? "A moment please..." : "Update" : "Update"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </> : items.file?.match(/\.(doc|docx)$/) ?
                                                    <>
                                                        <div className="client_fileItems">
                                                            <div className="client_fileFlex">
                                                                <img src={word_ico} alt="" />
                                                                <span>{items.file.split('orderfiles/')[1].slice(0, 10)}</span>
                                                                <h5><a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} download={true} target='_blank'><Download_ico /></a></h5>
                                                            </div>
                                                            <div className="client_fileEditInputBox">
                                                                <input type="file" onChange={(e) => { setPicture(e.target.files[0]) }} />
                                                                <button type="submit" onClick={updateFile} data-id={items.id} data-order-id={items.order_id} disabled={btnEnaledAndDisabled}>
                                                                    {getUpdateId == items.id ? btnloading ? "A moment please..." : "Update" : "Update"}</button>
                                                            </div>
                                                        </div>
                                                    </> : items.file?.match(/\.(xlsx|xls)$/) ?
                                                        <>
                                                            <div className="client_fileItems">
                                                                <div className="client_fileFlex">
                                                                    <img src={excel_ico} alt="" />
                                                                    <span>{items.file.split('orderfiles/')[1].slice(0, 10)}...</span>
                                                                    <h5><a href={`https://payments-api.logomish.com${items.file!==null&&items.file!==undefined&&items.file!==""?items.file.split('/uploads')[1]:""}`} download={true} target='_blank'><Download_ico /></a></h5>
                                                                </div>
                                                                <div className="client_fileEditInputBox">
                                                                    <input type="file" onChange={(e) => { setPicture(e.target.files[0]) }} />
                                                                    <button type="submit" onClick={updateFile} data-id={items.id} data-order-id={items.order_id} disabled={btnEnaledAndDisabled}>
                                                                        {getUpdateId == items.id ? btnloading ? "A moment please..." : "Update" : "Update"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </> : ""
                                        )
                                    }) : <span style={{ color: "white" }}>Not Found Files</span>
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isInsertModule && (
                <div className='client_insertModuleMainBox'>
                    <div className="client_innerInsertFileBox">
                        <h3><Close_ico onClick={() => { setInsertModule(false) }} /></h3>
                        <h5>Upload File</h5>
                        {isFilesError && (
                            <li className={`alert alert-${isFilesError.type}` + " " + "mt-4"}>{`${isFilesError.message}`}</li>
                        )}
                        <div className="client_fileInputBox">
                            <input type="file" onChange={(e) => { setPicture(e.target.files[0]) }} />
                            <div className="client_iconFileBox">
                                <Picture_ico />
                                <span>Browse Your File</span>
                            </div>
                        </div>
                        <button type="submit" onClick={uploadFile} disabled={btnEnaledAndDisabled}>  {btnloading ? "A moment please..." : "Submit"}</button>
                    </div>
                </div>
            )}

            {isInsertLinkBox && (
                <div className='client_insertModuleMainBox'>
                    <div className="client_innerInsertFileBox">
                        <h3><Close_ico onClick={() => { setisInsertLinkBox(false) }} /></h3>
                        <h5>Paste your Link here</h5>
                        {isFilesError && (
                            <li className={`alert alert-${isFilesError.type}` + " " + "mt-4"}>{`${isFilesError.message}`}</li>
                        )}
                        <div className="">
                            <textarea placeholder='Paste Your Links !' onChange={(e) => { setlinktext(e.target.value) }}></textarea>
                        </div>
                        <button type="submit" onClick={LinkHandler} disabled={btnEnaledAndDisabled}>
                            {btnloading ? "A moment please..." : "Submit"}</button>
                    </div>
                </div>
            )}

            {showUpdateLinkModule && (
                <>

                    <div className="client_filesViewBox">
                        <div className="client_innerfilesViewBox">
                            <h3>
                                <Close_ico onClick={() => { setshowUpdateLinkModule(false) }} />
                            </h3>
                            <h5>Your Links</h5>
                            {isFilesError && (
                                <li className={`alert alert-${isFilesError.type}` + " " + "mt-4"}>{`${isFilesError.message}`}</li>
                            )}
                            {linkloading && (
                                <div className="">
                                    <div className="loader">
                                        <div className="one"></div>
                                        <div className="two"></div>
                                        <div className="three"></div>
                                        <div className="four"></div>
                                    </div>
                                </div>
                            )}
                            <div>
                                {linkdataLoader && (
                                    <>
                                        {linksData.length>0? linksData?.map((itemLinks) => {
                                            return (
                                                <div className="client_fileItems">
                                                    <div className='client_fileFlex' style={{justifyContent: "start"}}>
                                                        <a href={itemLinks.link} target='_blank'>{itemLinks.link.slice(0,30)}...</a>
                                                    </div>
                                                    <div className="client_fileEditInputBox mt-2">
                                                        <input type="text" style={{ width: "100%", border: "1px solid lightgray", borderRadius: "5px" }} 
                                                            onChange={(e) => { setlinktext(e.target.value) }} 
                                                        />
                                                        <button type="submit"
                                                            onClick={(e) => {
                                                                updateLinkText(e)
                                                                setLinkOrderId(itemLinks.order_id)
                                                                setLinkId(itemLinks.id)
                                                            }}
                                                            disabled={btnEnaledAndDisabled}>
                                                            {islinkId == itemLinks.id ? btnloading ? "A moment please..." : "Update" : "Update"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }) : ""}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ClientFilesCom