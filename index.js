// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=a435f9bcd97990dc25402e71f475ca62
const btn = document.querySelector(".btn");
const res = document.querySelector(".result");
const inputField = document.querySelector("#input-field");
const searchBar = document.querySelector(".search");
const cityElem = document.querySelector(".city");
const tempElem = document.querySelector(".temp");
const min_maxElem = document.querySelector(".min-max");
const condElem = document.querySelector(".cond");
const condimgElem = document.querySelector(".cond-img");
const bodyElem = document.querySelector("body");
const root = document.querySelector(":root");
const countryImg = document.querySelector(".country");
const slideBtn = document.querySelector(".slide-btn");
const locBtn = document.querySelector(".my-location");
var data;
const playSound = () => {
  let aud = new Audio("sounds/click.wav");
  aud.play();
};
const playSound2 = () => {
  let aud = new Audio("sounds/toggle.wav");
  aud.play();
};
const helper = async (position) => {
  loading();
  let resp = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=a435f9bcd97990dc25402e71f475ca62`
  );
  data = await resp.json();
  if (resp.status == 200) {
    let err = document.querySelector(".errMessage");
    if (err) {
      err.remove();
    }
    res.style.display = "grid";
    updateData(data);
  } else {
    res.style.display = "none";
    bodyElem.style.backgroundImage = `url("./images/bg.jpg")`;
    printError();
  }
};
const loading = () => {
  countryImg.setAttribute("src", "");
  cityElem.textContent = "Loading...";
  tempElem.textContent = "Loading...";
  min_maxElem.textContent = "Loading...";
  condElem.textContent = "Loading...";
  condimgElem.setAttribute("src", "");
};
const errorHelper = (error) => {
  res.style.display = "none";
  printError();
  let err = document.querySelector(".errMessage");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      err.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      err.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      err.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      err.innerHTML = "An unknown error occurred.";
      break;
  }
};
const getWeatherLocData = () => {
  if (slideBtn.classList.contains("slide-btn-pressed")) {
    slideBtn.classList.toggle("slide-btn-pressed");
    root.style.setProperty("--left", "-2%");
    root.style.setProperty("--right", "none");
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(helper, errorHelper);
  }
};
locBtn.addEventListener("click", () => {
  playSound();
  getWeatherLocData();
});
slideBtn.addEventListener("click", () => {
  playSound2();
  slideBtn.classList.toggle("slide-btn-pressed");
  if (!slideBtn.classList.contains("slide-btn-pressed")) {
    tempElem.textContent = `${Math.round(data.main.temp - 273)}\u00B0C`;
    min_maxElem.innerHTML = `${Math.round(
      data.main.temp_max - 273
    )}\u00B0C <i class="fa-solid fa-temperature-arrow-up max-temp"></i>/${Math.round(
      data.main.temp_min - 273
    )}\u00B0C <i class="fa-solid fa-temperature-arrow-down min-temp"></i>`;

    root.style.setProperty("--left", "-2%");
    root.style.setProperty("--right", "none");
  } else {
    tempElem.textContent = `${ToFahreh(data.main.temp - 273)}\u00B0F`;
    min_maxElem.innerHTML = `${ToFahreh(
      data.main.temp_max - 273
    )}\u00B0F <i class="fa-solid fa-temperature-arrow-up max-temp"></i>/${ToFahreh(
      data.main.temp_min - 273
    )}\u00B0F <i class="fa-solid fa-temperature-arrow-down min-temp"></i>`;
    root.style.setProperty("--left", "none");
    root.style.setProperty("--right", "-2%");
  }
});
const printError = () => {
  res.style.display = "none";
  let el = document.querySelector(".errMessage");
  if (!el) {
    let errHTML = '<h1 class="errMessage">Not able to fetch the data.</h1>';
    searchBar.insertAdjacentHTML("afterend", errHTML);
  }
};
const ToFahreh = (c) => {
  return Math.round((9 * c) / 5 + 32);
};
const updateImg = (code, icon) => {
  let bgStr = "./images/";
  condimgElem.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  if (code < 300) {
    bgStr += "thunderstorm";
  } else if (code < 400) {
    bgStr += "drizzle";
  } else if (code < 600) {
    bgStr += "rain";
  } else if (code < 700) {
    bgStr += "snow";
  } else if (code < 800) {
    switch (code) {
      case 701:
        bgStr += "mist";
        break;
      case 711:
        bgStr += "smoke";
        break;
      case 721:
        bgStr += "haze";
        break;
      case 731:
        bgStr += "dust";
        break;
      case 741:
        bgStr += "fog";
        break;
      case 751:
        bgStr += "dust";
        break;
      case 761:
        bgStr += "dust";
        break;
      case 762:
        bgStr += "volcanic-ash";
        break;
      case 771:
        bgStr += "squall";
        break;
      case 781:
        bgStr += "tornado";
        break;
    }
  } else if (code == 800) {
    bgStr += "clear";
  } else if (code < 900) {
    bgStr += "cloud";
  }
  bgStr += ".jpg";
  bodyElem.style.backgroundImage = `url(${bgStr})`;
};
const updateData = async (data) => {
  let resp2 = await fetch(
    `https://restcountries.com/v3.1/alpha/${data.sys.country}`
  );
  let data2 = await resp2.json();
  cityElem.textContent = `${data.name}, ${data2[0].name.common}`;
  tempElem.textContent = `${Math.round(data.main.temp - 273)}\u00B0C`;
  min_maxElem.innerHTML = `${Math.round(
    data.main.temp_max - 273
  )}\u00B0C <i class="fa-solid fa-temperature-arrow-up max-temp"></i>/${Math.round(
    data.main.temp_min - 273
  )}\u00B0C <i class="fa-solid fa-temperature-arrow-down min-temp"></i>`;
  let des = data.weather[0].description.split(" "),
    des_str = "";
  for (let el of des) {
    des_str += el[0].toUpperCase() + el.substr(1);
    des_str += " ";
  }
  condElem.textContent = `${des_str}`;
  updateImg(data.weather[0].id, data.weather[0].icon);
  countryImg.setAttribute("src", `${data2[0].flags.png}`);
};
const getWeatherData = async () => {
  if (slideBtn.classList.contains("slide-btn-pressed")) {
    slideBtn.classList.toggle("slide-btn-pressed");
    root.style.setProperty("--left", "-2%");
    root.style.setProperty("--right", "none");
  }
  loading();
  const ct = inputField.value;
  let resp = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ct}&appid=a435f9bcd97990dc25402e71f475ca62`
  );
  data = await resp.json();
  if (resp.status == 200) {
    let err = document.querySelector(".errMessage");
    if (err) {
      err.remove();
    }
    res.style.display = "grid";
    updateData(data);
  } else {
    res.style.display = "none";
    bodyElem.style.backgroundImage = `url("./images/bg.jpg")`;
    printError();
  }
};
btn.addEventListener("click", () => {
  playSound();
  getWeatherData();
});

//challeneges-
//to cut the delay between switching of bg images
//async programming
