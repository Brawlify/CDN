
var b = document.getElementById('save-profile');
if (b) {
  if (localStorage.getItem("savedProfiles")) {
    var profiles = JSON.parse(localStorage.getItem("savedProfiles"));
    var change = false;
    for (var i=0;i<profiles.length;i++) {
      if (profiles[i].tag == b.dataset.tag) {
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Remove this profile from saved profiles.';
        b.innerHTML = '✓';
        if (typeof profiles[i].verified == "undefined") {
          change = true;
          profiles[i].verified = b.dataset.verified;
        } else if (profiles[i].verified !== b.dataset.verified) {
          change = true;
          profiles[i].verified = b.dataset.verified;  
        }
      }
    }
    if (change = true) localStorage.setItem("savedProfiles", JSON.stringify(profiles));
  } else {
    var profiles = [];
  }
  b.style.display = 'block';
  b.onmouseover = function(){
    if (b.innerHTML == '✓') {
      b.classList.add("btn-outline-danger");
      b.classList.remove("btn-outline-success");
      b.title = 'Remove this profile from saved profiles.';
      b.innerHTML = '−';
    }
  };

  b.onmouseleave = function(){
    if (b.innerHTML == '−') {
      b.classList.add("btn-outline-success");
      b.classList.remove("btn-outline-danger");
      b.title = 'Add this profile to saved profiles.';
      b.innerHTML = '✓';
    }
  };

  b.onclick = function() {
    var customSaver = localStorage.getItem("customSaver");
    if (!customSaver) localStorage.setItem("customSaver", JSON.stringify({ profile:true,club:false}));
    else if (customSaver.profile == false) localStorage.setItem("customSaver", JSON.stringify({ profile:true,club:true}));
    if (b.innerHTML == '+') {
      // Add to local storage
      b.classList.add("btn-outline-success");
      b.classList.remove("btn-outline-danger");
      b.title = 'Remove this profile from saved profiles.';
      b.innerHTML = '✓';
      profiles.push({"tag": b.dataset.tag,"name": b.dataset.name,"verified": b.dataset.verified});
      localStorage.setItem("savedProfiles", JSON.stringify(profiles));
      //ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Add', eventLabel: 'Player', eventValue: profiles.length, transport: 'beacon' });
    } else if (b.innerHTML == '−' || b.innerHTML == '✓') {
      // Remove from local storage
      b.classList.add("btn-outline-danger");
      b.classList.remove("btn-outline-success");
      b.title = 'Add this profile to saved profiles.';
      b.innerHTML = '+';
      for (var i=0;i<profiles.length;i++) {
        if (profiles[i].tag == b.dataset.tag) profiles.splice(i, 1);
      }
      localStorage.setItem("savedProfiles", JSON.stringify(profiles));
      //ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Remove', eventLabel: 'Player', eventValue: profiles.length, transport: 'beacon' });
    }
    return false;
  }

  b.onfocusout = function() {
    b.classList.add("btn-outline-success");
    b.classList.remove("btn-outline-danger");
  }

  var customSaver = localStorage.getItem("customSaver");
  if (!customSaver || (JSON.parse(customSaver)).profile == false) {
    if (b.innerHTML == '+') {
      if (profiles.length < 5) { 
        b.classList.add("btn-outline-success");
        b.classList.remove("btn-outline-danger");
        b.title = 'Remove this profile from saved profiles.';
        b.innerHTML = '✓';
        profiles.push({"tag": b.dataset.tag,"name": b.dataset.name,"verified": b.dataset.verified});
        localStorage.setItem("savedProfiles", JSON.stringify(profiles));
        //ga('send', 'event', { eventCategory: 'Favorites', eventAction: 'Auto Add', eventLabel: 'Player', eventValue: profiles.length, transport: 'beacon', nonInteraction: true });
      }
    }
  }
}

function resetGraph() {
  var graphParent = document.getElementById('brawlerGraphCanvas');
  var graph = document.getElementById('trophy-graph-brawler');
  graph.remove();
  replacement = document.createElement("canvas");
  replacement.id = 'trophy-graph-brawler';
  replacement.classList.add('personal-graph-brawler');
  graphParent.append(replacement);
}

