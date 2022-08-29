const mongoose = require('mongoose');
const cities = require('./cities.js');
const {descriptors, places} = require('./seedHelpers');
const Campground = require('../models/campground');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 3; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '62fd19158ad89a80c14e7b3d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus error fuga, doloremque praesentium at tempore, dolore animi facilis voluptatem minima, eos accusantium. Officiis non incidunt hic. Alias placeat eos aspernatur.',
            price: 0,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/devdzddgp/image/upload/v1660835540/cld-sample-2.jpg',
                    filename: 'picture1'
                },
                {
                    url: 'https://res.cloudinary.com/devdzddgp/image/upload/v1660835510/sample.jpg',
                    filename: 'picture2'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
});