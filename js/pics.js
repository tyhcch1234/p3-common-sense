/* 插圖庫：全部以 SVG 手繪，可離線使用（不依賴 emoji 字型） */
(function () {
  const SKIN = '#ffdcbd', HAIR = '#453027', SHIRT = '#cfe6fb', PANTS = '#5b7fb6';

  const wrap = (inner, bg = '#eaf6ff') =>
    `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" role="img">
      <rect width="400" height="260" rx="18" fill="${bg}"/>${inner}</svg>`;

  const shadow = (x, y, rx = 24) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="5.5" fill="#1b2b38" opacity=".08"/>`;

  /* 小孩：y = 腳踏位置 */
  function kid(x, y, o = {}) {
    const s = o.s || 1, shirt = o.shirt || SHIRT, bottom = o.bottom || PANTS;
    const hair = o.hair || HAIR, face = o.face || 'smile', girl = !!o.girl;
    const mouth = {
      smile: `<path d="M-5 -33 q5 4.5 10 0" stroke="#a9553f" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      open: `<ellipse cx="0" cy="-31" rx="4.6" ry="5.4" fill="#b5615a"/>`,
      sad: `<path d="M-5 -31 q5 -4 10 0" stroke="#a9553f" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      cry: `<path d="M-6 -30 q6 -5.5 12 0" stroke="#a9553f" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
      angry: `<path d="M-5 -31 h10" stroke="#a9553f" stroke-width="2.3" stroke-linecap="round"/>`,
      worry: `<circle cx="0" cy="-31" r="3.4" fill="none" stroke="#a9553f" stroke-width="2"/>`
    }[face] || '';
    const eyes = face === 'cry'
      ? `<path d="M-11 -43 q5 -4 9 0M2 -43 q5 -4 9 0" stroke="#3a2a22" stroke-width="2" fill="none" stroke-linecap="round"/>
         <path d="M-7 -40 q-1.5 7 0 10" stroke="#63c7f2" stroke-width="2.6" fill="none" stroke-linecap="round"/>
         <path d="M7 -40 q1.5 7 0 10" stroke="#63c7f2" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<circle cx="-6" cy="-42" r="2.7" fill="#3a2a22"/><circle cx="6" cy="-42" r="2.7" fill="#3a2a22"/>`;
    const hairTop = girl
      ? `<path d="M-17 -45 q1 -19 17 -19 q16 0 17 19 q-7 -8 -17 -8 q-10 0 -17 8z" fill="${hair}"/>
         <circle cx="-17.5" cy="-42" r="6.6" fill="${hair}"/><circle cx="17.5" cy="-42" r="6.6" fill="${hair}"/>
         <circle cx="20" cy="-51" r="3" fill="#ff9ec4"/>`
      : `<path d="M-17 -45 q1 -19 17 -19 q16 0 17 19 q-7 -9 -17 -9 q-10 0 -17 9z" fill="${hair}"/>`;
    const arms = o.arms === 'up'
      ? `<path d="M-13 -16 q-11 -12 -7 -23" stroke="${shirt}" stroke-width="7.5" stroke-linecap="round" fill="none"/>
         <path d="M13 -16 q11 -12 7 -23" stroke="${shirt}" stroke-width="7.5" stroke-linecap="round" fill="none"/>
         <circle cx="-19" cy="-39" r="3.6" fill="${SKIN}"/><circle cx="19" cy="-39" r="3.6" fill="${SKIN}"/>`
      : `<path d="M-13 -16 q-9 11 -8 20" stroke="${shirt}" stroke-width="7.5" stroke-linecap="round" fill="none"/>
         <path d="M13 -16 q9 11 8 20" stroke="${shirt}" stroke-width="7.5" stroke-linecap="round" fill="none"/>
         <circle cx="-21" cy="4" r="3.6" fill="${SKIN}"/><circle cx="21" cy="4" r="3.6" fill="${SKIN}"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">
      ${shadow(0, 42, 21)}
      <rect x="-7.5" y="10" width="5.5" height="28" rx="2.7" fill="${SKIN}"/><rect x="2" y="10" width="5.5" height="28" rx="2.7" fill="${SKIN}"/>
      <ellipse cx="-4.5" cy="40" rx="7" ry="4" fill="#3b4a5c"/><ellipse cx="4.5" cy="40" rx="7" ry="4" fill="#3b4a5c"/>
      <path d="M-15 14 v-22 q0 -14 15 -14 q15 0 15 14 v22z" fill="${shirt}"/>
      <rect x="-9" y="14" width="18" height="7" rx="3" fill="${bottom}"/>
      ${arms}
      <circle cx="0" cy="-42" r="17" fill="${SKIN}"/>
      ${hairTop}${eyes}${mouth}
      <circle cx="-12.5" cy="-37" r="3.2" fill="#ffb3a7" opacity=".65"/>
      <circle cx="12.5" cy="-37" r="3.2" fill="#ffb3a7" opacity=".65"/>
    </g>`;
  }

  /* 大人（老師） */
  function adult(x, y, o = {}) {
    return `<g transform="translate(${x},${y}) scale(${o.s || 1.1})">
      ${shadow(0, 46, 24)}
      <rect x="-8" y="12" width="6" height="32" rx="3" fill="${SKIN}"/><rect x="2" y="12" width="6" height="32" rx="3" fill="${SKIN}"/>
      <ellipse cx="-5" cy="45" rx="8" ry="4.5" fill="#7a4a2a"/><ellipse cx="5" cy="45" rx="8" ry="4.5" fill="#7a4a2a"/>
      <path d="M-17 16 v-26 q0 -16 17 -16 q17 0 17 16 v26z" fill="${o.color || '#ef7a6b'}"/>
      <path d="M-17 16 h34 v-6 h-34z" fill="#d9604f" opacity=".5"/>
      <path d="M-15 -18 q-10 12 -9 22" stroke="${o.color || '#ef7a6b'}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M15 -18 q10 12 9 22" stroke="${o.color || '#ef7a6b'}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <circle cx="-24" cy="6" r="4" fill="${SKIN}"/><circle cx="24" cy="6" r="4" fill="${SKIN}"/>
      <circle cx="0" cy="-46" r="18" fill="${SKIN}"/>
      <path d="M-18 -50 q2 -20 18 -20 q16 0 18 20 q-9 -10 -18 -10 q-9 0 -18 10z" fill="#3c2a20"/>
      <circle cx="19" cy="-52" r="8" fill="#3c2a20"/>
      <circle cx="-6" cy="-47" r="2.8" fill="#3a2a22"/><circle cx="6" cy="-47" r="2.8" fill="#3a2a22"/>
      <path d="M-5 -37 q5 5 10 0" stroke="#a9553f" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="-12" cy="-41" r="3" fill="#ffb3a7" opacity=".6"/><circle cx="12" cy="-41" r="3" fill="#ffb3a7" opacity=".6"/>
    </g>`;
  }

  const table = (x, y, w = 150, h = 8) => `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#d9a15e"/>
      <rect x="${x + 9}" y="${y + h}" width="7" height="${34 - h}" fill="#c08a4c"/>
      <rect x="${x + w - 16}" y="${y + h}" width="7" height="${34 - h}" fill="#c08a4c"/></g>`;

  const book = (x, y, c = '#f26d6d', r = 0) => `<g transform="translate(${x},${y}) rotate(${r})">
      <rect width="30" height="20" rx="3" fill="${c}"/><rect width="6" height="20" rx="2" fill="#ffffff" opacity=".55"/>
      <rect x="9" y="4" width="16" height="2.4" rx="1" fill="#fff" opacity=".6"/></g>`;

  const tree = (x, y, s = 1, c = '#7ac98b') => `<g transform="translate(${x},${y}) scale(${s})">
      <rect x="-5" y="-10" width="10" height="42" rx="4" fill="#a9743f"/>
      <circle cx="0" cy="-42" r="26" fill="${c}"/><circle cx="-20" cy="-30" r="18" fill="${c}"/><circle cx="20" cy="-30" r="18" fill="${c}"/></g>`;

  const sun = (x, y) => `<g transform="translate(${x},${y})" stroke="#ffc94d" stroke-width="4" stroke-linecap="round">
      <circle r="15" fill="#ffd85e"/><path d="M0 -22 v-8M0 22 v8M-22 0 h-8M22 0 h8M-16 -16 l-6 -6M16 16 l6 6M16 -16 l6 -6M-16 16 l-6 6"/></g>`;

  const ground = (c = '#dff3e5', y = 200) => `<rect x="0" y="${y}" width="400" height="${260 - y}" fill="${c}"/>`;

  const PIC = {};

  /* ════════ 第一課：我的好朋友 ════════ */
  PIC.friends = wrap(`${ground()}
    ${sun(342, 44)}
    ${tree(52, 200, .85)}
    ${kid(150, 200, { girl: 1 })}
    ${kid(210, 200, { shirt: '#ffe1b8' })}
    ${kid(268, 200, { girl: 1, shirt: '#f9d9e8', hair: '#6b4b2a' })}
    <path d="M170 168 q40 14 78 0" stroke="#ff8f6b" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/>
    <text x="200" y="52" font-size="21" text-anchor="middle" fill="#2eb872" font-weight="700">好朋友</text>`);

  PIC.share = wrap(`${ground('#e7f3fb')}
    ${kid(148, 200, { girl: 1, face: 'open' })}
    ${kid(250, 200, { shirt: '#ffe1b8' })}
    ${table(112, 182, 178, 9)}
    ${book(170, 162, '#f4a259')}${book(204, 164, '#6aa8ff', 6)}
    <text x="200" y="46" font-size="19" text-anchor="middle" fill="#3d8bfd" font-weight="700">一齊看圖書</text>`);

  PIC.cry = wrap(`${ground()}
    ${tree(46, 200, .75)}
    <g opacity=".55" fill="#8bd39a"><circle cx="330" cy="196" r="12"/><circle cx="312" cy="200" r="9"/><circle cx="352" cy="202" r="8"/></g>
    ${kid(160, 200, { girl: 1, face: 'cry' })}
    ${kid(272, 200, { shirt: '#ffe1b8' })}
    <text x="160" y="248" font-size="13" text-anchor="middle" fill="#5b7183">翠怡</text>
    <text x="272" y="248" font-size="13" text-anchor="middle" fill="#5b7183">浩明</text>`);

  PIC.sick = wrap(`${ground('#e7f3fb')}
    ${kid(140, 200, { face: 'sad' })}
    ${kid(252, 200, { face: 'worry', shirt: '#ffe1b8' })}
    ${table(96, 186, 96)}${table(212, 186, 96)}
    <rect x="150" y="168" width="18" height="13" rx="3" fill="#e6f2fb" stroke="#b9d6ea"/>
    <circle cx="182" cy="174" r="6" fill="#fff" stroke="#dbe8f2"/>
    <text x="140" y="248" font-size="13" text-anchor="middle" fill="#5b7183">永進</text>
`);

  PIC.homework = wrap(`${ground('#e7f3fb')}
    ${kid(136, 200, { girl: 1, face: 'worry' })}
    ${kid(258, 200, { girl: 1, face: 'angry', shirt: '#f9d9e8', hair: '#6b4b2a' })}
    ${table(104, 188, 190, 9)}
    ${book(150, 168, '#f26d6d')}
    <g transform="translate(214,104)"><rect width="128" height="38" rx="12" fill="#fff" stroke="#cfe4f7" stroke-width="2"/>
      <path d="M22 38 l-6 12 l16 -12z" fill="#fff" stroke="#cfe4f7" stroke-width="2"/>
      <text x="66" y="24" font-size="12" text-anchor="middle" fill="#2f74e8">借功課給我抄吧！</text></g>
    <text x="136" y="248" font-size="13" text-anchor="middle" fill="#5b7183">翠怡</text>
    <text x="258" y="248" font-size="13" text-anchor="middle" fill="#5b7183">佩珠</text>`);

  PIC.truth = wrap(`
    <rect x="0" y="0" width="400" height="196" fill="#eef7f1"/>
    <rect x="18" y="26" width="250" height="116" rx="6" fill="#3f7a4e"/>
    <rect x="18" y="142" width="250" height="9" rx="4" fill="#cfc4b0"/>
    <g stroke="#ffffff" stroke-width="3" opacity=".5" stroke-linecap="round">
      <path d="M40 58 h86"/><path d="M40 78 h140"/><path d="M40 98 h60"/></g>
    ${ground('#f3ede2', 200)}
    ${kid(96, 196, { face: 'worry', s: .95 })}
    ${kid(178, 196, { face: 'worry', shirt: '#ffe1b8', s: .95 })}
    ${adult(310, 196, { s: 1.05 })}
    <g transform="translate(300,96)"><rect x="-18" y="-26" width="36" height="46" rx="3" fill="#fff" stroke="#dbe6f0" stroke-width="2"/>
      <path d="M-10 -14 h20M-10 -4 h20M-10 6 h12" stroke="#e0867a" stroke-width="2.5" stroke-linecap="round"/></g>
    <g transform="translate(40,86)"><rect width="132" height="34" rx="11" fill="#fff" stroke="#cfe4f7" stroke-width="2"/>
      <text x="66" y="22" font-size="11.5" text-anchor="middle" fill="#c02b3f">不要告訴老師！</text></g>
    <text x="96" y="248" font-size="13" text-anchor="middle" fill="#5b7183">浩明</text>
    <text x="178" y="248" font-size="13" text-anchor="middle" fill="#5b7183">永進</text>
    <text x="310" y="248" font-size="13" text-anchor="middle" fill="#5b7183">老師</text>`);

  PIC.argue = wrap(`${ground('#e7f3fb')}
    <g transform="translate(146,158)"><path d="M0 0 q54 -52 108 0" stroke="#f4a259" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    ${kid(146, 200, { girl: 1, face: 'angry' })}
    ${kid(254, 200, { girl: 1, face: 'angry', shirt: '#f9d9e8', hair: '#6b4b2a' })}
    <g transform="translate(118,96)" stroke="#ef8a5a" stroke-width="4" stroke-linecap="round">
      <path d="M0 -10 v10"/><circle cx="0" cy="12" r="2.6" fill="#ef8a5a"/></g>
    <g transform="translate(284,96)" stroke="#ef8a5a" stroke-width="4" stroke-linecap="round">
      <path d="M0 -10 v10"/><circle cx="0" cy="12" r="2.6" fill="#ef8a5a"/></g>
    <text x="146" y="248" font-size="13" text-anchor="middle" fill="#5b7183">佩珠</text>
    <text x="254" y="248" font-size="13" text-anchor="middle" fill="#5b7183">翠怡</text>`);

  PIC.hygiene = wrap(`${ground('#fff3ef')}
    <g transform="translate(78,108)">
      <rect x="0" y="0" width="72" height="15" rx="4" fill="#f6b26b"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${4 + i * 8.6}" y="2" width="4" height="11" rx="1.6" fill="#e08a3c"/>`).join('')}
      <rect x="-2" y="-7" width="76" height="8" rx="3" fill="#c97a2e"/></g>
    <g transform="translate(196,74)">
      <rect x="0" y="0" width="108" height="54" rx="9" fill="#bfe3f7"/><rect x="0" y="0" width="108" height="19" rx="9" fill="#8fd0ef"/>
      <rect x="14" y="26" width="80" height="4" rx="2" fill="#fff" opacity=".75"/>
      <rect x="14" y="38" width="54" height="4" rx="2" fill="#fff" opacity=".75"/></g>
    <g transform="translate(176,176)"><circle r="26" fill="#ff5a5a" opacity=".13"/>
      <path d="M-12 -12 L12 12M12 -12 L-12 12" stroke="#ef4b5f" stroke-width="6.5" stroke-linecap="round"/></g>
    <text x="200" y="240" font-size="14" text-anchor="middle" fill="#c02b3f" font-weight="700">梳子、毛巾不可共用</text>`);

  PIC.help = wrap(`${ground()}
    ${kid(132, 200, { girl: 1, face: 'worry' })}
    ${kid(262, 200, { girl: 1, shirt: '#f9d9e8', hair: '#6b4b2a' })}
    ${table(180, 190, 130, 9)}
    ${book(226, 172, '#6aa8ff')}
    <g transform="translate(60,64)"><rect width="132" height="36" rx="12" fill="#fff" stroke="#bfe9d3" stroke-width="2"/>
      <text x="66" y="24" font-size="13" text-anchor="middle" fill="#12845a">我教你做功課</text></g>`);

  /* ════════ 第二課：香港的植物 ════════ */
  PIC.plant = wrap(`
    <rect x="0" y="186" width="400" height="74" fill="#e2c9a4"/>
    <rect x="0" y="176" width="400" height="14" fill="#b9d98f"/>
    <path d="M200 190 v-88" stroke="#4f9d4f" stroke-width="10" stroke-linecap="round"/>
    <path d="M198 152 q-58 -6 -70 -44 q52 -6 70 44z" fill="#5fbb63"/>
    <path d="M202 140 q58 -8 70 -46 q-52 -4 -70 46z" fill="#78cc78"/>
    <g transform="translate(200,74)">
      ${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="0" cy="-18" rx="11" ry="18" fill="#ff9ec4" transform="rotate(${a})"/>`).join('')}
      <circle r="11" fill="#ffd45e"/>
    </g>
    <g stroke="#c58f4e" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M200 190 q-8 26 -34 36"/><path d="M200 190 q6 28 28 40"/><path d="M200 190 q-26 16 -54 20"/><path d="M200 190 q30 14 56 16"/>
    </g>`);

  PIC.root = wrap(`
    <rect x="0" y="150" width="400" height="110" fill="#dfc39c"/>
    <rect x="0" y="140" width="400" height="14" fill="#b9d98f"/>
    <rect x="176" y="86" width="22" height="58" rx="5" fill="#a9743f"/>
    <circle cx="187" cy="62" r="34" fill="#7ac98b"/><circle cx="158" cy="74" r="22" fill="#7ac98b"/><circle cx="216" cy="74" r="22" fill="#7ac98b"/>
    <g stroke="#c58f4e" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M182 142 q-8 30 -30 46"/><path d="M192 142 q8 30 32 44"/><path d="M187 142 v52"/>
      <path d="M170 160 q-22 6 -34 22"/><path d="M204 160 q22 6 34 22"/>
    </g>
    <g fill="#8a5a2b" opacity=".45"><circle cx="150" cy="196" r="4"/><circle cx="228" cy="200" r="4"/><circle cx="187" cy="212" r="4"/></g>`);

  PIC.dye = wrap(`
    <rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(150,150)">
      <path d="M0 0 h100 l-12 62 h-76z" fill="#cfe9fb" stroke="#a8d4f0" stroke-width="2"/>
      <path d="M6 34 h88 l-6 28 h-76z" fill="#7cc4f5"/>
    </g>
    <path d="M200 150 v-80" stroke="#4f9d4f" stroke-width="6" stroke-linecap="round"/>
    <path d="M200 116 q-34 -4 -40 -26 q30 -4 40 26z" fill="#78cc78"/>
    <g transform="translate(200,54)">
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-13" rx="9" ry="13" fill="#eaf4ff" stroke="#bcdcff" transform="rotate(${a})"/>`).join('')}
      <circle r="8" fill="#8fd0ef"/>
    </g>
    <text x="200" y="38" font-size="17" text-anchor="middle" fill="#3d8bfd" font-weight="700">藍色水 + 白花</text>`);

  PIC.leaf = wrap(`
    ${sun(330, 56)}
    <g transform="translate(178,152)">
      <path d="M0 0 C-70 -30 -70 -96 0 -110 C70 -96 70 -30 0 0z" fill="#68c46f"/>
      <path d="M0 0 V-108" stroke="#3f9a49" stroke-width="4"/>
      <g stroke="#3f9a49" stroke-width="2.2" opacity=".75">
        <path d="M0 -84 q-26 -4 -40 -18"/><path d="M0 -84 q26 -4 40 -18"/>
        <path d="M0 -62 q-30 -4 -46 -20"/><path d="M0 -62 q30 -4 46 -20"/>
        <path d="M0 -40 q-26 -4 -40 -18"/><path d="M0 -40 q26 -4 40 -18"/>
      </g>
      <g fill="#2f7d3a" opacity=".55"><circle cx="-14" cy="-50" r="2.4"/><circle cx="16" cy="-46" r="2.4"/><circle cx="-18" cy="-30" r="2.4"/><circle cx="12" cy="-24" r="2.4"/></g>
    </g>
    <text x="308" y="150" font-size="13" fill="#5b7183">陽光</text>
    <text x="42" y="72" font-size="13" fill="#5b7183">氣孔</text>
    <path d="M78 76 q34 24 62 44" stroke="#5b7183" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>`);

  PIC.flowerbee = wrap(`${ground()}
    <path d="M170 200 v-90" stroke="#4f9d4f" stroke-width="6" stroke-linecap="round"/>
    <path d="M170 160 q-36 -6 -44 -30 q32 -4 44 30z" fill="#78cc78"/>
    <g transform="translate(170,84)">
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-16" rx="11" ry="16" fill="#ffb0cf" transform="rotate(${a})"/>`).join('')}
      <circle r="10" fill="#ffd45e"/>
    </g>
    <g transform="translate(272,104)">
      <ellipse cx="0" cy="0" rx="16" ry="12" fill="#ffcf5c"/>
      <path d="M-8 -9 h16M-9 -1 h18M-8 7 h16" stroke="#4a3427" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="-3" cy="-14" rx="10" ry="7" fill="#fff" opacity=".8"/><circle cx="16" cy="-2" r="7" fill="#4a3427"/>
    </g>
    <path d="M252 96 q-30 -10 -58 2" stroke="#4a3427" stroke-width="1.4" fill="none" stroke-dasharray="3 4"/>`);

  PIC.trees3 = wrap(`${ground()}
    ${[0, 1, 2].map(i => `<rect x="${10 + i * 128}" y="18" width="118" height="190" rx="14" fill="#fff" opacity=".65"/>`).join('')}
    <g transform="translate(66,196)"><rect x="-6" y="-96" width="12" height="96" fill="#a9743f"/><circle cx="0" cy="-108" r="26" fill="#6ec47f"/><circle cx="-18" cy="-92" r="17" fill="#6ec47f"/><circle cx="18" cy="-92" r="17" fill="#6ec47f"/></g>
    <g transform="translate(196,196)"><circle cx="0" cy="-42" r="24" fill="#8bd39a"/><circle cx="-16" cy="-30" r="16" fill="#8bd39a"/><circle cx="16" cy="-30" r="16" fill="#8bd39a"/><rect x="-4" y="-22" width="8" height="22" fill="#a9743f"/></g>
    <g transform="translate(300,196)"><path d="M0 0 q-14 -30 4 -58 q22 -30 8 -62" stroke="#5aa85f" stroke-width="6" fill="none" stroke-linecap="round"/>
      <g fill="#8bd39a"><ellipse cx="6" cy="-64" rx="12" ry="7"/><ellipse cx="20" cy="-96" rx="12" ry="7"/><ellipse cx="-8" cy="-40" rx="12" ry="7"/></g></g>
    <g fill="#c9d8e4">${[66, 196, 300].map(x => `<rect x="${x - 26}" y="212" width="52" height="9" rx="4"/>`).join('')}</g>`);

  PIC.bird = wrap(`${ground()}
    ${tree(210, 204, 1.5, '#7ac98b')}
    <g transform="translate(158,80)"><ellipse rx="20" ry="14" fill="#6ea8e8"/><circle cx="14" cy="-6" r="9" fill="#6ea8e8"/>
      <path d="M22 -6 l11 4 l-11 3z" fill="#ffb347"/><circle cx="16" cy="-8" r="1.8" fill="#213444"/>
      <path d="M-18 -2 q-12 8 -20 0 q10 -8 20 0z" fill="#4b7fc4"/></g>
    <g transform="translate(268,120)"><ellipse rx="16" ry="11" fill="#8fd3a8"/><circle cx="11" cy="-5" r="7" fill="#8fd3a8"/>
      <path d="M-14 -2 q-10 6 -16 0 q8 -6 16 0z" fill="#5fbb80"/></g>`);

  PIC.monkey = wrap(`${ground()}
    ${tree(240, 204, 1.5, '#7ac98b')}
    <g transform="translate(160,120)">
      <circle r="26" fill="#b98a5f"/><circle cx="-23" cy="-14" r="9" fill="#b98a5f"/><circle cx="23" cy="-14" r="9" fill="#b98a5f"/>
      <ellipse cx="0" cy="6" rx="18" ry="15" fill="#e8c9a8"/>
      <circle cx="-8" cy="-8" r="3" fill="#3b2a20"/><circle cx="8" cy="-8" r="3" fill="#3b2a20"/>
      <path d="M-6 3 q6 5 12 0" stroke="#8a5a3a" stroke-width="2" fill="none"/>
    </g>
    <g transform="translate(288,66)"><circle r="13" fill="#ef4b5f"/><path d="M0 -13 v-7" stroke="#8a5a2b" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M2 -22 q14 -8 20 4 q-14 8 -20 -4z" fill="#5fbb63"/></g>`);

  PIC.worm = wrap(`
    <rect x="0" y="150" width="400" height="110" fill="#dfc39c"/>
    <rect x="0" y="140" width="400" height="12" fill="#b9d98f"/>
    <path d="M116 206 q22 -24 46 -8 q22 14 44 -4 q22 -16 44 4" stroke="#f0a2b8" stroke-width="14" fill="none" stroke-linecap="round"/>
    <circle cx="252" cy="198" r="9" fill="#f0a2b8"/><circle cx="255" cy="195" r="2" fill="#3b2a20"/>
    <g opacity=".7" fill="#8a5a2b"><ellipse cx="300" cy="180" rx="15" ry="9" transform="rotate(-18 300 180)"/><ellipse cx="332" cy="196" rx="12" ry="7" transform="rotate(12 332 196)"/></g>
    <text x="66" y="112" font-size="14" fill="#6b4b2a">腐爛的葉＝食物</text>`);

  /* ════════ 第三課：植物與生活 ════════ */
  function fruit(x, y, s, body, leaf = '#5fbb63') {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <circle r="40" fill="${body}"/><circle cx="-13" cy="-14" r="9" fill="#fff" opacity=".32"/>
      <path d="M0 -40 v-14" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/>
      <path d="M2 -50 q22 -12 30 6 q-22 12 -30 -6z" fill="${leaf}"/></g>`;
  }
  PIC.apple = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>${fruit(200, 130, 1.5, '#ef4b5f')}`);

  PIC.carrot = wrap(`<rect x="0" y="212" width="400" height="48" fill="#e2c9a4"/>
    <g transform="translate(200,86)">
      <path d="M-18 0 h36 l-18 104z" fill="#f4923c"/><path d="M-18 0 h36 l-4 20 h-28z" fill="#ffb066"/>
      <g stroke="#e07a24" stroke-width="2.6" opacity=".85"><path d="M-12 34 h24"/><path d="M-8 58 h16"/><path d="M-4 80 h8"/></g>
      <g fill="#5fbb63"><path d="M0 -4 q-6 -34 -26 -44 q4 30 26 44z"/><path d="M0 -4 q6 -34 26 -44 q-4 30 -26 44z"/><path d="M0 -4 q0 -30 0 -46 q10 24 0 46z"/></g></g>`);

  PIC.cabbage = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(200,140)">
      <ellipse rx="66" ry="62" fill="#8bd39a"/>
      <path d="M-52 -14 q26 -46 52 -46 q26 0 52 46 q-26 34 -52 34 q-26 0 -52 -34z" fill="#a8e0b3"/>
      <path d="M-30 6 q14 -40 30 -40 q16 0 30 40 q-14 26 -30 26 q-16 0 -30 -26z" fill="#c9efcd"/>
      <path d="M0 -54 v70" stroke="#7cc98a" stroke-width="3"/></g>`);

  PIC.broccoli = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(200,180)">
      <rect x="-14" y="-40" width="28" height="46" rx="8" fill="#c8e6a0"/>
      <g fill="#4f9f52"><circle cx="0" cy="-56" r="30"/><circle cx="-26" cy="-48" r="20"/><circle cx="26" cy="-48" r="20"/><circle cx="-14" cy="-74" r="18"/><circle cx="16" cy="-74" r="18"/></g>
      <g fill="#68c46f"><circle cx="-4" cy="-62" r="16"/><circle cx="-24" cy="-52" r="11"/><circle cx="20" cy="-56" r="12"/></g></g>`);

  PIC.oilbottle = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(200,150)">
      <rect x="-30" y="-30" width="60" height="86" rx="14" fill="#ffe08a" stroke="#e8b93f" stroke-width="2"/>
      <rect x="-12" y="-52" width="24" height="26" rx="4" fill="#e8b93f"/><rect x="-14" y="-58" width="28" height="10" rx="4" fill="#c99a2e"/>
      <rect x="-22" y="-8" width="44" height="34" rx="6" fill="#fff8dc"/>
      <text x="0" y="14" font-size="14" text-anchor="middle" fill="#a8791d" font-weight="700">油</text></g>`);

  PIC.soy = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(112,180)"><rect x="-30" y="-30" width="60" height="52" rx="10" fill="#f4e9c9" stroke="#dcc79a" stroke-width="2"/><text x="0" y="6" font-size="15" text-anchor="middle" fill="#8a6c33" font-weight="700">豆腐</text></g>
    <g transform="translate(228,126)"><rect x="-22" y="-40" width="44" height="86" rx="12" fill="#fff" stroke="#dce7f2" stroke-width="2"/><rect x="-22" y="6" width="44" height="40" rx="10" fill="#f7ecd2"/><text x="0" y="-8" font-size="13" text-anchor="middle" fill="#8a6c33" font-weight="700">豆漿</text></g>
    <g fill="#e8d48a"><ellipse cx="292" cy="196" rx="9" ry="7"/><ellipse cx="312" cy="204" rx="9" ry="7"/><ellipse cx="274" cy="206" rx="9" ry="7"/></g>`);

  PIC.medicine = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(118,152)">
      <circle cx="0" cy="-34" r="30" fill="#fbe0c0" opacity=".35"/>
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-56" rx="7" ry="11" fill="#fff0b8" stroke="#e8c96a" transform="rotate(${a} 0 -34)"/>`).join('')}
      <circle cx="0" cy="-34" r="7" fill="#ffd45e"/>
      <path d="M0 30 v-14" stroke="#5fbb63" stroke-width="4" stroke-linecap="round"/></g>
    <g transform="translate(250,152)"><path d="M-14 -40 q-22 20 -10 40 q12 20 32 10 q-18 -22 -6 -44 q-8 -8 -16 -6z" fill="#d8b98a"/>
      <path d="M-4 -26 q14 14 4 34" stroke="#b99a6b" stroke-width="2.5" fill="none"/>
      <circle cx="36" cy="22" r="9" fill="#c0392b"/><circle cx="50" cy="10" r="8" fill="#c0392b"/></g>`);

  PIC.furniture = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f6efe3"/>
    <g transform="translate(80,152)"><rect x="0" y="-4" width="92" height="46" rx="8" fill="#c99a63"/><rect x="0" y="-36" width="92" height="36" rx="8" fill="#dbb07c"/>
      <rect x="6" y="-30" width="35" height="23" rx="5" fill="#f7f2e8"/><rect x="49" y="-30" width="35" height="23" rx="5" fill="#f7f2e8"/>
      <rect x="-4" y="42" width="8" height="12" fill="#a97b4a"/><rect x="88" y="42" width="8" height="12" fill="#a97b4a"/></g>
    <g transform="translate(222,176)"><rect x="0" y="-66" width="10" height="102" rx="4" fill="#b98a5f"/><rect x="10" y="-46" width="58" height="10" rx="4" fill="#d9a15e"/>
      <rect x="10" y="-36" width="8" height="30" fill="#b98a5f"/><rect x="60" y="-36" width="8" height="30" fill="#b98a5f"/></g>
    <g transform="translate(318,180)"><rect x="0" y="-14" width="56" height="9" rx="4" fill="#d9a15e"/><rect x="4" y="-5" width="7" height="26" fill="#b98a5f"/><rect x="45" y="-5" width="7" height="26" fill="#b98a5f"/></g>`);

  PIC.cotton = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(206,118)">
      <g fill="#fff" stroke="#e2eaf2" stroke-width="2"><circle cx="-22" cy="-10" r="20"/><circle cx="0" cy="-24" r="22"/><circle cx="22" cy="-8" r="20"/><circle cx="0" cy="8" r="20"/></g>
      <g fill="#c99a63"><circle cx="-14" cy="2" r="4"/><circle cx="14" cy="0" r="4"/></g>
      <path d="M0 26 v36" stroke="#8a6c33" stroke-width="4"/></g>
    <g transform="translate(104,182)"><rect x="-26" y="-36" width="52" height="52" rx="9" fill="#eaf3fb" stroke="#cfe0ef" stroke-width="2"/>
      <path d="M-26 -36 q26 15 52 0" stroke="#cfe0ef" stroke-width="2" fill="none"/></g>`);

  PIC.bamboo = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(198,142)">
      <path d="M-46 0 h92 l-12 54 h-68z" fill="#e8d7a8" stroke="#c9b47a" stroke-width="2"/>
      <g stroke="#c9b47a" stroke-width="2"><path d="M-40 16 h80"/><path d="M-36 34 h72"/></g>
      <path d="M-40 0 q40 -36 80 0" stroke="#c9b47a" stroke-width="3" fill="none"/>
      <g fill="#9fc98a"><path d="M-6 -18 q-8 -30 -30 -40 q2 26 30 40z"/><path d="M6 -18 q8 -30 30 -40 q-2 26 -30 40z"/></g></g>`);

  PIC.paper = wrap(`<rect x="0" y="212" width="400" height="48" fill="#f1f7fb"/>
    <g transform="translate(146,124) rotate(-6)"><rect x="-52" y="-24" width="104" height="130" rx="6" fill="#fff" stroke="#dbe6f0" stroke-width="2"/>
      <g stroke="#cfd9e2" stroke-width="3"><path d="M-34 6 h60"/><path d="M-32 30 h66"/><path d="M-30 54 h44"/><path d="M-34 78 h54"/></g></g>
    <g transform="translate(280,152)"><rect x="-26" y="-15" width="52" height="32" rx="6" fill="#f7b3c8"/><rect x="-26" y="-15" width="52" height="10" rx="5" fill="#fff" opacity=".55"/>
      <text x="0" y="10" font-size="10" text-anchor="middle" fill="#a8476a">擦膠</text></g>`);

  PIC.forest = wrap(`
    ${ground('#9ed9a3', 188)}
    ${sun(342, 46)}
    ${tree(88, 190, 1, '#4f9f52')}${tree(192, 190, 1.25, '#68c46f')}${tree(300, 190, .95, '#4f9f52')}
    <g fill="#3f8a48" opacity=".65"><circle cx="56" cy="212" r="10"/><circle cx="146" cy="218" r="8"/><circle cx="252" cy="214" r="9"/></g>`);

  PIC.deforest = wrap(`
    ${ground('#d8c9a8', 188)}
    ${[62, 152, 252, 330].map(x => `<g transform="translate(${x},190)"><rect x="-5" y="-46" width="10" height="46" fill="#b08a5c"/>
      <path d="M-6 -46 l12 -8 l-12 -8z" fill="#b08a5c"/></g>`).join('')}
    <g stroke="#8a6c33" stroke-width="3" stroke-linecap="round" opacity=".65"><path d="M104 214 h26"/><path d="M202 220 h20"/><path d="M292 210 h24"/></g>
    <text x="200" y="52" font-size="17" text-anchor="middle" fill="#c02b3f" font-weight="700">樹木被砍伐</text>`);

  PIC.park = wrap(`
    ${ground('#a8dcab', 200)}
    ${tree(84, 202, 1.6, '#4f9f52')}
    <g transform="translate(150,178)"><rect x="0" y="0" width="96" height="11" rx="5" fill="#c99a63"/>
      <rect x="8" y="11" width="7" height="16" fill="#a97b4a"/><rect x="80" y="11" width="7" height="16" fill="#a97b4a"/></g>
    ${kid(292, 200, { girl: 1 })}
    <g fill="#5fbb63" opacity=".2"><circle cx="150" cy="112" r="52"/></g>
    <text x="150" y="52" font-size="17" text-anchor="middle" fill="#2eb872" font-weight="700">大樹下乘涼</text>`);

  PIC.garden = wrap(`
    ${ground('#a8dcab', 198)}
    <g fill="#ff9ec4"><circle cx="58" cy="200" r="12"/><circle cx="100" cy="206" r="10"/><circle cx="306" cy="202" r="12"/><circle cx="344" cy="208" r="9"/></g>
    <g fill="#ffd45e"><circle cx="80" cy="212" r="8"/><circle cx="322" cy="214" r="8"/><circle cx="272" cy="198" r="9"/></g>
    <g stroke="#4f9d4f" stroke-width="4.5" stroke-linecap="round"><path d="M58 210 v-24"/><path d="M306 212 v-24"/><path d="M272 206 v-20"/></g>
    ${kid(164, 198, { girl: 1, face: 'open' })}
    ${kid(238, 198, { shirt: '#ffe1b8' })}
    <text x="200" y="46" font-size="17" text-anchor="middle" fill="#2eb872" font-weight="700">心情舒暢</text>`);

  /* 四格：好朋友的表現 */
  PIC.four = wrap(`
    ${[0, 1, 2, 3].map(i => `<rect x="${14 + i * 94}" y="30" width="80" height="150" rx="16" fill="#fff" opacity=".85"/>`).join('')}
    <g transform="translate(54,96)">
      <rect x="-22" y="-14" width="44" height="40" rx="6" fill="#ffb0c0"/><rect x="-27" y="-28" width="54" height="15" rx="5" fill="#ff8fa8"/>
      <path d="M0 -28 v54" stroke="#fff" stroke-width="4"/><path d="M-14 -28 q14 -18 14 0 q0 -18 14 0" stroke="#ff8fa8" stroke-width="4" fill="none"/>
    </g>
    <g transform="translate(148,92)"><path d="M0 44 q-36 -23 -36 -51 q0 -20 18 -20 q11 0 18 10 q7 -10 18 -10 q18 0 18 20 q0 28 -36 51z" fill="#ff7a8a"/></g>
    <g transform="translate(242,92)">
      <circle cx="-15" cy="2" r="12" fill="#ffd8b8"/><circle cx="15" cy="2" r="12" fill="#ffd8b8"/>
      <path d="M-6 -4 h12" stroke="#e8b48f" stroke-width="5" stroke-linecap="round"/>
      <path d="M-15 14 v16M15 14 v16" stroke="#e8b48f" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g transform="translate(336,92)"><ellipse cx="0" cy="6" rx="25" ry="17" fill="#eaf4ff" stroke="#a8cdf0" stroke-width="2"/>
      <path d="M-8 -10 q20 -12 32 4 q-18 9 -32 -4z" fill="#8fd0ef"/><circle cx="13" cy="0" r="2.4" fill="#3d6b8f"/>
      <path d="M21 4 l10 4 l-10 3z" fill="#ffb347"/></g>
    <g fill="#9fb4c7">${[54, 148, 242, 336].map(x => `<rect x="${x - 26}" y="150" width="52" height="10" rx="4"/>`).join('')}</g>`);

  /* 四種蔬果 */
  PIC.food4 = wrap(`
    ${ground('#f6efe3', 196)}
    ${fruit(58, 96, .78, '#ef4b5f')}
    <g transform="translate(152,60)"><path d="M-13 0 h26 l-13 78z" fill="#f4923c"/>
      <g fill="#5fbb63"><path d="M0 -4 q-5 -24 -18 -32 q3 22 18 32z"/><path d="M0 -4 q5 -24 18 -32 q-3 22 -18 32z"/></g></g>
    <g transform="translate(248,118)"><ellipse rx="42" ry="38" fill="#8bd39a"/>
      <path d="M-34 -8 q16 -30 34 -30 q18 0 34 30 q-16 22 -34 22 q-18 0 -34 -22z" fill="#b7e8bf"/>
      <path d="M0 -38 v50" stroke="#7cc98a" stroke-width="3"/></g>
    <g transform="translate(340,140)"><rect x="-9" y="-26" width="18" height="30" rx="6" fill="#c8e6a0"/>
      <g fill="#4f9f52"><circle cx="0" cy="-38" r="20"/><circle cx="-18" cy="-32" r="14"/><circle cx="18" cy="-32" r="14"/></g></g>`);

  window.PICS = PIC;
  window.pic = id => PIC[id] || wrap(`<text x="200" y="130" font-size="15" text-anchor="middle" fill="#8aa">插圖</text>`);
})();
