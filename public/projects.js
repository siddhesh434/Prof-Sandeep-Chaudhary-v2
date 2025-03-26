document.addEventListener('DOMContentLoaded', function() {
    // Define all project types
    const projectTypes = [
        { id: 'sponsored', name: 'Sponsored Research Project', rowClass: 'sponsored-row' },
        { id: 'institute', name: 'Institute Level Project', rowClass: 'institute-row' },
        { id: 'consultancy', name: 'Consultancy Project', rowClass: 'consultancy-row' }
    ];

    // Initialize each project section
    projectTypes.forEach(type => {
        initializeSection(type.id, `${type.id}-body`, type.rowClass);
    });

    // Update the counts in the summary cards
    updateProjectCounts();

    // Function to update the project counts
    function updateProjectCounts() {
        // Get count of each project type
        projectTypes.forEach(type => {
            const count = document.querySelectorAll(`.${type.rowClass}`).length;
            document.getElementById(`${type.id}-count`).textContent = count;
        });

        // Update total count
        const totalCount = projectTypes.reduce((sum, type) => {
            return sum + document.querySelectorAll(`.${type.rowClass}`).length;
        }, 0);
        document.getElementById('total-projects').textContent = totalCount;
    }

    // Function to initialize pagination and search for a section
    function initializeSection(sectionId, tbodyId, rowClass) {
        // DOM elements
        const entriesSelect = document.getElementById(`entries-select-${sectionId}`);
        const searchInput = document.getElementById(`${sectionId}-search`);
        const searchBtn = document.getElementById(`search-btn-${sectionId}`);
        const tbody = document.getElementById(tbodyId);
        const paginationControls = document.getElementById(`pagination-controls-${sectionId}`);
        const showingStart = document.getElementById(`showing-start-${sectionId}`);
        const showingEnd = document.getElementById(`showing-end-${sectionId}`);
        const totalEntries = document.getElementById(`total-entries-${sectionId}`);

        if (!tbody || !paginationControls) return;

        // Get all rows
        const allRows = tbody.querySelectorAll(`.${rowClass}`);
        
        // Update total entries count
        if (totalEntries) {
            totalEntries.textContent = allRows.length;
        }

        // Variables
        let currentPage = 1;
        let entriesPerPage = parseInt(entriesSelect ? entriesSelect.value : 5);
        let filteredRows = [...allRows];

        // Initialize pagination
        function initializePagination() {
            updatePagination();
            showPage(currentPage);
        }

        // Update pagination based on filtered rows
        function updatePagination() {
            const pageCount = Math.ceil(filteredRows.length / entriesPerPage) || 1;
            paginationControls.innerHTML = '';

            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&laquo;';
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    showPage(currentPage);
                    updatePaginationButtons();
                }
            });
            paginationControls.appendChild(prevBtn);

            // Page buttons (show max 5 buttons)
            const maxVisibleButtons = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
            let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

            // Adjust start page if we're near the end
            if (endPage - startPage + 1 < maxVisibleButtons) {
                startPage = Math.max(1, endPage - maxVisibleButtons + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.dataset.page = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = parseInt(i);
                    showPage(currentPage);
                    updatePaginationButtons();
                });
                paginationControls.appendChild(pageBtn);
            }

            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '&raquo;';
            nextBtn.addEventListener('click', () => {
                if (currentPage < pageCount) {
                    currentPage++;
                    showPage(currentPage);
                    updatePaginationButtons();
                }
            });
            paginationControls.appendChild(nextBtn);

            updatePaginationButtons();
        }

        // Update active button
        function updatePaginationButtons() {
            const buttons = paginationControls.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.dataset.page == currentPage) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }

        // Show current page
        function showPage(page) {
            // Hide all rows
            allRows.forEach(row => {
                row.style.display = 'none';
            });

            // Show rows for current page
            const start = (page - 1) * entriesPerPage;
            const end = Math.min(start + entriesPerPage, filteredRows.length);

            filteredRows.forEach((row, index) => {
                if (index >= start && index < end) {
                    row.style.display = 'table-row';
                }
            });

            // Update info text
            if (showingStart && showingEnd && totalEntries) {
                showingStart.textContent = filteredRows.length ? start + 1 : 0;
                showingEnd.textContent = end;
                totalEntries.textContent = filteredRows.length;
            }
        }

        // Filter rows based on search input
        function filterRows() {
            const searchTerm = searchInput.value.toLowerCase();
            filteredRows = [...allRows].filter(row => {
                const text = row.textContent.toLowerCase();
                return text.includes(searchTerm);
            });

            currentPage = 1;
            updatePagination();
            showPage(currentPage);
        }

        // Event listeners
        if (entriesSelect) {
            entriesSelect.addEventListener('change', function() {
                entriesPerPage = parseInt(this.value);
                currentPage = 1;
                updatePagination();
                showPage(currentPage);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', filterRows);
        }

        if (searchInput) {
            searchInput.addEventListener('keyup', function(e) {
                // Filter on Enter key or automatically after slight delay
                    filterRows();
            });
        }

        // Initialize on page load
        initializePagination();
    }

    // Smooth scroll to section when clicking on section links
    document.querySelectorAll('.project-type-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});