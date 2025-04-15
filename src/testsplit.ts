import { ilo } from './ilo';
import { ScoredMessage } from './types';

const message = `I'd love some feedback on this dictionary format I thought of.
Meaning of symbols: 
  - Black 'pu' in sitelen pona: this word/compound was described in pu.
  - Red 'pu' in definition: this definition was described in pu, but actual use differs.
  - Red 'kulupu' in definition: this definition was not described in pu, but reflects actual use.
  - n = noun, v = verb, prv = pre-verb`;

const { score: messageScore } = ilo.makeScorecard(message);

const sentences = ilo.makeScorecards(message);

console.log(sentences);
