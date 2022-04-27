import nextConfig from "../next.config";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router'
import Cookies from 'js-cookie';

export default function Login() {
  
  const router = useRouter()

  const [Checkvalidmail, setCheckvalidmail] = useState(true);
  const [Checkvalidpass, setCheckvalidpass] = useState(true);

  const [Usermail, setUsermail] = useState('');
  const [Upass, setUpass] = useState('');

  const handleChangeEmail = (e) => {
    setUsermail(e);
    let mail = e;
    if (!mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setCheckvalidmail(false);
    } else if (mail.length < 10) {
      setCheckvalidmail(false);
    }
    else {
      setCheckvalidmail(true);
    }
  }

  const handleChangePass = (e) => {
    setUpass(e);
    let pass1 = e;
    if (!pass1.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/)) {
      setCheckvalidpass(false);
    } else {
      setCheckvalidpass(true);
    }
  }

  const handleLogin = async (e) => {
    await handleChangeEmail(Usermail);
    await handleChangePass(Upass);

    if (Usermail != '' && Checkvalidmail && Checkvalidpass) {
      loginwithapi(e);
    }
  }


  const loginwithapi = async (e) => {
    let jsondata = await JSON.stringify({
      "Email": Usermail.toString(),
      "Password": Upass.toString()
    })

    await Axios.post(`${nextConfig.REST_API_URL}/login`, jsondata,
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data.result);
          Cookies.set('token', response.data.token)
          alert(response.data.message);
          e.preventDefault();
          // router.push("/");
        }
      }).catch((err) => {
        console.log(err.response.data.error);
        alert(err.response.data.error);
      })
  }

  return (
    <>
      <div id="main">
        <div>
          {/* <form method="POST" className="login-form" id="container"> */}
          <div className="login-form" id="container">
            <h2 className="formtitle">Login Page</h2>

            <div className="input-fields">
              <input type="email" onChange={(e) => { handleChangeEmail(e.target.value) }} onBlur={(e) => { handleChangeEmail(e.target.value) }} className="email inputbox" placeholder="Enter Your Email id" required>
              </input>
              {!Checkvalidmail ? (<div className="invalid-field">Invalid email</div>) : null}
            </div>

            <div className="input-fields">
              <input type="password" onChange={(e) => { handleChangePass(e.target.value) }} onBlur={(e) => { handleChangePass(e.target.value) }} className="password inputbox" placeholder="Enter Your Password" required>
              </input>
              {!Checkvalidpass ? (<div className="invalid-field">Password should be contain atlead - one alphabate character, one Digit and one symbol and length minimum 8 character.</div>) : null}
            </div>
            <div className="hlink">
              <Link href="/Signup">
                <a>Create an account?</a>
              </Link>
              <Link href="/ForgotPassword">
                <a href="#">Forgot Passowrd?</a>
              </Link>
            </div>
            {/* <input type="submit" className={`btn btn-primary login-btn`} name="submit" value="Login" /> */}

            <button onClick={(e) => { handleLogin(e) }} className={`btn btn-primary login-btn`}>Login</button>
          </div>
          {/* </form> */}
        </div>
      </div>




      <style jsx>{`
      

#main{
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    background-image: url("background.jpg"); 
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

#container{
    display: flex;
    align-items: center;
    flex-direction: column;
    /* width: 400px; */
    width: 25rem;
    margin-top: 6rem;
    border: 1px solid gray;
    background-color: white;
    border-radius: 10px;
    padding-top: 2rem;
    padding-bottom: 1rem;
}

@media screen and (max-width: 450px) {
    #container{
        width: 20rem;
    }
  }

.inputbox{
    margin-top:2rem;
    height: 30px;
    width: 90%;
    /* font-size: 14px; */
    font-size: .9rem;
    outline: 0;
    border-width: 0 0 2px;
    border-color: rgb(235,235,235)
}


.input-fields{
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.inputbox:focus{
    border-color: blue;
}

.login-btn{
    width: 90%;
    margin-top: 30px;

    margin-bottom: 20px;
    border-radius: 12px;
}

.invalid-field{
    width: 90%;
    color:  red;
    font-size: 13px;
}

.hlink{
    display: flex;
    width: 90%;
    margin-top: 3rem;
    justify-content: space-between;
    font-size: .9rem;
}

.hlink a{
    text-decoration: none;
}

.formtitle{
    margin-bottom: 2rem;
}


    `}
      </style>

    </>
  )
}


// let mystyles = {
//   container: {
//     backgroundColor: 'red',
//     width: 50,
//     height: 50,
//   },

// }
