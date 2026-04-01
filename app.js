// ==========================================
// DATA MODEL
// ==========================================
let equipment = {
    microphones:[
        {name: 'AKG 414-1', status: 'available', category: 'LDC'},
        {name: 'AKG 414-2', status: 'available', category: 'LDC'},
        {name: 'SM57-1', status: 'available', category: 'Dynamic'},
        {name: 'SM57-2', status: 'available', category: 'Dynamic'},
        {name: 'R88-L', status: 'available', category: 'Ribbon'},
        {name: 'U87', status: 'available', category: 'LDC'}
    ],
    preampUnits:[
        {
            name: 'Apollo 8', status: 'available',
            channels:[{name: 'Apollo 8 Ch 1', status: 'available'}, {name: 'Apollo 8 Ch 2', status: 'available'}, {name: 'Apollo 8 Ch 3', status: 'available'}, {name: 'Apollo 8 Ch 4', status: 'available'}]
        },
        {
            name: 'Neve 1073', status: 'available',
            channels:[{name: 'Neve 1073 Ch 1', status: 'available'}, {name: 'Neve 1073 Ch 2', status: 'available'}]
        }
    ],
    outboard:[
        {name: '1176 1', status: 'available', category: 'Compressor'},
        {name: '1176 2', status: 'available', category: 'Compressor'},
        {name: 'Pultec EQ', status: 'available', category: 'EQ'}
    ],
    adUnits:[
        {
            name: 'Apollo 8', status: 'available',
            channels:[{name: 'Apollo 8 AD 1', status: 'available'}, {name: 'Apollo 8 AD 2', status: 'available'}, {name: 'Apollo 8 AD 3', status: 'available'}, {name: 'Apollo 8 AD 4', status: 'available'}]
        }
    ],
    tieLines: [
        {
            name: 'Live Room Box',
            status: 'available',
            channels: Array.from({length: 16}, (_, i) => ({ name: 'Line ' + (i + 1), status: 'available' }))
        }
    ],
    hardNormals: []
};

let sessionData = [];
let presets =[];
let customTemplates =[];
window.manualRowColors = {};
window.selectedManualRowColor = '';
window.previewAutoColourGroups = null;
window.sessionMeta = {
    artist: '',
    project: '',
    engineer: '',
    date: new Date().toISOString().split('T')[0]
};
const PREFERENCES_STORAGE_KEY = 'studioApp_preferences';
const DEFAULT_SOURCE_SUGGESTIONS = [
    'Kick In', 'Kick Out', 'Snare Top', 'Snare Bottom', 'Hi-Hat',
    'Tom 1', 'Tom 2', 'Floor Tom', 'Overhead L', 'Overhead R',
    'Room L', 'Room R', 'Bass DI', 'Bass Amp', 'Guitar DI', 'Guitar Amp',
    'Acoustic Guitar', 'Lead Vocal', 'Backing Vocal', 'Piano L', 'Piano R',
    'Synth L', 'Synth R', 'Talkback'
];
const DEFAULT_AUTO_COLOUR_GROUPS = [
    { id: 'drums', name: 'Drums', colour: 'rgba(156, 39, 176, 0.15)', keywords: ['kick', 'snare', 'snr', 'tom', 'hat', 'hh', 'cymbal', 'crash', 'ride', 'crotch', 'overhead', 'oh l', 'oh r', 'drum'], enabled: true },
    { id: 'bass', name: 'Bass', colour: 'rgba(244, 67, 54, 0.15)', keywords: ['bass'], enabled: true },
    { id: 'guitars', name: 'Guitars', colour: 'rgba(76, 175, 80, 0.15)', keywords: ['guitar', 'gtr', 'acoustic', 'acc '], enabled: true },
    { id: 'keys', name: 'Keys', colour: 'rgba(255, 193, 7, 0.15)', keywords: ['piano', 'pno', 'synth', 'keys', 'organ', 'rhodes'], enabled: true },
    { id: 'vocals', name: 'Vocals', colour: 'rgba(233, 30, 99, 0.15)', keywords: ['vocal', 'voc', 'vox', 'choir'], enabled: true },
    { id: 'percussion', name: 'Percussion', colour: 'rgba(186, 104, 200, 0.15)', keywords: ['perc', 'tamb', 'shaker', 'conga', 'bongo', 'timp', 'xyl', 'marimba'], enabled: true },
    { id: 'strings', name: 'Strings', colour: 'rgba(0, 188, 212, 0.15)', keywords: ['string', 'cello', 'violin', 'viola', 'harp'], enabled: true },
    { id: 'horns', name: 'Horns', colour: 'rgba(255, 87, 34, 0.15)', keywords: ['horn', 'sax', 'trumpet', 'trombone', 'brass'], enabled: true }
];
function getDefaultPreferences() {
    return {
        version: 1,
        sourceSuggestions: [...DEFAULT_SOURCE_SUGGESTIONS],
        sourceAutoPair: {
            enabled: true,
            onlyWhenNextRowEmpty: true,
            exactPairs: [
                { from: 'Rack Tom', to: 'Floor Tom', trigger: 'forward', enabled: true },
                { from: 'R Tom', to: 'F Tom', trigger: 'forward', enabled: true },
                { from: 'Acoustic Body', to: 'Acoustic Neck', trigger: 'either', enabled: true },
                { from: 'Acc Body', to: 'Acc Neck', trigger: 'either', enabled: true }
            ],
            suffixPairs: [
                { from: ' L', to: ' R', trigger: 'forward', enabled: true },
                { from: ' M', to: ' S', trigger: 'forward', enabled: true },
                { from: ' Top', to: ' Bottom', trigger: 'forward', enabled: true },
                { from: ' T', to: ' B', trigger: 'forward', enabled: true },
                { from: ' In', to: ' Out', trigger: 'forward', enabled: true },
                { from: ' I', to: ' O', trigger: 'forward', enabled: true },
                { from: ' DI', to: ' Amp', trigger: 'forward', enabled: true },
                { from: ' 1', to: ' 2', trigger: 'forward', enabled: true },
                { from: ' 2', to: ' 3', trigger: 'forward', enabled: true },
                { from: ' 3', to: ' 4', trigger: 'forward', enabled: true }
            ]
        },
        dawNamer: {
            mergeStereo: true,
            useShortNames: false
        },
        pdfExport: {
            printEmptyRows: false
        },
        customTheme: {
            bg: '#0f0f0f',
            panels: '#1a1a1a',
            text: '#eeeeee',
            accent: '#FF9F1C'
        },
        customThemePresets: {
            a: {
                bg: '#0d1115',
                panels: '#161a1f',
                text: '#e8e9ea',
                accent: '#d92525'
            },
            b: {
                bg: '#050505',
                panels: '#141414',
                text: '#f4f4f4',
                accent: '#ffd700'
            }
        },
        autoColour: {
            groups: clonePreferences(DEFAULT_AUTO_COLOUR_GROUPS)
        }
    };
}
function clonePreferences(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function normalizePreferencePairs(items, type = 'exact') {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
        from: `${item?.from || ''}`.trim(),
        to: `${item?.to || ''}`.trim(),
        trigger: item?.trigger === 'either' ? 'either' : 'forward',
        enabled: item?.enabled !== false
    })).filter(item => item.from && item.to);
}
function normalizeAutoColourGroups(items) {
    if (!Array.isArray(items)) return clonePreferences(DEFAULT_AUTO_COLOUR_GROUPS);
    const out = items.map((group, idx) => ({
        id: `${group?.id || `group-${idx + 1}`}`.trim(),
        name: `${group?.name || `Group ${idx + 1}`}`.trim(),
        colour: `${group?.colour || 'rgba(128, 128, 128, 0.15)'}`.trim(),
        keywords: (Array.isArray(group?.keywords) ? group.keywords : `${group?.keywords || ''}`.split(','))
            .map(v => `${v || ''}`.trim())
            .filter(Boolean),
        enabled: group?.enabled !== false
    })).filter(group => group.name && group.colour && group.keywords.length > 0);
    const drumDefaults = ['kick', 'snare', 'snr', 'tom', 'hat', 'hh', 'cymbal', 'crash', 'ride', 'crotch', 'overhead', 'oh l', 'oh r', 'drum'];
    const drumGroup = out.find(group => {
        const id = `${group.id || ''}`.toLowerCase();
        const name = `${group.name || ''}`.toLowerCase();
        return id === 'drums' || name === 'drums';
    });
    if (drumGroup) {
        const existing = new Set(drumGroup.keywords.map(k => `${k || ''}`.trim().toLowerCase()).filter(Boolean));
        drumDefaults.forEach(keyword => {
            if (!existing.has(keyword)) drumGroup.keywords.push(keyword);
        });
    }
    return out.length ? out : clonePreferences(DEFAULT_AUTO_COLOUR_GROUPS);
}
function normalizePreferences(input) {
    const base = getDefaultPreferences();
    if (!input || typeof input !== 'object') return base;
    const merged = clonePreferences(base);
    merged.version = Number.isFinite(input.version) ? input.version : 1;
    const suggestions = Array.isArray(input.sourceSuggestions) ? input.sourceSuggestions : merged.sourceSuggestions;
    merged.sourceSuggestions = suggestions.map(v => `${v || ''}`.trim()).filter(Boolean);
    if (!merged.sourceSuggestions.length) merged.sourceSuggestions = [...DEFAULT_SOURCE_SUGGESTIONS];
    const sap = input.sourceAutoPair || {};
    merged.sourceAutoPair.enabled = sap.enabled !== false;
    merged.sourceAutoPair.onlyWhenNextRowEmpty = sap.onlyWhenNextRowEmpty !== false;
    merged.sourceAutoPair.exactPairs = normalizePreferencePairs(sap.exactPairs, 'exact');
    merged.sourceAutoPair.suffixPairs = normalizePreferencePairs(sap.suffixPairs, 'suffix');
    const daw = input.dawNamer || {};
    merged.dawNamer = {
        mergeStereo: daw.mergeStereo !== false,
        useShortNames: daw.useShortNames === true
    };
    const pdf = input.pdfExport || {};
    merged.pdfExport = {
        printEmptyRows: pdf.printEmptyRows === true
    };
    const customTheme = input.customTheme || {};
    merged.customTheme = {
        bg: normalizeHexColor(customTheme.bg, base.customTheme.bg),
        panels: normalizeHexColor(customTheme.panels, base.customTheme.panels),
        text: normalizeHexColor(customTheme.text, base.customTheme.text),
        accent: normalizeHexColor(customTheme.accent, base.customTheme.accent)
    };
    const presets = input.customThemePresets || {};
    merged.customThemePresets = {
        a: normalizeCustomThemePalette(presets.a, base.customThemePresets.a),
        b: normalizeCustomThemePalette(presets.b, base.customThemePresets.b)
    };
    merged.autoColour.groups = normalizeAutoColourGroups(input.autoColour?.groups);
    return merged;
}
function normalizeHexColor(value, fallback) {
    const raw = `${value || ''}`.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
    return fallback;
}
function normalizeCustomThemePalette(palette, fallback) {
    const safeFallback = fallback || {
        bg: '#0f0f0f',
        panels: '#1a1a1a',
        text: '#eeeeee',
        accent: '#FF9F1C'
    };
    return {
        bg: normalizeHexColor(palette?.bg, safeFallback.bg),
        panels: normalizeHexColor(palette?.panels, safeFallback.panels),
        text: normalizeHexColor(palette?.text, safeFallback.text),
        accent: normalizeHexColor(palette?.accent, safeFallback.accent)
    };
}
function getCustomThemeFromInputs() {
    const prefs = normalizePreferences(window.preferences);
    const custom = prefs.customTheme || {};
    const bgInput = document.getElementById('customBg');
    const panelsInput = document.getElementById('customPanels');
    const textInput = document.getElementById('customText');
    const accentInput = document.getElementById('customAccent');
    const bgHexInput = document.getElementById('customBgHex');
    const panelsHexInput = document.getElementById('customPanelsHex');
    const textHexInput = document.getElementById('customTextHex');
    const accentHexInput = document.getElementById('customAccentHex');
    return {
        bg: normalizeHexColor(bgHexInput?.value, normalizeHexColor(bgInput?.value, custom.bg || '#0f0f0f')),
        panels: normalizeHexColor(panelsHexInput?.value, normalizeHexColor(panelsInput?.value, custom.panels || '#1a1a1a')),
        text: normalizeHexColor(textHexInput?.value, normalizeHexColor(textInput?.value, custom.text || '#eeeeee')),
        accent: normalizeHexColor(accentHexInput?.value, normalizeHexColor(accentInput?.value, custom.accent || '#FF9F1C'))
    };
}
function normalizeHardNormals(items) {
    if (!Array.isArray(items)) return [];
    return items
        .map(item => ({
            tieLine: `${item?.tieLine || ''}`.trim(),
            preamp: `${item?.preamp || ''}`.trim(),
            ad: `${item?.ad || ''}`.trim()
        }))
        .filter(item => item.tieLine);
}
function ensureEquipmentDefaults(input) {
    const next = (input && typeof input === 'object') ? input : {};
    if (!Array.isArray(next.microphones)) next.microphones = [];
    if (!Array.isArray(next.preampUnits)) next.preampUnits = [];
    if (!Array.isArray(next.outboard)) next.outboard = [];
    if (!Array.isArray(next.adUnits)) next.adUnits = [];
    if (!Array.isArray(next.tieLines)) next.tieLines = [];
    next.hardNormals = normalizeHardNormals(next.hardNormals);
    return next;
}
window.preferences = normalizePreferences(null);
const TEMPLATE_FIELDS = [
    { key: 'source', label: 'Source', defaultOn: true },
    { key: 'microphone', label: 'Mic', defaultOn: true },
    { key: 'tieLine', label: 'Tie Line', defaultOn: true },
    { key: 'preamp', label: 'Preamp', defaultOn: true },
    { key: 'outboard1', label: 'Out 1', defaultOn: true },
    { key: 'outboard2', label: 'Out 2', defaultOn: true },
    { key: 'outboard3', label: 'Out 3', defaultOn: true },
    { key: 'ad', label: 'A/D', defaultOn: true },
    { key: 'recall', label: 'Recall', defaultOn: true },
    { key: 'notes', label: 'Notes', defaultOn: true }
];
window.undoStack = [];
window.redoStack = [];
window.isApplyingHistory = false;
window.suspendHistory = false;
const MAX_HISTORY = 30;
const ENABLE_CUSTOM_MIC_DROPDOWN = true;
window.isSessionLocked = false;
window.pinnedColumns = {
    tieLine: false,
    preamp: false,
    outboard1: false,
    outboard2: false,
    outboard3: false,
    ad: true
};
window.activeEqModalIndex = null;
window.activeEqModalField = null;
window.eqTypeFilters = [];
window.enableColors = true;
const COLOUR_BRIGHTNESS_DEFAULT = 1;
const COLOUR_OPACITY_DEFAULT = 1;
const COLOUR_BRIGHTNESS_MIN = 0.6;
const COLOUR_BRIGHTNESS_MAX = 1;
const COLOUR_OPACITY_MIN = 0.2;
const COLOUR_OPACITY_MAX = 1;
window.colourBrightness = COLOUR_BRIGHTNESS_DEFAULT;
window.colourOpacity = COLOUR_OPACITY_DEFAULT;
window.clearMode = false;
const CLEAR_MODE_IDLE_MS = 10000;
let clearDragActive = false;
let clearDragStartIndex = null;
let clearDragCurrentIndex = null;
let suppressClearClick = false;
let clearModeHandlersBound = false;
let clearModeIdleTimer = null;

window.refreshAppUI = function(skipSessionTable = false) {
    if (!skipSessionTable) updateSessionTable();
    updateEquipmentTables();
    updateSummary();
    if (typeof updateInventoryCounts === 'function') updateInventoryCounts();
    autoSave();
};

function snapshotState() {
    return {
        equipment: JSON.parse(JSON.stringify(equipment)),
        sessionData: JSON.parse(JSON.stringify(sessionData)),
        customTemplates: JSON.parse(JSON.stringify(customTemplates)),
        manualRowColors: JSON.parse(JSON.stringify(window.manualRowColors || {}))
    };
}

function updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = window.undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = window.redoStack.length === 0;
}

function pushHistory() {
    if (window.isApplyingHistory || window.suspendHistory) return;
    window.undoStack.push(snapshotState());
    if (window.undoStack.length > MAX_HISTORY) window.undoStack.shift();
    window.redoStack = [];
    updateHistoryButtons();
}

function applyHistoryState(state) {
    if (!state) return;
    window.isApplyingHistory = true;
    equipment = JSON.parse(JSON.stringify(state.equipment));
    sessionData = JSON.parse(JSON.stringify(state.sessionData));
    customTemplates = JSON.parse(JSON.stringify(state.customTemplates));
    window.manualRowColors = JSON.parse(JSON.stringify(state.manualRowColors || {}));
    refreshAppUI();
    updateTemplateUI();
    window.isApplyingHistory = false;
    updateHistoryButtons();
}

window.undoAction = function() {
    if (window.undoStack.length === 0) return;
    window.redoStack.push(snapshotState());
    const prev = window.undoStack.pop();
    applyHistoryState(prev);
};

window.redoAction = function() {
    if (window.redoStack.length === 0) return;
    window.undoStack.push(snapshotState());
    const next = window.redoStack.pop();
    applyHistoryState(next);
};

