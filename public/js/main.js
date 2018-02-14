$(document).ready(function() {
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
});
