

const questionBank = {
    "Natural Science": {
        "Mathematics": [
            { id: 1, question: "What is the derivative of x^2?", options: ["x", "2x", "x^2", "2"], answer: null, isFlagged: false, isShaded: false },
            { id: 2, question: "Solve for x: 2x = 10", options: ["2", "4", "5", "10"], answer: null, isFlagged: false, isShaded: false },
            { id: 3, question: "What is the integral of 2x?", options: ["x^2", "2x^2", "x", "x^2 + C"], answer: null, isFlagged: false, isShaded: false },
            { id: 4, question: "What is the value of pi to 2 decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], answer: null, isFlagged: false, isShaded: false },
            { id: 5, question: "What is the sine of 90 degrees?", options: ["0", "0.5", "1", "-1"], answer: null, isFlagged: false, isShaded: false },
            { id: 6, question: "In a right triangle, what is the longest side called?", options: ["Adjacent", "Opposite", "Hypotenuse", "Base"], answer: null, isFlagged: false, isShaded: false },
            { id: 7, question: "What is 10 factorial (10!)?", options: ["3628800", "362880", "1000000", "10"], answer: null, isFlagged: false, isShaded: false },
            { id: 8, question: "What is the square root of 144?", options: ["10", "11", "12", "14"], answer: null, isFlagged: false, isShaded: false },
            { id: 9, question: "Is the number 2 prime or composite?", options: ["Prime", "Composite", "Neither", "Both"], answer: null, isFlagged: false, isShaded: false },
            { id: 10, question: ":What is the area of a circle with radius r?", options: ["2*pi*r", "pi*r^2", "pi*d", "2*r"], answer: null, isFlagged: false, isShaded: false }
        ],
        "Chemistry": [
            { id: 1, question: "A nuclear breakdown in which particles or magnetic radiation is emitted is ____________.", options: ["Radioactive isotopes", "Radio waves", "Radioactivity", "Radioactive decay"], answer: null, isFlagged: false, isShaded: false },
            { id: 2, question: "The center of an atom, which contains protons and neutrons, is the ____________.", options: ["Electron cloud", "Valence shell", "Nucleus", "Orbit"], answer: null, isFlagged: false, isShaded: false },
            { id: 3, question: "One of the following are not parts of subatomic particle", options: ["Proton", "Nucleus", "Neutron", "Electron"], answer: null, isFlagged: false, isShaded: false },
            { id: 4, question: "Atoms of the same element that have different numbers of neutrons are called ____________.", options: ["Isomers", "Isotopes", "Allotropes", "Ions"], answer: null, isFlagged: false, isShaded: false },
            { id: 5, question: "Which type of nuclear radiation has the highest penetrating power?", options: ["Alpha particles", "Beta particles", "Gamma rays", "Positrons"], answer: null, isFlagged: false, isShaded: false },
            { id: 6, question: "The vertical columns in the periodic table are known as ____________.", options: ["Periods", "Series", "Rows", "Groups"], answer: null, isFlagged: false, isShaded: false },
            { id: 7, question: "A bond formed by the sharing of electron pairs between atoms is a ____________.", options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], answer: null, isFlagged: false, isShaded: false },
            { id: 8, question: "Which subatomic particle carries a negative electric charge?", options: ["Proton", "Neutron", "Electron", "Nucleus"], answer: null, isFlagged: false, isShaded: false },
            { id: 9, question: "The energy required to remove an electron from an atom is called ____________.", options: ["Electron affinity", "Electronegativity", "Ionization energy", "Activation energy"], answer: null, isFlagged: false, isShaded: false },
            { id: 10, question: "According to the Law of Conservation of Mass, in a chemical reaction, matter is ____________.", options: ["Created", "Destroyed", "Neither created nor destroyed", "Transformed into energy"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 11, question: "A substance that speeds up a chemical reaction without being consumed is a ____________.", options: ["Reactant", "Product", "Catalyst", "Solvent"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 12, question: "Elements in Group 18 of the periodic table are known as ____________.", options: ["Alkali metals", "Halogens", "Noble gases", "Transition metals"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 13, question: "An atom that has gained one or more electrons and carries a negative charge is called a(n) ____________.", options: ["Cation", "Anion", "Isotope", "Neutral atom"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 14, question: "Which of the following is a characteristic of an endothermic reaction?", options: ["Heat is released", "Temperature of surroundings increases", "Heat is absorbed", "It occurs spontaneously"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 15, question: "The ability of an atom to attract shared electrons in a chemical bond is ____________.", options: ["Radioactivity", "Electronegativity", "Valency", "Conductivity"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 16, question: "Which state of matter has a definite shape and a definite volume?", options: ["Gas", "Liquid", "Solid", "Plasma"], answer: null, isFlagged: false, isShaded: false },
        ],
        "Physics": [
           { 
    id: 1, 
    question: "A solid sphere of mass M and radius R rolls without slipping down an incline of angle theta. What is the minimum coefficient of static friction required to prevent slipping?", 
    options: ["(2/7) * tan(theta)", "(2/5) * tan(theta)", "(5/7) * tan(theta)", "(1/3) * tan(theta)"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "An electron moves in a uniform magnetic field B pointing along the z-axis. According to the Dirac equation, what is the exact energy splitting due to the anomalous magnetic moment?", 
    options: ["Delta E = g * mu_B * B", "Delta E = 2 * mu_B * B", "Delta E = (alpha / pi) * mu_B * B", "Delta E = h-bar * omega_c"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "In a Type-II superconductor, what describes the structure and behavior of the magnetic flux lines in the mixed state (Abrikosov vortex lattice)?", 
    options: ["Hexagonal lattice of quantized flux tubes with a core of normal-state material", "Square lattice of perfect diamagnetic zones with zero field penetration", "Randomly distributed macroscopic rings of continuous current loops", "Concentric cylindrical shells of alternating superconducting phases"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "What is the physical significance of the Killing vector field in the context of a metric tensor in General Relativity?", 
    options: ["It defines the path of an accelerating non-inertial observer", "It generates a continuous isometry or symmetry in the spacetime geometry", "It measures the local curvature tensor divergence in a vacuum", "It maps the conversion rate of gravitational potential to kinetic energy"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "Consider a three-dimensional isotropic harmonic oscillator in quantum mechanics. What is the degeneracy of the energy level with principal quantum number n?", 
    options: ["2n + 1", "n^2", "(n + 1)(n + 2) / 2", "2n^2"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Using the canonical transformation in Hamiltonian mechanics, if a transformation is generated by a type-1 generating function F1(q, Q, t), what is the correct relation for the old momentum p?", 
    options: ["p = dF1 / dq", "p = -dF1 / dq", "p = dF1 / dQ", "p = -dF1 / dt"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "What does the Fluctuation-Dissipation Theorem relate in statistical mechanics?", 
    options: ["The speed of a phase transition and the latent heat of a system", "The thermal fluctuations of an observable and the linear response of the system to an external force", "The entropy production rate and the total volume of the configuration space", "The microscopic kinetic energy and the macroscopic pressure gradient"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "In quantum field theory, what is the primary purpose of introducing Faddeev-Popov ghosts in the quantization of non-Abelian gauge theories?", 
    options: ["To preserve causality in high-energy macroscopic loops", "To cancel unphysical degrees of freedom arising from gauge fixing", "To generate mass terms for the gauge bosons via spontaneous symmetry breaking", "To account for dark matter interactions in the electroweak sector"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "A plasma is governed by Magnetohydrodynamics (MHD). According to Alfven's Theorem of flux freezing, what happens to the magnetic field lines when plasma resistivity is zero?", 
    options: ["The field lines diffuse rapidly through the plasma fluid", "The field lines remain locked and move along with the plasma fluid elements", "The field lines decay exponentially over a short characteristic time", "The field lines cancel each other out completely upon fluid contact"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "What is the primary physical interpretation of the sound horizon scale observed in the Cosmic Microwave Background (CMB) anisotropy power spectrum?", 
    options: ["The maximum distance sound waves could travel in the plasma before recombination", "The physical radius of the primordial singularity before inflation began", "The event horizon radius of the largest supermassive black holes in the early universe", "The boundary layer where dark energy became the dominant component of cosmic density"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
        "English": [
           { 
    id: 1, 
    question: "Select the word that best completes the sentence: 'The committee found the candidate’s presentation to be ________, as it lacked any substantial empirical data to support its grand claims.'", 
    options: ["specious", "impeccable", "substantive", "cogent"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "Identify the grammatical error in the following sentence: 'Neither the department head nor the senior researchers was willing to sign off on the controversial budget proposal.'", 
    options: ["Subject-verb disagreement", "Dangling modifier", "Incorrect pronoun case", "Faulty parallelism"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "Choose the correct phrase to complete the sentence: 'No sooner had the professor initiated the simulation ________ the power grid experienced a catastrophic failure.'", 
    options: ["than", "when", "then", "until"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "What is the function of the underlined clause in the sentence: 'The board members requested *that the financial audit be completed by Friday*.'", 
    options: ["Noun clause acting as a direct object", "Adjective clause modifying the board members", "Adverbial clause of condition", "Independent clause acting as a parenthetical"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "Choose the sentence that demonstrates the correct usage of parallel structure.", 
    options: [
      "The internship involves analyzing market trends, preparing weekly reports, and to present data to clients.", 
      "The internship involves analyzing market trends, preparing weekly reports, and presenting data to clients.", 
      "The internship involves market trend analysis, preparing weekly reports, and to present data to clients.", 
      "The internship involves to analyze market trends, preparing weekly reports, and presenting data to clients."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Identify the correct punctuation for the blank spaces: 'The research team faced multiple setbacks ________ however ________ they successfully replicated the experimental results by the end of the fiscal year.'", 
    options: ["; / ,", ", / ;", "; / ;", ", / ,"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "Select the word that best completes the sentence: 'Despite hours of intense cross-examination, the witness remained entirely ________, refusing to alter her original testimony.'", 
    options: ["resolute", "vacillating", "capricious", "irresolute"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "Which of the following options correctly replaces the underlined section to fix the dangling modifier: '*Walking down the historic corridor*, the ancient paintings immediately caught the student's attention.'", 
    options: [
      "Walking down the historic corridor, the student immediately noticed the ancient paintings.", 
      "While walking down the historic corridor, the ancient paintings were noticed by the student.", 
      "Walking down the historic corridor, attention was drawn to the ancient paintings by the student.", 
      "The ancient paintings immediately caught the student's attention while walking down the historic corridor."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "Choose the word that best completes the sentence: 'The modern digital architecture is highly ________, meaning it can easily handle a massive influx of new users without experiencing server degradation.'", 
    options: ["scalable", "obsolete", "rigid", "redundant"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "Identify the correct verb form to complete the hypothetical statement: 'If the administration ________ the potential market risks earlier, they would not be facing bankruptcy today.'", 
    options: ["had evaluated", "evaluated", "would evaluate", "evaluates"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
        "Biology": [
           { 
    id: 1, 
    question: "During eukaryotic DNA replication, how does the shelterin complex structurally protect chromosome ends from being recognized as double-strand breaks?", 
    options: [
      "It recruits DNA polymerase alpha to synthesize random protective buffers", 
      "It promotes the formation of a T-loop by invading the double-stranded telomeric region", 
      "It completely acetylates histone H3 modifications across the entire euchromatin region", 
      "It induces a permanent global arrest of the cell cycle at the G1/S transition checkpoint"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "In the Wnt/beta-catenin signaling pathway, what occurs at the molecular level in the target cell when the Wnt ligand is completely absent?", 
    options: [
      "Beta-catenin is phosphorylated by a destruction complex and targeted for proteasomal degradation", 
      "Beta-catenin translocates directly into the nucleus to act as a transcription factor alone", 
      "The Frizzled receptor undergoes spontaneous auto-phosphorylation at the plasma membrane", 
      "The LRP5/6 co-receptors form a stable homodimer to block gene transcription"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "What is the primary mechanism by which the CRISPR-Cas9 system targets a specific genomic locus for double-stranded DNA cleavage?", 
    options: [
      "Random collision followed by ATP-dependent restriction mapping of the entire chromosome", 
      "Base-pairing between the single guide RNA (sgRNA) and the target DNA sequence adjacent to a PAM site", 
      "Electrostatic interactions with the phosphate backbone of heavily methylated CpG islands", 
      "Recognition of specific tertiary protein folds in transcriptionally active chromatin loops"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "How does the phenomenon of RNA interference (RNAi) achieve sequence-specific gene silencing within mammalian cells?", 
    options: [
      "By blocking the export of all mature ribosomal subunits from the nucleolus", 
      "By loading a single-stranded siRNA into the RISC complex to guide complementary mRNA cleavage", 
      "By directly degrading the RNA polymerase II enzyme complex during transcriptional elongation", 
      "By chemically mutating the purine bases within the coding strand of genomic DNA"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "In structural biochemistry, what is the thermodynamic driving force responsible for the classic hydrophobic effect during protein folding?", 
    options: [
      "An increase in entropy of the surrounding water molecules as they are freed from structured cages", 
      "The formation of highly energetic covalent disulfide bonds between non-polar side chains", 
      "The absolute maximization of ionic salt bridges within the interior core of the protein", 
      "A massive net decrease in the global kinetic energy of the entire aqueous solvent system"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Which mechanism explains how the motor protein kinesin-1 moves processively along a microtubule track without detaching?", 
    options: [
      "A hand-over-hand mechanism tightly coordinated by alternating ATP hydrolysis in its two heads", 
      "An entirely passive diffusion process driven by global intracellular thermal gradients", 
      "A continuous electrostatic sliding mechanism that avoids breaking any chemical bonds", 
      "A power stroke entirely powered by the rapid polymerization of local actin filaments"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "During the light-dependent reactions of photosynthesis, how does the Cytochrome b6f complex directly contribute to ATP synthesis?", 
    options: [
      "It directly synthesizes ATP from ADP and inorganic phosphate in the stroma", 
      "It pumps protons across the thylakoid membrane to establish an electrochemical gradient", 
      "It transfers high-energy electrons directly to the final electron acceptor NADP+", 
      "It splits water molecules into oxygen gas, protons, and free radical electrons"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "In evolutionary genetics, what does a high ratio of non-synonymous to synonymous substitutions (dN/dS > 1) in a protein-coding gene signify?", 
    options: [
      "The gene is experiencing strong positive or diversifying selection pressure", 
      "The gene is highly conserved and undergoing intense purifying selection", 
      "The gene has become completely non-functional and is mutating neutrally", 
      "The organism has completely switched from sexual reproduction to obligate selfing"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "How do Toll-like receptors (TLRs) on mammalian innate immune cells recognize invading pathogens without prior exposure?", 
    options: [
      "By binding to highly conserved Pathogen-Associated Molecular Patterns (PAMPs)", 
      "By performing somatic recombination of their receptor genes to generate variable loops", 
      "By sampling intracellular antigens presented exclusively on host MHC Class II molecules", 
      "By secreting specialized pore-forming toxins that lyse any unrecognized bacterial membrane"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "What is the physiological role of the calcium-sensing protein synaptotagmin-1 during synaptic vesicle exocytosis in neurons?", 
    options: [
      "It acts as the calcium sensor that triggers rapid SNARE-mediated membrane fusion", 
      "It pumps excess intracellular calcium back into the rough endoplasmic reticulum lumen", 
      "It physically uncoils the post-synaptic density proteins to unmask AMPA receptors", 
      "It enzymatically degrades acetylcholine molecules inside the active synaptic cleft"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
        "Scholastic aptitude test": [
           { 
    id: 1, 
    question: "Though the politician's campaign speeches were criticized as entirely ________, his private diaries revealed a thinker capable of profound and nuanced analysis.", 
    options: ["sophomoric", "perspicacious", "pedantic", "cogent"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "The author argues that the collective memory of a society is not a passive repository of history, but a dynamic construct actively shaped by contemporary political imperatives. Which of the following best captures the author's core premise?", 
    options: [
      "History is inherently objective and immune to political bias.", 
      "Social memory is manipulated to serve present-day political goals.", 
      "Passivity is the defining characteristic of historical preservation.", 
      "Present-day imperatives have no bearing on how past events are viewed."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "Because the archival data was incredibly sparse, the historian's conclusions were necessarily ________, offering a framework based more on inference than on definitive empirical evidence.", 
    options: ["speculative", "irrefutable", "anachronistic", "dogmatic"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "Analogy -> EPHEMERAL : DURATION ::", 
    options: [
      "sluggish : speed", 
      "immaterial : relevance", 
      "parsimonious : wealth", 
      "infinitesimal : size"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "The scientist's brilliant review of the literature was anything but ________; she completely synthesized disparate fields into a highly cohesive, predictive theoretical framework.", 
    options: ["derivative", "comprehensive", "innovative", "lucid"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Analogy -> CAPRICIOUS : IMPULSE ::", 
    options: [
      "dogmatic : doubt", 
      "tenacious : resolve", 
      "lethargic : energy", 
      "mercenary : charity"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "Her writing style was characterized by a distinctive ________; she could distill an incredibly complex philosophical argument into a single, punchy, and memorable sentence.", 
    options: ["paucity", "brevity", "verbosity", "redundancy"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "If a function f(x) satisfies f(x + y) = f(x) * f(y) for all real numbers x and y, and f(1) = 3, what is the exact value of f(4)?", 
    options: ["12", "64", "81", "243"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "A secure storage container holds a total of 120 red, blue, and green tokens. If the ratio of red to blue tokens is 3:4, and the ratio of blue to green tokens is 5:6, exactly how many blue tokens are in the container?", 
    options: ["32", "40", "48", "60"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "A right circular cylinder has a radius of r and a height equal to its diameter. If a sphere is placed inside the cylinder such that it touches the top, bottom, and sides perfectly, what is the ratio of the volume of the sphere to the volume of the cylinder?", 
    options: ["1:2", "2:3", "3:4", "4:5"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }

        ]
    },
    "Social Science": {
        "Mathematics": [
            { id: 1, question: "What is 15% of 200?", options: ["15", "30", "45", "60"], answer: null, isFlagged: false, isShaded: false },
            { id: 2, question: "If a shirt costs $40 and is 25% off, what is the new price?", options: ["$10", "$20", "$30", "$35"], answer: null, isFlagged: false, isShaded: false },
            { id: 3, question: "What is the mean of 2, 4, 6, 8?", options: ["4", "5", "6", "8"], answer: null, isFlagged: false, isShaded: false },
            { id: 4, question: "Convert 1/4 to a decimal.", options: ["0.14", "0.25", "0.40", "0.50"], answer: null, isFlagged: false, isShaded: false },
            { id: 5, question: "What is the median of 1, 3, 3, 6, 7, 8, 9?", options: ["3", "5", "6", "7"], answer: null, isFlagged: false, isShaded: false },
            { id: 6, question: "Solve for y: y + 7 = 15", options: ["6", "7", "8", "9"], answer: null, isFlagged: false, isShaded: false },
            { id: 7, question: "What is the perimeter of a rectangle with length 5 and width 3?", options: ["8", "15", "16", "20"], answer: null, isFlagged: false, isShaded: false },
            { id: 8, question: "If 3 apples cost $1.50, how much do 5 apples cost?", options: ["$2.00", "$2.50", "$3.00", "$3.50"], answer: null, isFlagged: false, isShaded: false },
            { id: 9, question: "What is the probability of flipping heads on a fair coin?", options: ["1/4", "1/3", "1/2", "1"], answer: null, isFlagged: false, isShaded: false },
            { id: 10, question: "How many degrees are in a full circle?", options: ["90", "180", "270", "360"], answer: null, isFlagged: false, isShaded: false }
        ],
        "History": [
            { id: 1, question: "The liberation struggle of the Balkan people and the great power politics that accompanied it was one aspect of the so called?", options: ["Nationalism", "Eastern Question", "Balkan region", "Multi-national Empir"], answer: null, isFlagged: false, isShaded: false },
            { id: 2, question: "Which of the following countries used the theory of “Oriental-despotism” in the origin of ancient state formation?", options: ["Kush and Meroe", "Carthage and Phoenicians", "Egypt and Mesopotamia", "Greeks and Rome"], answer: null, isFlagged: false, isShaded: false },
            { id: 3, question: "The Council of Treat was?", options: ["Reform within the protestant churches", "Council of the protestant leaders", "The Reform within the catholic Churche", "The agreements between Protestants and catholic churches."], answer: null, isFlagged: false, isShaded: false },
            { id: 4, question: "Which 1884-1885 event regulated European colonization and trade in Africa during the New Imperialism period?", options: ["The Treaty of Versailles", "The Berlin Conference", "The Yalta Conference", "The Congress of Vienna"], answer: null, isFlagged: false, isShaded: false },
            { id: 5, question: "The philosophical movement of the 18th century that emphasized reason and individualism over tradition was the ____________.", options: ["Renaissance", "Reformation", "Enlightenment", "Romanticism"], answer: null, isFlagged: false, isShaded: false },
            { id: 6, question: "The primary cause of the Cold War was a fundamental ideological conflict between ____________.", options: ["Fascism and Democracy", "Capitalism and Communism", "Monarchy and Socialism", "Nationalism and Imperialism"], answer: null, isFlagged: false, isShaded: false },
            { id: 7, question: "In ancient history, the 'Fertile Crescent' primarily refers to the region of ____________.", options: ["The Nile Valley", "Mesopotamia", "The Indus Valley", "The Yellow River Valley"], answer: null, isFlagged: false, isShaded: false },
            { id: 8, question: "Which famous document, signed in 1215, limited the power of the English monarch and influenced modern constitutional law?", options: ["The Bill of Rights", "The Declaration of Independence", "The Magna Carta", "The Edict of Nantes"], answer: null, isFlagged: false, isShaded: false },
            { id: 9, question: "The policy of 'Appeasement' is most closely associated with the lead-up to which global conflict?", options: ["World War I", "The Cold War", "World War II", "The Napoleonic Wars"], answer: null, isFlagged: false, isShaded: false },
            { id: 10, question: "The zero-degree line of longitude that passes through Greenwich, England, is known as the ____________.", options: ["Equator", "Tropic of Cancer", "Prime Meridian", "International Date Line"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 11, question: "Which movement aimed to unify African people into a single global community and end colonial rule?", options: ["Apartheid", "Pan-Africanism", "Globalism", "Mercantilism"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 12, question: "The political system of the Middle Ages based on the holding of land and the resulting relationship between lord and vassal was ____________.", options: ["Socialism", "Feudalism", "Capitalism", "Totalitarianism"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 13, question: "The 'Reign of Terror' was a period of extreme violence during which major historical event?", options: ["The American Revolution", "The Industrial Revolution", "The French Revolution", "The Russian Revolution"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 14, question: "Which international organization was established in 1945 to maintain international peace and security?", options: ["The League of Nations", "The United Nations", "The African Union", "The European Union"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 15, question: "What was the main economic motive behind the 'Age of Discovery' for European powers?", options: ["To spread democracy", "To find new trade routes to Asia", "To explore the Arctic", "To establish space programs"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 16, question: "A government system where power is held by a small, elite group of people is called a(n) ____________.", options: ["Democracy", "Autocracy", "Oligarchy", "Theocracy"], answer: null, isFlagged: false, isShaded: false },
            //{ id: 17, question: "The ancient civilization known for developing the first known writing system, Cuneiform, was ____________.", options: ["The Egyptians", "The Maya", "The Sumerians", "The Romans"], answer: null, isFlagged: false, isShaded: false }
        ],
         "Scholastic aptitude test": [
             { 
    id: 1, 
    question: "In a group of 50 students, 28 are enrolled in Calculus, 22 are enrolled in Physics, and 14 are enrolled in both. How many students in the group are enrolled in neither of these two courses?", 
    options: ["0", "4", "10", "14"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "If log_x(81) = 4/3, what is the value of the base x?", 
    options: ["3", "9", "27", "243"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "The average (arithmetic mean) of 7 consecutive integers is K. If the largest of these integers is removed, by how much does the average of the remaining integers decrease?", 
    options: ["0.5", "1", "K - 1", "0.5K"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "An automated assembly line can produce N components in exactly H hours. Working at this exact same constant rate, how many hours will it take a fleet of 3 identical assembly lines to produce a total of 5N components?", 
    options: ["(5/3)H", "(3/5)H", "15H", "(15/N)H"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "Five executives (A, B, C, D, E) sit in a straight row of five chairs. If A cannot sit next to B, and C must sit exactly in the middle chair, how many different seating arrangements are mathematically possible?", 
    options: ["8", "12", "16", "24"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Statement 1: All high-performing employees attend the annual leadership retreat. Statement 2: No contract worker attends the annual leadership retreat. Based solely on these statements, which of the following must be true?", 
    options: [
      "Some contract workers are high-performing employees.", 
      "No contract worker is a high-performing employee.", 
      "All high-performing employees are contract workers.", 
      "Anyone who attends the retreat is a contract worker."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "An analyst notes: 'If interest rates rise, housing sales drop. Housing sales did not drop this quarter.' Which of the following conclusions logically follows from the analyst's rules?", 
    options: [
      "Interest rates definitely rose this quarter.", 
      "Interest rates definitely did not rise this quarter.", 
      "Housing sales will drop dramatically next quarter.", 
      "Interest rates remained completely unchanged."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "Six standard books are stacked vertically. The History book is directly above the Chemistry book. The Math book is somewhere below the Chemistry book but above the Art book. The Physics book is at the very top. If the Biology book is somewhere between the Math and Art books, which book is sitting at the very bottom of the stack?", 
    options: ["Math", "Chemistry", "Art", "Biology"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "A technology store sells premium laptops and tablets. Premise 1: Every item that costs over $1,000 comes with a free warranty plan. Premise 2: Some tablets in the store cost over $1,000. Which statement must be true based on these premises?", 
    options: [
      "All premium laptops come with a free warranty plan.", 
      "Some tablets come with a free warranty plan.", 
      "No tablets under $1,000 have a warranty plan.", 
      "Every item with a free warranty plan is a tablet."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "Consider the sequence: 3, 7, 15, 31, 63, ... What is the algebraic expression for the n-th term (T_n) of this sequence, where n starts at 1?", 
    options: ["2^n + 1", "2^(n+1) - 1", "4n - 1", "2^n + n"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
         "Geography": [
           { 
    id: 1, 
    question: "What primary geomorphological process is responsible for the formation of a 'karst' landscape topology?", 
    options: [
      "The chemical dissolution of soluble rocks such as limestone or dolomite by acidic water", 
      "The mechanical abrasion of basaltic rock by high-velocity eolian wind currents", 
      "The rapid deposition of glacial till along the margins of a retreating ice sheet", 
      "The tectonic subduction of oceanic crust beneath an overriding continental plate"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "Which map projection preserves local angles and shapes perfectly at the expense of distorting the true size of landmasses near the poles?", 
    options: ["Mercator projection", "Gall-Peters projection", "Robinson projection", "Winkel Tripel projection"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "In demography, what specific transition occurs during 'Stage 3' of the classic Demographic Transition Model (DTM)?", 
    options: [
      "Death rates drop rapidly while birth rates remain exceptionally high", 
      "Birth rates begin to decline sharply while death rates continue to fall slowly", 
      "Both birth rates and death rates stabilize at a uniformly low level", 
      "Birth rates spike significantly due to sudden agricultural modernization"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "The Wallace Line is a famous biogeographical boundary that separates the distinct ecozones of which two regions?", 
    options: ["Asia and Wallacea/Australia", "Nearctic and Neotropical", "Afrotropic and Palearctic", "South America and Antarctica"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "What meteorological phenomenon is characterized by dry, warm, down-slope winds that occur on the leeward side of a mountain range?", 
    options: ["Foehn / Chinook wind", "Hadley cell circulation", "Monsoonal depression", "Katabatic drainage wind"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "According to Walter Christaller’s Central Place Theory, what does the 'Hexagonal' geometric arrangement of markets primarily eliminate?", 
    options: [
      "Unserved areas and overlapping market perimeters", 
      "High transportation costs across rugged mountainous terrain", 
      "The need for government intervention in regional trade pricing", 
      "Population density variations between rural and urban sectors"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "Which narrow, strategic body of water links the Persian Gulf directly to the Gulf of Oman and the open Arabian Sea?", 
    options: ["Strait of Hormuz", "Bab-el-Mandeb", "Strait of Malacca", "Suez Canal"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "What is the primary operational cause of 'oxbow lake' formation within a lowland river system?", 
    options: [
      "Continuous lateral erosion and eventual neck cutoff of a highly sinuous meander loop", 
      "Tectonic faulting that abruptly drops the local elevation of the riverbed", 
      "The seasonal accumulation of heavy glacial meltwater blocks the main channel", 
      "Human channelization projects built to divert urban storm runoff streams"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "In climatology, what serves as the defining structural boundary between the troposphere and the stratosphere?", 
    options: ["Tropopause", "Stratopause", "Mesopause", "Thermopause"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "Which concept describes an economic model where a dominant urban core directly exploits the natural resources of its underdeveloped periphery?", 
    options: ["Core-Periphery Model", "Von Thünen rings", "Rostow's Stages of Growth", "Malthusian Trap"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
        "English": [
           { 
    id: 1, 
    question: "Select the word that best completes the sentence: 'The CEO's public apology was widely criticized as ________, as her tone lacked any genuine remorse for the company's ethical breach.'", 
    options: ["disingenuous", "candid", "magnanimous", "unflappable"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "Identify the grammatical error in the following sentence: 'The database administrator decided to run the diagnostic tool, backup the main server, and optimizing the storage allocation.'", 
    options: ["Faulty parallelism", "Dangling modifier", "Comma splice", "Inverted word order"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "Choose the correct phrase to complete the sentence: 'Hardly had the lead soprano stepped onto the stage ________ the audience erupted into a thunderous standing ovation.'", 
    options: ["when", "than", "then", "until"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "What is the structural function of the underlined clause in this sentence: 'The discovery *that deep-sea hydrothermal vents harbor unique ecosystems* revolutionized marine biology.'", 
    options: ["Noun clause in apposition to the subject", "Relative adjective clause modifying discovery", "Adverbial clause of concession", "Coordinate independent clause"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "Choose the option that avoids the error of a comma splice and maintains correct logical coordination.", 
    options: [
      "The experimental drug showed immense promise in early trials, however, federal approval took several years.", 
      "The experimental drug showed immense promise in early trials; however, federal approval took several years.", 
      "The experimental drug showed immense promise in early trials, federal approval took several years.", 
      "The experimental drug showed immense promise in early trials however federal approval took several years."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "Select the word that best completes the sentence: 'The contract provisions were intentionally ________, allowing both parties to interpret the ambiguous clauses to their own advantage.'", 
    options: ["equivocal", "unequivocal", "lucid", "stringent"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "Identify the correct pronoun form to complete the sentence: 'The scholarship committee granted the final interviews to the three candidates, namely Marcus, Sarah, and ________.'", 
    options: ["me", "I", "myself", "mine"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "Which of the following options correctly replaces the underlined section to fix the misplaced modifier: '*Covered in dense layers of rust*, the engineer safely deactivated the old turbine.'", 
    options: [
      "The engineer safely deactivated the old turbine, which was covered in dense layers of rust.", 
      "Covered in dense layers of rust, the deactivation of the old turbine was completed by the engineer.", 
      "The engineer, covered in dense layers of rust, safely deactivated the old turbine.", 
      "Deactivating the old turbine safely, it was covered in dense layers of rust by the engineer."
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "Choose the word that best completes the sentence: 'The regional governor's power has become completely ________, leaving the local municipal councils with no authority to pass independent budgets.'", 
    options: ["absolute", "nominal", "attenuated", "subordinate"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "Identify the correct verb structure to complete the conditional sentence: 'If the laboratory technician had calibrated the spectrometer correctly yesterday, the current data readings ________ anomalous.'", 
    options: ["would not be", "would not have been", "will not be", "are not"], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ],
        "Economics": [
           { 
    id: 1, 
    question: "In a simultaneous-move game, what condition defines a Nash Equilibrium in pure strategies?", 
    options: [
      "Each player chooses a strategy that maximizes joint payoffs regardless of the opponent's choice", 
      "No player can strictly increase their expected payoff by unilaterally changing their chosen strategy", 
      "All players choose the strategy that minimizes the maximum possible loss of the opponent", 
      "The dominant strategy of the highest-paying player is perfectly replicated by all other participants"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 2, 
    question: "According to the Lucas Critique, why is it problematic to evaluate economic policy changes using historical macroeconometric data?", 
    options: [
      "Historical data fails to account for changes in the nominal interest rate set by central banks", 
      "The underlying parameters of behavioral equations change when individuals update their expectations about new policies", 
      "The aggregate supply curve becomes permanently horizontal in the long run under rational expectations", 
      "Statistical measurement errors grow exponentially over time when tracking consumer price indices"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 3, 
    question: "What does the Coase Theorem state regarding externality problems when property rights are well-defined and transaction costs are zero?", 
    options: [
      "The government must impose a Pigouvian tax to achieve a socially optimal allocation of resources", 
      "Private bargaining will lead to an efficient outcome regardless of which party holds the initial property rights", 
      "The market will completely stop production of the good causing the negative external effect", 
      "Monopolistic firms will voluntarily lower their prices to compensate affected consumers"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 4, 
    question: "In econometrics, what is the primary consequence of violating the homoscedasticity assumption in an Ordinary Least Squares (OLS) linear regression model?", 
    options: [
      "The OLS coefficient estimates become highly biased and completely inconsistent", 
      "The standard errors are calculated incorrectly, making hypothesis testing and t-statistics unreliable", 
      "The R-squared value automatically drops to zero regardless of the model's actual explanatory power", 
      "The independent variables exhibit perfect multicollinearity with the error term"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 5, 
    question: "In the context of the Solow-Swan Growth Model, what occurs when an economy reaches its steady-state capital labor ratio?", 
    options: [
      "Output per worker and capital per worker grow at the exact rate of technological progress", 
      "The total aggregate savings rate drops to zero as consumption is maximized", 
      "The depreciation rate of physical capital becomes completely independent of the total capital stock", 
      "Economic growth accelerates exponentially due to increasing returns to scale"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 6, 
    question: "What characteristic distinguishes a public good from a common-pool resource in microeconomic theory?", 
    options: [
      "A public good is non-excludable and non-rivalrous, while a common-pool resource is non-excludable but rivalrous", 
      "A public good is strictly provided by the state, while common-pool resources are exclusively private", 
      "A public good has a highly elastic demand curve, while a common-pool resource has a fixed supply", 
      "A public good generates positive externalities, while a common-pool resource generates zero externalities"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 7, 
    question: "Under the Mundell-Fleming model for a small open economy, how does an expansionary fiscal policy affect output under a flexible exchange rate regime with perfect capital mobility?", 
    options: [
      "Output increases significantly due to a massive multiplier effect on domestic investment", 
      "Output remains completely unchanged because currency appreciation totally crowds out net exports", 
      "Output decreases as the central bank is forced to dramatically contract the domestic money supply", 
      "Output doubles as foreign capital inflows lower the domestic nominal interest rate to zero"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 8, 
    question: "What does the Arrow Impossibility Theorem prove regarding a social welfare function matching specific fairness criteria?", 
    options: [
      "No ranked-choice voting system can convert individual preferences into a community-wide ranking without violating at least one basic condition", 
      "A competitive market economy will always reach a Pareto efficient allocation of resources automatically", 
      "Direct taxation of income always reduces total economic efficiency more than a flat consumption tax", 
      "Perfect price discrimination by a monopoly completely eliminates deadweight loss in all market structures"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 9, 
    question: "How does asymmetric information manifest as 'Adverse Selection' in the health insurance market?", 
    options: [
      "Individuals behave more recklessly and take greater health risks after securing an insurance policy", 
      "High-risk individuals are more likely to purchase insurance than low-risk individuals, unbalancing the risk pool", 
      "Insurance companies systematically overcharge low-income families to maximize quarterly profit margins", 
      "Doctors perform unnecessary medical procedures because the insurance company covers the entire cost"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  },
  { 
    id: 10, 
    question: "According to the permanent income hypothesis proposed by Milton Friedman, how does a consumer react to a one-time, temporary tax rebate?", 
    options: [
      "They immediately spend the entire rebate amount on current non-durable consumption goods", 
      "They save the majority of the temporary windfall, changing current consumption only marginally", 
      "They permanently increase their labor supply to maintain a higher baseline level of income", 
      "They increase their borrowing from commercial banks to leverage the newly acquired assets"
    ], 
    answer: null, 
    isFlagged: false, 
    isShaded: false 
  }
        ]
    }
};

// Compatibility helpers: existing subjects are treated as "Mock Exam" data.
function getExamTypesForSubject(stream, subject) {
    const subjectData = questionBank?.[stream]?.[subject];
    if (!subjectData) return [];
    if (Array.isArray(subjectData)) return ["Mock Exam"];
    return Object.entries(subjectData)
        .filter(([, questions]) => Array.isArray(questions) && questions.length > 0)
        .map(([type]) => type);
}

function getExamQuestionsForSubject(stream, subject, examType = "Mock Exam") {
    const subjectData = questionBank?.[stream]?.[subject];
    if (!subjectData) return [];

    if (Array.isArray(subjectData)) {
        return examType === "Mock Exam" ? subjectData : [];
    }

    const questions = subjectData[examType];
    return Array.isArray(questions) ? questions : [];
}

function getStreamSubjects(stream) {
    const streamData = questionBank?.[stream] || {};
    return Object.keys(streamData);
}
