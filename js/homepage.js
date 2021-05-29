// Event time
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

// Events Failed to load, display error
function eventLoaderFailed(error = 'E0') {
    let loadingWindow = document.getElementById('loadingWindow');
    if (loadingWindow) loadingWindow.style.display = 'none';
    let loadingFailed = document.getElementById('loadingFailed');
    let loadingFailedText = document.getElementById('loadingFailedText');
    if (loadingFailedText) loadingFailedText.innerHTML = 'Failed to load data!<br><span class="text-hp3 small">(Error '+error+')</span>';
    if (loadingFailed) loadingFailed.style.display = 'block';
}

// Create stats ranking
function createStatsRank(stats) {
    let rank = {};
    for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler]) rank[stats[i].brawler] = {};
    if (stats[0].winRate) {
        stats.sort((a,b) => b.winRate - a.winRate);
        for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler].winRate) rank[stats[i].brawler].winRate = i+1;
    }
    if (stats[0].bossWinRate) {
        stats.sort((a,b) => b.bossWinRate - a.bossWinRate);
        for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler].bossWinRate) rank[stats[i].brawler].bossWinRate = i+1;
    }
    if (stats[0].useRate) {
        stats.sort((a,b) => b.useRate - a.useRate);
        for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler].useRate) rank[stats[i].brawler].useRate = i+1;
    }
    if (stats[0].starRate) {
        stats.sort((a,b) => b.starRate - a.starRate);
        for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler].starRate) rank[stats[i].brawler].starRate = i+1;
    }
    if (stats[0].avgPosition) {
        stats.sort((b,a) => b.avgPosition - a.avgPosition);
        for (let i=0;i<stats.length;i++) if (!rank[stats[i].brawler].avgPosition) rank[stats[i].brawler].avgPosition = i+1;
    }
    return rank;
}

