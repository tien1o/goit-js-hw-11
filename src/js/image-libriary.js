import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

async function searchImages(query) {
  const params = {
    key: '35867918-4e3839490958f79a97499fa36',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
}
