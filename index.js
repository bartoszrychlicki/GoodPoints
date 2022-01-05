const express = require("express");
const debug = require("Debug")("GoodPoints:main");
const app = express();
const port = process.env.PORT || 3003;

app.get("/", (request, respone) => {
  respone.send("Hello world");
});

app.listen(port, () => {
  debug("Listening on port:", port);
});
