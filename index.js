const express = require("express");
const app = express();
app.use(express.static(`${__dirname}/views`));
app.get("/", (req, res) => res.render(`${__dirname}/views/index.html`));
app.listen(3000, () => console.log("listening on PORT 3000"));
