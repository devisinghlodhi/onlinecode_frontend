import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import nextConfig from '../next.config';
import css from 'styled-jsx/css';
import Link from "next/link";
import Router, { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import cookie from 'cookie';
import Checkauth from '../Modules/checkAuth';
import Codeexample from '../Modules/Codeexample';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AceEditor from '../Components/AceEditor';
import { ThreeBounce } from 'better-react-spinkit';

// const AceEditor = dynamic(import('react-ace'), { ssr: false });  //import without server side rendering
// import AceEditor from 'react-ace-editor';

export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);

  console.log("data is : ", data)

  if (data.login != 'success') {
    return {
      redirect: {
        destination: `/Login`,
        permanent: false
      }
    }
  }

  return { props: { data } }
}


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
  const [preLang, setPreLang] = useState('cpp');

  const [Jobstatus, setJobstatus] = useState("");
  const [Joboutput, setJoboutput] = useState("");

  const [loadingStatus, setLoadingStatus] = useState(false);


  const Loading = (value) => {
    setLoadingStatus(value)
  }


  // console.log(data);


  const handleSubmit = async () => {
    Loading(true);

    console.log(Language)
    let codedata = await JSON.stringify({
      language: Language,
      code: Code
    })

    try {
      //###########  For Send the code to server -------------------------------------------------------------
      let response = await axios.post(`${nextConfig.REST_API_URL}/run`, codedata,
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

          if (jobStatus === "pending"){
            return;
          }else{
            Loading(false);
            clearInterval(intervalId)
          }
        } else {
          Loading(false);
          console.error(error);
          clearInterval(intervalId)
        }

      }, 1000);

    } catch (error) {
      Loading(false);
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
          confirmButtonColor: '#0D6EFD',
          icon: 'success',
          title: 'SUCCESS',
          text: 'Logout Successfully',
        }).then(() => {
          Router.push('/Login')
        })
      } else {
        Swal.fire({
          confirmButtonColor: '#0D6EFD',
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong..!!',
        })
      }

    } catch (error) {
      console.log(error);
      Swal.fire({
        confirmButtonColor: '#0D6EFD',
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


  const handleChangeLanguage = async (langName) => {

    let oldcodedata = await localStorage.getItem("Codeexample");
    oldcodedata = await JSON.parse(oldcodedata);
    oldcodedata[`${preLang}`] = Code;
    localStorage.setItem("Codeexample" , JSON.stringify(oldcodedata));
    
    setLanguage(langName); // Change language for send the type of language for server    
    setPreLang(langName);

    let codedata = await localStorage.getItem("Codeexample");
    codedata = await JSON.parse(codedata);

    if (langName == 'cpp') {  // Change editor template mode and set default code from local storage
      setEmode('c_cpp')
      setCode(codedata.cpp);
    } 
    else if (langName == 'py') {
      setEmode('python')
      setCode(codedata.py);
    } 
    else if (langName == 'java') {
      setEmode('java')
      setCode(codedata.java);
    } 
    else if (langName == 'js') {
      setEmode('javascript')
      setCode(codedata.js);
    } 
    else if (langName == 'go') {
      setEmode('golang')
      setCode(codedata.go);
    } 
    else if (langName == 'cs') {
      setEmode('csharp')
      setCode(codedata.cs);
    } 
    else if (langName == 'r') {
      setEmode('r')
      setCode(codedata.r);
    }
    else if (langName == 'rb') {
      setEmode('ruby')
      setCode(codedata.rb);
    }
    else if (langName == 'kt') {
      setEmode('kotlin')
      setCode(codedata.kt);
    }
    else if (langName == 'php') {
      setEmode('php')
      setCode(codedata.php);
    }
    else if (langName == 'swift') {
      setEmode('swift')
      setCode(codedata.swift);
    }

    else {
      setEmode('text')
    }
  }

  const handleOnload = async() => {
    console.log("this is onload");
    setCode(Codeexample.cpp);
    localStorage.setItem("Codeexample" , JSON.stringify(Codeexample));
  }

  return (

    <>
      <div id='divbackground'>


        <div id="main">
          <div style={{ display: 'flex', alignItems: 'center' }}>

            <h1 style={{ textAlign: 'center', fontFamily: 'Algerian', fontWeight: '600', width: '-webkit-fill-available', paddingTop: 15 }}>CODE COMPILER</h1>

            <button onClick={handleLogout} type="button" className="btn btn-outline-warning" style={styles.btn_logout}>
              <Image src="/logout_btn.png" alt="Logout" height={25} width={25} style={{ filter: 'invert(100%)' }} />
            </button>

            {/* <div onClick={handleLogout} className="btn btn-outline-warning" style={{display:'flex', justifyContent:'center', alignItems:'center', width:'fit-content'}}>
        <Image src="logout_btn.png" alt="Logout" height={25} width={25}  /> 
        <p style={{color:'black', fontWeight:'bold', margin:'0px 0px 0px 10px'}}> Logout</p>
        </div> */}

          </div>

          <div style={styles.editortopouter}>
            <div style={styles.editorTop}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: 14 }}>Select Language:</span>
                <select className='selectBtn' style={styles.languageSelector} value={Language} onChange={(e) => handleChangeLanguage(e.target.value)}>
                  <option value="cpp">C/C++</option>
                  <option value="py">Python</option>
                  <option value="java">Java</option>
                  <option value="js">JavaScript</option>
                  <option value="go">Go</option>
                  <option value="cs">C#</option>
                  <option value="r">R</option>
                  <option value="rb">Ruby</option>
                  {/* <option value="kt">Kotlin</option> */}                  
                  <option value="php">Php</option>
                  {/* <option value="swift">Swift</option> */}
                                    
                  </select>
                  </div>
              {/* <button className="btn btn-light coderunbtn" style={styles.runbtn} onClick={handleSubmit}>RUN</button> */}

              <div style={{ display: 'flex', alignItems: 'center' }}>
              <div onClick={(e) => { handleSubmit(e) }} className={`btn btn-light coderunbtn`}
                style={{
                  pointerEvents: `${loadingStatus ? 'none' : 'auto'}`,
                  // opacity: `${loadingStatus ? '0.6' : '1'}`,
                  // backgroundColor: `${loadingStatus ? '#d2dcd3' : 'white'}`,

                  border: '1px solid skyblue',
                  borderRadius: '25px',
                  padding: "4px 20px 4px 20px",
                  fontSize: 14,
                  fontWeight: '700',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',

                }}
              >

                {/* <p style={{ margin: 0, display: `${loadingStatus ? 'none' : 'flex'}` }}  >RUN</p> */}
                <p style={{ margin: 0, display: `${loadingStatus ? 'none' : 'flex'}` }}  >RUN</p>
                <ThreeBounce style={{ display: `${loadingStatus ? 'flex' : 'none'}` }} size={10} color='darkblue' />
              </div>
              </div>



            </div>
          </div>


          <div style={styles.editorandoutput}>

            <div id="myContainer" style={styles.editorarea} >
              <div className="row" style={{ height: '80vh' }}>

                <div className="col-md-6" style={{ height: 'inherit', padding: 0 }}>

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
                        useWorker: false,
                      }} />
                  </div>


                </div>

                <div className="col-md-6" style={{ height: 'inherit', padding: 0 }}>

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
    resize: 'none',
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
    margin: "15px 6px 10px 6px",
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
    // backgroundColor: 'white',
    fontSize: 14,
    fontWeight: '700',

    // position:'relative',
    // width: '90%',
    // marginTop: '30px',
    // marginBottom: '20px',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  }

}



const stylesheet = css`

.coderunbtn:hover {
  background-color: #3e8e41;
  color:white;
  transition: background-color 0.5s ease;
}

.selectBtn:hover{
  background-color: #d2dcd3;
  transition: background-color 0.5s ease;
}

.coderunbtn{
  min-height: 1.9rem;
}


 #main{   
    width: 100%;
    justify-content: center;
    ${'' /* background-image: url("bback.jpg"); 
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: 150% 150%;     */}
    padding-bottom:45px;    
    z-index:-2;
}

#divbackground{
  ${'' /* background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 500% 500%;
    animation: gradient 15s ease infinite;   */}

    background-image: url("bback.jpg"); 
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: 150% 150%;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}


@media only screen and (max-width: 767px) {
  #main{
    height:90rem;
  }
}

#myContainer{
  padding: 0px 30px 20px 30px;
  padding: 0px 15px 20px 15px;
}

`