const API_KEY = '25219432-d17570f843575def2add98e41';
const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
})

function searchImages (searchQuery) {
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&${searchParams}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                })
}

export {searchImages};