function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}
function ensureManualColourDataset(btn) {
    if (!btn || btn.dataset.colour) return;
    const onclickAttr = btn.getAttribute('onclick') || '';
    const m = onclickAttr.match(/selectManualColor\('([^']*)'/);
    if (m) btn.dataset.colour = m[1];
}
function sanitizeColourSettings() {
    window.colourBrightness = clampNumber(window.colourBrightness, COLOUR_BRIGHTNESS_MIN, COLOUR_BRIGHTNESS_MAX, COLOUR_BRIGHTNESS_DEFAULT);
    window.colourOpacity = clampNumber(window.colourOpacity, COLOUR_OPACITY_MIN, COLOUR_OPACITY_MAX, COLOUR_OPACITY_DEFAULT);
}
function syncColourControlsFromState() {
    sanitizeColourSettings();
    const b = document.getElementById('colourBrightnessRange');
    const o = document.getElementById('colourOpacityRange');
    if (b) b.value = String(Math.round(window.colourBrightness * 100));
    if (o) o.value = String(Math.round(window.colourOpacity * 100));
}
function applyColourAdjustments(rgba, alphaScale = 1) {
    if (!rgba) return '';
    const m = rgba.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
    if (!m) return rgba;
    sanitizeColourSettings();
    const b = window.colourBrightness;
    const o = window.colourOpacity;
    const baseR = parseInt(m[1], 10);
    const baseG = parseInt(m[2], 10);
    const baseB = parseInt(m[3], 10);
    const rgb = {
        r: Math.round(clampNumber(baseR * b, 0, 255, baseR)),
        g: Math.round(clampNumber(baseG * b, 0, 255, baseG)),
        b: Math.round(clampNumber(baseB * b, 0, 255, baseB))
    };
    const baseA = m[4] !== undefined ? parseFloat(m[4]) : 1;
    const a = clampNumber(baseA * o * alphaScale, 0, 1, 1);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

function isRoomLikeSource(source) {
    const s = `${source || ''}`.toLowerCase();
    return !!s && ['room', 'amb', 'far', 'talkback'].some(word => s.includes(word));
}
function getInheritedRoomBaseColor(rowIndex) {
    if (!Number.isInteger(rowIndex) || rowIndex <= 0 || !Array.isArray(sessionData)) return '';
    for (let i = rowIndex - 1; i >= 0; i--) {
        const prevSource = `${sessionData[i]?.source || ''}`.trim();
        if (!prevSource || isRoomLikeSource(prevSource)) continue;
        const inherited = getAutoGroupBaseColor(prevSource);
        if (inherited) return inherited;
    }
    return '';
}
function refreshFollowingRoomRowColors(startIndex) {
    if (!Number.isInteger(startIndex)) return;
    for (let i = startIndex; i < sessionData.length; i++) {
        const rowSource = `${sessionData[i]?.source || ''}`.trim();
        if (!rowSource || !isRoomLikeSource(rowSource)) break;
        const row = document.querySelector(`tr[data-index="${i}"]`);
        if (row) row.style.backgroundColor = window.enableColors ? getRowColor(rowSource, i) : '';
    }
}
function getRowColor(source, rowIndex = null) {
    if (rowIndex !== null && window.manualRowColors && window.manualRowColors[rowIndex] !== undefined) {
        return applyColourAdjustments(window.manualRowColors[rowIndex]);
    }
    if (isRoomLikeSource(source)) {
        const inheritedBase = getInheritedRoomBaseColor(rowIndex);
        if (inheritedBase) return applyColourAdjustments(inheritedBase);
    }
    const base = getAutoGroupBaseColor(source);
    return base ? applyColourAdjustments(base) : '';
}

function getAutoGroupBaseColor(source) {
    if (!source) return '';
    const s = source.toLowerCase();
    const groups = (Array.isArray(window.previewAutoColourGroups) && window.previewAutoColourGroups.length)
        ? window.previewAutoColourGroups
        : (window.preferences?.autoColour?.groups || []);
    let hasEnabledGroup = false;
    for (const group of groups) {
        if (!group || group.enabled === false || !group.colour) continue;
        hasEnabledGroup = true;
        const keys = Array.isArray(group.keywords) ? group.keywords : [];
        if (keys.some(k => `${k || ''}`.trim() && s.includes(`${k}`.toLowerCase()))) {
            return group.colour;
        }
    }
    if (hasEnabledGroup) return '';

    // Safety fallback: if preferences are empty/corrupt, keep legacy colouring working.
    const has = (words) => words.some(w => s.includes(w));
    if (has(['kick', 'snare', 'snr', 'tom', 'hat', 'hh', 'cymbal', 'crash', 'ride', 'crotch', 'overhead', 'oh l', 'oh r', 'drum'])) return 'rgba(156, 39, 176, 0.15)';
    if (has(['bass'])) return 'rgba(244, 67, 54, 0.15)';
    if (has(['guitar', 'gtr', 'acoustic', 'acc '])) return 'rgba(76, 175, 80, 0.15)';
    if (has(['piano', 'pno', 'synth', 'keys', 'organ', 'rhodes'])) return 'rgba(255, 193, 7, 0.15)';
    if (has(['vocal', 'voc', 'vox', 'choir'])) return 'rgba(233, 30, 99, 0.15)';
    if (has(['perc', 'tamb', 'shaker', 'conga', 'bongo', 'timp', 'xyl', 'marimba'])) return 'rgba(186, 104, 200, 0.15)';
    if (has(['string', 'cello', 'violin', 'viola', 'harp'])) return 'rgba(0, 188, 212, 0.15)';
    if (has(['horn', 'sax', 'trumpet', 'trombone', 'brass'])) return 'rgba(255, 87, 34, 0.15)';
    return '';
}
function getAutoGroupMatchInfo(source, groupsOverride = null) {
    const s = `${source || ''}`.toLowerCase().trim();
    if (!s) return null;
    const groups = Array.isArray(groupsOverride)
        ? groupsOverride
        : ((Array.isArray(window.previewAutoColourGroups) && window.previewAutoColourGroups.length)
            ? window.previewAutoColourGroups
            : (window.preferences?.autoColour?.groups || []));
    for (const group of groups) {
        if (!group || group.enabled === false || !group.colour) continue;
        const keys = Array.isArray(group.keywords) ? group.keywords : [];
        for (const key of keys) {
            const keyword = `${key || ''}`.trim();
            if (keyword && s.includes(keyword.toLowerCase())) {
                return { groupName: group.name || 'Group', keyword, colour: group.colour };
            }
        }
    }
    return null;
}
function getInheritedRoomMatchInfo(rowIndex) {
    if (!Number.isInteger(rowIndex) || rowIndex <= 0) return null;
    for (let i = rowIndex - 1; i >= 0; i--) {
        const prevSource = `${sessionData[i]?.source || ''}`.trim();
        if (!prevSource || isRoomLikeSource(prevSource)) continue;
        const match = getAutoGroupMatchInfo(prevSource);
        if (match) return { ...match, inheritedFrom: i + 1 };
    }
    return null;
}
function updateManualColourMatchInfo() {
    const el = document.getElementById('manualColorMatchInfo');
    const select = document.getElementById('manualColorChannel');
    if (!el || !select) return;
    const idx = parseInt(select.value, 10);
    if (!Number.isInteger(idx) || idx < 0 || idx >= sessionData.length) {
        el.textContent = 'Matched by: None';
        return;
    }
    if (window.manualRowColors && window.manualRowColors[idx]) {
        el.textContent = 'Matched by: Manual override';
        return;
    }
    const source = `${sessionData[idx]?.source || ''}`.trim();
    if (!source) {
        el.textContent = 'Matched by: None (no source)';
        return;
    }
    if (isRoomLikeSource(source)) {
        const roomMatch = getInheritedRoomMatchInfo(idx);
        if (roomMatch) {
            el.textContent = `Matched by: Room inherits ${roomMatch.groupName} (${roomMatch.keyword})`;
            return;
        }
    }
    const match = getAutoGroupMatchInfo(source);
    if (match) {
        el.textContent = `Matched by: ${match.groupName} (${match.keyword})`;
    } else {
        el.textContent = 'Matched by: None';
    }
}

window.toggleSessionLock = function() {
    window.isSessionLocked = !window.isSessionLocked;
    const btn = document.getElementById('sessionLockBtn');
    if (window.isSessionLocked) {
        btn.innerHTML = '⊘ Safe Mode: ON';
        btn.style.background = 'var(--text-primary)';
        btn.style.color = 'var(--bg-primary)';
        btn.style.borderColor = 'var(--text-primary)';
    } else {
        btn.innerHTML = '⊘ Safe Mode: Off';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-secondary)';
        btn.style.borderColor = 'var(--border-secondary)';
    }
    updateSessionTable(); 
};
window.toggleColors = function() {
    window.enableColors = !window.enableColors;
    updateColourToggleButtons();
    updateSessionTable(); // Redraw to apply/remove colors
};
function updateColourToggleButtons() {
    const btn = document.getElementById('colourPanelToggleBtn');
    if (!btn) return;
    btn.textContent = window.enableColors ? 'Colours: On' : 'Colours: Off';
    btn.style.opacity = window.enableColors ? '1' : '0.5';
    btn.style.color = window.enableColors ? 'var(--accent-primary)' : 'var(--text-secondary)';
    btn.style.borderColor = window.enableColors ? 'var(--accent-primary)' : 'var(--border-primary)';
}
function ensureSwatchPreviewVisible(rgba, minAlpha = 0.2) {
    const m = `${rgba || ''}`.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)$/i);
    if (!m) return rgba;
    const a = Math.max(minAlpha, parseFloat(m[4]));
    return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`;
}
function refreshManualColourSwatches() {
    const grid = document.getElementById('manualColorGrid');
    if (!grid) return;
    grid.querySelectorAll('.manual-color-btn').forEach(btn => {
        const styleAttr = btn.getAttribute('style') || '';
        const isAuto = styleAttr.includes('linear-gradient');
        if (isAuto) {
            btn.style.background = 'linear-gradient(45deg, var(--bg-secondary), var(--bg-tertiary))';
            return;
        }
        ensureManualColourDataset(btn);
        if (btn.dataset.colour) {
            const adjusted = applyColourAdjustments(btn.dataset.colour, 1.6);
            btn.style.background = ensureSwatchPreviewVisible(adjusted, 0.2);
        }
    });
}
function rgbaToRgbKey(rgba) {
    const m = `${rgba || ''}`.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}
function syncManualColourSelectionToChannel() {
    const select = document.getElementById('manualColorChannel');
    const grid = document.getElementById('manualColorGrid');
    if (!select || !grid) return;
    const idx = parseInt(select.value);
    const autoBtn = Array.from(grid.querySelectorAll('.manual-color-btn'))
        .find(btn => btn.dataset.auto === '1' || (btn.getAttribute('onclick') || '').includes("selectManualColor('',"));
    const manualBase = Number.isInteger(idx) ? window.manualRowColors[idx] : '';
    const autoBase = Number.isInteger(idx) && sessionData[idx] ? getAutoGroupBaseColor(sessionData[idx].source) : '';
    const targetKey = rgbaToRgbKey(manualBase || autoBase);

    let matchedBtn = null;
    grid.querySelectorAll('.manual-color-btn').forEach(btn => {
        ensureManualColourDataset(btn);
        if (targetKey && rgbaToRgbKey(btn.dataset.colour || '') === targetKey) matchedBtn = btn;
    });

    grid.querySelectorAll('.manual-color-btn').forEach(btn => btn.classList.remove('active'));
    const finalBtn = matchedBtn || autoBtn;
    if (finalBtn) finalBtn.classList.add('active');
    window.selectedManualRowColor = matchedBtn ? (matchedBtn.dataset.colour || '') : '';
    updateManualColourMatchInfo();
}
function updateColourControls(persist = true) {
    const b = document.getElementById('colourBrightnessRange');
    const o = document.getElementById('colourOpacityRange');
    const bPct = parseInt(b?.value || String(COLOUR_BRIGHTNESS_DEFAULT * 100), 10);
    const oPct = parseInt(o?.value || String(COLOUR_OPACITY_DEFAULT * 100), 10);
    window.colourBrightness = clampNumber(bPct / 100, COLOUR_BRIGHTNESS_MIN, COLOUR_BRIGHTNESS_MAX, COLOUR_BRIGHTNESS_DEFAULT);
    window.colourOpacity = clampNumber(oPct / 100, COLOUR_OPACITY_MIN, COLOUR_OPACITY_MAX, COLOUR_OPACITY_DEFAULT);
    refreshManualColourSwatches();
    syncManualColourSelectionToChannel();
    updateSessionTable();
    if (persist) autoSave();
}
function resetColourControls() {
    const b = document.getElementById('colourBrightnessRange');
    const o = document.getElementById('colourOpacityRange');
    if (b) b.value = String(COLOUR_BRIGHTNESS_DEFAULT * 100);
    if (o) o.value = String(COLOUR_OPACITY_DEFAULT * 100);
    updateColourControls();
}
function updateClearModeButton() {
    const btn = document.getElementById('clearModeBtn');
    if (!btn) return;
    btn.textContent = window.clearMode ? '✕ Clear Mode: On' : '✕ Clear Mode: Off';
    btn.style.color = window.clearMode ? 'var(--accent-primary)' : 'var(--text-primary)';
    btn.style.borderColor = window.clearMode ? 'var(--accent-primary)' : 'var(--border-primary)';
    btn.style.background = window.clearMode ? 'var(--button-bg)' : 'transparent';
    btn.classList.toggle('clear-mode-active', window.clearMode);
    const table = document.getElementById('sessionTable');
    if (table) table.classList.toggle('clear-mode-enabled', !!window.clearMode);
}
function clearClearModeIdleTimer() {
    if (!clearModeIdleTimer) return;
    clearTimeout(clearModeIdleTimer);
    clearModeIdleTimer = null;
}
function armClearModeIdleTimer() {
    clearClearModeIdleTimer();
    if (!window.clearMode) return;
    clearModeIdleTimer = setTimeout(() => {
        if (!window.clearMode) return;
        window.clearMode = false;
        updateClearModeButton();
        clearAllRangePreview();
    }, CLEAR_MODE_IDLE_MS);
}
function touchClearModeActivity() {
    if (!window.clearMode) return;
    armClearModeIdleTimer();
}
function exitClearModeForEditing() {
    if (!window.clearMode) return;
    window.clearMode = false;
    clearClearModeIdleTimer();
    updateClearModeButton();
    clearAllRangePreview();
}
window.toggleClearMode = function() {
    if (window.isSessionLocked) return;
    window.clearMode = !window.clearMode;
    updateClearModeButton();
    if (window.clearMode) armClearModeIdleTimer();
    else {
        clearClearModeIdleTimer();
        clearAllRangePreview();
    }
};
window.updateMetadata = function() {
    const artistEl = document.getElementById('metaArtist');
    const projectEl = document.getElementById('metaProject');
    const engineerEl = document.getElementById('metaEngineer');
    const dateEl = document.getElementById('metaDate');
    window.sessionMeta.artist = artistEl ? artistEl.value : '';
    window.sessionMeta.project = projectEl ? projectEl.value : '';
    window.sessionMeta.engineer = engineerEl ? engineerEl.value : '';
    window.sessionMeta.date = dateEl ? dateEl.value : '';
    autoSave();
};
window.loadMetadataUI = function() {
    const artistEl = document.getElementById('metaArtist');
    const projectEl = document.getElementById('metaProject');
    const engineerEl = document.getElementById('metaEngineer');
    const dateEl = document.getElementById('metaDate');
    const fallbackDate = new Date().toISOString().split('T')[0];
    if (artistEl) artistEl.value = window.sessionMeta.artist || '';
    if (projectEl) projectEl.value = window.sessionMeta.project || '';
    if (engineerEl) engineerEl.value = window.sessionMeta.engineer || '';
    if (dateEl) dateEl.value = window.sessionMeta.date || fallbackDate;
};

function autoSave() {
    const data = JSON.stringify({
        equipment,
        sessionData,
        pinnedColumns: window.pinnedColumns || {},
        customTemplates,
        manualRowColors: window.manualRowColors || {},
        sessionMeta: window.sessionMeta || {},
        colourSettings: {
            enabled: window.enableColors,
            brightness: window.colourBrightness,
            opacity: window.colourOpacity
        },
        preferences: normalizePreferences(window.preferences)
    });
    localStorage.setItem('studioApp_data', data);
}

function initializeSession(channelCount = 24) {
    sessionData =[];
    for (let i = 1; i <= channelCount; i++) {
        sessionData.push({ channel: i, source: '', microphone: '', tieLine: '', preamp: '', outboard1: '', outboard2: '', outboard3: '', ad: '', recall: '', notes: '' });
    }
}
function sortAllEquipment() {
    const sortFn = (a, b) => {
        const catA = (a.category || '').toLowerCase();
        const catB = (b.category || '').toLowerCase();
        if (catA !== catB) return catA.localeCompare(catB);
        
        const makeA = (a.make || '').toLowerCase();
        const makeB = (b.make || '').toLowerCase();
        if (makeA !== makeB) return makeA.localeCompare(makeB);
        
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    };

    if (equipment.microphones) equipment.microphones.sort(sortFn);
    if (equipment.outboard) equipment.outboard.sort(sortFn);
    if (equipment.preampUnits) equipment.preampUnits.sort(sortFn);
    if (equipment.adUnits) equipment.adUnits.sort(sortFn);
    if (equipment.tieLines) equipment.tieLines.sort(sortFn);
}

// ==========================================
// CORE RENDER & DROPDOWN LOGIC (BUG FIXES)
// ==========================================
function updateSessionTable() {
    const tbody = document.getElementById('sessionBody');
    recomputeMicrophoneUsageFromSession();
    tbody.innerHTML = '';
    
    sessionData.forEach((session, index) => {
        const row = document.createElement('tr');
        row.draggable = false; 
        row.dataset.index = index;
        const rowColor = window.enableColors ? getRowColor(session.source, index) : '';
        row.style.backgroundColor = rowColor;
        
        // Note the "data-label" attributes! These trigger the mobile layout headers.
        row.innerHTML = `
            <td class="col-channel" data-label="Channel">
                <div class="row-hover-zone row-hover-zone-delete no-print"></div>
                <div class="row-hover-zone row-hover-zone-insert no-print"></div>
                <button class="row-action-btn row-action-btn-delete no-print" onclick="deleteSessionRow(${index})" title="Delete this row" aria-label="Delete row">-</button>
                <button class="row-action-btn row-action-btn-insert no-print" onclick="insertSessionRow(${index})" title="Insert row below" aria-label="Insert row below">+</button>
                <button class="channel-reorder-handle no-print" type="button" title="Drag to reorder" draggable="true" data-index="${index}" tabindex="0">⋮⋮</button>
                <div class="channel-number" data-channel="${session.channel}" data-index="${index}">${session.channel}</div>
                <div class="mobile-reorder-btns">
                    <button class="mobile-reorder-btn" onclick="reorderSessionRows(${index}, ${index - 1})" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''}>↑</button>
                    <button class="mobile-reorder-btn" onclick="reorderSessionRows(${index}, ${index + 1})" ${index === sessionData.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>↓</button>
                </div>
            </td>
            <td class="col-source" data-label="Source"><input type="text" list="sourceSuggestions" value="${session.source}" onchange="updateSessionData(${index}, 'source', this.value)"></td>
            <td class="col-microphone" data-autofill="microphone" data-label="Microphone">${createSelectHtml(index, 'microphone')}</td>
            <td class="col-tieLine" data-autofill="tieLine" data-label="Tie Line">${createSelectHtml(index, 'tieLine')}</td>
            <td class="col-preamp" data-autofill="preamp" data-label="Pre Amp">${createSelectHtml(index, 'preamp')}</td>
            <td class="col-outboard1 hidden" data-autofill="outboard1" data-label="Outboard 1">${createSelectHtml(index, 'outboard1')}</td>
            <td class="col-outboard2 hidden" data-autofill="outboard2" data-label="Outboard 2">${createSelectHtml(index, 'outboard2')}</td>
            <td class="col-outboard3 hidden" data-autofill="outboard3" data-label="Outboard 3">${createSelectHtml(index, 'outboard3')}</td>
            <td class="col-ad" data-autofill="ad" data-label="A/D Converter">${createSelectHtml(index, 'ad')}</td>
            <td class="col-recall" data-label="Recall Notes"><input type="text" value="${session.recall}" onchange="updateSessionData(${index}, 'recall', this.value)"></td>
            <td class="col-notes" data-label="Notes"><input type="text" value="${session.notes}" onchange="updateSessionData(${index}, 'notes', this.value)"></td>
        `;
        tbody.appendChild(row);
    });
    
    addDragAndDropHandlers();
    addAutoFillHandlers();
    initClearModeHandlers();
    updateSessionSummary();
    Object.keys(window.pinnedColumns || {}).forEach(col => {
        const btn = document.querySelector(`.header-pin-btn[data-col="${col}"]`);
        if (btn) btn.classList.toggle('is-pinned', !!window.pinnedColumns[col]);
    });
    if (window.isSessionLocked) {
        document.getElementById('sessionTable').querySelectorAll('input, select').forEach(el => el.disabled = true);
    }
}

// --- Select Generation Helpers ---
const EQUIPMENT_FIELDS = ['microphone', 'tieLine', 'preamp', 'outboard1', 'outboard2', 'outboard3', 'ad'];
function isEquipmentField(field) {
    return EQUIPMENT_FIELDS.includes(field);
}
function getEqFieldLabel(field) {
    const labels = {
        microphone: 'Microphone',
        tieLine: 'Tie Line',
        preamp: 'Pre Amp',
        outboard1: 'Outboard 1',
        outboard2: 'Outboard 2',
        outboard3: 'Outboard 3',
        ad: 'A/D Converter'
    };
    return labels[field] || field;
}
function createSelectHtml(index, field) {
    if (isEquipmentField(field)) return renderCustomEqDropdown(index, field);
    const isEmpty = !sessionData[index][field];
    return `<select class="session-field-select ${isEmpty ? 'select-empty' : ''}" id="${field}-${index}" onchange="updateSessionData(${index}, '${field}', this.value); updateSelectPlaceholderState(this);">${getOptionsHtml(index, field)}</select>`;
}
function getMicChannelsPerUnit(item) {
    const n = parseInt(item?.channelsPerUnit, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
}
function getMicInUseCount(item) {
    const n = parseInt(item?.inUseCount, 10);
    if (Number.isFinite(n)) return Math.max(0, n);
    return item?.status === 'in-use' ? 1 : 0;
}
function getMicAvailableSlots(item) {
    return Math.max(0, getMicChannelsPerUnit(item) - getMicInUseCount(item));
}
function setMicInUseCount(item, count) {
    if (!item) return;
    item.inUseCount = Math.max(0, count);
    item.status = item.inUseCount > 0 ? 'in-use' : 'available';
}
function recomputeMicrophoneUsageFromSession() {
    if (!Array.isArray(equipment?.microphones)) return;
    equipment.microphones.forEach(item => setMicInUseCount(item, 0));
    sessionData.forEach(row => {
        const micName = `${row?.microphone || ''}`.trim();
        if (!micName) return;
        const matches = equipment.microphones.filter(m => m.name === micName);
        if (!matches.length) return;
        const target = matches.find(m => getMicAvailableSlots(m) > 0) || matches[matches.length - 1];
        setMicInUseCount(target, getMicInUseCount(target) + 1);
    });
}
function getNormalizedEqOptions(index, field) {
    const currentSel = sessionData[index]?.[field] || '';
    const options = [];

    if (field === 'microphone') {
        (equipment.microphones || []).forEach(m => {
            const avail = getMicAvailableSlots(m);
            const isSel = m.name === currentSel;
            if (avail > 0 || isSel) options.push({ value: m.name, displayBase: m.name, groupLabel: m.category || 'Other', filterTag: m.category || 'Other', make: m.make || '', count: isSel ? avail + 1 : avail, isSelected: isSel });
        });
    } else if (field.startsWith('outboard')) {
        const grouped = {};
        (equipment.outboard || []).forEach(o => {
            const isSel = o.name === currentSel;
            if (o.status === 'available' || isSel) {
                if (!grouped[o.name]) grouped[o.name] = { value: o.name, displayBase: o.name, groupLabel: o.category || 'Other', filterTag: o.category || 'Other', make: o.make || '', count: 0, isSelected: false };
                grouped[o.name].count++;
                if (isSel) grouped[o.name].isSelected = true;
            }
        });
        options.push(...Object.values(grouped));
    } else if (['preamp', 'ad', 'tieLine'].includes(field)) {
        const units = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines);
        (units || []).forEach(u => {
            (u.channels || []).forEach(c => {
                const isSel = c.name === currentSel;
                if (c.status === 'available' || isSel) {
                    options.push({ value: c.name, displayBase: c.name, groupLabel: u.name, filterTag: u.name, make: u.make || '', count: 1, isSelected: isSel });
                }
            });
        });
    }
    return options;
}
function getEqFilterTags(index, field) {
    const rawTags = [];
    getNormalizedEqOptions(index, field).forEach(opt => {
        const tag = `${opt.filterTag || opt.groupLabel || 'Other'}`.trim() || 'Other';
        if (!rawTags.includes(tag)) rawTags.push(tag);
    });
    if (field === 'microphone') {
        const preferred = ['LDC', 'SDC', 'Dynamic', 'Ribbon', 'Other'];
        return [...preferred.filter(t => rawTags.includes(t)), ...rawTags.filter(t => !preferred.includes(t))];
    }
    if (field.startsWith('outboard')) {
        const preferred = ['Compressor', 'EQ', 'Delay', 'Saturation', 'DI', 'Other'];
        return [...preferred.filter(t => rawTags.includes(t)), ...rawTags.filter(t => !preferred.includes(t))];
    }
    return rawTags;
}
function getGroupedEqOptions(index, field, query = '', selectedTags = null) {
    const q = `${query || ''}`.trim().toLowerCase();
    const tagSet = Array.isArray(selectedTags) ? new Set(selectedTags.map(v => `${v || ''}`.trim())) : null;
    const merged = {};
    (getNormalizedEqOptions(index, field) || []).forEach(opt => {
        const key = `${opt.groupLabel || ''}::${opt.value || ''}::${opt.make || ''}::${opt.filterTag || ''}`;
        if (!merged[key]) merged[key] = { ...opt, count: Number.isFinite(opt.count) ? opt.count : 1, isSelected: !!opt.isSelected };
        else {
            merged[key].count += Number.isFinite(opt.count) ? opt.count : 1;
            merged[key].isSelected = merged[key].isSelected || !!opt.isSelected;
        }
    });
    const grouped = {};
    Object.values(merged).forEach(opt => {
        const filterTag = `${opt.filterTag || opt.groupLabel || 'Other'}`.trim();
        if (tagSet && !tagSet.has(filterTag)) return;
        const text = `${opt.displayBase || opt.value || ''} ${opt.make || ''} ${filterTag} ${opt.groupLabel || ''}`.toLowerCase();
        if (q && !text.includes(q)) return;
        const grp = `${opt.groupLabel || 'Other'}`.trim() || 'Other';
        if (!grouped[grp]) grouped[grp] = [];
        grouped[grp].push(opt);
    });
    return Object.keys(grouped).map(groupLabel => ({ groupLabel, options: grouped[groupLabel] }));
}
function renderCustomEqOptions(index, field, query = '', selectedTags = null) {
    const groups = getGroupedEqOptions(index, field, query, selectedTags);
    if (!groups.length) return `<div class="eq-no-results">No matching options.</div>`;
    const encodedQuery = encodeURIComponent(query || '');
    const clearRow = `<div class="eq-option-controls"><button type="button" class="eq-option-btn eq-option-empty" onclick="selectEqOption(${index}, '${field}', '')" onkeydown="handleEqOptionKeydown(${index}, '${field}', event, '')">Clear</button><button type="button" class="eq-option-btn" onclick="openEqListModal(${index}, '${field}', '${encodedQuery}')">Expand</button></div>`;
    const body = groups.map(group => {
        const optionsHtml = group.options.map(opt => {
            const countLabel = !opt.isSelected && (opt.count || 0) > 1 ? `<span class="eq-option-meta">(${opt.count} avail)</span>` : '';
            return `<button type="button" class="eq-option-btn ${opt.isSelected ? 'selected' : ''}" onclick="selectEqOption(${index}, '${field}', '${encodeURIComponent(opt.value || '')}')" onkeydown="handleEqOptionKeydown(${index}, '${field}', event, '${encodeURIComponent(opt.value || '')}')"><span class="eq-make">${escapeHtml(opt.make || '')}${opt.make ? ' ' : ''}</span><span class="eq-model">${escapeHtml(opt.displayBase || opt.value || '')}</span>${countLabel}</button>`;
        }).join('');
        return `<div class="eq-group-label">${escapeHtml(group.groupLabel)}</div>${optionsHtml}`;
    }).join('');
    return `${clearRow}${body}`;
}
function renderCustomEqDropdown(index, field) {
    const selectedValue = `${sessionData[index]?.[field] || ''}`.trim();
    const normalized = getNormalizedEqOptions(index, field);
    const selected = normalized.find(opt => `${opt.value || ''}` === selectedValue);
    const displayValue = selectedValue
        ? `<span class="eq-make">${escapeHtml(selected?.make || '')}${selected?.make ? ' ' : ''}</span><span class="eq-model">${escapeHtml(selectedValue)}</span>`
        : `<span class="eq-placeholder">Select ${escapeHtml(getEqFieldLabel(field))}...</span>`;
    return `<div class="eq-custom-dropdown ${selectedValue ? '' : 'is-empty'}" id="eq-custom-${field}-${index}" data-index="${index}" data-field="${field}">
        <button type="button" class="eq-dropdown-trigger" onclick="toggleEqDropdown(${index}, '${field}')" onkeydown="handleEqTriggerKeydown(${index}, '${field}', event)" ${window.isSessionLocked ? 'disabled' : ''}>
            <span class="eq-dropdown-value">${displayValue}</span>
            <span class="eq-caret">▾</span>
        </button>
        <div class="eq-dropdown-menu" id="eq-menu-${field}-${index}" style="display:none;" onclick="event.stopPropagation()">
            <input id="eq-search-${field}-${index}" class="eq-dropdown-search" type="text" placeholder="Search ${escapeHtml(getEqFieldLabel(field).toLowerCase())}..." oninput="filterEqDropdownOptions(${index}, '${field}', this.value)" onkeydown="handleEqSearchKeydown(${index}, '${field}', event)">
            <div class="eq-dropdown-options" id="eq-options-${field}-${index}">${renderCustomEqOptions(index, field, '')}</div>
        </div>
    </div>`;
}
function getEqOptionButtons(index, field) {
    return Array.from(document.querySelectorAll(`#eq-options-${field}-${index} .eq-option-btn`));
}
function focusNextControlInRowByCell(rowIndex, currentCellIndex) {
    const row = document.querySelector(`tr[data-index="${rowIndex}"]`);
    if (!row) return;
    const cells = Array.from(row.children || []);
    for (let i = currentCellIndex + 1; i < cells.length; i++) {
        const target = cells[i].querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), .eq-dropdown-trigger:not([disabled]), button:not([disabled])');
        if (!target) continue;
        target.focus();
        if (target.tagName === 'INPUT' && target.type === 'text') target.select();
        return;
    }
}
function focusPrevControlInRowByCell(rowIndex, currentCellIndex) {
    const row = document.querySelector(`tr[data-index="${rowIndex}"]`);
    if (!row) return;
    const cells = Array.from(row.children || []);
    for (let i = currentCellIndex - 1; i >= 0; i--) {
        const target = cells[i].querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), .eq-dropdown-trigger:not([disabled]), button:not([disabled])');
        if (!target) continue;
        target.focus();
        if (target.tagName === 'INPUT' && target.type === 'text') target.select();
        return;
    }
}
function handleEqTriggerKeydown(index, field, event) {
    if (!event || window.isSessionLocked) return;
    const key = `${event.key || ''}`;
    const isAlphaNum = key.length === 1 && /[a-z0-9]/i.test(key);
    if (!isAlphaNum || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const menu = document.getElementById(`eq-menu-${field}-${index}`);
    const isOpen = !!menu && menu.style.display === 'block';
    if (!isOpen) toggleEqDropdown(index, field);
    setTimeout(() => {
        const search = document.getElementById(`eq-search-${field}-${index}`);
        if (!search) return;
        search.focus();
        search.value = key;
        filterEqDropdownOptions(index, field, key);
    }, 0);
}
function closeEqDropdown(index, field, returnFocus = false) {
    const menu = document.getElementById(`eq-menu-${field}-${index}`);
    if (!menu) return;
    menu.style.display = 'none';
    if (returnFocus) {
        const trigger = document.querySelector(`#eq-custom-${field}-${index} .eq-dropdown-trigger`);
        if (trigger) trigger.focus();
    }
}
function closeAllEqDropdowns() {
    document.querySelectorAll('.eq-dropdown-menu').forEach(menu => { menu.style.display = 'none'; });
}
function toggleEqDropdown(index, field) {
    if (window.isSessionLocked) return;
    const menu = document.getElementById(`eq-menu-${field}-${index}`);
    if (!menu) return;
    const isOpen = menu.style.display === 'block';
    closeAllEqDropdowns();
    if (isOpen) return;
    menu.style.display = 'block';
    const search = document.getElementById(`eq-search-${field}-${index}`);
    if (search) search.value = '';
    filterEqDropdownOptions(index, field, '');
    if (search) search.focus();
}
function filterEqDropdownOptions(index, field, query) {
    const optionsWrap = document.getElementById(`eq-options-${field}-${index}`);
    if (!optionsWrap) return;
    optionsWrap.innerHTML = renderCustomEqOptions(index, field, query || '');
}
function handleEqSearchKeydown(index, field, event) {
    if (!event) return;
    if (event.key === 'Escape') {
        event.preventDefault();
        closeEqDropdown(index, field, true);
        return;
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        const buttons = getEqOptionButtons(index, field);
        if (buttons.length) buttons[0].focus();
        return;
    }
    if (event.key === 'Enter') {
        const buttons = getEqOptionButtons(index, field);
        if (buttons.length) {
            event.preventDefault();
            buttons[0].click();
        }
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        const buttons = getEqOptionButtons(index, field);
        const currentTd = event.target.closest('td');
        const currentTr = event.target.closest('tr');
        const currentCellIndex = currentTd && currentTr ? Array.from(currentTr.children || []).indexOf(currentTd) : -1;
        const goReverse = !!event.shiftKey;
        if (buttons.length) {
            buttons[0].click();
            if (currentCellIndex >= 0) {
                setTimeout(() => {
                    if (goReverse) focusPrevControlInRowByCell(index, currentCellIndex);
                    else focusNextControlInRowByCell(index, currentCellIndex);
                }, 0);
            }
        } else {
            closeEqDropdown(index, field, false);
            if (currentCellIndex >= 0) {
                setTimeout(() => {
                    if (goReverse) focusPrevControlInRowByCell(index, currentCellIndex);
                    else focusNextControlInRowByCell(index, currentCellIndex);
                }, 0);
            }
        }
    }
}
function handleEqOptionKeydown(index, field, event, encodedValue) {
    if (!event) return;
    const buttons = getEqOptionButtons(index, field);
    const current = event.currentTarget;
    const currentIndex = buttons.indexOf(current);
    if (event.key === 'Escape') {
        event.preventDefault();
        closeEqDropdown(index, field, true);
        return;
    }
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = buttons[Math.min(currentIndex + 1, buttons.length - 1)];
        if (next) next.focus();
        return;
    }
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex <= 0) {
            const search = document.getElementById(`eq-search-${field}-${index}`);
            if (search) search.focus();
        } else {
            const prev = buttons[currentIndex - 1];
            if (prev) prev.focus();
        }
        return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectEqOption(index, field, encodedValue || '');
    }
}
function selectEqOption(index, field, encodedValue) {
    const value = encodedValue ? decodeURIComponent(encodedValue) : '';
    updateSessionData(index, field, value);
    closeAllEqDropdowns();
}
function renderEqTypeFilters() {
    const wrap = document.getElementById('eqTypeFilters');
    const index = window.activeEqModalIndex;
    const field = window.activeEqModalField;
    if (!wrap || !Number.isInteger(index) || !field) return;
    const tags = getEqFilterTags(index, field);
    if (!tags.length) {
        wrap.innerHTML = '';
        return;
    }
    let selected = Array.isArray(window.eqTypeFilters) ? window.eqTypeFilters.filter(tag => tags.includes(tag)) : [];
    if (!selected.length) selected = [...tags];
    window.eqTypeFilters = [...selected];
    const allActive = selected.length === tags.length;
    const allChip = `<button type="button" class="eq-type-chip ${allActive ? 'active' : ''}" onclick="toggleEqTypeFilter('__all__')">All</button>`;
    const chips = tags.map(tag => {
        const active = selected.includes(tag);
        return `<button type="button" class="eq-type-chip ${active ? 'active' : ''}" onclick="toggleEqTypeFilter('${encodeURIComponent(tag)}')">${escapeHtml(tag)}</button>`;
    }).join('');
    wrap.innerHTML = `${allChip}${chips}`;
}
function toggleEqTypeFilter(encodedType) {
    const index = window.activeEqModalIndex;
    const field = window.activeEqModalField;
    if (!Number.isInteger(index) || !field) return;
    const tags = getEqFilterTags(index, field);
    if (!tags.length) return;
    const current = Array.isArray(window.eqTypeFilters) ? window.eqTypeFilters.filter(tag => tags.includes(tag)) : [];
    const allSelected = current.length === tags.length;
    if (encodedType === '__all__') {
        window.eqTypeFilters = allSelected ? [] : [...tags];
    } else {
        const tag = decodeURIComponent(encodedType || '');
        if (!tags.includes(tag)) return;
        if (allSelected) {
            window.eqTypeFilters = [tag];
            renderEqTypeFilters();
            renderEqListModalRows();
            return;
        }
        const set = new Set(current);
        if (set.has(tag)) set.delete(tag);
        else set.add(tag);
        window.eqTypeFilters = tags.filter(t => set.has(t));
    }
    renderEqTypeFilters();
    renderEqListModalRows();
}
function openEqListModal(index, field, encodedQuery = '') {
    if (window.isSessionLocked) return;
    const modal = document.getElementById('eqListModal');
    const search = document.getElementById('eqListModalSearch');
    const title = document.getElementById('eqListModalTitle');
    if (!modal) return;
    window.activeEqModalIndex = index;
    window.activeEqModalField = field;
    window.eqTypeFilters = getEqFilterTags(index, field);
    closeAllEqDropdowns();
    modal.style.display = 'block';
    if (title) title.textContent = `${getEqFieldLabel(field)} Browser`;
    if (search) search.value = encodedQuery ? decodeURIComponent(encodedQuery) : '';
    renderEqTypeFilters();
    renderEqListModalRows();
    if (search) {
        setTimeout(() => {
            search.focus();
            search.select();
        }, 0);
    }
}
function closeEqListModal(event) {
    if (event && event.target && event.target.id !== 'eqListModal') return;
    const modal = document.getElementById('eqListModal');
    if (modal) modal.style.display = 'none';
    window.activeEqModalIndex = null;
    window.activeEqModalField = null;
}
function renderEqListModalRows() {
    const rowsWrap = document.getElementById('eqListModalRows');
    const search = document.getElementById('eqListModalSearch');
    const index = window.activeEqModalIndex;
    const field = window.activeEqModalField;
    if (!rowsWrap) return;
    if (!Number.isInteger(index) || !field) {
        rowsWrap.innerHTML = `<div class="eq-no-results">No active row selected.</div>`;
        return;
    }
    const selectedTags = Array.isArray(window.eqTypeFilters) ? window.eqTypeFilters : [];
    const groups = getGroupedEqOptions(index, field, search ? search.value : '', selectedTags);
    const rows = groups.flatMap(group => group.options.map(opt => ({
        category: opt.filterTag || group.groupLabel || 'Other',
        make: opt.make || '',
        value: opt.value || '',
        count: Number.isFinite(opt.count) ? opt.count : 1,
        isSelected: !!opt.isSelected
    })));
    if (!rows.length) {
        rowsWrap.innerHTML = `<div class="eq-no-results">No matching options.</div>`;
        return;
    }
    const html = rows.map(row => {
        const encodedValue = encodeURIComponent(row.value || '');
        const availableLabel = row.isSelected ? 'Selected' : `${Math.max(0, row.count || 0)}`;
        return `<tr>
            <td>${escapeHtml(row.category)}</td>
            <td><div style="display:flex; align-items:center; justify-content:space-between; gap:8px;"><span>${escapeHtml(row.make || '—')}</span><button type="button" class="eq-row-select-btn ${row.isSelected ? 'selected' : ''}" onclick="selectEqOptionFromModal('${encodedValue}')">${row.isSelected ? 'Selected' : 'Select'}</button></div></td>
            <td>${escapeHtml(row.value)}</td>
            <td>${escapeHtml(availableLabel)}</td>
        </tr>`;
    }).join('');
    rowsWrap.innerHTML = `<div class="eq-list-table-wrap"><table class="eq-list-table"><thead><tr><th style="width:120px;">Category</th><th style="width:300px;">Make/Unit</th><th>Option</th><th style="width:100px;">Avail</th></tr></thead><tbody>${html}</tbody></table></div>`;
}
function selectEqOptionFromModal(encodedValue) {
    const index = window.activeEqModalIndex;
    const field = window.activeEqModalField;
    if (!Number.isInteger(index) || !field) return;
    selectEqOption(index, field, encodedValue || '');
    closeEqListModal();
}
function updateSelectPlaceholderState(selectEl) {
    if (!selectEl) return;
    selectEl.classList.toggle('select-empty', !selectEl.value);
}

