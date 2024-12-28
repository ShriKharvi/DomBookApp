const baseUrl = "https://your-glitch-url.glitch.me/books";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email === "admin@empher.com" && password === "empher@123") {
        localStorage.setItem("loginData", JSON.stringify({ email }));
        alert("Logged in as Admin.");
        window.location.href = "admin.html";
      } else if (email === "user@empher.com" && password === "user@123") {
        localStorage.setItem("loginData", JSON.stringify({ email }));
        alert("Logged in as User.");
        window.location.href = "books.html";
      } else {
        document.getElementById("error").textContent = "Invalid credentials.";
      }
    });
  }

  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (document.title === "Admin Page" && loginData?.email !== "admin@empher.com") {
    alert("Admin Not Logged In");
    window.location.href = "index.html";
  }
  if (document.title === "User Books" && loginData?.email !== "user@empher.com") {
    alert("User Not Logged In");
    window.location.href = "index.html";
  }


  const addBookForm = document.getElementById("addBookForm");
  if (addBookForm) {
    addBookForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const category = document.getElementById("category").value;

      const book = {
        title,
        author,
        category,
        isAvailable: true,
        isVerified: false,
        borrowedDays: null,
        imageUrl: "https://m.media-amazon.com/images/I/71ZB18P3inL.SY522.jpg",
      };

      await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      alert("Book Added Successfully");
      location.reload();
    });
  }


  async function fetchBooks(isAvailable) {
    const books = await fetch('${baseUrl}?isAvailable=${isAvailable}').then((res) =>
      res.json()
    );
    const bookGrid = document.getElementById("bookGrid");
    bookGrid.innerHTML = books
      .map(
        (book) => `
      <div class="card">
        <img src="${book.imageUrl}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Category: ${book.category}</p>
        <button>Borrow</button>
      </div>
    `
      )
      .join("");
  }


  if (document.title === "User Books") {
    document.getElementById("showAvailable").addEventListener("click", () =>
      fetchBooks(true)
    );
  }
});