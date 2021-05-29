const tagCharacters = '0289PYLQGRJCUV';
function isTag(tag) {
    for (var i = 0; i < tag.length; i++)
        if (!tagCharacters.includes(tag[i])) return false;
    return ((tag.length < 3) ? false : true);
}

function showItem(parentName, path, value2, value1, customClass, isTag, statsName, eventVal) {
    var a = document.createElement('a');
    a.title = value1;
    a.href = path;
    a.setAttribute('onclick', "ga('send', 'event', { eventCategory: 'localStorage', eventAction: '" + statsName + "', eventLabel: '" + ((isTag) ? value2 : value1) + "', eventValue: " + eventVal + ", transport: 'beacon' })");
    a.setAttribute('class', 'btn ' + customClass + ' d-flex flex-column mr-1 mt-2 inspectStatsHide');
    var d1 = document.createElement("div");
    d1.setAttribute('class', 'text-center');
    d1.appendChild(document.createTextNode(value1));
    a.appendChild(d1);
    var d2 = document.createElement("div");
    d2.setAttribute('class', 'small text-right text-hp2');
    d2.appendChild(document.createTextNode(((isTag) ? '#' : '') + value2));
    a.appendChild(d2);
    document.getElementById(parentName).appendChild(a);
}

if (localStorage.getItem("savedProfiles")) {
    var profiles = JSON.parse(localStorage.getItem("savedProfiles"));
    for (var i = 0; i < profiles.length; i++) {
        if (profiles[i].tag.startsWith('#')) profiles[i].tag = profiles[i].tag.replace(/#/g, '');
        showItem('saved-players', ((lang=='en')?'':'/'+lang)+'/stats/profile/' + profiles[i].tag, profiles[i].tag, profiles[i].name, 'btn-outline-info', true, 'Profile', i, null);
    }
    localStorage.setItem("savedProfiles", JSON.stringify(profiles));
}

if (localStorage.getItem("savedClubs")) {
    var clubs = JSON.parse(localStorage.getItem("savedClubs"));
    for (var i = 0; i < clubs.length; i++) {
        if (clubs[i].tag.startsWith('#')) clubs[i].tag = clubs[i].tag.replace(/#/g, '');
        showItem('saved-clubs', ((lang=='en')?'':'/'+lang)+'/stats/club/' + clubs[i].tag, clubs[i].tag, clubs[i].name, 'btn-outline-warning', true, 'Club', i);
    }
    localStorage.setItem("savedClubs", JSON.stringify(clubs));
}