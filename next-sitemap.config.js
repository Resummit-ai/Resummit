/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://resummit.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/dashboard*", "/editor*", "/api*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
        disallow: ["/dashboard*", "/editor*", "/api*"],
      },
    ],
  },
};
