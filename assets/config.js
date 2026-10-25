/*
  CareRead study configuration.
  Fill in the four links below after setting up Google Sheets and Google Forms
  (see README.md). Leave them empty to test the site without saving data.
*/
window.CAREREAD_CONFIG = {
  // Web app URL from Google Apps Script (Deploy > New deployment > Web app).
  sheetEndpoint: "",

  // Google Form "prefilled link" base, e.g. "https://docs.google.com/forms/d/e/XXXX/viewform"
  formUrl: "",
  // Entry IDs of the two short-answer questions in the form that hold the
  // participant ID and the condition code, e.g. "entry.123456789".
  formEntryParticipant: "",
  formEntryCondition: "",

  // Timing (seconds). Buttons unlock only after these minimum reading times.
  minScenarioSeconds: 10,     // scenario screen
  minReportSeconds: 12,       // report-only screen
  fixationSeconds: 2,         // fixation crosses (pupil baseline)
  advisorSeconds: 6,          // advisor introduction screen
  typingSeconds: 3,           // typing / drafting / reviewing status before each reply
  minReplySeconds: 8,         // replies 1 and 2, before the next question can be sent
  decisionUnlockSeconds: 8,   // reply 3, before the decision buttons unlock
  redirectSeconds: 4          // delay before opening the questionnaire
};
