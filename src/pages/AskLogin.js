import React from 'react'
import { Link } from 'react-router-dom'

function AskLogin() {
    return (
        <section className='askLoginBtnBox'>
            <div className="">
            <button type="button" className="btn btn-primary">
                <Link to="/Login">Internal Login</Link>
            </button>
            <button type="button" className="btn btn-primary">
                <Link to="/ClientLogin">Client Login</Link>
            </button>
            </div>
        </section>
    )
}

export default AskLogin