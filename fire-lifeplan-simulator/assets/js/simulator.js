/* ==============================================
   FIRE Lifeplan Simulator — Main Script
   ============================================== */
(function () {
  'use strict';

  /* ── 教育費テーブル（万円/年） ── */
  const EDU_COST = {
    elementary:  { public: 32,  private: 160 },
    junior:      { public: 48,  private: 140 },
    high:        { public: 51,  private: 105 },
    uni_liberal: { public: 54,  private: 96  },
    uni_science: { public: 54,  private: 120 },
  };

  /* ── プリセット ── */
  const PRESETS = {
    couple2kids: {
      age:35, spouseAge:33, income:800, assets:500, monthlyInvest:5,
      fireLiving:25, loanBalance:3000, loanRate:0.5, loanYears:25,
      loanType:'equal_payment', children:2, childAges:[5,2],
      fireType:'side', sideIncome:100, fireRule:'4', returnRate:'5',
      extraPayment:0, bonusPayment:0, rateScenario:'flat',
      inflation:1, incomeGrowth:1, eduPolicy:'all_public', uniType:'liberal',
    },
    localside: {
      age:38, spouseAge:36, income:600, assets:800, monthlyInvest:8,
      fireLiving:18, loanBalance:2000, loanRate:0.6, loanYears:20,
      loanType:'equal_payment', children:2, childAges:[8,5],
      fireType:'side', sideIncome:80, fireRule:'3.5', returnRate:'5',
      extraPayment:0, bonusPayment:0, rateScenario:'flat',
      inflation:1, incomeGrowth:0.5, eduPolicy:'all_public', uniType:'liberal',
    },
    heavyloan: {
      age:40, spouseAge:38, income:900, assets:300, monthlyInvest:3,
      fireLiving:30, loanBalance:5000, loanRate:0.7, loanYears:30,
      loanType:'equal_payment', children:2, childAges:[10,7],
      fireType:'full', sideIncome:0, fireRule:'4', returnRate:'5',
      extraPayment:0, bonusPayment:0, rateScenario:'gradual',
      inflation:1, incomeGrowth:1, eduPolicy:'high_private', uniType:'science',
    },
    single: {
      age:30, spouseAge:0, income:600, assets:300, monthlyInvest:10,
      fireLiving:15, loanBalance:0, loanRate:0.5, loanYears:0,
      loanType:'equal_payment', children:0, childAges:[],
      fireType:'full', sideIncome:0, fireRule:'4', returnRate:'7',
      extraPayment:0, bonusPayment:0, rateScenario:'flat',
      inflation:1, incomeGrowth:2, eduPolicy:'all_public', uniType:'liberal',
    },
  };

  /* =========================================
     DOM refs
     ========================================= */
  const root     = document.getElementById('flsim-root');
  if (!root) return;

  const form     = document.getElementById('flsim-form');
  const results  = document.getElementById('flsim-results');
  const tabBtns  = root.querySelectorAll('.flsim-tab');
  const panelBasic  = document.getElementById('panel-basic');
  const panelDetail = document.getElementById('panel-detail');
  const childrenAgesEl = document.getElementById('flsim-children-ages');

  let chartAssets   = null;
  let chartCashflow = null;

  /* =========================================
     タブ切替
     ========================================= */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const mode = btn.dataset.mode;
      panelBasic.hidden  = mode !== 'basic';
      panelDetail.hidden = mode !== 'detail';
    });
  });

  /* =========================================
     子ども年齢フィールド 動的生成
     ========================================= */
  function renderChildAgeFields(count, values) {
    childrenAgesEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'flsim-field';
      wrap.innerHTML = `
        <label for="f-child-age-${i}">第${i+1}子の年齢</label>
        <div class="flsim-input-unit">
          <input type="number" id="f-child-age-${i}" name="childAge_${i}"
            value="${values && values[i] !== undefined ? values[i] : ''}"
            min="0" max="22">
          <span>歳</span>
        </div>`;
      childrenAgesEl.appendChild(wrap);
    }
  }

  document.getElementById('f-children').addEventListener('change', function () {
    renderChildAgeFields(Number(this.value), null);
  });
  renderChildAgeFields(2, [5, 2]);

  /* =========================================
     利回り「任意入力」表示制御
     ========================================= */
  document.getElementById('f-return-rate').addEventListener('change', function () {
    document.getElementById('f-return-custom-wrap').style.display =
      this.value === 'custom' ? '' : 'none';
  });

  /* =========================================
     金利シナリオ「任意入力」表示制御
     ========================================= */
  document.getElementById('f-rate-scenario').addEventListener('change', function () {
    document.getElementById('f-rate-custom-wrap').style.display =
      this.value === 'custom' ? '' : 'none';
  });

  /* =========================================
     FIREタイプ ← サイドFIRE収入フィールド制御
     ========================================= */
  document.getElementById('f-fire-type').addEventListener('change', function () {
    const sideWrap = document.getElementById('f-side-income').closest('.flsim-field');
    sideWrap.style.display = this.value === 'side' ? '' : 'none';
  });

  /* =========================================
     プリセット
     ========================================= */
  root.querySelectorAll('.flsim-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  function applyPreset(key) {
    const p = PRESETS[key];
    if (!p) return;
    setVal('f-age',          p.age);
    setVal('f-spouse-age',   p.spouseAge);
    setVal('f-income',       p.income);
    setVal('f-assets',       p.assets);
    setVal('f-monthly-invest', p.monthlyInvest);
    setVal('f-fire-living',  p.fireLiving);
    setVal('f-loan-balance', p.loanBalance);
    setVal('f-loan-rate',    p.loanRate);
    setVal('f-loan-years',   p.loanYears);
    setVal('f-loan-type',    p.loanType);
    setVal('f-children',     p.children);
    renderChildAgeFields(p.children, p.childAges);
    setVal('f-fire-type',    p.fireType);
    setVal('f-side-income',  p.sideIncome);
    setVal('f-fire-rule',    p.fireRule);
    setVal('f-return-rate',  p.returnRate);
    setVal('f-extra-payment', p.extraPayment);
    setVal('f-bonus-payment', p.bonusPayment);
    setVal('f-rate-scenario', p.rateScenario);
    setVal('f-inflation',    p.inflation);
    setVal('f-income-growth', p.incomeGrowth);
    setVal('f-edu-policy',   p.eduPolicy);
    setVal('f-uni-type',     p.uniType);
    const sideWrap = document.getElementById('f-side-income').closest('.flsim-field');
    sideWrap.style.display = p.fireType === 'side' ? '' : 'none';
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  /* =========================================
     フォーム送信 → シミュレーション実行
     ========================================= */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const params = collectParams();
    saveToStorage(params);
    const rows = buildCashflow(params);
    renderResults(params, rows);
  });

  document.getElementById('flsim-reset').addEventListener('click', () => {
    applyPreset('couple2kids');
    results.hidden = true;
  });

  /* =========================================
     パラメータ収集
     ========================================= */
  function collectParams() {
    const fd  = new FormData(form);
    const g   = k => parseFloat(fd.get(k)) || 0;
    const gs  = k => fd.get(k) || '';

    const childrenCount = parseInt(gs('children'), 10) || 0;
    const childAges = [];
    for (let i = 0; i < childrenCount; i++) {
      childAges.push(parseInt(gs(`childAge_${i}`), 10) || 0);
    }

    let returnRate = parseFloat(gs('returnRate')) || 5;
    if (gs('returnRate') === 'custom') returnRate = g('returnCustom') || 5;

    let rateScenario = gs('rateScenario');
    let customRate   = g('rateCustom');

    return {
      age:          g('age')    || 35,
      spouseAge:    g('spouseAge'),
      income:       g('income') || 0,
      assets:       g('assets') || 0,
      monthlyInvest: g('monthlyInvest') || 0,
      fireLiving:   g('fireLiving') || 20,
      loanBalance:  g('loanBalance') || 0,
      loanRate:     g('loanRate') || 0,
      loanYears:    g('loanYears') || 0,
      loanType:     gs('loanType'),
      children:     childrenCount,
      childAges,
      fireType:     gs('fireType'),
      sideIncome:   g('sideIncome') || 0,
      fireRule:     parseFloat(gs('fireRule')) || 4,
      returnRate,
      extraPayment: g('extraPayment') || 0,
      bonusPayment: g('bonusPayment') || 0,
      rateScenario,
      rateCustom:   customRate,
      inflation:    g('inflation') || 0,
      incomeGrowth: g('incomeGrowth') || 0,
      eduPolicy:    gs('eduPolicy') || 'all_public',
      uniType:      gs('uniType')   || 'liberal',
    };
  }

  /* =========================================
     住宅ローン計算
     ========================================= */
  function calcMonthlyPayment(balance, annualRate, months, type) {
    if (balance <= 0 || months <= 0) return 0;
    if (type === 'equal_principal') {
      return balance / months;
    }
    const r = annualRate / 100 / 12;
    if (r === 0) return balance / months;
    return balance * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  }

  /* =========================================
     教育費計算（1人・年齢指定）
     ========================================= */
  function calcEduCost(childAge, year, params) {
    const policy  = params.eduPolicy;
    const uniType = params.uniType;
    const age     = childAge + (year - 0);  // 呼び出し元で計算済みの実際の年齢を渡す
    // ← 引数 childAge は「その年の子の年齢」を直接渡す形に変更済み
    if (age >= 6  && age <= 11) {
      const isPrivate = policy === 'mostly_private';
      return isPrivate ? EDU_COST.elementary.private : EDU_COST.elementary.public;
    }
    if (age >= 12 && age <= 14) {
      const isPrivate = policy === 'mid_private' || policy === 'mostly_private';
      return isPrivate ? EDU_COST.junior.private : EDU_COST.junior.public;
    }
    if (age >= 15 && age <= 17) {
      const isPrivate = policy === 'high_private' || policy === 'mid_private' || policy === 'mostly_private';
      return isPrivate ? EDU_COST.high.private : EDU_COST.high.public;
    }
    if (age >= 18 && age <= 21) {
      const key = `uni_${uniType}`;
      return EDU_COST[key].public;
    }
    return 0;
  }

  /* =========================================
     金利シナリオ
     ========================================= */
  function getRateForYear(baseRate, scenario, yearIndex, customRate) {
    switch (scenario) {
      case 'flat':    return baseRate;
      case 'plus025': return baseRate + 0.25;
      case 'plus05':  return baseRate + 0.5;
      case 'plus1':   return baseRate + 1;
      case 'plus2':   return baseRate + 2;
      case 'gradual': return baseRate + Math.min(yearIndex * 0.1, 2);
      case 'custom':  return customRate || baseRate;
      default:        return baseRate;
    }
  }

  /* =========================================
     キャッシュフロー構築
     ========================================= */
  function buildCashflow(p) {
    const SIM_YEARS = 40;
    const currentYear = new Date().getFullYear();
    const rows = [];

    let loanBalance    = p.loanBalance;
    let financialAssets = p.assets;
    let loanMonths     = p.loanYears * 12;
    let fired          = false;
    let fireYear       = null;

    for (let y = 0; y < SIM_YEARS; y++) {
      const year     = currentYear + y;
      const age      = p.age + y;
      const spouseAge = p.spouseAge > 0 ? p.spouseAge + y : null;

      /* ── 金利 ── */
      const rate = getRateForYear(p.loanRate, p.rateScenario, y, p.rateCustom);

      /* ── 年収（FIRE後は副収入のみ） ── */
      let income = 0;
      if (!fired) {
        income = p.income * Math.pow(1 + p.incomeGrowth / 100, y);
      } else {
        income = p.fireType === 'side' ? p.sideIncome : 0;
      }

      /* ── 生活費（インフレ反映） ── */
      const livingMonthly = p.fireLiving * Math.pow(1 + p.inflation / 100, y);
      const living         = livingMonthly * 12;

      /* ── 教育費 ── */
      let eduCost = 0;
      for (let ci = 0; ci < p.children; ci++) {
        const childCurrentAge = p.childAges[ci] + y;
        eduCost += calcEduCost(childCurrentAge, 0, p);
      }

      /* ── ローン返済 ── */
      let loanPayment = 0;
      if (loanBalance > 0 && loanMonths > 0) {
        const monthlyPay = calcMonthlyPayment(loanBalance, rate, loanMonths, p.loanType);
        const annualPay  = monthlyPay * 12 + p.bonusPayment;
        const principal  = Math.min(loanBalance, annualPay);

        loanPayment = annualPay + p.extraPayment;

        const rateMonthly = rate / 100 / 12;
        let newBal = loanBalance;
        for (let m = 0; m < 12 && newBal > 0; m++) {
          const interest = newBal * rateMonthly;
          const prinPay  = Math.max(0, monthlyPay - interest);
          newBal = Math.max(0, newBal - prinPay);
        }
        newBal = Math.max(0, newBal - p.extraPayment - p.bonusPayment);
        if (loanMonths <= 12) newBal = 0;
        loanBalance  = newBal;
        loanMonths   = Math.max(0, loanMonths - 12);
      }

      /* ── 投資積立（FIREまで） ── */
      const annualInvest = fired ? 0 : p.monthlyInvest * 12;

      /* ── 年間収支 ── */
      const balance = income - living - eduCost - loanPayment - annualInvest;

      /* ── 資産成長 ── */
      const returnRate = p.returnRate / 100;
      financialAssets  = financialAssets * (1 + returnRate) + annualInvest + balance;

      /* ── FIRE判定 ── */
      const fireNeed = (p.fireLiving * 12) / (p.fireRule / 100);
      if (!fired && financialAssets >= fireNeed) {
        fired    = true;
        fireYear = year;
      }

      /* ── ライフイベント ── */
      const events = [];
      if (y === 0) events.push('シミュレーション開始');
      if (loanBalance === 0 && y > 0 && rows[y-1]?.loanBalance > 0) events.push('🏠 ローン完済');
      if (!fired && fireYear === year) events.push('🔥 FIRE達成');
      for (let ci = 0; ci < p.children; ci++) {
        const ca = p.childAges[ci] + y;
        if (ca === 6)  events.push(`第${ci+1}子 小学校入学`);
        if (ca === 12) events.push(`第${ci+1}子 中学入学`);
        if (ca === 15) events.push(`第${ci+1}子 高校入学`);
        if (ca === 18) events.push(`第${ci+1}子 大学入学`);
        if (ca === 22) events.push(`第${ci+1}子 大学卒業`);
      }

      rows.push({
        year, age, spouseAge,
        childAges: p.childAges.map(ca => ca + y),
        events: events.join(' / '),
        income:    Math.round(income),
        living:    Math.round(living),
        eduCost:   Math.round(eduCost),
        loanPayment: Math.round(loanPayment),
        balance:   Math.round(balance),
        financialAssets: Math.round(financialAssets),
        loanBalance:    Math.round(loanBalance),
        fired,
        rate,
      });
    }
    return rows;
  }

  /* =========================================
     金利+1% 追加負担試算
     ========================================= */
  function calcRateImpact(p) {
    if (p.loanBalance <= 0 || p.loanYears <= 0) return 0;
    const base    = calcMonthlyPayment(p.loanBalance, p.loanRate,     p.loanYears * 12, p.loanType);
    const higher  = calcMonthlyPayment(p.loanBalance, p.loanRate + 1, p.loanYears * 12, p.loanType);
    return Math.round((higher - base) * 12 * p.loanYears);
  }

  /* =========================================
     結果レンダリング
     ========================================= */
  function renderResults(params, rows) {
    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    /* ── FIRE可能年齢 ── */
    const fireRow  = rows.find(r => r.fired);
    const fireAge  = fireRow ? `${fireRow.age}歳（${fireRow.year}年）` : '未達成';
    setText('res-fire-age', fireAge);

    /* ── ローン完済年 ── */
    const loanEndRow = rows.find((r, i) => i > 0 && r.loanBalance === 0);
    setText('res-loan-end', loanEndRow ? `${loanEndRow.year}年（${loanEndRow.age}歳）` : 'なし / 完済済');

    /* ── 教育費ピーク ── */
    const peakRow = rows.reduce((max, r) => r.eduCost > (max?.eduCost || 0) ? r : max, null);
    setText('res-edu-peak', peakRow && peakRow.eduCost > 0 ? `${peakRow.year}年 ${Math.round(peakRow.eduCost)}万円` : 'なし');

    /* ── 金利+1%追加負担 ── */
    const impact = calcRateImpact(params);
    setText('res-rate-impact', impact > 0 ? `+${fmtMan(impact)}万円` : 'なし');

    /* ── FIRE達成度 ── */
    const fireNeed  = (params.fireLiving * 12) / (params.fireRule / 100);
    const lastAssets = rows[rows.length - 1].financialAssets;
    const pct        = Math.min(100, Math.round(lastAssets / fireNeed * 100));
    const firePct    = fireRow ? 100 : pct;
    setText('res-fire-pct', `${firePct}%`);
    document.getElementById('res-fire-bar').style.width = `${firePct}%`;

    /* ── 危険度 ── */
    const badge = document.getElementById('res-danger-badge');
    badge.className = 'flsim-danger-badge';
    if (firePct >= 100) {
      badge.classList.add('safe');
      badge.textContent = '✅ 計画上、FIRE達成可能な条件です';
    } else if (firePct >= 70) {
      badge.classList.add('caution');
      badge.textContent = '⚠️ 収支悪化の可能性があります。継続的な見直しをご検討ください。';
    } else {
      badge.classList.add('danger');
      badge.textContent = '⛔ この条件では資産不足の可能性があります。積立増額や支出見直しをご検討ください。';
    }

    /* ── タイムライン ── */
    renderTimeline(rows, params, fireRow, loanEndRow, peakRow);

    /* ── グラフ ── */
    renderCharts(rows);

    /* ── CF表 ── */
    renderTable(rows);
  }

  function renderTimeline(rows, params, fireRow, loanEndRow, peakRow) {
    const ul = document.getElementById('res-timeline');
    ul.innerHTML = '';
    const items = [];

    // 子どものイベント
    for (let ci = 0; ci < params.children; ci++) {
      const baseAge = params.childAges[ci];
      [[6,'小学校入学'],[12,'中学入学'],[15,'高校入学'],[18,'大学入学']].forEach(([evAge, evName]) => {
        const diff = evAge - baseAge;
        if (diff >= 0) {
          const y = new Date().getFullYear() + diff;
          items.push({ year: y, text: `第${ci+1}子 ${evName}` });
        }
      });
    }
    if (peakRow && peakRow.eduCost > 0) {
      items.push({ year: peakRow.year, text: `教育費ピーク（${Math.round(peakRow.eduCost)}万円）` });
    }
    if (loanEndRow) {
      items.push({ year: loanEndRow.year, text: `住宅ローン完済（${loanEndRow.age}歳）` });
    }
    if (fireRow) {
      const label = params.fireType === 'side' ? 'サイドFIRE達成' : '完全FIRE達成';
      items.push({ year: fireRow.year, text: `🔥 ${label}（${fireRow.age}歳）` });
    }

    items.sort((a, b) => a.year - b.year);

    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="flsim-tl-year">${item.year}</span>
        <span class="flsim-tl-dot"></span>
        <span class="flsim-tl-event">${item.text}</span>`;
      ul.appendChild(li);
    });

    if (items.length === 0) {
      ul.innerHTML = '<li><span class="flsim-tl-event">イベントなし</span></li>';
    }
  }

  function renderCharts(rows) {
    const labels = rows.map(r => `${r.year}`);

    /* 資産 & ローン */
    const ctxA = document.getElementById('chart-assets');
    if (chartAssets) chartAssets.destroy();
    chartAssets = new Chart(ctxA, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '金融資産（万円）',
            data: rows.map(r => r.financialAssets),
            borderColor: '#3a8fa6',
            backgroundColor: 'rgba(58,143,166,.12)',
            tension: .35, fill: true, pointRadius: 0,
          },
          {
            label: 'ローン残高（万円）',
            data: rows.map(r => r.loanBalance),
            borderColor: '#e07c30',
            backgroundColor: 'rgba(224,124,48,.08)',
            tension: .35, fill: true, pointRadius: 0,
          },
        ],
      },
      options: chartOpts('万円'),
    });

    /* 年間収支 */
    const ctxC = document.getElementById('chart-cashflow');
    if (chartCashflow) chartCashflow.destroy();
    chartCashflow = new Chart(ctxC, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '年間収支（万円）',
          data: rows.map(r => r.balance),
          backgroundColor: rows.map(r => r.balance >= 0 ? 'rgba(45,160,110,.7)' : 'rgba(201,64,64,.7)'),
        }],
      },
      options: chartOpts('万円'),
    });
  }

  function chartOpts(unit) {
    return {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${fmtMan(ctx.parsed.y)}${unit}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: v => `${fmtMan(v)}万`,
            font: { size: 11 },
          },
          grid: { color: 'rgba(0,0,0,.05)' },
        },
        x: {
          ticks: {
            maxTicksLimit: 10,
            font: { size: 10 },
          },
          grid: { display: false },
        },
      },
    };
  }

  function renderTable(rows) {
    const tbody = document.getElementById('res-cf-tbody');
    tbody.innerHTML = '';
    rows.forEach(r => {
      const tr = document.createElement('tr');
      if (r.fired && !r._prevFired) tr.classList.add('fire-row');
      r._prevFired = r.fired;

      const childStr = r.childAges.length > 0 ? r.childAges.join('/') + '歳' : '—';
      tr.innerHTML = `
        <td>${r.year}</td>
        <td>${r.age}歳</td>
        <td>${r.spouseAge != null ? r.spouseAge + '歳' : '—'}</td>
        <td>${childStr}</td>
        <td class="flsim-event-cell">${r.events || ''}</td>
        <td>${fmtMan(r.income)}</td>
        <td>${fmtMan(r.living)}</td>
        <td>${fmtMan(r.eduCost)}</td>
        <td>${fmtMan(r.loanPayment)}</td>
        <td class="${r.balance >= 0 ? 'pos' : 'neg'}">${fmtMan(r.balance)}</td>
        <td>${fmtMan(r.financialAssets)}</td>
        <td>${fmtMan(r.loanBalance)}</td>`;
      tbody.appendChild(tr);
    });
  }

  /* =========================================
     ユーティリティ
     ========================================= */
  function fmtMan(v) {
    if (v === null || v === undefined) return '—';
    return Number(v).toLocaleString('ja-JP');
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /* =========================================
     localStorage
     ========================================= */
  const STORAGE_KEY = 'flsim_params_v1';

  function saveToStorage(params) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(params)); } catch (e) {}
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  /* =========================================
     初期化 — 保存データ復元
     ========================================= */
  (function init() {
    const saved = loadFromStorage();
    if (saved) {
      try {
        setVal('f-age',          saved.age);
        setVal('f-spouse-age',   saved.spouseAge);
        setVal('f-income',       saved.income);
        setVal('f-assets',       saved.assets);
        setVal('f-monthly-invest', saved.monthlyInvest);
        setVal('f-fire-living',  saved.fireLiving);
        setVal('f-loan-balance', saved.loanBalance);
        setVal('f-loan-rate',    saved.loanRate);
        setVal('f-loan-years',   saved.loanYears);
        setVal('f-loan-type',    saved.loanType);
        setVal('f-children',     saved.children);
        if (saved.childAges) renderChildAgeFields(saved.children, saved.childAges);
        setVal('f-fire-type',    saved.fireType);
        setVal('f-side-income',  saved.sideIncome);
        setVal('f-fire-rule',    saved.fireRule);
        setVal('f-return-rate',  saved.returnRate);
        setVal('f-extra-payment', saved.extraPayment);
        setVal('f-bonus-payment', saved.bonusPayment);
        setVal('f-rate-scenario', saved.rateScenario);
        setVal('f-inflation',    saved.inflation);
        setVal('f-income-growth', saved.incomeGrowth);
        setVal('f-edu-policy',   saved.eduPolicy);
        setVal('f-uni-type',     saved.uniType);
        const sideWrap = document.getElementById('f-side-income').closest('.flsim-field');
        if (sideWrap) sideWrap.style.display = saved.fireType === 'side' ? '' : 'none';
      } catch (e) {}
    }
  })();

})();
