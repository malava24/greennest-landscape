const form = document.getElementById("quote-form");
const statusEl = document.getElementById("form-status");
const submitBtn = form.querySelector("button[type='submit']");

function showStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = "form-status " + type;
}

// ---- Field validation ----
// Each rule returns an error text, or "" if the value is fine.
const rules = {
  name: (v) =>
    v.trim().length < 2 ? "Please enter your name." : v.length > 60 ? "Name is too long (max 60 characters)." : "",
  phone: (v) => {
    const digits = v.replace(/\D/g, ""); // keep digits only
    const onlyAllowed = /^[+\d\s().-]+$/.test(v.trim());
    return onlyAllowed && digits.length >= 10 && digits.length <= 15
      ? ""
      : "Please enter a valid phone number, e.g. (555) 123-4567.";
  },
  email: (v) =>
    v.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ""
      : "Please enter a valid email, e.g. name@example.com.",
  message: (v) =>
    v.trim().length < 5
      ? "Please write a short message."
      : v.length > 1000
        ? "Message is too long (max 1000 characters)."
        : "",
};

// Live character counter for the message field
const messageInput = form.elements["message"];
const counterEl = document.getElementById("message-counter");
function updateCounter() {
  counterEl.textContent = messageInput.value.length + " / 1000";
}
messageInput.addEventListener("input", updateCounter);
form.addEventListener("reset", () => setTimeout(updateCounter, 0));

function validateField(name) {
  const input = form.elements[name];
  const error = rules[name](input.value);
  let errEl = input.parentElement.querySelector(".field-error");
  if (!errEl) {
    errEl = document.createElement("p");
    errEl.className = "field-error";
    input.parentElement.appendChild(errEl);
  }
  errEl.textContent = error;
  input.setAttribute("aria-invalid", error ? "true" : "false");
  return error === "";
}

function validateAll() {
  // Check every field (don't stop at the first error) so all problems show at once
  const results = Object.keys(rules).map(validateField);
  return results.every(Boolean);
}

// Re-check a field when the user leaves it, and clear the error as they fix it
Object.keys(rules).forEach((name) => {
  const input = form.elements[name];
  input.addEventListener("blur", () => validateField(name));
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") validateField(name);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the page from reloading

  // Honeypot check: a real person never sees this field, so it must be empty.
  // If it is filled, it's a bot: pretend success and send nothing.
  if (form.elements["_gotcha"].value !== "") {
    showStatus("Thank you, we’ll contact you within 24 hours", "success");
    form.reset();
    return;
  }

  if (!validateAll()) {
    showStatus("Please fix the highlighted fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  showStatus("Sending...", "");

  try {
    // The address is taken from the form's action attribute in index.html
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      showStatus("Thank you, we’ll contact you within 24 hours", "success");
      form.reset();
    } else {
      showStatus("Sorry, something went wrong on our side. Please try again in a few minutes.", "error");
    }
  } catch (err) {
    showStatus("Could not send your request. Please check your internet connection and try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});
