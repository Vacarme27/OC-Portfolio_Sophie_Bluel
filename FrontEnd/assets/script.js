//Récupération des projets, depuis le fichier JSON

const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

const btnTous = document.querySelector(".btn-tous");
const btnObjets = document.querySelector(".btn-objets");
const btnAppartements = document.querySelector(".btn-appartements");
const btnHotels = document.querySelector(".btn-hotels");

function createGallery(works){
  for (let i = 0; i < works.length; i++) {
  
    const gallery = works[i];
  
    const divGallery = document.querySelector(".gallery");
  
    const figureElement = document.createElement("figure");
    
    const imageElement = document.createElement("img");
    imageElement.src = gallery.imageUrl;
    imageElement.alt = gallery.title;  
    
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = gallery.title;
    
    divGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nomElement);
  }
};
createGallery(works);

// Filtre

const filtreBtn = [
  { bouton: btnTous, categorie: null },
  { bouton: btnObjets, categorie: 1 },
  { bouton: btnAppartements, categorie: 2 },
  { bouton: btnHotels, categorie: 3 }
];

function activeBouton(active) {
  filtreBtn.forEach(function(tableau){
    tableau.bouton.classList.remove("active");
  });
  active.classList.add("active");
}

filtreBtn.forEach(function(tableau) {
  tableau.bouton.addEventListener("click", function() {
    const categorie = tableau.categorie;
    let worksFiltre;
    if (categorie) {
      worksFiltre = works.filter(function(search) {
        return search.categoryId === categorie;        
      });
      console.log(worksFiltre);
    } else {
      worksFiltre = works;
    }
    document.querySelector(".gallery").innerHTML = "";
    createGallery(worksFiltre);
    activeBouton(tableau.bouton);
    console.log(tableau.bouton);
  });
});

//____________________EDITOR_MODE_______________//

const jsLogin = document.querySelector(".jsLogin");

function editorMode(){  
  const editorMode = document.querySelectorAll(".editor-mode");
  const filters = document.querySelector(".btn-container")
  const token = localStorage.getItem("valideToken");  
  if (token) {    
    for(let i = 0; i < editorMode.length; i++) {
      editorMode[i].style.visibility = "visible";
    }
    filters.style.display = "none";
    jsLogin.textContent = "logout";
    jsLogin.classList.add("color-black")   
    jsLogin.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("valideToken");
      window.location.reload();
    });
  } else {    
    for(let i = 0; i < editorMode.length; i++) {
      editorMode[i].style.display = "none";
    }
  }
};
editorMode();

// ______________Modale_______________//

let modal = null

const openModal = function (event) {
  event.preventDefault()
  modal = document.querySelector(event.target.getAttribute('href'))
  modal.style.display = null
  modal.removeAttribute('aria-hidden')  
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation)
}

const closeModal = function (event) {
  if (modal === null) return
  event.preventDefault()  
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')  
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (event){
  event.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})
//____________Affichage Gallerie Modale______________

const modalGalleryShow = document.querySelector('#modal-gallery');


document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', (event) =>{
    event.preventDefault();
    modalGalleryShow.innerHTML = "";
    fetch("http://localhost:5678/api/works/")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((image) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");        
        imgContainer.setAttribute("data-id", image.id);
        imgContainer.innerHTML = `
          <img src="${image.imageUrl}" alt="${image.title}">
          <div class="trash-icon-container">
            <i class="fa-solid fa-trash-can trash-icon"></i>
          </div>
          <p>éditer</p>`;
          modalGalleryShow.appendChild(imgContainer);
      })
    })
  })
});