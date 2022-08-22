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
      {
        source: "/paychecknow",
        destination: "/ewa",
        permanent: true,
        basePath: false,
      },
    ];
  },
};
