import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InputBook.css';

let debounceTimer;
const genres = ['Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Horror', 'Nonfiction'];


const InputBook = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.trim() === '') return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchBooks(keyword);
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      const booksWithCovers = data.docs.map(book => ({
        ...book,
        coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        workId: book.key?.split('/').pop() || book.key
      }));

      setSearchResults(booksWithCovers);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      fetchBooks(keyword);
    }
  };

  const handleBookClick = (book) => {
    const workId = book.key.split('/').pop();
    if (workId) navigate(`/book/${workId}`);
  };

  return (
    <div className="container">
      <h1 className="text-2xl mb-4">Search Books</h1>
      <div className="mb-4">
        <p className="mb-2 font-semibold">Browse by genre:</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => fetchBooks(genre)}
              className="genre-button"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={handleChange}
            placeholder="Search for books..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((book) => (
          <div 
            key={book.key} 
            className="border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleBookClick(book)}
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Cover for ${book.title}`}
                className="w-full h-48 object-cover mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
                No cover available
              </div>
            )}
            <h2 className="font-bold">{book.title}</h2>
            {book.author_name && (
              <p className="text-gray-600">By {book.author_name.join(', ')}</p>
            )}
            {book.first_publish_year && (
              <p className="text-sm text-gray-500">Published: {book.first_publish_year}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputBook;