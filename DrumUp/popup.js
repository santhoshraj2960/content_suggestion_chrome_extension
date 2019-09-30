//This code belongs to DrumUp
// @author: Santhosh Raj M  https://github.com/santhoshraj2960
// Demo: DrumUp Extension


//once the icoon is clicked , we will send a message to background.js asking for loaded data from server saved there.

tab_story = {}
no_posts = false;
not_registered_user = false;
var page_body = [];
var array_out = [];

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    current_url = tabs[0].url;
    current_title = tabs[0].title;
    current_description = '';
    current_tabId = tabs[0].id;
    hashtags = '';
    key = current_tabId+current_url;
    full_description = '';
    keywords = '';

    chrome.runtime.sendMessage({method:"getFirstStoryHashtag"},function(response){
        first_story_hashtags = response;
        if (Object.size(response) > 0 ){
          first_story_hashtags = response;
          }
        else first_story_hashtags={};
        if (first_story_hashtags[current_tabId]){
          current_page_first_story_hashtags = first_story_hashtags[current_tabId];
          }
        else current_page_first_story_hashtags='';
      });
    $('#login-layer').hide();
    $('#timeout-layer').hide();

    chrome.tabs.sendMessage(current_tabId, { text: "report_back" }, function(response) {
        try{
            full_description = response.full_description
            keywords = response.keywords
            page_body = response.page
            current_description += response.post_desc;
            prepare_for_backend_request(current_description, key, current_url, keywords, full_description)
          }
        catch(err) {
          chrome.tabs.executeScript({
          code: 'var metas = document.getElementsByTagName("meta"); \
          var body = document.getElementsByTagName("body"); \
          var get_descr = ""; \
          var post_descr = ""; \
          var get_keywords = ""; \
          for (var x=0,y=metas.length; x<y; x++) { \
              if (metas[x].name.toLowerCase() == "keywords") { \
                  get_keywords += metas[x].content; \
              } \
              if (metas[x].name.toLowerCase() == "news_keywords") { \
                  get_keywords += metas[x].content; \
              } \
              if(metas[x].name.toLowerCase() == "description") { \
                  get_descr += " " + metas[x].content; \
                  post_descr = metas[x].content; \
              } \
              if(metas[x].name.toLowerCase() == "content") { \
                  get_descr += " " + metas[x].content; \
              } \
        }\
        get_descr += " " + body[0].innerText; \
        result = [get_keywords,get_descr,post_descr,body];'
        }, function(result){
                  array_out = result[0];
                  full_description = array_out[1];
                  keywords = array_out[0];
                  page_body = array_out[3];
                  current_description += array_out[2];
                  prepare_for_backend_request(current_description, key, current_url, keywords, full_description)
              });
        }
        
      });

}); 

function prepare_for_backend_request(current_description, key, current_url, keywords, full_description)
{
     if(current_description.length > 125) current_description = current_description.substring(0,124) + '..';
        else current_description = current_description;
        if(current_description == 'undefined') current_description = '';
        key = key + full_description.length;
        chrome.runtime.sendMessage({method:"gettabstories"},function(response){
            tab_stories = response;
            if (Object.size(response) > 0 ){
              tab_stories = response;
              }
            else tab_stories={};
            current_url = encodeURIComponent(current_url);
            if (tab_stories[key]){
              display_stories(tab_stories, key);
              }
            else get_related_stories(keywords, full_description, key)
          });

     //you can do more stuff with array_out here...
}

