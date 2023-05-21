function photographerFactory(data) {

    function getUserCardDOM() {
        const {name, portrait} = data;

        const picture = `assets/photographers/${portrait}`;
        const article = document.createElement("article");

        //@todo revoir accessibilite element <a>
        const imgLink = document.createElement("a")
        imgLink.setAttribute("href", `/photographer.html?id=${data.id}`)
        imgLink.setAttribute("aria-label", `Visiter le profil de ${data.name}`)

        const img = document.createElement("img");
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)

        imgLink.appendChild(img)

        const h2 = document.createElement("h2");
        const textLink = document.createElement("a")
        textLink.setAttribute("href", `/photographer.html?id=${data.id}`)
        textLink.setAttribute("aria-label", `Visiter le profil de ${data.name}`)
        textLink.textContent = name

        h2.appendChild(textLink);

        const nameP = document.createElement("p")
        nameP.textContent = data.name

        const countryP = document.createElement("p")
        countryP.textContent = data.country
        countryP.classList.add("photographer_country")

        const tagLineP = document.createElement("p")
        tagLineP.textContent = data.tagline
        tagLineP.classList.add("photographer_tagline")

        const tgmP = document.createElement("p")
        tgmP.textContent = `${data.price}€/jour`
        tgmP.classList.add("photographer_tgm")

        article.appendChild(imgLink);
        article.appendChild(h2);
        article.appendChild(countryP)
        article.appendChild(tagLineP)
        article.appendChild(tgmP)

        return article;
    }

    function getUserProfileDOM() {
        const article = document.createElement("article")
        const header = document.createElement("header")
        const h2 = document.createElement("h2")
        h2.textContent = data.name
        const h3 = document.createElement("h3")
        h3.textContent = `${data.city}, ${data.country}`
        const p = document.createElement("p")
        p.textContent = data.tagline

        header.appendChild(h2)
        header.appendChild(h3)
        header.appendChild(p)

        const contactBtn = document.createElement("button")
        contactBtn.setAttribute("aria-label", "Contact Me")
        contactBtn.textContent = "Contactez-moi"
        
        //handle contact form opening
        contactBtn.addEventListener("click", displayModal)

        const img = document.createElement("img");
        img.setAttribute("src", `assets/photographers/${data.portrait}`)
        img.setAttribute("alt", data.name)

        document.getElementById("contact_name").textContent = data.name

        article.appendChild(header)
        article.appendChild(contactBtn)
        article.appendChild(img)

        return article
    }

    return {getUserCardDOM, getUserProfileDOM}
}

function galleryFactory(photos, totalLike) {
    function getPhotoCardDOM() {
        const gallery = []

        for(let i = 0; i < photos.length; i++) {
            const article = document.createElement("article")
            article.classList.add("gallery_item")
            let media = {}

            switch (Boolean(photos[i].image)) {
                case true: {
                    const img = document.createElement("img")
                    img.setAttribute("src", `assets/images/${photos[i].image}`)
                    img.setAttribute("alt", photos[i].title)

                    img.addEventListener("click", () => {
                        createLightboxImg(photos[i])

                        const container = document.getElementById("lightBox")
                        container.dataset.index = `${i}`
                        container.style.display = "block"
                    })
                    media = img
                    break
                }
                case false: {
                    const video = document.createElement("video")
                    video.setAttribute("src", `assets/images/${photos[i].video}`)
                    video.setAttribute("alt", photos[i].title)
                    video.addEventListener("click", () => {
                        createLightboxVideo(photos[i])

                        const container = document.getElementById("lightBox")
                        container.dataset.index = `${i}`
                        container.style.display = "block"
                    })
                    media = video
                }
            }



            const container = document.createElement("div")

            const titleP = document.createElement("p")
            titleP.classList.add("title")
            titleP.textContent = photos[i].title

            const likeP = document.createElement("p")
            likeP.textContent = photos[i].likes
            likeP.classList.add("like")
            const likeIcon = document.createElement("em")
            likeIcon.setAttribute("aria-label", "likes")
            likeIcon.style.cursor = "pointer"
            likeP.appendChild(likeIcon)
            likeP.classList.add("icon")

            //handling like event
            likeIcon.addEventListener("click", () => {
                if(photos[i].wasLike) {
                    return;
                }

                photos[i].likes += 1
                likeP.textContent = photos[i].likes
                likeP.appendChild(likeIcon)

                //update the total number of like
                totalLike += 1
                setTotalLikeNumber(
                    document.getElementById("total-like"),
                    totalLike
                )
                photos[i].wasLike = true
            })

            container.appendChild(titleP)
            container.appendChild(likeP)

            article.appendChild(media)
            article.appendChild(container)

            gallery.push(article)
        }

        return gallery
    }


    return {getPhotoCardDOM}
}

function createLightboxImg(photo) {
    document.querySelector(".lightbox article").textContent = ""

    const media = document.createElement("img")
    media.setAttribute("src", `assets/images/${photo.image}`)
    media.setAttribute("alt", photo.title)

    document.querySelector(".lightbox article").appendChild(media)

    const title = document.createElement("p")
    title.textContent = photo.title

    document.querySelector(".lightbox article").appendChild(title)
}

function createLightboxVideo(video) {
    document.querySelector(".lightbox article").textContent = ""

    const media = document.createElement("video")
    media.setAttribute("alt", video.title)
    media.setAttribute("controls", "true")

    const source = document.createElement("source")
    source.setAttribute("src", `assets/images/${video.video}`)
    source.setAttribute("type", "video/mp4")

    media.appendChild(source)

    document.querySelector(".lightbox article").appendChild(media)

    const title = document.createElement("p")
    title.textContent = video.title

    document.querySelector(".lightbox article").appendChild(title)
}

function getPriceTagElts(price, totalLike) {
    const priceP = document.createElement("p")
    priceP.textContent = `${price}€/jour`

    const likeP = document.createElement("p")
    likeP.id = "total-like"
    setTotalLikeNumber(likeP, totalLike)

    return {priceP, likeP}
}

function setTotalLikeNumber(likeP, totalLike) {
    likeP.textContent = totalLike
    likeP.appendChild(document.createElement("em"))
    likeP.classList.add("icon")
}
