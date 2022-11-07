const {i18n} = require("./next-i18next.config.js");

const path = require("path");
const nextTranslate = require("next-translate");
const withTM = require("next-transpile-modules")(["d3plus-react"]); // pass the modules you would like to see transpiled

require("dotenv").config();

module.exports = withTM(nextTranslate({
  i18n,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "./styles", "./pages", "./components")],
    prependData: "@import './styles/_variables.scss';",
  },
  env: {},
  async rewrites() {
    return [];
  }
}));