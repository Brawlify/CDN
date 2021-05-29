Array.from(document.getElementsByClassName('premiumWindowOpener')).forEach(item => item.addEventListener('click', function(e) {
    e.preventDefault();
    $(".inspectStatsHide").css('display', 'none');
    $("body").css('overflow', 'hidden');
    document.getElementById('gameAccountWindow').style.display = "block";
    if ($("#tyche_trendi_parent_container")) $("#tyche_trendi_parent_container").css('display', 'none');
}));

document.getElementById('closePremiumWindow').addEventListener('click', function(e) {
    e.preventDefault();
    $(".inspectStatsHide").css('display', 'block');
    $("body").css('overflow', 'auto');
    document.getElementById('gameAccountWindow').style.display = "none";
    if ($("#tyche_trendi_parent_container")) $("#tyche_trendi_parent_container").css('display', 'block');
});

statusText = document.getElementById('inputStatus');
tagForm = document.getElementById('tagInputForm');
windowLoading = document.getElementById('windowLoading');
purchaseBox = document.getElementById('purchaseBox');
savedPlayers = document.getElementById('savedPlayers');
ppContainer = document.getElementById('pp-container');
tagInput = document.getElementById('tagInput');
var tagFormInUse = false;

idInput = document.getElementById('idInput');
idInputStatus = document.getElementById('idInputStatus');
idInputResult = document.getElementById('idInputResult');
var idFormInUse = false;

document.getElementById('idInputForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (idFormInUse) return false;
    idFormInUse = true;

    if (!idInput.value) {
        idInputStatus.innerHTML = strings['premium_verify_error_1'];
        idInputStatus.classList.add('text-warning');
        idInputStatus.style.display = "block";
        idFormInUse = false;
        return false;
    }

    windowLoading.style.display = "block";
    purchaseBox.style.display = "none";
    document.getElementById('idInputBtn').classList.add('disabled');
    tagInput.value = tagInput.value.toUpperCase().replace(/O/g, "0").replace(/ /g, "").replace("#", "");
    userTag = tagInput.value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', ((lang=='en')?'':'/'+lang)+'/dashboard/verify-order2?type=2&user=' + userTag + '&orderId=' + idInput.value, true);
    xhr.timeout = 15000;
    xhr.send();
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response && response.error !== true) {
                Cookies.set('premiumUser', {tag: userTag}, {expires: 365});
                idInputResult.classList.add('text-success');
                idInputStatus.classList.remove('text-warning');
                idInputStatus.classList.remove('text-danger');
                idInputStatus.classList.add('text-success');
                idInputStatus.innerHTML = strings['premium_verify_success_1'];
                idInputResult.innerHTML = strings['premium_verify_success_2'];
                idInputStatus.style.display = "block";
                idInputResult.style.display = "block";
                windowLoading.style.display = "none";
                purchaseBox.style.display = "block";
                return setTimeout(()=>location.reload(), 5000);
            } else {
                idInputStatus.classList.add('text-warning');
                idInputStatus.style.display = "block";
                if (xhr.status == 403) {
                    idInputStatus.innerHTML = strings['premium_verify_error_1'];
                } else {
                    idInputStatus.innerHTML = response.message;
                }
                idFormInUse = false;
                windowLoading.style.display = "none";
                purchaseBox.style.display = "block";
                document.getElementById('idInputBtn').classList.remove('disabled');
            }
        } else if (xhr.readyState == 4) {
            idFormInUse = false;
            idInputStatus.classList.add('text-warning');
            idInputStatus.style.display = "block";
            var response = null;
            if (xhr.responseText) response = JSON.parse(xhr.responseText);
            if (response) idInputStatus.innerHTML = response.message;
            else idInputStatus.innerHTML = strings['premium_verify_error_2'];
            windowLoading.style.display = "none";
            purchaseBox.style.display = "block";
            document.getElementById('idInputBtn').classList.remove('disabled');
        }
    }
});

function startTransaction() {
    fetch('/about/premium-payment-session/'+document.getElementById('tagInput').value, { method: 'POST' })
    .then(function(response) {
      return response.json();
    })
    .then(function(session) {
      return Stripe(stripePublic).redirectToCheckout({ sessionId: session.id });
    })
    .then(function(result) {
      if (result.error) alert(result.error.message);
    })
    .catch(function(error) {
      console.error('Error:', error);
    });
}

tagForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (tagFormInUse) return false;
    tagFormInUse = true;
    windowLoading.style.display = "block";
    purchaseBox.style.display = "none";
    tagInput.value = tagInput.value.toUpperCase().replace(/O/g, "0").replace(/ /g, "").replace("#", "");
    userTag = tagInput.value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', ((lang=='en')?'':'/'+lang)+'/dashboard/verify-order2?type=0&user=' + userTag, true);
    xhr.timeout = 15000;
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            windowLoading.style.display = "none";
            purchaseBox.style.display = "block";
            if (response && response.error !== true) {
                if (document.getElementById('premiumOverview')) document.getElementById('premiumOverview').style.display = 'none';
                document.getElementById('tagInputBtn').classList.add('disabled');
                statusText.style.display = "none";
                savedPlayers.style.display = "none";
                if (response.user) {
                    document.getElementById('userIcon').src = 'https://cdn.brawlify.com/profile-low/' + response.user.avatarId + '.png';
                    document.getElementById('userName').innerHTML = response.user.name;
                    document.getElementById('userName').style.color = '#' + response.user.nameColorCode;
                    document.getElementById('userTrophies').innerHTML = Number(response.user.trophies).toLocaleString("en");
                    document.getElementById('userStats').style.display = "block";
                }
                if (response.user.isPremium == false) {
                    startTransaction();
                    document.getElementById('purchaseStep2').style.display = "block";
                    var checkoutBtn = document.getElementById('checkout-button');
                    if (checkoutBtn) {
                      checkoutBtn.addEventListener('click', function() {
                        startTransaction();
                      });
                    }
                } else {
                    document.getElementById('purchaseStep3').style.display = "block";
                }
            } else {
                statusText.style.display = "block";
                statusText.innerHTML = response.message;
                statusText.classList.add('text-warning');
                tagFormInUse = false;
            }
        } else if (xhr.readyState == 4) {
            var response = null;
            if (xhr.responseText) response = JSON.parse(xhr.responseText);
            windowLoading.style.display = "none";
            purchaseBox.style.display = "block";
            statusText.style.display = "block";
            if (response) {
                statusText.innerHTML = response.message;
                statusText.classList.add('text-warning');
            } else {
                statusText.innerHTML = strings['premium_purchase_error_4'];
                statusText.classList.add('text-danger');
            }
            tagFormInUse = false;
        }
    }
});

function showItem(parentName, path, value2, value1, customClass, isTag, statsName, eventVal, onClick) {
    var a = document.createElement('a');
    a.title = value1;
    a.href = path;
    a.setAttribute('onclick', ((onClick) ? onClick : '') + "ga('send', 'event', { eventCategory: 'localStorage', eventAction: '" + statsName + "', eventLabel: '" + ((isTag) ? value2 : value1) + "', eventValue: " + eventVal + ", transport: 'beacon' });");
    a.setAttribute('class', 'btn ' + customClass + ' d-flex flex-column mr-1 mt-2');
    var d1 = document.createElement("div");
    d1.setAttribute('class', 'text-center');
    d1.appendChild(document.createTextNode(value1));
    a.appendChild(d1);
    var d2 = document.createElement("div");
    d2.setAttribute('class', 'small text-right text-muted');
    d2.appendChild(document.createTextNode(((isTag) ? '#' : '') + value2));
    a.appendChild(d2);
    document.getElementById(parentName).appendChild(a);
}

if (localStorage.getItem("savedProfiles")) {
    var profiles = JSON.parse(localStorage.getItem("savedProfiles"));
    if (profiles.length == 1) {
        document.getElementById("tagInput").value = profiles[0].tag;
    } else {
        for (var i = 0; i < profiles.length; i++) {
            showItem('savedPlayers', '#', profiles[i].tag, profiles[i].name, 'btn-outline-info', true, 'Payment Window', i, 'document.getElementById("tagInput").value="' + profiles[i].tag + '";//');
        }
    }
}

window.addEventListener('load', () => {
    var premiumUser = Cookies.getJSON('premiumUser');
    if (premiumUser && (premiumUser.id || premiumUser.tag)) {
        var confirmSpan = document.getElementById('postConfirmSpan');
        if (confirmSpan) {
            confirmSpan.innerHTML = strings['premium_purchase_active'];
            confirmSpan.classList.add('text-success');
            confirmSpan.style.display = "block";
        }
        var mainConfirmSpan = document.getElementById('mainConfirmSpan');
        if (mainConfirmSpan) {
            mainConfirmSpan.innerHTML = 'Premium';
            mainConfirmSpan.classList.add('text-success');
            mainConfirmSpan.classList.remove('text-warning');
        }
    }
});