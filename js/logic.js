/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
!function(e){var n;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var t=window.Cookies,o=window.Cookies=e();o.noConflict=function(){return window.Cookies=t,o}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function t(o){function r(){}function i(n,t,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},r.defaults,i)).expires&&(i.expires=new Date(1*new Date+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var c=JSON.stringify(t);/^[\{\[]/.test(c)&&(t=c)}catch(e){}t=o.write?o.write(t,n):encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var f="";for(var u in i)i[u]&&(f+="; "+u,!0!==i[u]&&(f+="="+i[u].split(";")[0]));return document.cookie=n+"="+t+f}}function c(e,t){if("undefined"!=typeof document){for(var r={},i=document.cookie?document.cookie.split("; "):[],c=0;c<i.length;c++){var f=i[c].split("="),u=f.slice(1).join("=");t||'"'!==u.charAt(0)||(u=u.slice(1,-1));try{var a=n(f[0]);if(u=(o.read||o)(u,a)||n(u),t)try{u=JSON.parse(u)}catch(e){}if(r[a]=u,e===a)break}catch(e){}}return e?r[e]:r}}return r.set=i,r.get=function(e){return c(e,!1)},r.getJSON=function(e){return c(e,!0)},r.remove=function(n,t){i(n,"",e(t,{expires:-1}))},r.defaults={},r.withConverter=t,r}(function(){})});
/*
// Navigation Logic
$('#navbarMain').on('show.bs.collapse', function () {
    $('#mobileNav').hide();
    $('#site-name').show();
    $("#site-icon").removeClass("site-icon").addClass("site-icon-sm");
});
$('#navbarMain').on('hide.bs.collapse', function () {
    $('#mobileNav').show();
    $('#site-name').hide();
    $("#site-icon").addClass("site-icon").removeClass("site-icon-sm");
});
*/
// Language Set
function setPrimaryPageLanguage(lang) {
    localStorage.setItem("langData", JSON.stringify({ lang: lang, path: ((lang=='en')?'':'/'+lang), fixed: true, lastChanged:moment(new Date())}));
}

// Language Switcher
function pageLangChecker() {
    var pageLang = localStorage.getItem("langData");
    if (!pageLang) return;
    pageLang = JSON.parse(pageLang);
    if (window.location.pathname !== pageLang.path+noLangVersion) window.location.pathname = pageLang.path+noLangVersion;
    if (pageLang.fixed == false) {
        var setIntVal1 = false;
        function setLangInternal() {
            if (typeof setPrimaryPageLanguage === "function") {
                if (setIntVal1 == false) {
                    setPrimaryPageLanguage(pageLang.lang);
                    setIntVal1 = true;
                }
                if (typeof ga === "function") { 
                    ga('send', 'event', { eventCategory: 'Language', eventAction: 'Automatic', eventLabel: lang+' -> '+pageLang.lang, eventValue: 0, transport: 'beacon', nonInteraction: true });
                    return true;
                }
                return false;
            } else return false;
        }
        var langIntervalChecker = setInterval(function() { 
            if (setLangInternal() == true) clearInterval(langIntervalChecker);
        }, 1000);
    }
}
pageLangChecker();

// Language Notificator
function pageLangSetup() {
    var pageLang = localStorage.getItem("langData");
    if (!pageLang) {
        var lang = ((window.navigator.languages)?window.navigator.languages[0]:null)||window.navigator.language||window.navigator.browserLanguage||window.navigator.userLanguage;
        if (!lang) return;
        lang = ((lang=='pt-br'||lang==='pt_br')?'br':((lang.indexOf('Hans')!==-1)?'cn':((lang.indexOf('Hant')!==-1)?'zh':((lang.slice(0,2)=='cs')?'cz':((lang.indexOf('-')!==-1)?lang.split('-')[0]:((lang.indexOf('_')!==-1)?lang.split('_')[0]:lang)))))).slice(0,2);
        if (lang == 'en') return localStorage.setItem("langData", JSON.stringify({ lang:'en',path:'',fixed:true,lastChanged:moment(new Date())}));
        var langNotif = document.getElementById('langNotification-'+lang);
        if (langNotif) {
            pageLang = { lang: lang, path: ((lang=='en')?'':'/'+lang), fixed: false, lastChanged:moment(new Date())};
            localStorage.setItem("langData", JSON.stringify(pageLang));
            if (window.location.pathname !== pageLang.path+noLangVersion) window.location.pathname = pageLang.path+noLangVersion;
            else langNotif.style.display = 'block';
        }
    } else {
        pageLang = JSON.parse(pageLang);
        if (pageLang.fixed == false) {
            var langNotif = document.getElementById('langNotification-'+pageLang.lang);
            if (langNotif) langNotif.style.display = 'block';
        }
    }
}
pageLangSetup();

