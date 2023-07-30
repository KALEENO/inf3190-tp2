const form = document.getElementById('formulaire');
const formResultat = document.getElementById('formulaire-resultat');
const genre = document.getElementById('genre');
const age = document.getElementById('age');
const valeurAchat = document.getElementById('valeur-achat');
const anneeFabrication = document.getElementById('annee-fabrication');
const nombreReclamations = document.getElementById('nombre-reclamations');
const reclamation = document.getElementById('reclamation');
const reclamationSuite = document.getElementById('reclamation-suite');
const soumission_button = document.querySelector('button');
let formulaireValide;
let genreValide = false;
let ageValide = false;
let valeurAchatValide = false;
let anneeFabricationValide = false;
let reclamationValide = false;
let nombreReclamationsValide = false;
let montantReclamationValide = false;

const optionTextVide = document.getElementsByClassName('option-vide');
for (let i = 0; i < optionTextVide.length; i++) {
    optionTextVide[i].textContent = "";
}

// Soumet le formulaire
form.addEventListener('submit', e => {
    e.preventDefault();

    estFormulaireVide();
    if (estFormulaireValide()) {
        estAssure();
        calculerMontantAssurance();
        afficherResultat();
    }
});


// Vérifie si les champs sont vides lors de la soumission
function estFormulaireVide() {
    if (genre.value.trim() === '' || age.value.trim() === '' || valeurAchat.value.trim() === '' || 
    anneeFabrication.value.trim() === '' || reclamation.value.trim() === '' || nombreReclamations.value.trim() == '') {
        if (genre.value.trim() === '') {
            afficherErreur(genre);
        }
        if (age.value.trim() === '') {
            afficherErreur(age);
        }
        if (valeurAchat.value.trim() === '') {
            afficherErreur(valeurAchat);
        }
        if (anneeFabrication.value.trim() === '') {
            afficherErreur(anneeFabrication);
        }
        if (reclamation.value.trim() === '') {
            afficherErreur(reclamation);
        }
        if (reclamation.value.trim() !== '' && nombreReclamations.value.trim() === '') {
            afficherErreur(nombreReclamations);
        }
    }
    // Verifie si les champs des montants réclamés sont vides lors de la soumission 
    const montantReclamationInputs = document.getElementsByClassName('montant-reclamation-inputs');
    let montantReclamationErreurCount = 0;
    for (let i = 0; i < montantReclamationInputs.length; i++) {
        if (montantReclamationInputs[i].value.trim() === '') {
            afficherErreur(montantReclamationInputs[i]);
            montantReclamationErreurCount++;
        }
    }

    // Vérifie si tous les montants réclamés sont valides
    montantReclamationValide = montantReclamationErreurCount === 0;
}

// Validation du formulaire
function estFormulaireValide() {
    if (reclamation.value.trim() === 'non') {
        formulaireValide = genreValide && ageValide && valeurAchatValide && anneeFabricationValide && reclamationValide;
    } else {
        formulaireValide = genreValide && ageValide && valeurAchatValide && anneeFabricationValide && reclamationValide && nombreReclamationsValide && montantReclamationValide;
    }
    return formulaireValide;
}

// Vérifie si le profil de client est assuré
function estAssure() {
    const genreSaisi = genre.value.trim();
    const ageSaisi = age.value.trim();
    const valeurAchatSaisie = valeurAchat.value.trim();
    const anneeFabricationSaisie = anneeFabrication.value.trim();
    const nombreReclamationsSaisi = nombreReclamations.value.trim();
    const sommeReclamations = calculerSommeReclamations();
    
    const estFemmeMineure = genreSaisi === 'f' && ageSaisi < 16;
    const estHommeOuNonBinaireMineur = (genreSaisi === 'h' || genreSaisi === 'nb') && ageSaisi < 18;
    const depasseAgeLimite = ageSaisi > 100;
    const depasseValeurLimite = valeurAchatSaisie > 100000;
    const depasseAnneeLimite = (2023 - anneeFabricationSaisie) > 25;
    const depasseReclamationsLimite = nombreReclamationsSaisi > 4;
    const depasseSommeReclamationsLimite = reclamation.value.trim() === 'oui' && sommeReclamations > 35000;
    
    const userAssurer = !(estFemmeMineure || estHommeOuNonBinaireMineur || depasseAgeLimite || depasseValeurLimite ||
        depasseAnneeLimite || depasseReclamationsLimite || depasseSommeReclamationsLimite);
    
    return userAssurer;
}

