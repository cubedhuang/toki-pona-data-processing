@preprocessor typescript

@{%
import {
	makeLeaf,
	makeBranch,
	makeLabelled,
	makeRose,
	makeRoseOptional,
	makeRoseFromBranch,
} from "./tree";

import { TokiPonaLexer } from "./lex";

const lexer = new TokiPonaLexer();
%}

@lexer lexer

Main -> Vocative {% id %}
Main -> Sentence {% id %}
Main -> Vocative Main {% makeBranch("main") %}

Vocative -> GeneralSubject WordVocativeMarker {% makeBranch("vocative") %}

Sentence -> Clause<any> {% id %}
Sentence -> Context Sentence {% makeBranch("clause") %}
Sentence -> WordEmphasis Sentence {% makeBranch("clause") %}
# Sentence -> Sentence WordEmphasis {% makeBranch("clause") %}

Context -> GeneralSubject WordContextMarker {% makeBranch("context_phrase") %}
Context -> Clause<strict> WordContextMarker {% makeBranch("context_clause") %}

### Clauses

# S {any/strict} is whether or not a predicate is required
Clause<any> -> GeneralSubject {% id %}
Clause<P> -> MarkedSubject Predicates<li> {% makeBranch("clause_marked_subject") %}
Clause<P> -> (UnmarkedSubject {% makeLabelled("subject") %}) Predicates<none> {% makeBranch("clause_unmarked_subject") %}
Clause<P> -> GeneralSubject Predicates<o> {% makeBranch("clause_optative") %}
Clause<P> -> Predicates<o> {% makeLabelled("clause_imperative") %}

GeneralSubject -> MarkedSubject {% id %}
GeneralSubject -> UnmarkedSubject {% id %}

MarkedSubject -> WordMarkedSubjectHead {% makeLabelled("subject") %}
MarkedSubject -> PiPhrase<multiple> {% makeLabelled("subject") %}
MarkedSubject -> MultipleSubjects<none> {% id %}

# M {none/marked} is whether or not the subject is preceeded by "en"
MultipleSubjects<none> -> (Phrase {% makeLabelled("subject") %}) MultipleSubjects<marked> {% makeRoseFromBranch("& subjects") %}
MultipleSubjects<marked> -> EnSubject {% id %}
MultipleSubjects<marked> -> EnSubject MultipleSubjects<marked> {% makeRoseFromBranch("& subjects") %}
EnSubject -> SubjectMarker Phrase {% makeBranch("subject") %}

SubjectMarker -> WordSubjectMarker {% id %}
SubjectMarker -> WordDisjunctMarker {% id %}

UnmarkedSubject -> WordUnmarkedSubject {% makeLabelled("head") %}

# M {none/li/o/marked} is what the predicate can be marked with
Predicates<M> -> Predicate<M> {% id %}
Predicates<M> -> Predicate<M> Predicates<marked> {% makeRoseFromBranch("& predicates") %}

Predicate<li> -> WordIndicativeMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<o> -> WordDeonticMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<marked> -> WordPredicateMarker PreverbPhrase {% makeBranch("predicate") %}
Predicate<none> -> PreverbPhrase {% makeLabelled("predicate") %}

### Predicates

PreverbPhrase -> Preverb PreverbPhrase {% makeBranch("preverb_phrase") %}
PreverbPhrase -> VerbPhrase {% id %}

Preverb -> WordPreverb {% id %}
Preverb -> WordPreverb WordNegator {% makeBranch("pv") %}

# T {tr/intr/prep} is the type of predicate
VerbPhrase -> VerbPhraseTransitive {% id %}
VerbPhrase -> VerbPhraseIntransitive {% id %}
VerbPhrase -> VerbPhrasePrepositional {% id %}

VerbPhraseTransitive -> Phrase Objects {% makeBranch("verb_phrase_transitive") %}
VerbPhraseIntransitive -> Phrase {% makeLabelled("verb_phrase_intransitive") %}
VerbPhraseIntransitive -> Phrase Prepositions {% makeBranch("verb_phrase_intransitive") %}
VerbPhrasePrepositional -> PrepositionPhrase {% makeLabelled("verb_phrase_prepositional") %}
VerbPhrasePrepositional -> PrepositionPhrase Prepositions {% makeBranch("verb_phrase_prepositional") %}

