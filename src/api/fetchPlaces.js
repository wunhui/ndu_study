import axios from 'axios';

// 2024.10.15 검색 시 맵 api 명 변경
export const fetchSearch = async ({term}) => {
  try {
      const params = {
        query: term, // term은 항상 사용
      };
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}`,
          },
          params
        }
      );
      return response.data.documents;
  } catch(error) {
    console.error("Failed to fetch search:", error.response?.data?.message || error.message);
    return null;
  }
};

// 2024.10.15 좌표 클릭 시 맵 api 추가
export const fetchKeyword = async ({term, x, y}) => {
  try {
    const params = {
      query: term, // term은 항상 사용
    };

    if (x !== undefined && y !== undefined) {
      params.x = x;
      params.y = y;
    }

    const response = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?x=${x}&y=${y}&radius=10&sort=distance`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}`,
        },
        params
      }
    );
    return response.data.documents;
  } catch (error) {
    console.error("Failed to fetch keyword:", error.response?.data?.message || error.message);
    return null;
  }
};


export const fetchCoordinate = async ({ x, y }) => {
  try {
    if (!x || !y) {
      console.log("Invalid coordinates:", { x, y });
      return; 
    }
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
  } catch (error) {
    console.error("Failed to fetch coordinates:", error.response?.data?.message || error.message);
    return null;
  }
};
