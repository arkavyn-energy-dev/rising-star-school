// Generates 30 class-appropriate MCQ questions (Math, Science, General Knowledge)
// for online admission screening tests — Classes 5 through 10.

const MATH = {
  5: [
    ["What is 25 + 17?", ["40", "42", "43", "41"], 1],
    ["What is 8 × 7?", ["54", "56", "58", "48"], 1],
    ["Which is the largest: 456, 465, 546?", ["456", "465", "546", "454"], 2],
    ["How many sides does a hexagon have?", ["5", "6", "7", "8"], 1],
    ["What is 100 − 37?", ["63", "73", "53", "67"], 0],
    ["What is 144 ÷ 12?", ["11", "12", "13", "14"], 1],
    ["Which fraction equals 1/2?", ["2/4", "1/3", "3/5", "2/3"], 0],
    ["What is the place value of 5 in 3,528?", ["5", "50", "500", "5000"], 2],
    ["Perimeter of a square with side 9 cm?", ["18 cm", "27 cm", "36 cm", "81 cm"], 2],
    ["What is 15 × 4?", ["50", "60", "55", "65"], 1],
  ],
  6: [
    ["What is (-3) + 8?", ["5", "-5", "11", "-11"], 0],
    ["LCM of 4 and 6?", ["12", "24", "6", "18"], 0],
    ["Area of rectangle 8 cm × 5 cm?", ["13 cm²", "40 cm²", "26 cm²", "80 cm²"], 1],
    ["What is 3/4 + 1/4?", ["1", "4/8", "2/4", "1/2"], 0],
    ["Value of 2³?", ["6", "8", "9", "4"], 1],
    ["How many degrees in a right angle?", ["90°", "180°", "45°", "360°"], 0],
    ["What is 0.5 as a fraction?", ["1/5", "1/2", "5/10", "1/4"], 1],
    ["Sum of angles in a triangle?", ["180°", "360°", "90°", "270°"], 0],
    ["What is 35% of 200?", ["70", "60", "80", "35"], 0],
    ["Simple interest on ₹1000 at 10% for 1 year?", ["₹100", "₹110", "₹50", "₹200"], 0],
  ],
  7: [
    ["What is (-5) × (-3)?", ["-15", "15", "-8", "8"], 1],
    ["HCF of 18 and 24?", ["6", "12", "3", "8"], 0],
    ["(a+b)² expands to?", ["a²+b²", "a²+2ab+b²", "a²−b²", "2a+2b"], 1],
    ["What is √144?", ["11", "12", "13", "14"], 1],
    ["Complementary angles sum to?", ["90°", "180°", "360°", "45°"], 0],
    ["Profit if CP=₹500, SP=₹650?", ["₹150", "₹100", "₹200", "₹250"], 0],
    ["What is 2.5 × 4?", ["8", "10", "9", "12"], 1],
    ["Ratio 2:3, total 25 — smaller part?", ["10", "15", "12", "8"], 0],
    ["Volume of cube with edge 3 cm?", ["9 cm³", "27 cm³", "18 cm³", "6 cm³"], 1],
    ["What is 3/5 of 100?", ["60", "50", "30", "40"], 0],
  ],
  8: [
    ["What is x if 2x + 6 = 14?", ["3", "4", "5", "6"], 1],
    ["(−2)⁴ equals?", ["16", "-16", "8", "-8"], 0],
    ["Area of circle r=7 cm (π=22/7)?", ["154 cm²", "44 cm²", "49 cm²", "22 cm²"], 0],
    ["What is the slope of y = 3x + 2?", ["2", "3", "5", "1"], 1],
    ["Factorize: x² − 9", ["(x−3)²", "(x+3)(x−3)", "(x+9)", "x(x−9)"], 1],
    ["What is 15% of 240?", ["36", "24", "30", "40"], 0],
    ["Sum of first 10 natural numbers?", ["55", "45", "50", "60"], 0],
    ["If sin θ = 3/5, cos²θ + sin²θ = ?", ["1", "9/25", "16/25", "0"], 0],
    ["What is 0.75 as a percentage?", ["75%", "7.5%", "0.75%", "750%"], 0],
    ["Distance = speed × time. Speed 60 km/h, time 2.5 h?", ["120 km", "150 km", "130 km", "140 km"], 1],
  ],
  9: [
    ["What is the value of (a−b)² when a=5, b=2?", ["9", "49", "7", "25"], 0],
    ["√50 simplified?", ["5√2", "25√2", "2√5", "10√5"], 0],
    ["Quadratic formula solves ax²+bx+c=0 using?", ["−b±√(b²−4ac)/2a", "b²−4ac", "−b/2a", "c/a"], 0],
    ["What is log₁₀(1000)?", ["2", "3", "10", "100"], 1],
    ["If two triangles are similar, their sides are?", ["Equal", "Proportional", "Parallel", "Perpendicular"], 1],
    ["What is the nth term of AP: 3, 7, 11...?", ["4n−1", "3n+4", "n+3", "4n+3"], 0],
    ["Surface area of sphere r=7 (π=22/7)?", ["616 cm²", "154 cm²", "308 cm²", "462 cm²"], 0],
    ["What is (2x)³?", ["6x³", "8x³", "2x³", "8x"], 1],
    ["Probability of head in fair coin?", ["1/2", "1", "0", "1/4"], 0],
    ["What is 2⁵?", ["16", "32", "64", "25"], 1],
  ],
  10: [
    ["What is the discriminant of x²−5x+6=0?", ["1", "25", "−1", "49"], 0],
    ["sin 30° equals?", ["1/2", "√3/2", "1", "0"], 0],
    ["What is the mean of 4, 6, 8, 10?", ["7", "8", "6", "9"], 0],
    ["If CP=₹800, loss 10%, SP is?", ["₹720", "₹880", "₹700", "₹760"], 0],
    ["What is tan 45°?", ["1", "0", "√3", "1/2"], 0],
    ["Sum of AP first n terms formula?", ["n/2(a+l)", "n(a+l)", "n²/2", "a+(n−1)d"], 0],
    ["What is 3⁻²?", ["9", "1/9", "−9", "6"], 1],
    ["Distance between (0,0) and (3,4)?", ["5", "7", "6", "4"], 0],
    ["What is the value of π (approx)?", ["3.14", "2.71", "1.618", "2.14"], 0],
    ["Compound interest factor for 2 years at 10%?", ["1.21", "1.20", "1.10", "2.10"], 0],
  ],
};

