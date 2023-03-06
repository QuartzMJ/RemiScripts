// ==UserScript==
// @name         danbooruDownloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Remi
// @match        https://danbooru.donmai.us/posts*
// @grant        none
// @icon         https://danbooru.donmai.us/packs/static/images/danbooru-logo-128x128-ea111b6658173e847734.png
// @run-at       document-ready
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    console.log("Working");

    function wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }


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

    setTimeout(async function () {


        let siteUrl = document.URL;
        console.log(siteUrl);
        let picContainers = $('.post-preview-link>picture>img')
        for (let pic of picContainers) {
            let picOriginalLink = pic.src;
            let prefix = picOriginalLink.substring(0, 22);
            let suffix = picOriginalLink.substring(30);

            let picLink = prefix + suffix;
            let link = picLink.replace("jpg", "png");

            let tags = $(pic).attr('title');
            let regex = /\b(\w+\([^)]*granblue_fantasy\))\W*/;
            let match = tags.match(regex);
            if (match != null & (tags.indexOf("girl") !== -1 || tags.indexOf("boy") == -1 ) ) {
                let start = match.index;
                let end = start + match[1].length;

                let charName = tags.substring(start, end);
                let fileName = charName + tags.substring(0, 200);
                pic.setAttribute('download', fileName);
                await wait(2000);
                download(link, fileName);
            } else {
                await wait(500);
            }
        }


        if (siteUrl.indexOf("page") == -1) {
            siteUrl = siteUrl + "&page=2";
            window.location.assign(siteUrl);

        } else {
            let regex = /page=\d*/
            let result = siteUrl.match(regex);
            let matchedString = result[0];
            console.log("Matched: ",matchedString);
            
            let substring = matchedString.substring(5);
            let page = parseInt(substring);
            page = page + 1;

            matchedString = matchedString.substring(0,5) + page;
            console.log("Modified: ",matchedString)
            let newUrl = siteUrl.replace(regex,matchedString);
            console.log("New: ",newUrl);
            window.location.assign(newUrl);
        }


    }, 1000);
})();