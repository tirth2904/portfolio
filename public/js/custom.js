/**
 * Filename: custom.js
 * Student Name:  Tirth Shah
 * Student ID: 301108145
 * Date: 11 OCT 2020
 */
(function() {
	'use strict';

	var portfolioMasonry = function() {
 $('.filters ul li').click(function(){
        $('.filters ul li').removeClass('active');
        $(this).addClass('active');
        
        var data = $(this).attr('data-filter');
        $grid.isotope({
          filter: data
        })
      });


      if(document.getElementById("section-portfolio")){
            var $grid = $(".grid").isotope({
              itemSelector: ".all",
              percentPosition: true,
              masonry: {
                columnWidth: ".all"
              }
            })
      };


	};


	$(function(){
		portfolioMasonry();
	});

	// prevent contact form from submitting
	$('.site-form').on('submit', function(e) {
		e.preventDefault();

		$(this).css('display', 'none');
		let data = $(this).serialize();

		data.split('&').forEach(item => {
			$('#form-data').append(item.replace("=", ': ') + "<br/>");
		});

		$('.form-submitted').css('display', 'block');
	});


})();

