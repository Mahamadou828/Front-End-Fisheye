async function getPhotographer(id) {
    const res = await (await fetch("../../data/photographers.json")).json()
    const profile = res.photographers.find((p) => p.id === id)
    const photos = res.media.filter((m) => m.photographerId === id)
    return {profile, photos}
}

function displayProfile(profile) {
    const profileSection = document.getElementById("profile")
    const photographerModel = photographerFactory(profile);
    profileSection.appendChild(photographerModel.getUserProfileDOM())
}

function displayGallery(photos, totalLike) {
    const gallerySection = document.getElementById("gallery")
    const galleryModel = galleryFactory(photos, totalLike)

    galleryModel.getPhotoCardDOM().forEach((photo) => {
        gallerySection.appendChild(photo)
    })

    //handle the close of lightbox
    document.querySelector(".lightbox .close").addEventListener("click", () => {
        document.querySelector(".lightbox article").textContent = ""
        document.getElementById("lightBox").style.display="none"
    })

    return photos
}

function displayPriceTag(price, totalLikes) {
    const priceTag = document.getElementById("price-tag")
    const elts = getPriceTagElts(price, totalLikes)

    priceTag.appendChild(elts.likeP)
    priceTag.appendChild(elts.priceP)
}

function lightBoxNext(photos) {
    return function () {
        const currentIdx = +document.getElementById("lightBox").dataset.index
        if(!Number.isSafeInteger(currentIdx)) {
            return
        }
        const media = photos[currentIdx+1]

        if(!media) {
            return;
        }

        switch (Boolean(media.video)) {
            case true:
                createLightboxVideo(media)
                break
            case false:
                createLightboxImg(media)
                break
        }

        document.getElementById("lightBox").dataset.index = `${currentIdx + 1}`
    }
}

function lightBoxPrev(photos) {
    return function () {
        const currentIdx = +document.getElementById("lightBox").dataset.index
        if(!Number.isSafeInteger(currentIdx) || currentIdx === 0) {
            return
        }
        const media = photos[currentIdx-1]

        switch (Boolean(media.video)) {
            case true:
                createLightboxVideo(media)
                break
            case false:
                createLightboxImg(media)
                break
        }

        document.getElementById("lightBox").dataset.index = `${currentIdx - 1}`
    }
}

function filterPhoto(value, photos) {
    switch (value) {
        case "popularity":
            return photos.sort((a, b) => b.likes - a.likes)
            break
        case "title":
            return photos.sort((a, b) => new Date(b.date) - new Date(a.Date))
            break
        case "date":
            return photos.sort((a,b) => a.title.localeCompare(b.title))
            break
    }
}

async function displayNotFound() {}

async function init() {
    const params = new URL(document.location).searchParams
    if(!params.get("id") || !Number.isSafeInteger(+params)) {
        //@todo implement the not found screen
        // console.log("not found")
    }
    let {profile, photos} = await getPhotographer(+params.get("id"))

    //apply a default filter on popularity
    photos = filterPhoto("popularity", photos)

    const totalLike = photos.reduce((accumulator, currentVal) => {
        return accumulator + currentVal.likes
    }, 0)

    displayProfile(profile)
    displayPriceTag(profile.price, totalLike)

    photos = displayGallery(photos, totalLike)

    //handle filter
    document.querySelector("select").addEventListener("change", ({target: {value}}) => {
        //apply the filter to the photos
        photos = filterPhoto(value, photos)

        //remove the current gallery
        document.getElementById("gallery").innerHTML = ""

        //displaying the new gallery with applied filter
        displayGallery(photos, totalLike)
    })

    //handle lightbox navigation
    document.querySelector(".arrow").addEventListener("click", lightBoxPrev(photos))
    document.querySelector(".arrow.right").addEventListener("click", lightBoxNext(photos))

    //handling the key navigation
    window.addEventListener("keydown", ({code}) => {
        console.log(code)
        switch (code) {
            case "ArrowLeft":
                lightBoxPrev(photos)()
                break
            case "ArrowRight":
                lightBoxNext(photos)()
                break
            case "Escape":
                document.getElementById("lightBox").style.display="none"
        }
    })
}

init()
