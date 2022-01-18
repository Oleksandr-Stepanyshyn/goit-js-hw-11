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
        this.page = 1;
        this.quantity = 0;
        this.largestPage = 1;
        this.perPage = 40;
    }

    async fetchImg() {
        
    // ==================== librery axios =================================

        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`);
        const data = await response.data;
        this.imgQuantity = data.totalHits;
        this.largestPage = Math.ceil(data.totalHits / this.perPage)
        const images = data.hits;
        return images;

    // ================= write on async/await =============================

        // const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`);
        // const data = await response.json();
        // this.imgQuantity = data.totalHits;
        // this.largestPage = Math.ceil(data.totalHits / this.perPage)
        // const images = data.hits;
        // return images;

    // ================= write on then().catch() =============================

        // return fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`)
        //         .then(response => {
        //             if (!response.ok) {
        //                 throw new Error(response.status);
        //             }
        //             return response.json();})
        //         .then(response => {
        //             this.imgQuantity = response.totalHits;
        //             this.incrementPage();
        //             return response.hits;
        //         })
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
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