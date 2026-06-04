// ============================================================
// DATA MODULE — Preprocessed study datasets
// ============================================================

const DATA = {};

// ──────── Participants ────────
DATA.participants = {
    total: 29,
    valid: 24,
    invalid: ['gecko', 'cobras', 'otter', 'parrot', 'test'],
    validNames: [
        'bonobo','ocelot','weasel','macaw','badger','wombat','collie','beagle',
        'ferret','marmot','puffer','turtle','raccoon','salmon','chameleon','elephant',
        'flamingo','goldfish','hamster','jellyfish','tiger','lion','panda','bison'
    ]
};

// ──────── Demographics (from surveys.csv, valid only) ────────
DATA.demographics = {
    ages: [30,25,25,25,25,24,25,35,24,25,22,36,23,28,23,25,31,29,28,25,27,26,25,32],
    genders: { 'Male': 20, 'Female': 4 },
    education: { "Bachelor's degree": 14, "Master's degree": 6, "High school degree": 4 },
    programmingExperience: [70,75,30,75,50,80,73,97,15,75,78,73,35,22,77,78,31,80,74,62,60,80,93,42],
    pythonExperience: [0,68,16,17,16,37,23,74,19,74,59,69,37,15,80,78,26,67,83,89,64,35,95,55],
    VSCodeExperience: [9,66,3,89,81,19,6,27,54,86,71,76,40,41,56,92,0,41,73,69,56,74,100,83],
    CopilotExperience: [0,91,0,78,0,6,11,51,0,0,0,98,35,0,37,0,32,0,0,100,60,0,89,38],
    ChatGPTExperience: [0,92,11,67,36,42,46,78,29,5,27,79,50,28,88,91,100,0,67,100,60,65,92,84]
};

// ──────── Code Metrics (from code.csv) ────────
DATA.code = {
    names: ['bonobo','ocelot','weasel','macaw','badger','wombat','collie','beagle','ferret','marmot','puffer','turtle','raccoon','salmon','chameleon','elephant','flamingo','goldfish','hamster','jellyfish','tiger','lion','panda','bison'],
    control: { code: [54,61,59,60,94,60,96,96,58,66,50,57,51,45,76,60,122,60,99,65,65,54,95,55], comments: [3,4,4,6,9,3,8,8,3,3,8,10,4,8,7,4,8,3,8,3,4,3,9,10] },
    autocomplete: { code: [90,98,135,110,82,78,78,71,113,74,72,78,68,67,72,109,78,63,78,104,70,72,70,84], comments: [10,14,9,20,12,15,10,15,12,18,8,24,3,9,6,23,16,4,10,18,4,13,14,19] },
    conversational: { code: [104,60,72,79,68,102,80,81,89,83,60,85,100,78,112,72,70,68,79,70,66,101,71,109], comments: [12,3,15,8,3,14,9,29,14,14,4,11,8,4,17,6,5,9,6,6,7,8,17,18] }
};

// ──────── Conditions Data (from conditions.csv) ────────
// Pre-aggregated per condition for valid participants

