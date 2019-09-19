import { constants } from './constants';

export var allCurrentMoves ={
  "Advantage": ["Advantage Awarded"],
  "Match Outcome": ["Win", "Tie; Draw"],
  "Guard Passes or Guard Pass Attempts":[
    "X Pass",
    "Leg Drag",
    "Knee Slice",
    "Back Step",
    "Over Under Pass",
    "Double Under Pass",
    "Toreando Pass",
    "Guard Pass from Berimbolo or Inverted Position",
    "Name is missing from this list",
    "I don't know whether there's a name for this guard pass"
  ],
  "Take Downs or Take Down Attempts":[
    "Knee Drop Ogoshi; Knee Drop",
    "Single Leg",
    "High Single",
    "Double Leg",
    "Ankle Pick",
    "Scissor Takedown",
    "Suplex",
    "Deashi Harai; Forward Foot Sweep",
    "Hiza Guruma; Knee Wheel",
    "Sasae Tsurikomi Ashi; Lifting Pulling Ankle Block",
    "Uki Goshi; Floating Hip",
    "Osoto Gari; Large Outer Reaping",
    "O Goshi; Large Hip Throw",
    "Ouchi Gari; Large Inner Reaping",
    "Seoi Nage; Two Arm Shoulder Throw",
    "Kosoto Gari; Small Outside Reap",
    "Kouchi Gari; Small Inner Reap",
    "Koshi Guruma; Hip Wheel",
    "Tsurikomi Goshi; Lifting Pulling Hip",
    "Okuriashi Harai; Following Foot Sweep",
    "Tai Otoshi; Body Drop",
    "Harai Goshi; Sweeping Hip Throw",
    "Uchi Mata",
    "Kosoto Gake; Small Outside Hook",
    "Tsuri Goshi; Lifting Hip",
    "Yoko Otoshi; Side Drop",
    "Ashi Guruma; Leg Wheel",
    "Hane Goshi; Spring Hip Throw",
    "Harai Tsurikomi Ashi;Lifting Pulling Foot Sweep",
    "Tomoe Nage; Circle Throw",
    "Kata Guruma; Shoulder Wheel",
    "Sumi Gaeshi; Corner Reversal",
    "Tani Otoshi; Valley Drop",
    "Hane Makikomi; Spring Wrap-around Throw",
    "Sukui Nage; Scoop Throw",
    "Utsuri Goshi; Changing Hip Throw",
    "O Guruma; Large Wheel",
    "Soto Makikomi; Outer Wrap Around",
    "Uki Otoshi; Floating Drop",
    "Osoto Guruma; Large Outer Wheel",
    "Uki Waza; Floating Technique",
    "Yoko Wakare; Side Separation",
    "Yoko Guruma; Side Wheel",
    "Ushiro Goshi; Rear Hip Throw",
    "Ura Nage; Rear Throw",
    "Sumi Otoshi; Corner Drop",
    "Yoko Gake; Side Hook",
    "Obi Otoshi; Belt Drop",
    "Seoi Otoshi",
    "Yama Arashi; Mountain Storm",
    "Osoto Otoshi; Large Outer Drop",
    "Daki Wakare; High Lift and Separate",
    "Hikikomi Gaeshi; Pulling-in Reversal",
    "Tawara Gaeshi; Rice Bale Reversal",
    "Uchi Makikomi; Inner Wraparound",
    "Morote Gari; Two Hand Reap",
    "Kibisu Gaeshi",
    "Daki Age; High Lift",
    "Kouchi Gaeshi",
    "Osoto Gaeshi",
    "Uchi Mata Gaeshi",
    "Kani Basami; Flying Scissors",
    "Kawazu Gake",
    "Uchi Mata Makikomi; Inner Thigh Wrap Around",
    "Ippon Seoinage; One Arm Shoulder Throw",
    "Kuchiki Taoshi",
    "Uchi Mata Sukashi",
    "Tsubame Gaeshi; Swallow’s Flight Reversal",
    "Ouchi Gaeshi",
    "Harai Goshi Gaeshi",
    "Hane Goshi Gaeshi",
    "Osoto Makikomi; Major O uter Wrap Around",
    "Harai Makikomi; Sweeping Wraparound",
    "Sode Tsurikomi Goshi; Sleeve Lifting Pulling Hip",
    "Name is missing from this list",
    "I don't know whether there's a name for this take down"
  ],
  "Submissions or Submission Attempts":
    {"Choke Or Cervical Submissions":[
      "Diesel Squeezel",
      "Bow and Arrow",
      "Cross Collar Choke",
      "Baseball Bat Choke",
      "Clock Choke",
      "Hail Mary; Clark Gracie Choke",
      "Von Flue (Preux) Choke",
      "Peruvian Necktie",
      "Japanese Necktie",
      "Spin Choke",
      "Rodeo Choke",
      "Ezekiel",
      "North So uth; Munson choke",
      "Anaconda",
      "D'arce; Brabo",
      "Guillotine",
      "Arm-In Guillotine",
      "Paper Cutter",
      "Loop Choke",
      "Can Opener",
      "Arm Triangle",
      "Triangle",
      "Name is missing from this list",
      "I don't know whether there's a name for this cervical submission"
    ],
    "Elbow":[
    "Arm Bar or Straight Arm Lock",
    "Biceps Slicer",
    "Dead Orchard",
    "Name is missing from this list",
    "I don't know whether there's a name for this elbow submission"
  ],
  "Shoulder":[
    "Americana; Keylock; Paintbrush",
    "Kimura",
    "Omoplata",
    "Baratoplata",
    "Monoplata",
    "Name is missing from this list",
    "I don't know whether there's a name for this shoulder submission"
  ],
  "Knee Ligaments":[
    "Knee Bar",
    "Inside Heel Hook",
    "Toe Hold/Figure 4 Toe Hold",
    "Outside Heel Hook",
    "Calf Slicer",
    "Name is missing from this list",
    "I don't know whether there's a name for this knee submission"
  ],
  "Back":[
    "Twister; Wrestler’s Guillotine",
    "Name is missing from this list",
    "I don't know whether there's a name for this back submission"
  ],
  "Ankle Ligaments":[
    "Ankle Lock",
    "Texas Cloverleaf",
    "Name is missing from this list",
    "I don't know whether there's a name for this ankle submission"
  ],
  "Groin":[
    "Banana Split",
    "Name is missing from this list",
    "I don't know whether there's a name for this groin submission"
  ],
  "Wrist":[
  "Wrist Lock",
  "Name is missing from this list",
  "I don't know whether there's a name for this wrist submission"
  ]
},
"Sweeps or Sweep Attempts":[
  "Scissor Sweep",
  "Flower Sweep",
  "Old School Sweep",
  "Simple Sweep",
  "Hip Bump Sweep",
  "Schoolyard Sweep",
  "Lumberjack Sweep",
  "Lasso Sweep",
  "Butterfly Sweep",
  "Elevator Sweep",
  "Plan B Sweep",
  "Sickle Sweep",
  "Sweep from Omoplata",
  "Sit up sweep; Reversal",
  "Name is missing from this list",
  "I don't know whether there's a name for this sweep"
],
"Positional Changes":[
  "Back Mount",
  "Back Control",
  "Mount",
  "Knee on Belly",
  "Name is missing from this list",
],
"Positions With Names That Do Not Score Points In Most Rule Sets":[
  "Truck",
  "Guard Jump",
  "Guard Pull",
  "Half-Guard Pull",
  "Pitstop",
  "Spider Guard",
  "New York",
  "Crackhead Control",
  "Stoner Control",
  "Electric Chair",
  "Kesa Gatame; Scarf Hold",
  "Head and Arm",
  "Reverse Cowgirl",
  "Turtle; Quarters",
  "Berimbolo",
  "De La Riva Guard",
  "Donkey Guard",
  "Squid Guard",
  "Koala Guard",
  "50/50",
  "Outside Ashi Garami",
  "4/11; Honey Hole; The Saddle; Inside Sankaku",
  "Worm Guard",
  "Name is missing from this list",
  "I don't know whether there's a name for this position"
],
"Discliplinary Action":[
  "Severe Foul",
  "Serious Foul",
  "Combatitiveness Foul; Stalling; Fleeing",
  "Disqualification",
  "Name is missing from this list",
]
}
