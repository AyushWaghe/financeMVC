import React, { useState, useEffect } from 'react';
import News from './News';
import axios from 'axios';
import '../../assets/Main.css';
import SideNavBar from '../SideNavBar/SideNavBar';

const Main = () => {
  const [navBarisToggle, setNavBarisToggle] = useState(false);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `https://saurav.tech/NewsAPI/top-headlines/category/business/in.json`
      );

      // Calculate the start and end index for the slice based on the current page
      const startIndex = (currentPage - 1) * 6;
      const endIndex = currentPage * 6;

      // Set the new articles based on the slice
      setArticles(response.data.articles.slice(startIndex, endIndex));

      // Update the current page number, cycling back to 1 if it exceeds 10
      setCurrentPage((currentPage % 10) + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []); // Trigger fetchNews when currentPage changes

  return (
    <div className="SuperMasterContainer">
      <div className="navBar">
        <SideNavBar isToggle={setNavBarTogggle} />
      </div>

      {navBarisToggle && <div className="Model"></div>}
      <div className="Master">
        <div className="NewsPageHeading">Today's Finance feed!</div>
        <div className="NewsCardContainer">
          {articles.map((article, index) => (
            <News
              key={index}
              title={article.title}
              author={article.author}
              sourceName={article.source.name}
              url={article.url}
            />
          ))}
        </div>
        <button className="fetch-button" onClick={fetchNews}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Main;
