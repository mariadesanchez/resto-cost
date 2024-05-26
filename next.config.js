// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns: [{
//             protocol: 'https',
//             hostname: 'res.cloudinary.com'
//         }]
//     }
// }

// module.exports = nextConfig/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'collection.cloudinary.com'],
        remotePatterns: [{
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'collection.cloudinary.com',
                pathname: '/**'
            }
        ]
    }

}

module.exports = nextConfig;