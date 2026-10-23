/**
 * CareRead: receive one row per session from the study website and append it
 * to the "responses" sheet of the spreadsheet this script is attached to.
 * Setup steps are in README.md.
 */
const SHEET_NAME = "responses";
const COLUMNS = [
  "receivedAt", "sessionId", "participantId", "condition", "identity", "style", "lang",
  "startedAt", "finishedAt", "decision", "decisionTimeMs",
  "scenarioMs", "reportMs", "consultTypingMs", "consultReplyMs",
  "screen", "viewport", "userAgent", "screenLog"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(COLUMNS);
      sh.setFrozenRows(1);
    }
    data.receivedAt = new Date().toISOString();
    sh.appendRow(COLUMNS.map(function (k) { return data[k] === undefined ? "" : data[k]; }));
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("CareRead endpoint is running.");
}
