 jQuery(document).ready(function() {
	 
 	// Expanded text show hide

	jQuery(".show_more, .show_less").click(function(e){
		e.preventDefault();
		console.log(jQuery(this));
        jQuery(".show_less").toggleClass("show_text");
		jQuery(".show_more").toggleClass("hide_text");
		jQuery(".hide_expand").slideToggle("slow");
    });
 	// Accrodian js
 	jQuery(document).ready(function () {
		jQuery('.accordion-wrapper .btn-wrapper button').click(function(){
            jQuery(this).parent().siblings().slideToggle('slide');
            jQuery(this).parent().parent().toggleClass('active').slideDown("slow");;
            
            jQuery(this).parent().parent().siblings().removeClass('active');
            jQuery(this).parent().parent().siblings().children('.collepsing-div').slideUp("slow");
        });
	});


	//Modal Popup

	jQuery('.play-btn').on('click', function(e) {
		e.preventDefault();
		jQuery('.video-popup').show();
	});
	jQuery('.close-button').on('click', function() {
		jQuery(".video-popup").hide();
	});

	jQuery('.single_detail a.play-btn').on('click', function(){  
		jQuery('.video-popup .modal-content').find('.close-button').on('click',function(){
			 jQuery(this).parents('.video-popup').hide();
		});
		jQuery(document).on('click',function(e){      
			  if(!((jQuery(e.target).closest(".video-popup .modal-content").length > 0 ) || (jQuery(e.target).closest(".single_detail a.play-btn").length > 0))){
				  jQuery(".video-popup").hide();
			  }
		  });
	  });


	//reset all radio buttons
	jQuery("#clearfilter").on("click", function(){
		jQuery("input[type=radio]").prop("checked", false);
		jQuery("input[type=radio]").removeClass('active');
		var clearfilter = 'true';
		telus_fund_projects_filter(lang = false, hsa = false, type = false, audience = false, str = false, page = false, filter = false,clearfilter);
		var destination = jQuery('#catlist') ;
		jQuery('html,body').animate({
			scrollTop: destination.offset().top-100
		},'slow');
	});


	// AJAX Filter
	jQuery('.lang').on('click',function(){
		jQuery('.lang').removeClass('active');
		jQuery(this).addClass('active');
		var lang = jQuery(this).val();
		var hsa = jQuery('.hsa.active').val();
		var type = jQuery('.type.active').val();
		var audience = jQuery('.audience.active').val();
		var page = jQuery('.load-more-btn').attr('data-page');
		var str = jQuery('.search-fl').val();
		var default_language = jQuery('#default_language').val();
		var filter = 'filter';

		telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter, default_language);
	});

	jQuery('.hsa').on('click',function(){
		jQuery('.hsa').removeClass('active');
		jQuery(this).addClass('active');
		var lang = jQuery('.lang.active').val();
		var hsa = jQuery(this).val();
		var type = jQuery('.type.active').val();
		var audience = jQuery('.audience.active').val();
		var page = jQuery('.load-more-btn').attr('data-page');
		var str = jQuery('.search-fl').val();
		var default_language = jQuery('#default_language').val();
		var filter = 'filter';

		telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter, default_language);
	});

	jQuery('.type').on('click',function(){
		jQuery('.type').removeClass('active');
		jQuery(this).addClass('active');
		var lang = jQuery('.lang.active').val();
		var hsa = jQuery('.hsa.active').val();
		var type = jQuery(this).val();
		var audience = jQuery('.audience.active').val();
		var page = jQuery('.load-more-btn').attr('data-page');
		var str = jQuery('.search-fl').val();
		var default_language = jQuery('#default_language').val();
		var filter = 'filter';

		telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter, default_language);
	});

	jQuery('.audience').on('click',function(){
		jQuery('.audience').removeClass('active');
		jQuery(this).addClass('active');
		var lang = jQuery('.lang.active').val();
		var hsa = jQuery('.hsa.active').val();
		var type = jQuery('.type.active').val();
		var audience = jQuery(this).val();
		var page = jQuery('.load-more-btn').attr('data-page');
		var str = jQuery('.search-fl').val();
		var default_language = jQuery('#default_language').val();
		var filter = 'filter';

		telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter, default_language);
	});

	jQuery('.load-more-btn').on('click',function(){
		var lang = jQuery('.lang.active').val();
		var hsa = jQuery('.hsa.active').val();
		var type = jQuery('.type.active').val();
		var audience = jQuery('.audience.active').val();
		var page = jQuery(this).attr('data-page');
		var str = jQuery('.search-fl').val();
		var default_language = jQuery('#default_language').val();
		var filter = 'load-more';

		telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter,clearfilter = false, default_language);
	});

	var typingTimer;
    var doneTypingInterval = 1000;
    var $input = jQuery('.search-fl');

    $input.on('keyup', function(){

        clearTimeout(typingTimer);

        var lang = jQuery('.lang.active').val();
		var hsa = jQuery('.hsa.active').val();
		var type = jQuery('.type.active').val();
		var audience = jQuery('.audience.active').val();
		var page = jQuery('.load-more-btn').attr('data-page');
		var str = jQuery(this).val();
		var default_language = jQuery('#default_language').val();
		var filter = 'search';

        typingTimer = setTimeout(function(){
        	telus_fund_projects_filter(lang, hsa, type, audience, str, page, filter,clearfilter = false, default_language);
        },doneTypingInterval);
    });

    $input.on('keydown',function(){
        clearTimeout(typingTimer);
    });
});


