import type { LearningOutcome, LuId, LuProgress, PortfolioData, Prompt, Research, Sprint, SprintStatus, UserStory } from '../types'

function lu(scores: [number, number, number, number, number], notes: Partial<Record<LuId, string>> = {}) {
  const ids: LuId[] = ['LU1', 'LU2', 'LU3', 'LU4', 'LU5']
  return Object.fromEntries(
    ids.map((id, i) => [id, { score: scores[i], note: notes[id] ?? '' }]),
  ) as Record<LuId, LuProgress>
}

function plannedSprint(number: number, title: string, period: string, goal: string, status: SprintStatus = 'Gepland'): Sprint {
  return {
    id: `sprint-${number}`,
    number,
    title,
    period,
    status,
    goal,
    userStories: [
      {
        id: `s${number}-us1`,
        type: 'US',
        story: 'Als student wil ik … zodat …',
        criteria: ['Nog in te vullen'],
        qualityCriteria: [],
        learned: '',
        evidence: [],
        done: false,
      },
    ],
    feedback: '',
    selfEvaluation: '',
    learningOutcomes: lu([0, 0, 0, 0, 0]),
    reflection: '',
    nextSteps: '',
    showGrow: '',
    takeaways: { learned: '', feedback: '', next: '' },
    evidence: [],
  }
}

