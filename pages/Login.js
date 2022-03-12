import { useState } from "react";
import styles from "../styles/Login.module.css";



export default function Login() {

  const [Validmail, setValidmail] = useState(true);
  const [Validpass, setValidpass] = useState(true);

  const validemail = (e) => {
    let mail = e;
    if (!mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setValidmail(false);
    } else if (mail.length < 10) {
      setValidmail(false);
    }
    else {
      setValidmail(true);
    }
  }


  function validpassword(e) {
    let pass1 = e;
    if (!pass1.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/)) {
      setValidpass(false);
    } else {
      setValidpass(true);
    }
  }

  return (
    <>
      <div id="main">

        <div>
          <form method="POST" className="login-form" id="container">
            <h2 className="formtitle">Login Page</h2>

            <div className="input-fields">
              <input type="email" onBlur={(e) => { validemail(e.target.value) }} className="email inputbox" placeholder="Enter Your Email id" required>
              </input>
              {!Validmail ? (<div className="invalid-field">Invalid value</div>) : null}
            </div>

            <div className="input-fields">
              <input type="password" onBlur={(e) => { validpassword(e.target.value) }} className="password inputbox" placeholder="Enter Your Password" required>
              </input>
              {!Validpass ? (<div className="invalid-field">Password should be contain atlead - one Upper character, one Lower character, one Digit and one symbol</div>) : null}
            </div>
            <div className="hlink">
              <a href="#">Create an account?</a>
              <a href="#">Forgot Passowrd?</a>
            </div>
            <input type="submit" className={`btn btn-primary login-btn`} name="submit" value="Login" />
          </form>
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

