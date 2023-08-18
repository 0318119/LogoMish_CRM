import React, { useState, useEffect } from "react"
import "../navbar/Navbar.css"
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { ResumeGetById } from "../../actions/Resumegetbyid";
import useWindowDimensions from '../administrator/innerwidthcom';
import { Empty } from 'antd';
import EmployerNav from "../dropdownnav/Employernav";
import "./pdfcss.css"
import { Drawer, Button, Space, Radio } from 'antd';
import Modal from "react-modal";
import moblogo from "../../assets/mob-logo.png"
import Contact from "../../assets/contact.PNG"
import Education from "../../assets/edu.PNG"
import Contactingo from "../../assets/contactinfo.PNG"
import { Skeleton } from 'antd';
import Education1 from "../../assets/education3.PNG"
import dateFormat, { masks } from "dateformat";
import Awards from "../../assets/awards.PNG"
import Ex from "../../assets/ex.PNG"
import Mili from "../../assets/mili.PNG"
import { PDFExport } from "@progress/kendo-react-pdf";
import parse from "html-react-parser"
import PrintPage from "./pp";
import { createPdfFromHtml } from "./logic";
import { createGlobalStyle } from "styled-components";

const config = require('../../helpers/config.json');
Modal.setAppElement("#root");

const SeachResume = (props) => {
  const { height, width } = useWindowDimensions();
  const [pgno, setpgno] = useState(0)
  const [totnopgs, settotnopgs] = useState(0)
  const [downloads, setdownloads] = useState(null)
  const [remainingdownloads, setremainingdownloads] = useState(null)
  const [allcom, setallcom] = useState([])
  const [contactremain, setcontactremain] = useState([])
  const [remaincontact, setremaincontact] = useState("")
  const [totalremaincontact, settotalremaincontact] = useState("")
  const [currentpage, setcurrentpage] = useState(1)
  const [postperpage, setpostperpage] = useState(10)
  const indexoflastpost = currentpage * postperpage;
  const indexoffirstpost = indexoflastpost - postperpage;
  const [allArray, setallArray] = useState([])
  const [allArray3, setallArray3] = useState([])
  const currentpost = allArray && allArray.length > 0 && allArray[0].job && allArray[0].job.length > 0 ? allArray[0].job : [];
  const pdfExportComponent = React.useRef(null);
  const [temp, settemp] = useState([])
  const [dis, setdis] = useState("")
  const [BilingmodalIsOpen3, setBilingModalIsOpen3] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [searchItem1, setSearchItem1] = useState("");
  const [alldownloads, setalldownloads] = useState([])
  const [allArray1, setallArray1] = useState([])
  const [load, setload] = useState(false)
  const [saveresumeid, setsaveresumeid] = useState("")
  const [filterid, setfilterid] = useState(null)
  const [filteredPosts, setfilteredPosts] = useState([])




  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('left');

  const showDrawer = () => {
    setVisible(true);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const onClose = () => {
    setVisible(false);
  };







  const [relecolor, setrelecolor] = useState(false)
  const searchsortrelevance = () => {
    window.location.reload(false)
    setrelecolor(true)
  }
  const [modalwidth, setmodalwidth] = useState(550)
  const savedDownload = async (id) => {
    await fetch(`${config['baseUrl']}/Save/Download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "user_id": localStorage.getItem("userid"),
        "resume_id": id
      })
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        console.log("Limit Over")
      }
      return res.json();
    }).then((response) => {

    }).catch((error) => {
      console.log(error)
      // 
    })
  }
  useEffect(()=>{
    fetch(`${config['baseUrl']}/Get/Downloads/${localStorage.getItem("userid")}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json()).then((response) => {
      setload(false)
      const alljobs = response
      setdownloads(Number(response.downloads))
      setremainingdownloads(Number(response.contact_remaining))
      alldownloads.push(response)
      setalldownloads(alldownloads)
    }).catch((error) => {
      console.log("error", error);
      setload(false)
    })

  },[savedDownload])
  useEffect(async () => {
    if (width <= 900) {
      setmodalwidth("340px")
    }
    setload(true)
    fetch(`${config['baseUrl']}/Get/Downloads/${localStorage.getItem("userid")}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json()).then((response) => {
      setload(false)
      const alljobs = response
      setdownloads(Number(response.downloads))
      setremainingdownloads(Number(response.contact_remaining))
      alldownloads.push(response)
      setalldownloads(alldownloads)
      console.log(alldownloads)
    }).catch((error) => {
      console.log("error", error);
      setload(false)
    })

    fetch(`${config['baseUrl']}/resume/getCompnay`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json())
      .then((response) => {
        setallcom(response.job)
      }).catch((error) => {
        console.log("error", error);
        // 
      })


    fetch(`${config['baseUrl']}/packages/getContactRemainings/${localStorage.getItem("userid")}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json())
      .then((response) => {
        setcontactremain(response.job)
        var re = Number(response.job[0].contacted)
        var sre = response.job[0].Contact.split(" ")[0]
        var tre = Number(sre)
        var tree = tre - re
        setremaincontact(tree)
        settotalremaincontact(tre)
      }).catch((error) => {
        console.log("error", error);
        // 
      })
      fetch(`${config['baseUrl']}/resume/save/get/${localStorage.getItem("userid")}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        const alljobs = response.date_saved
        var temp = []
        temp = [...response.date_saved]
        setallArray3(temp);
      }).catch((error) => {
        console.log("error", error);
  
      })
  }, []);
  // take
  const [exppage, setexppage] = useState(false)
  const [expvalue, setexpvalue] = useState()
  const [edupage, setedupage] = useState(false)
  const [eduvalue, seteduvalue] = useState()
  const [lastpage, setlastpage] = useState(false)
  const [lastvalue, setlastvalue] = useState()
  const [sortpage, setsortpage] = useState(false)
  const [sortvalue, setsortvalue] = useState()
  const [exclpage, setexclpage] = useState(false)
  const [exclvalue, setexclvalue] = useState()
  const [dispage, setdispage] = useState(false)
  const [disvalue, setdisvalue] = useState(0)
  const [compage, setcompage] = useState(false)
  const [comvalue, setcomvalue] = useState()
  const [milpage, setmilpage] = useState(false)
  const [milvalue, setmilvalue] = useState()
  const [secpage, setsecpage] = useState(false)
  const [secvalue, setsecvalue] = useState()
  const [loaderfeil, setloaderfeil] = useState(true)

  setTimeout(() => setloaderfeil(false), 5000);
  const pages = new Array(totnopgs).fill(null).map((v, i) => i);
  useEffect(() => {
    if (exppage == true) {
      onworkexkHandler(expvalue)
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
    }
    else if (edupage == true) {
      oneduHandler(eduvalue)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (lastpage == true) {
      ontimeHandler(lastvalue)
      setedupage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (sortpage == true) {
      searchsortdate(sortvalue)
      setedupage(false)
      setlastpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (exclpage == true) {
      onexconHandler()
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (dispage == true) {
      distencemeter(disvalue)
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setcompage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (compage == true) {
      oncompanyHandler(comvalue)
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setmilpage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (milpage == true) {
      onmilHandler()
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setsecpage(false)
      setexppage(false)
    }
    else if (secpage == true) {
      onsecHandler(secvalue)
      setedupage(false)
      setlastpage(false)
      setsortpage(false)
      setexclpage(false)
      setdispage(false)
      setcompage(false)
      setmilpage(false)
      setexppage(false)
    }
    else {
      setload(true)
      fetch(`${config['baseUrl']}/resume/get?page=${pgno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.job
        setresume_u_id(response.job[0].user_id)
        setpdfContent(response.job[0].user_id)
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
  }, [pgno])
  // take
  const[bg,setbg]=useState("light")
  const[bg2,setbg2]=useState("light")
  const[pgnobg,setpgnobg]=useState(0)
  const gotoprevious = () => {
    setpgno(Math.max(0, pgno - 1))
    setpgnobg(Math.max(0, pgno - 1))
    setbg("dangerr")
    setbg2("light")
    setTimeout(() => {
      setbg("light")
    }, 200);
  }
  const gotonext = () => {
    setpgno(Math.min(totnopgs - 1, pgno + 1))
    setpgnobg(Math.min(totnopgs - 1, pgno + 1))
    setbg("light")
    setbg2("dangerr")
    setTimeout(() => {
      setbg2("light")
    }, 200);
  }

  useEffect(() => {
    let filtered = allArray && allArray.length > 0 ? allArray.filter((jj) => {
      return (jj.city.toLowerCase().includes(searchItem.toLowerCase()) || jj.zipcode.toLowerCase().includes(searchItem.toLowerCase()) || jj.state.toLowerCase().includes(searchItem.toLowerCase()) || jj.Job_title.toLowerCase().includes(searchItem.toLowerCase()))
    }) : ""
    setfilteredPosts(filtered);
    var filid = filtered[0] ? filtered[0].id : ""
    setfilterid(filid)
    props.ResumeGetById(filid)
  }, [searchItem, allArray]);
  const[pdfContent,setpdfContent]=useState(0)
  const getresumebyidfil = (id,downid) => {
    setresume_u_id(downid)
    props.ResumeGetById(id)
    setpdfContent(downid)
    
  }
  const [savebtn, setsavebtn] = useState(false)
  const savedresume = async (id) => {
    setsavebtn(true)
    props.ResumeGetById(id)
    await fetch(`${config['baseUrl']}/resume/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "user_id": localStorage.getItem("userid"),
        "resume_id": saveresumeid
      })
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        console.log("Limit Over")
      }
      return res.json();
    }).then((response) => {
      if (response.message == "Resume Already Saved.") {
        setBilingModalIsOpen2(false)
        setBilingModalIsOpen9(true)
      }
      else {
        window.location.reload(false)
      }
    }).catch((error) => {
      console.log(error)
      // 
    })
  }
  const savedresume1 = async (id,fav) => {
    setsavebtn(true)
    props.ResumeGetById(id)
    await fetch(`${config['baseUrl']}/resume/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "user_id": localStorage.getItem("userid"),
        "resume_id": id,
        "fav":fav
      })
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        console.log("Limit Over")
      }
      return res.json();
    }).then((response) => {
      if (response.message == "Resume Already Saved.") {
        setBilingModalIsOpen2(false)
        setBilingModalIsOpen9(true)
      }
      else if(response.message == "Resume Saved Successfully."){
        fetch(`${config['baseUrl']}/resume/save/get/${localStorage.getItem("userid")}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', },
        }).then(res => res.json()).then((response) => {
          const alljobs = response.date_saved
          var temp = []
          temp = [...response.date_saved]
          setallArray3(temp);
        }).catch((error) => {
          console.log("error", error);
    
        })
      }
      else {
        // window.location.reload(false)
      }
    }).catch((error) => {
      console.log(error)
      // 
    })
  }


  const [BilingmodalIsOpen2, setBilingModalIsOpen2] = useState(false);
  const [BilingmodalIsOpen9, setBilingModalIsOpen9] = useState(false);

  const savemodal = (e) => {
    setBilingModalIsOpen2(true)
    setsaveresumeid(e)
  }

  const paginate = (data) => {
    setcurrentpage(data)
  }


  const [fromfil, setfromfil] = useState("")
  const [tofil, settofil] = useState("")
  const onworkexkHandler = (e) => {
    setload(true)
    var url;
    if (e == "none") {
      setfromfil("null")
      settofil("null")
      var urllll = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/null/null/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
      fetch(urllll, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.resume
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
    else if (e == "0/1") {
      setfromfil("0")
      settofil("1")
      url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/0/1/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    }
    else if (e == "1/2") {
      setfromfil("1")
      settofil("2")
      url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/1/2/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    }
    else if (e == "3/5") {
      setfromfil("3")
      settofil("5")
      url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/3/5/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    }
    else if (e == "6/9") {
      setfromfil("6")
      settofil("9")
      url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/6/9/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    }
    else if (e == "10") {
      setfromfil("10")
      settofil("120")
      url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/10/120/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    }
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    })
      .then(res => res.json()).then((response) => {
        setload(false)
        if (response.message !== "No Resume found") {
          const alljobs = response.resume
          var temp = []
          temp = alljobs
          var idd = alljobs[0].id
          settotnopgs(response.totalpages)
          props.ResumeGetById(idd)
          setallArray([...temp])
        }
        else {
          const temp = []
          setallArray(temp)
        }
        setmetermiletrue(0)
      }).catch((error) => {
        console.log("error", error);

        setload(false)
      })
  };

  const [compfil, setcompfil] = useState("")
  const oncompanyHandler = (e) => {
    if (e == "none") {
      setcompfil("null")
      fetch(`${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/null/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.resume
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
    else {
      var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${e !== "" && e !== null && e !== undefined ? e : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      })
        .then(res => res.json()).then((response) => {
          setcompfil(e)
          setload(false)
          if (response.message !== "No Resume found") {
            const alljobs = response.resume
            var temp = []
            temp = alljobs
            var idd = alljobs[0].id
            settotnopgs(response.totalpages)
            props.ResumeGetById(idd)
            setallArray([...temp])
          }
          else {
            const temp = []
            setallArray(temp)
          }
          setmetermiletrue(0)
        }).catch((error) => {
          console.log("error", error);

          setload(false)
        })
    }
  };

  const [edufil, setedufil] = useState("")
  const oneduHandler = (e) => {
    if (e == "none") {
      setedufil("null")
      fetch(`${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/null/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.resume
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
    else {
      var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${e !== "" && e !== null && e !== undefined ? e : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      })
        .then(res => res.json()).then((response) => {
          setedufil(e)
          setload(false)
          if (response.message !== "No Resume found") {
            const alljobs = response.resume
            var temp = []
            temp = alljobs
            var idd = alljobs[0].id
            settotnopgs(response.totalpages)
            props.ResumeGetById(idd)
            setallArray([...temp])
          }
          else {
            const temp = []
            setallArray(temp)
          }
          setmetermiletrue(0)
        }).catch((error) => {

          setload(false)
        })
    }
  };
  const [exm, setexm] = useState(false)
  const [militaryfil, setmilitaryfil] = useState("")
  const onmilHandler = (e) => {
    setexm(!exm)
    var exmhand = exm == true ? "0" : "1"
    var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${exmhand !== "" && exmhand !== null && exmhand !== undefined ? exmhand : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    })
      .then(res => res.json()).then((response) => {
        setmilitaryfil(exmhand)
        setload(false)
        if (response.message !== "No Resume found") {
          const alljobs = response.resume
          var temp = []
          temp = alljobs
          var idd = alljobs[0].id
          settotnopgs(response.totalpages)
          props.ResumeGetById(idd)
          setallArray([...temp])
        }
        else {
          const temp = []
          setallArray(temp)
        }
        setmetermiletrue(0)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
      })
  };


  const [securityfil, setsecurityfil] = useState("")
  const onsecHandler = (e) => {
    if (e == "none") {
      setsecurityfil("null")
      fetch(`${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/null/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.resume
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
    else {
      var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${e !== "" && e !== null && e !== undefined ? e : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
      console.log("urlllll",url)
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      })
        .then(res => res.json()).then((response) => {
          setsecurityfil(e)
          setload(false)
          if (response.message !== "No Resume found") {
            const alljobs = response.resume
            var temp = []
            temp = alljobs
            var idd = alljobs[0].id
            settotnopgs(response.totalpages)
            props.ResumeGetById(idd)
            setallArray([...temp])
          }
          else {
            const temp = []
            setallArray(temp)
          }
          setmetermiletrue(0)
        }).catch((error) => {
          console.log("error", error);
          setload(false)
        })
    }
  };
  const [relevancec, setrelevance] = useState(true)
  const [sortfil, setsortfil] = useState(1)
  const searchsortdate = (e) => {
    var url = `${config['baseUrl']}/resume/getResumefilter/${e !== "" && e !== null && e !== undefined ? e : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    })
      .then(res => res.json()).then((response) => {
        setsortfil(e)
        setload(false)
        if (response.message !== "No Resume found") {
          const alljobs = response.resume
          var temp = []
          temp = alljobs
          var idd = alljobs[0].id
          settotnopgs(response.totalpages)
          props.ResumeGetById(idd)
          setallArray([...temp])
        }
        else {
          const temp = []
          setallArray(temp)
        }
        setmetermiletrue(0)
        // setrelevance(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
      })
  }
  const [datefil, setdatefil] = useState("")
  const ontimeHandler = (e) => {
    if (e == "none") {
      setdatefil("none")
      fetch(`${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/none/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      }).then(res => res.json()).then((response) => {
        setload(false)
        const alljobs = response.resume
        var temp = []
        temp = alljobs
        var idd = alljobs[0].id
        settotnopgs(response.totalpages)
        props.ResumeGetById(idd)
        setallArray([...temp])
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
        setedupage(false)
        setlastpage(false)
        setsortpage(false)
        setexclpage(false)
        setdispage(false)
        setcompage(false)
        setmilpage(false)
        setexppage(false)
        setsecpage(false)
      })
    }
    else {
      var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${e !== "" && e !== null && e !== undefined ? e : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
      fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      })
        .then(res => res.json()).then((response) => {
          setdatefil(e)
          setload(false)
          if (response.message !== "No Resume found") {
            const alljobs = response.resume
            var temp = []
            temp = alljobs
            var idd = alljobs[0].id
            settotnopgs(response.totalpages)
            props.ResumeGetById(idd)
            setallArray([...temp])
          }
          else {
            const temp = []
            setallArray(temp)
          }
          setmetermiletrue(0)
        }).catch((error) => {
          console.log("error", error);
          setload(false)
        })
    }
  };
  const [ex, setex] = useState(true)
  const [excludefil, setexcludefil] = useState("")
  const onexconHandler = () => {
    setex(!ex)
    var exhand = ex == true ? "1" : "0"
    var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${exhand !== "" && exhand !== null && exhand !== undefined ? exhand : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${milesfil !== "" && milesfil !== null && milesfil !== undefined ? milesfil : null}/${pgno}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    })
      .then(res => res.json()).then((response) => {
        setexcludefil(exhand)
        setload(false)
        if (response.message !== "No Resume found") {
          const alljobs = response.resume
          var temp = []
          temp = alljobs
          var idd = alljobs[0].id
          settotnopgs(response.totalpages)
          props.ResumeGetById(idd)
          setallArray([...temp])
        }
        else {
          const temp = []
          setallArray(temp)
        }
        setmetermiletrue(0)
      }).catch((error) => {
        console.log("error", error);
        setload(false)
      })
  };
  const [metermile, setmetermile] = useState(0)
  const [metermiletrue, setmetermiletrue] = useState(0)
  const [milesfil, setmilesfil] = useState("")
  const distencemeter = async (e) => {
    setmetermile(e)
    setmetermiletrue(e)
    if (!metermiletrue) {
      setmetermile(0)
      setmetermiletrue(0)
      var url = `${config['baseUrl']}/resume/getResumefilter/${sortfil !== "" && sortfil !== null && sortfil !== undefined ? sortfil : null}/${datefil !== "" && datefil !== null && datefil !== undefined ? datefil : "none"}/${compfil !== "" && compfil !== null && compfil !== undefined ? compfil : null}/${securityfil !== "" && securityfil !== null && securityfil !== undefined ? securityfil : null}/${militaryfil !== "" && militaryfil !== null && militaryfil !== undefined ? militaryfil : null}/${edufil !== "" && edufil !== null && edufil !== undefined ? edufil : null}/${fromfil !== "" && fromfil !== null && fromfil !== undefined ? fromfil : null}/${tofil !== "" && tofil !== null && tofil !== undefined ? tofil : null}/${excludefil !== "" && excludefil !== null && excludefil !== undefined ? excludefil : null}/${localStorage.getItem("userid")}/${localStorage.getItem("userid")}/${e !== "" && e !== null && e !== undefined ? e : null}/${pgno}`
      await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
      })
        .then(res => res.json()).then((response) => {
          setmilesfil(e)
          setload(false)
          if (response.message !== "No Resume found") {
            const alljobs = response.resume
            var temp = []
            temp = alljobs
            var idd = alljobs[0].id
            settotnopgs(response.totalpages)
            props.ResumeGetById(idd)
            setallArray([...temp])
          }
          else {
            const temp = []
            setallArray(temp)
          }
        }).catch((error) => {
          console.log("error", error);
          setload(false)
        })
    }
  }
  const [distence, setdistence] = useState()
