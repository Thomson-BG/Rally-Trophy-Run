const PERIODS = [1, 2, 3, 4, 5, 6];

function doPost(e) {
  try {
    const payload = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(payload || '{}');
    const action = data.action;
    const body = data.payload || {};
    const result = handleAction_(action, body) || {};
    return json_({ ok: true, ...result });
  } catch (error) {
    return json_({ ok: false, message: error.message || String(error) });
  }
}

function doGet() {
  return json_({ ok: true, message: 'POST JSON payloads only.' });
}

function handleAction_(action, payload) {
  switch (action) {
    case 'init':
      return init_();
    case 'adminLogin':
      return adminLogin_(payload);
    case 'setAdminPassword':
      return setAdminPassword_(payload);
    case 'registerUser':
      return registerUser_(payload);
    case 'loginUser':
      return loginUser_(payload);
    case 'listUsers':
      return listUsers_();
    case 'updateUser':
      return updateUser_(payload);
    case 'deleteUser':
      return deleteUser_(payload);
    case 'listStudents':
      return listStudents_(payload);
    case 'addStudent':
      return addStudent_(payload);
    case 'updateStudent':
      return updateStudent_(payload);
    case 'removeStudent':
      return removeStudent_(payload);
    case 'setStudentStatus':
      return setStudentStatus_(payload);
    case 'setStudentStatusesBulk':
      return setStudentStatusesBulk_(payload);
    case 'listInspectionLog':
      return listInspectionLog_();
    case 'getFailedReport':
      return getFailedReport_();
    default:
      throw new Error('Unknown action: ' + action);
  }
}

function init_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet_(ss, 'Admin', ['key', 'value', 'updatedAt']);
  ensureSheet_(ss, 'Users', ['id', 'email', 'passwordHash', 'status', 'canEdit', 'periods', 'createdAt']);
  ensureSheet_(ss, 'Students', ['id', 'name', 'studentId', 'status', 'period', 'updatedAt', 'updatedBy']);
  ensureSheet_(ss, 'Inspections', ['id', 'studentRecordId', 'studentName', 'studentNumber', 'status', 'period', 'inspectedAt', 'inspectedBy']);

  const admin = getSetting_('passwordHash');
  if (!admin) {
    const defaultHash = hash_('Bulldog1!');
    setSetting_('passwordHash', defaultHash);
  }

  return { initialized: true };
}

function adminLogin_(payload) {
  const passwordHash = String(payload.passwordHash || '');
  const stored = getSetting_('passwordHash');
  return { ok: stored === passwordHash };
}

function setAdminPassword_(payload) {
  const passwordHash = String(payload.passwordHash || '');
  if (!passwordHash) throw new Error('Password hash missing');
  setSetting_('passwordHash', passwordHash);
  return { ok: true };
}

function registerUser_(payload) {
  const email = String(payload.email || '').trim();
  const passwordHash = String(payload.passwordHash || '');
  if (!email) throw new Error('Email required');
  const users = listUsers_().users;
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, message: 'Account already exists.' };

  const user = {
    id: createId_('user'),
    email: email,
    passwordHash: passwordHash,
    status: 'pending',
    canEdit: true,
    periods: '',
    createdAt: formatDate_(new Date())
  };
  const sheet = getSheet_('Users');
  appendRow_(sheet, user);
  return { ok: true };
}

function loginUser_(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  const passwordHash = String(payload.passwordHash || '');
  const users = listUsers_().users;
  const user = users.find((item) => item.email.toLowerCase() === email);
  if (!user) return { user: null };
  if (user.status !== 'active') return { user: null };
  if (user.passwordHash !== passwordHash) return { user: null };
  return { user: user };
}

function listUsers_() {
  const sheet = getSheet_('Users');
  const rows = readRows_(sheet);
  const users = rows.map((row) => ({
    id: String(row.id || ''),
    email: String(row.email || ''),
    passwordHash: String(row.passwordHash || ''),
    status: String(row.status || 'pending'),
    canEdit: parseBool_(row.canEdit),
    periods: parsePeriods_(row.periods),
    createdAt: row.createdAt ? String(row.createdAt) : ''
  }));
  return { users: users };
}

function updateUser_(payload) {
  const userId = String(payload.userId || '');
  const updates = payload.updates || {};
  const sheet = getSheet_('Users');
  const rowIndex = findRowById_(sheet, userId);
  if (rowIndex === -1) throw new Error('User not found');

  const patch = {};
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.canEdit !== undefined) patch.canEdit = updates.canEdit ? true : false;
  if (updates.periods !== undefined) patch.periods = Array.isArray(updates.periods) ? updates.periods.join(',') : updates.periods;

  updateRow_(sheet, rowIndex, patch);
  const updated = listUsers_().users.find((user) => user.id === userId);
  return { user: updated };
}

