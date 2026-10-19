/* ფაქტჩეკერი — script.js
   ყველაფერი მუშაობს ბრაუზერში. ბაზა ხელით არის შედგენილი; ინტერნეტში ძებნა არ ხდება. */
"use strict";

/* ===== 1. განსჯის კატეგორიები ===== */
const VERDICTS = {
  supported:  { label: "დადასტურებულია", icon: "✓", css: "v-supported",  desc: "მხარდაჭერილია სანდო მტკიცებულებებით." },
  false:      { label: "მცდარია", icon: "✕", css: "v-false", desc: "ეწინააღმდეგება სანდო მტკიცებულებებს." },
  misleading: { label: "შეცდომაში შემყვანია", icon: "!", css: "v-misleading", desc: "ნაწილობრივ სწორია, მაგრამ მნიშვნელოვანი კონტექსტი აკლია." },
  unverified: { label: "მტკიცებულება არასაკმარისია", icon: "?", css: "v-unverified", desc: "დასკვნის გასაკეთებლად საკმარისი მონაცემი არ არის." }
};

/* ===== 2. მტკიცებების ბაზა =====
   aliases — ზუსტი ალტერნატიული ფორმულირებები. შედარება ხდება მხოლოდ სრულ ტექსტზე,
   ამიტომ ერთი შემთხვევითი სიტყვა დასკვნას ვერ გამოიწვევს. */
