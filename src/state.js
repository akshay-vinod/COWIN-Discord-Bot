const fetch = require("node-fetch");
headers = {
  "User-Agent": "*"
};
const fetchState = async () => {
  /*fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/16`)
    .then((res) => console.log(res))
    .then((json) => console.log(json));*/

  /*response = requests.get(url, (headers = headers));*/
  url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  return fetch(url, { method: "GET", headers: headers })
    .then((res) => {
      const resJson = res.json();
      return resJson;
    })
    .catch((err) => console.log(err));
};

const fetchDistricts = async (state_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
  return fetch(url, { headers: headers }).then(async (res) => {
    const resJson = await res.json();
    return resJson;
  });
};

const fetchSlots = async (district_id) => {
  url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=31-03-2021`;
  return fetch(url, { headers: headers }).then(async (res) => {
    const resJson = await res.json();
    return resJson;
  });
};

module.exports = { fetchState, fetchDistricts, fetchSlots };
