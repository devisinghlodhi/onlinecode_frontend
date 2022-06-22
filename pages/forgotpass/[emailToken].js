import { useState } from 'react';
import css from 'styled-jsx/css';
import { useRouter } from "next/router";
import nextConfig from '../../next.config';
import Axios from "axios";
import Swal from 'sweetalert2';
import Checkauth from '../../Modules/checkAuth';
import { ThreeBounce } from 'better-react-spinkit';
import absoluteUrl from 'next-absolute-url';
import Link from "next/link";

export async function getServerSideProps(context) {
    let data;
    const logindata = await Checkauth(context.req.headers.cookie);
    if (logindata.login == 'success') {
        return {
            redirect: {
                destination: `/Compiler`,
                permanent: false
            }
        }
    }
    
    else{
        const { req, query, res, asPath, pathname } = context;
        const { origin } = absoluteUrl(req)
        let token = query.emailToken;      

    try {
        let jsondata = await JSON.stringify({ token: token })
        const response = await fetch(`${nextConfig.REST_API_URL}/verifyemailtoken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsondata
        });

        data = await response.json();

    } catch (error) {
        console.log("api error:", error)
        data = { status: "failed", error: "Something went wrong" };
    }

    }

    return { props: { data } }
}


const EmailToken = ({data}) => {

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
                    }).then(() => {
                        Router.reload(window.location.pathname)
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
                }).then(() => {
                    Router.reload(window.location.pathname)
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

    if(data.status == 'success'){

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
    else{
        return (
            <>
                <div>
                
                <div className="expired">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 464 390.4" style={{ enableBackground: 'new 0 0 464 390.4' }} xmlSpace="preserve">
                        <circle className="st0" cx={126} cy="175.4" r={12} />
                        <circle className="st0" cx={339} cy="175.4" r={12} />
                        <circle className="st1" cx="232.5" cy="170.9" r="106.5" />
                        <path className="st2" d="M126,164.4c0,0,4.5-15.4,10.5-19.6c0,0,31,0,65-26.5c0,0,110,85.9,176-30.8c0,0-33,28.6-116-41.4
    c0,0-131-16.2-135.5,106V164.4z" />
                        <path className="st2" d="M339,164.4c0,0,6.2-13.3-8.2-32.4l-6.3,3.9C324.5,135.9,333.5,142.9,339,164.4z" />
                        <path className="st2" d="M247.8,45.3c0,0,47.7-5.3,76.7,53.7L247.8,45.3z" />
                        <circle className="st2" cx={192} cy="175.4" r={9} />
                        <circle className="st2" cx={271} cy="175.4" r={9} />
                        <path className="st4" d="M101.4,390.1c22.1-106.8,75.7-114.1,137.1-114.1c61.4,0,104,18.8,130.1,114.1
    C368.7,390.6,101.3,390.6,101.4,390.1z" />
                        <circle id="path" className="st3 uhoh" cx="234.5" cy="230.5" r={20} style={{ display: 'inline' }} />
                        <path className="st3 smile" d="M191,214.4c-1.1-1.5,38.6,49.3,83,0" style={{ display: 'none' }} />
                    </svg>
                


                    <div className="message">
                        <h1>Oops, this link is expired</h1>
                        <p>This URL is not valid anymore.</p>
                        
                        <div>
                        <Link href="/Login">
                            <a onClick={()=>{Loading(true) }}  style={{ display: `${loadingStatus ? 'none' : 'block'}`}}  >Go to Home</a>
                        </Link>
                        <ThreeBounce style={{ display: `${loadingStatus ? 'flex' : 'none'}`}} size={15} color='darkblue' />
                        </div>
                    </div>


                </div>

            </div>

            <style jsx>{stylesheetsecond}</style>
            </>
        );
    }
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


//second ****************************************************************************

const stylesheetsecond = css`
.expired {
    background: rgba(96, 196, 196, .3);
  font-family: 'Open-sans', sans-serif;
  display: flex;
  justify-content:center;
  align-items: center;
  flex-wrap: wrap;
  height:100vh;
}
svg {
  width: 30%;
  margin: 0 5% 3vh !important;
}

.st0{fill:#EFCBB4;}
.st1{fill:#FFE1CA;}
.st2{fill:#473427;}
.st3{
    fill:none;
    stroke:#473427;
    stroke-width:7;
    stroke-linecap:round;
    stroke-miterlimit:10;
}
.st4{fill:#D37D42;stroke:#D37D42;stroke-miterlimit:10;}

.smile {
  display: none;
}
.uhoh {
  display: none;
}
path.smile {
    fill-opacity: 0;
    stroke: #000;
    stroke-width: 6;
    stroke-dasharray: 870;
    stroke-dashoffset: 870;
    animation: draw 7s infinite linear;
  }
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
#path {
  stroke-dasharray: 628.3185307179587;
  animation: dash 5s linear forwards;
}
@keyframes dash {
  from {
    stroke-dashoffset: 628.3185307179587;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.message {

}
.message h1 {
  color: #3698DC;
  font-size: 3vw !important;
  font-weight: 400;
}
.message p {
  color: #262C34;
  font-size: 1.3em;
  font-weight: lighter;
  line-height: 1.1em;
}
.light {
  position: relative;
  top: -36em;
}
.light_btm {
  position: relative;
}
.light span:first-child {
  display: block;
  height: 6px;
  width: 150px;
  position: absolute;
  top:5em;
  left: 20em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}
.light span:nth-child(2) {
  display: block;
  height: 6px;
  width: 200px;
  position: absolute;
  top:6em;
  left: 19em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}
.light span:nth-child(3) {
  display: block;
  height: 6px;
  width: 100px;
  position: absolute;
  top:7em;
  left: 24em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}

.light_btm span:first-child {
  display: block;
  height: 6px;
  width: 150px;
  position: absolute;
  bottom:6em;
  right: 20em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}
.light_btm span:nth-child(2) {
  display: block;
  height: 6px;
  width: 200px;
  position: absolute;
  bottom: 7em;
  right: 21em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}
.light_btm span:nth-child(3) {
  display: block;
  height: 6px;
  width: 100px;
  position: absolute;
  bottom:8em;
  right: 24em;
  background: #fff;
  border-radius: 3px;
/*   transform: rotate(40deg); */
}
.use-desktop {
  font-weight: 400;
  color: #3698DC;
  border: 1px solid white;
  height: 3.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 25px;
  line-height: 1.1em;
  font-size: 5vw;
}


`



export default EmailToken;
