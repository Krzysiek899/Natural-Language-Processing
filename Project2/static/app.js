let nouns;
let pronouns;
let adjectives;
let verbs;
let tenses;

const subjectSelector = document.getElementById('subjectSelect');
const subjectAdjectiveSelector = document.getElementById('subjectAdjectiveSelect');
const subjectPossessiveSelector = document.getElementById('subjectPossessiveSelect');

const verbSelector = document.getElementById('verbSelect');
const tenseSelector = document.getElementById('tenseSelect');

const objectSelector = document.getElementById('objectSelect');
const objectAdjectiveSelector = document.getElementById('objectAdjectiveSelect');
const objectPossessiveSelector = document.getElementById('objectPossessiveSelect');

// Radio inputs
const subjectTypeRadio = document.querySelectorAll('input[name="subject"]');
const objectTypeRadio = document.querySelectorAll('input[name="object"]');

async function fetchData() {
    try {
        const [nounsResponse, pronounsResponse, adjectivesResponse, verbsResponse, tensesResponse] = await Promise.all([
            fetch('get_nouns'),
            fetch('get_pronouns'),
            fetch('get_adjectives'),
            fetch('get_verbs'),
            fetch('get_tenses')
        ]);

        nouns = await nounsResponse.json();
        pronouns = await pronounsResponse.json();
        adjectives = await adjectivesResponse.json();
        verbs = await verbsResponse.json();
        tenses = await tensesResponse.json();
    } catch (error) {
        console.error(error);
    }
}

function clearOptions(selector) {
    selector.innerHTML = ''; // Clear all existing options
}

function loadAdjectives(adjectives) {
    for (const adjective of adjectives) {
        subjectAdjectiveSelector.innerHTML +=
            `<option value=${adjective}>${adjective}</option>`;

        objectAdjectiveSelector.innerHTML +=
            `<option value=${adjective}>${adjective}</option>`;
    }
}

function loadPossessives(pronouns) {
    for (const pronoun of pronouns) {
        subjectPossessiveSelector.innerHTML +=
            `<option value=${pronoun}>${pronoun}</option>`;

        objectPossessiveSelector.innerHTML +=
            `<option value=${pronoun}>${pronoun}</option>`;
    }
}

function loadNounsForSubject(nouns) {
    clearOptions(subjectSelector);
    for (const noun of nouns) {
        subjectSelector.innerHTML +=
            `<option value=${noun}>${noun}</option>`;
    }
}

function loadNounsForObject(nouns) {
    clearOptions(objectSelector);
    for (const noun of nouns) {
        objectSelector.innerHTML +=
            `<option value=${noun}>${noun}</option>`;
    }
}

function loadPronounsForSubject(pronouns) {
    clearOptions(subjectSelector);
    for (const pronoun of pronouns) {
        subjectSelector.innerHTML +=
            `<option value=${pronoun}>${pronoun}</option>`;
    }
}

function loadPronounsForObject(pronouns) {
    clearOptions(objectSelector);
    for (const pronoun of pronouns) {
        objectSelector.innerHTML +=
            `<option value=${pronoun}>${pronoun}</option>`;
    }
}

function loadVerbs(verbs) {
    for (const verb of verbs) {
        verbSelector.innerHTML +=
            `<option value=${verb}>${verb}</option>`;
    }
}

function loadTenses(tenses) {
    for (const tense of tenses) {
        tenseSelector.innerHTML +=
            `<option value=${tense}>${tense}</option>`;
    }
}

function handleSubjectTypeChange() {
    const selectedType = document.querySelector('input[name="subject"]:checked').value;
    const pluralCheck = document.getElementById('subjectPluralCheck');
    const subjectAdjectiveSelect = document.getElementById('subjectAdjectiveSelect');
    const subjectPossessiveSelect = document.getElementById('subjectPossessiveSelect');

    if (selectedType === 'noun') {
        pluralCheck.disabled = false;
        subjectAdjectiveSelect.disabled = false;  // Enable adjective selection
        subjectPossessiveSelect.disabled = false;  // Enable possessive selection
        loadNounsForSubject(nouns);
    } else if (selectedType === 'pronoun') {
        pluralCheck.disabled = true;
        pluralCheck.checked = false;
        subjectAdjectiveSelect.disabled = true;  // Disable adjective selection
        subjectPossessiveSelect.disabled = true;  // Disable possessive selection
        loadPronounsForSubject(pronouns);
    }
}

