const openComplaintBtn = document.getElementById((id = "openComplaint"));

const closeComplaintBtn = document.getElementById("closeComplaintBtn");

const complaintOverlay = document.getElementById("complaintOverlay");

const complaintForm = document.getElementById("complaintForm");

const potholes = document.getElementById((id = "potholes"));

const brokenlights = document.getElementById((id = "brokenlights"));

const garbage = document.getElementById((id = "garbage"));

potholes.addEventListener("click", function () {
  complaintOverlay.style.display = "flex";

  document.body.style.overflow = "hidden";
});

openComplaintBtn.addEventListener("click", function () {
  complaintOverlay.style.display = "flex";

  document.body.style.overflow = "hidden";
});

function closeComplaintForm() {
  complaintOverlay.style.display = "none";

  document.body.style.overflow = "auto";
}

closeComplaintBtn.addEventListener("click", closeComplaintForm);

complaintOverlay.addEventListener("click", function (event) {
  if (event.target === complaintOverlay) {
    closeComplaintForm();
  }
});

const complaintImage = document.getElementById("complaintImage");

const imagePreview = document.getElementById("imagePreview");

const photoText = document.getElementById("photoText");

complaintImage.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) {
    imagePreview.style.display = "none";

    photoText.style.display = "flex";

    return;
  }

  const imageURL = URL.createObjectURL(file);

  imagePreview.src = imageURL;

  imagePreview.style.display = "block";

  photoText.style.display = "none";
});

const getLocationBtn = document.getElementById("getLocationBtn");

const locationText = document.getElementById("locationText");

const locationStatus = document.getElementById("locationStatus");

const latitudeInput = document.getElementById("latitude");

const longitudeInput = document.getElementById("longitude");

getLocationBtn.addEventListener("click", function () {
  if (!navigator.geolocation) {
    locationStatus.textContent = "Your browser does not support GPS location.";

    return;
  }

  locationStatus.textContent = "Getting your current location...";

  getLocationBtn.disabled = true;

  getLocationBtn.textContent = "Getting Location...";

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;

      const longitude = position.coords.longitude;

      /* Save coordinates */

      latitudeInput.value = latitude;

      longitudeInput.value = longitude;

      /* Show location */

      locationText.textContent = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      locationStatus.textContent = "✓ Your current location has been captured.";

      getLocationBtn.disabled = false;

      getLocationBtn.textContent = " Location Captured";
    },

    function (error) {
      getLocationBtn.disabled = false;

      getLocationBtn.textContent = "📍 Use Current Location";

      if (error.code === 1) {
        locationStatus.textContent =
          "Location permission was denied. Please allow location access.";
      } else if (error.code === 2) {
        locationStatus.textContent =
          "Your current location could not be found.";
      } else if (error.code === 3) {
        locationStatus.textContent = "Location request timed out. Try again.";
      } else {
        locationStatus.textContent = "Unable to get your location.";
      }
    },

    {
      enableHighAccuracy: true,

      timeout: 15000,

      maximumAge: 0,
    },
  );
});

const phoneNumber = document.getElementById("phoneNumber");

phoneNumber.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

complaintForm.addEventListener("submit", function (event) {
  event.preventDefault();

  /* Check location */

  if (latitudeInput.value === "" || longitudeInput.value === "") {
    alert(
      "Please select your current location before submitting the complaint.",
    );

    return;
  }

  const name = document.getElementById("userName").value;

  const title = document.getElementById("complaintTitle").value;

  alert("Complaint submitted successfully!\n\n" + "Thank you, " + name + "!");

  console.log({
    userName: document.getElementById("userName").value,

    phone: document.getElementById("phoneNumber").value,

    address: document.getElementById("userAddress").value,

    title: document.getElementById("complaintTitle").value,

    category: document.getElementById("complaintCategory").value,

    description: document.getElementById("complaintDescription").value,

    latitude: latitudeInput.value,

    longitude: longitudeInput.value,

    image: complaintImage.files[0],
  });

  complaintForm.reset();

  imagePreview.style.display = "none";

  photoText.style.display = "flex";

  locationText.textContent = "Location not selected";

  locationStatus.textContent = "";

  closeComplaintForm();
});
