import axios from 'axios';

export const fetchKeyword = async ({term}) => {
    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}`,
        },
        params: {
          query: term,
        },
      }
    );
    return response.data.documents;
  };


  // 2024.10.14 
  export const fetchCoordinate = async ({x,y}) => {
    console.log('Fetching coordinates with:', { x, y });
    const response = await axios.get(
      'https://dapi.kakao.com/v2/local/geo/coord2address.json',
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}`,
        },
        params: {
          x: x,
          y: y,
        },
      }
    );
    return response.data.documents;
  }