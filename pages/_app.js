import '../styles/globals.css'
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/js/bootstrap'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" /> */}

      </Head>

      {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossOrigin="anonymous" /> */}

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
