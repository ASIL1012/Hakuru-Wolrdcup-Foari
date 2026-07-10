const matches = [
    {
        "id":  1,
        "date":  "June 11, 2026",
        "isoDate":  "2026-06-11T19:00:00Z",
        "venue":  "Mexico City",
        "group":  "Group A",
        "home":  {
                     "name":  "Mexico",
                     "flag":  "https://flagcdn.com/mx.svg"
                 },
        "away":  {
                     "name":  "South Africa",
                     "flag":  "https://flagcdn.com/za.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  2,
        "date":  "June 11, 2026",
        "isoDate":  "2026-06-12T02:00:00Z",
        "venue":  "Guadalajara (Zapopan)",
        "group":  "Group A",
        "home":  {
                     "name":  "South Korea",
                     "flag":  "https://flagcdn.com/kr.svg"
                 },
        "away":  {
                     "name":  "Czech Republic",
                     "flag":  "https://flagcdn.com/cz.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  3,
        "date":  "June 12, 2026",
        "isoDate":  "2026-06-12T19:00:00Z",
        "venue":  "Toronto",
        "group":  "Group B",
        "home":  {
                     "name":  "Canada",
                     "flag":  "https://flagcdn.com/ca.svg"
                 },
        "away":  {
                     "name":  "Bosnia \u0026 Herzegovina",
                     "flag":  "https://flagcdn.com/ba.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  4,
        "date":  "June 12, 2026",
        "isoDate":  "2026-06-13T01:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Group D",
        "home":  {
                     "name":  "USA",
                     "flag":  "https://flagcdn.com/us.svg"
                 },
        "away":  {
                     "name":  "Paraguay",
                     "flag":  "https://flagcdn.com/py.svg"
                 },
        "result":  {
                       "home":  4,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  5,
        "date":  "June 13, 2026",
        "isoDate":  "2026-06-13T19:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Group B",
        "home":  {
                     "name":  "Qatar",
                     "flag":  "https://flagcdn.com/qa.svg"
                 },
        "away":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  6,
        "date":  "June 13, 2026",
        "isoDate":  "2026-06-13T22:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Group C",
        "home":  {
                     "name":  "Brazil",
                     "flag":  "https://flagcdn.com/br.svg"
                 },
        "away":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  7,
        "date":  "June 13, 2026",
        "isoDate":  "2026-06-14T01:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Group C",
        "home":  {
                     "name":  "Haiti",
                     "flag":  "https://flagcdn.com/ht.svg"
                 },
        "away":  {
                     "name":  "Scotland",
                     "flag":  "https://flagcdn.com/gb-sct.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  8,
        "date":  "June 13, 2026",
        "isoDate":  "2026-06-14T04:00:00Z",
        "venue":  "Vancouver",
        "group":  "Group D",
        "home":  {
                     "name":  "Australia",
                     "flag":  "https://flagcdn.com/au.svg"
                 },
        "away":  {
                     "name":  "Turkey",
                     "flag":  "https://flagcdn.com/tr.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  9,
        "date":  "June 14, 2026",
        "isoDate":  "2026-06-14T17:00:00Z",
        "venue":  "Houston",
        "group":  "Group E",
        "home":  {
                     "name":  "Germany",
                     "flag":  "https://flagcdn.com/de.svg"
                 },
        "away":  {
                     "name":  "Curaçao",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  {
                       "home":  7,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  10,
        "date":  "June 14, 2026",
        "isoDate":  "2026-06-14T20:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Group F",
        "home":  {
                     "name":  "Netherlands",
                     "flag":  "https://flagcdn.com/nl.svg"
                 },
        "away":  {
                     "name":  "Japan",
                     "flag":  "https://flagcdn.com/jp.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  11,
        "date":  "June 14, 2026",
        "isoDate":  "2026-06-14T23:00:00Z",
        "venue":  "Philadelphia",
        "group":  "Group E",
        "home":  {
                     "name":  "Ivory Coast",
                     "flag":  "https://flagcdn.com/ci.svg"
                 },
        "away":  {
                     "name":  "Ecuador",
                     "flag":  "https://flagcdn.com/ec.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  12,
        "date":  "June 14, 2026",
        "isoDate":  "2026-06-15T02:00:00Z",
        "venue":  "Monterrey (Guadalupe)",
        "group":  "Group F",
        "home":  {
                     "name":  "Sweden",
                     "flag":  "https://flagcdn.com/se.svg"
                 },
        "away":  {
                     "name":  "Tunisia",
                     "flag":  "https://flagcdn.com/tn.svg"
                 },
        "result":  {
                       "home":  5,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  13,
        "date":  "June 15, 2026",
        "isoDate":  "2026-06-15T16:00:00Z",
        "venue":  "Atlanta",
        "group":  "Group H",
        "home":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "away":  {
                     "name":  "Cape Verde",
                     "flag":  "https://flagcdn.com/cv.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  14,
        "date":  "June 15, 2026",
        "isoDate":  "2026-06-15T19:00:00Z",
        "venue":  "Seattle",
        "group":  "Group G",
        "home":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "away":  {
                     "name":  "Egypt",
                     "flag":  "https://flagcdn.com/eg.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  15,
        "date":  "June 15, 2026",
        "isoDate":  "2026-06-15T22:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Group H",
        "home":  {
                     "name":  "Saudi Arabia",
                     "flag":  "https://flagcdn.com/sa.svg"
                 },
        "away":  {
                     "name":  "Uruguay",
                     "flag":  "https://flagcdn.com/uy.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  16,
        "date":  "June 15, 2026",
        "isoDate":  "2026-06-16T01:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Group G",
        "home":  {
                     "name":  "Iran",
                     "flag":  "https://flagcdn.com/ir.svg"
                 },
        "away":  {
                     "name":  "New Zealand",
                     "flag":  "https://flagcdn.com/nz.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  17,
        "date":  "June 16, 2026",
        "isoDate":  "2026-06-16T19:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Group I",
        "home":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "away":  {
                     "name":  "Senegal",
                     "flag":  "https://flagcdn.com/sn.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  18,
        "date":  "June 16, 2026",
        "isoDate":  "2026-06-16T22:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Group I",
        "home":  {
                     "name":  "Iraq",
                     "flag":  "https://flagcdn.com/iq.svg"
                 },
        "away":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  4
                   },
        "locked":  true
    },
    {
        "id":  19,
        "date":  "June 16, 2026",
        "isoDate":  "2026-06-17T01:00:00Z",
        "venue":  "Kansas City",
        "group":  "Group J",
        "home":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "away":  {
                     "name":  "Algeria",
                     "flag":  "https://flagcdn.com/dz.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  20,
        "date":  "June 16, 2026",
        "isoDate":  "2026-06-17T04:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Group J",
        "home":  {
                     "name":  "Austria",
                     "flag":  "https://flagcdn.com/at.svg"
                 },
        "away":  {
                     "name":  "Jordan",
                     "flag":  "https://flagcdn.com/jo.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  21,
        "date":  "June 17, 2026",
        "isoDate":  "2026-06-17T17:00:00Z",
        "venue":  "Houston",
        "group":  "Group K",
        "home":  {
                     "name":  "Portugal",
                     "flag":  "https://flagcdn.com/pt.svg"
                 },
        "away":  {
                     "name":  "DR Congo",
                     "flag":  "https://flagcdn.com/cd.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  22,
        "date":  "June 17, 2026",
        "isoDate":  "2026-06-17T20:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Group L",
        "home":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "away":  {
                     "name":  "Croatia",
                     "flag":  "https://flagcdn.com/hr.svg"
                 },
        "result":  {
                       "home":  4,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  23,
        "date":  "June 17, 2026",
        "isoDate":  "2026-06-17T23:00:00Z",
        "venue":  "Toronto",
        "group":  "Group L",
        "home":  {
                     "name":  "Ghana",
                     "flag":  "https://flagcdn.com/gh.svg"
                 },
        "away":  {
                     "name":  "Panama",
                     "flag":  "https://flagcdn.com/pa.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  24,
        "date":  "June 17, 2026",
        "isoDate":  "2026-06-18T02:00:00Z",
        "venue":  "Mexico City",
        "group":  "Group K",
        "home":  {
                     "name":  "Uzbekistan",
                     "flag":  "https://flagcdn.com/uz.svg"
                 },
        "away":  {
                     "name":  "Colombia",
                     "flag":  "https://flagcdn.com/co.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  25,
        "date":  "June 18, 2026",
        "isoDate":  "2026-06-18T16:00:00Z",
        "venue":  "Atlanta",
        "group":  "Group A",
        "home":  {
                     "name":  "Czech Republic",
                     "flag":  "https://flagcdn.com/cz.svg"
                 },
        "away":  {
                     "name":  "South Africa",
                     "flag":  "https://flagcdn.com/za.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  26,
        "date":  "June 18, 2026",
        "isoDate":  "2026-06-18T19:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Group B",
        "home":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "away":  {
                     "name":  "Bosnia \u0026 Herzegovina",
                     "flag":  "https://flagcdn.com/ba.svg"
                 },
        "result":  {
                       "home":  4,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  27,
        "date":  "June 18, 2026",
        "isoDate":  "2026-06-18T22:00:00Z",
        "venue":  "Vancouver",
        "group":  "Group B",
        "home":  {
                     "name":  "Canada",
                     "flag":  "https://flagcdn.com/ca.svg"
                 },
        "away":  {
                     "name":  "Qatar",
                     "flag":  "https://flagcdn.com/qa.svg"
                 },
        "result":  {
                       "home":  6,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  28,
        "date":  "June 18, 2026",
        "isoDate":  "2026-06-19T01:00:00Z",
        "venue":  "Guadalajara (Zapopan)",
        "group":  "Group A",
        "home":  {
                     "name":  "Mexico",
                     "flag":  "https://flagcdn.com/mx.svg"
                 },
        "away":  {
                     "name":  "South Korea",
                     "flag":  "https://flagcdn.com/kr.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  29,
        "date":  "June 19, 2026",
        "isoDate":  "2026-06-19T19:00:00Z",
        "venue":  "Seattle",
        "group":  "Group D",
        "home":  {
                     "name":  "USA",
                     "flag":  "https://flagcdn.com/us.svg"
                 },
        "away":  {
                     "name":  "Australia",
                     "flag":  "https://flagcdn.com/au.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  30,
        "date":  "June 19, 2026",
        "isoDate":  "2026-06-19T22:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Group C",
        "home":  {
                     "name":  "Scotland",
                     "flag":  "https://flagcdn.com/gb-sct.svg"
                 },
        "away":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  31,
        "date":  "June 19, 2026",
        "isoDate":  "2026-06-20T00:30:00Z",
        "venue":  "Philadelphia",
        "group":  "Group C",
        "home":  {
                     "name":  "Brazil",
                     "flag":  "https://flagcdn.com/br.svg"
                 },
        "away":  {
                     "name":  "Haiti",
                     "flag":  "https://flagcdn.com/ht.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  32,
        "date":  "June 19, 2026",
        "isoDate":  "2026-06-20T03:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Group D",
        "home":  {
                     "name":  "Turkey",
                     "flag":  "https://flagcdn.com/tr.svg"
                 },
        "away":  {
                     "name":  "Paraguay",
                     "flag":  "https://flagcdn.com/py.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  33,
        "date":  "June 20, 2026",
        "isoDate":  "2026-06-20T17:00:00Z",
        "venue":  "Houston",
        "group":  "Group F",
        "home":  {
                     "name":  "Netherlands",
                     "flag":  "https://flagcdn.com/nl.svg"
                 },
        "away":  {
                     "name":  "Sweden",
                     "flag":  "https://flagcdn.com/se.svg"
                 },
        "result":  {
                       "home":  5,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  34,
        "date":  "June 20, 2026",
        "isoDate":  "2026-06-20T20:00:00Z",
        "venue":  "Toronto",
        "group":  "Group E",
        "home":  {
                     "name":  "Germany",
                     "flag":  "https://flagcdn.com/de.svg"
                 },
        "away":  {
                     "name":  "Ivory Coast",
                     "flag":  "https://flagcdn.com/ci.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  35,
        "date":  "June 20, 2026",
        "isoDate":  "2026-06-21T00:00:00Z",
        "venue":  "Kansas City",
        "group":  "Group E",
        "home":  {
                     "name":  "Ecuador",
                     "flag":  "https://flagcdn.com/ec.svg"
                 },
        "away":  {
                     "name":  "Curaçao",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  36,
        "date":  "June 20, 2026",
        "isoDate":  "2026-06-21T04:00:00Z",
        "venue":  "Monterrey (Guadalupe)",
        "group":  "Group F",
        "home":  {
                     "name":  "Tunisia",
                     "flag":  "https://flagcdn.com/tn.svg"
                 },
        "away":  {
                     "name":  "Japan",
                     "flag":  "https://flagcdn.com/jp.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  4
                   },
        "locked":  true
    },
    {
        "id":  37,
        "date":  "June 21, 2026",
        "isoDate":  "2026-06-21T16:00:00Z",
        "venue":  "Atlanta",
        "group":  "Group H",
        "home":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "away":  {
                     "name":  "Saudi Arabia",
                     "flag":  "https://flagcdn.com/sa.svg"
                 },
        "result":  {
                       "home":  4,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  38,
        "date":  "June 21, 2026",
        "isoDate":  "2026-06-21T19:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Group G",
        "home":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "away":  {
                     "name":  "Iran",
                     "flag":  "https://flagcdn.com/ir.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  39,
        "date":  "June 21, 2026",
        "isoDate":  "2026-06-21T22:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Group H",
        "home":  {
                     "name":  "Uruguay",
                     "flag":  "https://flagcdn.com/uy.svg"
                 },
        "away":  {
                     "name":  "Cape Verde",
                     "flag":  "https://flagcdn.com/cv.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  40,
        "date":  "June 21, 2026",
        "isoDate":  "2026-06-22T01:00:00Z",
        "venue":  "Vancouver",
        "group":  "Group G",
        "home":  {
                     "name":  "New Zealand",
                     "flag":  "https://flagcdn.com/nz.svg"
                 },
        "away":  {
                     "name":  "Egypt",
                     "flag":  "https://flagcdn.com/eg.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  41,
        "date":  "June 22, 2026",
        "isoDate":  "2026-06-22T17:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Group J",
        "home":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "away":  {
                     "name":  "Austria",
                     "flag":  "https://flagcdn.com/at.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  42,
        "date":  "June 22, 2026",
        "isoDate":  "2026-06-22T21:00:00Z",
        "venue":  "Philadelphia",
        "group":  "Group I",
        "home":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "away":  {
                     "name":  "Iraq",
                     "flag":  "https://flagcdn.com/iq.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  43,
        "date":  "June 22, 2026",
        "isoDate":  "2026-06-23T00:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Group I",
        "home":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "away":  {
                     "name":  "Senegal",
                     "flag":  "https://flagcdn.com/sn.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  44,
        "date":  "June 22, 2026",
        "isoDate":  "2026-06-23T03:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Group J",
        "home":  {
                     "name":  "Jordan",
                     "flag":  "https://flagcdn.com/jo.svg"
                 },
        "away":  {
                     "name":  "Algeria",
                     "flag":  "https://flagcdn.com/dz.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  45,
        "date":  "June 23, 2026",
        "isoDate":  "2026-06-23T17:00:00Z",
        "venue":  "Houston",
        "group":  "Group K",
        "home":  {
                     "name":  "Portugal",
                     "flag":  "https://flagcdn.com/pt.svg"
                 },
        "away":  {
                     "name":  "Uzbekistan",
                     "flag":  "https://flagcdn.com/uz.svg"
                 },
        "result":  {
                       "home":  5,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  46,
        "date":  "June 23, 2026",
        "isoDate":  "2026-06-23T20:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Group L",
        "home":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "away":  {
                     "name":  "Ghana",
                     "flag":  "https://flagcdn.com/gh.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  47,
        "date":  "June 23, 2026",
        "isoDate":  "2026-06-23T23:00:00Z",
        "venue":  "Toronto",
        "group":  "Group L",
        "home":  {
                     "name":  "Panama",
                     "flag":  "https://flagcdn.com/pa.svg"
                 },
        "away":  {
                     "name":  "Croatia",
                     "flag":  "https://flagcdn.com/hr.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  48,
        "date":  "June 23, 2026",
        "isoDate":  "2026-06-24T02:00:00Z",
        "venue":  "Guadalajara (Zapopan)",
        "group":  "Group K",
        "home":  {
                     "name":  "Colombia",
                     "flag":  "https://flagcdn.com/co.svg"
                 },
        "away":  {
                     "name":  "DR Congo",
                     "flag":  "https://flagcdn.com/cd.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  49,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-24T19:00:00Z",
        "venue":  "Seattle",
        "group":  "Group B",
        "home":  {
                     "name":  "Bosnia \u0026 Herzegovina",
                     "flag":  "https://flagcdn.com/ba.svg"
                 },
        "away":  {
                     "name":  "Qatar",
                     "flag":  "https://flagcdn.com/qa.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  50,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-24T19:00:00Z",
        "venue":  "Vancouver",
        "group":  "Group B",
        "home":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "away":  {
                     "name":  "Canada",
                     "flag":  "https://flagcdn.com/ca.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  51,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-24T22:00:00Z",
        "venue":  "Atlanta",
        "group":  "Group C",
        "home":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "away":  {
                     "name":  "Haiti",
                     "flag":  "https://flagcdn.com/ht.svg"
                 },
        "result":  {
                       "home":  4,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  52,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-24T22:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Group C",
        "home":  {
                     "name":  "Scotland",
                     "flag":  "https://flagcdn.com/gb-sct.svg"
                 },
        "away":  {
                     "name":  "Brazil",
                     "flag":  "https://flagcdn.com/br.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  53,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-25T01:00:00Z",
        "venue":  "Mexico City",
        "group":  "Group A",
        "home":  {
                     "name":  "Czech Republic",
                     "flag":  "https://flagcdn.com/cz.svg"
                 },
        "away":  {
                     "name":  "Mexico",
                     "flag":  "https://flagcdn.com/mx.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  54,
        "date":  "June 24, 2026",
        "isoDate":  "2026-06-25T01:00:00Z",
        "venue":  "Monterrey (Guadalupe)",
        "group":  "Group A",
        "home":  {
                     "name":  "South Africa",
                     "flag":  "https://flagcdn.com/za.svg"
                 },
        "away":  {
                     "name":  "South Korea",
                     "flag":  "https://flagcdn.com/kr.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  55,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-25T20:00:00Z",
        "venue":  "Philadelphia",
        "group":  "Group E",
        "home":  {
                     "name":  "Curaçao",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "away":  {
                     "name":  "Ivory Coast",
                     "flag":  "https://flagcdn.com/ci.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  56,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-25T20:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Group E",
        "home":  {
                     "name":  "Ecuador",
                     "flag":  "https://flagcdn.com/ec.svg"
                 },
        "away":  {
                     "name":  "Germany",
                     "flag":  "https://flagcdn.com/de.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  57,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-25T23:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Group F",
        "home":  {
                     "name":  "Japan",
                     "flag":  "https://flagcdn.com/jp.svg"
                 },
        "away":  {
                     "name":  "Sweden",
                     "flag":  "https://flagcdn.com/se.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  58,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-25T23:00:00Z",
        "venue":  "Kansas City",
        "group":  "Group F",
        "home":  {
                     "name":  "Tunisia",
                     "flag":  "https://flagcdn.com/tn.svg"
                 },
        "away":  {
                     "name":  "Netherlands",
                     "flag":  "https://flagcdn.com/nl.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  59,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-26T02:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Group D",
        "home":  {
                     "name":  "Paraguay",
                     "flag":  "https://flagcdn.com/py.svg"
                 },
        "away":  {
                     "name":  "Australia",
                     "flag":  "https://flagcdn.com/au.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  60,
        "date":  "June 25, 2026",
        "isoDate":  "2026-06-26T02:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Group D",
        "home":  {
                     "name":  "Turkey",
                     "flag":  "https://flagcdn.com/tr.svg"
                 },
        "away":  {
                     "name":  "USA",
                     "flag":  "https://flagcdn.com/us.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  61,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-26T19:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Group I",
        "home":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "away":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  4
                   },
        "locked":  true
    },
    {
        "id":  62,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-26T19:00:00Z",
        "venue":  "Toronto",
        "group":  "Group I",
        "home":  {
                     "name":  "Senegal",
                     "flag":  "https://flagcdn.com/sn.svg"
                 },
        "away":  {
                     "name":  "Iraq",
                     "flag":  "https://flagcdn.com/iq.svg"
                 },
        "result":  {
                       "home":  5,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  63,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-27T00:00:00Z",
        "venue":  "Guadalajara (Zapopan)",
        "group":  "Group H",
        "home":  {
                     "name":  "Uruguay",
                     "flag":  "https://flagcdn.com/uy.svg"
                 },
        "away":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  64,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-27T00:00:00Z",
        "venue":  "Houston",
        "group":  "Group H",
        "home":  {
                     "name":  "Cape Verde",
                     "flag":  "https://flagcdn.com/cv.svg"
                 },
        "away":  {
                     "name":  "Saudi Arabia",
                     "flag":  "https://flagcdn.com/sa.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  65,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-27T03:00:00Z",
        "venue":  "Seattle",
        "group":  "Group G",
        "home":  {
                     "name":  "Egypt",
                     "flag":  "https://flagcdn.com/eg.svg"
                 },
        "away":  {
                     "name":  "Iran",
                     "flag":  "https://flagcdn.com/ir.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  66,
        "date":  "June 26, 2026",
        "isoDate":  "2026-06-27T03:00:00Z",
        "venue":  "Vancouver",
        "group":  "Group G",
        "home":  {
                     "name":  "New Zealand",
                     "flag":  "https://flagcdn.com/nz.svg"
                 },
        "away":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  5
                   },
        "locked":  true
    },
    {
        "id":  67,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-27T21:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Group L",
        "home":  {
                     "name":  "Panama",
                     "flag":  "https://flagcdn.com/pa.svg"
                 },
        "away":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  68,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-27T21:00:00Z",
        "venue":  "Philadelphia",
        "group":  "Group L",
        "home":  {
                     "name":  "Croatia",
                     "flag":  "https://flagcdn.com/hr.svg"
                 },
        "away":  {
                     "name":  "Ghana",
                     "flag":  "https://flagcdn.com/gh.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  69,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-27T23:30:00Z",
        "venue":  "Atlanta",
        "group":  "Group K",
        "home":  {
                     "name":  "DR Congo",
                     "flag":  "https://flagcdn.com/cd.svg"
                 },
        "away":  {
                     "name":  "Uzbekistan",
                     "flag":  "https://flagcdn.com/uz.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  70,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-27T23:30:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Group K",
        "home":  {
                     "name":  "Colombia",
                     "flag":  "https://flagcdn.com/co.svg"
                 },
        "away":  {
                     "name":  "Portugal",
                     "flag":  "https://flagcdn.com/pt.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  71,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-28T02:00:00Z",
        "venue":  "Kansas City",
        "group":  "Group J",
        "home":  {
                     "name":  "Algeria",
                     "flag":  "https://flagcdn.com/dz.svg"
                 },
        "away":  {
                     "name":  "Austria",
                     "flag":  "https://flagcdn.com/at.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  72,
        "date":  "June 27, 2026",
        "isoDate":  "2026-06-28T02:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Group J",
        "home":  {
                     "name":  "Jordan",
                     "flag":  "https://flagcdn.com/jo.svg"
                 },
        "away":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  3
                   },
        "locked":  true
    },
    {
        "id":  73,
        "date":  "June 28, 2026",
        "isoDate":  "2026-06-28T19:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "South Africa",
                     "flag":  "https://flagcdn.com/za.svg"
                 },
        "away":  {
                     "name":  "Canada",
                     "flag":  "https://flagcdn.com/ca.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  74,
        "date":  "June 29, 2026",
        "isoDate":  "2026-06-29T17:00:00Z",
        "venue":  "Houston",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Brazil",
                     "flag":  "https://flagcdn.com/br.svg"
                 },
        "away":  {
                     "name":  "Japan",
                     "flag":  "https://flagcdn.com/jp.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  75,
        "date":  "June 29, 2026",
        "isoDate":  "2026-06-29T20:30:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Germany",
                     "flag":  "https://flagcdn.com/de.svg"
                 },
        "away":  {
                     "name":  "Paraguay",
                     "flag":  "https://flagcdn.com/py.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1,
                       "penaltyWinner":  "away"
                   },
        "locked":  true
    },
    {
        "id":  76,
        "date":  "June 29, 2026",
        "isoDate":  "2026-06-30T01:00:00Z",
        "venue":  "Monterrey (Guadalupe)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Netherlands",
                     "flag":  "https://flagcdn.com/nl.svg"
                 },
        "away":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1,
                       "penaltyWinner":  "away"
                   },
        "locked":  true
    },
    {
        "id":  77,
        "date":  "June 30, 2026",
        "isoDate":  "2026-06-30T17:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Ivory Coast",
                     "flag":  "https://flagcdn.com/ci.svg"
                 },
        "away":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  78,
        "date":  "June 30, 2026",
        "isoDate":  "2026-06-30T21:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "away":  {
                     "name":  "Sweden",
                     "flag":  "https://flagcdn.com/se.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  79,
        "date":  "June 30, 2026",
        "isoDate":  "2026-07-01T01:00:00Z",
        "venue":  "Mexico City",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Mexico",
                     "flag":  "https://flagcdn.com/mx.svg"
                 },
        "away":  {
                     "name":  "Ecuador",
                     "flag":  "https://flagcdn.com/ec.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  80,
        "date":  "July 1, 2026",
        "isoDate":  "2026-07-01T16:00:00Z",
        "venue":  "Atlanta",
        "group":  "Round of 32",
        "home":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "away":  {
                     "name":  "DR Congo",
                     "flag":  "https://flagcdn.com/cd.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  81,
        "date":  "July 1, 2026",
        "isoDate":  "2026-07-01T20:00:00Z",
        "venue":  "Seattle",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "away":  {
                     "name":  "Senegal",
                     "flag":  "https://flagcdn.com/sn.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  82,
        "date":  "July 1, 2026",
        "isoDate":  "2026-07-02T00:00:00Z",
        "venue":  "San Francisco Bay Area (Santa Clara)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "USA",
                     "flag":  "https://flagcdn.com/us.svg"
                 },
        "away":  {
                     "name":  "Bosnia \u0026 Herzegovina",
                     "flag":  "https://flagcdn.com/ba.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  83,
        "date":  "July 2, 2026",
        "isoDate":  "2026-07-02T19:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "away":  {
                     "name":  "Austria",
                     "flag":  "https://flagcdn.com/at.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  84,
        "date":  "July 2, 2026",
        "isoDate":  "2026-07-02T23:00:00Z",
        "venue":  "Toronto",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Portugal",
                     "flag":  "https://flagcdn.com/pt.svg"
                 },
        "away":  {
                     "name":  "Croatia",
                     "flag":  "https://flagcdn.com/hr.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   },
        "locked":  true
    },
    {
        "id":  85,
        "date":  "July 2, 2026",
        "isoDate":  "2026-07-03T03:00:00Z",
        "venue":  "Vancouver",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "away":  {
                     "name":  "Algeria",
                     "flag":  "https://flagcdn.com/dz.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  86,
        "date":  "July 3, 2026",
        "isoDate":  "2026-07-03T18:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Australia",
                     "flag":  "https://flagcdn.com/au.svg"
                 },
        "away":  {
                     "name":  "Egypt",
                     "flag":  "https://flagcdn.com/eg.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  1,
                       "penaltyWinner":  "away"
                   },
        "locked":  true
    },
    {
        "id":  87,
        "date":  "July 3, 2026",
        "isoDate":  "2026-07-03T22:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "away":  {
                     "name":  "Cape Verde",
                     "flag":  "https://flagcdn.com/cv.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  2
                   },
        "locked":  true
    },
    {
        "id":  88,
        "date":  "July 3, 2026",
        "isoDate":  "2026-07-04T01:30:00Z",
        "venue":  "Kansas City",
        "group":  "Round of 32",
        "home":  {
                     "name":  "Colombia",
                     "flag":  "https://flagcdn.com/co.svg"
                 },
        "away":  {
                     "name":  "Ghana",
                     "flag":  "https://flagcdn.com/gh.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  0
                   },
        "locked":  true
    },
    {
        "id":  89,
        "date":  "July 4, 2026",
        "isoDate":  "2026-07-04T17:00:00Z",
        "venue":  "Houston",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Canada",
                     "flag":  "https://flagcdn.com/ca.svg"
                 },
        "away":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  3
                   }
    },
    {
        "id":  90,
        "date":  "July 4, 2026",
        "isoDate":  "2026-07-04T21:00:00Z",
        "venue":  "Philadelphia",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Paraguay",
                     "flag":  "https://flagcdn.com/py.svg"
                 },
        "away":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   }
    },
    {
        "id":  91,
        "date":  "July 5, 2026",
        "isoDate":  "2026-07-05T20:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Brazil",
                     "flag":  "https://flagcdn.com/br.svg"
                 },
        "away":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  2
                   }
    },
    {
        "id":  92,
        "date":  "July 5, 2026",
        "isoDate":  "2026-07-06T00:00:00Z",
        "venue":  "Mexico City",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Mexico",
                     "flag":  "https://flagcdn.com/mx.svg"
                 },
        "away":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  3
                   }
    },
    {
        "id":  93,
        "date":  "July 6, 2026",
        "isoDate":  "2026-07-06T19:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Portugal",
                     "flag":  "https://flagcdn.com/pt.svg"
                 },
        "away":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  1
                   }
    },
    {
        "id":  94,
        "date":  "July 6, 2026",
        "isoDate":  "2026-07-07T00:00:00Z",
        "venue":  "Seattle",
        "group":  "Round of 16",
        "home":  {
                     "name":  "USA",
                     "flag":  "https://flagcdn.com/us.svg"
                 },
        "away":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "result":  {
                       "home":  1,
                       "away":  4
                   }
    },
    {
        "id":  95,
        "date":  "July 7, 2026",
        "isoDate":  "2026-07-07T16:00:00Z",
        "venue":  "Atlanta",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "away":  {
                     "name":  "Egypt",
                     "flag":  "https://flagcdn.com/eg.svg"
                 },
        "result":  {
                       "home":  3,
                       "away":  2
                   }
    },
    {
        "id":  96,
        "date":  "July 7, 2026",
        "isoDate":  "2026-07-07T20:00:00Z",
        "venue":  "Vancouver",
        "group":  "Round of 16",
        "home":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "away":  {
                     "name":  "Colombia",
                     "flag":  "https://flagcdn.com/co.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  0,
                       "penaltyWinner": "home"
                   }
    },
    {
        "id":  97,
        "date":  "July 9, 2026",
        "isoDate":  "2026-07-09T20:00:00Z",
        "venue":  "Boston (Foxborough)",
        "group":  "Quarter-final",
        "home":  {
                     "name":  "Morocco",
                     "flag":  "https://flagcdn.com/ma.svg"
                 },
        "away":  {
                     "name":  "France",
                     "flag":  "https://flagcdn.com/fr.svg"
                 },
        "result":  {
                       "home":  0,
                       "away":  2
                   }
    },
    {
        "id":  98,
        "date":  "July 10, 2026",
        "isoDate":  "2026-07-10T19:00:00Z",
        "venue":  "Los Angeles (Inglewood)",
        "group":  "Quarter-final",
        "home":  {
                     "name":  "Spain",
                     "flag":  "https://flagcdn.com/es.svg"
                 },
        "away":  {
                     "name":  "Belgium",
                     "flag":  "https://flagcdn.com/be.svg"
                 },
        "result":  {
                       "home":  2,
                       "away":  1
                   }
    },
    {
        "id":  99,
        "date":  "July 11, 2026",
        "isoDate":  "2026-07-11T21:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Quarter-final",
        "home":  {
                     "name":  "Norway",
                     "flag":  "https://flagcdn.com/no.svg"
                 },
        "away":  {
                     "name":  "England",
                     "flag":  "https://flagcdn.com/gb-eng.svg"
                 },
        "result":  null
    },
    {
        "id":  100,
        "date":  "July 11, 2026",
        "isoDate":  "2026-07-12T01:00:00Z",
        "venue":  "Kansas City",
        "group":  "Quarter-final",
        "home":  {
                     "name":  "Argentina",
                     "flag":  "https://flagcdn.com/ar.svg"
                 },
        "away":  {
                     "name":  "Switzerland",
                     "flag":  "https://flagcdn.com/ch.svg"
                 },
        "result":  null
    },
    {
        "id":  101,
        "date":  "July 14, 2026",
        "isoDate":  "2026-07-14T19:00:00Z",
        "venue":  "Dallas (Arlington)",
        "group":  "Semi-final",
        "home":  {
                     "name":  "W97",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "away":  {
                     "name":  "W98",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  null
    },
    {
        "id":  102,
        "date":  "July 15, 2026",
        "isoDate":  "2026-07-15T19:00:00Z",
        "venue":  "Atlanta",
        "group":  "Semi-final",
        "home":  {
                     "name":  "W99",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "away":  {
                     "name":  "W100",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  null
    },
    {
        "id":  103,
        "date":  "July 18, 2026",
        "isoDate":  "2026-07-18T21:00:00Z",
        "venue":  "Miami (Miami Gardens)",
        "group":  "Match for third place",
        "home":  {
                     "name":  "L101",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "away":  {
                     "name":  "L102",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  null
    },
    {
        "id":  104,
        "date":  "July 19, 2026",
        "isoDate":  "2026-07-19T19:00:00Z",
        "venue":  "New York/New Jersey (East Rutherford)",
        "group":  "Final",
        "home":  {
                     "name":  "W101",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "away":  {
                     "name":  "W102",
                     "flag":  "https://flagcdn.com/un.svg"
                 },
        "result":  null
    }
];

const mockLeaderboard = [];