// Create HTML object - mode blocks
function getEventBlock(data, active, brawler) {
    let rank = createStatsRank(data.map.stats);
    let fitsStatsReq = (data.map.stats && data.map.stats.length > 9);
    let fitsStatsReq2 = (data.map.teamStats && data.map.teamStats.length > 7);

    let aDiv = document.createElement('div');
    aDiv.classList.add('d-flex','flex-column','mb-3','col-sm-12','col-md-6');
    let bDiv = document.createElement('div');
    bDiv.id = ((active)?'a':'u')+'-'+data.map.id+data.slot.id;
    bDiv.classList.add('event-border');
    let cDiv = document.createElement('div');
    cDiv.classList.add('event-top');
    let dSpan = document.createElement('span');
    dSpan.classList.add('text-hp3');
    dSpan.innerHTML = ((active)?strings['event_ends_countdown']:strings['event_starts_countdown'])+' ';
    cDiv.appendChild(dSpan);
    let eSpan = document.createElement('span');
    eSpan.id = 'm'+data.map.id+data.slot.id;
    eSpan.classList.add('event-time','text-hp','mr-1');
    eSpan.dataset.time = ((active)?data.endTime:data.startTime);
    eSpan.innerHTML = eventTime(123456);
    cDiv.appendChild(eSpan);
    let fA = document.createElement('a');
    fA.href='';
    fA.classList.add('ml-0');
    fA.dataset.toggle='modal';
    fA.dataset.target='#'+data.map.id;
    fA.title=strings['map_name_'+data.map.id];
    fA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Active Events', eventLabel: 'Preview', eventValue: 0, transport: 'beacon' });return false;";
    let gImg = document.createElement('img');
    gImg.classList.add('opacity','eventTableOpen');
    gImg.title=strings['map_name_'+data.map.id];
    gImg.alt=strings['map_name_'+data.map.id];
    gImg.src='https://cdn.brawlify.com/icon/Info-Round.png';
    gImg.width='28';
    gImg.height='28';
    gImg.dataset.trigger='i'+((active)?'c':'u')+data.map.id+data.slot.id;
    fA.appendChild(gImg);
    cDiv.appendChild(fA);
    bDiv.appendChild(cDiv);
    let hDiv = document.createElement('div');
    hDiv.classList.add('event-title','bg-mode'+data.map.gameMode.id,'d-flex','flex-row','pl-2','pt-1','pb-1');
    if (data.slot.background !== null) {
        hDiv.style.backgroundImage = "url('"+data.slot.background+"')";
        hDiv.classList.add('event-bg-special');
    }
    let jImg = document.createElement('img');
    jImg.classList.add('float-left');
    jImg.src = data.map.gameMode.imageUrl;
    jImg.title=strings['gamemodes_name_'+data.map.gameMode.id];
    jImg.alt=strings['gamemodes_name_'+data.map.gameMode.id];
    jImg.height='54';
    if (fitsStatsReq2) {
        let iA = document.createElement('a');
        iA.href = '#team'+((active)?'A':'U')+'-'+data.map.id+data.slot.id;
        iA.title=strings['gamemodes_name_'+data.map.gameMode.id];
        iA.appendChild(jImg);
        hDiv.appendChild(iA);
    } else hDiv.appendChild(jImg);
    let kDiv = document.createElement('div');
    kDiv.classList.add('pl-2');
    lh3 = document.createElement('h3');
    lh3.classList.add('h4','event-title-text','mb-0');
    if (data.modifier !== null) {
        let mImg = document.createElement('img');
        mImg.classList.add('event-modifier','mr-1');
        mImg.title=data.modifier.name;
        mImg.alt=data.modifier.name;
        mImg.src=data.modifier.imageUrl;
        lh3.appendChild(mImg);
    }
    let nA = document.createElement('a');
    nA.href=((lang=='en')?'':'/'+lang)+'/gamemodes/detail/'+data.map.gameMode.hash;
    nA.classList.add('link','opacity','event-title-gamemode');
    nA.title=strings['gamemodes_name_'+data.map.gameMode.id];
    nA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: "+((active)?'Active':'Upcoming')+"' Events', eventLabel: 'Gamemode', eventValue: 0, transport: 'beacon' });";
    nA.innerHTML=strings['gamemodes_name_'+data.map.gameMode.id].toUpperCase();
    lh3.appendChild(nA);
    kDiv.appendChild(lh3);
    let oA = document.createElement('a');
    oA.href=((lang=='en')?'':'/'+lang)+'/maps/detail/'+data.map.hash;
    oA.classList.add('link','opacity','event-title-text','event-title-map','mb-0');
    oA.title=strings['map_name_'+data.map.id];
    oA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: "+((active)?'Active':'Upcoming')+"' Events', eventLabel: 'Map', eventValue: 0, transport: 'beacon' });";
    oA.innerHTML=strings['map_name_'+data.map.id];
    kDiv.appendChild(oA);
    hDiv.appendChild(kDiv);
    bDiv.appendChild(hDiv);
    let pDiv = document.createElement('div');
    pDiv.classList.add('container','event-img');
    pDiv.style.backgroundImage='linear-gradient(to bottom,rgba(0,0,0,0.6)0%,rgba(0,0,0,0.6)100%),url('+data.map.environment.imageUrl+')';
    if (fitsStatsReq) {
        let qDiv = document.createElement('div');
        qDiv.classList.add('row','event-recommendation','justify-content-center','align-content-center');
        let sCount = 0;
        data.map.stats.sort((a,b) => b.winRate - a.winRate);
        for (let i=0;i<data.map.stats.length;i++) {
            if (sCount < 10 && rank[data.map.stats[i].brawler].useRate < Math.round(0.7*data.map.stats.length)) {
                let stA = document.createElement('a');
                stA.classList.add('link','event-brl','event-brl-img','opacity','mx-1');
                if (((data.map.stats.length>10)?5:Math.round(data.map.stats.length/2))>sCount) stA.classList.add('mb-1');
                stA.href=((lang=='en')?'':'/'+lang)+'/brawlers/detail/'+brawler[data.map.stats[i].brawler].hash;
                stA.title=strings['brawlers_name_'+data.map.stats[i].brawler];
                stA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: "+((active)?'Active':'Upcoming')+"' Events', eventLabel: 'Recommendations', eventValue: 0, transport: 'beacon' });";
                stA.style.backgroundImage='url('+brawler[data.map.stats[i].brawler].imageUrl2+')';

                let stDiv = document.createElement('div');
                stDiv.classList.add(((((data.map.stats.length>10)?5:Math.round(data.map.stats.length/2))>sCount)?'event-brl-t-name':'event-brl-b-name'));

                let stSpan = document.createElement('span');
                stSpan.classList.add('event-brl-name-bg','font-rank'+rank[data.map.stats[i].brawler].useRate);
                stSpan.innerHTML = data.map.stats[i].winRate.toFixed(0)+'%';

                stDiv.appendChild(stSpan);
                stA.appendChild(stDiv);
                qDiv.appendChild(stA);
                sCount++;
                if (((data.map.stats.length>10)?5:Math.round(data.map.stats.length/2)) == sCount) {
                    let divDiv = document.createElement('div');
                    divDiv.classList.add('w-100');
                    qDiv.appendChild(divDiv);
                }
            }
        }
        pDiv.appendChild(qDiv);
    } else {
        let lDiv = document.createElement('div');
        lDiv.classList.add('row','event-recommendation','justify-content-center','align-content-center','p-3');
        let rSpan = document.createElement('span');
        rSpan.classList.add('event-notif-bg','text-center','p-2');
        rSpan.innerHTML=strings['event_stats_missing_title'];
        rSpan.appendChild(document.createElement('br'));
        let smSpan = document.createElement('span');
        smSpan.classList.add('small');
        smSpan.innerHTML=strings['event_stats_missing_explain'];
        rSpan.appendChild(smSpan);
        lDiv.appendChild(rSpan);
        pDiv.appendChild(lDiv);
    }
    bDiv.appendChild(pDiv);
    aDiv.appendChild(bDiv);
    return aDiv;
}