const CLAIMS = [
  {
    id: "c1",
    claim: "ადამიანები ტვინის მხოლოდ 10%-ს იყენებენ.",
    aliases: ["ადამიანი ტვინის მხოლოდ 10%-ს იყენებს", "ადამიანები თავის ტვინის მხოლოდ 10 პროცენტს იყენებენ", "ჩვენ ტვინის მხოლოდ 10%-ს ვიყენებთ", "ტვინის 90% არ გამოიყენება"],
    verdict: "false",
    strength: "მაღალი",
    summary: "ეს ცნობილი მითია. ტვინის სკანირება აჩვენებს, რომ დროთა განმავლობაში აქტივობა თითქმის ყველა უბანში ხდება.",
    why: "ტვინის სხვადასხვა უბანი სხვადასხვა საქმიანობისას აქტიურდება: მოძრაობა, მეტყველება, მხედველობა, მეხსიერება, ძილიც კი. მეცნიერებმა „უმოქმედო“ ზონები, რომლებიც სხვა დავალებას ელოდება, ვერ იპოვეს. აქტივობის სიძლიერე დამოკიდებულია საქმიანობასა და კონტექსტზე, მაგრამ იდეა, რომ 90% გამოუყენებელია, არასწორია.",
    sources: [
      { title: "Scientific American: Do we really use only 10 percent of our brains?", url: "https://www.scientificamerican.com/article/do-we-really-use-only-10/", note: "ნეირომეცნიერი განმარტავს, როგორ გაჩნდა მითი და რას აჩვენებს ტვინის კვლევები." },
      { title: "Scientific American: Do people only use 10 percent of their brains?", url: "https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/", note: "განმარტავს, რომ ძილის დროსაც კი აქტიურია ტვინის მრავალი უბანი." }
    ],
    howToCheck: "მოძებნე ნეირომეცნიერების ან სამეცნიერო ჟურნალის სტატია. იკითხე: რომელ კვლევას ეყრდნობა ეს მტკიცება? ფილმები და მოტივაციური ტექსტები მტკიცებულება არ არის."
  },
  {
    id: "c2",
    claim: "დედამიწა მზის გარშემო მოძრაობს.",
    aliases: ["დედამიწა მზის გარშემო ბრუნავს", "დედამიწა მზის გარშემო ტრიალებს", "დედამიწა მზის გარშემო მოძრაობს ორბიტაზე"],
    verdict: "supported",
    strength: "ძალიან მაღალი",
    summary: "დედამიწა მზის გარშემო ორბიტაზე მოძრაობს. ერთ სრულ ბრუნს დაახლოებით 365,25 დღე სჭირდება.",
    why: "ეს ასტრონომიული დაკვირვებებითა და ფიზიკის კანონებით დასტურდება. სწორედ ამიტომ გვაქვს ყოველ ოთხ წელიწადში ერთხელ ნაკიანი წელი. ვრცელი სამეცნიერო კონსენსუსი ამ საკითხში ერთგვაროვანია.",
    sources: [
      { title: "NASA Science: Earth Facts", url: "https://science.nasa.gov/earth/facts/", note: "NASA-ს ოფიციალური გვერდი დედამიწის ორბიტისა და ბრუნვის შესახებ." },
      { title: "Britannica: Heliocentrism", url: "https://www.britannica.com/science/heliocentrism", note: "განმარტავს, როგორ დამკვიდრდა მზის ცენტრში მოთავსების მოდელი." }
    ],
    howToCheck: "გახსენი კოსმოსური სააგენტოს (მაგ. NASA) ან ენციკლოპედიის გვერდი და მოძებნე „Earth orbit“. შეადარე ორი დამოუკიდებელი წყარო."
  },
  {
    id: "c3",
    claim: "წყალი ზღვის დონეზე დაახლოებით 100°C-ზე დუღს ნორმალური ატმოსფერული წნევის პირობებში.",
    aliases: ["წყალი ზღვის დონეზე 100°C-ზე დუღს", "წყალი ზღვის დონეზე დაახლოებით 100 გრადუსზე დუღს", "წყალი 100 გრადუსზე დუღს ნორმალური წნევის დროს", "წყლის დუღილის ტემპერატურა ზღვის დონეზე 100 გრადუსია"],
    verdict: "supported",
    strength: "ძალიან მაღალი",
    summary: "დადასტურებულია, თუ დაცულია პირობა: ზღვის დონე და ნორმალური ატმოსფერული წნევა.",
    why: "დუღილის ტემპერატურა წნევაზეა დამოკიდებული. ნორმალურ წნევაზე (1 ატმოსფერო) სუფთა წყალი დაახლოებით 100°C-ზე დუღს. მაღლა მთაში წნევა დაბალია და წყალი უფრო დაბალ ტემპერატურაზე დუღს. წყალში გახსნილი ნივთიერებებიც ოდნავ ცვლის ამ მაჩვენებელს.",
    sources: [
      { title: "Britannica: Boiling point", url: "https://www.britannica.com/science/boiling-point", note: "განმარტავს დუღილის ტემპერატურას და მის დამოკიდებულებას წნევაზე." },
      { title: "NIST Chemistry WebBook: Water", url: "https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185", note: "აშშ-ის სტანდარტებისა და ტექნოლოგიების ინსტიტუტის მონაცემთა ბაზა წყლის თვისებებზე." }
    ],
    howToCheck: "ყურადღება მიაქციე პირობებს („ზღვის დონეზე“, „ნორმალურ წნევაზე“). ბევრი მტკიცება სწორია მხოლოდ გარკვეულ პირობებში."
  },
  {
    id: "c4",
    claim: "ყველა ინფორმაცია, რომელიც სოციალურ ქსელში ვრცელდება, სიმართლეა.",
    aliases: ["სოციალურ ქსელში გავრცელებული ყველა ინფორმაცია სიმართლეა", "რაც სოციალურ ქსელში წერია, ყველაფერი სიმართლეა", "სოციალურ ქსელებში მხოლოდ სწორი ინფორმაცია ვრცელდება"],
    verdict: "false",
    strength: "მაღალი",
    summary: "სოციალურ ქსელებში ერთმანეთშია აღრეული ზუსტი, არაზუსტი, შეცდომაში შემყვანი და გაუმოწმებელი ინფორმაცია.",
    why: "პოსტს ნებისმიერი ადამიანი ათავსებს და ის წინასწარ არავის გადაუმოწმებია. ამიტომ მოსწავლემ თითოეული მნიშვნელოვანი ინფორმაცია უნდა შეაფასოს: ვინ დაწერა, როდის, რა წყაროს ეყრდნობა.",
    sources: [
      { title: "News Literacy Project", url: "https://newslit.org/", note: "არასამთავრობო საგანმანათლებლო ორგანიზაცია, რომელიც ასწავლის ინფორმაციის შეფასებას." },
      { title: "IFLA: How to Spot Fake News", url: "https://www.ifla.org/publications/node/11174", note: "ბიბლიოთეკარების საერთაშორისო ფედერაციის მარტივი სახელმძღვანელო." }
    ],
    howToCheck: "გახსენი პოსტის ავტორის პროფილი, მოძებნე ორიგინალი წყარო და შეადარე სანდო მედიასა თუ ფაქტჩეკერ ორგანიზაციებს."
  },
  {
    id: "c5",
    claim: "თუ სტატია ბევრმა ადამიანმა გააზიარა, ეს ავტომატურად ნიშნავს, რომ ის სიმართლეა.",
    aliases: ["თუ სტატიას ბევრი ადამიანი აზიარებს, ის სიმართლეა", "რასაც ბევრი აზიარებს, ის სიმართლეა", "ბევრი გაზიარება ნიშნავს, რომ ინფორმაცია სიმართლეა", "ბევრმა ადამიანმა გააზიარა, ესე იგი სიმართლეა"],
    verdict: "false",
    strength: "მაღალი",
    summary: "პოპულარობა და სანდოობა სხვადასხვა რამაა. ინფორმაცია შეიძლება ბევრმა გააზიაროს და მაინც მცდარი იყოს.",
    why: "ხალხი ხშირად აზიარებს იმას, რაც ემოციას იწვევს (გაკვირვებას, ბრაზს, შიშს), და არა იმას, რაც გადაამოწმა. გაზიარებების რაოდენობა არ ამოწმებს ფაქტებს. სანდოობა წყაროსა და მტკიცებულებებზე დგას.",
    sources: [
      { title: "News Literacy Project", url: "https://newslit.org/", note: "განმარტავს, რატომ ვრცელდება მცდარი ინფორმაცია და როგორ უნდა შევაფასოთ ის." },
      { title: "Stanford: Civic Online Reasoning", url: "https://cor.inquirygroup.org/", note: "სტენფორდის სასწავლო მასალები ონლაინ ინფორმაციის შეფასებაზე, მათ შორის „გვერდითი კითხვის“ ხერხზე." }
    ],
    howToCheck: "სანამ გააზიარებ, დაუსვი თავს შეკითხვა: ვიცი თუ არა ორიგინალი წყარო? დავადასტურე თუ არა სხვაგან?"
  },
  {
    id: "c6",
    claim: "ძველი ფოტო აუცილებლად ასახავს იმ მოვლენას, რომელსაც ახალი ამბავი აღწერს.",
    aliases: ["ძველი ფოტო ყოველთვის ასახავს ახალ მოვლენას", "ახალი ამბის ფოტო აუცილებლად ამ მოვლენის დროს არის გადაღებული", "თუ ამბავს ფოტო ახლავს, ფოტო აუცილებლად იმავე მოვლენისაა"],
    verdict: "false",
    strength: "მაღალი",
    summary: "ფოტო შეიძლება ძველი იყოს, სხვა ადგილას გადაღებული ან სხვა მოვლენას ასახავდეს, მაგრამ ახალ ამბას მიაკუთვნონ.",
    why: "მცდარი ინფორმაცია ხშირად ნამდვილ, მაგრამ კონტექსტიდან ამოღებულ ფოტოს იყენებს. ამიტომ საჭიროა გამოსახულებით ძებნა (reverse image search), პირველი გამოქვეყნების თარიღის და ადგილის გადამოწმება.",
    sources: [
      { title: "Google Search Help: გამოსახულებით ძებნა (Search with an image)", url: "https://support.google.com/websearch/answer/1325808", note: "ოფიციალური ინსტრუქცია, როგორ მოვძებნოთ ფოტოს ორიგინალი." },
      { title: "Stanford: Civic Online Reasoning", url: "https://cor.inquirygroup.org/", note: "მასალები ვიზუალური მტკიცებულების შეფასებისთვის." }
    ],
    howToCheck: "ატვირთე ფოტო გამოსახულებით ძებნაში, მოძებნე ყველაზე ადრეული გამოქვეყნება და შეადარე ის ახალი ამბის აღწერას."
  },
  {
    id: "c7",
    claim: "სანდოობის შესაფასებლად მხოლოდ სტატიის სათაურის წაკითხვა საკმარისია.",
    aliases: ["სტატიის სანდოობის შესაფასებლად სათაურის წაკითხვა საკმარისია", "მხოლოდ სათაურის წაკითხვა საკმარისია სტატიის შესაფასებლად", "სათაური საკმარისია იმის გასაგებად, სანდოა თუ არა სტატია"],
    verdict: "false",
    strength: "მაღალი",
    summary: "სათაური მხოლოდ მცირე ნაწილია. ის შეიძლება გადაჭარბებული, არასრული ან შეცდომაში შემყვანი იყოს.",
    why: "სანდოობის შესაფასებლად საჭიროა მთელი ტექსტის წაკითხვა, ავტორისა და თარიღის დანახვა, მტკიცებულებებისა და წყაროების შემოწმება და სხვა დამოუკიდებელ წყაროებთან შედარება.",
    sources: [
      { title: "IFLA: How to Spot Fake News", url: "https://www.ifla.org/publications/node/11174", note: "მათ შორის გვირჩევს სათაურს მიღმა წაკითხვას და წყაროს შემოწმებას." },
      { title: "News Literacy Project", url: "https://newslit.org/", note: "სასწავლო მასალები სათაურებისა და ამბების შეფასებაზე." }
    ],
    howToCheck: "წაიკითხე მთლიანი სტატია, იპოვე ავტორი და თარიღი, შეამოწმე ციტირებული წყაროები."
  },
  {
    id: "c8",
    claim: "ხელოვნური ინტელექტის მიერ გენერირებული პასუხები ყოველთვის სწორია.",
    aliases: ["ხელოვნური ინტელექტი ყოველთვის სწორ პასუხს გვაძლევს", "ხელოვნური ინტელექტის პასუხები ყოველთვის სწორია", "ხელოვნური ინტელექტი არასდროს ცდება", "AI-ის პასუხები ყოველთვის სწორია"],
    verdict: "false",
    strength: "მაღალი",
    summary: "ხელოვნურ ინტელექტს შეუძლია მცდარი დებულებების და გამოგონილი ციტატებისა თუ წყაროების გენერირება. მნიშვნელოვანი ინფორმაცია დამოუკიდებლად უნდა გადამოწმდეს.",
    why: "ენობრივი მოდელები ტექსტს წინასწარმეტყველებით აგებენ და ყოველთვის ფაქტებს არ ამოწმებენ. შედეგად შეიძლება გამოჩნდეს დამაჯერებელი, მაგრამ მცდარი პასუხი („ჰალუცინაცია“), მათ შორის არარსებული ბმულები.",
    sources: [
      { title: "OpenAI: Why language models hallucinate", url: "https://openai.com/index/why-language-models-hallucinate/", note: "AI ლაბორატორია თავად განმარტავს, რატომ გამოსცემს მოდელი დამაჯერებელ, მაგრამ მცდარ დებულებებს." },
      { title: "IBM: What are AI hallucinations?", url: "https://www.ibm.com/think/topics/ai-hallucinations", note: "მარტივი განმარტება ჰალუცინაციებზე და მათ რისკებზე." }
    ],
    howToCheck: "AI-ს მიერ დასახელებული ფაქტი, ციტატა და ბმული ცალკე გახსენი და შეამოწმე, არსებობს თუ არა და ნამდვილად ამას ამბობს თუ არა."
  }
];