// Calcule le montant de l'assurance
function calculerMontantAssurance() {
    const genreSaisi = genre.value.trim();
    const ageSaisi = age.value.trim();
    const valeurAchatSaisie = valeurAchat.value.trim();
    const nombreReclamationsSaisi = nombreReclamations.value.trim();
    const sommeReclamations = calculerSommeReclamations();

    let montantBase;
    let montantAssurance;

    if (ageSaisi >= 75) {
        montantBase = valeurAchatSaisie * 0.04;
    } else if ((genreSaisi === 'h' || genreSaisi === 'nb') && ageSaisi < 25) {
        montantBase = valeurAchatSaisie * 0.05;
    } else {
        montantBase = valeurAchatSaisie * 0.02;
    }

    if (sommeReclamations > 25000) {
        montantAssurance = montantBase + (350 * nombreReclamationsSaisi) + 500; 
    } else {
        montantAssurance = montantBase + (350 * nombreReclamationsSaisi);
    }

    return montantAssurance;
}

// Affiche le résultat de la soumission
function afficherResultat() {
    let prixAnnuelAssurance = calculerMontantAssurance().toFixed(2);
    let prixMensuelAssurance = (calculerMontantAssurance() / 12).toFixed(2);
    let clientAssure = estAssure();
    let messageAnnuel = document.getElementById('message-annuel');
    let messageMensuel = document.getElementById('message-mensuel');
    let messageClientRejete = document.getElementById('message-client-rejete');
    let recommencerOui_button = document.getElementById('recommencer-oui');
    let recommencerNon_button = document.getElementById('recommencer-non');
    let messageAdieu = document.getElementById('message-adieu');

    form.style.display = "none";
    formResultat.style.display = "flex";

    if (clientAssure) {
        messageAnnuel.innerHTML += prixAnnuelAssurance + "/an.";
        messageMensuel.innerHTML += prixMensuelAssurance + "/mois.";
        messageClientRejete.textContent = '';
    } else {
        messageAnnuel.textContent = '';
        messageMensuel.textContent = '';
    }

    recommencerOui_button.addEventListener('click', function() {
        form.submit();
    });

    recommencerNon_button.addEventListener('click', ()=> {
        messageAdieu.style.display = "flex";
        formResultat.style.display = "none";

        setTimeout(() => { 
            form.submit();
         }, 7000);
    });
}



// Validation du genre
genre.addEventListener('change', () => {
    if (genre.value.trim() === 'h' || genre.value.trim() === 'f' || genre.value.trim() === 'nb') {
        afficherSucces(genre);
        genreValide = true;
    }
});

// Validation de l'age
age.addEventListener('input', () => {
    const ageSaisi = age.value.trim();
    if (ageSaisi === "") {
        retirerStyleValidation(age);
    } else if (isNaN(ageSaisi) || ageSaisi < 0 || ageSaisi > 150) {
        afficherErreur(age);
        ageValide = false;
        age.focus();
    } else { 
        afficherSucces(age);
        ageValide = true;
    }
});

// Validation de la valeur d'achat
valeurAchat.addEventListener('input', () => {
    const valeurAchatSaisie = valeurAchat.value.trim();
    if (valeurAchatSaisie === "") {
        retirerStyleValidation(valeurAchat);
    } else if (isNaN(valeurAchatSaisie) || valeurAchatSaisie < 0) {
        afficherErreur(valeurAchat);
        valeurAchatValide = false;
        valeurAchat.focus();
    } else { 
        afficherSucces(valeurAchat);
        valeurAchatValide = true;
    }
});

// Validation de l'année de fabrication
anneeFabrication.addEventListener('input', () => {
    const anneeFabricationSaisie = anneeFabrication.value.trim();
    if (anneeFabricationSaisie === "") {
        retirerStyleValidation(anneeFabrication);
    } else if (isNaN(anneeFabricationSaisie) || anneeFabricationSaisie < 1885 || anneeFabricationSaisie > 2023) {
        afficherErreur(anneeFabrication);
        anneeFabricationValide = false;
        anneeFabrication.focus();
    } else { 
        afficherSucces(anneeFabrication);
        anneeFabricationValide = true;
    }
});

// Validation de reclamation 
// Divulgation progressive: Question 1
let montantReclamationContenant_div;
reclamation.addEventListener('change', () => {
    let reclamationReponse = reclamation.value.trim();
    
    if (reclamationReponse === 'oui') {
        reclamationSuite.style.display = 'block';
        afficherSucces(reclamation);
        reclamationValide = true;
        
        // Crée la div qui contient les montants des réclamations
        montantReclamationContenant_div = document.createElement('div');
        montantReclamationContenant_div.id = "montant-reclamations-contenant";
        form.insertBefore(montantReclamationContenant_div,soumission_button);
    } 
    if (reclamationReponse === 'non') {
        reclamationSuite.style.display = 'none';
        afficherSucces(reclamation);
        reclamationValide = true;
        
        if (montantReclamationContenant_div) {
            montantReclamationContenant_div.style.display = 'none';
            montantReclamationContenant_div.remove();
        }
        
        // Reset le nombre de reclamation, lorsqu'on change de Oui à Non.
        nombreReclamations.value = null;
        
        // Retire les styles de validation
        reclamationSuite.className = 'contenu-formulaire';
    }
});

