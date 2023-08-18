import React, { useState } from 'react'
import '../ClientComponents/assets/css/contactusForm.css'
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
const config = require('../ClientComponents/Clientconfig.json')

function ContactUsForm() {
    const [isSubject,setSubject] = useState();
    const [isMessage,setMessage] = useState();
    const [error, setError,] = useState();
    const [loading, setLoading] = useState(false);
    const [btnEnaledAndDisabled, setBtnEnaledAndDisabled] = useState("")
    const navigate = useNavigate()
    // ==================================
    var get_refresh_token = secureLocalStorage.getItem("refresh");
    var get_access_token = secureLocalStorage.getItem("access_token");

    const showAlert = (message, type) => {
        setError({
          message: message,
          type: type,
        })
      }

    const contactHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBtnEnaledAndDisabled(true);
        try {
            await fetch(`${config['baseUrl']}/client/CreateContact`, {
              method: "POST",
              headers: { "content-type": "application/json", "accessToken": `Bareer ${get_access_token}` },
              body: JSON.stringify({
                "subject" : isSubject,
                "message" : isMessage
              })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                if (response.messsage == "unauthorized") {
                    fetch(`${config['baseUrl']}/client/CreateContact`, {
                        method: "POST",
                        headers: { "content-type": "application/json", "refereshToken": `Bareer ${get_refresh_token}` },
                        body: JSON.stringify({
                            "subject" : isSubject,
                            "message" : isMessage
                          })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        secureLocalStorage.setItem("refresh", response.referesh_token);
                            secureLocalStorage.setItem("access_token", response.access_token);
                            showAlert('Your Query has been Submited', "success")
                            setLoading(false);
                            setBtnEnaledAndDisabled(false);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000)
                    }).catch((errs) => {
                        showAlert(errs.message, "warning")
                        setLoading(false);
                        setBtnEnaledAndDisabled(false);
                    })
                }
                else if(response.messsage == "timeout error"){
                    localStorage.clear()
                    sessionStorage.clear()
                    window.location.href='/'
                }
                else {
                    showAlert("Your Query has been Submited", "success")
                    setLoading(false);
                    setBtnEnaledAndDisabled(false);
                    setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                }
            })
        } catch (error) { 
            showAlert(error.message, "warning")
            setLoading(false);
            setBtnEnaledAndDisabled(false);
        }
    }

    return (
        <>
            <section className='contactForm'>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                        <ul>
                            {error && (
                                <li className={`alert alert-${error.type}` + " " + "m-3"}>{`${error.message}`}</li>
                            )}
                        </ul>
                            <div className="form-container">
                                <h3 className="title">Contact us</h3>
                                <form onSubmit={contactHandler}>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input type="text" className="form-control" required 
                                        placeholder="Enter Your Subject" 
                                        onChange={(e)=> {setSubject(e.target.value)}}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea className="form-control" placeholder='Enter Your Message' required
                                         onChange={(e)=> {setMessage(e.target.value)}}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn contactBtn ml-3" disabled={btnEnaledAndDisabled}>  {loading ? "A moment please..." : "Submit"} </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ContactUsForm