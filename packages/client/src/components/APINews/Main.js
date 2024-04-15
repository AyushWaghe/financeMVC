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
  }

  const fetchNews = async () => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=finance&apiKey=22b4c4e6191f45abb125735bb94a1c2d&page=${currentPage}`);
      console.log(response.data.articles[0].url);
      // Set the new articles, replacing the existing ones
      setArticles(response.data.articles.slice(0, 6));
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="SuperMasterContainer">
      <div className="navBar">
        <SideNavBar
          isToggle={setNavBarTogggle}
        />
      </div>

      {navBarisToggle && <div className="Model"></div>}
      <div className='Master'>
      <div className="NewsPageHeading">
        Today's Finance feed!
      </div>
        <div className="NewsCardContainer">
          {articles.map((article, index) => (
            <News key={index} title={article.title} author={article.author} sourceName={article.source.name} url={article.url} />
          ))}

        </div>
        <button class="fetch-button" onClick={fetchNews}>Next</button>
      </div>
    </div>
  );
};

export default Main;
