import express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
const app = express()
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
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
    const rendered = content.toString()
                    .replace('#con#', options.con)
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
                    .replace('#productname#', options.productname)
                    .replace('#productname2#', options.productname)
                    .replace('#productname3#', options.productname)
                    .replace('#productname4#', options.productname)
                    .replace('#price#', options.price)
                    .replace('#likes#', options.likes)
                    .replace('#dislikes#', options.dislikes)
                    .replace('#trend#', options.trend)
                    .replace('#trend_direction#', options.trend_direction)
                    .replace('#sentiment#', options.sentiment)
                    .replace('#sentiment_mood#', options.sentiment_mood)
                    .replace('#usercomments#', options.usercomments)
                    .replace('#locationcount#', options.locationcount)
                    .replace('#ingredients#', options.ingredients)
                    .replace('#manufacturer#', options.manufacturer)
                    .replace('#productImage_1#', options.productImage_1)
                    .replace('#comments#', options.comments)
                    ;
    return callback(null, rendered);
  });
});
app.set('views', 'views');
app.set('view engine', 'ntl');
app.use(express.static('public'));

// Get HomePage - Landing Page
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
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/text'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/organization'>"+item.manufacturer.toUpperCase()+"</div>"+
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
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/text'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/organization'>"+item.manufacturer.toUpperCase()+"</div>"+
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
      "<div itemprop='category' class='productpagebTagCategory' itemscope itemtype='http://schema.org/text'>"+item.category.toUpperCase()+"</div>"+
      "<div class='productpagebTagBy'>BY</div>"+
      "<div class='productpagebTag' itemprop='manufacturer' itemscope itemtype='http://schema.org/organization'>"+item.manufacturer.toUpperCase()+"</div>"+
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

// Get Likes for High Charts
app.post('/chartsreviewlikes', function (req, res) {
    const sqlComments = "SELECT all_products.title AS productname, " +
            "IFNULL(SUM(product_review.likes),0) AS likes " +
            " FROM all_products " +
            "JOIN product_review ON all_products.id = product_review.product_id " +
            "WHERE all_products.title IN ('" + req.body.data1 + "','" + req.body.data2 + "','" + req.body.data3 + "') " +
            "GROUP BY all_products.title";
    connection.query(sqlComments, function(error, result) {
            if (error) throw error;
            res.send(JSON.stringify({'data': result}));
    });
});

// Get dislikes for High Charts
app.post('/chartsreviewdislikes', function (req, res) {
    const sqlComments = "SELECT all_products.title AS productname, " +
              "IFNULL(SUM(product_review.dislikes),0) AS dislikes " +
              " FROM all_products " +
              "JOIN product_review ON all_products.id = product_review.product_id " +
              "WHERE all_products.title IN ('" + req.body.data1 + "','" + req.body.data2 + "','" + req.body.data3 + "') " +
              "GROUP BY all_products.title";
    connection.query(sqlComments, function(error, result) {
            if (error) throw error;
            res.send(JSON.stringify({'data': result}));
    });
  });

// Get rating for High Charts
app.post('/chartsreviewrating', function (req, res) {
    const sqlComments = "SELECT all_products.title AS productname, " +
              "IFNULL(AVG(product_review.rating),0) AS rating " +
              " FROM all_products " +
              "JOIN product_review ON all_products.id = product_review.product_id " +
              "WHERE all_products.title IN ('" + req.body.data1 + "','" + req.body.data2 + "','" + req.body.data3 + "') " +
              "GROUP BY all_products.title";
    connection.query(sqlComments, function(error, result) {
            if (error) throw error;
            res.send(JSON.stringify({'data': result}));
    });
  });

