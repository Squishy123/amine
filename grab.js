let url = "https://76.64.123.119:3000/api"
//let url = "http://localhost:3000/api"


async function searchAnimes(title) {
    let animes = await fetch(`${url}/search/animes?title=${title}`).then((response) => {
        return response.json();
    })
    return animes;
}

async function getEpisode(id) {
    let episode = await fetch(`${url}/search/episodes?objectid=${id}`).then((response) => {
        return response.json();
    })
    return episode;
}

async function render() {
    let list = $("#list");
    list.empty();
    let animes = await fetch(`${url}/search/animes`).then((response) => {
        return response.json();
    })
    for (let i = 0; i < animes.length; i += 3) {
        let row = $('<div class="row"></div>');
        list.append(row);

        let temp = animes.slice(i, i + 3);
        for (let j = 0; j < temp.length; j++) {
            let promises = [];
            temp[j].episodes.forEach(e => {
                promises.push((async () => {
                    return await getEpisode(e)
                })())
            });
            let episodes = await Promise.all(promises);
            episodes.sort((a, b) => {
                return a[0].id - b[0].id;
            });
            let col = $(`<div class="col-md-4 justify-content-center"></div`)
            row.append(col);
            col.append($(`<p>${temp[j].title}</p>`))
            col.append($(`<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#${temp[j]._id}" aria-expanded="false" aria-controls=${temp[j]._id}>Episodes</button>`))

            let anime = $(`<div class="collapse" id="${temp[j]._id}"><ul class="list-group"></ul></div>`)
            col.append(anime);
            episodes.forEach((ep, num) => {
                let episode = $(`<li class="list-group-item">Episode ${num + 1}</li>`)
                anime.append(episode);

                let so = $(`<ul class="list-group"></ul>`)
                episode.append(so);
                ep[0].sources.forEach((src) => {
                    so.append($(`<a class="list-group-item list-group-item-action" href="${src.player}">player</a>`))
                    so.append($(`<a class="list-group-item list-group-item-action" href="${src.url}">file</a>`))
                });
            });
        }
    }
}

async function scrape() {
    let siteurl = document.querySelector('#scrapeURL').value;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", `${url}/request?siteurl=${siteurl}`, true);
    //xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
            $('#alerts').append($(`<div class="alert alert-success alert-dismissible fade show" role="alert">
            Scrape Request Sent!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          `))
    }
    xhr.send(null);
}
/*
(async() => {
    let ep = await getEpisode("5ae0fb3bf53d792244d2fc35")
    console.log(ep);
})()*/