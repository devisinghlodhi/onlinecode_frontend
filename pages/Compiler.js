import nextConfig from '../next.config';
import { useState } from 'react';
import css from 'styled-jsx/css';
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookie';
import Checkauth from '../Modules/checkAuth';
import axios from 'axios';

export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);
  return { props: { data } }
}


function Compiler({ data }) {
    const [Code, setCode] = useState("");
    const [Language, setLanguage] = useState("cpp");
    
    
    const handleSubmit = async ()=>{

        console.log(Language)
        
        let codedata = await JSON.stringify({
            language: Language,
            code : Code
          })

          try {
            let response = await Axios.post(`${nextConfig.REST_API_URL}/run`, codedata,
            {
                headers: {
                  // Overwrite Axios's automatically set Content-Type
                  'Content-Type': 'application/json',
                },
              })
              console.log("Your Response is : ", response.data);

              
              

              //###########  For Get the Output 
              let intervalId =  setInterval(async() => {
                const {data:dataRes} = await axios.get(`${nextConfig.REST_API_URL}/status`, {params:{id:response.data.jobId}})
                const {success, job, error} = dataRes;

                console.log(dataRes)

              if(success){
                const {status : jobStatus, output: jobOutput} = job;
                if(jobStatus==="pending") return;                
                clearInterval(intervalId)
              }else{
                console.error(error);
                clearInterval(intervalId)
              }

              }, 1000);




          } catch (error) {
              console.log(error.response)
          } 
    }
    

    return (
        <div>
            <h1>Compiler page</h1>
            <div>
            <select value={Language} onChange={(e)=>setLanguage(e.target.value)}>
                <option value="cpp">C++</option>
                <option value="py">Python</option>
            </select>
            </div>

            <textarea value={Code} onChange={(e)=>setCode(e.target.value)} name="codearea"  cols="80" rows="15"></textarea>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default Compiler;