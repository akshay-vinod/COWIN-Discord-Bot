const axios = require("axios");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
};

//axios
const fetchState = async () => {
  const url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
  let result = await axios.get(url,{headers});
  //console.log(result.data.data);
  return result.data;
};
const fetchDistricts = async (state_id) => {
  const url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
  let result = await axios.get(url, {headers});
  return result.data;
};
const fetchSlots = async (district_id, date) => {
  const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`;
  let result = await axios.get(url, {headers});
  return result.data;
};

module.exports = { fetchState, fetchDistricts, fetchSlots };
