import '../css/styles.css';
import { PixabayAPI } from '../js/image-libriary';
import Notiflix from 'notiflix';
import SimpleLightbox, { __esModule } from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayAPI = new PixabayAPI();
const form = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

function renderImages(queriesArray) {
  const markup = queriesArray
    .map(item => {
      return `<div class="photo-card">
    <div class="thumb"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b><span>${item.likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b><span>${item.views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b><span>${item.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b><span>${item.downloads}</span>
      </p>
    </div>
  </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  pixabayAPI.query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayAPI.resetPage();
  if (pixabayAPI.query === '') {
    Notiflix.Notify.warning('Please enter your search query!');
    return;
  } else {
    pixabayAPI
      .getImage()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length < 40) {
          renderImages(queriesArray);
          loadMoreBtn.classList.add('is-hidden');
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        } else {
          renderImages(queriesArray);
          Notiflix.Notify.success(`Yaay! We found ${data.totalHits} images.`);
          loadMoreBtn.classList.remove('is-hidden');
        }
      })

      .catch(error => {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        console.log(error);
      });
  }
}

function onLoadMore() {
  pixabayAPI.getImage().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
