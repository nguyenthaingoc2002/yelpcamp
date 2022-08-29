const vietnam = require('./vietnam');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = 'pk.eyJ1Ijoibmd1eWVudGhhaW5nb2MxMjMiLCJhIjoiY2w3MG84cWYwMGc1bjNwbXZod2d4djM4eSJ9.B8ROw9hurCLzVIfUA06d3A';
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const seedDB = async () => {
    let index = 0;
    await Campground.deleteMany({});
    await User.deleteMany({});
    for(let cities of vietnam) {
        for(let districts of cities.district) {
            const email = `${index++}@gmail.com`;
            const username = `${districts} Campground`;
            const user = new User({ email, username });
            console.log(username);
            await User.register(user, username);
            const geoData = await geocoder.forwardGeocode({
                query: `${districts}, ${cities}`,
                limit: 2
            }).send();
            const camp = new Campground({
                author: user._id,
                location: `${districts}, ${cities.city}`,
                title: `${districts} Campground`,
                description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus error fuga, doloremque praesentium at tempore, dolore animi facilis voluptatem minima, eos accusantium. Officiis non incidunt hic. Alias placeat eos aspernatur.',
                price: getRndInteger(70, 100) * 1000,
                geometry: geoData.body.features[1].geometry,
                images: []
            });
            await camp.save();
        }
}
}

seedDB().then(() => {
    mongoose.connection.close();
});