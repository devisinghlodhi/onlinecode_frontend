import nextConfig from '../next.config';
import { useState } from 'react';
import css from 'styled-jsx/css';
import Axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import cookie from 'cookie';
import Checkauth from '../Modules/checkAuth';

export async function getServerSideProps(context) {
  const data = await Checkauth(context.req.headers.cookie);
  return { props: { data } }
}


const Home = ({ data }) => {

  console.log("Your Response is : ", data);

  return (
    <div>
      <h1>This is home page</h1>
    </div>
  );
}

export default Home;
