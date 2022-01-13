const axios = require('axios');
import imgCard from './partials/img-card.hbs'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {searchImages} from './js/img-service';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';

// Notify.success('Sol lucet omnibus');
// Notify.failure('Qui timide rogat docet negare');
var lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
// console.log(refs.searchForm);
// console.log(refs.gallery);
console.log(refs.loadMoreBtn);

refs.searchForm.addEventListener('submit', onSearch);

function onSearch (e) {
    e.preventDefault();

    const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    searchImages(searchQuery)
        .then(renderGalleryMarkup)
        .catch(console.log);
}

function createGallery (images) {
    console.log(images.hits);
    const arr = images.hits
    const markup = arr.map()
}

function renderGalleryMarkup (images) {
    // console.log(images);
    const arrImages= images.hits;
    if (!arrImages.length){
        onFetchError();
    }
    const markup = arrImages.map(img => imgCard(img)).join("");
    refs.gallery.innerHTML = markup;
    var lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });
}

function onFetchError () {
    // clearGallery();
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function clearGallery (){
    refs.gallery.innerHTML = '';
}