function deleteUser_(payload) {
  const userId = String(payload.userId || '');
  const sheet = getSheet_('Users');
  const rowIndex = findRowById_(sheet, userId);
  if (rowIndex === -1) return { ok: true };
  sheet.deleteRow(rowIndex);
  return { ok: true };
}

function listStudents_(payload) {
  const period = Number(payload.period || 0);
  ensurePeriod_(period);
  const sheet = getSheet_('Students');
  const rows = readRows_(sheet);
  const students = rows
    .filter((row) => Number(row.period) === period)
    .map((row) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      studentId: String(row.studentId || ''),
      status: String(row.status || ''),
      period: Number(row.period),
      updatedAt: normalizeDateCell_(row.updatedAt),
      updatedBy: String(row.updatedBy || '')
    }));
  return { students: students };
}

function addStudent_(payload) {
  const period = Number(payload.period || 0);
  const name = String(payload.name || '').trim();
  const studentId = String(payload.studentId || '').trim();
  ensurePeriod_(period);
  if (!name) throw new Error('Student name required');
  const student = {
    id: createId_('student'),
    name: name,
    studentId: studentId,
    status: '',
    period: period,
    updatedAt: '',
    updatedBy: ''
  };
  const sheet = getSheet_('Students');
  appendRow_(sheet, student);
  return { student: student };
}

function updateStudent_(payload) {
  const period = Number(payload.period || 0);
  const studentId = String(payload.studentId || '');
  ensurePeriod_(period);
  const updates = payload.updates || {};
  const sheet = getSheet_('Students');
  const rowIndex = findRowById_(sheet, studentId);
  if (rowIndex === -1) throw new Error('Student not found');

  const patch = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.studentId !== undefined) patch.studentId = updates.studentId;
  updateRow_(sheet, rowIndex, patch);

  const students = listStudents_({ period: period }).students;
  const updated = students.find((student) => student.id === studentId);
  return { student: updated };
}

function removeStudent_(payload) {
  const studentId = String(payload.studentId || '');
  const sheet = getSheet_('Students');
  const rowIndex = findRowById_(sheet, studentId);
  if (rowIndex === -1) return { ok: true };
  sheet.deleteRow(rowIndex);
  return { ok: true };
}

function setStudentStatus_(payload) {
  const period = Number(payload.period || 0);
  const studentId = String(payload.studentId || '');
  ensurePeriod_(period);
  const status = String(payload.status || '');
  const updatedBy = String(payload.updatedBy || '');
  const sheet = getSheet_('Students');
  const rowIndex = findRowById_(sheet, studentId);
  if (rowIndex === -1) throw new Error('Student not found');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nameIndex = headers.indexOf('name');
  const studentIdIndex = headers.indexOf('studentId');
  const rowValues = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  const studentName = rowValues[nameIndex] || '';
  const studentNumber = rowValues[studentIdIndex] || '';
  const inspectedAt = formatDate_(new Date());

  updateRow_(sheet, rowIndex, {
    status: status,
    updatedAt: inspectedAt,
    updatedBy: updatedBy
  });

  const logSheet = getSheet_('Inspections');
  appendRow_(logSheet, {
    id: createId_('inspect'),
    studentRecordId: studentId,
    studentName: studentName,
    studentNumber: studentNumber,
    status: status,
    period: period,
    inspectedAt: inspectedAt,
    inspectedBy: updatedBy
  });

  const students = listStudents_({ period: period }).students;
  const updated = students.find((student) => student.id === studentId);
  return { student: updated };
}

function setStudentStatusesBulk_(payload) {
  const period = Number(payload.period || 0);
  ensurePeriod_(period);
  const updates = Array.isArray(payload.updates) ? payload.updates : [];
  const updatedBy = String(payload.updatedBy || '');
  if (!updates.length) return { students: [] };

  const updatesById = {};
  updates.forEach(function(update) {
    if (!update) return;
    const studentId = String(update.studentId || '').trim();
    const status = String(update.status || '').trim();
    if (!studentId || !status) return;
    updatesById[studentId] = status;
  });

  if (Object.keys(updatesById).length === 0) return { students: [] };

  const sheet = getSheet_('Students');
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2) return { students: [] };

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  const periodIndex = headers.indexOf('period');
  const nameIndex = headers.indexOf('name');
  const studentIdIndex = headers.indexOf('studentId');
  const statusIndex = headers.indexOf('status');
  const updatedAtIndex = headers.indexOf('updatedAt');
  const updatedByIndex = headers.indexOf('updatedBy');

  if (idIndex === -1 || periodIndex === -1 || statusIndex === -1 || updatedAtIndex === -1 || updatedByIndex === -1) {
    throw new Error('Students sheet headers are misconfigured');
  }

  const logs = [];
  for (var i = 1; i < values.length; i++) {
    const row = values[i];
    const studentRecordId = String(row[idIndex] || '');
    const rowPeriod = Number(row[periodIndex] || 0);
    if (rowPeriod !== period) continue;
    if (!updatesById[studentRecordId]) continue;

    const status = updatesById[studentRecordId];
    const inspectedAt = formatDate_(new Date());
    row[statusIndex] = status;
    row[updatedAtIndex] = inspectedAt;
    row[updatedByIndex] = updatedBy;

    logs.push({
      id: createId_('inspect'),
      studentRecordId: studentRecordId,
      studentName: String(row[nameIndex] || ''),
      studentNumber: String(row[studentIdIndex] || ''),
      status: status,
      period: period,
      inspectedAt: inspectedAt,
      inspectedBy: updatedBy
    });
  }

  if (!logs.length) return { students: [] };

  sheet.getRange(1, 1, values.length, values[0].length).setValues(values);

  const logSheet = getSheet_('Inspections');
  appendRows_(logSheet, logs);

  return { students: listStudents_({ period: period }).students };
}

