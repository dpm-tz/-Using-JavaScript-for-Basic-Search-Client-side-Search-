To implement **client-side search** using JavaScript, we can write a function that searches through the content of each page and highlights the search terms. This approach allows users to search for text that is present in the current HTML document, and the results will be highlighted.


#### 1. **HTML Structure (for all pages)**

Add the following structure to all of your HTML files where you want the search functionality to be applied.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services</title>
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
    <h2>Our Services</h2>
    <p>We offer a wide range of services to cater to your needs, including:</p>
    <ul>
        <li>Web Development</li>
        <li>Mobile App Development</li>
        <li>SEO and Digital Marketing</li>
        <li>Cloud Computing</li>
        <li>Custom Software Solutions</li>
    </ul>
</div>

<div class="results" id="searchResults"></div>

<script src="script.js"></script>

</body>
</html>
```

#### 2. **CSS for Highlighting (style.css)**
Add the following CSS to highlight the matching search results.

```css
/* Highlight the search term */
.highlight {
    background-color: yellow;
    color: black;
}
```

#### 3. **JavaScript for Searching and Highlighting (script.js)**

Here's the JavaScript code that searches through the page content and highlights the matching text:

```javascript
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
    const regex = new RegExp(`(${query})`, 'gi'); // Create regex to match the query
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
        if (node.nodeType === 3) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(getTextNodes);
        }
    }
    getTextNodes(element);
    return textNodes;
}
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