// Create HTML object - preview
function getEventBlock2(data, active, brawler) {
    let rank = createStatsRank(data.map.stats);
    let fitsStatsReq = (data.map.stats && data.map.stats.length > 9);

    let bDiv = document.createElement('div');
    bDiv.id = 'i'+((active)?'c':'u')+data.map.id+data.slot.id;
    bDiv.classList.add('imgModal');
    let Cspan = document.createElement('span');
    Cspan.classList.add('close', 'eventTableClose');
    Cspan.dataset.trigger = 'i'+((active)?'c':'u')+data.map.id+data.slot.id;
    Cspan.innerHTML = '&times;';
    bDiv.appendChild(Cspan);
    if (fitsStatsReq) {
        let Tdiv = document.createElement('div');
        Tdiv.classList.add('text-center', 'pb-2');
        let Tp = document.createElement('p');
        Tp.classList.add('h4', 'text-success');
        Tp.innerHTML = '&#9660 '+strings['event_stats_scroll_down']+' &#9660';
        Tdiv.appendChild(Tp);
        bDiv.appendChild(Tdiv);
    }
    let Ta = document.createElement('a');
    Ta.classList.add('link','opacity');
    Ta.title=strings['map_name_'+data.map.id];
    Ta.href=((lang=='en')?'':'/'+lang)+'/maps/detail/'+data.map.hash;
    Ta.onclick = "ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Events', eventLabel: 'previewClick', eventValue: 0, transport: 'beacon' })";
    let Timg = document.createElement('img');
    Timg.classList.add('imgModal-content','img-fluid','map-detail','pl-2','pr-2');
    Timg.src = data.map.imageUrl;
    Timg.title=strings['map_name_'+data.map.id];
    Timg.alt=strings['map_name_'+data.map.id];
    Ta.appendChild(Timg);
    bDiv.appendChild(Ta);
    let dDiv = document.createElement('div');
    dDiv.classList.add('text-center','pt-2');
    let dP = document.createElement('p');
    dP.classList.add('h3','text-hp0');
    dP.innerHTML=strings['map_name_'+data.map.id];
    dDiv.appendChild(dP);
    if (fitsStatsReq) {
        let aDiv = document.createElement('div');
        aDiv.classList.add('pt-3');
        aDiv.dataset.pwDesk='leaderboard_btf';
        aDiv.dataset.pwMobi='leaderboard_btf';
        dDiv.appendChild(aDiv);
        let fDiv = document.createElement('div');
        fDiv.classList.add('container','pt-3','pb-3');
        let gH2 = document.createElement('h2');
        gH2.classList.add('text-hp0','shadow-normal','mb-0','mt-1');
        gH2.innerHTML=strings['event_stats_map'];
        fDiv.appendChild(gH2);
        let hDiv = document.createElement('div');
        hDiv.classList.add('pl-1','pb-1');
        if (data.map.dataUpdated) {
            let iDiv = document.createElement('div');
            iDiv.classList.add('text-secondary','mb-0');
            iDiv.innerHTML=strings['event_stats_updated'];
            let jSpan = document.createElement('span');
            jSpan.id='dataUpdateC-'+data.map.id+data.slot.id;
            jSpan.classList.add('eventTableTime','mb-0',((moment.duration(moment().diff(moment(data.map.dataUpdated))).asHours()>=6)?'text-warning':'text-hp2'));
            jSpan.dataset.updated=moment(data.map.dataUpdated).format('Y-m-d H:i');
            jSpan.innerHTML=strings['event_stats_map'].replace('%s',moment(data.map.dataUpdated).format('Y-m-d H:i'));
            iDiv.appendChild(jSpan);
            hDiv.appendChild(iDiv);
        }
        let Ka = document.createElement('a');
        Ka.classList.add('link','opacity','btn','btn-sm','btn-outline-orange');
        Ka.dataset.toggle='collapse';
        Ka.href='#explain'+data.map.id+data.slot.id;
        Ka.role='button';
        Ka.ariaExpanded='false';
        Ka.ariaControls='explain'+data.map.id+data.slot.id;
        Ka.innerHTML=strings['event_stats_explain'];
        hDiv.appendChild(Ka);
        let exDiv = document.createElement('div');
        exDiv.id='explain'+data.map.id+data.slot.id;
        exDiv.classList.add('collapse','p-1','mb-0');
        if (rank[16000000] && rank[16000000].winRate) {
            let s1 = document.createElement('p');
            s1.classList.add('text-hp0','shadow-normal','mb-1');
            s1.innerHTML=strings['event_stats_win_rate_explained'].replace('%s',strings['event_stats_win_rate'].replace('%s','<span class="text-white">%s</span>'));
            exDiv.appendChild(s1);
        }
        if (rank[16000000] && rank[16000000].bossWinRate) {
            let s2 = document.createElement('p');
            s2.classList.add('text-hp0','shadow-normal','mb-1');
            s2.innerHTML=strings['event_stats_boss_win_explained'].replace('%s',strings['event_stats_boss_win'].replace('%s','<span class="text-white">%s</span>'));
            exDiv.appendChild(s2);
        }
        if (rank[16000000] && rank[16000000].useRate) {
            let s3 = document.createElement('p');
            s3.classList.add('text-hp0','shadow-normal','mb-1');
            s3.innerHTML=strings['event_stats_use_rate_explained'].replace('%s',strings['event_stats_use_rate'].replace('%s','<span class="text-white">%s</span>'));
            exDiv.appendChild(s3);
        }
        if (rank[16000000] && rank[16000000].starRate) {
            let s4 = document.createElement('p');
            s4.classList.add('text-hp0','shadow-normal','mb-1');
            s4.innerHTML=strings['event_stats_star_rate_explained'].replace('%s',strings['event_stats_star_rate'].replace('%s','<span class="text-white">%s</span>'));
            exDiv.appendChild(s4);
        }
        if (rank[16000000] && rank[16000000].avgPosition) {
            let s5 = document.createElement('p');
            s5.classList.add('text-hp0','shadow-normal','mb-1');
            s5.innerHTML=strings['event_stats_avg_rank_explained'].replace('%s',strings['event_stats_avg_rank'].replace('%s','<span class="text-white">%s</span>'));
            exDiv.appendChild(s5);
        }
        hDiv.appendChild(exDiv);
        fDiv.appendChild(hDiv);

        let tabDiv = document.createElement('div');
        tabDiv.classList.add('table-responsive');
        let table = document.createElement('table');
        table.id='statsC-'+data.map.id+data.slot.id;
        table.classList.add('eventTableStats','table','table-inverse','dark-border-sm','stats-color','stats-table','table');
        let thead = document.createElement('thead');
        thead.classList.add('text-white');
        let tr1 = document.createElement('tr');
        let th1 = document.createElement('th');
        th1.classList.add('text-center','font-weight-normal');
        th1.innerHTML=strings['event_stats_brawler'];
        tr1.appendChild(th1);
        if (rank[16000000] && rank[16000000].winRate) {
            let th2 = document.createElement('th');
            th2.classList.add('text-right','font-weight-normal');
            th2.innerHTML=strings['event_stats_win_rate'];
            tr1.appendChild(th2);
        }
        if (rank[16000000] && rank[16000000].bossWinRate) {
            let th3 = document.createElement('th');
            th3.classList.add('text-right','font-weight-normal');
            th3.innerHTML=strings['event_stats_boss_win'];
            tr1.appendChild(th3);
        }
        if (rank[16000000] && rank[16000000].useRate) {
            let th4 = document.createElement('th');
            th4.classList.add('text-right','font-weight-normal');
            th4.innerHTML=strings['event_stats_use_rate'];
            tr1.appendChild(th4);
        }
        if (rank[16000000] && rank[16000000].starRate) {
            let th5 = document.createElement('th');
            th5.classList.add('text-right','font-weight-normal');
            th5.innerHTML=strings['event_stats_star_rate'];
            tr1.appendChild(th5);
        }
        if (rank[16000000] && rank[16000000].avgPosition) {
            let th6 = document.createElement('th');
            th6.classList.add('text-right','font-weight-normal');
            th6.innerHTML=strings['event_stats_avg_rank'];
            tr1.appendChild(th6);
        }
        thead.appendChild(tr1);
        table.appendChild(thead);
        let tbody = document.createElement('tbody');
        tbody.classList.add('text-hp');
        data.map.stats.sort((a,b) => b.winRate - a.winRate);
        for (let i=0;i<data.map.stats.length;i++) {
            let tr2 = document.createElement('tr');

            let td1 = document.createElement('td');
            td1.classList.add('text-center','bg-r'+brawler[data.map.stats[i].brawler].rarity.id);
            let img1 = document.createElement('img');
            img1.src = brawler[data.map.stats[i].brawler].imageUrl2;
            img1.title=strings['brawlers_name_'+data.map.stats[i].brawler];
            img1.alt=strings['brawlers_name_'+data.map.stats[i].brawler];
            img1.classList.add('dark-border-sm');
            img1.width='46';
            img1.height='46';
            td1.appendChild(img1);
            tr2.appendChild(td1);

            if (data.map.stats[i].winRate && rank[data.map.stats[i].brawler] && rank[data.map.stats[i].brawler].winRate) {
                let td2 = document.createElement('td');
                td2.classList.add('text-right','text-black','stat-rank'+rank[data.map.stats[i].brawler].winRate);
                td2.innerHTML = data.map.stats[i].winRate.toFixed(1)+'%';
                tr2.appendChild(td2);
            }
            if (data.map.stats[i].bossWinRate && rank[data.map.stats[i].brawler] && rank[data.map.stats[i].brawler].bossWinRate) {
                let td3 = document.createElement('td');
                td3.classList.add('text-right','text-black','stat-rank'+rank[data.map.stats[i].brawler].bossWinRate);
                td3.innerHTML = data.map.stats[i].bossWinRate.toFixed(1)+'%';
                tr2.appendChild(td3);
            }
            if (data.map.stats[i].useRate && rank[data.map.stats[i].brawler] && rank[data.map.stats[i].brawler].useRate) {
                let td4 = document.createElement('td');
                td4.classList.add('text-right','text-black','stat-rank'+rank[data.map.stats[i].brawler].useRate);
                td4.innerHTML = data.map.stats[i].useRate.toFixed(1)+'%';
                tr2.appendChild(td4);
            }
            if (data.map.stats[i].starRate && rank[data.map.stats[i].brawler] && rank[data.map.stats[i].brawler].starRate) {
                let td5 = document.createElement('td');
                td5.classList.add('text-right','text-black','stat-rank'+rank[data.map.stats[i].brawler].starRate);
                td5.innerHTML = data.map.stats[i].starRate.toFixed(1)+'%';
                tr2.appendChild(td5);
            }
            if (data.map.stats[i].avgPosition && rank[data.map.stats[i].brawler] && rank[data.map.stats[i].brawler].avgPosition) {
                let td6 = document.createElement('td');
                td6.classList.add('text-right','text-black','stat-rank'+rank[data.map.stats[i].brawler].avgPosition);
                td6.innerHTML = data.map.stats[i].avgPosition.toFixed(1);
                tr2.appendChild(td6);
            }
            tbody.appendChild(tr2);
        }
        table.appendChild(tbody);
        tabDiv.appendChild(table);
        fDiv.appendChild(tabDiv);
        dDiv.appendChild(fDiv);
    }
    bDiv.appendChild(dDiv);

    return bDiv;
}

