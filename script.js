const requestOptions = {
    method: 'GET',
};

const utmParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
];

const valueExists = (value) => {
    return (value != null && value != '' && value != undefined)
}

$(function () {
    mainPage();
});

// function getLocatioByGeoApify() {
//     fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=8e60f3a1988c4ded9d9a41c3b43efefd", requestOptions)
//         .then(response => response.json())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
// }

function getInfoByIP() {
    $.get("https://ipinfo.io", function (response) {
        // console.log(response);
        $("#ip-info").html(`IP: ${response.ip}<br>ISP: ${response.org}<br>City: ${response.city}<br>Region: ${response.region}<br>Country: ${response.country}`);
    }, "json")
}


function getInfoByZIP(zipCode) {

    let status;
    const url = 'https://api.zippopotam.us/us/' + zipCode;
    let requstResult;

    if (!zipCode || zipCode.length != 5) {
        $("#zip-info").html("Incorrect ZIP Code");
        getUtm();

    } else {
        fetch(url, requestOptions)
            .then(response => {
                status = response.status;
                if (response.ok) {
                    return response.json();
                }
            })
            .then(result => {
                if (status >= 200 && status <= 299) {
                    // console.log("RES", result);
                    requstResult = `Zip Code: ${zipCode}<br>State: ${result.places[0].state}<br>City: ${result.places[0]['place name']}`;
                } else {
                    if (status === 404) {
                        requstResult = "There is no such ZIP Code";
                    } else {
                        requstResult = "Unknown error"
                    }
                }
                $("#zip-info").html(requstResult);
                $("#agent-data").html(`UA: ${window.navigator.userAgent}`);

                getUtm();
            })
            .catch(error => {
                console.log('error', error);
            });
    }
}

function getUtm() {
    let utmQuery = decodeURIComponent(window.location.search.substring(1));
    // var utmQuery = decodeURIComponent("utm_source=123&utm_medium=345&utm_campaign=sdfsdf&utm_term=ffff");
    // console.log("search.substring(1)", utmQuery);

    const referer = window.frames.top.document.referrer;
    if (valueExists(referer)) {
        $("#referer").html(`Referer: ${referer}`);
    }

    const params = new URLSearchParams(utmQuery);
    utmParams.forEach(param => {
        let pValue = params.get(param);
        // console.log("param, pValue", param, pValue);

        if (valueExists(pValue)) {
            let input = document.getElementById(param);
            if (input) {
                input.innerHTML = `${param} : ${pValue}`;
            }
        }
    });
}

function getInfo() {

    let zipCode = document.getElementById("zip-code").value;
    // console.log("zipCode", zipCode);

    fetch('detailedInfo.html')
        .then(res => res.text())
        .then((txt) => {
            $("#main-content").html(txt);
            getInfoByZIP(zipCode);
        });
}

function mainPage() {
    fetch('zipInput.html')
        .then(res => res.text())
        .then((txt) => {
            $("#main-content").html(txt);
        });
}
