// Variables
const steps = document.querySelectorAll(".step");
const progress = document.querySelector(".progress-bar");
let current = 0;

const role = document.getElementById("role");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const fileInput = document.getElementById("document");
const preview = document.getElementById("preview");

const buttons = document.querySelectorAll("button");

// File preview logic
fileInput.addEventListener("change", () => {
  preview.innerHTML = "";
  const file = fileInput.files[0];

  if (!file) return;

  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  } else {
    preview.textContent = `Selected file: ${file.name}`;
  }
});

// Mock API function
function submitApplication(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ["pending", "approved", "rejected"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      resolve({ status });
    }, 1500);
  });
}

// Button click logic
buttons.forEach((btn) => {
  btn.addEventListener("click", async () => {

    // Step 1 validation
    if (current === 0 && role.value === "") {
      alert("Please select a role");
      return;
    }

    // Step 2 validation
    if (current === 1) {
      if (nameInput.value.trim() === "") {
        alert("Name is required");
        return;
      }
      if (!emailInput.checkValidity()) {
        alert("Please enter a valid email");
        return;
      }
    }

    // Step 3: Submit + Mock API
    if (current === 2) {
      const formData = {
        role: role.value,
        name: nameInput.value,
        email: emailInput.value,
        fileName: fileInput.files[0] ? fileInput.files[0].name : null,
      };

      btn.textContent = "Submitting...";
      btn.disabled = true;

      const response = await submitApplication(formData);

      // Go to Status Page
      steps[current].classList.remove("active");
      current++;
      steps[current].classList.add("active");
      progress.style.width = "100%";

      // Update Status
      const statusDiv = document.querySelector(".status");
      statusDiv.className = "status " + response.status;
      statusDiv.textContent =
        response.status === "pending"
          ? "⏳ Your application is under review"
          : response.status === "approved"
          ? "✅ Your application has been approved"
          : "❌ Your application has been rejected";

      btn.textContent = "Submit";
      btn.disabled = false;
      return;
    }

    // Step بعدی
    steps[current].classList.remove("active");
    current++;
    if (current < steps.length) {
      steps[current].classList.add("active");
      progress.style.width = ((current + 1) / steps.length) * 100 + "%";
    }
  });
});
