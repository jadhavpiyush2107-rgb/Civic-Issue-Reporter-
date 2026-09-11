const openComplaint = document.getElementById("openComplaint");
const closeComplaint = document.getElementById("closeComplaint");

const complaintModal = document.getElementById("complaintModal");

const submitComplaint = document.getElementById("submitComplaint");

const successMessage = document.getElementById("successMessage");

const photoInput = document.getElementById("photoInput");

// OPEN COMPLAINT FORM

openComplaint.addEventListener("click", function () {
  complaintModal.classList.add("active");

  // Prevent background scrolling
  document.body.style.overflow = "hidden";
});

// CLOSE COMPLAINT FORM

closeComplaint.addEventListener("click", function () {
  closeModal();
});

// CLOSE FUNCTION

function closeModal() {
  complaintModal.classList.remove("active");

  document.body.style.overflow = "auto";
}

// CLICK OUTSIDE MODAL TO CLOSE

complaintModal.addEventListener("click", function (event) {
  if (event.target === complaintModal) {
    closeModal();
  }
});

// ESC KEY TO CLOSE

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// PHOTO UPLOAD

photoInput.addEventListener("change", function () {
  if (this.files && this.files[0]) {
    const fileName = this.files[0].name;

    document.querySelector(".upload-title").textContent = fileName;

    document.querySelector(".photo-upload small").textContent =
      "Photo selected successfully";
  }
});

// SUBMIT COMPLAINT

submitComplaint.addEventListener("click", function () {
  const title = document.getElementById("issueTitle").value.trim();

  const category = document.getElementById("category").value;

  const description = document.getElementById("description").value.trim();

  const location = document.getElementById("location").value;

  // CHECK REQUIRED FIELDS

  if (
    title === "" ||
    category === "" ||
    description === "" ||
    location === ""
  ) {
    alert("Please fill all the required fields.");

    return;
  }

  // CLOSE MODAL

  closeModal();

  // SHOW SUCCESS MESSAGE

  successMessage.classList.add("show");

  // RESET FORM

  document.getElementById("issueTitle").value = "";

  document.getElementById("category").value = "";

  document.getElementById("description").value = "";

  document.getElementById("location").value = "";

  photoInput.value = "";

  document.querySelector(".upload-title").textContent = "Add Photo";

  document.querySelector(".photo-upload small").textContent =
    "Click to upload an image";

  // HIDE SUCCESS MESSAGE

  setTimeout(function () {
    successMessage.classList.remove("show");
  }, 300);
});
