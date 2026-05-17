<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<div id="flsim-root" class="flsim-root" role="main" aria-label="FIRE生活設計シミュレーター">

  <!-- ===== ヘッダー ===== -->
  <header class="flsim-header">
    <h1 class="flsim-title">住宅ローン × 教育費 × FIRE<br><span>統合シミュレーター</span></h1>
    <p class="flsim-subtitle">我が家の将来のお金を、30秒で可視化する</p>
  </header>

  <!-- ===== プリセットボタン ===== -->
  <section class="flsim-presets" aria-label="プリセット">
    <p class="flsim-label-sm">プリセットを選ぶ：</p>
    <div class="flsim-preset-btns">
      <button class="flsim-preset-btn" data-preset="couple2kids">共働き・子2人</button>
      <button class="flsim-preset-btn" data-preset="localside">地方サイドFIRE</button>
      <button class="flsim-preset-btn" data-preset="heavyloan">高額ローン型</button>
      <button class="flsim-preset-btn" data-preset="single">独身FIRE</button>
    </div>
  </section>

  <!-- ===== 入力フォーム ===== -->
  <section class="flsim-form-section">

    <!-- モード切替 -->
    <div class="flsim-mode-tabs" role="tablist" aria-label="入力モード">
      <button class="flsim-tab active" role="tab" aria-selected="true"  data-mode="basic"  id="tab-basic">初心者モード</button>
      <button class="flsim-tab"        role="tab" aria-selected="false" data-mode="detail" id="tab-detail">詳細モード</button>
    </div>

    <form id="flsim-form" novalidate>

      <!-- ── 基本入力 ── -->
      <div class="flsim-panel" id="panel-basic">

        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-age">現在の年齢</label>
            <div class="flsim-input-unit"><input type="number" id="f-age" name="age" value="35" min="20" max="65"> <span>歳</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-spouse-age">配偶者の年齢 <span class="flsim-opt">（任意）</span></label>
            <div class="flsim-input-unit"><input type="number" id="f-spouse-age" name="spouseAge" value="33" min="20" max="65"> <span>歳</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-income">世帯年収</label>
            <div class="flsim-input-unit"><input type="number" id="f-income" name="income" value="800" min="100" max="5000"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-assets">現在の金融資産</label>
            <div class="flsim-input-unit"><input type="number" id="f-assets" name="assets" value="500" min="0" max="100000"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-monthly-invest">毎月の積立投資額</label>
            <div class="flsim-input-unit"><input type="number" id="f-monthly-invest" name="monthlyInvest" value="5" min="0" max="100"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-fire-living">FIRE後の生活費（月）</label>
            <div class="flsim-input-unit"><input type="number" id="f-fire-living" name="fireLiving" value="25" min="5" max="200"> <span>万円</span></div>
          </div>
        </div>

        <!-- 住宅ローン -->
        <div class="flsim-subheading">住宅ローン</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-loan-balance">借入残高</label>
            <div class="flsim-input-unit"><input type="number" id="f-loan-balance" name="loanBalance" value="3000" min="0" max="30000"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-loan-rate">現在の金利</label>
            <div class="flsim-input-unit"><input type="number" id="f-loan-rate" name="loanRate" value="0.5" min="0" max="10" step="0.1"> <span>%</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-loan-years">残年数</label>
            <div class="flsim-input-unit"><input type="number" id="f-loan-years" name="loanYears" value="25" min="1" max="35"> <span>年</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-loan-type">返済方式</label>
            <select id="f-loan-type" name="loanType">
              <option value="equal_payment">元利均等</option>
              <option value="equal_principal">元金均等</option>
            </select>
          </div>
        </div>

        <!-- 子ども -->
        <div class="flsim-subheading">子ども</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-children">子どもの人数</label>
            <select id="f-children" name="children">
              <option value="0">0人</option>
              <option value="1">1人</option>
              <option value="2" selected>2人</option>
              <option value="3">3人</option>
            </select>
          </div>
        </div>
        <div id="flsim-children-ages" class="flsim-grid-2"></div>

        <!-- FIRE -->
        <div class="flsim-subheading">FIRE設定</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-fire-type">FIREタイプ</label>
            <select id="f-fire-type" name="fireType">
              <option value="full">完全FIRE</option>
              <option value="side" selected>サイドFIRE</option>
            </select>
          </div>
          <div class="flsim-field">
            <label for="f-side-income">サイドFIRE後の副収入（年）</label>
            <div class="flsim-input-unit"><input type="number" id="f-side-income" name="sideIncome" value="100" min="0" max="2000"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-fire-rule">取り崩しルール</label>
            <select id="f-fire-rule" name="fireRule">
              <option value="4">4%ルール</option>
              <option value="3.5">3.5%</option>
              <option value="3">3%ルール</option>
              <option value="2.5">2.5%ルール</option>
            </select>
          </div>
          <div class="flsim-field">
            <label for="f-return-rate">運用利回り（年）</label>
            <select id="f-return-rate" name="returnRate">
              <option value="3">3%（保守）</option>
              <option value="5" selected>5%（標準）</option>
              <option value="7">7%（積極）</option>
              <option value="custom">任意入力</option>
            </select>
          </div>
          <div class="flsim-field" id="f-return-custom-wrap" style="display:none">
            <label for="f-return-custom">任意利回り</label>
            <div class="flsim-input-unit"><input type="number" id="f-return-custom" name="returnCustom" value="5" min="0" max="30" step="0.1"> <span>%</span></div>
          </div>
        </div>
      </div>

      <!-- ── 詳細モード（開閉式） ── -->
      <div class="flsim-panel" id="panel-detail" hidden>
        <div class="flsim-subheading">教育方針</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-edu-policy">教育方針</label>
            <select id="f-edu-policy" name="eduPolicy">
              <option value="all_public" selected>全公立</option>
              <option value="mid_private">中学から私立</option>
              <option value="high_private">高校から私立</option>
              <option value="mostly_private">私立多め</option>
            </select>
          </div>
          <div class="flsim-field">
            <label for="f-uni-type">大学の種別</label>
            <select id="f-uni-type" name="uniType">
              <option value="liberal" selected>文系</option>
              <option value="science">理系</option>
            </select>
          </div>
        </div>

        <div class="flsim-subheading">繰上げ返済・ボーナス返済</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-extra-payment">繰上げ返済（年間）</label>
            <div class="flsim-input-unit"><input type="number" id="f-extra-payment" name="extraPayment" value="0" min="0" max="1000"> <span>万円</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-bonus-payment">ボーナス返済（年2回合計）</label>
            <div class="flsim-input-unit"><input type="number" id="f-bonus-payment" name="bonusPayment" value="0" min="0" max="500"> <span>万円</span></div>
          </div>
        </div>

        <div class="flsim-subheading">金利シナリオ</div>
        <div class="flsim-field">
          <label for="f-rate-scenario">金利変動シナリオ</label>
          <select id="f-rate-scenario" name="rateScenario">
            <option value="flat" selected>現状維持</option>
            <option value="plus025">+0.25%</option>
            <option value="plus05">+0.5%</option>
            <option value="plus1">+1%</option>
            <option value="plus2">+2%</option>
            <option value="gradual">段階上昇</option>
            <option value="custom">任意入力</option>
          </select>
        </div>
        <div class="flsim-field" id="f-rate-custom-wrap" style="display:none">
          <label for="f-rate-custom">変動後の金利</label>
          <div class="flsim-input-unit"><input type="number" id="f-rate-custom" name="rateCustom" value="1.5" min="0" max="10" step="0.1"> <span>%</span></div>
        </div>

        <div class="flsim-subheading">その他</div>
        <div class="flsim-grid-2">
          <div class="flsim-field">
            <label for="f-inflation">インフレ率（生活費反映）</label>
            <div class="flsim-input-unit"><input type="number" id="f-inflation" name="inflation" value="1" min="0" max="10" step="0.1"> <span>%</span></div>
          </div>
          <div class="flsim-field">
            <label for="f-income-growth">年収上昇率（年）</label>
            <div class="flsim-input-unit"><input type="number" id="f-income-growth" name="incomeGrowth" value="1" min="0" max="10" step="0.1"> <span>%</span></div>
          </div>
        </div>
      </div>

      <!-- ── 実行ボタン ── -->
      <div class="flsim-actions">
        <button type="submit" class="flsim-btn-primary" id="flsim-run">シミュレーション実行</button>
        <button type="button" class="flsim-btn-ghost" id="flsim-reset">リセット</button>
      </div>

    </form>
  </section>

  <!-- ===== 結果エリア ===== -->
  <section id="flsim-results" class="flsim-results" hidden aria-live="polite">

    <!-- サマリーカード -->
    <div class="flsim-result-header">
      <h2>シミュレーション結果</h2>
      <p class="flsim-disclaimer-inline">参考試算です。実際と異なる場合があります。</p>
    </div>

    <div class="flsim-summary-cards">
      <div class="flsim-card" id="card-fire-age">
        <div class="flsim-card-label">FIRE可能年齢</div>
        <div class="flsim-card-value" id="res-fire-age">—</div>
      </div>
      <div class="flsim-card" id="card-loan-end">
        <div class="flsim-card-label">ローン完済年</div>
        <div class="flsim-card-value" id="res-loan-end">—</div>
      </div>
      <div class="flsim-card" id="card-edu-peak">
        <div class="flsim-card-label">教育費ピーク（年）</div>
        <div class="flsim-card-value" id="res-edu-peak">—</div>
      </div>
      <div class="flsim-card" id="card-rate-impact">
        <div class="flsim-card-label">金利+1%時の追加負担</div>
        <div class="flsim-card-value" id="res-rate-impact">—</div>
      </div>
    </div>

    <!-- FIRE達成度 -->
    <div class="flsim-progress-section">
      <div class="flsim-progress-label">
        <span>FIRE達成度</span>
        <span id="res-fire-pct">0%</span>
      </div>
      <div class="flsim-progress-bar-bg">
        <div class="flsim-progress-bar-fill" id="res-fire-bar" style="width:0%"></div>
      </div>
      <div class="flsim-danger-badge" id="res-danger-badge"></div>
    </div>

    <!-- タイムライン -->
    <div class="flsim-timeline-section">
      <h3>ライフイベント タイムライン</h3>
      <ul class="flsim-timeline" id="res-timeline"></ul>
    </div>

    <!-- グラフ -->
    <div class="flsim-charts">
      <div class="flsim-chart-wrap">
        <h3>金融資産 &amp; ローン残高推移</h3>
        <canvas id="chart-assets" height="280"></canvas>
      </div>
      <div class="flsim-chart-wrap">
        <h3>年間収支推移</h3>
        <canvas id="chart-cashflow" height="280"></canvas>
      </div>
    </div>

    <!-- キャッシュフロー表 -->
    <div class="flsim-cf-section">
      <h3>年度別キャッシュフロー表</h3>
      <div class="flsim-table-wrap">
        <table class="flsim-cf-table" id="res-cf-table">
          <thead>
            <tr>
              <th>西暦</th>
              <th>年齢</th>
              <th>配偶者</th>
              <th>子ども</th>
              <th>イベント</th>
              <th>年収</th>
              <th>生活費</th>
              <th>教育費</th>
              <th>ローン返済</th>
              <th>年間収支</th>
              <th>金融資産</th>
              <th>ローン残高</th>
            </tr>
          </thead>
          <tbody id="res-cf-tbody"></tbody>
        </table>
      </div>
    </div>

  </section>

  <!-- ===== 免責事項 ===== -->
  <footer class="flsim-disclaimer">
    <p>本ツールは一般的条件に基づく参考シミュレーションです。税制・金利・教育費・社会制度等は変更される可能性があり、実際と異なる場合があります。最終判断はご自身で行い、必要に応じて専門家・金融機関・公的機関へご確認ください。</p>
  </footer>

</div><!-- /#flsim-root -->