Objects -> ObjectPhrase:+ {% makeRoseOptional("& objects") %}
ObjectPhrase -> Object {% makeLabelled("object_phrase") %}
ObjectPhrase -> Object Prepositions {% makeBranch("object_phrase") %}
Object -> WordObjectMarker DisjunctPhrase {% makeBranch("e") %}

Prepositions -> PrepositionPhrase:+ {% makeRoseOptional("& prepositions") %}
PrepositionPhrase -> Preposition DisjunctPhrase {% makeBranch("preposition_phrase") %}

Preposition -> WordPreposition {% id %}
Preposition -> WordPreposition WordNegator {% makeBranch("prep") %}

### Phrases

DisjunctPhrase -> Phrase {% id %}
DisjunctPhrase -> (Phrase {% makeLabelled("option") %}) DisjunctPhrases {% makeRoseFromBranch("& disjuncts") %}
DisjunctPhrases -> AnuPhrase {% id %}
DisjunctPhrases -> AnuPhrase DisjunctPhrases {% makeRoseFromBranch("& disjuncts") %}
AnuPhrase -> WordDisjunctMarker Phrase {% makeBranch("option") %}

Phrase -> PiPhrase<any> {% id %}

# M {any/multiple} is whether or not some modifier is required
PiPhrase<M> -> NanpaPhrase<M> {% id %}
PiPhrase<M> -> PiPhrase<any> PiModifier {% makeBranch("phrase") %}

PiModifier -> WordRegrouper PiPhrase<multiple> {% makeBranch("pi") %}

NanpaPhrase<M> -> SimplePhrase<M> {% id %}
NanpaPhrase<M> -> NanpaPhrase<any> Ordinal {% makeBranch("phrase") %}

Ordinal -> WordOrdinalMarker Number {% makeBranch("ordinal") %}

SimplePhrase<M> -> SimplePhrase<any> WordModifier {% makeBranch("phrase") %}
SimplePhrase<any> -> WordHead {% makeLabelled("head") %}

Number -> WordNumber:+ {% makeRose("number") %}
WordNumber -> %word_number {% makeLeaf("#") %}

### Words

WordEmphasis -> "a" {% makeLeaf("emph") %}
WordObjectMarker -> "e" {% makeLeaf("obj") %}
WordRegrouper -> "pi" {% makeLeaf("regroup") %}
WordOrdinalMarker -> "nanpa" {% makeLeaf("ord") %}
WordContextMarker -> "la" {% makeLeaf("ctx") %}
WordSubjectMarker -> "en" {% makeLeaf("conj") %}
WordNegator -> "ala" WordEmphasis:?  {% makeLeaf("neg") %}
WordDisjunctMarker -> "anu" {% makeLeaf("or") %}

WordPredicateMarker -> WordIndicativeMarker {% id %}
WordPredicateMarker -> WordDeonticMarker {% id %}
WordPredicateMarker -> WordDisjunctMarker {% id %}

WordIndicativeMarker -> "li" {% makeLeaf("ind") %}
WordDeonticMarker -> "o" {% makeLeaf("deo") %}
WordVocativeMarker -> "o" {% makeLeaf("voc") %}

WordHead -> WordMarkedSubjectHead {% id %}
WordHead -> WordUnmarkedSubject {% id %}

WordMarkedSubjectHead -> %word_content {% makeLeaf("cont") %}
WordMarkedSubjectHead -> %word_preposition {% makeLeaf("cont") %}
WordMarkedSubjectHead -> %word_preverb {% makeLeaf("cont") %}
WordMarkedSubjectHead -> %word_number {% makeLeaf("cont") %}
WordUnmarkedSubject -> %word_unmarked_subject {% makeLeaf("cont") %}

WordModifier -> %word_modifier_only {% makeLeaf("cont") %}
WordModifier -> WordEmphasis {% id %}
WordModifier -> WordHead {% id %}

WordPreverb -> %word_preverb WordEmphasis:? {% makeLeaf("pv") %}
WordPreposition -> %word_preposition WordEmphasis:? {% makeLeaf("prep") %}
