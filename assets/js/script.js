var cryptoFormEl =  document.querySelector("#crypto-form");
var searchButtonEl =  document.querySelector("#search-btn");
var cryptoInputEl =  document.querySelector("#crypto-search");


var cryptoSubmitHandler = function(event) {
    event.preventDefault();

    var cryptoName = cryptoInputEl.value.trim();

    if (cryptoName) {
        getCrypto(cryptoName);
        cryptoInputEl.value = "";
    }
    else {
        console.log("enter a crypto name.")
    }
    console.log(event);
}

var getCrypto = function(cryptoName) {

    var apiUrl1 = "https://api.coinpaprika.com/v1/search?=" + cryptoName;
    var apiUrl2 = "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
    var apiUrl3 = "https://api.coinpaprika.com/v1/global"

    fetch(apiUrl2)
        .then(function(response) {

            if (response.ok) {
                response.json()
                    .then(function(data) {
                        console.log(data);
                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })
}
getCrypto("bitcoin");
cryptoFormEl.addEventListener("submit", cryptoSubmitHandler);