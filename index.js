const searchFilter = document.getElementById("coinSearch");
const sortMarketButton = document.getElementById("sortMarket");
const percentageButton = document.getElementById("sortPercentage");
const coinList = document.getElementById("coinList");
const noCoins = document.getElementById("noCoins");

let resultApi = [];
let isMarketAsc = false;
let isPercentageAsc = false;

const fetchCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );
    resultApi = await response.json();
    renderData(resultApi);
    return resultApi;
  } catch (error) {
    console.error(error);
  }
};

function renderData(data) {
  coinList.innerHTML = "";

  if (data.length === 0) {
    noCoins.style.display = "block";
    return;
  }

  noCoins.style.display = "none";

  data.forEach((coin) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <img src="${coin.image}" width="24" style="vertical-align: middle;" />
        &nbsp; ${coin.name}
      </td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td style="color:${
        coin.price_change_percentage_24h > 0 ? "lightgreen" : "red"
      };">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
    `;

    coinList.appendChild(row);
  });
}

searchFilter.addEventListener("input", () => {
  const query = searchFilter.value.toLowerCase();
  const filter = resultApi.filter(
    (coins) =>
      coins.name.toLowerCase().includes(query) ||
      coins.symbol.toLowerCase().includes(query)
  );
  renderData(filter);
});

sortMarketButton.addEventListener("click", () => {
  isMarketAsc = !isMarketAsc;

  const sorted = [...resultApi].sort((a, b) =>
    isMarketAsc ? a.market_cap - b.market_cap : b.market_cap - a.market_cap
  );

  renderData(sorted);
});

percentageButton.addEventListener("click", () => {
  isPercentageAsc = !isPercentageAsc;

  const sorted = [...resultApi].sort((a, b) =>
    isPercentageAsc
      ? a.price_change_percentage_24h - b.price_change_percentage_24h
      : b.price_change_percentage_24h - a.price_change_percentage_24h
  );

  renderData(sorted);
});

fetchCoins();
