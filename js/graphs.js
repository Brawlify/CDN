function apiFetch(path, auth = true) {
    return new Promise(async resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ((path.startsWith('https://')?'':apiOrigin))+path, true);
        if (auth) xhr.setRequestHeader('Authorization', apiKey);
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

function setProgress(number) {
    let pbar = document.getElementById('progressBar');
    if (pbar) {
        document.getElementById('progressDiv').classList.remove('d-none');
        pbar.ariaValuenow=number.toString();
        pbar.style.width=number.toString()+'%';
        pbar.innerHTML=number.toString()+'%';
    }

}

function getClubData(tag) {
    return new Promise(async resolve => {
        var data = getCache('v1/clubs/%23'+tag);
        if (data) return resolve(data);
        if (!data) data = await apiFetch('v1/clubs/%23'+tag);
        if (data && data.hasOwnProperty('statusCode') && data.statusCode == 200) setCache('v1/clubs/%23'+tag, data, 5, 'm');
        return resolve(data);
    });
}

function getPlayerGraph(tag) {
    return new Promise(async resolve => {
        var data = await apiFetch('https://api.brawlapi.com/v1/graphs/player/'+tag, true, apiKey);
        return resolve(data);
    });
}

function getClubGraph(tag) {
    return new Promise(async resolve => {
        var data = await apiFetch('https://api.brawlapi.com/v1/graphs/club/'+tag, true, apiKey);
        return resolve(data);
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
const hexToRgb = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16));

// Run Script
window.addEventListener('load', async () => {
    setProgress(100);
    console.log('Window loaded, starting logic..');
    console.log('Club: '+clubTag);

    let clubData = await getClubData(clubTag);
    if (clubData && clubData.statusCode !== 200) return location.replace("/stats/error/club");

    setProgress(0);
    let pbar = document.getElementById('progressBar');
    if (pbar) {
        pbar.classList.remove('bg-info');
        pbar.classList.add('bg-success');
    }

    let memberRow = document.getElementById('memberRow');
    let pos = 0;
    await asyncForEach(clubData.members, async (member) => {
        console.log('['+((pos+1/clubData.members.length*100).toFixed(0))+'%] Fetching data for '+member.tag);

        let div = document.createElement('div');
        div.id = member.tag.replace('#','');

        let p = document.createElement('p');
        p.setAttribute('class', 'text-muted mb-0');
        let img = document.createElement('img');
        img.src = 'https://cdn.brawlify.com/profile-low/'+member.icon.id.toString()+'.png';
        img.setAttribute('class', 'list-small-ico');
        img.width=24;
        img.height=24;
        img.alt=member.name+'\'s profile icon';
        img.title=member.name+'\'s profile icon';
        p.appendChild(img);

        let a = document.createElement('a');
        a.href='/stats/profile/'+member.tag.replace('#','');
        a.title='View '+member.name+'\'s profile';
        a.setAttribute('class', 'link');

        let span = document.createElement('span');
        span.setAttribute('class', 'opacity p-graphs-name shadow-normal');
        span.style.color='#'+member.nameColor.replace('0xff','');
        span.innerHTML=member.name;

        a.appendChild(span);
        p.appendChild(a);
        div.appendChild(p);

        p = document.createElement('p');
        p.setAttribute('class', 'small mb-0 shadow-normal');
        span = document.createElement('span');
        span.setAttribute('class', 'text-muted');
        span.innerHTML = strings['stats_graphs_member_role']+' ';
        p.appendChild(span);

        span = document.createElement('span');
        span.setAttribute('class', ((member.role=='president')?'r-president':((member.role=='vicePresident')?'r-vice':((member.role=='senior')?'r-senior':'r-member'))));
        span.innerHTML = ((member.role=='president')?strings['stats_club_president']:((member.role=='vicePresident')?strings['bot_vicepresident']:((member.role=='senior')?strings['bot_senior']:strings['stats_club_member'])))
        p.appendChild(span);
        div.appendChild(p);

        p = document.createElement('p');
        p.setAttribute('class', 'small mb-2 shadow-normal');
        p.style.marginTop='-2px';

        span = document.createElement('span');
        span.setAttribute('class', 'text-muted');
        span.innerHTML = strings['stats_graphs_member_active']+' ';
        p.appendChild(span);

        // Activity
        span = document.createElement('span');
        span.setAttribute('class', 'text-dark');

        let graph = await getPlayerGraph(member.tag.replace('#',''));
        console.log('['+member.tag+'] Data status: '+graph.statusCode);
        if (!graph || graph.statusCode !== 200 || graph.data.length < 2) span.innerHTML = strings['stats_graphs_active_0'];
        else {
            let activeAgo = 'notset';
            let trNow = graph.data[graph.data.length-1];
            for (var i=graph.data.length-1;i>=0;i--) {
                if (activeAgo == 'notset' && trNow !== graph.data[i]) activeAgo = graph.data.length-i-2;
            }
            if (activeAgo == 'notset') activeAgo = graph.data.length;
            span.innerHTML = ((activeAgo==0)?strings['stats_graphs_active_1']:((activeAgo==1)?strings['stats_graphs_active_2']:strings['stats_graphs_active_3'].replace('%s',activeAgo)));
            span.setAttribute('class', ((activeAgo==0)?'text-success':((activeAgo==1)?'text-light-green':((activeAgo<4)?'text-warning':'text-danger'))));
        }

        p.appendChild(span);
        div.appendChild(p);

        if (!graph || graph.statusCode !== 200 || graph.data.length < 2) {
            let p = document.createElement('p');
            p.setAttribute('class', 'text-hp2 text-center p-2 pt-5 pb-5 gray-border shadow-normal');
            if (graph && graph.data && graph.data.length < 2) p.innerHTML = strings['stats_graphs_data_missing_days'].replace('%s',(2-graph.data.length)).replace('%s', (((2-graph.data.length)==1)?strings['stats_graphs_missing_day']:strings['stats_graphs_missing_days']));
            else p.innerHTML = strings['stats_error_data_unknown']+' ('+graph.statusCode+')';
            div.appendChild(p);
        } else {
            let d = document.createElement('div');
            div.setAttribute('class','members-graph-div');
            let c = document.createElement('canvas');
            c.id='c-'+member.tag.replace('#','');
            c.setAttribute('class', 'members-graph');
            d.appendChild(c);
            div.appendChild(d);
        }

        div.setAttribute('class', 'col-6 col-md-4 col-lg-3 align-items-center justify-content-center mb-3');
        memberRow.appendChild(div);

        if (graph && graph.statusCode == 200 && graph.data.length >= 2) {
            let backgroundColor = [];
            let borderColor = [];
            let pointHoverBackgroundColor = [];
            let labels = [];
            let data = [];
            let rev = graph.data;
            for (var i = 0; i < rev.length; i++) {
                    data.push(rev[i]);
                    labels.push(graph.labels[i]);
                    let col = hexToRgb("#"+member.nameColor.replace('0xff',''));
                    backgroundColor.push('rgba(0,0,0,0.22)');
                    borderColor.push('rgba('+col[0]+','+col[1]+','+col[2]+',1)');
                    pointHoverBackgroundColor.push('rgba('+col[0]+','+col[1]+','+col[2]+',1)');
            }
            new Chart(document.getElementById('c-'+member.tag.replace('#','')),{ type:'line',data:{ labels:labels,datasets:[{ label:member.name,data:data,backgroundColor:backgroundColor,borderColor:borderColor,pointHoverBackgroundColor:pointHoverBackgroundColor}]}});
        }

        pos++;
        setProgress((pos/clubData.members.length*100).toFixed(0));
    });
    if (pbar) document.getElementById('progressDiv').remove();
    console.log('[Graphs] Finished processing.');
});