export type Lang = "fr" | "en";

const fr = {
  locale: "fr-FR",
  langLabel: "EN",
  switchLang: "Switch to English",
  tagline: "Deux plumes, une histoire, sans retour en arrière.",
  yourTurn: "Votre tour",
  leftPrefix: "Reste",
  outOfTime: "Temps écoulé",
  units: { d: "j", h: "h", m: "min" },
  welcome: {
    kicker: "Un roman à quatre mains",
    start: "Commencer à écrire",
    line1: "Chacun votre tour,",
    line2: "vous écrivez la suite de l’histoire.",
    question: "Qui sait où cela pourrait vous mener ?",
    exLabel: "Un exemple d’histoire",
    exTitle: "Le colocataire",
    withJulie: "avec Julie, votre amie",
    you: "vous",
    perWeek: "1 semaine par tour",
    chapter: "Chapitre 1",
    chTitle: "Le contrat",
    d1: "2 sept.",
    d2: "5 sept.",
    d3: "hier",
    today: "auj.",
    p1: "Le loyer était ridicule, l’appartement lumineux, et l’annonce ne posait qu’une condition : ne jamais entrer dans la chambre du fond. Emma signa le soir même.",
    p2: "Son colocataire, Hugo, était parfait. Discret, drôle, il laissait chaque matin des croissants sur la table. Elle ne le croisait presque jamais, mais elle l’entendait rire, le soir, derrière la porte du fond.",
    p3: "Un jeudi, la porte était entrouverte. Emma ne put s’en empêcher. Sur le bureau, il y avait un carnet ouvert, et en haut de la page, de l’écriture de Hugo : « Jour 41. Elle ne se doute toujours de rien. »",
    placeholder: "À vous d’écrire la suite !",
    send: "Valider",
    word: "mot",
    words: "mots",
    handOff: "À Julie d’écrire la suite",
    rewrite: "Réécrire",
    closeQ: "Et vous, quelle serait votre première phrase ?",
    closeCta: "Commencer votre propre histoire",
    legal: "Mentions légales",
    terms: "Conditions d’utilisation",
    privacy: "Confidentialité et cookies",
    back: "Retour",
    firstStory: "Votre histoire à quatre mains",
  },
  nhFirstLine: "Avec l’ami de votre choix",
  nhTitle: "Titre de l’histoire",
  nhTitlePh: "Ex : Le naufrage",
  nhTitleLater: "Choisir le titre plus tard",
  nhTurn: "Durée d’un tour",
  periods: { 3: "3 jours", 7: "1 semaine", 14: "2 semaines", 30: "1 mois" } as Record<number, string>,
  nhCtaLink: "Créer mon histoire",
  suggestLink: "Idées de début",
  suggestKicker: "Idée de début",
  suggestClose: "Fermer",
  suggestPrev: "Précédente",
  suggestNext: "Une autre",
  suggestPick: "Choisir →",
  suggestBrowse: "Parcourir les idées",
  openings: [
    "Je regarde ma montre, une bouffée de panique m’envahit. Je rassemble mes affaires en vitesse et cours aussi vite que je le peux, mais trop tard : le train démarre…",
    "On toque à ma porte. Je n’attends personne ce soir. J’ouvre prudemment la porte quand soudain un cri m’échappe. Un bébé est endormi sur mon paillasson, avec une enveloppe posée sur son ventre.",
    "Cela fait cinq fois que ce client me retourne le livre qu’il vient d’acheter. Cinq fois en un mois. Au moment de ranger le livre sur l’étagère, un bout de papier s’en échappe.",
    "Je regarde autour de moi, tout étourdi. Où suis-je ? J’aperçois mon bateau échoué à quelques mètres de moi, dans un piteux état.",
    "Ça y est, tout est prêt. Mon ventre se serre à l’idée de ce qui m’attend demain. Je glisse mon billet d’avion dans mon sac et monte me coucher.",
    "Aujourd’hui, une marque est apparue sur mon poignet. Je me souviendrai toute ma vie du regard d’effroi que ma mère a eu lorsqu’elle l’a découverte.",
  ],
  // Market test flow ("fake door")
  fd: {
    headLocked: "Votre histoire est prête",
    headWith: "Avec qui voulez-vous écrire ?",
    headIntro: "Écrivez ici le début de votre histoire",
    introName: "Indiquez le prénom de votre coauteur",
    introNamePh: "Julie",
    introStartPh: "À vous de jouer !",
    introGo: "Continuer",
    create: "Créer mon histoire",
    lead: "Il ne manque plus que votre coauteur. Ouvrez l’histoire pour obtenir votre lien d’invitation.",
    locked: "Verrouillé",
    priceNote: "1,99 €, une seule fois, pour toute l’histoire.",
    pay: "Ouvrir mon histoire pour",
    price: "1,99 €",
    headSorry: "Merci d’être là si tôt !",
    headKeep: "Votre début d’histoire",
    keepBody: "Si vous souhaitez garder votre début d’histoire, vous pouvez le copier ici et le conserver en attendant le lancement !",
    copy: "Copier le texte",
    copied: "Copié !",
    sorryBody: "Twist My Story n’est pas encore ouvert, et rien ne vous a été débité.",
    offer: "Pour vous remercier, nous vous offrons votre première histoire. Indiquez-nous votre e-mail, on vous envoie le lien au lancement !",
    emailPh: "votre@email.fr",
    submit: "Réserver mon histoire offerte",
    noThanks: "Non merci",
    errEmpty: "Indiquez votre e-mail.",
    errBad: "Cet e-mail semble incomplet.",
    headDone: "C’est noté.",
    donePre: "On vous écrit à ",
    donePost: " dès le lancement. Vous trouverez dans ce mail le lien pour commencer votre histoire gratuitement !",
    close: "Fermer",
  },
  secret: {
    bravo: "Bravo !",
    quote: "« Certaines portes ne s’ouvrent qu’une fois qu’on a osé frapper. »",
    tap: "Touchez n’importe où pour revenir",
  },
};

