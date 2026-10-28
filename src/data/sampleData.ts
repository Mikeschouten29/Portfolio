import type { LearningOutcome, LuId, LuProgress, PortfolioData, Prompt, Research, ResearchVisual, Sprint, SprintStatus, UserStory } from '../types'

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
  { id: 'LU1', title: 'AI-impact op beroepsrol', description: 'AI-impact op beroepsrol analyseren.', required: 2 },
  { id: 'LU2', title: 'Praktijkgerichte AI-oplossingen', description: 'Praktijkgerichte AI-oplossingen ontwerpen, realiseren en valideren.', required: 4 },
  { id: 'LU3', title: 'Verantwoord AI-gebruik', description: 'Verantwoord AI-gebruik toetsen aan ethiek en regelgeving.', required: 2 },
  { id: 'LU4', title: 'AI-tools & technieken', description: 'AI-tools en technieken toepassen.', required: 4 },
  { id: 'LU5', title: 'Regie over eigen leerproces', description: 'Regie voeren over je eigen leerproces.', required: 6 },
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

/** Bewijslink van de AI-hardloopcoach TargetCoach. */
export const targetCoachLink = { id: 's3-ls1-l1', label: 'TargetCoach – AI-hardloopcoach', url: 'https://claude.ai/artifact/Le83Bhi3CEXvhKmArKWL1z' }

/** n8n-workflow van de AI-nieuwsbrief; werkt alleen op de eigen laptop zolang n8n draait. */
export const n8nWorkflowLink = { id: 's3-us1-l1', label: 'n8n-workflow AI-nieuwsbrief (opent alleen op mijn laptop als n8n draait)', url: 'http://localhost:5678/workflow/AbC123xyz' }

/** Planning sprint 3, overgenomen uit het sprintformulier. */
export const sprint3Planning: UserStory[] = [
  {
    id: 's3-plan-ls1',
    type: 'LS',
    story:
      'Als student van deze minor wil ik leren hoe ik met Claude een AI-hardloopcoach bouw, gebaseerd op betrouwbare bronnen, zodat ik AI verantwoord kan inzetten om beginnende hardlopers te begeleiden met een persoonlijk en veilig trainingsplan.',
    criteria: [
      'De app TargetCoach staat online en werkt: een sporter kan met de coach chatten, een doel kiezen en een trainingsplan per week ontvangen.',
      'De coach stelt eerst een korte gezondheidscheck (PAR-Q+) en past het plan daarna aan op basis van de trainingen die de sporter invult in het logboek.',
      'De app baseert zijn adviezen op een eigen kennisbank met minimaal 10 relevante en betrouwbare bronnen.',
    ],
    qualityCriteria: [
      'De coach schrijft in eenvoudig Nederlands, met korte berichten en maximaal één vraag per bericht.',
      "Ik heb de coach getest met vaste testscenario's en heb de fouten die ik vond verbeterd in de instructies van de coach.",
      'De coach is eerlijk over wat hij niet weet: bij vragen over voeding, schoenen of blessures zegt hij dat zijn bronnen daar niet over gaan.',
    ],
    learned:
      'Ik heb met Claude een AI-hardloopcoach gebouwd die eerst een gezondheidscheck (PAR-Q+) doet en adviseert op basis van een eigen kennisbank met betrouwbare bronnen. Les: een AI-coach is pas verantwoord als hij binnen zijn bronnen blijft en eerlijk zegt wat hij niet weet.',
    evidence: [targetCoachLink],
    done: true,
  },
  {
    id: 's3-plan-us1',
    type: 'US',
    story:
      'Als student van deze minor wil ik met n8n een geautomatiseerde workflow bouwen die wekelijks AI-nieuws ophaalt, laat samenvatten door AI en naar mijn mail stuurt, zodat ik zonder extra tijd op de hoogte blijf van nieuwe AI-ontwikkelingen, modellen en tools.',
    criteria: [
      'De workflow haalt artikelen op uit minimaal 3 actuele nieuwsbronnen en filtert deze op de afgelopen 7 dagen.',
      'Gemini maakt van de artikelen een Nederlandstalige nieuwsbrief met een vaste indeling (nieuws, nieuwe modellen en tools, tips, weetje en sporthoekje).',
      'De nieuwsbrief komt elke dinsdag om 10:00 automatisch binnen in mijn Gmail.',
    ],
    qualityCriteria: [
      'De workflow draait volledig gratis, zelf gehost op mijn laptop met gratis versies van de gebruikte diensten.',
      'De nieuwsbrief bevat alleen informatie uit de opgehaalde artikelen, met bij elk bericht een link naar de bron.',
      'De workflow probeert het automatisch opnieuw bij een foutmelding van de AI, en ik kan elke stap van de workflow in eigen woorden uitleggen.',
    ],
    learned:
      'Ik heb in n8n een workflow gebouwd die elke week AI-nieuws ophaalt, filtert op de afgelopen 7 dagen, door Gemini laat samenvatten en naar mijn Gmail stuurt. Les: mijn filter stond eerst op een vaste datum in plaats van een expressie, waardoor er geen artikelen overbleven. Elke stap direct testen voorkomt zulke fouten.',
    evidence: [n8nWorkflowLink],
    done: true,
  },
  {
    id: 's3-plan-ls2',
    type: 'LS',
    story:
      'Als student van deze minor wil ik de basis van automatiseren met AI leren door eerst een workflow uit de les te bouwen in Make, en die kennis daarna toe te passen in n8n voor een eigen workflow, zodat ik niet alleen een voorbeeld kan volgen, maar zelf een automatisering kan bedenken en bouwen.',
    criteria: [
      'In Make heb ik de leadbeoordelingsworkflow uit de les gebouwd, waarmee ik de basis heb geleerd.',
      'In n8n heb ik zelfstandig een eigen workflow bedacht en gebouwd: een wekelijkse AI-nieuwsbrief die nieuws ophaalt, filtert, door AI laat samenvatten en automatisch naar mijn Gmail stuurt.',
    ],
    qualityCriteria: [
      'Beide workflows werken aantoonbaar, van de workflow en het resultaat (de beoordeelde leads en de ontvangen nieuwsbrief).',
      'Ik kan van mijn workflow in n8n in eigen woorden uitleggen wat elke stap doet.',
    ],
    learned:
      'In Make leerde ik met de leadbeoordelingsworkflow uit de les hoe een workflow werkt: trigger, data ophalen en filteren, een AI-stap en een actie. Die basis heb ik daarna zelf toegepast in n8n. Ook leerde ik dat n8n op mijn laptop alleen draait zolang het venster van de Opdrachtprompt openstaat.',
    evidence: [],
    done: true,
  },
]

