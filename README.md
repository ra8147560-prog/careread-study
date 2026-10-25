# CareRead study website

Stimulus website for Study 1 of the NSTC project: a 3 (Agent Identity: AI Agent / AI-Assisted Physician / Physician) x 2 (Communication Style: Task-Oriented / Social-Oriented) lab experiment with eye-tracking.

- `index.html`: researcher portal (condition links, random assignment schedule, probes, AOI list, backup download). Do not show it to participants.
- `s1/` to `s6/`: one link per condition.

| Code | Agent Identity | Communication Style |
|---|---|---|
| s1 | AI Agent | Task-Oriented |
| s2 | AI-Assisted Physician | Task-Oriented |
| s3 | Physician | Task-Oriented |
| s4 | AI Agent | Social-Oriented (emoji) |
| s5 | AI-Assisted Physician | Social-Oriented (emoji) |
| s6 | Physician | Social-Oriented (emoji) |

Add `?lang=en` for the English version, `?aoi=1` to outline the areas of interest, and `?pid=P001` to prefill the participant ID.

All texts are in `assets/texts.js`. Timings and links are in `assets/config.js`.

## Participant flow

scenario → fixation cross → report → fixation cross → advisor introduction → chat 1 → chat 2 → chat 3 with decision → questionnaire.

- The advisor introduction shows who will answer (avatar, name, role, reply workflow) so the assigned Agent Identity is clear before the chat starts.
- Each chat turn shows the participant's question, a condition-specific status (AI generating / AI drafting then Dr. Chen reviewing / Dr. Chen typing), then the reply. The report stays on the left during the whole chat.
- Communication Style changes only the first and last line of each reply (same position and length); the social-oriented lines are warm and contain one emoji. The medical content is identical in all conditions.

## Verification probes

Identical in all six conditions:

- P1 (minor, chat 1): LDL quoted as 121; the report shows 112.
- P2 (critical, chats 2 and 3): HbA1c quoted as 6.2% and fasting glucose as 118 mg/dL; the report shows 7.2% and 138 mg/dL. The advisor therefore calls it prediabetes and advises no doctor visit for six months.

Following the plan after P2 is over-reliance. Gaze transitions from a probe number to the matching report row show whether the participant checked it. Add a question to the questionnaire such as "Did you notice anything in the replies that did not match the report? If yes, what?"

The debriefing must explain that everything was fictional and that the advice contained a deliberate error (HbA1c 7.2% and fasting glucose 138 mg/dL are in the diabetes range and need a doctor's visit).

## Eye-tracking notes

- Use Chrome on the 1920 x 1080 monitor at 100% zoom and full screen; then page pixels equal screen pixels.
- No scrolling and no layout shifts; text is 22 px or larger and neighbouring AOIs are separated by empty space.
- Each screen sets an address marker for segmenting recordings: `#scenario`, `#report`, `#advisor`, `#t1-typing`, `#t1`, `#t2-typing`, `#t2`, `#t3-typing`, `#t3`, `#t3-decision`, `#done`.
- The exact rectangle of every AOI on every screen is saved in the `aoiMap` column as `[name, x, y, width, height]`.

## 1. Save data to Google Sheets

1. Create a new Google Sheet (for example "CareRead responses").
2. In the sheet, open **Extensions > Apps Script**, delete the sample code and paste the contents of `apps_script/Code.gs`. Save.
3. Click **Deploy > New deployment**, choose type **Web app**, set *Execute as* **Me** and *Who has access* **Anyone**, then **Deploy** and authorize.
4. Copy the **Web app URL** (ends with `/exec`) into `sheetEndpoint` in `assets/config.js`.

Each finished session adds one row to the `responses` tab. Every session is also kept in the lab browser; download it from the portal page (Backup data).

## 2. Link the Google Form questionnaire

1. In the Google Form, add two short-answer questions: "Participant ID" and "Condition".
2. Open the form menu **Get pre-filled link**, type `P000` and `s0` in those two questions, then **Get link**.
3. From that link, copy:
   - the part before `?` into `formUrl` (it ends with `/viewform`);
   - the two `entry.NNNNNNNNN` names into `formEntryParticipant` and `formEntryCondition`.

After the decision, participants are sent to the form with their ID and condition already filled in.
