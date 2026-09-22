import { SampleDoc } from '../types';

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: 'sample-legal-notice-138',
    title: 'Court Legal Notice — Section 138 (Cheque Dishonor)',
    category: 'Legal Notice',
    description: 'Demand notice alleging dishonor of cheque with 15 days statutory cure period before criminal prosecution.',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%23f8fafc"><rect width="400" height="500" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4"/><text x="200" y="40" font-family="serif" font-size="16" font-weight="bold" text-anchor="middle" fill="%230f172a">ADVOCATES &amp; LEGAL CONSULTANTS</text><text x="200" y="60" font-family="serif" font-size="11" text-anchor="middle" fill="%23475569">Chamber No. 42, Tis Hazari Courts, Delhi</text><line x1="40" y1="75" x2="360" y2="75" stroke="%2394a3b8" stroke-width="1.5"/><text x="40" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23b91c1c">LEGAL NOTICE UNDER SECTION 138 NI ACT</text><text x="40" y="130" font-family="sans-serif" font-size="10" fill="%23334155">To: Mr. Ramesh Verma, Resident of Rohini, New Delhi</text><text x="40" y="150" font-family="sans-serif" font-size="10" fill="%23334155">Date of Dispatch: 18 September 2026</text><text x="40" y="180" font-family="sans-serif" font-size="10" fill="%231e293b">Under instructions of client M/s Apex Supplies, you are</text><text x="40" y="195" font-family="sans-serif" font-size="10" fill="%231e293b">notified that Cheque 492019 for Rs. 84,500 was returned</text><text x="40" y="210" font-family="sans-serif" font-size="10" fill="%231e293b">unpaid with memo "FUNDS INSUFFICIENT".</text><text x="40" y="240" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23991b1b">MANDATORY DEMAND: You are called upon to make payment</text><text x="40" y="255" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23991b1b">of Rs. 84,500 within 15 (FIFTEEN) DAYS of receipt,</text><text x="40" y="270" font-family="sans-serif" font-size="10" fill="%231e293b">failing which criminal prosecution under Section 138 of NI</text><text x="40" y="285" font-family="sans-serif" font-size="10" fill="%231e293b">Act shall be filed at your sole risk and costs.</text><text x="40" y="320" font-family="sans-serif" font-size="10" fill="%23475569">Yours faithfully,</text><text x="40" y="340" font-family="serif" font-size="12" font-style="italic" fill="%230f172a">A. K. Sharma, Advocate</text></svg>`,
    ocrText: `ADVOCATES & LEGAL CONSULTANTS
Chamber No. 42, Tis Hazari Courts, Delhi - 110054
Date: 18 September 2026

REGISTERED A.D. / SPEED POST
STATUTORY LEGAL DEMAND NOTICE UNDER SECTION 138 OF NEGOTIABLE INSTRUMENTS ACT, 1881

To:
Mr. Ramesh Verma
Resident of B-4/12, Sector 8, Rohini, New Delhi - 110085

Sir,
Under explicit instructions from my client M/s Apex Supplies Pvt Ltd, I serve upon you this statutory notice:
1. That towards discharge of legally enforceable debt, you issued Cheque No. 492019 drawn on HDFC Bank for Rs. 84,500/- (Rupees Eighty Four Thousand Five Hundred only).
2. The said cheque upon presentation was dishonored with remark "Funds Insufficient" vide memo dated 12/09/2026.
3. Therefore, you are hereby called upon to pay the outstanding sum of Rs. 84,500/- within a period of 15 (FIFTEEN) DAYS from receipt of this notice.
4. If you fail to tender the full amount within the stipulated 15 days, my client will initiate criminal proceedings against you under Section 138 read with Section 142 of NI Act, carrying up to 2 years imprisonment.

A. K. Sharma, Advocate
Tis Hazari Courts`,
    sampleResultEn: {
      tldr: 'A company is demanding ₹84,500 for a bounced cheque. You have exactly 15 days from receiving this notice to pay before they file a criminal case against you.',
      actionItems: [
        {
          text: 'Pay ₹84,500 to Apex Supplies or reply through an advocate if disputed.',
          deadline: 'Within 15 days of receiving notice',
          urgency: 'high',
        },
        {
          text: 'Preserve your bank statement and proof of any past payments or delivery disputes.',
          deadline: null,
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 138 NI Act',
          plainMeaning: 'The Indian law that makes issuing a cheque that bounces due to insufficient funds a criminal offense punishable by up to 2 years imprisonment.',
        },
        {
          term: 'Legally enforceable debt',
          plainMeaning: 'Money that you legally owe and can be made to pay through the courts.',
        },
        {
          term: 'Statutory Demand Notice',
          plainMeaning: 'A mandatory legal warning given before the sender is permitted to file a formal court complaint.',
        },
      ],
      riskLevel: 'high',
      riskReason: 'Failing to pay or formally respond within 15 days allows the sender to file a criminal complaint punishable by jail time or double the penalty.',
    },
    sampleResultHi: {
      tldr: 'चेक बाउंस होने के कारण ₹84,500 का भुगतान मांगा गया है। कानूनी मुकदमे से बचने के लिए नोटिस मिलने के 15 दिनों के भीतर भुगतान करना अनिवार्य है।',
      actionItems: [
        {
          text: 'कंपनी को ₹84,500 का भुगतान करें या अपने वकील के माध्यम से लिखित जवाब भेजें।',
          deadline: 'नोटिस मिलने के 15 दिनों के भीतर',
          urgency: 'high',
        },
        {
          text: 'अपने बैंक खाते का विवरण और लेन-देन के सभी प्रमाण सुरक्षित रखें।',
          deadline: null,
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 138 NI Act',
          plainMeaning: 'भारतीय कानून जिसके तहत चेक बाउंस होना एक कानूनी और गैर-जमानती अपराध माना जाता है।',
        },
        {
          term: 'Statutory Notice',
          plainMeaning: 'अदालत में केस दर्ज करने से पहले भेजा जाने वाला अनिवार्य अंतिम कानूनी चेतावनी पत्र।',
        },
      ],
      riskLevel: 'high',
      riskReason: '15 दिन के भीतर पैसे न देने या जवाब न देने पर सीधे अदालत में आपराधिक केस दर्ज हो सकता है।',
    },
  },
  {
    id: 'sample-rti-reply',
    title: 'Right to Information (RTI) — First Appeal Decision',
    category: 'Government / RTI',
    description: 'Government department reply denying partial information under Section 8(1)(j) with 30-day second appeal window.',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%23f8fafc"><rect width="400" height="500" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="4"/><circle cx="200" cy="45" r="18" fill="%230284c7" opacity="0.2"/><text x="200" y="49" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="%230369a1">GOVERNMENT OF INDIA</text><text x="200" y="75" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="%230f172a">OFFICE OF THE CENTRAL PUBLIC INFORMATION OFFICER</text><text x="200" y="92" font-family="sans-serif" font-size="10" text-anchor="middle" fill="%2364748b">Ministry of Road Transport &amp; Highways, New Delhi</text><line x1="30" y1="105" x2="370" y2="105" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="130" font-family="sans-serif" font-size="10" fill="%23334155">RTI Registration No: MORH/R/E/26/00912</text><text x="40" y="150" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230284c7">DISPOSAL ORDER OF FIRST APPELLATE AUTHORITY</text><text x="40" y="180" font-family="sans-serif" font-size="10" fill="%231e293b">Point 1 (Tender inspection records): Provided in Annexure A.</text><text x="40" y="200" font-family="sans-serif" font-size="10" fill="%231e293b">Point 2 and 3 (Contractor evaluation sheets): Withheld under</text><text x="40" y="215" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23d97706">Section 8(1)(d) and 8(1)(j) of RTI Act.</text><text x="40" y="245" font-family="sans-serif" font-size="10" fill="%231e293b">Appellate decision: CPIO decision is upheld in part.</text><text x="40" y="280" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230f172a">SECOND APPEAL PROVISION:</text><text x="40" y="295" font-family="sans-serif" font-size="10" fill="%23334155">If aggrieved, an appeal lies before Central Information Commission</text><text x="40" y="310" font-family="sans-serif" font-size="10" font-weight="bold" fill="%232563eb">within 90 days from receipt under Section 19(3) of Act.</text><text x="40" y="350" font-family="sans-serif" font-size="10" fill="%23475569">First Appellate Authority &amp; Joint Secretary</text></svg>`,
    ocrText: `GOVERNMENT OF INDIA
MINISTRY OF ROAD TRANSPORT & HIGHWAYS
Transport Bhawan, 1 Parliament Street, New Delhi - 110001
Order No: RTI/FAA/2026/4102
Dated: 14 September 2026

ORDER UNDER SECTION 19(1) OF THE RTI ACT, 2005

In the matter of First Appeal filed by:
Shri Anil Kumar Meena, Jaipur, Rajasthan
Against CPIO reply dated 02/08/2026

1. The Appellant sought tender award criteria and road quality inspection logs for NH-48 widening.
2. The CPIO provided inspection logs (Item 1) but denied contractor bids (Item 2 & 3) citing Section 8(1)(d) (commercial confidence) and Section 8(1)(j) (personal information).
3. Finding: Having perused records, the FAA finds the CPIO was justified in withholding Item 2. However, redacted summary of bidder scores can be disclosed.
4. The CPIO is directed to furnish redacted summary within 15 working days.
5. APPELLATE REMEDY: If the appellant is still dissatisfied, Second Appeal under Section 19(3) of RTI Act may be filed before the Central Information Commission (CIC), Baba Gang Nath Marg, Munirka, New Delhi within 90 days of receipt of this order.`,
    sampleResultEn: {
      tldr: 'The RTI officer gave you part of the road inspection documents, but kept contractor bids secret. You will get a summarized score sheet within 15 days, or can appeal to CIC within 90 days.',
      actionItems: [
        {
          text: 'Wait for the CPIO to deliver the revised score summary.',
          deadline: 'Within 15 working days',
          urgency: 'low',
        },
        {
          text: 'File a Second Appeal with Central Information Commission (CIC) if full bidder data is still required.',
          deadline: 'Within 90 days of receipt',
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 8(1)(d)',
          plainMeaning: 'A clause in RTI law allowing departments to withhold trade secrets or private commercial calculations.',
        },
        {
          term: 'FAA (First Appellate Authority)',
          plainMeaning: 'A senior officer in the same department who reviews complaints if the initial RTI officer refuses information.',
        },
        {
          term: 'Redacted summary',
          plainMeaning: 'A copy with private business numbers blacked out while keeping public government scores visible.',
        },
      ],
      riskLevel: 'low',
      riskReason: 'This is an informational government order. You face no financial penalty or legal liability; you only have optional rights to appeal further.',
    },
    sampleResultHi: {
      tldr: 'आरटीआई में मांगी गई सड़क जांच रिपोर्ट दे दी गई है, लेकिन ठेकेदार की गोपनीय बोलियां रोकी गई हैं। 15 दिन में सारांश मिलेगा, संतुष्ट न होने पर 90 दिन में सीआईसी में अपील कर सकते हैं।',
      actionItems: [
        {
          text: 'संशोधित सारांश रिपोर्ट आने की प्रतीक्षा करें।',
          deadline: '15 कार्य दिवसों में',
          urgency: 'low',
        },
        {
          text: 'पूरी जानकारी न मिलने पर केंद्रीय सूचना आयोग (CIC) में द्वितीय अपील दाखिल करें।',
          deadline: 'आदेश प्राप्ति के 90 दिनों में',
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 8(1)(d)',
          plainMeaning: 'आरटीआई की धारा जिसके तहत व्यावसायिक गोपनीयता की जानकारी देने से छूट मिलती है।',
        },
        {
          term: 'FAA (प्रथम अपीलीय अधिकारी)',
          plainMeaning: 'विभाग का वरिष्ठ अधिकारी जो पहली आरटीआई अर्जी खारिज होने पर दोबारा समीक्षा करता है।',
        },
      ],
      riskLevel: 'low',
      riskReason: 'यह एक सूचनात्मक सरकारी आदेश है। आप पर कोई कानूनी या आर्थिक दंड नहीं है।',
    },
  },
  {
    id: 'sample-electricity-bill-disconnection',
    title: 'Disconnection Notice & Penalty Bill — State Electricity Board',
    category: 'Bill / Utility Notice',
    description: 'Urgent electricity supply disconnection notice for arrears and unauthorized load surcharge.',
    imageDataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%23fff1f2"><rect width="400" height="500" fill="%23fff1f2" stroke="%23fecdd3" stroke-width="4"/><rect x="20" y="20" width="360" height="40" rx="6" fill="%23dc2626"/><text x="200" y="45" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="%23ffffff">FINAL DISCONNECTION NOTICE / DEMAND BILL</text><text x="40" y="90" font-family="sans-serif" font-size="11" font-weight="bold" fill="%230f172a">BSES RAJDHANI POWER LIMITED</text><text x="40" y="105" font-family="sans-serif" font-size="10" fill="%23475569">Consumer No: 100293841 | Meter No: DL-88492</text><text x="40" y="125" font-family="sans-serif" font-size="10" fill="%23334155">Consumer Name: Sunita Devi, Shakarpur, Delhi</text><line x1="40" y1="140" x2="360" y2="140" stroke="%23fca5a5" stroke-width="1.5"/><text x="40" y="170" font-family="sans-serif" font-size="11" fill="%231e293b">Total Current Charges: Rs. 4,120.00</text><text x="40" y="190" font-family="sans-serif" font-size="11" fill="%231e293b">Arrears / Past Dues: Rs. 12,450.00</text><text x="40" y="210" font-family="sans-serif" font-size="11" fill="%23dc2626" font-weight="bold">Unauthorized Connected Load Surcharge: Rs. 6,800.00</text><text x="40" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23991b1b">TOTAL PAYABLE: Rs. 23,370.00</text><rect x="35" y="260" width="330" height="55" rx="4" fill="%23fee2e2" stroke="%23ef4444"/><text x="45" y="280" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23b91c1c">URGENT NOTICE UNDER SECTION 56(1) ELECTRICITY ACT:</text><text x="45" y="295" font-family="sans-serif" font-size="9" fill="%237f1d1d">Power supply will be disconnected on 29 September 2026</text><text x="45" y="307" font-family="sans-serif" font-size="9" fill="%237f1d1d">unless full clearance or dispute bond is submitted before 5:00 PM.</text><text x="40" y="345" font-family="sans-serif" font-size="10" fill="%23334155">Reconnection Fee: Rs. 1,500 + 18% GST applicable post-disconnection.</text></svg>`,
    ocrText: `BSES RAJDHANI POWER LIMITED
Sub-Division: Shakarpur East, Delhi - 110092
NOTICE UNDER SECTION 56(1) OF THE ELECTRICITY ACT, 2003

Consumer No: 100293841
Name: Sunita Devi
Sanctioned Load: 2.0 KW | Recorded MDI: 4.8 KW
Bill Date: 15/09/2026

BILL BREAKDOWN:
Energy Consumption (680 Units): Rs. 4,120.00
Unpaid Arrears: Rs. 12,450.00
Connected Load Surcharge (Penalty for exceeding 2KW): Rs. 6,800.00
Late Payment Surcharge: Rs. 0.00
TOTAL OUTSTANDING AMOUNT: Rs. 23,370.00

STATUTORY WARNING:
Take notice that unless the total outstanding sum of Rs. 23,370/- is paid into the licensee account ON OR BEFORE 29 SEPTEMBER 2026, power supply to your premises will be DISCONNECTED without any further intimation.
Disconnection date: 29/09/2026 at 17:00 hrs.
Reconnection charges of Rs. 1,500 + GST will be payable extra.`,
    sampleResultEn: {
      tldr: 'You owe ₹23,370 on your electric meter, including a ₹6,800 penalty for using heavy appliances beyond your 2KW limit. Electricity will be cut off on 29 September 2026 unless paid.',
      actionItems: [
        {
          text: 'Pay ₹23,370 online or at the Shakarpur bill center to avoid power cut.',
          deadline: '29 September 2026 (5:00 PM)',
          urgency: 'high',
        },
        {
          text: 'Apply for sanctioned load enhancement from 2KW to 5KW to stop the monthly surcharge penalty.',
          deadline: null,
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 56(1) Electricity Act',
          plainMeaning: 'The statutory law giving power companies the right to cut wire connections after 15 days notice for non-payment.',
        },
        {
          term: 'Connected Load Surcharge',
          plainMeaning: 'A penalty fee added when your meter detects you used more air conditioners or heaters than your sanctioned meter plan allows.',
        },
        {
          term: 'Recorded MDI',
          plainMeaning: 'Maximum Demand Indicator — the highest power wattage recorded running simultaneously in your home.',
        },
      ],
      riskLevel: 'high',
      riskReason: 'Your electricity supply will be cut off in 7 days, and extra reconnection fees will be charged.',
    },
    sampleResultHi: {
      tldr: 'बिजली बिल और 2KW से अधिक लोड चलाने के जुर्माने सहित कुल ₹23,370 बकाया है। 29 सितंबर 2026 तक भुगतान न करने पर बिजली का कनेक्शन काट दिया जाएगा।',
      actionItems: [
        {
          text: 'बिजली कटने से बचने के लिए ₹23,370 का भुगतान करें।',
          deadline: '29 सितंबर 2026 शाम 5 बजे तक',
          urgency: 'high',
        },
        {
          text: 'अतिरिक्त जुर्माना बंद करने के लिए बिजली कंपनी में लोड 2KW से बढ़ाकर 5KW करवाएं।',
          deadline: null,
          urgency: 'medium',
        },
      ],
      glossary: [
        {
          term: 'Section 56(1)',
          plainMeaning: 'बिजली कानून जिसके तहत बिल न भरने पर 15 दिन की चेतावनी के बाद बिजली काट दी जाती है।',
        },
        {
          term: 'Connected Load Surcharge',
          plainMeaning: 'मंजूर लोड से अधिक एसी या हीटर चलाने पर बिजली बोर्ड द्वारा लगाया गया आर्थिक दंड।',
        },
      ],
      riskLevel: 'high',
      riskReason: '7 दिनों के भीतर बिजली कट जाएगी और दोबारा कनेक्शन के लिए ₹1,500 का अतिरिक्त शुल्क लगेगा।',
    },
  },
];
