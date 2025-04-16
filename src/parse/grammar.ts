// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var word_number: any;
declare var word_content: any;
declare var word_preposition: any;
declare var word_preverb: any;
declare var word_unmarked_subject: any;
declare var word_modifier_only: any;

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

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "Main", "symbols": ["Vocative"], "postprocess": id},
    {"name": "Main", "symbols": ["Sentence"], "postprocess": id},
    {"name": "Main", "symbols": ["Vocative", "Main"], "postprocess": makeBranch("main")},
    {"name": "Vocative", "symbols": ["GeneralSubject", "WordVocativeMarker"], "postprocess": makeBranch("vocative")},
    {"name": "Sentence", "symbols": ["WordSentenceStarter", "Sentence"], "postprocess": makeBranch("clause")},
    {"name": "Sentence", "symbols": ["Context", "Sentence"], "postprocess": makeBranch("clause")},
    {"name": "Sentence", "symbols": ["WordEmphasis", "Sentence"], "postprocess": makeBranch("clause")},
    {"name": "Sentence", "symbols": ["Clause_any"], "postprocess": id},
    {"name": "Context", "symbols": ["GeneralSubject", "WordContextMarker"], "postprocess": makeBranch("context_phrase")},
    {"name": "Context", "symbols": ["Clause_strict", "WordContextMarker"], "postprocess": makeBranch("context_clause")},
    {"name": "Clause_any", "symbols": ["GeneralSubject"], "postprocess": id},
    {"name": "Clause_any", "symbols": ["MarkedSubject", "Predicates_li"], "postprocess": makeBranch("clause_marked_subject")},
    {"name": "Clause_strict", "symbols": ["MarkedSubject", "Predicates_li"], "postprocess": makeBranch("clause_marked_subject")},
    {"name": "Clause_any$subexpression$1", "symbols": ["UnmarkedSubject"], "postprocess": makeLabelled("subject")},
    {"name": "Clause_any", "symbols": ["Clause_any$subexpression$1", "Predicates_none"], "postprocess": makeBranch("clause_unmarked_subject")},
    {"name": "Clause_strict$subexpression$1", "symbols": ["UnmarkedSubject"], "postprocess": makeLabelled("subject")},
    {"name": "Clause_strict", "symbols": ["Clause_strict$subexpression$1", "Predicates_none"], "postprocess": makeBranch("clause_unmarked_subject")},
    {"name": "Clause_any", "symbols": ["GeneralSubject", "Predicates_o"], "postprocess": makeBranch("clause_optative")},
    {"name": "Clause_strict", "symbols": ["GeneralSubject", "Predicates_o"], "postprocess": makeBranch("clause_optative")},
    {"name": "Clause_any", "symbols": ["Predicates_o"], "postprocess": makeLabelled("clause_imperative")},
    {"name": "Clause_strict", "symbols": ["Predicates_o"], "postprocess": makeLabelled("clause_imperative")},
    {"name": "GeneralSubject", "symbols": ["MarkedSubject"], "postprocess": id},
    {"name": "GeneralSubject", "symbols": ["UnmarkedSubject"], "postprocess": id},
    {"name": "MarkedSubject$subexpression$1", "symbols": ["WordMarkedSubjectHead"], "postprocess": makeLabelled("head")},
    {"name": "MarkedSubject", "symbols": ["MarkedSubject$subexpression$1"], "postprocess": makeLabelled("subject")},
    {"name": "MarkedSubject", "symbols": ["PiPhrase_multiple"], "postprocess": makeLabelled("subject")},
    {"name": "MarkedSubject", "symbols": ["MultipleSubjects_none"], "postprocess": id},
    {"name": "MultipleSubjects_none$subexpression$1", "symbols": ["Phrase"], "postprocess": makeLabelled("subject")},
    {"name": "MultipleSubjects_none", "symbols": ["MultipleSubjects_none$subexpression$1", "MultipleSubjects_marked"], "postprocess": makeRoseFromBranch("& subjects")},
    {"name": "MultipleSubjects_marked", "symbols": ["EnSubject"], "postprocess": id},
    {"name": "MultipleSubjects_marked", "symbols": ["EnSubject", "MultipleSubjects_marked"], "postprocess": makeRoseFromBranch("& subjects")},
    {"name": "EnSubject", "symbols": ["SubjectMarker", "Phrase"], "postprocess": makeBranch("subject")},
    {"name": "SubjectMarker", "symbols": ["WordSubjectMarker"], "postprocess": id},
    {"name": "SubjectMarker", "symbols": ["WordDisjunctMarker"], "postprocess": id},
    {"name": "UnmarkedSubject", "symbols": ["WordUnmarkedSubject"], "postprocess": makeLabelled("head")},
    {"name": "Predicates_li", "symbols": ["Predicate_li"], "postprocess": id},
    {"name": "Predicates_none", "symbols": ["Predicate_none"], "postprocess": id},
    {"name": "Predicates_o", "symbols": ["Predicate_o"], "postprocess": id},
    {"name": "Predicates_marked", "symbols": ["Predicate_marked"], "postprocess": id},
    {"name": "Predicates_li", "symbols": ["Predicate_li", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_none", "symbols": ["Predicate_none", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_o", "symbols": ["Predicate_o", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicates_marked", "symbols": ["Predicate_marked", "Predicates_marked"], "postprocess": makeRoseFromBranch("& predicates")},
    {"name": "Predicate_li", "symbols": ["WordIndicativeMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_o", "symbols": ["WordDeonticMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_marked", "symbols": ["WordPredicateMarker", "PreverbPhrase"], "postprocess": makeBranch("predicate")},
    {"name": "Predicate_none", "symbols": ["PreverbPhrase"], "postprocess": makeLabelled("predicate")},
    {"name": "PreverbPhrase", "symbols": ["Preverb", "PreverbPhrase"], "postprocess": makeBranch("preverb_phrase")},
    {"name": "PreverbPhrase", "symbols": ["VerbPhrase"], "postprocess": id},
    {"name": "Preverb", "symbols": ["WordPreverb"], "postprocess": id},
    {"name": "Preverb", "symbols": ["WordPreverb", "WordNegator"], "postprocess": makeBranch("pv")},
    {"name": "VerbPhrase", "symbols": ["VerbPhraseTransitive"], "postprocess": id},
    {"name": "VerbPhrase", "symbols": ["VerbPhraseIntransitive"], "postprocess": id},
    {"name": "VerbPhrase", "symbols": ["VerbPhrasePrepositional"], "postprocess": id},
    {"name": "VerbPhraseTransitive", "symbols": ["Phrase", "Objects"], "postprocess": makeBranch("verb_phrase_transitive")},
    {"name": "VerbPhraseIntransitive", "symbols": ["Phrase"], "postprocess": makeLabelled("verb_phrase_intransitive")},
    {"name": "VerbPhraseIntransitive", "symbols": ["Phrase", "Prepositions"], "postprocess": makeBranch("verb_phrase_intransitive")},
    {"name": "VerbPhrasePrepositional", "symbols": ["PrepositionPhrase"], "postprocess": makeLabelled("verb_phrase_prepositional")},
    {"name": "VerbPhrasePrepositional", "symbols": ["PrepositionPhrase", "Prepositions"], "postprocess": makeBranch("verb_phrase_prepositional")},
    {"name": "Objects$ebnf$1", "symbols": ["ObjectPhrase"]},
    {"name": "Objects$ebnf$1", "symbols": ["Objects$ebnf$1", "ObjectPhrase"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Objects", "symbols": ["Objects$ebnf$1"], "postprocess": makeRoseOptional("& objects")},
    {"name": "ObjectPhrase", "symbols": ["Object"], "postprocess": makeLabelled("object_phrase")},
    {"name": "ObjectPhrase", "symbols": ["Object", "Prepositions"], "postprocess": makeBranch("object_phrase")},
    {"name": "Object", "symbols": ["WordObjectMarker", "DisjunctPhrase"], "postprocess": makeBranch("e")},
    {"name": "Prepositions$ebnf$1", "symbols": ["PrepositionPhrase"]},
    {"name": "Prepositions$ebnf$1", "symbols": ["Prepositions$ebnf$1", "PrepositionPhrase"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Prepositions", "symbols": ["Prepositions$ebnf$1"], "postprocess": makeRoseOptional("& prepositions")},
    {"name": "PrepositionPhrase", "symbols": ["Preposition", "DisjunctPhrase"], "postprocess": makeBranch("preposition_phrase")},
    {"name": "Preposition", "symbols": ["WordPreposition"], "postprocess": id},
    {"name": "Preposition", "symbols": ["WordPreposition", "WordNegator"], "postprocess": makeBranch("prep")},
    {"name": "DisjunctPhrase", "symbols": ["Phrase"], "postprocess": id},
    {"name": "DisjunctPhrase$subexpression$1", "symbols": ["Phrase"], "postprocess": makeLabelled("option")},
    {"name": "DisjunctPhrase", "symbols": ["DisjunctPhrase$subexpression$1", "DisjunctPhrases"], "postprocess": makeRoseFromBranch("& disjuncts")},
    {"name": "DisjunctPhrases", "symbols": ["AnuPhrase"], "postprocess": id},
    {"name": "DisjunctPhrases", "symbols": ["AnuPhrase", "DisjunctPhrases"], "postprocess": makeRoseFromBranch("& disjuncts")},
    {"name": "AnuPhrase", "symbols": ["WordDisjunctMarker", "Phrase"], "postprocess": makeBranch("option")},
    {"name": "Phrase", "symbols": ["PiPhrase_any"], "postprocess": id},
    {"name": "PiPhrase_multiple", "symbols": ["NanpaPhrase_multiple"], "postprocess": id},
    {"name": "PiPhrase_any", "symbols": ["NanpaPhrase_any"], "postprocess": id},
    {"name": "PiPhrase_multiple", "symbols": ["PiPhrase_any", "PiModifier"], "postprocess": makeBranch("phrase")},
    {"name": "PiPhrase_any", "symbols": ["PiPhrase_any", "PiModifier"], "postprocess": makeBranch("phrase")},
    {"name": "PiModifier", "symbols": ["WordRegrouper", "PiPhrase_multiple"], "postprocess": makeBranch("pi")},
    {"name": "NanpaPhrase_multiple", "symbols": ["SimplePhrase_multiple"], "postprocess": id},
    {"name": "NanpaPhrase_any", "symbols": ["SimplePhrase_any"], "postprocess": id},
    {"name": "NanpaPhrase_multiple", "symbols": ["NanpaPhrase_any", "Ordinal"], "postprocess": makeBranch("phrase")},
    {"name": "NanpaPhrase_any", "symbols": ["NanpaPhrase_any", "Ordinal"], "postprocess": makeBranch("phrase")},
    {"name": "Ordinal", "symbols": ["WordOrdinalMarker", "Number"], "postprocess": makeBranch("ordinal")},
    {"name": "SimplePhrase_multiple", "symbols": ["SimplePhrase_any", "WordModifier"], "postprocess": makeBranch("phrase")},
    {"name": "SimplePhrase_any", "symbols": ["SimplePhrase_any", "WordModifier"], "postprocess": makeBranch("phrase")},
    {"name": "SimplePhrase_any", "symbols": ["WordHead"], "postprocess": makeLabelled("head")},
    {"name": "Number$ebnf$1", "symbols": ["WordNumber"]},
    {"name": "Number$ebnf$1", "symbols": ["Number$ebnf$1", "WordNumber"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "Number", "symbols": ["Number$ebnf$1"], "postprocess": makeRose("number")},
    {"name": "WordNumber", "symbols": [(lexer.has("word_number") ? {type: "word_number"} : word_number)], "postprocess": makeLeaf("#")},
    {"name": "WordEmphasis", "symbols": [{"literal":"a"}], "postprocess": makeLeaf("emph")},
    {"name": "WordObjectMarker", "symbols": [{"literal":"e"}], "postprocess": makeLeaf("obj")},
    {"name": "WordRegrouper", "symbols": [{"literal":"pi"}], "postprocess": makeLeaf("regroup")},
    {"name": "WordOrdinalMarker", "symbols": [{"literal":"nanpa"}], "postprocess": makeLeaf("ord")},
    {"name": "WordContextMarker", "symbols": [{"literal":"la"}], "postprocess": makeLeaf("ctx")},
    {"name": "WordSubjectMarker", "symbols": [{"literal":"en"}], "postprocess": makeLeaf("conj")},
    {"name": "WordNegator$ebnf$1", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordNegator$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "WordNegator", "symbols": [{"literal":"ala"}, "WordNegator$ebnf$1"], "postprocess": makeLeaf("neg")},
    {"name": "WordDisjunctMarker", "symbols": [{"literal":"anu"}], "postprocess": makeLeaf("or")},
    {"name": "WordPredicateMarker", "symbols": ["WordIndicativeMarker"], "postprocess": id},
    {"name": "WordPredicateMarker", "symbols": ["WordDeonticMarker"], "postprocess": id},
    {"name": "WordPredicateMarker", "symbols": ["WordDisjunctMarker"], "postprocess": id},
    {"name": "WordIndicativeMarker", "symbols": [{"literal":"li"}], "postprocess": makeLeaf("ind")},
    {"name": "WordDeonticMarker", "symbols": [{"literal":"o"}], "postprocess": makeLeaf("deo")},
    {"name": "WordVocativeMarker", "symbols": [{"literal":"o"}], "postprocess": makeLeaf("voc")},
    {"name": "WordHead", "symbols": ["WordMarkedSubjectHead"], "postprocess": id},
    {"name": "WordHead", "symbols": ["WordUnmarkedSubject"], "postprocess": id},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_content") ? {type: "word_content"} : word_content)], "postprocess": makeLeaf("cont")},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_preposition") ? {type: "word_preposition"} : word_preposition)], "postprocess": makeLeaf("cont")},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_preverb") ? {type: "word_preverb"} : word_preverb)], "postprocess": makeLeaf("cont")},
    {"name": "WordMarkedSubjectHead", "symbols": [(lexer.has("word_number") ? {type: "word_number"} : word_number)], "postprocess": makeLeaf("cont")},
    {"name": "WordUnmarkedSubject", "symbols": [(lexer.has("word_unmarked_subject") ? {type: "word_unmarked_subject"} : word_unmarked_subject)], "postprocess": makeLeaf("cont")},
    {"name": "WordModifier", "symbols": [(lexer.has("word_modifier_only") ? {type: "word_modifier_only"} : word_modifier_only)], "postprocess": makeLeaf("cont")},
    {"name": "WordModifier", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordModifier", "symbols": ["WordHead"], "postprocess": id},
    {"name": "WordPreverb$ebnf$1", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordPreverb$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "WordPreverb", "symbols": [(lexer.has("word_preverb") ? {type: "word_preverb"} : word_preverb), "WordPreverb$ebnf$1"], "postprocess": makeLeaf("pv")},
    {"name": "WordPreposition$ebnf$1", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordPreposition$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "WordPreposition", "symbols": [(lexer.has("word_preposition") ? {type: "word_preposition"} : word_preposition), "WordPreposition$ebnf$1"], "postprocess": makeLeaf("prep")},
    {"name": "WordSentenceStarter$ebnf$1", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordSentenceStarter$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "WordSentenceStarter", "symbols": [{"literal":"taso"}, "WordSentenceStarter$ebnf$1"], "postprocess": makeLeaf("start")},
    {"name": "WordSentenceStarter$ebnf$2", "symbols": ["WordEmphasis"], "postprocess": id},
    {"name": "WordSentenceStarter$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "WordSentenceStarter", "symbols": [{"literal":"kin"}, "WordSentenceStarter$ebnf$2"], "postprocess": makeLeaf("start")}
  ],
  ParserStart: "Main",
};

export default grammar;
