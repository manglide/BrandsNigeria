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
				 $(pT).append("<i style='font-size:38px;color:red;' class='fa fa-star-half-full' />");
			 }
		 }
	 });

	 $('span.commentrates').each(function(i, obj) {
		 var rateVal = $(this).attr("data");
		 var rateValMod = rateVal % 1;
		 if(rateValMod !== 0) {
			 if($(this).parent().attr("id") !== undefined) {
				 var pT = document.getElementById($(this).parent().attr("id"));
				 $(pT).append("<i class='fa fa-star-half-full' />");
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
	 loadCompetitors1(comp1data);
	 // Get Data For Competitor 1
	 var secondCompetitor = document.getElementById("secondCompetitor");
	 var comp2data = $(secondCompetitor).attr("data");
	 loadCompetitors2(comp2data);
	 // Get Data Product ID for Map from Element AreaAcceptanceMapElem
	 var dataAcceptance = document.getElementById("AreaAcceptanceMapElem");
	 var accData = $(dataAcceptance).attr("data");
	 preMapCallAccept(accData);
	 // Get Data Product ID for Map from Element AreaRejectionMapElem
	 var dataRejection = document.getElementById("AreaRejectionMapElem");
	 var rejData = $(dataRejection).attr("data");
	 preMapCallReject(rejData);
	 // Append User Comments Template
	 //var comments = document.getElementById("customerreviews");
	 //var productId = $(comments).attr("data");
	 //console.log(productId);
	 //commentsLoad(productId);
});
