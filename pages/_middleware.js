
import { NextRequest } from 'next/server'
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

            data = await response.json();

        } catch (error) {
            console.log("api error:", error)
            data = { login: "failed", error: "Login Expired" };
        }

        return data;
}



export default async function middleware(req) {

    const url = req.url;

    if (url.includes('/Login')) {
        
        let LoginData = await checkValidLogin(req);
        
        if(LoginData.login == 'success'){
            const { pathname, origin } = req.nextUrl                                     
            return NextResponse.redirect(`${origin}/Compiler`);
        }
    }

    if (url.includes('/Compiler')) {
        
        let LoginData = await checkValidLogin(req);
        
        if(LoginData.login != 'success'){
            const { pathname, origin } = req.nextUrl          
            console.log('hii')                    
            return NextResponse.redirect(`${origin}/Login`);
        }
    }

}






// nodejs url not set using proxy