const[loadmore,setloadmore]=useState(false)
  const [noOfElement, setnoOfElement] = useState(7)
  const slice = allcom.length > 0 ? allcom.slice(0, noOfElement) : []
  const [resume_u_id,setresume_u_id] = useState()
  const Global = createGlobalStyle`
  /* paper.css */
  https://github.com/cognitom/paper-css

  /* @page { margin: 0 } */
  #print {
    margin: 0;
    font-family: sans-serif;
  }
  .sheet {
    margin: 0;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
  }
  
  
  /** Paper sizes **/
  #print.A3               .sheet { width: 297mm; height: 419mm }
  #print.A3.landscape     .sheet { width: 420mm; height: 296mm }
  #print.A4               .sheet { width: 210mm; height: 296mm }
  #print.A4.landscape     .sheet { width: 297mm; height: 209mm }
  #print.A5               .sheet { width: 118mm; height: 209mm }
  #print.A5.landscape     .sheet { width: 210mm; height: 147mm }
  #print.letter           .sheet { width: 216mm; height: 279mm }
  #print.letter.landscape .sheet { width: 280mm; height: 215mm }
  #print.legal            .sheet { width: 216mm; height: 356mm }
  #print.legal.landscape  .sheet { width: 357mm; height: 215mm }
  
  /** Padding area **/
  .sheet.padding-10mm { padding: 10mm }
  .sheet.padding-15mm { padding: 15mm }
  .sheet.padding-20mm { padding: 20mm }
  .sheet.padding-25mm { padding: 25mm }
  
  /** For screen preview **/
  @media screen {
    body {
      background: #E0E0E0;
      height: 100%;
    }
    .sheet {
      background: #FFFFFF;
      /* margin: 5mm auto; */
      padding: 5mm 0;
    }
  }
  
  /** Fix for Chrome issue #273306 **/
  @media print {
    #print.A3.landscape            { width: 420mm }
    #print.A3, #print.A4.landscape { width: 297mm }
    #print.A4, #print.A5.landscape { width: 210mm }
    #print.A5                      { width: 148mm }
    #print.letter, #print.legal    { width: 216mm }
    #print.letter.landscape        { width: 280mm }
    #print.legal.landscape         { width: 357mm }
  }
`;
const [allvolunteer, setallvolunteer] = useState([])

  const [allArray32, setallArray32] = useState([])
  useEffect(() => {
    fetch(`${config['baseUrl']}/resume/getbyid/${resume_u_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json()).then((response) => {
      const alljobs = response
      setallvolunteer(response[0].volunteer.length > 0 ? response[0].volunteer : [])
      var temp = []
      temp = [...response]
      setallArray32([...temp])
    }).catch((error) => {
      console.log("error", error);
    })
  }, [resume_u_id]);
  const Sheet = () => {
      return (
      <>
                  {
                      allArray32 && allArray32.length > 0 ? allArray32.map((value) => {
    setpdfuser(value.job[0].first_name)

                      return (
                          <div className="main-content padding-15mm step-dark-1" >
                          <div className="col-12 p-0 m-0 d-flex align-items-center justify-content-center p-0 step-dark-2">
                              <div className="col-lg-8 col-sm-12 preview-full-resume-body step-dark-3">
                              <div className="d-flex flex-column align-items-center justify-content-center py-3">
                                  <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                  {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                  <h3 className="black-theme-resume-preview mb-0">{`${value.job[0].first_name !== "" && value.job[0].first_name !== undefined && value.job[0].first_name !== null ? value.job[0].first_name : ""} ${value.job[0].middle_name !== "" && value.job[0].middle_name !== undefined && value.job[0].middle_name !== null ? value.job[0].middle_name : ""} ${value.job[0].last_name !== "" && value.job[0].last_name !== undefined && value.job[0].last_name !== null ? value.job[0].last_name : ""}`}</h3>
                                  :""}
                                  </div>
                                  <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                  <p className="">{`${value.job[0].city !== "" && value.job[0].city !== undefined && value.job[0].city !== null ? value.job[0].city : ""},  ${value.job[0].state !== "" && value.job[0].state !== undefined && value.job[0].state !== null ? value.job[0].state : ""}`}</p>
                                  </div>
                              </div>
                              <hr className="m-0" />
                              <div className=" py-3">
                                  <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                      <h5 className="m-0">CONTACT INFORMATION</h5>
                                  </div>
                                  <p>{value.job[0].contact_number !== "" && value.job[0].contact_number !== undefined && value.job[0].contact_number !== null ? value.job[0].contact_number : ""}</p>
                                  <p>{value.job[0].email !== "" && value.job[0].email !== undefined && value.job[0].email !== null ? value.job[0].email : ""}</p>
                                  </div>
                              <hr className="m-0" />
  
                                {value.job[0].professional_summary !== "" && value.job[0].professional_summary !== undefined && value.job[0].professional_summary !== null ?
                                  <div className=" py-3">
                                  <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                      <h5 className="m-0">PROFESSIONAL SUMMARY</h5>
                                  </div>
                                  <p>{value.job[0].professional_summary !== "" && value.job[0].professional_summary !== undefined && value.job[0].professional_summary !== null ? parse(value.job[0].professional_summary) : ""}</p>
                                  </div>
                                  : ""}
                              <div className=" py-3">
                                  <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                  <h5 className="m-0">EDUCATION</h5>
                                  </div>
                                  {value.education && value.education.length > 0 ? value.education.map(edu => (
                                  <div className="padding-block-in-bottom-justice  flex-direction-in-res-justice d-flex align-items-center justify-content-between">
                                      <div>
                                      <div className="d-flex flex-column">
                                          <p className="margin-zero-in-bottom-justice  m-0" style={{ fontWeight: "800" }}>{`${edu.school !== "" && edu.school !== undefined && edu.school !== null ? edu.school : ""}`}</p>
                                          <div className="d-flex align-items-center">
                                          <p className="margin-zero-in-bottom-justice m-0">{`${edu.level_of_education !== "" && edu.level_of_education !== undefined && edu.level_of_education !== null ? edu.level_of_education : ""}`}</p><p className="m-0 px-1">-</p>
                                          <p className="margin-zero-in-bottom-justice  m-0">{`${edu.major !== "" && edu.major !== undefined && edu.major !== null ? edu.major : ""}`}</p>
                                          </div>
                                      </div>
                                      </div>
  
  
                                      <div className="d-flex align-items-end flex-direction-in-row-justice flex-column justify-content-center">
                                      <p>{`${edu.city !== "" && edu.city !== undefined && edu.city !== null ? edu.city : ""}`}</p>
                                      <p>{`${edu.date_of_completion !== "" && edu.date_of_completion !== undefined && edu.date_of_completion !== null ? edu.date_of_completion !== "Currently enrolled" ? dateFormat(edu.date_of_completion, "mmmm, yyyy") : "Currently enrolled" : "Currently enrolled"}`}</p>
                                      </div>
                                  </div>
                                  )) : <p className="py-4">(More education info if provided…)</p>
                                  }
                              </div>
                              <div className=" py-3">
                                  <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                  <div className="d-flex">
                                      <h5 className="m-0">WORK EXPERIENCE </h5>
                                  </div>
                                  </div>
                                  {
                                  value.experience && value.experience.length > 0 ? value.experience.map(exp => (
                                      <>
                                      <div className="padding-block-in-bottom-justice  flex-direction-in-res-justice d-flex align-items-center justify-content-between">
                                          <div>
                                          <div className="d-flex flex-in-resume-direction-false mb-1">
                                              <p style={{ fontWeight: "800" }} className="mb-0 ml-1">{exp.company}</p>
                                          </div>
                                          <div className="d-flex flex-in-resume-direction-false mb-1">
                                              <i><p className="mb-0 ml-1">{exp.job_title}</p></i>
                                          </div>
  
                                          </div>
                                          <div className="flex-direction-in-row-justice-exp  d-flex align-items-end  flex-column justify-content-center">
                                          <p>{exp.city}, {exp.state}</p>
                                          <p>{dateFormat(exp.time_period_start, "mmmm, yyyy")} to {exp.time_period_end !== "Still currently employed here" ? dateFormat(exp.time_period_end, "mmmm, yyyy") : "Still currently employed here"}</p>
                                          </div>
                                      </div>
                                      <div className="d-flex flex-column flex-in-resume-direction-false mb-1">
                                          <p className="mb-0 ml-1">{parse(exp.duties)}</p>
                                      </div>
                                      </>
                                  )) : <p className="py-4">(More experience info if provided…)</p>
                                  }
                              </div>
  
  
  
  
                              {
                                  value.military && value.military.length > 0 ?
                                  <div className=" py-3">
                                      <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                      <div className="d-flex">
                                          <h5 className="m-0">MILITARY SERVICE</h5>
                                      </div>
                                      </div>
                                      {
                                      value.military && value.military.length > 0 ? value.military.map(mil => (
                                          <div className="d-flex padding-block-in-preview-resume-justice align-items-center justify-content-between">
                                          <div style={{ width: "100%" }}>
                                              {
                                              value.branch && value.branch.length > 0 ? value.branch.map(br => (
                                                  <>
                                                  <div style={{ width: "100%" }} className="d-flex align-items-center flex-in-resume-direction-false mb-1">
                                                      <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd">Branch:</a>
                                                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                      <p className="mb-0 ml-1">{br.branch}</p>
                                                      {value.mos && value.mos.length > 0 ?
                                                          <p>{dateFormat(mil.start_date, "mmmm, yyyy")} to {dateFormat(mil.end_date, "mmmm, yyyy")}</p>
                                                          : ""}
                                                      </div>
                                                  </div>
                                                  </>
                                              )) : <div className="d-flex">
                                                  <p className="m-0">No branch of service added</p>
                                              </div>
  
                                              }
  
                                              <div className="d-flex flex-in-resume-direction-false mb-1">
                                              <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd" >MOS:</a>
                                              {
                                                  value.mos && value.mos.length > 0 ? value.mos.map((mos, index) => (
                                                  <>
                                                      <p className="mb-0 ml-1">{mos.mos}</p>
                                                      {index == value.mos.length - 1 ? "" : <span className="text-dark pl-0 pr-1">,</span>}
                                                  </>
                                                  )) : <p>No MOS added</p>
  
                                              }
  
  
                                              </div>
                                              {value.military.length > 0 ? value.military[0].security_clearance == "" || value.military[0].security_clearance == undefined || value.military[0].security_clearance == null ?
                                              "" :
                                              <div className="d-flex flex-in-resume-direction-false">
                                                  <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd" >Security Clearance:</a>
                                                  {value.military && value.military.length > 0 ? value.military.map(cle => (
                                                  <>
                                                      <p className="mb-0 ml-1">{`${cle.security_clearance !== null && cle.security_clearance !== undefined && cle.security_clearance !== "" ? cle.security_clearance : ""}`}</p>
                                                  </>
                                                  )) : ""
                                                  }
                                              </div>
                                              : ""
                                              }
  
  
                                          </div>
                                          <div className="d-flex align-items-end  flex-column justify-content-center">
  
                                          </div>
  
                                          </div>
  
                                      )) : <p className="py-4">(More military info if provided…)</p>
                                      }
  
                                  </div> : ""}
  
                              {value.language.length > 0 || value.certification.length > 0 || value.award.length > 0 ?
                                  <div className=" py-3">
                                  <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                      <div className="d-flex">
                                      <h5 className="m-0">ADDITIONAL SKILLS</h5>
                                      </div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <div className="pr-5 pt-2">
                                      {value.language.length > 0 ?
                                          <div className="d-flex flex-in-resume-direction-false">
                                          <div className="d-flex align-items-center">
                                              <p style={{ fontWeight: "bold" }} className="mr-3">Additional Language(s)</p>
                                          </div>
                                          <div className="d-flex align-items-center">
  
                                              {value.language && value.language.length > 0 ? value.language.map((lang, index) => (
                                              <>
                                                  <p className="m-0">{`${lang.lang !== null && lang.lang !== undefined && lang.lang !== "" ? `${lang.lang} (${lang.level})` : ""}`}</p>
                                                  {index == value.language.length - 1 ? "" : <span className="text-dark pl-0 pr-1">,</span>}
                                              </>
                                              )) : <p>Level of Fluency</p>
                                              }
                                          </div>
  
                                          </div>
                                          : ""}
                                      {value.certification.length > 0 ?
                                          <div className="d-flex flex-in-resume-direction-false">
                                          <p style={{ fontWeight: "bold" }} className="mr-3">Certification(s)</p>
                                          {value.certification && value.certification.length > 0 ? value.certification.map((cert, index) => (
                                              <>
                                              <p>{`${cert.title !== null && cert.title !== undefined && cert.title !== "" ? cert.title : ""}`} ({`${cert.date !== null && cert.date !== undefined && cert.date !== "" ? dateFormat(cert.date, "mmmm, yyyy") : ""}`})</p>
                                              {index == value.certification.length - 1 ? "" : <span className="text-dark pl-0 pr-1">,</span>}
                                              </>
  
                                          )) : <p>Date Earned</p>
                                          }
                                          </div>
                                          : ""}
                                      {value.award.length > 0 ?
                                          <div className="d-flex flex-in-resume-direction-false">
                                          <p style={{ fontWeight: "bold" }} className="mr-3">Award(s) </p>
                                          {value.award && value.award.length > 0 ? value.award.map((awar, index) => (
                                              <>
                                              <p>{`${awar.title !== null && awar.title !== undefined && awar.title !== "" ? awar.title : ""}`} ({`${awar.date !== null && awar.date !== undefined && awar.date !== "" ? dateFormat(awar.date, "mmmm, yyyy") : ""}`})</p>
                                              {index == value.award.length - 1 ? "" : <span className="text-dark pl-0 pr-1">,</span>}
                                              </>
                                          )) : <p>Date Earned</p>
                                          }
                                          </div>
                                          : ""
                                      }
  
  
                                      </div>
                                  </div>
                                  </div>
                                  : ""}
                              {allvolunteer.length > 0 ?
                                  <div className=" py-3">
                                  <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                      <div className="d-flex">
                                      <h5 className="m-0">VOLUNTEER WORK</h5>
                                      </div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                      <table class="table table-hover">
                                      <thead>
                                          <tr>
                                          <th scope="col">Title</th>
                                          <th scope="col">Start Date</th>
                                          <th scope="col">End Date</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {allvolunteer && allvolunteer.length > 0 ? allvolunteer.map((val, ind) => (
                                          <tr>
                                              <td>{val.title}</td>
                                              <td>{dateFormat(val.start, "mmmm, yyyy")}</td>
                                              <td>{val.end !== "I currently volunteer here" ? dateFormat(val.end, "mmmm, yyyy") : "I currently volunteer here"}</td>
                                          </tr>
                                          )) : ""
                                          }
                                      </tbody>
                                      </table>
                                  </div>
                                  </div>
                                  : ""}
                              </div>
                          </div>
                          </div>
                      )
                      }) : "No Resume Created"
                  }
      </>
      )
  };
  const handleClick = () => {
      createPdfFromHtml(printContent,pdfuser);
  };
  var [printContent,setprintContent]= useState()
  var [pdfuser,setpdfuser]= useState()
  return (
    <>
            <Global />
            <div  style={{position:"absolute",left:"-3000px"}} id="print" className="A4">
          <Sheet />
          <div>
            <div
              ref={(el) => {
                printContent = el;
              }}
            >
              <Sheet />
            </div>
          </div>
        </div>
            

      <div className="container-fluid" id="Employee">
        <div className="container">
          <EmployerNav />
          {/* header======================================================================*/}
          <div className="main-content">
            <div className="search-r-extension">
              <div className="row px-0">
                <div className="col-lg-1 col-0" />
                <div className="col-10  p-0">
                  <div className="d-flex job-resul-top-header align-items-center">
                    <Link to="/previously-contact" className="mr-4 bold-text fgh previoushover">Previously Contacted</Link>
                    <Link to="/saved-resume" className="mx-4 bold-text fgh previoushover">Saved Resumes</Link>
                    <Link to="/apply-to-job" className="mx-4 bold-text fgh previoushover">Candidates </Link>
                    <Link className="mx-4 bold-text fgh" style={{ cursor: "default" }}>Download &amp; Contacts Remaining: {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ? alldownloads && alldownloads.length > 0 ? downloads : "0" : "0"}/{props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ? alldownloads && alldownloads.length > 0 ? remainingdownloads : "0" : "0"}</Link>
                  </div>
                </div>
                <div className="col-1" />
              </div>
            </div>
            <div className="row resume-search-radio">
              <div className="col-1" />
              <div className="col-lg-2 col-sm-0 py-0 pr-3 pl-0 resume-search-border-right">
                <div className="d-flex align-items-center">
                  <p className="bold-text m-0">Sort By:&nbsp;</p>
                  <p
                    className="m-0"
                    // onClick={() =>{
                    //   setrelevance(true)
                    //    searchsortdate("1")}}
                       onClick={(e) => {
                        setsortpage(true)
                        setrelevance(true)
                        setsortvalue("1")
                        searchsortdate("1")
                      }}
                       style={{ cursor: "pointer", color: relevancec == true ? "orange" : "#8DC63F" }}
                   >
                    Relevance
                  </p>
                  <p className="m-0" 
                  //  onClick={() => {
                  //   setrelevance(false)
                  //   setsortpage(true)
                  //   searchsortdate("0")
                  // }}
                  onClick={(e) => {
                    setsortpage(true)
                    setrelevance(false)
                    setsortvalue("0")
                    searchsortdate("0")
                  }}
                  style={{ cursor: "pointer", color: relevancec == false ? "orange" : "#8DC63F" }}
                  >&nbsp;Date</p>
                </div>
                {/* <div className="d-flex align-items-center my-3">
                  <div className="role role2">
                    {
                      props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                        <label>
                          <input onChange={(e) => {
                            setexclpage(true)
                            onexconHandler()
                          }} type="checkbox" name="radio0" defaultChecked={false} />
                          <span>Exclude Contacted Candidates</span>
                        </label>
                        :
                        <label>
                          <input onChange={(e) => setBilingModalIsOpen3(true)} type="checkbox" name="radio0" checked={false} />
                          <span>Exclude Contacted Candidates</span>
                        </label>
                    }
                  </div>
                </div> */}
                <div className="d-flex flex-column my-4">
                  <p className="bold-text m-0">
                    Travel Distance (Miles)
                  </p>
                  <input type="range" max={100} defaultValue={0} onChange={(e) => {
                    setdispage(true)
                    setdisvalue(e.target.value)
                    distencemeter(e.target.value)
                  }} />
                </div>
                <div className="d-flex align-items-center my-4">
                  <p className="m-0">Within
                    <span className="px-1">
                      {
                        disvalue == 0 ?
                          "0" : "0" &&
                            disvalue < 5 ?
                            "5" : "5" &&
                              disvalue < 10 ?
                              "10" : "10" &&
                                disvalue < 15 ?
                                "15" : "15" &&
                                  disvalue < 20 ?
                                  "20" : "20" &&
                                    disvalue < 25 ?
                                    "25" : "25" &&
                                      disvalue < 30 ?
                                      "30" : "30" &&
                                        disvalue < 35 ?
                                        "35" : "35" &&
                                          disvalue < 40 ?
                                          "40" : "40" &&
                                            disvalue < 45 ?
                                            "45" : "45" &&
                                              disvalue < 50 ?
                                              "50" : "50" &&
                                                disvalue < 55 ?
                                                "55" : "55" &&
                                                  disvalue < 60 ?
                                                  "60" : "60" &&
                                                    disvalue < 65 ?
                                                    "65" : "65" &&
                                                      disvalue < 70 ?
                                                      "70" : "70" &&
                                                        disvalue < 75 ?
                                                        "75" : "75" &&
                                                          disvalue < 80 ?
                                                          "80" : "80" &&
                                                            disvalue < 85 ?
                                                            "85" : "85" &&
                                                              disvalue < 90 ?
                                                              "90" : "90" &&
                                                                disvalue < 95 ?
                                                                "95" : "95" &&
                                                                  disvalue < 100 ?
                                                                  "100" : "100"
                      }
                    </span>
                    miles of (city/<br />Job Title – Company
                    State) location
                  </p>
                </div>
                <div className="d-flex flex-column my-3">
                  <p className="bold-text m-0">
                    Last Activity
                  </p>
                  <div className="role role2 mt-3">
                    <label>
                      <input onChange={(e) => {
                        setlastpage(true)
                        setlastvalue(e.target.value)
                        ontimeHandler(e.target.value)
                      }} type="radio" name="radio1" value={"lastDay"} />
                      <span>Within Last Day</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setlastpage(true)
                        setlastvalue(e.target.value)
                        ontimeHandler(e.target.value)
                      }} type="radio" name="radio1" value={"lastWeek"} />
                      <span>Within Last Week</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setlastpage(true)
                        setlastvalue(e.target.value)
                        ontimeHandler(e.target.value)
                      }} type="radio" name="radio1" value={"lastMonth"} />
                      <span>Within Last Month</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setlastpage(true)
                        setlastvalue(e.target.value)
                        ontimeHandler(e.target.value)
                      }} type="radio" name="radio1" value={"last6Month"} />
                      <span>Within Last 6 Months</span>
                    </label>
                    {/* <label>
                      <input onChange={(e) => {
                        setlastpage(true)
                        setlastvalue(e.target.value)
                        ontimeHandler(e.target.value)
                      }} type="radio" name="radio1" value={"none"} />
                      <span>none</span>
                    </label> */}
                  </div>
                  <p style={{ cursor: "pointer" }} onClick={() => window.location.reload(false)}>see all resumes</p>
                </div>
                <div className="d-flex flex-column my-5">
                  <p className="bold-text m-0">
                    Work Experiences
                  </p>
                  <div className="role role2 mt-3">
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"0/1"} />
                      <span>Less Than 1 Year</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"1/2"} />
                      <span>1-2 Years</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"3/5"} />
                      <span>3-5 Years</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"6/9"} />
                      <span>6-9 Years</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"10"} />
                      <span>10+ Years</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setexppage(true)
                        setexpvalue(e.target.value)
                        onworkexkHandler(e.target.value)
                      }} type="radio" name="radiooo" value={"none"} />
                      <span>none</span>
                    </label>
                  </div>
                </div>
                <div className="d-flex flex-column my-5">
                  <p className="bold-text m-0">
                    Education
                  </p>
                  <div className="role role2 mt-3">

                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" value={"High School Diploma"} name="radio2" />
                      <span>High School Diploma</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" value={"Associates Degree"} name="radio2" />
                      <span>Associate Degree</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" value={"Bachelor’s Degree"} name="radio2" />
                      <span>Bachelor’s Degree</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" value={"Master’s Degree"} name="radio2" />
                      <span>Master’s Degree</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" value={"Doctorate"} name="radio2" />
                      <span>Doctorate</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setedupage(true)
                        seteduvalue(e.target.value)
                        oneduHandler(e.target.value)
                      }} type="radio" name="radio2" value={"none"} />
                      <span>none</span>
                    </label>
                  </div>
                </div>
                <div className="d-flex flex-column my-5">
                  <p className="bold-text m-0">
                    Companies
                  </p>
                  <div className="role role2 mt-3">
                    {
                      loadmore==true?
                      allcom && allcom.map((val, index) =>(
                        <>
                        <label>
                          <input onChange={(e) => {
                            setcompage(true)
                            setcomvalue(e.target.value)
                            oncompanyHandler(e.target.value)
                          }} type="radio" value={val.company} name="radio3" />
                          <span>{val.company}</span>
                        </label>
                        {index == allcom.length - 1 ?    <label>
                      <input onChange={(e) => {
                        setcompage(true)
                        setcomvalue(e.target.value)
                        oncompanyHandler(e.target.value)
                      }} type="radio" name="radio3" value={"none"} />
                      <span>none</span>
                    </label>:""}

                        </>
                      ))
                      :
                      slice && slice.map((val) =>
                        <label>
                          <input onChange={(e) => {
                            setcompage(true)
                            setcomvalue(e.target.value)
                            oncompanyHandler(e.target.value)
                          }} type="radio" value={val.company} name="radio3" />
                          <span>{val.company}</span>
                        </label>
                      )
                    }
                    {
                      <p style={{ cursor: "pointer" }} onClick={() => setloadmore(!loadmore)}>{loadmore==true?"see fewer companies":"see all companies"}</p>
                    }
                  </div>
                </div>
                <div className="d-flex flex-column my-5">
                  <p className="bold-text m-0">
                    Military
                  </p>
                  <div className="role role2 mt-3">
                    <label>
                      <input onClick={(e) => {
                        setmilpage(true)
                        onmilHandler()
                      }} type="checkbox" name="radio4" value={1} />
                      <span>Active Or Veteran</span>
                    </label>
                  </div>
                </div>
                <div className="d-flex  flex-column my-5">
                  <p className="bold-text m-0">
                    Security Clearance
                  </p>
                  <div className="role role2 mt-3">
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Inactive Clearance"} />
                      <span>Inactive Clearance</span>
                    </label>
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Active Confidential"} />
                      <span>Active Confidential</span>
                    </label>
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Active Secret"} />
                      <span>Active Secret</span>
                    </label>
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Active Top Secret"} />
                      <span>Active Top Secret</span>
                    </label>
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Active Top SecretSCI"} />
                      <span>Active Top Secret/SCI</span>
                    </label>
                    <label>
                      <input type="radio" onClick={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} name="radio5" value={"Other Active Clearance"} />
                      <span>Other Active Clearance</span>
                    </label>
                    <label>
                      <input onChange={(e) => {
                        setsecpage(true)
                        setsecvalue(e.target.value)
                        onsecHandler(e.target.value)
                      }} type="radio" name="radio5" value={"none"} />
                      <span>none</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className=" col-lg-3 col-12 py-0 role role2 custom-pad-search-res">

                <div className="res-dis-none d-flex flex-column w-100">
                  <label htmlFor="exampleInputPassword1">Search Job Title or Keyword:</label>
                  <input type="text" onChange={(e) => setSearchItem(e.target.value)} className="form-control employee-input-email w-100" id="exampleInputPassword1" placeholder="Job Title or Keyword" />
                </div>


                <div className="Mob-search-employee mt-2">
                  <div style={{ position: 'relative' }}>
                    <i style={{ left: 10, top: 15, position: "absolute" }} className="fa fa-search search-icon" aria-hidden="true" />
                    <input

                      type="text" style={{ width: "100%", paddingLeft: "30px" }} className="job-search m-0 w-100" placeholder="Job Title or Keyword" />
                  </div>


                  <div style={{ position: 'relative' }}>
                    <i style={{ left: 10, top: 15, position: "absolute" }} className="fa fa-map-marker marker-icon" aria-hidden="true" />
                    <input

                      type="text" style={{ width: "100%", paddingLeft: "30px" }} className="city-search m-0 w-100"
                      placeholder="City or Zip Code" />

                  </div>
                </div>
                <div className="res-d-flex-cus">
                  <div className="d-flex align-items-center my-1 ">
                    <p className="m-0 bold-text">Results: <span>{filteredPosts && filteredPosts.length > 0 ? filteredPosts.filter(data => data.status !== 0).length : "0"}</span></p>
                  </div>

                  <div className="res-dis-none-op">
                    <Space>
                      <Button type="primary" onClick={showDrawer}>
                        <i class="fa fa-filter" aria-hidden="true"></i>
                      </Button>
                    </Space>
                  </div>
                </div>
                <hr className="m-0" />
                <Drawer
                  placement={placement}
                  width={300}
                  onClose={onClose}
                  visible={visible}
                  extra={
                    <Space>
                      <Button onClick={onClose}>Cancel</Button>
                      <Button type="primary" onClick={onClose}>
                        OK
                      </Button>
                    </Space>
                  }
                >
                  <div className="resume-search-border-right-2">
                    <div className="d-flex align-items-center">
                      <p className="bold-text m-0">Sort By:&nbsp;</p><span> <a
                        //  onClick={() => searchsortrelevance()} 
                        // onClick={() => searchsortdate("1")}
                        onClick={(e) => {
                          setsortpage(true)
                          setrelevance(true)
                          setsortvalue("1")
                          searchsortdate("1")
                        }}
                        style={{ cursor: "pointer", color: relevancec == true ? "orange" : "black" }} className="m-0">Relevance</a>
                      </span>
                      <p className="m-0" style={{ cursor: "pointer", color: relevancec == false ? "orange" : "black" }} 
                      // onClick={() => searchsortdate("0")}
                      onClick={(e) => {
                        setsortpage(true)
                        setrelevance(false)
                        setsortvalue("0")
                        searchsortdate("0")
                      }}
                      >&nbsp;Date</p>
                    </div>
                    {/* <div className="d-flex align-items-center my-3">
                      <div className="role role2">
                        <label>
                          <input onChange={(e) => onexconHandler()} type="checkbox" name="radio0" defaultChecked={false} />
                          <span>Exclude Contacted Candidates</span>
                        </label>
                      </div>
                    </div> */}
                    <div className="d-flex flex-column my-4">
                      <p className="bold-text m-0">
                        Travel Distance (Miles)
                      </p>
                      <input type="range" max={100} defaultValue={0} onChange={(e) => { distencemeter(e.target.value) }} />
                    </div>
                    <div className="d-flex align-items-center my-4">
                      <p className="m-0">Within
                        <span className="px-1">
                          {
                            disvalue > 5 ?
                              "0" : "0" &&
                                disvalue < 5 ?
                                "5" : "5" &&
                                  disvalue < 10 ?
                                  "10" : "10" &&
                                    disvalue < 15 ?
                                    "15" : "15" &&
                                      disvalue < 20 ?
                                      "20" : "20" &&
                                        disvalue < 25 ?
                                        "25" : "25" &&
                                          disvalue < 30 ?
                                          "30" : "30" &&
                                            disvalue < 35 ?
                                            "35" : "35" &&
                                              disvalue < 40 ?
                                              "40" : "40" &&
                                                disvalue < 45 ?
                                                "45" : "45" &&
                                                  disvalue < 50 ?
                                                  "50" : "50" &&
                                                    disvalue < 55 ?
                                                    "55" : "55" &&
                                                      disvalue < 60 ?
                                                      "60" : "60" &&
                                                        disvalue < 65 ?
                                                        "65" : "65" &&
                                                          disvalue < 70 ?
                                                          "70" : "70" &&
                                                            disvalue < 75 ?
                                                            "75" : "75" &&
                                                              disvalue < 80 ?
                                                              "80" : "80" &&
                                                                disvalue < 85 ?
                                                                "85" : "85" &&
                                                                  disvalue < 90 ?
                                                                  "90" : "90" &&
                                                                    disvalue < 95 ?
                                                                    "95" : "95" &&
                                                                      disvalue < 100 ?
                                                                      "100" : "100"
                          }
                        </span>
                        miles of (city/<br />Job Title – Company
                        State) location
                      </p>
                    </div>
                    <div className="d-flex flex-column my-3">
                      <p className="bold-text m-0">
                        Last Activity
                      </p>
                      <div className="role role2 mt-3">
                        <label>
                          <input onChange={(e) => ontimeHandler(e.target.value)} type="radio" name="radio1" value={"lastDay"} />
                          <span>Within Last Day</span>
                        </label>
                        <label>
                          <input onChange={(e) => ontimeHandler(e.target.value)} type="radio" name="radio1" value={"lastWeek"} />
                          <span>Within Last Week</span>
                        </label>
                        <label>
                          <input onChange={(e) => ontimeHandler(e.target.value)} type="radio" name="radio1" value={"lastMonth"} />
                          <span>Within Last Month</span>
                        </label>
                        <label>
                          <input onChange={(e) => ontimeHandler(e.target.value)} type="radio" name="radio1" value={"last6Month"} />
                          <span>Within Last 6 Months</span>
                        </label>
                      </div>
                      <p style={{ cursor: "pointer" }} onClick={() => window.location.reload(false)}>see all resumes</p>
                    </div>
                    <div className="d-flex flex-column my-5">
                      <p className="bold-text m-0">
                        Work Experiences
                      </p>
                      <div className="role role2 mt-3">
                        <label>
                          <input type="radio" name="radiooo" />
                          <span>Less Than 1 Year</span>
                        </label>
                        <label>
                          <input onChange={(e) => onworkexkHandler(e.target.value)} type="radio" name="radiooo" value={"1/2"} />
                          <span>1-2 Years</span>
                        </label>
                        <label>
                          <input onChange={(e) => onworkexkHandler(e.target.value)} type="radio" name="radiooo" value={"3/5"} />
                          <span>3-5 Years</span>
                        </label>
                        <label>
                          <input onChange={(e) => onworkexkHandler(e.target.value)} type="radio" name="radiooo" value={"6/9"} />
                          <span>6-9 Years</span>
                        </label>
                        <label>
                          <input onChange={(e) => onworkexkHandler(e.target.value)} type="radio" name="radiooo" value={"1/10"} />
                          <span>10+ Years</span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex flex-column my-5">
                      <p className="bold-text m-0">
                        Education
                      </p>
                      <div className="role role2 mt-3">

                        <label>
                          <input onChange={(e) => oneduHandler(e.target.value)} type="radio" value={"High School Diploma"} name="radio2" />
                          <span>High School Diploma</span>
                        </label>
                        <label>
                          <input onChange={(e) => oneduHandler(e.target.value)} type="radio" value={"Associates Degree"} name="radio2" />
                          <span>Associate Degree</span>
                        </label>
                        <label>
                          <input onChange={(e) => oneduHandler(e.target.value)} type="radio" value={"Bachelor’s Degree"} name="radio2" />
                          <span>Bachelor’s Degree</span>
                        </label>
                        <label>
                          <input onChange={(e) => oneduHandler(e.target.value)} type="radio" value={"Master’s Degree"} name="radio2" />
                          <span>Master’s Degree</span>
                        </label>
                        <label>
                          <input onChange={(e) => oneduHandler(e.target.value)} type="radio" value={"Doctorate"} name="radio2" />
                          <span>Doctorate</span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex flex-column my-5">
                      <p className="bold-text m-0">
                        Companies
                      </p>
                      <div className="role role2 mt-3">
                      {
                      loadmore==true?
                      allcom && allcom.map((val) =>
                      <>
                        <label>
                          <input onChange={(e) => {
                            setcompage(true)
                            setcomvalue(e.target.value)
                            oncompanyHandler(e.target.value)
                          }} type="radio" value={val.company} name="radio3" />
                          <span>{val.company}</span>
                        </label>
                               <label>
                               <input onChange={(e) => {
                                 setcompage(true)
                                 setcomvalue(e.target.value)
                                 oncompanyHandler(e.target.value)
                               }} type="radio" name="radio3" value={"none"} />
                               <span>none</span>
                             </label>
                      </>
                      )
                      :
                      slice && slice.map((val) =>
                        <label>
                          <input onChange={(e) => {
                            setcompage(true)
                            setcomvalue(e.target.value)
                            oncompanyHandler(e.target.value)
                          }} type="radio" value={val.company} name="radio3" />
                          <span>{val.company}</span>
                        </label>
                      )
                    }
                     {
                      <p style={{ cursor: "pointer" }} onClick={() => setloadmore(!loadmore)}>{loadmore==true?"see fewer companies":"see all companies"}</p>
                    }
                      </div>
                    </div>
                    <div className="d-flex flex-column my-5">
                      <p className="bold-text m-0">
                        Military
                      </p>
                      <div className="role role2 mt-3">
                        <label>
                          <input onClick={(e) => onmilHandler()} type="checkbox" name="radio4" value={1} />
                          <span>Active Or Veteran</span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex  flex-column my-5">
                      <p className="bold-text m-0">
                        Security Clearance
                      </p>
                      <div className="role role2 mt-3">
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Inactive Clearance"} />
                          <span>Inactive Clearance</span>
                        </label>
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Active Confidential"} />
                          <span>Active Confidential</span>
                        </label>
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Active Secret"} />
                          <span>Active Secret</span>
                        </label>
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Active Top Secret"} />
                          <span>Active Top Secret</span>
                        </label>
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Active Top SecretSCI"} />
                          <span>Active Top Secret/SCI</span>
                        </label>
                        <label>
                          <input type="radio" onClick={(e) => onsecHandler(e.target.value)} name="radio5" value={"Other Active Clearance"} />
                          <span>Other Active Clearance</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Drawer>

                {/* <div className="role role2 res-dis-none-op ">
                  {
                    filteredPosts.length > 0 ?
                      filteredPosts
                        .map((val) => (
                          val.status !== 0 ?
                            <div className="m-0 search-resume-main-content-res">
                              <div className="search-resume-animate-down-btn">
                                {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                  <span className="search-resume-animate-down-btn-1"><i
                                    onClick={() => {
                                      if (pdfExportComponent.current && downloads < remainingdownloads) {
                                        props.ResumeGetById(val.id)
                                        pdfExportComponent.current.save();
                                        setdownloads(downloads + 1)
                                        savedDownload(val.id)
                                        // }
                                      }
                                      else {
                                        console.log("limit over")
                                      }
                                    }}
                                    class="fa fa-download" aria-hidden="true"></i></span>
                                  :
                                  <span className="search-resume-animate-down-btn-1"><i onClick={() => setBilingModalIsOpen3(true)}
                                    class="fa fa-download" aria-hidden="true"></i></span>
                                }
                                  {
                                                          allArray3&&allArray3.length>0?allArray3.filter(data=>data.resume_id==val.id&&data.user_id==localStorage.getItem("userid")).length>0?
                                                          <span className="search-resume-animate-down-btn-2"><i onClick={() => savedresume1(val.id,1)} class="fa fa-heart " aria-hidden="true"></i></span>
                                                          :
                                                          <span className="search-resume-animate-down-btn-2"><i onClick={() => savedresume1(val.id,0)} class="fa fa-heart-o" aria-hidden="true"></i></span>
                                                          :
                                                          <span className="search-resume-animate-down-btn-2"><i onClick={() => savedresume1(val.id,0)} class="fa fa-heart-o" aria-hidden="true"></i></span>
                                                        }
                                
                              </div>
                              <Link to={`/search-resumee?id=${val.id}`}>
                                <div className="d-flec align-items-center">
                                {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
    <h5 style={{ fontWeight: "bolder" }}>{val.first_name !== "" && val.first_name !== null && val.first_name !== undefined ? val.first_name : ""}<span className="pl-1 pr-0"></span>
    {val.last_name !== "" && val.last_name !== null && val.last_name !== undefined ? val.last_name : ""}</h5>
                                :""}
                              
                                </div>
                              </Link>
                              <p className="my-1" style={{ color: "black", fontSize: "12px" }}>{val.city}, {val.state}</p>
                              <p className="my-1" style={{ color: "black", fontSize: "12px" }}>{props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0?val.email:""}</p>

                              <>
                                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginLeft: "-5px" }}>
                                  {val.Job_title !== "" && val.Job_title !== null && val.Job_title !== undefined ? val.Job_title.split(",").map(exp =>
                                    <p className="small-tags-jb-title">
                                      {exp}
                                    </p>) : ""}
                                </div>
                              </>

                              <div className="d-flex align-items-center">
                                <span className="experty-tag">
                                  {val.Job_title !== "" && val.Job_title !== null && val.lastJob_title_name !== undefined ? val.Job_title : ""}
                                </span>
                              </div>
                            </div>
                            : ""

                        )) :
                      <>
                        {loaderfeil == true ?
                          <div className="d-flex flex-column">
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                          </div> :
                          <div className="p-5">
                            <Empty />

                          </div>
                        }
                      </>
                  }

                </div> */}
                <div className="role role2 res-dis-none-op ">
                  {console.log("resumesss",filteredPosts)}
                  {
                    filteredPosts.length > 0 ?
                      filteredPosts
                        .map((val) => (
                          val.status !== 0 ?
                           <>
                           
                           <div className=" m-0 search-resume-main-content-res text-dark">
                           <Link to={`/search-resumee?id=${val.id}`} className="text-dark">
                                  {
                                    props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                      <p>{`${val.first_name} ${val.middle_name} ${val.last_name}`} – {val.city}, {val.state}</p>
                                      :
                                      <p>{val.city}, {val.state}</p>
                                  }
   </Link>  
                                  <p className="d-flex">Last Visit: {val.last_login !== null && val.last_login !== undefined && val.last_login !== "" ? val.last_login : "XX/XX"} {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                 
                                 downloads==remainingdownloads?
                                    <p onClick={() => setBilingModalIsOpen3(true)}>– Download</p>
                                    :
                                    pdfContent==val.user_id?
                                    <p
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                    onClick={()=>{
                                      setresume_u_id(val.user_id)
                                      handleClick()
                                      getresumebyidfil(val.id,val.user_id)
                                      // setdownloads(downloads+1)
                                      savedDownload(val.id)
                                    }
                                    }>– Download</p>
                                    :
                                    <p
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                   >– <del >Download</del></p>
                                    
                                    :
                                    <p onClick={() => setBilingModalIsOpen3(true)}>– Download</p>
                                  } </p>
                                  <>
                                    <p>{val.Job_title !== "" && val.Job_title !== null && val.Job_title !== undefined ? val.Job_title.split(",").map((exp,ind) => (
                                      <>
                                      <p>{exp} – {val.company.split(",")[ind]}</p>
                                      </>
                                    )) : ""} </p>
                                  </>
                                  {
                                                          allArray3&&allArray3.length>0?allArray3.filter(data=>data.resume_id==val.id&&data.user_id==localStorage.getItem("userid")).length>0?
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,1)}><i className="fa fa-heart text-danger"></i></p>
                                                          :
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,0)}><i className="fa fa-heart-o text-danger"></i></p>
                                                          :
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,0)}><i className="fa fa-heart-o text-danger"></i></p>
                                                        }
                                  
                                </div>
                               
                           </>
                            : ""

                        )) : "no resumes found"
                  }

                </div>

{/* taha */}
                <div className="role role2 res-dis-none search-resume-height">
                  {
                    filteredPosts.length > 0 ?
                      filteredPosts
                        .map((val) => (
                          val.status !== 0 ?
                           <>
                            <label className="my-4" for={val.id} >
                              <input type="radio" className="mt-1 mr-2" onChange={(e) => getresumebyidfil(val.id,val.user_id)} id={val.id} defaultChecked={val.id == filterid ? true : false} name="fav_language" />
                              <span className="resume-data ml-2" style={{ borderRadius: '10px', alignItems: 'flex-start' }}>
                                <div className="ml-3">
                                  {
                                    props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                      <p>{`${val.first_name} ${val.middle_name} ${val.last_name}`} – {val.city}, {val.state}</p>
                                      :
                                      <p>{val.city}, {val.state}</p>
                                  }

                                  <p className="d-flex">Last Visit: {val.last_login !== null && val.last_login !== undefined && val.last_login !== "" ? val.last_login : "XX/XX"} {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                    
                                   
                                    downloads==remainingdownloads?
                                    <p onClick={() => setBilingModalIsOpen3(true)}>– Download</p>
                                    :
                                    pdfContent==val.user_id?
                                    <p
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                    onClick={()=>{
                                      setresume_u_id(val.user_id)
                                      handleClick()
                                      getresumebyidfil(val.id,val.user_id)
                                      // setdownloads(downloads+1)
                                      savedDownload(val.id)
                                    }
                                    }>– Download</p>
                                    :
                                    <p
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                   >– <del >Download</del></p>
                                   
                                    :
                                    <p onClick={() => setBilingModalIsOpen3(true)}>– Download</p>
                                  } </p>
                                  <>
                                    <p>{val.Job_title !== "" && val.Job_title !== null && val.Job_title !== undefined ? val.Job_title.split(",").map((exp,ind) => (
                                      <>
                                      <p>{exp} – {val.company.split(",")[ind]}</p>
                                      </>
                                    )) : ""} </p>
                                  </>
                                  {
                                                          allArray3&&allArray3.length>0?allArray3.filter(data=>data.resume_id==val.id&&data.user_id==localStorage.getItem("userid")).length>0?
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,1)}><i className="fa fa-heart text-danger"></i></p>
                                                          :
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,0)}><i className="fa fa-heart-o text-danger"></i></p>
                                                          :
                                                          <p style={{ cursor: "pointer" }} className="save12" onClick={() => savedresume1(val.id,0)}><i className="fa fa-heart-o text-danger"></i></p>
                                                        }
                                  
                                </div>
                              </span>
                            </label>
                           </>
                            : ""

                        )) : "no resumes found"
                  }

                </div>
              </div>
              <div className="res-dis-none col-lg-5 col-12 py-0 pl-3 pr-0">
                <div className="d-flex flex-column w-100">
                  <label style={{ fontWeight: "bold",marginBottom:"5px"}} htmlFor="exampleInputPassword1">Location:</label>
                  <input type="text" onChange={(e) => setSearchItem(e.target.value)} className="form-control employee-input-email" id="exampleInputPassword1" placeholder="City or Zip Code" />
                </div>
                {
                  filteredPosts.length > 0 ?
                    props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.job && props.ResumeGetByIdReducer.alljobs.job.length > 0 ? props.ResumeGetByIdReducer.alljobs.job.map(val => (
                      val.status !== 0 ?
                        <>
                          {
                            props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                              <Link className="fgh" to={`/send-email?cid=${val.id}`} > <button className="send-invitation w-100 py-3 my-4">Email Selected Candidate</button></Link>
                              :
                              <Link className="fgh" onClick={() => setBilingModalIsOpen3(true)} > <button className="send-invitation w-100 py-3 my-4">Email Selected Candidate</button></Link>
                          }

                          <div className="search-result-3-scrool-box p-2">
                            {
                              props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
                                <>
                                  <p style={{ fontSize: "22px", fontWeight: "bolder" }}>{`${val.first_name} ${val.middle_name} ${val.last_name}`}</p>
                                  <p>{val.city}, {val.state}</p>
                                  <hr />
                                </>
                                : ""
                            }

                            {val.professional_summary !== "" && val.professional_summary !== undefined && val.professional_summary !== null ?
                              <>

                                <h5 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Professional Summary</h5>
                                <p>{parse(val.professional_summary)}</p>
                            <hr />

                              </>
                              : ""}

                            <h5 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Education</h5>
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.education && props.ResumeGetByIdReducer.alljobs.education.length > 0 ? props.ResumeGetByIdReducer.alljobs.education.map(edu => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Level of Education: </p>
                                    <p className="mb-0 ml-1">{edu.level_of_education}</p>
                                  </div>


                                  {edu.school !== "" && edu.school !== undefined && edu.school !== null ?
                                    <>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">School: </p>
                                        <p className="mb-0 ml-1">{edu.school}</p>
                                      </div>
                                    </>
                                    : ""
                                  }


                                  {edu.degree !== "" && edu.degree !== undefined && edu.degree !== null ?
                                    <>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Degree: </p>
                                        <p className="mb-0 ml-1">{edu.degree}</p>
                                      </div>
                                    </>
                                    : ""
                                  }


                                  {edu.major !== "" && edu.major !== undefined && edu.major !== null ?
                                    <>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Major: </p>
                                        <p className="mb-0 ml-1">{edu.major}</p>
                                      </div>
                                    </>
                                    : ""
                                  }

                                  {edu.city !== "" && edu.city !== undefined && edu.city !== null ?
                                    <>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Location: </p>
                                        <p className="mb-0 ml-1">{edu.city}</p>
                                      </div>
                                    </>
                                    : ""
                                  }


                                  {edu.date_of_completion !== "" && edu.date_of_completion !== undefined && edu.date_of_completion !== null ?
                                    <>
                                      <div className="d-flex align-items-center">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Date of Completion: </p>
                                        <p className="mb-0 ml-1">{edu.date_of_completion == "Currently enrolled" ? edu.date_of_completion : dateFormat(edu.date_of_completion, "mmmm, yyyy")}</p>
                                      </div>
                                    </>
                                    : ""
                                  }
                                  <hr />
                                </>
                              )) : ""
                            }
                            <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Work Experience</h4>
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.experience && props.ResumeGetByIdReducer.alljobs.experience.length > 0 ? props.ResumeGetByIdReducer.alljobs.experience.map(exp => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Job Title: </p>
                                    <p className="mb-0 ml-1">{exp.job_title}</p>
                                  </div>



                                  <div className="d-flex align-items-center">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Company: </p>
                                    <p className="mb-0 ml-1">{exp.company}</p>
                                  </div>



                                  <div className="d-flex align-items-center">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Location: </p>
                                    <p className="mb-0 ml-1">{exp.city}, {exp.state}</p>
                                  </div>




                                  <div className="d-flex align-items-center">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Duration: </p>
                                    <p className="mb-0 ml-1">{exp.time_period_start == "Still currently employed here" ? exp.time_period_start : dateFormat(exp.time_period_start, "mmmm, yyyy")} To {exp.time_period_end == "Still currently employed here" ? exp.time_period_end : dateFormat(exp.time_period_end, "mmmm, yyyy")}</p>
                                  </div>


                                  {exp.duties !== "" && exp.duties !== undefined && exp.duties !== null ?
                                    <>
                                      <div className="d-flex align-items-start">
                                        <p className="mb-0 ml-0">{parse(exp.duties)}</p>
                                      </div>
                                    </>
                                    : ""
                                  }
                                  <hr />
                                </>
                              )) : ""
                            }
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ?
                                <>
                                  <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Military Service</h4>
                                  {
                                    props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ? props.ResumeGetByIdReducer.alljobs.military.map(mil => (
                                      <>

                                        {mil.country !== "" && mil.country !== undefined && mil.country !== null ?
                                          <>
                                            <div className="d-flex align-items-start">
                                              <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Country: </p>
                                              <p className="mb-0 ml-1">{mil.country}</p>
                                            </div>
                                          </>
                                          : ""
                                        }



                                        {mil.rank !== "" && mil.rank !== undefined && mil.rank !== null ?
                                          <>
                                            <div className="d-flex align-items-start">
                                              <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Rank: </p>
                                              <p className="mb-0 ml-1">{mil.rank}</p>
                                            </div>
                                          </>
                                          : ""
                                        }


                                        <div className="d-flex align-items-start">
                                          <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Duration: </p>
                                          <p className="mb-0 ml-1 mr-1">
                                            {mil.start_date == "Still currently employed here" ? mil.start_date : dateFormat(mil.start_date, "mmmm, yyyy")}
                                          </p>
                                          {mil.end_date !== "" && mil.end_date !== undefined && mil.end_date !== null ?
                                            <>
                                              To
                                            </>
                                            : ""
                                          }
                                          <p className="mb-0 ml-1">
                                            {mil.end_date == "Still currently employed here" ? mil.end_date : dateFormat(mil.end_date, "mmmm, yyyy")}
                                          </p>
                                        </div>






                                        {props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.mos && props.ResumeGetByIdReducer.alljobs.mos.length > 0 ?
                                          <>
                                            <div className="d-flex align-items-start">
                                              <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">MOS: </p>
                                              {
                                                props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.mos && props.ResumeGetByIdReducer.alljobs.mos.length > 0 ? props.ResumeGetByIdReducer.alljobs.mos.map(mo => (
                                                  <>
                                                    <p className="mb-0 ml-1">{mo.mos}</p>
                                                  </>
                                                )) : ""
                                              }
                                            </div>
                                          </>
                                          : ""
                                        }


                                        {props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.branch && props.ResumeGetByIdReducer.alljobs.branch.length > 0 ?
                                          <>
                                            <div className="d-flex align-items-start">
                                              <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Branch: </p>
                                              {
                                                props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.branch && props.ResumeGetByIdReducer.alljobs.branch.length > 0 ? props.ResumeGetByIdReducer.alljobs.branch.map(bra => (
                                                  <>
                                                    <p className="mb-0 ml-1">{bra.branch}</p>
                                                  </>
                                                )) : ""
                                              }
                                            </div>
                                          </>
                                          : ""
                                        }



                                        <hr />
                                      </>
                                    )) : ""
                                  }
                                </>
                                : ""}


                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.language && props.ResumeGetByIdReducer.alljobs.language.length > 0 ?
                                <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Languages</h4>
                                : ""
                            }

                            {props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.language && props.ResumeGetByIdReducer.alljobs.language.length > 0 ?

                              <>
                                <div className="d-flex align-items-start">
                                  <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Language: </p>
                                  <p className="mb-0 ml-1 d-flex align-items-center">
                                    {
                                      props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.language && props.ResumeGetByIdReducer.alljobs.language.length > 0 ? props.ResumeGetByIdReducer.alljobs.language.map((lang, index) => (
                                        <>
                                          {lang.lang} {`(${lang.level})`}{index == props.ResumeGetByIdReducer.alljobs.language.length - 1 ? "" : <span className="mr-1 mb-0">,</span>}
                                        </>
                                      )) : ""
                                    }
                                  </p>
                                </div>
                                <hr />
                              </>
                              : ""
                            }
















                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ? props.ResumeGetByIdReducer.alljobs.military.map(mil => (
                                <>

                                  {mil.security_clearance !== "" && mil.security_clearance !== undefined && mil.security_clearance !== null ?
                                    <>
                                      <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Security clearance</h4>
                                    </>
                                    : ""
                                  }

                                  {mil.security_clearance !== "" && mil.security_clearance !== undefined && mil.security_clearance !== null ?

                                    <>
                                      <div className="d-flex align-items-start">
                                        <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Security clearance: </p>
                                        <p className="mb-0 ml-1 d-flex align-items-center">
                                          {mil.security_clearance}
                                        </p>
                                      </div>
                                      <hr />
                                    </>
                                    : ""
                                  }
                                </>
                              )) : ""
                            }
















                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.award && props.ResumeGetByIdReducer.alljobs.award.length > 0 ?
                                <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Award</h4>
                                : ""
                            }



                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.award && props.ResumeGetByIdReducer.alljobs.award.length > 0 ?
                                <>
                                  <div className="d-flex align-items-start">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Awards: </p>
                                    <p className="mb-0 ml-1">
                                      {
                                        props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.award && props.ResumeGetByIdReducer.alljobs.award.length > 0 ? props.ResumeGetByIdReducer.alljobs.award.map((awa, index) => (
                                          <>
                                            {awa.title} {`(${dateFormat(awa.date, "mmmm, yyyy")})`}{index == props.ResumeGetByIdReducer.alljobs.award.length - 1 ? "" : <span className="mr-1 mb-0">,</span>}
                                          </>
                                        )) : ""
                                      }
                                    </p>
                                  </div>
                                  <hr />
                                </>
                                : ""
                            }
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.certification && props.ResumeGetByIdReducer.alljobs.certification.length > 0 ?
                                <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Certifications</h4>
                                : ""
                            }



                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.certification && props.ResumeGetByIdReducer.alljobs.certification.length > 0 ?
                                <>
                                  <div className="d-flex align-items-start">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Certifications: </p>
                                    <p className="mb-0 ml-1">
                                      {
                                        props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.certification && props.ResumeGetByIdReducer.alljobs.certification.length > 0 ? props.ResumeGetByIdReducer.alljobs.certification.map((cer, index) => (
                                          <>
                                            {cer.title} {`(${dateFormat(cer.date, "mmmm, yyyy")})`}{index == props.ResumeGetByIdReducer.alljobs.certification.length - 1 ? "" : <span className="mr-1 mb-0">,</span>}
                                          </>
                                        )) : ""
                                      }
                                    </p>
                                  </div>
                                  <hr />
                                </>
                                : ""
                            }
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.volunteer && props.ResumeGetByIdReducer.alljobs.volunteer.length > 0 ?
                                <h4 style={{ color: "#f48a20", fontSize: "22px" }} className="mb-1">Volunteer</h4>
                                : ""
                            }

                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.volunteer && props.ResumeGetByIdReducer.alljobs.volunteer.length > 0 ? props.ResumeGetByIdReducer.alljobs.volunteer.map(vol => (
                                <>
                                  <div className="d-flex align-items-start">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Title: </p>
                                    <p className="mb-0 ml-1">{vol.title}</p>
                                  </div>



                                  <div className="d-flex align-items-start">
                                    <p className="mb-0 dropdddd" style={{ fontSize: "15px", color: "black", fontWeight: "700" }} href="#">Duration: </p>
                                    <p className="mb-0 ml-1 mr-1">{dateFormat(vol.start, "mmmm, yyyy")}</p>
                                    {vol.end !== "" && vol.end !== undefined && vol.end !== null ?
                                      <>
                                        To
                                      </>
                                      : ""
                                    }
                                    <p className="mb-0 ml-1">{vol.end !== "I currently volunteer here" ? dateFormat(vol.end, "mmmm, yyyy") : "I currently volunteer here"}</p>
                                  </div>
                                </>
                              )) : ""
                            }
                          </div>
                        </>
                        : ""
                    )) : "" : ""
                }


              </div>
              <div className="col-1" />
            </div>

            <div className="justify-content-center d-flex black-with-in-pagination mt-5">
            {/* {`rounded border-mute bg-${bg}`}
            {`rounded border-mute bg-${bg2}`} */}
            {/* className={pgnobg==pageIndex?`rounded border-mute bg-danger`:`rounded border-mute mute-center`} */}
            {/* rounded border-mute mute-next bg-${bg} */}
            {/* rounded border-mute mute-next bg-${bg2} */}
              <button style={{width:"100px"}} onClick={() => gotoprevious()} className={`rounded border-mute mute-next bg-${bg}`}><i class="fa fa-angle-double-left mr-3" aria-hidden="true"></i> Previous </button>
              {
                pages.map((pageIndex) => (
                  <button onClick={() => {
                    setpgnobg(pageIndex)
                    setpgno(pageIndex)
                  }} className={pgnobg==pageIndex?`rounded border-mute mute-center bg-successss`:`rounded border-mute mute-center`}>{pageIndex + 1}</button>
                ))
              }
              <button onClick={() => gotonext()} className={`rounded border-mute mute-next bg-${bg2}`} style={{width:"100px"}}>Next<i class="fa fa-angle-double-right ml-3" aria-hidden="true"></i></button>
            </div>
          </div>
          {/* footer====================================================================== */}

        </div>
      </div>
      <Modal
        isOpen={BilingmodalIsOpen2}
        onRequestClose={() => setBilingModalIsOpen2(false)}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "100",
          },
          content: {
            position: "absolute",
            margin: "0 auto",
            width: modalwidth,
            height: "200px",
            top: "calc(50% - 100px)",
            left: "0",
            right: "0",
            bottom: "100px",

            background: "#fff",

            outline: "none",
            padding: "20px",

            background: "#fff",
            border: "1px solid #fff",
          },
        }}
      >
        <div className=" justify-content-center align-items-center pt-3">
          <h5 className="text-center" style={{ color: "black" }}>Do you want to save this Resume?</h5>
          <div className="d-flex justify-content-center mt-4">
            {
              savebtn == false ?
                <p onClick={(e) => savedresume()} className="p-3 rounded" style={{ color: "white", cursor: "pointer", backgroundColor: "#8dc63f" }}><b>CONTINUE</b></p>
                :
                <p disabled={true} className="p-3 rounded" style={{ color: "white", cursor: "pointer", backgroundColor: "#8dc63f" }}><b>CONTINUE</b></p>
            }
            <p onClick={() => setBilingModalIsOpen2(false)} className="ml-5 pt-3" style={{ color: "black", cursor: "pointer" }}><b>Cancel</b></p>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={BilingmodalIsOpen3}
        onRequestClose={() => setBilingModalIsOpen3(false)}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "100",
          },
          content: {
            position: "absolute",
            margin: "0 auto",
            width: modalwidth,
            height: "240px",
            top: "calc(50% - 90px)",
            left: "0",
            right: "0",
            bottom: "100px",
            display:"flex",
            alignItems:'center',
            justifyContent:"center",
            background: "#fff",

            outline: "none",
            padding: "20px",

            background: "#fff",
            border: "1px solid #fff",
          },
        }}
      >
        <div className="text-center mt-3">
          <h5>In order to contact a candidate, you will need a subscription package first. Press OK to see the options</h5>
          <div className="d-flex mt-3 align-items-center justify-content-center search-session">
            <Link className="fgh" to={`/get-premium${window.location.href.search('false')== -1&&window.location.href.search('true')== -1?`/`:`?if=${window.location.href.search('false')== -1 ?true:false}`}`}>OK</Link>
            <p onClick={() => setBilingModalIsOpen3(false)} className="ml-5 pt-0" style={{ color: "black", cursor: "pointer" ,marginBottom:"31px"}}><b>Cancel</b></p>
          </div>

        </div>
      </Modal>
      <Modal
        isOpen={BilingmodalIsOpen9}
        onRequestClose={() => setBilingModalIsOpen9(false)}
        style={{
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "100",
          },
          content: {
            position: "absolute",
            margin: "0 auto",
            width: modalwidth,
            height: "180px",
            top: "calc(50% - 90px)",
            left: "0",
            right: "0",
            bottom: "100px",

            background: "#fff",

            outline: "none",
            padding: "20px",

            background: "#fff",
            border: "1px solid #fff",
          },
        }}
      >
        <div className="text-center mt-3">
          <h5>Resume Already Saved.</h5>
          <div className="d-flex mt-3 align-items-center justify-content-center search-session">
            <Link className="fgh" onClick={() => window.location.reload(false)}>OK</Link>
          </div>

        </div>
      </Modal>
      <div
        style={{
          position: "absolute",
          left: "-30000px",
          top: 0,
        }}
      >
        <PDFExport paperSize="A4" ref={pdfExportComponent}>
          {
            props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.job && props.ResumeGetByIdReducer.alljobs.job.length > 0 ? props.ResumeGetByIdReducer.alljobs.job.map(val => (
              val.status !== 0 ?
                <div className="border rouded" style={{ paddingRight: "10px",paddingLeft: "10px" , marginTop:"0px",overflow:"hidden" }}
                >
                  <div className="row">
                    <div className="col-12 text-dark pt-2">
                      <div className=" border-bottom py-3">
                      {props.GetUserReducer.users && props.GetUserReducer.users.Is_packaged !== null && props.GetUserReducer.users.Is_packaged !== undefined && props.GetUserReducer.users.Is_packaged !== "" && props.GetUserReducer.users.Is_packaged !== 0 ?
<>
<span  style={{color: "black"}}>{`${val.first_name} ${val.middle_name} ${val.last_name}`}</span><br /></>
 :""}
                       
                        <span style={{ color: "black",marginTop:"0px" }}>{`${val.city}, ${val.state}`}</span>
                      </div>

                      <div className="mt-3" style={{overflow:'hidden',width:"100%"}}>
                        <h5 className="m-0" style={{color:'orange'}}>PROFESSIONAL SUMMARY</h5>
                        <p style={{overflow:'hidden',width:"100%",paddingRight:"100px"}}>{parse(val.professional_summary)}</p>
                      </div>

                      <div className=" py-3">
                              <div className="d-flex align-items-center justify-content-start preview-full-resume-content-area">
                                <h5 className="m-0" style={{color:'orange'}}>EDUCATION</h5>
                              </div>
                              {props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.education && props.ResumeGetByIdReducer.alljobs.education.length > 0 ? props.ResumeGetByIdReducer.alljobs.education.map(edu => (
                                <div className="padding-block-in-bottom-justice  flex-direction-in-res-justice d-flex align-items-center justify-content-between">
                                  <div>
                                    <div className="d-flex flex-column" style={{marginTop:"10px"}}>
                                      <p className="margin-zero-in-bottom-justice  m-0" style={{ fontWeight: "800" }}>{`${edu.school !== "" && edu.school !== undefined && edu.school !== null ? edu.school : ""}`}</p>
                                      <div className=" align-items-center">
                                        <p className="margin-zero-in-bottom-justice m-0">{`${edu.level_of_education !== "" && edu.level_of_education !== undefined && edu.level_of_education !== null ? edu.level_of_education : ""}`}</p><p className="m-0 px-1"></p>
                                        <p className="margin-zero-in-bottom-justice  m-0" >{`${edu.major !== "" && edu.major !== undefined && edu.major !== null ? edu.major : ""}`}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-end flex-direction-in-row-justice flex-column justify-content-center" style={{left: "-23px",position: "relative"}}>
                                    <p>{`${edu.city !== "" && edu.city !== undefined && edu.city !== null ? edu.city : ""}`}</p>
                                    <p>{`${edu.date_of_completion !== "" && edu.date_of_completion !== undefined && edu.date_of_completion !== null ? edu.date_of_completion !== "Currently enrolled" ? dateFormat(edu.date_of_completion, "mmmm, yyyy") : "Currently enrolled" : "Currently enrolled"}`}</p>
                                  </div>
                                </div>
                              )) : <p className="py-4">(More education info if provided…)</p>
                              }
                            </div>

                            <div className=" py-3">
                              <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                <div className="d-flex">
                                  <h5 className="m-0" style={{color:'orange'}}>WORK EXPERIENCE </h5>
                                </div>
                              </div>
                              {
                                props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.experience && props.ResumeGetByIdReducer.alljobs.experience.length > 0 ? props.ResumeGetByIdReducer.alljobs.experience.map(exp => (
                                  <>
                                    <div className="padding-block-in-bottom-justice  flex-direction-in-res-justice d-flex align-items-center justify-content-between">
                                      <div>
                                        <div className="d-flex flex-in-resume-direction-false mb-1">
                                          <p style={{ fontWeight: "800" }} className="mb-0 ml-1">{exp.company}</p>
                                        </div>
                                        <div className="d-flex flex-in-resume-direction-false mb-1">
                                          <i><p className="mb-0 ml-1">{exp.job_title}</p></i>
                                        </div>

                                      </div>
                                      <div className="flex-direction-in-row-justice-exp  d-flex align-items-end  flex-column justify-content-center" style={{left: "-26px",
    position: "relative"}}>
                                        <p>{exp.city},{exp.state}</p>
                                        <p style={{marginRight:"20px"}}><span style={{marginRight:"15px"}}>{dateFormat(exp.time_period_start, "mmmm, yyyy")}</span> to {exp.time_period_end !== "Still currently employed here" ? dateFormat(exp.time_period_end, "mmmm, yyyy") : "Still currently employed here"}</p>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-column flex-in-resume-direction-false mb-1">
                                      <p className="mb-0 ml-1" style={{overflow:'hidden',width:"100%",paddingRight:"110px"}}>{parse(exp.duties)}</p>
                                    </div>
                                    <hr/>
                                  </>
                                )) : <p className="py-4">(More experience info if provided…)</p>
                              }
                            </div>
                            {
                              props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ?
                                <div className=" py-3">
                                  <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                    <div className="d-flex">
                                      <h5 className="m-0" style={{color:'orange'}}>MILITARY SERVICE</h5>
                                    </div>
                                  </div>
                                  {
                                    props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ? props.ResumeGetByIdReducer.alljobs.military.map(mil => (
                                      <div className="d-flex padding-block-in-preview-resume-justice align-items-center justify-content-between">
                                        <div style={{ width: "100%" }}>
                                          {
                                            props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.branch&&props.ResumeGetByIdReducer.alljobs.branch.length > 0 ? props.ResumeGetByIdReducer.alljobs.branch.map(br => (
                                              <>
                                                <div style={{ width: "100%" }} className="d-flex align-items-center flex-in-resume-direction-false mb-1">
                                                  <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd">Branch:</a>
                                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                    <p className="mb-0 ml-1">{br.branch}</p>
                                                    {props.ResumeGetByIdReducer.alljobs&&props.ResumeGetByIdReducer.alljobs.mos && props.ResumeGetByIdReducer.alljobs.mos.length > 0 ?
                                                      <p style={{marginRight:"25px"}}> <span style={{marginRight:"15px"}}>{dateFormat(mil.start_date, "mmmm, yyyy")}</span> to {dateFormat(mil.end_date, "mmmm, yyyy")}</p>
                                                      : ""}
                                                  </div>
                                                </div>
                                              </>
                                            )) : <div className="d-flex">
                                              <p className="m-0">No branch of service added</p>
                                            </div>
                                          }
                                          <div className="d-flex flex-in-resume-direction-false mb-1">
                                            <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd" >MOS:</a>
                                            {
                                              props.ResumeGetByIdReducer.alljobs&&props.ResumeGetByIdReducer.alljobs.mos && props.ResumeGetByIdReducer.alljobs.mos.length.length > 0 ? props.ResumeGetByIdReducer.alljobs.mos.map((mos, index) => (
                                                <>
                                                  <p className="mb-0 ml-1">{mos.mos}</p>
                                                  {index == props.ResumeGetByIdReducer.alljobs.mos.length - 1 ? "" : <span className="text-dark pl-0 pr-1">,</span>}
                                                </>
                                              )) : <p>No MOS added</p>

                                            }
                                          </div>
                                          {props.ResumeGetByIdReducer.alljobs.military.length > 0 ? props.ResumeGetByIdReducer.alljobs.military[0].security_clearance == "" || props.ResumeGetByIdReducer.alljobs.military[0].security_clearance == undefined || props.ResumeGetByIdReducer.alljobs.military[0].security_clearance == null ?
                                            "" :
                                            <div className="d-flex flex-in-resume-direction-false">
                                              <a style={{ fontSize: "15px", color: "black", fontWeight: "bolder" }} href="#" className="mt-0 dropdddd" >Security Clearance:</a>
                                              {props.ResumeGetByIdReducer.alljobs.military && props.ResumeGetByIdReducer.alljobs.military.length > 0 ? props.ResumeGetByIdReducer.alljobs.military.map(cle => (
                                                <>
                                                  <p className="mb-0 ml-1">{`${cle.security_clearance !== null && cle.security_clearance !== undefined && cle.security_clearance !== "" ? cle.security_clearance : ""}`}</p>
                                                </>
                                              )) : ""
                                              }
                                            </div>
                                            : ""
                                          }
                                        </div>
                                        <div className="d-flex align-items-end  flex-column justify-content-center">
                                        </div>
                                      </div>
                                    )) : <p className="py-4">(More military info if provided…)</p>
                                  }
                                </div> : ""}
                            {props.ResumeGetByIdReducer.alljobs.language.length > 0 || props.ResumeGetByIdReducer.alljobs.certification.length > 0 || props.ResumeGetByIdReducer.alljobs.award.length > 0 ?
                              <div className=" py-3">
                                <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                  <div className="d-flex">
                                    <h5 className="m-0" style={{color:'orange'}}>ADDITIONAL SKILLS</h5>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <div className="pr-5 pt-2">
                                    {props.ResumeGetByIdReducer.alljobs.language.length > 0 ?
                                      <div className="flex-in-resume-direction-false">
                                        <div className="align-items-center">
                                          <p style={{ fontWeight: "bold" }} className="mr-3">Additional Language(s):</p>
                                        </div>
                                        <div className=" align-items-center">

                                          {props.ResumeGetByIdReducer.alljobs.language && props.ResumeGetByIdReducer.alljobs.language.length > 0 ? props.ResumeGetByIdReducer.alljobs.language.map((lang, index) => (
                                            <>
                                              <p className="m-0">{`${lang.lang !== null && lang.lang !== undefined && lang.lang !== "" ? `${lang.lang} (${lang.level})` : ""}`}</p>
                                              {index == props.ResumeGetByIdReducer.alljobs.language.length - 1 ? "" : <span className="text-dark pl-0 pr-1"></span>}
                                            </>
                                          )) : <p>Level of Fluency</p>
                                          }
                                        </div>

                                      </div>
                                      : ""}
                                    {props.ResumeGetByIdReducer.alljobs.certification.length > 0 ?
                                      <div className="flex-in-resume-direction-false" style={{marginTop:"10px"}}>
                                        <p style={{ fontWeight: "bold" }} className="mr-3">Certification(s):</p>
                                        {props.ResumeGetByIdReducer.alljobs.certification && props.ResumeGetByIdReducer.alljobs.certification.length > 0 ? props.ResumeGetByIdReducer.alljobs.certification.map((cert, index) => (
                                          <>
                                            <p>{`${cert.title !== null && cert.title !== undefined && cert.title !== "" ? cert.title : ""}`}</p>
                                            <p>{`${cert.date !== null && cert.date !== undefined && cert.date !== "" ? dateFormat(cert.date, "mmmm, yyyy") : ""}`}</p>
                                            {index == props.ResumeGetByIdReducer.alljobs.certification.length - 1 ? "" : <span className="text-dark pl-0 pr-1"></span>}
                                          </>

                                        )) : <p>Date Earned</p>
                                        }
                                      </div>
                                      : ""}
                                    {props.ResumeGetByIdReducer.alljobs.award.length > 0 ?
                                      <div className="flex-in-resume-direction-false">
                                        <p style={{ fontWeight: "bold" }} className="mr-3">Award(s): </p>
                                        {props.ResumeGetByIdReducer.alljobs.award && props.ResumeGetByIdReducer.alljobs.award.length > 0 ? props.ResumeGetByIdReducer.alljobs.award.map((awar, index) => (
                                          <>
                                            <p>{`${awar.title !== null && awar.title !== undefined && awar.title !== "" ? awar.title : ""}`} </p>
                                            <p>{`${awar.date !== null && awar.date !== undefined && awar.date !== "" ? dateFormat(awar.date, "mmmm, yyyy") : ""}`}</p>
                                            {index == props.ResumeGetByIdReducer.alljobs.award.length - 1 ? "" : <span className="text-dark pl-0 pr-1"></span>}
                                          </>
                                        )) : <p>Date Earned</p>
                                        }
                                      </div>
                                      : ""
                                    }
                                  </div>
                                </div>
                              </div>
                              : ""}
                            {props.ResumeGetByIdReducer.alljobs&&props.ResumeGetByIdReducer.alljobs.volunteer&&props.ResumeGetByIdReducer.alljobs.volunteer.length > 0 ?
                              <div className=" py-3">
                                <div className="d-flex align-items-end justify-content-start preview-full-resume-content-area">
                                  <div className="d-flex">
                                    <h5 className="m-0" style={{color:'orange'}}>VOLUNTEER WORK</h5>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <table class="table table-hover">
                                    <thead>
                                      <tr>
                                        <th scope="col">Title</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {props.ResumeGetByIdReducer.alljobs.volunteer && props.ResumeGetByIdReducer.alljobs.volunteer.length > 0 ? props.ResumeGetByIdReducer.alljobs.volunteer.map((val, ind) => (
                                        <tr>
                                          <td>{val.title}</td>
                                          <td>{dateFormat(val.start, "mmmm, yyyy")}</td>
                                          <td>{val.end !== "I currently volunteer here" ? dateFormat(val.end, "mmmm, yyyy") : "I currently volunteer here"}</td>
                                        </tr>
                                      )) : ""
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              : ""}
                      {/* <div className="d-flex flex-column mt-3" style={{ border: "1px solid black", borderRadius: 10, padding: 10, }}>
                        {val.contact_number !== "" && val.contact_number !== null && val.contact_number !== undefined ?
                          <div className="d-flex align-items-center">
                            <p>Phone Number</p><p className="mx-1">-</p><p style={{ color: "orange" }}>{val.contact_number}</p>
                          </div>
                          : ""}
                        {val.add_contact_number !== "" && val.add_contact_number !== null && val.add_contact_number !== undefined ?

                          <div className="d-flex align-items-center">
                            <p>Additional Number</p><p className="mx-1">-</p><p style={{ color: "orange" }}>{val.add_contact_number}</p>
                          </div>
                          : ""}

                        {val.email !== "" && val.email !== null && val.email !== undefined ?

                          <div className="d-flex align-items-center">
                            <p>Email</p><p className="mx-1">-</p><p style={{ color: "orange" }}>{val.email}</p>
                          </div>
                          : ""}


                        {val.state !== "" && val.state !== null && val.state !== undefined ?

                          <div className="d-flex align-items-center">
                            <p>State</p><p className="mx-1">-</p><p style={{ color: "orange" }}>{val.state}</p>
                          </div>
                          : ""}


                        {val.zipcode !== "" && val.zipcode !== null && val.zipcode !== undefined ?

                          <div className="d-flex align-items-center">
                            <p>Zip Code</p><p className="mx-1">-</p><p style={{ color: "orange" }}>{val.zipcode}</p>
                          </div>
                          : ""}

                      </div> */}

                      {/* <div className="mt-2">
                        <img style={{ width: "40%" }} src={Education1} alt="" />
                      </div>
                      {
                        props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.education && props.ResumeGetByIdReducer.alljobs.education.length > 0 ? props.ResumeGetByIdReducer.alljobs.education.map(edu => (
                          <div className="">
                            <div className="d-flex flex-column" style={{ border: "1px solid black", borderRadius: 10, padding: 10, width: "100%" }}>
                              <span style={{ color: "orange" }}>{edu.level_of_education}</span>
                              {edu.major !== "" && edu.major !== null && edu.major !== undefined ?
                                <span style={{ color: "orange" }}>{edu.major}</span>
                                : ""}


                              {edu.school !== "" && edu.school !== null && edu.school !== undefined ?
                                <span style={{ color: "orange" }}>{edu.school}</span>
                                : ""}


                              {edu.degree !== "" && edu.degree !== null && edu.degree !== undefined ?
                                <span style={{ color: "orange" }}>{edu.degree}</span>
                                : ""}

                              {edu.date_of_completion !== "" && edu.date_of_completion !== null && edu.date_of_completion !== undefined ?
                                <span style={{ color: "orange" }}>{edu.date_of_completion}</span>
                                : ""}

                            </div>
                          </div>
                        )) : ""
                      } */}

                      {/* {
                        props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.experience && props.ResumeGetByIdReducer.alljobs.experience.length > 0 ?
                          <div className="mt-2">
                            <img style={{ width: "40%" }} src={Ex} alt="" />
                          </div>
                          : ""
                      }
                      {
                        props.ResumeGetByIdReducer.alljobs && props.ResumeGetByIdReducer.alljobs.experience && props.ResumeGetByIdReducer.alljobs.experience.length > 0 ? props.ResumeGetByIdReducer.alljobs.experience.map(exp => (
                          <div className="">
                            <div className="d-flex flex-column" style={{ border: "1px solid black", borderRadius: 10, padding: 10, width: "100%" }}>
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <span style={{ color: "orange" }}>{exp.job_title}</span>
                                <span style={{ color: "orange" }}>{exp.time_period_start} - {exp.time_period_end}</span>
                              </div>
                              <span style={{ color: "orange" }}>Company name</span>
                              <span style={{ color: "orange" }}>{exp.city}/{exp.state}</span>
                            </div>
                          </div>
                        )) : ""
                      } */}
                    </div>
                  </div>
                </div>
                :
                ""
            )) : ""
          }

        </PDFExport>
      </div>
    </>
  )
}
const mapStateToProps = (state) => ({
  SearchReducer: state.SearchReducer,
  GetUserReducer: state.GetUserReducer,
  ResumeGetByIdReducer: state.ResumeGetByIdReducer,
});

const mapDispatchToProps = (dispatch) => ({
  ResumeGetById: (userId) =>
    dispatch(ResumeGetById(userId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SeachResume);


// code for scoop solutions
