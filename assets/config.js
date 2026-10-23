/*
  CareRead study configuration.
  Fill in the three values below after setting up Google Sheets and Google Forms
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

  // Timing (seconds)
  minScenarioSeconds: 8,     // Continue button unlocks after this
  minReportSeconds: 10,      // Continue button unlocks after this
  fixationSeconds: 2,        // fixation cross before report and before consultation (pupil baseline)
  typingSeconds: 3,          // "is typing" indicator before the reply appears
  decisionUnlockSeconds: 5,  // decision buttons unlock this long after the reply appears
  redirectSeconds: 4         // delay before opening the questionnaire
};
