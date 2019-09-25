//This code belongs to DrumUp
// @author: Santhosh Raj M  https://github.com/santhoshraj2960
// Demo: DrumUp Extension
//background.js will run in the background once a page loads and will batch a small icon along with the extension

tab_stories = {};
story_hashtag = {}



chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if ((msg.from === 'content') && (msg.subject === 'showBatch')) {
        chrome.browserAction.setIcon({path : "images/side_drum_dark.png", tabId: sender.tab.id});
      }
  });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.method == "gettabstories"){
    sendResponse(tab_stories);
    //alert(value);
    return true;
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.subject == "updatetabstories"){
   if (!tab_stories[message.key]) {
        tab_stories[message.key] = message.post_objects
    }
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.method == "getFirstStoryHashtag"){
    sendResponse(story_hashtag);
    //alert(value);
    return true;
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.subject == "updateFirstStoryHashtag"){
   if (!story_hashtag[message.key]) {
        story_hashtag[message.key] = message.post_objects
    }
  }
});
/*chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  console.log('background.js tab id ')
  current_tabId = tabs[0].id;
  console.log('background.js tab id ', current_tabId)
//  chrome.browserAction.setIcon({path : "images/icon128.png",tabId: sender.tab.id});
  chrome.browserAction.setBadgeText({ text: 'he',tabId: current_tabId });
  console.log('batch has been set')
})*/
