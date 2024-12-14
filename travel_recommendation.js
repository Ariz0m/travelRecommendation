class Page {
    constructor() {
        this.searchBar = document.getElementById('searchBar');
        this.contactForm =  {
            name: document.getElementById('nameForm'),
            email: document.getElementById('emailForm'),
            message: document.getElementById('messageForm')
        };
    };

    /**
     * Clear the fields on the contact form
     */
    clearContactForm() {
        Object.values(this.contactForm).forEach((element) => element.value = 0);
    }
};

class RecommendedPlace {
    constructor(data) {
        this.image = ['img', data.imageUrl];
        this.name = ['h4', data.name];
        this.description = ['p', data.description];
    }
}

/**
 * @returns Return recommendation(s) primary(ies) search
 */
async function getRecommendation() {
    const page = new Page();
    const search = page.searchBar.value.toLowerCase();
    const data = await (await fetch('travel_recommendation_api.json')).json();
    switch (search) {
        case "country":
            const countries = data.countries;
            return countries[0].cities.concat(countries[1].cities, countries[2].cities);
        
        case 'beach':
            return data.beaches;

        case 'temple':
            return data.temples;
    
        default:
            return 'Coincidence not found or there was an error';
    };
}

function createChildRecommendation(params) {
    const recommendedPlace = new RecommendedPlace(params);
    const recommendedPlaceInfo = Object.values(recommendedPlace);
    const elementParent = document.createElement('div');
    elementParent.className = 'recommendation';
    for (let i = 0; i < recommendedPlaceInfo.length; i++) {
        const childElement = document.createElement(recommendedPlaceInfo[i][0]);
        recommendedPlaceInfo[i][0] == 'img' ? childElement.src = recommendedPlaceInfo[i][1] : childElement.innerHTML = recommendedPlaceInfo[i][1];
        elementParent.appendChild(childElement);
    };
    return elementParent;
}

function createRecomendations(places) {
    let elementParent = document.createElement('div');
    elementParent.className = "recommendations";
    const childElements = places.map((place) => createChildRecommendation(place));
    childElements.forEach((childElement) => elementParent.appendChild(childElement));
    document.getElementsByTagName('search')[0].appendChild(elementParent);
}

async function searchRecommendation() {
    clearSearchResults();
    const previousRecommendation = document.querySelector('.recommendations');
    if (previousRecommendation) previousRecommendation.remove();
    const recommendation = await getRecommendation();
    if (typeof(recommendation) === 'string') return alert(recommendation);
    createRecomendations(recommendation);
}

function clearSearchResults() {
    const previousRecommendation = document.querySelector('.recommendations');
    if (previousRecommendation) {
        previousRecommendation.remove();
     new Page().searchBar.value = '';
    } 
    else {console.log('There are no recommendations to remove.');}
}