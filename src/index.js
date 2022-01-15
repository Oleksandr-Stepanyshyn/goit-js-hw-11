// const axios = require('axios');
// import axios from 'axios';
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
var lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });

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
    imgApiServise.fetchImg()
        .then(images => {
            renderGalleryMarkup(images);
            loadMoreBtn.show();

            if (imgApiServise.page > Math.ceil(imgApiServise.imgQuantity / 40)) {
                loadMoreBtn.hide();
            }

            if (images.length) {
                totalImagesFound(imgApiServise.imgQuantity);
            }
        })
        .catch(console.log);

        console.log(imgApiServise.imgQuantity);
        // if (images.length) {
        //     totalImagesFound(imgApiServise.imgQuantity);
        // }
}

function onLoadMore () {
    loadMoreBtn.hide();
    imgApiServise.fetchImg()
        .then(images => {
            renderGalleryMarkup(images);
            loadMoreBtn.show();

            if (imgApiServise.page > Math.ceil(imgApiServise.imgQuantity / 40)) {
                loadMoreBtn.hide();
                Notify.info("We're sorry, but you've reached the end of search results.");
            }
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
    lightbox.refresh();
    refs.gallery.style.padding = '30px 0';
}

function onFetchError () {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function clearGallery (){
    refs.gallery.innerHTML = '';
    refs.gallery.style.padding = '0';
}

function totalImagesFound (quantity) {
    Notify.success(`Hooray! We found ${quantity} images.`);
}

