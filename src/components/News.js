import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capatalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {

    const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=0fdfd00b18aa4e1389349518318ec0fb&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  }

  useEffect(() => {
    document.title = `${capatalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, []);
  
    const fetchMoreData = async () => {

       const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=0fdfd00b18aa4e1389349518318ec0fb&page=${page+1}&pageSize=${props.pageSize}`;
      
        let data = await fetch(url);
        let parsedData = await data.json();
        setPage(page + 1);
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults)
  };

    return (
      <>
        <h2 className='text-center' style={{margin: 30, marginTop: 90}}>NewMonkey - Top {capatalizeFirstLetter(props.category)} Headlines</h2>
          {loading && <Spinner />}
         <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
        <div className="container">
        <div className="row">
           {articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
                      <NewsItem title={element.title?element.title.slice(0, 45):''} description={element.description?element.description.slice(0, 88):''} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} />
                    </div>
           })}
        </div>
        </div>
        </InfiniteScroll>
      </>
    )
  }

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News