const SCIENCE = {
  5: [
    ["Plants make food by?", ["Respiration", "Photosynthesis", "Digestion", "Transpiration"], 1],
    ["Which gas do we breathe in?", ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], 1],
    ["The Sun is a?", ["Planet", "Star", "Moon", "Comet"], 1],
    ["Water boils at ___ °C.", ["50", "100", "0", "200"], 1],
    ["Which organ pumps blood?", ["Lungs", "Heart", "Brain", "Stomach"], 1],
    ["Rusting of iron is?", ["Physical change", "Chemical change", "Reversible", "Melting"], 1],
    ["Which is a herbivore?", ["Lion", "Cow", "Eagle", "Snake"], 1],
    ["Earth has ___ natural satellites.", ["0", "1", "2", "3"], 1],
    ["Sound travels fastest in?", ["Vacuum", "Air", "Water", "Steel"], 3],
    ["Which vitamin comes from sunlight?", ["A", "B", "C", "D"], 3],
  ],
  6: [
    ["Unit of force is?", ["Joule", "Newton", "Watt", "Pascal"], 1],
    ["Which layer of Earth do we live on?", ["Core", "Mantle", "Crust", "Magma"], 2],
    ["Acids turn blue litmus?", ["Blue", "Red", "Green", "Yellow"], 1],
    ["Photosynthesis occurs in?", ["Roots", "Chloroplasts", "Stem", "Flowers"], 1],
    ["Speed = distance / ?", ["Time", "Mass", "Force", "Volume"], 0],
    ["Which blood cells fight infection?", ["RBC", "WBC", "Platelets", "Plasma"], 1],
    ["Magnet has two?", ["Charges", "Poles", "Faces", "Edges"], 1],
    ["Evaporation is?", ["Heating liquid to gas at surface", "Boiling", "Freezing", "Condensation only"], 0],
    ["Which gas is used in fire extinguishers?", ["Oxygen", "CO₂", "Nitrogen", "Hydrogen"], 1],
    ["Human skeleton has about ___ bones.", ["106", "206", "306", "506"], 1],
  ],
  7: [
    ["Symbol of sodium is?", ["So", "Na", "S", "N"], 1],
    ["Electric current unit is?", ["Volt", "Ampere", "Ohm", "Watt"], 1],
    ["Which organelle is the powerhouse of cell?", ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], 1],
    ["Reproduction in Amoeba is by?", ["Budding", "Binary fission", "Spores", "Seeds"], 1],
    ["Heat flows from ___ to ___ temperature.", ["Low, high", "High, low", "Equal, equal", "Cold, cold"], 1],
    ["pH of pure water is?", ["0", "7", "14", "1"], 1],
    ["Which mirror is used in vehicles?", ["Plane", "Concave", "Convex", "None"], 2],
    ["Respiration releases?", ["Oxygen", "Energy", "Chlorophyll", "Starch only"], 1],
    ["Fossil fuels include?", ["Solar, wind", "Coal, petroleum", "Water, air", "Biogas only"], 1],
    ["Deficiency of iron causes?", ["Scurvy", "Anaemia", "Rickets", "Goitre"], 1],
  ],
  8: [
    ["Law of reflection: angle of incidence = angle of?", ["Refraction", "Reflection", "Incidence", "Deviation"], 1],
    ["Valency of oxygen is?", ["1", "2", "3", "4"], 1],
    ["Which hormone regulates blood sugar?", ["Adrenaline", "Insulin", "Thyroxine", "Estrogen"], 1],
    ["Work = force × ?", ["Mass", "Distance", "Time", "Speed"], 1],
    ["Isotopes have same ___ but different mass.", ["Protons", "Neutrons only", "Electrons only", "Nucleus size"], 0],
    ["Sound cannot travel through?", ["Air", "Water", "Vacuum", "Metal"], 2],
    ["Crop rotation helps maintain?", ["Soil fertility", "Wind speed", "Rainfall", "Temperature"], 0],
    ["Metals are generally?", ["Brittle", "Ductile", "Insulators", "Non-lustrous"], 1],
    ["Human eye lens is?", ["Convex", "Concave", "Plane", "Cylindrical"], 0],
    ["Unit of pressure is?", ["Newton", "Pascal", "Joule", "Watt"], 1],
  ],
  9: [
    ["Atomic number equals number of?", ["Neutrons", "Protons", "Electrons in ion", "Nucleons only"], 1],
    ["Ohm's law: V = ?", ["I/R", "IR", "R/I", "I+R"], 1],
    ["Which tissue transports water in plants?", ["Phloem", "Xylem", "Cambium", "Epidermis"], 1],
    ["Gravitational force depends on?", ["Mass and distance", "Color only", "Shape only", "Volume only"], 0],
    ["Balanced chemical equation obeys?", ["Law of conservation of mass", "Law of gravity", "Law of floatation", "None"], 0],
    ["Human chromosome number is?", ["23", "46", "48", "44"], 1],
    ["Lens formula: 1/f = ?", ["u+v", "1/u+1/v", "u−v", "uv"], 1],
    ["Greenhouse effect is due to?", ["O₂", "CO₂ and other gases", "N₂ only", "He"], 1],
    ["Resistance unit is?", ["Volt", "Ohm", "Ampere", "Coulomb"], 1],
    ["DNA stands for?", ["Deoxyribonucleic acid", "Dinitrogen acid", "Dynamic nuclear acid", "None"], 0],
  ],
  10: [
    ["Faraday's law relates to?", ["Electromagnetic induction", "Gravity", "Optics", "Thermodynamics only"], 0],
    ["pH less than 7 indicates?", ["Base", "Acid", "Neutral", "Salt only"], 1],
    ["Human heart has ___ chambers.", ["2", "3", "4", "5"], 2],
    ["Power = work / ?", ["Force", "Time", "Distance", "Mass"], 1],
    ["Mendel is known for?", ["Theory of relativity", "Laws of inheritance", "Periodic table", "Evolution only"], 1],
    ["Snell's law relates to?", ["Reflection", "Refraction", "Diffraction", "Polarization"], 1],
    ["Ozone layer protects from?", ["Visible light", "UV radiation", "Infrared only", "Sound"], 1],
    ["Redox reaction involves?", ["Transfer of electrons", "Only precipitation", "Only neutralization", "Only decomposition"], 0],
    ["Unit of electric charge is?", ["Ampere", "Coulomb", "Volt", "Ohm"], 1],
    ["Photosynthesis equation produces?", ["CO₂ and water", "Glucose and O₂", "N₂", "Methane"], 1],
  ],
};

