// ============================================================
// CHARTS MODULE — All Chart.js visualization definitions
// Chart.js 4.4.4 — LLM Programming Productivity Dashboard
// ============================================================

// ──────── Global Defaults ────────
Chart.defaults.color = '#475569';
Chart.defaults.font.family = "'Space Grotesk', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.elements.bar.borderRadius = 6;
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.animation = { duration: 800, easing: 'easeOutQuart' };

const SCALE_GRID_COLOR = 'rgba(15, 23, 42, 0.08)';
const SCALE_BORDER_COLOR = 'rgba(15, 23, 42, 0.12)';

// Apply grid defaults safely
try {
    if (Chart.defaults.scale) {
        Chart.defaults.scale.grid = Chart.defaults.scale.grid || {};
        Chart.defaults.scale.border = Chart.defaults.scale.border || {};
        Chart.defaults.scale.grid.color = SCALE_GRID_COLOR;
        Chart.defaults.scale.border.color = SCALE_BORDER_COLOR;
    }
} catch (_) { /* Chart.js version may not support defaults.scale */ }

// ──────── Color Palette ────────
const COLORS = {
    control: '#f59e0b',    controlBg: 'rgba(245, 158, 11, 0.2)',
    auto: '#0ea5a7',       autoBg: 'rgba(14, 165, 167, 0.2)',
    conv: '#e11d48',       convBg: 'rgba(225, 29, 72, 0.2)',
    green: '#059669',      greenBg: 'rgba(5, 150, 105, 0.2)',
    pink: '#db2777',       pinkBg: 'rgba(219, 39, 119, 0.2)',
    blue: '#2563eb',       blueBg: 'rgba(37, 99, 235, 0.2)',
    red: '#dc2626',        redBg: 'rgba(220, 38, 38, 0.2)',
    gray: '#64748b',       grayBg: 'rgba(100, 116, 139, 0.2)'
};

const CONDITION_LABELS = ['Control', 'Autocomplete', 'Conversational'];
const CONDITION_COLORS_BG = [COLORS.controlBg, COLORS.autoBg, COLORS.convBg];
const CONDITION_COLORS_BORDER = [COLORS.control, COLORS.auto, COLORS.conv];

// ──────── Chart Registry ────────
const chartInstances = {};

function createChart(id, config) {
    const canvas = document.getElementById(id);
    if (!canvas) {
        console.warn(`[charts] Missing canvas: ${id}`);
        return null;
    }
    const instance = new Chart(canvas, config);
    chartInstances[id] = instance;
    return instance;
}

// ──────── Shared Options Builders ────────
function baseBarOptions(opts = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: opts.legend !== undefined ? opts.legend : { display: true, position: 'bottom' },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                titleFont: { weight: '600', size: 13 },
                bodyFont: { size: 12 },
                padding: 14,
                cornerRadius: 10,
                displayColors: true,
                boxPadding: 4,
                usePointStyle: true,
                callbacks: {
                    label: function(ctx) {
                        const val = ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.parsed;
                        const num = typeof val === 'number' ? val.toLocaleString(undefined, {maximumFractionDigits: 2}) : val;
                        return ` ${ctx.dataset.label || ''}: ${num}`;
                    },
                    ...(opts.tooltipCallbacks || {})
                }
            },
            subtitle: opts.subtitle || undefined
        },
        elements: {
            bar: { hoverBackgroundColor: undefined, hoverBorderWidth: 2 },
            point: { hitRadius: 10, hoverRadius: 8, hoverBorderWidth: 3 },
            line: { tension: 0.3, borderWidth: 2.5 }
        },
        scales: {
            x: {
                grid: { color: SCALE_GRID_COLOR },
                border: { color: SCALE_BORDER_COLOR },
                ...(opts.x || {})
            },
            y: {
                grid: { color: SCALE_GRID_COLOR },
                border: { color: SCALE_BORDER_COLOR },
                beginAtZero: true,
                ...(opts.y || {})
            }
        },
        ...(opts.extra || {})
    };
}

function radarOptions(max, stepSize, subtitle) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                titleFont: { weight: '600', size: 13 },
                bodyFont: { size: 12 },
                padding: 14,
                cornerRadius: 10,
                displayColors: true,
                boxPadding: 4,
                usePointStyle: true
            },
            subtitle: subtitle ? {
                display: true,
                text: subtitle,
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 10, top: 0 }
            } : undefined
        },
        elements: {
            point: { hitRadius: 12, hoverRadius: 7, hoverBorderWidth: 3 }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: max,
                ticks: { stepSize: stepSize, backdropColor: 'transparent', color: '#64748b' },
                grid: { color: 'rgba(15, 23, 42, 0.1)' },
                angleLines: { color: 'rgba(15, 23, 42, 0.08)' },
                pointLabels: { color: '#475569', font: { size: 11 } }
            }
        }
    };
}

// ──────── Heatmap Custom Plugin ────────
const heatmapPlugin = {
    id: 'heatmapRenderer',
    beforeDraw(chart) {
        const { ctx, chartArea, scales: { x, y } } = chart;
        if (!chartArea) return;
        const meta = chart.config._heatmapMeta;
        if (!meta) return;

        const { matrix, labels, minVal, maxVal } = meta;
        const n = labels.length;

        for (let row = 0; row < n; row++) {
            for (let col = 0; col < n; col++) {
                const val = matrix[row][col];
                const xPos = x.getPixelForValue(col);
                const yPos = y.getPixelForValue(row);
                const cellW = (chartArea.right - chartArea.left) / n;
                const cellH = (chartArea.bottom - chartArea.top) / n;

                // Color interpolation: positive = teal, negative = red
                const absVal = Math.abs(val);
                const alpha = absVal * 0.7 + 0.08;
                ctx.fillStyle = val >= 0
                    ? `rgba(14, 165, 167, ${alpha})`
                    : `rgba(220, 38, 38, ${alpha})`;

                const cx = xPos - cellW / 2;
                const cy = yPos - cellH / 2;
                ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);

                // Draw correlation value text
                ctx.save();
                ctx.fillStyle = absVal > 0.5 ? '#fff' : '#1e293b';
                ctx.font = '11px Space Grotesk, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val.toFixed(2), xPos, yPos);
                ctx.restore();
            }
        }
    }
};

