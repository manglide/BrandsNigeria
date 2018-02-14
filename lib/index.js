import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Rating from './Rating';
const app = express()

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'reviewmonster',
  password: 'love~San&500#',
  database: 'asknigeria'
});

const fs = require('fs'); // this engine requires the fs module
app.engine('ntl', function(filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err);
    /*
    title: title, type: type, og_url: og_url, og_image: og_image, og_site_name: og_site_name,
    description: description, copyright: copyright, language: language, category: category,
    coverage: coverage, distribution: distribution, rating: rating, identifier_url: identifier_url,
    url: url, owner: owner, classification: classification, summary: summary, topic: topic,
    designer: designer
    */
    const rendered = content.toString().replace('#con#', options.con)
                    .replace('#meta#', options.meta)
                    .replace('#keywords#', options.keywords)
                    .replace('#about#', options.about)
                    .replace('#feedback#', options.feedback)
                    .replace('#titlePage#', options.titlePage)
                    .replace('#title#', options.title)
                    .replace('#type#', options.type)
                    .replace('#og_url#', options.og_url)
                    .replace('#og_image#', options.og_image)
                    .replace('#og_site_name#', options.og_site_name)
                    .replace('#description#', options.description)
                    .replace('#copyright#', options.copyright)
                    .replace('#language#', options.language)
                    .replace('#category#', options.category)
                    .replace('#coverage#', options.coverage)
                    .replace('#distribution#', options.distribution)
                    .replace('#rating#', options.rating)
                    .replace('#identifier_url#', options.identifier_url)
                    .replace('#url#', options.url)
                    .replace('#owner#', options.owner)
                    .replace('#classification#', options.classification)
                    .replace('#summary#', options.summary)
                    .replace('#topic#', options.topic)
                    .replace('#designer#', options.designer)
                    ;
    return callback(null, rendered);
  });
});
app.set('views', 'views');
app.set('view engine', 'ntl');
app.use(express.static('public'));

