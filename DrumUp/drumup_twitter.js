//This code belongs to DrumUp
// @author: Santhosh Raj M  https://github.com/santhoshraj2960
// Demo: DrumUp Extension

$(document).ready(function(){
	$(body).addClass('drumup-added')
	url = '';
	title = $('#status').val();
	title = encodeURIComponent(title);
	extn_img = chrome.extension.getURL("images/drumup_logo_ninja.png");
	redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+title;
	//button = '<button><a class="button_drumup" id="schedule_post" target="_blank" style="font-weight:700; color: #fff;margin-left: 5px; background: #BB4C33;border-color: #BB4C33; text-decoration: none; padding: 8px 10px 8px; border: 1px solid #BB4C33; border-radius: 4px;" href="https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&story_title='+title+'&redirect_url='+redirect_url+'">Schedule</a></button>';
	button = '<button><a target = "_blank" class="button_drumup_share" id="schedule_post" style="font-weight:700; color: #fff;margin-left: 5px; background: #BB4C33 ;border-color: #BB4C33 ; text-decoration: none; padding: 8px 10px 8px; border: 1px solid #BB4C33 ; border-radius: 4px;" href=https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&story_title='+title+'&redirect_url='+redirect_url+'> Schedule </a></button>';
	if ($("fieldset").eq(1).children().first().attr('id') == 'char-count' ){
		$("fieldset").eq(1).append(button);
		document.getElementById('status').addEventListener('input', function() {
			title = $('#status').val()
			title = encodeURIComponent(title)
			redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+title;
			window_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&story_title='+title+'&redirect_url='+redirect_url+''
			$('.button_drumup_share').attr('href', window_url)
		})	
	}
	else if($("fieldset").children().first().attr('id') == 'char-count'){
		$("fieldset").eq(0).append(button);
		document.getElementById('status').addEventListener('input', function() {
			title = $('#status').val()
			title = encodeURIComponent(title)
			redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+title;
			window_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&story_title='+title+'&redirect_url='+redirect_url+''
			$('.button_drumup_share').attr('href', window_url)
		})	
	}
	else{
		title = $(".ProfileTweet-actionList").parent().parent().find('.tweet-text').text();
		div_element = '<div class="ProfileTweet-action ProfileTweet-action--buffer js-toggleState drumup_div"><div class="IconContainer js-tooltip" data-original-title="Schedule via Drumup"><span class="Icon Icon--retweet"></span><span class="u-hiddenVisually">Schedule via Drumup</span><button id="share_tweet" class="Icon--drumup ProfileTweet-actionButton js-actionButton" style="margin-top: -17px;background-size: 40px 40px;width: 40px;height: 29px;background-repeat: no-repeat;" type="button"></div><div class="IconContainer js-tooltip"><span class="Icon Icon--circleFill"></span><span class="Icon Icon--circle"></span><span class="Icon Icon--b Ico"></span><span class="u-hiddenVisually">Buffer</span></div></button></div>';
		$(div_element).insertAfter('.ProfileTweet-action--retweet');
		button_element = '<a class="button_drumup btn schedule_custom_tweet"  id="schedule_custom_twe" style="margin-right: 6px; color: #fff;background: #BB4C33;border-color: #BB4C33;padding: 8px 8px 8.4px !important">Schedule</a>'
		$('.TweetBoxExtras').css("width", "47%")
        $('.TweetBoxExtras-item').css("margin-right", "-10%")
		//$(".tweet-button:eq(0)").addClass('drumup_appended');
		//$(button_element).insertBefore(".tweet-btn:eq(1)")
		$(".tweet-button").addClass('drumup_appended');
		//$(".tweet-button").append(button_element)
		$(".tweet-button .tweet-action").before(button_element)
        $(".tweet-button .retweet-action").before(button_element)
        
		if (!$('#tweet-box-home-timeline').children().first().text()) {
			$('#schedule_custom_tweet').addClass('disabled');
		}
		else{
			$('#schedule_custom_tweet').removeClass('disabled');
		}
	}

	$('body').on('click', '.button_drumup_share', function(){
		window.close();
	});
	
	document.getElementById('tweet-box-home-timeline').addEventListener('input', function() {
		if (!$('#tweet-box-home-timeline').children().first().text()) {
			$('#schedule_custom_tweet').addClass('disabled');
		}
		else{
			$('#schedule_custom_tweet').removeClass('disabled');
		}
	})
	
	$('body').on('click', '#share_post', function(){
      	chrome.windows.create({url: $(this).attr('href'), type: "popup", width:650, height:560});
  	});
	
	$('body').on('click', '#share_tweet', function(){
		story_title = $(this).parent().parent().parent().parent().parent().find('.tweet-text').text();
		story_title = encodeURIComponent(story_title);
		redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+story_title;
		redirect_url = encodeURIComponent(redirect_url);
		window_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&redirect_url='+redirect_url+'&story_title='+story_title;
		var win = window.open(window_url, '_blank');
  		win.focus();
  	});
	$('body').on('click', '.button_drumup_share', function(){
        title = $('#status').val()
        title = encodeURIComponent(title)
        redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+title;
        window_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&story_title='+title+'&redirect_url='+redirect_url+''
         var win = window.open(window_url, '_blank');
         win.focus();
     });
	
	$('.schedule_custom_tweet').on('click', function(){
		retweet_text = $(this).parent().parent().find('.TweetTextSize').text();
		if($(this).parent().parent().parent().find('.twitter-atreply').parent().length > 1) {
			reply_text = $(this).parent().parent().parent().find('.twitter-atreply').parent()[0].textContent;
		}
		else {
			reply_text = $(this).parent().parent().parent().find('.twitter-atreply').parent().text();
		}
		custom_tweet_title = $(this).parent().parent().parent().find('.tweet-box').text();
		if (reply_text != ''){
			text = reply_text;
		}
	    else if (retweet_text != ''){
	    	text = retweet_text;
	    }
		else if (custom_tweet_title != ''){
			text = custom_tweet_title;
		}
		redirect_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0ampstory_url='+url+'ampstory_title='+encodeURIComponent(text);
		window_url = 'https://drumup.io/render_chrome_extension_story?chrome_story_id=0&story_url='+url+'&redirect_url='+redirect_url+'&story_title='+encodeURIComponent(text);
		var win = window.open(window_url, '_blank');
  		win.focus();
	});
});