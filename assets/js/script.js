// global variables
var cryptoFormEl = document.querySelector("#crypto-form");
var searchButtonEl = document.querySelector("#search-btn");
var cryptoInputEl = document.querySelector("#crypto-search");
var cryptoInformationEL = document.querySelector("#search-info");
var searchResultsEL = document.querySelector("#coin-results");

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

                        // variables for internal information
                        var getCoinPrice = data[0].current_price;
                        var getCoinName = data[0].name;
                        var getCoinImg = data[0].image;
                        var coinChangePercent = data[0].price_change_percentage_24h;
                        var coinPriceChange = data[0].price_change_24h;
                        

                        // create html elements 

                        var wallet = document.createElement("div");

                        var addBtnEl = document.createElement("button")
                        addBtnEl.textContent = "Add to Wallet"
                        addBtnEl.className = "search-btn";
                        
                        var nameEl = document.createElement("h4");
                        nameEl.textContent = "Name: " + getCoinName;
                        
                        var imageEl = document.createElement("img");
                        imageEl.setAttribute("src", getCoinImg);
                        imageEl.setAttribute("alt", getCoinName + " icon");
                        imageEl.style.width = "50px";
                        imageEl.style.height = "50px";

                        var priceEl = document.createElement("p");
                        priceEl.textContent = "Current Price: $" + getCoinPrice + " USD";

                        var priceChangeEl = document.createElement("p");
                        priceChangeEl.textContent = "Price change last 24hr: $" + coinPriceChange + " USD";

                        var percentageChangeEL = document.createElement("p");
                        percentageChangeEL.textContent = "Percentage Change last 24hr: " + coinChangePercent + "%";

                        // append elements to the div
                        wallet.appendChild(nameEl);
                        wallet.appendChild(imageEl);
                        wallet.appendChild(priceEl);
                        wallet.appendChild(priceChangeEl);
                        wallet.appendChild(percentageChangeEL);
                        wallet.appendChild(addBtnEl);
                        // append div to the page
                        searchResultsEL.innerHTML = "";
                        searchResultsEL.appendChild(wallet);
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