// Generate Sitemap
app.get('/sitemap.xml', function(req, res) {
  const sql = "SELECT all_products.title AS productname FROM all_products " +
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
        const urls = result.map((item, index) => (item.productname));
        // the root of your website - the protocol and the domain name with a trailing slash
        var root_path = 'https://brandsnigeria.com.ng/product/';
        // XML sitemap generation starts here
        var priority = 0.5;
        var freq = 'daily';
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        for (var i in urls) {
            xml += '<url>';
            xml += '<loc>'+ root_path + urls[i] + '</loc>';
            xml += '<changefreq>'+ freq +'</changefreq>';
            xml += '<priority>'+ priority +'</priority>';
            xml += '</url>';
            i++;
        }
        xml += '</urlset>';
        res.header('Content-Type', 'text/xml');
        res.send(xml);
      });
});

// Generate Sitemap.xml.gz
var zlib = require('zlib');
app.get('/sitemap.xml.gz', function(req, res) {
    // get the dynamically generated XML sitemap
    const sql = "SELECT all_products.title AS productname FROM all_products " +
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
          const urls = result.map((item, index) => (item.productname));
          // the root of your website - the protocol and the domain name with a trailing slash
          var root_path = 'https://brandsnigeria.com.ng/product/';
          // XML sitemap generation starts here
          var priority = 0.5;
          var freq = 'daily';
          var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
          for (var i in urls) {
              xml += '<url>';
              xml += '<loc>'+ root_path + urls[i] + '</loc>';
              xml += '<changefreq>'+ freq +'</changefreq>';
              xml += '<priority>'+ priority +'</priority>';
              xml += '</url>';
              i++;
          }
          xml += '</urlset>';
          // Set the appropriate HTTP headers to help old and new browsers equally to how to handle the output
          res.header('Content-Type: application/x-gzip');
          res.header('Content-Encoding: gzip');
          res.header('Content-Disposition: attachment; filename="sitemap.xml.gz"');
          zlib.gzip(new Buffer(xml, 'utf8'), function(error, data) {
              res.send(data);
          });
        });
});

// Get Areas of Product High Rating
app.post('/areasofacceptance', function (req, res) {
      const sqlComments = "SELECT user_location_lat AS latitude, user_location_lon AS longitude," +
            " rating AS rate FROM product_review WHERE product_id = '" + req.body.data + "' AND `rating` BETWEEN '2.5' AND '5' ";
      connection.query(sqlComments, function(error, result) {
              if (error) throw error;
              res.send(JSON.stringify({'data': result}));
      });
});

// Get Areas of Product Low Rating
app.post('/areasofrejection', function (req, res) {
      const sqlComments = "SELECT user_location_lat AS latitude, user_location_lon AS longitude," +
            " rating AS rate FROM product_review WHERE product_id = '" + req.body.data + "' AND `rating` BETWEEN '0' AND '2.5' ";
      connection.query(sqlComments, function(error, result) {
              if (error) throw error;
              res.send(JSON.stringify({'data': result}));
      });
});