export type Strings = typeof fr;

const en: Strings = {
  locale: "en-US",
  langLabel: "FR",
  switchLang: "Passer en français",
  tagline: "Two pens, one story, no take-backs.",
  yourTurn: "Your turn",
  leftPrefix: "Left",
  outOfTime: "Out of time",
  units: { d: "d", h: "h", m: "m" },
  welcome: {
    kicker: "A novel for four hands",
    start: "Start writing",
    line1: "Taking turns,",
    line2: "you write what happens next.",
    question: "Who knows where it might take you?",
    exLabel: "An example story",
    exTitle: "The Roommate",
    withJulie: "with Julie, your friend",
    you: "you",
    perWeek: "1 week per turn",
    chapter: "Chapter 1",
    chTitle: "The Lease",
    d1: "Sep 2",
    d2: "Sep 5",
    d3: "yesterday",
    today: "today",
    p1: "The rent was absurdly low, the flat full of light, and the listing set only one condition: never go into the back bedroom. Emma signed that same evening.",
    p2: "Her roommate, Hugo, was perfect. Quiet, funny, he left croissants on the table every morning. She hardly ever saw him, but in the evenings she could hear him laughing behind the back door.",
    p3: "One Thursday, the door was ajar. Emma couldn’t help herself. On the desk lay an open notebook, and at the top of the page, in Hugo’s handwriting: “Day 41. She still suspects nothing.”",
    placeholder: "Your turn to write what happens next!",
    send: "Commit",
    word: "word",
    words: "words",
    handOff: "Julie’s turn to write what happens next",
    rewrite: "Rewrite",
    closeQ: "And you, what would your first line be?",
    closeCta: "Start your own story",
    legal: "Legal notice",
    terms: "Terms of use",
    privacy: "Privacy & cookies",
    back: "Back",
    firstStory: "Your four-handed story",
  },
  nhFirstLine: "With the friend of your choice",
  nhTitle: "Story title",
  nhTitlePh: "e.g. The Shipwreck",
  nhTitleLater: "Choose the title later",
  nhTurn: "Turn length",
  periods: { 3: "3 days", 7: "1 week", 14: "2 weeks", 30: "1 month" },
  nhCtaLink: "Create my story",
  suggestLink: "Opening ideas",
  suggestKicker: "Opening idea",
  suggestClose: "Close",
  suggestPrev: "Previous",
  suggestNext: "Another one",
  suggestPick: "Choose →",
  suggestBrowse: "Browse ideas",
  openings: [
    "I look at my watch and a wave of panic washes over me. I grab my things and run as fast as I can, but too late: the train is pulling out…",
    "Someone knocks at my door. I’m not expecting anyone tonight. I open it carefully, and a cry escapes me. A baby is asleep on my doormat, an envelope resting on its belly.",
    "That’s the fifth time this customer has returned the book he just bought. Five times in a month. As I put it back on the shelf, a scrap of paper slips out.",
    "I look around, dazed. Where am I? A few yards away, I can see my boat run aground, in a sorry state.",
    "That’s it, everything’s ready. My stomach knots at the thought of what awaits me tomorrow. I slip my plane ticket into my bag and go up to bed.",
    "Today, a mark appeared on my wrist. I’ll remember for the rest of my life the look of horror on my mother’s face when she saw it.",
  ],
  fd: {
    headLocked: "Your story is ready",
    headWith: "Who would you like to write with?",
    headIntro: "Write the beginning of your story here",
    introName: "Enter your co-author’s first name",
    introNamePh: "Julie",
    introStartPh: "Your move!",
    introGo: "Continue",
    create: "Create my story",
    lead: "All it needs now is your co-author. Open the story to get your invitation link.",
    locked: "Locked",
    priceNote: "€1.99, once, for the whole story.",
    pay: "Open my story for",
    price: "€1.99",
    headSorry: "Thanks for being here so early!",
    headKeep: "Your story opening",
    keepBody: "If you’d like to keep your story opening, you can copy it here and save it until launch!",
    copy: "Copy text",
    copied: "Copied!",
    sorryBody: "Twist My Story isn’t open yet, and you haven’t been charged anything.",
    offer: "To thank you, your first story is on us. Just give us your e-mail, and we’ll send you the link at launch!",
    emailPh: "you@email.com",
    submit: "Save my free story",
    noThanks: "No thanks",
    errEmpty: "Enter your e-mail.",
    errBad: "This e-mail doesn’t look right.",
    headDone: "Noted.",
    donePre: "We’ll write to ",
    donePost: " at launch. Inside, you’ll find the link to start your story for free!",
    close: "Close",
  },
  secret: {
    bravo: "Well done!",
    quote: "“Some doors only open once you’ve dared to knock.”",
    tap: "Tap anywhere to go back",
  },
};