/* ===== 3. ტექსტის ნორმალიზაცია და შედარება ===== */

/** ტექსტს ამარტივებს შესადარებლად: პატარა ასოები, % → „პროცენტი“, პუნქტუაციის მოხსნა, ზედმეტი ინტერვალების გაწმენდა. */
function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/%/g, " პროცენტი ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** ტექსტში არსებული რიცხვები (მაგ. „10“, „100“), გასაწონად: განსხვავებული რიცხვი = განსხვავებული მტკიცება. */
function numbersOf(text) {
  return (text.match(/\d+/g) || []).sort().join(",");
}

/** ორი ტექსტის მსგავსება 0-დან 1-მდე (სიტყვათა სიმრავლეების Dice-ის კოეფიციენტი). */
function similarity(a, b) {
  const A = new Set(a.split(" ")), B = new Set(b.split(" "));
  let common = 0;
  A.forEach(w => { if (B.has(w)) common++; });
  return (2 * common) / (A.size + B.size);
}

const SIMILARITY_THRESHOLD = 0.85; // მაღალი ზღვარი, რომ შემთხვევითი სიტყვა დასკვნას ვერ გამოიწვევდეს
const MIN_WORDS = 4;               // ძალიან მოკლე ტექსტი ბუნდოვნად ითვლება

