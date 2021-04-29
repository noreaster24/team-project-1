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
var walletSumEl = document.querySelector("#wallet-sum");
var globalChart = document.querySelector("#global-charts");
// undefined variables
var getCoinPrice;
var getCoinName;
var getCoinImg;
var coinChangePercent;
var coinPriceChange;
var total = 0;
var coinAmount = 0;
// local storage 
var grabCrypto = JSON.parse(localStorage.getItem("crypto")) || [];
console.log(grabCrypto)
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
        var coinAmountEl = document.querySelector("#add-amount-input");
        coinAmount = parseFloat(coinAmountEl.value);
        saveWatched();

    } 

});

function loadWatched() {
    var walletEl = document.querySelector("#what-to-watch");

    walletEl.innerHTML = ""
    for (i = 0; i < grabCrypto.length; i++) {
        var coinEl = document.createElement("div");
        coinEl.setAttribute("id", "coin-" + grabCrypto[i].id);
        coinEl.classList = "pop-up-div delete cell";


        dateEl = document.createElement("p");
        dateEl.innerHTML = grabCrypto[i].watchDate;
        coinEl.appendChild(dateEl);

        var coinNameEl = document.createElement("h4");
        coinNameEl.innerHTML = grabCrypto[i].name + "   ";
        coinEl.appendChild(coinNameEl);

        var coinImgEl = document.createElement("img");
        coinImgEl.setAttribute("src", grabCrypto[i].image);
        coinImgEl.setAttribute("alt", grabCrypto[i].name + "icon")
        coinImgEl.style.width = "35px";
        coinImgEl.style.height = "35px";
        coinNameEl.appendChild(coinImgEl);

        var coinPriceEl = document.createElement("p");
        coinPriceEl.innerHTML = "Per Coin $" + grabCrypto[i].price;
        coinEl.appendChild(coinPriceEl);

        var coinButtonEl = document.createElement("button");
        coinButtonEl.innerHTML = "Delete"
        coinButtonEl.classList = "search-btn btn"
        coinButtonEl.addEventListener("click", function (event) {
            event.preventDefault();
            event.target.parentElement.style.display = "none"

            var coinId = event.target.parentElement.id.split("coin-")[1];
            grabCrypto = grabCrypto.filter(cryptoObj => cryptoObj.id !== coinId)
           
            localStorage.setItem("crypto", JSON.stringify(grabCrypto));
        })

        coinEl.appendChild(coinButtonEl);

        walletEl.appendChild(coinEl);

    }


    walletSum();

};

function saveWatched() {
    console.log(grabCrypto)
    grabCrypto.push({
        price: getCoinPrice,
        name: getCoinName,
        image: getCoinImg,
        percent: coinChangePercent,
        priceChange: coinPriceChange,
        amount: coinAmount,
        watchDate: Date(),
        id: create_UUID()
    });
    localStorage.setItem("crypto", JSON.stringify(grabCrypto));
    loadWatched();

}
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// fetch function to get type of coin by name.
var getCrypto = function (cryptoName) {

    var apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + cryptoName;

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {
                        displayCryptoInputCard(data[0]);
                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })
}

/**
 * Creates a crypto card on the page
 * @param {*} cryptoData coin in coinGecko format
 */
function displayCryptoInputCard(cryptoData) {
    // variables for internal information
    getCoinPrice = cryptoData.current_price;
    getCoinName = cryptoData.name;
    getCoinImg = cryptoData.image;
    coinChangePercent = cryptoData.price_change_percentage_24h;
    coinPriceChange = cryptoData.price_change_24h;


    // create html elements 

    var wallet = document.createElement("div");
    wallet.classList = "class", "pop-up-div cell";

    var addBtnEl = document.createElement("button")
    addBtnEl.textContent = "Add to Wallet";
    addBtnEl.setAttribute("id", "add-wallet");
    addBtnEl.classList = "btn search-btn"
    addBtnEl.addEventListener("click", function () {
        addBtnEl.remove();
    })

    var addAmountEl = document.createElement("input");
    addAmountEl.setAttribute("id", "add-amount-input");
    

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
    wallet.appendChild(addAmountEl);
    wallet.appendChild(addBtnEl);
    // append div to the page
    searchResultsEL.innerHTML = "";
    searchResultsEL.appendChild(wallet);

};

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
                            let trendingCoinId = data.coins[i].item.id;
                            var trendingCoinName = data.coins[i].item.name;
                            var trendingCoinImg = data.coins[i].item.large;
                            var trendingCoinMarket = data.coins[i].item.market_cap_rank;

                            // create elements for page
                            var trendList = document.createElement("div");
                            trendList.classList = "pop-up-div cell";

                            var trendingNameEl = document.createElement("h4");
                            trendingNameEl.textContent = trendingCoinName + "  ";

                            // button with an event listener built into it
                            var trendingButtonEl = document.createElement("button");
                            trendingButtonEl.addEventListener("click", function () {
                                // get info from getCrypto()
                                getCrypto(trendingCoinId);
                            })
                            trendingButtonEl.textContent = "Add to List";

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
                            trendList.appendChild(trendingButtonEl);

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


function walletSum() {

    total = 0;
    var i;
    for (i = 0; i < grabCrypto.length; i++) {
        total += grabCrypto[i].price * grabCrypto[i].amount;
    }
    walletSumEl.textContent = total;
}

function cryptoGlobal() {
    const urlApi = "https://api.coinpaprika.com/v1/global"
    fetch(urlApi)
        .then(function (response) {

            if (response.ok) {
                response.json()
                    .then(function (data) {

                        var globalDomPercentage = data.bitcoin_dominance_percentage;
                        var globalMarketCap = data.market_cap_usd;
                        var global24Hr = data.volume_24h_usd;
                        var globalMarketChange = data.market_cap_change_24h;
                        var globalVolumeChange = data.volume_24h_change_24h;

                        var globalDiv = document.createElement("div");
                        globalDiv.classList = "pop-up-div"

                        var globalList = document.createElement("ul");

                        var globalCap = document.createElement("p");
                        globalCap.innerHTML = "Market Cap: " + globalMarketCap;

                        var globalCapChange = document.createElement("span");
                        globalCapChange.innerHTML = "   " + "Change: " + globalMarketChange + "%";

                        var globalVolume = document.createElement("p");
                        globalVolume.innerHTML = "        Volume 24Hr: " + global24Hr;

                        var globalVol24 = document.createElement("span");
                        globalVol24.innerHTML = "      " + "Change: " + globalVolumeChange + "%";

                        var globalBitCoinDom = document.createElement("p");
                        globalBitCoinDom.innerHTML = "       BTC Dominance: " + globalDomPercentage + "%";

                        // append to div
                        globalList.appendChild(globalCap);
                        globalCap.appendChild(globalCapChange);
                        globalList.appendChild(globalVolume);
                        globalVolume.appendChild(globalVol24);
                        globalList.appendChild(globalBitCoinDom);
                        globalDiv.appendChild(globalList);

                        // append the div to the page
                        globalChart.appendChild(globalDiv);

                    });
            }
            else {
                console.log("error: " + response.statusText);
            }
        })
}



searchButtonEl.addEventListener("click", cryptoSubmitHandler);
cryptoGlobal();
trendingCoins();
loadWatched();