function get_related_stories(keywords, text, key){
  $('#suggested-posts').html('');
  redirect_url = 'http://****.**/**************';
  redirect_url = encodeURIComponent(redirect_url);
  $('<div id="first_story" style="background-color:#fff;padding:10px;margin:10px;box-shadow:0px 1px 5px 1px #ddd;">').html('<a href="'+encodeURIComponent(current_url)+'" id="post_link" style="text-decoration:none;"><div style="padding:5px;overflow:hidden;margin : -9px"><div style="margin:5px 8px;"><span style="color:#333;font-size: 15px;font-weight:bold;">'+current_title+'</span><br/><p style="color:#666;font-size:14px;margin-top:12px;">'+current_description+'</p></div></a><a href="http://****.**/*********************" id="share_post" style="float:right;margin:0 10px 5px;text-decoration:none;font-size:13px;font-weight:bold;"><button class="btn btn-primary btn-sm" style="background-color:#DC3726; border-color: #DC3726;">Schedule Post</button></a></div>').appendTo('#suggested-posts');
  $('<p id="hang_on_text" style="text-align:center;margin: -5px; margin-bottom:10px; font-weight: bold; padding: 5px; font-size: 16px;">Hang on.. We are fetching related stories..</p>').appendTo('#suggested-posts');
  $('<div id="loader" style="text-align:center;padding:10px;margin:10px;">').html('<i class="fa fa-circle-o-notch fa-spin" style="font-size:22px;"></i>').appendTo('#suggested-posts');
  $.ajax({
          url:"http://******.**/***/********/",
          type: "POST",
          dataType: "json",
          crossDomain:true,
          data: {keywords:keywords, text:text, current_url:current_url, current_title:current_title, token:''},
          error: function(jqXHR, textStatus, errorThrown){
            textStatus = textStatus || 'error'
            if(jqXHR.status == 400){
              $('#loader').hide();
              not_registered_user = false;
              post_objects=[];
              tab_story[key]=post_objects;
              display_stories(tab_story, key);
            }
            else if(textStatus === 'timeout' || textStatus === 'error'){
              $('#loader').hide();
              $('#timeout-layer').show()
              document.getElementById("timeout-text").onclick = function fun() {
              $('#loader').show()
              $('#timeout-layer').hide()
              get_related_stories(keywords, text)
              }
              }
            /*if(textStatus === 'error'){
              $('#loader').hide();
              not_registered_user = false;
              display_stories([], true);
            } */
            else{
              $('#loader').hide();
              not_registered_user = false;
              post_objects=[];
              tab_story[key]=post_objects;
              display_stories(tab_story, key);
            }
          },
          success: function(data) {
            $('#timeout-layer').hide();
            response_code=data.response_code;
            if (response_code == 52){
              not_registered_user = true;
            }
            else not_registered_user = false;
            num_posts=Object.size(data.data);
            if (num_posts == 0){
              no_posts = true;
            }
            else no_posts = false;
            post_objects=data.data;
            hashtags=data.hashtags;
            tab_story[key]=post_objects;
            chrome.runtime.sendMessage({
              from:    'popup',
              subject: 'updatetabstories',
              post_objects: post_objects,
              key: key
            });
            chrome.runtime.sendMessage({
              from:    'popup',
              subject: 'updateFirstStoryHashtag',
              post_objects: hashtags,
              key: current_tabId
            });
            display_stories(tab_story, key);
          },
          timeout:20000
      });
}