function parseConditionsData() {
    const raw = [
        // [conditionID, participantID, seqNum, taskName, envName, speedReqImpl, qualityCorrectImpl, qualityMI, activityCharOutput, commBrowserChars, commAIChars, commAISnippets, commAISnippetSize, sat1-sat10 (10 UX items)]
        [1,1,1,'PDF','control',6,6,68.89,229,11,0,0,0, 5,3,5,5,3,3,3,5,2,3],
        [3,1,3,'CSV','conversational',6,3,86.35,285,0,272,6,45.33, 5,6,3,4,6,6,4,7,3,2],
        [2,1,2,'TXT','autocomplete',7,7,68.24,1326,0,828,15,55.2, 7,7,7,7,1,6,6,7,5,6],
        [4,2,1,'CSV','autocomplete',9,8,81.95,1180,23,504,13,38.77, 5,5,6,5,3,5,3,6,6,5],
        [5,2,2,'PDF','conversational',6,1,66.82,380,75,35,1,35, 2,3,3,3,3,5,5,3,3,4],
        [6,2,3,'TXT','control',7,7,67.02,677,244,0,0,0, 5,5,5,4,7,3,4,5,6,4],
        [10,4,1,'PDF','conversational',7,3,74.83,479,0,474,4,118.5, 6,6,7,5,4,5,5,6,6,7],
        [11,4,2,'CSV','autocomplete',7,5,78.95,495,106,260,6,43.33, 7,7,7,5,5,6,5,6,6,6],
        [12,4,3,'TXT','control',3,3,78.95,380,122,0,0,0, 3,4,5,4,4,4,4,3,3,3],
        [13,5,1,'TXT','control',4,4,73.99,344,145,0,0,0, 6,6,4,5,5,3,4,6,6,5],
        [14,5,2,'PDF','conversational',10,10,67.35,450,0,380,2,190, 7,6,7,6,6,6,5,6,6,6],
        [15,5,3,'CSV','autocomplete',10,10,83.09,1020,0,980,11,89.09, 7,6,7,6,7,6,6,7,7,7],
        [16,6,1,'TXT','autocomplete',10,10,71.23,749,0,483,22,21.95, 6,7,7,4,6,6,3,7,7,6],
        [17,6,2,'CSV','control',4,4,83.67,549,309,0,0,0, 2,4,3,2,3,3,5,3,2,3],
        [18,6,3,'PDF','conversational',10,8,67.06,406,0,69,2,34.5, 2,3,3,3,2,6,5,5,2,6],
        [19,7,1,'PDF','control',7,7,69.44,238,26,0,0,0, 5,4,5,6,5,5,5,6,6,4],
        [20,7,2,'TXT','autocomplete',10,10,72.44,857,0,753,21,35.86, 6,3,6,5,6,6,6,6,6,6],
        [21,7,3,'CSV','conversational',7,7,85.89,1276,0,414,7,59.14, 3,4,4,6,5,6,5,6,2,7],
        [22,8,1,'PDF','autocomplete',9,9,69.97,527,0,349,8,43.63, 6,6,6,6,5,5,4,6,6,6],
        [23,8,2,'TXT','conversational',10,10,70.38,1040,0,918,11,83.45, 7,6,7,6,5,7,7,7,6,6],
        [24,8,3,'CSV','control',4,4,83.75,355,152,0,0,0, 2,2,2,3,2,2,2,2,2,2],
        [28,10,1,'TXT','conversational',10,10,78.48,1106,0,655,6,109.17, 6,6,6,4,5,5,6,7,6,5],
        [29,10,2,'PDF','autocomplete',10,10,73.44,617,0,409,11,37.18, 5,5,5,4,4,5,5,6,6,5],
        [30,10,3,'CSV','control',10,10,78.47,504,233,0,0,0, 6,5,5,4,6,5,3,5,5,4],
        [31,11,1,'PDF','control',5,4,71.12,130,10,0,0,0, 6,5,6,6,5,6,3,7,6,4],
        [32,11,2,'TXT','conversational',10,10,69.04,980,0,980,4,245, 6,4,6,4,3,4,6,5,5,6],
        [33,11,3,'CSV','autocomplete',10,10,79.33,1427,0,381,9,42.33, 6,5,6,6,5,6,6,6,6,7],
        [34,12,1,'CSV','autocomplete',10,9,83.26,865,12,417,9,46.33, 6,7,6,6,7,6,4,6,6,5],
        [35,12,2,'PDF','control',10,9,65.03,416,60,0,0,0, 6,6,6,6,7,6,4,6,6,5],
        [36,12,3,'TXT','conversational',10,10,70.62,1240,0,1141,6,190.17, 7,7,6,6,5,6,6,6,5,5],
        [37,13,1,'CSV','control',4,1,83.75,129,68,0,0,0, 5,5,3,3,3,5,6,6,6,5],
        [38,13,2,'TXT','autocomplete',10,6,72.26,779,0,532,16,33.25, 5,5,3,3,3,5,5,6,6,5],
        [39,13,3,'PDF','conversational',5,3,72.14,220,0,215,4,54, 3,5,2,2,1,6,5,6,6,5],
        [40,14,1,'CSV','autocomplete',10,8,82.58,1708,0,640,12,53.3, 7,7,7,7,6,6,7,7,7,7],
        [41,14,2,'TXT','conversational',10,10,74.6,3575,0,3575,3,1191.67, 7,7,6,6,4,5,5,6,7,6],
        [42,14,3,'PDF','control',6,1,77.27,361,37,0,0,0, 2,2,2,2,1,1,1,1,2,1],
        [52,18,1,'PDF','autocomplete',7,7,75.78,350,0,154,4,38.5, 6,6,7,2,5,5,5,5,5,5],
        [53,18,2,'CSV','control',2,1,83.61,269,63,0,0,0, 1,4,2,5,6,3,3,3,3,4],
        [54,18,3,'TXT','conversational',6,6,65.83,2586,0,2465,8,308.13, 6,6,7,6,6,6,6,7,6,6],
        [55,19,1,'TXT','control',6,2,62.3,920,891,0,0,0, 5,2,6,6,5,6,6,7,6,6],
        [56,19,2,'PDF','autocomplete',8,7,68.55,1976,0,336,14,24, 7,6,2,3,6,6,6,7,6,7],
        [57,19,3,'CSV','conversational',10,10,78.69,1147,0,1127,10,112.7, 7,7,7,7,7,7,6,7,6,7],
        [58,20,1,'CSV','autocomplete',10,9,82.55,1284,0,524,10,52.4, 7,7,7,7,5,7,7,7,7,7],
        [59,20,2,'PDF','conversational',10,10,73.03,2125,0,2073,4,518.25, 7,7,7,7,7,7,7,7,5,1],
        [60,20,3,'TXT','control',7,7,66.7,871,194,0,0,0, 5,7,2,7,1,3,1,5,7,3],
        [61,21,1,'PDF','conversational',8,6,72.13,1453,0,1067,6,177.83, 7,6,6,6,5,6,6,7,7,6],
        [62,21,2,'CSV','control',3,1,82.63,430,147,0,0,0, 1,4,6,5,2,3,1,2,1,2],
        [63,21,3,'TXT','autocomplete',10,7,72.1,1273,0,1006,29,34.69, 5,3,7,5,2,3,5,6,1,5],
        [64,22,1,'CSV','conversational',9,8,80.28,546,0,274,5,54.8, 6,6,7,4,6,6,5,7,6,5],
        [65,22,2,'TXT','autocomplete',7,6,65.88,580,65,238,4,59.5, 3,5,3,4,2,3,2,4,3,4],
        [66,22,3,'PDF','control',8,7,67.53,370,37,0,0,0, 5,5,5,6,7,4,2,6,6,3],
        [67,23,1,'CSV','control',10,10,76.56,785,144,0,0,0, 6,5,6,5,7,5,4,7,6,5],
        [68,23,2,'TXT','conversational',10,7,63.99,1112,0,613,7,87.57, 5,5,5,6,6,6,5,7,6,6],
        [69,23,3,'PDF','autocomplete',10,10,70.02,499,0,315,10,31.5, 6,6,7,5,6,5,6,7,6,6],
        [70,24,1,'CSV','autocomplete',10,10,82.84,493,0,481,11,43.73, 6,6,6,7,7,7,4,6,6,5],
        [71,24,2,'PDF','control',10,10,64.47,535,64,0,0,0, 3,5,3,6,6,4,2,3,5,2],
        [72,24,3,'TXT','conversational',10,10,69.18,796,0,796,1,796, 7,7,6,7,5,7,7,7,6,7],
        [76,26,1,'CSV','conversational',6,4,80.31,469,55,187,3,62.33, 3,4,4,5,6,4,5,6,6,4],
        [77,26,2,'TXT','control',7,7,61.41,711,152,0,0,0, 6,4,4,4,4,4,4,4,4,4],
        [78,26,3,'PDF','autocomplete',10,8,64.89,855,0,594,13,45.69, 7,4,4,4,4,4,5,5,4,4],
        [79,27,1,'CSV','conversational',7,6,82.09,339,0,253,8,31.63, 6,6,6,4,5,4,4,6,6,4],
        [80,27,2,'PDF','control',6,5,70.66,381,18,0,0,0, 3,4,3,4,5,4,6,4,4,4],
        [81,27,3,'TXT','autocomplete',10,10,75.5,592,0,478,16,29.88, 7,5,7,4,6,4,5,6,6,4],
        [82,28,1,'PDF','conversational',10,6,73.48,985,0,959,5,191.8, 6,5,6,4,2,5,5,5,4,5],
        [83,28,2,'CSV','control',7,3,83.14,491,254,0,0,0, 2,4,3,2,2,1,3,2,3,1],
        [84,28,3,'TXT','autocomplete',10,10,73.72,1354,0,793,16,49.56, 7,7,7,6,5,5,6,7,6,5],
        [85,29,1,'CSV','conversational',10,10,82.76,527,0,526,3,175.33, 7,6,7,6,6,2,6,7,7,5],
        [86,29,2,'PDF','autocomplete',10,8,72.69,1515,0,618,15,41.2, 6,5,5,5,3,3,4,5,3,4],
        [87,29,3,'TXT','control',1,1,83.04,412,103,0,0,0, 3,4,3,4,2,2,2,5,4,4],
    ];

    // UX dimension labels (index 13-22 in each row)
    const uxLabels = [
        'Simple↔Complicated', 'Ugly↔Attractive', 'Practical↔Impractical',
        'Stylish↔Tacky', 'Predictable↔Unpredictable', 'Cheap↔Premium',
        'Unimaginative↔Creative', 'Good↔Bad', 'Confusing↔Clear', 'Dull↔Captivating'
    ];

    const conditions = { control: [], autocomplete: [], conversational: [] };

    raw.forEach(r => {
        const entry = {
            conditionID: r[0], participantID: r[1], seqNum: r[2],
            task: r[3], env: r[4],
            speedReq: r[5], qualityCorrect: r[6], qualityMI: r[7],
            activityChars: r[8], browserChars: r[9], aiChars: r[10],
            aiSnippets: r[11], aiSnippetSize: r[12],
            ux: r.slice(13)
        };
        conditions[entry.env].push(entry);
    });

    return { conditions, uxLabels };
}

