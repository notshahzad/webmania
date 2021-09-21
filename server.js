const app = requrie("express")();
app.get("/", (req, res) => res.render(`${__dirname}/views/index.html`));
app.listen(3000);
