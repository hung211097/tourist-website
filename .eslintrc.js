module.exports = {
  "parser": "babel-eslint",
  "plugins": ["react"],
  "rules": {
      "max-len": [1, 200, 2, { ignoreComments: true }],
      "indent": ["off", 4],
      "no-console": ["warn"],
      "react/display-name": ["warn"],
      "no-warning-comments": [1, { "terms": ["todo", "fixme", "term"], "location": "anywhere" }]
  },
  "globals": {
      "React": true,
      "setTimeout": true,
      "console": true,
      "process": true,
      "clearTimeout": true,
      "Promise": true,
      "window": true,
      "FormData": true,
      "URL": true,
      "alert": true,
      "location": true,
      "document": true,
      "setInterval": true,
      "google": true,
      "clearInterval": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"]
};