DATA.conditions = parseConditionsData();

// ──────── Survey Self-Report Ratings (from surveys.csv) ────────
// Extracted per-condition ratings (controlSpeed, controlQuality, etc.)
DATA.surveyRatings = {
    control: {
        speed: [0,72,10,0,38,31,0,59,4,30,71,36,17,36,65,0,0,39,61,0,50,31,6,30],
        quality: [0,63,9,31,40,45,51,63,17,71,69,36,14,26,76,86,0,72,71,8,50,40,9,32],
        activity: [72,63,25,16,86,41,95,60,0,32,28,35,11,46,65,0,0,40,37,79,50,50,0,6],
        communication: [0,57,0,5,29,29,0,61,9,34,71,13,13,28,44,0,0,33,77,0,50,22,76,45],
        satisfaction: [41,78,14,0,39,36,25,72,45,64,70,8,49,50,61,79,0,70,65,0,50,33,70,55],
        ideSupport: [57,31,0,29,43,55,0,68,13,67,70,31,50,12,43,60,0,57,51,8,50,24,67,41],
        ideUnderstanding: [18,28,0,0,0,6,0,64,13,34,71,0,50,0,45,86,0,56,79,0,50,10,26,0]
    },
    autocomplete: {
        speed: [100,85,28,60,100,82,61,78,96,69,74,100,30,100,84,75,92,26,100,88,81,85,97,81],
        quality: [24,42,28,78,64,72,59,69,95,77,32,100,50,57,70,100,100,83,65,96,60,72,39,64],
        activity: [81,77,62,76,26,67,79,84,88,75,34,100,50,74,82,73,100,40,40,41,56,45,63,60],
        communication: [66,61,84,100,83,49,58,69,100,73,34,94,50,30,74,87,48,26,65,94,41,92,80,37],
        satisfaction: [100,84,100,80,100,78,62,81,92,31,74,100,50,66,88,100,62,42,79,92,60,89,81,62],
        ideSupport: [100,69,74,95,100,76,65,79,100,66,75,100,26,78,85,63,63,69,69,96,65,86,83,39],
        ideUnderstanding: [71,41,69,100,78,71,56,77,72,29,75,100,26,32,15,0,0,41,41,53,44,65,76,11]
    },
    conversational: {
        speed: [77,36,72,100,7,58,92,97,95,76,29,85,82,60,100,100,83,93,79,100,63,72,37,100],
        quality: [70,43,62,78,66,56,89,70,92,63,55,100,86,87,94,100,100,92,31,100,62,65,35,100],
        activity: [37,42,64,100,97,42,44,93,100,81,33,100,50,60,94,100,82,94,69,37,50,46,72,95],
        communication: [98,56,100,69,59,64,100,95,94,73,89,100,74,93,94,100,100,90,60,99,55,67,14,100],
        satisfaction: [64,13,100,100,39,83,100,99,85,77,77,100,70,92,94,0,100,100,78,99,57,70,29,99],
        ideSupport: [100,36,92,100,55,70,92,96,100,77,79,90,76,80,35,100,100,98,54,99,55,73,67,61],
        ideUnderstanding: [100,68,84,40,64,99,93,75,100,81,74,100,79,86,100,0,100,18,24,86,62,83,89,100]
    }
};

