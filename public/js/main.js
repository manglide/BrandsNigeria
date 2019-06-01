$(document).ready(function() {
	$(".dropdown-button").dropdown({hover: false});
	$(function () {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
      setTimeout(() => {
        ele.classList.add('available')
        setTimeout(() => {
        ele.outerHTML = ''
      }, 2000)
      }, 1000)
    }
	 });
	 $('span.rates').each(function(i, obj) {
		 var rateVal = $(this).attr("data");
		 var rateValMod = rateVal % 1;
		 if(rateValMod !== 0) {
			 if($(this).parent().attr("id") !== undefined) {
				 var pT = document.getElementById($(this).parent().attr("id"));
				 $(pT).append("<span class='fa fa-star-half-full' />");
			 }
		 }
	 });
	 $('span.ratesPage').each(function(i, obj) {
		 var rateVal = $(this).attr("data");
		 var rateValMod = rateVal % 1;
		 if(rateValMod !== 0) {
			 if($(this).parent().attr("id") !== undefined) {
				 var pT = document.getElementById($(this).parent().attr("id"));
				 $(pT).append("<i style='font-size:38px;color:#000;' class='fa fa-star-half-full' />");
			 }
		 }
	 });

	 $('span.commentrates').each(function(i, obj) {
		 var rateVal = $(this).attr("data");
		 var rateValMod = rateVal % 1;
		 if(rateValMod !== 0) {
			 if($(this).parent().attr("id") !== undefined) {
				 var pT = document.getElementById($(this).parent().attr("id"));
				 $(pT).append("<i style='font-size:18px;color:#000;' class='fa fa-star-half-full' />");
			 }
		 }
	 });

	 // Get Data For Like Chart
	 var productsreviewlikes = document.getElementById("productsreviewlikes");
	 var products = $(productsreviewlikes).attr("data").split(/[,]+/).join();
	 makeBarChartHighLikes(products);
	 // Get Data For DisLike Chart
	 var productsreviewdislikes = document.getElementById("productsreviewdislikes");
	 var productsDislikes = $(productsreviewdislikes).attr("data").split(/[,]+/).join();
	 makeBarChartHighDisLikes(productsDislikes);
	 // Get Data For DisLike Chart
	 var productsreviewrating = document.getElementById("productsreviewrating");
	 var productsRating = $(productsreviewrating).attr("data").split(/[,]+/).join();
	 makeBarChartHighRating(productsRating);
	 // Get Data For Competitor 1
	 var firstCompetitor = document.getElementById("firstCompetitor");
	 var comp1data = $(firstCompetitor).attr("data");
	 comp1data = comp1data.trim();
	 if (/\s/.test(comp1data)) {
    	var cleanURL = comp1data.split(/\s/);
			cleanURL = cleanURL.join("-");
			cleanURL = cleanURL.toLocaleLowerCase();
			loadCompetitors1(cleanURL);
	} else {
			comp1data = comp1data.toLocaleLowerCase();
			loadCompetitors1(comp1data);
	}
	 // Get Data For Competitor 1
	 var secondCompetitor = document.getElementById("secondCompetitor");
	 var comp2data = $(secondCompetitor).attr("data");
	 comp2data = comp2data.trim();
	 if (/\s/.test(comp2data)) {
    	var cleanURL2 = comp2data.split(/\s/);
			cleanURL2 = cleanURL2.join("-");
			cleanURL2 = cleanURL2.toLocaleLowerCase();
			loadCompetitors1(cleanURL2);
	 } else {
			comp2data = comp2data.toLocaleLowerCase();
			loadCompetitors1(comp2data);
	 }
	 // Get Data Product ID for Map from Element AreaAcceptanceMapElem
	 var dataAcceptance = document.getElementById("AreaAcceptanceMapElem");
	 var accData = $(dataAcceptance).attr("data");
	 preMapCallAccept(accData);
	 // Get Data Product ID for Map from Element AreaRejectionMapElem
	 var dataRejection = document.getElementById("AreaRejectionMapElem");
	 var rejData = $(dataRejection).attr("data");
	 preMapCallReject(rejData);
	 // Get Recommendation
	 var productsrecommendation = document.getElementById("productsrecommendation");
	 var prRec = $(productsrecommendation).attr("data");
	 prRecommended(prRec);
});
