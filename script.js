function makeHttpRequest(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = () => {
            if (xhr.status >= 200) {
                resolve(xhr.responseText);
            } else {
                reject('Error');
            }
        }
        xhr.send();
    })
};

const url = 'https://ajax.test-danit.com/api/swapi/films';
const film = document.createElement('div');

fetch(url)
    .then((data) => {
        return data.json();
    })
    .then((res) => {
        const filmPromises = res.map(element => {
            const { characters, episodeId, name, openingCrawl } = element;

            const result = `
                episodeId: ${episodeId};
                name: ${name};
                characters: 
                openingCrawl: ${openingCrawl}
            `;
            film.innerText += result;
            film.classList.add('film');
            document.body.append(film);

            const characterPromises = characters.map(characterUrl => {
                return fetch(characterUrl)
                    .then((data) => data.json())
                    .then((response) => response.name);
            });

            return Promise.all(characterPromises)
                .then(charactersList => ({
                    episodeId,
                    name,
                    characters: charactersList,
                    openingCrawl,
                }));
        });

        return Promise.all(filmPromises);
    })
    
    .then((films) => {
        film.innerText = '';
        films.forEach(filmData => {
            const { episodeId, name, characters, openingCrawl } = filmData;
            const result = `
                episodeId: ${episodeId};
                name: ${name};
                characters: ${characters.join(', ')};
                openingCrawl: ${openingCrawl}
            `;
            film.innerText += result;
            document.body.append(film);
        });
    })
    .catch((error) => {
        console.error(error);
    });