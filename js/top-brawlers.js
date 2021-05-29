function apiFetch(path, auth = true) {
    return new Promise(async resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ((path.startsWith('https://')?'':apiOrigin+''))+path, true);
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

function getTopBrawlers(brawlerId, region = 'global', env = 'g') {
    return new Promise(async resolve => {
        var data = getCache('v1/rankings/'+region+'/brawlers/'+brawlerId);
        if (data) return resolve(data);
        if (!data) data = await apiFetch('v1/rankings/'+region+'/brawlers/'+brawlerId);
        if (data && data.hasOwnProperty('statusCode') && data.statusCode == 200) setCache('v1/rankings/'+region+'/brawlers/'+brawlerId, data, 55, 's');
        return resolve(data);
    });
}

function refreshLB(data) {
    if (!data || data.statusCode !== 200) return;

    if (data && data.items) {
        const brawlerContainer = document.getElementById("brawlerContainer");
        while (brawlerContainer.firstChild) {
            brawlerContainer.removeChild(brawlerContainer.lastChild);
        }
        data.items.forEach(player => {
            let tr = document.createElement("tr");
            tr.id = player.tag.replace('#','');

            let th = document.createElement("th");
            th.classList.add('text-hp','font-weight-normal','text-center','shadow-normal','d-none','d-sm-table-cell');
            th.scope='row';
            th.innerHTML = player.rank;
            tr.appendChild(th);

            let td = document.createElement('td');
            td.classList.add('text-left');
            let img = document.createElement('img');
            img.src = 'https://cdn.brawlify.com/profile-low/'+player.icon.id+'.png?v=1';
            img.classList.add('player-ico');
            img.height=30;img.width=30;
            img.title=player.name+'\'s profile icon';img.alt=player.name+'\'s profile icon';
            td.appendChild(img);

            let a = document.createElement('a');
            a.classList.add('link','opacity','shadow-normal');
            a.title='View '+player.name+'\'s stats';
            a.href='/stats/profile/'+player.tag.replace('#','');
            a.style.color='#'+player.nameColor.replace('0xff','');
            a.innerHTML = ' '+player.name;
            td.appendChild(a);

            tr.appendChild(td);

            let td2 = document.createElement('td');
            td2.classList.add('text-left','d-none',((player.club&&player.club.name)?'text-hp':'text-muted'),'shadow-normal','d-md-table-cell');
            td2.innerHTML=((player.club&&player.club.name)?player.club.name:'No club');
            tr.appendChild(td2);

            let td3 = document.createElement('td');
            td3.classList.add('text-right','text-warning','shadow-normal','pr-2');
            td3.innerHTML=player.trophies.toLocaleString("en");
            tr.appendChild(td3);

            brawlerContainer.appendChild(tr);
        });
    }
}

function startProgress() {
    let pbar = document.getElementById('reloadProgress');
    if (pbar) {
        document.getElementById('progressDiv').classList.remove('d-none');
        pbar.ariaValuenow="100";
        pbar.style.width='100%';
        let p = 100;
        let id = setInterval(frame, 600);
        function frame() {
          if (p < 0) clearInterval(id);
          else {
            p--;
            pbar.ariaValuenow=p.toString();
            pbar.style.width=p.toString()+'%';
          }
        }
    }
}

// Run Script
window.addEventListener('load', async () => {
    if (env == 'cn') return;
    startProgress();
    setInterval(async function() {
        let data = await getTopBrawlers(brawlerId, region, env);
        if (data && data.statusCode == 200) {
            refreshLB(data);
            startProgress();
        } else {
            document.getElementById('progressDiv').classList.add('d-none');
        }
    }, 60000);
});