function handleObjectTypeChange() {
    const selectedType = document.querySelector('input[name="object"]:checked').value;
    const pluralCheck = document.getElementById('objectPluralCheck');
    const objectAdjectiveSelect = document.getElementById('objectAdjectiveSelect');
    const objectPossessiveSelect = document.getElementById('objectPossessiveSelect');

    if (selectedType === 'noun') {
        pluralCheck.disabled = false;
        objectAdjectiveSelect.disabled = false;  // Enable adjective selection
        objectPossessiveSelect.disabled = false;  // Enable possessive selection
        loadNounsForObject(nouns);
    } else if (selectedType === 'pronoun') {
        pluralCheck.disabled = true;
        pluralCheck.checked = false;
        objectAdjectiveSelect.disabled = true;  // Disable adjective selection
        objectPossessiveSelect.disabled = true;  // Disable possessive selection
        loadPronounsForObject(pronouns);
    }
}



const generateButton = document.getElementById('generateButton');

function generateSentenceJSON() {
    const subject = subjectSelector.value;
    const isSubjectPronoun = document.querySelector('input[name="subject"]:checked').value === 'pronoun';
    const isSubjectPlural = document.getElementById('subjectPluralCheck').checked && !isSubjectPronoun; // Naive plural check
    const subjectAdjective = subjectAdjectiveSelector.value || null;
    const subjectPossessive = subjectPossessiveSelector.value || null;

    const verb = verbSelector.value;
    const tense = tenseSelector.value;

    const object = objectSelector.value;
    const isObjectPronoun = document.querySelector('input[name="object"]:checked').value === 'pronoun';
    const isObjectPlural = document.getElementById("objectPluralCheck") && !isObjectPronoun;
    const objectAdjective = objectAdjectiveSelector.value || null;
    const objectPossessive = objectPossessiveSelector.value || null;

    const isNegative = document.getElementById('negativeCheck').checked; // Assuming a checkbox for negation

    const sentenceJSON = {
        subject: subject,
        is_subject_plural: isSubjectPlural,
        is_subject_pronoun: isSubjectPronoun,
        subject_adjective: subjectAdjective,
        subject_possessive: subjectPossessive,
        verb: verb,
        tense: tense,
        is_negative: isNegative,
        object: object,
        is_object_plural: isObjectPlural,
        is_object_pronoun: isObjectPronoun,
        object_adjective: objectAdjective,
        object_possessive: objectPossessive
    };

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sentenceJSON)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data.sentence);

        const sentenceContent = document.getElementById("sentenceContent");
        sentenceContent.textContent = data.sentence;

        const modal = document.getElementById("responseModal");
        modal.style.display = "block";
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function onStart() {
    fetchData().then(() => {
        // Load initial data
        loadNounsForSubject(nouns);
        loadNounsForObject(nouns);
        loadVerbs(verbs);
        loadAdjectives(adjectives);
        loadPossessives(pronouns);
        loadTenses(tenses);

        // Initialize Select2
        const selectorsAllowedBlanked = ['#subjectAdjectiveSelect', '#subjectPossessiveSelect',
             '#objectAdjectiveSelect', '#objectPossessiveSelect' ];

        const selectorsNotAllowedBlanked = ['#subjectSelect', '#verbSelect', '#objectSelect', '#tenseSelect']

        selectorsAllowedBlanked.forEach(selector => {
            $(selector).select2({
                placeholder: "Select an option (optional)",
                allowClear: true
            });
        });

        selectorsNotAllowedBlanked.forEach(selector => {
            $(selector).select2({
                placeholder: "Select an option",
                allowClear: false
            });
        });
    });

    // Add event listeners for radio button changes
    subjectTypeRadio.forEach(radio => {
        radio.addEventListener('change', handleSubjectTypeChange);
    });

    objectTypeRadio.forEach(radio => {
        radio.addEventListener('change', handleObjectTypeChange);
    });

    generateButton.addEventListener('click', generateSentenceJSON);

    // Zamknięcie modalnego okna
    document.getElementById("closeModal").onclick = function() {
        const modal = document.getElementById("responseModal");
        modal.style.display = "none";
    }

    // Zamknięcie modalnego okna klikając poza nim
    window.onclick = function(event) {
        const modal = document.getElementById("responseModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


}

onStart();



