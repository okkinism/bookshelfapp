document.addEventListener("DOMContentLoaded", function () {
  const unfinishedList = document.getElementById("unfinished-list");
  const finishedList = document.getElementById("finished-list");
  const addBookForm = document.getElementById("add-book-form");
  const searchInput = document.getElementById("search");

  // ngambil buku dari localStorage
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // me-render buku
  renderBooks();

  // function untuk render buku pada shelves
  function renderBooks() {
    unfinishedList.innerHTML = "";
    finishedList.innerHTML = "";

    const unfinishedBooks = books.filter((book) => !book.isComplete);
    const finishedBooks = books.filter((book) => book.isComplete);

    if (unfinishedBooks.length === 0) {
      // Jika rak "Belum Selesai Dibaca" kosong, tampilkan pesan
      unfinishedList.innerHTML = "<h2>Rak kosong!</h2>";
    } else {
      unfinishedBooks.forEach((book) => {
        const li = document.createElement("li");
        li.setAttribute("data-id", book.id); // atribut data-id CSS
        const bookInfo = document.createElement("div");
        bookInfo.classList.add("book-info"); // Add a class for styling
        bookInfo.innerHTML = `
          <img src="${
            book.cover || "default-cover.jpg"
          }" alt="Cover Buku" width="150">
          <p>${book.title}</p>
          <p>${book.author} (${book.year})</p>
          <div class="button-row">
            <button onclick="moveBook(${book.id})">Pindahkan</button>
            <button onclick="deleteBook(${book.id})">Hapus</button>
            <button onclick="editBook(${book.id})">Edit</button>
          </div>`;

        li.appendChild(bookInfo);
        unfinishedList.appendChild(li);
      });
    }

    if (finishedBooks.length === 0) {
      // Jika rak "Selesai Dibaca" kosong, tampilkan pesan
      finishedList.innerHTML = "<h2>Rak kosong!</h2>";
    } else {
      finishedBooks.forEach((book) => {
        const li = document.createElement("li");
        const bookInfo = document.createElement("div");
        bookInfo.classList.add("book-info"); // Add a class for styling
        bookInfo.innerHTML = `
          <img src="${
            book.cover || "default-cover.jpg"
          }" alt="Cover Buku" width="150">
          <p>${book.title}</p>
          <p>${book.author} (${book.year})</p>
          <div class="button-row">
            <button onclick="moveBook(${book.id})">Pindahkan</button>
            <button onclick="deleteBook(${book.id})">Hapus</button>
            <button onclick="editBook(${book.id})">Edit</button>
          </div>`;

        li.appendChild(bookInfo);
        finishedList.appendChild(li);
      });
    }
  }

  // function untuk menambahkan buku
  function addBook(title, author, year, isComplete, cover) {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
      cover,
    };

    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();

    // dapatkan elemen buku yang baru ditambahkan
    const newBookElement = document.querySelector(`[data-id="${newBook.id}"]`);

    // tambahkan kelas fade-in untuk animasi
    newBookElement.classList.add("fade-in");

    // hapus kelas fade-in setelah animasi selesai
    setTimeout(() => {
      newBookElement.classList.remove("fade-in");
    }, 500);
  }


  // function untuk edit buku
  window.editBook = function (id) {
    const index = books.findIndex((book) => book.id === id);
    const bookToEdit = books[index];
  
    // ubah informasi buku
    let newTitle = prompt('Masukkan judul baru:', bookToEdit.title);
    let newAuthor = prompt('Masukkan nama penulis:', bookToEdit.author);
    let newYear = prompt('Masukkan tahun terbit (angka):', bookToEdit.year);
  
    // validasi input tahun terbit, jika bukan angka maka muncul popup
    while (!isValidYear(newYear)) {
      newYear = prompt('Input salah! tolong masukkan tahun terbit yang benar (angka):', bookToEdit.year);
    }
  
    // update informasi buku
    if (newTitle !== null && newTitle !== "") {
      bookToEdit.title = newTitle;
    }
  
    if (newAuthor !== null && newAuthor !== "") {
      bookToEdit.author = newAuthor;
    }
  
    if (newYear !== null && newYear !== "") {
      bookToEdit.year = parseInt(newYear);
    }
  
    // simpan perubahan di localStorage lalu render di book list
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
  };
  
  // helper function to validate year as a number
  function isValidYear(year) {
    return /^\d+$/.test(year);
  }
  
  

  // memindahkan buku ke rak "belum dibaca" dan "sudah dibaca"
  window.moveBook = function (id) {
    const index = books.findIndex((book) => book.id === id);
    books[index].isComplete = !books[index].isComplete;
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();

    // dapatkan elemen buku yang dipindahkan
    const movedBookElement = document.querySelector(`[data-id="${id}"]`);

    // tambahkan kelas move-book untuk animasi
    movedBookElement.classList.add("move-book");

    // hapus kelas move-book setelah animasi selesai
    setTimeout(() => {
      movedBookElement.classList.remove("move-book");
    }, 500);
  };

  // function buat delete buku
  window.deleteBook = function (id) {
    const bookToDelete = books.find((book) => book.id === id);

    // menampilkan dialog konfirmasi
    const isConfirmed = confirm(
      `Apakah kamu yakin ingin menghapus buku "${bookToDelete.title}"?`
    );

    if (isConfirmed) {
      books = books.filter((book) => book.id !== id);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }
  };

  // function seacrh buku
  window.searchBooks = function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(
      (book) => book.title.toLowerCase().includes(searchTerm) && book.isComplete
    );

    renderSearchResults(filteredBooks);
  };

  // function untuk render pencarian buku yang sudah di baca
  function renderSearchResults(searchResults) {
    finishedList.innerHTML = "";

    searchResults.forEach((book) => {
      const li = document.createElement("li");
      const bookInfo = document.createElement("div");
      bookInfo.classList.add("book-info"); // Add a class for styling
      bookInfo.innerHTML = `
          <img src="${
            book.cover || "default-cover.jpg"
          }" alt="Cover Buku" width="150">
          <p>${book.title}</p>
          <p>${book.author} (${book.year})</p>
          <div class="button-row">
            <button onclick="moveBook(${book.id})">Pindahkan</button>
            <button onclick="deleteBook(${book.id})">Hapus</button>
            <button onclick="editBook(${book.id})">Edit</button>
          </div>`;

      li.appendChild(bookInfo);
      if (book.isComplete) {
        finishedList.appendChild(li);
      } else {
        unfinishedList.appendChild(li);
      }
    });
  }

  // form submit buku
  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById("isComplete").checked;
    const cover = document.getElementById("cover").value;

    if (title && author && year) {
      addBook(title, author, parseInt(year), isComplete, cover);
      addBookForm.reset(); // Reset setelah submit
    } else {
      alert("Mohon isi semua kolom!");
    }
  });
});
