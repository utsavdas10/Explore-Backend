async function getCoordsForAddress(address) {
  return {
    lat: 40.7484474,
    lng: -73.9871516
  };

//   const response = await fetch(
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         address
//         )}&key=${process.env.GOOGLE_API_KEY}`
//     );

//     const data = await response.json();

//     if (!data || data.status === 'ZERO_RESULTS') {
//         const error = new HttpError(
//             'Could not find location for the specified address.',
//             422
//             );
//         throw error;
//         }

//         const coordinates = data.results[0].geometry.location;

//         return coordinates;

}



module.exports = getCoordsForAddress;