function checkPwa() {
    var pwaData = JSON.parse(localStorage.getItem("pwaData"));
    if (pwaData && pwaData.hasPwa == true) return true;
    return false;
}

function checkSupport() {
    var supportData = JSON.parse(localStorage.getItem("supportData"));
    if (supportData && supportData.supported == true && moment().diff(moment(supportData.lastTime), 'days') < 7) return true;
    return false;
}

// Check if user is Premium
function checkPremium() {
    var premiumUser = Cookies.getJSON('premiumUser');
    if (premiumUser && (premiumUser.id || premiumUser.tag)) return true;
    return false;
}

// Inject Notification SDK
function sendNotificationAttributes() {
    webpushr('attributes', {lang: lang, premium: checkPremium(), pwa: checkPwa(), code: checkSupport()});
}

// Check for excludability
function checkExcludability() {
    if (checkPremium() == true) return true;
    return excludedFromLoading;
}

function getCache(key) {
    var apiStorage = localStorage.getItem("apiStorage");
    if (!apiStorage) apiStorage = {};
    else apiStorage = JSON.parse(apiStorage);

    if (apiStorage[key]) {
        if (moment() > moment(apiStorage[key].expires)) {
            removeCache(key);
            return null;
        }
        return apiStorage[key].data;
    }
    return null;
}

function setCache(key, data, timeVal = 5, timeKey = 'm') {
    var apiStorage = localStorage.getItem("apiStorage");
    if (!apiStorage) apiStorage = {};
    else apiStorage = JSON.parse(apiStorage);

    apiStorage[key] = {
        expires: moment().add(timeVal, timeKey),
        data: data
    };
    localStorage.setItem("apiStorage", JSON.stringify(apiStorage));
    return data;
}

function removeCache(key) {
    var apiStorage = localStorage.getItem("apiStorage");
    if (!apiStorage) apiStorage = {};
    else apiStorage = JSON.parse(apiStorage);

    delete apiStorage[key];
    localStorage.setItem("apiStorage", JSON.stringify(apiStorage));
    return null;
}

function apiFetch(path, auth = true) {
    return new Promise(async resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.brawlapi.com/'+path, true);
        if (auth && apiKey) xhr.setRequestHeader('Authorization', apiKey);
        xhr.timeout = 15000;
        xhr.send();
        xhr.onreadystatechange = processRequest;
        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    response.statusCode = xhr.status;
                    if (response && response.error !== true) {
                        // Valid response
                        return resolve(response);
                    } else {
                        // Failed to get data. Invalid server response!;
                        return resolve(response);
                    }
                } catch (e) {
                    return resolve({status:'err',statusCode:1});
                }
            } else if (xhr.readyState == 4) {
                // Failed to get data. Check your internet connection!;
                return resolve({status:'err',statusCode:0});
            }
        }
    });
}

function getStrings(lang = 'en') {
    return new Promise(async resolve => {
        let data = await apiFetch('v1/translations/'+lang, false);
        return resolve(data);
    });
}

// Load strings
async function loadStrings() {
    var stringData = await getStrings(lang);
    if (stringData && stringData.hasOwnProperty('statusCode') && stringData.statusCode == 200) strings = stringData.strings;
    return stringData.strings;
}
loadStrings();

function premiumRemoval() {
    Array.from(document.getElementsByClassName('vm-placement')).forEach(i=>{i.remove();});
    Array.from(document.getElementsByClassName('vm-skin')).forEach(i=>{i.remove();});
    Array.from(document.getElementsByClassName('vm-footer')).forEach(i=>{i.remove();});
    Array.from(document.getElementsByClassName('adsbygoogle')).forEach(i=>{i.remove();});
    Array.from(document.getElementsByClassName('vm-b1')).forEach(i=>{if(!i.classList||!i.classList.contains('w-100'))i.remove();else i.classList.remove('vm-b1');});
    Array.from(document.getElementsByClassName('vm-b2')).forEach(i=>{if(!i.classList||!i.classList.contains('w-100'))i.remove();else i.classList.remove('vm-b2');});
    var vnmadtag = document.getElementById('vnmadtag');
    if (vnmadtag) vnmadtag.remove();
    var premString = document.getElementById('premiumStringItem');
    if (premString) premString.style.display = 'none';
    return true;
}

