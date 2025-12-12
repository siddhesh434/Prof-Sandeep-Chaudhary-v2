document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality is handled by header.ejs

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
        
        // Application number is the second paragraph in patent-card-body
        const appNumberElement = patentCard.querySelectorAll(".patent-card-body p")[1];
        const appNumber = appNumberElement ? appNumberElement.textContent.replace("Application No.: ", "") : "";

        // Check for filing date
        let filingDate = "";
        const filingDateElement = Array.from(patentCard.querySelectorAll(".patent-card-body p")).find(p => 
          p.textContent.includes("Filing Date:")
        );
        if (filingDateElement) {
          filingDate = filingDateElement.textContent.replace("Filing Date: ", "");
        }
        
        // Check for publication date
        let publicationDate = "";
        const publicationDateElement = Array.from(patentCard.querySelectorAll(".patent-card-body p")).find(p => 
          p.textContent.includes("Publication Date:")
        );
        if (publicationDateElement) {
          publicationDate = publicationDateElement.textContent.replace("Publication Date: ", "");
        }

        // Check for grant number
        let grantNumber = "";
        const grantNumberElement = patentCard.querySelector(".grantNum");
        if (grantNumberElement) {
          grantNumber = grantNumberElement.textContent.replace("Grant Number: ", "");
        }

        // Check for grant date
        let grantDate = "";
        const grantDateElement = patentCard.querySelector(".grantDate");
        if (grantDateElement) {
          grantDate = grantDateElement.textContent.replace("Grant Date: ", "");
        }

        // Set modal content
        document.getElementById("modal-title").textContent = title;
        document.getElementById("modal-inventors").textContent = inventors;
        document.getElementById("modal-year").textContent = year;
        document.getElementById("modal-app-number").textContent = appNumber;

        // Handle filing date
        if (filingDate) {
          document.getElementById("modal-filing-date-value").textContent = filingDate;
          document.getElementById("modal-filing-date").style.display = "block";
        } else {
          document.getElementById("modal-filing-date").style.display = "none";
        }

        // Handle publication date
        if (publicationDate) {
          document.getElementById("modal-publication-date-value").textContent = publicationDate;
          document.getElementById("modal-publication-date").style.display = "block";
        } else {
          document.getElementById("modal-publication-date").style.display = "none";
        }

        // Handle grant number
        if (grantNumber && grantNumber.trim() !== "") {
          document.getElementById("modal-grant-number-value").textContent = grantNumber;
          document.getElementById("modal-grant-number").style.display = "block";
        } else {
          document.getElementById("modal-grant-number").style.display = "none";
        }

        // Handle grant date
        if (grantDate && grantDate.trim() !== "") {
          document.getElementById("modal-grant-date-value").textContent = grantDate;
          document.getElementById("modal-grant-date").style.display = "block";
        } else {
          document.getElementById("modal-grant-date").style.display = "none";
        }

        // Description
        document.getElementById("modal-description").textContent = description;

        // Show the modal
        modal.style.display = "block";
      }
    });
  });
}