// Get Competitors productsAPICompetitor
app.post('/productsAPICompetitor', function (req, res) {
    const sql = "SELECT all_products.id AS product_ID, all_products.title AS productname,all_products.about AS description, all_products.manufacturer AS manufacturer, SUM(product_review.likes) AS likes, SUM(product_review.dislikes) AS dislikes, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'trending_up' ELSE 'trending_down' END AS `trend`, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Up' ELSE 'Down' END AS `trend_direction`," +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'sentiment_very_satisfied' ELSE 'sentiment_very_dissatisfied' END AS `sentiment`, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Good' ELSE 'Bad' END AS `sentiment_mood`, " +
          "COUNT(product_review.user_comments) AS usercomments, AVG(product_review.rating) AS rating, products.price AS price, COUNT(`user_location_lat`) + COUNT(`user_location_lon`) AS locationcount, " +
          " all_products.competitor_1 AS firstCompetition, all_products.competitor_2 AS secondCompetition, all_products.ingredients AS ingredients, " +
          "product_categories.category AS category, " +
          "CONCAT('https://asknigeria.com.ng/brands/images/281x224/', SUBSTR(all_products.product_image_1,8)) AS productImage_1, " +
          "CONCAT('https://asknigeria.com.ng/brands/images/750x224/', SUBSTR(all_products.product_image_2,8)) AS productImage_2 FROM all_products " +
          "JOIN product_review ON all_products.id = product_review.product_id " +
          "JOIN products ON all_products.id = products.id " +
          "JOIN product_categories ON all_products.category = product_categories.id " +
          "WHERE all_products.about <> '' AND all_products.title = '" + req.body.data + "' " +
          "AND all_products.about IS NOT NULL AND " +
          "all_products.manufacturer IS NOT NULL AND " +
          "all_products.address IS NOT NULL AND " +
          "all_products.ingredients IS NOT NULL AND " +
          "all_products.product_image_1 IS NOT NULL AND " +
          "all_products.product_image_2 IS NOT NULL AND " +
          "all_products.price IS NOT NULL " +
          "GROUP BY all_products.id ORDER BY rating DESC";
    connection.query(sql, function (error, result) {
      if (error) throw error;
      if (!result.length) {
        // Meaning Row is Empty
        const sql_ = "SELECT all_products.id AS product_ID, all_products.title AS productname,all_products.competitor_1 AS firstCompetition, " +
              " all_products.competitor_2 AS secondCompetition, product_categories.category AS category FROM all_products " +
              " JOIN product_categories ON all_products.category = product_categories.id " +
              " WHERE all_products.title = '" + req.body.data + "' ";
        connection.query(sql_, function (error, resultD) {
          if (error) throw error;
          const productname = resultD.map((item, index) => (item.productname)).join('');
          const category = resultD.map((item, index) => (item.category)).join('');
          res.render('competitor_no_review',
          {
            productname: productname, category: category
          });
        });
      } else {
        const productname = result.map((item, index) => (item.productname)).join('');
        const description = result.map((item, index) => (item.description)).join('');
        const category = result.map((item, index) => (item.category)).join('');
        const price = result.map((item, index) => (item.price)).join('');
        const likes = result.map((item, index) => (item.likes)).join('');
        const dislikes = result.map((item, index) => (item.dislikes)).join('');
        const trend = result.map((item, index) => (item.trend)).join('');
        const trend_direction = result.map((item, index) => (item.trend_direction)).join('');
        const sentiment = result.map((item, index) => (item.sentiment)).join('');
        const sentiment_mood = result.map((item, index) => (item.sentiment_mood)).join('');
        const usercomments = result.map((item, index) => (item.usercomments)).join('');
        const locationcount = result.map((item, index) => (item.locationcount)).join('');
        const ingredients = result.map((item, index) => (item.ingredients)).join('');
        const manufacturer = result.map((item, index) => (item.manufacturer)).join('');
        const productImage_1 = result.map((item, index) => (item.productImage_1)).join('');
        res.render('competitor',
        {
          productname: productname, description: description, category: category,
          price: price, likes: likes, dislikes: dislikes, trend: trend,
          trend_direction: trend_direction, sentiment: sentiment, sentiment_mood: sentiment_mood,
          usercomments: usercomments, locationcount: locationcount,
          ingredients: ingredients, manufacturer: manufacturer, productImage_1: productImage_1
        });
      }
    });
  });