function vmLogic() {
    window.top.__vm_add = window.top.__vm_add || [];
    (function(success) {if(window.document.readyState !== "loading")success();else window.document.addEventListener("DOMContentLoaded",function(){success();});})
    (function(){
        var b1 = document.querySelectorAll("div.vm-b1");
        var b2 = document.querySelectorAll("div.vm-b2");
        var b3 = document.querySelectorAll("div.vm-b3");
        for (var i = 0; i < b1.length; i++) {
            var vmb = document.createElement("div");vmb.setAttribute("class", "vm-placement");vmb.setAttribute('data-display-type', 'hybrid-banner');
            if(window.innerWidth>=970) vmb.setAttribute("data-id", "6017d58cfe24b76bfed2654b");
            else vmb.setAttribute("data-id", "6017d59bfe24b76bfed2654d");
            b1[i].appendChild(vmb);
            window.top.__vm_add.push(vmb);
        }
        for (var i = 0; i < b2.length; i++) {
            var vmb = document.createElement("div");vmb.setAttribute("class", "vm-placement");
            if (window.innerWidth>=970) vmb.setAttribute("data-id", "6017d96135df310fc2d5f190");
            else vmb.setAttribute("data-id", "6017d5c235df310fc2d5f18d");
            b2[i].appendChild(vmb);
            window.top.__vm_add.push(vmb);
        }
        for (var i = 0; i < b3.length; i++) {
            var vmb = document.createElement("div");vmb.setAttribute("class", "vm-placement");
            if(window.innerWidth>=970) vmb.setAttribute("data-id", "6017d58cfe24b76bfed2654b");
            else vmb.setAttribute("data-id", "6017d59bfe24b76bfed2654d");
            b3[i].appendChild(vmb);
            window.top.__vm_add.push(vmb);
        }
    });
}

if (checkExcludability() == true) premiumRemoval();
else vmLogic();

async function checkAdBlocker() {
    let isBlocked;

    async function tryRequest() {
        try {
            return fetch(new Request("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {method:'HEAD',mode:'no-cors'})).then(function(response) {
                    isBlocked = false;
                    return isBlocked;
                }).catch(function(e) {
                    isBlocked = true;
                    return isBlocked;
                });
        } catch (error) {
            console.log(error);
            isBlocked = true;
            return isBlocked;
        }
    }

    return isBlocked !== undefined ? isBlocked : await tryRequest();
}

function handleBlocker(isBlocking) {
    if (typeof ga === "function") ga('send', 'event', { eventCategory: 'Ad Block', eventAction: ((isBlocking)?'Blocking':'Allowed'), eventLabel: lang, eventValue: 0, transport: 'beacon', nonInteraction: true });
}

// Run Services
window.addEventListener('load', async () => {
    if (checkExcludability() == true) premiumRemoval();
    else handleBlocker((await checkAdBlocker()));

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/cache.js").then(reg => {
            reg.update();
        }).catch(e => console.log(e));
    }
    sendNotificationAttributes();
});

// Prettify URL
function checkUrl(){ window.location.pathname!==decodeURIComponent(window.location.pathname)&&window.history.replaceState({},null,decodeURIComponent(window.location.pathname))}checkUrl();

// Custom Share handler
if ('share' in navigator) {
    var customShare = document.getElementById('customShare');
    if (customShare) {
        customShare.style.display = 'inline-block';
        customShare.onclick = async () => {
        try {
            navigator.share({
                title: strings['layout_website_title'],
                text: strings['layout_footer_social_included_message'],
                url: document.URL,
            })
            .then(() => ga('send', 'event', { eventCategory: 'Share', eventAction: 'Custom', eventLabel: 'success', eventValue: 0, transport: 'beacon' }))
            .catch((e) => ga('send', 'event', { eventCategory: 'Share', eventAction: 'Custom', eventLabel: 'fail', eventValue: 0, transport: 'beacon' }));
        } catch (err) {
            ga('send', 'event', { eventCategory: 'Share', eventAction: 'Custom', eventLabel: 'error', eventValue: 0, transport: 'beacon' });
        }
        };
    }
}