function listInspectionLog_() {
  const sheet = getSheet_('Inspections');
  const rows = readRows_(sheet);
  const records = rows.map((row) => ({
    id: String(row.id || ''),
    studentRecordId: String(row.studentRecordId || ''),
    studentName: String(row.studentName || ''),
    studentNumber: String(row.studentNumber || ''),
    status: String(row.status || ''),
    period: Number(row.period) || 0,
    inspectedAt: normalizeDateCell_(row.inspectedAt),
    inspectedBy: String(row.inspectedBy || '')
  }));
  return { records: records };
}

function getFailedReport_() {
  const sheet = getSheet_('Students');
  const rows = readRows_(sheet);
  const report = {};
  PERIODS.forEach((period) => {
    report[period] = [];
  });
  rows.forEach((row) => {
    if (String(row.status) !== 'Failed') return;
    const period = Number(row.period);
    if (!report[period]) report[period] = [];
    report[period].push({
      id: String(row.id || ''),
      name: String(row.name || ''),
      studentId: String(row.studentId || ''),
      status: 'Failed',
      period: period
    });
  });
  return { report: report };
}

function ensurePeriod_(period) {
  if (!PERIODS.includes(period)) {
    throw new Error('Invalid period');
  }
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    return sheet;
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const matches = headers.every((header, idx) => existing[idx] === header);
    if (!matches) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
  return sheet;
}

function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  return sheet;
}

function readRows_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn === 0) return [];
  const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  const headers = values[0].map((header) => String(header));
  return values.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });
}

function appendRow_(sheet, record) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map((header) => record[header] !== undefined ? record[header] : '');
  sheet.appendRow(row);
}

function appendRows_(sheet, records) {
  if (!records || !records.length) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = records.map(function(record) {
    return headers.map(function(header) {
      return record[header] !== undefined ? record[header] : '';
    });
  });
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
}

function updateRow_(sheet, rowIndex, updates) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  headers.forEach((header, idx) => {
    if (updates[header] !== undefined) {
      sheet.getRange(rowIndex, idx + 1).setValue(updates[header]);
    }
  });
}

function findRowById_(sheet, id) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return -1;
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) return i + 1;
  }
  return -1;
}

function getSetting_(key) {
  const sheet = getSheet_('Admin');
  const rows = readRows_(sheet);
  const row = rows.find((record) => record.key === key);
  return row ? String(row.value || '') : '';
}

function setSetting_(key, value) {
  const sheet = getSheet_('Admin');
  const values = sheet.getDataRange().getValues();
  const keyIndex = values[0].indexOf('key');
  const valueIndex = values[0].indexOf('value');
  const updatedIndex = values[0].indexOf('updatedAt');
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][keyIndex]) === key) {
      sheet.getRange(i + 1, valueIndex + 1).setValue(value);
      if (updatedIndex !== -1) sheet.getRange(i + 1, updatedIndex + 1).setValue(formatDate_(new Date()));
      return;
    }
  }
  sheet.appendRow([key, value, formatDate_(new Date())]);
}

function parseBool_(value) {
  if (value === true) return true;
  if (value === false) return false;
  const text = String(value).toLowerCase();
  return text === 'true' || text === '1' || text === 'yes';
}

function parsePeriods_(value) {
  if (Array.isArray(value)) return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function createId_(prefix) {
  return prefix + '-' + Utilities.getUuid();
}

function hash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}

function formatDate_(date) {
  const tz = Session.getScriptTimeZone();
  return Utilities.formatDate(date, tz, 'MM/dd/yyyy HH:mm');
}

function normalizeDateCell_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return formatDate_(value);
  }
  const text = String(value || '');
  if (/^\\d{12,}$/.test(text)) {
    const parsed = new Date(Number(text));
    if (!isNaN(parsed.getTime())) {
      return formatDate_(parsed);
    }
  }
  return text;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
