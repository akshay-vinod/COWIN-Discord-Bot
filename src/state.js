const fetch = require("node-fetch-with-proxy");
const HttpsProxyAgent = require("https-proxy-agent");

const axios = require("axios");

headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
};
const proxyAgent = new HttpsProxyAgent("http://14.99.187.7:80");
//using node-fetch
/*const fetchState = async () => {
 

  const test = await fetch("https://httpbin.org/ip?json");
  const testJson = await test.json();
  console.log(testJson);

  url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  return fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then(async (res) => {
      const resJson = res.json();
      return resJson;
    })
    .catch((err) => console.log(err));
};

const fetchDistricts = async (state_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
  console.log("passed district");
  return fetch(url, {
    headers: headers,
  })
    .then(async (res) => {
      const resJson = await res.json();
      return resJson;
    })
    .catch((err) => console.log(err));
};

const fetchSlots = async (district_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=31-03-2021`;
  return fetch(url, {
    headers: headers,
  })
    .then(async (res) => {
      const resJson = await res.json();
      return resJson;
    })
    .catch((err) => console.log(err));
};*/
//axios
const fetchState = async () => {
  url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  let result = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
    },
  });
  return result.data;
};
const fetchDistricts = async (state_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
  let result = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
    },
  });
  return result.data;
};
const fetchSlots = async (district_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=31-03-2021`;
  let result = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
    },
  });
  return result.data;
};

module.exports = { fetchState, fetchDistricts, fetchSlots };