function getEventBlock3(data, brawler) {
    let fitsStatsReq = (data.map.stats && data.map.stats.length > 9);
    let fitsStatsReq2 = (data.map.teamStats && data.map.teamStats.length > 7);

    let aDiv = document.createElement('div');
    aDiv.classList.add('d-flex','flex-column','mb-3','col-sm-12','col-md-6');
    let bDiv = document.createElement('div');
    bDiv.id = 'a-'+data.map.id+data.slot.id;
    bDiv.classList.add('event-border');
    let cDiv = document.createElement('div');
    cDiv.classList.add('event-bg-locked');
    let dDiv = document.createElement('div');
    dDiv.classList.add('event-top');
    let eSpan = document.createElement('span');
    eSpan.id='me'+data.map.id+data.slot.id;
    eSpan.classList.add('text-warning','mr-1');
    eSpan.innerHTML=strings['event_starts_countdown_long'];
    dDiv.appendChild(eSpan);
    let fSpan = document.createElement('span');
    fSpan.id='m'+data.map.id+data.slot.id;
    fSpan.classList.add('event-time','text-warning','mr-1');
    fSpan.dataset.time=data.startTime;
    fSpan.innerHTML = eventTime(1);
    dDiv.appendChild(fSpan);
    let gA = document.createElement('a');
    gA.href='';
    gA.classList.add('ml-0');
    gA.dataset.toggle='modal';
    gA.dataset.target='#'+data.map.id;
    gA.title=strings['map_name_'+data.map.id];
    gA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Active Events', eventLabel: 'Preview', eventValue: 0, transport: 'beacon' });return false;";
    let hImg = document.createElement('img');
    hImg.id='tou'+data.map.id+data.slot.id;
    hImg.classList.add('opacity','eventTableOpen');
    hImg.title=strings['map_name_'+data.map.id];
    hImg.alt=strings['map_name_'+data.map.id];
    hImg.src='https://cdn.brawlify.com/icon/Info-Round.png';
    hImg.width='28';
    hImg.height='28';
    hImg.dataset.trigger='iu'+data.map.id+data.slot.id;
    gA.appendChild(hImg);
    dDiv.appendChild(gA);
    cDiv.appendChild(dDiv);

    let iDiv = document.createElement('div');
    iDiv.classList.add('d-flex','flex-row','pl-2','pt-1','pb-1');

    let jImg = document.createElement('img');
    jImg.classList.add('float-left');
    jImg.src = data.map.gameMode.imageUrl;
    jImg.title=strings['gamemodes_name_'+data.map.gameMode.id];
    jImg.alt=strings['gamemodes_name_'+data.map.gameMode.id];
    jImg.height='54';
    if (fitsStatsReq2) {
        let iA = document.createElement('a');
        iA.href = '#teamU-'+data.map.id+data.slot.id;
        iA.title=strings['gamemodes_name_'+data.map.gameMode.id];
        iA.appendChild(jImg);
        iDiv.appendChild(iA);
    } else iDiv.appendChild(jImg);

    let pDiv = document.createElement('div');
    pDiv.classList.add('pl-2');

    let oh3 = document.createElement('h3');
    oh3.classList.add('h4','event-title-text','mb-0');

    if (data.modifier !== null) {
        let mImg = document.createElement('img');
        mImg.classList.add('event-modifier','mr-1');
        mImg.title=data.modifier.name;
        mImg.alt=data.modifier.name;
        mImg.src=data.modifier.imageUrl;
        oh3.appendChild(mImg);
    }

    let nA = document.createElement('a');
    nA.href=((lang=='en')?'':'/'+lang)+'/gamemodes/detail/'+data.map.gameMode.hash;
    nA.classList.add('link','opacity','event-title-gamemode');
    nA.title=strings['gamemodes_name_'+data.map.gameMode.id];
    nA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Active Events', eventLabel: 'Gamemode', eventValue: 0, transport: 'beacon' });";
    nA.innerHTML=strings['gamemodes_name_'+data.map.gameMode.id].toUpperCase();
    oh3.appendChild(nA);
    pDiv.appendChild(oh3);

    let lA = document.createElement('a');
    lA.href=((lang=='en')?'':'/'+lang)+'/maps/detail/'+data.map.hash;
    lA.classList.add('link','opacity','event-title-text','event-title-map','mb-0');
    lA.title=strings['map_name_'+data.map.id];
    lA.onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Active Events', eventLabel: 'Map', eventValue: 0, transport: 'beacon' });";
    lA.innerHTML=strings['map_name_'+data.map.id];

    pDiv.appendChild(lA);
    /*
    <div class="d-flex flex-column mb-3 col-sm-12 col-md-6"> // aDiv
        <div id="a-{$specialEvent['map']['id']}{$specialEvent['slot']['id']}" class="event-border"> // bDiv
            <div class="event-bg-locked"> // cDiv
                <div class="d-flex flex-row pl-2 pt-1 pb-1"> // iDiv
                    <div class="pl-2"> // pDiv
                        <h3 class="h4 event-title-text mb-0">
                            {if $specialEvent['modifier'] !== NULL}
                            <img class="event-modifier" title="{$specialEvent['modifier']['name']}" alt="{$specialEvent['modifier']['name']}" src="{$specialEvent['modifier']['imageUrl']}">
                            {/if}
                            <a href="{link Gamemodes:detail lang => $lang, $specialEvent['map']['gameMode']['hash']}" class="link opacity event-title-gamemode" title="{$GLOBALS['t']('gamemodes_name_'.$specialEvent['map']['gameMode']['imageUrl'])}" n:syntax="off" onclick="ga('send', 'event', { eventCategory: 'Homepage', eventAction: 'Active Events', eventLabel: 'Gamemode', eventValue: 0, transport: 'beacon' });" n:syntax="latte">{mb_strtoupper($GLOBALS['t']('gamemodes_name_'.$specialEvent['map']['gameMode']['id']),'UTF-8')}</a>
                        </h3>
                        <a onclick="" n:syntax="latte">{$GLOBALS['t']('map_name_'.$specialEvent['map']['id'])}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    */

    let evDiv = document.createElement('div');
    evDiv.classList.add('event-img');
    pDiv.appendChild(evDiv);
    iDiv.appendChild(pDiv);
    cDiv.appendChild(iDiv);
    bDiv.appendChild(cDiv);
    aDiv.appendChild(bDiv);
    return aDiv;
}

