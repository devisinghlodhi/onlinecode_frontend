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
      const allcookie = cookie.parse(cookiedata);
        
      // const jwt = allcookie.token;
      const jwt = cookiedata;

      let codedata = JSON.stringify({        
        token: jwt
      })


      console.log(jwt)
  
      try {
        // const res = await Axios.post(`${nextConfig.REST_API_URL}/alreadylogincheck`, {  "token": jwt  },
        const res = await Axios.post(`${nextConfig.REST_API_URL}/alreadylogincheck`, codedata,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          })
  
        data = await res.data;
  
      } catch (error) {
        console.log("api error:",error)
        data = { login: "failed", error: "Login Expired" };
      }
  
    } else {
      data = { login: "failed", error: "Login Expired" };
    }

    return data;
  
}

export default Checkauth;
