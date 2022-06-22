import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import absoluteUrl from 'next-absolute-url'
import Checkauth from '../Modules/checkAuth';


// Home.getInitialProps = async (context) => {
//   const { req, query, res, asPath, pathname } = context;
//   if (req) {    
//     const { origin } = absoluteUrl(req)

//     // return {
//     //   redirect: {
//     //     destination: `${origin}/Login`,
//     //     permanent: false
//     //   }
//     // }

//     return { currOrigin: origin }
//    }else{
//     return { currOrigin: 'http://localhost:3050' }
//    }
// }



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
