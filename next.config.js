/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // REST_API_URL: "http://localhost:5000/api",
  REST_API_URL : "http://13.233.138.10:5000/api",
}

module.exports = nextConfig

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: 'http://localhost:3000/:path',
//         destination: 'http://localhost:5000' // Proxy to Backend
//         // source: 'http://localhost:3000/:path*',
//         // destination: 'http://localhost:5000/:path*' // Proxy to Backend
//       }
//     ]
//   }
// }



