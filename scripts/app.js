let pkmnInput = document.getElementById("pkmnInput");
let monName = document.getElementById("monName");
let monType = document.getElementById("monType");
let monDesc = document.getElementById("monDesc");
let monLocation = document.getElementById("monLocation");
let monAbilities = document.getElementById("monAbilities");
let monMoves = document.getElementById("monMoves");
let monImg = document.getElementById("monImg");

let evoDiv = document.getElementById("evoDiv");

let shinyBtn = document.getElementById("shinyBtn");
let searchBtn = document.getElementById("searchBtn");
let randomBtn = document.getElementById("randomBtn");
let favBtn = document.getElementById("favBtn");



let pkmnID = -99;
let isShiny = false;


function prettyWord(input) {
    return input.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const mainApi = async (mon) => {
    evoDiv.textContent = "";
    isShiny = false;


    const promise = await fetch("https://pokeapi.co/api/v2/pokemon/" + mon);
    const data = await promise.json();

    monName.textContent = "#" + data.id + " " + prettyWord(data.name);
    pkmnID = data.id;

    let types = data.types.map(ele => prettyWord(ele.type.name));
    monType.textContent = types.join(', ');

    monDesc.textContent = "";

    let abilities = data.abilities.map(ele => prettyWord(ele.ability.name));
    monAbilities.textContent = abilities.join(', ');

    let moves = data.moves.map(ele => prettyWord(ele.move.name));
    monMoves.textContent = moves.join(', ');

    monImg.src = data.sprites.other["official-artwork"].front_default;

    //this sets the location text
    monLocation.textContent = ("Not found in the wild");
    locationFetch(data);
    //fetches the data from species endpoint
    speciesFetch(data);
    return data;
}

const locationFetch = async (data) => {
    const promise = await fetch([data.location_area_encounters]);
    const location = await promise.json();
    monLocation.textContent = prettyWord(location[0].location_area.name);
    return location;

}
const speciesFetch = async (data) => {
    const promise = await fetch([data.species.url]);
    const species = await promise.json();
    for (let i = 0; i < species.flavor_text_entries.length; i++) {
        if (species.flavor_text_entries[i].language.name == "en") {
            monDesc.textContent = (species.flavor_text_entries[i].flavor_text).replace('\f', " ");
            break;
        }
    }

    console.log(species.flavor_text_entries.length);
    evoFetch(species);
}

const evoFetch = async (data) => {
    if (data.evolution_chain) {
        const promise = await fetch([data.evolution_chain.url]);
        const evo = await promise.json();
        console.log(evo);

        let evoArr = [];

        let evolves = evo.chain.evolves_to;
        console.log(evolves);
        if (evolves.length === 0) {
            evoArr.push(evo.chain.species.name);
        }
        else {
            for (let i = 0; i < evolves.length; i++) {
                let evo1 = "";
                evo1 = [evo.chain.species.name, evolves[i].species.name];

                let evolves2 = evolves[i].evolves_to;

                if (evolves2.length >= 1) {
                    for (let j = 0; j < evolves2.length; j++) {
                        let evo2 = "";
                        evo2 = [evo.chain.species.name, evolves[i].species.name, evolves2[j].species.name]
                        evoArr.push(evo2);
                    }
                }
                else {
                    evoArr.push(evo1);
                }
            }

        }
        console.log(evoArr);
        // evoArr.forEach(mon => evolutionGenerator(mon));
        for (let i = 0; i < evoArr.length; i++) {
            let newDiv = document.createElement('div');
            newDiv.className = ("flex justify-center items-center gap-[3vw] mt-6");
            newDiv.id = i;
            evoDiv.append(newDiv);


            if (evolves.length === 0) {
                await evolutionGenerator(evoArr[i], newDiv);;
            }
            else {
                for (let j = 0; j < evoArr[i].length; j++) {
                    await evolutionGenerator(evoArr[i][j], newDiv);
                    const pElementArrow = document.createElement('p');
                    pElementArrow.classList.add('text-6xl');
                    pElementArrow.textContent = '→';
                    if(j < evoArr[i].length-1){
                        newDiv.append(pElementArrow);
                    }
                    
                }
            }


        }

    }


}


const evolutionGenerator = async (mon, newDiv) => {
    const promise = await fetch("https://pokeapi.co/api/v2/pokemon/" + mon);
    const data = await promise.json();

    console.log(isShiny)
    if (isShiny == false) {

        let div = document.createElement('div');
        let buttonElement = document.createElement('button');
        let img = document.createElement('img');
        img.className = ("evoImg mx-auto");
        img.src = data.sprites.other.showdown.front_default;

        buttonElement.addEventListener('click', function() {
            mainApi(mon);
        });

        const pInside = document.createElement('p');
        pInside.classList.add('text-center');
        pInside.textContent = prettyWord(mon);

        buttonElement.appendChild(img);
        buttonElement.appendChild(pInside);
        div.appendChild(buttonElement);
        
        newDiv.append(div);
        
    }
    else {
        let div = document.createElement('div');
        let buttonElement = document.createElement('button');
        let img = document.createElement('img');
        img.className = ("evoImg mx-auto");
        img.src = data.sprites.other.showdown.front_shiny;

        buttonElement.addEventListener('click', function() {
            mainApi(mon);
        });

        const pInside = document.createElement('p');
        pInside.classList.add('text-center');
        pInside.textContent = prettyWord(mon);

        buttonElement.appendChild(img);
        buttonElement.appendChild(pInside);
        div.appendChild(buttonElement);
        
        
        newDiv.append(div);
    }



}

pkmnInput.addEventListener('keydown', async (event) => {
    //On enter I want this function to run
    if (event.key === "Enter") {
        pkmn = await mainApi(event.target.value);
    }
})
searchBtn.addEventListener('click', async () => {
    mainApi(pkmnInput.value);
})
randomBtn.addEventListener('click', async () => {
    var randomNumber = Math.floor(Math.random() * 1000) + 1;

    mainApi(randomNumber);
})


shinyBtn.addEventListener('click', () => {
    if (isShiny == false) {
        shiny();
        isShiny = true;
    }
    else if (isShiny == true) {
        shiny();
        isShiny = false;

    }

})

const shiny = async () => {
    evoDiv.textContent = "";

    console.log(pkmnID);
    const promise = await fetch("https://pokeapi.co/api/v2/pokemon/" + pkmnID);
    const data = await promise.json();

    if (isShiny) {
        monImg.src = data.sprites.other["official-artwork"].front_shiny;
    }
    else {
        monImg.src = data.sprites.other["official-artwork"].front_default;
    }


    speciesFetch(data);
    return data;
}

