function eventTime(l) {
    var d = Math.floor(l / (3600*24));
    l -= d*3600*24;
    var h = Math.floor(l / 3600);
    l -= h*3600;
    var m = Math.floor(l / 60);
    l -= m*60;
    l = Math.floor(l);
    if (d > 0) return d+strings['time_left_day']+' '+((h>0)?+h+strings['time_left_hour']+' ':"")+m+strings['time_left_minute'];
    else if (h > 0) return h+strings['time_left_hour']+' '+m+strings['time_left_minute'];
    else if (m > 0) return m+strings['time_left_minute'];
    else return strings['time_left_less_than_minute_ago'];
}

function reloadEventData() {
    Array.from(document.getElementsByClassName('event-time')).forEach(item => {
        var t = eventTime(moment.duration(moment.utc(item.dataset.time)-moment.utc()).asSeconds());
        if (moment.utc(item.dataset.time).isBefore()) t = "???";
        item.innerHTML = t;
        if (t == "???") setTimeout(()=>location.reload(), Math.floor(Math.random()*5000)+5000);
    });
    Array.from(document.getElementsByClassName('eventTableTime')).forEach(item => {
        item.innerHTML = moment.utc(item.dataset.updated).fromNow();
    });
}
setInterval(reloadEventData, 60000);

Array.from(document.getElementsByClassName('eventTableOpen')).forEach(item => item.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById(item.dataset.trigger).style.display = "block";
}));

Array.from(document.getElementsByClassName('eventTableClose')).forEach(item => item.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById(item.dataset.trigger).style.display = "none";
}));

Array.from(document.getElementsByClassName('a-hider')).forEach(item => item.addEventListener('click', function(e) {
    e.preventDefault();
    var block = document.getElementById('a'+this.dataset.hide);
    if (block) {
        block.classList.add('d-flex');
        block.classList.remove('d-none');
    }
    var self = document.getElementById('a'+this.dataset.slot);
    if (self) {
        self.classList.add('d-none');
        self.classList.remove('d-flex');
    }
}));

Array.from(document.getElementsByClassName('u-hider')).forEach(item => item.addEventListener('click', function(e) {
    e.preventDefault();
    var block = document.getElementById('u'+this.dataset.hide);
    if (block) {
        block.classList.add('d-flex');
        block.classList.remove('d-none');
    }
    var self = document.getElementById('u'+this.dataset.slot);
    if (self) {
        self.classList.add('d-none');
        self.classList.remove('d-flex');
    }
}));

function showItem(parentName, path, value2, value1, customClass, isTag, statsName, eventVal, onClick) {
    var a = document.createElement('a');
    a.title = value1;
    a.href = path;
    a.setAttribute('onclick', "ga('send', 'event', { eventCategory: 'localStorage', eventAction: '"+statsName+"', eventLabel: '"+((isTag)?value2:value1)+"', eventValue: "+eventVal+", transport: 'beacon' });"+((onClick)?onClick:''));
    a.setAttribute('class', 'btn '+customClass+' d-flex flex-column mr-1 mt-2');
    var d1 = document.createElement("div");
    d1.setAttribute('class', 'text-center');
    d1.appendChild(document.createTextNode(value1));
    a.appendChild(d1);
    var d2 = document.createElement("div");
    d2.setAttribute('class', 'small text-right text-muted');
    d2.appendChild(document.createTextNode(((isTag)?'#':'')+value2));
    a.appendChild(d2);
    document.getElementById(parentName).appendChild(a);
}

var savedPlayersElement = document.getElementById('saved-players');
var profiles = JSON.parse(localStorage.getItem("savedProfiles"));
if (savedPlayersElement && profiles) {
    var customizerPlayers = document.getElementById('customizer-players');
    for (var i=0;i<profiles.length;i++) {
        showItem('saved-players', ((lang=='en')?'':'/'+lang)+'/stats/profile/'+((profiles[i].verified&&profiles[i].verified=="1")?profiles[i].name.replace(/ /g,'-'):profiles[i].tag), profiles[i].tag, profiles[i].name, 'btn-outline-info', true, 'Profile', i, null);
        if (customizerPlayers) showItem('customizer-players', ((lang=='en')?'':'/'+lang)+'/stats/picks/'+((profiles[i].verified&&profiles[i].verified=="1")?profiles[i].name.replace(/ /g,'-'):profiles[i].tag), profiles[i].tag, profiles[i].name, 'btn-outline-info', true, 'Picks', i, null, 'document.getElementById("frm-customizerTag-profile").value="'+profiles[i].tag+'";return false;');
    }
    if (customizerPlayers && profiles && profiles[0]) {
        document.getElementById("frm-customizerTag-profile").value = profiles[0].tag;
    }
}

var customizeBtn = document.getElementById('customizeBtn');
if (customizeBtn) {
    customizeBtn.style.display = "inline-block";
    if (customizerPlayers && profiles && profiles.length == 1) {
        customizeBtn.dataset.toggle = 'openProfileLink';
        customizeBtn.href = '#openProfileLink';
        customizeBtn.onclick = async () => {
            if (typeof ga === "function") ga('send', 'event', { eventCategory: 'Customize', eventAction: 'Menu', eventLabel: 'Quick Link', eventValue: 0, transport: 'beacon' });
            window.open(((lang=='en')?'':'/'+lang)+'/stats/picks/'+((profiles[0].verified&&profiles[0].verified=="1")?profiles[0].name.replace(/ /g,'-'):profiles[0].tag), '_parent');
        }
    }
}

var mapSelect = document.getElementById('mapSelect');
if (mapSelect) {
    mapSelect.addEventListener('change', function(e) {
        e.preventDefault();
        var selected = mapSelect.options[mapSelect.selectedIndex];

        var redirUrl = ((linkLang!=='en')?'/'+linkLang:'')+'/maps/detail/'+selected.value+'#teams';
        window.location.href = redirUrl;
    });
}

var trophyRanges = document.getElementById('trophyRanges');
if (trophyRanges) {
    trophyRanges.style.display = 'inline';
    trophyRanges.addEventListener('change', function(e) {
        e.preventDefault();
        var selected = trophyRanges.options[trophyRanges.selectedIndex];

        var redirUrl = ((linkLang!=='en')?'/'+linkLang:'')+'/league/'+((selected.value=='0')?'':((selected.value=='1')?'low':((selected.value=='2')?'medium':((selected.value=='3')?'high':''))));
        window.location.href = redirUrl;
    });
}