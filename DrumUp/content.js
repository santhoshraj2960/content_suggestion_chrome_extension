//This code belongs to DrumUp
// @author: Santhosh Raj M  https://github.com/santhoshraj2960
// Demo: DrumUp Extension

/* Inform backgrund page on loading of new tab */
//when ever a page loads with specifications mentioned in manifest.json file, we will send a message with below data.



var metas = document.getElementsByTagName('meta');
var body = document.getElementsByTagName('body');
var get_descr = '';
var post_descr = '';
var get_keywords = '';


get_descr += document.title;

for (var x=0,y=metas.length; x<y; x++) {
        if (metas[x].name.toLowerCase() == "keywords") {
            get_keywords += metas[x].content;
        }
        if (metas[x].name.toLowerCase() == "news_keywords") {
            get_keywords += metas[x].content;
        }
        if(metas[x].name.toLowerCase() == "description") {
            get_descr += ' ' + metas[x].content;
            post_descr = metas[x].content;
        }
        if(metas[x].name.toLowerCase() == "content") {
            get_descr += ' ' + metas[x].content;
        }
}

get_descr += ' ' + body[0].innerText

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.text && (msg.text == "report_back")) {
      sendResponse({
        'full_description': get_descr,
        'keywords': get_keywords,
        'post_desc': post_descr,
        'page':body});
      return true;
    }
});


chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showBatch',
});


/*
Here is the flow of events everytime a page loads:
1.content.js recognises when a page loads and sends this messasge to background.js with 'showPageAction' as subject.
2.background.js listens the message and execute the script getPageSource.js and gets keywords and text from the script.
  Then makes a ajax call to the server with keywords (if not present sends text).After getting the data as an object for a particular tab(works fine for mutiple tabs at same time) 
  we save it and will change the color of icon and display the numbber of articles we got.
3.Once a user clicks on the extension icon in chrome, we will send a message to background.js with "getWord" to get the loaded data for that tab(as this popup.js is executed only on the click of icon)
  Then we will listen it in background.js and send the data for the particular tab.
4.Once we got the data from background.js to popup.js , we will inject the html lines to popup.html file and show them in the popup window.


*/
