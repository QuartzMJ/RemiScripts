// ==UserScript==
// @name         DanbooruOnclickDownloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Remi
// @match        https://danbooru.donmai.us/*
// @grant        none
// @icon         https://danbooru.donmai.us/packs/static/images/danbooru-logo-128x128-ea111b6658173e847734.png
// @run-at       document-ready
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    function download(url, filename) {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                let blob = xhr.response;
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
            }
            if (xhr.status === 404 & url.indexOf("jpg") == -1) {
                let newUrl = url.replace("png", "jpg");
                console.log("retry");
                download(newUrl, filename)
            }
        };
        xhr.send();
    }

    let picContainers = $('.post-preview-link');

    for (let container of picContainers) {

        let parentNode = $(container).parents().eq(1);
        let btn = $('<button><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Download-Icon.png/800px-Download-Icon.png" jsaction="load:XAeZkd;" jsname="HiaYvf" class="n3VNCb pT0Scc KAlRDb" alt="File:Download-Icon.png - Wikimedia Commons" data-noaft="1" style="width: 18px; height: 18px; margin: 0px;"></button>');
        btn.css({'text-align': 'center'});
        parentNode.children().last().empty();
        parentNode.children().last().append(btn);

        let pic = $(container).find("img");
        if(typeof pic === "undefined"){
            console.log(count);
            console.log("undefined"); 
        }else{
            let picOriginalLink = pic.attr("src");
            let prefix = picOriginalLink.substring(0, 22);
            let suffix = picOriginalLink.substring(30);
            let picLink = prefix + suffix;
            let link = picLink.replace("jpg", "png");

            let tags = pic.attr('title');
            let filename = tags.substring(0, 200);
            console.log("link: " + link);
            console.log("tags: " + tags);
            btn.click(function(event){
                event.stopPropagation();
                download(link,filename);
            });
        }

    }
})();