const newsletterSignup = document.getElementById("newsletter-signup-form");

newsletterSignup.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterSignup.elements["email"].value;
  localStorage.setItem("email", email);
  console.log(`Email saved to local storage: ${email}`);

  const successMessage = document.createElement("div");
  successMessage.textContent = "Thank you for signing up for our newsletter!";
  successMessage.classList.add("success-message"); // Add the class for styling
  newsletterSignup.appendChild(successMessage);
});