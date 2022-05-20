import React, { Component } from 'react';
import { useState, useEffect } from 'react';

import nextConfig from '../next.config';
import css from 'styled-jsx/css';
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookie';
import Checkauth from '../Modules/checkAuth';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AceEditor from '../Components/AceEditor';

// const AceEditor = dynamic(import('react-ace'), { ssr: false });  //import without server side rendering
// import AceEditor from 'react-ace-editor';

export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);
  return { props: { data } }
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
      let response = await Axios.post(`${nextConfig.REST_API_URL}/run`, codedata,
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
    console.log("this is onload");
  }

  return (
    <>
    <div id="main">
      <h1 style={{ textAlign: 'center', fontFamily:'Algerian', fontWeight:'600' , paddingTop:15}}>CODE COMPILER</h1>

      <div style={styles.editortopouter}>

      <div style={styles.editorTop}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{fontWeight:'700', fontSize:14}}>Select Language:</span>
          <select style={styles.languageSelector} value={Language} onChange={(e) => handleChangeLanguage(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </div>
        <button style={styles.runbtn} onClick={handleSubmit}>RUN</button>
      </div>

      </div>


      <div style={styles.editorandoutput}>

        <div style={styles.editorarea}>

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

          {/* output widnow  */}

          <div style={styles.outputwindow}>
            <div style={{ height: '5%', display: 'flex' }}>
              <h5>Status : </h5>
              <h5 style={{marginLeft:10}}>{Jobstatus}</h5>              
            </div>

            <div style={{ height: '95%', display: 'flex', flexDirection: 'column' }}>
              <hr />
              <h5>Output : </h5>
              <textarea value={Joboutput} name="output" id="output" readOnly style={styles.outputtext}></textarea>
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
  outputtext: {
    "border": "none",
    "overflow": "auto",
    "outline": "none",
    "WebkitBoxShadow": "none",
    "MozBoxShadow": "none",
    "boxShadow": "none",
    height: '100%',
    width: '100%',
    paddingLeft:"20px 20px 20px 20px",
  },
  editorandoutput: {
    display: 'flex',
    height: '600px'
  },
  outputwindow: {
    border: '1px solid gray',
    width: "50%",
    height: '100%',
    minWidth: 300,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor:'white',
  },
  editorwindow: {
    display: 'flex',
    width: '50%',
    height: '100%',
    minWidth: 300,
  },
  editorarea: {
    
    display: 'flex',
    flexDirection: 'row',
    padding: "0px 15px 15px 15px",
    width: '100%',

    flexWrap: 'wrap',
  },
  editorTop: {
    display: 'flex',
    justifyContent: 'space-between',    
    width: '100%',
    padding: "10px 15px 10px 15px",
    borderRadius:36,
    background: "rgba(67, 67, 67, 0.3)",    
  },
  editortopouter:{
    display: 'flex',
    margin:"15px 15px 10px 15px",
  },
  languageSelector: {
    marginLeft: 10,
    fontSize: 14,
    border: '1px solid skyblue',
    borderRadius: '25px',
    padding: "4px 20px 4px 20px",
    fontWeight:'700',
  },
  runbtn: {
    border: '1px solid skyblue',
    borderRadius: '25px',
    padding: "4px 20px 4px 20px",
    backgroundColor:'white',
    fontSize:14,
    fontWeight:'700',
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

`