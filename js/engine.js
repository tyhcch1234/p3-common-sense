/* 小三常識溫習樂園 — 題目引擎 */
(function () {
  'use strict';

  const SECTIONS = [
    { key: 'summary', label: '課文總結', icon: '📖' },
    { key: 'fill', label: '供詞填充', icon: '✏️' },
    { key: 'pick', label: '按圖選擇', icon: '🖼️' },
    { key: 'short', label: '短答', icon: '🔤' },
    { key: 'tf', label: '是非題', icon: '⭕' },
    { key: 'picfill', label: '圖片填充', icon: '🎯' },
    { key: 'long', label: '短答題', icon: '📝' },
    { key: 'scene', label: '場景問答', icon: '🎬' }
  ];
  const TIPS = {
    fill: '從詞語庫點選詞語，再點擊句子中的空格。想更改？再點一次空格清除。',
    pick: '細心看圖，選出最適合的答案。答對會即時話你知！',
    short: '用簡短的詞句作答，寫好後按「檢查」。',
    tf: '判斷句子說得對不對，選「對」或「錯」。',
    picfill: '在圖片上方的方格內，填寫各個部分的名稱。',
    long: '用完整句子作答，完成後可對照參考答案。',
    scene: '先讀情境，再回答下面的問題。'
  };
  const TOTAL = SECTIONS.length - 1;

  /* ── 工具 ── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('p3gs:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('p3gs:' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const norm = s => String(s || '').toLowerCase()
    .replace(/[\s\u3000]/g, '')
    .replace(/[，。、？！；：,.?!"'`~!@#$%^&*()_+\-=\[\]{}\\|<>\/（）【】「」『』《》…·]/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 65248));

  let soundOn = store.get('sound', true);
  try { if (/[?&]mute=1/.test(location.search)) soundOn = false; } catch (e) { }

  let audioCtx = null;
  function beep(type) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = type === 'ok' ? [660, 880, 1180] : type === 'no' ? [300, 220] : [520];
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = type === 'no' ? 'triangle' : 'sine';
        o.frequency.value = f;
        const t = audioCtx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.13, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t); o.stop(t + 0.24);
      });
    } catch (e) { }
  }
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('show'), 1600);
  }
  function confetti(n = 26) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cols = ['#ff7a59', '#ffc107', '#2eb872', '#3d8bfd', '#ff9ec4'];
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'confetti';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.background = cols[i % cols.length];
      d.style.animation = `fall ${1.6 + Math.random() * 1.4}s linear ${Math.random() * .4}s forwards`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 3600);
    }
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { toast('這個瀏覽器不支援朗讀'); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-HK'; u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) { toast('朗讀失敗'); }
  }

  /* ── 進度 ── */
  function loadProgress(id) { return store.get('L' + id, {}); }
  function saveScore(id, key, correct, total) {
    const p = loadProgress(id);
    p[key] = { c: correct, t: total };
    p._at = Date.now();
    store.set('L' + id, p);
  }
  function lessonStats(id) {
    const p = loadProgress(id), done = {};
    let c = 0, t = 0;
    Object.keys(p).forEach(k => {
      if (k.startsWith('_')) return;
      done[k] = p[k]; c += p[k].c; t += p[k].t;
    });
    return { done, correct: c, total: t, sections: Object.keys(done).length };
  }
  function overall() {
    let c = 0, t = 0;
    (window.LESSONS || []).forEach(l => { const s = lessonStats(l.id); c += s.correct; t += s.total; });
    const all = (window.LESSONS || []).length * TOTAL;
    return { c, t, pct: all ? Math.round((c / all) * 100) : 0 };
  }

  window.P3 = { store, lessonStats, overall, loadProgress, speak, SECTIONS };

  /* ══════════════ 首頁 ══════════════ */
  function initHome() {
    const box = $('#cards');
    if (!box) return;
    box.innerHTML = (window.LESSONS || []).map(l => {
      const st = lessonStats(l.id);
      const pct = Math.min(100, Math.round((st.sections / TOTAL) * 100));
      const deg = pct * 3.6;
      return `<article class="lcard" style="--lc:${l.color}">
        <div class="glow" style="background:${l.color}"></div>
        <div class="tag"><span>${l.unit}</span><span>${l.no}</span></div>
        <h3>${l.title}</h3>
        <div class="art">${pic(l.art)}</div>
        <div class="meta">
          <svg class="ring" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#eef4f9" stroke-width="5"/>
            <circle cx="20" cy="20" r="16" fill="none" stroke="${l.color}" stroke-width="5"
              stroke-dasharray="${deg / 62.8 * 100} 100" stroke-linecap="round" transform="rotate(-90 20 20)"/>
            <text x="20" y="24" text-anchor="middle">${pct}%</text>
          </svg>
          <div>${st.sections ? `已完成 ${st.sections}/${TOTAL} 個練習<br>答對 ${st.correct} / ${st.total} 題` : '7 種題型等你挑戰'}</div>
        </div>
        <a class="btn" href="lesson.html?id=${l.id}" style="background:linear-gradient(135deg,${l.color},${l.color}cc);box-shadow:0 8px 18px ${l.color}44">
          ${st.sections ? '繼續溫習' : '開始溫習'} →
        </a>
      </article>`;
    }).join('');

    const o = overall();
    const bar = $('#overallBar');
    if (bar) {
      bar.style.width = o.pct + '%';
      $('#overallTxt').textContent = o.pct + '%';
      $('#overallNote').textContent = o.c ? `全站已答對 ${o.c} 題` : '未開始，加油！';
    }
  }

  /* ══════════════ 課題頁 ══════════════ */
  let L, IDX = 0;

  function initLesson() {
    const q = new URLSearchParams(location.search);
    const id = parseInt(q.get('id') || '1', 10);
    L = (window.LESSONS || []).find(x => x.id === id) || window.LESSONS[0];
    if (!L) return;
    const want = q.get('s') || 'summary';
    IDX = want === 'done' ? SECTIONS.length : Math.max(0, SECTIONS.findIndex(s => s.key === want));

    document.title = `${L.title}｜小三常識溫習樂園`;
    document.documentElement.style.setProperty('--stepColor', L.color);
    $('#lTitle').textContent = L.title;
    $('#lSub').textContent = `${L.unit}　${L.no}`;
    $('#lBadge').textContent = L.emoji;
    if ($('#lSub2')) $('#lSub2').textContent = '7 種題型練習　·　做完記得看「成績表」';
    $('#lBadge').style.background = L.color + '22';
    renderSteps();
    renderSection();

    $('#soundBtn').classList.toggle('off', !soundOn);
    $('#soundBtn').onclick = () => {
      soundOn = !soundOn; store.set('sound', soundOn);
      $('#soundBtn').classList.toggle('off', !soundOn);
      toast(soundOn ? '音效已開啟' : '音效已關閉');
      if (soundOn) beep('ok');
    };
  }

  function renderSteps() {
    const nav = $('#steps');
    nav.innerHTML = SECTIONS.map((s, i) => {
      const done = (loadProgress(L.id)[s.key] || {}).t;
      return `<button class="step ${i === IDX ? 'active' : ''} ${done && i !== IDX ? 'done' : ''}" data-i="${i}">
        <span class="n">${i === 0 ? '★' : i}</span>${s.label}</button>`;
    }).join('') + `<button class="step ${IDX === SECTIONS.length ? 'active' : ''}" data-i="${SECTIONS.length}">
        <span class="n">🏆</span>成績表</button>`;
    $$('#steps .step', nav).forEach(b => b.onclick = () => go(parseInt(b.dataset.i, 10)));
  }

  function go(i) {
    if (i < 0 || i > SECTIONS.length) return;
    IDX = i;
    history.replaceState(null, '', `?id=${L.id}&s=${SECTIONS[i] ? SECTIONS[i].key : 'done'}`);
    renderSteps();
    renderSection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSection() {
    const sec = SECTIONS[IDX];
    const host = $('#panel');
    host.innerHTML = '';
    if (!sec) { renderDone(host); renderSteps(); return; }

    if (sec.key === 'summary') {
      host.appendChild(buildSummary());
      renderSteps();
      return;
    }
    const data = L.ex[sec.key];
    if (!data) { host.innerHTML = '<p>暫無內容</p>'; return; }

    const head = document.createElement('h2');
    head.innerHTML = `<span class="dot"></span>${sec.label}`;
    host.appendChild(head);
    const lead = document.createElement('p');
    lead.className = 'lead';
    lead.textContent = data.tip || TIPS[sec.key] || '';
    host.appendChild(lead);

    const builder = {
      fill: buildFill, pick: buildPick, short: buildShort, tf: buildTF,
      picfill: buildPicFill, long: buildLong, scene: buildScene
    }[sec.key];
    builder(host, data);

    // 底部導覽
    const row = document.createElement('div');
    row.className = 'footer-row';
    row.innerHTML = `
      <button class="btn ghost sm" id="prevBtn">← 上一頁</button>
      <button class="btn sm" id="nextBtn">${IDX === SECTIONS.length - 1 ? '完成，看成績 →' : '下一個練習 →'}</button>
      <span class="score-pill" id="secPill"></span>`;
    host.appendChild(row);
    $('#prevBtn').onclick = () => go(IDX - 1);
    $('#nextBtn').onclick = () => go(IDX + 1);

    const st = loadProgress(L.id)[sec.key];
    if (st) $('#secPill').textContent = `本節：${st.c}/${st.t}`;
  }


  /* ── 成績表 ── */
  function renderDone(host) {
    const p = loadProgress(L.id);
    let c = 0, t = 0;
    SECTIONS.forEach(s => { const x = p[s.key]; if (x) { c += x.c; t += x.t; } });
    const answered = SECTIONS.filter(s => p[s.key]).length;
    const pct = t ? Math.round(c / t * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
    const nextL = (window.LESSONS || []).find(x => x.id === L.id + 1);
    host.innerHTML = `
      <div class="done-card">
        <div class="trophy">${pct >= 80 ? '🏆' : pct >= 50 ? '🎖️' : '🌱'}</div>
        <h2><span class="dot"></span>${L.title}　成績表</h2>
        <p class="lead">${stars === 3 ? '太厲害了！你已經完全掌握這一課。' : stars === 2 ? '做得很好！再看一次錯的地方就更好。' : stars === 1 ? '不錯啊，再溫習一次會更熟。' : '繼續努力，先看課文總結再試一次吧！'}</p>
        <div class="stars-big">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <div class="stat-grid">
          <div class="stat"><b>${t ? c + '/' + t : '—'}</b><span>答對題數</span></div>
          <div class="stat"><b>${pct}%</b><span>正確率</span></div>
          <div class="stat"><b>${answered}/${TOTAL}</b><span>完成練習</span></div>
        </div>
      </div>
      <div class="sum-card"><h4><span class="ic">📋</span>各項練習表現</h4>
        ${SECTIONS.filter(s => s.key !== 'summary').map(s => {
      const x = p[s.key];
      const rate = x && x.t ? Math.round(x.c / x.t * 100) : 0;
      return `<div style="display:flex;align-items:center;gap:10px;margin:6px 0">
            <span style="width:86px;font-weight:700">${s.label}</span>
            <span style="flex:1;height:10px;border-radius:99px;background:#eef4f9;overflow:hidden">
              <i style="display:block;height:100%;width:${rate}%;background:${rate >= 80 ? 'var(--ok)' : rate >= 50 ? 'var(--gold)' : 'var(--no)'}"></i></span>
            <span style="font-size:13px;color:var(--ink-soft);width:76px;text-align:right">${x ? x.c + '/' + x.t : '未做'}</span>
          </div>`;
    }).join('')}
      </div>
      <div class="footer-row">
        <button class="btn ghost sm" id="again">🔄 清除本課紀錄，再做一次</button>
        ${nextL ? `<a class="btn sm" href="lesson.html?id=${nextL.id}" style="background:linear-gradient(135deg,${nextL.color},${nextL.color}cc)">下一課：${nextL.title} →</a>` : ''}
        <a class="btn blue sm" href="index.html">回首頁</a>
      </div>`;
    $('#again', host).onclick = () => {
      if (!confirm('確定要清除這一課的紀錄嗎？')) return;
      store.set('L' + L.id, {});
      toast('已清除，重新開始！');
      go(0);
    };
    if (stars === 3) confetti(40);
  }

  /* ── 總結 ── */
  function buildSummary() {
    const box = document.createElement('div');
    const cards = L.summary.map((s, i) => `
      <div class="sum-card ${s.style || ''}">
        <h4><span class="ic">${s.icon || '🌱'}</span>${s.h}<button class="btn ghost sm" style="margin-left:auto" data-say="${i}">🔊 朗讀</button></h4>
        ${(s.body || []).map(p => `<p>${p}</p>`).join('')}
        ${s.list ? `<ul>${s.list.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
        ${s.say ? s.say.map(t => `<div class="say">💬 ${t}</div>`).join('') : ''}
      </div>`).join('');

    box.innerHTML = `
      <h2><span class="dot"></span>課文總結</h2>
      <p class="lead">先看一次重點，再去做練習。按「🔊 朗讀」可以聽一次。</p>
      ${cards}
      <div class="sum-card tip"><h4><span class="ic">🔑</span>本課關鍵詞</h4>
        <div class="chipset">${L.words.map(w => `<span class="chip">${w}</span>`).join('')}</div></div>
      <div class="footer-row">
        <button class="btn" id="startEx">我已溫習好，開始做練習 →</button>
      </div>`;

    $$('[data-say]', box).forEach(b => b.onclick = () => {
      const s = L.summary[+b.dataset.say];
      const txt = [s.h, ...(s.body || []), ...(s.list || []), ...(s.say || [])]
        .join('。').replace(/<[^>]+>/g, '').replace(/[＿_]+/g, '');
      speak(txt);
    });
    $('#startEx', box).onclick = () => go(1);
    return box;
  }

  /* ── 供詞填充 ── */
  function buildFill(host, data) {
    const bank = document.createElement('div');
    bank.className = 'bank';
    bank.innerHTML = `<div class="label">🧺 詞語庫（點詞語 → 點空格）</div>` +
      data.bank.map(w => `<button class="word" data-w="${w}">${w}</button>`).join('');
    host.appendChild(bank);

    let sel = null;
    const setSel = w => {
      sel = w;
      $$('.word', bank).forEach(b => b.classList.toggle('sel', b.dataset.w === w));
    };
    $$('.word', bank).forEach(b => b.onclick = () => {
      setSel(sel === b.dataset.w ? null : b.dataset.w);
      beep('tap');
    });

    const qEls = [];
    data.items.forEach((it, qi) => {
      const el = document.createElement('div');
      el.className = 'q';
      qEls.push(el);
      let html = it.text.replace(/\{(\d)\}/g, (m, n) =>
        `<button class="blank empty" data-qi="${qi}" data-bi="${n}">＿＿</button>`);
      el.innerHTML = `<div class="q-head"><div class="q-no">${qi + 1}</div><p class="q-text">${html}</p></div>
        <div class="fb"></div>`;
      host.appendChild(el);
      el.addEventListener('click', e => {
        const b = e.target.closest('.blank');
        if (!b) return;
        if (sel) {
          b.textContent = sel; b.classList.remove('empty', 'correct', 'wrong');
          b.dataset.val = sel;
          beep('tap');
        } else if (!b.classList.contains('empty')) {
          b.textContent = '＿＿'; b.classList.remove('correct', 'wrong');
          b.dataset.val = ''; b.classList.add('empty');
          b.classList.remove('sel');
          $$('.blank', el).forEach(x => x.classList.remove('sel'));
          b.classList.add('sel');
        }
        el.classList.add('answered');
      });
    });

    const row = document.createElement('div');
    row.className = 'footer-row';
    row.style.borderTop = 'none';
    row.innerHTML = `<button class="btn green sm" id="chk">✓ 檢查答案</button>
      <button class="btn ghost sm" id="clr">清除重做</button><span class="score-pill" id="pill"></span>`;
    host.appendChild(row);

    $('#chk', row).onclick = () => {
      let c = 0, blankNo = 0;
      data.items.forEach((it, qi) => {
        const el = qEls[qi];
        const blanks = $$('.blank', el);
        let ok = 0;
        blanks.forEach(b => {
          const ans = it.ans[+b.dataset.bi - 1];
          const good = norm(b.dataset.val) === norm(ans);
          b.classList.toggle('correct', good); b.classList.toggle('wrong', !good);
          if (good) ok++;
        });
        const allGood = ok === blanks.length;
        if (allGood) c++;
        blankNo += blanks.length;
        const fb = $('.fb', el);
        fb.className = 'fb show ' + (allGood ? 'ok' : 'no');
        fb.innerHTML = allGood
          ? `✅ <b>答對了！</b> ${it.why || ''}`
          : `💡 再看看：正確答案是 <b>${it.ans.join('、')}</b>。${it.why || ''}`;
      });
      const pill = $('#pill', row);
      pill.textContent = `答對 ${c}/${data.items.length}`;
      saveScore(L.id, 'fill', c, data.items.length);
      if (c === data.items.length) { confetti(); beep('ok'); toast('全部正確，太棒了！'); }
      else beep('no');
      renderSteps();
    };
    $('#clr', row).onclick = () => { renderSection(); };
  }

  /* ── 按圖選擇 ── */
  function buildPick(host, data) {
    const rec = { c: 0, n: data.items.length };
    data.items.forEach((it, i) => {
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q-head"><div class="q-no">${i + 1}</div><p class="q-text">${it.q}</p></div>
        ${it.pic ? `<div class="q-fig">${pic(it.pic)}</div>` : ''}
        <div class="opts">${it.opts.map((o, j) =>
        `<button class="opt" data-j="${j}"><span class="ol">${'ABCD'[j]}</span><span>${o}</span></button>`).join('')}</div>
        <div class="fb"></div>`;
      host.appendChild(el);
      el.addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (!b || el.dataset.done) return;
        el.dataset.done = '1';
        const j = +b.dataset.j, right = j === it.a;
        $$('.opt', el).forEach(x => x.classList.add('locked'));
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) $$('.opt', el)[it.a].classList.add('right');
        const fb = $('.fb', el);
        fb.className = 'fb show ' + (right ? 'ok' : 'no');
        fb.innerHTML = right ? `🎉 <b>答對了！</b> ${it.why || ''}` : `💡 正確答案是 <b>${it.opts[it.a]}</b>。${it.why || ''}`;
        if (right) { rec.c++; beep('ok'); } else beep('no');
        updatePill();
      });
    });
    const row = document.createElement('div');
    row.className = 'footer-row'; row.style.borderTop = 'none';
    row.innerHTML = `<span class="score-pill" id="pill">答對 0/${rec.n}</span>`;
    host.appendChild(row);
    function updatePill() {
      $('#pill', row).textContent = `答對 ${rec.c}/${rec.n}`;
      saveScore(L.id, 'pick', rec.c, rec.n);
      if (rec.c === rec.n) { confetti(); toast('全部正確，勁！'); renderSteps(); }
    }
  }

  /* ── 短答 ── */
  function buildShort(host, data) {
    data.items.forEach((it, i) => {
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q-head"><div class="q-no">${i + 1}</div><p class="q-text">${it.q}</p></div>
        ${it.pic ? `<div class="q-fig">${pic(it.pic)}</div>` : ''}
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input class="txt short-input" placeholder="在這裏作答…" autocomplete="off">
          <button class="btn sm green chk">檢查</button>
          ${it.hint ? `<button class="btn ghost sm hint">💡 提示</button>` : ''}
        </div>
        <div class="fb"></div>`;
      host.appendChild(el);
      const inp = $('input', el), fb = $('.fb', el);
      const check = () => {
        const v = norm(inp.value);
        if (!v) { toast('請先輸入答案'); return; }
        const ok = it.ans.some(a => {
          const na = norm(a);
          return v === na || v.includes(na) || (na.includes(v) && v.length >= 2);
        });
        inp.classList.toggle('correct', ok);
        inp.classList.toggle('wrong', !ok);
        fb.className = 'fb show ' + (ok ? 'ok' : 'no');
        fb.innerHTML = ok
          ? `✅ <b>答得好！</b> 參考答案：${it.ans[0]}。${it.why || ''}`
          : `💡 試試這樣想：${it.ans[0]}。${it.why || ''}`;
        mark(el, ok);
        beep(ok ? 'ok' : 'no');
      };
      $('.chk', el).onclick = check;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      if (it.hint) $('.hint', el).onclick = () => { fb.className = 'fb show info'; fb.innerHTML = '💡 ' + it.hint; };
    });
    summaryRow(host, data.items.length, 'short');
  }

  /* ── 是非題 ── */
  function buildTF(host, data) {
    const rec = { c: 0, n: data.items.length };
    data.items.forEach((it, i) => {
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q-head"><div class="q-no">${i + 1}</div><p class="q-text">${it.s}</p></div>
        ${it.pic ? `<div class="q-fig">${pic(it.pic)}</div>` : ''}
        <div class="tf-row">
          <button class="opt" data-j="1"><span class="ol">✓</span><span>對</span></button>
          <button class="opt" data-j="0"><span class="ol">✗</span><span>錯</span></button>
        </div>
        <div class="fb"></div>`;
      host.appendChild(el);
      el.addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (!b || el.dataset.done) return;
        el.dataset.done = '1';
        const pickTrue = b.dataset.j === '1', right = pickTrue === it.a;
        $$('.opt', el).forEach(x => x.classList.add('locked'));
        b.classList.add(right ? 'right' : 'wrong');
        const correctBtn = $$('.opt', el).find(x => (x.dataset.j === '1') === it.a);
        if (!right) correctBtn.classList.add('right');
        const fb = $('.fb', el);
        fb.className = 'fb show ' + (right ? 'ok' : 'no');
        fb.innerHTML = (right ? '🎉 <b>答對了！</b>' : `💡 正確答案是 <b>${it.a ? '對' : '錯'}</b>。`) + (it.why || '');
        if (right) { rec.c++; beep('ok'); } else beep('no');
        saveScore(L.id, 'tf', rec.c, rec.n);
        const p = $('#rowPill'); if (p) p.textContent = `答對 ${rec.c}/${rec.n}`;
        if (rec.c === rec.n) { confetti(); renderSteps(); }
      });
    });
    const row = document.createElement('div');
    row.className = 'footer-row'; row.style.borderTop = 'none';
    row.innerHTML = `<span class="score-pill" id="rowPill">答對 0/${rec.n}</span>`;
    host.appendChild(row);
  }

  /* ── 圖片填充 ── */
  function buildPicFill(host, data) {
    data.items.forEach((it, qi) => {
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q-head"><div class="q-no">${qi + 1}</div><p class="q-text">${it.q}</p></div>
        ${it.bank ? `<div class="chipset" style="margin:0 0 10px">${it.bank.map(w => `<span class="chip">${w}</span>`).join('')}</div>` : ''}
        <div class="picfill"><div class="art">${pic(it.pic)}</div>
          ${it.slots.map((s, si) => `<input class="pf-slot" data-si="${si}"
            style="left:${s.x}%;top:${s.y}%" placeholder="${s.ph || '？'}" autocomplete="off">`).join('')}
        </div>
        <div class="fb"></div>`;
      host.appendChild(el);
      $$('.pf-slot', el).forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#chk2', host).click(); }));

      const chk = document.createElement('button');
      chk.className = 'btn green sm'; chk.textContent = '✓ 檢查';
      const bar = document.createElement('div');
      bar.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:6px';
      bar.appendChild(chk);
      el.appendChild(bar);

      chk.onclick = () => {
        let ok = 0;
        $$('.pf-slot', el).forEach((inp, si) => {
          const good = norm(inp.value) === norm(it.slots[si].ans);
          inp.classList.toggle('correct', good); inp.classList.toggle('wrong', !good);
          if (good) ok++;
        });
        const fb = $('.fb', el);
        const all = ok === it.slots.length;
        fb.className = 'fb show ' + (all ? 'ok' : 'no');
        fb.innerHTML = all ? `✅ <b>全部正確！</b>${it.ok || ''}`
          : `💡 答對 ${ok}/${it.slots.length}。正確答案：${it.slots.map((s, i) => `${s.mark || (i + 1)}.${s.ans}`).join('、')}`;
        el.dataset.c = ok;
        saveScore(L.id, 'picfill', ok, it.slots.length);
        beep(all ? 'ok' : 'no');
        if (all) { confetti(); renderSteps(); }
      };
    });
  }

  /* ── 短答題 ── */
  function buildLong(host, data) {
    data.items.forEach((it, i) => {
      const el = document.createElement('div');
      el.className = 'q';
      el.innerHTML = `
        <div class="q-head"><div class="q-no">${i + 1}</div><p class="q-text">${it.q}</p></div>
        ${it.pic ? `<div class="q-fig">${pic(it.pic)}</div>` : ''}
        <textarea class="txt" placeholder="用完整句子寫出你的答案…"></textarea>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button class="btn green sm chk">✓ 檢查</button>
          <button class="btn ghost sm show">👀 參考答案</button>
        </div>
        <div class="fb"></div>`;
      host.appendChild(el);
      const ta = $('textarea', el), fb = $('.fb', el);
      const reveal = () => { fb.className = 'fb show info'; fb.innerHTML = `📖 <b>參考答案：</b>${it.model}`; };
      $('.show', el).onclick = reveal;
      $('.chk', el).onclick = () => {
        const v = norm(ta.value);
        if (v.length < 2) { toast('請先寫下你的答案'); return; }
        const hit = (it.keys || []).filter(k => v.includes(norm(k)));
        const need = it.need || Math.min(2, (it.keys || []).length);
        const ok = hit.length >= need;
        ta.classList.toggle('correct', ok); ta.classList.toggle('wrong', !ok);
        fb.className = 'fb show ' + (ok ? 'ok' : 'no');
        fb.innerHTML = ok
          ? `✅ <b>答得好！</b>你寫到了「${hit.join('、')}」等重點。<br>參考答案：${it.model}`
          : `💡 你的答案可以再補充。提示重點：<b>${(it.keys || []).join('、')}</b><br>參考答案：${it.model}`;
        mark(el, ok);
        beep(ok ? 'ok' : 'no');
      };
    });
    summaryRow(host, data.items.length, 'long');
  }

  /* ── 場景問答 ── */
  function buildScene(host, data) {
    data.items.forEach((sc, si) => {
      const el = document.createElement('div');
      el.className = 'scene';
      el.innerHTML = `
        <div class="s-title">🎬 情境 ${si + 1}：${sc.title}</div>
        ${sc.pic ? `<div class="q-fig" style="margin:4px 0 10px">${pic(sc.pic)}</div>` : ''}
        <div class="story">${sc.story}</div>
        ${sc.subs.map((sub, k) => `
          <div class="sub-q" data-k="${k}">
            <div class="q-head"><div class="q-no">${k + 1}</div><p class="q-text">${sub.q}</p></div>
            ${sub.type === 'mc'
          ? `<div class="opts">${sub.opts.map((o, j) => `<button class="opt" data-j="${j}"><span class="ol">${'ABC'[j]}</span><span>${o}</span></button>`).join('')}</div>`
          : `<div class="tf-row"><button class="opt" data-j="1"><span class="ol">✓</span><span>對</span></button>
                 <button class="opt" data-j="0"><span class="ol">✗</span><span>錯</span></button></div>`}
            <div class="fb"></div>
          </div>`).join('')}`;
      host.appendChild(el);

      el.addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (!b) return;
        const sq = b.closest('.sub-q');
        if (!sq || sq.dataset.done) return;
        sq.dataset.done = '1';
        const sub = sc.subs[+sq.dataset.k];
        const j = +b.dataset.j;
        let right;
        if (sub.type === 'mc') right = j === sub.a; else right = (j === 1) === sub.a;
        $$('.opt', sq).forEach(x => x.classList.add('locked'));
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) {
          const cb = sub.type === 'mc'
            ? $$('.opt', sq)[sub.a]
            : $$('.opt', sq).find(x => (x.dataset.j === '1') === sub.a);
          cb.classList.add('right');
        }
        const fb = $('.fb', sq);
        const ansTxt = sub.type === 'mc' ? sub.opts[sub.a] : (sub.a ? '對' : '錯');
        fb.className = 'fb show ' + (right ? 'ok' : 'no');
        fb.innerHTML = (right ? '🎉 <b>答對了！</b>' : `💡 正確答案是 <b>${ansTxt}</b>。`) + (sub.why || '');
        if (right) beep('ok'); else beep('no');
        // 全情境完成 → 計分
        const subs = $$('.sub-q', el);
        if (subs.every(s => s.dataset.done)) {
          const allRight = subs.every(s => s.querySelector('.opt.right') && !s.querySelector('.opt.wrong'));
          const c = subs.filter(s => s.querySelector('.opt.right') && !s.querySelector('.opt.wrong')).length;
          const p = loadProgress(L.id).scene || { c: 0, t: 0 };
          saveScore(L.id, 'scene', p.c + c, p.t + subs.length); // 累加
          renderSteps();
        }
      });
    });
  }

  function mark(el, ok) {
    el.dataset.ok = ok ? '1' : '0';
    const all = $$('.q', el.parentElement).filter(x => x.dataset.ok !== undefined);
    if (all.length === $$('.q', el.parentElement).length) {
      const c = all.filter(x => x.dataset.ok === '1').length;
      const p = $('#pill2');
      if (p) p.textContent = `答對 ${c}/${all.length}`;
    }
  }

  function summaryRow(host, n, key) {
    const row = document.createElement('div');
    row.className = 'footer-row'; row.style.borderTop = 'none';
    row.innerHTML = `<button class="btn ghost sm" id="tally">📊 顯示本節成績</button>
      <span class="score-pill" id="pill2"></span>`;
    host.appendChild(row);
    $('#tally', row).onclick = () => {
      const qs = $$('.q', host).filter(q => q.dataset.ok !== undefined);
      if (!qs.length) { toast('先作答再看成績啦！'); return; }
      const c = qs.filter(q => q.dataset.ok === '1').length;
      saveScore(L.id, key, c, n);
      $('#pill2', row).textContent = `答對 ${c}/${n}`;
      if (c === n) { confetti(); toast('全對！好厲害！'); }
      renderSteps();
    };
  }

  /* ── 啟動 ── */
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'home') initHome();
    if (document.body.dataset.page === 'lesson') initLesson();
  });
})();
