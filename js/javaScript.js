const ApiKey = '741ea18e5d56cc15683474164e6169e6';
let baseURL = 'https://api.themoviedb.org/3/';
let baseImgURL = 'http://image.tmdb.org/t/p/w500'
let elementUlF = document.getElementById('filmUl');
let elementUlS = document.getElementById('serialsUl');
let elementDiv = document.getElementById('divId');
let elementUlSearch = document.getElementById('searchUl');
let dataResultArr;
let titleOfItem;
let poster;
let description;
let originIdOfElement;
let typeMorT;

// створення лі трендових фільмів
fetch(baseURL + 'trending/movie/day?api_key=' + ApiKey)
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        dataResultArr = data.results;
        dataResultArr.forEach(function (item, index) {
            let createListItem = document.createElement('li');
            createListItem.innerHTML = `${item.original_title}`;
            elementUlF.appendChild(createListItem);
            createListItem.setAttribute('id', 'f' + index);
            createListItem.setAttribute('alt', `${item.original_title}`)
        });
    })
    .catch(error => {
            console.log('movieLi fetch error ' + error.message)
        }
    );
// створення лі трендових серіалів
fetch(baseURL + 'trending/tv/day?api_key=' + ApiKey)
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        dataResultArr = data.results;
        dataResultArr.forEach(function (item, index) {
            let createListItem = document.createElement('li');
            createListItem.innerHTML = `${item.name}`;
            elementUlS.appendChild(createListItem);
            createListItem.setAttribute('id', 's' + index);
            createListItem.setAttribute('alt', `${item.name}`)
        });
    })
    .catch(error => {
            console.log('tvLi fetch error ' + error.message)
        }
    );

// створення div елементу в li по якому було проведено клік, та заповнення його контентом
elementUlF.addEventListener('click', function (element) {
    let ListItemId = element.target.id.substr(1);
    let idElementByTarget = element.target.id;
    elementUlSearch.innerHTML = '';
    fetch(baseURL + 'trending/movie/day?api_key=' + ApiKey)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            typeMorT = 'movie';
            originIdOfElement = data.results[ListItemId].id;
            titleOfItem = data.results[ListItemId].original_title;
            createDivOnClick(data, ListItemId, idElementByTarget, titleOfItem, originIdOfElement, typeMorT);
        })
        .catch(error => {
                console.log('ListenerFilm error ' + error.message)
            }
        );
})

elementUlS.addEventListener('click', function (element) {
    let ListItemId = element.target.id.substr(1);
    let idElementByTarget = element.target.id;
    elementUlSearch.innerHTML = '';
    fetch(baseURL + 'trending/tv/day?api_key=' + ApiKey)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            originIdOfElement = data.results[ListItemId].id;
            titleOfItem = data.results[ListItemId].original_name;
            typeMorT = 'tv';
            createDivOnClick(data, ListItemId, idElementByTarget, titleOfItem, originIdOfElement, typeMorT);
        })
        .catch(error => {
                console.log('ListenerTv error ' + error.message)
            }
        );
})

elementUlSearch.addEventListener('click', function (element) {
    let ListItemId = element.target.id.substr(3);
    let thisValue = document.getElementById('search').value;
    let idElementByTarget = element.target.id;
    fetch('https://api.themoviedb.org/3/search/movie?api_key=' + ApiKey + '&language=en-US&query='
        + thisValue + '&page=1&include_adult=false')
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            typeMorT = 'movie';
            originIdOfElement = data.results[ListItemId].id;
            titleOfItem = data.results[ListItemId].original_title;
            createDivOnClick(data, ListItemId, idElementByTarget, titleOfItem, originIdOfElement, typeMorT);
        })
        .catch(error => {
            console.log('ListenerSearch error ' + error.message)
        });
})

