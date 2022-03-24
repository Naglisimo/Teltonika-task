// grabbing Country ID

const countryID = window.location.search.split('?')[1];
let cityID;


// DECLARING STATES

let currentlyAt = 0;

// QUERY SELECTORS

const table = document.getElementById('table')
const addButton = document.getElementById('add1');
const cityModal = document.getElementById('addCityModal')
const closeModal2 = document.getElementById('closeModal2');
const submitButton2 = document.getElementById('submit2');
const searchInput = document.getElementById('searchInput');
const dateInput = document.getElementById('dataInput');
const messageModal = document.getElementById('cityMessageModal')
let upButton;
let downButton;


// MODAL FORM INPUTS 

let addModalInputs = {
    name: document.getElementById('pavadinimas'),
    area: document.getElementById('plotas'),
    population: document.getElementById('gyventojai'),
    postCode: document.getElementById('pastoKodas')
}


// FETCH FUNCTION

const getCountry =  (url, callback) => {
    fetch(url)
    .then(response => response.json())
    .then(data => fetchedCities = data.cities)
    .then((obj) => callback(obj))
}

// DISPLAY FUNCTIONS

const displayCountry = (citiesObject) => {
    let result = `  <tr class="inline-flex">
                    <th class='nameRow'>PAVADINIMAS <span><button id="up"><img src="../icons/up.svg"/></button><button id="down"><img src="../icons/down.svg"/></button></span></th>
                    <th>UŽIMAMAS PLOTAS</th>
                    <th>GYVENTOJŲ SKAIČIUS</th>
                    <th>PAŠTO KODAS</th>
                    <th>VEIKSMAI</th>
                    </tr>`;

                    console.log(citiesObject)

    let cities = citiesObject.filter(c => c.country_id == countryID);

    
    cities.forEach(city => {

        result += `<tr class="inline-flex">
                    <th>${city.name}</th>
                    <th>${city.area}</th>
                    <th>${city.population}</th>
                    <th>${city.postcode}</th>
                    <th><button class="deleteCity" value=${city.id}><img src="../icons/trash.svg" alt="Icon"/></button></th>
                    <th><button class="editCity" value=${city.id}><img src="../icons/pen.svg" alt="icon" /><button></th>
                   </tr>`
    })
    result += "";

    table.innerHTML = result;

    // DELETE BUTTON EVENT LISTENER

    deleteCountryButton = document.querySelectorAll('.deleteCity').forEach(button => {
        button.addEventListener('click', e => handleDeleteCity(e))
    });

    // EDIT BUTTON EVENT LISTENER

    editCountryButton = document.querySelectorAll('.editCity').forEach(button => {
        button.addEventListener('click', e => handleEditCountry(e))

    upButton = document.getElementById('up').addEventListener('click', () => handleAscend(cities))
    downButton = document.getElementById('down').addEventListener('click', () =>handleDescend(cities))

    dateInput.addEventListener('change', (e) => handleFilterByDate(e, cities))
    
        eventListeners()
})}

// EVENT HANDLING FUNCTIONS

const displayModal = (response) => {
    messageModal.style.display = 'block'
    let result = 
    `<div class="messageModalContent">
        <h3>${response}</h3>
    </div>`;
    messageModal.innerHTML = result;
    setTimeout(() => messageModal.style.display = 'none', 2000)
}

const handleFilterByDate = (e, cities) => {
    let filteredByDate;

    if (cities) {filteredByDate = cities.filter(city => city.created_at.split(" ")[0] == e.target.value)};

    displayCountry(filteredByDate)

}

const handleAscend = () => {
    getCountry('https://akademija.teltonika.lt/api4/index.php/cities?order=asc', () => displayCountry(fetchedCities))
}

const handleDescend = () => {
    getCountry(`https://akademija.teltonika.lt/api4/index.php/cities?order=desc`, () => displayCountry(fetchedCities))
}

const handleSearch = (e) => {
    const inputValue = e.target.value;
    getCountry(`https://akademija.teltonika.lt/api4/index.php/cities?text=${inputValue}`, () => displayCountry(fetchedCities))
}

const openAddModal = () => {
    currentlyAt = 1 
    cityModal.style.display = 'block'
}

const handleCloseModal = () => {
    currentlyAt = 1;
    addModalInputs.name.value = "";
    addModalInputs.area.value = "";
    addModalInputs.population.value = "";
    addModalInputs.postCode.value = "";

    getCountry(`https://akademija.teltonika.lt/api4/index.php/cities`, () => displayCountry(fetchedCities));
    cityModal.style.display = 'none';

}

const handleDeleteCity = (e) => {
    cityID = e.path[1].value;

    fetch(`https://akademija.teltonika.lt/api4/index.php/cities/${cityID}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {if (data) {
    getCountry(`https://akademija.teltonika.lt/api4/index.php/cities`, () => displayCountry(fetchedCities));
    }})
    }

const handleEditCountry = (event) => {
    currentlyAt = 2;
    cityID = event.path[1].value;
    
    cityModal.style.display = "block";
    fetch(`https://akademija.teltonika.lt/api4/index.php/cities/${countryID}`)
    .then(res => res.json())
    .then(data => {
        const filteredCity = data.filter((city) => {
            return city.id == cityID;
        })
        addModalInputs.name.value = filteredCity[0].name;
        addModalInputs.area.value = filteredCity[0].area;
        addModalInputs.population.value = filteredCity[0].population;
        addModalInputs.postCode.value = filteredCity[0].postcode;

    })
}

const submitAddForm = (e) => {
    e.preventDefault();
    if (currentlyAt === 1) {
        fetch('https://akademija.teltonika.lt/api4/index.php/cities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                area: addModalInputs.area.value,
                postcode: addModalInputs.postCode.value,
                created_at: new Date,
                name: addModalInputs.name.value,
                population: addModalInputs.population.value,
                country_id: countryID
            })
        })
            .then(res =>  res.json())
            .then(data => displayModal(data.message))
            .catch(err => console.log(err))

        } else if (currentlyAt === 2 ) {
        fetch(`https://akademija.teltonika.lt/api4/index.php/cities/${cityID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            area: addModalInputs.area.value,
            postcode: addModalInputs.postCode.value,
            name: addModalInputs.name.value,
            population: addModalInputs.population.value,
            country_id: countryID
            })
        })
        .then(res => res.json())
        .then(data => { if (data.message !== undefined) displayModal(data.message)})
        .catch(err => console.log(err))
    }

    handleCloseModal()
    getCountry(`https://akademija.teltonika.lt/api4/index.php/cities`, () => displayCountry(fetchedCities));
}

//  EVENT LISTENERS

const eventListeners = () => {

    addButton.addEventListener('click', () => openAddModal())
    closeModal2.addEventListener('click', () => handleCloseModal())
    submitButton2.addEventListener('click', (e) => submitAddForm(e))
    searchInput.addEventListener('change', (e) => handleSearch(e))
    dateInput.addEventListener('change', (e) => handleFilterByDate(e))
}

getCountry(`https://akademija.teltonika.lt/api4/index.php/cities`, () => displayCountry(fetchedCities));