app.get('/', function (req, res) {
  const sql = "SELECT all_products.id AS product_ID, all_products.title AS productname,all_products.about AS description, all_products.manufacturer AS manufacturer, " +
        "SUM(product_review.likes) AS likes, SUM(product_review.dislikes) AS dislikes, "+
        "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'trending_up' ELSE 'trending_down' END AS `trend`, " +
        "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Up' ELSE 'Down' END AS `trend_direction`," +
        "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'sentiment_very_satisfied' ELSE 'sentiment_very_dissatisfied' END AS `sentiment`, " +
        "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Good' ELSE 'Bad' END AS `sentiment_mood`, " +
        "COUNT(product_review.user_comments) AS usercomments, " +
        "AVG(product_review.rating) AS rating," +
        "all_products.price AS price, COUNT(`user_location_lat`) + COUNT(`user_location_lon`) AS locationcount, all_products.ingredients AS ingredients, " +
        "product_categories.category AS category, " +
        "CONCAT('https://asknigeria.com.ng/brands/images/281x224/', SUBSTR(all_products.product_image_1,8)) AS productImage_1, " +
        "CONCAT('https://asknigeria.com.ng/brands/images/750x224/', SUBSTR(all_products.product_image_2,8)) AS productImage_2 FROM all_products " +
        "JOIN product_review ON all_products.id = product_review.product_id " +
        "JOIN product_categories ON all_products.category = product_categories.id " +
        "WHERE " +
        "all_products.about IS NOT NULL AND " +
        "all_products.manufacturer IS NOT NULL AND " +
        "all_products.address IS NOT NULL AND " +
        "all_products.ingredients IS NOT NULL AND " +
        "all_products.product_image_1 IS NOT NULL AND " +
        "all_products.product_image_2 IS NOT NULL AND " +
        "all_products.price IS NOT NULL " +
        "GROUP BY all_products.id ORDER BY rating DESC ";
  connection.query(sql, function (error, result) {
    if (error) throw error;
    const block = '<div class="container-fluid">';
    const block1 = result.map((item, index) => (
      (index % 4 == 0)
      ?
      "<div class='row'>"+
      "<div class='paper' itemscope itemtype='http://schema.org/Product'><div class='c15'><div class='col'>"+
      "<div class='card bg-light mb-3 smallCard'>"+
      "<div class='card-header' style='background: #fff; color:#444'>"+
      "<span itemprop='name'>"+item.productname+"</span>"+
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/manufacturer'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/manufacturer'>"+item.manufacturer.toUpperCase()+"</div>"+
      "</div>"+
      "<img itemprop='image' class='card-img-top productImage' src='"+item.productImage_1+"' title='"+item.productname+"' alt='"+item.productname+"'>"+
      "<div class='mainratingblock'>"+
      // +renderToString(<Rating productname={item.productname} rating={item.rating} />)+
      // app.post( '/social-worker-register-child', function( req, res, next ) { middleware.requireUsersOfType( req, res, next, userTypes = ['admin, social worker'] ); }, childService.registerChild );
      Array(Math.floor(item.rating)).fill(2).map((item_U, index_U) => (
        "<span data='"+item.rating+"' class='fa fa-star fa-1x rates' />"
      )).join('')+
      "</div>"+
      "<div class='card-body cardContent'>"+
      "<p class='card-text'>"+item.description+"</p>"+
        "<div class='afterRatingDiv'>"+
        "<div class='afterRatingDivPriceCom'>"+
        "<div class='mainpriceSmall'>N"+item.price+"</div>"+
        "</div>"+ // End of afterRatingDivPriceCom
        "<div class='ThumbsUp'>"+
        "<div class='ThumbsUpChildren'>"+
        "<a href='#' class='btn btn-success btn-sm'><span class='fa fa-thumbs-up fa-1x'></span></a>"+
        "<div class='textBelowRatings'>"+item.likes+"</div>"+
        "</div>"+ // End of ThumbsUp Children 1
        "<div class='ThumbsUpChildren'>"+
        "<a href='#' class='btn btn-danger btn-sm'><span class='fa fa-thumbs-down fa-1x'></span></a>"+
        "<div class='textBelowRatings'>"+item.dislikes+"</div>"+
        "</div>"+ // End of ThumbsUp Children 2
        "</div>"+ // End of Thumbs Up
        "<div class='cardSentiment'>"+
        "<div class='cardTitleInnerExtendedChildren'>"+
        "<div style='width: 20%;position: absolute;float: left;'><span><i class='material-icons' style='font-size:20px; left: 1px;'>"+item.trend+"</i></span><div class='textBelowRatingTrends'>"+item.trend_direction+"</div></div>"+
        "</div>"+ // End of cardTitleInnerExtendedChildren
        "</div>"+ // End of Card Sentiment
        "<div class='SentimentsDiv'>"+
        "<div class='cardTitleInnerExtendedChildren'>"+
        "<div><span><i class='material-icons' style='font-size:25px;color:red'>"+item.sentiment+"</i></span><div class='textBelowRatingSentiment'>"+item.sentiment_mood+"</div></div>"+
        "</div>"+ // End of cardTitleInnerExtendedChildren
        "<div class=''>"+ // Start of Favorites Enclosing Div
        "<div class='cardTitleInnerExtendedChildren likebtn'>"+
        "<div><span><i class='material-icons' style='font-size:25px;'>favorite</i></span><div class='textBelowRatingSentiment'>Like</div></div>"+
        "</div>"+ // End of likebtn Enclosing Div
        "<div class='cardTitleInnerExtendedChildren sharebtn'>"+
        "<div><span><i class='material-icons' style='font-size:25px;'>share</i></span><div class='textBelowRatingSentiment'>Share</div></div>"+
        "</div>"+ // End of sharebtn Enclosing Div
        "<div class='cardTitleInnerExtendedChildren commentbtn'>"+
        "<div><span><i class='fa fa-comments-o' style='font-size:25px;'></i></span><div class='peoplebtnText'>"+item.usercomments+"</div></div>"+
        "</div>"+ // End of commentbtn Enclosing Div
        "<div class='cardTitleInnerExtendedChildren locationbtn'>"+
        "<div><span><i class='material-icons' style='font-size:25px;'>location_on</i></span><div class='locationbtnText'>"+item.locationcount+"</div></div>"+
        "</div>"+ // End of locationbtn Enclosing Div
        "</div>"+ // End of Favorites Enclosing Div
        "</div>"+ // End of Sentiment Div
        "<div>"+ // Start the Ingredients Div
        "<div class='ingredientsTitle'><small class='text-muted'>Ingredients</small></div>"+
        "<p class='dients'>"+item.ingredients+"</p>"+
        "</div>"+ // End the Ingredients Div
        "</div>"+ // End the afterRatingDivs Div
        "<a href='/product/"+item.productname+"' class='card-link'>"+
        "<button type='button' class='btn-success btn-sm btn-block'>"+
        "View</button>"+
        "</a>"+
      "</div>"+
    "</div>"+
      "</div></div></div>"
      :
      ((((index % 4) - 3) == 0) && ((index - index) == 0))
      ?
      "<div class='paper' itemscope itemtype='http://schema.org/Product'><div class='c15'><div class='col'>"+
      "<div class='card bg-light mb-3 smallCard'>"+
      "<div class='card-header' style='background: #fff; color:#444'>"+
      "<span itemprop='name'>"+item.productname+"</span>"+
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/manufacturer'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/manufacturer'>"+item.manufacturer.toUpperCase()+"</div>"+
      "</div>"+
      "<img itemprop='image' class='card-img-top productImage' src='"+item.productImage_1+"' title='"+item.productname+"' alt='"+item.productname+"'>"+
      "<div class='mainratingblock'>"+
      Array(Math.floor(item.rating)).fill(2).map((item_U, index_U) => (
        "<span data='"+item.rating+"' class='fa fa-star fa-1x rates' />"
      )).join('')+
      "</div>"+
        "<div class='card-body cardContent'>"+
        "<p class='card-text'>"+item.description+"</p>"+
          "<div class='afterRatingDiv'>"+
          "<div class='afterRatingDivPriceCom'>"+
          "<div class='mainpriceSmall'>N"+item.price+"</div>"+
          "</div>"+ // End of afterRatingDivPriceCom
          "<div class='ThumbsUp'>"+
          "<div class='ThumbsUpChildren'>"+
          "<a href='#' class='btn btn-success btn-sm'><span class='fa fa-thumbs-up fa-1x'></span></a>"+
          "<div class='textBelowRatings'>"+item.likes+"</div>"+
          "</div>"+ // End of ThumbsUp Children 1
          "<div class='ThumbsUpChildren'>"+
          "<a href='#' class='btn btn-danger btn-sm'><span class='fa fa-thumbs-down fa-1x'></span></a>"+
          "<div class='textBelowRatings'>"+item.dislikes+"</div>"+
          "</div>"+ // End of ThumbsUp Children 2
          "</div>"+ // End of Thumbs Up
          "<div class='cardSentiment'>"+
          "<div class='cardTitleInnerExtendedChildren'>"+
          "<div style='width: 20%;position: absolute;float: left;'><span><i class='material-icons' style='font-size:20px; left: 1px;'>"+item.trend+"</i></span><div class='textBelowRatingTrends'>"+item.trend_direction+"</div></div>"+
          "</div>"+ // End of cardTitleInnerExtendedChildren
          "</div>"+ // End of Card Sentiment
          "<div class='SentimentsDiv'>"+
          "<div class='cardTitleInnerExtendedChildren'>"+
          "<div><span><i class='material-icons' style='font-size:25px;color:red'>"+item.sentiment+"</i></span><div class='textBelowRatingSentiment'>"+item.sentiment_mood+"</div></div>"+
          "</div>"+ // End of cardTitleInnerExtendedChildren
          "<div class=''>"+ // Start of Favorites Enclosing Div
          "<div class='cardTitleInnerExtendedChildren likebtn'>"+
          "<div><span><i class='material-icons' style='font-size:25px;'>favorite</i></span><div class='textBelowRatingSentiment'>Like</div></div>"+
          "</div>"+ // End of likebtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren sharebtn'>"+
          "<div><span><i class='material-icons' style='font-size:25px;'>share</i></span><div class='textBelowRatingSentiment'>Share</div></div>"+
          "</div>"+ // End of sharebtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren commentbtn'>"+
          "<div><span><i class='fa fa-comments-o' style='font-size:25px;'></i></span><div class='peoplebtnText'>"+item.usercomments+"</div></div>"+
          "</div>"+ // End of commentbtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren locationbtn'>"+
          "<div><span><i class='material-icons' style='font-size:25px;'>location_on</i></span><div class='locationbtnText'>"+item.locationcount+"</div></div>"+
          "</div>"+ // End of locationbtn Enclosing Div
          "</div>"+ // End of Favorites Enclosing Div
          "</div>"+ // End of Sentiment Div
          "<div>"+ // Start the Ingredients Div
          "<div class='ingredientsTitle'><small class='text-muted'>Ingredients</small></div>"+
          "<p class='dients'>"+item.ingredients+"</p>"+
          "</div>"+ // End the Ingredients Div
          "</div>"+ // End the afterRatingDivs Div
          "<a href='/product/"+item.productname+"' class='card-link'>"+
          "<button type='button' class='btn-success btn-sm btn-block'>"+
          "View</button>"+
          "</a>"+
        "</div>"+
      "</div>"+
      "</div></div></div></div>"
      :
      "<div class='paper' itemscope itemtype='http://schema.org/Product'><div class='c15'><div class='col'>"+
      "<div class='card bg-light mb-3 smallCard'>"+
      "<div class='card-header' style='background: #fff; color:#444'>"+
      "<span itemprop='name'>"+item.productname+"</span>"+
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/manufacturer'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/manufacturer'>"+item.manufacturer.toUpperCase()+"</div>"+
      "</div>"+
      "<img itemprop='image' class='card-img-top productImage' src='"+item.productImage_1+"' title='"+item.productname+"' alt='"+item.productname+"'>"+
      "<div class='mainratingblock' id='mainratingblock_"+item.productname+"'>"+
      Array(Math.floor(item.rating)).fill(2).map((item_U, index_U) => (
        "<span data='"+item.rating+"' class='fa fa-star fa-1x rates' />"
      )).join('')+
      "</div>"+
        "<div class='card-body cardContent'>"+
        "<p class='card-text'>"+item.description+"</p>"+
          "<div class='afterRatingDiv'>"+
          "<div class='afterRatingDivPriceCom'>"+
          "<div class='mainpriceSmall'>N"+item.price+"</div>"+
          "</div>"+ // End of afterRatingDivPriceCom
          "<div class='ThumbsUp'>"+
          "<div class='ThumbsUpChildren'>"+
          "<a href='#' class='btn btn-success btn-sm'><span class='fa fa-thumbs-up fa-1x'></span></a>"+
          "<div class='textBelowRatings'>"+item.likes+"</div>"+
          "</div>"+ // End of ThumbsUp Children 1
          "<div class='ThumbsUpChildren'>"+
          "<a href='#' class='btn btn-danger btn-sm'><span class='fa fa-thumbs-down fa-1x'></span></a>"+
          "<div class='textBelowRatings'>"+item.dislikes+"</div>"+
          "</div>"+ // End of ThumbsUp Children 2
          "</div>"+ // End of Thumbs Up
          "<div class='cardSentiment'>"+
          "<div class='cardTitleInnerExtendedChildren'>"+
          "<div style='width: 20%;position: absolute;float: left;'><span><i class='material-icons' style='font-size:20px; left: 1px;'>"+item.trend+"</i></span><div class='textBelowRatingTrends'>"+item.trend_direction+"</div></div>"+
          "</div>"+ // End of cardTitleInnerExtendedChildren
          "</div>"+ // End of Card Sentiment
          "<div class='SentimentsDiv'>"+
          "<div class='cardTitleInnerExtendedChildren'>"+
          "<div><span><i class='material-icons' style='font-size:25px;color:red'>"+item.sentiment+"</i></span><div class='textBelowRatingSentiment'>"+item.sentiment_mood+"</div></div>"+
          "</div>"+ // End of cardTitleInnerExtendedChildren
          "<div class=''>"+ // Start of Favorites Enclosing Div
          "<div class='cardTitleInnerExtendedChildren likebtn'>"+
          "<div><span><i class='material-icons' style='font-size:25px;'>favorite</i></span><div class='textBelowRatingSentiment'>Like</div></div>"+
          "</div>"+ // End of likebtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren sharebtn'>"+
          "<div><span><i class='material-icons' style='font-size:22px;'>share</i></span><div class='textBelowRatingSentiment'>Share</div></div>"+
          "</div>"+ // End of sharebtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren commentbtn'>"+
          "<div><span><i class='fa fa-comments-o' style='font-size:25px;'></i></span><div class='peoplebtnText'>"+item.usercomments+"</div></div>"+
          "</div>"+ // End of commentbtn Enclosing Div
          "<div class='cardTitleInnerExtendedChildren locationbtn'>"+
          "<div><span><i class='material-icons' style='font-size:25px;'>location_on</i></span><div class='locationbtnText'>"+item.locationcount+"</div></div>"+
          "</div>"+ // End of locationbtn Enclosing Div
          "</div>"+ // End of Favorites Enclosing Div
          "</div>"+ // End of Sentiment Div
          "<div>"+ // Start the Ingredients Div
          "<div class='ingredientsTitle'><small class='text-muted'>Ingredients</small></div>"+
          "<p class='dients'>"+item.ingredients+"</p>"+
          "</div>"+ // End the Ingredients Div
          "</div>"+ // End the afterRatingDivs Div
          "<a href='/product/"+item.productname+"' class='card-link'>"+
          "<button type='button' class='btn-success btn-sm btn-block'>"+
          "View</button>"+
          "</a>"+
        "</div>"+
      "</div>"+
      "</div></div></div>"
    )).join('');
    const meta = result.map((item, index) => ("<meta name='description' content='"+item.description+"'>")).join('');
    const keywords = result.map((item, index) => (item.productname)).join(',');
    res.render('index', {con: block + block1 + '</div>', meta: meta, keywords: keywords});
  });
});

