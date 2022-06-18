import React, { Component } from 'react';
import { useState, useEffect } from 'react';

import nextConfig from '../next.config';
import css from 'styled-jsx/css';
import Link from "next/link";
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import cookie from 'cookie';
import Checkauth from '../Modules/checkAuth';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AceEditor from '../Components/AceEditor';

// const AceEditor = dynamic(import('react-ace'), { ssr: false });  //import without server side rendering
// import AceEditor from 'react-ace-editor';

// export async function getServerSideProps(context) {
//   const data = await Checkauth(context.req.headers.cookie);    
//   return { props: { data } }
// }


function Codestatus(Jobstatus) {
  if (Jobstatus.Jobstatus == 'pending') {
    return (<> <h5 style={styles.status_blue} >{Jobstatus.Jobstatus}</h5> </>)
  } else if (Jobstatus.Jobstatus == 'success') {
    return (<> <h5 style={styles.status_green} >{Jobstatus.Jobstatus}</h5> </>)
  } else {
    return (<> <h5 style={styles.status_red} >{Jobstatus.Jobstatus}</h5> </>)
  }
}


function Compiler({ data }) {
  const [Code, setCode] = useState("");
  const [Language, setLanguage] = useState("cpp");
  const [Emode, setEmode] = useState("c_cpp");

  const [Jobstatus, setJobstatus] = useState("");
  const [Joboutput, setJoboutput] = useState("");





  const handleSubmit = async () => {
    console.log(Language)
    let codedata = await JSON.stringify({
      language: Language,
      code: Code
    })

    try {
      //###########  For Send the code to server -------------------------------------------------------------
      let response = await axios.post(`${nextConfig.REST_API_URL}/run`, codedata,
        // let response = await axios.post('/api/run', codedata,
        { headers: { 'Content-Type': 'application/json' } })
      console.log("Your Response is : ", response.data);
      setJobstatus("pending");
      setJoboutput("");

      //###########  For Get the Output -------------------------------------------------------------
      let intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(`${nextConfig.REST_API_URL}/status`, { params: { id: response.data.jobId } })
        const { success, job, error } = dataRes;

        console.log(dataRes)
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;

          setJobstatus(jobStatus);
          // var obj = JSON.parse(jobOutput);
          // var pretty = JSON.stringify(obj, undefined, 4);
          setJoboutput(jobOutput);

          if (jobStatus === "pending") return;
          clearInterval(intervalId)
        } else {
          console.error(error);
          clearInterval(intervalId)
        }

      }, 1000);

    } catch (error) {
      console.log(error.response)
    }
  }


  const Logoutwithapi = async () => {
    let token = Cookies.get('token');

    try {
      let response = await axios.post(`${nextConfig.REST_API_URL}/logout`, JSON.stringify({
        token: token
      }),
        { headers: { 'Content-Type': 'application/json' } })

      Cookies.remove('token');
      if (response.data.status == 'success') {
        Swal.fire({
          icon: 'success',
          title: 'SUCCESS',
          text: 'Logout Successfully',
        }).then(() => {
          Router.push('/Login')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong..!!',
        })
      }


    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong..!!',
      })
    }
  }


  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to logout !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(65 154 238)',
      cancelButtonColor: 'rgb(216 67 67)',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Logoutwithapi();
      }
    })
  }




  const handleChangeLanguage = (langName) => {
    setLanguage(langName); // Change language for send the type of language for server    
    if (langName == 'cpp') {  // Change editor template mode
      setEmode('c_cpp')
    } else if (langName == 'py') {
      setEmode('python')
    } else if (langName == 'java') {
      setEmode('java')
    } else if (langName == 'js') {
      setEmode('javascript')
    } else {
      setEmode('text')
    }
  }

  const handleOnload = () => {
    // console.log("this is onload");
  }

  return (

    <>

      <div id="main">
        <div style={{ display: 'flex', alignItems: 'center' }}>

          <h1 style={{ textAlign: 'center', fontFamily: 'Algerian', fontWeight: '600', width: '-webkit-fill-available', paddingTop: 15 }}>CODE COMPILER</h1>

          <button onClick={handleLogout} type="button" class="btn btn-outline-warning" style={styles.btn_logout}>
            <img src="logout_btn.png" alt="Logout" height={25} width={25} style={{ filter: 'invert(100%)' }} />
          </button>

          {/* <div onClick={handleLogout} class="btn btn-outline-warning" style={{display:'flex', justifyContent:'center', alignItems:'center', width:'fit-content'}}>
        <img src="logout_btn.png" alt="Logout" height={25} width={25}  /> 
        <p style={{color:'black', fontWeight:'bold', margin:'0px 0px 0px 10px'}}> Logout</p>
        </div> */}

        </div>

        <div style={styles.editortopouter}>
          <div style={styles.editorTop}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: 14 }}>Select Language:</span>
              <select style={styles.languageSelector} value={Language} onChange={(e) => handleChangeLanguage(e.target.value)}>
                <option value="cpp">C++</option>
                <option value="py">Python</option>
              </select>
            </div>
            <button style={styles.runbtn} onClick={handleSubmit}>RUN</button>
          </div>
        </div>


        <div style={styles.editorandoutput}>

          <div id="myContainer" style={styles.editorarea} >
            <div class="row" style={{height:'80vh'}}>

            <div class="col-md-6" style={{ height:'inherit', padding:0}}>
           
            <div style={styles.editorwindow}>
              <AceEditor
                width="100%"
                height="100%"
                placeholder="Enter Code Here"
                mode={Emode}
                theme="monokai"
                name="code_editor"
                onLoad={handleOnload}
                onChange={(value) => setCode(value)}
                fontSize={16}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={Code}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
            </div>

            
            </div>

            <div class="col-md-6" style={{  height:'inherit', padding:0}}>

            {/* output widnow  */}
            <div style={styles.outputwindow}>
              <div style={{ height: '5%', display: 'flex', justifyContent: 'space-between' }}>
                <h5 style={{ fontWeight: 'bold' }}>Output : - </h5>
                <div style={{ width: 200, display: 'flex' }}>
                  <h5 style={{ fontWeight: 'bold' }} >Status : </h5>
                  <Codestatus Jobstatus={Jobstatus} />
                </div>
              </div>
              <hr />
              <div style={{ height: '95%', display: 'flex', flexDirection: 'column' }}>
                <textarea value={Joboutput} name="output" id="output" readOnly style={styles.outputtext}></textarea>
              </div>
            </div>
            {/* output widnow end */}

            </div>



            </div>
          </div>

        </div>

      </div>


      <style jsx>{stylesheet}</style>
    </>
  );
}

