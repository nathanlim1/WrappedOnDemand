module.exports = {
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/"],
  };
  