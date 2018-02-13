import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import StarRatingComponent from 'react-star-rating-component';
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
    const rendered = content.toString().replace('#con#', options.con);
    return callback(null, rendered);
  });
});
app.set('views', 'views');
app.set('view engine', 'ntl');
app.use(express.static('public'));

function handleRender(val) {
  // Render the component to a string.
  /*
  const html = renderToString(<StarRatingComponent
                  name={'Rating'}
                  starColor="#F60437"
                  emptyStarColor="#000"
                  editing={false}
                  starCount={5}
                  value={4}
                  renderStarIcon={(index, value) => {
                    return <span className={index <= value ? 'fa fa-star' : 'fa fa-star-o'} />;
                  }}
                  renderStarIconHalf={() => <span className="fa fa-star-half-full" />}
                />
  )
  */
  renderFullPage(html);
}

function renderFullPage(html) {
  return `<div>${html}</div>`;
}

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
        "<a href='#' class='card-link'>"+
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
          "<a href='#' class='card-link'>"+
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
      "<div class='mainratingblock'>"+
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
          "<a href='#' class='card-link'>"+
          "<button type='button' class='btn-success btn-sm btn-block'>"+
          "View</button>"+
          "</a>"+
        "</div>"+
      "</div>"+
      "</div></div></div>"
    )).join('');
    res.render('index', {con: block + block1 + '</div>'});
  });
});

app.listen(3838, () => console.log('Example app listening on port 3838!'))
