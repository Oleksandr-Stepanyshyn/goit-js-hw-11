const axios = require('axios');
import imgCard from './partials/img-card.hbs'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgApiService from './js/img-service';
import LoadMoreBtn from './js/load-more-btn';
import './sass/main.scss';

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
}
const loadMoreBtn = new LoadMoreBtn ({
    selector: '.load-more',
    hidden: false,
})
const imgApiServise = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch (e) {
    e.preventDefault();

    imgApiServise.query = e.currentTarget.elements.searchQuery.value.trim();

    if (imgApiServise.query === '') {
        return Notify.warning('Enter a specific request')
    }
    imgApiServise.resetPage();
    clearGallery();
    loadMoreBtn.show();
    imgApiServise.fetchImg()
        .then(images => {
            if (images.length) {
                totalImagesFound(imgApiServise.imgQuantity);
            }
            renderGalleryMarkup(images);
        })
        .catch(console.log);
}

function onLoadMore () {
    loadMoreBtn.disable();
    imgApiServise.fetchImg()
        .then(images => {
            renderGalleryMarkup(images);
            loadMoreBtn.enable();
        })
        .catch(console.log);
}

function renderGalleryMarkup (images) {

    if (!images.length){
        clearGallery();
        loadMoreBtn.hide();
        onFetchError();
        return;
    }
    const markup = images.map(img => imgCard(img)).join("");
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    var lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });
}

function onFetchError () {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function clearGallery (){
    refs.gallery.innerHTML = '';
}

function totalImagesFound (quantity) {
    Notify.success(`Hooray! We found ${quantity} images.`);
}


