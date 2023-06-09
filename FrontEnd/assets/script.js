let works = [];
const divGallery = document.querySelector(".gallery");
const btnAll = document.querySelector(".btn-tous");

// Récupération des projets, depuis le fichier JSON

fetch("http://localhost:5678/api/works/")
  .then(function(response) {
    return response.json();
  })
  .then(async function(data) {
    works = data;
    createGallery(works);
    var categories = Array.from(new Set(works.map(function(work) {
        return work.categoryId;
    })));
    await createFilterButtons(categories);
  })
  .catch(function(error) {
    console.error(error);
  });
//_____________Récupération des catégories_____________

  async function getCategories() {
    try {
      const response = await fetch('http://localhost:5678/api/categories');
      return await response.json();
    } catch (error) {
      return console.error(error);
    }
  }

//______________Création boutons filtres________________

async function createFilterButtons(categories) {
  const btnContainer = document.querySelector(".btn-container");
  try {
    const categoriesData = await getCategories();
    categoriesData.forEach(function(categoryData) {
      const categoryId = categoryData.id;
      const categoryName = categoryData.name;
      if (categories.includes(categoryId)) {
        const btn = document.createElement("div");
        btn.classList.add("btn");
        btn.innerText = categoryName;
        btnContainer.appendChild(btn);
        btn.addEventListener("click", function() {
          const worksFiltre = works.filter(function(work) {
            return work.categoryId === categoryId;
          });
          document.querySelector(".gallery").innerHTML = "";
          createGallery(worksFiltre);
          activeButton(btn);
        });
      }
    });    
  } catch (error) {
    console.error(error);
  }
}
  //________________Bouton Tous________________

  btnAll.addEventListener("click", function() {
    createGallery(works);
    activeButton(btnAll);
  }); 

//______Ajout et suppresssion de la classe "active"__________

function activeButton(active) {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(function(btn) {
    btn.classList.remove("active");
  });
  active.classList.add("active");
}

//____________Céation de la galerie_____________

function createGallery(works) {
  divGallery.innerHTML = "";
  works.forEach(function(work) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");

    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const nomElement = document.createElement("figcaption");
    nomElement.innerText = work.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(nomElement);
    figureElement.setAttribute("data-id", work.id);
    divGallery.appendChild(figureElement);
  });
}

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

  resetModal()
}

const stopPropagation = function (event){
  event.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
})

function resetModal() {
  const firstPage = document.querySelector('.modal-wrapper');
  const secondPage = document.querySelector('.modal-add-gallery');

  window.setTimeout(function(){  
    if (secondPage.style.display !== "none") {    
      secondPage.style.display = "none";
      firstPage.style.display = "flex";
    }
  },500);
}

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
  const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer tous les éléments de la galerie ?");

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
  works =[]; 
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
  resetFormAndImage();
});

//_________Retour Sur La Modale ______________

backArrow.addEventListener("click", function() {  
  modalWrapper.style.display = "flex";
  modalAddGallery.style.display = "none"; 
});

//______________Ajout De Travaux________________

const modalGalleryButton = document.querySelector(".modal-gallery-button");
const uploadPhotoButton = document.querySelector("#upload-photo");
const addGallery = document.querySelector(".add-gallery");
const titleForm = document.querySelector("#title");
const categoryForm = document.querySelector("#category");
const validateButton = document.querySelector(".modal-gallery-button-validate");
const trashIconResetForm = document.querySelector(".trash-icon-del-photo");
const errorMessage = document.querySelector("#modal-gallery-error-message");


const inputImage = document.createElement("input");
let newInputImage = createNewInputImage();


function resetFormAndImage() {   
  uploadPhotoButton.reset();  
  titleForm.value = "";
  categoryForm.value = "null";
  
  var images = addGallery.querySelectorAll("img");
  for (var i = 0; i < images.length; i++) {
    images[i].remove();
  }
  addGallery.querySelector("p").style.display = "block";
  addGallery.querySelector("button").style.display = "block";
  trashIconResetForm.style.display = "none";
  errorMessage.style.display = "none";    
  validateButton.style.backgroundColor = "";
  
}
//______On va chercher les catégories dynamiquement______

function createNewInputImage() {
  getCategories().then(function(categories) {
  categoryForm.innerHTML = '<option value="null">Veuillez choisir une catégorie</option>';
  categories.forEach(function(category) {
  categoryForm.innerHTML += '<option value="' + category.id + '">' + category.name + '</option>';
  });
  });  
  inputImage.type = "file";
  inputImage.name = "image";
  inputImage.accept = ".png, .jpg, .jpeg";
  inputImage.style.display = "none";
  uploadPhotoButton.appendChild(inputImage);
  
  inputImage.addEventListener("change", function() {
    const file = inputImage.files[0];
    addImageToForm(file);
  });
  return inputImage;  
}

function addImageToForm(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  
  addGallery.appendChild(img);
  addGallery.querySelector("p").style.display = "none";
  addGallery.querySelector("button").style.display = "none";  
  trashIconResetForm.style.display = "block";  

  trashIconResetForm.addEventListener("click", function() {
    img.remove();
    resetFormAndImage();
  });
}

modalGalleryButton.addEventListener("click", function() {
  if (!newInputImage) {
    newInputImage = createNewInputImage();
  }
  newInputImage.click();
});

[titleForm, categoryForm, inputImage].forEach(function(field) {
  field.addEventListener("input", function() {      
    var fieldsCompleted = false;
    if (titleForm.value.trim() !== "" && categoryForm.value !== "null" && inputImage.files.length > 0) {
      fieldsCompleted = true;
    }      
    validateButton.style.backgroundColor = fieldsCompleted ? "#1D6154" : ""; 
  });
});

validateButton.addEventListener("click", function(event) {
  event.preventDefault(); 
  const file = newInputImage.files[0];  
  if (!file || titleForm.value.trim() === "" || categoryForm.value === "null") {
    errorMessage.style.display = "block";
    return;
  }  

  const newForm = new FormData();
  newForm.append("image", file);
  newForm.append("title", titleForm.value);
  newForm.append("category", categoryForm.value); 

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("valideToken")}`
    },
    body: newForm,
  })
  .then(function(response) {          
    resetFormAndImage();
    return response.json();
  })  
  .then(function(data) {
    works.push(data);    
    createGallery(works);      
  })      
  .catch(function(error) {
    console.error(error);
  });  
  modal.setAttribute('aria-hidden', 'true');
  window.setTimeout(function(){  
    modal.style.display = "none";
    resetModal();
  },500);
});