// global variables
var cryptoFormEl = document.querySelector("#crypto-form");
var searchButtonEl = document.querySelector("#search-btn");
var cryptoInputEl = document.querySelector("#crypto-search");
var cryptoInformationEL = document.querySelector("#search-info");

// submit event handler
var cryptoSubmitHandler = function (event) {
    event.preventDefault();
    // pulls the value from input form
    var cryptoName = cryptoInputEl.value.trim();

    if (cryptoName) {
        // runs the typed name from input through the fetch
        getCrypto(cryptoName);
        cryptoInputEl.value = "";

    }
    else {
        // needs modal here instead of console.log
        console.log("enter a crypto name.")
    }
    
}
// fetch function to get type of coin by name.
var getCrypto = function (cryptoName) {

    var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + cryptoName

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);


                        var getCoinPrice = data[0].current_price;
                        var getCoinName = data[0].name;
                        var getCoinImg = data[0].image;
                        var coinChangePercent = data[0].price_change_percentage_24h;
                        var coinPriceChange = data[0].price_change_24h;
                        

                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })

}

// var cryptoDrop = function (cryptoName) {

//     var getCurrentPrice = [0].current_price;

//     console.log(getCurrentPrice);
// }


// var eventButtonHandler = function(event) {


// }
searchButtonEl.addEventListener("click", cryptoSubmitHandler);