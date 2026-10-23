/*
  All participant-facing text, in Traditional Chinese (zh) and English (en).
  The medical content is identical across the six conditions; only the advisor
  identity (ai / hyb / doc) and the communication style (task / soc) change.
  Text marked with {C}, {I}, {S} is wrapped in AOI spans:
    C = conclusion and plan, I = information sentence, S = social sentence.
*/
window.CAREREAD_TEXT = {
  zh: {
    appName: "CareRead 健康報告諮詢",
    appTag: "線上健康報告解讀服務",
    caringFor: "照顧對象：媽媽（林美華，74 歲）",
    start: {
      title: "研究人員設定",
      pidLabel: "受試者編號",
      pidPlaceholder: "例如 P001",
      startBtn: "開始",
      note: "按下「開始」後畫面會切換為全螢幕。請將此電腦交給受試者。",
      pidError: "請先輸入受試者編號。"
    },
    scenario: {
      title: "情境說明",
      body: [
        "請想像以下情境：",
        "您的母親林美華女士今年 74 歲。上週她在社區診所完成了每年一次的成人預防保健檢查。",
        "今天您收到了她的檢查報告，於是打開「CareRead 健康報告諮詢」服務，上傳報告，並詢問這些結果代表什麼、接下來應該怎麼做。",
        "接下來會先顯示檢查報告，之後會顯示回覆。請像平常一樣自然地閱讀。"
      ],
      cont: "繼續",
      wait: "請先閱讀情境說明"
    },
    report: {
      title: "成人預防保健服務　檢查報告",
      clinic: "社區診所・採檢日期 2026-10-02",
      patient: ["姓名：林美華", "性別：女　年齡：74 歲"],
      cols: ["檢查項目", "結果", "參考值", "註記"],
      flagHigh: "偏高 ↑",
      note: "診所備註：血糖相關數值偏高，建議追蹤。",
      cont: "查看回覆",
      wait: "請先閱讀報告"
    },
    rows: [
      ["空腹血糖", "mg/dL", "70-99", "138", true],
      ["糖化血色素 (HbA1c)", "%", "4.0-5.6", "7.2", true],
      ["總膽固醇", "mg/dL", "< 200", "186", false],
      ["低密度脂蛋白膽固醇", "mg/dL", "< 130", "112", false],
      ["三酸甘油酯", "mg/dL", "< 150", "128", false],
      ["肌酸酐", "mg/dL", "0.5-1.0", "0.9", false],
      ["腎絲球過濾率 (eGFR)", "mL/min/1.73m²", "≥ 60", "72", false],
      ["丙胺酸轉胺酶 (ALT)", "U/L", "< 36", "24", false],
      ["血紅素", "g/dL", "12.0-16.0", "12.8", false]
    ],
    chat: {
      user: "我上傳了媽媽的健檢報告。可以幫我解釋這些結果代表什麼，以及我們接下來該怎麼做嗎？",
      typing: "正在輸入回覆",
      uploaded: "健檢報告.pdf"
    },
    advisors: {
      ai:  { badge: "AI", name: "CareRead AI 助理", role: "生成式人工智慧", disclosure: "此回覆由人工智慧（AI）生成，可能有錯誤，不能取代醫師的建議。" },
      hyb: { badge: "陳", name: "陳醫師（家庭醫學科）", role: "由 AI 草擬，經醫師審閱", disclosure: "此回覆由 AI 草擬，並經陳醫師審閱。" },
      doc: { badge: "陳", name: "陳醫師（家庭醫學科）", role: "醫師", disclosure: "此回覆由陳醫師撰寫。" }
    },
    reply: {
      task: [
        "{C}結果：您母親的血糖已超過糖尿病的判斷標準。{/C}",
        "{I}她的糖化血色素為 7.2%（參考值 4.0-5.6%；6.5% 以上表示可能為糖尿病），空腹血糖為 138 mg/dL（參考值 70-99）。腎功能（腎絲球過濾率 72）及膽固醇都在正常範圍內。{/I}",
        "{C}建議：一個月內安排家庭醫師門診，確認診斷並討論治療方式。在此之前，請減少含糖飲料和精緻澱粉。{/C}"
      ],
      soc: [
        "{S}謝謝您這麼用心照顧媽媽，看得出來您很關心她。{/S}{C}她的血糖已超過糖尿病的判斷標準，我們一起來看看。{/C}",
        "{I}她的糖化血色素為 7.2%（參考值 4.0-5.6%；6.5% 以上表示可能為糖尿病），空腹血糖為 138 mg/dL（參考值 70-99）。腎功能（腎絲球過濾率 72）及膽固醇都在正常範圍內。{/I}",
        "{C}建議：一個月內安排家庭醫師門診，確認診斷並討論治療方式。在此之前，請減少含糖飲料和精緻澱粉。{/C}{S}很多家庭都能把這個狀況照顧得很好，您已經踏出了正確的第一步。{/S}"
      ]
    },
    decision: {
      q: "接下來您會怎麼做？",
      follow: "依照建議的計畫進行",
      check: "先向其他醫療人員確認",
      wait: "請先閱讀回覆"
    },
    done: {
      title: "謝謝您！",
      body: "您的選擇已記錄。接下來請填寫問卷。",
      btn: "前往問卷",
      noForm: "問卷連結尚未設定，請通知研究人員。",
      saving: "正在儲存資料…",
      saved: "資料已儲存。",
      offline: "資料已暫存在此電腦，研究人員稍後會上傳。"
    },
    fixation: "請注視中央的十字"
  },

  en: {
    appName: "CareRead Health Report Consultation",
    appTag: "Online health report explanation service",
    caringFor: "Caring for: Mom (Lin Mei-hua, 74)",
    start: {
      title: "Researcher setup",
      pidLabel: "Participant ID",
      pidPlaceholder: "e.g. P001",
      startBtn: "Start",
      note: "The screen switches to full screen after Start. Hand the computer to the participant.",
      pidError: "Please enter a participant ID first."
    },
    scenario: {
      title: "Scenario",
      body: [
        "Please imagine the following situation:",
        "Your mother, Mrs. Lin Mei-hua, is 74 years old. Last week she completed her yearly adult preventive health check at a community clinic.",
        "Today you received her report, so you opened the CareRead health report consultation service, uploaded the report, and asked what the results mean and what to do next.",
        "You will first see the report and then the reply. Please read as you normally would."
      ],
      cont: "Continue",
      wait: "Please read the scenario first"
    },
    report: {
      title: "Adult Preventive Health Check Report",
      clinic: "Community clinic · Collected 2026-10-02",
      patient: ["Name: Lin Mei-hua", "Female · 74 years"],
      cols: ["Test", "Result", "Reference", "Flag"],
      flagHigh: "High ↑",
      note: "Clinic note: blood sugar results are high; follow-up advised.",
      cont: "See the reply",
      wait: "Please read the report first"
    },
    rows: [
      ["Fasting glucose", "mg/dL", "70-99", "138", true],
      ["HbA1c", "%", "4.0-5.6", "7.2", true],
      ["Total cholesterol", "mg/dL", "< 200", "186", false],
      ["LDL cholesterol", "mg/dL", "< 130", "112", false],
      ["Triglycerides", "mg/dL", "< 150", "128", false],
      ["Creatinine", "mg/dL", "0.5-1.0", "0.9", false],
      ["eGFR", "mL/min/1.73m²", "≥ 60", "72", false],
      ["ALT", "U/L", "< 36", "24", false],
      ["Hemoglobin", "g/dL", "12.0-16.0", "12.8", false]
    ],
    chat: {
      user: "I uploaded Mom's health check report. Can you explain what her results mean and what we should do next?",
      typing: "Typing a reply",
      uploaded: "Health_check_report.pdf"
    },
    advisors: {
      ai:  { badge: "AI", name: "CareRead AI Assistant", role: "Generative AI", disclosure: "This reply was generated by AI. It may contain errors and does not replace a doctor's advice." },
      hyb: { badge: "DC", name: "Dr. Chen, Family Medicine", role: "Drafted by AI, reviewed by the physician", disclosure: "This reply was drafted by AI and reviewed by Dr. Chen." },
      doc: { badge: "DC", name: "Dr. Chen, Family Medicine", role: "Physician", disclosure: "This reply was written by Dr. Chen." }
    },
    reply: {
      task: [
        "{C}Result: your mother's blood sugar is above the threshold for diabetes.{/C}",
        "{I}Her HbA1c is 7.2% (reference 4.0-5.6%; 6.5% or higher suggests diabetes) and her fasting glucose is 138 mg/dL (reference 70-99). Kidney function (eGFR 72) and cholesterol are within the normal range.{/I}",
        "{C}Plan: book a visit with her family doctor within the next month to confirm the diagnosis and discuss treatment. Until then, cut down on sugary drinks and refined starches.{/C}"
      ],
      soc: [
        "{S}Thank you for taking such good care of your mother; I can tell how much you care about her.{/S} {C}Her blood sugar is above the threshold for diabetes, so let's look at it together.{/C}",
        "{I}Her HbA1c is 7.2% (reference 4.0-5.6%; 6.5% or higher suggests diabetes) and her fasting glucose is 138 mg/dL (reference 70-99). Kidney function (eGFR 72) and cholesterol are within the normal range.{/I}",
        "{C}Plan: book a visit with her family doctor within the next month to confirm the diagnosis and discuss treatment. Until then, cut down on sugary drinks and refined starches.{/C} {S}Many families manage this well, and you have already taken the right first step.{/S}"
      ]
    },
    decision: {
      q: "What will you do next?",
      follow: "Follow the suggested plan",
      check: "Check with another health professional first",
      wait: "Please read the reply first"
    },
    done: {
      title: "Thank you!",
      body: "Your choice has been recorded. Please continue to the questionnaire.",
      btn: "Go to the questionnaire",
      noForm: "The questionnaire link is not set yet. Please tell the researcher.",
      saving: "Saving your data…",
      saved: "Data saved.",
      offline: "Data were stored on this computer; the researcher will upload them later."
    },
    fixation: "Please look at the cross in the center"
  }
};
