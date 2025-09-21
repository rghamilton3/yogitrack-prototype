const Customer = require("../models/customerModel.cjs");

exports.search = async (req, res) => {
  try {
    const searchString = req.query.firstName;
    const customer = await Customer.find({
      firstName: { $regex: searchString, $options: "i" },
    });

    if (!customer || customer.length == 0) {
      return res.status(404).json({ message: "No customer found" });
    } else {
      res.json(customer[0]);
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

// Find the customer selected in the dropdown
exports.getCustomer = async (req, res) => {
  try {
    const customerId = req.query.customerId;
    const customerDetail = await Customer.findOne({ customerId: customerId });

    res.json(customerDetail);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.add = async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      senior,
      address,
      preferredContact
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if customer name already exists (as per use case requirements)
    const existingCustomer = await Customer.findOne({
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "Customer with this name already exists",
        confirmRequired: true,
        existingCustomer: existingCustomer
      });
    }

    // Create a new customer document
    const newCustomer = new Customer({
      customerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      senior: senior || false,
      address: address?.trim(),
      preferredContact,
      classBalance: 0 // Initial value as per use case
    });

    // Save to database
    await newCustomer.save();

    // Send confirmation message (simulated as logged message)
    console.log(`📧 Confirmation sent to ${email}: Welcome to Yoga'Hom! Your customer id is ${customerId}.`);

    res.status(201).json({
      message: "Customer added successfully",
      customer: newCustomer,
      confirmationSent: true
    });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({ message: "Failed to add customer", error: err.message });
  }
};

exports.addConfirmed = async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      senior,
      address,
      preferredContact
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new customer document (confirmed by user despite duplicate name)
    const newCustomer = new Customer({
      customerId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      senior: senior || false,
      address: address?.trim(),
      preferredContact,
      classBalance: 0 // Initial value as per use case
    });

    // Save to database
    await newCustomer.save();

    // Send confirmation message (simulated as logged message)
    console.log(`📧 Confirmation sent to ${email}: Welcome to Yoga'Hom! Your customer id is ${customerId}.`);

    res.status(201).json({
      message: "Customer added successfully",
      customer: newCustomer,
      confirmationSent: true
    });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({ message: "Failed to add customer", error: err.message });
  }
};

// Populate the customerId dropdown
exports.getCustomerIds = async (req, res) => {
  try {
    const customers = await Customer.find(
      {},
      { customerId: 1, firstName: 1, lastName: 1, _id: 0 }
    ).sort();

    res.json(customers);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getNextId = async (req, res) => {
  const lastCustomer = await Customer.find({})
    .sort({ customerId: -1 })
    .limit(1);

  let maxNumber = 1;
  if (lastCustomer.length > 0) {
    const lastId = lastCustomer[0].customerId;
    const match = lastId.match(/\d+$/);
    if (match) {
      maxNumber = parseInt(match[0]) + 1;
    }
  }
  const nextId = `C${maxNumber}`;
  res.json({ nextId });
};

exports.deleteCustomer = async (req, res) => {
  try {
     const {customerId} = req.query;
     const result = await Customer.findOneAndDelete({ customerId });
     if (!result) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted", customerId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};