/**
 * პოულობს მტკიცებას ბაზაში. პრიორიტეტი: 1) ID (მაგ. c3), 2) ზუსტი დამთხვევა (ძირითადი ან alias),
 * 3) ძალიან მაღალი მსგავსება. თუ არაფერია, აბრუნებს null-ს. დასკვნა არასდროს გამოგონილი იქნება.
 */
function findClaim(input) {
  const text = normalize(input);
  if (!text) return null;

  const idMatch = text.match(/^c([1-8])$/);
  if (idMatch) return CLAIMS.find(c => c.id === "c" + idMatch[1]) || null;

  for (const c of CLAIMS) {
    const forms = [c.claim, ...c.aliases].map(normalize);
    if (forms.includes(text)) return c;
  }

  if (text.split(" ").length < MIN_WORDS) return null;
  let best = null, bestScore = 0;
  for (const c of CLAIMS) {
    for (const form of [c.claim, ...c.aliases].map(normalize)) {
      if (numbersOf(text) !== numbersOf(form)) continue; // „20%“ არ უნდა დაემთხვეს „10%“-ს
      const score = similarity(text, form);
      if (score > bestScore) { best = c; bestScore = score; }
    }
  }
  return bestScore >= SIMILARITY_THRESHOLD ? best : null;
}