// Get comments
app.post('/comments', function (req, res) {
      const sqlComments = "SELECT likes AS likes, dislikes AS dislike, rating AS rate, " +
            " user_comments AS comment, user_location_lat AS latitude, user_location_lon AS longitude," +
            " date AS datePublished FROM product_review WHERE product_id = '" + req.body.data + "' ";
      connection.query(sqlComments, function(error, result) {
              if (error) throw error;
              const comments = result.map((item, index) => (
                '<div class="aboutProductComments" itemprop="review" itemscope itemtype="http://schema.org/Review">'+
                '<div class="individualUserAvatarAndName">'+
                '<div class="avatar">'+
                '<img src="https://asknigeria.com.ng/brands/images/blank_boy.png" width="30" height="30" />'+
                '</div>'+
                '<div class="UserAndComment">'+
                '<div>'+
                '<span class="individualComment" itemprop="author"><b>Anonymous</b></span>'+
                '</div>'+
                '<span class="individualComment" itemprop="name">'+item.comment+'</span>'+
                '<div class="smallRatingDiv" itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">'+
                '<div>'+ // Rating Block
                Array(Math.floor(item.rate)).fill(2).map((item_U, index_U) => (
                  "<span data='"+item.rate+"' class='fa fa-star fa-1x commentrates' />"
                )).join('')+
                '</div>'+ // Rating Block Ends
                '<div>'+
                '<meta itemprop="worstRating" content="'+item.rate+'" />'+
                '<span itemprop="ratingValue">'+item.rate+'</span>/<span itemprop="bestRating">5</span>stars'+
                '</div></div></div>'+
                '<div class="DateX">'+
                '<meta itemprop="datePublished" content="'+item.datePublished+'" />'+
                '<span itemprop="datePublished">'+item.datePublished+'</span>'+
                '</div></div></div>'
              )).join('');
              res.render('comments', {comments: comments});
      });
});

