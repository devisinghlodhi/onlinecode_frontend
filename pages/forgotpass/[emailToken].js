import { useState } from 'react';
import css from 'styled-jsx/css';
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import nextConfig from '../../next.config';
import Axios from "axios";
import Swal from 'sweetalert2';

async function checkEmailtokenValid() {
    const Router = useRouter();
    const token = Router.query.emailToken;

    let data;

    try {
        let jsondata = await JSON.stringify({ token: token })
        let response = await Axios.post(`${nextConfig.REST_API_URL}/verifyemailtoken`, jsondata,
            { headers: { 'Content-Type': 'application/json' } })

        console.log(response.data)
        if (response.data.status == 'success') {
            data = 'success';
        } else {
            data = 'fail';
        }

    } catch (error) {
        console.log(error);
        data = 'fail';
    }

    return data;
}



const EmailToken = (data) => {
   
    const [Checkvalidpass, setCheckvalidpass] = useState(true);
    const [Checkconfirmpass, setCheckconfirmpass] = useState(true);

    const [Upass, setUpass] = useState('');
    const [Confirmpass, setConfirmpass] = useState('');

    const Router = useRouter();
    const etoken = Router.query.emailToken;


    const handleChangePass = (e)=>{
        setUpass(e);
        let pass1 = e;
        if (!pass1.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/)) {
            setCheckvalidpass(false);
        } else {
            setCheckvalidpass(true);
        }
    }

    const handleChangeconfirmpass=(e)=>{
        setConfirmpass(e);
        let pass1 = Upass;
        let pass2 = e;
        if((pass1==pass2) && pass2!=''){
            setCheckconfirmpass(true);
        }else{
            setCheckconfirmpass(false);
        }
    }



    const updatepasswordapi= async(e)=>{

        let jsondata = await JSON.stringify({                
                "token":etoken,                
                "password":Upass.toString()
        })

       await Axios.post(`${nextConfig.REST_API_URL}/forgotchangepassword`, jsondata , 
        {headers: {
            'Content-Type': 'application/json'
          }})
          
          .then((response)=>{
            if (response.status==200) {
                let result = response;
                console.log(result.data);
                e.preventDefault();


                Swal.fire({
                    icon: 'success',
                    title: 'SUCCESS',
                    text: 'Password successfully changed',              
                  }).then(()=>{
                      Router.push("/Login");
                  })

               } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message,              
                  })
            }


          }).catch((err)=>{
              console.log(err.response.data);            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong..!!',              
              })
          });
         
    }


    const handleSubmit= async(e)=>{
        await handleChangePass(Upass);
        await handleChangeconfirmpass(Confirmpass);

        if(Checkvalidpass && Checkconfirmpass){
            updatepasswordapi(e);
        }
    }




    return (
        <>
             <div id="main">
                <div>

                    {/* <form method="POST" className="reg-form" id="container"> */}
                    <div className="reg-form" id="container">
                        
                        <h2>Create new Password</h2>

                        <div className="input-fields">
                            <input type="password" value={Upass} onChange={(e)=>{handleChangePass(e.target.value)}} onBlur={(e)=>handleChangePass(e.target.value)} className="password inputbox" placeholder=" Create new password" required />
                            <div className="invalid-field"></div>
                            {!Checkvalidpass ? (<div className="invalid-field">Password should be contain atlead - one alphabate character, one Digit and one symbol and length minimum 8 character.</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="password" value={Confirmpass} onChange={(e)=>{handleChangeconfirmpass(e.target.value)}} onBlur={(e)=>handleChangeconfirmpass(e.target.value)} className="c-password inputbox" placeholder="Confirm password"
                                required />
                            {!Checkconfirmpass ? (<div className="invalid-field">Password Does not match, Please Try again..!!</div>) : null}

                        </div>

                        <button onClick={(e)=>{handleSubmit(e)}} className="btn btn-primary reg-btn">Submit</button>
                    
                        </div>

                    {/* </form> */}

                </div>
            </div>

            <style jsx>{stylesheet}</style>
        </>
    );
}


const stylesheet = css`
 #main{
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    background-image: url("../background.jpg"); 
    background-repeat: no-repeat;
    background-size: 100% 100%;    
}

#container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 25rem;
    margin-top: 4rem;
    border: 1px solid gray;
    background-color: white;
    border-radius: 10px;
    padding-top: 20px;
}

@media screen and (max-width: 450px) {
    #container{
        width: 20rem;
    }   
  }

.inputbox{
    margin-top:20px;
    height: 30px;
    width: 90%;
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

.reg-btn{
    width: 90%;
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 12px;
}

.invalid-field{
    width: 90%;
    color: red;
    font-size: 13px;
}
`






export default EmailToken;
