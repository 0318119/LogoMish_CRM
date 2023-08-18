import React from 'react'
import '../ClientComponents/assets/css/ClientDisputeOrder.css'
import OrderDataTable from 'react-data-table-component'
import useClipboard from "react-use-clipboard";
import { CSVLink } from "react-csv";
import ClientSearchBar from './ClientSearchBar';
function ClientDisputeOrderCom() {
    const Data = [
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
        {
            cusName: "John",
            Package: "1 Year Discounted Hosting",
            date: "19-Nov-22, 10:42 AM",
            amount: "$ -100",
            Payment_Method: "Paypal"
        },
    ];

    const [isCopied, setCopied] = useClipboard(JSON.stringify(columns));
    const countPerPage = 5;

    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1
        },
        {
            name: "Customer",
            selector: (row) => <span>{row.cusName}</span>

        },
        {
            name: "Package",
            selector: (row) => <span>{row.Package}</span>
        },
        {
            name: "Date",
            selector: (row) => <span>{row.date}</span>
        },
        {
            name: "Amount",
            selector: (row) => <span>{row.amount}</span>
        },
        {
            name: "Payment Method",
            selector: (row) => <span>{row.Payment_Method}</span>
        }
    ]
    return (
        <>
            <div className="client_disputeOrders">
                <div className="client_innerDisputeOrdersBox">
                    <div className="client_btnBox">
                        <button onClick={setCopied}> Copy</button>
                        {/* <CSVLink data={Data} filename={"LeadFile.csv"}>CSV</CSVLink> */}
                        <button>Excel</button>
                        <button>PDF</button>
                        <button>Print</button>
                    </div>
                    <ClientSearchBar />
                </div>
                <OrderDataTable
                    columns={columns}
                    data={Data}
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationPerPage={countPerPage}
                    paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                />
            </div>
        </>
    )
}

export default ClientDisputeOrderCom