
import { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import nextConfig from '../next.config';



async function checkValidLogin(req){
    let data;
        try {
            const response = await fetch(`${nextConfig.REST_API_URL}/alreadylogincheck`, {            
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: req.cookies["token"] })
            });

            let response_data = await response.json();

            if(response_data.status == 'success'){
                data = { login: "success", error: "Login Success" }
            }else{
                data = { login: "failed", error: "Login Expired" };    
            }

        } catch (error) {
            console.log("api error:", error)
            data = { login: "failed", error: "Login Expired" };
        }

        return data;
}


export default async function middleware(req) {
    const url = req.url;

    // let {origin: hostOrigin } = req.nextUrl
    // if(req.nextUrl.href === hostOrigin || req.nextUrl.href === `${hostOrigin}/`){
    //     const { pathname, origin } = req.nextUrl                                     
    //     return NextResponse.redirect(`${origin}/Login`);
    // }


    // if (url.includes('/Login')) {
    //     let LoginData = await checkValidLogin(req);
    //     if(LoginData.login == 'success'){
    //         const { pathname, origin } = req.nextUrl                                     
    //         return NextResponse.redirect(`${origin}/Compiler`);
    //     }
    // }

    // if (url.includes('/Signup')) {
    //     let LoginData = await checkValidLogin(req);
    //     if(LoginData.login == 'success'){
    //         const { pathname, origin } = req.nextUrl                                     
    //         return NextResponse.redirect(`${origin}/Compiler`);
    //     }
    // }

    // if (url.includes('/Forgotpassword')) {
    //     let LoginData = await checkValidLogin(req);
    //     if(LoginData.login == 'success'){
    //         const { pathname, origin } = req.nextUrl                                     
    //         return NextResponse.redirect(`${origin}/Compiler`);
    //     }
    // }

    // if (url.includes('/Compiler')) {
    //     let LoginData = await checkValidLogin(req);
    //     if(LoginData.login != 'success'){
    //         const { pathname, origin } = req.nextUrl                               
    //         return NextResponse.redirect(`${origin}/Login`);
    //     }
    // }

     if (url.includes('/Expirelink')) {
            const { pathname, origin } = req.nextUrl                               
            return NextResponse.redirect(`${origin}/Login`);
    }

}




// nodejs url not set using proxy

