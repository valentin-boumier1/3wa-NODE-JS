const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override');
const { auth, requiresAuth } = require('express-openid-connect');
const app = express();
require('dotenv').config();

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL:  process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET
    })
)

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method')) // permet d'utiliser la methode delete : router.delete

app.get('/', requiresAuth(), async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    res.render("articles/index", {articles: articles})
})

app.use('/articles', articleRouter)
app.listen(3000);