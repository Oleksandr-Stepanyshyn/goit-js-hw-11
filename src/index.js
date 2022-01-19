import imgItemTpl from './partials/templates/imgItem.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImgApiService from './js/imgApiService';
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
const lightbox = new SimpleLightbox('.photo-card a', { captionsData: 'alt', captionDelay: 250 });

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', getDataAndRender);

function onSearch(e) {
    e.preventDefault();

    imgApiServise. query = e.currentTarget.elements.searchQuery.value.trim();
    if (!imgApiServise.query) {
        return Notify.warning('Enter a specific request')
    };
    clearGallery();
    imgApiServise.resetPage();
    getDataAndRender();
    e.target.reset();
}

async function getDataAndRender() {
    try {
        const images = await imgApiServise.fetchImg();
        const markup = imgItemTpl(images);
    
        if (!images.length){
            loadMoreBtn.hide();
            clearGallery();
            onFetchError();
            return;
        };
        
        loadMoreBtn.hide();
        renderMarkup(markup);
        scrollDown();

        if(imgApiServise.currentPage === 1) {
            Notify.success(`Hooray! We found ${imgApiServise.imgQuantity} images.`);
        };
        if(imgApiServise.currentPage === imgApiServise.largestPage && imgApiServise.imgQuantity > imgApiServise.perPage) {
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
        if (imgApiServise.currentPage < imgApiServise.largestPage) {
            loadMoreBtn.show();
        };

    } catch (error) {
        console.dir(error);
    }
}

function renderMarkup (markup) {
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    refs.gallery.style.padding = '20px 0';
}

function onFetchError () {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function clearGallery (){
    refs.gallery.innerHTML = '';
    refs.gallery.style.padding = '0';
}

function scrollDown() {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 11,
    behavior: 'smooth',
    });
}

