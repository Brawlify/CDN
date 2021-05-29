var b = document.getElementById('save-club');
if (b) {
    if (localStorage.getItem("savedClubs")) {
    var clubs = JSON.parse(localStorage.getItem("savedClubs"));
    for (var i=0;i<clubs.length;i++) {
        if (clubs[i].tag == b.dataset.tag) {
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Remove this club from saved clubs.';
        b.innerHTML = '✓';
        }
    }
    } else {
    var clubs = [];
    }
    b.style.display = 'block';
    b.onmouseover = function(){
    if (b.innerHTML == '✓') {
        b.classList.add("btn-outline-danger");
        b.classList.remove("btn-outline-success");
        b.title = 'Remove this club from saved clubs.';
        b.innerHTML = '−';
    }
    };

    b.onmouseleave = function(){
    if (b.innerHTML == '−') {
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Add this club to saved clubs.';
        b.innerHTML = '✓';
    }
    };

    b.onclick = function() {
    var customSaver = localStorage.getItem("customSaver");
    if (!customSaver) localStorage.setItem("customSaver", JSON.stringify({ profile:false,club:true}));
    else if (customSaver.club == false) localStorage.setItem("customSaver", JSON.stringify({ profile:true,club:true}));
    if (b.innerHTML == '+') {
        // Add to local storage
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Remove this club from saved clubs.';
        b.innerHTML = '✓';
        clubs.push({"tag": b.dataset.tag,"name": b.dataset.name});
        localStorage.setItem("savedClubs", JSON.stringify(clubs));
        ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Add', eventLabel: 'Club', eventValue: clubs.length, transport: 'beacon' });
    } else if (b.innerHTML == '−' || b.innerHTML == '✓') {
        // Remove from local storage
        b.classList.add("btn-outline-danger");
        b.classList.remove("btn-outline-success");
        b.title = 'Add this club to saved clubs.';
        b.innerHTML = '+';
        for (var i=0;i<clubs.length;i++) {
        if (clubs[i].tag == b.dataset.tag) clubs.splice(i, 1);
        }
        localStorage.setItem("savedClubs", JSON.stringify(clubs));
        ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Add', eventLabel: 'Club', eventValue: clubs.length, transport: 'beacon' });
    }
    return false;
    }

    b.onfocusout = function() {
    b.classList.add("btn-outline-success");
    b.classList.remove("btn-outline-danger");
    }

    var customSaver = localStorage.getItem("customSaver");
    if (!customSaver || (JSON.parse(customSaver)).club == false) {
    if (b.innerHTML == '+') {
        if (clubs.length < 5) { 
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Remove this club from saved clubs.';
        b.innerHTML = '✓';
        clubs.push({"tag": b.dataset.tag,"name": b.dataset.name});
        localStorage.setItem("savedClubs", JSON.stringify(clubs));
        ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Auto Add', eventLabel: 'Club', eventValue: clubs.length, transport: 'beacon', nonInteraction: true });
        }
    }
    }
}

function displayGraph2(data) {
    var backgroundColor = [];
    var borderColor = [];
    var pointHoverBackgroundColor = [];
    for (var i = 0; i < data.data.length; i++) {
        backgroundColor.push('rgba(0,0,0,0.22)');
        borderColor.push('rgba(255,165,0,1)');
        pointHoverBackgroundColor.push('rgba(255,165,0,1)');
    }
    new Chart(document.getElementById('trophy-graph-personal'),{type:'line',data:{labels:data.labels,datasets:[{label:'Trophies',data:data.data,backgroundColor:backgroundColor,borderColor:borderColor,pointHoverBackgroundColor:pointHoverBackgroundColor}]}});

    document.getElementById('mainDaily').innerHTML = ((data.number.daily>=0)?'+':'')+num(data.number.daily);
    document.getElementById('mainDaily').classList.add(((data.number.daily>0)?'text-success':((data.number.daily)?'text-danger':'text-warning')));

    document.getElementById('mainWeekly').innerHTML = ((data.number.weekly>=0)?'+':'')+num(data.number.weekly);
    document.getElementById('mainWeekly').classList.add(((data.number.weekly>0)?'text-success':((data.number.weekly)?'text-danger':'text-warning')));

    document.getElementById('mainSeasonal').innerHTML = ((data.number.seasonal>=0)?'+':'')+num(data.number.seasonal);
    document.getElementById('mainSeasonal').classList.add(((data.number.seasonal>0)?'text-success':((data.number.seasonal)?'text-danger':'text-warning')));

    document.getElementById('trophy-graph-personal').style.display = 'block';
    document.getElementById('mainNumbers').style.display = 'block';
    document.getElementById('loaderGraphs').style.display = 'none';
}

function num(num) {
    if (isNaN(Number(num))) return '+0';
    return Number(num).toLocaleString("en");
}

function loadProgression() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.brawlapi.com/v1/graphs/club/'+clubTag, true);
    xhr.setRequestHeader('Authorization', apiKey);
    xhr.timeout = 12000;
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.error !== true) {
                return displayGraph2(response);
                } else {
                document.getElementById('loaderGraphs').style.display = 'none';
                document.getElementById('mainErrorText').innerHTML = 'Failed to load trophy progression! Try again later.';
                return document.getElementById('mainError').style.display = 'block';
                }
            } else {
                document.getElementById('loaderGraphs').style.display = 'none';
                document.getElementById('mainErrorText').innerHTML = 'Failed to load trophy progression! Try again later.';
                return document.getElementById('mainError').style.display = 'block';
            }
        }
    }
}

// Run Services
window.addEventListener('load', () => {
  var trophyProgression = document.getElementById('trophyProgression');
  if (trophyProgression) {
    trophyProgression.style.display = "block";
    loadProgression();
  }
});