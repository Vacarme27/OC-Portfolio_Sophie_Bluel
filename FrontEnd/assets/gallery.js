const reponse = await fetch("http://localhost:5678/api/works/");
const card = await reponse.json();

function createGallery(card){
  for (let i = 0; i < card.length; i++) {
  
    const gallery = card[i];
  
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
createGallery(card);

  
  
    