/* ===== 4. ხელსაწყოები DOM-ის ასაგებად (textContent იცავს HTML ინექციისგან) ===== */

/** ქმნის ელემენტს. ტექსტი ყოველთვის textContent-ით ემატება, ანუ უსაფრთხოა. */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** ქმნის განსჯის ბეჯს ხატულით და ტექსტით (ფერი ერთადერთი ინდიკატორი არ არის). */
function verdictBadge(key) {
  const v = VERDICTS[key];
  const badge = el("span", "verdict " + v.css);
  const icon = el("span", "verdict-icon");
  icon.setAttribute("aria-hidden", "true");
  icon.appendChild(el("span", "", v.icon));
  badge.append(icon, el("span", "", v.label));
  return badge;
}

/* ===== 5. შედეგის ჩვენება ===== */

const resultBox = () => document.getElementById("result");

/** აჩვენებს ბაზაში ნაპოვნი მტკიცების სრულ შედეგს. */
function showResult(c) {
  const card = el("article", "result-card");
  const head = el("div", "result-head");
  head.append(el("p", "claim-label", "მტკიცება"), el("p", "claim-text", c.claim), verdictBadge(c.verdict));
  head.appendChild(el("p", "strength", "მტკიცებულების სიძლიერე: " + c.strength + " (ხარისხობრივი შეფასებაა და არა პროცენტული ალბათობა)"));

  const body = el("div", "result-body");
  const s1 = el("section"); s1.append(el("h3", "", "მოკლედ"), el("p", "", c.summary));
  const s2 = el("section"); s2.append(el("h3", "", "რატომ მივიღეთ ეს დასკვნა?"), el("p", "", c.why));

  const s3 = el("section"); s3.appendChild(el("h3", "", "სანდო წყაროები"));
  const list = el("ul", "source-list");
  c.sources.forEach(src => {
    const li = el("li");
    const a = el("a", "", src.title);
    a.href = src.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    li.append(a, el("span", "source-note", src.note));
    list.appendChild(li);
  });
  s3.append(list, el("p", "source-note", "ბმული ახალ ჩანართში იხსნება. გახსენი და შენც დარწმუნდი."));

  const s4 = el("section", "check-box"); s4.append(el("h3", "", "როგორ გადაამოწმო თავად?"), el("p", "", c.howToCheck));
  const limits = el("p", "limits", "შენიშვნა: ეს სადემონსტრაციო ბაზაა და შეიცავს მხოლოდ რვა მტკიცებას. ის არ არის სრული ან ავტორიტეტული ფაქტჩეკინგის სერვისი. გამოიყენე პირველწყაროები.");
  body.append(s1, s2, s3, s4, limits);

  card.append(head, body, resetButton());
  render(card);
}

