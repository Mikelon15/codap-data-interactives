CartLevels = [
        {
          "levelName" : "Dubuque",
          "startingLevel" : true,
          "avoidBy" : 2,
          "brickNumberMin" : 2,
          "brickNumberRange" : 18,
          "tareMin" : 0,
          "tareRange" : 0,
          "brickWeightMin" : 3,
          "brickWeightRange" : 0,
          "brickWeightVariability" : 0,
          "integerWeights" : true,
          "Description" : "A good place to start",
          "unlocked": true
        },
        {
          "levelName" : "Ames",
          "startingLevel" : false,
          "avoidBy" : 2,
          "brickNumberMin" : 2,
          "brickNumberRange" : 18,
          "tareMin" : 8,
          "tareRange" : 0,
          "brickWeightMin" : 4,
          "brickWeightRange" : 0,
          "brickWeightVariability" : 0,
          "smallBrickWeightMin" : 0,
          "smallBrickWeightRange" : 0,
          "integerWeights" : true,
          "Description" : "Not quite as simple",
          "prerequisite" : {
            "level" : "Dubuque",
            "score" : 250,
            "excuse" : "Need 250 on Dubuque"
          }
        },
        {
          "levelName" : "Davenport",
          "startingLevel" : false,
          "avoidBy" : 2,
          "brickNumberMin" : 2,
          "brickNumberRange" : 18,
          "tareMin" : 10,
          "tareRange" : 25,
          "brickWeightMin" : 2,
          "brickWeightRange" : 8,
          "brickWeightVariability" : 0,
          "smallBrickWeightMin" : 0,
          "smallBrickWeightRange" : 0,
          "integerWeights" : true,
          "Description" : "More challenging",
          "prerequisite" : {
            "level" : "Ames",
            "score" : 250,
            "excuse" : "Need 250 on Ames"
          }
        },
        {
          "levelName" : "Urbandale",
          "startingLevel" : false,
          "avoidBy" : 2,
          "brickNumberMin" : 2,
          "brickNumberRange" : 18,
          "tareMin" : 10,
          "tareRange" : 30,
          "brickWeightMin" : 2,
          "brickWeightRange" : 8,
          "brickWeightVariability" : 0,
          "smallBrickWeightMin" : 0,
          "smallBrickWeightRange" : 0,
          "integerWeights" : false,
          "Description" : "Uh-oh. What's this?",
          "prerequisite" : {
            "level" : "Davenport",
            "score" : 250,
            "excuse" : "Need 250 on Davenport"
          }
        },
        {
          "levelName" : "Waterloo",
          "startingLevel" : false,
          "avoidBy" : 2,
          "brickNumberMin" : 2,
          "brickNumberRange" : 18,
          "tareMin" : 20,
          "tareRange" : 40,
          "brickWeightMin" : 8,
          "brickWeightRange" : 16,
          "brickWeightVariability" : 2,
          "smallBrickWeightMin" : 0,
          "smallBrickWeightRange" : 0,
          "integerWeights" : false,
          "Description" : "Even more challenging",
          "prerequisite" : {
            "level" : "Urbandale",
            "score" : 250,
            "excuse" : "Need 250 on Urbandale"
          },
          "ukdeBNeededScore": 250
        },
        {
          "levelName" : "Minot",
          "startingLevel" : false,
          "avoidBy" : 1,
          "brickNumberMin" : 2,
          "brickNumberRange" : 10,
          "smallBrickNumberMin" : 2,
          "smallBrickNumberRange": 10,
          "tareMin" : 8,
          "tareRange" : 15,
          "brickWeightMin" : 6,
          "brickWeightRange" : 12,
          "brickWeightVariability" : 0,
          "smallBrickWeightMin" : 2,
          "smallBrickWeightRange" : 10,
          "smallBrickWeightVariability" : 0,
          "integerWeights" : true,
          "Description" : "Oh, no. Two sizes.",
          "unlocked": false,
          "prerequisite" : {
            "level" : "Waterloo",
            "score" : 200,
            "excuse" : "Need 200 on Waterloo"
          },
          "ukdeBNeededScore": 250
        }
      ];