class LibraryItem {
    constructor(title, availableCopies) {
        this.title = title;
        this.availableCopies = availableCopies;
        this.borrowed = false;
        this.borrowedDate = null;
    }

    getTitle() {
        return this.title;
    }

    getAvailableCopies() {
        return this.availableCopies;
    }

    borrowItem(borrowedDate) {
        if (this.availableCopies > 0) {
            this.availableCopies--;
            this.borrowed = true;
            this.borrowedDate = borrowedDate;
        }
    }

    returnItem(returnDate, borrowedDate) {
        if (this.borrowed) {
            this.availableCopies++;
            this.borrowed = false;
            return this.calculateLateFees(returnDate, borrowedDate);
        }
        return 0;
    }

    calculateLateFees(returnDate, borrowedDate) {
        const lateFeePerDay = 2; 
        const dueDate = new Date(borrowedDate);

        dueDate.setDate(dueDate.getDate() + 14);

        if (returnDate > dueDate) {
            const daysOverdue = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            return daysOverdue * lateFeePerDay;
        } else {
            return 0;
        }
    }
}

class Book extends LibraryItem {
    constructor(title, author, ISBN, availableCopies) {
        super(title, availableCopies);
        this.author = author;
        this.ISBN = ISBN;
    }

    getAuthor() {
        return this.author;
    }

    getISBN() {
        return this.ISBN;
    }

    calculateLateFees(returnDate, borrowedDate) {
        const lateFeePerDay = 2; // Default fee
        const dueDate = new Date(borrowedDate);
        dueDate.setDate(dueDate.getDate() + 14);

        if (returnDate > dueDate) {
            const daysOverdue = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            return daysOverdue * lateFeePerDay;
        } else {
            return 0; 
        }
    }
}

class Library {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    getItemByISBN(ISBN) {
        return this.items.find(item => item instanceof Book && item.getISBN() === ISBN);
    }

    getAllItems() {
        return this.items;
    }

    addBook(book) {
        this.items.push(book);
    }

    getBookByISBN(ISBN) {
        return this.items.find(book => book instanceof Book && book.getISBN() === ISBN);
    }

    getAllBooks() {
        return this.items.filter(item => item instanceof Book);
    }

    searchBooks(query) {
        return this.items.filter(item =>
            item instanceof Book &&
            (item.getTitle().toLowerCase().includes(query.toLowerCase()) ||
            item.getAuthor().toLowerCase().includes(query.toLowerCase()))
        );
    }

    returnBookByISBN(ISBN) {
        const book = this.getBookByISBN(ISBN);
        if (book !== undefined) {
            if (book.borrowed) {
                const borrowedDate = new Date();
                borrowedDate.setDate(borrowedDate.getDate() - 28);

                const lateFees = book.returnItem(new Date(), borrowedDate);
                if (lateFees > 0) {
                    window.alert(`Late fees for this book: ${lateFees.toFixed(2)} rupees`);
                } else {
                    window.alert("No late fees for this book.");
                }
                window.alert("Book returned successfully.");
            } else {
                window.alert("You can only return a borrowed book.");
            }
        } else {
            window.alert("Book not found.");
        }
    }
}

const library = new Library();

function updateOutput(message) {
    document.getElementById('output').innerHTML = message;
}

function showMainMenu() {
    const menu = `
        <div class="menu">
            <h1>Library Management System</h1>
            <ul>
                <li><a href="#" onclick="addBook()">1. Add a Book</a></li>
                <li><a href="#" onclick="borrowBook()">2. Borrow a Book</a></li>
                <li><a href="#" onclick="returnBook()">3. Return a Book</a></li>
                <li><a href="#" onclick="listBooks()">4. List Books</a></li>
                <li><a href="#" onclick="searchBooks()">5. Search for Books</a></li>
                <li><a href="#" onclick="quit()">6. Quit</a></li>
            </ul>
        </div>
    `;

    updateOutput(menu);
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}

showMainMenu();

function addBook() {
    const title = prompt("Enter book title:");
    const author = prompt("Enter author:");
    const ISBN = prompt("Enter ISBN:");
    const availableCopies = parseInt(prompt("Enter number of available copies:"));

    if (!title || !author || !ISBN || isNaN(availableCopies)) {
        alert("All fields must be filled, and 'Available Copies' must be a valid number.");
    } else {
        // Check if a book with the same ISBN already exists
        const existingBook = library.getBookByISBN(ISBN);
        if (existingBook) {
            alert("A book with the same ISBN already exists in the library.");
        } else {
            const newBook = new Book(title, author, ISBN, availableCopies);
            library.addBook(newBook);
            alert("Book added successfully.");
        }
    }
    showMainMenu();
}


function borrowBook() {
    const borrowISBN = prompt("Enter ISBN of the book to borrow:");
    if (!borrowISBN) {
        alert("ISBN field must not be empty.");
    } else {
        const borrowBook = library.getBookByISBN(borrowISBN);
        if (borrowBook !== undefined) {
            const borrowedDate = new Date(); // current date kept as borrow date
            borrowBook.borrowItem(borrowedDate);
            alert("Book borrowed successfully.");
        } else {
            alert("Book not found or no available copies.");
        }
    }
    showMainMenu();
}

function returnBook() {
    const returnISBN = prompt("Enter ISBN of the book to return:");
    library.returnBookByISBN(returnISBN);
    showMainMenu();
}

function listBooks() {
    const allBooks = library.getAllBooks();
    let bookList = "All Books in the Library:";
    allBooks.forEach(book => {
        bookList += `Title: ${book.getTitle()}, Author: ${book.getAuthor()}, ISBN: ${book.getISBN()}, Available Copies: ${book.getAvailableCopies()}\n`;
    });
    alert(bookList);
    showMainMenu();
}

function searchBooks() {
    const query = prompt("Enter search query (title or author):");
    const matchingBooks = library.searchBooks(query);
    if (matchingBooks.length === 0) {
        window.alert("No matching books found.");
    } else {
        let matchingBookList = "Matching Books:";
        matchingBooks.forEach(book => {
            matchingBookList += `Title: ${book.getTitle()}, Author: ${book.getAuthor()}, ISBN: ${book.getISBN()}, Available Copies: ${book.getAvailableCopies()}\n`;
        });
        alert(matchingBookList);
    }
    showMainMenu();
}

function quit() {
    alert("Exiting Library Management System. Goodbye!");
    reload();
}