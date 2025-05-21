import React, { useState } from 'react';

const InputBook = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      // Transform the data to include cover image URLs
      const booksWithCovers = data.docs.map(book => ({
        ...book,
        coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
      }));

      setSearchResults(booksWithCovers);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Books</h1>
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
          <div key={book.key} className="border rounded p-4">
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
  )
}

export default InputBook;