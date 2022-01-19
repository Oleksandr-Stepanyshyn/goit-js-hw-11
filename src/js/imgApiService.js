import axios from "axios";

const API_KEY = '25219432-d17570f843575def2add98e41';
const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: 40, 
})

export default class ImgApiService {
    constructor() {
        this.searchQuery = '';
        this.currentPage = 0;
        this.nextPage = 1;
        this.quantity = 0;
        this.largestPage = 1;
        this.perPage = 40;
    }

    async fetchImg() {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.nextPage}`);
        const data = await response.data;
        this.imgQuantity = data.totalHits;
        this.largestPage = Math.ceil(data.totalHits / this.perPage)
        this.incrementPage();
        this.currentPage = this.nextPage - 1;
        const images = data.hits;
        return images;
    }

    incrementPage() {
        this.nextPage += 1;
    }

    resetPage() {
        this.nextPage = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    get imgQuantity() {
        return this.quantity;
    }

    set imgQuantity(newQuantity) {
        this.quantity = newQuantity;
    }
}