app.get('/product/:id', function (req, res) {
  const sql = "SELECT all_products.id AS product_ID, all_products.title AS productname,all_products.about AS description, all_products.manufacturer AS manufacturer, SUM(product_review.likes) AS likes, SUM(product_review.dislikes) AS dislikes, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'trending_up' ELSE 'trending_down' END AS `trend`, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Up' ELSE 'Down' END AS `trend_direction`," +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'sentiment_very_satisfied' ELSE 'sentiment_very_dissatisfied' END AS `sentiment`, " +
          "CASE WHEN (product_review.likes) > (product_review.dislikes) THEN 'Good' ELSE 'Bad' END AS `sentiment_mood`, " +
          "COUNT(product_review.user_comments) AS usercomments, AVG(product_review.rating) AS rating, " +
          "GROUP_CONCAT(" +
		           "CONCAT_WS('#', product_review.likes, product_review.dislikes, product_review.rating, product_review.user_comments, product_review.user_location_lat, product_review.user_location_lon, product_review.date)" +
	        ") AS fullcomments," +
          "all_products.price AS price, COUNT(`user_location_lat`) + COUNT(`user_location_lon`) AS locationcount, " +
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
            const block = '<div class="productWrapper">';
            const block2 = result.map((item, index) => (
              '<div class="aboutProduct">'+ // aboutproduct DIV Begins
              '<div class="product">'+ // product DIV begins
              '<div class="productDisplay">'+ // productDisplay DIV Begins
              '<div class="productInner" itemscope itemtype="http://schema.org/Product">'+ // productInner DIV Begins
              '<div class="goback">'+ // GoBack DIV Starts
                '<a href="/" title="Go Back">'+
                      '<button type="button" class="btn btn-success navbar-btn">'+
                          '<span class="fa fa-chevron-left"></span>'+
                      '</button>'+
                '</a>'+
              '</div>'+ // GoBack DIV Ends
              '<div>'+ // productpageTitle Div Begins
              '<span class="productpageTitle" itemprop="name">'+item.productname+'</span>'+
              '</div>'+ // productpageTitle Div Ends
              '<div class="productpagebTagCategory" itemprop="category" itemscope itemtype="http://schema.org/text">'+ // productpagebTagCategory Begins
              item.category.toUpperCase() +
              '</div>'+ // productpagebTagCategory Ends
              '<div class="productpagebTag">BY</div>'+
              '<div class="productpagebTag" itemprop="manufacturer" itemscope itemtype="http://schema.org/organization">' +
              item.manufacturer.toUpperCase() +
              '</div>'+ // productpagebTag Ends
              '<div class="productImageProductPageWrapper">' + // productImageProductPageWrapper Starts
              '<img class="productImage" itemprop="image" src="'+item.productImage_2+'" alt="'+item.productname+'" title="'+item.productname+'" />'+
              '</div>'+ // productImageProductPageWrapper Ends
              '<div class="middleRowStarAndIcons">'+ // Middle Row Star And Icons DIV Starts
              '<div class="mainRatingOnProductPage" id="mainRatingOnProductPage">'+
              Array(Math.floor(item.rating)).fill(2).map((item_U, index_U) => (
                "<span style='font-size:38px;color:red;' data='"+item.rating+"' class='fa fa-star ratesPage' />"
              )).join('')+
              '</div>'+ // mainRatingOnProductPage DIV Ends
              '<div class="otherIconsOnProductPage">'+ // otherIconsOnProductPage Div Begins
              '<div class="cardTitleChildExtendProductPage">'+ // cardTitleChildExtendProductPage Div Begins
              '<div class="cardTitleInnerExtendedChildrenProductPage">'+ // cardTitleInnerExtendedChildrenProductPage Begins
              '<a href="#" class="btn btn-success btn-sm">'+
              '<span class="fa fa-thumbs-up fa-1x"></span>'+
              '</a>'+
              '<div class="textBelowRatingsProductPage">'+item.likes+'</div>'+
              '</div>'+ // cardTitleInnerExtendedChildrenProductPage Ends
              '<div class="cardTitleInnerExtendedChildrenProductPage">'+ // cardTitleInnerExtendedChildrenProductPage Begins
              '<a href="#" class="btn btn-danger btn-sm">'+
              '<span class="fa fa-thumbs-down fa-1x"></span>'+
              '</a>'+
              '<div className="textBelowRatingsProductPage">'+item.dislikes+'</div>'+
              '</div>'+ // cardTitleInnerExtendedChildrenProductPage Ends
              '<div class="cardTitleInnerExtendedChildrenProductPage">'+ // cardTitleInnerExtendedChildrenProductPage Begins For Trend
              '<div style=""><span><i class="material-icons md-36" style="">'+item.trend+'</i></span><div class="textBelowRatingTrends">'+item.trend_direction+'</div></div>'+
              '</div>'+ // cardTitleInnerExtendedChildrenProductPage Ends For Trend
              '<div class="cardTitleInnerExtendedChildrenProductPage">'+ // cardTitleInnerExtendedChildrenProductPage Begins For Sentiment
              '<div><span><i class="material-icons md-36" style="color:red">'+item.sentiment+'</i></span><div class="textBelowRatingSentiment">'+item.sentiment_mood+'</div></div>'+
              '</div>'+ // cardTitleInnerExtendedChildrenProductPage Ends For Sentiment
              '<div class="cardTitleInnerExtendedChildrenProductPage">'+ // cardTitleInnerExtendedChildrenProductPage Begins For Share
              '<div><span><i class="material-icons md-36" style="">share</i></span><div class="textBelowRatingSentiment">Share</div></div>'+
              '</div>'+ // cardTitleInnerExtendedChildrenProductPage Ends For Share
              '</div>'+ // cardTitleChildExtendProductPage Div Ends
              '</div>'+ // otherIconsOnProductPage Div Ends
              '</div>'+ // Middle Row Star And Icons DIV Ends
              '<div class="cl"></div>'+
              '<div class="ratingDiv" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">'+ // ratingDiv Div Begins
              '<span class="ratingVal" itemprop="ratingValue">'+
              parseFloat(item.rating.toFixed(1)) +
              ' / 5 stars</span><br />'+
              '<span class="numofCustReviews" itemprop="reviewCount">'+item.usercomments+'</span> <span class="numofCustReviews" style=margin-left:14px;""> Customer reviews</span>'+
              '</div>'+ // ratingDiv Div Ends
              '<div class="offers" itemprop="offers" itemscope itemtype="http://schema.org/Offer">'+ // Offers Div Begins
              '<span itemprop="priceCurrency" content="NGN">N</span>'+
              '<span itemprop="price" content="'+item.price+'">'+item.price+'</span>'+
              '<link itemprop="availability" href="http://schema.org/InStock" />'+
              '</div>'+ // Offers Div Ends
              '<div class="cl"></div>'+
              '<div class="productdescriptionProductPage">'+ // productdescriptionProductPage Begins
              '<div itemprop="description">'+item.description.toUpperCase()+'</div>'+
              '</div>'+ // productdescriptionProductPage Ends
              '<div class="cl"></div>'+
              '<div class="productdescriptionProductPage">'+ // productdescriptionProductPage Begins
              '<font class="ingredientsFontsTitleProductPage">Ingredients:-</font>'+
              item.ingredients.toUpperCase()+
              '</div>'+ // productdescriptionProductPage Ends
              '<div class="cl"></div>'+
              '<div>'+ // Customer Reviews Enclosing Starts
              '<div class="customerreviews" id="customerreviews" data="'+item.product_ID+'">'+
              item.fullcomments.split(",").map((item_U, index_U) => (
                '<div class="aboutProductComments" itemprop="review" itemscope itemtype="http://schema.org/Review">'+
                '<div class="individualUserAvatarAndName">'+
                '<div class="avatar">'+
                '<img src="https://asknigeria.com.ng/brands/images/blank_boy.png" width="30" height="30" />'+
                '</div>'+
                '<div class="UserAndComment">'+
                '<div>'+
                '<span class="individualComment" itemprop="author"><b>Anonymous</b></span>'+
                '</div>'+
                '<span class="individualComment" itemprop="name">'+item_U.split("#")[3]+'</span>'+
                '<div class="smallRatingDiv" itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">'+
                '<div>'+ // Rating Block
                Array(Math.floor(item_U.split("#")[2])).fill(2).map((item_UX, index_UX) => (
                  "<span data='"+item_U.split("#")[2]+"' class='fa fa-star fa-1x commentrates' />"
                )).join('')+
                '</div>'+ // Rating Block Ends
                '<div>'+
                '<meta itemprop="worstRating" content="'+item_U.split("#")[2]+'" />'+
                '<span itemprop="ratingValue">'+item_U.split("#")[2]+'</span>/<span itemprop="bestRating">5</span>stars'+
                '</div></div></div>'+
                '<div class="DateX">'+
                '<meta itemprop="datePublished" content="'+new Date(item_U.split("#")[6])+'" />'+
                '<span itemprop="datePublished">'+new Date(item_U.split("#")[6])+'</span>'+
                '</div></div></div>'
              )).join('')+
              '</div>'+
              '</div>'+ // Customer Enclosing DIV Ends
              '</div>'+ // productInner DIV Ends
              '</div>'+ // productDisplay DIV Ends
              '</div>'+ // product DIV Ends
              '</div>'+ // End of About Product aboutproduct DIV
              '<div class="aboutCompetitor">'+ // About Competitor Begins
              '<div class="card">'+ // Product Review Likes Starts
              '<div class="card-header text-white bg-primary" toggle="collapse" data-target="#productsreviewlikes" aria-expanded="true" aria-controls="productsreviewlikes">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#productsreviewlikes">'+
              '<i class="fa fa-caret-right"></i> '+item.productname+' , '+item.firstCompetition+' and '+item.secondCompetition+' Likes Chart'+
              '</a></div><div class="card-block collapse in" data="'+item.productname+','+item.firstCompetition+','+item.secondCompetition+'" id="productsreviewlikes"></div>'+
              '</div>'+ // Product Review Likes Ends
              '<div class="card">'+ // Product Review DisLikes Starts
              '<div class="card-header text-white bg-danger" toggle="collapse" data-target="#productsreviewdislikes" aria-expanded="true" aria-controls="productsreviewdislikes">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#productsreviewdislikes">'+
              '<i class="fa fa-caret-right"></i> '+item.productname+' , '+item.firstCompetition+' and '+item.secondCompetition+' Dislikes Chart'+
              '</a></div><div class="card-block collapse in" data="'+item.productname+','+item.firstCompetition+','+item.secondCompetition+'" id="productsreviewdislikes"></div>'+
              '</div>'+ // Product Review DisLikes Ends
              '<div class="card">'+ // Product Review Ratings Starts
              '<div class="card-header text-white bg-success" toggle="collapse" data-target="#productsreviewrating" aria-expanded="true" aria-controls="productsreviewrating">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#productsreviewrating">'+
              '<i class="fa fa-caret-right"></i> '+item.productname+' , '+item.firstCompetition+' and '+item.secondCompetition+' Ratings Chart'+
              '</a></div><div class="card-block collapse in" data="'+item.productname+','+item.firstCompetition+','+item.secondCompetition+'" id="productsreviewrating"></div>'+
              '</div>'+ // Product Review Ratings Ends
              '<div class="card">'+ // Product Competitors Block Starts
              '<div class="card-header text-white bg-warning" toggle="collapse" data-target="#competitorsview" aria-expanded="true" aria-controls="competitorsview">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#competitorsview">'+
              '<i class="fa fa-caret-right"></i> Competitors and Markets'+
              '</a></div>'+ // End of panel-heading DIV
              '<div class="card-block collapse in" id="competitorsview">'+
              '<div data="'+item.firstCompetition+'" id="firstCompetitor"></div>'+ // First Competitor Div Block
              '<div data="'+item.secondCompetition+'" id="secondCompetitor"></div>'+ // Second Competitor Div Block
              '</div>'+ // End of competitorsview DIV
              '</div>'+ // Product Competitors Block Ends
              '<div class="card">'+ // Area Acceptance Map Begins
              '<div class="card-header text-white bg-info" toggle="collapse" data-target="#AreaAcceptanceMapElem" aria-expanded="true" '+
              ' aria-controls="AreaAcceptanceMapElem">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#AreaAcceptanceMapElem">'+
              '<i class="fa fa-caret-right"></i> Strength Area Acceptance Map - 2.5 Stars and Above'+
              '</a></div>'+
              '<div data="'+item.product_ID+'" class="card-block collapse in" id="AreaAcceptanceMapElem">'+ // Map Acceptance Card Body Block
              '<div id="mapstoreacc" style="height: 300px">'+
              '</div>'+ // reaAcceptanceMapElem Div Body Ends
              '</div>'+ // Map Acceptance Card Body Block Ends
              '</div>'+ // Area Acceptance Map Ends
              '<div class="card">'+ // Area Rejection Map Begins
              '<div class="card-header text-white bg-info" toggle="collapse" data-target="#AreaRejectionMapElem" aria-expanded="true" '+
              ' aria-controls="AreaRejectionMapElem">'+
              '<a data-toggle="collapse" class="panelanchortext" href="#AreaRejectionMapElem">'+
              '<i class="fa fa-caret-right"></i> Weak Area Rejection Map - 2.5 Stars and Below'+
              '</a></div>'+
              '<div data="'+item.product_ID+'" class="card-block collapse in" id="AreaRejectionMapElem">'+ // Map Rejection Card Body Block Begins
              '<div id="mapstorerej" style="height: 300px">'+
              '</div>'+ // AreaRejectionMapElem Ends
              '</div>'+ // Map Rejection Card Body Block Ends
              '</div>'+ // Area Rejection Map Ends
              '</div>'+ // About Competitor Ends
              '</div>' // End of Product Wrapper
            )).join('');
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
            const keywords = result.map((item, index) => ("<meta name=\"keywords\" content=\""+item.productname+","+item.firstCompetition+","+item.secondCompetition+"\">")).join(',');
            res.render('product',
            {
              con: block + block2,
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
