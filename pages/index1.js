import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { NextResponse } from "next/server";
import absoluteUrl from 'next-absolute-url'



Home.getInitialProps = async (context) => {
  const { req, query, res, asPath, pathname } = context;
  if (req) {    
    const { origin } = absoluteUrl(req)
    return { currOrigin: origin }
   }else{
    return { currOrigin: 'http://localhost:3050' }
   }
}



export default function Home({currOrigin}) {

  const router = useRouter()
  


  
  console.log(currOrigin); 
  // return NextResponse.redirect(`${currOrigin}/Login`);
  
  return (
   <h1>${currOrigin}</h1> 
  )
}
