//// global variables which will be used all over the project;
let listPage = document.getElementById('list-page');
let createPage = document.getElementById('create-page')
let table = document.getElementsByTagName('table')[0];

let createNew = document.getElementsByClassName('create-new')[0];
let touristPlaceList = document.getElementsByClassName('tourist-place-list')[0];
let resetButton = document.getElementById('reset');
let submitButton = document.getElementById('submit');
let searchBox = document.getElementsByClassName('search')[0];
let nameCol = document.getElementById('name-col');
let ratingCol = document.getElementById('rating-col');

let updateOrNew = null;
let allTouristPlaceNames = [];
let allTouristPlaceRows = [];
let totalEntriesCount = 2;

let sortedBy = null;
let orderedBy = null;

//// end of global variables


//// global initialization

resetButton.addEventListener('click', resetForm);
submitButton.addEventListener('click', submitForm);
createNew.addEventListener('click', showCreatePage);
touristPlaceList.addEventListener('click', showListPage);
searchBox.addEventListener('input', searchFunctionality);
searchBox.addEventListener('focusout', deleteSearchedPlaces);
nameCol.addEventListener('click', sortByName);
ratingCol.addEventListener('click', sortByRating);

//// end of global initialization

//// initial pre-processing
function preProcess(){
    let tableRows = document.querySelectorAll('table tr');
    for(let i = 1; i<=2; i++){
        allTouristPlaceRows.push(tableRows[i]);
        allTouristPlaceNames.push(tableRows[i].children[1].innerHTML);
        tableRows[i].children[5].lastElementChild.addEventListener('click', deleteRow);
        tableRows[i].children[5].firstElementChild.addEventListener('click', updateRow);
    }
}
preProcess();

function removeErrorMessages(){
    let errorMessages = document.querySelectorAll('.error-message');
    for(let errorMessage of errorMessages){
        errorMessage.remove();
    }
}

function submitForm(event){
    //delete the error-message paragraphElements first
    removeErrorMessages();
    //here data validation will be done first
    let touristPlace = dataValidation();
    //then adding the data to the list-page
    if(touristPlace != false){
        //check if it already exits or not
        if(isAlreadyExits(touristPlace)){
            alert("Sorry! This place already exits!");
        }else{
            let successMessage = addToTouristPlaceList(touristPlace);
            showListPage();
            resetForm();
        }
    }
}

function dataValidation(){
    //data will be validated here
    let error = false;
    let touristPlace = [];
    let allInputFields = document.querySelectorAll('form input');
    let id = allInputFields[0].value;
    touristPlace.push(id.trim());
    let name = allInputFields[1].value;
    if(name == ''){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Please enter the Tourist Place Name';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[1].parentNode.append(paragraphElement);
        error = true;
    }
    touristPlace.push(name.trim());
    let address = allInputFields[2].value;
    if(address == ''){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Please enter the Tourist Place Address';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[2].parentNode.append(paragraphElement);
        error = true;
    }
    touristPlace.push(address.trim());
    let rating = allInputFields[3].value;
    if(rating == ''){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Please enter the Tourist Place rating';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[3].parentNode.append(paragraphElement);
        error = true;
    }
    else if(rating < 1 || rating > 5){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Entered rating is not within the range';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[3].parentNode.append(paragraphElement);
        error = true;
    }
    touristPlace.push(rating.trim());
    let type = allInputFields[4].value;
    if(type == '' && id == '-1'){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Please enter the Tourist Place type';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[4].parentNode.append(paragraphElement);
        error = true;
    }
    touristPlace.push(type.trim());
    let image = allInputFields[5].value;
    if(image == '' && id == '-1'){
        let paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = 'Please enter the Tourist Place Image';
        paragraphElement.setAttribute('class', 'error-message');
        allInputFields[5].parentNode.append(paragraphElement);
        error = true;
    }
    touristPlace.push(image.trim());
    if(error == true) return false;
    return touristPlace;
}

function isAlreadyExits(touristPlace){
    //return a boolean based on the result;
    let touristPlaceName = touristPlace[1].trim().toLowerCase();
    let touristPlaceId = touristPlace[0];
    let tableRows = document.querySelectorAll('table tr');
    for(let i = 1; i<tableRows.length; i++){
        let id = tableRows[i].children[0].innerHTML.trim();
        let name = tableRows[i].children[1].innerHTML.trim().toLowerCase();
        if(name == touristPlaceName && id != touristPlaceId){
            return true;
        }
    }
    return false;
}

function addToTouristPlaceList(touristPlace){
    // add the touristPlace to the Tourist Place List
    // return a string according to update or new addition to the list
    if(touristPlace[0] == '-1'){
        touristPlace[5] = touristPlace[5].split('\\')[2];
        let tr = createNewOne(touristPlace);
        table.append(tr);
        allTouristPlaceNames.push(touristPlace[1]);
        allTouristPlaceRows.push(tr);
        return "Your Tourist Place has been added!";
    }else{
        updateExistingOne(touristPlace);
        return "Your Tourist Place has been updated!";
    }
}

function createNewOne(touristPlace){
    let place = touristPlace;
    let tr = document.createElement('tr');

    let td = document.createElement('td');
    td.setAttribute("class", "hidden");
    td.innerHTML = ++totalEntriesCount;
    tr.append(td);

    for(let i = 1; i <= 3; i++){
        td = document.createElement('td');
        td.innerHTML = place[i];
        tr.append(td);
    }

    td = document.createElement('td');
    let img = document.createElement('img');
    img.setAttribute('src', place[5]);
    td.append(img);
    tr.append(td);

    td = document.createElement('td');
    td.setAttribute('class', 'cell-btn');
    let updateButton = document.createElement('button');
    updateButton.setAttribute('class', 'blue update');
    updateButton.innerHTML = "Update";
    updateButton.addEventListener('click', updateRow);
    td.append(updateButton);
    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'red delete');
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener('click', deleteRow);
    td.append(deleteButton)
    tr.append(td);

    return tr;
}

