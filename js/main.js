
//OBTNEMOS EL TIPO QUE ES UN POKEMON

let $main = document.querySelector("main"),
  arraysTipos = [];

async function obtenerTipos(url) {
  try {
    let res = await fetch(url),
      json = await res.json();

    //Obtenemos todos los tipos de pokemons 
    for (let i = 0; i < json.results.length; i++) {
      try {
        const element = json.results[i];

        let resTipos = await fetch(element.url),
          jsonTipos = await resTipos.json();

        let arreglo = jsonTipos.names.filter(el => el.language.name === "es"); //obtengo el nombre es español
        arraysTipos.push({
          nombreEnIngles: element.name,
          nombreEnEspaniol: arreglo[0]?.name || element.name
        });

      } catch (err) {
        console.log(err);
    //   }
      }

    //llenamos el arrays con los Tipos de Pokemons.
    }
  } catch (err) {
    console.log(err);
  }
}

const obtenerTipoEnEspaniol = (nombreIngles) => {
  return arraysTipos.filter(el=> el.nombreEnIngles === nombreIngles)[0].nombreEnEspaniol;
}

let url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=10";
let $template = document.querySelector("#template-pokemon").content;

async function loadPokemons(url){
  try {

  $main.innerHTML = ` <div class="loading">
  <div class="d1"></div>
  <div class="d2"></div>
  </div>`;
  // $main.innerHTML= "";
  let res = await fetch(url),
  json = await res.json(),
  arreglo = json.results,
  $prevLink,
  $nextLink,
  $links = document.querySelector(".links"),
  $fragment = document.createDocumentFragment();  
  for (let i = 0; i < arreglo.length; i++) {
    try {
      const element = arreglo[i];
      let resPoke = await fetch(element.url),
      jsonPoke = await resPoke.json();
    
      let $clone = $template.cloneNode(true);
      let $cardId = $clone.querySelector(".card-id");
      let $img = $clone.querySelector(".card-header img");
      let $cardTittle = $clone.querySelector(".tittle-card");
      let $cardHp = $clone.querySelector(".container-tittle span");
      let $cardType = $clone.querySelector(".tipoPokemon");
      let $caracteristicas = $clone.querySelector(".caracteristicas");
      let $footerCard = $clone.querySelector(".footer-card");
       
      $cardId.innerText = `N.°${jsonPoke.id}`;
      $img.setAttribute("src", jsonPoke.sprites.other["official-artwork"].front_default);
      $cardTittle.innerText = jsonPoke.name;
      $cardHp.innerText = `${jsonPoke.stats[0].base_stat} Hp`;
      $caracteristicas.children[0].children[1].innerText = `${jsonPoke.weight/10} kg`;
      $caracteristicas.children[1].children[1].innerText = `${jsonPoke.height/10} m`;
      $footerCard.children[0].children[1].innerText = `${jsonPoke.stats[1].base_stat} `; //ataque
      $footerCard.children[1].children[1].innerText = `${jsonPoke.stats[2].base_stat} `; //defensa
      $footerCard.children[2].children[1].innerText = `${jsonPoke.stats[5].base_stat} `; //velocidad
      
      let tipos = jsonPoke.types;

      for (let i = 0; i < tipos.length; i++) {
        const element = tipos[i];
        let resultado = arraysTipos.find(el => el.nombreEnIngles == element.type.name);

        $cardType.innerHTML += `<span class="type ${element.type.name}">${resultado.nombreEnEspaniol}</span>`;
      }

      $fragment.appendChild($clone); 

    } catch (error) {
      
    }
    
  }
  $main.innerHTML = "";
  $main.appendChild($fragment);
  $prevLink = json.previous ? `<a href="${json.previous}"><img src="assets/icons8-izquierda-círculo-64.png" alt="">
</a>` : "";
  $nextLink = json.next ? `<a href="${json.next}"><img src="assets/icons8-derecha-círculo-64.png" alt="">
</a>` : "";
  $links.innerHTML = $prevLink + " "+ $nextLink;
  } catch (err) {
    console.log(err);
  }
}


document.addEventListener("DOMContentLoaded", e => {
  obtenerTipos("https://pokeapi.co/api/v2/type");
  loadPokemons(url);
});

document.addEventListener("click", e => {
  
  if(e.target.matches(".links img")){
    e.preventDefault();
    loadPokemons(e.target.parentElement.getAttribute("href"));
  }
});




