import { GameTierId } from "@/types/game-progress";

export type WordChallengeMode =
  | "adjective"
  | "noun"
  | "verb"
  | "missing_word"
  | "spelling"
  | "meaning"
  | "opposite"
  | "sentence_builder";

export type WordChallengeQuestion = {
  id: string;
  grade: number;
  mode: WordChallengeMode;
  tier: GameTierId;
  prompt: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

export const WORD_CHALLENGE_QUESTIONS: WordChallengeQuestion[] = [
  // Grade 1 — simple, concrete language; grammar remains implicit.
  { id:"g1-adjective-1", grade:1, mode:"adjective", tier:"novice", prompt:"The big dog ran home. Which word tells us about the dog?", options:["big","dog","ran","home"], correctOption:"big", explanation:"Big tells us what the dog is like." },
  { id:"g1-noun-1", grade:1, mode:"noun", tier:"novice", prompt:"Which word names a thing?", options:["ball","run","happy","quickly"], correctOption:"ball", explanation:"Ball is the name of a thing." },
  { id:"g1-verb-1", grade:1, mode:"verb", tier:"novice", prompt:"Which word shows an action?", options:["jump","blue","chair","small"], correctOption:"jump", explanation:"Jump is an action word." },
  { id:"g1-missing-1", grade:1, mode:"missing_word", tier:"novice", prompt:"The boy ___ to school every day.", options:["walks","blue","book","happy"], correctOption:"walks", explanation:"Walks makes the sentence tell what the boy does." },
  { id:"g1-spelling-1", grade:1, mode:"spelling", tier:"novice", prompt:"Which word is spelled correctly?", options:["skool","school","scool","sckool"], correctOption:"school", explanation:"School is the correct spelling." },
  { id:"g1-meaning-1", grade:1, mode:"meaning", tier:"novice", prompt:"What does happy mean?", options:["feeling good","feeling cold","being asleep","being lost"], correctOption:"feeling good", explanation:"Happy means feeling good or glad." },
  { id:"g1-opposite-1", grade:1, mode:"opposite", tier:"novice", prompt:"What is the opposite of hot?", options:["cold","big","fast","high"], correctOption:"cold", explanation:"Cold is the opposite of hot." },
  { id:"g1-sentence-1", grade:1, mode:"sentence_builder", tier:"novice", prompt:"Which sentence is written in the right order?", options:["Sam eats a mango.","Eats Sam mango a.","A mango Sam eats.","Mango eats a Sam."], correctOption:"Sam eats a mango.", explanation:"Sam eats a mango is a clear sentence." },

  // Grade 2 — short narratives, past tense and sequencing.
  { id:"g2-adjective-1", grade:2, mode:"adjective", tier:"novice", prompt:"Amina carried a heavy basket. Which word describes the basket?", options:["heavy","carried","basket","Amina"], correctOption:"heavy", explanation:"Heavy tells us what the basket was like." },
  { id:"g2-noun-1", grade:2, mode:"noun", tier:"novice", prompt:"Which word names a place?", options:["market","run","bright","slowly"], correctOption:"market", explanation:"Market names a place." },
  { id:"g2-verb-1", grade:2, mode:"verb", tier:"novice", prompt:"Which word tells what Musa did yesterday?", options:["played","green","football","happy"], correctOption:"played", explanation:"Played tells us the action Musa did in the past." },
  { id:"g2-missing-1", grade:2, mode:"missing_word", tier:"easy", prompt:"First, Asha washed her hands. Then she ___ lunch.", options:["ate","blue","table","quiet"], correctOption:"ate", explanation:"Ate tells what happened next." },
  { id:"g2-spelling-1", grade:2, mode:"spelling", tier:"easy", prompt:"Which word is spelled correctly?", options:["becaus","because","becouse","becuase"], correctOption:"because", explanation:"Because is the correct spelling." },
  { id:"g2-meaning-1", grade:2, mode:"meaning", tier:"easy", prompt:"What does careful mean?", options:["taking care","very noisy","very hungry","running away"], correctOption:"taking care", explanation:"Careful means taking care to avoid mistakes or harm." },
  { id:"g2-opposite-1", grade:2, mode:"opposite", tier:"easy", prompt:"What is the opposite of early?", options:["late","first","near","small"], correctOption:"late", explanation:"Late is the opposite of early." },
  { id:"g2-sentence-1", grade:2, mode:"sentence_builder", tier:"easy", prompt:"Which sentence tells what happened yesterday?", options:["Amina played outside.","Amina plays outside.","Amina will play outside.","Amina is playing outside."], correctOption:"Amina played outside.", explanation:"Played tells us the action happened in the past." },

  // Grade 3 — richer vocabulary and subject-verb agreement.
  { id:"g3-adjective-1", grade:3, mode:"adjective", tier:"easy", prompt:"The curious child opened the old box. Which word describes the child?", options:["curious","opened","box","old"], correctOption:"curious", explanation:"Curious describes the child." },
  { id:"g3-noun-1", grade:3, mode:"noun", tier:"easy", prompt:"Which word names a feeling?", options:["kindness","quickly","bright","discover"], correctOption:"kindness", explanation:"Kindness names a quality or feeling of being kind." },
  { id:"g3-verb-1", grade:3, mode:"verb", tier:"easy", prompt:"Which word shows an action in this sentence: The children explored the garden?", options:["explored","children","garden","the"], correctOption:"explored", explanation:"Explored tells what the children did." },
  { id:"g3-missing-1", grade:3, mode:"missing_word", tier:"intermediate", prompt:"The birds ___ in the tree every morning.", options:["sing","sings","singing","sang"], correctOption:"sing", explanation:"Birds is plural, so we use sing." },
  { id:"g3-spelling-1", grade:3, mode:"spelling", tier:"intermediate", prompt:"Which word is spelled correctly?", options:["becouse","becaus","because","beacause"], correctOption:"because", explanation:"Because is the correct spelling." },
  { id:"g3-meaning-1", grade:3, mode:"meaning", tier:"intermediate", prompt:"What does discover mean?", options:["find out","hide away","make smaller","forget"], correctOption:"find out", explanation:"Discover means to find something out or find something for the first time." },
  { id:"g3-opposite-1", grade:3, mode:"opposite", tier:"intermediate", prompt:"What is the opposite of ordinary?", options:["unusual","simple","usual","quiet"], correctOption:"unusual", explanation:"Unusual means not ordinary." },
  { id:"g3-sentence-1", grade:3, mode:"sentence_builder", tier:"intermediate", prompt:"Which sentence has correct subject-verb agreement?", options:["The boy runs fast.","The boy run fast.","The boys runs fast.","The boys running fast."], correctOption:"The boy runs fast.", explanation:"A singular subject such as the boy takes runs." },

  // Grade 4 — explicit grammar becomes appropriate.
  { id:"g4-adjective-1", grade:4, mode:"adjective", tier:"intermediate", prompt:"The careful nurse checked the patient. Which word is the adjective?", options:["careful","checked","nurse","patient"], correctOption:"careful", explanation:"Careful describes the noun nurse." },
  { id:"g4-noun-1", grade:4, mode:"noun", tier:"intermediate", prompt:"Which word is an abstract noun?", options:["responsibility","run","careful","quickly"], correctOption:"responsibility", explanation:"Responsibility names a duty or idea rather than a physical object." },
  { id:"g4-verb-1", grade:4, mode:"verb", tier:"intermediate", prompt:"Which word is the verb in this sentence: The farmer planted maize?", options:["planted","farmer","maize","the"], correctOption:"planted", explanation:"Planted is the action in the sentence." },
  { id:"g4-missing-1", grade:4, mode:"missing_word", tier:"advanced", prompt:"Yesterday, the pupils ___ their project.", options:["finished","finish","finishes","finishing"], correctOption:"finished", explanation:"Yesterday signals that the past tense is needed." },
  { id:"g4-spelling-1", grade:4, mode:"spelling", tier:"advanced", prompt:"Which word is spelled correctly?", options:["environment","enviroment","environmant","enviornment"], correctOption:"environment", explanation:"Environment is the correct spelling." },
  { id:"g4-meaning-1", grade:4, mode:"meaning", tier:"advanced", prompt:"What does consequence mean?", options:["a result of an action","a type of plant","a place to sleep","a way to whisper"], correctOption:"a result of an action", explanation:"A consequence is what happens as a result of something." },
  { id:"g4-opposite-1", grade:4, mode:"opposite", tier:"advanced", prompt:"What is the opposite of independent?", options:["dependent","creative","careful","confident"], correctOption:"dependent", explanation:"Dependent means relying on someone or something else." },
  { id:"g4-sentence-1", grade:4, mode:"sentence_builder", tier:"advanced", prompt:"Which sentence uses the correct tense?", options:["She visited the clinic yesterday.","She visits the clinic yesterday.","She visiting the clinic yesterday.","She visit the clinic yesterday."], correctOption:"She visited the clinic yesterday.", explanation:"Yesterday requires the past-tense verb visited." },

  // Grade 5 — conjunctions, complex ideas and richer vocabulary.
  { id:"g5-adjective-1", grade:5, mode:"adjective", tier:"advanced", prompt:"The determined athlete continued training after the difficult race. Which word describes the athlete?", options:["determined","continued","race","after"], correctOption:"determined", explanation:"Determined describes the athlete's attitude." },
  { id:"g5-noun-1", grade:5, mode:"noun", tier:"advanced", prompt:"Which word is a noun in this sentence: The community protected the river?", options:["community","protected","the","quickly"], correctOption:"community", explanation:"Community names a group of people." },
  { id:"g5-verb-1", grade:5, mode:"verb", tier:"advanced", prompt:"Which word is the main verb: The team discussed the problem carefully?", options:["discussed","team","problem","carefully"], correctOption:"discussed", explanation:"Discussed tells the action performed by the team." },
  { id:"g5-missing-1", grade:5, mode:"missing_word", tier:"advanced", prompt:"The road was flooded, ___ the driver found another route.", options:["so","because","although","if"], correctOption:"so", explanation:"So connects the problem with its result." },
  { id:"g5-spelling-1", grade:5, mode:"spelling", tier:"advanced", prompt:"Which word is spelled correctly?", options:["responsibility","responsibilty","responsability","responsiblity"], correctOption:"responsibility", explanation:"Responsibility is the correct spelling." },
  { id:"g5-meaning-1", grade:5, mode:"meaning", tier:"advanced", prompt:"What does significant mean?", options:["important","tiny","ordinary","uncertain"], correctOption:"important", explanation:"Significant means important or meaningful." },
  { id:"g5-opposite-1", grade:5, mode:"opposite", tier:"advanced", prompt:"What is the opposite of expand?", options:["contract","discover","explain","improve"], correctOption:"contract", explanation:"Contract means to become smaller or reduce in size." },
  { id:"g5-sentence-1", grade:5, mode:"sentence_builder", tier:"advanced", prompt:"Choose the sentence that uses a conjunction to show contrast.", options:["I wanted to play, but it was raining.","I wanted to play because it was raining.","I wanted to play after it was raining.","I wanted to play under it was raining."], correctOption:"I wanted to play, but it was raining.", explanation:"But joins two ideas that contrast." },

  // Grade 6 — inference, contextual meaning and more advanced sentence construction.
  { id:"g6-adjective-1", grade:6, mode:"adjective", tier:"expert", prompt:"The cautious scientist repeated the experiment. Which word describes the scientist?", options:["cautious","repeated","experiment","the"], correctOption:"cautious", explanation:"Cautious describes how the scientist approached the work." },
  { id:"g6-noun-1", grade:6, mode:"noun", tier:"expert", prompt:"Which word is an abstract noun?", options:["determination","careful","investigate","quickly"], correctOption:"determination", explanation:"Determination names a quality or state of mind." },
  { id:"g6-verb-1", grade:6, mode:"verb", tier:"expert", prompt:"Which word is the verb in this sentence: The researchers analysed the evidence?", options:["analysed","researchers","evidence","the"], correctOption:"analysed", explanation:"Analysed is the action performed by the researchers." },
  { id:"g6-missing-1", grade:6, mode:"missing_word", tier:"expert", prompt:"___ the evidence was limited, the team reached a careful conclusion.", options:["Although","Because","So","And"], correctOption:"Although", explanation:"Although introduces a contrast between limited evidence and the conclusion." },
  { id:"g6-spelling-1", grade:6, mode:"spelling", tier:"expert", prompt:"Which word is spelled correctly?", options:["interpretation","interpritation","interpretetion","interpetation"], correctOption:"interpretation", explanation:"Interpretation is the correct spelling." },
  { id:"g6-meaning-1", grade:6, mode:"meaning", tier:"expert", prompt:"In the sentence 'The evidence was significant,' what does significant mean?", options:["important","hidden","colourful","temporary"], correctOption:"important", explanation:"Here, significant means important or meaningful." },
  { id:"g6-opposite-1", grade:6, mode:"opposite", tier:"expert", prompt:"What is the opposite of contradict?", options:["agree","question","analyse","predict"], correctOption:"agree", explanation:"To agree is to hold the same view rather than contradict it." },
  { id:"g6-sentence-1", grade:6, mode:"sentence_builder", tier:"expert", prompt:"Which sentence correctly uses an introductory clause?", options:["Although it was late, we continued reading.","Although it was late we continued reading because.","Although was late, we continued reading.","It was late, although we continued reading because."], correctOption:"Although it was late, we continued reading.", explanation:"Although correctly introduces a dependent clause followed by the main clause." },
];

export function getWordChallengeQuestions(grade: string, tier: GameTierId): WordChallengeQuestion[] {
  const gradeNumber = Number.parseInt(grade.replace(/\D/g, ""), 10);
  return WORD_CHALLENGE_QUESTIONS.filter((question) => question.grade === gradeNumber && question.tier === tier);
}
