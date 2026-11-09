/* 摩伊拉咖啡馆：1909古董塔罗与咖啡渣占卜台 */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var SERIF = '"Songti SC", "SimSun", Georgia, serif';
  var SANS = '"PingFang SC", "Microsoft YaHei", sans-serif';
  function font(px, weight, fam) {
    return (weight || 400) + ' ' + Math.max(14, px) + 'px ' + (fam || SERIF);
  }
  function $(id) { return document.getElementById(id); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- assets ---------- */
  var ASSETS = {
    atlas: './assets/star-atlas-1660-1a2b3c.jpg',
    cup: './assets/turkish-cup-2b3c4d.jpg',
    crema: './assets/coffee-crema-3c4d5e.jpg'
  };

  var CARDS = [
    { id: 'fool', n: '0', name: '愚者', img: './assets/tarot-00-fool-a1b2c3.jpg', lk: [8, 5],
      up: '新的起点与轻装上路的勇气', rev: '冲动冒进与准备不足' },
    { id: 'magician', n: 'I', name: '魔术师', img: './assets/tarot-01-magician-b2c3d4.jpg', lk: [9, 5],
      up: '手上资源已齐，只差一次动手', rev: '才华分散，话说得比做得多' },
    { id: 'priestess', n: 'II', name: '女祭司', img: './assets/tarot-02-priestess-c3d4e5.jpg', lk: [7, 6],
      up: '直觉清醒，答案藏在沉默里', rev: '信息被隐瞒，或你在回避真相' },
    { id: 'empress', n: 'III', name: '皇后', img: './assets/tarot-03-empress-d4e5f6.jpg', lk: [9, 5],
      up: '丰盛、滋养与稳定的收成', rev: '过度付出，或停滞的回报' },
    { id: 'emperor', n: 'IV', name: '皇帝', img: './assets/tarot-04-emperor-e5f6a7.jpg', lk: [7, 5],
      up: '规则、结构与果断的掌控', rev: '固执僵化，或来自权威的压力' },
    { id: 'chariot', n: 'VII', name: '战车', img: './assets/tarot-07-chariot-f6a7b8.jpg', lk: [8, 5],
      up: '意志统一，向着目标加速', rev: '方向分裂，用力过猛反而失控' },
    { id: 'wheel', n: 'X', name: '命运之轮', img: './assets/tarot-10-wheel-a7b8c9.jpg', lk: [8, 4],
      up: '转机到来，局势翻面', rev: '周期低谷，暂时的逆风' },
    { id: 'tower', n: 'XVI', name: '高塔', img: './assets/tarot-16-tower-b8c9d0.jpg', lk: [4, 6],
      up: '旧结构崩塌，突如其来的真相', rev: '崩塌被拖延，或灾后重建中的余震' },
    { id: 'star', n: 'XVII', name: '星星', img: './assets/tarot-17-star-c9d0e1.jpg', lk: [10, 6],
      up: '希望修复，长线的疗愈', rev: '信心失焦，对未来过度悲观' },
    { id: 'moon', n: 'XVIII', name: '月亮', img: './assets/tarot-18-moon-d0e1f2.jpg', lk: [5, 7],
      up: '迷雾中的不安与潜意识的暗示', rev: '迷雾渐散，真相即将浮出' },
    { id: 'sun', n: 'XIX', name: '太阳', img: './assets/tarot-19-sun-e1f2a3.jpg', lk: [10, 6],
      up: '明朗、成功与被看见', rev: '热情过载，或好消息被延迟' },
    { id: 'world', n: 'XXI', name: '世界', img: './assets/tarot-21-world-f2a3b4.jpg', lk: [10, 6],
      up: '圆满收官，一个周期完成', rev: '只差最后一步，收尾被拖住' }
  ];

  var SLOT_NAMES = ['过去之因', '当下之局', '未来之兆'];
  var SLOT_SHORT = ['过去', '当下', '未来'];

  var INTENTS = {
    career: { label: '搞钱与事业破局', short: '事业',
      lens: ['放在事业上，这是你过去几年在职场与钱路上埋下的底色。',
             '落到搞钱这件事，它就是眼下卡住你或推着你的那个点。',
             '对事业破局来说，这是接下来三十天最值得押注的方向。'] },
    love: { label: '感情与宿命羁绊', short: '感情',
      lens: ['放在感情上，这是你们关系里最早埋下的那颗种子。',
             '落到这段羁绊，它说的就是此刻你们之间真正的症结。',
             '对这段缘分来说，这是接下来最可能发生的转向。'] },
    study: { label: '学业与上岸渡劫', short: '学业',
      lens: ['放在学业上，这是你一路复习与备考留下的惯性。',
             '落到上岸这件事，它指出你眼下最该修正的节奏。',
             '对渡劫结果来说，这是临门一脚时最需要的状态。'] },
    luck: { label: '今日赛博水逆退散', short: '运势',
      lens: ['放在今天的运势上，这是你近日倒霉感的真正来源。',
             '落到眼前的水逆，它说明麻烦究竟卡在哪一环。',
             '对退散水逆来说，这是今晚之前最该抓住的转机。'] }
  };

  var SIGNS = {
    fire: { label: '火象', trait: '火象的你行动快，热度高，今天要防的是三分钟热度。' },
    earth: { label: '土象', trait: '土象的你务实稳健，今天要防的是过度保守而错过窗口。' },
    air: { label: '风象', trait: '风象的你信息多，点子密，今天要防的是想太多而落不了地。' },
    water: { label: '水象', trait: '水象的你感受细，直觉准，今天要防的是被别人的情绪带跑。' }
  };

  var TOTEMS = {
    owl: { name: '夜枭栖枝', el: 'air', luck: 4, item: '黄铜书签',
      read: '猫头鹰栖在横枝上，双眼朝向杯口。夜枭擅长在暗处看清事物，说明你早已察觉某件事，只是一直没有说破。',
      intent: {
        career: '有一个机会出现在非正式场合，夜里想清楚的方案，比白天开会时的更靠谱。',
        love: '对方的态度你心里早有判断，别再找人求证，第一直觉就是答案。',
        study: '适合在安静的夜间复盘，薄弱点会在独处时自己浮出来。',
        luck: '今天先观察再开口，能替你挡掉一次口舌是非。' },
      zones: {
        rim: '杯沿的渣粒细碎而分散，近七日会有一条不起眼的消息，值得你多看两眼。',
        wall: '杯壁左侧有一道向上的纹路，是暗处有人在替你说话；右侧的短横是阻力，多半来自你自己的犹豫。',
        bottom: '杯底的死穴是想得太多、做得太少。枝再稳，鸟不飞也只是摆设。' } },
    anchor: { name: '破浪铁锚', el: 'water', luck: 5, item: '深蓝丝巾',
      read: '铁锚沉在杯底正中，弧形双臂向上托起。锚代表在风浪里把你固定住的东西，你需要的不是更快，而是更稳。',
      intent: {
        career: '别被新风口带着跑，守住手上的主业，副业用小成本试水即可。',
        love: '这段关系需要一个明确的定义，模糊久了，双方都会累。',
        study: '稳住节奏比冲刺重要，每天固定时段学习，比一次熬夜有效十倍。',
        luck: '今天适合收拾、整理、做减法，丢掉一件旧物会带来好运。' },
      zones: {
        rim: '杯沿有一圈整齐的细渣，近七日行程会被固定下来，反而让人安心。',
        wall: '杯壁两侧对称，助力与阻力基本持平，关键看你选哪一边使力。',
        bottom: '杯底的死穴是不敢松手，抓得太紧的东西，正在拖慢你。' } },
    key: { name: '双生铜钥', el: 'earth', luck: 2, item: '一把旧钥匙',
      read: '两把铜钥交叉叠在杯底，一把朝左，一把朝右。双钥意味着同一扇门有两种打开方式，你一直只试了其中一种。',
      intent: {
        career: '换个角度谈合作，一个看似无关的人脉，会成为第二把钥匙。',
        love: '你和对方各握着一半真话，先开口的人会拿到主动权。',
        study: '换一种学习方法，把输入改成输出，卡住的知识点会松动。',
        luck: '今天遇到的阻碍有备选路线，别在一条路上硬撞。' },
      zones: {
        rim: '杯沿渣粒成对出现，近七日会遇到一组二选一的选择。',
        wall: '杯壁中段有交叉的纹路，是两股力量在拉扯，你夹在中间。',
        bottom: '杯底的死穴是总想等一个万无一失的答案，而钥匙只有试了才知道合不合。' } },
    stag: { name: '衔枝白鹿', el: 'fire', luck: 6, item: '白色小饰物',
      read: '一只白鹿正面望向你，口中衔着一小枝橄榄。鹿是林中的使者，衔枝表示善意与和解，好消息正在靠近。',
      intent: {
        career: '有贵人愿意递来橄榄枝，不必急着讨价还价，先接住这份善意。',
        love: '冷战或误会有机会破冰，先递台阶的人，会赢得整段关系。',
        study: '导师或同学会给出关键提示，主动请教比独自硬啃更快。',
        luck: '今天容易遇到顺手的小幸运，保持礼貌，好运会叠加。' },
      zones: {
        rim: '杯沿清亮，渣粒稀疏，近七日心情明显轻盈，适合处理积压的消息。',
        wall: '杯壁上扬的纹路向着杯口，是一股持续的助力，来自一位年长或资深的人。',
        bottom: '杯底几乎没有死穴，只有一点小提醒：好运来时别疑神疑鬼。' } },
    crescent: { name: '新月王冠', el: 'water', luck: 5, item: '银色小饰品',
      read: '一弯新月顶着小小的王冠，悬在杯底中央。新月是从零开始的光，王冠则说明这一次起步，你有资格站在更高的位置。',
      intent: {
        career: '适合开启新项目或亮出个人品牌，起点虽小，格局要大。',
        love: '新的缘分从一个小小的契机开始，不要用旧经验去套新的人。',
        study: '适合重新制定计划，新的阶段从今天算起，不必追悔过去。',
        luck: '今天适合许愿与立目标，写下来的事更容易兑现。' },
      zones: {
        rim: '杯沿有一道弧形的亮边，近七日会有一次小规模的开端。',
        wall: '杯壁偏右有月牙状的纹路，是情绪层面的助力，你的感受值得被信任。',
        bottom: '杯底的死穴是低估自己，把王冠摘下来放进口袋的人，永远等不到加冕。' } },
    serpent: { name: '衔尾金蛇', el: 'earth', luck: 3, item: '圆形戒指或手环',
      read: '一条金蛇首尾相衔，围成完整的圆环。衔尾蛇是循环与重生的古老符号，说明你正在重复某个模式，也正站在跳出它的门口。',
      intent: {
        career: '同一类问题第三次出现，这次别再打补丁，从根上改流程。',
        love: '你们在重复同一场争吵，把争吵的开头改掉，结局才会改变。',
        study: '同一类题型反复出错，是方法而非努力的问题，回到基础概念。',
        luck: '今天会遇到熟悉的麻烦，换一种与以往不同的做法，它就会自动消失。' },
      zones: {
        rim: '杯沿渣粒连成一圈，近七日会有似曾相识的事重演。',
        wall: '杯壁的纹路首尾相连，助力和阻力其实来自同一件事，换个角度它们就互换了位置。',
        bottom: '杯底的死穴是习惯，旧习惯舒服，但它把你锁在圆圈里。' } }
  };
  var TOTEM_KEYS = ['owl', 'anchor', 'key', 'stag', 'crescent', 'serpent'];

  var ZONES = {
    rim: { label: '杯沿 · 近七日变局', r0: 158, r1: 190, tag: '杯沿' },
    wall: { label: '杯壁 · 暗处助力与阻力', r0: 120, r1: 158, tag: '杯壁' },
    bottom: { label: '杯底 · 潜意识死穴', r0: 0, r1: 120, tag: '杯底' }
  };

  var CAL = {
    career: { yi: ['催进一次拖着的报价', '整理作品集并投出三份', '约一位前同事喝咖啡'],
              ji: ['在群里情绪化发言', '临时答应来路不明的合作', '深夜修改合同条款'] },
    love: { yi: ['先发一句不带目的的问候', '把心里话写成三行再决定发不发', '独处半小时再回消息'],
            ji: ['翻对方三个月前的动态', '借酒后的冲动表白', '拿第三个人来试探'] },
    study: { yi: ['番茄钟四轮，每轮结束写一句总结', '重做上周的错题', '睡前十分钟默背知识框架'],
             ji: ['通宵刷题', '比较别人的进度', '临时更换复习资料'] },
    luck: { yi: ['出门前检查钥匙和充电线', '先喝水再回复消息', '把今天最难的事排在上午'],
            ji: ['冲动下单', '在评论区抬杠', '把重要文件留到最后一刻'] }
  };
  var HOURS = ['辰时 07:00 至 09:00', '巳时 09:00 至 11:00', '午时 11:00 至 13:00',
               '未时 13:00 至 15:00', '申时 15:00 至 17:00', '酉时 17:00 至 19:00', '戌时 19:00 至 21:00'];

  var RANKS = {
    SSR: { name: 'SSR · 紫微天选', quotes: [
      '三星归位，杯里有光，牌里有路。今天开口的每一句话，都有人认真听。',
      '紫微照命，机会不会敲第二次门，所以第一次就请你开门。'] },
    SR: { name: 'SR · 扶摇破局', quotes: [
      '风向已转，不必等到万事俱备。先迈出半步，路会替你补上另外半步。',
      '杯底有裂纹，牌面有出口。顺着裂纹走，别回头。'] },
    A: { name: 'A · 顺水行舟', quotes: [
      '水不争先，却能到海。今天做稳一件小事，比做成十件大事更值钱。',
      '不急，渣已沉底，答案自会澄清。'] },
    B: { name: 'B · 潜龙勿用', quotes: [
      '潜龙勿用，不是不用，是等一阵风。今天把力气留给明天。',
      '牌在提醒你停一停，停下来的人，反而最先看清路。'] }
  };

  /* ---------- state ---------- */
  var S = {
    act: 1, reached: 1, mode: 'daily', intent: 'career', sign: 'fire', sound: true,
    key: null, totemKey: null, points: null, particles: null, stains: null,
    settled: false, swirling: false, zone: null,
    fate: null, drawn: [], drawing: false, result: null, cardURL: null
  };

  var HISTORY_KEY = 'moirae_cafe_history_v1';

  /* ---------- rng ---------- */
  function hashStr(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function dateStr() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }
  function whisperText() { return ($('whisper-input').value || '').trim(); }
  function seedKey() {
    return [S.mode, dateStr(), S.intent, S.sign, whisperText()].join('|');
  }
  function getRng(salt) {
    return S.mode === 'daily' ? mulberry(hashStr(seedKey() + '|' + salt)) : Math.random;
  }
  function shuffled(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- ui helpers ---------- */
  var toastTimer = null;
  function hideToast() {
    var t = $('toast');
    t.classList.remove('is-show');
    t.style.opacity = '';
    clearTimeout(toastTimer);
  }
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 2200);
  }
  function flash() {
    var f = $('ritual-flash');
    if (!f) return;
    f.classList.add('is-on');
    setTimeout(function () { f.classList.remove('is-on'); }, 700);
  }
  var actx = null;
  function beep(freq, dur, type, vol) {
    if (!S.sound) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = actx || new AC();
      var o = actx.createOscillator();
      var g = actx.createGain();
      var now = actx.currentTime;
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(vol || 0.05, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(now); o.stop(now + dur + 0.03);
    } catch (e) { /* audio unavailable */ }
  }
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- stage navigation ---------- */
  var hudAct = $('hud-act');
  var hudTotem = $('hud-totem');
  var hudScore = $('hud-score');
  var jumps = $$('.jump');

  function showAct(n) {
    S.act = n;
    hideToast();
    for (var i = 1; i <= 4; i++) { $('act-' + i).hidden = (i !== n); }
    jumps.forEach(function (b) {
      var k = parseInt(b.getAttribute('data-jump'), 10);
      b.disabled = k > S.reached;
      var cur = (k === n);
      b.classList.toggle('is-current', cur);
      if (cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    document.body.setAttribute('data-field', (n >= 3) ? 'paper' : 'ink');
    hudAct.textContent = '第 ' + n + ' 仪 / 4';
    flash();
    window.scrollTo(0, 0);
    var h = $('act' + n + '-title');
    if (h) { try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    if (n === 2) drawCup(cupOpts());
    if (n === 4 && !S.result) buildResult();
  }
  function openStage(n) {
    if (n > S.reached) S.reached = n;
    jumps.forEach(function (b) {
      var k = parseInt(b.getAttribute('data-jump'), 10);
      b.disabled = k > S.reached;
    });
  }

  /* ---------- stage 1 ---------- */
  var MODE_NOTES = {
    daily: '每日灵签：同一天、同一问题会得到同一份神谕，明天再来会变。',
    free: '自由重占：每次都会重新洗牌与摇杯，适合想换个角度再问一次。'
  };
  function selectInGroup(sel, attr, val) {
    $$(sel).forEach(function (b) {
      var on = b.getAttribute(attr) === val;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    });
  }
  function updateStartHint() {
    $('start-hint').textContent = '已锚定：' + INTENTS[S.intent].label + ' · ' + SIGNS[S.sign].label +
      (whisperText() ? ' · 杯底留言已写下' : '');
  }
  $$('.mode-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.mode = b.getAttribute('data-mode');
      $$('.mode-btn').forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $('mode-note').textContent = MODE_NOTES[S.mode];
      beep(520, 0.12);
    });
  });
  $$('.intent-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.intent = b.getAttribute('data-intent');
      selectInGroup('.intent-btn', 'data-intent', S.intent);
      updateStartHint();
      beep(440, 0.1);
    });
  });
  $$('.sign-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.sign = b.getAttribute('data-sign');
      selectInGroup('.sign-btn', 'data-sign', S.sign);
      updateStartHint();
      beep(494, 0.1);
    });
  });
  $('whisper-input').addEventListener('input', updateStartHint);

  $('btn-to-act2').addEventListener('click', function () {
    var k = seedKey();
    if (k !== S.key) { resetReading(); S.key = k; S.fate = makeFate(); }
    openStage(2);
    beep(392, 0.25, 'triangle');
    showAct(2);
  });

  /* ---------- totem silhouettes ---------- */
  var SHAPES = {
    owl: function (g) {
      g.strokeStyle = '#000'; g.fillStyle = '#000'; g.lineCap = 'round';
      g.lineWidth = 9; g.beginPath(); g.moveTo(20, 172); g.quadraticCurveTo(100, 184, 182, 166); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.moveTo(150, 170); g.lineTo(178, 140); g.stroke();
      g.beginPath(); g.ellipse(100, 114, 44, 58, 0, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(60, 120, 15, 44, 0.22, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(140, 120, 15, 44, -0.22, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(100, 62, 36, 30, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(68, 48); g.lineTo(70, 12); g.lineTo(92, 36); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(132, 48); g.lineTo(130, 12); g.lineTo(108, 36); g.closePath(); g.fill();
      g.fillRect(82, 164, 8, 10); g.fillRect(110, 164, 8, 10);
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc(85, 62, 11, 0, TAU); g.fill();
      g.beginPath(); g.arc(115, 62, 11, 0, TAU); g.fill();
      g.lineWidth = 2;
      for (var row = 0; row < 3; row++) {
        for (var col = -1; col <= 1; col++) {
          var cx = 100 + col * 16, cy = 108 + row * 18;
          g.beginPath(); g.moveTo(cx - 6, cy - 4); g.lineTo(cx, cy + 3); g.lineTo(cx + 6, cy - 4); g.stroke();
        }
      }
      g.globalCompositeOperation = 'source-over';
      g.beginPath(); g.arc(85, 62, 5, 0, TAU); g.fill();
      g.beginPath(); g.arc(115, 62, 5, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(94, 68); g.lineTo(106, 68); g.lineTo(100, 84); g.closePath(); g.fill();
    },
    anchor: function (g) {
      g.strokeStyle = '#000'; g.fillStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round';
      g.lineWidth = 7; g.beginPath(); g.arc(100, 32, 14, 0, TAU); g.stroke();
      g.lineWidth = 10; g.beginPath(); g.moveTo(100, 46); g.lineTo(100, 168); g.stroke();
      g.lineWidth = 9; g.beginPath(); g.moveTo(68, 68); g.lineTo(132, 68); g.stroke();
      g.beginPath(); g.arc(68, 68, 6, 0, TAU); g.fill();
      g.beginPath(); g.arc(132, 68, 6, 0, TAU); g.fill();
      g.lineWidth = 11; g.beginPath(); g.arc(100, 112, 58, 0.05, Math.PI - 0.05); g.stroke();
      g.beginPath(); g.moveTo(26, 102); g.lineTo(54, 116); g.lineTo(38, 130); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(174, 102); g.lineTo(146, 116); g.lineTo(162, 130); g.closePath(); g.fill();
      g.lineWidth = 3;
      g.globalCompositeOperation = 'destination-out';
      g.beginPath();
      for (var y = 80; y < 150; y += 2) {
        var x = 100 + Math.sin(y * 0.35) * 3;
        if (y === 80) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
      g.globalCompositeOperation = 'source-over';
    },
    key: function (g) {
      function oneKey(angle, mirror) {
        g.save();
        g.translate(100, 100); g.rotate(angle);
        if (mirror) g.scale(-1, 1);
        g.lineWidth = 9; g.strokeStyle = '#000'; g.fillStyle = '#000';
        g.beginPath(); g.arc(0, -62, 20, 0, TAU); g.stroke();
        g.beginPath(); g.arc(0, -62, 6, 0, TAU); g.fill();
        g.fillRect(-4.5, -42, 9, 118);
        g.fillRect(4.5, 50, 18, 9);
        g.fillRect(4.5, 66, 12, 9);
        g.restore();
      }
      oneKey(Math.PI / 4, false);
      oneKey(-Math.PI / 4, true);
    },
    stag: function (g) {
      g.strokeStyle = '#000'; g.fillStyle = '#000'; g.lineCap = 'round'; g.lineJoin = 'round';
      var tines = [
        [[84, 92], [70, 70], [58, 50], [50, 28], [46, 10]],
        [[70, 70], [50, 66], [36, 56]],
        [[58, 50], [40, 44], [30, 30]],
        [[52, 34], [64, 22]]
      ];
      g.lineWidth = 6;
      tines.forEach(function (pl) {
        [false, true].forEach(function (m) {
          g.beginPath();
          pl.forEach(function (p, i) {
            var x = m ? 200 - p[0] : p[0];
            if (i === 0) g.moveTo(x, p[1]); else g.lineTo(x, p[1]);
          });
          g.stroke();
        });
      });
      g.beginPath(); g.ellipse(66, 104, 16, 7, -0.5, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(134, 104, 16, 7, 0.5, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(76, 130); g.lineTo(124, 130); g.lineTo(144, 198); g.lineTo(56, 198); g.closePath(); g.fill();
      g.beginPath(); g.ellipse(100, 116, 27, 30, 0, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(100, 146, 15, 23, 0, 0, TAU); g.fill();
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc(87, 112, 4, 0, TAU); g.fill();
      g.beginPath(); g.arc(113, 112, 4, 0, TAU); g.fill();
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(66, 172); g.quadraticCurveTo(100, 160, 134, 168); g.stroke();
      [[76, 168, -0.6], [90, 165, 0.5], [112, 164, -0.5], [126, 167, 0.6]].forEach(function (l) {
        g.beginPath(); g.ellipse(l[0], l[1], 7, 3.5, l[2], 0, TAU); g.fill();
      });
      g.globalCompositeOperation = 'source-over';
    },
    crescent: function (g) {
      g.fillStyle = '#000';
      g.beginPath(); g.arc(100, 118, 56, 0, TAU); g.fill();
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc(128, 108, 48, 0, TAU); g.fill();
      g.globalCompositeOperation = 'source-over';
      g.beginPath();
      g.moveTo(68, 66); g.lineTo(64, 34); g.lineTo(84, 50); g.lineTo(100, 26);
      g.lineTo(116, 50); g.lineTo(136, 34); g.lineTo(132, 66); g.closePath(); g.fill();
      g.globalCompositeOperation = 'destination-out';
      [[84, 56], [100, 56], [116, 56]].forEach(function (p) {
        g.beginPath(); g.arc(p[0], p[1], 3, 0, TAU); g.fill();
      });
      g.globalCompositeOperation = 'source-over';
      g.beginPath();
      for (var i = 0; i < 10; i++) {
        var rr = (i % 2 === 0) ? 11 : 4.5;
        var a = -Math.PI / 2 + i * Math.PI / 5;
        var px = 130 + Math.cos(a) * rr, py = 108 + Math.sin(a) * rr;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath(); g.fill();
    },
    serpent: function (g) {
      g.fillStyle = '#000';
      var R = 58, N = 140;
      for (var i = 0; i <= N; i++) {
        var s = i / N;
        var a = 0.55 + s * (TAU - 0.45);
        var w = 5 + 15 * Math.pow(s, 0.8);
        g.beginPath(); g.arc(100 + Math.cos(a) * R, 100 + Math.sin(a) * R, w / 2, 0, TAU); g.fill();
      }
      var ha = 0.3;
      g.save();
      g.translate(100 + Math.cos(ha) * R, 100 + Math.sin(ha) * R);
      g.rotate(ha + Math.PI / 2);
      g.beginPath(); g.ellipse(0, 4, 13, 17, 0, 0, TAU); g.fill();
      g.globalCompositeOperation = 'destination-out';
      g.beginPath(); g.arc(-5, 2, 2.8, 0, TAU); g.fill();
      g.beginPath(); g.arc(5, 2, 2.8, 0, TAU); g.fill();
      g.restore();
      g.globalCompositeOperation = 'destination-out';
      for (var j = 12; j < N - 6; j += 6) {
        var sj = j / N;
        var aj = 0.55 + sj * (TAU - 0.45);
        g.beginPath(); g.arc(100 + Math.cos(aj) * R, 100 + Math.sin(aj) * R, 1.6, 0, TAU); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
    }
  };

  function genPoints(key, n) {
    var off = document.createElement('canvas');
    off.width = 200; off.height = 200;
    var g = off.getContext('2d');
    SHAPES[key](g);
    var data = g.getImageData(0, 0, 200, 200).data;
    var pool = [];
    for (var y = 0; y < 200; y++) {
      for (var x = 0; x < 200; x++) {
        if (data[(y * 200 + x) * 4 + 3] > 128) pool.push(x, y);
      }
    }
    var pts = [];
    var len = pool.length / 2;
    if (!len) return pts;
    for (var i = 0; i < n; i++) {
      var k = Math.floor(Math.random() * len) * 2;
      var r = Math.random();
      pts.push({ x: pool[k] + Math.random() - 0.5, y: pool[k + 1] + Math.random() - 0.5,
                 c: r < 0.5 ? 0 : (r < 0.88 ? 1 : 2), s: 0.9 + Math.random() * 1.1 });
    }
    return pts;
  }
  var PAL_DARK = ['#23150e', '#3d281c', '#c9a24b'];
  var PAL_LIGHT = ['#f1e2c0', '#c9a24b', '#e8c97a'];

  function drawPoints(g, pts, ox, oy, sc, sizeMul, pal) {
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      g.fillStyle = pal[p.c];
      g.beginPath();
      g.arc(ox + p.x * sc, oy + p.y * sc, p.s * sizeMul, 0, TAU);
      g.fill();
    }
  }

  /* ---------- cup canvas ---------- */
  var cupCanvas = $('cup-canvas');
  var cg = cupCanvas.getContext('2d');
  var CW = 520, C = 260;
  var CUP_SC = 0.95, CUP_OX = C - 100 * CUP_SC, CUP_OY = C - 100 * CUP_SC;

  function drawCupBase(g) {
    g.clearRect(0, 0, CW, CW);
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 28; g.shadowOffsetY = 10;
    var sg = g.createRadialGradient(C - 40, C - 50, 40, C, C, 250);
    sg.addColorStop(0, '#fffaf0'); sg.addColorStop(1, '#dcd0b6');
    g.fillStyle = sg; g.beginPath(); g.arc(C, C, 250, 0, TAU); g.fill();
    g.restore();
    g.strokeStyle = 'rgba(201,162,75,0.7)'; g.lineWidth = 2;
    g.beginPath(); g.arc(C, C, 238, 0, TAU); g.stroke();
    g.strokeStyle = 'rgba(150,130,90,0.35)'; g.lineWidth = 1.5;
    g.beginPath(); g.arc(C, C, 222, 0, TAU); g.stroke();
    // handle
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 8; g.shadowOffsetY = 4;
    g.strokeStyle = '#f7f1e2'; g.lineWidth = 20;
    g.beginPath(); g.ellipse(466, C, 34, 28, 0, 0, TAU); g.stroke();
    g.restore();
    g.strokeStyle = 'rgba(201,162,75,0.8)'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(466, C, 34, 28, 0, 0, TAU); g.stroke();
    // cup body
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 16; g.shadowOffsetY = 6;
    g.fillStyle = '#fbf6ea'; g.beginPath(); g.arc(C, C, 205, 0, TAU); g.fill();
    g.restore();
    g.strokeStyle = '#c9a24b'; g.lineWidth = 3;
    g.beginPath(); g.arc(C, C, 197, 0, TAU); g.stroke();
    for (var i = 0; i < 48; i++) {
      var a = i / 48 * TAU;
      g.fillStyle = (i % 2) ? '#c9a24b' : '#2f5d8a';
      g.beginPath(); g.arc(C + Math.cos(a) * 200, C + Math.sin(a) * 200, 1.8, 0, TAU); g.fill();
    }
    // inner wall
    var wg = g.createRadialGradient(C, C, 118, C, C, 192);
    wg.addColorStop(0, '#e6d8b8'); wg.addColorStop(0.5, '#f3ead3'); wg.addColorStop(1, '#fffaf0');
    g.fillStyle = wg; g.beginPath(); g.arc(C, C, 190, 0, TAU); g.fill();
    g.strokeStyle = '#d9ccaf'; g.lineWidth = 2; g.beginPath(); g.arc(C, C, 190, 0, TAU); g.stroke();
    g.strokeStyle = 'rgba(120,90,50,0.15)'; g.lineWidth = 1.5; g.beginPath(); g.arc(C, C, 158, 0, TAU); g.stroke();
    // floor
    var fg = g.createRadialGradient(C - 20, C - 20, 10, C, C, 120);
    fg.addColorStop(0, '#f3ead6'); fg.addColorStop(1, '#e0d0aa');
    g.fillStyle = fg; g.beginPath(); g.arc(C, C, 119, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(120,90,50,0.3)'; g.lineWidth = 3; g.beginPath(); g.arc(C, C, 119, 0, TAU); g.stroke();
  }

  function makeStains() {
    var st = [];
    for (var i = 0; i < 30; i++) {
      st.push({ a: Math.random() * TAU, r0: 186 - Math.random() * 6, len: 14 + Math.random() * 58,
                bend: (Math.random() - 0.5) * 0.14, w: 1.5 + Math.random() * 3.5, al: 0.1 + Math.random() * 0.2 });
    }
    return st;
  }
  function drawStains(g, st) {
    g.save();
    g.beginPath(); g.arc(C, C, 188, 0, TAU); g.clip();
    st.forEach(function (s) {
      g.strokeStyle = 'rgba(61,40,28,' + s.al + ')'; g.lineWidth = s.w; g.lineCap = 'round';
      g.beginPath();
      for (var t = 0; t <= 1.001; t += 0.1) {
        var r = s.r0 - s.len * t, a = s.a + s.bend * t;
        var x = C + Math.cos(a) * r, y = C + Math.sin(a) * r;
        if (t === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    });
    g.restore();
    g.fillStyle = 'rgba(61,40,28,0.14)'; g.beginPath(); g.arc(C, C, 112, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(61,40,28,0.28)'; g.lineWidth = 2;
    g.beginPath(); g.arc(C, C, 116, 0, TAU); g.stroke();
  }
  function drawLiquid(g, amt) {
    if (amt <= 0) return;
    g.save();
    g.globalAlpha = Math.min(1, amt);
    var lg = g.createRadialGradient(C - 30, C - 30, 10, C, C, 180);
    lg.addColorStop(0, '#4a2c19'); lg.addColorStop(1, '#1d0f08');
    g.fillStyle = lg; g.beginPath(); g.arc(C, C, 178, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(201,162,75,0.28)'; g.lineWidth = 6;
    g.beginPath(); g.arc(C, C, 150, 0.3, 2.2); g.stroke();
    g.strokeStyle = 'rgba(255,230,180,0.16)'; g.lineWidth = 3;
    g.beginPath(); g.arc(C, C, 120, 3.4, 4.8); g.stroke();
    g.restore();
  }
  function drawZone(g, zone) {
    var z = ZONES[zone];
    if (!z) return;
    g.save();
    g.beginPath();
    g.arc(C, C, z.r1, 0, TAU);
    if (z.r0 > 0) g.arc(C, C, z.r0, 0, TAU, true);
    g.fillStyle = 'rgba(201,162,75,0.24)';
    g.fill('evenodd');
    g.strokeStyle = '#c9a24b'; g.lineWidth = 3; g.setLineDash([8, 6]);
    g.beginPath(); g.arc(C, C, z.r1 - 1, 0, TAU); g.stroke();
    if (z.r0 > 0) { g.beginPath(); g.arc(C, C, z.r0 + 1, 0, TAU); g.stroke(); }
    g.setLineDash([]);
    g.fillStyle = '#5a3b12'; g.font = font(16, 700, SANS); g.textAlign = 'center'; g.textBaseline = 'middle';
    var ly = (zone === 'bottom') ? C + 104 : C - (z.r0 + z.r1) / 2;
    g.fillText(z.tag, C, ly);
    g.restore();
  }
  function drawParticleSet(g, parts, p) {
    var q = Math.min(p / 0.75, 1);
    var ease = 1 - Math.pow(1 - q, 2);
    var sp = Math.max(0, Math.min(1, (p - 0.6) / 0.4));
    var s = sp * sp * (3 - 2 * sp);
    for (var i = 0; i < parts.length; i++) {
      var o = parts[i];
      var ang = o.a0 + o.w * 7 * ease;
      var rr = o.r0 * (1 + 0.08 * Math.sin(ang * 3 + i));
      var ox = C + Math.cos(ang) * rr, oy = C + Math.sin(ang) * rr;
      var x = ox + (o.tx - ox) * s, y = oy + (o.ty - oy) * s;
      g.fillStyle = o.col;
      g.beginPath(); g.arc(x, y, o.sz, 0, TAU); g.fill();
    }
  }
  function cupOpts() {
    return { liquid: S.settled ? 0 : 1, stains: S.settled ? S.stains : null,
             points: S.settled ? S.points : null, particles: S.settled ? S.particles : null, zone: S.zone };
  }
  function drawCup(o) {
    var g = cg;
    drawCupBase(g);
    if (o.stains) drawStains(g, o.stains);
    drawLiquid(g, o.liquid);
    if (o.points) drawPoints(g, o.points, CUP_OX, CUP_OY, CUP_SC, 0.75, PAL_DARK);
    if (o.particles) drawParticleSet(g, o.particles, 1);
    if (o.zone) drawZone(g, o.zone);
  }

  /* ---------- swirl ---------- */
  var btnSwirl = $('btn-swirl-cup');
  var btnReswirl = $('btn-reswirl');
  var btnAct3 = $('btn-to-act3');
  var zoneBtns = $$('.zone-btn');

  function resetZoneUI() {
    S.zone = null;
    zoneBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.classList.remove('is-on'); });
  }
  function pickTotem() {
    if (S.mode === 'daily') {
      var r = getRng('totem');
      return TOTEM_KEYS[Math.floor(r() * TOTEM_KEYS.length)];
    }
    var k;
    do { k = TOTEM_KEYS[Math.floor(Math.random() * TOTEM_KEYS.length)]; }
    while (k === S.totemKey && TOTEM_KEYS.length > 1);
    return k;
  }
  function buildParticles() {
    var arr = [];
    for (var i = 0; i < 400; i++) {
      var tx, ty;
      if (i < 300) {
        var pt = S.points[Math.floor(Math.random() * S.points.length)];
        tx = CUP_OX + pt.x * CUP_SC; ty = CUP_OY + pt.y * CUP_SC;
      } else {
        var a = Math.random() * TAU, r = 126 + Math.random() * 36;
        tx = C + Math.cos(a) * r; ty = C + Math.sin(a) * r;
      }
      var rnd = Math.random();
      var r0 = 20 + Math.random() * 150;
      arr.push({ a0: Math.random() * TAU, r0: r0, w: (0.7 + Math.random() * 1.0) * (1.2 - r0 / 300),
                 tx: tx, ty: ty, sz: 1.6 + Math.random() * 2,
                 col: rnd < 0.5 ? '#23150e' : (rnd < 0.88 ? '#3d281c' : '#c9a24b') });
    }
    return arr;
  }
  function startSwirl() {
    if (S.swirling) return;
    S.swirling = true; S.settled = false;
    resetZoneUI();
    btnSwirl.disabled = true; btnReswirl.disabled = true; btnAct3.disabled = true;
    zoneBtns.forEach(function (b) { b.disabled = true; });
    S.result = null;
    S.totemKey = pickTotem();
    S.points = genPoints(S.totemKey, 1500);
    S.particles = buildParticles();
    $('totem-name').textContent = '咖啡渣正在沉淀';
    $('totem-read').textContent = '杯中的渣粒正在旋转，请屏住呼吸，等它们落定。';
    $('totem-intent').textContent = '';
    $('totem-luck').textContent = '';
    beep(220, 0.5, 'sine', 0.04);
    var dur = reduced ? 600 : 2200;
    var t0 = performance.now();
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      drawCupBase(cg);
      drawLiquid(cg, 1 - Math.min(1, p / 0.7));
      drawParticleSet(cg, S.particles, p);
      if (p < 1) requestAnimationFrame(frame); else finishSwirl();
    }
    requestAnimationFrame(frame);
  }
  function finishSwirl() {
    S.swirling = false; S.settled = true;
    S.stains = makeStains();
    drawCup(cupOpts());
    var t = TOTEMS[S.totemKey];
    var aff = (t.el === S.sign);
    $('totem-name').textContent = t.name;
    $('totem-read').textContent = t.read;
    $('totem-intent').textContent = '你问的是「' + INTENTS[S.intent].label + '」：' + t.intent[S.intent];
    $('totem-luck').textContent = '杯底气运加成 +' + t.luck + ' · 幸运器物：' + t.item +
      (aff ? ' · 与你的' + SIGNS[S.sign].label + '同频，额外 +2' : '');
    $('zone-reading').innerHTML = '<h3>杯底图腾已显影：' + esc(t.name) + '</h3><p>点选杯沿、杯壁、杯底三个分区，咖啡渣会在对应的圆环上亮起，并给出分区读数。</p>';
    hudTotem.textContent = '杯底图腾 · ' + t.name;
    cupCanvas.setAttribute('aria-label', '杯底咖啡渣沉淀成「' + t.name + '」图腾');
    btnSwirl.disabled = false; btnReswirl.disabled = false; btnAct3.disabled = false;
    zoneBtns.forEach(function (b) { b.disabled = false; });
    openStage(3);
    beep(660, 0.3, 'triangle', 0.05);
    setTimeout(function () { beep(880, 0.35, 'triangle', 0.04); }, 140);
  }
  btnSwirl.addEventListener('click', startSwirl);
  btnReswirl.addEventListener('click', startSwirl);

  var drag = { on: false, x: 0, y: 0, acc: 0 };
  cupCanvas.style.touchAction = 'none';
  cupCanvas.addEventListener('pointerdown', function (e) {
    drag.on = true; drag.x = e.clientX; drag.y = e.clientY; drag.acc = 0;
    try { cupCanvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  cupCanvas.addEventListener('pointermove', function (e) {
    if (!drag.on) return;
    drag.acc += Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
    drag.x = e.clientX; drag.y = e.clientY;
    if (drag.acc > 240 && !S.swirling) { drag.on = false; startSwirl(); }
  });
  function endDrag() { drag.on = false; }
  cupCanvas.addEventListener('pointerup', endDrag);
  cupCanvas.addEventListener('pointercancel', endDrag);

  zoneBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!S.settled) return;
      var z = b.getAttribute('data-zone');
      S.zone = z;
      zoneBtns.forEach(function (x) {
        var on = x === b;
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
        x.classList.toggle('is-on', on);
      });
      drawCup(cupOpts());
      var t = TOTEMS[S.totemKey];
      $('zone-reading').innerHTML = '<h3>' + esc(ZONES[z].label) + '</h3><p>' + esc(t.zones[z]) + '</p>';
      beep(560, 0.15);
    });
  });
  btnAct3.addEventListener('click', function () {
    if (!S.settled) return;
    openStage(3);
    showAct(3);
    beep(330, 0.25, 'triangle');
  });

  /* ---------- stage 3 ---------- */
  var deckEl = $('tarot-deck');
  var BACK_SVG =
    '<svg viewBox="0 0 120 200" width="100%" height="100%" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="3" width="114" height="194" rx="8" fill="#1b1109" stroke="#c9a24b" stroke-width="2"/>' +
    '<rect x="11" y="11" width="98" height="178" rx="5" fill="none" stroke="#c9a24b" stroke-width="1" opacity="0.7"/>' +
    '<circle cx="60" cy="100" r="40" fill="none" stroke="#c9a24b" stroke-width="1.5"/>' +
    '<circle cx="60" cy="100" r="30" fill="none" stroke="#c9a24b" stroke-width="0.8" stroke-dasharray="2 3"/>' +
    '<path d="M60 50 L66 94 L110 100 L66 106 L60 150 L54 106 L10 100 L54 94 Z" fill="#c9a24b" opacity="0.88"/>' +
    '<circle cx="60" cy="100" r="7" fill="#1b1109" stroke="#c9a24b" stroke-width="1.5"/>' +
    '<path d="M24 24 Q60 40 96 24" fill="none" stroke="#c9a24b" stroke-width="1.2"/>' +
    '<path d="M24 176 Q60 160 96 176" fill="none" stroke="#c9a24b" stroke-width="1.2"/>' +
    '<circle cx="20" cy="20" r="3" fill="#c9a24b"/><circle cx="100" cy="20" r="3" fill="#c9a24b"/>' +
    '<circle cx="20" cy="180" r="3" fill="#c9a24b"/><circle cx="100" cy="180" r="3" fill="#c9a24b"/>' +
    '</svg>';

  function makeFate() {
    var rng = getRng('fate');
    var order = shuffled(CARDS, rng);
    return [0, 1, 2].map(function (i) { return { card: order[i], rev: rng() < 0.38 }; });
  }
  function buildDeck() {
    deckEl.innerHTML = '';
    var order = shuffled(CARDS.map(function (c, i) { return i; }), Math.random);
    order.forEach(function (idx, pos) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'deck-card';
      b.setAttribute('aria-label', '第 ' + (pos + 1) + ' 张牌背，点击翻牌');
      b.innerHTML = '<span class="back">' + BACK_SVG + '</span>';
      deckEl.appendChild(b);
    });
  }
  function resetSlots() {
    [0, 1, 2].forEach(function (i) {
      $('slot-' + i).querySelector('.slot-inner').innerHTML = '<div class="slot-empty">待翻牌</div>';
    });
    $('drawn-counter').textContent = '0 / 3';
    $('btn-to-act4').disabled = true;
    $('btn-draw-all').disabled = false;
  }
  function slotReading(slot, card, rev) {
    return card.name + (rev ? '逆位' : '正位') + '：' + (rev ? card.rev : card.up) + '。' +
      INTENTS[S.intent].lens[slot];
  }
  function drawNext(btn) {
    var slot = S.drawn.length;
    if (slot >= 3) return;
    if (!S.fate) S.fate = makeFate();
    var f = S.fate[slot];
    S.drawn.push({ card: f.card, rev: f.rev });
    S.result = null;
    if (btn) {
      btn.disabled = true; btn.classList.add('is-drawn');
      btn.style.opacity = '0.2'; btn.style.pointerEvents = 'none';
    } else {
      var avail = $$('.deck-card:not(.is-drawn)', deckEl);
      if (avail.length) {
        var v = avail[Math.floor(Math.random() * avail.length)];
        v.disabled = true; v.classList.add('is-drawn'); v.style.opacity = '0.2'; v.style.pointerEvents = 'none';
      }
    }
    var inner = $('slot-' + slot).querySelector('.slot-inner');
    inner.innerHTML =
      '<div class="slot-card slot-in"><div class="img-wrap"><img src="' + f.card.img + '" width="460" height="793" alt="1909莱德·伟特塔罗 ' +
      esc(f.card.name) + (f.rev ? '（逆位）' : '（正位）') + '"' + (f.rev ? ' class="is-rev"' : '') + '></div>' +
      '<h4>' + esc(f.card.n + ' ' + f.card.name) + '</h4>' +
      '<span class="orient">' + (f.rev ? '逆位' : '正位') + '</span>' +
      '<p>' + esc(slotReading(slot, f.card, f.rev)) + '</p></div>';
    $('drawn-counter').textContent = S.drawn.length + ' / 3';
    beep(300 + slot * 120, 0.22, 'triangle', 0.05);
    if (S.drawn.length === 3) {
      $('btn-to-act4').disabled = false;
      $('btn-draw-all').disabled = true;
      openStage(4);
      toast('三张牌已全部翻开，可以合成最终神谕');
    }
  }
  deckEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.deck-card') : null;
    if (!b || b.disabled || S.drawn.length >= 3) return;
    drawNext(b);
  });
  $('btn-shuffle').addEventListener('click', function () {
    var cards = $$('.deck-card', deckEl);
    cards.forEach(function (c) { c.classList.add('is-shuffle'); });
    beep(180, 0.3, 'sawtooth', 0.025);
    setTimeout(function () {
      var live = $$('.deck-card', deckEl);
      shuffled(live, Math.random).forEach(function (c) { deckEl.appendChild(c); });
      live.forEach(function (c) { c.classList.remove('is-shuffle'); });
    }, reduced ? 50 : 700);
    if (S.mode === 'free' && S.drawn.length < 3) {
      var used = S.drawn.map(function (d) { return d.card.id; });
      var pool = shuffled(CARDS.filter(function (c) { return used.indexOf(c.id) < 0; }), Math.random);
      for (var i = S.drawn.length; i < 3; i++) {
        S.fate[i] = { card: pool[i - S.drawn.length], rev: Math.random() < 0.38 };
      }
    }
    toast(S.mode === 'daily' ? '牌已洗过，每日灵签的牌运不会改变' : '牌已重新洗切');
  });
  $('btn-draw-all').addEventListener('click', function () {
    var left = 3 - S.drawn.length;
    if (left <= 0) return;
    for (var i = 0; i < left; i++) {
      (function (d) { setTimeout(function () { drawNext(null); }, d); })(reduced ? 0 : i * 320);
    }
  });
  $('btn-to-act4').addEventListener('click', function () {
    if (S.drawn.length < 3) return;
    openStage(4);
    showAct(4);
    beep(440, 0.3, 'triangle');
  });

  /* ---------- stage 4 ---------- */
  function scoreAndRank() {
    var t = TOTEMS[S.totemKey];
    var sum = 0;
    S.drawn.forEach(function (d) { sum += d.card.lk[d.rev ? 1 : 0]; });
    var rng = getRng('score');
    var score = 62 + Math.round((sum - 12) * 1.2) + t.luck + (t.el === S.sign ? 2 : 0) + Math.floor(rng() * 4);
    score = Math.max(62, Math.min(98, score));
    var code = score >= 92 ? 'SSR' : (score >= 84 ? 'SR' : (score >= 75 ? 'A' : 'B'));
    return { score: score, code: code };
  }
  function buildResult() {
    if (!S.totemKey || S.drawn.length < 3) return;
    var t = TOTEMS[S.totemKey];
    var sr = scoreAndRank();
    var rank = RANKS[sr.code];
    var rng = getRng('oracle');
    var cal = CAL[S.intent];
    var res = {
      score: sr.score, code: sr.code, rankName: rank.name,
      cards: S.drawn.map(function (d) { return { card: d.card, rev: d.rev }; }),
      totem: S.totemKey,
      yi: cal.yi[Math.floor(rng() * cal.yi.length)],
      ji: cal.ji[Math.floor(rng() * cal.ji.length)],
      hour: HOURS[Math.floor(rng() * HOURS.length)],
      quote: rank.quotes[Math.floor(rng() * rank.quotes.length)],
      whisper: whisperText(), intent: S.intent, sign: S.sign
    };
    var cipherCode = 'MR' + hashStr(seedKey() + res.score).toString(36).toUpperCase().slice(0, 5);
    res.cipher = '摩伊拉接好运【' + sr.code + '】' + t.name + ' + ' +
      res.cards.map(function (c) { return c.card.name + (c.rev ? '逆' : '正'); }).join(' / ') +
      '，我的今日气运值 ' + sr.score + '，评论区一起接好运，水逆退散！暗号 ' + cipherCode;
    S.result = res;

    $('rank-card').setAttribute('data-rank', sr.code);
    $('rank-name').textContent = rank.name;
    countUp($('final-score'), sr.score);
    countUp(hudScore, sr.score, '气运值 ');

    var mini = $('totem-mini');
    var mg = mini.getContext('2d');
    mg.clearRect(0, 0, 240, 240);
    var bg = mg.createRadialGradient(120, 120, 10, 120, 120, 120);
    bg.addColorStop(0, '#2c1a10'); bg.addColorStop(1, '#150b06');
    mg.fillStyle = bg; mg.beginPath(); mg.arc(120, 120, 118, 0, TAU); mg.fill();
    mg.strokeStyle = '#c9a24b'; mg.lineWidth = 3; mg.beginPath(); mg.arc(120, 120, 116, 0, TAU); mg.stroke();
    mg.strokeStyle = 'rgba(201,162,75,0.4)'; mg.lineWidth = 1; mg.beginPath(); mg.arc(120, 120, 108, 0, TAU); mg.stroke();
    drawPoints(mg, S.points, 120 - 100 * 0.95, 120 - 100 * 0.95, 0.95, 0.8, PAL_LIGHT);
    mg.fillStyle = '#e8c97a'; mg.font = font(16, 700, SERIF); mg.textAlign = 'center'; mg.textBaseline = 'alphabetic';
    mg.fillText(t.name, 120, 226);

    $('strip-cards').innerHTML = res.cards.map(function (c, i) {
      return '<figure class="strip-card"><img src="' + c.card.img + '" width="460" height="793" alt="' +
        esc(SLOT_SHORT[i] + '：' + c.card.name + (c.rev ? '逆位' : '正位')) + '"' + (c.rev ? ' class="is-rev"' : '') + '>' +
        '<figcaption>' + SLOT_SHORT[i] + ' · ' + esc(c.card.name) + (c.rev ? ' 逆' : ' 正') + '</figcaption></figure>';
    }).join('');

    $('oracle-dossier').innerHTML = oracleHTML(res);
    saveHistory(res);
    renderHistory();
    beep(523, 0.3, 'triangle', 0.05);
    setTimeout(function () { beep(659, 0.3, 'triangle', 0.05); }, 150);
    setTimeout(function () { beep(784, 0.45, 'triangle', 0.05); }, 300);
  }
  function countUp(el, target, prefix) {
    prefix = prefix || '';
    if (reduced) { el.textContent = prefix + target; return; }
    var t0 = performance.now(), dur = 900;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function synthLine(cards) {
    var revs = cards.filter(function (c) { return c.rev; });
    if (revs.length === 0) return '三张牌皆为正位，杯底与牌阵同声相应，整体走势顺畅，放手去做即可。';
    if (revs.length === 1) return '唯一的逆位落在「' + revs[0].card.name + '」，杯底图腾指出的那个盲点，多半就藏在这张牌里，先处理它。';
    if (revs.length === 2) return '两张逆位说明阻力不小，但杯底图腾仍然给出了出口，把力气花在「' +
      cards.filter(function (c) { return !c.rev; })[0].card.name + '」所指的方向上。';
    return '三张牌皆为逆位，这是一次让你放慢的提醒，不是判决。杯底图腾给的建议，正是在逆风里最稳的那一步。';
  }
  function oracleHTML(r) {
    var t = TOTEMS[r.totem];
    var I = INTENTS[r.intent];
    var aff = (t.el === r.sign);
    var s1 = '<p>你带着「' + esc(I.label) + '」的执念而来，属' + esc(SIGNS[r.sign].label) + '之人。' +
      esc(SIGNS[r.sign].trait) +
      (r.whisper ? '你写在杯底的那句「' + esc(r.whisper) + '」，已经被咖啡渣记下。' : '你没有在杯底留言，咖啡渣便按你此刻的心念自行成形。') + '</p>' +
      '<p>杯底沉淀出「' + esc(t.name) + '」：' + esc(t.read) + esc(t.intent[r.intent]) +
      (aff ? '图腾的元素与你的' + esc(SIGNS[r.sign].label) + '同频，今日气运额外加成。' : '图腾的元素与你的星象并不同频，反而是在补你缺的那一块。') + '</p>' +
      '<p>' + r.cards.map(function (c, i) {
        return SLOT_SHORT[i] + '是' + esc(c.card.name) + (c.rev ? '逆位' : '正位') + '，指向' + esc(c.rev ? c.card.rev : c.card.up);
      }).join('；') + '。' + esc(synthLine(r.cards)) + '</p>';
    return '<section><h3>杯底图腾与圣三角合参</h3>' + s1 + '</section>' +
      '<section><h3>今日行事历与气运锚点</h3><dl>' +
      '<dt>今日宜</dt><dd>' + esc(r.yi) + '</dd>' +
      '<dt>今日忌</dt><dd>' + esc(r.ji) + '</dd>' +
      '<dt>吉时</dt><dd>' + esc(r.hour) + '</dd>' +
      '<dt>幸运器物</dt><dd>' + esc(t.item) + '</dd></dl></section>' +
      '<section><h3>摩伊拉破局箴言</h3><p class="quote">' + esc(r.quote) + '</p></section>';
  }

  /* ---------- history ---------- */
  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveHistory(res) {
    var key = seedKey();
    var list = loadHistory();
    if (S.mode === 'daily') list = list.filter(function (x) { return x.key !== key; });
    list.unshift({
      key: key, ts: Date.now(), date: dateStr(), score: res.score, code: res.code,
      totem: TOTEMS[res.totem].name, intent: INTENTS[res.intent].short,
      cards: res.cards.map(function (c) { return c.card.name + (c.rev ? '逆' : '正'); })
    });
    list = list.slice(0, 5);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) { /* storage full or blocked */ }
  }
  function renderHistory() {
    var list = loadHistory();
    var ol = $('lb-list');
    if (!list.length) { ol.innerHTML = '<li class="lb-empty">暂无记录，完成一次占卜后会出现在这里。</li>'; return; }
    ol.innerHTML = list.map(function (x) {
      return '<li><b class="lb-score">' + esc(x.score) + '</b> <span class="lb-rank">' + esc(x.code) +
        '</span> <span class="lb-meta">' + esc(x.totem) + ' · ' + esc(x.intent) + ' · ' + esc(x.cards.join(' ')) + ' · ' + esc(x.date) + '</span></li>';
    }).join('');
  }

  /* ---------- poster ---------- */
  var imgCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { resolve(null); };
      im.src = src;
    });
    return imgCache[src];
  }
  function rrect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function renderPoster() {
    var r = S.result;
    if (!r) return Promise.resolve();
    var t = TOTEMS[r.totem];
    var loads = [loadImg(ASSETS.atlas), loadImg(ASSETS.crema)].concat(r.cards.map(function (c) { return loadImg(c.card.img); }));
    return Promise.all(loads).then(function (im) {
      var c = $('card-canvas'), g = c.getContext('2d');
      var W = 720, H = 1040;
      g.clearRect(0, 0, W, H);
      // paper
      var pg = g.createLinearGradient(0, 0, 0, H);
      pg.addColorStop(0, '#f4ead3'); pg.addColorStop(1, '#e8d9b8');
      g.fillStyle = pg; g.fillRect(0, 0, W, H);
      for (var i = 0; i < 1800; i++) {
        g.fillStyle = 'rgba(90,60,30,' + (0.02 + Math.random() * 0.05) + ')';
        g.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
      }
      g.strokeStyle = '#9a7a2e'; g.lineWidth = 3; rrect(g, 14, 14, W - 28, H - 28, 10); g.stroke();
      g.strokeStyle = 'rgba(154,122,46,0.55)'; g.lineWidth = 1; rrect(g, 24, 24, W - 48, H - 48, 6); g.stroke();
      // photo window
      var px = 50, py = 50, pw = 620, ph = 540;
      g.save();
      rrect(g, px, py, pw, ph, 4); g.clip();
      g.fillStyle = '#1b1109'; g.fillRect(px, py, pw, ph);
      if (im[0]) {
        var sc = Math.max(pw / im[0].width, ph / im[0].height);
        g.globalAlpha = 0.4;
        g.drawImage(im[0], px + (pw - im[0].width * sc) / 2, py + (ph - im[0].height * sc) / 2, im[0].width * sc, im[0].height * sc);
      }
      if (im[1]) {
        var sc2 = Math.max(pw / im[1].width, ph / im[1].height);
        g.globalAlpha = 0.16;
        g.drawImage(im[1], px + (pw - im[1].width * sc2) / 2, py + (ph - im[1].height * sc2) / 2, im[1].width * sc2, im[1].height * sc2);
      }
      g.globalAlpha = 1;
      var vg = g.createRadialGradient(W / 2, 330, 80, W / 2, 330, 340);
      vg.addColorStop(0, 'rgba(27,17,9,0.2)'); vg.addColorStop(1, 'rgba(10,5,2,0.8)');
      g.fillStyle = vg; g.fillRect(px, py, pw, ph);
      g.strokeStyle = 'rgba(201,162,75,0.7)'; g.lineWidth = 2;
      g.beginPath(); g.arc(W / 2, 335, 200, 0, TAU); g.stroke();
      g.strokeStyle = 'rgba(201,162,75,0.35)'; g.lineWidth = 1;
      g.beginPath(); g.arc(W / 2, 335, 214, 0, TAU); g.stroke();
      drawPoints(g, S.points, W / 2 - 100 * 1.7, 335 - 100 * 1.7, 1.7, 1.5, PAL_LIGHT);
      g.fillStyle = '#e8c97a'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      g.font = font(40, 700, SERIF); g.fillText(r.rankName, W / 2, 112);
      g.font = font(18, 400, SERIF); g.fillStyle = '#d9c9a0';
      g.fillText('摩伊拉咖啡馆 · 1909占卜卷宗', W / 2, 142);
      g.font = font(24, 700, SERIF); g.fillStyle = '#f1e2c0';
      g.fillText('杯底图腾：' + t.name, W / 2, 556);
      g.font = font(18, 400, SERIF); g.fillStyle = '#c9a24b';
      g.textAlign = 'right'; g.fillText('气运值 ' + r.score + ' / 100', px + pw - 18, py + 28);
      g.restore();
      // cards
      var cw = 141, ch = 244, gap = 30, sx = (W - (cw * 3 + gap * 2)) / 2, cy = 614;
      r.cards.forEach(function (cd, k) {
        var x = sx + k * (cw + gap);
        g.save();
        g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
        g.fillStyle = '#fffaf0'; g.fillRect(x - 4, cy - 4, cw + 8, ch + 8);
        g.restore();
        var img = im[2 + k];
        if (img) {
          g.save();
          g.translate(x + cw / 2, cy + ch / 2);
          if (cd.rev) g.rotate(Math.PI);
          g.drawImage(img, -cw / 2, -ch / 2, cw, ch);
          g.restore();
        } else {
          g.fillStyle = '#2a1a10'; g.fillRect(x, cy, cw, ch);
        }
        g.fillStyle = '#2a1a10'; g.font = font(16, 700, SERIF); g.textAlign = 'center';
        g.fillText(SLOT_SHORT[k] + ' · ' + cd.card.name + (cd.rev ? '逆' : '正'), x + cw / 2, cy + ch + 28);
      });
      // caption
      g.fillStyle = '#2a1a10'; g.textAlign = 'center';
      g.font = font(24, 700, SERIF);
      g.fillText('「' + INTENTS[r.intent].label + '」 · ' + SIGNS[r.sign].label, W / 2, 928, 620);
      g.font = font(20, 400, SERIF); g.fillStyle = '#5a3b12';
      var line = r.whisper ? '杯底留言：' + r.whisper : r.quote;
      g.fillText(line, W / 2, 966, 620);
      g.font = font(16, 400, SANS); g.fillStyle = '#7a6a4a';
      g.fillText('摩伊拉咖啡馆 · ' + dateStr() + ' · 仅供娱乐', W / 2, 1002);
      try { S.cardURL = c.toDataURL('image/png'); } catch (e) { S.cardURL = null; }
    });
  }

  var modal = $('card-modal');
  var lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    $('btn-close-modal').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('btn-save-card').addEventListener('click', function () {
    if (!S.result) return;
    $('modal-note').textContent = '正在绘制灵签……';
    openModal();
    renderPoster().then(function () {
      $('modal-note').textContent = S.cardURL ? '灵签已生成，可以下载保存。' : '灵签已生成，当前浏览器限制了直接下载，请截图保存。';
      beep(700, 0.3, 'triangle', 0.05);
    });
  });
  $('btn-download-card').addEventListener('click', function () {
    if (!S.cardURL) { toast('请截图保存这张灵签'); return; }
    var a = document.createElement('a');
    a.href = S.cardURL;
    a.download = 'moirae-oracle-card-' + dateStr() + '.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('灵签图片已开始下载');
  });
  $('btn-close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ---------- copy ---------- */
  $('btn-copy-comment').addEventListener('click', function () {
    if (!S.result) return;
    var text = S.result.cipher;
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? '暗号已复制，去评论区接好运吧' : '复制失败，请手动复制：' + text);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('暗号已复制，去评论区接好运吧');
      }, fallback);
    } else { fallback(); }
  });

  /* ---------- reset / restart ---------- */
  function resetReading() {
    S.totemKey = null; S.points = null; S.particles = null; S.stains = null;
    S.settled = false; S.swirling = false; S.zone = null;
    S.fate = null; S.drawn = []; S.result = null; S.cardURL = null;
    S.reached = 1;
    resetZoneUI();
    zoneBtns.forEach(function (b) { b.disabled = true; });
    btnReswirl.disabled = true; btnSwirl.disabled = false; btnAct3.disabled = true;
    $('totem-name').textContent = '图腾待显影';
    $('totem-read').textContent = '倾倒咖啡并凝视杯底，或在杯面上按住拖动，等待咖啡渣沉淀成形。';
    $('totem-intent').textContent = '';
    $('totem-luck').textContent = '';
    $('zone-reading').innerHTML = '<h3>分区读数</h3><p>杯底显影之后，点选上方三个分区，咖啡渣会在对应的圆环上亮起。</p>';
    cupCanvas.setAttribute('aria-label', '俯视的土耳其骨瓷咖啡杯，杯底有咖啡渣');
    hudTotem.textContent = '杯底图腾 · 待显影';
    hudScore.textContent = '气运值 0';
    buildDeck();
    resetSlots();
    $('final-score').textContent = '0';
    $('oracle-dossier').innerHTML = '';
    $('strip-cards').innerHTML = '';
    drawCup(cupOpts());
  }
  $('btn-restart').addEventListener('click', function () {
    resetReading();
    S.key = null;
    $('whisper-input').value = '';
    updateStartHint();
    if (modal.classList.contains('is-open')) closeModal();
    showAct(1);
    toast('已重置，换个问题再占一次');
  });

  /* ---------- jump bar & sound ---------- */
  jumps.forEach(function (b) {
    b.addEventListener('click', function () {
      var n = parseInt(b.getAttribute('data-jump'), 10);
      if (n > S.reached) return;
      if (n === 2 && !S.key) { S.key = seedKey(); S.fate = makeFate(); }
      showAct(n);
    });
  });
  $('btn-sound').addEventListener('click', function () {
    S.sound = !S.sound;
    this.textContent = S.sound ? '声音：开' : '声音：关';
    this.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
    if (S.sound) beep(600, 0.15);
  });

  /* ---------- init ---------- */
  selectInGroup('.intent-btn', 'data-intent', S.intent);
  selectInGroup('.sign-btn', 'data-sign', S.sign);
  updateStartHint();
  buildDeck();
  resetSlots();
  renderHistory();
  drawCup({ liquid: 1 });
  showAct(1);
  window.scrollTo(0, 0);

  // preload every bundled plate so the oracle card and strip render instantly
  var preload = [ASSETS.atlas, ASSETS.cup, ASSETS.crema].concat(CARDS.map(function (c) { return c.img; }));
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 600); };
  idle(function () { preload.forEach(loadImg); });
})();
