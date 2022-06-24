import nextConfig from "../next.config";
import { useState } from 'react';
import css from 'styled-jsx/css';
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router'
import Swal from 'sweetalert2';
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

    return { props: { data } }
}

const Signup = () => {

    const router = useRouter()

    const [Checkname, setCheckname] = useState(true);
    const [Checknumber, setChecknumber] = useState(true);
    const [Checkvalidmail, setCheckvalidmail] = useState(true);
    const [Checkvalidpass, setCheckvalidpass] = useState(true);
    const [Checkconfirmpass, setCheckconfirmpass] = useState(true);

    const [Username, setUsername] = useState('');
    const [Pnumber, setPnumber] = useState('');
    const [Usermail, setUsermail] = useState('');
    const [Upass, setUpass] = useState('');
    const [Confirmpass, setConfirmpass] = useState('');

    const [loadingStatus, setLoadingStatus] = useState(false);
    const Loading = (value) => {
        setLoadingStatus(value)
    }


    const handleChangeName = (e) => {
        setUsername(e);
        let name = e;
        if (!name.match(/^[a-zA-Z \-]+$/)) {
            setCheckname(false);
        } else if (name.length < 3 || name.length > 20) {
            setCheckname(false);
        }
        else {
            setCheckname(true);
        }
    }

    const handleChangePnumber = (e) => {
        setPnumber(e);
        let num = e;
        if (!num.match(/^([0|\+[0-9]{1,5})?([5-9][0-9]{9})$/)) {
            setChecknumber(false);
        } else if (!(num.length == 10)) {
            setChecknumber(false);
        }
        else {
            setChecknumber(true);
        }
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
        if ((pass1 == pass2)) {
            setCheckconfirmpass(true);
        } else {
            setCheckconfirmpass(false);
        }
    }


    const handleSubmit = async (e) => {
        await handleChangeName(Username);
        await handleChangePnumber(Pnumber);
        await handleChangeEmail(Usermail);
        await handleChangePass(Upass);
        await handleChangeconfirmpass(Confirmpass);

        if (Username != "" && Checkname && Checknumber && Checkvalidmail && Checkvalidpass && Checkconfirmpass) {
            senddatatoapi(e);
        }
    }

    const senddatatoapi = async (e) => {
        Loading(true);

        let jsondata = await JSON.stringify({
            "userName": Username.toString(),
            "MobileNo": Pnumber.toString(),
            "Email": Usermail.toString(),
            "Password": Upass.toString()
        })

        await Axios.post(`${nextConfig.REST_API_URL}/createaccount`, jsondata,
            {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                }
            })

            .then((response) => {
                if (response.status == 200) {
                    let result = response;
                    console.log(result.data.result);
                    // alert(result.data.message);
                    e.preventDefault();

                    Swal.fire({
                        confirmButtonColor: '#0D6EFD',
                        icon: 'success',
                        title: 'SUCCESS',
                        text: 'User successfully sign up',
                    }).then(() => {
                        router.push("/Login");
                    })

                } else {
                    console.log("http error : ", response.data)
                    Loading(false);
                    Swal.fire({
                        confirmButtonColor: '#0D6EFD',
                        icon: 'error',
                        title: 'Oops...',
                        text: response.data,
                    })
                }


            }).catch((err) => {
                console.log(err.response.data.error);
                //   alert(err.response.data.error);

                Loading(false);
                Swal.fire({
                    confirmButtonColor: '#0D6EFD',
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.error,
                })
            });

    }


    return (

        <>
            <div id="main">
                <div>

                    {/* <form method="POST" className="reg-form" id="container"> */}
                    <div className="reg-form" id="container">

                        <h2>Create Account</h2>

                        <div className="input-fields">
                            <input type="text" onChange={(e)=>setUsername(e.target.value)}  onBlur={(e) => { handleChangeName(e.target.value) }} className="name inputbox" placeholder="Enter your name" required />
                            {!Checkname ? (<div className="invalid-field">Invalid value</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="number" onChange={(e)=>setPnumber(e.target.value)}  onBlur={(e) => { handleChangePnumber(e.target.value) }} className="pnumber inputbox"
                                placeholder="Enter you phone number" required />
                            {!Checknumber ? (<div className="invalid-field">Invalid value</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="email" onChange={(e)=>setUsermail(e.target.value)}  onBlur={(e) => { handleChangeEmail(e.target.value) }} className="email inputbox" placeholder="Enter your email id"
                                required />

                            {!Checkvalidmail ? (<div className="invalid-field">Invalid value</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="password" onChange={(e)=>setUpass(e.target.value)} onBlur={(e) => handleChangePass(e.target.value)} className="password inputbox" placeholder="Create new password" required />
                            <div className="invalid-field"></div>
                            {!Checkvalidpass ? (<div className="invalid-field">Password should be contain atleast - one alphabate character, one Digit and one symbol and length minimum 8 character.</div>) : null}
                        </div>

                        <div className="input-fields">
                            <input type="password" onChange={(e)=>setConfirmpass(e.target.value)} onBlur={(e) => handleChangeconfirmpass(e.target.value)} className="c-password inputbox" placeholder="Confirm password"
                                required />
                            {!Checkconfirmpass ? (<div className="invalid-field">Password Does not match, Please Try again..!!</div>) : null}

                        </div>

                        {/* <input onClick={handleSubmit} type="submit" className="btn btn-primary reg-btn" name="submit" value="Sign up" /> */}

                        <div onClick={(e) => { handleSubmit(e) }} className={`btn btn-primary reg-btn`}
                            style={{
                                pointerEvents: `${loadingStatus ? 'none' : 'auto'}`,
                                opacity: `${loadingStatus ? '0.6' : '1'}`
                            }}
                        >
                            <p style={{ margin: 0, display: `${loadingStatus ? 'none' : 'flex'}` }}  >Sign up</p>

                            <ThreeBounce style={{ display: `${loadingStatus ? 'flex' : 'none'}` }} size={15} color='white' />

                            {/* <div class="spinner-border text-light" style={{ display: `${loadingStatus ? 'flex' : 'none'}`, height: '1.5rem', width: '1.5rem', position: 'absolute' }} role="status"></div> */}

                        </div>

                        <div className="hlink">
                            <Link href="/Login">
                                <a>Existing user? Login</a>
                            </Link>
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

.hlink{
    display: flex;
    width: 90%;
    justify-content: space-between;
    font-size: .9rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.hlink a{
    text-decoration: none;
    text-align:center;
}

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

export default Signup;