function displayGraph(block) {
  document.getElementById('brawlerName').innerHTML = block.dataset.name;
  document.getElementById('brawlerEmoji').src = 'https://cdn.brawlify.com/emoji/'+block.dataset.path+'.png?v='+block.dataset.version;
  document.getElementById('brawlerLoading').style.display = "none";
  document.getElementById('brawlerGraph').style.display = "block";

  var backgroundColor = [];
  var borderColor = [];
  var pointHoverBackgroundColor = [];
  for (var i = 0; i < dataHolder.brawlers[block.dataset.id].data.length; i++) {
    backgroundColor.push('rgba(0,0,0,0.22)');
    borderColor.push('rgba(255,165,0,1)');
    pointHoverBackgroundColor.push('rgba(255,165,0,1)');
  }
  new Chart(document.getElementById('trophy-graph-brawler'),{type:'line',data:{labels:dataHolder.brawlers[block.dataset.id].labels,datasets:[{label:'Trophies',data:dataHolder.brawlers[block.dataset.id].data,backgroundColor:backgroundColor,borderColor:borderColor,pointHoverBackgroundColor:pointHoverBackgroundColor}]}});
  
  
  var daily = document.getElementById('brawlerDetail-daily');
  if (daily) {
    if (typeof dataHolder.brawlers[block.dataset.id].number.daily !== "undefined") {
      daily.classList.remove('text-success','text-warning','text-danger');
      var num = dataHolder.brawlers[block.dataset.id].number.daily;
      daily.classList.add(((num>0)?'text-success':((num)?'text-danger':'text-warning')));
      daily.innerHTML = ((num>=0)?'+':'')+dataHolder.brawlers[block.dataset.id].number.daily;
      daily.style.display = "inline-block";
    } else {
      daily.style.display = "none";
      document.getElementById('brawlerDetail-daily-a').style.display = "none";
    }
  }
  var weekly = document.getElementById('brawlerDetail-weekly');
  if (weekly) {
    if (typeof dataHolder.brawlers[block.dataset.id].number.weekly !== "undefined") {
      weekly.classList.remove('text-success','text-warning','text-danger');
      var num = dataHolder.brawlers[block.dataset.id].number.weekly;
      weekly.classList.add(((num>0)?'text-success':((num)?'text-danger':'text-warning')));
      weekly.innerHTML = ((num>=0)?'+':'')+dataHolder.brawlers[block.dataset.id].number.weekly;
      weekly.style.display = "inline-block";
    } else {
      weekly.style.display = "none";
      document.getElementById('brawlerDetail-weekly-a').style.display = "none";
    }
  }
  var seasonal = document.getElementById('brawlerDetail-seasonal');
  if (seasonal) {
    if (typeof dataHolder.brawlers[block.dataset.id].number.seasonal !== "undefined") {
      seasonal.classList.remove('text-success','text-warning','text-danger');
      var num = dataHolder.brawlers[block.dataset.id].number.seasonal;
      seasonal.classList.add(((num>0)?'text-success':((num)?'text-danger':'text-warning')));
      seasonal.innerHTML = ((num>=0)?'+':'')+dataHolder.brawlers[block.dataset.id].number.seasonal;
      seasonal.style.display = "inline-block";
    } else {
      seasonal.style.display = "none";
      document.getElementById('brawlerDetail-seasonal-a').style.display = "none";
    }
  }
}

var dataHolder = null;
Array.from(document.getElementsByClassName('brawlerBlock')).forEach(item => item.addEventListener('click', function(e) {
  e.preventDefault();
  resetGraph();
  document.getElementById('brawlerLoadingFailed').style.display = "none";
  document.getElementById('brawlerDetails').style.display = "block";
  $(".inspectStatsHide").css('display', 'none');
  $("body").css('overflow', 'hidden');
  if (!dataHolder) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.brawlapi.com/v1/graphs/player/'+playerTag, true);
    xhr.setRequestHeader('Authorization', apiKey);
    xhr.timeout = 10000;
    xhr.send();
    xhr.onreadystatechange = processRequest;
    block = this;
    function processRequest(e) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          if (response.error !== true) {
            dataHolder = response;
            displayGraph(block);
            //ga('send', 'event', { eventCategory: 'Graphs', eventAction: 'Brawler', eventLabel: block.dataset.originalname, eventValue: 0, transport: 'beacon' });
          } else {
            document.getElementById('brawlerGraph').style.display = "none";
            document.getElementById('brawlerLoading').style.display = "none";
            document.getElementById('brawlerLoadingFailed').style.display = "block";
            return document.getElementById('brawlerLoadingFailedText').innerHTML = response.message;
          }
        } else {
          var response = JSON.parse(xhr.responseText);
          document.getElementById('brawlerGraph').style.display = "none";
          document.getElementById('brawlerLoading').style.display = "none";
          document.getElementById('brawlerLoadingFailed').style.display = "block";
          if (response && response.message) {
            document.getElementById('brawlerLoadingFailedText').innerHTML = response.message;
            return //ga('send', 'event', { eventCategory: 'Graphs', eventAction: 'Insufficient', eventLabel: block.dataset.originalname, eventValue: 0, transport: 'beacon' });
          } else {
            document.getElementById('brawlerLoadingFailedText').innerHTML = "Connection error!";
            return alert('Something went wrong!\nPlease make sure you have good internet connection.');
          }
        }
      }
    }
  }
  if (!dataHolder) return;
  displayGraph(this);
}));

Array.from(document.getElementsByClassName('closeBrawlerDetails')).forEach(item => item.addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('brawlerDetails').style.display = "none";
  document.getElementById('brawlerGraph').style.display = "none";
  document.getElementById('brawlerLoading').style.display = "block";
  document.getElementById('brawlerLoadingFailed').style.display = "none";
  $(".inspectStatsHide").css('display', 'block');
  $("body").css('overflow', 'auto');
}));

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
  xhr.open('GET', 'https://api.brawlapi.com/v1/graphs/player/'+playerTag, true);
  xhr.setRequestHeader('Authorization', apiKey);
  xhr.timeout = 12000;
  xhr.send();
  xhr.onreadystatechange = processRequest;
  function processRequest(e) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.error !== true) {
          dataHolder = response;
          return displayGraph2(dataHolder);
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