// Validation de nombre de reclamation
nombreReclamations.addEventListener('input', () => {
    const nombreReclamationsSaisi = nombreReclamations.value.trim();
    if (nombreReclamationsSaisi === "") {
        retirerStyleValidation(nombreReclamations);
    } else if (isNaN(nombreReclamationsSaisi) || nombreReclamationsSaisi < 1 || nombreReclamationsSaisi > 10) {
        afficherErreur(nombreReclamations);
        nombreReclamationsValide = false;
        nombreReclamations.focus();
    } else {
        afficherSucces(nombreReclamations);
        nombreReclamationsValide = true;
    }
});


// Affiche les styles d'erreur
function afficherErreur(input) {
    formulaireValide = false;
    const contenuFormulaire = input.parentElement.parentElement;
    contenuFormulaire.className = 'contenu-formulaire erreur';
}

// Affiche les styles de succès
function afficherSucces(input) {
    const contenuFormulaire = input.parentElement.parentElement;
    contenuFormulaire.className = 'contenu-formulaire succes';
}

// Retire les styles de validation
function retirerStyleValidation(input) {
    const contenuFormulaire = input.parentElement.parentElement;
    contenuFormulaire.className = 'contenu-formulaire';
}


// Crée les labels/inputs pour saisir les montants des réclamations.
// Divulgation progressive: Question 2
nombreReclamations.addEventListener('input', () => {
    let nombreReclamationsSaisi = nombreReclamations.value.trim();
    // On affiche les champs des montants des reclamation que si le nombre de reclamation est valide.
    if (nombreReclamationsValide) {
        // Réinitialise le contenu du conteneur des montants réclamés.
        montantReclamationContenant_div.innerHTML = "";

        for (let i = 1; i <= nombreReclamationsSaisi; i++) {
            const montantReclamation_div = document.createElement('div');
            montantReclamation_div.className = "contenu-formulaire";

            const label = document.createElement("label");
            label.textContent = "Pour la réclamation #" + i + ", quel montant avez-vous réclamé?";
            
            const inputIcon_div = document.createElement("div");
            inputIcon_div.className = "input-icons";
            inputIcon_div.style.marginBottom = "25px";

            // Affiche le signe de dollar dans l'input
            const dollarIcon_span = document.createElement("span");
            dollarIcon_span.className = "signe-dollar";
            dollarIcon_span.innerHTML = '<i class="fa-solid fa-dollar-sign"></i>';

            const succesIcon_span = document.createElement('span');
            succesIcon_span.className = "succes-icon";
            succesIcon_span.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            const erreurIcon_span = document.createElement('span');
            erreurIcon_span.className = "erreur-icon";
            erreurIcon_span.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-bounce"></i>';

            const erreurMessage = document.createElement("small");
            erreurMessage.className = 'erreur-message';
            erreurMessage.textContent = "Entrez un montant réclamé valide (>0).";

            
            const input = document.createElement("input");
            input.type = "text";
            input.className = "montant-reclamation-inputs";
            input.style.paddingLeft = "30px";
            input.addEventListener('change', calculerSommeReclamations);
            
            // Valide chacun des montant réclamé
            input.addEventListener('input', function() {
                validerInput(input);
            });
            
            // Insère les labels/inputs dans la div
            inputIcon_div.appendChild(dollarIcon_span);
            inputIcon_div.appendChild(succesIcon_span);
            inputIcon_div.appendChild(erreurIcon_span);
            inputIcon_div.appendChild(erreurMessage);
            inputIcon_div.appendChild(input);
            montantReclamation_div.appendChild(label);
            montantReclamation_div.appendChild(inputIcon_div);
            montantReclamationContenant_div.appendChild(montantReclamation_div);
        }
    } else {
        // Réinitialise le contenu du conteneur des montants réclamés.
        montantReclamationContenant_div.innerHTML = "";
    }
});

// Valide chaque montant réclamé
function validerInput(input) {
    let montantReclame = input.value.trim();
    
    if (montantReclame === "") {
        retirerStyleValidation(input);
    } else if (isNaN(montantReclame) || montantReclame < 0) {
        afficherErreur(input);
        input.focus();
    } else {
        afficherSucces(input);
    }
}

// Calcule de la somme des reclamations
function calculerSommeReclamations() {
    let montantReclamation = document.getElementsByClassName('montant-reclamation-inputs');
    let somme = 0;
    for (let i = 0; i < montantReclamation.length; i++) {
        somme += parseInt(montantReclamation[i].value);
    }
    return somme;
}