// функції
// функція яка запускається по сабміту форми пошуку, виводить Li з назвами фільмів по збігу
let runSearch = function () {
    elementUlSearch.innerHTML = '';
    let thisValue = document.getElementById('search').value;
    fetch('https://api.themoviedb.org/3/search/movie?api_key=' + ApiKey + '&language=en-US&query='
        + thisValue + '&page=1&include_adult=false')
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            dataResultArr = data.results;
            dataResultArr.forEach(function (item, index) {
                let createListItem = document.createElement('li');
                createListItem.innerHTML = `${item.original_title}`;
                elementUlSearch.appendChild(createListItem);
                createListItem.setAttribute('id', 'Ser' + index);
                createListItem.setAttribute('alt', `${item.original_title}`)
            });
        })
        .catch(error => {
            console.log('searchError: ' + error.message)
        });
}
// функція видалення діву
let dellDiv = function (elementDiv, elementListItemById) {
    if (elementDiv) {
        elementDiv.remove();
        elementListItemById.removeChild(document.getElementById('divId'));
    }
}
// функція створення діву по кліку
let createDivOnClick = function (data, ListItemId, element, titleOfItem, originIdOfElement, typeMorT) {

    description = data.results[ListItemId].overview;
    poster = data.results[ListItemId].poster_path;

    let elementListItemById = document.getElementById(element);
    elementDiv = document.getElementById('divId');
    let divElem = document.createElement('div');
    let h1Elem = document.createElement('h1');
    let pElem = document.createElement('p');
    let imgElementCreate = document.createElement('img');


    h1Elem.innerHTML = titleOfItem;
    pElem.innerHTML = description;

    if (poster === null) {
        divElem.appendChild(imgElementCreate);
        imgElementCreate.setAttribute('id', 'imgElement');
        imgElementCreate.setAttribute('src', 'img/noPosterFound.jpg');

    } else {
        divElem.appendChild(imgElementCreate);
        imgElementCreate.setAttribute('id', 'imgElement');
        imgElementCreate.setAttribute('src', baseImgURL + poster);
    }

    elementListItemById.appendChild(divElem);
    divElem.setAttribute('id', 'divId');
    divElem.appendChild(h1Elem);
    h1Elem.setAttribute('id', 'h1Elem');
    divElem.appendChild(pElem);
    pElem.setAttribute('id', 'pElem');

    if (typeMorT === 'movie') {
        getRecommendationMovie(originIdOfElement, divElem);
    } else {
        getRecommendationTv(originIdOfElement, divElem);
    }


    // переведення фокусу на li по якому клікнули, загорнутий в setTimeout для коректної роботи
    setTimeout(() => {
        document.getElementById(element).scrollIntoView({block: "start", inline: "nearest"});
    }, 25);

    // перевірка чи не створений вже контейнер, якщо так, то він видаляється
    dellDiv(elementDiv, elementListItemById);
}


// функція створення рекомендацій
let getRecommendationMovie = function (originIdOfElement, divElem) {
    fetch(baseURL + 'movie/' + originIdOfElement + '/recommendations?api_key=' + ApiKey)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            dataResultArr = data.results;
            let h1OfRec = document.createElement('h3');
            h1OfRec.setAttribute('id', 'h1OfRec');
            h1OfRec.innerHTML = 'Recommendations: '
            divElem.appendChild(h1OfRec);
            dataResultArr.forEach(function (item,index) {
                if (index < 3) {
                    let createItem = document.createElement('p');
                    createItem.setAttribute('class', 'rec');
                    createItem.setAttribute('alt', item.title)
                    createItem.innerHTML = item.title;
                    divElem.appendChild(createItem);
                }
            })

        })
                .catch(error => {
                        console.log('recommendationsLi fetch error ' + error.message)
                    }
                );
        }

let getRecommendationTv = function (originIdOfElement, divElem) {
    fetch(baseURL + 'tv/' + originIdOfElement + '/recommendations?api_key=' + ApiKey)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            dataResultArr = data.results;
            let h1OfRec = document.createElement('h3');
            h1OfRec.setAttribute('id', 'h1OfRec');
            h1OfRec.innerHTML = 'Recommendations: '
            divElem.appendChild(h1OfRec);
            dataResultArr.forEach(function (item,index) {
                if (index < 3) {
                    let createItem = document.createElement('p');
                    createItem.setAttribute('class', 'rec');
                    createItem.setAttribute('alt', item.name)
                    createItem.innerHTML = item.name;
                    divElem.appendChild(createItem);
                } 
            })

        })
        .catch(error => {
                console.log('recommendationsLi fetch error ' + error.message)
            }
        );
}