export default Compiler;


var styles = {

  btn_logout: {
    height: 40,
    width: 40,
    borderRadius: '1000%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#58584d',
  },

  status_green: {
    color: '#00cc00',
    marginLeft: 10,
  },

  status_red: {
    color: 'red',
    marginLeft: 10,
  },

  status_blue: {
    color: '#4168f8f7',
    marginLeft: 10,
  },

  outputtext: {
    "border": "none",
    "overflow": "auto",
    "outline": "none",
    "WebkitBoxShadow": "none",
    "MozBoxShadow": "none",
    "boxShadow": "none",
    height: '100%',
    width: '100%',
    paddingLeft: "20px 20px 20px 20px",
  },
  editorandoutput: {
    display: 'flex',
    height: '600px'
  },
  outputwindow: {
    border: '1px solid gray',
    height: '100%',
    minWidth: 300,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  editorwindow: {
    display: 'flex',
    height: 'inherit',
    minWidth: 300,
  },
  editorarea: {
    // padding: "0px 15px 15px 15px",
    width: '100%',
    flexWrap: 'wrap',
  },
  editorTop: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: "10px 15px 10px 15px",
    borderRadius: 36,
    background: "rgba(67, 67, 67, 0.3)",
  },
  editortopouter: {
    display: 'flex',
    margin: "15px 15px 10px 15px",
  },
  languageSelector: {
    marginLeft: 10,
    fontSize: 14,
    border: '1px solid skyblue',
    borderRadius: '25px',
    padding: "4px 20px 4px 20px",
    fontWeight: '700',
  },
  runbtn: {
    border: '1px solid skyblue',
    borderRadius: '25px',
    padding: "4px 20px 4px 20px",
    backgroundColor: 'white',
    fontSize: 14,
    fontWeight: '700',
  }
}



const stylesheet = css`
 #main{   
    width: 100%;
    justify-content: center;
    background-image: url("bback.jpg"); 
    background-repeat: no-repeat;
    background-size: 150% 150%;    
    padding-bottom:45px;    
    z-index:-2;
}

#myContainer{
  padding: 0px 30px 20px 30px;
}

`