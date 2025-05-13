import React, { useState } from 'react';

const InputBook = () => {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e) => {
    setKeyword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(keyword);
  }

    return (
        <div>
            <h1>Input Book</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={keyword} onChange={handleChange} />
                <button type="submit">Search</button>
            </form>
        </div>
    )
}

export default InputBook;