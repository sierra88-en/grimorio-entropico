export interface Interpretacion {
  amor: string;
  proyectos: string;
  espiritu: string;
}

export interface CartaTarot {
  id: number;
  numeroRomano: string;
  nombre: string;
  arquetipo: string;
  simboloAlquimico: string;
  elementoPlaneta: string;
  imagen: string;
  palabrasClave: string[];
  interpretacion: Interpretacion;
  consejoOracular: string;
}

export const TAROT_ARCANOS_MAYORES: CartaTarot[] = [
  {
    id: 0,
    numeroRomano: "0",
    nombre: "El Loco",
    arquetipo: "El Buscador Inocente / El Inicio Cuántico",
    simboloAlquimico: "🜁",
    elementoPlaneta: "Elemento Aire / Urano",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
    palabrasClave: ["Espontaneidad", "Salto de Fe", "Potencial Puro", "Libertad"],
    interpretacion: {
      amor: "Invita a soltar corazas y prejuicios del pasado. Un encuentro sorpresivo o una etapa de ligereza y juego transformará tu dinámica afectiva. Confía sin calcular cada paso; el corazón exige entrega sin garantías.",
      proyectos: "Momento propicio para emprender caminos no convencionales, innovar o romper con métodos rígidos. No temas parecer arriesgado si la visión es genuina, pero vigila no ignorar precipicios evidentes.",
      espiritu: "El alma se halla ante una página en blanco. Representa el vacío fértil previo a la creación. Abraza la incertidumbre como tu aliada más sagrada: todo está por inventarse."
    },
    consejoOracular: "Atrévete a dar el salto hacia lo desconocido; el universo tejerá la red en el aire."
  },
  {
    id: 1,
    numeroRomano: "I",
    nombre: "El Mago",
    arquetipo: "El Alquimista / El Puente entre Arriba y Abajo",
    simboloAlquimico: "☿",
    elementoPlaneta: "Mercurio",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
    palabrasClave: ["Manifestación", "Voluntad", "Habilidad", "Canalización"],
    interpretacion: {
      amor: "Poder de atracción y elocuencia en su punto álgido. Es hora de expresar con claridad tus deseos y tomar la iniciativa afectiva. Tu magnetismo alinea la intención con la realidad compartida.",
      proyectos: "Cuentas con todas las herramientas (los cuatro elementos: mente, pasión, recursos y emoción) para materializar tu meta. Excelente momento para firmas, lanzamientos y negociaciones estratégicas.",
      espiritu: "Comprensión viviente del principio hermético: 'Como es arriba, es abajo'. Tu mente consciente es el canal mediante el cual la energía divina toma forma concreta en el mundo material."
    },
    consejoOracular: "No busques más recursos afuera; ya tienes sobre tu mesa todo lo necesario para obrar el milagro."
  },
  {
    id: 2,
    numeroRomano: "II",
    nombre: "La Sacerdotisa",
    arquetipo: "La Guardiana del Misterio / La Memoria Akáshica",
    simboloAlquimico: "☽",
    elementoPlaneta: "La Luna",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
    palabrasClave: ["Intuición", "Silencio Sagrado", "Inconsciente", "Sabiduría Oculta"],
    interpretacion: {
      amor: "Conexión psíquica y misterio compartido. Hay verdades o sentimientos hondos que maduran en silencio antes de revelarse. Escucha los sueños y corazonadas antes que las apariencias externas.",
      proyectos: "Guarda discreción sobre tus planes. No es momento de acción precipitada ni de divulgar estrategias, sino de investigar, analizar datos ocultos y esperar el instante propicio.",
      espiritu: "Apertura del tercer ojo y comunión con el velo de Isis. La respuesta a tu dilema no procede del intelecto analítico, sino de la quietud profunda donde el alma escucha a los planos sutiles."
    },
    consejoOracular: "Permanece en reposo receptivo; lo que no se dice alberga mayor poder que lo proclamado."
  },
  {
    id: 3,
    numeroRomano: "III",
    nombre: "La Emperatriz",
    arquetipo: "La Madre Nutricia / La Matriz de la Creación",
    simboloAlquimico: "♀",
    elementoPlaneta: "Venus",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
    palabrasClave: ["Abundancia", "Fertilidad", "Sensualidad", "Creatividad Viva"],
    interpretacion: {
      amor: "Florecimiento de la ternura, la pasión sensual y el cuidado mutuo. Las relaciones cobran calidez nutricia y armonía estética. Periodo óptimo para gestar compromisos firmes o ampliar el hogar.",
      proyectos: "Las semillas plantadas comienzan a germinar con vigor. Crecimiento económico sostenido, proyectos creativos que reciben reconocimiento y multiplicación natural de recursos.",
      espiritu: "Integración con la naturaleza y los ciclos biológicos. La espiritualidad se encarna a través del gozo de los sentidos, el arte y la celebración de la vida como un don inagotable."
    },
    consejoOracular: "Nutre tus creaciones con paciencia y amor; la abundancia es tu estado primordial."
  },
  {
    id: 4,
    numeroRomano: "IV",
    nombre: "El Emperador",
    arquetipo: "El Constructor del Orden / La Autoridad Soberana",
    simboloAlquimico: "♈",
    elementoPlaneta: "Aries",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
    palabrasClave: ["Estructura", "Liderazgo", "Estabilidad", "Límites Claros"],
    interpretacion: {
      amor: "Búsqueda de seguridad, lealtad inquebrantable y cimientos sólidos a largo plazo. Es necesario fijar límites sanos y evitar posturas autoritarias o inflexibles frente a quien amas.",
      proyectos: "Imperativo de planificar con rigor técnico y disciplina metódica. Consolidación de empresas, defensa de patrimonios y toma de decisiones ejecutivas sin vacilación.",
      espiritu: "Dominio de la voluntad consciente sobre el caos de los instintos. La verdadera autoridad espiritual nace del autogobierno y de la coherencia inquebrantable entre palabra y acto."
    },
    consejoOracular: "Edifica sobre cimientos de roca y disciplina; el orden disipa la confusión."
  },
  {
    id: 5,
    numeroRomano: "V",
    nombre: "El Sumo Sacerdote",
    arquetipo: "El Maestro Tradicional / El Puente Sagrado (Pontífice)",
    simboloAlquimico: "♉",
    elementoPlaneta: "Tauro",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
    palabrasClave: ["Doctrina", "Ética", "Guía Espiritual", "Alianza Sagrada"],
    interpretacion: {
      amor: "Valores compartidos, búsqueda de compromiso formal y compatibilidad moral profunda. Bendición para vínculos que honran la tradición o que se consagran bajo ritos de madurez.",
      proyectos: "Alineación con instituciones consolidadas, mentores de prestigio o códigos deontológicos rigurosos. El éxito vendrá de seguir protocolos probados antes que experimentos fortuitos.",
      espiritu: "Reconocimiento del conocimiento iniciático transmitido por la cadena dorada de los maestros. Conexión con los misterios arquetípicos y el propósito moral del ser."
    },
    consejoOracular: "Busca el consejo del sabio y honra los principios que trascienden las modas efímeras."
  },
  {
    id: 6,
    numeroRomano: "VI",
    nombre: "Los Enamorados",
    arquetipo: "La Encrucijada del Alma / La Conjunción Sagrada",
    simboloAlquimico: "♊",
    elementoPlaneta: "Géminis",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
    palabrasClave: ["Elección", "Atracción", "Unión Sagrada", "Valores Centrales"],
    interpretacion: {
      amor: "Dilema afectivo crucial o encuentro de almas afines que confronta tu escala de prioridades. La intimidad requiere autenticidad radical: no se puede amar desde la máscara ni desde la duda crónica.",
      proyectos: "Bifurcación en el camino laboral o financiero. La decisión no debe fundarse únicamente en la ganancia inmediata, sino en la congruencia con tus valores existenciales más hondos.",
      espiritu: "Matrimonio alquímico interior (Hieros Gamos): reconciliación de la polaridad ánima-ánimus, razón y emoción. Elegir es renunciar para consagrarse a lo esencial."
    },
    consejoOracular: "Elige desde el dictado de tu corazón auténtico, no desde el miedo a perder."
  },
  {
    id: 7,
    numeroRomano: "VII",
    nombre: "El Carro",
    arquetipo: "El Guerrero Victorioso / El Auriga de las Fuerzas Opuestas",
    simboloAlquimico: "♋",
    elementoPlaneta: "Cáncer",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
    palabrasClave: ["Determinación", "Victoria", "Autodominio", "Avance Imparable"],
    interpretacion: {
      amor: "Superación de obstáculos externos que amenazaban la relación. Tomar las riendas del propio destino amoroso sin permitir que opiniones ajenas o inseguridades descarrilen el viaje.",
      proyectos: "Triunfo contundente mediante perseverancia y enfoque inflexible. Concreción de viajes, resolución rápida de litigios y avance vertiginoso en metas profesionales.",
      espiritu: "Capacidad de guiar las dos esfinges del alma (las pasiones luminosas y oscuras) en una sola dirección armónica. La victoria exterior es reflejo del control interior."
    },
    consejoOracular: "Fija la mirada en el horizonte y mantén las riendas firmes; nada detiene tu avance."
  },
  {
    id: 8,
    numeroRomano: "VIII",
    nombre: "La Fuerza",
    arquetipo: "La Gracia Soberana / El Amor que Doma a la Fiera",
    simboloAlquimico: "♌",
    elementoPlaneta: "Leo",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
    palabrasClave: ["Compasión", "Fortaleza Moral", "Paciencia", "Templanza Activa"],
    interpretacion: {
      amor: "Paciencia infinita y ternura que desactivan el orgullo y la cólera. La verdadera fuerza en la pareja no se demuestra imponiéndose, sino sabiendo acoger las heridas mutuas con infinita bondad.",
      proyectos: "Capacidad para negociar en escenarios hostiles o con personalidades difíciles gracias a la diplomacia serena y la inteligencia emocional. Resistencia frente a presiones extremas.",
      espiritu: "Trascendencia del instinto animal mediante el amor incondicional, representado por el león acariciado por la doncella bajo el símbolo del infinito. El poder suave es invencible."
    },
    consejoOracular: "No recurras a la violencia ni a la rigidez; conquista tus tempestades con serena mansedumbre."
  },
  {
    id: 9,
    numeroRomano: "IX",
    nombre: "El Ermitaño",
    arquetipo: "El Sabio Solitario / El Faro en la Noche",
    simboloAlquimico: "♍",
    elementoPlaneta: "Virgo",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
    palabrasClave: ["Introspección", "Luz Interior", "Retiro Sagrado", "Madurez"],
    interpretacion: {
      amor: "Necesidad de soledad temporal para comprender los propios anhelos o un vínculo caracterizado por la madurez, la discreción y el respeto reverencial por los espacios individuales.",
      proyectos: "Fase de revisión exhaustiva, auditoría y prudencia financiera. No es hora de compras impulsivas ni expansiones ruidosas; perfecciona la calidad antes que la cantidad.",
      espiritu: "El faro de la linterna de Hermes ilumina un paso a la vez en la oscuridad. El alma se aparta del bullicio social para descubrir la verdad que solo se revela en el silencio de la ermita."
    },
    consejoOracular: "Camina despacio y enciende tu propia lámpara; el camino se revela paso a paso."
  },
  {
    id: 10,
    numeroRomano: "X",
    nombre: "La Rueda de la Fortuna",
    arquetipo: "El Tejedor de Destinos / La Ruleta Cósmica de la Entropía",
    simboloAlquimico: "♃",
    elementoPlaneta: "Júpiter",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
    palabrasClave: ["Ciclos", "Sincronía", "Destino", "Giro Inesperado"],
    interpretacion: {
      amor: "Golpe de suerte o cambio imprevisto de circunstancias que revitaliza la vida amorosa. Personas del destino cruzan tu umbral. Recuerda que las etapas bajas son la antesala del ascenso.",
      proyectos: "Fluctuaciones favorables del mercado o golpes de fortuna inesperados. Prepárate para surfear la ola de la oportunidad antes de que el ciclo vuelva a girar.",
      espiritu: "Comprensión de la impermanencia universal. Quien se identifica con el borde de la rueda sufre los mareos de la fortuna; quien se ancla en el eje inmóvil contempla el giro cósmico en paz."
    },
    consejoOracular: "Acepta el giro ineludible del destino y posiciónate en el centro inmóvil de tu ser."
  },
  {
    id: 11,
    numeroRomano: "XI",
    nombre: "La Justicia",
    arquetipo: "La Balanza Kármica / La Espada de la Verdad Imparcial",
    simboloAlquimico: "♎",
    elementoPlaneta: "Libra",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
    palabrasClave: ["Equidad", "Causa y Efecto", "Claridad Moral", "Resolución Legal"],
    interpretacion: {
      amor: "Claridad y sinceridad descarnada. Se cosechan con exactitud los frutos sembrados en la relación. Exige acuerdos equilibrados donde ninguna de las partes soporte cargas desmedidas.",
      proyectos: "Fallo legal, auditoría o veredicto favorable si has actuado con rectitud e impecabilidad. Contratos justos, cobros merecidos y regularización de compromisos pendientes.",
      espiritu: "Ley del Karma y equilibrio cósmico. Cada pensamiento, palabra y acción genera una onda en el tejido universal. La espada corta las ilusiones; la balanza pesa el corazón con la pluma de Maat."
    },
    consejoOracular: "Actúa con impecabilidad y justicia; el cosmos devolverá exactamente lo que hayas sembrado."
  },
  {
    id: 12,
    numeroRomano: "XII",
    nombre: "El Colgado",
    arquetipo: "El Místico Suspendido / La Inversión de Perspectiva",
    simboloAlquimico: "🜄",
    elementoPlaneta: "Elemento Agua / Neptuno",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
    palabrasClave: ["Rendición", "Nueva Mirada", "Pausa Iniciática", "Desapego"],
    interpretacion: {
      amor: "Sensación de estancamiento que pide entrega y desapego de expectativas egoístas. No fuerces situaciones ni intentes doblegar la voluntad del otro; la pausa guarda una lección sanadora.",
      proyectos: "Los planes sufren demoras transitorias. Aprovecha el paréntesis para replantear la estrategia desde un ángulo diametralmente opuesto. La inacción consciente rinde más que la prisa ciega.",
      espiritu: "Inversión voluntaria del ego terrenal en pos de la visión mística. Con la cabeza nimbada hacia la tierra y la cruz en los pies, el iniciado ve el mundo tal como es verdaderamente."
    },
    consejoOracular: "Suelta el control y míralo todo al revés; lo que parecía un sacrificio es tu liberación."
  },
  {
    id: 13,
    numeroRomano: "XIII",
    nombre: "La Muerte",
    arquetipo: "El Segador de lo Obsoleto / La Gran Metamorfosis",
    simboloAlquimico: "♏",
    elementoPlaneta: "Escorpio",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
    palabrasClave: ["Transformación", "Cierre de Ciclo", "Renovación Radical", "Transmutación"],
    interpretacion: {
      amor: "Final de un ciclo afectivo o muerte simbólica de dinámicas tóxicas para permitir que brote un amor genuinamente renovado. No te aferres a fantasmas de lo que ya cumplió su propósito.",
      proyectos: "Cierre definitivo de una etapa profesional, empresa o proyecto obsoleto. Deja ir lo que no tiene porvenir; el abono de lo que termina enriquecerá tu siguiente gran siembra.",
      espiritu: "Nigredo alquímica: la disolución indispensable para que el oro puro pueda coagularse. El amanecer entre las dos torres anuncia la resurrección inevitable de la conciencia."
    },
    consejoOracular: "Permite que muera lo caduco con gratitud; la vida renace de sus cenizas."
  },
  {
    id: 14,
    numeroRomano: "XIV",
    nombre: "La Templanza",
    arquetipo: "El Ángel Alquimista / La Mezcla de las Esencias",
    simboloAlquimico: "♐",
    elementoPlaneta: "Sagitario",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
    palabrasClave: ["Armonía", "Curación", "Moderación", "Síntesis Divina"],
    interpretacion: {
      amor: "Reconciliación dulce, comunicación fluida y reciprocidad serena. Las heridas pasadas encuentran bálsamo en la paciencia y el respeto al ritmo de cicatrización del otro.",
      proyectos: "Fusión exitosa de ideas divergentes, sociedades equilibradas y finanzas en paulatina recuperación. Evita los extremos y busca fórmulas intermedias de compromiso sostenible.",
      espiritu: "Trasvase incesante del agua de la conciencia entre copas de oro y plata. Sanación del cuerpo sutil e integración fluida de los opuestos en una danza de gracia constante."
    },
    consejoOracular: "Vierte moderación en cada copa de tu vida; el término medio es el secreto del oro alquímico."
  },
  {
    id: 15,
    numeroRomano: "XV",
    nombre: "El Diablo",
    arquetipo: "La Sombra Colectiva / El Guardián del Umbral Material",
    simboloAlquimico: "♑",
    elementoPlaneta: "Capricornio",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
    palabrasClave: ["Apegos", "Sombra", "Fascinación", "Despertar del Espejismo"],
    interpretacion: {
      amor: "Atracción magnética irresistible, pasión ardiente teñida de celos, dependencia o juegos de dominación. Reconoce que las cadenas son holgadas: te atas tú mismo por miedo a la soledad.",
      proyectos: "Codicia desmedida, obsesión por el dinero fácil o manipulación en el entorno de trabajo. Lucro potente pero éticamente resbaladizo; evalúa el costo moral de tus compromisos.",
      espiritu: "Encuentro frontal con la propia sombra junguiana. No se trata de reprimir el impulso instintivo, sino de iluminar los temores ocultos que te hacen esclavo de tus propias proyecciones."
    },
    consejoOracular: "Mira de frente a tus obsesiones; las cadenas que te atan son de tu propia forja."
  },
  {
    id: 16,
    numeroRomano: "XVI",
    nombre: "La Torre",
    arquetipo: "El Rayo Despertador / La Caída de la Falsa Ilusión",
    simboloAlquimico: "♂",
    elementoPlaneta: "Marte",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
    palabrasClave: ["Ruptura", "Revelación Súbita", "Liberación", "Colapso del Ego"],
    interpretacion: {
      amor: "Caída súbita de una mentira o estructura afectiva insostenible. Aunque el impacto inicial desconcierte, es una bendición dolorosa que te arranca de una prisión disfrazada de hogar.",
      proyectos: "Quiebre de certezas, crisis intempestiva o colapso de un plan mal cimentado. Acepta el derribo con serenidad: sobre el terreno limpio construirás con auténtica solidez.",
      espiritu: "El relámpago de la iluminación fulmina la corona de soberbia del falso ego. La torre construida por la vanidad humana cae para devolver al alma la contemplación del cielo abierto."
    },
    consejoOracular: "No lamentes la caída de los muros de tu prisión; el rayo te devuelve la libertad."
  },
  {
    id: 17,
    numeroRomano: "XVII",
    nombre: "La Estrella",
    arquetipo: "La Esperanza Celeste / La Doncella de las Aguas Vivas",
    simboloAlquimico: "♒",
    elementoPlaneta: "Acuario",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
    palabrasClave: ["Fe", "Inspiración", "Claridad Cósmica", "Sanación Profunda"],
    interpretacion: {
      amor: "Fe renovada en el amor puro y sin fingimientos. Vínculo transparente y luminoso, basado en la autenticidad total, la generosidad y la compenetración espiritual sincera.",
      proyectos: "Inspiración genial, proyectos con alta repercusión comunitaria o artística. Los augurios son inmejorables para crear soluciones altruistas y atraer aliados benévolos.",
      espiritu: "Bajo las ocho estrellas doradas, la doncella derrama el agua nutricia sin miedo a agotarse. El alma experimenta comunión directa con la gracia cósmica y la paz que sobrepasa todo entendimiento."
    },
    consejoOracular: "Confía en tu estrella polar; la noche más oscura ya quedó atrás."
  },
  {
    id: 18,
    numeroRomano: "XVIII",
    nombre: "La Luna",
    arquetipo: "El Espejo de las Profundidades / El Laberinto de la Noche",
    simboloAlquimico: "♓",
    elementoPlaneta: "Piscis",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
    palabrasClave: ["Inconsciente", "Ilusión", "Clarividencia", "Sombras Pasajeras"],
    interpretacion: {
      amor: "Inseguridades, celos imaginarios o proyección de viejos traumas no resueltos sobre la pareja. Distingue entre la intuición fidedigna y las trampas del miedo y la susceptibilidad.",
      proyectos: "Atmósfera nebulosa con cláusulas poco transparentes o desinformación. No tomes compromisos irreversibles bajo esta niebla; aguarda a que aclare la situación antes de actuar.",
      espiritu: "Viaje a través del sendero entre el lobo y el perro, mientras el cangrejo emerge del abismo primordial. El alma aprende a navegar las aguas de su inconsciente sin ahogarse en sus espejismos."
    },
    consejoOracular: "No temas a los aullidos en la bruma; cruza el pantano guiado por tu luz interior."
  },
  {
    id: 19,
    numeroRomano: "XIX",
    nombre: "El Sol",
    arquetipo: "El Niño Dorado / La Plenitud y la Claridad",
    simboloAlquimico: "☉",
    elementoPlaneta: "El Sol",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
    palabrasClave: ["Alegría", "Éxito Rotundo", "Vitalidad", "Verdad Radiante"],
    interpretacion: {
      amor: "Felicidad compartida, calidez, generosidad y proyectos de vida dichosos. Amor correspondido y celebrado a la luz del día, sin secretos ni amarguras pendientes.",
      proyectos: "Éxito total y reconocimiento público. Prosperidad financiera, acuerdos transparentes y resolución triunfal de cualquier desafío previo. Todo brilla con claridad meridiana.",
      espiritu: "El niño inocente montado en el caballo blanco bajo los girasoles encarna la iluminación del alma: el retorno a la pureza del ser bañada por la luz radiante de la conciencia divina."
    },
    consejoOracular: "Abre los brazos a la luz que disipa toda sombra; el éxito y la alegría te pertenecen."
  },
  {
    id: 20,
    numeroRomano: "XX",
    nombre: "El Juicio",
    arquetipo: "El Clarín de la Resurrección / La Llamada Vocacional",
    simboloAlquimico: "🜂",
    elementoPlaneta: "Elemento Fuego / Plutón",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
    palabrasClave: ["Despertar", "Perdón", "Llamado del Alma", "Renacimiento"],
    interpretacion: {
      amor: "Perdón liberador del pasado o segunda oportunidad que rescata la relación desde un nuevo nivel de madurez. Despiertas a una comprensión compasiva de las lecciones vividas juntos.",
      proyectos: "Descubrimiento de tu verdadera vocación o salto cuántico profesional. Te liberas de cargas impuestas por terceros para responder al llamado genuino de tus dones.",
      espiritu: "El ángel Gabriel hace sonar la trompeta celestial; los seres emergen de sus sepulcros de ignorancia hacia la vida eterna de la conciencia despierta. Es el llamado irrechazable del alma."
    },
    consejoOracular: "Escucha el clarín de tu despertar; deja atrás las viejas tumbas de la culpa."
  },
  {
    id: 21,
    numeroRomano: "XXI",
    nombre: "El Mundo",
    arquetipo: "La Danza Cósmica / La Totalidad Consumada",
    simboloAlquimico: "🜃",
    elementoPlaneta: "Elemento Tierra / Saturno",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
    palabrasClave: ["Culminación", "Integración", "Éxito Pleno", "Victoria Universal"],
    interpretacion: {
      amor: "Consumación amorosa perfecta y armonía integral. Celebración de unión profunda, expansión de horizontes y viajes compartidos donde el amor se siente como un hogar sagrado.",
      proyectos: "Cierre exitoso de un macrociclo, logro de objetivos máximos, alcance global o internacional y recompensa merecida por una trayectoria impecable.",
      espiritu: "La virgen cósmica danza rodeada por la corona de laurel y los cuatro tetramorfos (los cuatro vivientes del zodíaco). Es el estado de budeidad, plenitud y bienaventuranza suprema."
    },
    consejoOracular: "Celebra la danza de la vida; has completado la gran obra y el universo se regocija contigo."
  }
];

export type IntencionTipo = "amor" | "proyectos" | "espiritu";

export interface IntencionInfo {
  id: IntencionTipo;
  label: string;
  sublabel: string;
  iconName: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
}

export const INTENCIONES: IntencionInfo[] = [
  {
    id: "amor",
    label: "Amor y Vínculos",
    sublabel: "Relaciones, afectos, parejas y reconciliación",
    iconName: "Heart",
    colorBorder: "border-rose-500/40",
    colorBg: "bg-rose-950/20",
    colorText: "text-rose-300"
  },
  {
    id: "proyectos",
    label: "Proyectos y Dinero",
    sublabel: "Trabajo, finanzas, empresas y elecciones prácticas",
    iconName: "Briefcase",
    colorBorder: "border-amber-500/40",
    colorBg: "bg-amber-950/20",
    colorText: "text-amber-300"
  },
  {
    id: "espiritu",
    label: "Espíritu y Destino",
    sublabel: "Crecimiento personal, sincronicidad y sendero interior",
    iconName: "Sparkles",
    colorBorder: "border-indigo-500/40",
    colorBg: "bg-indigo-950/20",
    colorText: "text-indigo-300"
  }
];
