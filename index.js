// DECLARING STATES 

let currentlyAt = 'display';
let countryID;
let fetchedCountries;
let countries;

// QUERY SELECTORS

const table = document.getElementById('table')
const addButton = document.getElementById('add')
const countryModal = document.getElementById('addCountryModal')
const cityModal = document.getElementById('addCityModal')
const closeModal1 = document.getElementById('closeModal1')
const submitButton1 = document.getElementById('submit1')
const searchInput = document.getElementById('searchInput')
const dateInput = document.getElementById('dataInput');
const messageModal = document.getElementById('countryMessageModal')

let upButton;
let downButton;
let deleteCountryButton;
let editCountryButton;


// MODAL FORM INPUTS 


let addModalInputs = {
    name: document.getElementById('pavadinimas'),
    area: document.getElementById('plotas'),
    population: document.getElementById('gyventojai'),
    phoneCode: document.getElementById('telkodas')
}

// FETCH FUNCTIONS


const getCountries =  (url, callback) => {
    fetch(url)
    .then(response => response.json())
    .then(data => fetchedCountries = data.countires)
    .then((obj) => callback(obj))
}

// DISPLAY FUNCTIONS


const displayCountries = (countriesObject) => {
    let result = `  <tr class="inline-flex">
                    <th class='nameRow'>PAVADINIMAS <span><button id="up"><img src="./icons/up.svg"/></button><button id="down"><img src="./icons/down.svg"/></button></span></th>
                    <th>UŽIMAMAS PLOTAS</th>
                    <th>GYVENTOJŲ SKAIČIUS</th>
                    <th>ŠALIES TEL. KODAS</th>
                    <th>VEIKSMAI</th>
                    </tr>`;


                
    
    countriesObject.forEach(country => {

        result += `<tr class="inline-flex">
                    <th><a href="./city/city.html?${country.id}">${country.name}</a></th>
                    <th>${country.area}</th>
                    <th>${country.population}</th>
                    <th>${country.calling_code}</th>
                    <th><button class="deleteCountry" key=${country.id} value=${country.id}><img src="icons/trash.svg" alt="Icon"/></button></th>
                    <th><button class="editCountry" key=${country.id} value=${country.id}><img src="icons/pen.svg" alt="icon" /><button></th>
                   </tr>`
    })
    result += "";

    table.innerHTML = result;


                    upButton = document.getElementById('up').addEventListener('click', () => handleAscend())
                    downButton = document.getElementById('down').addEventListener('click', () =>handleDescend())

    // DELETE BUTTON FUNCTION

    deleteCountryButton = document.querySelectorAll('.deleteCountry').forEach(button => {
        button.addEventListener('click', e => handleDeleteCountry(e))
    });

    editCountryButton = document.querySelectorAll('.editCountry').forEach(button => {
        button.addEventListener('click', e => handleEditCountry(e))


    dateInput.addEventListener('change', (e) => handleFilterByDate(e))



    eventListeners()
})}

// EVENT HANDLING FUNCTIONS


const handleFilterByDate = (e) => {
    getCountries(`https://akademija.teltonika.lt/api4/index.php/countries?date=${e.target.value}`, () => displayCountries(fetchedCountries))
}

const handleAscend = () => {

    getCountries('https://akademija.teltonika.lt/api4/index.php/countries?order=asc', () => displayCountries(fetchedCountries))
}

const handleDescend = () => {

    getCountries('https://akademija.teltonika.lt/api4/index.php/countries?order=desc', () => displayCountries(fetchedCountries))
}


const handleSearch = (e) => {
    const inputValue = e.target.value;
    getCountries(`https://akademija.teltonika.lt/api4/index.php/countries?text=${inputValue}`, () => displayCountries(fetchedCountries))    


}

const openAddModal = () => {
    countryModal.style.display = 'block'
}

const handleCloseModal = () => {
    currentlyAt = 'display';
    addModalInputs.name.value = "";
    addModalInputs.area.value = "";
    addModalInputs.population.value = "";
    addModalInputs.phoneCode.value = "";

    getCountries('https://akademija.teltonika.lt/api4/index.php/countries', () => displayCountries(fetchedCountries));
    countryModal.style.display = 'none'
}

const handleDeleteCountry = (e) => {
    countryID = e.path[1].value;
    fetch(`https://akademija.teltonika.lt/api4/index.php/countries/${countryID}`, {
        method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {if (data) {
        getCountries('https://akademija.teltonika.lt/api4/index.php/countries', () => displayCountries(fetchedCountries));
    }})
    }

const handleEditCountry = (event) => {
    currentlyAt = 'edit';
    countryID = event.path[1].value;
    
    countryModal.style.display = "block";
    fetch(`https://akademija.teltonika.lt/api4/index.php/countries/${countryID}`)
    .then(res => res.json())
    .then(data => {
        addModalInputs.name.value = data.name;
        addModalInputs.area.value = data.area;
        addModalInputs.population.value = data.population;
        addModalInputs.phoneCode.value = data.calling_code;

    })
}

const submitAddForm = (e) => {
    e.preventDefault();
    if (currentlyAt == 'display') {
        fetch('https://akademija.teltonika.lt/api4/index.php/countries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                area: addModalInputs.area.value,
                calling_code: addModalInputs.phoneCode.value,
                created_at: new Date,
                name: addModalInputs.name.value,
                population: addModalInputs.population.value
            })
        })
            .then(res => {return res.json()})
            .then(data => data = data.message)
            .catch(err => console.log(err))
            getCountries('https://akademija.teltonika.lt/api4/index.php/countries', () => displayCountries(fetchedCountries));
            handleCloseModal();
        } else if (currentlyAt == 'edit' ) {
        fetch(`https://akademija.teltonika.lt/api4/index.php/countries/${countryID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            area: addModalInputs.area.value,
            calling_code: addModalInputs.phoneCode.value,
            name: addModalInputs.name.value,
            population: addModalInputs.population.value
            })
        })
        .then(res => res.json())
        .then(data => data = data.message)
        .catch(err => console.log(err))
    }
    getCountries('https://akademija.teltonika.lt/api4/index.php/countries', () => displayCountries(fetchedCountries));
    handleCloseModal();
}

//  EVENT LISTENERS


const eventListeners = () => {

    addButton.addEventListener('click', () => openAddModal())
    closeModal1.addEventListener('click', () => handleCloseModal())
    submitButton1.addEventListener('click', (e) => submitAddForm(e))
    searchInput.addEventListener('change', (e) => handleSearch(e))
    dateInput.addEventListener('change', (e) => handleFilterByDate(e))

}


getCountries('https://akademija.teltonika.lt/api4/index.php/countries', () => displayCountries(fetchedCountries));
