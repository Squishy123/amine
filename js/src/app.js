class AnimeListChild extends Actor {
    /**
     * Creates a new animelist child from metadata from Jikan API
     */
    constructor(meta) {
        super(document.createElement('div'))
        this.element.classList = `card bg-dark text-white`
        this.element.innerHTML = `<img class="card-img" src="${meta.image_url}" alt="Poster">
        <div class="card-img-overlay">
          <h5 class="card-title">${meta.title}</h5>
        </div>`
        this.styleElement({
            width: '18rem'
        })
    }
  
}

let main = new Stage(document.querySelector('#list'))
main.start(120, 120);
(async() => {
    let meta = await fetch('https://api.jikan.moe/anime/30276/')
    .then((res) => {
        return res.json()
    })

    let opm = new AnimeListChild(meta);
    main.addActor(opm)
})()