function getOptionsHtml(index, field) {
    const currentSelection = sessionData[index][field];
    const fieldLabels = { source: 'Source', microphone: 'Microphone', tieLine: 'Tie Line', preamp: 'Preamp', outboard1: 'Outboard 1', outboard2: 'Outboard 2', outboard3: 'Outboard 3', ad: 'A/D Converter', notes: 'Notes' };
    const displayName = fieldLabels[field] || (field.charAt(0).toUpperCase() + field.slice(1));
    let options = `<option value="">Select ${displayName}...</option>`;

    const buildGroupedOptions = (inventoryArray, categories) => {
        categories.forEach(cat => {
            const itemsInCat = inventoryArray.filter(i => i.category === cat);
            if (itemsInCat.length === 0) return;
            const grouped = {};
            itemsInCat.forEach(item => {
                const isSelectedHere = item.name === currentSelection;
                if (field === 'microphone') {
                    if (!grouped[item.name]) grouped[item.name] = {
                        count: 0,
                        isSelected: false,
                        make: `${item.make || ''}`.trim()
                    };
                    grouped[item.name].count += getMicAvailableSlots(item);
                    if (isSelectedHere) grouped[item.name].isSelected = true;
                    if (!grouped[item.name].make && item.make) grouped[item.name].make = `${item.make}`.trim();
                } else if (item.status === 'available' || isSelectedHere) {
                    if (!grouped[item.name]) grouped[item.name] = {
                        count: 0,
                        isSelected: false,
                        make: `${item.make || ''}`.trim()
                    };
                    if (item.status === 'available') grouped[item.name].count++;
                    if (isSelectedHere) grouped[item.name].isSelected = true;
                    if (!grouped[item.name].make && item.make) grouped[item.name].make = `${item.make}`.trim();
                }
            });
            if (Object.keys(grouped).length > 0) {
                options += `<optgroup label="${cat}">`;
                Object.keys(grouped).forEach(name => {
                    const g = grouped[name];
                    if (field === 'microphone' && g.count <= 0 && !g.isSelected) return;
                    const displayBase = g.make ? `${g.make} — ${name}` : name;
                    const label = g.isSelected ? displayBase : (g.count > 1 ? `${displayBase} (${g.count} avail)` : displayBase);
                    options += `<option value="${name}" ${g.isSelected ? 'selected' : ''}>${label}</option>`;
                });
                options += `</optgroup>`;
            }
        });
    };

    if (field === 'microphone') {
        buildGroupedOptions(equipment.microphones,['LDC', 'SDC', 'Dynamic', 'Ribbon', 'Other']);
    } else if (field.startsWith('outboard')) {
        buildGroupedOptions(equipment.outboard, ['Compressor', 'EQ', 'Delay', 'Saturation', 'DI']);
    } else if (['preamp', 'ad', 'tieLine'].includes(field)) {
        const units = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines);
        units.forEach(unit => {
            const avail = unit.channels.filter(c => c.status === 'available' || c.name === currentSelection);
            if (avail.length > 0) {
                options += `<optgroup label="${unit.name}">`;
                avail.forEach(c => { options += `<option value="${c.name}" ${c.name === currentSelection ? 'selected' : ''}>${c.name}</option>`; });
                options += `</optgroup>`;
            }
        });
    }
    return options;
}

// THIS FIXES THE DROPDOWN BUG. It silently rebuilds the options in all other rows when gear is assigned.
function refreshAllDropdowns(field) {
    if (!isEquipmentField(field)) return;
    EQUIPMENT_FIELDS.forEach(eqField => {
        sessionData.forEach((_, idx) => {
            const wrap = document.getElementById(`eq-custom-${eqField}-${idx}`);
            if (wrap) wrap.outerHTML = renderCustomEqDropdown(idx, eqField);
        });
    });
    if (Number.isInteger(window.activeEqModalIndex) && window.activeEqModalField) {
        renderEqTypeFilters();
        renderEqListModalRows();
    }
}

function updateSessionData(index, field, value) {
    exitClearModeForEditing();
    // Plain-text fields that don't touch inventory
    if (field === 'source' || field === 'notes' || field === 'recall') {
        if (sessionData[index][field] === value) return;
        pushHistory();
        sessionData[index][field] = value;
        
        // Instantly update the current row's color
        const currentRow = document.querySelector(`tr[data-index="${index}"]`);
        if (currentRow && field === 'source') {
            currentRow.style.backgroundColor = window.enableColors ? getRowColor(value, index) : '';
            refreshFollowingRoomRowColors(index + 1);
        }
        
        if (field === 'source' && value.trim() !== '') {
            const nextValue = getPredictedPairedSource(value);
            const nextRowIsEmpty = sessionData[index + 1] && sessionData[index + 1].source.trim() === '';
            const canAutoFillNext = window.preferences?.sourceAutoPair?.onlyWhenNextRowEmpty === false ? !!sessionData[index + 1] : nextRowIsEmpty;
            if (nextValue && canAutoFillNext) {
                sessionData[index + 1].source = nextValue;
                const nextIndex = index + 1;
                const nextRow = document.querySelector(`tr[data-index="${index + 1}"]`);
                if (nextRow) {
                    const nextInput = nextRow.querySelector('.col-source input');
                    if (nextInput) nextInput.value = nextValue;
                    // Instantly update the auto-filled row's color
                    nextRow.style.backgroundColor = window.enableColors ? getRowColor(nextValue, nextIndex) : '';
                }
            }
        }
        updateSessionSummary();
        if (!autoFillStartIndex) refreshAppUI(true);
        else autoSave();
        return;
    }

    // Clear old
    if (sessionData[index][field] === value) return;
    pushHistory();
    if (sessionData[index][field]) clearPreviousSelection(index, field);
    // Assign new
    sessionData[index][field] = value;
    if (value) markEquipmentInUse(field, value);
    // Smart Hard Normalling Trigger
    if (field === 'tieLine' && value) {
        const normals = equipment.hardNormals || [];
        const normalRoute = normals.find(n => n.tieLine === value);
        if (normalRoute) {
            if (normalRoute.preamp && checkChannelAvailable('preamp', normalRoute.preamp)) {
                if (sessionData[index].preamp) clearPrev(sessionData[index].preamp, 'preamp');
                sessionData[index].preamp = normalRoute.preamp;
                markUsed(normalRoute.preamp, 'preamp');
            }
            if (normalRoute.ad && checkChannelAvailable('ad', normalRoute.ad)) {
                if (sessionData[index].ad) clearPrev(sessionData[index].ad, 'ad');
                sessionData[index].ad = normalRoute.ad;
                markUsed(normalRoute.ad, 'ad');
            }
        }
    }
    
    updateUnitStatus('preampUnits');
    updateUnitStatus('adUnits');
    updateUnitStatus('tieLines');
    updateSessionSummary();
    
    if (!autoFillStartIndex) {
        refreshAppUI(true);
        refreshAllDropdowns(field); // THE FIX
        autoSave();
    } else {
        autoSave();
    }
}

function clearPrev(val, field) {
    if(!val || ['source','notes','recall'].includes(field)) return;
    if (field === 'microphone') {
        const mics = (equipment.microphones || []).filter(x => x.name === val);
        const target = mics.find(x => getMicInUseCount(x) > 0);
        if (target) setMicInUseCount(target, getMicInUseCount(target) - 1);
    }
    else if (['preamp', 'ad', 'tieLine'].includes(field)) { const u = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines); u.forEach(x => { const c = x.channels.find(y => y.name === val && y.status === 'in-use'); if(c) c.status = 'available'; }); }
    else if (field.startsWith('outboard')) { const g = equipment.outboard.find(x => x.name === val && x.status === 'in-use'); if(g) g.status = 'available'; }
}

function markUsed(val, field) {
    if(['source','notes','recall'].includes(field)) return;
    if (field === 'microphone') {
        const mics = (equipment.microphones || []).filter(x => x.name === val);
        const target = mics.find(x => getMicAvailableSlots(x) > 0);
        if (target) setMicInUseCount(target, getMicInUseCount(target) + 1);
    }
    else if (['preamp', 'ad', 'tieLine'].includes(field)) { const u = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines); u.forEach(x => { const c = x.channels.find(y => y.name === val && y.status === 'available'); if(c) c.status = 'in-use'; }); }
    else if (field.startsWith('outboard')) { const g = equipment.outboard.find(x => x.name === val && x.status === 'available'); if(g) g.status = 'in-use'; }
}

function clearPreviousSelection(index, field) {
    clearPrev(sessionData[index][field], field);
}

