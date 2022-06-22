import nextConfig from "../next.config";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router'
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import absoluteUrl from 'next-absolute-url'
import Checkauth from '../Modules/checkAuth';
import { ThreeBounce } from 'better-react-spinkit';


export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);

  if (data.login == 'success') {
    return {
      redirect: {
        destination: `/Compiler`,
        permanent: false
      }
    }
  }

  const { req, query, res, asPath, pathname } = context;
  if (req) {
    const { origin } = absoluteUrl(req)
    return { props: { currOrigin: origin } }
  } 
  else {
    return { props: { currOrigin: 'http://localhost:3050' } }
  }

}




export default function Forgotpassword({ currOrigin }) {

  const router = useRouter()

  const [Checkvalidmail, setCheckvalidmail] = useState(true);
  const [Usermail, setUsermail] = useState('');

  const [loadingStatus, setLoadingStatus] = useState(false);
  const Loading = (value) => {
    setLoadingStatus(value)
  }

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


  const handleForgot = async (e) => {
    await handleChangeEmail(Usermail);
    if (Usermail != '' && Checkvalidmail) {
      sendforgotlinkwithapi(e);
    }
  }

  const sendforgotlinkwithapi = async (e) => {
    Loading(true);
    let jsondata = await JSON.stringify({
      "hosturl": `${currOrigin}/forgotpass`,
      "email": Usermail.toString(),
    })

    await Axios.post(`${nextConfig.REST_API_URL}/forgot`, jsondata,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status == 200) {
          
          console.log(response.data);
          e.preventDefault();

          if (response.data.status == 'success') {
            Loading(false);
            Swal.fire({
              confirmButtonColor: '#0D6EFD',
              icon: 'success',
              title: 'Link sent on Email',
              text: 'Forgot password link successfully sent on email, please check your email !!',
            }).then(() => {
              // router.push("/");
            })

          } else {
            Loading(false);
            Swal.fire({
              confirmButtonColor: '#0D6EFD',
              icon: 'error',
              title: 'Oops...',
              text: "Something went wrong..!!",
            })
          }


        }
      }).catch((err) => {
        console.log(err.response.data.message);
        Loading(false);
        Swal.fire({
          confirmButtonColor: '#0D6EFD',
          icon: 'error',
          title: 'Oops...',
          text: err.response.data.message,
        })

      })
  }

  return (
    <>
      <div id="main">
        <div>
          {/* <form method="POST" className="login-form" id="container"> */}
          <div className="login-form" id="container">
            <h2 className="formtitle">Forgot Password</h2>

            <div className="input-fields">
              <input type="email" onChange={(e) => { handleChangeEmail(e.target.value) }} onBlur={(e) => { handleChangeEmail(e.target.value) }} className="email inputbox" placeholder="Enter Your Email id" required>
              </input>
              {!Checkvalidmail ? (<div className="invalid-field">Invalid email</div>) : null}
            </div>
            <div className="hlink">
              <Link href="/Signup">
                <a>Create an account?</a>
              </Link>
              <Link href="/Login">
                <a href="#">Login</a>
              </Link>
            </div>
            
            <div onClick={(e) => { handleForgot(e) }} className={`btn btn-primary send-email-btn`}
              style={{
                pointerEvents: `${loadingStatus ? 'none' : 'auto'}`,
                opacity: `${loadingStatus ? '0.6' : '1'}`
              }}
            >
              <p style={{ margin: 0, display: `${loadingStatus ? 'none' : 'flex'}` }}  >Send Link on Email</p>
              <ThreeBounce style={{ display: `${loadingStatus ? 'flex' : 'none'}`  }} size={15} color='white' />

            </div>




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

.send-email-btn{
  position:relative;
    width: 90%;
    height: 2.4rem;
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
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