function display_stories(tab_stories, key){
  data=tab_stories[key];
  num_posts=Object.size(data);
  if (num_posts == 0){
    no_posts = true;
  }
  
  $('#loader').hide();
  if (not_registered_user){
    //$('#hang_on_text').remove();
    $('#hang_on_text').text('Sign in to schedule posts and see related stories')
    $('#login-layer').show()
  }
  else{
    $('#hang_on_text').remove();
    $('#first_story').remove();
    chrome.runtime.sendMessage({method:"getFirstStoryHashtag"},function(response){
        first_story_hashtags = response;
        if (Object.size(response) > 0 ){
          first_story_hashtags = response;
          }
        else first_story_hashtags={};
        if (first_story_hashtags[current_tabId]){
          current_page_first_story_hashtags = first_story_hashtags[current_tabId];
          }
        else current_page_first_story_hashtags='';
      });
    if (hashtags == ''){
      hashtags=current_page_first_story_hashtags;
    }
    if(!hashtags) hashtags = '';
    title_description = current_title + 'desc:' + current_description
    redirect_url = 'http://****.**/*************'
    redirect_url = encodeURIComponent(redirect_url);
    $('<div style="background-color:#fff;padding:10px;margin:10px;box-shadow:0px 1px 5px 1px #ddd;">').html('<a href="'+encodeURIComponent(current_url)+'" id="post_link" style="text-decoration:none;"><div style="padding:5px;overflow:hidden;margin : -9px"><div style="margin:5px 8px;"><span style="color:#333;font-size: 15px;font-weight:bold;">'+current_title+'</span><br/><p style="color:#666;font-size:14px;margin-top:12px;">'+current_description+'</p></div></a><a href="http://****.**/render_chrome_extension_story?chrome_story_id=0&story_url='+encodeURIComponent(current_url)+'&story_title='+encodeURIComponent(current_title)+'&hashtags='+encodeURIComponent(hashtags.split('#').join(''))+'&redirect_url='+redirect_url+'" id="share_post" style="float:right;margin:0 10px 5px;text-decoration:none;font-size:13px;font-weight:bold;"><button class="btn btn-primary btn-sm" style="background-color:#DC3726; border-color: #DC3726;">Schedule Post</button></a></div>').appendTo('#suggested-posts');
    if (no_posts){
  //        $('<div style="background-color:#fff;padding:10px;margin:10px;box-shadow:0px 1px 5px 1px #ddd;">').html('<a href="'+current_url+'" id="post_link" style="text-decoration:none;"><div style="padding:5px;overflow:hidden;margin : -9px"><div style="margin:5px 8px;"><span style="color:#333;font-size: 15px;font-weight:bold;">'+current_title+'</span><br/><p style="color:#666;font-size:14px;margin-top:12px;">'+current_description+'</p></div></a><a href="http://****.**/?chrome_story_id=0&story_title='+current_title+'&story_url='+current_url+'" id="share_post" style="float:right;margin:0 10px 5px;text-decoration:none;font-size:13px;font-weight:bold;"><button class="btn btn-primary btn-sm" style="background-color:#DC3726; border-color: #DC3726;">Schedule Post</button></a></div>').appendTo('#suggested-posts');
  }
    else{ $('<p style="text-align:center;margin: -5px; font-weight: bold; padding: 5px; font-size: 16px;">You may also be interested in</p>').appendTo('#suggested-posts');
          $.each(data, function(index, item){
            var url=item.url;
            if(url == current_url) return;
            else {
              url_clip=url.split("://").pop().split("/").shift();
              url_clip = url_clip.replace('www.', '');
              var image=item.image_url;
              // injecting the html code to popup.html file.
              if(image == '' || image == null){
                image_box = '';
                span_style = '';
                desc_margin = 'margin-top:5px;';
              }
              else{
                image=image.replace('aso2/_','aso2/s_');
                image_box = '<img src="'+image+'" width="85px">';
                span_style = 'float:left;margin:8px 10px 0 8px;';
                desc_margin = 'margin-top:12px;';
              }
              var description = item.description;
              if(description.length > 20){
                if(description.length > 125) description = description.substring(0,124) + '..';
                else description = description;
                description = description + ' <span style="color:#2952CC">Read more</span>';
              }
              else description = '';
              title = item.title + 'url:' + item.url;
              redirect_url = 'http://****.**/************'
              redirect_url = encodeURIComponent(redirect_url);
              $('<div style="background-color:#fff;padding:10px;margin:10px;box-shadow:0px 1px 5px 1px #ddd;">').html('<a href="'+url+'" id="post_link" style="text-decoration:none;"><div style="padding:5px;overflow:hidden;margin : -9px"><div style="'+span_style+'">'+image_box+'</div><div style="margin:5px 8px;"><span name="'+title_description+'" style="color:#333;font-size: 15px;font-weight:bold;">'+item.title+'</span><br/><span style="color:#aaa;font-size: 13px;">'+url_clip+'</span><br/><p style="color:#666;font-size:14px;'+desc_margin+'">'+description+'</p></div></a><a href="http://****.**/**********" id="share_post" style="float:right;margin:0 10px 5px;text-decoration:none;font-size:13px;font-weight:bold;"><button class="btn btn-primary btn-sm">Schedule Post</button></a></div>').appendTo('#suggested-posts');
            }
          });
          $('<p style="text-align:center;margin: -5px; font-weight: bold; padding: 5px;"><a href="http://****.**/" id="post_link" style="text-decoration:none">See more stories on DrumUp</a></p>').appendTo('#suggested-posts');
        }
    }
}

//function to make the links open in new tab once clicked in popup window.
$(document).ready(function(){
   $('body').on('click', '#post_link', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

   $('body').on('click', '#share_post', function(){
      url = $(this).attr('href');
      chrome.windows.create({url: $(this).attr('href'), type: "popup", width:750, height:620});
      return false;
   });
});


//function to get the TabId of present active tab for which we ot the data from server.
function getCurrentTabID(callback) {
  /*var queryInfo = {
    active: true,
    currentWindow: true
  }; */
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    var tab = tabs[0];
    var tabId = tab.id;
    callback(tabId);
  });
}

//function to get the size of an object.
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