function markEquipmentInUse(field, value) {
    markUsed(value, field);
}

// ==========================================
// AUTO-FILL ENGINE (BUG FIXES)
// ==========================================
let autoFillStartIndex = null;
let autoFillColumn = null;
let autoFillBaseValue = null;
let autoFillActive = false;
let autoStartIdx = null;
let autoCol = null;
let autoBase = null;

function addAutoFillHandlers() {
    // Allows auto-filling for ALL gear now
    const controls = document.querySelectorAll('.eq-dropdown-trigger');
    controls.forEach(control => {
        control.addEventListener('mousedown', handleAutoFillStart);
    });
}

function handleAutoFillStart(e) {
    exitClearModeForEditing();
    const target = e.target;
    let value = '';
    let rowIndex = null;
    let host = null;
    if (target.tagName === 'SELECT' && target.value) {
        value = target.value;
        rowIndex = parseInt(target.id.split('-')[1], 10);
        host = target.parentElement;
    } else if (target.classList && target.classList.contains('eq-dropdown-trigger')) {
        const wrap = target.closest('.eq-custom-dropdown');
        const idx = parseInt(wrap?.dataset?.index || '-1', 10);
        const field = `${wrap?.dataset?.field || ''}`;
        if (idx >= 0 && field) {
            value = `${sessionData[idx]?.[field] || ''}`;
            rowIndex = idx;
            host = wrap;
        }
    }
    if (!value || rowIndex === null || Number.isNaN(rowIndex)) return;
    const rect = target.getBoundingClientRect();
    const isNearBottomRight = (e.clientX > rect.right - 15) && (e.clientY > rect.bottom - 15);
    if (!isNearBottomRight) return;
    e.preventDefault();
    autoFillStartIndex = rowIndex;
    autoFillColumn = target.closest('td')?.dataset?.autofill || null;
    autoFillBaseValue = value;
    if (!autoFillColumn) return;
    autoFillActive = true;
    autoStartIdx = autoFillStartIndex;
    autoCol = autoFillColumn;
    autoBase = autoFillBaseValue;
    if (host) host.classList.add('auto-fill-selection');
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDropFill);
}

function handleDrag(e) {
    if (autoFillStartIndex !== null) {
        const targetCell = e.target.closest('td[data-autofill]');
        if (targetCell && targetCell.dataset.autofill === autoFillColumn) {
            const targetIndex = parseInt(targetCell.closest('tr').dataset.index);
            document.querySelectorAll('.auto-fill-preview').forEach(c => c.classList.remove('auto-fill-preview'));
            
            if (targetIndex > autoFillStartIndex) {
                for (let i = autoFillStartIndex + 1; i <= targetIndex; i++) {
                    const previewRow = document.querySelector(`tr[data-index="${i}"]`);
                    if (previewRow) previewRow.querySelector(`td[data-autofill="${autoFillColumn}"]`).classList.add('auto-fill-preview');
                }
            }
        }
    }
}
function handleDropFill(e) {
    const td = e.target.closest('td[data-autofill]');
    if(td && td.dataset.autofill === autoCol) {
        const targetIdx = parseInt(td.closest('tr').dataset.index);
        if(targetIdx > autoStartIdx) {
            pushHistory();
            const match = autoBase.match(/^(.*?)(\d+)$/);
            for(let i=autoStartIdx+1; i<=targetIdx; i++) {
                let newVal = autoBase;
                if (['preamp', 'ad', 'tieLine'].includes(autoCol) && match) {
                    newVal = `${match[1]}${parseInt(match[2]) + (i - autoStartIdx)}`;
                }
                if(checkAvail(autoCol, newVal)) { 
                    clearPrev(sessionData[i][autoCol], autoCol); 
                    sessionData[i][autoCol] = newVal; 
                    markUsed(newVal, autoCol); 
                } else break;
            }
        }
    }
    document.querySelectorAll('.auto-fill-selection, .auto-fill-preview').forEach(c => c.classList.remove('auto-fill-selection', 'auto-fill-preview'));
    document.removeEventListener('mousemove', handleDrag); document.removeEventListener('mouseup', handleDropFill);
    autoFillActive = false; autoStartIdx = null; updateSessionTable();
    autoFillStartIndex = null;
    autoFillColumn = null;
    autoFillBaseValue = null;
    autoCol = null;
    autoBase = null;
    updateUnitStatus('preampUnits');
    updateUnitStatus('adUnits');
    updateUnitStatus('tieLines');
    refreshAppUI(true);
}

function checkChannelAvailable(columnType, name) {
    if (columnType === 'microphone') {
        const matches = (equipment.microphones || []).filter(x => x.name === name);
        return matches.some(m => getMicAvailableSlots(m) > 0);
    } else if (columnType === 'preamp' || columnType === 'ad' || columnType === 'tieLine') {
        const units =
            columnType === 'preamp'
                ? equipment.preampUnits
                : columnType === 'ad'
                    ? equipment.adUnits
                    : equipment.tieLines;
        for (let u of units) { const ch = u.channels.find(c => c.name === name); if (ch && ch.status === 'available') return true; }
    } else if (columnType.startsWith('outboard')) {
        return (equipment.outboard || []).some(x => x.name === name && x.status === 'available');
    }
    return false;
}
function checkAvail(columnType, name) { return checkChannelAvailable(columnType, name); }

