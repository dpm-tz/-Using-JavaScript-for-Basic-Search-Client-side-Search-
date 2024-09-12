To implement **client-side search** using JavaScript, we can write a function that searches through the content of each page and highlights the search terms. This approach allows users to search for text that is present in the current HTML document, and the results will be highlighted.


#### 1. **HTML Structure (for all pages)**

Add the following structure to all of your HTML files where you want the search functionality to be applied.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Search Website</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <nav>
        <div class="logo">My Website</div>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search..." />
            <button onclick="searchFunction()" id="searchButton"><i class="fas fa-search"></i></button>
        </div>
        <i class="fas fa-bars menu-icon"></i>
    </nav>
</header>

<div class="content">
    <h2>About Us</h2>
    <p>We are a web development company...</p>
    
    <h2>Our Services</h2>
    <p>We offer a variety of services including web development, mobile app development...</p>

    <h2>Contact Us</h2>
    <p>If you have any questions, feel free to reach out...</p>
</div>

<div class="results" id="searchResults"></div>

<script src="script.js"></script>

</body>
</html>

```

#### 2. **style.css**
Add the following CSS to highlight the matching search results.

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #222;
}
header {
    background-color: #4CAF50;
    color: white;
    padding: 15px;
}
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
}
nav .logo {
    font-size: 24px;
    font-weight: bold;
}
nav ul {
    display: flex;
    list-style: none;
    flex-wrap: wrap;
}
nav ul li {
    margin-left: 20px;
}
nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 16px;
}
nav ul li a:hover {
    text-decoration: underline;
}
.search-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-container input[type="text"] {
    padding: 7px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    display: block;
}
.search-container button {
    padding: 7px;
    font-size: 16px;
    border: none;
    background-color: #fff;
    color: #4CAF50;
    cursor: pointer;
    border-radius: 4px;
    margin-left: 5px;
}
.search-container button:hover {
    background-color: #eee;
}
.menu-icon {
    font-size: 28px;
    display: none;
    cursor: pointer;
}
@media (max-width: 768px) {
    nav ul {
        display: none;
    }
    nav .menu-icon {
        display: block;
    }
    nav.active ul {
        display: flex;
        flex-direction: column;
        background-color: #333;
        position: absolute;
        top: 60px;
        width: 100%;
        text-align: center;
    }
    nav.active ul li {
        margin: 15px 0;
    }
    .search-container input[type="text"] {
        display: none;
    }
    .search-container.active input[type="text"] {
        display: block;
        width: 150px;
        margin-left: 5px;
    }
}

/* Highlight the search term */
.highlight {
    background-color: yellow;
    color: black;
}

/* Basic styling for search */
.search-container input {
    padding: 8px;
    width: 200px;
}

.search-container button {
    padding: 8px;
}


```

#### 3. **JavaScript for Searching and Highlighting (script.js)**

Here's the JavaScript code that searches through the page content and highlights the matching text:

```javascript
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

```

### How it works:
- The user types a search term into the input field and clicks the search button.
- The JavaScript function checks the entire page (inside the `.content` div) for matches to the search term.
- The `highlightMatches` function then wraps any matching words in a `span` tag with the class `highlight`, which uses CSS to highlight the text.
- `removeHighlights` clears any previously highlighted text to ensure that only the current search results are highlighted.

### Next Steps:
- You can copy this structure for the **Services**, **About**, and **Contact** pages, and it will work seamlessly across these pages.
- This search is **basic** and only searches content on the currently loaded page. If you need to search across multiple pages dynamically, a database-backed approach would be necessary.

##### Try the implementation of Database-backed Search (Server-side Search)
If you want to search across different pages or large data, you need a server-side system, usually involving a database (e.g., MySQL) that stores your website's content and a server-side language like PHP to handle queries from the database. Here's how that works:

When a user types something in the search bar, it sends a request to the server (through an API or form submission).
The server queries the database for matching results and returns them to the client (your browser).