// ──────── Helper aggregation functions ────────
function mean(arr) {
    const valid = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}

function median(arr) {
    const sorted = [...arr].filter(v => !isNaN(v)).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function std(arr) {
    const m = mean(arr);
    const valid = arr.filter(v => !isNaN(v));
    return Math.sqrt(valid.reduce((sum, v) => sum + (v - m) ** 2, 0) / valid.length);
}

function quartiles(arr) {
    const sorted = [...arr].filter(v => !isNaN(v)).sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q2 = median(sorted);
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    return { min: sorted[0], q1, median: q2, q3, max: sorted[sorted.length - 1] };
}

function correlationPearson(x, y) {
    const n = Math.min(x.length, y.length);
    const mx = mean(x.slice(0, n)), my = mean(y.slice(0, n));
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
        num += (x[i] - mx) * (y[i] - my);
        dx += (x[i] - mx) ** 2;
        dy += (y[i] - my) ** 2;
    }
    return dx && dy ? num / Math.sqrt(dx * dy) : 0;
}

// ──────── Aggregate by condition ────────
function getConditionMetrics(envName) {
    const entries = DATA.conditions.conditions[envName];
    return {
        speedReq: entries.map(e => e.speedReq),
        qualityCorrect: entries.map(e => e.qualityCorrect),
        qualityMI: entries.map(e => e.qualityMI),
        activityChars: entries.map(e => e.activityChars),
        aiChars: entries.map(e => e.aiChars),
        aiSnippets: entries.map(e => e.aiSnippets),
        aiSnippetSize: entries.map(e => e.aiSnippetSize).filter(v => v > 0),
        browserChars: entries.map(e => e.browserChars),
        ux: Array.from({ length: 10 }, (_, i) => entries.map(e => e.ux[i]))
    };
}

// ──────── Aggregate by condition × task ────────
function getConditionTaskMetrics(envName, taskName) {
    const entries = DATA.conditions.conditions[envName].filter(e => e.task === taskName);
    return {
        speedReq: entries.map(e => e.speedReq),
        qualityCorrect: entries.map(e => e.qualityCorrect),
        qualityMI: entries.map(e => e.qualityMI),
        activityChars: entries.map(e => e.activityChars)
    };
}