/** Sprint 3, overgenomen uit het sprintformulier. */
export const sprint3Content = {
  title: 'TargetCoach & automatiseren met AI',
  goal: 'Met Claude een AI-hardloopcoach (TargetCoach) bouwen op basis van betrouwbare bronnen, en leren automatiseren met Make en n8n, met een eigen wekelijkse AI-nieuwsbrief.',
  feedback: '',
  selfEvaluation: [
    'LU1 · AI-impact op de beroepspraktijk: - (niet in deze sprint)',
    'LU2 · Praktijkgerichte AI-oplossing: V. Ik heb TargetCoach gebouwd, een AI-hardloopcoach die beginnende hardlopers een persoonlijk en veilig trainingsplan geeft. Daarnaast heb ik met n8n een workflow gebouwd die mij wekelijks gratis een AI-nieuwsbrief mailt. Bewijs: de TargetCoach-app, de n8n-workflow en de ontvangen nieuwsbrief.',
    'LU3 · Ethiek & verantwoord AI-gebruik: - (niet in deze sprint)',
    'LU4 · AI-tools & technieken: V. Ik heb Claude gebruikt voor TargetCoach, en Make en n8n om workflows met AI te automatiseren. Ik ken de beperkingen, zoals een overbelaste AI-server, en heb daar oplossingen voor ingebouwd. Bewijs: de workflows in Make en n8n en de opgeloste foutmeldingen.',
    'LU5 · Zelfstandig & zelfsturend werken: V. Ik heb de basis van automatiseren geleerd in Make en die kennis zelfstandig toegepast in een eigen workflow in n8n. Problemen heb ik zelf onderzocht en opgelost, met AI als hulp. Bewijs: mijn sprintplanning en beide workflows.',
  ].join('\n\n'),
  reflection: [
    [
      'Workflows bouwen',
      'Geleerd: hoe een workflow in elkaar zit: een trigger, stappen die data ophalen en filteren, een AI-stap en een actie aan het eind. De basis leerde ik in Make, en die kon ik daarna zelf toepassen in n8n voor mijn eigen AI-nieuwsbrief.',
      'Behoud ik: na elk nieuw blokje direct testen met "Execute step", zodat ik meteen zie of die stap werkt.',
      'Doe ik anders: alles stap voor stap doen, want bij kleine instellingen stond mijn filter eerst op een vaste datum in plaats van een expressie, waardoor er geen artikelen overbleven.',
    ].join('\n'),
    [
      'n8n op mijn eigen laptop',
      'Geleerd: hoe ik n8n gratis op mijn eigen laptop draai via de Opdrachtprompt, en dat het programma alleen werkt zolang dat venster openstaat.',
      'Behoud ik: bewust kiezen voor gratis oplossingen en vooraf nadenken over de voor- en nadelen, zoals dat mijn laptop aan moet staan.',
      'Doe ik anders: niet zomaar vensters sluiten voordat ik weet wat ze doen. Ik had het venster van n8n gesloten, waardoor alles stopte.',
    ].join('\n'),
  ].join('\n\n'),
  nextSteps: [
    '• Alles stap voor stap doen en kleine instellingen (zoals een vaste datum of een expressie) controleren.',
    '• Niet zomaar vensters sluiten voordat ik weet wat ze doen.',
  ].join('\n'),
  showGrow:
    'Ik bouw nu niet alleen websites, maar ook AI-toepassingen die zelfstandig werken: een hardloopcoach die veilig adviseert op basis van betrouwbare bronnen, en een workflow die mij elke week automatisch het AI-nieuws mailt.',
  learningOutcomes: lu([0, 100, 0, 100, 100], {
    LU2: 'V · TargetCoach-app en n8n-nieuwsbrief',
    LU4: 'V · Claude, Make en n8n met AI ingezet',
    LU5: 'V · zelfstandig van Make naar eigen n8n-workflow',
  }),
  takeaways: {
    learned: [
      '• Een workflow = trigger → data ophalen en filteren → AI-stap → actie.',
      '• n8n draait gratis op mijn laptop, maar alleen zolang het venster openstaat.',
      '• Een AI-coach moet binnen betrouwbare bronnen blijven en eerlijk zijn over wat hij niet weet.',
    ].join('\n'),
    feedback: '',
    next: [
      '• Na elk nieuw blokje direct testen met "Execute step".',
      '• Instellingen stap voor stap controleren (expressie i.p.v. vaste datum).',
      '• Geen vensters sluiten voordat ik weet wat ze doen.',
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

/** Onderzoek 2: verantwoord AI-gebruik in de sport (LU3), voorlopig als concept. */
export const aiEthicsResearch: Research = {
  title: 'Verantwoord AI-gebruik in de sport',
  status: 'Concept',
  intro:
    'AI wordt in steeds meer werkvelden van de sport gebruikt. In dit onderzoek zoek ik uit wanneer dat verantwoord is, en wat de wet erover zegt.',
  tldr: [
    'AI in de sport loopt van minimaal risico (een trainingsschema) tot verboden (AI die jonge fans manipuleert).',
    'De grootste risico’s: privacy van sporters en fans, bias (oneerlijke uitkomsten) en te weinig uitleg over wat de AI doet.',
    'Casus Brøndby IF: gezichtsherkenning bij het stadion mag in Denemarken onder strenge voorwaarden, maar er moet een mens meekijken. In Nederland zou het waarschijnlijk niet mogen.',
    'Mijn advies: de mens beslist, verzamel niet meer dan nodig, vertel dat je AI gebruikt en test of het eerlijk werkt.',
  ],
  question:
    'Welke ethische en juridische risico’s brengt AI met zich mee in verschillende werkvelden van de sport, en hoe kunnen sportprofessionals AI verantwoord inzetten volgens de AI-verordening en de AVG?',
  subQuestions: [
    'Welke AI-toepassingen worden gebruikt in prestatiesport, talentontwikkeling, sportgezondheid, sportmarketing en sportevenementen, en welke ethische vraagstukken spelen daarbij?',
    'In welke risicocategorie van de AI-verordening vallen deze toepassingen, en welke AVG-regels gelden voor de gegevens van sporters, fans en bezoekers?',
    'Voldoet de gezichtsherkenning van Brøndby IF aan de AI-verordening en de AVG, en hoe zou dat in Nederland uitpakken?',
    'Welke aanbevelingen zorgen voor verantwoord AI-gebruik in de sport op het gebied van privacy, bias en transparantie?',
  ],
  method:
    'Literatuuronderzoek in twee delen. Deel 1: de wet (AI-verordening en AVG) en per werkveld een AI-toepassing, onderbouwd met wetenschappelijke bronnen. Deel 2: één echte casus (Brøndby IF), getoetst met een toetsingskader van negen stappen, de originele vergunning en de zeven vereisten voor betrouwbare AI van de Europese Commissie.',
  note: 'Let op: door een wetswijziging (de Digital Omnibus) gelden de strenge regels voor hoog-risico-AI pas vanaf 2 december 2027. De verboden gelden al sinds februari 2025.',
  image: {
    src: 'onderzoek/ai-in-de-sport-risico.svg',
    alt: 'Infographic: vijf werkvelden van de sport op een schaal van minimaal tot verboden risico volgens de AI-verordening. Prestatiesport, talentontwikkeling en sportgezondheid lopen van minimaal tot hoog risico, sportmarketing van minimaal tot verboden, en sportevenementen van hoog tot verboden.',
    caption: 'Hoe risicovol is AI per werkveld? De balk laat zien dat het risico afhangt van hoe de AI wordt ingezet. (Eigen figuur, gebaseerd op de AI-verordening)',
  },
  riskLevels: [
    { level: 'Onaanvaardbaar risico', article: 'Verboden (art. 5)', example: 'AI die jonge sporters of fans manipuleert', note: 'Bijv. gerichte gokreclame', tone: 'red' },
    { level: 'Hoog risico', article: 'Strenge eisen (bijlage I en III)', example: 'Spelersmonitoring, gezichtsherkenning, medische AI', note: 'Werk, biometrie, medisch hulpmiddel', tone: 'amber' },
    { level: 'Beperkt risico', article: 'Transparantie (art. 50)', example: 'Sportchatbots en AI-content', note: 'Melden: dit is AI', tone: 'teal' },
    { level: 'Minimaal risico', article: 'Geen extra eisen', example: 'Trainingsplanning, fan-personalisatie', note: 'Wel AVG bij persoonsgegevens', tone: 'gray' },
  ],
  assessment: [
    {
      application: 'Prestatiesport en coaching: blessurevoorspelling met GPS en wearables',
      aiAct: 'Hoog risico (bijlage III-4) bij het monitoren en beoordelen van prestaties van spelers in loondienst; anders minimaal',
      avg: 'Hartslag en blessuredata zijn gezondheidsgegevens (art. 9); toestemming van een werknemer is zelden vrij (EDPB)',
      ethics: 'Privacy, autonomie, gevoel van controle',
    },
    {
      application: 'Talentontwikkeling: AI-selectie van jeugdspelers',
      aiAct: 'Minimaal risico, tenzij het gaat om toelating tot een opleiding (bijlage III-3)',
      avg: 'Gegevens van kinderen (art. 8); recht op menselijke beoordeling (art. 22)',
      ethics: 'Bias: het relatieve-leeftijdseffect (Lovell et al., 2015)',
    },
    {
      application: 'Sportgezondheid: AI-app die blessures beoordeelt',
      aiAct: 'Hoog risico als het een medisch hulpmiddel is (bijlage I, MDR)',
      avg: 'Gezondheidsgegevens (art. 9): uitdrukkelijke toestemming',
      ethics: 'Veiligheid, wie is verantwoordelijk bij een fout advies',
    },
    {
      application: 'Sportmarketing: personalisatie, chatbots en AI-content',
      aiAct: 'Minimaal tot beperkt (art. 50); verboden bij uitbuiten van kwetsbare fans (art. 5)',
      avg: 'Profilering: grondslag (art. 6), informeren (art. 13), bezwaar (art. 21), minderjarigen (art. 8)',
      ethics: 'Transparantie, manipulatie, oneerlijke prijzen',
    },
    {
      application: 'Sportevenementen: gezichtsherkenning bij de stadioningang',
      aiAct: 'Hoog risico (bijlage III-1); realtime identificatie door de politie in principe verboden (art. 5)',
      avg: 'Biometrie (art. 9); in Nederland alleen bij noodzaak voor beveiliging (UAVG art. 29)',
      ethics: 'Privacy van alle bezoekers, bias in herkenning',
    },
  ],
  results: [
    'Prestatiesport en coaching: Rossi et al. (2018) lieten bij een profclub zien dat AI met GPS-trainingsdata vrij nauwkeurig kan voorspellen welke speler een blessure gaat oplopen. Dat helpt trainers, maar het zijn wel gezondheidsgegevens (AVG art. 9). Wat mij opviel: een speler in loondienst kan eigenlijk geen vrije toestemming geven, omdat hij afhankelijk is van de club (EDPB, 2020). Bovendien noemt de AI-verordening AI die de prestaties en het gedrag van werknemers monitort en beoordeelt al hoog risico (bijlage III, punt 4). Bij profspelers in loondienst kan blessure- en belastingmonitoring daar dus snel onder vallen. Ethisch zie ik vooral het risico dat sporters zich voortdurend gecontroleerd voelen en weinig zeggenschap hebben over hun eigen data.',
    'Talentontwikkeling: uit het onderzoek van Lovell et al. (2015) bij 1.212 jeugdspelers van 17 Engelse clubs blijkt dat spelers die vroeg in het selectiejaar zijn geboren 5,3 keer zo vaak werden geselecteerd als spelers die laat in het jaar zijn geboren. Dit relatieve-leeftijdseffect is voor mij de duidelijkste vorm van bias: als een AI leert van oude selecties, neemt hij die oneerlijkheid over en versterkt hij die. Omdat het om kinderen gaat, gelden extra regels (AVG art. 8), en een speler die door een geautomatiseerd besluit wordt afgewezen, heeft recht op een menselijke beoordeling (art. 22).',
    'Sportgezondheid: of een AI-app een medisch hulpmiddel is, hangt af van het doel dat de maker opgeeft. Algemene welzijns- of trainingsapps vallen er meestal niet onder, maar software die helpt bij diagnose of behandeling wel (MDCG, 2025). Dan geldt de strenge medische regelgeving en is de AI hoog risico. De gegevens zijn altijd gezondheidsgegevens, waarvoor uitdrukkelijke toestemming nodig is. Ethisch vind ik vooral de vraag lastig wie verantwoordelijk is als een fout advies een blessure verergert: de app, de maker of de sportprofessional.',
    'Sportmarketing: clubs personaliseren aanbiedingen en prijzen, zetten chatbots in en maken AI-content. De AI-verordening ziet dat meestal als minimaal of beperkt risico, maar fans moeten wel weten dat ze met AI praten en AI-content moet herkenbaar zijn (art. 50). AI die jonge of kwetsbare fans uitbuit, bijvoorbeeld met gerichte gokreclame, is verboden (art. 5). Onder de AVG is personalisatie profilering, dus fans moeten worden geïnformeerd en mogen bezwaar maken.',
    'Sportevenementen: clubs gebruiken gezichtsherkenning om stadionverboden te handhaven. Biometrische identificatie op afstand is hoog risico (bijlage III), en realtime identificatie door de politie in de openbare ruimte is in principe verboden (art. 5). Biometrische gegevens zijn bijzondere persoonsgegevens; in Nederland mag dit alleen als het noodzakelijk is voor authenticatie of beveiliging (UAVG art. 29). Dit werkveld heb ik in deel 2 diepgaand getoetst aan de hand van Brøndby IF.',
  ],
  caseStudy: {
    title: 'Casus: gezichtsherkenning bij Brøndby IF',
    intro: 'Eén echte toepassing, grondig getoetst: zou de gezichtsherkenning van de Deense voetbalclub Brøndby IF vandaag voldoen aan de AI-verordening en de AVG?',
    facts: [
      'Sinds 2019 scant Brøndby IF bij de ingang gezichten om mensen met een stadionverbod tegen te houden.',
      'De Deense toezichthouder gaf vooraf toestemming, met negen strenge voorwaarden (Datatilsynet, 2019).',
      'Gezichten zonder match worden meteen weggegooid, alles is versleuteld en bezoekers worden met borden geïnformeerd.',
      'Vooraf is een risicoanalyse (DPIA) gemaakt (DLA Piper, 2019).',
      'In 2025 kregen andere Deense topclubs ook toestemming, clubs uit de 1e divisie niet: daar woog het niet op tegen het doel (Datatilsynet, 2025).',
    ],
    steps: [
      {
        question: '1. Is het een AI-systeem?',
        short: 'Ja',
        finding: 'Ja. Het systeem herkent gezichten automatisch met software die patronen herkent en een match voorspelt. Dat valt onder de definitie van een AI-systeem (AI-verordening art. 3).',
        verdict: 'info',
      },
      {
        question: '2. Is het verboden (art. 5)?',
        short: 'Nee, zolang de club het zelf doet',
        finding: 'Nee, zolang de club het zelf gebruikt voor haar eigen stadionverboden. Realtime biometrische identificatie op afstand in de openbare ruimte is alleen verboden als het gebeurt voor rechtshandhaving, bijvoorbeeld door de politie (art. 5 lid 1 sub h). Als de politie het systeem zou gaan gebruiken, verandert dat.',
        verdict: 'ok',
      },
      {
        question: '3. Is het hoog risico (bijlage III)?',
        short: 'Ja, en er kijkt geen mens mee',
        finding: 'Ja. Iedereen voor de ingang wordt op afstand vergeleken met een lijst: dat is biometrische identificatie op afstand (bijlage III, punt 1). Vanaf 2 december 2027 moet de club als gebruiker zorgen voor menselijk toezicht, logging en gebruik volgens de instructies (art. 14 en 26), en moet de leverancier een conformiteitsbeoordeling hebben (art. 16 en 43). Een menselijke controle voordat iemand de toegang wordt geweigerd, staat niet in de voorwaarden van 2019.',
        verdict: 'warn',
      },
      {
        question: '4. Geldt een transparantieplicht?',
        short: 'Ja, met borden',
        finding: 'Artikel 50 van de AI-verordening geldt hier niet: dat gaat over chatbots, deepfakes, emotieherkenning en biometrische categorisering, niet over identificatie. Wel geldt de informatieplicht uit de AVG (art. 13). Daar voldoet Brøndby aan: bezoekers moeten met borden worden geïnformeerd (voorwaarde 5).',
        verdict: 'ok',
      },
      {
        question: '5. Worden bijzondere persoonsgegevens verwerkt?',
        short: 'Ja, gezichten zijn biometrie',
        finding: 'Ja. Gezichtskenmerken die worden gebruikt om iemand te identificeren, zijn biometrische gegevens: een bijzondere categorie (AVG art. 9 lid 1). Dat is in principe verboden, tenzij een uitzondering geldt.',
        verdict: 'info',
      },
      {
        question: '6. Is er een geldige grondslag?',
        short: 'Ja, een zwaarwegend belang',
        finding: 'Ja, in Denemarken. Toestemming kan niet, want wie naar de wedstrijd wil, moet langs de camera: de toestemming is dan niet vrij. Daarom is gekozen voor het zwaarwegend maatschappelijk belang (art. 9 lid 2 sub g), vastgelegd in de Deense wet en vooraf goedgekeurd door de toezichthouder.',
        verdict: 'ok',
      },
      {
        question: '7. Is een DPIA gedaan (art. 35)?',
        short: 'Ja',
        finding: 'Ja. Een DPIA is verplicht bij grootschalige monitoring van openbare ruimtes en bij biometrie, en Brøndby heeft er een opgesteld (DLA Piper, 2019). Sinds 2025 is een DPIA ook een uitdrukkelijke voorwaarde voor de andere clubs (Datatilsynet, 2025).',
        verdict: 'ok',
      },
      {
        question: '8. Worden gegevens beperkt en beveiligd?',
        short: 'Ja, minimaal en versleuteld',
        finding: 'Ja. Gezichten zonder match worden niet opgeslagen, matches worden na elke wedstrijd gewist, en de gegevens zijn versleuteld, afgeschermd van internet en alleen toegankelijk voor bevoegde medewerkers met tweestapsverificatie (voorwaarden 3, 4, 6, 7 en 8). Dat sluit aan bij dataminimalisatie en beveiliging (AVG art. 5, 25 en 32).',
        verdict: 'ok',
      },
      {
        question: '9. Kan een supporter bezwaar maken bij een foutieve match?',
        short: 'Niet duidelijk geregeld',
        finding: 'Niet zichtbaar geregeld. Een supporter die ten onrechte wordt herkend, moet de beslissing door een mens kunnen laten beoordelen (AVG art. 22) en een klacht kunnen indienen. Uit de openbare bronnen blijkt niet hoe Brøndby dit regelt.',
        verdict: 'warn',
      },
    ],
    comparison:
      'Waarschijnlijk niet toegestaan. In Nederland mag biometrie alleen als het echt nodig is voor beveiliging (UAVG art. 29), en de Autoriteit Persoonsgegevens is daar streng in (Telecompaper, 2020). Een vergunningsstelsel zoals in Denemarken is er hier niet. Bij FC Den Bosch noemde de KNVB gezichtsherkenning disproportioneel (Omroep Brabant, 2019).',
    conclusion:
      'Voldoet aan de AVG: vooraf goedgekeurd, met strenge voorwaarden. Voor de AI-verordening zijn er twee aandachtspunten: er moet een mens meekijken voordat iemand wordt geweigerd, en er moet een bezwaarprocedure komen. Vanaf 2 december 2027 is dat verplicht.',
  },
  ethicsFramework: 'Getoetst aan de zeven vereisten voor betrouwbare AI van de Europese Commissie (2019).',
  ethics: [
    { requirement: 'Menselijke autonomie en toezicht', assessment: 'Het systeem geeft een match, maar nergens staat dat een steward die controleert voordat iemand wordt geweigerd. Zo beslist in feite de AI.', verdict: 'warn' },
    { requirement: 'Technische robuustheid en veiligheid', assessment: 'De beveiliging is sterk (versleuteling, apart netwerk, tweestapsverificatie). Maar een foute match kan een onschuldige supporter de toegang kosten.', verdict: 'warn' },
    { requirement: 'Privacy en datagovernance', assessment: 'Alle bezoekers worden gescand, ook wie niets misdaan heeft. Dat wordt wel sterk beperkt: geen opslag zonder match en snelle verwijdering.', verdict: 'warn' },
    { requirement: 'Transparantie', assessment: 'Bezoekers worden met borden geïnformeerd. Onduidelijk is of een geweigerde supporter uitleg krijgt over waarom hij is tegengehouden.', verdict: 'warn' },
    { requirement: 'Diversiteit, non-discriminatie en eerlijkheid', assessment: 'Volgens NIST werkt de meerderheid van de geteste gezichtsherkenningsalgoritmes niet even goed voor alle bevolkingsgroepen (Grother et al., 2019). Openbare bias-tests van dit systeem heb ik niet gevonden.', verdict: 'warn' },
    { requirement: 'Maatschappelijk welzijn', assessment: 'Meer veiligheid en minder geweld in het stadion. Tegelijk kan het normaal worden gevonden dat je bij elk evenement gescand wordt.', verdict: 'warn' },
    { requirement: 'Verantwoording', assessment: 'Goed geregeld: vooraf goedgekeurd door de toezichthouder, met logging en een meldplicht bij wijzigingen. Dat de toezichthouder clubs uit de 1e divisie weigerde, laat zien dat er echt wordt afgewogen.', verdict: 'ok' },
  ],
  stakeholders: [
    { name: 'Brøndby IF (club)', interest: 'Veiligheid in het stadion en stadionverboden kunnen handhaven', concern: 'Kosten, imago en boetes bij incidenten' },
    { name: 'Supporters', interest: 'Veilig en ongestoord een wedstrijd bezoeken', concern: 'Privacy en het gevoel voortdurend bekeken te worden' },
    { name: 'Supporters met een stadionverbod', interest: 'Een eerlijke en proportionele straf', concern: 'Dat ze ook na hun straf nog in een systeem staan' },
    { name: 'Politie en gemeente', interest: 'Openbare orde met minder inzet van agenten', concern: 'Dat toezicht steeds meer bij private partijen komt te liggen' },
    { name: 'Leverancier van het systeem', interest: 'Een betrouwbaar en verkoopbaar product', concern: 'Aansprakelijkheid bij foute matches en nieuwe eisen uit de AI-verordening' },
  ],
  recommendations: [
    { actor: 'Club', priority: 'Hoog', action: 'Laat een steward elke match controleren voordat iemand de toegang wordt geweigerd.', basis: 'AI-verordening art. 14 en 26, AVG art. 22, vereiste "menselijk toezicht"' },
    { actor: 'Club', priority: 'Hoog', action: 'Richt een duidelijke bezwaar- en klachtenprocedure in voor supporters die ten onrechte worden herkend.', basis: 'AVG art. 22 en 77, vereiste "verantwoording"' },
    { actor: 'Leverancier', priority: 'Hoog', action: 'Test het systeem op bias per bevolkingsgroep, maak de resultaten openbaar en regel de conformiteitsbeoordeling vóór 2 december 2027.', basis: 'AI-verordening art. 10, 16 en 43; Grother et al. (2019)' },
    { actor: 'Club', priority: 'Middel', action: 'Herhaal de DPIA elk seizoen en toets opnieuw of het systeem nog nodig en in verhouding is, bijvoorbeeld aan de hand van het aantal incidenten.', basis: 'AVG art. 35, proportionaliteit' },
    { actor: 'Club', priority: 'Middel', action: 'Leg een geweigerde supporter uit waarom hij is tegengehouden en welke gegevens zijn gebruikt.', basis: 'AVG art. 13 en 15, vereiste "transparantie"' },
    { actor: 'Nederlandse clubs en KNVB', priority: 'Middel', action: 'Voer gezichtsherkenning niet in zonder duidelijke wettelijke basis, en onderzoek eerst minder ingrijpende alternatieven zoals persoonsgebonden tickets met een ID-controle.', basis: 'UAVG art. 29, AVG art. 5 (dataminimalisatie)' },
  ],
  insightsLabel: 'Algemene aanbevelingen voor alle werkvelden',
  insights: [
    'De mens beslist: gebruik AI als advies, maar laat beslissingen over selectie, contracten of gezondheid altijd door een trainer, scout of arts nemen (AVG art. 22).',
    'Gezondheids- en biometrische gegevens minimaliseren: verzamel alleen wat echt nodig is, gebruik bij sporters in loondienst geen toestemming als enige grondslag en doe vooraf een DPIA (AVG art. 9 en 35).',
    'Bias controleren: test of AI bepaalde groepen benadeelt, zoals jeugdspelers die laat in het jaar zijn geboren of bezoekers met een donkere huidskleur bij gezichtsherkenning.',
    'Transparantie: vertel sporters, fans en bezoekers wanneer AI wordt gebruikt en waarvoor, en maak AI-content herkenbaar (art. 50).',
    'Bescherm minderjarigen: extra zorgvuldigheid bij jeugdspelers en jonge fans, en geen gerichte AI-marketing voor risicovolle producten (art. 5 en AVG art. 8).',
    'Check of het medisch is: bepaal vooraf of een AI-toepassing een medisch doel heeft, want dan gelden de strengere regels voor medische hulpmiddelen.',
  ],
  conclusion:
    'AI in de sport kan verantwoord zijn, maar het risico hangt af van hoe je het inzet. De casus Brøndby IF laat zien dat zelfs gezichtsherkenning kan, als er strenge voorwaarden, toezicht vooraf en een echte afweging zijn. Verantwoord AI-gebruik betekent voor mij: de mens beslist, je verzamelt niet meer dan nodig, mensen weten wat er gebeurt en je test of het eerlijk werkt.',
  limitations: [
    'Ik ben geen jurist. Mijn toetsing is een onderbouwde inschatting; een privacyjurist kan tot een andere conclusie komen.',
    'Voor de actuele datums van de AI-verordening (Digital Omnibus) heb ik secundaire bronnen gebruikt.',
    'Niet alle details van Brøndby IF zijn openbaar, zoals de inhoud van de DPIA en hoe foutieve matches worden afgehandeld.',
    'Ik heb één ethisch kader gebruikt (de zeven vereisten van de Europese Commissie); andere kaders kunnen andere accenten leggen.',
  ],
  ownPosition: '',
  sources: [
    { id: 'src-ai-act', title: 'Verordening (EU) 2024/1689 (AI-verordening)', author: 'Europese Unie', year: '2024', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
    { id: 'src-avg', title: 'Verordening (EU) 2016/679 (Algemene verordening gegevensbescherming)', author: 'Europese Unie', year: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
    { id: 'src-uavg', title: 'Uitvoeringswet Algemene verordening gegevensbescherming (o.a. art. 29, biometrie)', author: 'Overheid.nl', year: '2018', url: 'https://wetten.overheid.nl/BWBR0040940/' },
    { id: 'src-omnibus', title: 'EU AI Act Omnibus Agreement: postponed high-risk deadlines and other key changes', author: 'Gibson Dunn', year: '2026', url: 'https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines/' },
    { id: 'src-edpb', title: 'Guidelines 05/2020 on consent under Regulation 2016/679', author: 'European Data Protection Board (EDPB)', year: '2020', url: 'https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en' },
    { id: 'src-hleg', title: 'Ethics Guidelines for Trustworthy AI', author: 'High-Level Expert Group on AI, Europese Commissie', year: '2019', url: 'https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai' },
    { id: 'src-mdcg', title: 'MDCG 2019-11 rev.1: Qualification and classification of software (MDR/IVDR)', author: 'Medical Device Coordination Group (MDCG)', year: '2025', url: 'https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en' },
    { id: 'src-rossi', title: 'Effective injury forecasting in soccer with GPS training data and machine learning. PLOS ONE, 13(7)', author: 'Rossi, A., Pappalardo, L., Cintia, P., Iaia, F. M., Fernàndez, J., & Medina, D.', year: '2018', url: 'https://doi.org/10.1371/journal.pone.0201264' },
    { id: 'src-lovell', title: 'Soccer player characteristics in English lower-league development programmes: the relationships between relative age, maturation, anthropometry and physical fitness. PLOS ONE, 10(9)', author: 'Lovell, R., Towlson, C., Parkin, G., Portas, M., Vaeyens, R., & Cobley, S.', year: '2015', url: 'https://doi.org/10.1371/journal.pone.0137238' },
    { id: 'src-nist', title: 'Face Recognition Vendor Test (FRVT) Part 3: Demographic Effects (NISTIR 8280)', author: 'Grother, P., Ngan, M., & Hanaoka, K. (NIST)', year: '2019', url: 'https://nvlpubs.nist.gov/nistpubs/ir/2019/NIST.IR.8280.pdf' },
    { id: 'src-dt-2019', title: 'Tilladelse til behandling af biometriske data ved brug af automatisk ansigtsgenkendelse ved indgange på Brøndby Stadion', author: 'Datatilsynet', year: '2019', url: 'https://www.datatilsynet.dk/afgoerelser/tilladelser/2019/maj/tilladelse-til-behandling-af-biometriske-data-ved-brug-af-automatisk-ansigtsgenkendelse-ved-indgange-paa-broendby-stadion' },
    { id: 'src-dt-2023', title: 'Brøndby IF har fået lov til udvidet brug af ansigtsgenkendelse', author: 'Datatilsynet', year: '2023', url: 'https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2023/jun/broendby-if-har-faaet-lov-til-udvidet-brug-af-ansigtsgenkendelse' },
    { id: 'src-dt-2025', title: 'Fodboldklubberne i Superligaen får tilladelse til brug af ansigtsgenkendelse', author: 'Datatilsynet', year: '2025', url: 'https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2025/sep/fodboldklubberne-i-superligaen-faar-tilladelse-til-brug-af-ansigtsgenkendelse' },
    { id: 'src-brondby', title: 'DLA Piper har bistået Brøndby IF med at opnå godkendelse til brug af automatisk ansigtsgenkendelse', author: 'DLA Piper Denmark', year: '2019', url: 'https://denmark.dlapiper.com/da/news/dla-piper-har-bistaet-brondby-if-med-opna-godkendelse-til-brug-af-automatisk' },
    { id: 'src-ap-2020', title: 'Autoriteit Persoonsgegevens waarschuwt tegen gezichtsherkenning-camera’s', author: 'Telecompaper', year: '2020', url: 'https://www.telecompaper.com/nieuws/autoriteit-persoonsgegevens-waarschuwt-tegen-gezichtsherkenning-cameras--1362948' },
    { id: 'src-denbosch', title: 'Camera’s met gezichtsherkenning bij FC Den Bosch en in het casino: “Dit kan niet zomaar”', author: 'Omroep Brabant', year: '2019', url: 'https://www.omroepbrabant.nl/nieuws/3003082/cameras-met-gezichtsherkenning-bij-fc-den-bosch-en-in-het-casino-dit-kan-niet-zomaar' },
  ],
}

/** Korte labels per toetsingsstap, voor de visuele versie. */
export const caseStepLabels = ['AI-systeem', 'Verboden?', 'Hoog risico', 'Informatie', 'Gevoelige data', 'Grondslag', 'DPIA', 'Data beperkt', 'Bezwaar']

/** Visuele presentatie van Onderzoek 2: weinig tekst, met spiekbriefje om het zelf uit te leggen. */
export const researchVisual: ResearchVisual = {
  oneLiner: 'AI in de sport kan, als de mens beslist.',
  captions: {
    vraag: 'AI zit overal in de sport. Ik onderzoek wanneer dat eerlijk en veilig is.',
    wetten: 'Twee Europese wetten bepalen wat mag: één voor AI, één voor persoonsgegevens.',
    risico: 'Hoe groter het risico voor mensen, hoe strenger de regels.',
    werkvelden: 'In elk werkveld speelt een ander ethisch probleem.',
    casus: 'Brøndby IF herkent supporters met een stadionverbod, maar er kijkt geen mens mee.',
    toets: 'Negen vragen uit de wet: zeven in orde, twee aandachtspunten.',
    afweging: 'Veiligheid en privacy botsen. In Nederland zijn de regels strenger.',
    advies: 'Vier regels maken AI in de sport verantwoord.',
    conclusie: 'AI is een hulpmiddel. De beslissing blijft bij de mens.',
  },
  werkvelden: [
    { name: 'Prestatiesport', icon: 'activity', keyword: 'Privacy sporter', risk: 'amber' },
    { name: 'Talent', icon: 'sprout', keyword: 'Bias', risk: 'amber' },
    { name: 'Gezondheid', icon: 'stethoscope', keyword: 'Veiligheid', risk: 'amber' },
    { name: 'Marketing', icon: 'megaphone', keyword: 'Manipulatie', risk: 'red' },
    { name: 'Evenementen', icon: 'scan-face', keyword: 'Privacy iedereen', risk: 'red' },
  ],
  advice: [
    { icon: 'user-check', text: 'Mens beslist' },
    { icon: 'database', text: 'Niet te veel data' },
    { icon: 'eye', text: 'Vertel dat het AI is' },
    { icon: 'scale', text: 'Test op eerlijkheid' },
  ],
  notes: {
    vraag: ['AI wordt in de hele sport gebruikt', 'Mijn vraag: wanneer is dat eerlijk en veilig?', 'Drie thema’s: privacy, bias, transparantie'],
    wetten: ['AI-verordening: deelt AI in op risico', 'AVG: privacywet, extra streng voor gezondheid en gezicht'],
    risico: ['Hoe hoger het risico, hoe strenger de regels', 'Regels voor hoog risico gelden vanaf 2 december 2027'],
    werkvelden: ['Talent: AI neemt oneerlijkheid over (geboortemaand)', 'Prestatiesport: een speler kan geen nee zeggen', 'Evenementen: iedereen wordt gescand'],
    casus: ['Deense club, sinds 2019', 'Doel: mensen met een stadionverbod tegenhouden', 'Er kijkt geen mens mee: dat moet wel'],
    toets: ['7 van de 9 in orde', 'Twee gaten: geen menselijke controle en geen bezwaarprocedure'],
    afweging: ['Veiligheid van iedereen tegenover privacy van iedereen', 'Nederland is strenger: biometrie alleen als het echt nodig is', 'Gezichtsherkenning werkt niet bij iedereen even goed (NIST)'],
    advies: ['De mens beslist, niet de computer', 'Alleen data die echt nodig is', 'Vertel dat je AI gebruikt', 'Test of het voor iedereen eerlijk werkt'],
    conclusie: ['AI kan verantwoord zijn, maar alleen met deze vier regels', 'Daarna: mijn eigen mening'],
  },
}

aiEthicsResearch.visual = researchVisual
aiEthicsResearch.caseStudy?.steps.forEach((step, i) => {
  step.label = caseStepLabels[i]
})

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
  version: 23,
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
  extraResearch: [structuredClone(aiEthicsResearch)],
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
    {
      id: 'sprint-3',
      number: 3,
      period: '28 sep – 9 okt 2026',
      status: 'Afgerond',
      ...sprint3Content,
      userStories: structuredClone(sprint3Planning),
      evidence: [],
    },
    plannedSprint(4, 'Nog te plannen', '12 – 30 okt 2026', ''),
    plannedSprint(5, 'Nog te plannen', '2 – 13 nov 2026', ''),
    plannedSprint(6, 'Nog te plannen', '16 – 27 nov 2026', ''),
    plannedSprint(7, 'Nog te plannen', '30 nov – 11 dec 2026', ''),
    plannedSprint(8, 'Nog te plannen', '14 dec 2026 – 22 jan 2027', ''),
  ],
}