function telus_fund_projects_filter(lang = false, hsa = false, type = false, audience = false, str = false, page = false, filter, clearfilter){
	
	jQuery('#loadingmessage').show();
    jQuery('body').addClass('bodyoverlay');
	if(clearfilter == "true"){
		console.log("filter ajex");
		var dataString  = {
            'all': "all",
			'page' : 0,
			'default_language': jQuery('#default_language').val(),
            'action': 'telus_fund_projects_filter'  
        };
	}else{
		var dataString  = {
            'lang': lang,
            'hsa': hsa,
            'type': type,
            'audience': audience,
            'page': page,
            'str': str,
            'filter': filter,
            'default_language': jQuery('#default_language').val(),
            'action': 'telus_fund_projects_filter' 
        };
	}


    jQuery.ajax({
        type: "POST",
        url: ajax_object.ajax_url,
        data: dataString,
        success: function(data) {
            var json_obj = JSON.parse(data);
			if(clearfilter == "true"){
				jQuery('.category_list').html(json_obj.html);
			}else{
				if(filter == 'load-more'){
					jQuery('.category_list').append(json_obj.html);
				}else{
					jQuery('.category_list').html(json_obj.html);
				}
			}
            
            if(json_obj.page == 'N'){
                jQuery('.load-more-btn').hide();
            } else{
                jQuery('.load-more-btn').show();
                jQuery('.load-more-btn').attr('data-page',json_obj.page);
            }
            jQuery('#loadingmessage').hide();
            jQuery('body').removeClass('bodyoverlay');
        }
    });

}


//Dropdown filters

if(jQuery(window).width() < 767)
{
	jQuery(document).ready(function() {
		jQuery('#filter-title').click(function() {
			jQuery('.dropdown-filter').slideToggle("slow");
		});
		});
}

// project slider
jQuery(document).ready(function(){
	jQuery('.project-slider').slick({
		centerMode: true,
		centerPadding: '400px',
		slidesToShow: 1,
		arrows: true,
		autoplay: true,
		autoplaySpeed: 4000,
		responsive: [
			{
			 breakpoint: 991,
			  settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '100px',
				slidesToShow: 1
			  }
			},
		
			{
			 breakpoint: 776,
			  settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '50px',
				slidesToShow: 1
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '10px',
				slidesToShow: 1
			  }
			}
		  ]
		
	  });
	
});
