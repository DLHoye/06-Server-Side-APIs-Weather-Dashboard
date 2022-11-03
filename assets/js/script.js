const body = $("body");
const search = $("#search");
const today = $("#today");
const weather = $("#weather");
const ui = $("#ui");
const historyEl = $("<section>");

const APIKey = "7405ecf39f3d401e21eb13e191a25000";

let searchEl;

const DateTime = luxon.DateTime;
const background = {
  clouds: "assets/images/day.gif",
  rain: "assets/images/Rain.gif",
  clear: "assets/images/day.gif",
  thunderstorm: "assets/images/Rain.gif",
  night: "assets/images/night.gif",
  sunrise: "assets/images/day.gif",
  sunset: "assets/images/night.gif",
};

let searchHistory = JSON.parse(localStorage.getItem("weatherDashboard"));
searchHistory = !!searchHistory ? searchHistory : {};

weather.hide();
ui.width("375");

//Search city/Location
const createSearch = function () {
  const searchInput = $("<input/>");
  const searchLabel = $("<label/>");
  searchInput
    .attr({ id: "search-input", placeholder: "Search Location", type: "text" })
    .addClass("form-control mb-3");
  searchLabel
    .attr("for", "search-input")
    .text("Search Location")
    .addClass("m-3");
  search.append(searchInput, searchLabel);
  searchEl = $("#search-input");

  //Weather Button
  const searchBtn = $("<button/>");
  searchBtn
    .text("Get Weather")
    .click(getLocation)
    .attr("id", "searchBtn")
    .addClass("btn btn-primary mb-1 align-self-end");
  search.append(searchBtn);
  const hr = $("<hr>");
  search.append(hr);

  showHistory();
};

//History
const showHistory = function () {
  let searches = Object.keys(searchHistory);
  historyEl.addClass("container");
  search.append(historyEl);
  const numShow = 14;
  let maxHistory = searches.length >= numShow ? -numShow : -searches.length;
  searches = searches.slice(maxHistory);
  searches.forEach((history) => {
    addToHistory(history);
  });
};

const addToHistory = function (history) {
  const historyBtn = $("<button/>");
  const rowContainer = $("<div>");
  historyBtn
    .text(history)
    .click(getLocation)
    .addClass("btn btn-info mb-3")
    .attr("id", "historyBtn");
  rowContainer.addClass("row").append(historyBtn);
  historyEl.append(rowContainer);
};

//Get Search Coordinates
const getLocation = function (e) {
  weather.fadeOut();
  const tgt = $(e.target);
  const City = tgt[0].id === "searchBtn" ? searchEl.val() : tgt[0].textContent;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${City},3166&limit=10&appid=${APIKey}`;
  fetch(url).then(function (res) {
    if (res.ok)
      res.json().then(function (data) {
        console.log(data);
        const coord = data[0].lat + "," + data[0].lon + "," + data[0].name;
        searchHistory[City] = coord;
        localStorage.setItem("weatherDashboard", JSON.stringify(searchHistory));
        if (tgt[0].id === "searchBtn") addToHistory(City);
        ui.width("1500");
        weather.fadeIn();
        getWeather(data[0].lat, data[0].lon, data[0].name);
      });
  });
};

//Get Weather from Coordinates
const getWeather = function (lat, lon, loc) {
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
  fetch(url).then((res) => {
    if (res.ok)
      res.json().then((data) => {
        console.log(data);
        displayWeather(data, loc, today);
      });
  });
};

createSearch();
