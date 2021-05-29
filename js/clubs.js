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

function getClubs(region = 'global', env = 'g') {
    return new Promise(async resolve => {
        var data = getCache('v1/rankings/'+region+'/clubs');
        if (data) return resolve(data);
        if (!data) data = await apiFetch('v1/rankings/'+region+'/clubs');
        if (data && data.hasOwnProperty('statusCode') && data.statusCode == 200) setCache('v1/rankings/'+region+'/clubs', data, 55, 's');
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
        data.items.forEach(club => {
            let tr = document.createElement("tr");
            tr.id = club.tag.replace('#','');

            let th = document.createElement("th");
            th.classList.add('text-hp','font-weight-normal','text-center','shadow-normal','d-none','d-sm-table-cell');
            th.scope='row';
            th.innerHTML = club.rank;
            tr.appendChild(th);

            let td = document.createElement('td');
            td.classList.add('text-left');
            let img = document.createElement('img');
            img.src = 'https://cdn.brawlify.com/club/'+club.badgeId+'.png?v=1';
            img.classList.add('player-ico');
            img.height=30;img.width=30;
            img.title=club.name+'\'s club icon';img.alt=club.name+'\'s club icon';
            td.appendChild(img);

            let a = document.createElement('a');
            a.classList.add('link','opacity','shadow-normal','c-color-text');
            a.title='View '+club.name+'\ club stats';
            a.href='/stats/club/'+club.tag.replace('#','');
            a.innerHTML = ' '+club.name;
            td.appendChild(a);
            tr.appendChild(td);

            let td2 = document.createElement('td');
            td2.classList.add('text-left','shadow-normal','d-none','d-sm-table-cell');
            td2.innerHTML=club.memberCount;
            let span = document.createElement('span');
            span.classList.add('text-hp3');
            span.innerHTML=' / 100';
            td2.appendChild(span);
            tr.appendChild(td2);

            let td3 = document.createElement('td');
            td3.classList.add('text-right','text-warning','shadow-normal','pr-2');
            td3.innerHTML=club.trophies.toLocaleString("en");
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
        let data = await getClubs(region, env);
        if (data && data.statusCode == 200) {
            refreshLB(data);
            startProgress();
        } else {
            document.getElementById('progressDiv').classList.add('d-none');
        }
    }, 60000);
});