/** აჩვენებს შეტყობინებას, როცა მტკიცება ბაზაში არ არის. დასკვნას არ გვაძლევს. */
function showUnknown(input) {
  const card = el("article", "result-card unknown-card");
  const head = el("div", "result-head");
  head.append(el("p", "claim-label", "შენი მტკიცება"), el("p", "claim-text", input), el("p", "", "ეს მტკიცება ჩვენს ბაზაში ჯერ არ არის გადამოწმებული."));
  const body = el("div", "result-body");
  const s1 = el("section");
  s1.append(el("h3", "", "რას ნიშნავს ეს?"), el("p", "", "ჩვენ დასკვნა არ გამოგვაქვს. ბაზაში არყოფნა არ ნიშნავს, რომ მტკიცება მცდარია ან სწორია. შეიძლება უბრალოდ ფორმულირება განსხვავდებოდეს."));
  const s2 = el("section", "check-box");
  s2.append(el("h3", "", "რა გააკეთო?"), el("p", "", "მოძებნე პირველწყარო (ოფიციალური უწყება, კვლევა, ორიგინალური გამოცემა), შეადარე რამდენიმე დამოუკიდებელ სანდო წყაროს და შეამოწმე ფაქტჩეკერ ორგანიზაციებში."));
  const links = el("ul", "source-list");
  [["მითების დეტექტორი", "https://mythdetector.ge/ka"], ["FactCheck Georgia", "https://factcheck.ge/ka/"]].forEach(([t, u]) => {
    const li = el("li"); const a = el("a", "", t);
    a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer";
    li.appendChild(a); links.appendChild(li);
  });
  s2.appendChild(links);
  body.append(s1, s2);
  card.append(head, body, resetButton());
  render(card);
}

/** ქმნის „ახალი მტკიცების შემოწმების“ ღილაკს. */
function resetButton() {
  const wrap = el("div", "result-actions");
  const btn = el("button", "btn btn-primary", "ახალი მტკიცების შემოწმება");
  btn.type = "button";
  btn.addEventListener("click", resetSearch);
  wrap.appendChild(btn);
  return wrap;
}