/** Planning sprint 1, overgenomen uit de planning-tabel (user story, onderzoeksstory en leerstory). */
export const sprint1Planning: UserStory[] = [
  {
    id: 's1-plan-us1',
    type: 'US',
    story:
      'Als student van de minor Future-proof met AI! wil ik met behulp van Google AI Studio, GitHub en Vercel een professionele portfolio-website bouwen, zodat ik mijn projecten en vaardigheden op een professionele manier kan presenteren.',
    criteria: [
      'De portfolio-website heeft een professionele en overzichtelijke uitstraling.',
      'De website bevat relevante informatie over mijzelf, mijn vaardigheden en de sprints.',
      'De website is volledig werkend en online beschikbaar via Vercel.',
    ],
    qualityCriteria: [
      'De website is responsive en werkt op verschillende apparaten.',
      'De website heeft een rustige, professionele en consistente huisstijl.',
      'De website is via een unieke Vercel-URL live en openbaar toegankelijk op het internet.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
  {
    id: 's1-plan-rs1',
    type: 'RS',
    story:
      'Als toekomstig sportmarketeer wil ik onderzoeken hoe AI effectief wordt ingezet bij marketing, sponsoring en fan-engagement, zodat ik onderbouwd de meerwaarde van AI-tools kan aantonen en kan bepalen welke AI-skills ik tijdens de minor moet leren.',
    criteria: [
      'In kaart gebracht hoe AI impact maakt op de transformatie van traditionele marketingtaken naar AI-gestuurde processen.',
      'Analyse van 2 praktijkcasussen uit de sportsector op AI-gebruik.',
    ],
    qualityCriteria: [
      'Het is helder welk gevoel of inzicht dit jou geeft over je eigen toekomstige rol als sportmarketeer.',
      'Er is minimaal 1 voorbeeld gebruikt van een bekende sportorganisatie.',
      'Inzichten over impact en privacy zijn onderbouwd met vakliteratuur of professionele richtlijnen.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
  {
    id: 's1-plan-ls1',
    type: 'LS',
    story:
      'Als student in deze minor wil ik leren werken met verschillende AI-sites en de basis van effectief prompten onder de knie krijgen, zodat ik AI slim kan inzetten tijdens de uitvoering van mijn sprints.',
    criteria: [
      'Minimaal 3 verschillende AI-tools (bijv. ChatGPT voor tekst, Midjourney/Canva voor beeld, Claude voor structuur) uitgeprobeerd voor sprint-taken.',
      'De vaste basisformule van een goede prompt aantoonbaar begrijpen en toepassen.',
    ],
    qualityCriteria: [
      'Bevat 2 zelfgeteste voorbeeld-prompts waarin de basisformule zichtbaar is toegepast.',
      'In eigen woorden en kort opgeschreven wat wel en niet goed werkte tijdens het testen van de prompts.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
]

/** Planning sprint 2, overgenomen uit de planning-tabel (user stories en leerstories). */
export const sprint2Planning: UserStory[] = [
  {
    id: 's2-plan-us1',
    type: 'US',
    story:
      'Als toekomstig sportmarketeer wil ik de navigatie en de visuele stijl van mijn portfolio-website aanpassen, zodat de site effectief werkt en een professionele, merkwaardige indruk achterlaat.',
    criteria: [
      "De hoofdnavigatie bevat duidelijke knoppen naar alle hoofdpagina's (zoals Sprints, Portfolio/Bewijsstukken, Over Mij).",
      'De bezoeker kan vanuit het menu rechtstreeks doorklikken naar specifieke sprints of bewijsstukken.',
    ],
    qualityCriteria: [
      'De website gebruikt een rustige, sportieve en consistente huisstijl qua kleuren en lettertypes.',
      'Een bezoeker kan met maximaal 2 kliks bij de gewenste sprint of een specifiek bewijsstuk komen.',
      'De navigatie is responsive en werkt goed op zowel een laptop als een mobiele telefoon.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
  {
    id: 's2-plan-ls1',
    type: 'LS',
    story:
      'Als student van deze minor wil ik onderzoeken/leren hoe ik mijn website kan verbinden met Supabase, zodat ik zelfstandig gegevens kan opslaan, ophalen en beheren vanuit mijn website.',
    criteria: [
      'De website is succesvol verbonden met mijn Supabase-project.',
      'Ik kan vanuit mijn website gegevens naar Supabase versturen en deze gegevens weer ophalen.',
      'De koppeling verstoort geen van de al bestaande functionaliteiten van de website.',
    ],
    qualityCriteria: [
      'Ik heb gecontroleerd of gegevens daadwerkelijk correct worden opgeslagen en opgehaald.',
      'Ik kan met behulp van Claude problemen tijdens het verbinden onderzoeken en oplossen, waarbij ik zelf controleer en begrijp welke oplossing wordt toegepast.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
  {
    id: 's2-plan-ls2',
    type: 'LS',
    story:
      'Als student van deze minor wil ik zelfstandig leren werken met Claude, zodat ik AI bewust kan inzetten voor het ontwikkelen, aanpassen en verbeteren van mijn portfolio, zonder volledig afhankelijk te zijn van AI voor het maken en beheren van mijn website.',
    criteria: [
      'De portfolio-code is met behulp van Claude zelfstandig aangepast en verbeterd voor specifieke style, tekst en functionaliteiten die niet direct in Google AI Studio mogelijk zijn.',
      'Ik kan Claude gerichte prompts geven, om zo tokens te besparen.',
      'In het logboek zijn concrete voorbeelden vastgelegd van gebruikte prompts, het resultaat en mijn eigen reflectie daarop.',
    ],
    qualityCriteria: [
      'De gebruikte prompts zijn helder, specifiek en efficiënt geformuleerd.',
      'In het logboek beschrijf ik in mijn eigen woorden hoe ik Claude heb ingezet, welke prompts ik heb gebruikt en wat het resultaat daarvan was.',
    ],
    learned: '',
    evidence: [],
    done: false,
  },
]

/** De leeruitkomsten van de minor Future-proof met AI!, zoals in het beoordelingsformulier. */
export const minorLearningOutcomes: LearningOutcome[] = [
  { id: 'LU1', title: 'AI-impact op de beroepspraktijk', description: 'AI-impact op de beroepspraktijk analyseren en evalueren.' },
  { id: 'LU2', title: 'Praktijkgerichte AI-oplossing', description: 'Een praktijkgerichte AI-oplossing ontwerpen, realiseren en presenteren.' },
  { id: 'LU3', title: 'Ethiek & verantwoord AI-gebruik', description: 'Ethiek en verantwoordelijk AI-gebruik beoordelen.' },
  { id: 'LU4', title: 'AI-tools & technieken', description: 'AI-tools en technieken gebruiken.' },
  { id: 'LU5', title: 'Zelfstandig & zelfsturend werken', description: 'Zelfstandig en zelfsturend werken.' },
]

/** Vierde story van sprint 2 (Young Ones-webapp). */
export const youngOnesStory: UserStory = {
  id: 's2-plan-us2',
  type: 'US',
  story:
    'Als freelance werkende student via Young Ones wil ik een eigen webapplicatie ontwikkelen, zodat ik mijn inkomsten, facturen en btw-gegevens overzichtelijk kan bijhouden en eenvoudig kan gebruiken voor mijn belastingaangifte.',
  criteria: [
    'De website beschikt over een invoerscherm/dashboard waarin ik gewerkte klussen kan invoeren en inzien.',
    'De ingevoerde gegevens worden correct opgeslagen en berekend.',
    'De tool levert een helder en overzichtelijk samenvattingsscherm op dat direct bruikbaar is voor het invullen van de btw-aangifte of inkomstenbelasting.',
  ],
  qualityCriteria: [
    'De rekensommen en btw-percentages worden foutloos berekend op basis van de ingevoerde data.',
    'De applicatie is overzichtelijk, gebruiksvriendelijk en veilig voor eigen gebruik.',
  ],
  learned: '',
  evidence: [{ id: 's2-us2-l1', label: 'Young Ones-webapp (Vercel)', url: 'https://youngones-belasting.vercel.app' }],
  done: false,
}

/** "Wat ik heb geleerd" per story, kort en concreet (sprint 1 en 2). */
export const storyLearned: Record<string, string> = {
  // Sprint 1
  's1-plan-us1':
    'Ik heb mijn eerste portfolio-website gebouwd met Google AI Studio en via GitHub en Vercel online gezet. Zo weet ik nu hoe code van GitHub automatisch live komt op een eigen Vercel-link.',
  's1-plan-rs1':
    'Uit casussen als Liverpool FC en EDO bleek dat AI in sportmarketing vooral uitvoerende taken overneemt. Menselijk inzicht, merkidentiteit en de privacy van fan-data blijven mijn taak als sportmarketeer.',
  's1-plan-ls1':
    'Ik heb Perplexity (bronnenonderzoek), Claude en Google AI Studio naast elkaar gebruikt en geleerd welke tool waar goed in is. Met de vaste opbouw Rol + Context + Taak + Output krijg ik veel bruikbaardere antwoorden.',
  // Sprint 2
  's2-plan-us1':
    'Ik heb mijn portfolio een vaste huisstijl gegeven met licht/donker-modus en een duidelijk menu, zodat elke sprint binnen 2 kliks te vinden is. Na elke aanpassing test ik de site op laptop én telefoon.',
  's2-plan-ls1':
    'Ik heb mijn portfolio gekoppeld aan Supabase: tabel en beveiliging aangemaakt met SQL, een inlogaccount ingesteld en de sleutel via Vercel toegevoegd. Belangrijkste les: alleen de publieke sleutel hoort in een website, en ik heb zelf getest dat alleen ik kan opslaan.',
  's2-plan-ls2':
    'Ik heb geleerd dat Claude beter helpt als ik korte, gerichte vragen stel met een schermafbeelding erbij. Zo heb ik mijn portfolio stap voor stap aangepast en live gezet, en goede prompts sla ik op in mijn Prompt Library.',
  's2-plan-us2':
    'Ik heb een eigen webapp gebouwd voor mijn Young Ones-klussen. Daarvoor moest ik eerst zelf uitzoeken hoe de btw-aangifte per kwartaal en de inkomstenbelasting werken voor freelancers. Les: houd een app simpel met een vast stappenplan, en controleer de berekeningen altijd zelf.',
}

for (const story of [...sprint1Planning, ...sprint2Planning, youngOnesStory]) {
  story.learned = storyLearned[story.id] ?? story.learned
}

/** Feedback, zelfevaluatie en reflectie van sprint 2, overgenomen uit het sprintformulier. */
export const sprint2Content = {
  title: 'Portfolio vernieuwen, Supabase & Claude',
  goal: 'Mijn portfolio verbeteren en koppelen aan Supabase, zelfstandig leren werken met Claude en een eigen webapp bouwen voor mijn Young Ones-administratie.',
  feedback: [
    '17-09-2026 · Thijs Schriel',
    'Alles is heel goed en precies zoals het hoort. Probeer als je je website gaat aanpassen in Google AI Studio een prompt te maken met chat, zodat je een duidelijke prompt gebruikt. Misschien de acceptatie gebruiken over VS Code en misschien iets zeggen over wat je in VS wilt doen wat je niet in Google AI Studio kan.',
    '→ Mijn actie: ik heb het acceptatiecriterium van de VS Code-story verduidelijkt met concrete acties, met behulp van Claude. Ook gebruik ik voortaan vaste, gestructureerde prompts en sla ik deze op in mijn Prompt Library.',
    '',
    '24-09-2026 · Martijn van Kogelenberg',
    'Claude gebruiken, inspreken voor het maken van een prompt; dat scheelt typen en helpt je bij het maken van een goede prompt. Laat een AI-tool je vragen stellen, zodat je niks kunt vergeten.',
    '→ Mijn actie: ik heb een abonnement afgesloten bij Claude, en ik heb de AI-tool gebruikt die me heeft geholpen bij het formuleren van mijn stories.',
  ].join('\n'),
  selfEvaluation: [
    'LU1 · AI-impact op de beroepspraktijk: - (niet in deze sprint)',
    'LU2 · Praktijkgerichte AI-oplossing: V. Ik heb een werkende website gebouwd om mijn Young Ones-inkomsten en btw te berekenen, en daarnaast de structuur van mijn portfolio vernieuwd. Bewijs: Vercel/GitHub-repository en de werkende website.',
    'LU3 · Ethiek & verantwoord AI-gebruik: - (niet in deze sprint)',
    'LU4 · AI-tools & technieken: V. Ik heb Claude gebruikt om gerichte prompts te schrijven, mijn portfolio te vernieuwen en een eigen nieuwe website te bouwen, en ik heb mijn website succesvol gekoppeld aan Supabase. Bewijs: websites, gebruikte prompts in de Prompt Library en het Supabase-dashboard.',
    'LU5 · Zelfstandig & zelfsturend werken: V. Ik ontwikkel mezelf door AI-gegenereerde oplossingen kritisch te bekijken en feedback van klasgenoten actief om te zetten in verbeteracties. Bewijs: de verwerkte feedback van Thijs en Martijn in mijn sprintplanning.',
  ].join('\n\n'),
  reflection: [
    [
      'Website & huisstijl',
      'Geleerd: hoe ik de navigatie en uitstraling van mijn portfolio kan verbeteren met een vaste huisstijl, een licht/donker-modus en een duidelijk menu, zodat een bezoeker snel bij een sprint of bewijsstuk komt.',
      'Behoud ik: na elke aanpassing mijn website testen op laptop én telefoon, zodat alles overal goed werkt.',
      'Doe ik anders: beter opletten bij elke stap voordat ik doorklik. Ik had mijn project per ongeluk drie keer in Vercel geïmporteerd.',
    ].join('\n'),
    [
      'Werken met Claude',
      'Geleerd: ik krijg betere hulp als ik korte, gerichte vragen stel en een schermafbeelding meestuur van waar ik vastloop.',
      'Behoud ik: goede prompts direct opslaan in mijn Prompt Library, zoals de prompt voor de Supabase-koppeling.',
      'Doe ik anders: mijn logboek en bewijs (schermafbeeldingen) direct tijdens het werken bijhouden in plaats van achteraf.',
    ].join('\n'),
    [
      'Supabase',
      'Geleerd: hoe ik mijn portfolio koppel aan een database, zodat iedereen mijn nieuwste versie ziet en alleen ik na het inloggen iets kan aanpassen. Ook weet ik nu dat je alleen de publieke sleutel in een website mag gebruiken en nooit de geheime.',
      'Behoud ik: zelf controleren of iets echt werkt, bijvoorbeeld in de Table Editor van Supabase of door mijn site in een privévenster te openen.',
      'Doe ik anders: eerst zelf begrijpen wat een stap doet voordat ik doorga naar de volgende stap.',
    ].join('\n'),
  ].join('\n\n'),
  nextSteps: [
    '• Beter opletten bij elke stap voordat ik doorklik (ik had mijn project per ongeluk drie keer in Vercel geïmporteerd).',
    '• Eerst zelf begrijpen wat een stap doet voordat ik doorga naar de volgende stap.',
    '• Mijn logboek en bewijs (schermafbeeldingen) direct tijdens het werken bijhouden in plaats van achteraf.',
  ].join('\n'),
  showGrow:
    'Mijn portfolio is nu een echte webapplicatie: live via Vercel, gekoppeld aan een eigen database in Supabase en volledig zelf te beheren.',
  /** 100 = behaald (V), 0 = niet in deze sprint. */
  learningOutcomes: lu([0, 100, 0, 100, 100], {
    LU2: 'V · Young Ones-webapp en vernieuwd portfolio',
    LU4: 'V · Claude, Supabase, Vercel en GitHub ingezet',
    LU5: 'V · feedback van Thijs en Martijn verwerkt',
  }),
  takeaways: {
    learned: [
      '• Mijn portfolio is gekoppeld aan Supabase: iedereen kan lezen, alleen ik kan aanpassen.',
      '• Via GitHub en Vercel staat elke wijziging binnen een minuut live.',
      '• Korte vraag + schermafbeelding = betere hulp van Claude.',
    ].join('\n'),
    feedback: [
      'Thijs: duidelijkere prompts en criteria → acceptatiecriterium verduidelijkt, vaste prompt-opbouw.',
      'Martijn: laat AI je vragen stellen → AI gebruikt bij het formuleren van mijn stories.',
    ].join('\n'),
    next: [
      '• Elke stap eerst begrijpen voordat ik doorklik.',
      '• Bewijs en logboek direct tijdens het werken bijhouden.',
      '• Young Ones-app ook koppelen aan een online database.',
    ].join('\n'),
  },
}

/** Sprint 1, overgenomen uit het sprintformulier. */
export const sprint1Content = {
  title: 'Portfolio, AI-onderzoek & prompten',
  goal: 'Een eerste portfolio-website bouwen en online zetten, onderzoeken hoe AI de sportmarketing verandert en de basis van effectief prompten leren.',
  feedback: [
    '10-09-2026 · Thijs Schriel',
    'Mooi uitgewerkte stories en goed te behalen ook. Bij de kwaliteitscriteria van de user story, punt 3, klinkt het meer als een actie die je moet nemen dan als een kwaliteitscriterium. Misschien de criteria proberen helderder te formuleren als een zichtbaar resultaat, bijvoorbeeld bij acceptatiecriterium 2 van de research story. Voor de rest een goede planning!',
    '→ Mijn actie: ik heb bij de user story kwaliteitscriterium 3 aangepast van een actie naar een zichtbaar resultaat.',
  ].join('\n'),
  selfEvaluation: [
    'LU1 · AI-impact op de beroepspraktijk: V. Mijn onderzoek toont aan hoe AI het werk van de sportmarketeer transformeert, met de casus van Liverpool FC.',
    'LU2 · Praktijkgerichte AI-oplossing: - (niet in deze sprint)',
    'LU3 · Ethiek & verantwoord AI-gebruik: - (niet in deze sprint)',
    'LU4 · AI-tools & technieken: V. Ik beheers de basisformule van prompt engineering (Rol + Context + Taak + Output) en werk actief met tools zoals ChatGPT, Claude, Perplexity en Google AI Studio.',
    'LU5 · Zelfstandig & zelfsturend werken: V. Ik heb mijn sprint zelfstandig gepland en uitgevoerd, de feedback van Thijs verwerkt in mijn stories en een complete reflectie geschreven.',
  ].join('\n\n'),
  reflection: [
    [
      'AI-tools',
      'Geleerd: hoe ik met diverse tools (Perplexity, Claude en Google AI Studio) efficiënt onderzoek kan doen en een portfolio-website kan opbouwen via GitHub en Vercel.',
      'Behoud ik: het combineren van verschillende AI-tools op basis van hun kracht (bijv. Perplexity voor bronnenonderzoek).',
      'Doe ik anders: prompts direct opslaan in een persoonlijke Prompt Library in plaats van ze telkens opnieuw uit te vinden.',
    ].join('\n'),
    [
      'Impact op sportmarketing',
      'Geleerd: AI neemt vooral uitvoerende taken over.',
      'Behoud ik: het kritisch analyseren van casussen (zoals Liverpool FC en EDO) en de ethische en privacy-aspecten van fan-data altijd als randvoorwaarde meenemen.',
      'Doe ik anders: niet alleen focussen op de technische mogelijkheden van AI, maar de uitkomsten ook toetsen aan menselijk inzicht en merkidentiteit.',
    ].join('\n'),
    [
      'Prompt engineering',
      'Geleerd: een gestructureerde prompt (Rol + Context + Taak + Output) is belangrijk om bruikbare antwoorden en correcte website-code te krijgen.',
      'Behoud ik: de vaste prompt-opbouw actief blijven toepassen bij elke nieuwe opdracht in de minor.',
      'Doe ik anders: losse links of vage vragen in prompts vermijden.',
    ].join('\n'),
  ].join('\n\n'),
  nextSteps: [
    '• Prompts direct opslaan in een persoonlijke Prompt Library.',
    '• AI-uitkomsten ook toetsen aan menselijk inzicht en merkidentiteit.',
    '• Losse links of vage vragen in prompts vermijden.',
  ].join('\n'),
  showGrow:
    'AI neemt in de sportmarketing vooral uitvoerende taken over. Met de juiste tools en een goede prompt-opbouw zet ik AI slim in, maar menselijk inzicht en merkidentiteit blijven het verschil maken.',
  learningOutcomes: lu([100, 0, 0, 100, 100], {
    LU1: 'V · onderzoek met de casus Liverpool FC',
    LU4: 'V · prompt-basisformule en vier AI-tools',
    LU5: 'V · zelfstandig gepland, feedback verwerkt',
  }),
  takeaways: {
    learned: [
      '• AI neemt in de sportmarketing vooral uitvoerende taken over; menselijk inzicht blijft het verschil maken.',
      '• Met Rol + Context + Taak + Output krijg ik bruikbare antwoorden en goede code.',
      '• Elke AI-tool heeft een eigen kracht: Perplexity voor bronnen, Claude voor structuur.',
    ].join('\n'),
    feedback: 'Thijs: formuleer criteria als zichtbaar resultaat → kwaliteitscriterium 3 van mijn user story herschreven.',
    next: [
      '• Prompts direct opslaan in mijn Prompt Library.',
      '• Geen vage vragen of losse links meer in prompts.',
      '• AI-uitkomsten toetsen aan menselijk inzicht en merkidentiteit.',
    ].join('\n'),
  },
}

/** Onderzoekspagina, gebaseerd op de research story van sprint 1. */
export const researchContent: Research = {
  title: 'AI in sportmarketing',
  question:
    'Hoe wordt AI effectief ingezet bij marketing, sponsoring en fan-engagement in de sport, en welke AI-skills heb ik als toekomstig sportmarketeer nodig?',
  subQuestions: [
    'Hoe verandert AI traditionele marketingtaken in AI-gestuurde processen?',
    'Hoe zetten sportorganisaties als Liverpool FC en EDO AI in?',
    'Welke impact en welke privacy-aspecten spelen er bij het gebruik van fan-data?',
  ],
  method: 'Deskresearch met AI-tools (onder andere Perplexity voor bronnenonderzoek) en een analyse van twee praktijkcasussen uit de sportsector: Liverpool FC en EDO.',
  sources: [],
  results: ['AI neemt in de sportmarketing vooral uitvoerende taken over.'],
  insights: [
    'Menselijk inzicht en merkidentiteit blijven het verschil maken: AI ondersteunt de sportmarketeer, maar vervangt die niet.',
    'De privacy van fan-data is een randvoorwaarde bij elke AI-toepassing.',
  ],
}

/** Vervangt het verzonnen voorbeeldproject op de roadmap. */
export const youngOnesRoadmapItem = {
  id: 'r3',
  title: 'Young Ones-webapp doorontwikkelen',
  type: 'Project' as const,
  description: 'Gegevens van mijn Young Ones-app online opslaan (net als bij mijn portfolio met Supabase) en de app verder uitbreiden.',
  planning: 'Sprint 3 en verder',
  progress: 0,
  priority: 'Middel' as const,
}

/** Prompt waarmee het portfolio aan Supabase is gekoppeld (sprint 2, leerstory Supabase). */
export const supabasePrompt: Prompt = {
  id: 'p-supabase',
  title: 'Mijn portfolio koppelen aan Supabase',
  category: 'Webontwikkeling',
  learningOutcomes: ['LU2', 'LU4', 'LU5'],
  role: 'Je bent een developer die dingen goed kan uitleggen aan iemand die net begint met programmeren.',
  context:
    'Ik heb een portfolio-website gemaakt met React. De code staat op GitHub en de site staat online via Vercel. Nu wordt alles alleen in mijn eigen browser opgeslagen, dus als iemand anders mijn site opent, ziet die mijn aanpassingen niet. Ik heb al een Supabase-project aangemaakt.',
  task:
    'Help me om mijn portfolio te koppelen aan Supabase. Iedereen moet mijn portfolio kunnen bekijken, maar alleen ik mag iets aanpassen als ik ben ingelogd. Maak de SQL voor de tabel en de beveiliging, pas de code aan en vertel wat ik in Supabase en Vercel moet instellen. Leg bij elke stap kort uit waarom.',
  output:
    'Een stappenplan in simpel Nederlands dat ik zelf kan volgen. Zet erbij hoe ik kan checken of het werkt, en zeg welke sleutel ik wel en niet mag gebruiken.',
  tools: ['Claude', 'Supabase', 'Vercel', 'GitHub'],
  tags: ['supabase', 'database', 'vercel'],
}

export const sampleData: PortfolioData = {
  version: 12,
  profile: {
    name: 'Mike Schouten',
    role: 'Student Sportkunde · AI-ontdekker',
    intro:
      'Ik verbind sport met slimme technologie. In de minor Future-proof met AI! onderzoek ik hoe AI en data sportorganisaties helpen om fans beter te bereiken en slimmer te beslissen.',
    bio:
      'Sport is altijd de rode draad geweest: op het veld, langs de lijn en nu ook achter het scherm. Ik ben nieuwsgierig naar wat er achter een wedstrijd gebeurt: welke data clubs verzamelen, hoe marketeers fans bereiken en hoe AI dat werk sneller en persoonlijker maakt. In dit portfolio laat ik zien wat ik bouw, wat ik leer en waar ik nog groei.',
    education: 'Sportkunde',
    school: 'Hogeschool van Amsterdam',
    minor: 'Future-proof met AI!',
    minorDescription:
      'Een minor waarin je leert hoe je AI verantwoord en effectief inzet in je vakgebied, door te experimenteren, te onderzoeken en in sprints te werken aan echte vraagstukken.',
    location: 'Nederland',
    email: 'mikeschouten29@gmail.com',
    phone: '06-16656054',
    linkedin: 'https://www.linkedin.com/in/mike-schoutenn/',
    talents: ['Analytisch denken', 'Snel nieuwe tools leren', 'Teamspeler', 'Helder presenteren', 'Doorzetten'],
    passions: ['Voetbal & sportanalyse', 'Sportmarketing', 'AI-tools uitproberen', 'Data visualiseren'],
    futureGoals: [
      'Werken op het snijvlak van sport, marketing en data',
      'AI-toepassingen bouwen die sportclubs écht helpen',
      'Mijn onderzoek naar AI in sportmarketing publiceren of presenteren',
    ],
  },
  learningOutcomes: structuredClone(minorLearningOutcomes),
  prompts: [
    supabasePrompt,
    {
      id: 'p1',
      title: 'Doelgroepanalyse voor een sportclub',
      category: 'Sportmarketing',
      learningOutcomes: ['LU2', 'LU3'],
      role: 'Je bent een ervaren sportmarketeer met kennis van fanbeleving en data-analyse.',
      context: 'Een amateurvoetbalclub met 600 leden wil meer jonge supporters (16–25 jaar) naar thuiswedstrijden trekken.',
      task: 'Maak drie persona’s van jonge supporters met hun motivaties, drempels en favoriete kanalen.',
      output: 'Een tabel met per persona: naam, leeftijd, motivatie, drempel, kanaal en één concrete actie voor de club.',
      tools: ['ChatGPT', 'Claude'],
      tags: ['persona', 'fans', 'voetbal'],
    },
    {
      id: 'p2',
      title: 'Bronnen kritisch beoordelen',
      category: 'Onderzoek',
      learningOutcomes: ['LU3', 'LU4'],
      role: 'Je bent een kritische onderzoeksbegeleider op hbo-niveau.',
      context: 'Ik doe onderzoek naar de inzet van AI in sportmarketing en heb vijf bronnen verzameld.',
      task: 'Beoordeel elke bron op betrouwbaarheid, actualiteit en relevantie en leg uit waarom.',
      output: 'Per bron een score van 1–5 op elk criterium plus één zin toelichting en een eindadvies (gebruiken / niet gebruiken).',
      tools: ['Perplexity', 'Claude'],
      tags: ['bronnen', 'CRAAP', 'onderzoek'],
    },
    {
      id: 'p3',
      title: 'Wedstrijddata samenvatten',
      category: 'Data-analyse',
      learningOutcomes: ['LU1', 'LU3'],
      role: 'Je bent een data-analist bij een profvoetbalclub.',
      context: 'Ik heb een CSV met balbezit, schoten, passes en xG van de laatste tien wedstrijden.',
      task: 'Vind de drie belangrijkste trends en leg ze uit in begrijpelijke taal voor een trainer.',
      output: 'Drie korte bullets met trend, bewijs uit de data en een tactisch advies. Daarna een voorstel voor één grafiek.',
      tools: ['ChatGPT (Data Analyst)', 'Excel Copilot'],
      tags: ['xG', 'voetbal', 'visualisatie'],
    },
    {
      id: 'p4',
      title: 'Feedback op mijn pitch',
      category: 'Presenteren',
      learningOutcomes: ['LU5'],
      role: 'Je bent een strenge maar eerlijke jurylid bij een innovatiepitch.',
      context: 'Ik pitch in drie minuten een AI-tool die sportclubs helpt social-mediacontent te plannen.',
      task: 'Geef feedback op structuur, overtuigingskracht en onderbouwing. Stel ook drie kritische vragen.',
      output: 'Tops en tips in een lijst, gevolgd door drie jury-vragen.',
      tools: ['Claude'],
      tags: ['pitch', 'feedback'],
    },
  ],
  research: structuredClone(researchContent),
  roadmap: [
    {
      id: 'r1',
      title: 'Minor Future-proof met AI! succesvol afronden',
      type: 'Doel',
      description: 'Alle leeruitkomsten aantoonbaar behalen met een sterk sprintportfolio.',
      planning: 'Sep 2026 – Jan 2027',
      progress: 25,
      priority: 'Hoog',
    },
    {
      id: 'r2',
      title: 'Onderzoek AI in sportmarketing',
      type: 'Project',
      description: 'Mijn onderzoek naar AI in marketing, sponsoring en fan-engagement verder uitwerken en onderbouwen met bronnen.',
      planning: 'Okt – Dec 2026',
      progress: 15,
      priority: 'Hoog',
    },
    { ...youngOnesRoadmapItem },
    {
      id: 'r4',
      title: 'Netwerk opbouwen in de sportindustrie',
      type: 'Doel',
      description: 'Tien gesprekken voeren met mensen die werken in sportmarketing of sportdata.',
      planning: 'Doorlopend',
      progress: 30,
      priority: 'Laag',
    },
  ],
  sprints: [
    {
      id: 'sprint-1',
      number: 1,
      period: '31 aug – 11 sep 2026',
      status: 'Afgerond',
      ...sprint1Content,
      userStories: sprint1Planning.map((u) => ({ ...structuredClone(u), done: true })),
      evidence: [],
    },
    {
      id: 'sprint-2',
      number: 2,
      period: '14 – 25 sep 2026',
      status: 'Afgerond',
      ...sprint2Content,
      userStories: [...sprint2Planning, youngOnesStory].map((u) => ({ ...structuredClone(u), done: true })),
      evidence: [],
    },
    plannedSprint(3, 'Nog te plannen', '28 sep – 9 okt 2026', ''),
    plannedSprint(4, 'Nog te plannen', '12 – 30 okt 2026', ''),
    plannedSprint(5, 'Nog te plannen', '2 – 13 nov 2026', ''),
    plannedSprint(6, 'Nog te plannen', '16 – 27 nov 2026', ''),
    plannedSprint(7, 'Nog te plannen', '30 nov – 11 dec 2026', ''),
    plannedSprint(8, 'Nog te plannen', '14 dec 2026 – 22 jan 2027', ''),
  ],
}
