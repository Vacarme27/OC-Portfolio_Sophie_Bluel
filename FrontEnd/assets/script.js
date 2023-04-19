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

//______________Filtres__________________

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

const jsLogin = document.querySelector(".js-login");

function editorMode(){  
  const editorMode = document.querySelectorAll(".editor-mode");
  const filters = document.querySelector(".btn-container")
  const token = localStorage.getItem("valideToken");  
  if (token) {    
    for(let i = 0; i < editorMode.length; i++) {
      editorMode[i].style.display = "flex";
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
  modal.querySelector('.js-close-modal-gallery').addEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation)
  modal.querySelector('.js-stop-modal-gallery').addEventListener('click', stopPropagation) 
}

const closeModal = function (event) {
  if (modal === null) return
  event.preventDefault()  
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')  
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
  modal.querySelector('.js-close-modal-gallery').removeEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation)
  modal.querySelector('.js-stop-modal-gallery').removeEventListener('click', stopPropagation)
  modal = null

  const firstPage = document.querySelector('.modal-wrapper');
  const secondPage = document.querySelector('.modal-add-gallery');
  if (secondPage.style.display !== "none") {
    secondPage.style.display = "none";
    firstPage.style.display = "flex";
  }
}

const stopPropagation = function (event){
  event.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

//______________Affichage Gallerie Modale______________

const modalGalleryShow = document.querySelector('#modal-gallery');
const modalElements = document.querySelectorAll('.js-modal');

modalElements.forEach(function(a) {
  a.addEventListener('click', function(event) {
    event.preventDefault();
    modalGalleryShow.innerHTML = "";

    fetch("http://localhost:5678/api/works/")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      data.forEach(function(image) {
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

        //___________Suppression des travaux du DOM depuis l'API________
     
        const trashIcon = imgContainer.querySelector('.trash-icon');
        trashIcon.addEventListener('click', function() {
          const imageId = imgContainer.getAttribute('data-id');
          fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("valideToken")}`,
            }
          })
          .then(function(response) {
            if (response.ok) {           
            imgContainer.remove();
            } else {
            console.error(`Impossible de supprimer l'image ${imageId} de l'API.`);
            }
          })
          .catch(function(error) {
            console.error(`Erreur lors de la suppression de l'image ${imageId} de l'API :`, error);
          });
        });
      });
    });
  });
});

//_________Affichage Add Gallery___________

const addPhotoBtn = document.querySelector(".modal-button");
const backArrow  = document.querySelector('.arrow-left');
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddGallery = document.querySelector(".modal-add-gallery");

addPhotoBtn.addEventListener("click", function() {
  modalWrapper.style.display = "none";
  modalAddGallery.style.display = "block";
});

//_________Retour Sur la Modale ______________
backArrow.addEventListener("click", function() {
  modalWrapper.style.display = "flex";
  modalAddGallery.style.display = "none";
});