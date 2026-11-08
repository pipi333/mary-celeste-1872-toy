/* 1872 Mary Celeste — six-act interactive state machine. Plain JS, no external deps. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Content (mirrors content/toy_creative_spec.json)
   * ------------------------------------------------------------------ */
  var SPEC = {
    acts: {
      1: {
        code: 'ABNORMAL_ANCHOR',
        title: '第一幕 · 反常锚点：时间凝固的船长室',
        subtitle: '1872年12月4日 · 大西洋亚速尔群岛以东400海里',
        hook: '你作为大英帝国直布罗陀海事法庭特派勘查官，刚刚踏上这艘在北大西洋独自劈浪漂流的双桅商船「玛丽·赛勒斯特号」。船上没有一具尸体，没有一滴搏斗血迹，1701桶高纯度工业酒精原封未动——但船长本杰明、船长妻女与7名船员（全船共10人），在400海里外的狂风中人间蒸发。',
        interrupt: '等等不对劲！如果是一场仓促逃命的灾难，为什么船长夫人缝纫机上的童装还差最后一针？为什么厨房炉火刚熄，餐盘上还留着没吃完的早餐？'
      },
      2: {
        code: 'SENSORY_INSPECTION',
        title: '第二幕 · 感官勘查：35mm拍立得物证悬浮台',
        subtitle: '切换【黄色荧光标注刷】与【手绘红圈取证笔】，找齐5件核心物证的反常死穴'
      },
      3: {
        code: 'INTUITION_TRAP',
        title: '第三幕 · 直觉诱捕：直布罗陀海事庭审博弈',
        subtitle: '先顺应常识建楼，再用反常死穴一锤定向砸碎'
      },
      4: {
        code: 'GHOST_CLUE',
        title: '第四幕 · 幽灵线索：为什么火光冲天却没有半点烧焦痕迹？',
        subtitle: '连接『9桶红橡木』『掀开的舱盖』与『崩断的主帆缭绳』三条证据链',
        mechanism: '玩家在勘查台上将【物证 #05 红橡木渗漏】+【物证 #04 崩断的主帆缭绳】进行交叉比对，解锁伦敦大学学院（UCL）热力学冷焰公式。'
      },
      5: {
        code: 'PHYSICAL_RECONSTRUCTION',
        title: '第五幕 · 物理还原：0.72秒核弹级死寂与冷焰闪爆实验',
        subtitle: '1872年11月25日 08:12–08:15 · 致命的3分钟'
      },
      6: {
        code: 'FATE_ECHO',
        title: '第六幕 · 宿命回响：最理性的父爱，最残酷的深海',
        subtitle: '物理真相 × 人性悲剧的哲学终局',
        epilogue: '如果本杰明船长是个鲁莽的赌徒，他或许会留在甲板上看一眼货舱——那样他就会发现火已经灭了，全船10人都会平安抵达热那亚。但正因为他是一位极其负责的船长、一位绝不敢拿2岁女儿生命赌万分之一的父亲，他做出了当时最理性的决定：全员登上救生艇，用一根最结实的麻绳系在船尾，等大船不炸再爬回来。几分钟后，北大西洋的阵风鼓满大船风帆，咔嚓一声扯断了那根麻绳。空无一人的玛丽·赛勒斯特号以两倍于划桨的速度绝尘而去，留给那叶孤舟的，只有永远追不上的背影。'
      }
    },
    cards: [
      {
        id: 'ev-logbook', icon: '📖', angle: -2.8, type: 'yellow_fluo',
        name: '物证 #01 · 船长航海日志残页',
        camera: '35mm f/2.8 微距静帧 · 羊皮纸纤维剖面',
        fact: '最后一条记录停留在11月25日清晨8点，字迹工整平稳：『圣玛丽亚岛位于正东偏南6海里，风力温和。』',
        target: '11月15日至25日连续10天风平浪静，字迹毫无颤抖',
        deduction: '直到弃船最后一刻，船上根本没有发生过持续性的暴乱或风暴恐慌！凶手在几分钟内突然降临。',
        sound: 'clue_crystal_ding'
      },
      {
        id: 'ev-sword', icon: '🗡️', angle: 4.1, type: 'red_circle',
        name: '物证 #02 · 床铺下的斑驳意大利长剑',
        camera: '35mm f/4.0 侧逆光微距 · 金属氧化层断层剖面',
        fact: '直布罗陀检察官弗拉德声称在船长床下搜出这把带有『暗红色血迹』的长剑，指控船员杀害船长全家。',
        target: '显微镜化学反应报告：柠檬汁擦拭后的氧化铁红锈与松木油脂，0%人血血红蛋白',
        deduction: '所谓『血剑』是检察官为了吞没高额海难救助金而强行附会的假证据！全船没有任何暴力流血痕迹。',
        sound: 'clue_crystal_ding'
      },
      {
        id: 'ev-hull-cuts', icon: '🪵', angle: -2.5, type: 'red_circle',
        name: '物证 #03 · 船首两侧对称的V型木屑切口',
        camera: '35mm f/5.6 广角近摄 · 橡木船壳纹理',
        fact: '检方宣称这是海盗登船前故意凿船制造海难假象的凿痕，长约2米、深约1厘米。',
        target: '切口严格对称分布在吃水线上方同一水平面，呈自然波浪剥离状',
        deduction: '木船专家证实：这只是北美新斯科舍白松木在重载劈浪时完全正常的木材开裂剥落，绝非人为斧凿！',
        sound: 'clue_crystal_ding'
      },
      {
        id: 'ev-Navigation', icon: '🧭', angle: 3.6, type: 'yellow_fluo',
        name: '物证 #04 · 被带走的六分仪与断裂的主帆缭绳',
        camera: '35mm f/2.0 浅景深微距 · 麻绳纤维断裂面',
        fact: '船长室里价值连城的怀表、珠宝、现金袋分文未动，唯独体积笨重的航海六分仪、航海天文钟与船籍证书消失了；船尾栏杆留有一根崩断的主帆粗麻绳。',
        target: '六分仪+天文钟带走，金表珠宝留下；栏杆麻绳末端纤维呈极度紧绷拉断状',
        deduction: '海盗绝不会不要黄金只要六分仪！带走导航仪器的只有船长本人——而且他们登上救生艇后，曾死死用这根缆绳拴住大船，根本不想离开玛丽·赛勒斯特号！',
        sound: 'clue_crystal_ding'
      },
      {
        id: 'ev-barrels', icon: '🛢️', angle: -2.6, type: 'red_circle',
        name: '物证 #05 · 货舱深处9桶空置的红橡木桶',
        camera: '35mm f/2.8 暗光微距 · 红橡木气孔与白橡木对比剖面',
        fact: '底舱满载1701桶高浓度工业变性酒精（不可饮用），清点后发现有1692桶完好无损，唯独9桶完全空置，且舱盖被掀开。',
        target: '1692桶为致密白橡木，唯独空掉的9桶是质地疏松多孔的红橡木，且船体刚从寒冷纽约驶入温暖亚速尔海域',
        deduction: '这就是全案唯一的幽灵线索！多孔红橡木在温差骤升下疯狂渗漏高挥发酒精，使密闭货舱变成了随时引爆的巨型气溶胶炸弹！',
        sound: 'clue_crystal_ding'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-pirates', trap: true, counter: 'ev-Navigation', counterLabel: '物证 #04',
        title: '假说 A：摩洛哥海盗劫船屠杀',
        pitch: '1872年亚速尔至直布罗陀航线海盗猖獗，海盗登船绑架全体船员勒索赎金或将其抛入大海。',
        verdict: '【一锤砸碎 · 铁门闭锁】哪门子海盗放着满船1701桶高价货、船长夫人的黄金首饰和现金袋一分不拿，专门偷走只有专业船长才用得上的六分仪和航海日志？常识假说当场崩塌！'
      },
      {
        id: 'hyp-mutiny', trap: true, counter: 'ev-sword', counterLabel: '物证 #02',
        title: '假说 B：水手偷喝酒精买醉哗变',
        pitch: '水手撬开那9桶空酒桶狂饮烂醉，失手杀死严厉的本杰明船长一家，随后乘救生艇畏罪潜逃。',
        verdict: '【一锤砸碎 · 铁门闭锁】第一，船上装的是掺了甲醇剧毒的工业变性酒精，喝一口就会失明呕吐；第二，『血剑』经化验全是铁锈与柠檬汁；第三，船员连自己的烟斗和油布雨衣都没拿！哗变说彻底破产！'
      },
      {
        id: 'hyp-insurance', trap: true, counter: 'ev-logbook', counterLabel: '物证 #01',
        title: '假说 C：船长与货主串通骗保',
        pitch: '本杰明船长因投资亏损，故意在公海伪造弃船假象，勾结打捞船骗取巨额海事保险金。',
        verdict: '【一锤砸碎 · 铁门闭锁】骗保的前提是人活着去领钱！本杰明船长本人持有该船三分之一股份，还带着自己深爱的妻子和年仅2岁的幼女索菲亚同船，没有任何一个父亲会拿2岁女儿的性命在狂风大西洋里坐无篷小舢板骗保！'
      },
      {
        id: 'hyp-cold-flame', trap: false, counter: 'ev-barrels', counterLabel: '物证 #05',
        title: '假说 D：多孔红橡木酒精渗漏 + 温差冷焰闪爆诱发『暂时避险』',
        pitch: '9桶红橡木渗出的酒精在底舱形成高浓度可燃蒸汽，打开舱盖换气瞬间摩擦引燃『低温冷焰闪爆』，船长误以为整船1700桶酒精即将连环殉爆，下令全员坐救生艇借主帆缭绳拖行暂避，不料暴风骤起扯断麻绳。',
        verdict: '【真相锁定 · 晶体共鸣】伦敦大学学院（UCL）化学系安德烈亚·塞拉教授通过等比例纸板舱室复刻实验证实：乙醇蒸汽在特定浓度下会发生剧烈喷发却温度极低的『冷焰闪爆（Cool Flame）』——火光冲天、气浪震耳，却连一张纸都不会烤焦！'
      }
    ],
    steps: [
      '08:05 船只驶入亚速尔温暖海域，底舱9桶红橡木渗出的数加仑乙醇迅速气化，膨胀顶松舱盖。',
      '08:12 船长下令掀开主舱盖排散刺鼻酒气，新鲜氧气涌入，乙醇蒸汽浓度精准落入 3.3%~19% 爆炸极限。',
      '08:14 【死寂留白 0.72秒：海浪声归零，仅剩心脏搏动与麻绳紧绷声】',
      '08:15 舱口铁环轻微摩擦产生静电火花——轰！数米高的幽蓝色冷焰从底舱喷涌而出，气浪掀翻舱盖，但因为乙醇蒸汽极快燃尽且热容极低，船木连一丝焦黑都没留下！'
    ],
    ranks: [
      {
        min: 90, letter: 'S+', badge: 'S+ · 皇家海事首席断案官', title: '识破0.1%幽灵线索的福尔摩斯',
        comment: '【皇家断案官S+】我只用一次勘查就锁定了第9桶红橡木的冷焰死穴！最刀的不是幽灵船，是那根被大船扯断的麻绳……'
      },
      {
        min: 70, letter: 'A', badge: 'A · 苏格兰场资深勘查员', title: '看穿血剑伪证的冷静推理者',
        comment: '【苏格兰场A级】差点信了水手买醉哗变，直到用荧光刷扫出红橡木气孔！这期互动卷宗太顶了！'
      },
      {
        min: 0, letter: 'B', badge: 'B · 1872直布罗陀陪审团成员', title: '被常识假说诱捕的温柔旁观者',
        comment: '【陪审团B级】我承认第一眼我也投了海盗劫船，结果被六分仪当场打脸！做完实验汗毛都立起来了！'
      }
    ],
    DEAD_SILENCE_MS: 720
  };

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */
  var state = {
    act: 1,
    maxAct: 1,
    tool: 'yellow_fluo',
    found: {},          // card id -> 'manual' | 'auto'
    foundCount: 0,
    wrong: {},          // hypothesis id -> true
    wrongCount: 0,
    truth: false,
    picked: null,       // first picked chain node
    link1: false,
    link2: false,
    formula: false,
    flashing: false,
    flashed: false,
    score: 0,
    rank: null,
    settled: false,
    savedCloud: false,
    savedScore: false,
    soundOn: true
  };

  /* ------------------------------------------------------------------ *
   * DOM helpers
   * ------------------------------------------------------------------ */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function setText(id, text) { var n = $(id); if (n) n.textContent = text; }
  function cardById(id) {
    for (var i = 0; i < SPEC.cards.length; i++) if (SPEC.cards[i].id === id) return SPEC.cards[i];
    return null;
  }

  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 2200);
  }

  /* ------------------------------------------------------------------ *
   * Web Audio procedural synthesizer
   * ------------------------------------------------------------------ */
  var Audio = (function () {
    var ctx = null, master = null, bgm = null, reverb = null, noiseBuf = null, bgmOn = false;

    function ensure() {
      if (!state.soundOn) return null;
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { ctx = null; return null; }
        var comp = ctx.createDynamicsCompressor();
        master = ctx.createGain();
        master.gain.value = 0.8;
        master.connect(comp);
        comp.connect(ctx.destination);
        // metallic reverb: feedback delay with a darkening filter
        reverb = ctx.createGain();
        var dly = ctx.createDelay(0.5), fb = ctx.createGain(), lp = ctx.createBiquadFilter();
        dly.delayTime.value = 0.093; fb.gain.value = 0.45; lp.type = 'lowpass'; lp.frequency.value = 2600;
        reverb.connect(dly); dly.connect(lp); lp.connect(fb); fb.connect(dly); lp.connect(master);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        var d = noiseBuf.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended' && ctx.resume) { try { ctx.resume(); } catch (e) { /* ignore */ } }
      return ctx;
    }

    function noise(t, dur) {
      var s = ctx.createBufferSource();
      s.buffer = noiseBuf; s.loop = true;
      s.start(t); s.stop(t + dur + 0.05);
      return s;
    }
    function env(g, t, peak, attack, dur) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    }
    function osc(type, freq, t, dur) {
      var o = ctx.createOscillator();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      o.start(t); o.stop(t + dur + 0.05);
      return o;
    }

    var sounds = {
      // low-frequency sea breeze: white noise filtered at 180Hz
      comma_breath: function (t) {
        var n = noise(t, 1.8), f = ctx.createBiquadFilter(), g = ctx.createGain();
        f.type = 'lowpass'; f.frequency.value = 180; f.Q.value = 0.8;
        env(g, t, 1.6, 0.7, 1.8);
        n.connect(f); f.connect(g); g.connect(master);
      },
      // suspense cello harmonics gliding 220Hz -> 196Hz
      question_suspense: function (t) {
        var g = ctx.createGain(), f = ctx.createBiquadFilter(), lfo = osc('sine', 5.5, t, 1.9), lg = ctx.createGain();
        f.type = 'lowpass'; f.frequency.value = 1400;
        env(g, t, 0.28, 0.35, 1.9);
        lg.gain.value = 3; lfo.connect(lg);
        [[1, 'sawtooth', 0.6], [2, 'triangle', 0.3], [3, 'sine', 0.15]].forEach(function (h) {
          var o = osc(h[1], 220 * h[0], t, 1.9), hg = ctx.createGain();
          o.frequency.exponentialRampToValueAtTime(196 * h[0], t + 1.4);
          lg.connect(o.frequency);
          hg.gain.value = h[2];
          o.connect(hg); hg.connect(f);
        });
        f.connect(g); g.connect(master);
      },
      // crystal ding: 2400Hz + 3600Hz sine overtones with decay
      clue_crystal_ding: function (t) {
        [[2400, 0.2, 1.3], [3600, 0.1, 0.9], [4800, 0.03, 0.5]].forEach(function (p) {
          var o = osc('sine', p[0], t, p[2]), g = ctx.createGain();
          env(g, t, p[1], 0.005, p[2]);
          o.connect(g); g.connect(master);
        });
      },
      // iron door slam: 85Hz impact + metallic tail through the reverb
      reversal_iron_lock: function (t) {
        var o = osc('sine', 85, t, 0.7), g = ctx.createGain();
        o.frequency.exponentialRampToValueAtTime(48, t + 0.5);
        env(g, t, 1.0, 0.004, 0.7);
        o.connect(g); g.connect(master);
        var n = noise(t, 0.16), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
        bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 6;
        env(ng, t, 0.5, 0.003, 0.16);
        n.connect(bp); bp.connect(ng); ng.connect(master); ng.connect(reverb);
        [330, 523, 877].forEach(function (fq) {
          var m = osc('square', fq, t, 0.9), mg = ctx.createGain();
          env(mg, t, 0.04, 0.003, 0.9);
          m.connect(mg); mg.connect(master); mg.connect(reverb);
        });
      },
      // cut BGM to 0 and leave only a faint straining-rope creak
      dead_silence: function (t) {
        if (bgm) { bgm.gain.cancelScheduledValues(t); bgm.gain.setTargetAtTime(0, t, 0.008); }
        var dur = SPEC.DEAD_SILENCE_MS / 1000;
        var n = noise(t, dur), bp = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = osc('sine', 9, t, dur), lg = ctx.createGain();
        bp.type = 'bandpass'; bp.frequency.value = 3400; bp.Q.value = 14;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.012, t + dur * 0.8);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        lg.gain.value = 500; lfo.connect(lg); lg.connect(bp.frequency);
        n.connect(bp); bp.connect(g); g.connect(master);
      },
      // cool flame detonation: whoosh sweep + sub boom
      cool_flash: function (t) {
        var n = noise(t, 1.4), f = ctx.createBiquadFilter(), g = ctx.createGain();
        f.type = 'lowpass'; f.frequency.setValueAtTime(5000, t);
        f.frequency.exponentialRampToValueAtTime(200, t + 1.3);
        env(g, t, 1.3, 0.01, 1.4);
        n.connect(f); f.connect(g); g.connect(master); g.connect(reverb);
        var o = osc('sine', 62, t, 1.2), og = ctx.createGain();
        o.frequency.exponentialRampToValueAtTime(34, t + 1.0);
        env(og, t, 1.0, 0.01, 1.2);
        o.connect(og); og.connect(master);
        var s = osc('sine', 2400, t, 0.9), sg = ctx.createGain();
        env(sg, t, 0.12, 0.005, 0.9);
        s.connect(sg); sg.connect(master);
      }
    };

    function startBgm() {
      if (bgmOn || !ctx) return;
      bgmOn = true;
      bgm = ctx.createGain(); bgm.gain.value = 0.06;
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260;
      [55, 82.41, 110.3].forEach(function (fq) {
        var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fq; o.start();
        o.connect(f);
      });
      f.connect(bgm); bgm.connect(master);
    }

    return {
      play: function (name) {
        if (!ensure()) return;
        startBgm();
        if (sounds[name]) {
          try { sounds[name](ctx.currentTime + 0.005); } catch (e) { /* audio is best effort */ }
        }
      },
      restoreBgm: function () {
        if (bgm && ctx) bgm.gain.setTargetAtTime(state.soundOn ? 0.06 : 0, ctx.currentTime, 0.4);
      },
      mute: function (off) {
        if (!ctx || !master) return;
        master.gain.setTargetAtTime(off ? 0 : 0.8, ctx.currentTime, 0.02);
      },
      enable: function () {
        if (ctx && master) master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.02);
      }
    };
  })();

  function play(name) { Audio.play(name); }

  /* ------------------------------------------------------------------ *
   * HUD + navigation
   * ------------------------------------------------------------------ */
  function renderHud() {
    setText('hud-act', '第 ' + state.act + ' 幕 / 6');
    setText('hud-evidence', '物证 ' + state.foundCount + ' / 5');
    setText('hud-score', '推理值 ' + currentScore());
    var jumps = document.querySelectorAll('.jump');
    for (var i = 0; i < jumps.length; i++) {
      var n = Number(jumps[i].getAttribute('data-jump'));
      jumps[i].disabled = n > state.maxAct;
      jumps[i].classList.toggle('is-current', n === state.act);
      jumps[i].classList.toggle('is-done', n < state.act && n <= state.maxAct);
      if (n === state.act) jumps[i].setAttribute('aria-current', 'step'); else jumps[i].removeAttribute('aria-current');
    }
  }

  function currentScore() {
    var s = 0, id;
    for (id in state.found) {
      if (Object.prototype.hasOwnProperty.call(state.found, id)) s += state.found[id] === 'manual' ? 8 : 5;
    }
    if (state.truth) s += Math.max(0, 30 - state.wrongCount * 8);
    if (state.formula) s += 15;
    if (state.flashed) s += 15;
    return Math.min(100, s);
  }

  function showAct(n, opts) {
    if (n < 1 || n > 6 || n > state.maxAct) return;
    if (state.flashing) return;
    state.act = n;
    for (var i = 1; i <= 6; i++) {
      var s = $('act-' + i);
      var on = i === n;
      s.hidden = !on;
      s.classList.toggle('is-active', on);
    }
    renderHud();
    window.scrollTo(0, 0);
    if (!opts || !opts.silent) play(n === 3 ? 'question_suspense' : 'comma_breath');
    if (n === 6) enterAct6();
  }

  function advance(n) {
    if (n > state.maxAct) state.maxAct = n;
    showAct(n);
  }

  /* ------------------------------------------------------------------ *
   * Act 1
   * ------------------------------------------------------------------ */
  var act1Timer = 0;
  function initAct1() {
    var a = SPEC.acts[1];
    setText('act1-code', a.code);
    setText('act1-title', a.title);
    setText('act1-sub', a.subtitle);
    setText('act1-hook', a.hook);
    setText('act1-interrupt', a.interrupt);
    act1Timer = setTimeout(revealInterrupt, 2400);
    $('btn-to-act2').addEventListener('click', function () {
      revealInterrupt();
      advance(2);
    });
  }
  function revealInterrupt() {
    clearTimeout(act1Timer);
    var i = $('act1-interrupt');
    if (!i.hidden) return;
    i.hidden = false;
    $('anomaly-list').hidden = false;
    play('question_suspense');
  }

  /* ------------------------------------------------------------------ *
   * Act 2 — Polaroid evidence table
   * ------------------------------------------------------------------ */
  function buildCard(c) {
    var b = el('button', 'polaroid');
    b.type = 'button';
    b.setAttribute('data-id', c.id);
    b.style.setProperty('--tilt', c.angle + 'deg');
    b.setAttribute('aria-label', c.name + '，点击勘查');

    var photo = el('span', 'photo');
    photo.appendChild(el('span', 'photo-icon', c.icon));
    photo.appendChild(el('span', 'photo-spec', c.camera));
    var cap = el('span', 'cap');
    cap.appendChild(el('span', 'cap-name', c.name));
    cap.appendChild(el('span', 'cap-fact', c.fact));
    var tgt = el('span', 'target', c.target);
    tgt.id = 'target-' + c.id;
    cap.appendChild(tgt);
    var ded = el('span', 'deduction', c.deduction);
    ded.id = 'ded-' + c.id;
    ded.hidden = true;
    cap.appendChild(ded);
    b.appendChild(photo);
    b.appendChild(cap);
    b.addEventListener('click', function () { inspect(c.id, 'manual'); });
    return b;
  }

  function circleSvg() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'circle-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var e = document.createElementNS(ns, 'ellipse');
    e.setAttribute('cx', '50'); e.setAttribute('cy', '50');
    e.setAttribute('rx', '48'); e.setAttribute('ry', '46');
    e.setAttribute('pathLength', '1');
    e.setAttribute('transform', 'rotate(-4 50 50)');
    svg.appendChild(e);
    return svg;
  }

  function setTool(type) {
    state.tool = type;
    var fluo = type === 'yellow_fluo';
    $('tool-fluo').classList.toggle('is-selected', fluo);
    $('tool-fluo').setAttribute('aria-pressed', String(fluo));
    $('tool-circle').classList.toggle('is-selected', !fluo);
    $('tool-circle').setAttribute('aria-pressed', String(!fluo));
    setText('tool-hint', fluo ? '当前工具：黄色荧光标注刷 —— 扫过反常文字。' : '当前工具：手绘红圈取证笔 —— 圈出致命破绽。');
  }

  function inspect(id, mode) {
    var c = cardById(id);
    if (!c || state.found[id]) return;
    state.found[id] = mode;
    state.foundCount++;

    // the pen the card demands is selected automatically
    setTool(c.type);

    var card = document.querySelector('.polaroid[data-id="' + id + '"]');
    var tgt = $('target-' + id);
    var wrap = el('span', c.type === 'yellow_fluo' ? 'hl-fluo' : 'hl-circle', c.target);
    if (c.type === 'red_circle') wrap.appendChild(circleSvg());
    tgt.textContent = '';
    tgt.appendChild(wrap);
    $('ded-' + id).hidden = false;
    card.classList.add('is-done');
    card.setAttribute('aria-label', c.name + '，已取证');

    play(c.sound);
    updateEvidenceUi();
    if (mode === 'manual') toast(c.name.split(' · ')[0] + ' 已取证');
  }

  function updateEvidenceUi() {
    setText('evidence-counter', state.foundCount + ' / 5');
    var done = state.foundCount >= 5;
    $('btn-to-act3').disabled = !done;
    $('btn-inspect-all').disabled = done;
    if (done) setText('tool-hint', '5 件物证全部取证，法庭已开庭。');
    renderHud();
  }

  function inspectAll() {
    var pending = SPEC.cards.filter(function (c) { return !state.found[c.id]; });
    $('btn-inspect-all').disabled = true;
    pending.forEach(function (c, i) {
      setTimeout(function () { inspect(c.id, 'auto'); }, i * 280);
    });
  }

  function initAct2() {
    var a = SPEC.acts[2];
    setText('act2-code', a.code);
    setText('act2-title', a.title);
    setText('act2-sub', a.subtitle);
    var grid = $('evidence-grid');
    SPEC.cards.forEach(function (c) { grid.appendChild(buildCard(c)); });
    $('tool-fluo').addEventListener('click', function () { setTool('yellow_fluo'); });
    $('tool-circle').addEventListener('click', function () { setTool('red_circle'); });
    $('btn-inspect-all').addEventListener('click', inspectAll);
    $('btn-to-act3').addEventListener('click', function () { advance(3); });
    updateEvidenceUi();
  }

  /* ------------------------------------------------------------------ *
   * Act 3 — Intuition Trap courtroom
   * ------------------------------------------------------------------ */
  function buildHyp(h) {
    var b = el('button', 'hyp');
    b.type = 'button';
    b.setAttribute('data-id', h.id);
    b.appendChild(el('span', 'hyp-title', h.title));
    b.appendChild(el('span', 'hyp-pitch', h.pitch));
    b.addEventListener('click', function () { pickHypothesis(h, b); });
    b.firstChild.style.display = 'block';
    b.lastChild.style.display = 'block';
    return b;
  }

  function pickHypothesis(h, node) {
    if (node.classList.contains('is-locked')) return;
    var ev = cardById(h.counter);
    var v = el('span', 'verdict', h.verdict + '　（反证：' + h.counterLabel + ' · ' + ev.name.split(' · ')[1] + '）');
    v.style.display = 'block';
    node.appendChild(v);
    node.classList.add('is-locked');
    node.setAttribute('aria-disabled', 'true');
    if (h.trap) {
      node.classList.add('is-broken', 'slam');
      state.wrong[h.id] = true;
      state.wrongCount++;
      play('reversal_iron_lock');
      toast('假说被一锤砸碎 · 推理值 -8');
    } else {
      node.classList.add('is-truth');
      state.truth = true;
      play('reversal_iron_lock');
      setTimeout(function () { play('clue_crystal_ding'); }, 380);
      $('btn-to-act4').disabled = false;
      toast('真相锁定');
    }
    renderHud();
  }

  function initAct3() {
    var a = SPEC.acts[3];
    setText('act3-code', a.code);
    setText('act3-title', a.title);
    setText('act3-sub', a.subtitle);
    var list = $('hyp-list');
    SPEC.hypotheses.forEach(function (h) { list.appendChild(buildHyp(h)); });
    $('btn-to-act4').addEventListener('click', function () { advance(4); });
  }

  /* ------------------------------------------------------------------ *
   * Act 4 — evidence chain linker + UCL formula
   * ------------------------------------------------------------------ */
  var NODES = ['barrels', 'hatch', 'rope'];

  function renderChain() {
    $('link-1').classList.toggle('is-on', state.link1);
    $('link-2').classList.toggle('is-on', state.link2);
    NODES.forEach(function (n, i) {
      var node = $('node-' + n);
      var linked = (i === 0 && state.link1) || (i === 1 && (state.link1 || state.link2)) || (i === 2 && state.link2);
      node.classList.toggle('is-linked', linked);
      node.classList.toggle('is-picked', state.picked === n);
    });
  }

  function pickNode(n) {
    if (state.formula) return;
    if (state.picked === n) { state.picked = null; renderChain(); return; }
    if (!state.picked) {
      state.picked = n;
      play('question_suspense');
      setText('chain-hint', '已选中「' + $('node-' + n).querySelector('b').textContent + '」，再选一个证据节点进行交叉比对。');
      renderChain();
      return;
    }
    var pair = [state.picked, n].sort().join('+');
    state.picked = null;
    if (pair === 'barrels+hatch') state.link1 = true;
    else if (pair === 'hatch+rope') state.link2 = true;
    else if (pair === 'barrels+rope') { state.link1 = true; state.link2 = true; }
    play('clue_crystal_ding');
    if (state.link1 && state.link2) {
      state.formula = true;
      setTimeout(function () { play('reversal_iron_lock'); }, 300);
      $('formula').hidden = false;
      $('btn-to-act5').disabled = false;
      setText('chain-hint', '证据链闭合：UCL 热力学冷焰公式已解锁。');
    } else {
      setText('chain-hint', '一条链已接通，再把剩下的节点连起来。');
    }
    renderChain();
    renderHud();
  }

  function initAct4() {
    var a = SPEC.acts[4];
    setText('act4-code', a.code);
    setText('act4-title', a.title);
    setText('act4-sub', a.subtitle);
    setText('act4-mechanism', a.mechanism);
    NODES.forEach(function (n) {
      $('node-' + n).addEventListener('click', function () { pickNode(n); });
    });
    $('btn-to-act5').addEventListener('click', function () { advance(5); });
  }

  /* ------------------------------------------------------------------ *
   * Act 5 — 0.72s Dead Silence + Cool Flame
   * ------------------------------------------------------------------ */
  function setStep(i) {
    var li = $('timeline').children[i];
    if (li) li.classList.add('is-on');
  }

  function triggerFlash() {
    if (state.flashing || state.flashed) return;
    state.flashing = true;
    var btn = $('btn-trigger-flash');
    btn.disabled = true;
    var stage = $('flame-stage');
    stage.classList.add('is-armed');
    setStep(0);
    setText('flame-readout', '乙醇蒸汽持续渗出，舱盖被顶松……');
    setTimeout(function () {
      setStep(1);
      setText('flame-readout', '舱盖掀开，蒸汽浓度落入爆炸极限……');
      play('question_suspense');
    }, 700);

    setTimeout(function () {
      // 0.72s of pitch black. BGM cut to 0 dB.
      setStep(2);
      var ds = $('dead-silence');
      ds.classList.add('is-on');
      play('dead_silence');
      setTimeout(function () {
        ds.classList.remove('is-on');
        var fl = $('cool-flash');
        fl.classList.remove('is-on');
        void fl.offsetWidth;
        fl.classList.add('is-on');
        setStep(3);
        $('timeline').children[3].classList.add('is-flame');
        stage.classList.add('is-blast');
        setText('flame-readout', '轰！幽蓝冷焰喷涌而出 —— 船木无一丝焦黑');
        $('paper-test').hidden = false;
        play('cool_flash');
        Audio.restoreBgm();
        state.flashing = false;
        state.flashed = true;
        btn.hidden = true;
        var next = $('btn-to-act6');
        next.hidden = false;
        next.disabled = false;
        renderHud();
      }, SPEC.DEAD_SILENCE_MS);
    }, 1500);
  }

  function initAct5() {
    var a = SPEC.acts[5];
    setText('act5-code', a.code);
    setText('act5-title', a.title);
    setText('act5-sub', a.subtitle);
    var tl = $('timeline');
    SPEC.steps.forEach(function (s, i) {
      var li = el('li', i === 2 ? 'is-silence' : '', s);
      tl.appendChild(li);
    });
    $('btn-trigger-flash').addEventListener('click', triggerFlash);
    $('btn-to-act6').addEventListener('click', function () { advance(6); });
  }

  /* ------------------------------------------------------------------ *
   * Act 6 — epilogue, rank card, single settlement
   * ------------------------------------------------------------------ */
  function pickRank(score) {
    for (var i = 0; i < SPEC.ranks.length; i++) if (score >= SPEC.ranks[i].min) return SPEC.ranks[i];
    return SPEC.ranks[SPEC.ranks.length - 1];
  }

  function enterAct6() {
    if (state.rank) return;
    state.score = currentScore();
    state.rank = pickRank(state.score);
    var r = state.rank;
    var a = SPEC.acts[6];
    setText('act6-code', a.code);
    setText('act6-title', a.title);
    setText('act6-sub', a.subtitle);
    setText('epilogue', a.epilogue);
    setText('rank-letter', r.letter);
    setText('rank-badge', r.badge);
    setText('rank-title', r.title);
    setText('final-score', String(state.score));
    setText('comment-text', r.comment);
    $('rank-card').setAttribute('data-rank', r.letter);
    play('reversal_iron_lock');
    settle(0);
  }

  function getToy() { return window.toy || null; }

  function settleStatus(msg) { setText('save-status', msg); }

  // One settlement: one setCloudStorage + one submitScore. Only a 307044 rejection is retried, with exponential backoff.
  async function settle(attempt) {
    var toy = getToy();
    if (!toy) { settleStatus('当前为离线预览，成绩未上传。'); return; }
    if (state.settled && attempt === 0) return;
    state.settled = true;
    settleStatus('正在保存战绩…');
    try {
      if (!state.savedCloud) {
        await toy.setCloudStorage({
          mary_celeste_rank: state.rank.letter,
          mary_celeste_score: String(state.score)
        });
        state.savedCloud = true;
      }
      if (!state.savedScore) {
        await toy.submitScore(state.score);
        state.savedScore = true;
      }
      settleStatus('战绩已封存进卷宗。');
    } catch (error) {
      if (error && error.code === 307044) {
        if (attempt < 3) {
          var wait = 1500 * Math.pow(2, attempt);
          settleStatus('请求过于频繁，将在 ' + Math.round(wait / 1000) + ' 秒后自动重试…');
          setTimeout(function () { settle(attempt + 1); }, wait);
        } else {
          settleStatus('请求过于频繁，稍后再来重新勘查即可保存。');
        }
      } else {
        settleStatus('战绩暂未保存（未登录或网络异常），不影响体验。');
      }
    }
  }

  function copyComment() {
    var text = state.rank ? state.rank.comment : $('comment-text').textContent;
    function done() { toast('评论区暗号已复制'); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? '评论区暗号已复制' : '复制失败，请长按文字手动复制');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  function initAct6() {
    $('btn-copy-comment').addEventListener('click', function () { play('clue_crystal_ding'); copyComment(); });
    $('btn-restart').addEventListener('click', function () { window.location.reload(); });
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  function initHud() {
    var bar = document.querySelectorAll('.jump');
    for (var i = 0; i < bar.length; i++) {
      (function (b) {
        b.addEventListener('click', function () { showAct(Number(b.getAttribute('data-jump'))); });
      })(bar[i]);
    }
    $('btn-sound').addEventListener('click', function () {
      state.soundOn = !state.soundOn;
      this.setAttribute('aria-pressed', String(state.soundOn));
      this.textContent = state.soundOn ? '🔊' : '🔇';
      if (state.soundOn) Audio.enable(); else Audio.mute(true);
      if (state.soundOn) play('comma_breath');
    });
  }

  function boot() {
    initHud();
    initAct1();
    initAct2();
    initAct3();
    initAct4();
    initAct5();
    initAct6();
    setTool('yellow_fluo');
    setText('tool-hint', '点击任意拍立得，用当前工具标出它的反常死穴。');
    renderChain();
    renderHud();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
