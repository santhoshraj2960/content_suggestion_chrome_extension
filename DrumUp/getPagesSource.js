//This code belongs to DrumUp
// @author: Santhosh Raj M  https://github.com/santhoshraj2960
// Demo: DrumUp Extension


/*

function DOMtoString(document_root) {
    var html = '',txt='',lol='',description='',
        node = document_root.firstChild;
    txt=document_keywords();
    description=document_description();
    var paragraphs = document.getElementsByTagName("p");
    for(var i = 0; i < paragraphs.length; i++)
    {
        lol += paragraphs[i].innerHTML;   //gets almost all the text available
    }
    var map = { keywords: txt, text: document.title+' '+description+' '+lol
    };
    return map;
}


//function to get keywords of the page if any
function document_keywords(){
    var keywords = '';
    var metas = document.getElementsByTagName('meta');

    for (var x=0,y=metas.length; x<y; x++) {
        if (metas[x].name.toLowerCase() == "keywords" || metas[x].name.toLowerCase() == "news_keywords") {
            keywords += metas[x].content;
        }
    }
    return keywords != '' ? keywords : '';
}


//function to get description of the page if any
function document_description(){
    var keywords = '';
    var metas = document.getElementsByTagName('meta');

    for (var x=0,y=metas.length; x<y; x++) {
        if (metas[x].name.toLowerCase() == "description") {
            keywords += metas[x].content;
        }
    }
    return keywords != '' ? keywords : '';
}

//alert(document.getElementsByName('description')[0].content);

var html=DOMtoString(document);                    //calling the function to get keywords and text
html                                               //Last line of the js file will be sent as callback to the function to be executed next in background.js


*/