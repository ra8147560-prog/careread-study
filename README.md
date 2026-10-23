# CareRead study website

Stimulus website for the NSTC lab experiment: 3 (Agent Identity: AI Agent / AI-Assisted Physician / Physician) x 2 (Communication Style: Task-Oriented / Social-Oriented), with eye-tracking.

- `index.html`: researcher portal (condition links, previews, backup download). Do not show it to participants.
- `s1/` to `s6/`: one link per condition.

| Code | Agent Identity | Communication Style |
|---|---|---|
| s1 | AI Agent | Task-Oriented |
| s2 | AI-Assisted Physician | Task-Oriented |
| s3 | Physician | Task-Oriented |
| s4 | AI Agent | Social-Oriented |
| s5 | AI-Assisted Physician | Social-Oriented |
| s6 | Physician | Social-Oriented |

Add `?lang=en` for the English version and `?aoi=1` to outline the eye-tracking areas of interest.

All texts are in `assets/texts.js`. Timings and links are in `assets/config.js`.

## 1. Save data to Google Sheets

1. Create a new Google Sheet (for example "CareRead responses").
2. In the sheet, open **Extensions > Apps Script**, delete the sample code and paste the contents of `apps_script/Code.gs`. Save.
3. Click **Deploy > New deployment**, choose type **Web app**, set *Execute as* **Me** and *Who has access* **Anyone**, then **Deploy** and authorize.
4. Copy the **Web app URL** (ends with `/exec`) into `sheetEndpoint` in `assets/config.js`.

Each finished session adds one row to the `responses` tab: participant ID, condition, decision, decision time, time on each screen and a full screen log. Every session is also kept in the lab browser; download it from the portal page (Backup data).

## 2. Link the Google Form questionnaire

1. In the Google Form, add two short-answer questions: "Participant ID" and "Condition".
2. Open the form menu **Get pre-filled link**, type `P000` and `s0` in those two questions, then **Get link**.
3. From that link, copy:
   - the part before `?` into `formUrl` (it ends with `/viewform`);
   - the two `entry.NNNNNNNNN` names into `formEntryParticipant` and `formEntryCondition`.

After the decision, participants are sent to the form with their ID and condition already filled in.

## 3. Lab settings

- Chrome on a 1920 x 1080 monitor, browser zoom 100%. The page also scales to other screens.
- Each screen sets an address marker for segmenting recordings: `#start`, `#scenario`, `#fixation1`, `#report`, `#fixation2`, `#consult`, `#consult-reply`, `#done`.
- The report and all medical content are identical across conditions; only the advisor label and the tone change. Dr. Chen, the clinic and the patient are fictional and must be explained in the debriefing.