function savePreferencesToStorage() {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(window.preferences || getDefaultPreferences()));
}
function renderSourceSuggestionsDatalist() {
    const datalist = document.getElementById('sourceSuggestions');
    if (!datalist) return;
    const suggestions = window.preferences?.sourceSuggestions || [];
    datalist.innerHTML = suggestions
        .map(item => `<option value="${escapeHtml(item)}"></option>`)
        .join('');
}
function getPredictedPairedSource(value) {
    const raw = `${value || ''}`;
    const sourceValue = raw.trim();
    if (!sourceValue) return '';
    const config = window.preferences?.sourceAutoPair;
    if (!config || config.enabled === false) return '';

    const exact = Array.isArray(config.exactPairs) ? config.exactPairs : [];
    const suffix = Array.isArray(config.suffixPairs) ? config.suffixPairs : [];
    for (const pair of exact) {
        if (!pair || pair.enabled === false) continue;
        if (pair.from === sourceValue) return pair.to;
        if ((pair.trigger || 'forward') === 'either' && pair.to === sourceValue) return pair.from;
    }
    for (const pair of suffix) {
        if (!pair || pair.enabled === false) continue;
        if (sourceValue.endsWith(pair.from)) {
            return sourceValue.slice(0, sourceValue.length - pair.from.length) + pair.to;
        }
        if ((pair.trigger || 'forward') === 'either' && sourceValue.endsWith(pair.to)) {
            return sourceValue.slice(0, sourceValue.length - pair.to.length) + pair.from;
        }
    }
    return '';
}
let preferenceDragRow = null;
function startPreferencePairDrag(event) {
    const row = event.target?.closest('.pref-pair-row');
    if (!row) return;
    preferenceDragRow = row;
    row.classList.add('pref-dragging');
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', 'pref-pair');
    }
}
function endPreferencePairDrag() {
    if (preferenceDragRow) preferenceDragRow.classList.remove('pref-dragging');
    preferenceDragRow = null;
}
function getPreferenceDropAfterElement(container, y) {
    const draggableRows = [...container.querySelectorAll('.pref-pair-row:not(.pref-dragging)')];
    return draggableRows.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
function handlePreferencePairDragOver(event) {
    event.preventDefault();
    const container = event.currentTarget;
    if (!preferenceDragRow || preferenceDragRow.parentElement !== container) return;
    const afterElement = getPreferenceDropAfterElement(container, event.clientY);
    if (!afterElement) container.appendChild(preferenceDragRow);
    else container.insertBefore(preferenceDragRow, afterElement);
}
function handlePreferencePairKeyReorder(event) {
    const key = event.key;
    if (key !== 'ArrowUp' && key !== 'ArrowDown') return;
    const handle = event.currentTarget;
    const row = handle?.closest('.pref-pair-row');
    const container = row?.parentElement;
    if (!row || !container) return;
    event.preventDefault();
    if (key === 'ArrowUp') {
        const prev = row.previousElementSibling;
        if (prev) container.insertBefore(row, prev);
    } else {
        const next = row.nextElementSibling;
        if (next) container.insertBefore(next, row);
    }
    handle.focus();
}
function bindPreferencePairDnD(container) {
    if (!container || container.dataset.dragBound === '1') return;
    container.dataset.dragBound = '1';
    container.addEventListener('dragover', handlePreferencePairDragOver);
    container.addEventListener('drop', (event) => {
        event.preventDefault();
        endPreferencePairDrag();
    });
}
function setPreferencePairTrigger(btn, trigger) {
    const row = btn?.closest('.pref-pair-row');
    if (!row) return;
    const triggerInput = row.querySelector('.pref-pair-trigger');
    if (triggerInput) triggerInput.value = trigger;
    row.querySelectorAll('.pref-trigger-btn').forEach(el => {
        const isActive = el.dataset.trigger === trigger;
        el.classList.toggle('active', isActive);
        el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}
function createPreferencePairRow(type, pair = {}) {
    const row = document.createElement('div');
    row.className = 'pref-pair-row';
    row.dataset.type = type;
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'auto 1fr 1fr auto auto auto';
    row.style.gap = '6px';
    const trigger = (pair.trigger || 'forward') === 'either' ? 'either' : 'forward';
    const triggerCell = `
        <input class="pref-pair-trigger" type="hidden" value="${trigger}">
        <div class="pref-trigger-group" title="Trigger direction">
            <button class="pref-trigger-btn ${trigger === 'forward' ? 'active' : ''}" data-trigger="forward" type="button" aria-pressed="${trigger === 'forward' ? 'true' : 'false'}" onclick="setPreferencePairTrigger(this, 'forward')">One-way</button>
            <button class="pref-trigger-btn ${trigger === 'either' ? 'active' : ''}" data-trigger="either" type="button" aria-pressed="${trigger === 'either' ? 'true' : 'false'}" onclick="setPreferencePairTrigger(this, 'either')">Either</button>
        </div>
    `;
    row.innerHTML = `
        <button class="pref-drag-handle" type="button" title="Drag or use Arrow keys to reorder" draggable="true" ondragstart="startPreferencePairDrag(event)" ondragend="endPreferencePairDrag()" onkeydown="handlePreferencePairKeyReorder(event)">⋮⋮</button>
        <input class="pref-pair-from" type="text" placeholder="From" value="${escapeHtml(pair.from || '')}">
        <input class="pref-pair-to" type="text" placeholder="To" value="${escapeHtml(pair.to || '')}">
        ${triggerCell}
        <label style="display:flex; align-items:center; gap:6px; color:var(--text-secondary); font-size:12px;">
            <input class="pref-pair-enabled" type="checkbox" ${pair.enabled !== false ? 'checked' : ''}>
            On
        </label>
        <button class="pref-remove-btn" type="button" onclick="removePreferencePairRow(this)">Clear</button>
    `;
    return row;
}
function renderPreferencePairs(type, pairs) {
    const targetId = type === 'exact' ? 'prefExactPairsList' : 'prefSuffixPairsList';
    const container = document.getElementById(targetId);
    if (!container) return;
    bindPreferencePairDnD(container);
    container.innerHTML = '';
    const safePairs = Array.isArray(pairs) ? pairs : [];
    if (!safePairs.length) {
        container.appendChild(createPreferencePairRow(type, { from: '', to: '', enabled: true }));
        autoSizeSourceSuggestionsTextarea();
        return;
    }
    safePairs.forEach(pair => container.appendChild(createPreferencePairRow(type, pair)));
    autoSizeSourceSuggestionsTextarea();
}
function autoSizeSourceSuggestionsTextarea() {
    const textarea = document.getElementById('prefSourceSuggestions');
    if (!textarea) return;
    const minHeight = 220;
    const autoPairBody = document.querySelector('#prefAutoPairSection .pref-section-body');
    let maxHeight = 520;
    if (autoPairBody && getComputedStyle(autoPairBody).display !== 'none') {
        maxHeight = Math.max(minHeight, Math.floor(autoPairBody.getBoundingClientRect().height));
    }
    textarea.style.height = 'auto';
    const desired = Math.max(minHeight, textarea.scrollHeight);
    const next = Math.min(desired, maxHeight);
    textarea.style.height = `${next}px`;
    textarea.style.overflowY = desired > maxHeight ? 'auto' : 'hidden';
}
function getSimpleGearOptions(type, selectedValue) {
    const units = type === 'tieLine' ? equipment.tieLines : (type === 'preamp' ? equipment.preampUnits : equipment.adUnits);
    let html = '<option value="">-- None --</option>';
    (units || []).forEach(u => {
        html += `<optgroup label="${escapeHtml(u.name)}">`;
        (u.channels || []).forEach(c => {
            const sel = c.name === selectedValue ? 'selected' : '';
            html += `<option value="${escapeHtml(c.name)}" ${sel}>${escapeHtml(c.name)}</option>`;
        });
        html += `</optgroup>`;
    });
    return html;
}
function renderNormalDropdown(idx, field, selectedValue) {
    const units = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines);
    let displayValue = `<span class="eq-placeholder">Select ${getEqFieldLabel(field)}...</span>`;
    
    if (selectedValue) {
        let make = '';
        (units ||[]).forEach(u => { if (u.channels.some(c => c.name === selectedValue)) make = u.make || ''; });
        displayValue = `<span class="eq-make">${escapeHtml(make)}${make ? ' ' : ''}</span><span class="eq-model">${escapeHtml(selectedValue)}</span>`;
    }

    return `<div class="eq-custom-dropdown ${selectedValue ? '' : 'is-empty'}" id="norm-custom-${field}-${idx}" data-field="${field}" data-value="${escapeHtml(selectedValue)}">
        <button type="button" class="eq-dropdown-trigger" onclick="toggleNormalDropdown(${idx}, '${field}')">
            <span class="eq-dropdown-value">${displayValue}</span>
            <span class="eq-caret">▾</span>
        </button>
        <div class="eq-dropdown-menu" id="norm-menu-${field}-${idx}" style="display:none;" onclick="event.stopPropagation()">
            <input id="norm-search-${field}-${idx}" class="eq-dropdown-search" type="text" placeholder="Search..." oninput="filterNormalDropdownOptions(${idx}, '${field}', this.value)">
            <div class="eq-dropdown-options" id="norm-options-${field}-${idx}">
                ${renderNormalOptions(idx, field, selectedValue, '')}
            </div>
        </div>
    </div>`;
}

function renderNormalOptions(idx, field, selectedValue, query) {
    const q = query.toLowerCase().trim();
    const units = field === 'preamp' ? equipment.preampUnits : (field === 'ad' ? equipment.adUnits : equipment.tieLines);
    let html = `<div class="eq-option-controls"><button type="button" class="eq-option-btn eq-option-empty" onclick="selectNormalOption(${idx}, '${field}', '')">Clear</button></div>`;
    
    let hasResults = false;
    (units ||[]).forEach(u => {
        const matchedChannels = u.channels.filter(c => {
            if (!q) return true;
            return c.name.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q) || (u.make || '').toLowerCase().includes(q);
        });
        
        if (matchedChannels.length > 0) {
            hasResults = true;
            html += `<div class="eq-group-label">${escapeHtml(u.name)}</div>`;
            matchedChannels.forEach(c => {
                const isSel = c.name === selectedValue;
                html += `<button type="button" class="eq-option-btn ${isSel ? 'selected' : ''}" onclick="selectNormalOption(${idx}, '${field}', '${encodeURIComponent(c.name)}')">
                    <span class="eq-make">${escapeHtml(u.make || '')}${u.make ? ' ' : ''}</span><span class="eq-model">${escapeHtml(c.name)}</span>
                </button>`;
            });
        }
    });
    
    if (!hasResults) return `<div class="eq-no-results">No matching options.</div>`;
    return html;
}

window.toggleNormalDropdown = function(idx, field) {
    const menu = document.getElementById(`norm-menu-${field}-${idx}`);
    if (!menu) return;
    const isOpen = menu.style.display === 'block';
    document.querySelectorAll('.eq-dropdown-menu').forEach(m => m.style.display = 'none');
    if (isOpen) return;
    menu.style.display = 'block';
    const search = document.getElementById(`norm-search-${field}-${idx}`);
    if (search) { search.value = ''; search.focus(); }
    filterNormalDropdownOptions(idx, field, '');
};

window.filterNormalDropdownOptions = function(idx, field, query) {
    const wrap = document.getElementById(`norm-options-${field}-${idx}`);
    const mainWrap = document.getElementById(`norm-custom-${field}-${idx}`);
    const selectedValue = mainWrap ? mainWrap.dataset.value : '';
    if (wrap) wrap.innerHTML = renderNormalOptions(idx, field, selectedValue, query);
};

window.selectNormalOption = function(idx, field, encodedValue) {
    const value = encodedValue ? decodeURIComponent(encodedValue) : '';
    const wrap = document.getElementById(`norm-custom-${field}-${idx}`);
    if (wrap) {
        wrap.dataset.value = value;
        wrap.outerHTML = renderNormalDropdown(idx, field, value);
    }
    document.querySelectorAll('.eq-dropdown-menu').forEach(m => m.style.display = 'none');
    updatePreferencesDirtyState();
};

function createPreferenceNormalRow(normal = {}, idx = 0) {
    const row = document.createElement('div');
    row.className = 'pref-normal-row';
    row.dataset.idx = idx;
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr 1fr 1fr auto';
    row.style.gap = '6px';
    row.innerHTML = `
        ${renderNormalDropdown(idx, 'tieLine', normal.tieLine || '')}
        ${renderNormalDropdown(idx, 'preamp', normal.preamp || '')}
        ${renderNormalDropdown(idx, 'ad', normal.ad || '')}
        <button class="pref-remove-btn" type="button" onclick="this.closest('.pref-normal-row').remove(); updatePreferencesDirtyState();">Clear</button>
    `;
    return row;
}
function renderPreferenceNormals() {
    const container = document.getElementById('prefNormalsList');
    if (!container) return;
    container.innerHTML = '';
    const safe = Array.isArray(equipment?.hardNormals) ? equipment.hardNormals :[];
    if (!safe.length) {
        container.appendChild(createPreferenceNormalRow({}, 0));
        return;
    }
    safe.forEach((n, idx) => container.appendChild(createPreferenceNormalRow(n, idx)));
}
function addPreferenceNormalRow() {
    const container = document.getElementById('prefNormalsList');
    const newIdx = container ? container.children.length : 0;
    container?.appendChild(createPreferenceNormalRow({}, newIdx));
    updatePreferencesDirtyState();
}
function renderAutoColourDiagnostics(groupsOverride = null) {
    const groups = Array.isArray(groupsOverride)
        ? groupsOverride
        : ((Array.isArray(window.previewAutoColourGroups) && window.previewAutoColourGroups.length)
            ? window.previewAutoColourGroups
            : (window.preferences?.autoColour?.groups || []));
    const testInput = document.getElementById('prefColourTestInput');
    const testResult = document.getElementById('prefColourTestResult');
    const conflictList = document.getElementById('prefColourConflictList');
    if (testResult) {
        const source = `${testInput?.value || ''}`.trim();
        if (!source) {
            testResult.textContent = 'No test source entered.';
        } else {
            const match = getAutoGroupMatchInfo(source, groups);
            if (!match) {
                testResult.textContent = 'No match.';
            } else {
                const chip = `<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${applyColourAdjustments(match.colour, 1.5)}; border:1px solid var(--border-primary); vertical-align:middle; margin-right:6px;"></span>`;
                testResult.innerHTML = `${chip}Matches ${escapeHtml(match.groupName)} via "${escapeHtml(match.keyword)}"`;
            }
        }
    }
    if (conflictList) {
        const keywordMap = new Map();
        groups.forEach(group => {
            if (!group || group.enabled === false) return;
            const name = `${group.name || 'Group'}`.trim();
            const keys = Array.isArray(group.keywords) ? group.keywords : [];
            keys.forEach(key => {
                const keyword = `${key || ''}`.trim().toLowerCase();
                if (!keyword) return;
                if (!keywordMap.has(keyword)) keywordMap.set(keyword, new Set());
                keywordMap.get(keyword).add(name);
            });
        });
        const conflicts = Array.from(keywordMap.entries())
            .filter(([, names]) => names.size > 1)
            .sort((a, b) => a[0].localeCompare(b[0]));
        if (!conflicts.length) {
            conflictList.innerHTML = `<div style="color:var(--text-secondary);">No keyword conflicts.</div>`;
        } else {
            conflictList.innerHTML = conflicts
                .map(([keyword, names]) => `<div><strong style="color:var(--accent-primary);">${escapeHtml(keyword)}</strong> in ${escapeHtml(Array.from(names).join(', '))}</div>`)
                .join('');
        }
    }
}
function renderPreferencesUI() {
    const prefs = normalizePreferences(window.preferences);
    window.preferences = prefs;
    window.previewAutoColourGroups = null;
    const sourceBox = document.getElementById('prefSourceSuggestions');
    const autoPairEnabled = document.getElementById('prefAutoPairEnabled');
    const onlyWhenNextEmpty = document.getElementById('prefOnlyWhenNextEmpty');
    const dawMergeStereo = document.getElementById('prefDawMergeStereo');
    const dawUseShortNames = document.getElementById('prefDawUseShortNames');
    const pdfPrintEmptyRows = document.getElementById('prefPdfPrintEmptyRows');
    const customBg = document.getElementById('customBg');
    const customPanels = document.getElementById('customPanels');
    const customText = document.getElementById('customText');
    const customAccent = document.getElementById('customAccent');
    const customBgHex = document.getElementById('customBgHex');
    const customPanelsHex = document.getElementById('customPanelsHex');
    const customTextHex = document.getElementById('customTextHex');
    const customAccentHex = document.getElementById('customAccentHex');
    if (sourceBox) sourceBox.value = prefs.sourceSuggestions.join('\n');
    if (autoPairEnabled) autoPairEnabled.checked = prefs.sourceAutoPair.enabled !== false;
    if (onlyWhenNextEmpty) onlyWhenNextEmpty.checked = prefs.sourceAutoPair.onlyWhenNextRowEmpty !== false;
    if (dawMergeStereo) dawMergeStereo.checked = prefs.dawNamer?.mergeStereo !== false;
    if (dawUseShortNames) dawUseShortNames.checked = prefs.dawNamer?.useShortNames === true;
    if (pdfPrintEmptyRows) pdfPrintEmptyRows.checked = prefs.pdfExport?.printEmptyRows === true;
    if (customBg) customBg.value = prefs.customTheme?.bg || '#0f0f0f';
    if (customPanels) customPanels.value = prefs.customTheme?.panels || '#1a1a1a';
    if (customText) customText.value = prefs.customTheme?.text || '#eeeeee';
    if (customAccent) customAccent.value = prefs.customTheme?.accent || '#FF9F1C';
    if (customBgHex) customBgHex.value = prefs.customTheme?.bg || '#0f0f0f';
    if (customPanelsHex) customPanelsHex.value = prefs.customTheme?.panels || '#1a1a1a';
    if (customTextHex) customTextHex.value = prefs.customTheme?.text || '#eeeeee';
    if (customAccentHex) customAccentHex.value = prefs.customTheme?.accent || '#FF9F1C';
    renderPreferencePairs('exact', prefs.sourceAutoPair.exactPairs);
    renderPreferencePairs('suffix', prefs.sourceAutoPair.suffixPairs);
    renderPreferenceNormals();
    renderPreferenceColourGroups(prefs.autoColour?.groups || []);
    renderManualColorGridFromPreferences(prefs.autoColour?.groups || []);
    renderAutoColourDiagnostics(prefs.autoColour?.groups || []);
    renderSourceSuggestionsDatalist();
    setTimeout(autoSizeSourceSuggestionsTextarea, 0);
    if (document.documentElement.getAttribute('data-theme') === 'custom') {
        applyCustomThemeColors();
    }
    setPreferencesDirtyState(false);
}
window.togglePreferencesSection = function(btn) {
    const section = btn?.closest('.pref-section');
    if (!section) return;
    section.classList.toggle('is-open');
    const toggle = section.querySelector('.pref-section-toggle');
    if (toggle) toggle.textContent = section.classList.contains('is-open') ? 'Hide' : 'Show';
    setTimeout(autoSizeSourceSuggestionsTextarea, 0);
};
function readPreferencePairs(type) {
    return Array.from(document.querySelectorAll(`.pref-pair-row[data-type="${type}"]`))
        .map(row => ({
            from: `${row.querySelector('.pref-pair-from')?.value || ''}`.trim(),
            to: `${row.querySelector('.pref-pair-to')?.value || ''}`.trim(),
            trigger: row.querySelector('.pref-pair-trigger')?.value === 'either' ? 'either' : 'forward',
            enabled: !!row.querySelector('.pref-pair-enabled')?.checked
        }))
        .filter(pair => pair.from && pair.to);
}
function buildPreferencesDraftFromUI() {
    const sourceBox = document.getElementById('prefSourceSuggestions');
    const autoPairEnabled = document.getElementById('prefAutoPairEnabled');
    const onlyWhenNextEmpty = document.getElementById('prefOnlyWhenNextEmpty');
    const dawMergeStereo = document.getElementById('prefDawMergeStereo');
    const dawUseShortNames = document.getElementById('prefDawUseShortNames');
    const customTheme = getCustomThemeFromInputs();
    const sourceSuggestions = `${sourceBox?.value || ''}`
        .split('\n')
        .map(v => v.trim())
        .filter(Boolean);
    return normalizePreferences({
        version: 1,
        sourceSuggestions,
        sourceAutoPair: {
            enabled: !!autoPairEnabled?.checked,
            onlyWhenNextRowEmpty: !!onlyWhenNextEmpty?.checked,
            exactPairs: readPreferencePairs('exact'),
            suffixPairs: readPreferencePairs('suffix')
        },
        dawNamer: {
            mergeStereo: dawMergeStereo?.checked !== false,
            useShortNames: !!dawUseShortNames?.checked
        },
        pdfExport: {
            printEmptyRows: !!document.getElementById('prefPdfPrintEmptyRows')?.checked
        },
        customTheme,
        autoColour: {
            groups: readPreferenceColourGroups()
        }
    });
}
function readPreferenceNormalsFromUI() {
    return normalizeHardNormals(Array.from(document.querySelectorAll('.pref-normal-row'))
        .map(row => {
            const tie = row.querySelector('[data-field="tieLine"]')?.dataset.value || '';
            const pre = row.querySelector('[data-field="preamp"]')?.dataset.value || '';
            const ad = row.querySelector('[data-field="ad"]')?.dataset.value || '';
            return { tieLine: tie, preamp: pre, ad: ad };
        })
    );
}
function setPreferencesDirtyState(isDirty) {
    const tabText = document.getElementById('preferencesTabUnsavedText');
    if (tabText) tabText.style.opacity = isDirty ? '0.95' : '0';
}
function updatePreferencesDirtyState() {
    const saved = normalizePreferences(window.preferences);
    const draft = buildPreferencesDraftFromUI();
    const savedNormals = normalizeHardNormals(equipment?.hardNormals);
    const draftNormals = readPreferenceNormalsFromUI();
    setPreferencesDirtyState(
        JSON.stringify(saved) !== JSON.stringify(draft) ||
        JSON.stringify(savedNormals) !== JSON.stringify(draftNormals)
    );
}
function savePreferencesFromUI() {
    equipment.hardNormals = readPreferenceNormalsFromUI();
    const nextPrefs = buildPreferencesDraftFromUI();
    window.preferences = nextPrefs;
    savePreferencesToStorage();
    renderPreferencesUI();
    if (window.enableColors) updateSessionTable();
    autoSave();
    alert('Preferences saved.');
}
async function copySourceSuggestions() {
    const sourceBox = document.getElementById('prefSourceSuggestions');
    const value = `${sourceBox?.value || ''}`.trim();
    if (!value) {
        alert('No source suggestions to copy yet.');
        return;
    }
    try {
        await navigator.clipboard.writeText(value);
        alert('Source suggestions copied.');
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert('Source suggestions copied.');
    }
}
function addPreferencePairRow(type) {
    const targetId = type === 'exact' ? 'prefExactPairsList' : 'prefSuffixPairsList';
    const container = document.getElementById(targetId);
    if (!container) return;
    container.appendChild(createPreferencePairRow(type, { from: '', to: '', enabled: true }));
    autoSizeSourceSuggestionsTextarea();
}
function removePreferencePairRow(btn) {
    const row = btn?.closest('.pref-pair-row');
    const container = row?.parentElement;
    if (!row || !container) return;
    row.remove();
    if (!container.querySelector('.pref-pair-row')) {
        const type = container.id === 'prefExactPairsList' ? 'exact' : 'suffix';
        container.appendChild(createPreferencePairRow(type, { from: '', to: '', enabled: true }));
    }
    autoSizeSourceSuggestionsTextarea();
}
function rgbaToHex(rgba) {
    const m = `${rgba || ''}`.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return '#808080';
    const toHex = (v) => Number(v).toString(16).padStart(2, '0');
    return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}
function rgbaAlpha(rgba, fallback = 0.15) {
    const m = `${rgba || ''}`.match(/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    if (!m) return fallback;
    return m[1] !== undefined ? clampNumber(parseFloat(m[1]), 0, 1, fallback) : 1;
}
function hexToRgba(hex, alpha = 0.15) {
    const safe = `${hex || ''}`.replace('#', '').trim();
    const full = safe.length === 3 ? safe.split('').map(c => c + c).join('') : safe;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return `rgba(128, 128, 128, ${alpha})`;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
let prefColourDragRow = null;
function startPreferenceColourDrag(event) {
    const row = event.target?.closest('.pref-colour-row');
    if (!row) return;
    prefColourDragRow = row;
    row.classList.add('pref-dragging');
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', 'pref-colour');
    }
}
function endPreferenceColourDrag() {
    if (prefColourDragRow) prefColourDragRow.classList.remove('pref-dragging');
    prefColourDragRow = null;
}
function getPreferenceColourDropAfterElement(container, y) {
    const rows = [...container.querySelectorAll('.pref-colour-row:not(.pref-dragging)')];
    return rows.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
function bindPreferenceColourDnD(container) {
    if (!container || container.dataset.dragBound === '1') return;
    container.dataset.dragBound = '1';
    container.addEventListener('dragover', (event) => {
        event.preventDefault();
        if (!prefColourDragRow || prefColourDragRow.parentElement !== container) return;
        const after = getPreferenceColourDropAfterElement(container, event.clientY);
        if (!after) container.appendChild(prefColourDragRow);
        else container.insertBefore(prefColourDragRow, after);
    });
    container.addEventListener('drop', (event) => {
        event.preventDefault();
        endPreferenceColourDrag();
    });
}
function createPreferenceColourGroupRow(group = {}) {
    const row = document.createElement('div');
    row.className = 'pref-colour-row';
    const colour = group.colour || 'rgba(128, 128, 128, 0.15)';
    const alpha = rgbaAlpha(colour, 0.15);
    row.innerHTML = `
        <button class="pref-drag-handle" type="button" title="Drag to reorder" draggable="true" ondragstart="startPreferenceColourDrag(event)" ondragend="endPreferenceColourDrag()">⋮⋮</button>
        <input class="pref-colour-name" type="text" placeholder="Group name" value="${escapeHtml(group.name || '')}" oninput="previewPreferenceColourGroups()">
        <input class="pref-colour-picker" type="color" value="${rgbaToHex(colour)}" title="Base colour" oninput="previewPreferenceColourGroups()">
        <input class="pref-keywords" type="text" placeholder="keywords, comma separated" value="${escapeHtml((group.keywords || []).join(', '))}" oninput="previewPreferenceColourGroups()">
        <label style="display:flex; align-items:center; gap:6px; color:var(--text-secondary); font-size:12px;">
            <input class="pref-colour-enabled" type="checkbox" ${group.enabled !== false ? 'checked' : ''} onchange="previewPreferenceColourGroups()">
            On
        </label>
        <button class="pref-remove-btn" type="button" onclick="removePreferenceColourGroup(this)">Clear</button>
    `;
    row.querySelector('.pref-colour-picker')?.setAttribute('data-alpha', String(alpha));
    return row;
}
function renderPreferenceColourGroups(groups) {
    const container = document.getElementById('prefColourGroupsList');
    if (!container) return;
    bindPreferenceColourDnD(container);
    container.innerHTML = '';
    const safe = Array.isArray(groups) ? groups : [];
    if (!safe.length) {
        container.appendChild(createPreferenceColourGroupRow({ name: '', colour: 'rgba(128, 128, 128, 0.15)', keywords: [], enabled: true }));
        return;
    }
    safe.forEach(group => container.appendChild(createPreferenceColourGroupRow(group)));
}
function readPreferenceColourGroups() {
    const rows = Array.from(document.querySelectorAll('#prefColourGroupsList .pref-colour-row'));
    return rows.map((row, idx) => {
        const name = `${row.querySelector('.pref-colour-name')?.value || ''}`.trim();
        const keywords = `${row.querySelector('.pref-keywords')?.value || ''}`
            .split(',')
            .map(v => v.trim())
            .filter(Boolean);
        const colorInput = row.querySelector('.pref-colour-picker');
        const hex = colorInput?.value || '#808080';
        const alpha = clampNumber(parseFloat(colorInput?.dataset?.alpha || '0.15'), 0, 1, 0.15);
        return {
            id: `${name || `group-${idx + 1}`}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name,
            colour: hexToRgba(hex, alpha),
            keywords,
            enabled: !!row.querySelector('.pref-colour-enabled')?.checked
        };
    }).filter(group => group.name && group.keywords.length > 0);
}
function addPreferenceColourGroup() {
    const container = document.getElementById('prefColourGroupsList');
    if (!container) return;
    container.appendChild(createPreferenceColourGroupRow({ name: '', colour: 'rgba(128, 128, 128, 0.15)', keywords: [], enabled: true }));
    previewPreferenceColourGroups();
}
function removePreferenceColourGroup(btn) {
    const row = btn?.closest('.pref-colour-row');
    const container = row?.parentElement;
    if (!row || !container) return;
    row.remove();
    if (!container.querySelector('.pref-colour-row')) {
        container.appendChild(createPreferenceColourGroupRow({ name: '', colour: 'rgba(128, 128, 128, 0.15)', keywords: [], enabled: true }));
    }
    previewPreferenceColourGroups();
}
function previewPreferenceColourGroups() {
    const previewGroups = normalizeAutoColourGroups(readPreferenceColourGroups());
    window.previewAutoColourGroups = previewGroups;
    renderManualColorGridFromPreferences(previewGroups);
    renderAutoColourDiagnostics(previewGroups);
    if (window.enableColors) updateSessionTable();
    updatePreferencesDirtyState();
}
function resetPreferencesToDefault() {
    window.preferences = getDefaultPreferences();
    savePreferencesToStorage();
    renderPreferencesUI();
    if (window.enableColors) updateSessionTable();
    autoSave();
    alert('Preferences reset to defaults.');
}
function exportPreferences() {
    const data = JSON.stringify(normalizePreferences(window.preferences), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'studio_preferences.json';
    a.click();
}
function importPreferences(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target.result);
            if (Array.isArray(parsed?.hardNormals)) {
                equipment.hardNormals = normalizeHardNormals(parsed.hardNormals);
            }
            window.preferences = normalizePreferences(parsed);
            savePreferencesToStorage();
            renderPreferencesUI();
            if (window.enableColors) updateSessionTable();
            autoSave();
            alert('Preferences imported.');
        } catch (err) {
            alert('Invalid preferences file.');
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

// ==========================================
// UI & UTILITY FUNCTIONS
// ==========================================
function toggleSessionPanel(panelId) {
    const target = document.getElementById(panelId);
    if (!target) return;
    const shouldOpen = target.style.display === 'none' || target.style.display === '';
    closeAllSetupPanels();
    if (shouldOpen) {
        const wrapper = target.parentElement;
        if (wrapper && wrapper.classList.contains('panel-box')) wrapper.style.display = 'block';
        target.style.display = 'flex';
    }
}
function closeAllSetupPanels() {
    ['channelPanel', 'columnPanel', 'lockPanel', 'colorPanel'].forEach(id => {
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.style.display = 'none';
        const wrapper = panel.parentElement;
        if (wrapper && wrapper.classList.contains('panel-box')) wrapper.style.display = 'none';
    });
}
function closeSetupMenu() {
    const menu = document.getElementById('setupMenu');
    if (menu) menu.style.display = 'none';
}
function closeDataMenu() {
    const menu = document.getElementById('dataMenu');
    if (menu) menu.style.display = 'none';
    updateDataMenuButton(false);
}
function toggleSetupMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('setupMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
}
function toggleDataMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('dataMenu');
    if (!menu) return;
    const isOpen = menu.style.display === 'none' || menu.style.display === '';
    menu.style.display = isOpen ? 'block' : 'none';
    updateDataMenuButton(isOpen);
}
function updateDataMenuButton(isOpen) {
    const btn = document.getElementById('dataMenuBtn');
    if (!btn) return;
    btn.textContent = isOpen ? 'Data ▴' : 'Data ▾';
}
function openSetupPanel(panelId) {
    toggleSessionPanel(panelId);
    closeSetupMenu();
}
function toggleInventoryTotals() {
    const wrap = document.getElementById('inventoryTotalsWrap');
    const btn = document.getElementById('inventoryTotalsToggleBtn');
    if (!wrap || !btn) return;
    const willOpen = wrap.style.display === 'none' || wrap.style.display === '';
    wrap.style.display = willOpen ? 'block' : 'none';
    btn.textContent = willOpen ? 'Totals ▴' : 'Totals ▾';
}
function toggleInventoryBrowser() {
    const wrap = document.getElementById('inventoryBrowserWrap');
    const btn = document.getElementById('inventoryBrowserToggleBtn');
    if (!wrap || !btn) return;
    const willOpen = wrap.style.display === 'none' || wrap.style.display === '';
    wrap.style.display = willOpen ? 'block' : 'none';
    btn.textContent = willOpen ? 'Hide ▴' : 'Show ▾';
    if (willOpen) updateEquipmentTables();
}
function closeInventorySetupMenu() {
    const menu = document.getElementById('inventorySetupMenu');
    if (menu) menu.style.display = 'none';
}
function toggleInventorySetupMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('inventorySetupMenu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
}
function renderManualColorChannelOptions() {
    const select = document.getElementById('manualColorChannel');
    if (!select) return;
    const prev = parseInt(select.value || '0');
    select.innerHTML = sessionData
        .map((s, idx) => `<option value="${idx}">Ch ${idx + 1}${s.source ? ` - ${s.source}` : ''}</option>`)
        .join('');
    if (sessionData.length === 0) return;
    const safe = Number.isInteger(prev) && prev >= 0 && prev < sessionData.length ? prev : 0;
    select.value = String(safe);
    syncManualColourSelectionToChannel();
}
function getManualColourShortLabel(name, idx) {
    const raw = `${name || ''}`.trim();
    if (!raw) return `C${idx + 1}`;
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
        return words.slice(0, 4).map(w => w[0]).join('').toUpperCase();
    }
    return raw.replace(/[^A-Za-z0-9]/g, '').slice(0, 4) || `C${idx + 1}`;
}
function renderManualColorGridFromPreferences(groups = null) {
    const grid = document.getElementById('manualColorGrid');
    if (!grid) return;
    const sourceGroups = Array.isArray(groups)
        ? groups
        : ((Array.isArray(window.previewAutoColourGroups) && window.previewAutoColourGroups.length)
            ? window.previewAutoColourGroups
            : (window.preferences?.autoColour?.groups || []));
    const cleanGroups = sourceGroups.filter(g => g && g.colour);
    let html = `<div class="manual-color-item"><button type="button" class="manual-color-btn active" data-auto="1" title="Auto (source-based)" style="background: linear-gradient(45deg, var(--bg-secondary), var(--bg-tertiary));" onclick="selectManualColor('', this)"></button><span class="manual-color-label">Auto</span></div>`;
    cleanGroups.forEach((group, idx) => {
        const colour = `${group.colour || ''}`.trim();
        const name = `${group.name || `Group ${idx + 1}`}`.trim();
        if (!colour) return;
        html += `<div class="manual-color-item"><button type="button" class="manual-color-btn" data-colour="${escapeHtml(colour)}" title="${escapeHtml(name)}" onclick="selectManualColor('${escapeHtml(colour)}', this)"></button><span class="manual-color-label">${escapeHtml(getManualColourShortLabel(name, idx))}</span></div>`;
    });
    grid.innerHTML = html;
    refreshManualColourSwatches();
    syncManualColourSelectionToChannel();
}
function selectManualColor(color, btnEl) {
    window.selectedManualRowColor = color;
    const grid = document.getElementById('manualColorGrid');
    if (!grid) return;
    grid.querySelectorAll('.manual-color-btn').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}
function applyManualColorOverride() {
    const select = document.getElementById('manualColorChannel');
    if (!select) return;
    const idx = parseInt(select.value, 10);
    if (!Number.isInteger(idx) || idx < 0 || idx >= sessionData.length) return;
    const nextColor = window.selectedManualRowColor || '';
    const prevColor = window.manualRowColors[idx] || '';
    if (prevColor === nextColor) return;
    pushHistory();
    window.manualRowColors[idx] = nextColor;
    updateSessionTable();
    autoSave();
}
function clearManualColorOverride() {
    const select = document.getElementById('manualColorChannel');
    if (!select) return;
    const idx = parseInt(select.value, 10);
    if (!Number.isInteger(idx) || idx < 0 || idx >= sessionData.length) return;
    if (!(idx in window.manualRowColors)) return;
    pushHistory();
    delete window.manualRowColors[idx];
    updateSessionTable();
    autoSave();
}
function clearAllManualColorOverrides() {
    if (!window.manualRowColors || Object.keys(window.manualRowColors).length === 0) return;
    pushHistory();
    window.manualRowColors = {};
    updateSessionTable();
    autoSave();
}

function toggleColumn(columnName) {
    const isChecked = document.getElementById(`toggle-${columnName}`).checked;
    document.querySelectorAll(`.col-${columnName}`).forEach(el => {
        isChecked ? el.classList.remove('hidden') : el.classList.add('hidden');
    });
}

function clearColumn(col) {
    if (window.isSessionLocked) return;
    pushHistory();
    sessionData.forEach((s) => { if (s[col]) { clearPrev(s[col], col); s[col] = ''; } });
    refreshAppUI();
}
window.toggleColumnPin = function(col) {
    window.pinnedColumns[col] = !window.pinnedColumns[col];
    const btn = document.querySelector(`.header-pin-btn[data-col="${col}"]`);
    if (btn) btn.classList.toggle('is-pinned', window.pinnedColumns[col]);
    autoSave();
};

function clearRow(index) {
    if (window.isSessionLocked) return;
    if (index < 0 || index >= sessionData.length) return;
    pushHistory();
    clearRowFields(index);
    updateUnitStatus('preampUnits');
    updateUnitStatus('adUnits');
    updateUnitStatus('tieLines');
    refreshAppUI();
}

function clearRowFields(index) {
    const row = sessionData[index];
    if (!row) return;
    const fields = ['source', 'microphone', 'tieLine', 'preamp', 'outboard1', 'outboard2', 'outboard3', 'ad', 'recall', 'notes'];
    fields.forEach(field => {
        if (row[field]) {
            if (!['source', 'notes', 'recall'].includes(field)) clearPrev(row[field], field);
            row[field] = '';
        }
    });
}

function clearRowRange(startIdx, endIdx) {
    if (window.isSessionLocked) return;
    const min = Math.max(0, Math.min(startIdx, endIdx));
    const max = Math.min(sessionData.length - 1, Math.max(startIdx, endIdx));
    pushHistory();
    for (let i = min; i <= max; i++) clearRowFields(i);
    updateUnitStatus('preampUnits');
    updateUnitStatus('adUnits');
    updateUnitStatus('tieLines');
    refreshAppUI();
}

function clearSessionBoard() {
    if (window.isSessionLocked) return;
    if (!confirm('Clear all assignments from every row?')) return;
    clearRowRange(0, sessionData.length - 1);
}

window.insertSessionRow = function(index) {
    if (window.isSessionLocked) return;
    pushHistory();
    const locks = window.pinnedColumns || {};
    const lockedData = sessionData.map(s => ({ tieLine: s.tieLine, preamp: s.preamp, outboard1: s.outboard1, outboard2: s.outboard2, outboard3: s.outboard3, ad: s.ad }));
    const newRow = { channel: 0, source: '', microphone: '', tieLine: '', preamp: '', outboard1: '', outboard2: '', outboard3: '', ad: '', recall: '', notes: '' };
    sessionData.splice(index + 1, 0, newRow);
    sessionData.forEach((s, i) => {
        s.channel = i + 1;
        if (i < lockedData.length) {
            if (locks.tieLine) s.tieLine = lockedData[i].tieLine;
            if (locks.preamp) s.preamp = lockedData[i].preamp;
            if (locks.outboard1) s.outboard1 = lockedData[i].outboard1;
            if (locks.outboard2) s.outboard2 = lockedData[i].outboard2;
            if (locks.outboard3) s.outboard3 = lockedData[i].outboard3;
            if (locks.ad) s.ad = lockedData[i].ad;
        } else {
            if (locks.tieLine) s.tieLine = '';
            if (locks.preamp) s.preamp = '';
            if (locks.outboard1) s.outboard1 = '';
            if (locks.outboard2) s.outboard2 = '';
            if (locks.outboard3) s.outboard3 = '';
            if (locks.ad) s.ad = '';
        }
    });
    updateSessionTable();
    autoSave();
};

window.deleteSessionRow = function(index) {
    if (window.isSessionLocked) return;
    if (sessionData.length <= 1) return alert("Cannot delete the last channel.");
    pushHistory();
    const locks = window.pinnedColumns || {};
    const rowToDelete = sessionData[index];
    const bottomRow = sessionData[sessionData.length - 1];
    ['tieLine', 'preamp', 'outboard1', 'outboard2', 'outboard3', 'ad'].forEach(field => {
        if (!locks[field] && rowToDelete[field]) clearPreviousSelection(index, field);
        if (locks[field] && bottomRow[field]) clearPreviousSelection(sessionData.length - 1, field);
    });
    const lockedData = sessionData.map(s => ({ tieLine: s.tieLine, preamp: s.preamp, outboard1: s.outboard1, outboard2: s.outboard2, outboard3: s.outboard3, ad: s.ad }));
    sessionData.splice(index, 1);
    sessionData.forEach((s, i) => {
        s.channel = i + 1;
        if (locks.tieLine) s.tieLine = lockedData[i].tieLine;
        if (locks.preamp) s.preamp = lockedData[i].preamp;
        if (locks.outboard1) s.outboard1 = lockedData[i].outboard1;
        if (locks.outboard2) s.outboard2 = lockedData[i].outboard2;
        if (locks.outboard3) s.outboard3 = lockedData[i].outboard3;
        if (locks.ad) s.ad = lockedData[i].ad;
    });
    refreshAppUI();
};

function updateSessionSummary() {
    document.getElementById('mics-used').textContent = sessionData.filter(s => s.microphone).length;
    document.getElementById('preamps-used').textContent = sessionData.filter(s => s.preamp).length;
    document.getElementById('ad-used').textContent = sessionData.filter(s => s.ad).length;
    document.getElementById('total-channels').textContent = sessionData.length;
    const channelCountBadge = document.getElementById('channelCountBadge');
    if (channelCountBadge) channelCountBadge.textContent = `${sessionData.length} Ch`;
    renderManualColorChannelOptions();
    populateTemplateChannelSelects();
    updateCopyButtonTooltip();
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    if(tabName === 'inventory') {
        refreshAppUI(true);
    } else if (tabName === 'presets') {
        populateTemplateChannelSelects();
        applyTemplateFieldDefaultsFromSession();
    } else if (tabName === 'preferences') {
        renderPreferencesUI();
    }
}

function updateUnitStatus(unitType) {
    equipment[unitType].forEach(unit => {
        if (unit.status !== 'repair' && unit.status !== 'loaned') {
            const avail = unit.channels.filter(ch => ch.status === 'available').length;
            unit.status = avail === 0 ? 'unavailable' : (avail === unit.channels.length ? 'available' : 'partial');
        }
    });
}

window.invViewMode = 'grid';
window.invPanelState = window.invPanelState || {};
window.setInvView = function(mode) {
    window.invViewMode = mode;
    document.getElementById('btn-view-grid').style.background = mode === 'grid' ? 'var(--button-bg)' : 'transparent';
    document.getElementById('btn-view-grid').style.color = mode === 'grid' ? 'var(--accent-primary)' : 'var(--text-primary)';
    document.getElementById('btn-view-grid').style.borderColor = mode === 'grid' ? 'var(--accent-primary)' : 'var(--border-primary)';
    
    document.getElementById('btn-view-list').style.background = mode === 'list' ? 'var(--button-bg)' : 'transparent';
    document.getElementById('btn-view-list').style.color = mode === 'list' ? 'var(--accent-primary)' : 'var(--text-primary)';
    document.getElementById('btn-view-list').style.borderColor = mode === 'list' ? 'var(--accent-primary)' : 'var(--border-primary)';
    updateEquipmentTables();
};
window.toggleInvPanel = function(headerEl, panelKey) {
    const content = headerEl.nextElementSibling;
    if (!content) return;
    const willOpen = content.style.display === 'none';
    content.style.display = willOpen ? 'block' : 'none';
    window.invPanelState[panelKey] = willOpen;
};

window.filterInv = function(btn, category) {
    const btnContainer = btn.parentElement;
    btnContainer.querySelectorAll('button').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-primary)';
        b.style.border = '1px solid var(--border-primary)';
    });
    btn.style.background = 'var(--button-bg)';
    btn.style.color = 'var(--accent-primary)';
    btn.style.border = '1px solid var(--accent-primary)';
    
    const grid = btnContainer.nextElementSibling;
    grid.querySelectorAll('.inv-item').forEach(item => {
        if (category === 'all' || item.dataset.category === category) item.style.display = 'block';
        else item.style.display = 'none';
    });
};

function updateEquipmentTables() {
    const browser = document.getElementById('equipmentBrowser');
    if (!browser) return;
    browser.querySelectorAll('[data-panel-key]').forEach(panel => {
        const key = panel.dataset.panelKey;
        const content = panel.querySelector('.inv-panel-content');
        if (key && content) window.invPanelState[key] = content.style.display !== 'none';
    });

    const isGrid = window.invViewMode === 'grid';
    const containerStyle = isGrid 
        ? 'display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;'
        : 'display: flex; flex-direction: column; gap: 4px;';
        
    const itemStyle = isGrid
        ? 'padding: 10px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary);'
        : 'padding: 6px 12px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); display: flex; justify-content: space-between; align-items: center;';

    const genHTML = (title, items, isMulti) => {
        if (!items || items.length === 0) return '';
        
        let filterHTML = '';
        let processedItemsHTML = '';

        if (!isMulti) {
            const categories =[...new Set(items.map(i => i.category).filter(Boolean))];
            if (categories.length > 0) {
                filterHTML = `<div style="padding: 10px 15px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); display: flex; gap: 8px; flex-wrap: wrap;">
                    <button style="padding: 4px 12px; font-size: 12px; border-radius: 4px; cursor: pointer; background: var(--button-bg); color: var(--accent-primary); border: 1px solid var(--accent-primary);" onclick="filterInv(this, 'all')">All</button>
                    ${categories.map(c => `<button style="padding: 4px 12px; font-size: 12px; border-radius: 4px; cursor: pointer; background: transparent; color: var(--text-primary); border: 1px solid var(--border-primary);" onclick="filterInv(this, '${c}')">${escapeHtml(c)}</button>`).join('')}
                </div>`;
            }

            const groups = {};
            items.forEach(item => {
                const baseName = item.name; 
                if (!groups[baseName]) {
                    groups[baseName] = { baseName, category: item.category, make: item.make, total: 0, available: 0, inUse: 0 };
                }
                groups[baseName].total++;
                if (item.status === 'available') groups[baseName].available++;
                if (item.status === 'in-use') groups[baseName].inUse++;
            });

            Object.values(groups).forEach(group => {
                let color = '#28a745'; 
                if (group.inUse > 0) color = group.inUse === group.total ? '#dc3545' : '#ffc107'; 
                
                const statusText = group.total === 1 
                    ? (group.inUse === 1 ? 'In Session' : 'Available')
                    : `${group.available}/${group.total} Available`;
                
                const makeHtml = group.make ? `<span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(group.make)}</span>` : '';
                    
                const content = isGrid 
                    ? `<div style="display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;"><strong>${escapeHtml(group.baseName)}</strong>${makeHtml}</div><div style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">${escapeHtml(group.category || '')} • ${statusText}</div>`
                    : `<div style="display: flex; align-items: baseline; gap: 8px; flex: 1; min-width: 0;"><strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(group.baseName)}</strong>${makeHtml}</div><div style="display: flex; align-items: center; gap: 15px; flex-shrink: 0;"><span style="font-size: 12px; color: var(--text-secondary); width: 100px; text-align: left;">${escapeHtml(group.category || '')}</span><span style="font-size: 12px; font-weight: var(--ui-weight-strong); color: ${color}; width: 100px; text-align: right;">${statusText}</span></div>`;
                    
                processedItemsHTML += `<div class="inv-item" data-category="${group.category || ''}" style="${itemStyle} border-left: 4px solid ${color};">${content}</div>`;
            });
        } else {
            items.forEach(unit => {
                const inUseCount = unit.channels.filter(c => c.status === 'in-use').length;
                let color = '#28a745'; 
                if (inUseCount > 0) color = inUseCount === unit.channels.length ? '#dc3545' : '#ffc107'; 
                
                const makeHtml = unit.make ? `<span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(unit.make)}</span>` : '';

                const content = isGrid
                    ? `<div style="display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap;"><strong>${escapeHtml(unit.name)}</strong>${makeHtml}</div><div style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">${unit.channels.length - inUseCount}/${unit.channels.length} ch available</div>`
                    : `<div style="display: flex; align-items: baseline; gap: 8px; flex: 1; min-width: 0;"><strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(unit.name)}</strong>${makeHtml}</div><div style="display: flex; align-items: center; gap: 15px; flex-shrink: 0;"><span style="font-size: 12px; font-weight: var(--ui-weight-strong); color: ${color}; width: 150px; text-align: right;">${unit.channels.length - inUseCount}/${unit.channels.length} ch available</span></div>`;

                processedItemsHTML += `<div style="${itemStyle} border-left: 4px solid ${color};">${content}</div>`;
            });
        }

        return `<div data-panel-key="${title}" style="margin-bottom: 10px; border: 1px solid var(--border-primary); border-radius: 6px; overflow: hidden;">
            <div style="background: var(--bg-quaternary); padding: 12px 15px; font-weight: var(--ui-weight-strong); cursor: pointer; user-select: none;" onclick="toggleInvPanel(this, '${title}')">${title} ▾</div>
            <div class="inv-panel-content" style="display: ${window.invPanelState[title] ? 'block' : 'none'};">
                ${filterHTML}
                <div style="padding: 15px; background: var(--bg-secondary); ${containerStyle}">
                    ${processedItemsHTML}
                </div>
            </div>
        </div>`;
    };

    browser.innerHTML = 
        genHTML('Microphones', equipment.microphones, false) + 
        genHTML('Outboard Gear', equipment.outboard, false) + 
        genHTML('Preamps', equipment.preampUnits, true) + 
        genHTML('Tie Lines & Wall Boxes', equipment.tieLines, true) + 
        genHTML('A/D Converters', equipment.adUnits, true);
}

function updateSummary() {
    const gearStatusSummary = document.getElementById('gearStatusSummary');
    if(!gearStatusSummary) return;

    const usedMics = equipment.microphones ? equipment.microphones.filter(m => m.status === 'in-use').length : 0;
    const availMics = equipment.microphones ? equipment.microphones.filter(m => m.status === 'available').length : 0;
    const usedOut = equipment.outboard ? equipment.outboard.filter(o => o.status === 'in-use').length : 0;
    const availOut = equipment.outboard ? equipment.outboard.filter(o => o.status === 'available').length : 0;

    const countCh = (units, status) => units ? units.reduce((acc, u) => acc + u.channels.filter(c => c.status === status).length, 0) : 0;

    gearStatusSummary.innerHTML = `
        <strong>Microphones:</strong> ${usedMics} in use / ${availMics} available<br>
        <strong>Preamps:</strong> ${countCh(equipment.preampUnits, 'in-use')} in use / ${countCh(equipment.preampUnits, 'available')} available<br>
        <strong>Tie Lines:</strong> ${countCh(equipment.tieLines, 'in-use')} in use / ${countCh(equipment.tieLines, 'available')} available<br>
        <strong>Outboard:</strong> ${usedOut} in use / ${availOut} available<br>
        <strong>A/D Converters:</strong> ${countCh(equipment.adUnits, 'in-use')} in use / ${countCh(equipment.adUnits, 'available')} available
    `;
    const pullListEl = document.getElementById('pullList');
    if (pullListEl) {
        const getMicUnitSizeFromName = (name) => {
            const micFromInventory = (equipment.microphones || []).find(m => m.name === name);
            const fromInventory = Math.max(1, parseInt(micFromInventory?.channelsPerUnit, 10) || 1);
            if (fromInventory > 1) return fromInventory;
            const n = `${name || ''}`.toLowerCase();
            // Heuristic: treat clearly stereo-marked mics as 1 physical unit across 2 channels.
            if (/(\br88\b|\bstereo\b|\(stereo\))/.test(n)) return 2;
            return 1;
        };

        const micAssignments = [];
        const otherGearCounts = new Map();
        const addCount = (map, key) => {
            const k = `${key || ''}`.trim();
            if (!k) return;
            map.set(k, (map.get(k) || 0) + 1);
        };

        sessionData.forEach((s, idx) => {
            const chLabel = `Ch ${Number.isInteger(s.channel) ? s.channel : (idx + 1)}`;
            if (s.microphone) micAssignments.push({ name: s.microphone, channel: chLabel });
            addCount(otherGearCounts, s.outboard1);
            addCount(otherGearCounts, s.outboard2);
            addCount(otherGearCounts, s.outboard3);
        });

        const micGrouped = new Map();
        micAssignments.forEach(entry => {
            if (!micGrouped.has(entry.name)) micGrouped.set(entry.name, []);
            micGrouped.get(entry.name).push(entry.channel);
        });

        const micLines = Array.from(micGrouped.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, channels]) => {
                const usedChannels = channels.length;
                const unitSize = getMicUnitSizeFromName(name);
                const unitsNeeded = Math.ceil(usedChannels / unitSize);
                const unitText = unitsNeeded === 1 ? 'unit' : 'units';
                const channelText = channels.join(', ');
                if (unitSize > 1) {
                    return `<li><strong>${name}</strong> - ${unitsNeeded} ${unitText} (${usedChannels} channels: ${channelText})</li>`;
                }
                return `<li><strong>${name}</strong> x${usedChannels} (${channelText})</li>`;
            });

        const otherLines = Array.from(otherGearCounts.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, count]) => `<li>${name}${count > 1 ? ` x${count}` : ''}</li>`);

        const pullLines = [...micLines, ...otherLines];
        if (pullLines.length === 0) {
            pullListEl.innerHTML = '<span style="color: var(--text-muted);">No physical gear assigned yet.</span>';
        } else {
            pullListEl.innerHTML = `<ul style="margin: 0; padding-left: 20px;">
                ${pullLines.join('')}
            </ul>`;
        }
    }
}

