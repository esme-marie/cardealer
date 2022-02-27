const { connectToDatabase } = require('../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getCars(req, res);
        }

        case 'POST': {
            return addCar(req, res);
        }

        case 'PUT': {
            return updateCar(req, res);
        }

        case 'DELETE': {
            return deleteCar(req, res);
        }
    }
}

async function getCars(req,res){
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the cars
        let cars = await db
            .collection('cars')
            .find({})
            .sort({ addedOn: -1 })
            .toArray();
        // return the cars
        return res.json({
            message: JSON.parse(JSON.stringify(cars)),
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function addCar(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // add a car
        await db.collection('cars').insertOne(JSON.parse(req.body));
        // return a message
        return res.json({
            message: 'Car added successfully',
            success: true,
        });
    } catch (error) {
        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function updateCar(req, res) {
    try {
        // connect to the database
        let { db } = await connectToDatabase();

        // toggle update sold status
        await db.collection('cars').findOneAndUpdate(
            {
                _id: new ObjectId(req.body),
            },
            [{ $set: { sold: {$eq:[false,"$sold"]} } }]
        );

        // return a message
        return res.json({
            message: 'Car sold!',
            success: true,
        });
    } catch (error) {

        // return an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}


async function deleteCar(req, res) {
    try {
        // Connecting to the database
        let { db } = await connectToDatabase();

        // Deleting car
        await db.collection('cars').deleteOne({
            _id: new ObjectId(req.body),
        });

        // returning a message
        return res.json({
            message: 'Car deleted successfully',
            success: true,
        });
    } catch (error) {

        // returning an error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