function brawlerHasher(brawlers) {
    let list = {};
    for (var i=0;i<brawlers.list.length;i++) list[brawlers.list[i].id] = brawlers.list[i];
    return list;
}

// Events loaded, display data
function processEvents(events, brawler) {
    let teamList = document.getElementById('teamList');
    let active = document.getElementById('activeEvents');
    let active2 = document.getElementById('active');
    if (active && events.active) { // Load active events
        for (let i=0;i<events.active.length;i++) {
            if (events.upcoming && events.upcoming[i] && events.upcoming[i].slot.id == 7 && events.active[i].slot.id !== 7) {
                let block3 = getEventBlock3(events.upcoming[i], brawler);
                if (block3) active.appendChild(block3);
            }

            let block = getEventBlock(events.active[i], true, brawler);
            let block2 = getEventBlock2(events.active[i], true, brawler);
            if (active2 && block2) active2.appendChild(block2);
            if (block) active.appendChild(block);
            if (events.active[i].slot.listAlone) {
                let divDiv = document.createElement('div');
                divDiv.classList.add('w-100');
                active.appendChild(divDiv);
            }
        }
    }

    let upcoming = document.getElementById('upcomingEvents');
    let upcoming2 = document.getElementById('upcoming');
    if (upcoming && events.upcoming) { // Load upcoming events
        for (let i=0;i<events.upcoming.length;i++) {
            let block = getEventBlock(events.upcoming[i], false, brawler);
            let block2 = getEventBlock2(events.upcoming[i], false, brawler);
            if (upcoming2 && block2) upcoming2.appendChild(block2);
            if (block) upcoming.appendChild(block);
            if (events.upcoming[i].slot.listAlone) {
                let divDiv = document.createElement('div');
                divDiv.classList.add('w-100');
                upcoming.appendChild(divDiv);
            }
        }
    }

    if (!active || document.getElementById('activeEvents').childElementCount == 0) eventLoaderFailed('E1');
    else {
        if (active && document.getElementById('activeEvents').childElementCount > 0) active.style.display = '';
        if (upcoming2 && document.getElementById('upcoming').childElementCount > 0) upcoming2.style.display = '';
        if (teamList && document.getElementById('teamList').childElementCount > 0) {
            let teams = document.getElementById('teams');
            if (teams) teams.style.display = '';
        }
        Array.from(document.getElementsByClassName('displayAfterLoad')).forEach(i=>{i.style.display=''});
        let loadingWindow = document.getElementById('loadingWindow');
        if (loadingWindow) loadingWindow.style.display = 'none';
        
        Array.from(document.getElementsByClassName('eventTableStats')).forEach(item => {
            /*$('#'+item.id).DataTable({
                paging: false,
                searching: false,
                info: false,
                order: [[ 1, 'desc' ]],
                columnDefs: [
                {
                    orderable: false,
                    targets: 0
                }
                ]
            });*/
        });

        Array.from(document.getElementsByClassName('eventTableOpen')).forEach(item => item.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(item.dataset.trigger).style.display = "block";
            $(".inspectStatsHide").css('display', 'none');
            $("body").css('overflow', 'hidden');
            if ($("#tyche_trendi_parent_container")) $("#tyche_trendi_parent_container").css('display', 'none');
        }));

        Array.from(document.getElementsByClassName('eventTableClose')).forEach(item => item.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(item.dataset.trigger).style.display = "none";
            $(".inspectStatsHide").css('display', 'block');
            $("body").css('overflow', 'auto');
            if ($("#tyche_trendi_parent_container")) $("#tyche_trendi_parent_container").css('display', 'block');
        }));

        setInterval(reloadEventData, 60000);
        reloadEventData();
    }
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
    if (window.location.href.indexOf("#customize") > -1) $('#customizeMenu').collapse('show');
}

// Wait for load, then fetch and display
window.addEventListener('load', async () => {
    let brawlers = await getBrawlers();
    if (!brawlers || !brawlers.statusCode || brawlers.statusCode !== 200) eventLoaderFailed(brawlers.statusCode);

    let events = await getEvents();
    if (!events || !events.statusCode || events.statusCode !== 200) eventLoaderFailed(events.statusCode);
    
    if (strings && strings['about_links_bot']) processEvents(events, brawlerHasher(brawlers));
    else {
        let stringChecker = setInterval(function() { 
            if (strings && strings['about_links_bot']) {
                clearInterval(stringChecker);
                processEvents(events, brawlerHasher(brawlers));
            }
        }, 500);
    }
});