// ==========================================
// CHUNK TEMPLATE ENGINE
// ==========================================
function getTemplateFieldSelection(mode) {
    return TEMPLATE_FIELDS
        .map(f => {
            const input = document.getElementById(`tpl-${mode}-${f.key}`);
            return input && input.checked ? f.key : null;
        })
        .filter(Boolean);
}

function getTemplateFieldsForTemplate(t) {
    return Array.isArray(t.fields) && t.fields.length > 0
        ? t.fields
        : TEMPLATE_FIELDS.map(f => f.key);
}

function getChannelLabel(idx) {
    const ch = sessionData[idx];
    if (!ch) return `Ch ${idx + 1}`;
    const source = (ch.source || '').trim();
    return source ? `Ch ${idx + 1} - ${source}` : `Ch ${idx + 1}`;
}

function renderTemplateFieldSelectors() {
    const saveWrap = document.getElementById('saveTemplateFields');
    const loadWrap = document.getElementById('loadTemplateFields');
    if (!saveWrap || !loadWrap) return;
    saveWrap.innerHTML = TEMPLATE_FIELDS.map(f =>
        `<input class="segment-input" type="checkbox" id="tpl-save-${f.key}" ${f.defaultOn ? 'checked' : ''}><label class="segment-chip" for="tpl-save-${f.key}">${f.label}</label>`
    ).join('');
    loadWrap.innerHTML = TEMPLATE_FIELDS.map(f =>
        `<input class="segment-input" type="checkbox" id="tpl-load-${f.key}" ${f.defaultOn ? 'checked' : ''}><label class="segment-chip" for="tpl-load-${f.key}">${f.label}</label>`
    ).join('');
    applyTemplateFieldDefaultsFromSession();
}

function setTemplateFieldSelection(mode, checked) {
    TEMPLATE_FIELDS.forEach(f => {
        const input = document.getElementById(`tpl-${mode}-${f.key}`);
        if (input) input.checked = checked;
    });
}

function getSessionVisibleTemplateFields() {
    const visible = ['source'];
    const map = [
        ['microphone', 'toggle-microphone'],
        ['tieLine', 'toggle-tieLine'],
        ['preamp', 'toggle-preamp'],
        ['outboard1', 'toggle-outboard1'],
        ['outboard2', 'toggle-outboard2'],
        ['outboard3', 'toggle-outboard3'],
        ['ad', 'toggle-ad'],
        ['recall', 'toggle-recall'],
        ['notes', 'toggle-notes']
    ];
    map.forEach(([field, toggleId]) => {
        const toggle = document.getElementById(toggleId);
        if (!toggle || toggle.checked) visible.push(field);
    });
    return visible;
}

function applyTemplateFieldDefaultsFromSession() {
    const defaults = getSessionVisibleTemplateFields();
    TEMPLATE_FIELDS.forEach(f => {
        const saveInput = document.getElementById(`tpl-save-${f.key}`);
        const loadInput = document.getElementById(`tpl-load-${f.key}`);
        const on = defaults.includes(f.key);
        if (saveInput) saveInput.checked = on;
        if (loadInput) loadInput.checked = on;
    });
}

function populateTemplateChannelSelects() {
    const saveStart = document.getElementById('saveTempStart');
    const saveEnd = document.getElementById('saveTempEnd');
    const loadTarget = document.getElementById('loadTempTarget');
    if (!saveStart || !saveEnd || !loadTarget) return;

    const prevSaveStart = parseInt(saveStart.value) || 1;
    const prevSaveEnd = parseInt(saveEnd.value) || Math.min(8, sessionData.length || 1);
    const prevLoadTarget = parseInt(loadTarget.value) || 1;
    const options = sessionData.map((_, idx) => `<option value="${idx + 1}">${getChannelLabel(idx)}</option>`).join('');

    saveStart.innerHTML = options;
    saveEnd.innerHTML = options;
    loadTarget.innerHTML = options;

    const max = Math.max(1, sessionData.length);
    saveStart.value = String(Math.min(Math.max(1, prevSaveStart), max));
    saveEnd.value = String(Math.min(Math.max(parseInt(saveStart.value), prevSaveEnd), max));
    loadTarget.value = String(Math.min(Math.max(1, prevLoadTarget), max));
    normalizeSaveTemplateRange();
}

function normalizeSaveTemplateRange() {
    const startSel = document.getElementById('saveTempStart');
    const endSel = document.getElementById('saveTempEnd');
    if (!startSel || !endSel) return;
    const start = parseInt(startSel.value || '1');
    const end = parseInt(endSel.value || '1');
    if (end < start) endSel.value = String(start);
}

function syncLoadFieldsFromTemplate() {
    const idx = document.getElementById('loadTempSelect')?.value;
    if (idx === "" || idx == null) return;
    const t = customTemplates[idx];
    if (!t) return;
    const activeFields = getTemplateFieldsForTemplate(t);
    TEMPLATE_FIELDS.forEach(f => {
        const input = document.getElementById(`tpl-load-${f.key}`);
        if (input) input.checked = activeFields.includes(f.key);
    });
}

function openLoadConflictModal(conflictCount) {
    return new Promise((resolve) => {
        const modal = document.getElementById('loadConflictModal');
        const text = document.getElementById('loadConflictText');
        window.loadConflictResolver = resolve;
        if (text) {
            text.textContent = `${conflictCount} target field${conflictCount === 1 ? '' : 's'} already contain data. Choose whether to overwrite those values or keep them and load the rest.`;
        }
        if (modal) modal.style.display = 'block';
    });
}

function closeLoadConflictModal(action, event) {
    if (event && event.target && event.target.id !== 'loadConflictModal') return;
    const modal = document.getElementById('loadConflictModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.loadConflictResolver === 'function') {
        window.loadConflictResolver(action || 'cancel');
        window.loadConflictResolver = null;
    }
}

function saveTemplate() {
    const name = document.getElementById('saveTempName').value.trim();
    const start = parseInt(document.getElementById('saveTempStart').value);
    const end = parseInt(document.getElementById('saveTempEnd').value);
    const selectedFields = getTemplateFieldSelection('save');
    
    if (!name) return alert("Please enter a name for the template.");
    if (start > end || start < 1 || end > sessionData.length) return alert("Invalid channel range.");
    if (selectedFields.length === 0) return alert("Select at least one column to save.");
    pushHistory();

    const chunk =[];
    for (let i = start - 1; i < end; i++) {
        const rowData = {};
        selectedFields.forEach(field => { rowData[field] = sessionData[i][field]; });
        chunk.push(rowData);
    }
    const channelLabels = [];
    for (let i = start - 1; i < end; i++) channelLabels.push(getChannelLabel(i));
    customTemplates.push({ name, length: (end - start) + 1, fields: selectedFields, channelLabels, chunk });
    updateTemplateUI();
    alert(`Template '${name}' saved!`);
    document.getElementById('saveTempName').value = '';
    autoSave();
}

