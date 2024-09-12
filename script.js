// Real-time Search and Highlight
function searchFunction() {
    // Get the search input
    const input = document.getElementById('searchInput').value.toLowerCase();
    const content = document.querySelector('.content');
    
    // Clear previous highlights
    removeHighlights(content);
    
    // Check if input is empty
    if (input.trim() === "") {
        return;
    }
    
    // Find matching text and highlight it
    highlightMatches(content, input);
}

function highlightMatches(element, query) {
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi'); // Create regex to match the query
    const textNodes = getTextNodesIn(element); // Get all text nodes in the content
    
    textNodes.forEach(node => {
        const originalText = node.textContent;
        if (regex.test(originalText)) {
            const highlightedText = originalText.replace(regex, `<span class="highlight">$1</span>`);
            const span = document.createElement('span');
            span.innerHTML = highlightedText;
            node.parentNode.replaceChild(span, node);
        }
    });
}

// Utility function to escape special characters for regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
}

// Utility function to remove existing highlights
function removeHighlights(element) {
    const highlightedElements = element.querySelectorAll('.highlight');
    highlightedElements.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(textNode, span);
    });
}

// Utility function to get all text nodes within an element
function getTextNodesIn(element) {
    const textNodes = [];
    function getTextNodes(node) {
        if (node.nodeType === 3) { // If it's a text node
            textNodes.push(node);
        } else {
            node.childNodes.forEach(getTextNodes);
        }
    }
    getTextNodes(element);
    return textNodes;
}

// Search across multiple pages
function searchAcrossPages() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    let pages = ['index.html', 'services.html', 'about.html', 'contact.html'];
    let resultsContainer = document.getElementById("searchResults");
    let found = false;
    
    resultsContainer.innerHTML = "<p>Searching...</p>";
    
    // Clear previous results
    resultsContainer.innerHTML = "";

    // Fetch content from all pages
    Promise.all(pages.map(page => fetch(page).then(response => response.text())))
        .then(pagesContent => {
            pagesContent.forEach((html, index) => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let contentSections = doc.querySelectorAll("h2, p");
                
                contentSections.forEach(section => {
                    if (section.innerText.toLowerCase().includes(searchTerm)) {
                        found = true;
                        let resultItem = document.createElement("p");
                        resultItem.innerHTML = `<strong>Result from ${pages[index]}:</strong> ${highlightMatchesInHTML(section.innerHTML, searchTerm)}`;
                        resultsContainer.appendChild(resultItem);
                    }
                });
            });
            
            if (!found) {
                resultsContainer.innerHTML = `<p>No results found for: ${searchTerm}</p>`;
            }
        });
}

// Utility function to highlight matches in HTML content
function highlightMatchesInHTML(html, query) {
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi'); // Create regex to match the query
    return html.replace(regex, `<span class="highlight">$1</span>`);
}

// Responsive Menu Toggle
const menuIcon = document.querySelector(".menu-icon");
const nav = document.querySelector("nav");

menuIcon.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Show search input on small screens when search icon is clicked
const searchButton = document.querySelector("#searchButton");
const searchContainer = document.querySelector(".search-container");

searchButton.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
        searchContainer.classList.toggle('active');
        document.getElementById('searchInput').focus(); // Focus on search input when toggled
    }
});
