const banners = [
    "imagens/banner1.jpg",
    "imagens/banner2.jpg"
];

let bannerAtual = 0;

setInterval(() => {

    bannerAtual++;

    if (bannerAtual >= banners.length) {
        bannerAtual = 0;
    }

    document.getElementById("banner").src = banners[bannerAtual];

}, 5000);