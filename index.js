const app = require("express")();
app.get("/", (req, res) => res.render(`${__dirname}/views/index.html`));
app.listen(3000, () => console.log("listening on PORT 3000"));
