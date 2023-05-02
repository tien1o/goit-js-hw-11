import '../css/styles.css';
import { searchImages } from '../js/image-libriary';
import Notiflix from 'notiflix';

const form = document.querySelector('form#search-form');
import { gallery } from '../js/gallery';
import { renderImages } from '../js/gallery';
const loadMoreBtn = document.querySelector('button.load-more');

let query = '';
let page = 1;

function resetSearch() {
  page = 1;
  loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
}

async function onSubmit(e) {
  e.preventDefault();
  page = 1;
  console.log(`OnSubmit page: ${page}`);
  resetSearch();
  query = e.currentTarget.elements.searchQuery.value.trim();
  if (query === '') {
    Notiflix.Notify.warning('Please enter your search query!');
    return;
  }
  try {
    const data = await searchImages(query, page);
    let hits = data.hits;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImages(hits);
      if (hits.length < 40 || page >= data.totalHits / 40) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.success(`Yaay! We found ${data.totalHits} images.`);
      } else {
        loadMoreBtn.classList.remove('is-hidden');
        Notiflix.Notify.success(`Yaay! We found ${data.totalHits} images.`);
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(
      "We're sorry, but there was an error processing your request."
    );
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    page++;
    const data = await searchImages(query, page);
    let hits = data.hits;
    renderImages(hits);
    console.log(`onLoadMore page: ${page}`);
    if (hits.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(
      "We're sorry, but there was an error processing your request."
    );
    console.log(error);
  }
}

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
export { page };
