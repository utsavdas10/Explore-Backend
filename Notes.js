const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
            )}&key=${process.env.GOOGLE_API_KEY}`
        );
const data = await response.json();

        // =============== //
    
axios.get().then((response) => response.json).then(data).catch(error);
