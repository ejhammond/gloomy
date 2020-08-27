module.exports = {
  siteMetadata: {
    title: "Gloomy",
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
        name: "Gloomy",
        short_name: "Gloomy",
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
          apiKey: "AIzaSyCLjlo8SvnNbiPjk5WbTT6coUfdk2Uf3rw",
          authDomain: "gloomy-891.firebaseapp.com",
          databaseURL: "https://gloomy-891.firebaseio.com",
          projectId: "gloomy-891",
          storageBucket: "gloomy-891.appspot.com",
          messagingSenderId: "279868914446",
          appId: "1:279868914446:web:4789148556b44838d9355f",
        },
      },
    },
  ],
}
