require('dotenv').config(); //
const uri = process.env.MONGO_URI;
const MongoClient = require('mongodb').MongoClient;
const DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };


module.exports = () => {

    const createCollection = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== count::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    console.log(query);
                    db.createCollection(collectionName, query, (err, docs) => {
                        if (err) {
                            console.log("=== create::db.createCollection");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });

    }




    const count = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== count::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.countDocuments(query, (err, docs) => {
                        if (err) {
                            console.log("=== count::collection.countDocuments");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const get = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== get::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.find(query).toArray((err, docs) => {
                        if (err) {
                            console.log("=== get::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const add = (collectionName, item) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== add::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.insertOne(item, (err, result) => {
                        if (err) {
                            console.log("=== add::collection.insertOne");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(result);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    const updateData = (collectionName, filter, updateDoc) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== updateData::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.updateOne(filter, updateDoc, (err, result) => {
                        if (err) {
                            console.log("=== updateData::collection.updateOne");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(result);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    //check issues due date and change their status if needed;
    const checkDueDate = () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== find::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection('issues');
                    //collecting current date;
                    const currentDate = new Date();
                    collection.find({ 'dueDate': { $lte: currentDate } }).toArray((err, docs) => {
                        if (err) {
                            console.log("=== checkDueDate::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            var user = [];
                            for (i = 0; i < docs.length; i++) {
                                if (docs[i].status === 'open') {
                                    user.push(docs[i].issueNumber);
                                }
                            }
                            collection.updateMany({ 'dueDate': { $lte: currentDate } }, { $set: { 'status': 'closed' } }, (err, result) => {
                                if (err) {
                                    console.log("=== checkDueDate::collection.updateMany");
                                    console.log(err);
                                    return reject(err);
                                } else {
                                    console.log("status updated.");
                                    console.log(user);
                                    resolve(user);
                                    client.close();
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    const aggregate = (collectionName, pipeline = []) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== aggregate::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.aggregate(pipeline).toArray((err, docs) => {
                        if (err) {
                            console.log("=== aggregate::collection.aggregate");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };

    //find any general item;
    const find = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== find::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.find(query).toArray((err, docs) => {
                        if (err) {
                            console.log("=== find::collection.find{query}");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs.length === 0) {
                                resolve(null);
                                client.close();
                            } else {
                                resolve(docs[0]._id);
                                client.close();
                            }
                        }
                    });
                }
            });
        });
    };

    
    //find previous bookings;
    const findBookings = (query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== findBookings::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection('bookings');
                    collection.find(query).project({ 'numTables': 1, 'numPeople': 1, '_id': 0 }).toArray((err, docs) => {
                        if (err) {
                            console.log("=== findBookings::collection.find");
                            console.log(err);
                            return reject(err);
                        } else {
                            if (docs == null) {
                                resolve(null);
                                client.close();
                            } else {
                                var booking = {};
                                var tablesBooked = Number(0);
                                var peopleBooked = Number(0);
                                for (i = 0; i < docs.length; i++) {
                                    let table = parseInt(docs[i].numTables);
                                    tablesBooked += table;
                                    let people = parseInt(docs[i].numPeople);
                                    peopleBooked += people;
                                    booking = { tablesBooked, peopleBooked };
                                }
                                resolve(booking);
                                client.close();
                            }
                        }
                    });
                }
            });
        });
    };

    const deleteData = (collectionName, query = {}) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, MONGO_OPTIONS, (err, client) => {
                if (err) {
                    console.log(err);
                    return reject("=== count::MongoClient.connect");
                } else {
                    const db = client.db(DB_NAME);
                    const collection = db.collection(collectionName);
                    collection.deleteOne(query, (err, docs) => {
                        if (err) {
                            console.log("=== count::collection.countDocuments");
                            console.log(err);
                            return reject(err);
                        } else {
                            resolve(docs);
                            client.close();
                        }
                    });
                }
            });
        });
    };


    return {
        createCollection,
        get,
        add,
        count,
        find,
        aggregate,
        updateData,
        checkDueDate,
        findBookings,
        deleteData,
    };
};