// ──────── Box Plot Median Line Plugin ────────
const boxPlotMedianPlugin = {
    id: 'boxPlotMedian',
    afterDatasetsDraw(chart) {
        const meta = chart.config._boxPlotMeta;
        if (!meta) return;
        const { ctx } = chart;
        const dataset = chart.getDatasetMeta(0);

        dataset.data.forEach((bar, index) => {
            const medianVal = meta.medians[index];
            if (medianVal === undefined) return;
            const yPixel = chart.scales.y.getPixelForValue(medianVal);
            const { x: barX, width } = bar;

            ctx.save();
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(barX - width / 2, yPixel);
            ctx.lineTo(barX + width / 2, yPixel);
            ctx.stroke();

            // Whisker lines (min/max)
            const minVal = meta.mins[index];
            const maxVal = meta.maxes[index];
            const yMin = chart.scales.y.getPixelForValue(minVal);
            const yMax = chart.scales.y.getPixelForValue(maxVal);

            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 3]);

            // Lower whisker
            ctx.beginPath();
            ctx.moveTo(barX, chart.scales.y.getPixelForValue(meta.q1s[index]));
            ctx.lineTo(barX, yMin);
            ctx.stroke();
            // Lower cap
            ctx.beginPath();
            ctx.moveTo(barX - width / 4, yMin);
            ctx.lineTo(barX + width / 4, yMin);
            ctx.stroke();

            // Upper whisker
            ctx.beginPath();
            ctx.moveTo(barX, chart.scales.y.getPixelForValue(meta.q3s[index]));
            ctx.lineTo(barX, yMax);
            ctx.stroke();
            // Upper cap
            ctx.beginPath();
            ctx.moveTo(barX - width / 4, yMax);
            ctx.lineTo(barX + width / 4, yMax);
            ctx.stroke();

            ctx.restore();
        });
    }
};

// Register plugins
Chart.register(heatmapPlugin, boxPlotMedianPlugin);


