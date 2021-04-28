// global variables
var storage = {};
var cryptoFormEl = document.querySelector("#crypto-form");
var searchButtonEl = document.querySelector("#search-btn");
var cryptoInputEl = document.querySelector("#crypto-search");
var cryptoInformationEL = document.querySelector("#search-info");
var searchResultsEL = document.querySelector("#coin-results");
var addToWallet = document.querySelector("#add-wallet");
var whatToWatch = document.querySelector("#what-to-watch");
var trendingCoinEl = document.querySelector("#trending-container");
var walletValueEl = document.querySelector("#value");
// undefiend variables
var getCoinPrice;
var getCoinName;
var getCoinImg;
var coinChangePercent;
var coinPriceChange;


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

document.addEventListener("click", function (event) {
    if (event.target && event.target.id == "add-wallet") {
        event.preventDefault();

        saveWatched();

    }

});

function loadWatched() {
    var walletEl = document.querySelector("#what-to-watch");
    var crypto = JSON.parse(localStorage.getItem("crypto")) || [];
    walletEl.innerHTML = ""
    for (i = 0; i < crypto.length; i++) {
        var coinEl = document.createElement("div");
        coinEl.setAttribute("id", "coin-" + i);
        coinEl.classList = "pop-up-div btn"

        var coinNameEl = document.createElement("h4");
        coinNameEl.innerHTML = crypto[i].name + "   ";
        coinEl.appendChild(coinNameEl);

        var coinImgEl = document.createElement("img");
        coinImgEl.setAttribute("src", crypto[i].image);
        coinImgEl.setAttribute("alt", crypto[i].name + "icon" )
        coinImgEl.style.width = "35px";
        coinImgEl.style.height = "35px";
        coinNameEl.appendChild(coinImgEl);

        var coinPriceEl = document.createElement("p");
        coinPriceEl.innerHTML = "Per Coin $" + crypto[i].price;
        coinEl.appendChild(coinPriceEl);

        var coinButtonEl = document.createElement("button");
        coinButtonEl.innerHTML = "Delete"
        coinButtonEl.classList = "search-btn btn"
        coinEl.appendChild(coinButtonEl);



        walletEl.appendChild(coinEl);
    }


};

function saveWatched() {

    var grabCrypto = JSON.parse(localStorage.getItem("crypto")) || [];
    grabCrypto.push({
        price: getCoinPrice,
        name: getCoinName,
        image: getCoinImg,
        percent: coinChangePercent,
        priceChange: coinPriceChange
    });
    localStorage.setItem("crypto", JSON.stringify(grabCrypto));
    loadWatched();

}

// fetch function to get type of coin by name.
var getCrypto = function (cryptoName) {

    var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + cryptoName;

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {

                        // variables for internal information
                        getCoinPrice = data[0].current_price;
                        getCoinName = data[0].name;
                        getCoinImg = data[0].image;
                        coinChangePercent = data[0].price_change_percentage_24h;
                        coinPriceChange = data[0].price_change_24h;


                        // create html elements 

                        var wallet = document.createElement("div");
                        wallet.setAttribute("class", "pop-up-div");

                        var addBtnEl = document.createElement("button")
                        addBtnEl.textContent = "Add to Wallet";
                        addBtnEl.setAttribute("id", "add-wallet");
                        addBtnEl.classList = "btn search-btn"

                        var nameEl = document.createElement("h4");
                        nameEl.textContent = getCoinName + " ";

                        var imageEl = document.createElement("img");
                        imageEl.setAttribute("src", getCoinImg);
                        imageEl.setAttribute("alt", getCoinName + " icon");
                        imageEl.style.width = "50px";
                        imageEl.style.height = "50px";

                        var priceEl = document.createElement("p");
                        priceEl.textContent = "Current Price: $" + getCoinPrice + " USD";
                        wallet.setAttribute("class", "pop-up-p");

                        var priceChangeEl = document.createElement("p");
                        priceChangeEl.textContent = "Price change last 24hr: $" + coinPriceChange + " USD";
                        wallet.setAttribute("class", "pop-up-p2");

                        var percentageChangeEL = document.createElement("p");
                        percentageChangeEL.textContent = "Percentage Change last 24hr: " + coinChangePercent + "%";
                        wallet.setAttribute("class", "pop-up-p3");

                        // append elements to the div
                        nameEl.appendChild(imageEl);
                        wallet.appendChild(nameEl);
                        wallet.appendChild(priceEl);
                        wallet.appendChild(priceChangeEl);
                        wallet.appendChild(percentageChangeEL);
                        wallet.appendChild(addBtnEl);
                        // append div to the page
                        searchResultsEL.innerHTML = "";
                        searchResultsEL.appendChild(wallet);

                        // localStorage.setItem("cryptoName", getCoinName);
                        // localStorage.setItem("cryptoPrice", getCoinPrice);
                        // localStorage.setItem("cryptoImg", getCoinImg);
                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })

}

// below makes the heading flicker in upon load
var target = window.document.getElementsByTagName('h1')[0]

var flickerLetter = letter => `<span style="animation: text-flicker-in-glow ${Math.random() * 4}s linear both ">${letter}</span>`
var colorLetter = letter => `<span style="color: hsla">${letter}</span>`;
var flickerAndColorText = text =>
    text
        .split('')
        .map(flickerLetter)
        .map(colorLetter)
        .join('');
var cryptoKnight = target => target.innerHTML = flickerAndColorText(target.textContent);


cryptoKnight(target);
target.onclick = ({ target }) => cryptoKnight(target);
// ^^^^^ END OF FLICKER^^^^^



$("img").click(function () {
    $(this).hide().fadeIn(10000);
});




// API call to show the top trading cryptocurrencies within the last 24 hours
var trendingCoins = function () {

    var trendingApi = "https://api.coingecko.com/api/v3/search/trending"
    fetch(trendingApi)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // console.log(data);
                        trendingCoinEl.innerHTML = "";
                        for (var i = 0; i <= 6; i++) {
                            // variables for internal information
                            var trendingCoinItem = data.coins[i].item;
                            var trendingCoinId = data.coins[i].item.id;
                            var trendingCoinName = data.coins[i].item.name;
                            var trendingCoinImg = data.coins[i].item.large;
                            var trendingCoinMarket = data.coins[i].item.market_cap_rank;

                            // create elements for page
                            var trendList = document.createElement("div");
                            trendList.setAttribute("class", "pop-up-div");

                            var trendingNameEl = document.createElement("h4");
                            trendingNameEl.textContent = trendingCoinName + "  ";


                            var trendingIdEl = document.createElement("p");
                            trendingIdEl.textContent = "Search ID:  " + trendingCoinId;

                            var trendingMarketEl = document.createElement("p");
                            trendingMarketEl.textContent = "Market Cap Rating: " + trendingCoinMarket;

                            var trendingImageEl = document.createElement("img");
                            trendingImageEl.setAttribute("src", trendingCoinImg);
                            trendingImageEl.style.width = "50px";
                            trendingImageEl.style.height = "50px";

                            // append elements to the trending dv
                            trendList.appendChild(trendingMarketEl);
                            trendList.appendChild(trendingIdEl);
                            trendingNameEl.appendChild(trendingImageEl);
                            trendList.appendChild(trendingNameEl);

                            // append the div to the page

                            trendingCoinEl.appendChild(trendList);

                        }
                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })
};

searchButtonEl.addEventListener("click", cryptoSubmitHandler);
trendingCoins();
loadWatched();