async function loadTemplate() {
    const tIdx = document.getElementById('loadTempSelect').value;
    const targetStart = parseInt(document.getElementById('loadTempTarget').value) - 1;
    const loadFields = getTemplateFieldSelection('load');
    if (tIdx === "") return alert("Please select a template.");
    if (loadFields.length === 0) return alert("Select at least one column to load.");
    const t = customTemplates[tIdx];
    if (targetStart < 0 || targetStart + t.length > sessionData.length) return alert("Not enough channels available to drop this template here.");
    const templateFields = getTemplateFieldsForTemplate(t);
    const fieldsToLoad = templateFields.filter(f => loadFields.includes(f));
    // Ensure inventory state reflects current board before availability checks.
    recomputeMicrophoneUsageFromSession();
    updateUnitStatus('preampUnits');
    updateUnitStatus('adUnits');
    updateUnitStatus('tieLines');

    const isNonEmpty = (val) => `${val ?? ''}`.trim() !== '';
    const hasConflict = (targetRowIdx, field, val) => {
        if (!isNonEmpty(val)) return false;
        const existing = sessionData[targetRowIdx]?.[field];
        return isNonEmpty(existing) && `${existing}` !== `${val}`;
    };

    let conflictCount = 0;
    t.chunk.forEach((row, i) => {
        const targetChIdx = targetStart + i;
        fieldsToLoad.forEach(field => {
            if (hasConflict(targetChIdx, field, row[field])) conflictCount++;
        });
    });

    let loadMode = 'overwrite';
    if (conflictCount > 0) {
        loadMode = await openLoadConflictModal(conflictCount);
        if (loadMode === 'cancel') return;
    }

    pushHistory();

    let skipped =[];
    window.suspendHistory = true;
    try {
        t.chunk.forEach((row, i) => {
            const targetChIdx = targetStart + i;
            const shouldSkip = (field, val) => loadMode === 'skip' && hasConflict(targetChIdx, field, val);
            // Load text fields only if selected.
            ['source', 'recall', 'notes'].forEach(f => {
                if (fieldsToLoad.includes(f) && row[f] !== undefined && !shouldSkip(f, row[f])) {
                    sessionData[targetChIdx][f] = row[f];
                }
            });

            const tryAssign = (field, val) => {
                if (!val) return;
                if (shouldSkip(field, val)) return;
                // Check if it's available OR already assigned to this exact channel
                if (checkChannelAvailable(field, val) || sessionData[targetChIdx][field] === val) {
                    updateSessionData(targetChIdx, field, val);
                } else {
                    skipped.push(`Ch ${targetChIdx + 1}: ${val} (${field})`);
                }
            };

            ['microphone', 'tieLine', 'preamp', 'outboard1', 'outboard2', 'outboard3', 'ad']
                .filter(f => fieldsToLoad.includes(f))
                .forEach(f => tryAssign(f, row[f]));
        });
    } finally {
        window.suspendHistory = false;
    }
    
    updateSessionTable();
    if (skipped.length > 0) {
        alert("Template loaded!\n\nThe following gear was skipped because it is already in use elsewhere:\n\n" + skipped.join("\n"));
    } else {
        alert("Template loaded perfectly!");
    }
    autoSave();
}

function updateTemplateUI() {
    const select = document.getElementById('loadTempSelect');
    const listUI = document.getElementById('templateListUI');
    if (customTemplates.length === 0) {
        select.innerHTML = '<option value="">-- No Templates Saved Yet --</option>';
        listUI.innerHTML = '<p style="color:var(--text-secondary);">Your custom chunks will appear here.</p>';
        return;
    }
    select.innerHTML = customTemplates
        .map((t, i) => `<option value="${i}">${t.name} (${t.length} Channels)</option>`)
        .join('');
    syncLoadFieldsFromTemplate();
    listUI.innerHTML = customTemplates
        .map((t, i) => {
            const fieldLabels = TEMPLATE_FIELDS
                .filter(f => getTemplateFieldsForTemplate(t).includes(f.key))
                .map(f => f.label)
                .join(', ');
            return `<div style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-primary); margin-bottom: 10px;"><strong>${t.name}</strong><br><span style="color:var(--text-secondary); font-size:13px;">Spans ${t.length} channels • Columns: ${fieldLabels || 'All'}.</span><div style="display:flex; gap:8px; margin-top:8px;"><button class="btn-muted" type="button" style="padding:4px 10px; font-size:11px;" onclick="openTemplatePreview(${i})">Info</button><button class="btn-muted" type="button" style="padding:4px 10px; font-size:11px; color:#dc3545; border-color: color-mix(in srgb, #dc3545 60%, var(--border-primary));" onclick="deleteTemplate(${i})">Delete</button></div></div>`;
        })
        .join('');
}

function getTemplatePreviewColumns(templateFields) {
    const ordered = [
        { key: 'channel', label: 'Ch' },
        { key: 'source', label: 'Source' },
        { key: 'microphone', label: 'Microphone', toggle: 'microphone' },
        { key: 'tieLine', label: 'Tie Line', toggle: 'tieLine' },
        { key: 'preamp', label: 'Pre Amp', toggle: 'preamp' },
        { key: 'outboard1', label: 'Outboard 1', toggle: 'outboard1' },
        { key: 'outboard2', label: 'Outboard 2', toggle: 'outboard2' },
        { key: 'outboard3', label: 'Outboard 3', toggle: 'outboard3' },
        { key: 'ad', label: 'A/D Converter', toggle: 'ad' },
        { key: 'recall', label: 'Recall Notes', toggle: 'recall' },
        { key: 'notes', label: 'Notes', toggle: 'notes' }
    ];

    const columns = ordered.filter(col => {
        if (col.key === 'channel') return true;
        if (!templateFields.includes(col.key)) return false;
        if (!col.toggle) return true;
        const toggle = document.getElementById(`toggle-${col.toggle}`);
        return !toggle || toggle.checked;
    });

    // If all template fields are currently hidden in Session Setup,
    // fall back to template field order so preview remains useful.
    if (columns.length <= 1) {
        return ordered.filter(col => col.key === 'channel' || templateFields.includes(col.key));
    }
    return columns;
}

function escapeHtml(value) {
    return `${value ?? ''}`
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function openTemplatePreview(idx) {
    const t = customTemplates[idx];
    const modal = document.getElementById('templatePreviewModal');
    const title = document.getElementById('templatePreviewTitle');
    const body = document.getElementById('templatePreviewBody');
    if (!t || !modal || !title || !body) return;

    const fields = getTemplateFieldsForTemplate(t);
    title.textContent = `${t.name} - Template Preview`;

    const previewCols = getTemplatePreviewColumns(fields);
    let header = '';
    previewCols.forEach(col => {
        header += `<th>${col.label}</th>`;
    });
    let rows = '';
    t.chunk.forEach((row, i) => {
        let cells = '';
        previewCols.forEach(col => {
            if (col.key === 'channel') {
                const chLabel = (t.channelLabels && t.channelLabels[i]) ? t.channelLabels[i] : `Ch ${i + 1}`;
                cells += `<td>${escapeHtml(chLabel)}</td>`;
                return;
            }
            cells += `<td>${escapeHtml(row[col.key] || '')}</td>`;
        });
        rows += `<tr>${cells}</tr>`;
    });
    body.innerHTML = `<div style="overflow:auto; border:1px solid var(--border-primary); border-radius:8px;"><table style="width:100%; border-collapse:collapse; background:var(--bg-secondary);"><thead><tr>${header}</tr></thead><tbody>${rows || '<tr><td colspan="99" style="color:var(--text-secondary);">No rows in template.</td></tr>'}</tbody></table></div>`;
    modal.style.display = 'block';
}

function closeTemplatePreview(event) {
    if (event && event.target && event.target.id !== 'templatePreviewModal') return;
    const modal = document.getElementById('templatePreviewModal');
    if (modal) modal.style.display = 'none';
}
function closeDawExportModal(event) {
    if (event && event.target && event.target.id !== 'dawExportModal') return;
    const modal = document.getElementById('dawExportModal');
    if (modal) modal.style.display = 'none';
}

function deleteTemplate(idx) {
    if (confirm("Delete this template?")) {
        pushHistory();
        customTemplates.splice(idx, 1);
        updateTemplateUI();
        autoSave();
    }
}

// ==========================================
// DRAG & DROP REORDERING
// ==========================================
let draggedElement = null, draggedIndex = null, dragHandlersBound = false;
function clearSessionDragSelectedNumbers() {
    document.querySelectorAll('.channel-number.drag-selected').forEach(el => el.classList.remove('drag-selected'));
}
function reorderSessionRows(fromIndex, toIndex, focusMovedHandle = false) {
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return;
    if (fromIndex === toIndex) return;
    pushHistory();
    const locks = window.pinnedColumns || {};

    const lockedData = sessionData.map(s => ({
        tieLine: s.tieLine, preamp: s.preamp, outboard1: s.outboard1,
        outboard2: s.outboard2, outboard3: s.outboard3, ad: s.ad
    }));

    const moved = sessionData.splice(fromIndex, 1)[0];
    sessionData.splice(toIndex, 0, moved);

    sessionData.forEach((s, i) => {
        s.channel = i + 1;
        if (locks.tieLine) s.tieLine = lockedData[i].tieLine;
        if (locks.preamp) s.preamp = lockedData[i].preamp;
        if (locks.outboard1) s.outboard1 = lockedData[i].outboard1;
        if (locks.outboard2) s.outboard2 = lockedData[i].outboard2;
        if (locks.outboard3) s.outboard3 = lockedData[i].outboard3;
        if (locks.ad) s.ad = lockedData[i].ad;
    });

    updateSessionTable();
    autoSave();
    if (focusMovedHandle) {
        setTimeout(() => {
            const handle = document.querySelector(`.channel-reorder-handle[data-index="${toIndex}"]`);
            if (handle) handle.focus();
        }, 0);
    }
}
function handleSessionRowKeyReorder(event) {
    const key = event.key;
    if (key !== 'ArrowUp' && key !== 'ArrowDown') return;
    if (window.isSessionLocked || window.clearMode) return;
    const handle = event.currentTarget;
    const currentIdx = parseInt(handle?.dataset?.index || '-1', 10);
    if (!Number.isInteger(currentIdx) || currentIdx < 0) return;
    event.preventDefault();
    const targetIdx = key === 'ArrowUp' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= sessionData.length) return;
    reorderSessionRows(currentIdx, targetIdx, true);
}
function addDragAndDropHandlers() {
    const tbody = document.getElementById('sessionBody');
    if (!tbody || dragHandlersBound) return;

    tbody.addEventListener('dragstart', (e) => {
        const handle = e.target.closest('.channel-reorder-handle');
        if (!handle) return;
        if (window.isSessionLocked || window.clearMode) { e.preventDefault(); return; }
        draggedElement = handle;
        draggedIndex = parseInt(handle.dataset.index, 10);
        handle.classList.add('dragging');
        const numberBlock = handle.closest('tr')?.querySelector('.channel-number');
        if (numberBlock) numberBlock.classList.add('drag-selected');
    });

    tbody.addEventListener('dragend', (e) => {
        const handle = e.target.closest('.channel-reorder-handle');
        if (handle) handle.classList.remove('dragging');
        document.querySelectorAll('tr.session-drag-over').forEach(r => r.classList.remove('session-drag-over'));
        clearSessionDragSelectedNumbers();
        draggedElement = null;
        draggedIndex = null;
    });

    tbody.addEventListener('mousedown', (e) => {
        const handle = e.target.closest('.channel-reorder-handle');
        if (!handle) return;
        if (window.isSessionLocked || window.clearMode) return;
        clearSessionDragSelectedNumbers();
        const numberBlock = handle.closest('tr')?.querySelector('.channel-number');
        if (numberBlock) numberBlock.classList.add('drag-selected');
    });
    tbody.addEventListener('touchstart', (e) => {
        const handle = e.target.closest('.channel-reorder-handle');
        if (!handle) return;
        if (window.isSessionLocked || window.clearMode) return;
        clearSessionDragSelectedNumbers();
        const numberBlock = handle.closest('tr')?.querySelector('.channel-number');
        if (numberBlock) numberBlock.classList.add('drag-selected');
    }, { passive: true });
    document.addEventListener('mouseup', clearSessionDragSelectedNumbers);
    document.addEventListener('touchend', clearSessionDragSelectedNumbers, { passive: true });

    tbody.addEventListener('dragover', (e) => {
        e.preventDefault();
        const row = e.target.closest('tr');
        if(row && draggedElement) {
            document.querySelectorAll('tr.session-drag-over').forEach(r => r.classList.remove('session-drag-over'));
            row.classList.add('session-drag-over');
        }
    });

    tbody.addEventListener('drop', (e) => { 
        e.preventDefault(); 
        const row = e.target.closest('tr'); 
        if(row && draggedIndex !== null) { 
            const targetIndex = parseInt(row.dataset.index, 10);
            reorderSessionRows(draggedIndex, targetIndex, false);
        } 
        document.querySelectorAll('tr.session-drag-over').forEach(r => r.classList.remove('session-drag-over'));
        clearSessionDragSelectedNumbers();
    });

    dragHandlersBound = true;
}

function clearRangePreview(startIdx, endIdx) {
    const min = Math.min(startIdx, endIdx);
    const max = Math.max(startIdx, endIdx);
    document.querySelectorAll('#sessionBody tr').forEach((rowEl) => {
        const idx = parseInt(rowEl.dataset.index);
        if (idx >= min && idx <= max) rowEl.classList.add('clear-range-preview');
        else rowEl.classList.remove('clear-range-preview');
    });
}

function clearAllRangePreview() {
    document.querySelectorAll('#sessionBody tr.clear-range-preview').forEach(row => row.classList.remove('clear-range-preview'));
}

function initClearModeHandlers() {
    if (clearModeHandlersBound) return;
    const table = document.getElementById('sessionTable');
    if (!table) return;

    table.addEventListener('focusin', (e) => {
        if (e.target.matches('input, select, textarea')) {
            exitClearModeForEditing();
        }
    });
    table.addEventListener('mousedown', (e) => {
        if (e.target.matches('input, select, textarea')) {
            exitClearModeForEditing();
        }
    });

    table.addEventListener('click', (e) => {
        if (!window.clearMode || window.isSessionLocked) return;
        if (suppressClearClick) { suppressClearClick = false; return; }

        const th = e.target.closest('th');
        if (th) {
            const colClass = Array.from(th.classList).find(c => c.startsWith('col-'));
            if (!colClass) {
                exitClearModeForEditing();
                return;
            }
            const col = colClass.replace('col-', '');
            if (col === 'channel') {
                touchClearModeActivity();
                return;
            }
            touchClearModeActivity();
            clearColumn(col);
            return;
        }

        const channelCell = e.target.closest('td.col-channel');
        if (channelCell) {
            const rowEl = channelCell.closest('tr');
            if (!rowEl) {
                exitClearModeForEditing();
                return;
            }
            touchClearModeActivity();
            clearRow(parseInt(rowEl.dataset.index));
            return;
        }

        // Exit clear mode if click wasn't on a clear target.
        exitClearModeForEditing();
    });

    table.addEventListener('mousedown', (e) => {
        if (!window.clearMode || window.isSessionLocked) return;
        const channelCell = e.target.closest('td.col-channel');
        if (!channelCell) return;
        const rowEl = channelCell.closest('tr');
        if (!rowEl) return;
        touchClearModeActivity();
        clearDragActive = true;
        clearDragStartIndex = parseInt(rowEl.dataset.index);
        clearDragCurrentIndex = clearDragStartIndex;
        clearRangePreview(clearDragStartIndex, clearDragCurrentIndex);
        e.preventDefault();
    });

    table.addEventListener('mouseover', (e) => {
        if (!clearDragActive || !window.clearMode) return;
        const rowEl = e.target.closest('tr[data-index]');
        if (!rowEl) return;
        touchClearModeActivity();
        clearDragCurrentIndex = parseInt(rowEl.dataset.index);
        clearRangePreview(clearDragStartIndex, clearDragCurrentIndex);
    });

    document.addEventListener('mouseup', () => {
        if (!clearDragActive) return;
        clearDragActive = false;
        if (clearDragStartIndex !== null && clearDragCurrentIndex !== null) {
            if (clearDragStartIndex === clearDragCurrentIndex) {
                clearRow(clearDragStartIndex);
            } else {
                clearRowRange(clearDragStartIndex, clearDragCurrentIndex);
                suppressClearClick = true;
            }
        }
        clearDragStartIndex = null;
        clearDragCurrentIndex = null;
        clearAllRangePreview();
    });

    clearModeHandlersBound = true;
}

