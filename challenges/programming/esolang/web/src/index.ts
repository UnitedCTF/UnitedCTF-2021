import express from 'express';

const PORT = process.env.PORT || 1337;

const app = express();
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/playground', (req, res) => {
    let code = "";
    try {
        code = Buffer.from(req.query.code as string, 'base64').toString('ascii');
    } catch {}

    let input = "";
    try {
        input = Buffer.from(req.query.input as string, 'base64').toString('ascii');
    } catch {}

    res.render('playground', { code, input });
});

app.listen(PORT, () => {
    console.log(`CTFL listening at http://localhost:${PORT}`)
});
