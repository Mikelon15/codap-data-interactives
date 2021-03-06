MarkovLevels = [
  {
    "levelName" : "Tethys",
    "startingLevel" : true,
    "RR" : "P",
    "PP" : "S",
    "SS" : "R",
    "RP" : "PPPPRS",
    "PR" : "R",
    "PS" : "SSSSSSPR",
    "RS" : "S",
    "SR" : "RRRRPS",
    "SP" : "P",
    "Description" : "A good place to start",
    hintNum: 0
  },
  {
    "levelName" : "Deimos",
    "startingLevel" : false,
    "RR" : "P",
    "PP" : "RRRRRP",
    "SS" : "SSSSR",
    "RP" : "RP",
    "PR" : "PPPPRS",
    "PS" : "SSSSSP",
    "RS" : "S",
    "SR" : "RRRPS",
    "SP" : "PPPRS",
    "prerequisite" : { "excuse" : "Win Tethys in fewer than 45 moves" },
    "Description" : "A little more challenging",
    hintNum: 0
  },
  {
    "levelName" : "Phobos",
    "startingLevel" : false,
    "RR" : "SSSSSRRPP",
    "PP" : "PPPPPRS",
    "SS" : "PPPR",
    "RP" : "RRP",
    "PR" : "RRRS",
    "PS" : "RRRS",
    "RS" : "SRRR",
    "SR" : "RRRS",
    "SP" : "PPPPPRS",
    "prerequisite" : { "excuse" : "Win Deimos in fewer than 45 moves" },
    "Description" : "Like Deimos, more challenging",
    hintNum: 0
  }/*,
  {
    "levelName" : "Callisto",
    "startingLevel" : false,
    "RR" : "RPS",
    "PP" : "PPPPPR",
    "SS" : "SSSR",
    "RP" : "PPPPPPR",
    "PR" : "RRRRRPS",
    "PS" : "R",
    "RS" : "SSSSSSR",
    "SR" : "RRRRRPS",
    "SP" : "R",
    "Description" : "Maybe more difficult? Not sure!",
   hintNum: 0
  }*/
  ];