app.get('/product/:id', function (req, res) {
  const sql = "SELECT all_products.id AS product_ID, all_products.title AS productname,all_products.about AS description, all_products.manufacturer AS manufacturer, SUM(product_review.likes) AS likes, SUM(product_review.dislikes) AS dislikes, " +
          "COUNT(product_review.user_comments) AS usercomments, AVG(product_review.rating) AS rating, all_products.price AS price, COUNT(`user_location_lat`) + COUNT(`user_location_lon`) AS locationcount, " +
          " all_products.competitor_1 AS firstCompetition, all_products.competitor_2 AS secondCompetition, all_products.ingredients AS ingredients, " +
          "product_categories.category AS category, " +
          "CONCAT('https://asknigeria.com.ng/brands/images/281x224/', SUBSTR(all_products.product_image_1,8)) AS productImage_1, " +
          "CONCAT('https://asknigeria.com.ng/brands/images/750x224/', SUBSTR(all_products.product_image_2,8)) AS productImage_2 FROM all_products " +
          "JOIN product_review ON all_products.id = product_review.product_id " +
          "JOIN product_categories ON all_products.category = product_categories.id " +
          "WHERE all_products.about <> '' AND all_products.title = '" + req.params.id + "' " +
          "AND all_products.about IS NOT NULL AND " +
          "all_products.manufacturer IS NOT NULL AND " +
          "all_products.address IS NOT NULL AND " +
          "all_products.ingredients IS NOT NULL AND " +
          "all_products.product_image_1 IS NOT NULL AND " +
          "all_products.product_image_2 IS NOT NULL AND " +
          "all_products.price IS NOT NULL " +
          "GROUP BY all_products.id ORDER BY rating DESC";
          connection.query(sql, function (error, result) {
            const block = '<div class="productWrapper"><div class="aboutproduct"></div><div class="aboutCompetitor"></div></div>';
            if (error) throw error;
            const titlePage = result.map((item, index) => (item.productname)).join('');
            const title = result.map((item, index) => ("<meta name='og:title' content='"+item.productname+"'>")).join('');
            const type = result.map((item, index) => ("<meta name='og:type' content='Product'>")).join('');
            const og_url = result.map((item, index) => ("<meta name='og:url' content='https://brandsnigeria.com.ng/product/"+item.productname+"'>")).join('');
            const og_image = result.map((item, index) => ("<meta name='og:image' content='"+item.productImage_2+"'>")).join('');
            const og_site_name = result.map((item, index) => ("<meta name='og:site_name' content='Brands Nigeria'>")).join('');
            const description = result.map((item, index) => ("<meta name='description' content='"+item.description+"'>")).join('');
            const copyright = result.map((item, index) => ("<meta name='copyright' content='https://brandsnigeria.com.ng'>")).join('');
            const language = result.map((item, index) => ("<meta name='language' content='EN'>")).join('');
            const category = result.map((item, index) => ("<meta name='category' content='"+item.category+"'>")).join('');
            const coverage = result.map((item, index) => ("<meta name='coverage' content='Nigeria'>")).join('');
            const distribution = result.map((item, index) => ("<meta name='distribution' content='Global'>")).join('');
            const rating = result.map((item, index) => ("<meta name='rating' content='"+item.rating+"'>")).join('');
            const identifier_url = result.map((item, index) => ("<meta name='identifier-URL' content='https://brandsnigeria.com.ng/product/"+item.productname+"'>")).join('');
            const url = result.map((item, index) => ("<meta name='url' content='https://brandsnigeria.com.ng/product/"+item.productname+"'>")).join('');
            const owner = result.map((item, index) => ("<meta name='owner' content='"+item.manufacturer+"'>")).join('');
            const classification = result.map((item, index) => ("<meta name='Classification' content='"+item.category+"'>")).join('');
            const summary = result.map((item, index) => ("<meta name='summary' content='"+item.description+"'>")).join('');
            const topic = result.map((item, index) => ("<meta name='topic' content='Review of the "+item.productname+" Branded Product'>")).join('');
            const designer = result.map((item, index) => ("<meta name='designer' content='"+item.manufacturer+"'>")).join('');
            const keywords = result.map((item, index) => (item.productname)).join(',');
            res.render('product',
            {
              con: block,
              titlePage: titlePage, title: title, type: type, og_url: og_url, og_image: og_image, og_site_name: og_site_name,
              description: description, copyright: copyright, language: language, category: category,
              coverage: coverage, distribution: distribution, rating: rating, identifier_url: identifier_url,
              url: url, owner: owner, classification: classification, summary: summary, topic: topic,
              designer: designer, keywords: keywords
            });
          });
});

app.get('/about', function (req, res) {
  const about = "<div class='aboutContent'><div class='about'>Nigeria Brands is a data driven, information company with 100% emphasis on Nigeria's Consumer Products.<br /> Were a technology company that uses location intelligence to build meaningful consumer experiences and business solutions. Our location intelligence technology helps brands to locate, message and assess their own consumer and competitors's personal finance, strenghts and spending patterns which will help in making purchasing and business centric decisions.<br />For further enquiries, please send a mail to customercare@brandsnigeria.com.ng for customer related issues and enquiries@brandsnigeria.com.ng for enquiries.</div></div>";
  res.render('about', {about: about});
});

app.get('/feedback', function (req, res) {
  const feedback = "<div class='aboutContent'><div class='about'>For further enquiries, please send a mail to customercare@brandsnigeria.com.ng for customer related issues and enquiries@brandsnigeria.com.ng for enquiries.</div></div>";
  res.render('feedback', {feedback: feedback});
});

app.listen(3838, () => console.log('Example app listening on port 3838!'))