/** ათავსებს ახალ შედეგს გვერდზე და ფოკუსს აგდებს მასზე. */
function render(card) {
  const box = resultBox();
  box.replaceChildren(card);
  box.focus({ preventScroll: true });
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** ასუფთავებს ველს და შედეგს, ფოკუსი ბრუნდება ველზე. */
function resetSearch() {
  const input = document.getElementById("claim-input");
  input.value = "";
  hideError();
  resultBox().replaceChildren();
  document.getElementById("check").scrollIntoView({ behavior: "smooth", block: "center" });
  input.focus();
}

function showError(msg) {
  const e = document.getElementById("claim-error");
  e.textContent = msg; e.hidden = false;
}
function hideError() {
  const e = document.getElementById("claim-error");
  e.textContent = ""; e.hidden = true;
}

/** ფორმის გაგზავნა: ვალიდაცია, შემდეგ ძებნა ბაზაში. */
function handleSubmit(event) {
  event.preventDefault();
  const raw = document.getElementById("claim-input").value.trim();
  if (!raw) {
    showError("გთხოვთ, ჯერ ჩაწერე მტკიცება, რომლის გადამოწმებაც გინდა.");
    document.getElementById("claim-input").focus();
    return;
  }
  hideError();
  const found = findClaim(raw);
  if (found) showResult(found); else showUnknown(raw);
}

/* ===== 6. მაგალითები, ლეგენდა და 5 ნაბიჯი ===== */

function buildExamples() {
  const list = document.getElementById("example-list");
  CLAIMS.forEach(c => {
    const li = el("li");
    const btn = el("button", "chip", c.claim);
    btn.type = "button";
    btn.addEventListener("click", () => {
      const input = document.getElementById("claim-input");
      input.value = c.claim; hideError(); input.focus();
    });
    li.appendChild(btn); list.appendChild(li);
  });
}

function buildLegend() {
  const list = document.getElementById("legend");
  Object.keys(VERDICTS).forEach(key => {
    const li = el("li");
    li.append(verdictBadge(key), el("span", "desc", VERDICTS[key].desc));
    list.appendChild(li);
  });
}

const STEPS = [
  { title: "შეამოწმე ავტორი", q: "ვინ ავრცელებს ინფორმაციას?", text: "გაიგე, ვინ არის ავტორი ან გვერდის მფლობელი, აქვს თუ არა გამოცდილება ამ თემაზე და არის თუ არა ანონიმური.", ex: "მაგალითი: ჯანმრთელობის შესახებ პოსტს წერს მკურნალი თუ უცნობი პროფილი ფოტოს გარეშე?" },
  { title: "შეამოწმე თარიღი", q: "ხომ არ არის ძველი ინფორმაცია ახალ ამბად წარმოდგენილი?", text: "ძველი ამბავი ხშირად თავიდან ვრცელდება, თითქოს ახლა მოხდა.", ex: "მაგალითი: 5 წლის წინანდელი სტატია ახლა ისე ვრცელდება, თითქოს დღეს დაიწერა." },
  { title: "იპოვე ორიგინალი წყარო", q: "სად გამოქვეყნდა ინფორმაცია პირველად?", text: "გადმოცემულ ამბებში დეტალები იკარგება. პირველწყარო (დოკუმენტი, კვლევა, ვიდეო) მთავარი მტკიცებულებაა.", ex: "მაგალითი: „მეცნიერებმა დაადგინეს“ — რომელმა მეცნიერებმა? სად გამოქვეყნდა კვლევა?" },
  { title: "შეადარე სხვა სანდო წყაროებს", q: "ადასტურებენ თუ არა ისინი იმავე ფაქტს?", text: "ერთი წყარო შეიძლება შეცდეს. თუ რამდენიმე დამოუკიდებელი სანდო წყარო ერთსა და იმავეს ამბობს, ნდობა იზრდება.", ex: "მაგალითი: ამბავს მხოლოდ ერთი უცნობი საიტი აქვეყნებს, დანარჩენი მედია სდუმს. გაფრთხილდი." },
  { title: "შეამოწმე ფოტო და სათაური", q: "ხომ არ არის კონტექსტი შეცვლილი ან სათაური შეცდომაში შემყვანი?", text: "ფოტო შეიძლება სხვა დროის ან ადგილის იყოს, სათაური კი გადაჭარბებული. გამოიყენე გამოსახულებით ძებნა და წაიკითხე მთელი ტექსტი.", ex: "მაგალითი: სათაური „საშინელება!“ ტექსტში კი ჩვეულებრივი ამბავია." }
];

function buildSteps() {
  const list = document.getElementById("steps-list");
  STEPS.forEach(s => {
    const li = el("li");
    li.append(el("h3", "", s.title), el("p", "", s.q), el("p", "", s.text), el("p", "example", s.ex));
    list.appendChild(li);
  });
}

/* ===== 7. ქვიზი ===== */

const QUIZ = [
  { q: "როგორ შეაფასებ წყაროს სანდოობას ყველაზე უკეთ?", opts: ["დავითვლი, რამდენი მოწონება აქვს", "შევამოწმებ ავტორს, წყაროებს და სხვა სანდო გამოცემებს", "შევხედავ, ლამაზად არის თუ არა დიზაინი"], a: 1, why: "სანდოობა დამოკიდებულია ავტორზე, მტკიცებულებებსა და დამოუკიდებელ დადასტურებაზე, და არა პოპულარობაზე ან დიზაინზე." },
  { q: "ფოტო ახალ ამბას ახლავს. რა უნდა გააკეთო პირველ რიგში?", opts: ["გავაზიარებ, რადგან ფოტო დამაჯერებელია", "გამოსახულებით ძებნით შევამოწმებ, სად და როდის გამოჩნდა პირველად", "ფოტოს ფერებს დავაკვირდები"], a: 1, why: "გამოსახულებით ძებნა ხშირად აჩვენებს, რომ ფოტო ძველია ან სხვა მოვლენისაა." },
  { q: "სათაური გაკვირვებს და გაბრაზებს. რა არის ყველაზე გონივრული?", opts: ["მაშინვე გავაზიარებ, რომ სხვებმაც იცოდნენ", "წავიკითხავ მთელ ტექსტს და შევამოწმებ წყაროს", "კომენტარებს ვენდობი"], a: 1, why: "ძლიერი ემოცია ხშირად მანიპულაციის ნიშანია. სათაური შეიძლება ტექსტს არ ემთხვეოდეს." },
  { q: "რატომ არის სახიფათო გადაუმოწმებელი ინფორმაციის გაზიარება?", opts: ["ის შეიძლება მცდარი იყოს და სხვებიც შეცდომაში შევიყვანოთ", "ეს საერთოდ არავის ახდენს გავლენას", "მხოლოდ ჩემს პროფილზე აისახება"], a: 0, why: "ყოველი გაზიარება ინფორმაციას ავრცელებს. მცდარი ამბავი სწრაფად შეიძლება მრავალ ადამიანამდე მივიდეს." },
  { q: "ხელოვნურმა ინტელექტმა ციტატა და ბმული მოგცა. რა გააკეთებ?", opts: ["ვენდობი, რადგან დამაჯერებლად ჟღერს", "გავხსნი ბმულს და შევამოწმებ, არსებობს თუ არა და ნამდვილად ამას წერს თუ არა", "ციტატას გავაზიარებ და მერე ვნახავ"], a: 1, why: "AI-მ შეიძლება არარსებული წყარო ან ციტატა გამოიგონოს, ამიტომ ის დამოუკიდებლად უნდა გადამოწმდეს." },
  { q: "რას ნიშნავს, როცა მტკიცება ფაქტჩეკერის ბაზაში ვერ ვიპოვეთ?", opts: ["რომ ის მცდარია", "რომ ის სწორია", "რომ ჯერ დასკვნა არ გვაქვს და სხვა წყაროები უნდა ვნახოთ"], a: 2, why: "ბაზაში არყოფნა არ ადასტურებს და არც უარყოფს მტკიცებას." }
];

let quizIndex = 0, quizScore = 0;

function renderQuiz() {
  const box = document.getElementById("quiz");
  box.replaceChildren();

  if (quizIndex >= QUIZ.length) {
    box.append(el("p", "quiz-progress", "ქვიზი დასრულდა"), el("p", "score", "შენი ქულა: " + quizScore + " / " + QUIZ.length));
    const msg = quizScore === QUIZ.length ? "შესანიშნავია! კარგად ერკვევი ინფორმაციის გადამოწმებაში."
      : quizScore >= 4 ? "ძალიან კარგი შედეგია. გადახედე შეცდომებს და სცადე თავიდან."
      : "კარგი დასაწყისია. გადახედე ზემოთ მოცემულ ხუთ ნაბიჯს და სცადე ხელახლა.";
    box.appendChild(el("p", "", msg));
    const again = el("button", "btn btn-primary", "თავიდან დაწყება");
    again.type = "button";
    again.addEventListener("click", () => { quizIndex = 0; quizScore = 0; renderQuiz(); });
    box.appendChild(again);
    return;
  }

  const item = QUIZ[quizIndex];
  box.append(el("p", "quiz-progress", "კითხვა " + (quizIndex + 1) + " / " + QUIZ.length), el("p", "quiz-question", item.q));
  const ul = el("ul", "options");
  const feedback = el("div", "feedback"); feedback.hidden = true;
  const buttons = [];

  item.opts.forEach((text, i) => {
    const li = el("li");
    const b = el("button", "option-btn", text);
    b.type = "button";
    b.addEventListener("click", () => {
      buttons.forEach(x => x.disabled = true);
      const ok = i === item.a;
      if (ok) quizScore++;
      b.classList.add(ok ? "correct" : "wrong");
      if (!ok) buttons[item.a].classList.add("correct");
      feedback.replaceChildren(el("strong", "", ok ? "✓ სწორია!" : "✕ არასწორია."), el("span", "", item.why));
      feedback.hidden = false;
      const next = el("button", "btn btn-primary", quizIndex === QUIZ.length - 1 ? "შედეგის ნახვა" : "შემდეგი კითხვა");
      next.type = "button";
      next.addEventListener("click", () => { quizIndex++; renderQuiz(); });
      box.appendChild(next);
      next.focus();
    });
    buttons.push(b); li.appendChild(b); ul.appendChild(li);
  });
  box.append(ul, feedback);
}

/* ===== 8. მობილური მენიუ და გაშვება ===== */

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
  }));
}

function init() {
  buildExamples(); buildLegend(); buildSteps(); renderQuiz(); setupNav();
  document.getElementById("claim-form").addEventListener("submit", handleSubmit);
  document.getElementById("clear-btn").addEventListener("click", resetSearch);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
// ტესტირებისთვის (Node.js); ბრაუზერზე გავლენა არ აქვს
if (typeof module !== "undefined") { module.exports = { findClaim, normalize, CLAIMS }; }
