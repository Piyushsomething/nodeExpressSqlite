async function loadUserRequests() {
    const response = await fetch(`${apiUrl}/user/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
  
    const tableBody = document.querySelector("#user-requests-table tbody");
    tableBody.innerHTML = "";
  
    data.requests.forEach((request) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${request.area}</td>
        <td>${request.variety}</td>
        <td>${request.number}</td>
        <td>${request.paymentStatus ? "Paid" : "Unpaid"}</td>
        <td>${request.approvalStatus ? "Approved" : "Pending"}</td>
        <td>${request.adminComment || ""}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  async function loadRequests() {
    const response = await fetch(`${apiUrl}/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
  
    const tableBody = document.querySelector("#requests-table tbody");
    tableBody.innerHTML = "";
  
    data.requests.forEach((request) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${request.userId}</td>
        <td>${request.area}</td>
        <td>${request.variety}</td>
        <td>${request.number}</td>
        <td>${request.paymentStatus ? "Paid" : "Unpaid"}</td>
        <td>${request.approvalStatus ? "Approved" : "Pending"}</td>
        <td>${request.adminComment || ""}</td>
        <td>
          <button class="approve" data-id="${request.id}" data-status="true">Approve</button>
          <button class="deny" data-id="${request.id}" data-status="false">Deny</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    document.querySelectorAll(".approve, .deny").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const status = e.target.getAttribute("data-status") === "true";
        const adminComment = prompt("Enter a comment:");
  
        const response = await fetch(`${apiUrl}/admin/approve/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approvalStatus: status, adminComment }),
        });
  
        const data = await response.json();
        alert(data.message);
        loadRequests();
      });
    });
  }