export const STR: Record<Lang, Strings> = { fr, en };

export const PERIODS = [3, 7, 14, 30];

/** Compact time left: "6d 23h", "4h 12min", "3min". */
export function durLeft(L: Strings, ms: number): string {
  const DAY = 864e5, HOUR = 36e5, MIN = 6e4, U = L.units;
  if (ms <= 0) return L.outOfTime;
  const d = Math.floor(ms / DAY), h = Math.floor((ms % DAY) / HOUR), m = Math.floor((ms % HOUR) / MIN);
  if (d) return `${d}${U.d} ${h}${U.h}`;
  if (h) return `${h}${U.h} ${m}${U.m}`;
  return `${Math.max(m, 1)}${U.m}`;
}

/** Splits a text into paragraphs; a paragraph starting with a tab is indented. */
export function splitParas(text: string) {
  const s = String(text || ""), tabbed = s.includes("\t");
  return s
    .split(/\n+/)
    .map((t) => ({ text: t.trim(), ind: tabbed ? /^\s*\*?\t/.test(t) : true }))
    .filter((p) => p.text)
    .map((p) => ({ text: p.text, indent: p.ind ? "1.6em" : "0px" }));
}

const secretNorm = (s: string) =>
  " " +
  (s || "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim() +
  " ";

/** Small secret hidden in the sample story. */
export const isSecret = (s: string) => {
  const n = secretNorm(s);
  return n.includes(" emma ") && n.includes(" il savait ") && n.length < 400;
};
