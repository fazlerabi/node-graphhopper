const axios = require('axios');

const fromAddress = async (req) => {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address: req.address,
        key: 'AIzaSyCB5ELK-MyT_h_XUxkLz8gVlEIlloseKyo',
      },
    },
  );

  if (response.data.results.length === 0) throw 'Invalid address';

  return {
    type: req.type,
    coordinate: response.data.results[0].geometry.location,
  };
};

async function postRoutes(req, res, next) {
  try {
    const { address } = req.body;
    const response = await Promise.all(address.map((a) => fromAddress(a)));
    const homeVehicle = response[0];
    const services = response.slice(1);
    const optimizedJson = {
      vehicles: [
        {
          vehicle_id: homeVehicle.type,
          start_address: {
            location_id: homeVehicle.type,
            lon: homeVehicle.coordinate.lng,
            lat: homeVehicle.coordinate.lat,
          },
        },
      ],
      services: services.map((service) => {
        return {
          id: service.type,
          name: service.type,
          address: {
            location_id: service.type,
            lon: service.coordinate.lng,
            lat: service.coordinate.lat,
          },
        };
      }),
      configuration: {
        routing: {
          calc_points: true,
        },
      },
    };

    const url = `https://graphhopper.com/api/1/vrp/optimize?key=bc402dfd-0976-4a56-8158-60d299d3b1c4`;
    const resp = await axios.post(url, optimizedJson);
    const jobId = resp.data.job_id;
    const solutionUrl = `https://graphhopper.com/api/1/vrp/solution/${jobId}?key=bc402dfd-0976-4a56-8158-60d299d3b1c4`;
    const { data: { solution } = {} } = await axios.get(solutionUrl);
    console.log('solution: ', solution);
    return res.json({ solution, markers: response, jobId, solutionUrl });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send(err.message);
  }
}

module.exports = {
  postRoutes,
};
