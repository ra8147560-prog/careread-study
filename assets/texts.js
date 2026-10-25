/*
  All participant-facing text, in Traditional Chinese (zh) and English (en).

  Design rules (eye-tracking):
  - The medical content (INFO and PLAN blocks) is identical in all six conditions.
  - Agent Identity changes only the advisor name, role, avatar, reply workflow,
    typing status and the attribution line under each reply.
  - Communication Style changes only the two STYLE blocks of each message
    (first and last line). Task-oriented and social-oriented STYLE blocks have
    about the same length and sit in the same position; only the social-oriented
    blocks are warm and carry one emoji.
  - Verification probes (identical in all six conditions):
      P1 (minor, turn 1): LDL cholesterol quoted as 121; the report shows 112.
      P2 (critical, turns 2 and 3): HbA1c quoted as 6.2% and fasting glucose as
         118 mg/dL; the report shows 7.2% and 138 mg/dL. Because of this misreading
         the advisor calls it prediabetes and advises no doctor visit for 6 months.
    Probe numbers are wrapped as {P1}..{/P1}, {P2}..{/P2} and logged as AOIs.
  Everything is fictional and must be explained in the debriefing.
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
        "請想像以下情境：您的母親林美華女士今年 74 歲。上週她在社區診所完成了每年一次的成人預防保健檢查。",
        "今天您收到了她的檢查報告，於是打開「CareRead 健康報告諮詢」服務，上傳報告，想了解結果代表什麼、接下來應該怎麼做。"
      ],
      steps: ["閱讀檢查報告", "與顧問對話（共 3 輪）", "決定接下來怎麼做"],
      note: "對話時，檢查報告會一直顯示在畫面左側。請像平常一樣自然地閱讀。",
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
      lead: "請先閱讀媽媽的檢查報告",
      cont: "上傳報告並開始諮詢",
      wait: "請先閱讀報告"
    },
    rows: [
      ["GLU", "空腹血糖", "mg/dL", "70-99", "138", true],
      ["A1C", "糖化血色素 (HbA1c)", "%", "4.0-5.6", "7.2", true],
      ["TC", "總膽固醇", "mg/dL", "< 200", "186", false],
      ["LDL", "低密度脂蛋白膽固醇", "mg/dL", "< 130", "112", false],
      ["TG", "三酸甘油酯", "mg/dL", "< 150", "128", false],
      ["CRE", "肌酸酐", "mg/dL", "0.5-1.0", "0.9", false],
      ["EGFR", "腎絲球過濾率 (eGFR)", "mL/min/1.73m²", "≥ 60", "72", false],
      ["ALT", "丙胺酸轉胺酶 (ALT)", "U/L", "< 36", "24", false],
      ["HB", "血紅素", "g/dL", "12.0-16.0", "12.8", false]
    ],
    intro: {
      title: "您的報告將由以下顧問解讀",
      flowLabel: "回覆流程",
      start: "開始諮詢",
      wait: "請先閱讀顧問介紹"
    },
    advisors: {
      ai: {
        name: "CareRead AI 助理",
        role: "生成式人工智慧（AI）",
        bio: "以大量醫學資料訓練的生成式 AI，自動為您解讀檢查報告。",
        flow: ["AI 產生回覆", "送出"],
        typing: ["CareRead AI 助理正在產生回覆"],
        tag: "此回覆由 AI 自動產生"
      },
      hyb: {
        name: "陳志明 醫師",
        role: "家庭醫學科・AI 輔助",
        bio: "AI 先草擬回覆，再由家庭醫學科陳醫師審閱後送出。",
        flow: ["AI 草擬回覆", "陳醫師審閱", "送出"],
        typing: ["AI 正在草擬回覆", "陳醫師正在審閱回覆"],
        tag: "此回覆由 AI 草擬，經陳醫師審閱"
      },
      doc: {
        name: "陳志明 醫師",
        role: "家庭醫學科醫師",
        bio: "家庭醫學科專科醫師，親自閱讀並為您解讀檢查報告。",
        flow: ["陳醫師撰寫回覆", "送出"],
        typing: ["陳醫師正在輸入回覆"],
        tag: "此回覆由陳醫師撰寫"
      }
    },
    greeting: {
      task: "您好，我將依您上傳的檢查報告，逐項說明檢查結果。",
      soc: "您好！很高興認識您 😊 我會陪您一起看懂媽媽的報告。"
    },
    uploaded: "健檢報告.pdf",
    turnLabel: "對話 {n}／3",
    nextPrefix: "傳送下一個問題：",
    quote: ["「", "」"],
    replyWait: "請先閱讀回覆",
    questions: [
      "我上傳了媽媽的健檢報告，可以幫我看看結果嗎？",
      "血糖偏高的部分嚴重嗎？",
      "那我們接下來該怎麼做？"
    ],
    turns: [
      {
        sty: {
          task: ["以下依報告內容進行整體說明。", "如需各項目的說明，請直接提問。"],
          soc: ["謝謝您這麼細心照顧媽媽，辛苦了 😊", "有任何擔心都可以問我，我們一起看 🤝"]
        },
        info: "大部分數值都在正常範圍：總膽固醇 186、低密度脂蛋白膽固醇 {P1}121{/P1}、腎絲球過濾率 72、ALT 24，血紅素 12.8 也正常。",
        plan: "報告中只有兩項血糖數值標示偏高，其餘項目目前不需要特別處理。"
      },
      {
        sty: {
          task: ["以下說明兩項血糖數值的意義。", "下一則訊息將說明後續建議。"],
          soc: ["看到「偏高」一定會擔心，別緊張 🙂", "及早發現是好事，我們有很多方法 🌱"]
        },
        info: "她的糖化血色素為 {P2}6.2%{/P2}，空腹血糖為 {P2}118 mg/dL{/P2}。糖化血色素 5.7-6.4% 或空腹血糖 100-125 mg/dL 屬於糖尿病前期。",
        plan: "因此，媽媽目前屬於糖尿病前期，還不是糖尿病。"
      },
      {
        sty: {
          task: ["以下是為媽媽建議的後續計畫。", "如有新的檢查結果，可再上傳比對。"],
          soc: ["您這樣用心陪伴媽媽，真的很棒 💪", "半年後我們再一起看看檢查結果 😊"]
        },
        info: "由於糖化血色素 {P2}6.2%{/P2} 屬於糖尿病前期，目前不需要立即就醫或用藥。",
        plan: "建議：減少含糖飲料與精緻澱粉，每天散步 30 分鐘，6 個月後再回診所抽血追蹤。"
      }
    ],
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
        "Please imagine the following situation: your mother, Mrs. Lin Mei-hua, is 74 years old. Last week she completed her yearly adult preventive health check at a community clinic.",
        "Today you received her report, so you opened the CareRead health report consultation service and uploaded the report to find out what the results mean and what to do next."
      ],
      steps: ["Read the report", "Chat with the advisor (3 rounds)", "Decide what to do next"],
      note: "During the chat, the report stays on the left side of the screen. Please read as you normally would.",
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
      lead: "Please read Mom's health check report first",
      cont: "Upload the report and start",
      wait: "Please read the report first"
    },
    rows: [
      ["GLU", "Fasting glucose", "mg/dL", "70-99", "138", true],
      ["A1C", "HbA1c", "%", "4.0-5.6", "7.2", true],
      ["TC", "Total cholesterol", "mg/dL", "< 200", "186", false],
      ["LDL", "LDL cholesterol", "mg/dL", "< 130", "112", false],
      ["TG", "Triglycerides", "mg/dL", "< 150", "128", false],
      ["CRE", "Creatinine", "mg/dL", "0.5-1.0", "0.9", false],
      ["EGFR", "eGFR", "mL/min/1.73m²", "≥ 60", "72", false],
      ["ALT", "ALT", "U/L", "< 36", "24", false],
      ["HB", "Hemoglobin", "g/dL", "12.0-16.0", "12.8", false]
    ],
    intro: {
      title: "Your report will be explained by",
      flowLabel: "How replies are written",
      start: "Start the consultation",
      wait: "Please read the advisor profile first"
    },
    advisors: {
      ai: {
        name: "CareRead AI Assistant",
        role: "Generative AI",
        bio: "A generative AI trained on large amounts of medical data that explains your report automatically.",
        flow: ["AI generates the reply", "Sent"],
        typing: ["CareRead AI Assistant is generating a reply"],
        tag: "This reply was generated automatically by AI"
      },
      hyb: {
        name: "Dr. Chen Chih-ming",
        role: "Family Medicine · AI-assisted",
        bio: "AI drafts each reply first; Dr. Chen, a family physician, reviews it before it is sent.",
        flow: ["AI drafts the reply", "Dr. Chen reviews it", "Sent"],
        typing: ["AI is drafting a reply", "Dr. Chen is reviewing the reply"],
        tag: "This reply was drafted by AI and reviewed by Dr. Chen"
      },
      doc: {
        name: "Dr. Chen Chih-ming",
        role: "Family Physician",
        bio: "A board-certified family physician who reads your report and explains it to you personally.",
        flow: ["Dr. Chen writes the reply", "Sent"],
        typing: ["Dr. Chen is typing a reply"],
        tag: "This reply was written by Dr. Chen"
      }
    },
    greeting: {
      task: "Hello. I will go through the uploaded report and explain each result in turn.",
      soc: "Hi there! It's so nice to meet you 😊 Let's understand Mom's report together."
    },
    uploaded: "Health_check_report.pdf",
    turnLabel: "Chat {n} of 3",
    nextPrefix: "Send the next question: ",
    quote: ["\u201c", "\u201d"],
    replyWait: "Please read the reply first",
    questions: [
      "I uploaded Mom's health check report. Could you look at the results?",
      "Is the high blood sugar serious?",
      "So what should we do next?"
    ],
    turns: [
      {
        sty: {
          task: ["Here is an overall summary of the report.", "Ask about any item if you need more detail."],
          soc: ["Thank you for taking such good care of Mom 😊", "Ask me anything, we'll go through it together 🤝"]
        },
        info: "Most results are in the normal range: total cholesterol 186, LDL cholesterol {P1}121{/P1}, eGFR 72, ALT 24, and hemoglobin 12.8.",
        plan: "Only the two blood sugar items are flagged high; the other items need no action for now."
      },
      {
        sty: {
          task: ["Here is what the two blood sugar values mean.", "The next message covers the recommended plan."],
          soc: ["It's natural to worry when you see \"high\" 🙂", "Catching this early is good, and we can do a lot 🌱"]
        },
        info: "Her HbA1c is {P2}6.2%{/P2} and her fasting glucose is {P2}118 mg/dL{/P2}. An HbA1c of 5.7-6.4% or a fasting glucose of 100-125 mg/dL indicates prediabetes.",
        plan: "So your mother is currently in the prediabetes range, not diabetes."
      },
      {
        sty: {
          task: ["Here is the recommended follow-up plan.", "You can upload new results here for comparison."],
          soc: ["It's wonderful how you're looking after her 💪", "Let's look at her results together in six months 😊"]
        },
        info: "Because an HbA1c of {P2}6.2%{/P2} is in the prediabetes range, she does not need a doctor's visit or medication right now.",
        plan: "Plan: cut down on sugary drinks and refined starches, walk 30 minutes a day, and repeat the blood test at the clinic in 6 months."
      }
    ],
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
