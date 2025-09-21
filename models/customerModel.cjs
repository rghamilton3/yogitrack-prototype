const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const customerModel = new mongoose.Schema({
    customerId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    senior: {
        type: Boolean,
        default: false
    },
    address: String,
    preferredContact: String,
    classBalance: {
        type: Number,
        default: 0
    }
}, {collection:"customer"});

module.exports = mongoose.model("Customer", customerModel);