function updateExistingOne(touristPlace){
    //delete the exiting one 
    let id = touristPlace[0];
    
    for(let row of allTouristPlaceRows){
        if(id == row.children[0].innerHTML){
            let oldName = row.children[1].innerHTML;
            allTouristPlaceNames = allTouristPlaceNames.filter((name) => name != oldName)
            if(touristPlace[5] == ''){
                touristPlace[5] = row.children[4].innerHTML.split('\"')[1];
            }else{
                touristPlace[5] = touristPlace[5].split("\\")[2];
            }
        }
    }

    allTouristPlaceRows = allTouristPlaceRows.filter((row) => id != row.children[0].innerHTML);

    let tableRows = document.querySelectorAll('table tr');
    for(let i = 1; i<tableRows.length; i++){
        if(tableRows[i].children[0].innerHTML == id){
            tableRows[i].remove();
        }
    }
    
    //creating new one
    let tr = createNewOne(touristPlace);
    document.querySelector('table').children[0].append(tr);
    allTouristPlaceNames.push(touristPlace[1]);
    allTouristPlaceRows.push(tr);

}

function updateRow(event){
    //collect the row values
    let currentRow = event.target.parentElement.parentElement;
    let placeValues = [];
    for(let i = 0; i<4; i++){
        let val = currentRow.children[i].innerHTML;
        placeValues.push(val);
    }
    let image = currentRow.children[4].innerHTML;
    image = image.split('\"')[1];
    placeValues.push(image);
    //fill the values in the form;
    let allInputFields = document.querySelectorAll('form input');
    for(let i = 0; i<=3; i++){
        allInputFields[i].value = placeValues[i];
    }
    showCreatePage();
}

function deleteRow(event){
    if(confirm("Are you sure to delete this row?") == true)
    {
        let rowPlaceName = event.target.parentElement.parentElement.children[1].innerHTML;
        allTouristPlaceNames = allTouristPlaceNames.filter(placeName => placeName != rowPlaceName);
        
        let rowPlaceId = event.target.parentElement.parentElement.children[0].innerHTML;
        allTouristPlaceRows = allTouristPlaceRows.filter(placeRow => rowPlaceId != placeRow.children[0].innerHTML);
        
        event.target.parentElement.parentElement.remove();
    }
}

function showCreatePage(event){
    removeErrorMessages();
    createPage.removeAttribute('class', 'hidden');
    listPage.setAttribute('class', 'hidden');
}

function showListPage(event){
    listPage.removeAttribute('class', 'hidden');
    createPage.setAttribute('class', 'hidden');
}

function resetForm(){
    let allInputField = document.querySelectorAll("form input");
    for(let i=0; i<6; i++){
        allInputField[i].value = '';
    }
    allInputField[0].value = -1;
    removeErrorMessages();
}


function searchFunctionality(event){
    let searchText = event.target.value;
    let foundTouristPlaces = []
    if(searchText.trim().length > 0){
        for(let touristPlaceName of allTouristPlaceNames){
            if(touristPlaceName.toLowerCase().includes(searchText.toLowerCase())){
                foundTouristPlaces.push(touristPlaceName)
            }
        }
    }
    displaySearchedPlaces(foundTouristPlaces)
}

function deleteSearchedPlaces(event){
    let deleteFirst = document.getElementsByClassName('search-result')
    if(deleteFirst.length > 0){
        for(let one of deleteFirst){
            one.remove();
        }
    }
}

function displaySearchedPlaces(foundTouristPlaces){
    let deleteFirst = document.getElementsByClassName('search-result')
    if(deleteFirst.length > 0){
        for(let one of deleteFirst){
            one.remove();
        }
    }
    let container = document.createElement('div')
    container.setAttribute('class', 'search-result')
    for(let foundTouristPlace of foundTouristPlaces){
        let singlePlace = document.createElement('p', foundTouristPlace)
        let textNode = document.createTextNode(foundTouristPlace)
        singlePlace.appendChild(textNode)
        container.appendChild(singlePlace)
    }
    let bodyContainer = document.getElementsByClassName('container')[0];
    bodyContainer.insertBefore(container, bodyContainer.children[1]);
}

function insertAllRows(){
    table = document.getElementsByTagName('table')[0];
    for(let row of allTouristPlaceRows){
        table.children[0].appendChild(row);
    }
}

function deleteAllRows(){
    table = document.getElementsByTagName('table')[0];
    while(table.children[0].children.length > 1){
        table.children[0].children[1].remove();
    }
}

function sortRows(by){//by will be either 1 or 3; 1=name and 3=rating
    allTouristPlaceRows.sort((row1, row2) => {
        let val1 = row1.children[by].innerHTML.toLowerCase();
        let val2 = row2.children[by].innerHTML.toLowerCase();
        if( val1 < val2){
            return -1;
        }else if(val1 > val2){
            return 1;
        }
        return 0;
    })
}

function reverseRows(){
    allTouristPlaceRows.reverse();
}

function sortByName(event){
    if(sortedBy != 'name'){
        sortRows(1);
        sortedBy = 'name';
    }else{
        reverseRows();
    }
    deleteAllRows();
    insertAllRows();
}

function sortByRating(event){
    if(sortedBy != 'rating'){
        sortRows(3);
        sortedBy = 'rating';
    }else{
        reverseRows();
    }
    deleteAllRows();
    insertAllRows();
}