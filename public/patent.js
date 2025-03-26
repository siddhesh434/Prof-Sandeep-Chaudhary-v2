document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");

  // Check for saved theme preference or use default (dark)
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Set the toggle position based on the current theme
  if (themeToggle) {
    themeToggle.checked = savedTheme === "dark";

    // Listen for toggle changes
    themeToggle.addEventListener("change", function (e) {
      if (e.target.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Patents section functionality
  initializePatentsSection();

  // Modal functionality
  initializeModal();
});

function initializePatentsSection() {
  // DOM elements
  const patentSearch = document.getElementById("patent-search");
  const searchBtn = document.getElementById("search-btn-patents");
  const patentCards = document.getElementById("patent-cards");

  if (!patentCards) return;

  // Get all patent cards
  const allCards = patentCards.querySelectorAll(".patent-card");

  // Filter cards based on search input
  function filterCards() {
    const searchTerm = patentSearch.value.toLowerCase();
    
    allCards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(searchTerm) ? "block" : "none";
    });
  }

  // Event listeners
  if (searchBtn) {
    searchBtn.addEventListener("click", filterCards);
  }

  if (patentSearch) {
    patentSearch.addEventListener("keyup", filterCards);
  }
}

function initializeModal() {
  const modal = document.getElementById("patent-modal");
  const closeModal = document.querySelector(".close-modal");
  const viewButtons = document.querySelectorAll(".view-details-btn");

  // Close modal when clicking on X
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Open modal with patent details when View button is clicked
  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const patentId = this.getAttribute("data-id");
      const patentCard = document.querySelector(
        `.patent-card[data-index="${patentId}"]`
      );

      if (patentCard) {
        const title = patentCard.querySelector(".patent-card-header h3").textContent;
        const inventorsElement = patentCard.querySelector(".patent-card-body p:first-child");
        const inventors = inventorsElement ? inventorsElement.textContent.replace("Inventors: ", "") : "";
        const year = patentCard.querySelector(".patent-year").textContent;
        const description = patentCard.querySelector(".desc").textContent;
        const grantDate = patentCard.querySelector(".grantDate").textContent;
        const grantNumber = patentCard.querySelector(".grantNum").textContent;
        
        // Application number is the second paragraph in patent-card-body
        const appNumberElement = patentCard.querySelectorAll(".patent-card-body p")[1];
        const appNumber = appNumberElement ? appNumberElement.textContent.replace("Application No.: ", "") : "";

        // Set modal content
        document.getElementById("modal-title").textContent = title;
        document.getElementById("modal-inventors").textContent = inventors;
        document.getElementById("modal-year").textContent = year;
        document.getElementById("modal-app-number").textContent = appNumber;

        // For patent and grant numbers, we'll leave them as placeholders since they're not in the card
        document.getElementById("modal-patent-number").textContent = grantNumber;
        document.getElementById("modal-grant-date").textContent = grantDate;

        // Description remains the same as before
        document.getElementById("modal-description").textContent = description;

        // Show the modal
        modal.style.display = "block";
      }
    });
  });
}