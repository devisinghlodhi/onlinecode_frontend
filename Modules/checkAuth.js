import nextConfig from '../next.config';
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookie';


const Checkauth = async (contextcookie) => {
  // const cookiedata = context.req.headers.cookie;
  const cookiedata = contextcookie;
  let data;


  if (cookiedata) {

    const { token } = cookie.parse(cookiedata);

    let jwt = token;

    let codedata = JSON.stringify({
      token: jwt
    })

    console.log(token)

    // try {        
    //   const response = await Axios.post(`${nextConfig.REST_API_URL}/alreadylogincheck`, codedata,
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     })

    //   let response_data = response.data;

    //       if(response_data.status == 'success'){
    //           data = { login: "success", error: "Login Success" }
    //       }else{
    //           data = { login: "failed", error: "Login Expired" };    
    //       }

    // } catch (error) {
    //   console.log("api error:",error)
    //   data = { login: "failed", error: "Login Expired" };
    // }


    try {
      const response = await fetch(`${nextConfig.REST_API_URL}/alreadylogincheck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: codedata
      });

      let response_data = await response.json();

      if (response_data.status == 'success') {
        data = { login: "success", error: "Login Success" }
      } else {
        data = { login: "failed", error: "Login Expired" };
      }

    } catch (error) {
      // console.log("api error:", error)
      data = { login: "failed", error: error };
    }

  } else {
    data = { login: "failed", error: "Token Not Available" };
  }

  return data;

}

export default Checkauth;
