import React from 'react'
import { AiOutlineSearch as Search_ico } from "react-icons/ai";





function SearchBar(props) {
  return (
    <>
    <div className='searchBar'>
        <Search_ico/>
        <input type="search" placeholder='Something search here'
        value={props.isFilterValue}
        onChange={props.OrderSearchFilter}
        />
    </div>
    </>
  )
}

export default SearchBar