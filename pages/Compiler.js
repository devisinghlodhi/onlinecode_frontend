import React, { Component } from 'react';
import { useState , useEffect} from 'react';

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

  const handleSubmit = async () => {
    console.log(Language)
    let codedata = await JSON.stringify({
      language: Language,
      code: Code
    })

    try {
      //###########  For Send the code to server -------------------------------------------------------------
      let response = await Axios.post(`${nextConfig.REST_API_URL}/run`, codedata,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      console.log("Your Response is : ", response.data);

      //###########  For Get the Output -------------------------------------------------------------
      let intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(`${nextConfig.REST_API_URL}/status`, { params: { id: response.data.jobId } })
        const { success, job, error } = dataRes;

        console.log(dataRes)

        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
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


  const handleChangeLanguage =(langName)=>{
    setLanguage(langName); // Change language for send the type of language for server    
    if(langName == 'cpp'){  // Change editor template mode
      setEmode('c_cpp')
    }else if(langName == 'py'){
      setEmode('python')
    }else if(langName == 'java'){
      setEmode('java')
    }else if(langName == 'js'){
      setEmode('javascript')
    }else{
      setEmode('text')
    }    
  }

  const handleOnload=()=>{
    console.log("this is onload");
  }

  return (
    <div>
      <h1>Compiler page</h1>

      <div>
        <select value={Language} onChange={(e) => handleChangeLanguage(e.target.value)}>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      
      <AceEditor
          placeholder="Enter Code Here"          
          mode={Emode}
          theme="monokai"          
          name="code_editor"
          onLoad={handleOnload}
          onChange={(value) => setCode(value) }
          fontSize={14}
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

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Compiler;

