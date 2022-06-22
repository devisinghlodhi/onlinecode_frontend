import { useState } from 'react';
import css from 'styled-jsx/css';
import { useRouter } from "next/router";
import nextConfig from '../../next.config';
import Axios from "axios";
import Swal from 'sweetalert2';
import Checkauth from '../../Modules/checkAuth';
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
    return { props: { data } }
}


const EmailToken = () => {

    const [Checkvalidpass, setCheckvalidpass] = useState(true);
    const [Checkconfirmpass, setCheckconfirmpass] = useState(true);

    const [Upass, setUpass] = useState('');
    const [Confirmpass, setConfirmpass] = useState('');

    const [loadingStatus, setLoadingStatus] = useState(false);

    const Router = useRouter();
    const etoken = Router.query.emailToken;

    const Loading = (value) => {
        setLoadingStatus(value)
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

    const handleChangeconfirmpass = (e) => {
        setConfirmpass(e);
        let pass1 = Upass;
        let pass2 = e;
        if ((pass1 == pass2) && pass2 != '') {
            setCheckconfirmpass(true);
        } else {
            setCheckconfirmpass(false);
        }
    }



    const updatepasswordapi = async (e) => {

        Loading(true);

        let jsondata = await JSON.stringify({
            "token": etoken,
            "password": Upass.toString()
        })

        await Axios.post(`${nextConfig.REST_API_URL}/forgotchangepassword`, jsondata,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            .then((response) => {
                if (response.status == 200) {
                    let result = response;
                    console.log(result.data);
                    e.preventDefault();

                    
                    Swal.fire({
                        confirmButtonColor: '#0D6EFD',
                        icon: 'success',
                        title: 'SUCCESS',
                        text: 'Password successfully changed',
                    }).then(() => {
                        Router.push("/Login");
                    })

                } else {
                    Loading(false);
                    Swal.fire({
                        confirmButtonColor: '#0D6EFD',
                        icon: 'error',
                        title: 'Oops...',
                        text: response.data.message,
                    })
                }


            }).catch((err) => {
                console.log(err.response.data);

                Loading(false);
                Swal.fire({
                    confirmButtonColor: '#0D6EFD',
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong..!!',
                })
            });

    }


    const handleSubmit = async (e) => {
        await handleChangePass(Upass);
        await handleChangeconfirmpass(Confirmpass);

        if (Checkvalidpass && Checkconfirmpass) {
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
                            <input type="password" value={Upass} onChange={(e) => { handleChangePass(e.target.value) }} onBlur={(e) => handleChangePass(e.target.value)} className="password inputbox" placeholder=" Create new password" required />
                            <div className="invalid-field"></div>
                            {!Checkvalidpass ? (<div className="invalid-field">Password should be contain atlead - one alphabate character, one Digit and one symbol and length minimum 8 character.</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="password" value={Confirmpass} onChange={(e) => { handleChangeconfirmpass(e.target.value) }} onBlur={(e) => handleChangeconfirmpass(e.target.value)} className="c-password inputbox" placeholder="Confirm password"
                                required />
                            {!Checkconfirmpass ? (<div className="invalid-field">Password Does not match, Please Try again..!!</div>) : null}

                        </div>
                        
                        <div onClick={(e) => { handleSubmit(e) }} className={`btn btn-primary submit-btn`}
                            style={{
                                pointerEvents: `${loadingStatus ? 'none' : 'auto'}`,
                                opacity: `${loadingStatus ? '0.6' : '1'}`
                            }}
                        >
                            <p style={{ margin: 0, display: `${loadingStatus ? 'none' : 'flex'}` }}  >Submit</p>
                            <ThreeBounce style={{ display: `${loadingStatus ? 'flex' : 'none'}`  }} size={15} color='white' />

                        </div>

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

.submit-btn{
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
    color: red;
    font-size: 13px;
}
`






export default EmailToken;
