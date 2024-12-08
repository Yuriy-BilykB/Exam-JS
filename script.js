// Using DOM to get some elements from Html like buttons and blocks
const input = document.querySelector('.input');
const list = document.querySelector('.list');
const addBtn = document.querySelector('.add-btn');
const deleteBtn = document.querySelector('.del-btn');
const namesSortBtn = document.querySelector('.name-sort');
const valuesSortBtn = document.querySelector('.value-sort');
// Method for creating list on the page with user`s 'name=values', using DOM to create every calling function createElements, build block with paragraph inside add input for adding in the future possibility
// delete these block with paragraphs.
function createElements(item) {
    const blockContent = document.createElement('div');
    const paragraph = document.createElement('p');
    const checkBox = document.createElement('input');
    blockContent.classList.add('block-content');
    checkBox.type = 'checkbox';
    checkBox.classList.add('check-box');
    paragraph.textContent = `${item.name}=${item.value}`;
    blockContent.append(paragraph, checkBox);
    list.append(blockContent);
}

//This button take value which we take from input and check this value by regexp on valid building and alpha-numeric characters.
addBtn.addEventListener('click', () => {
//Take off all spaces before name and value
    const inputText = input.value.trim();
//Checking if inputText variable has one '='
    if (inputText.includes("=") && inputText.split('=').length === 2) {
//Destruction variable 'inputText' on two vars name and value
        let [name, value] = inputText.split('=');
//Take off spaces
        name = name.trim();
        value = value.trim();
        name = name.replace(/\s+/g, ' ');
        value = value.replace(/\s+/g, ' ');
//check this value by regexp on valid alpha-numeric characters
        const validInputRegex = /^[\p{L}\d ]+$/u;
        if (validInputRegex.test(name) && validInputRegex.test(value)) {
            const obj = { name, value };
//Get existing elements from local storage and add a new one
            const existingItems = JSON.parse(localStorage.getItem('items')) || [];
            existingItems.push(obj);
            localStorage.setItem('items', JSON.stringify(existingItems));
            createElements(obj);
            input.value = '';
        }
//If there are other`s symbols apart of alphanumeric
        else {
            input.classList.add('invalid-input');
            alert("Name and value should only contain letters, numbers");
            setTimeout(() => {
                input.classList.remove('invalid-input');
            }, 2000);
            input.value = '';
            input.focus()
        }
    }
//If there are no sign '=' or it`s more than allowed
    else {
        input.classList.add('invalid-input');
        alert("Please enter a valid name=value format");
        setTimeout(() => {
            input.classList.remove('invalid-input');
        }, 2000);
        input.value = '';
        input.focus()
    }
});

//After reload page, user can get back his names=values from locale storage, which we add back into list after reloading Page automatically
window.addEventListener('load', () => {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.forEach(item => {
        createElements(item);
    })
})
//Function sorting all names or values by using method sort, we get all values with class 'block-content', create Node list, after this by using spread we create array from blocks with values and use method map to divide by method 'split' value of paragraph
//like result we will get array with objects name, value.
function sortArrayValues(par1) {
    const allValues = [...document.querySelectorAll('.block-content')].map(el => {
        const [name, value] = el.textContent.split('=');
        return {name, value};
    });
//Now we can sort our objects using method 'sort', it depends what user will choose by button sorting by value or by name, it will be like param in out function. If name or value it`s only numbers we will use Number to
// make type number and sorting by this
    allValues.sort((a, b) => {
        if (!isNaN(a[par1]) && !isNaN(b[par1])) {
            return Number(a[par1]) - Number(b[par1]);
        }
//If value or name isn`t type number we use sort with localeCompare to sort strings by the alphabet differents languages
        return a[par1].toLowerCase().localeCompare(b[par1].toLowerCase());
    });
//Delete blocks with content from list
    list.textContent = '';
//Rebuild locale Storage and list on the page according to the new sorting values or name
    allValues.forEach((item) => createElements(item));
    localStorage.setItem('items', JSON.stringify(allValues));
}

//Delete all choosen by input checkbox elements inside list
deleteBtn.addEventListener('click', () => {
    const arrElement = list.querySelectorAll('input.check-box:checked');
    arrElement.forEach(elChecked => {
        const blockContent = elChecked.closest('.block-content');
        blockContent.remove();
    })
//Rewrite 'items' in locale Storage by elements which remaining after user delete other elements from list on the page
    const remainingItems = [...list.querySelectorAll('.block-content p')].map(el => {
        const [name, value] = el.textContent.split('=');
        return {name, value};
    });
    localStorage.setItem('items', JSON.stringify(remainingItems));

})
//Sort elements by names
namesSortBtn.addEventListener('click', () => {
    sortArrayValues('name');
});
//Sort elements by values
valuesSortBtn.addEventListener('click', () => {
    sortArrayValues('value');
});


