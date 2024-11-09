import json
from flask import Flask, render_template, jsonify

app = Flask(__name__)

with open('data/verbs.json', 'r') as verbs_file:
    verbs = json.load(verbs_file)

with open('data/nouns.json', 'r') as nouns_file:
    nouns = json.load(nouns_file)

with open('data/adjectives.json', 'r') as adjectives_file:
    adjectives = json.load(adjectives_file)

with open('data/pronouns.json', 'r') as pronouns_file:
    pronouns = json.load(pronouns_file)

sentence_params = {"subject" : "cat", 'is_subject_plural' : False, "is_subject_pronoun" : False, "subject_adjective" : "sweet",
                   "subject_possessive" : "I", "verb" : "eat", "tense" : "past_simple", "is_negative": True,
                   "object" : "fish", "is_object_plural" : True,"is_object_pronoun" : False, "object_adjective" : "good",
                   "object_possessive" : "you",}

def get_correct_be_form(subject, is_plural, tense):
    if tense == "present":
        if subject == "I":
            return "am"
        elif subject in ["you", "we", "they"] or is_plural:
            return "are"
        elif subject in ["it", "he", "she"] or not is_plural:
            return "is"
    elif tense == "past":
        if subject == "you" or is_plural:
            return "were"
        else:
            return "was"
    else:
        return "Incorrect tense"

def process_noun(noun, is_plural, adjective, possessive):
    forms = nouns[noun]

    if is_plural:
        result = forms["plural"]
    else:
        result = forms["singular"]

    if adjective:
        result = adjective + " " + result

    if possessive:
        result = pronouns[possessive]["possessive_adjective"] + " " + result

    return result


def generate_sentence(sentence_params):

    subject = sentence_params['subject']
    is_subject_plural = sentence_params['is_subject_plural']
    is_subject_pronoun = sentence_params['is_subject_pronoun']
    subject_adjective = sentence_params['subject_adjective']
    subject_possessive = sentence_params['subject_possessive']
    verb = sentence_params['verb']
    tense = sentence_params['tense']
    is_negative = sentence_params['is_negative']
    object_ = sentence_params['object']
    is_object_plural = sentence_params['is_object_plural']
    is_object_pronoun = sentence_params['is_object_pronoun']
    object_adjective = sentence_params['object_adjective']
    object_possessive = sentence_params['object_possessive']

    form = "s_form" if not is_subject_plural and (not is_subject_pronoun or subject in ["he", "she", "it"]) else "base"
    negative = " not" if is_negative else ""

    if is_subject_pronoun:
        subject_part = pronouns[subject]["subject"]
    else:
        subject_part = process_noun(subject, is_subject_plural, subject_adjective, subject_possessive)

    sentence = subject_part

    if tense == "present_simple":
        if verb == "be":
            verb_part = get_correct_be_form(subject, is_subject_plural, "present") + negative
        else:
            if is_negative:
                verb_part = verbs["do"][form] + negative + " " + verbs[verb]["base"]
            else:
                verb_part = verbs[verb][form]
    elif tense == "present_continuous":
        verb_part = get_correct_be_form(subject, is_subject_plural, "present") + negative + " " + verbs[verb]["ing_form"]
    elif tense == "present_perfect":
        verb_part = verbs["have"][form] + negative + " " +  verbs[verb]["past_participle"]
    elif tense == "present_perfect_continuous":
        verb_part = verbs["have"][form] + negative+ " been " + verbs[verb]["ing_form"]
    elif tense == "past_simple":
        if verb == "be":
            verb_part = get_correct_be_form(subject, is_subject_plural, "past") + negative
        else:
            if is_negative:
                verb_part = verbs["do"]["past"] + negative + " " + verbs[verb]["base"]
            else:
                verb_part = verbs[verb]["past"]
    elif tense == "past_continuous":
        verb_part = get_correct_be_form(subject, is_subject_plural, "past") + negative + " " + verbs[verb]["ing_form"]
    elif tense == "past_perfect":
        verb_part = "had " + negative + verbs[verb]["past_participle"]
    elif tense == "past_perfect_continuous":
        verb_part = "had" + negative + " been" + verbs[verb]["ing_form"]
    elif tense == "future_simple":
        verb_part = "will " + negative + verbs[verb]["base"]
    elif tense == "going_to":
        verb_part = get_correct_be_form(subject, is_subject_plural, "present") + negative + " going to " + verbs[verb]["base"]
    else:
        return "Incorrect tense"


    sentence = sentence + " " + verb_part

    if is_object_pronoun:
        object_part = pronouns[object_]["object"]
    else:
        object_part = process_noun(object_, is_object_plural, object_adjective, object_possessive)

    sentence = sentence + " " + object_part

    return sentence

print(generate_sentence(sentence_params))

@app.route('/get_verbs', methods=['GET'])
def get_verbs():
    return jsonify(list(verbs.keys()))

@app.route('/get_nouns', methods=['GET'])
def get_nouns():
    return jsonify(list(nouns.keys()))

@app.route('/get_adjectives', methods=['GET'])
def get_adjectives():
    return jsonify(adjectives.keys())

@app.route('/get_pronouns', methods=['GET'])
def get_pronouns():
    return jsonify(list(pronouns.keys()))

@app.route('/')
def mainPage():  # put application's code here
    return render_template("mainPage.html")


if __name__ == '__main__':
    app.run(debug=True)
