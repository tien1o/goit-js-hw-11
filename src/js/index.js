import '../css/styles.css';
import { searchImages } from '../js/image-libriary';
import Notiflix from 'notiflix';

const imageSearcher = {
  query: '',
  response: function () {
    return searchImages(this.query);
  },
};

const form = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

function renderImages(queriesArray) {
  const markup = queriesArray.map(item => {
    return `<div class="photo-card">
    <div class="thumb"><img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
    <div class="info">
    <ul class="gallery__item">
    <li class="gallery__link">
      <p class="info-item">
        <b>Likes </b><span>${item.likes}</span>
      </p>
      <p class="info-item">
        <b>Views </b><span>${item.views}</span>
      </p>
      <p class="info-item">
        <b>Comments </b><span>${item.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads </b><span>${item.downloads}</span>
      </p>
      </li>
      </ul>
    </div>
  </div>`;
  });
  gallery.insertAdjacentHTML('beforeend', markup.join(''));
}

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  imageSearcher.query = e.currentTarget.elements.searchQuery.value.trim();
  if (imageSearcher.query === '') {
    Notiflix.Notify.warning('Please enter your search query!');
    return;
  } else {
    imageSearcher
      .response()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length === 40) {
          renderImages(queriesArray);
          loadMoreBtn.classList.remove('is-hidden');
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
  imageSearcher.response().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.classList.remove('is-hidden');
      renderImages(queriesArray);
    }
  });
}

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
