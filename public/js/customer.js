let formMode = "search"; // Tracks the current mode of the form

// Fetch all customer IDs and populate the dropdown
document.addEventListener("DOMContentLoaded", () => {
  setFormForSearch();
  initCustomerDropdown();
  addCustomerDropdownListener();
});

//SEARCH
document.getElementById("searchBtn").addEventListener("click", async () => {
  clearCustomerForm();
  setFormForSearch();
  initCustomerDropdown();
});

//ADD
document.getElementById("addBtn").addEventListener("click", async () => {
  setFormForAdd();
});

//SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (formMode === "add") {
    //Get max ID for customerId
    const res = await fetch("/api/customer/getNextId");
    const {nextId } = await res.json();
    document.getElementById("customerIdText").value = nextId;

    const form = document.getElementById("customerForm");

    const customerData = {
      customerId: nextId,
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      address: form.address.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      senior: form.customerType.value === "senior",
      preferredContact: form.pref[0].checked ? "phone" : "email",
    };

    try {
      const res = await fetch("/api/customer/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      const result = await res.json();

      if (res.status === 409 && result.confirmRequired) {
        // Handle duplicate name confirmation
        const confirmed = confirm(`⚠️ A customer named "${customerData.firstName} ${customerData.lastName}" already exists. Do you want to add another customer with the same name?`);

        if (confirmed) {
          // Make confirmed add request
          const confirmRes = await fetch("/api/customer/addConfirmed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          });

          const confirmResult = await confirmRes.json();
          if (!confirmRes.ok) {
            throw new Error(confirmResult.message || "Failed to add customer");
          }

          alert(`✅ Customer ${customerData.customerId} added successfully!`);
          if (confirmResult.confirmationSent) {
            alert(`📧 Confirmation message sent to ${customerData.email}`);
          }
          form.reset();
        }
        return;
      }

      if (!res.ok)
        throw new Error(result.message || "Failed to add customer");

      alert(`✅ Customer ${customerData.customerId} added successfully!`);
      if (result.confirmationSent) {
        alert(`📧 Confirmation message sent to ${customerData.email}`);
      }
      form.reset();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }
});

//DELETE
document.getElementById("deleteBtn").addEventListener("click", async () => {
  var select = document.getElementById("customerIdSelect");
  var customerId = select.value.split(":")[0];

  const response = await fetch(
    `/api/customer/deleteCustomer?customerId=${customerId}`, {
      method: "DELETE"
    });

  if (!response.ok) {
    throw new Error("Customer delete failed");
  } else {
    alert(`Customer with id ${customerId} successfully deleted`);
    clearCustomerForm();
    initCustomerDropdown();
  }
});

async function initCustomerDropdown() {
  const select = document.getElementById("customerIdSelect");
  try {
    const response = await fetch("/api/customer/getCustomerIds");
    const customerIds = await response.json();

    customerIds.forEach((cust) => {
      const option = document.createElement("option");
      option.value = cust.customerId;
      option.textContent = `${cust.customerId}:${cust.firstName} ${cust.lastName}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load customer IDs: ", err);
  }
}

async function addCustomerDropdownListener() {
  const form = document.getElementById("customerForm");
  const select = document.getElementById("customerIdSelect");
  select.addEventListener("change", async () => {
    var customerId = select.value.split(":")[0];
    console.log(customerId);
    try {
      const res = await fetch(
        `/api/customer/getCustomer?customerId=${customerId}`
      );
      if (!res.ok) throw new Error("Customer search failed");

      const data = await res.json();
      console.log(data);
      if (!data || Object.keys(data).length === 0) {
        alert("No customer found");
        return;
      }

      //Fill form with data
      form.firstName.value = data.firstName || "";
      form.lastName.value = data.lastName || "";
      form.address.value = data.address || "";
      form.phone.value = data.phone || "";
      form.email.value = data.email || "";
      form.classBalance.value = data.classBalance || 0;

      // Set customer type
      if (data.senior) {
        form.customerType[1].checked = true;
      } else {
        form.customerType[0].checked = true;
      }

      // Set preferred contact
      if (data.preferredContact === "phone") {
        form.pref[0].checked = true;
      } else {
        form.pref[1].checked = true;
      }
    } catch (err) {
      alert(`Error searching customer: ${customerId} - ${err.message}`);
    }
  });
}

function clearCustomerForm() {
  document.getElementById("customerForm").reset(); // Clears all inputs including text, textarea, and unchecks radio buttons
  document.getElementById("customerIdSelect").innerHTML = "";
}

function setFormForSearch() {
  formMode = "search";
  //toggle back to search mode
  document.getElementById("customerIdLabel").style.display = "block"; // Show dropdown
  document.getElementById("customerIdTextLabel").style.display = "none"; // Hide text input
  document.getElementById("customerIdText").value = "";
  document.getElementById("customerIdText").style.display = "none";
  document.getElementById("customerForm").reset();
}

function setFormForAdd() {
  formMode = "add";
    //hide the customer id drop down and label
  document.getElementById("customerIdLabel").style.display = "none";
  document.getElementById("customerIdTextLabel").style.display = "block";
  document.getElementById("customerIdText").value = "";
  document.getElementById("customerForm").reset();
}