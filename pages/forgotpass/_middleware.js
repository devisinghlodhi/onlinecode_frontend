
import { NextRequest } from 'next/server'
import { useRouter } from "next/router";
import { NextResponse } from "next/server";
import nextConfig from '../../next.config';



async function checkEmailtokenValid(req) {
    let forgot_url = req.nextUrl.pathname;

    let token = forgot_url.split("/").pop();

    // const token = Router.query.emailToken;
    // let {emailToken} = req.query;
    // console.log(myToken);
    // const token= 'hii'

    let data;

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

    return data;
}


export default async function middleware(req) {
    const url = req.url;
    
    if (url.includes('/forgotpass')) {
        const { pathname, origin } = req.nextUrl   
        console.log(origin);
        let data = await checkEmailtokenValid(req);
        console.log(data);
        if (data.status != 'success') {
            return NextResponse.redirect(`${origin}/Login`);
        }
    }
    
}






// nodejs url not set using proxy

