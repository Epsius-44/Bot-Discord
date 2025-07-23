// ts-ignore
module.exports = function twemojiPlugin(context, options) {
  return {
    name: "docusaurus-twemoji-plugin",

    getClientModules() {
      return [require.resolve("./twemoji-client.js")];
    }
  };
};
