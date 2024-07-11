import React from "react";
import './APINews.css';

const News = ({ title, author, sourceName, url }) => {
  const goToArticle = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="news-card">
      <div className="news-header">
        <h2 className="news-title">{title}</h2>
      </div>
      <div className="news-details">
        <p className="news-author">Author: {author}</p>
        <p className="news-source">Source: {sourceName}</p>
      </div>
      <button
        style={{
          padding: '10px',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={goToArticle}
      >
        Go
      </button>
    </div>
  );
};

export default News;