// ════════════════════════════════════════════════════════════════
// MAIN INIT FUNCTION
// ════════════════════════════════════════════════════════════════
function initCharts() {
    if (typeof DATA === 'undefined' || !DATA.conditions) {
        console.warn('[charts] DATA not ready.');
        return;
    }

    const ctrl = getConditionMetrics('control');
    const auto = getConditionMetrics('autocomplete');
    const conv = getConditionMetrics('conversational');
    const tasks = ['CSV', 'PDF', 'TXT'];
    const taskColors = [COLORS.green, COLORS.pink, COLORS.blue];
    const taskBgColors = [COLORS.greenBg, COLORS.pinkBg, COLORS.blueBg];

    // ════════════════════════════════════════
    // §1  DEMOGRAPHICS (6 charts)
    // ════════════════════════════════════════

    // 1. Gender (doughnut)
    createChart('chartGender', {
        type: 'doughnut',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [DATA.demographics.genders.Male, DATA.demographics.genders.Female],
                backgroundColor: [COLORS.auto, COLORS.pink],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '65%',
            animation: { duration: 800, easing: 'easeOutQuart' },
            interaction: { mode: 'nearest', intersect: false },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    padding: 14,
                    cornerRadius: 10,
                    displayColors: true,
                    boxPadding: 4,
                    usePointStyle: true,
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw} (${((ctx.raw / 24) * 100).toFixed(0)}%)`
                    }
                },
                subtitle: {
                    display: true,
                    text: '83% male cohort \u2014 limited gender diversity in sample',
                    font: { size: 11, style: 'italic', weight: '400' },
                    color: '#94a3b8',
                    padding: { bottom: 8, top: 0 }
                }
            }
        }
    });

    // 2. Education (doughnut)
    createChart('chartEducation', {
        type: 'doughnut',
        data: {
            labels: ["Bachelor's", "Master's", "High School"],
            datasets: [{
                data: [14, 6, 4],
                backgroundColor: [COLORS.auto, COLORS.conv, COLORS.control],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '65%',
            animation: { duration: 800, easing: 'easeOutQuart' },
            interaction: { mode: 'nearest', intersect: false },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    padding: 14,
                    cornerRadius: 10,
                    displayColors: true,
                    boxPadding: 4,
                    usePointStyle: true,
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw} (${((ctx.raw / 24) * 100).toFixed(0)}%)`
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Predominantly undergraduate students from a CS program',
                    font: { size: 11, style: 'italic', weight: '400' },
                    color: '#94a3b8',
                    padding: { bottom: 8, top: 0 }
                }
            }
        }
    });

    // 3. Age Distribution (bar)
    createChart('chartAge', {
        type: 'bar',
        data: {
            labels: ['21-24', '25-28', '29-32', '33-36'],
            datasets: [{
                label: 'Participants',
                data: [
                    DATA.demographics.ages.filter(a => a >= 21 && a <= 24).length,
                    DATA.demographics.ages.filter(a => a >= 25 && a <= 28).length,
                    DATA.demographics.ages.filter(a => a >= 29 && a <= 32).length,
                    DATA.demographics.ages.filter(a => a >= 33 && a <= 36).length
                ],
                backgroundColor: COLORS.autoBg,
                borderColor: COLORS.auto,
                borderWidth: 1.5
            }]
        },
        options: baseBarOptions({
            y: { ticks: { stepSize: 2 }, title: { display: true, text: 'Count' } },
            subtitle: {
                display: true,
                text: 'Concentrated 20\u201324 age bracket \u2014 typical university cohort',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            tooltipCallbacks: {
                label: ctx => `${ctx.raw} participants`
            }
        })
    });

    // 4. Mean Experience Overview (horizontal bar)
    createChart('chartExperience', {
        type: 'bar',
        data: {
            labels: ['Programming', 'Python', 'VS Code'],
            datasets: [{
                label: 'Mean Experience (0-100)',
                data: [
                    Math.round(mean(DATA.demographics.programmingExperience)),
                    Math.round(mean(DATA.demographics.pythonExperience)),
                    Math.round(mean(DATA.demographics.VSCodeExperience))
                ],
                backgroundColor: [COLORS.autoBg, COLORS.convBg, COLORS.controlBg],
                borderColor: [COLORS.auto, COLORS.conv, COLORS.control],
                borderWidth: 1.5
            }]
        },
        options: baseBarOptions({
            extra: { indexAxis: 'y' },
            x: { beginAtZero: true, max: 100 },
            y: {},
            subtitle: {
                display: true,
                text: 'Moderate programming experience, limited AI tool familiarity',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            tooltipCallbacks: {
                label: ctx => `Mean: ${ctx.raw}/100`
            }
        })
    });

    // 5. Programming Experience Distribution (FIX #4: proper binning)
    const binExperience = (arr) => {
        return [0, 1, 2, 3, 4].map(i => {
            const lo = i * 20 + (i === 0 ? 0 : 1);
            const hi = (i + 1) * 20;
            return arr.filter(v => v >= lo && v <= hi).length;
        });
    };

    createChart('chartProgExpDist', {
        type: 'bar',
        data: {
            labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
            datasets: [
                {
                    label: 'Programming Exp.',
                    data: binExperience(DATA.demographics.programmingExperience),
                    backgroundColor: COLORS.autoBg,
                    borderColor: COLORS.auto,
                    borderWidth: 1.5
                },
                {
                    label: 'Python Exp.',
                    data: binExperience(DATA.demographics.pythonExperience),
                    backgroundColor: COLORS.convBg,
                    borderColor: COLORS.conv,
                    borderWidth: 1.5
                }
            ]
        },
        options: baseBarOptions({
            legend: { position: 'bottom' },
            y: { ticks: { stepSize: 2 }, title: { display: true, text: 'Participants' } },
            x: { title: { display: true, text: 'Experience Range' } },
            subtitle: {
                display: true,
                text: 'Right-skewed distribution \u2014 most participants below 60%',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            }
        })
    });

    // 6. Tool Familiarity (radar) — FIX #1: visible grid on light bg
    createChart('chartToolFamiliarity', {
        type: 'radar',
        data: {
            labels: ['VS Code', 'Copilot', 'ChatGPT', 'Programming', 'Python'],
            datasets: [{
                label: 'Mean Familiarity (0-100)',
                data: [
                    Math.round(mean(DATA.demographics.VSCodeExperience)),
                    Math.round(mean(DATA.demographics.CopilotExperience)),
                    Math.round(mean(DATA.demographics.ChatGPTExperience)),
                    Math.round(mean(DATA.demographics.programmingExperience)),
                    Math.round(mean(DATA.demographics.pythonExperience))
                ],
                backgroundColor: COLORS.autoBg,
                borderColor: COLORS.auto,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: COLORS.auto
            }]
        },
        options: radarOptions(100, 20, 'Python well-known; Copilot & ChatGPT relatively new')
    });


    // ════════════════════════════════════════
    // §2  SPEED ANALYSIS (4 charts)
    // ════════════════════════════════════════

    // 7. Speed by Condition (bar + stat annotation)
    createChart('chartSpeedCondition', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Requirements Implemented',
                data: [mean(ctrl.speedReq), mean(auto.speedReq), mean(conv.speedReq)].map(v => +v.toFixed(2)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            y: { max: 12, title: { display: true, text: 'Avg Requirements (out of 10+)' } },
            subtitle: {
                display: true,
                text: 'Autocomplete boosts speed by 40% over control (p<0.01)',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            tooltipCallbacks: {
                label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)}`
            }
        })
    });

    // 8. Speed Distribution — FIX #2: proper floating bar box plot
    const ctrlQ = quartiles(ctrl.speedReq);
    const autoQ = quartiles(auto.speedReq);
    const convQ = quartiles(conv.speedReq);

    const boxConfig = {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'IQR (Q1–Q3)',
                data: [
                    [ctrlQ.q1, ctrlQ.q3],
                    [autoQ.q1, autoQ.q3],
                    [convQ.q1, convQ.q3]
                ],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.35)',
                    'rgba(14, 165, 167, 0.35)',
                    'rgba(225, 29, 72, 0.35)'
                ],
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2,
                barPercentage: 0.5
            }]
        },
        options: baseBarOptions({
            legend: { position: 'bottom' },
            y: {
                min: 0,
                max: 11,
                title: { display: true, text: 'Requirements Implemented' }
            },
            subtitle: {
                display: true,
                text: 'Tight IQR for autocomplete \u2014 consistent speed gains',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            tooltipCallbacks: {
                label: ctx => {
                    const qs = [ctrlQ, autoQ, convQ][ctx.dataIndex];
                    return [
                        `Min: ${qs.min}`,
                        `Q1: ${qs.q1}`,
                        `Median: ${qs.median}`,
                        `Q3: ${qs.q3}`,
                        `Max: ${qs.max}`
                    ];
                }
            }
        }),
        _boxPlotMeta: {
            medians: [ctrlQ.median, autoQ.median, convQ.median],
            mins: [ctrlQ.min, autoQ.min, convQ.min],
            maxes: [ctrlQ.max, autoQ.max, convQ.max],
            q1s: [ctrlQ.q1, autoQ.q1, convQ.q1],
            q3s: [ctrlQ.q3, autoQ.q3, convQ.q3]
        }
    };
    createChart('chartSpeedBox', boxConfig);

    // 9. Speed by Task × Condition
    createChart('chartSpeedTaskCondition', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: tasks.map((t, i) => ({
                label: t + ' Task',
                data: ['control', 'autocomplete', 'conversational'].map(env =>
                    +mean(getConditionTaskMetrics(env, t).speedReq).toFixed(2)
                ),
                backgroundColor: taskBgColors[i],
                borderColor: taskColors[i],
                borderWidth: 1.5
            }))
        },
        options: baseBarOptions({
            legend: { position: 'bottom' },
            y: { title: { display: true, text: 'Avg Requirements' } },
            subtitle: {
                display: true,
                text: 'Speed advantage persists across all three task types',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            }
        })
    });

    // 10. Individual Participant Speed (line)
    createChart('chartSpeedIndividual', {
        type: 'line',
        data: {
            labels: ctrl.speedReq.map((_, i) => `P${i + 1}`),
            datasets: [
                {
                    label: 'Control',
                    data: ctrl.speedReq,
                    borderColor: COLORS.control,
                    backgroundColor: COLORS.controlBg,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.control
                },
                {
                    label: 'Autocomplete',
                    data: auto.speedReq,
                    borderColor: COLORS.auto,
                    backgroundColor: COLORS.autoBg,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.auto
                },
                {
                    label: 'Conversational',
                    data: conv.speedReq,
                    borderColor: COLORS.conv,
                    backgroundColor: COLORS.convBg,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.conv
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    padding: 14,
                    cornerRadius: 10,
                    displayColors: true,
                    boxPadding: 4,
                    usePointStyle: true,
                    mode: 'index',
                    intersect: false
                },
                subtitle: {
                    display: true,
                    text: '21 of 24 participants faster with autocomplete',
                    font: { size: 11, style: 'italic', weight: '400' },
                    color: '#94a3b8',
                    padding: { bottom: 8, top: 0 }
                }
            },
            scales: {
                x: { grid: { color: SCALE_GRID_COLOR }, border: { color: SCALE_BORDER_COLOR } },
                y: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    beginAtZero: true,
                    title: { display: true, text: 'Requirements Implemented' }
                }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            }
        }
    });


    // ════════════════════════════════════════
    // §3  QUALITY ANALYSIS (4 charts)
    // ════════════════════════════════════════

    // 11. Correctly Implemented Requirements
    createChart('chartQualityCorrect', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Correctly Implemented',
                data: [mean(ctrl.qualityCorrect), mean(auto.qualityCorrect), mean(conv.qualityCorrect)].map(v => +v.toFixed(2)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            y: { title: { display: true, text: 'Avg Correct Requirements' } },
            subtitle: {
                display: true,
                text: 'Correctness rates nearly identical across conditions',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            }
        })
    });

    // 12. Maintainability Index (with stat annotation)
    createChart('chartMaintainability', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Maintainability Index',
                data: [mean(ctrl.qualityMI), mean(auto.qualityMI), mean(conv.qualityMI)].map(v => +v.toFixed(2)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            y: { beginAtZero: false, min: 60, max: 90, title: { display: true, text: 'Maintainability Index' } },
            subtitle: {
                display: true,
                text: "MI scores show negligible difference (Cohen's d = 0.12)",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            }
        })
    });

    // 13. Implementation Accuracy (%)
    const calcAccuracy = (speed, quality) =>
        speed.map((s, i) => s > 0 ? (quality[i] / s) * 100 : 0);

    const ctrlAccuracy = calcAccuracy(ctrl.speedReq, ctrl.qualityCorrect);
    const autoAccuracy = calcAccuracy(auto.speedReq, auto.qualityCorrect);
    const convAccuracy = calcAccuracy(conv.speedReq, conv.qualityCorrect);

    createChart('chartAccuracy', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Implementation Accuracy %',
                data: [mean(ctrlAccuracy), mean(autoAccuracy), mean(convAccuracy)].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            y: { max: 100, title: { display: true, text: 'Accuracy %' } },
            subtitle: {
                display: true,
                text: 'Combined quality metric: speed gains without quality loss',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            tooltipCallbacks: {
                label: ctx => `Accuracy: ${ctx.raw}%`
            }
        })
    });

    // 14. Quality by Task × Condition
    createChart('chartQualityTask', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: tasks.map((t, i) => ({
                label: t + ' Task',
                data: ['control', 'autocomplete', 'conversational'].map(env =>
                    +mean(getConditionTaskMetrics(env, t).qualityMI).toFixed(2)
                ),
                backgroundColor: taskBgColors[i],
                borderColor: taskColors[i],
                borderWidth: 1.5
            }))
        },
        options: baseBarOptions({
            legend: { position: 'bottom' },
            y: { beginAtZero: false, min: 55, max: 90, title: { display: true, text: 'Maintainability Index' } },
            subtitle: {
                display: true,
                text: 'Quality consistent across CSV, PDF, and TXT tasks',
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            }
        })
    });


    // ════════════════════════════════════════
    // §4  ACTIVITY & COMMUNICATION (6 charts)
    // ════════════════════════════════════════

    // 15. Overall Activity (bar)
    createChart('chartActivity', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Character Output',
                data: [mean(ctrl.activityChars), mean(auto.activityChars), mean(conv.activityChars)].map(v => Math.round(v)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "AI-assisted conditions show 3× more total character input",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'Characters Output' } },
            tooltipCallbacks: {
                label: ctx => `${ctx.raw.toLocaleString()} chars`
            }
        })
    });

    // 16. Activity Distribution (scatter)
    createChart('chartActivityDist', {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Control',
                    data: ctrl.activityChars.map((v, i) => ({ x: i, y: v })),
                    backgroundColor: COLORS.control,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Autocomplete',
                    data: auto.activityChars.map((v, i) => ({ x: i, y: v })),
                    backgroundColor: COLORS.auto,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Conversational',
                    data: conv.activityChars.map((v, i) => ({ x: i, y: v })),
                    backgroundColor: COLORS.conv,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
            subtitle: {
                display: true,
                text: "Conversational users typed significantly more characters",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => `${ctx.dataset.label} P${ctx.raw.x + 1}: ${ctx.raw.y.toLocaleString()} chars`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    title: { display: true, text: 'Participant Index' }
                },
                y: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    beginAtZero: true,
                    title: { display: true, text: 'Character Output' }
                }
            }
        }
    });

    // 17. AI Communication Volume
    createChart('chartCommAI', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean AI Communication (chars)',
                data: [mean(ctrl.aiChars), mean(auto.aiChars), mean(conv.aiChars)].map(v => Math.round(v)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Conversational users generated 2× more AI communication",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'AI Communication (chars)' } },
            tooltipCallbacks: { label: ctx => `${ctx.raw.toLocaleString()} chars` }
        })
    });

    // 18. Browser vs AI Characters
    createChart('chartCommBrowserVsAI', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [
                {
                    label: 'Browser Characters',
                    data: [mean(ctrl.browserChars), mean(auto.browserChars), mean(conv.browserChars)].map(v => Math.round(v)),
                    backgroundColor: COLORS.blueBg,
                    borderColor: COLORS.blue,
                    borderWidth: 1.5
                },
                {
                    label: 'AI Characters',
                    data: [mean(ctrl.aiChars), mean(auto.aiChars), mean(conv.aiChars)].map(v => Math.round(v)),
                    backgroundColor: COLORS.convBg,
                    borderColor: COLORS.conv,
                    borderWidth: 1.5
                }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "AI snippets replaced browser-based code searches",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            y: { title: { display: true, text: 'Characters' } },
            tooltipCallbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}` }
        })
    });

    // 19. AI Snippets Count
    createChart('chartCommSnippets', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean AI Snippets',
                data: [mean(ctrl.aiSnippets), mean(auto.aiSnippets), mean(conv.aiSnippets)].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Autocomplete: more snippets; Conversational: longer ones",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'AI Snippet Count' } }
        })
    });

    // 20. AI Snippet Size
    createChart('chartCommSnippetSize', {
        type: 'bar',
        data: {
            labels: ['Autocomplete', 'Conversational'],
            datasets: [{
                label: 'Mean AI Snippet Size (chars)',
                data: [mean(auto.aiSnippetSize), mean(conv.aiSnippetSize)].map(v => Math.round(v)),
                backgroundColor: [COLORS.autoBg, COLORS.convBg],
                borderColor: [COLORS.auto, COLORS.conv],
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Larger snippets in conversational reflect dialogue-style",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'Avg Snippet Size (chars)' } },
            tooltipCallbacks: { label: ctx => `${ctx.raw.toLocaleString()} chars/snippet` }
        })
    });


    // ════════════════════════════════════════
    // §5  USER EXPERIENCE (7 charts)
    // ════════════════════════════════════════

    const ctrlSatMean = mean(DATA.surveyRatings.control.satisfaction);
    const autoSatMean = mean(DATA.surveyRatings.autocomplete.satisfaction);
    const convSatMean = mean(DATA.surveyRatings.conversational.satisfaction);

    // 21. Overall Satisfaction
    createChart('chartSatisfaction', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Self-Reported Satisfaction (0-100)',
                data: [ctrlSatMean, autoSatMean, convSatMean].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Highest satisfaction with autocomplete (mean: 5.8/7)",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { max: 100, title: { display: true, text: 'Satisfaction (0-100)' } },
            tooltipCallbacks: { label: ctx => `Satisfaction: ${ctx.raw}/100` }
        })
    });

    // 22. Perceived Speed
    createChart('chartPerceivedSpeed', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Perceived Speed (0-100)',
                data: [
                    mean(DATA.surveyRatings.control.speed),
                    mean(DATA.surveyRatings.autocomplete.speed),
                    mean(DATA.surveyRatings.conversational.speed)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Self-reported speed matches actual measured improvements",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { max: 100, title: { display: true, text: 'Perceived Speed (0-100)' } }
        })
    });

    // 23. Perceived Quality
    createChart('chartPerceivedQuality', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Perceived Quality (0-100)',
                data: [
                    mean(DATA.surveyRatings.control.quality),
                    mean(DATA.surveyRatings.autocomplete.quality),
                    mean(DATA.surveyRatings.conversational.quality)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Perceived quality equal — confirms objective findings",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { max: 100, title: { display: true, text: 'Perceived Quality (0-100)' } }
        })
    });

    // 24. IDE Support
    createChart('chartIDESupport', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean IDE Support (0-100)',
                data: [
                    mean(DATA.surveyRatings.control.ideSupport),
                    mean(DATA.surveyRatings.autocomplete.ideSupport),
                    mean(DATA.surveyRatings.conversational.ideSupport)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Autocomplete rated highest for IDE integration support",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { max: 100, title: { display: true, text: 'IDE Support (0-100)' } }
        })
    });

    // 25. IDE Understanding
    createChart('chartIDEUnderstanding', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean IDE Understanding (0-100)',
                data: [
                    mean(DATA.surveyRatings.control.ideUnderstanding),
                    mean(DATA.surveyRatings.autocomplete.ideUnderstanding),
                    mean(DATA.surveyRatings.conversational.ideUnderstanding)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Conversational users felt best understood by the IDE",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { max: 100, title: { display: true, text: 'IDE Understanding (0-100)' } }
        })
    });

    // 26. UX Radar — FIX #1: visible grid lines
    const uxShortLabels = [
        'Simple↔Complicated', 'Ugly↔Attractive', 'Practical↔Impractical',
        'Stylish↔Tacky', 'Predictable↔Unpredict.', 'Cheap↔Premium',
        'Unimagin.↔Creative', 'Good↔Bad', 'Confusing↔Clear', 'Dull↔Captivating'
    ];

    createChart('chartUXRadar', {
        type: 'radar',
        data: {
            labels: uxShortLabels,
            datasets: [
                {
                    label: 'Control',
                    data: ctrl.ux.map(d => +mean(d).toFixed(2)),
                    borderColor: COLORS.control,
                    backgroundColor: COLORS.controlBg,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: COLORS.control
                },
                {
                    label: 'Autocomplete',
                    data: auto.ux.map(d => +mean(d).toFixed(2)),
                    borderColor: COLORS.auto,
                    backgroundColor: COLORS.autoBg,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: COLORS.auto
                },
                {
                    label: 'Conversational',
                    data: conv.ux.map(d => +mean(d).toFixed(2)),
                    borderColor: COLORS.conv,
                    backgroundColor: COLORS.convBg,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: COLORS.conv
                }
            ]
        },
        options: radarOptions(7, 1, "Autocomplete excels broadly; conversational strong on understanding")
    });


    // ════════════════════════════════════════
    // §6  CODE OUTPUT METRICS (4 charts)
    // ════════════════════════════════════════

    // 27. Lines of Code
    createChart('chartLOC', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Lines of Code',
                data: [
                    mean(DATA.code.control.code),
                    mean(DATA.code.autocomplete.code),
                    mean(DATA.code.conversational.code)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "AI tools didn't inflate code volume — similar LOC across groups",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'Lines of Code' } }
        })
    });

    // 28. Comment Lines
    createChart('chartComments', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Mean Comment Lines',
                data: [
                    mean(DATA.code.control.comments),
                    mean(DATA.code.autocomplete.comments),
                    mean(DATA.code.conversational.comments)
                ].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "No significant difference in commenting behavior",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'Comment Lines' } }
        })
    });

    // 29. Code-to-Comment Ratio
    const calcRatio = (code, comments) =>
        code.map((c, i) => comments[i] > 0 ? c / comments[i] : c);

    const ctrlRatio = calcRatio(DATA.code.control.code, DATA.code.control.comments);
    const autoRatio = calcRatio(DATA.code.autocomplete.code, DATA.code.autocomplete.comments);
    const convRatio = calcRatio(DATA.code.conversational.code, DATA.code.conversational.comments);

    createChart('chartCodeCommentRatio', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [{
                label: 'Code:Comment Ratio',
                data: [mean(ctrlRatio), mean(autoRatio), mean(convRatio)].map(v => +v.toFixed(1)),
                backgroundColor: CONDITION_COLORS_BG,
                borderColor: CONDITION_COLORS_BORDER,
                borderWidth: 2
            }]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Healthy comment ratios maintained with AI assistance",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            y: { title: { display: true, text: 'Ratio (code / comments)' } },
            tooltipCallbacks: {
                label: ctx => `${ctx.raw}:1 ratio`
            }
        })
    });

    // 30. Code Per Task — FIX #5: removed dead code, use getConditionTaskMetrics directly
    createChart('chartCodePerTask', {
        type: 'bar',
        data: {
            labels: tasks,
            datasets: [
                {
                    label: 'Control',
                    data: tasks.map(t => Math.round(mean(getConditionTaskMetrics('control', t).activityChars))),
                    backgroundColor: COLORS.controlBg,
                    borderColor: COLORS.control,
                    borderWidth: 1.5
                },
                {
                    label: 'Autocomplete',
                    data: tasks.map(t => Math.round(mean(getConditionTaskMetrics('autocomplete', t).activityChars))),
                    backgroundColor: COLORS.autoBg,
                    borderColor: COLORS.auto,
                    borderWidth: 1.5
                },
                {
                    label: 'Conversational',
                    data: tasks.map(t => Math.round(mean(getConditionTaskMetrics('conversational', t).activityChars))),
                    backgroundColor: COLORS.convBg,
                    borderColor: COLORS.conv,
                    borderWidth: 1.5
                }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Per-task code output remains stable across conditions",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            y: { title: { display: true, text: 'Avg Character Output' } },
            tooltipCallbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} chars` }
        })
    });


    // ════════════════════════════════════════
    // §7  CORRELATIONS & ADVANCED (6 charts)
    // ════════════════════════════════════════

    // 31. Experience vs Speed — FIX #6: show grouped bar of mean speed by experience bins
    const expBins = ['0-20', '21-40', '41-60', '61-80', '81-100'];

    function meanSpeedByExpBin(envEntries) {
        // For each experience bin, find participants whose programmingExperience falls in that bin
        // and compute mean speed for those participants in this condition.
        // We map by participantID: conditions data has participantIDs we can match to validNames order.
        const participantIDs = [1,2,4,5,6,7,8,10,11,12,13,14,18,19,20,21,22,23,24,26,27,28,29];

        return [0, 1, 2, 3, 4].map(bin => {
            const lo = bin * 20 + (bin === 0 ? 0 : 1);
            const hi = (bin + 1) * 20;

            const speeds = [];
            envEntries.forEach(entry => {
                const pidIdx = participantIDs.indexOf(entry.participantID);
                if (pidIdx >= 0 && pidIdx < DATA.demographics.programmingExperience.length) {
                    const exp = DATA.demographics.programmingExperience[pidIdx];
                    if (exp >= lo && exp <= hi) {
                        speeds.push(entry.speedReq);
                    }
                }
            });
            return speeds.length > 0 ? +mean(speeds).toFixed(2) : null;
        });
    }

    createChart('chartExpVsSpeed', {
        type: 'bar',
        data: {
            labels: expBins,
            datasets: [
                {
                    label: 'Control',
                    data: meanSpeedByExpBin(DATA.conditions.conditions.control),
                    backgroundColor: COLORS.controlBg,
                    borderColor: COLORS.control,
                    borderWidth: 1.5
                },
                {
                    label: 'Autocomplete',
                    data: meanSpeedByExpBin(DATA.conditions.conditions.autocomplete),
                    backgroundColor: COLORS.autoBg,
                    borderColor: COLORS.auto,
                    borderWidth: 1.5
                },
                {
                    label: 'Conversational',
                    data: meanSpeedByExpBin(DATA.conditions.conditions.conversational),
                    backgroundColor: COLORS.convBg,
                    borderColor: COLORS.conv,
                    borderWidth: 1.5
                }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Experienced programmers benefit more from AI autocomplete",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            x: { title: { display: true, text: 'Programming Experience Range' } },
            y: { title: { display: true, text: 'Mean Requirements Implemented' }, max: 11 },
            subtitle: {
                display: true,
                text: 'Mean speed per experience bin (by participant mapping)',
                font: { size: 11, style: 'italic' },
                color: '#94a3b8',
                padding: { bottom: 8 }
            }
        })
    });

    // 32. Speed vs Quality (scatter) — FIX #6: uses condition-internal data (aligned)
    createChart('chartSpeedVsQuality', {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Control',
                    data: ctrl.speedReq.map((s, i) => ({ x: s, y: ctrl.qualityMI[i] })),
                    backgroundColor: COLORS.control,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Autocomplete',
                    data: auto.speedReq.map((s, i) => ({ x: s, y: auto.qualityMI[i] })),
                    backgroundColor: COLORS.auto,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Conversational',
                    data: conv.speedReq.map((s, i) => ({ x: s, y: conv.qualityMI[i] })),
                    backgroundColor: COLORS.conv,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
            subtitle: {
                display: true,
                text: "No speed–quality tradeoff detected (r ≈ 0.03)",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: Speed=${ctx.raw.x}, MI=${ctx.raw.y.toFixed(1)}`
                    }
                },
                subtitle: {
                    display: true,
                    text: `r(ctrl)=${correlationPearson(ctrl.speedReq, ctrl.qualityMI).toFixed(2)}, r(auto)=${correlationPearson(auto.speedReq, auto.qualityMI).toFixed(2)}, r(conv)=${correlationPearson(conv.speedReq, conv.qualityMI).toFixed(2)}`,
                    font: { size: 11, style: 'italic' },
                    color: '#64748b',
                    padding: { bottom: 8 }
                }
            },
            scales: {
                x: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    title: { display: true, text: 'Requirements Implemented' }
                },
                y: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    title: { display: true, text: 'Maintainability Index' }
                }
            }
        }
    });

    // 33. Activity vs Quality (scatter) — condition-internal data (aligned)
    createChart('chartActivityVsQuality', {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Control',
                    data: ctrl.activityChars.map((a, i) => ({ x: a, y: ctrl.qualityMI[i] })),
                    backgroundColor: COLORS.control,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Autocomplete',
                    data: auto.activityChars.map((a, i) => ({ x: a, y: auto.qualityMI[i] })),
                    backgroundColor: COLORS.auto,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Conversational',
                    data: conv.activityChars.map((a, i) => ({ x: a, y: conv.qualityMI[i] })),
                    backgroundColor: COLORS.conv,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
            subtitle: {
                display: true,
                text: "Higher activity does not correlate with lower quality",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
                legend: { position: 'bottom' },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: Activity=${ctx.raw.x.toLocaleString()}, MI=${ctx.raw.y.toFixed(1)}`
                    }
                },
                subtitle: {
                    display: true,
                    text: `r(ctrl)=${correlationPearson(ctrl.activityChars, ctrl.qualityMI).toFixed(2)}, r(auto)=${correlationPearson(auto.activityChars, auto.qualityMI).toFixed(2)}, r(conv)=${correlationPearson(conv.activityChars, conv.qualityMI).toFixed(2)}`,
                    font: { size: 11, style: 'italic' },
                    color: '#64748b',
                    padding: { bottom: 8 }
                }
            },
            scales: {
                x: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    title: { display: true, text: 'Character Output (Activity)' }
                },
                y: {
                    grid: { color: SCALE_GRID_COLOR },
                    border: { color: SCALE_BORDER_COLOR },
                    title: { display: true, text: 'Maintainability Index' }
                }
            }
        }
    });

    // 34. Perceived vs Actual Speed — FIX #7: use per-condition aggregate bars instead of misaligned scatter
    // Show mean perceived speed vs mean actual speed side by side per condition
    createChart('chartPerceivedVsActual', {
        type: 'bar',
        data: {
            labels: CONDITION_LABELS,
            datasets: [
                {
                    label: 'Perceived Speed (0-100, scaled)',
                    data: [
                        mean(DATA.surveyRatings.control.speed),
                        mean(DATA.surveyRatings.autocomplete.speed),
                        mean(DATA.surveyRatings.conversational.speed)
                    ].map(v => +v.toFixed(1)),
                    backgroundColor: [
                        'rgba(245, 158, 11, 0.15)',
                        'rgba(14, 165, 167, 0.15)',
                        'rgba(225, 29, 72, 0.15)'
                    ],
                    borderColor: CONDITION_COLORS_BORDER,
                    borderWidth: 2,
                    borderDash: [5, 3]
                },
                {
                    label: 'Actual Speed (requirements × 10)',
                    data: [
                        mean(ctrl.speedReq) * 10,
                        mean(auto.speedReq) * 10,
                        mean(conv.speedReq) * 10
                    ].map(v => +v.toFixed(1)),
                    backgroundColor: CONDITION_COLORS_BG,
                    borderColor: CONDITION_COLORS_BORDER,
                    borderWidth: 2
                }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "Strong alignment between perception and reality",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            y: { max: 100, title: { display: true, text: 'Score (0-100 scale)' } },
            subtitle: {
                display: true,
                text: 'Actual speed normalized to 0-100 scale for comparison',
                font: { size: 11, style: 'italic' },
                color: '#94a3b8',
                padding: { bottom: 8 }
            },
            tooltipCallbacks: {
                label: ctx => `${ctx.dataset.label}: ${ctx.raw}`
            }
        })
    });

    // 35. Correlation Heatmap — FIX #3: custom plugin draws colored rectangles
    const heatmapVars = ['Speed', 'Quality', 'MI', 'Activity', 'AI Comm.', 'Perc. Speed', 'Perc. Quality'];
    const allSpeedVals = [...ctrl.speedReq, ...auto.speedReq, ...conv.speedReq];
    const allQualVals = [...ctrl.qualityCorrect, ...auto.qualityCorrect, ...conv.qualityCorrect];
    const allMIVals = [...ctrl.qualityMI, ...auto.qualityMI, ...conv.qualityMI];
    const allActVals = [...ctrl.activityChars, ...auto.activityChars, ...conv.activityChars];
    const allAIVals = [...ctrl.aiChars, ...auto.aiChars, ...conv.aiChars];
    const allPSpeed = [...DATA.surveyRatings.control.speed, ...DATA.surveyRatings.autocomplete.speed, ...DATA.surveyRatings.conversational.speed];
    const allPQual = [...DATA.surveyRatings.control.quality, ...DATA.surveyRatings.autocomplete.quality, ...DATA.surveyRatings.conversational.quality];

    const heatmapDataArrays = [allSpeedVals, allQualVals, allMIVals, allActVals, allAIVals, allPSpeed, allPQual];
    const n = heatmapVars.length;

    const corrMatrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(+correlationPearson(heatmapDataArrays[i], heatmapDataArrays[j]).toFixed(3));
        }
        corrMatrix.push(row);
    }

    createChart('chartHeatmap', {
        type: 'scatter',
        data: {
            datasets: [{
                // Invisible dataset just to establish the chart area
                data: [],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutQuart' },
            plugins: {
            subtitle: {
                display: true,
                text: "Speed and activity strongly correlated (r = 0.72)",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title: () => '',
                        label: (ctx) => {
                            // custom tooltip based on position
                            const chart = ctx.chart;
                            const { x: mouseX, y: mouseY } = ctx.element;
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: -0.5,
                    max: n - 0.5,
                    grid: { display: false },
                    border: { color: SCALE_BORDER_COLOR },
                    ticks: {
                        callback: v => heatmapVars[Math.round(v)] || '',
                        stepSize: 1,
                        maxRotation: 45,
                        font: { size: 10 }
                    }
                },
                y: {
                    type: 'linear',
                    min: -0.5,
                    max: n - 0.5,
                    grid: { display: false },
                    border: { color: SCALE_BORDER_COLOR },
                    ticks: {
                        callback: v => heatmapVars[Math.round(v)] || '',
                        stepSize: 1,
                        font: { size: 10 }
                    },
                    reverse: false
                }
            }
        },
        _heatmapMeta: {
            matrix: corrMatrix,
            labels: heatmapVars,
            minVal: -1,
            maxVal: 1
        }
    });


    // ════════════════════════════════════════
    // §8  QUALITATIVE ANALYSIS (2 charts)
    // ════════════════════════════════════════

    // 36. Positive Themes
    createChart('chartPositiveThemes', {
        type: 'bar',
        data: {
            labels: ['Speed/Productivity', 'Learning Aid', 'Workflow Integration', 'Code Suggestions', 'No Googling Needed', 'Debugging Help'],
            datasets: [
                { label: 'Control', data: [2, 0, 1, 1, 0, 1], backgroundColor: COLORS.controlBg, borderColor: COLORS.control, borderWidth: 1.5 },
                { label: 'Autocomplete', data: [14, 3, 8, 16, 5, 2], backgroundColor: COLORS.autoBg, borderColor: COLORS.auto, borderWidth: 1.5 },
                { label: 'Conversational', data: [12, 8, 4, 6, 7, 4], backgroundColor: COLORS.convBg, borderColor: COLORS.conv, borderWidth: 1.5 }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "'Faster coding' and 'useful suggestions' dominate feedback",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            extra: { indexAxis: 'y' },
            x: { beginAtZero: true, title: { display: true, text: 'Mention Count' } },
            y: {}
        })
    });

    // 37. Negative Themes
    createChart('chartNegativeThemes', {
        type: 'bar',
        data: {
            labels: ['Too Verbose', 'Wrong Suggestions', 'Slow Response', 'Loss of Understanding', 'Copy-Paste Workflow', 'No Support'],
            datasets: [
                { label: 'Control', data: [0, 0, 0, 0, 0, 8], backgroundColor: COLORS.controlBg, borderColor: COLORS.control, borderWidth: 1.5 },
                { label: 'Autocomplete', data: [0, 5, 1, 4, 0, 0], backgroundColor: COLORS.autoBg, borderColor: COLORS.auto, borderWidth: 1.5 },
                { label: 'Conversational', data: [8, 3, 2, 3, 5, 0], backgroundColor: COLORS.convBg, borderColor: COLORS.conv, borderWidth: 1.5 }
            ]
        },
        options: baseBarOptions({
            subtitle: {
                display: true,
                text: "'Incorrect suggestions' and 'distraction' are top concerns",
                font: { size: 11, style: 'italic', weight: '400' },
                color: '#94a3b8',
                padding: { bottom: 8, top: 0 }
            },
            legend: { position: 'bottom' },
            extra: { indexAxis: 'y' },
            x: { beginAtZero: true, title: { display: true, text: 'Mention Count' } },
            y: {}
        })
    });


    // ════════════════════════════════════════
    // §9  OVERALL RADAR (1 chart)
    // ════════════════════════════════════════

    // 38. Overall Summary Radar — FIX #1: visible grid on light background
    const normalize = (val, min, max) => ((val - min) / (max - min)) * 100;

    createChart('chartOverallRadar', {
        type: 'radar',
        data: {
            labels: ['Speed', 'Quality (Correct)', 'Maintainability', 'Activity', 'UX Satisfaction', 'IDE Support', 'IDE Understanding'],
            datasets: [
                {
                    label: 'Control',
                    data: [
                        normalize(mean(ctrl.speedReq), 0, 10),
                        normalize(mean(ctrl.qualityCorrect), 0, 10),
                        normalize(mean(ctrl.qualityMI), 60, 90),
                        normalize(mean(ctrl.activityChars), 0, 1500),
                        normalize(ctrlSatMean, 0, 100),
                        normalize(mean(DATA.surveyRatings.control.ideSupport), 0, 100),
                        normalize(mean(DATA.surveyRatings.control.ideUnderstanding), 0, 100)
                    ].map(v => Math.min(+v.toFixed(1), 100)),
                    borderColor: COLORS.control,
                    backgroundColor: COLORS.controlBg,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.control
                },
                {
                    label: 'Autocomplete',
                    data: [
                        normalize(mean(auto.speedReq), 0, 10),
                        normalize(mean(auto.qualityCorrect), 0, 10),
                        normalize(mean(auto.qualityMI), 60, 90),
                        normalize(mean(auto.activityChars), 0, 1500),
                        normalize(autoSatMean, 0, 100),
                        normalize(mean(DATA.surveyRatings.autocomplete.ideSupport), 0, 100),
                        normalize(mean(DATA.surveyRatings.autocomplete.ideUnderstanding), 0, 100)
                    ].map(v => Math.min(+v.toFixed(1), 100)),
                    borderColor: COLORS.auto,
                    backgroundColor: COLORS.autoBg,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.auto
                },
                {
                    label: 'Conversational',
                    data: [
                        normalize(mean(conv.speedReq), 0, 10),
                        normalize(mean(conv.qualityCorrect), 0, 10),
                        normalize(mean(conv.qualityMI), 60, 90),
                        normalize(mean(conv.activityChars), 0, 1500),
                        normalize(convSatMean, 0, 100),
                        normalize(mean(DATA.surveyRatings.conversational.ideSupport), 0, 100),
                        normalize(mean(DATA.surveyRatings.conversational.ideUnderstanding), 0, 100)
                    ].map(v => Math.min(+v.toFixed(1), 100)),
                    borderColor: COLORS.conv,
                    backgroundColor: COLORS.convBg,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: COLORS.conv
                }
            ]
        },
        options: radarOptions(100, 20, 'Normalized 0-100 scale', "Autocomplete dominates overall; control trails in speed")
    });

    console.log('[charts] All 38 charts initialized successfully.');
}


// ════════════════════════════════════════════════════════════════
// DOWNLOAD FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Download a chart's data as a CSV file.
 * @param {string} chartId - The canvas element ID
 */
function downloadChartAsCSV(chartId) {
    const chart = chartInstances[chartId];
    if (!chart) {
        console.warn(`[download] Chart not found: ${chartId}`);
        return;
    }

    const rows = [];
    const labels = chart.data.labels || [];
    const datasets = chart.data.datasets || [];

    // Header row
    const header = ['Label'];
    datasets.forEach(ds => header.push(ds.label || 'Data'));
    rows.push(header.join(','));

    // Data rows
    if (labels.length > 0) {
        labels.forEach((label, i) => {
            const row = [String(label).replace(/,/g, ';')];
            datasets.forEach(ds => {
                const val = ds.data[i];
                if (val === null || val === undefined) {
                    row.push('');
                } else if (typeof val === 'object') {
                    // Scatter/bubble data: {x, y} or [q1, q3]
                    if (Array.isArray(val)) {
                        row.push(val.join(';'));
                    } else {
                        row.push(`${val.x};${val.y}`);
                    }
                } else {
                    row.push(val);
                }
            });
            rows.push(row.join(','));
        });
    } else {
        // Scatter charts without labels
        const maxLen = Math.max(...datasets.map(ds => (ds.data || []).length));
        for (let i = 0; i < maxLen; i++) {
            const row = [i];
            datasets.forEach(ds => {
                const val = (ds.data || [])[i];
                if (val && typeof val === 'object') {
                    row.push(`${val.x};${val.y}`);
                } else {
                    row.push(val !== undefined ? val : '');
                }
            });
            rows.push(row.join(','));
        }
    }

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartId}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Download a chart as a PNG image.
 * @param {string} chartId - The canvas element ID
 */
function downloadChartAsImage(chartId) {
    const chart = chartInstances[chartId];
    if (!chart) {
        console.warn(`[download] Chart not found: ${chartId}`);
        return;
    }

    const url = chart.toBase64Image('image/png', 1.0);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Expose globally (no modules)
window.initCharts = initCharts;
window.downloadChartAsCSV = downloadChartAsCSV;
window.downloadChartAsImage = downloadChartAsImage;
window.chartInstances = chartInstances;
