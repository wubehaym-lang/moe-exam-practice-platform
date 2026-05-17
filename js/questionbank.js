
// 1. The Nested Question Bank (Stream -> Subject -> Questions)
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
           
        ],
        "English": [
           
        ],
        "Biology": [
           
        ],
        "Scholastic aptitude test": [
           
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
           
        ],
         "Geography": [
           
        ],
        "English": [
           
        ],
        "Economics": [
           
        ]
    }
};
