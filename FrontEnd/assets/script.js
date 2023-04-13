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

// btnTous.addEventListener("click", function(){
//   const worksFiltreTous = works.filtre(function (works){
//     return works.categorieId;
//   });
//     document.querySelector(".gallery").innerHTML = "";
//     createGallery(worksFiltreTous);    
// });

// btnObjets.addEventListener("click", function(){
//   const worksFiltreobjet = works.filtre(function (works){
//     return works.categorieId === 1;
//   });
//     document.querySelector(".gallery").innerHTML = "";
//     createGallery(worksFiltreobjet);  
// });

// btnAppartements.addEventListener("click", function(){
//   const worksFiltreAppartements = works.filtre(function (works){
//     return works.categorieId === 2;
//   });
//     document.querySelector(".gallery").innerHTML = "";
//     createGallery(worksFiltreAppartements);  
// });

// btnrHotels.addEventListener("click", function(){
//   const worksFiltreHotels = works.filtre(function (works){
//     return works.categorieId === 3;
//   });
//     document.querySelector(".gallery").innerHTML = "";
//     createGallery(worksFiltreHotels);  
// });