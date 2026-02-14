const SHEET_NAME = 'Scores';
const HEADERS = ['Score', 'Entry', 'Period', 'Timestamp'];

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'top').toLowerCase();
  const limit = Math.max(1, Math.min(50, Number((e && e.parameter && e.parameter.limit) || 8) || 8));
  if (action === 'top') {
    return jsonResponse({ ok: true, scores: getTopScores(limit) });
  }
  return jsonResponse({ ok: false, message: 'Unsupported action.' });
}

function doPost(e) {
  let payload = {};
  try {
    payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return jsonResponse({ ok: false, message: 'Invalid JSON payload.' });
  }

  const score = Number(payload.score) || 0;
  const period = String(payload.period || '').trim();
  const validPeriods = ['1', '2', '3', '4', '5', '6', 'Staff', 'Non-Auto Student'];
  const isStaff = period === 'Staff';
  const studentId = normalizeStudentId(payload.studentId || payload.initials || payload.id || '');
  const staffName = normalizeStaffName(payload.staffName || payload.name || payload.displayName || payload.studentId || '');

  if (score <= 0 || !validPeriods.includes(period)) {
    return jsonResponse({ ok: false, message: 'Invalid score data.' });
  }

  if (!isStaff && studentId.length !== 6) {
    return jsonResponse({ ok: false, message: 'Student ID must be 6 digits.' });
  }

  if (isStaff && !staffName) {
    return jsonResponse({ ok: false, message: 'Staff name is required (max 10 chars).' });
  }

  const entryValue = isStaff ? staffName : "'" + studentId;
  if (!entryValue) {
    return jsonResponse({ ok: false, message: 'Invalid score data.' });
  }

  const sheet = getSheet();
  sheet.appendRow([score, entryValue, period, new Date()]);

  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(2, 1, lastRow - 1, 4).sort({ column: 1, ascending: false });
  }

  const limit = Math.max(1, Math.min(50, Number(payload.limit) || 8));
  return jsonResponse({ ok: true, scores: getTopScores(limit) });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function getTopScores(limit) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  const scores = values.map((row) => {
    const period = String(row[2] || '').trim();
    const rawEntry = String(row[1] || '');
    const rawId = normalizeStudentId(rawEntry);
    const studentId = rawId ? rawId.padStart(6, '0').slice(-6) : '';
    const staffName = period === 'Staff' ? normalizeStaffName(rawEntry) : '';
    return {
      score: Number(row[0]) || 0,
      studentId: period === 'Staff' ? '' : studentId,
      staffName,
      displayName: period === 'Staff' ? staffName : studentId,
      period,
      createdAt: row[3] ? new Date(row[3]).toISOString() : ''
    };
  });
  scores.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.createdAt.localeCompare(b.createdAt)));
  return scores.slice(0, limit);
}

function normalizeStudentId(value) {
  return String(value || '')
    .replace(/[^0-9]/g, '')
    .slice(0, 6);
}

function normalizeStaffName(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9 .'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
