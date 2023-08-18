import React from 'react'
import '../components/assets/css/userStatistics.css'
import OrderDataTable from 'react-data-table-component'
import SearchBar from './SearchBar';
import useClipboard from "react-use-clipboard";
import { CSVLink } from "react-csv";

function UserStatisticsCom() {

    const Data = [
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        {
            Agent_Name	: "SHAWN DAVIS",
            Leads_generated: "158",
            Actions: "N/A",
        },
        
    ];

    const [isCopied, setCopied] = useClipboard(JSON.stringify(Data));

    const columns = [
        {
            name: "R.No",
            cell: (row, index) => index + 1
        },
        {
            name: "Agent Name",
            selector: (row) => <span>{row.Agent_Name}</span>

        },
        {
            name: "Leads Generated",
            selector: (row) => <span>{row.Leads_generated}</span>
        },
        {
            name: "Actions",
            selector: (row) => <span>{row.Actions}</span>
        }
    ]
    return (
        <>
            <div className="userStatisticsBox">
                <div className="inneruserStatisticsBox">
                    <div className="btnBox">
                        <button onClick={setCopied}> Copy</button>
                        {/* <CSVLink data={Data} filename={"LeadFile.csv"}>CSV</CSVLink> */}
                        <button>Excel</button>
                        <button>PDF</button>
                        <button>Print</button>
                    </div>
                    <SearchBar />
                </div>
                <OrderDataTable
                    columns={columns}
                    data={Data}
                    highlightOnHover
                    pagination={false}
                    paginationServer
                />
            </div>
        </>
    )
}

export default UserStatisticsCom