const GK = [
  ["Capital of India is?", ["Mumbai", "New Delhi", "Kolkata", "Chennai"], 1],
  ["Who wrote the Indian National Anthem?", ["Tagore", "Gandhi", "Nehru", "Bankim Chandra"], 0],
  ["Largest planet in our solar system?", ["Earth", "Jupiter", "Mars", "Saturn"], 1],
  ["How many states in India (2024)?", ["28", "29", "30", "27"], 0],
  ["Bihar's capital is?", ["Patna", "Ranchi", "Lucknow", "Bettiah"], 0],
  ["Father of the Nation (India)?", ["Nehru", "Gandhi", "Patel", "Bose"], 1],
  ["Independence Day of India?", ["26 Jan", "15 Aug", "2 Oct", "14 Nov"], 1],
  ["Which river flows through Bihar?", ["Ganga", "Narmada", "Godavari", "Krishna"], 0],
  ["Smallest prime number?", ["0", "1", "2", "3"], 2],
  ["National animal of India?", ["Lion", "Tiger", "Elephant", "Peacock"], 1],
  ["How many days in a leap year?", ["365", "366", "364", "360"], 1],
  ["Which gas plants absorb for photosynthesis?", ["Oxygen", "CO₂", "Nitrogen", "Hydrogen"], 1],
  ["First Prime Minister of India?", ["Nehru", "Gandhi", "Shastri", "Patel"], 0],
  ["Currency of India?", ["Dollar", "Rupee", "Yen", "Pound"], 1],
  ["How many continents?", ["5", "6", "7", "8"], 2],
  ["Largest ocean on Earth?", ["Atlantic", "Indian", "Pacific", "Arctic"], 2],
  ["Who discovered gravity (popularly credited)?", ["Einstein", "Newton", "Galileo", "Edison"], 1],
  ["Republic Day of India?", ["15 Aug", "26 Jan", "2 Oct", "14 Nov"], 1],
  ["National bird of India?", ["Peacock", "Parrot", "Eagle", "Swan"], 0],
  ["Which organ helps us breathe?", ["Heart", "Lungs", "Kidney", "Liver"], 1],
];

function buildQuestions(classNum) {
  const math = MATH[classNum] || MATH[5];
  const science = SCIENCE[classNum] || SCIENCE[5];
  const questions = [];

  for (let i = 0; i < 10; i++) {
    const [text, options, correct] = math[i];
    questions.push({ questionText: text, options, correctOptionIndex: correct });
  }
  for (let i = 0; i < 10; i++) {
    const [text, options, correct] = science[i];
    questions.push({ questionText: text, options, correctOptionIndex: correct });
  }
  for (let i = 0; i < 10; i++) {
    const [text, options, correct] = GK[i];
    questions.push({ questionText: text, options, correctOptionIndex: correct });
  }

  return questions;
}

module.exports = { buildQuestions };
