let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

const statCards = document.querySelectorAll(".stat-card");

const tableBody = document.querySelector("table tbody");

const searchInput = document.querySelector(".filters input");

const categoryFilter = document.querySelectorAll(".filters select")[0];

const statusFilter = document.querySelectorAll(".filters select")[1];

const viewAllButton = document.querySelector(".view-btn");

document.addEventListener("DOMContentLoaded", function () {
  loadDashboard();
});

function loadDashboard() {
  complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  updateStatistics();

  updateCategoryCounts();

  displayComplaints();
}

function updateStatistics() {
  const total = complaints.length;

  const pending = complaints.filter(function (complaint) {
    return complaint.status === "Pending";
  }).length;

  const inProgress = complaints.filter(function (complaint) {
    return complaint.status === "In Progress";
  }).length;

  const resolved = complaints.filter(function (complaint) {
    return complaint.status === "Resolved";
  }).length;

  if (statCards.length >= 4) {
    statCards[0].querySelector("h2").textContent = total;

    statCards[1].querySelector("h2").textContent = pending;

    statCards[2].querySelector("h2").textContent = inProgress;

    statCards[3].querySelector("h2").textContent = resolved;
  }
}

function displayComplaints() {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  const filteredComplaints = getFilteredComplaints();

  if (filteredComplaints.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `

            <td colspan="8"
                style="
                    text-align:center;
                    padding:35px;
                    color:#777;
                ">

                No complaints found.

            </td>

        `;

    tableBody.appendChild(row);

    return;
  }

  filteredComplaints.forEach(function (complaint) {
    const row = document.createElement("tr");

    /* Status class */

    let statusClass = "pending-status";

    if (complaint.status === "In Progress") {
      statusClass = "progress-status";
    }

    if (complaint.status === "Resolved") {
      statusClass = "resolved-status";
    }

    const date = formatDate(complaint.createdAt);

    row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(complaint.id)}
                    </strong>
                </td>


                <td>
                    ${escapeHTML(complaint.title)}
                </td>


                <td>
                    ${escapeHTML(complaint.category)}
                </td>


                <td>
                    ${escapeHTML(getLocationText(complaint))}
                </td>


                <td>
                    ${escapeHTML(complaint.userName)}
                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >
                        ${escapeHTML(complaint.status)}
                    </span>

                </td>


                <td>
                    ${date}
                </td>


                <td>

                    <button
                        class="action-btn"
                        onclick="viewComplaint('${complaint.id}')"
                    >
                        View
                    </button>

                </td>

            `;

    tableBody.appendChild(row);
  });
}

function getFilteredComplaints() {
  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const category = categoryFilter ? categoryFilter.value : "All Categories";

  const status = statusFilter ? statusFilter.value : "All Status";

  return complaints.filter(function (complaint) {
    const searchMatch =
      search === "" ||
      complaint.id.toLowerCase().includes(search) ||
      complaint.title.toLowerCase().includes(search) ||
      complaint.userName.toLowerCase().includes(search) ||
      complaint.category.toLowerCase().includes(search) ||
      complaint.address.toLowerCase().includes(search);

    let categoryMatch = true;

    if (category !== "All Categories") {
      categoryMatch =
        normalizeCategory(complaint.category) === normalizeCategory(category);
    }

    let statusMatch = true;

    if (status !== "All Status") {
      statusMatch = complaint.status === status;
    }

    return searchMatch && categoryMatch && statusMatch;
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    displayComplaints();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", function () {
    displayComplaints();
  });
}

if (statusFilter) {
  statusFilter.addEventListener("change", function () {
    displayComplaints();
  });
}

if (viewAllButton) {
  viewAllButton.addEventListener("click", function () {
    /* Clear filters */

    if (searchInput) {
      searchInput.value = "";
    }

    if (categoryFilter) {
      categoryFilter.value = "All Categories";
    }

    if (statusFilter) {
      statusFilter.value = "All Status";
    }

    displayComplaints();

    const issuesCard = document.querySelector(".issues-card");

    if (issuesCard) {
      issuesCard.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

function viewComplaint(id) {
  const complaint = complaints.find(function (item) {
    return item.id === id;
  });

  if (!complaint) {
    alert("Complaint not found.");

    return;
  }

  showComplaintModal(complaint);
}

function showComplaintModal(complaint) {
  const oldModal = document.getElementById("adminComplaintModal");

  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");

  modal.id = "adminComplaintModal";

  modal.style.cssText = `

        position: fixed;
        inset: 0;

        background: rgba(0,0,0,0.60);

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 20px;

        z-index: 99999;

    `;

  const imageHTML = complaint.image
    ? `

        <img
            src="${complaint.image}"
            alt="Complaint Image"

            style="
                width:100%;
                max-height:240px;
                object-fit:cover;
                border-radius:10px;
                margin-bottom:18px;
                border:1px solid #aaa;
            "
        >

        `
    : `

        <div
            style="
                background:#e5ffd9;
                padding:25px;
                border-radius:10px;
                text-align:center;
                margin-bottom:18px;
                color:#666;
            "
        >
            No complaint image uploaded.
        </div>

        `;

  const status = complaint.status;

  modal.innerHTML = `

        <div
            style="
                width:100%;
                max-width:650px;
                max-height:90vh;
                overflow-y:auto;

                background:#e8ffda;

                border:1px solid #555;

                border-radius:15px;

                padding:25px;

                position:relative;

                color:#172019;

                font-family:Sora, Arial, sans-serif;
            "
        >

            <button
                id="closeAdminModal"

                style="
                    position:absolute;
                    right:18px;
                    top:15px;

                    width:35px;
                    height:35px;

                    border:none;
                    border-radius:50%;

                    background:#c1fbab;

                    font-size:22px;

                    cursor:pointer;
                "
            >
                ×
            </button>


            <h2
                style="
                    margin-bottom:5px;
                    font-size:23px;
                "
            >
                Complaint Details
            </h2>


            <p
                style="
                    color:#6c756c;
                    font-size:13px;
                    margin-bottom:20px;
                "
            >
                ${escapeHTML(complaint.id)}
            </p>


            ${imageHTML}


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(2, 1fr);
                    gap:12px;
                    margin-bottom:18px;
                "
            >

                ${detailBox("User Name", complaint.userName)}

                ${detailBox("Phone Number", complaint.phone)}

                ${detailBox("Category", complaint.category)}

                ${detailBox("Status", complaint.status)}

                ${detailBox("Date", complaint.createdAt)}

                ${detailBox("Address", complaint.address)}

            </div>


            <div
                style="
                    background:#f7f9f6;
                    border:1px solid #aaa;
                    border-radius:10px;
                    padding:14px;
                    margin-bottom:12px;
                "
            >

                <strong>
                    Complaint Title
                </strong>

                <p style="margin-top:7px;">
                    ${escapeHTML(complaint.title)}
                </p>

            </div>


            <div
                style="
                    background:#f7f9f6;
                    border:1px solid #aaa;
                    border-radius:10px;
                    padding:14px;
                    margin-bottom:12px;
                "
            >

                <strong>
                    Brief Information
                </strong>

                <p style="
                    margin-top:7px;
                    line-height:1.5;
                ">
                    ${escapeHTML(complaint.description)}
                </p>

            </div>


            <div
                style="
                    background:#f7f9f6;
                    border:1px solid #aaa;
                    border-radius:10px;
                    padding:14px;
                    margin-bottom:18px;
                "
            >

                <strong>
                    Complaint Location
                </strong>

                <p style="
                    margin-top:7px;
                    line-height:1.5;
                ">

                    ${escapeHTML(getLocationText(complaint))}

                </p>

                <a
                    href="https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}"

                    target="_blank"

                    style="
                        display:inline-block;
                        margin-top:8px;
                        color:#23851c;
                        font-weight:600;
                    "
                >
                    📍 Open Location in Google Maps
                </a>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    align-items:center;
                "
            >

                <select
                    id="adminStatusSelect"

                    style="
                        flex:1;
                        height:43px;
                        border:1px solid #777;
                        border-radius:7px;
                        padding:0 10px;
                        background:white;
                    "
                >

                    <option
                        value="Pending"
                        ${status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>


                    <option
                        value="In Progress"
                        ${status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>


                    <option
                        value="Resolved"
                        ${status === "Resolved" ? "selected" : ""}
                    >
                        Resolved
                    </option>

                </select>


                <button
                    id="updateStatusBtn"

                    style="
                        height:43px;
                        padding:0 18px;

                        border:none;
                        border-radius:7px;

                        background:#5bf917;

                        color:#152416;

                        font-weight:700;

                        cursor:pointer;
                    "
                >
                    Update Status
                </button>

            </div>

        </div>

    `;

  document.body.appendChild(modal);

  document
    .getElementById("closeAdminModal")
    .addEventListener("click", function () {
      modal.remove();
    });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.remove();
    }
  });

  document
    .getElementById("updateStatusBtn")
    .addEventListener("click", function () {
      updateComplaintStatus(complaint.id);

      modal.remove();
    });
}

function updateComplaintStatus(id) {
  const select = document.getElementById("adminStatusSelect");

  if (!select) return;

  const newStatus = select.value;

  complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  const complaint = complaints.find(function (item) {
    return item.id === id;
  });

  if (!complaint) return;

  complaint.status = newStatus;

  if (newStatus === "Resolved") {
    complaint.resolvedAt = new Date().toLocaleString();
  }

  localStorage.setItem("complaints", JSON.stringify(complaints));

  loadDashboard();

  alert("Complaint status updated to " + newStatus);
}

function updateCategoryCounts() {
  const categoryRows = document.querySelectorAll(".category-row");

  categoryRows.forEach(function (row) {
    const categoryName = row.querySelector("span").textContent.trim();

    const count = complaints.filter(function (complaint) {
      return (
        normalizeCategory(complaint.category) ===
        normalizeCategory(categoryName)
      );
    }).length;

    const countElement = row.querySelector("strong");

    if (countElement) {
      countElement.textContent = count;
    }
  });
}

function normalizeCategory(category) {
  if (!category) return "";

  const value = category.toLowerCase();

  if (value.includes("road") || value.includes("pothole")) {
    return "roads";
  }

  if (value.includes("light")) {
    return "lighting";
  }

  if (value.includes("garbage") || value.includes("waste")) {
    return "garbage";
  }

  if (value.includes("drain")) {
    return "drainage";
  }

  if (value.includes("water")) {
    return "water";
  }

  return value;
}

function getLocationText(complaint) {
  if (complaint.latitude && complaint.longitude) {
    return (
      Number(complaint.latitude).toFixed(5) +
      ", " +
      Number(complaint.longitude).toFixed(5)
    );
  }

  return "Location not available";
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function detailBox(label, value) {
  return `

        <div
            style="
                background:#f7f9f6;
                border:1px solid #aaa;
                border-radius:10px;
                padding:12px;
            "
        >

            <span
                style="
                    display:block;
                    font-size:11px;
                    color:#777;
                    margin-bottom:5px;
                "
            >
                ${label}
            </span>


            <strong
                style="
                    font-size:14px;
                    word-break:break-word;
                "
            >
                ${escapeHTML(value)}
            </strong>

        </div>

    `;
}

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const div = document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}

const logoutButton = document.querySelector(".logout");

if (logoutButton) {
  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      window.location.href = "login.html";
    }
  });
}
