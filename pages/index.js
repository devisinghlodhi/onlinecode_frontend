import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import absoluteUrl from 'next-absolute-url'
import Checkauth from '../Modules/checkAuth';

export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);

  if (data.login == 'success') {
    return {
      redirect: {
        destination: `/Compiler`,
        permanent: false
      }
    }
  }else{
    return {
      redirect: {
        destination: `/Login`,
        permanent: false
      }
    }
  }

  return { props: { data } }
}



export default function Home() {

  
  return (
   <h1>Error 404 , Index file Error...!!</h1> 
  )
}
