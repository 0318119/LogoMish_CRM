import React from 'react'
import { AiOutlineSearch as Search_ico } from "react-icons/ai";





function ClientSearchBar(props) {
  return (
    <>
    <div className='client_searchBar'>
        <Search_ico/>
        <input type="search" placeholder='Something search here'
          value={props.isFilterValue}
          onChange={props.OrderSearchFilter}
        />
    </div>
    </>
  )
}

export default ClientSearchBar