//Récupération des projets, depuis le fichier JSON

const reponse = await fetch("http://localhost:5678/api/works/");
const works = await reponse.json();

const btnTous = document.querySelector(".btn-tous");
const btnObjets = document.querySelector(".btn-objets");
const btnAppartements = document.querySelector(".btn-appartements");
const btnHotels = document.querySelector(".btn-hotels");

//___________Création de la gallerie________

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
    figureElement.setAttribute("data-id", gallery.id);
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
    } else {
      worksFiltre = works;
    }
    document.querySelector(".gallery").innerHTML = "";
    createGallery(worksFiltre);
    activeBouton(tableau.bouton);    
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
  event.preventDefault();
  modal = document.querySelector(event.target.getAttribute('href'));  
  modal.style.display = null; 
  modal.removeAttribute('aria-hidden');
  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
  modal.querySelector('.js-close-modal-gallery').addEventListener('click', closeModal);
  modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation);
  modal.querySelector('.js-stop-modal-gallery').addEventListener('click', stopPropagation);  
}

const closeModal = function (event) {
  if (modal === null) return
  event.preventDefault();
  window.setTimeout(function() { 
    modal.style.display = "none";
    modal = null ;
  }, 500)  
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-close-modal').removeEventListener('click', closeModal);
  modal.querySelector('.js-close-modal-gallery').removeEventListener('click', closeModal);
  modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation);
  modal.querySelector('.js-stop-modal-gallery').removeEventListener('click', stopPropagation);  

  const firstPage = document.querySelector('.modal-wrapper');
  const secondPage = document.querySelector('.modal-add-gallery');

  window.setTimeout(function(){  
  if (secondPage.style.display !== "none") {    
    secondPage.style.display = "none";
    firstPage.style.display = "flex";
  }
  },500)
}

const stopPropagation = function (event){
  event.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
})

//______________Affichage Gallerie Modale______________

const modalGalleryShow = document.querySelector('#modal-gallery');
const modalElements = document.querySelectorAll('.js-modal');

function galleryInModal(modalElements, modalGalleryShow) {
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

            const trashIcon = imgContainer.querySelector('.trash-icon');
            trashIcon.addEventListener('click', function() {
              const imageId = imgContainer.getAttribute('data-id');
              deleteImage(imageId);
              imgContainer.remove();
            });
          });
        });
    });
  });
};

galleryInModal(modalElements, modalGalleryShow);

//______________Supression de toute la gallerie___________

const deleteGalleryBtn = document.querySelector(".del-gallery");

deleteGalleryBtn.addEventListener("click", function() {
  const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer la galerie ?");

  if (isConfirmed) {
    deleteGallery(works);
  }
});

async function deleteGallery() {  
  for (const work of works) {
    const url = `http://localhost:5678/api/works/${work.id}`;
    await fetch(url, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("valideToken")}`,
    } 
    });
  }  
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  modalGalleryShow.innerHTML="";
}

//______________Mise à jour de la gallerie lors de la suppresion_________________

function deleteImage(imageId) {
  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("valideToken")}`,
    }
  })
  .then(function(response) {
    if (response.ok) {      
      const galleryItem = document.querySelector(`[data-id="${imageId}"]`);
      galleryItem.remove();
    } else {
      console.error(`Impossible de supprimer l'image ${imageId} de l'API.`);
    }
  })
  .catch(function(error) {
    console.error(`Erreur lors de la suppression de l'image ${imageId} de l'API :`, error);
  });
}

//_________Affichage Add Gallery___________

const addPhotoBtn = document.querySelector(".modal-button");
const backArrow  = document.querySelector('.arrow-left');
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddGallery = document.querySelector(".modal-add-gallery");

addPhotoBtn.addEventListener("click", function() {  
  modalWrapper.style.display = "none";
  modalAddGallery.style.display = "block";
});

//_________Retour Sur La Modale ______________

backArrow.addEventListener("click", function() {  
  modalWrapper.style.display = "flex";
  modalAddGallery.style.display = "none";
});

//______________Ajout De Travaux________________

const modalGalleryButton = document.querySelector(".modal-gallery-button");
const uploadPhotoButton = document.querySelector("#upload-photo");
const newInputImage = document.createElement("input");
const errorMessage = document.querySelector("#modal-gallery-error-message");
const titleForm = document.querySelector("#title");
const categoryForm = document.querySelector("#category");
const validateButton = document.querySelector(".modal-gallery-button-validate");

newInputImage.type = "file";
newInputImage.name = "image";
newInputImage.accept = ".png, .jpg, .jpeg";
newInputImage.style.display = "none";
uploadPhotoButton.appendChild(newInputImage);

modalGalleryButton.addEventListener("click", function() {
  newInputImage.click();
});
newInputImage.addEventListener("change", function() {  
  const file = newInputImage.files[0];
  addImageToForm(file); 

  [titleForm, categoryForm].forEach(function(field) {
    field.addEventListener("input", function() {      
      var fieldsCompleted = false;
      if (titleForm.value.trim() !== "" && categoryForm.value !== "null") {
        fieldsCompleted = true;
      }      
      if (fieldsCompleted) {
        validateButton.style.backgroundColor = "#1D6154";
      } else {
        validateButton.style.backgroundColor = "";
      }
    });
  });

  validateButton.addEventListener("click", function(event) {
    event.preventDefault();
    const newForm = new FormData();
    newForm.append("image", file);
    newForm.append("title", titleForm.value);
    newForm.append("category", categoryForm.value);    
     
    if (titleForm.value.trim() === "" || categoryForm.value === "null") {

      errorMessage.style.display = "block";
      return;
    }    

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("valideToken")}`
      },
      body: newForm,
    })
      .then(function(response) {        
        uploadPhotoButton.reset();        
        return response.json();
      })  
      .then(function(data) {
        const divGallery = document.querySelector(".gallery");
        createGallery([data], divGallery);        
      })      
      .catch(function(error) {
        console.error(error);
      });
      resetModal();      
  });  
});

// ______Fonction pour ajouter l'image au formulaire_____

const trashIconResetForm = document.querySelector(".trash-icon-del-photo");
const addGallery = document.querySelector(".add-gallery"); 


function addImageToForm(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  
  addGallery.appendChild(img);
  addGallery.querySelector("p").style.display = "none";
  addGallery.querySelector("button").style.display = "none";  
  trashIconResetForm.style.display = "block"  

  trashIconResetForm.addEventListener("click", function() {
    img.remove();
    resetFormAndImage();    
  });
}

function resetFormAndImage() {   

  uploadPhotoButton.reset();
  titleForm.value = "";
  categoryForm.value = "null";
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";
  trashIconResetForm.style.display = "none";
  errorMessage.style.display = "none";
}

//____________Réinitialise l'image de la modale__________

function resetModal() {
  const img = addGallery.querySelector("img");
  if (img) {
    img.remove();
  }
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";
  trashIconResetForm.style.display = "none";
  errorMessage.style.display = "none";
  validateButton.style.backgroundColor = "";
}