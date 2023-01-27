/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  basePath: "/ewa",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};