// ==========================================
// PDF / PRINT EXPORT (VISIBLE COLUMNS ONLY)
// ==========================================
function exportToPrintable() {
    const prefs = normalizePreferences(window.preferences);
    const printEmpty = prefs.pdfExport?.printEmptyRows === true;
    // 1. Get channels (either all, or only those with data)
    const activeChannels = printEmpty ? sessionData : sessionData.filter(session => 
        session.source.trim() !== '' || session.microphone !== '' || session.tieLine !== '' || 
        session.preamp !== '' || session.ad !== '' || session.outboard1 !== '' ||
        session.outboard2 !== '' || session.outboard3 !== '' || session.notes.trim() !== '' || session.recall.trim() !== ''
    );

    if (activeChannels.length === 0) {
        alert('No session data to export. Please add some sources or equipment assignments first.');
        return;
    }

    // 2. Check which columns are currently checked in your UI
    const cols = {
        microphone: document.getElementById('toggle-microphone') ? document.getElementById('toggle-microphone').checked : false,
        tieLine: document.getElementById('toggle-tieLine') ? document.getElementById('toggle-tieLine').checked : false,
        preamp: document.getElementById('toggle-preamp') ? document.getElementById('toggle-preamp').checked : false,
        outboard1: document.getElementById('toggle-outboard1') ? document.getElementById('toggle-outboard1').checked : false,
        outboard2: document.getElementById('toggle-outboard2') ? document.getElementById('toggle-outboard2').checked : false,
        outboard3: document.getElementById('toggle-outboard3') ? document.getElementById('toggle-outboard3').checked : false,
        ad: document.getElementById('toggle-ad') ? document.getElementById('toggle-ad').checked : false,
        recall: document.getElementById('toggle-recall') ? document.getElementById('toggle-recall').checked : false,
        notes: document.getElementById('toggle-notes') ? document.getElementById('toggle-notes').checked : false
    };

    // 3. Create new window for printing
    const printWindow = window.open('', '_blank');
    const getInitials = (name) => `${name || ''}`.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase();
    const artist = window.sessionMeta.artist || 'Unknown Artist';
    const init = getInitials(window.sessionMeta.engineer || 'Engineer');
    const dateStr = window.sessionMeta.date || new Date().toLocaleDateString();
    const docTitle = `${artist} - ${init} - ${dateStr}`;

    // 4. Generate table headers dynamically
    let tableHeaders = `<th>Ch</th><th>Source</th>`;
    if (cols.microphone) tableHeaders += `<th>Mic</th>`;
    if (cols.tieLine) tableHeaders += `<th>Tie Line</th>`;
    if (cols.preamp) tableHeaders += `<th>Pre Amp</th>`;
    if (cols.outboard1) tableHeaders += `<th>Outboard 1</th>`;
    if (cols.outboard2) tableHeaders += `<th>Outboard 2</th>`;
    if (cols.outboard3) tableHeaders += `<th>Outboard 3</th>`;
    if (cols.ad) tableHeaders += `<th>A/D Converter</th>`;
    if (cols.recall) tableHeaders += `<th>Recall Notes</th>`;
    if (cols.notes) tableHeaders += `<th>Notes</th>`;

    // 5. Generate table rows dynamically
    const getPrintableMicLabel = (micName) => {
        const model = `${micName || ''}`.trim();
        if (!model) return '';
        const mic = (equipment.microphones || []).find(m => m.name === model);
        const make = `${mic?.make || ''}`.trim();
        if (!make) return escapeHtml(model);
        return `<span class="eq-make-print">${escapeHtml(make)}</span> <span class="eq-model-print">${escapeHtml(model)}</span>`;
    };
    const tableRows = activeChannels.map(session => {
        const sourceIdx = Number.isInteger(session.channel) ? session.channel - 1 : null;
        const rowColor = window.enableColors ? getRowColor(session.source, sourceIdx) : '';
        let row = `<td>${session.channel}</td><td><strong>${session.source}</strong></td>`;
        if (cols.microphone) row += `<td>${getPrintableMicLabel(session.microphone)}</td>`;
        if (cols.tieLine) row += `<td>${session.tieLine}</td>`;
        if (cols.preamp) row += `<td>${session.preamp}</td>`;
        if (cols.outboard1) row += `<td>${session.outboard1}</td>`;
        if (cols.outboard2) row += `<td>${session.outboard2}</td>`;
        if (cols.outboard3) row += `<td>${session.outboard3}</td>`;
        if (cols.ad) row += `<td>${session.ad}</td>`;
        if (cols.recall) row += `<td>${session.recall}</td>`;
        if (cols.notes) row += `<td>${session.notes}</td>`;
        const styleStr = rowColor ? ` style="background-color: ${rowColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact;"` : '';
        return `<tr${styleStr}>${row}</tr>`;
    }).join('');

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${docTitle}</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 20px; font-size: 13px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #333; color: white; text-transform: uppercase; }
            tr:nth-child(even) { background: #f9f9f9; }
            .eq-make-print { color: #555; font-weight: 500; letter-spacing: 0.1px; }
            .eq-model-print { color: #111; font-weight: 600; }
            .print-btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px; }
            @media print { .no-print { display: none; } body { margin: 0; } }
        </style>
    </head>
    <body>
        <div class="no-print" style="margin-bottom: 20px;">
            <button class="print-btn" onclick="window.print()">🖨️ Print Document</button>
            <button class="print-btn" style="background:#dc3545;" onclick="window.close()">❌ Close</button>
        </div>
        <div class="header" style="border-bottom: 3px solid #111; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <h1 style="margin: 0 0 5px 0; font-size: 28px;">${window.sessionMeta.artist || 'Session Patch Sheet'}</h1>
                <h2 style="margin: 0; font-size: 18px; color: #555; font-weight: normal;">${window.sessionMeta.project || ''}</h2>
            </div>
            <div style="text-align: right; font-size: 14px; color: #444;">
                <strong>Engineer:</strong> ${window.sessionMeta.engineer || 'N/A'}<br>
                <strong>Date:</strong> ${dateStr}
            </div>
        </div>
        <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
    </body>
    </html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
}

// ==========================================
// DATA EXPORT / IMPORT (INCLUDING TEMPLATES & CSV INVENTORY)
// ==========================================
function downloadCSVTemplate() {
    // Includes future-proofing columns
    const headers = "Type,Name,Detail,Make,SerialNumber,Location,Notes,ChannelsPerUnit\n";
    const rows =[
        "Microphone,U87,LDC,Neumann,SN-12345,Mic Locker,Vintage 1980s,1",
        "Microphone,R88,Ribbon,AEA,SN-54321,Mic Locker,Stereo ribbon pair,2",
        "Preamp,Neve 1073,2,Rupert Neve,SN-999,Control Room,2 Channels,",
        "Tie Line,Live Room Box,16,,,Live Room,Wall box near drums,",
        "Outboard,1176,Compressor,Universal Audio,SN-111,Rack A,Rev E,",
        "AD,Apollo 16,16,Universal Audio,SN-222,Rack B,Thunderbolt,"
    ].join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Studio_Inventory_Template.csv';
    a.click();
}
function downloadStudioInventoryCSV() {
    const toCell = (v) => {
        const safe = `${v ?? ''}`.replace(/"/g, '""');
        return /[",\n\r]/.test(safe) ? `"${safe}"` : safe;
    };
    const lines = [];
    lines.push('Type,Name,Detail,Make,SerialNumber,Location,Notes,ChannelsPerUnit');

    (equipment.microphones || []).forEach(m => {
        lines.push([
            'Microphone',
            m.name || '',
            m.category || 'Other',
            m.make || '',
            m.serial || '',
            m.location || '',
            m.notes || '',
            Math.max(1, parseInt(m.channelsPerUnit, 10) || 1)
        ].map(toCell).join(','));
    });

    (equipment.outboard || []).forEach(o => {
        lines.push([
            'Outboard',
            o.name || '',
            o.category || 'Other',
            o.make || '',
            o.serial || '',
            o.location || '',
            o.notes || '',
            ''
        ].map(toCell).join(','));
    });

    (equipment.preampUnits || []).forEach(u => {
        lines.push([
            'Preamp',
            u.name || '',
            (u.channels || []).length || '',
            u.make || '',
            u.serial || '',
            u.location || '',
            u.notes || '',
            ''
        ].map(toCell).join(','));
    });

    (equipment.adUnits || []).forEach(u => {
        lines.push([
            'AD',
            u.name || '',
            (u.channels || []).length || '',
            u.make || '',
            u.serial || '',
            u.location || '',
            u.notes || '',
            ''
        ].map(toCell).join(','));
    });

    (equipment.tieLines || []).forEach(u => {
        lines.push([
            'Tie Line',
            u.name || '',
            (u.channels || []).length || '',
            u.make || '',
            u.serial || '',
            u.location || '',
            u.notes || '',
            ''
        ].map(toCell).join(','));
    });

    const blob = new Blob([lines.join('\\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Studio_Inventory.csv';
    a.click();
}

function importCSVInventory(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!confirm("Uploading a new inventory will clear your current session board. Continue?")) {
        event.target.value = ''; 
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        // 1. Split by any OS line ending (Windows, Mac, Linux)
        const rows = text.split(/\r\n|\n|\r/).filter(row => row.trim().length > 0);
        
        let newEquipment = { 
            microphones:[], 
            tieLines: [], 
            preampUnits: [], 
            outboard:[], 
            adUnits: [], 
            hardNormals: equipment.hardNormals ||[] 
        };
        
        // 2. Robust CSV row parser (handles commas inside quotes)
        const parseCSVRow = (str) => {
            let arr =[]; let quote = false; let val = '';
            for (let c = 0; c < str.length; c++) {
                let char = str[c], nextChar = str[c+1];
                if (char === '"' && quote && nextChar === '"') { val += '"'; c++; }
                else if (char === '"') { quote = !quote; }
                else if (char === ',' && !quote) { arr.push(val.trim()); val = ''; }
                else { val += char; }
            }
            arr.push(val.trim());
            return arr;
        };

        // 3. Process Rows
        for (let i = 1; i < rows.length; i++) {
            const cleanCols = parseCSVRow(rows[i]);
            
            const rawType = cleanCols[0] || '';
            const name = cleanCols[1] || '';
            const detail = cleanCols[2] || '';
            const make = cleanCols[3] || '';
            const serial = cleanCols[4] || '';
            const location = cleanCols[5] || '';
            const notes = cleanCols[6] || '';
            const channelsPerUnitRaw = cleanCols[7] || '';
            const channelsPerUnit = Math.max(1, parseInt(channelsPerUnitRaw, 10) || 1);
            
            if (!rawType || !name || !detail) continue; // Skip malformed rows

            const type = rawType.toLowerCase().replace(/[^a-z0-9]/g, '');
            const baseObj = { name, status: 'available', make, serial, location, notes };

            if (type.includes('mic')) {
                newEquipment.microphones.push({ ...baseObj, category: detail, channelsPerUnit });
            } 
            else if (type.includes('outboard') || type.includes('compressor') || type.includes('eq')) {
                newEquipment.outboard.push({ ...baseObj, category: detail });
            }
            else if (type.includes('pre') || type.includes('ad') || type.includes('tie') || type.includes('box') || type.includes('line')) {
                const channelCount = parseInt(detail) || 1;
                
                let prefix = 'Ch';
                if (type.includes('ad')) prefix = 'AD';
                if (type.includes('tie') || type.includes('line') || type.includes('box')) prefix = 'Line';

                const channels = Array.from({length: channelCount}, (_, idx) => ({
                    name: `${name} ${prefix} ${idx + 1}`, 
                    status: 'available'
                }));
                
                if (type.includes('pre')) newEquipment.preampUnits.push({ ...baseObj, channels });
                else if (type.includes('ad')) newEquipment.adUnits.push({ ...baseObj, channels });
                else newEquipment.tieLines.push({ ...baseObj, channels });
            }
        }
        
        // 4. Apply changes and refresh UI
        pushHistory();
        equipment = ensureEquipmentDefaults(newEquipment);
        sortAllEquipment();
        initializeSession(sessionData.length || 24);
        refreshAppUI();
        
        alert(`Success! Imported ${rows.length - 1} pieces of gear.`);
        event.target.value = ''; 
    };
    reader.readAsText(file);
}

function exportData() {
    const data = JSON.stringify({
        equipment,
        sessionData,
        pinnedColumns: window.pinnedColumns || {},
        customTemplates,
        manualRowColors: window.manualRowColors || {},
        sessionMeta: window.sessionMeta || {},
        colourSettings: {
            enabled: window.enableColors,
            brightness: window.colourBrightness,
            opacity: window.colourOpacity
        },
        preferences: normalizePreferences(window.preferences)
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'studio_setup.json';
    a.click();
}

function importData(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { 
        pushHistory();
        const d = JSON.parse(ev.target.result); 
        equipment = ensureEquipmentDefaults(d.equipment);
        sortAllEquipment();
        sessionData = d.sessionData; 
        window.pinnedColumns = {
            ...window.pinnedColumns,
            ...(d.pinnedColumns || {})
        };
        customTemplates = d.customTemplates || [];
        window.manualRowColors = d.manualRowColors || {};
        window.enableColors = d.colourSettings?.enabled ?? window.enableColors;
        window.colourBrightness = d.colourSettings?.brightness ?? window.colourBrightness;
        window.colourOpacity = d.colourSettings?.opacity ?? window.colourOpacity;
        window.preferences = normalizePreferences(d.preferences || window.preferences);
        window.sessionMeta = {
            artist: d.sessionMeta?.artist || '',
            project: d.sessionMeta?.project || '',
            engineer: d.sessionMeta?.engineer || '',
            date: d.sessionMeta?.date || new Date().toISOString().split('T')[0]
        };
        savePreferencesToStorage();
        syncColourControlsFromState();
        updateColourToggleButtons();
        updateColourControls(false);
        renderPreferencesUI();
        loadMetadataUI();
        refreshAppUI();
        updateTemplateUI();
        alert('Data imported!');
    };
    reader.readAsText(file);
}

async function copyDataToClipboard() {
    const payload = JSON.stringify({
        equipment,
        sessionData,
        pinnedColumns: window.pinnedColumns || {},
        customTemplates,
        manualRowColors: window.manualRowColors || {},
        sessionMeta: window.sessionMeta || {},
        colourSettings: {
            enabled: window.enableColors,
            brightness: window.colourBrightness,
            opacity: window.colourOpacity
        },
        preferences: normalizePreferences(window.preferences)
    }, null, 2);
    try {
        await navigator.clipboard.writeText(payload);
        alert('Current session data copied to clipboard.');
    } catch (err) {
        // Fallback for browsers/environments where clipboard API is blocked.
        const ta = document.createElement('textarea');
        ta.value = payload;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        alert('Current session data copied to clipboard.');
    }
}
function getDawExportTracks() {
    const prefs = normalizePreferences(window.preferences);
    const mergeStereo = prefs.dawNamer?.mergeStereo !== false;
    const useShortNames = prefs.dawNamer?.useShortNames === true;
    const shortNameMap = [
['Overhead', 'OH'],
        ['Snare', 'Snr'],
['Bottom', 'Btm'],
        ['Acoustic', 'Acc'],
        ['Room', 'Rm']
    ];
    
    let tracks = sessionData
        .filter(s => s.source && s.source.trim() !== '')
        .map(s => s.source.trim());
        
    if (useShortNames) {
        tracks = tracks.map(name => {
            let out = name;
            shortNameMap.forEach(([from, to]) => {
                out = out.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
            });
            return out;
        });
    }
    const merged =[];
    let monoCount = 0;
    let stereoCount = 0;
    
    // Track the sequential blocks for Pro Tools creation
    const blocks =[];
    let currentType = null;
    let currentBlockCount = 0;

    const pushBlock = () => {
        if (currentType !== null && currentBlockCount > 0) {
            blocks.push({ type: currentType, count: currentBlockCount });
        }
    };

    for (let i = 0; i < tracks.length; i++) {
        const current = tracks[i];
        let isStereo = false;

        if (
            mergeStereo &&
            /\sL$/.test(current) &&
            i + 1 < tracks.length &&
            tracks[i + 1] === `${current.slice(0, -2)} R`
        ) {
            isStereo = true;
            merged.push(current.slice(0, -2));
            stereoCount++;
            i++; // skip the 'R' track
        } else {
            merged.push(current);
            monoCount++;
        }

        const typeStr = isStereo ? 'Stereo' : 'Mono';
        if (typeStr === currentType) {
            currentBlockCount++;
        } else {
            pushBlock();
            currentType = typeStr;
            currentBlockCount = 1;
        }
    }
    pushBlock(); // push the final block

    return { tracks: merged, monoCount, stereoCount, blocks };
}
function updateCopyButtonTooltip() {
    const btn = document.getElementById('copyTrackNamesBtn');
    if (!btn) return;
    const { tracks, monoCount, stereoCount } = getDawExportTracks();
    btn.title = `Copies ${tracks.length} tracks (${monoCount} Mono, ${stereoCount} Stereo)`;
}
async function copyTrackNames() {
    const { tracks, monoCount, stereoCount, blocks } = getDawExportTracks();
    if (tracks.length === 0) {
        alert('No sources found to copy!');
        return;
    }
    const textToCopy = tracks.join('\n');
    
    // Update the Modal UI
    const countsDiv = document.getElementById('dawExportCounts');
    const listTextarea = document.getElementById('dawExportList');
    if (countsDiv) {
        const blockHtml = blocks.map(b => `<li class="daw-export-block-item">Create <strong>${b.count}</strong> ${b.type} Audio Track${b.count > 1 ? 's' : ''}</li>`).join('');
        countsDiv.innerHTML = `<ul class="daw-export-block-list">${blockHtml}</ul>
        <div class="daw-export-summary">Total: ${monoCount} Mono, ${stereoCount} Stereo</div>`;
    }
    if (listTextarea) {
        listTextarea.value = textToCopy;
    }

    // Copy to clipboard and show modal
    try {
        await navigator.clipboard.writeText(textToCopy);
        const modal = document.getElementById('dawExportModal');
        if (modal) modal.style.display = 'block';
    } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const modal = document.getElementById('dawExportModal');
        if (modal) modal.style.display = 'block';
    }
}

function updateInventoryCounts() {
    updateSummary(); // Keep calling the summary update
    
    const list = document.getElementById('inventoryCounts');
    if(list) {
        const totalMics = equipment.microphones ? equipment.microphones.length : 0;
        const totalBoxes = equipment.tieLines ? equipment.tieLines.length : 0;
        const totalTieLines = equipment.tieLines ? equipment.tieLines.reduce((sum, b) => sum + b.channels.length, 0) : 0;
        const totalPreampUnits = equipment.preampUnits ? equipment.preampUnits.length : 0;
        const totalPreampCh = equipment.preampUnits ? equipment.preampUnits.reduce((sum, u) => sum + u.channels.length, 0) : 0;
        const totalOutboard = equipment.outboard ? equipment.outboard.length : 0;
        const totalADCh = equipment.adUnits ? equipment.adUnits.reduce((sum, u) => sum + u.channels.length, 0) : 0;

        list.innerHTML = `
            <li><strong>Microphones:</strong> ${totalMics} total items</li>
            <li><strong>Tie Lines / Wall Boxes:</strong> ${totalTieLines} patch points across ${totalBoxes} boxes</li>
            <li><strong>Preamps:</strong> ${totalPreampCh} channels across ${totalPreampUnits} units</li>
            <li><strong>Outboard Gear:</strong> ${totalOutboard} total units</li>
            <li><strong>A/D Converters:</strong> ${totalADCh} total channels</li>
        `;
    }
}

// THEME INIT
function applyCustomThemeColors(preferSaved = false, source = 'auto') {
    const prefs = normalizePreferences(window.preferences);
    const custom = prefs.customTheme || {};
    const bgInput = document.getElementById('customBg');
    const panelsInput = document.getElementById('customPanels');
    const textInput = document.getElementById('customText');
    const accentInput = document.getElementById('customAccent');
    const bgHexInput = document.getElementById('customBgHex');
    const panelsHexInput = document.getElementById('customPanelsHex');
    const textHexInput = document.getElementById('customTextHex');
    const accentHexInput = document.getElementById('customAccentHex');
    const nextPalette = preferSaved
        ? normalizeCustomThemePalette(custom, {
            bg: '#0f0f0f',
            panels: '#1a1a1a',
            text: '#eeeeee',
            accent: '#FF9F1C'
        })
        : (() => {
            if (source === 'hex') {
                return {
                    bg: normalizeHexColor(bgHexInput?.value, normalizeHexColor(bgInput?.value, custom.bg || '#0f0f0f')),
                    panels: normalizeHexColor(panelsHexInput?.value, normalizeHexColor(panelsInput?.value, custom.panels || '#1a1a1a')),
                    text: normalizeHexColor(textHexInput?.value, normalizeHexColor(textInput?.value, custom.text || '#eeeeee')),
                    accent: normalizeHexColor(accentHexInput?.value, normalizeHexColor(accentInput?.value, custom.accent || '#FF9F1C'))
                };
            }
            return {
                bg: normalizeHexColor(bgInput?.value, custom.bg || '#0f0f0f'),
                panels: normalizeHexColor(panelsInput?.value, custom.panels || '#1a1a1a'),
                text: normalizeHexColor(textInput?.value, custom.text || '#eeeeee'),
                accent: normalizeHexColor(accentInput?.value, custom.accent || '#FF9F1C')
            };
        })();
    const bg = nextPalette.bg;
    const panels = nextPalette.panels;
    const text = nextPalette.text;
    const accent = nextPalette.accent;
    if (bgInput) bgInput.value = bg;
    if (panelsInput) panelsInput.value = panels;
    if (textInput) textInput.value = text;
    if (accentInput) accentInput.value = accent;
    if (bgHexInput) bgHexInput.value = bg;
    if (panelsHexInput) panelsHexInput.value = panels;
    if (textHexInput) textHexInput.value = text;
    if (accentHexInput) accentHexInput.value = accent;
    window.preferences = normalizePreferences({
        ...prefs,
        customTheme: nextPalette
    });
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--bg-primary', bg);
    rootStyle.setProperty('--bg-secondary', panels);
    rootStyle.setProperty('--bg-table', panels);
    rootStyle.setProperty('--text-primary', text);
    rootStyle.setProperty('--accent-primary', accent);
    updatePreferencesDirtyState();
}
function saveCustomThemePreset(slot) {
    if (slot !== 'a' && slot !== 'b') return;
    const prefs = normalizePreferences(window.preferences);
    const palette = getCustomThemeFromInputs();
    window.preferences = normalizePreferences({
        ...prefs,
        customTheme: palette,
        customThemePresets: {
            ...prefs.customThemePresets,
            [slot]: palette
        }
    });
    updatePreferencesDirtyState();
    alert(`Saved current custom colours to User ${slot.toUpperCase()}.`);
}
function applyCustomThemePreset(slot) {
    if (slot !== 'a' && slot !== 'b') return;
    const prefs = normalizePreferences(window.preferences);
    const palette = normalizeCustomThemePalette(prefs.customThemePresets?.[slot], prefs.customTheme);
    const bgInput = document.getElementById('customBg');
    const panelsInput = document.getElementById('customPanels');
    const textInput = document.getElementById('customText');
    const accentInput = document.getElementById('customAccent');
    const bgHexInput = document.getElementById('customBgHex');
    const panelsHexInput = document.getElementById('customPanelsHex');
    const textHexInput = document.getElementById('customTextHex');
    const accentHexInput = document.getElementById('customAccentHex');
    if (bgInput) bgInput.value = palette.bg;
    if (panelsInput) panelsInput.value = palette.panels;
    if (textInput) textInput.value = palette.text;
    if (accentInput) accentInput.value = palette.accent;
    if (bgHexInput) bgHexInput.value = palette.bg;
    if (panelsHexInput) panelsHexInput.value = palette.panels;
    if (textHexInput) textHexInput.value = palette.text;
    if (accentHexInput) accentHexInput.value = palette.accent;
    window.preferences = normalizePreferences({
        ...prefs,
        customTheme: palette
    });
    changeTheme('custom');
}
function changeTheme(theme) { 
    document.documentElement.setAttribute('data-theme', theme); 
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active')); 
    const activeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
    if(activeBtn) activeBtn.classList.add('active');
    const builder = document.getElementById('customThemeBuilder');
    const rootStyle = document.documentElement.style;
    if (theme === 'custom') {
        if (builder) builder.style.display = 'block';
        applyCustomThemeColors(true);
    } else {
        if (builder) builder.style.display = 'none';
        rootStyle.removeProperty('--bg-primary');
        rootStyle.removeProperty('--bg-secondary');
        rootStyle.removeProperty('--bg-table');
        rootStyle.removeProperty('--text-primary');
        rootStyle.removeProperty('--accent-primary');
    }
    // Save theme preference to local storage
    localStorage.setItem('studioApp_theme', theme);
}

// BOOTUP
document.addEventListener('DOMContentLoaded', () => {
    let legacyHardNormals = [];
    const savedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (savedPreferences) {
        try {
            const parsedPrefs = JSON.parse(savedPreferences);
            legacyHardNormals = normalizeHardNormals(parsedPrefs?.hardNormals);
            window.preferences = normalizePreferences(parsedPrefs);
        } catch (err) {
            window.preferences = getDefaultPreferences();
        }
    } else {
        window.preferences = getDefaultPreferences();
    }
    const savedData = localStorage.getItem('studioApp_data');
    if (savedData) {
        const d = JSON.parse(savedData);
        equipment = ensureEquipmentDefaults(d.equipment || equipment); // Fallback to default if undefined
        sortAllEquipment();
        sessionData = d.sessionData || [];
        window.pinnedColumns = {
            ...window.pinnedColumns,
            ...(d.pinnedColumns || {})
        };
        customTemplates = d.customTemplates || [];
        window.manualRowColors = d.manualRowColors || {};
        window.sessionMeta = {
            artist: d.sessionMeta?.artist || '',
            project: d.sessionMeta?.project || '',
            engineer: d.sessionMeta?.engineer || '',
            date: d.sessionMeta?.date || new Date().toISOString().split('T')[0]
        };
        window.enableColors = d.colourSettings?.enabled ?? window.enableColors;
        window.colourBrightness = d.colourSettings?.brightness ?? window.colourBrightness;
        window.colourOpacity = d.colourSettings?.opacity ?? window.colourOpacity;
        if (d.preferences) window.preferences = normalizePreferences(d.preferences);
    } else {
        equipment = ensureEquipmentDefaults(equipment);
        sortAllEquipment();
        initializeSession(24);
        window.sessionMeta = {
            artist: '',
            project: '',
            engineer: '',
            date: new Date().toISOString().split('T')[0]
        };
    }
    if ((!Array.isArray(equipment.hardNormals) || equipment.hardNormals.length === 0) && legacyHardNormals.length) {
        equipment.hardNormals = legacyHardNormals;
    }
    savePreferencesToStorage();
    const savedTheme = localStorage.getItem('studioApp_theme') || 'dusk';
    changeTheme(savedTheme === 'dark' ? 'dusk' : savedTheme);
    syncColourControlsFromState();
    updateColourToggleButtons();
    updateColourControls(false);
    renderPreferencesUI();
    const preferencesRoot = document.getElementById('preferences');
    if (preferencesRoot) {
        const previewEvents = ['input', 'change', 'click'];
        previewEvents.forEach(evt => {
            preferencesRoot.addEventListener(evt, () => {
                if (!preferencesRoot.classList.contains('active')) return;
                updatePreferencesDirtyState();
            });
        });
    }
    renderTemplateFieldSelectors();
    populateTemplateChannelSelects();
    loadMetadataUI();
    refreshAppUI();
    updateTemplateUI();
    updateHistoryButtons();
    updateClearModeButton();

    document.addEventListener('keydown', (e) => {
        const isMod = e.metaKey || e.ctrlKey;
        if (!isMod) return;
        const key = e.key.toLowerCase();
        if (key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undoAction();
        } else if ((key === 'z' && e.shiftKey) || key === 'y') {
            e.preventDefault();
            redoAction();
        }
    });

    document.addEventListener('click', (e) => {
        const target = e.target instanceof Element ? e.target : null;
        const setupWrap = document.getElementById('setupMenuWrap');
        const dataWrap = document.getElementById('dataMenuWrap');
        const inventorySetupWrap = document.getElementById('inventorySetupMenuWrap');
        const isSetupPanelTrigger = !!(target && target.closest('[data-open-setup-panel]'));
        const inSetupMenu = !!(target && setupWrap && setupWrap.contains(target));
        const inDataMenu = !!(target && dataWrap && dataWrap.contains(target));
        const inInventorySetupMenu = !!(target && inventorySetupWrap && inventorySetupWrap.contains(target));
        const inPopover = !!(target && target.closest('.setup-popover'));
        const inSessionTable = !!(target && target.closest('#sessionTable'));
        const isClearModeBtn = target && target.closest('#clearModeBtn');
        const inEqDropdown = !!(target && target.closest('.eq-custom-dropdown'));
        if (!inSetupMenu) closeSetupMenu();
        if (!inDataMenu) closeDataMenu();
        if (!inInventorySetupMenu) closeInventorySetupMenu();
        if (!inSetupMenu && !inPopover && !isSetupPanelTrigger) closeAllSetupPanels();
        if (!inEqDropdown) closeAllEqDropdowns();
        if (window.clearMode && !inSessionTable && !isClearModeBtn) {
            exitClearModeForEditing();
        }
    });
});
