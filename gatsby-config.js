module.exports = {
  siteMetadata: {
    title: "Gloomkit",
    description: "Companion app for the game, Gloomhaven",
    author: "@tripphamm",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Gloomkit",
        short_name: "Gloomkit",
        start_url: "/",
        background_color: "#412113",
        theme_color: "#412113",
        display: "minimal-ui",
        icon: "src/images/effects/immobilize.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-typescript",
    {
      resolve: "gatsby-plugin-create-client-paths",
      options: { prefixes: ["/app/*"] },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyD8_O0fjciEkmWLgFdPhv9pjHZHACv2UZ0",
          authDomain: "gloomkit-tjh891.firebaseapp.com",
          databaseURL: "https://gloomkit-tjh891.firebaseio.com",
          projectId: "gloomkit-tjh891",
          storageBucket: "gloomkit-tjh891.appspot.com",
          messagingSenderId: "862047503960",
          appId: "1:862047503960:web:d59919271dca85735a6c2d",
        },
      },
    },
  ],
}
