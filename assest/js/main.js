//Book Class: Represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Handle UI tasks
class UI {
    static displayBooks(){
        const books = Store.getBook();
        books.forEach((book)=>UI.addBookToList(book));
    } 
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
            list.appendChild(row);
    }
    static deletebook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Vanish in 3 seconds
        setTimeout(()=>document.querySelector('.alert').remove(), 2000);
    }
    static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    }
}
//Store Class: Handles Storage
class Store {
    static getBook(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBook();
        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//Event Add a book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
    //Instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);
    //Add book to UI
    UI.addBookToList(book);
    //Add book to localStorage
    Store.addBook(book);
    //Show success
    UI.showAlert('Book Added', 'success');
    //Clear fields
    UI.clearFields();
    }
})
//Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    if(confirm('Are you sure?')){
    UI.deletebook(e.target);
    //Remove from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    } else {
    return;
    }
})