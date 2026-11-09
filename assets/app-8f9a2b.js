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
      scene: '崖边白犬追着衣角低吠，少年肩头只挂一只小小行囊',
      up: '轻装出门的人，连云也肯为他让出一条窄路，脚下无路之处，便是新的路',
      rev: '莫把一时的莽撞错认作勇气，崖边的风并不认得你是谁，先看清落脚处',
      pos: ['你年少时也曾这样不管不顾地出门，那一步至今仍在脚底微微发烫。',
            '此刻你正站在崖边，行囊很轻，心也很轻，只差一个迈步的理由。',
            '前方没有地图，却有一整片尚未命名的晴空，等你去取名字。'] },
    { id: 'magician', n: 'I', name: '魔术师', img: './assets/tarot-01-magician-b2c3d4.jpg', lk: [9, 5],
      scene: '案上杯、剑、币、杖四器齐陈，他一手指天一手指地，头顶悬着无尽的灯',
      up: '你手里早已握着所需的一切，只差一声清脆的响指，便能把它们点成真的',
      rev: '戏法若是无心，终成一场空响，舞台再亮，也照不暖台下那双冰凉的手',
      pos: ['早年你便悄悄备下了这四件器物，只是那时还不知它们能做什么。',
            '你案头的东西已经齐了，该做的不是再添一件，而是动手。',
            '不久之后，你会亲手把一个念头变成看得见摸得着的东西。'] },
    { id: 'priestess', n: 'II', name: '女祭司', img: './assets/tarot-02-priestess-c3d4e5.jpg', lk: [7, 6],
      scene: '帘后石榴暗红，新月卧在她脚边，经卷半掩于袖中',
      up: '答案不会喧哗，它在静默里慢慢浮起，像杯底渐渐澄清的那一圈琥珀',
      rev: '别再假装听不见心底那个声音，帘子拉得越紧，帘后的影子便越是清楚',
      pos: ['有些话你很早就听见了，却一直没有讲给任何人。',
            '眼下最要紧的不是追问，而是安静坐一会儿，等浮渣自己沉下去。',
            '往后你会发现，那份直觉比所有旁人的劝告都更靠得住。'] },
    { id: 'empress', n: 'III', name: '皇后', img: './assets/tarot-03-empress-d4e5f6.jpg', lk: [9, 5],
      scene: '麦穗环绕她的金冠，身后林叶沙沙，溪水从裙边缓缓绕过',
      up: '丰饶如期而至，耐心浇灌过的东西，自会在属于它的那个季节里挂满枝头',
      rev: '照顾旁人之前，请先替自己续上一盏灯，因为空了的杯子，斟不出一点温热',
      pos: ['你曾被人温柔地养育过，那份底气一直藏在你的脊背里。',
            '此刻不必急着收成，让土再暖一暖，根自会往深处伸。',
            '往后会有一段饱满的日子，像刚出炉的面包，值得慢慢掰开。'] },
    { id: 'emperor', n: 'IV', name: '皇帝', img: './assets/tarot-04-emperor-e5f6a7.jpg', lk: [7, 5],
      scene: '石座扶手刻着四只羊首，他披红袍端坐，身后群山寸草不生',
      up: '立好规矩便是立好屋梁，风雨来时再大，也吹不动一座早已想得周全的房子',
      rev: '过硬的墙会把自己也关在里面，权威若是始终不肯弯腰，便只剩孤零零的冷',
      pos: ['早年有一位严肃的人替你立过规矩，你至今仍在遵守或反抗它。',
            '眼下需要一点果断，把摇摆不定的事用一条线划分清楚。',
            '往后你会成为替别人遮风的人，请记得在屋里留一扇窗。'] },
    { id: 'chariot', n: 'VII', name: '战车', img: './assets/tarot-07-chariot-f6a7b8.jpg', lk: [8, 5],
      scene: '黑白双狮并驾，星幔覆在车顶，城门在他身后缓缓退去',
      up: '握紧缰绳，让两股相反的力朝同一个方向奔去，远处的城门已在眼前亮起灯',
      rev: '方向未定的奔驰，只是徒然扬起一路尘土，不妨先勒住缰绳，在路边歇上片刻',
      pos: ['你曾为了证明什么而远走，那场出发至今仍在耳边隆隆作响。',
            '此刻两股心念各拉一头，先把它们捏成一股，车才走得稳。',
            '不远处有一座城门为你敞开，只是扬鞭的手要你自己来握。'] },
    { id: 'wheel', n: 'X', name: '命运之轮', img: './assets/tarot-10-wheel-a7b8c9.jpg', lk: [8, 4],
      scene: '云间巨轮缓缓转动，四角圣兽各捧一卷书，斯芬克斯静坐轮顶',
      up: '命运的轮子终于缓缓转到了你这一边，只需顺着它的力气，不必再费一分蛮力',
      rev: '低处不过是轮回里小小的一格，别急着中途下车，等这一圈转完便见分晓',
      pos: ['你的过往里有一次转折，当时看似坏事，如今回头已是伏笔。',
            '眼下局势正在翻面，所有悬着的东西都要重新落位。',
            '接下来的风向会变，请把窗户开着，让新的机缘走进来。'] },
    { id: 'tower', n: 'XVI', name: '高塔', img: './assets/tarot-16-tower-b8c9d0.jpg', lk: [4, 6],
      scene: '闪电劈开塔顶的王冠，火舌从窗口舔出，两个人影坠入暗夜',
      up: '旧的城墙自己裂开了口，塌下来的是谎言，留下来的才是真正的地基',
      rev: '崩塌被一再拖延，裂缝只在暗处悄悄长大，倒不如自己动手，拆下第一块砖',
      pos: ['你曾亲历一次猝不及防的坍塌，至今仍记得那声巨响。',
            '眼下有一处看似坚固的东西已经松动，别再用力去扶它。',
            '废墟之后会有一片亮得出奇的空地，足够你重新盖一座屋子。'] },
    { id: 'star', n: 'XVII', name: '星星', img: './assets/tarot-17-star-c9d0e1.jpg', lk: [10, 6],
      scene: '少女跪在池边，双壶倾泻清水，头顶八芒星静静亮着',
      up: '伤口之上，星光正在一针一线地替你缝合，长夜再长，也终究会有它的尽头',
      rev: '别因为一夜的阴云便不信天会亮，星从未离开过，只是你低着头太久太久了',
      pos: ['你曾在漫长的黑夜里独自坐过，那时没有人知道你有多疼。',
            '此刻有一线微光落在你肩上，不必伸手去抓，只管抬头。',
            '往后你会慢慢被治愈，温柔得像清晨第一口热咖啡。'] },
    { id: 'moon', n: 'XVIII', name: '月亮', img: './assets/tarot-18-moon-d0e1f2.jpg', lk: [5, 7],
      scene: '犬与狼对着满月长嚎，小径通向远山，池底的龙虾缓缓爬上岸',
      up: '朦胧之处藏着最真的直觉，雾再浓，月亮也会悄悄替你照出前面的半条小路',
      rev: '迷雾正在慢慢散开，莫被自己的影子吓得退后，你所怕的，多半只是一场回声',
      pos: ['你心里有一件从未说清的事，像潮水，夜夜来拍你的窗。',
            '眼下看不真切并不可怕，慢些走，把脚步放轻就好。',
            '不久雾便要散了，你会发现那些吓人的影子原来是树。'] },
    { id: 'sun', n: 'XIX', name: '太阳', img: './assets/tarot-19-sun-e1f2a3.jpg', lk: [10, 6],
      scene: '向日葵探出矮墙，赤足的孩童骑着白马，红旗在日光里舒展',
      up: '阳光从不过问来处，只管把你照得通亮，你唇边的笑意，会替你说完所有的话',
      rev: '热情过盛也会灼伤窗台，好消息只是迟了几步，请你再耐心多等一个温暖的晌午',
      pos: ['你有过一段被人毫无保留地爱着的日子，它仍在骨头里发热。',
            '此刻的明朗来得朴素，不必声张，也值得好好晒一晒。',
            '前方有一场坦荡的欢喜，等你推开门便能撞个满怀。'] },
    { id: 'world', n: 'XXI', name: '世界', img: './assets/tarot-21-world-f2a3b4.jpg', lk: [10, 6],
      scene: '桂冠环中的舞者轻盈回身，四角圣兽守在云端，红绸缠过她的腰',
      up: '一段漫长的旅程圆满落成，你终于可以放下行囊，听一听自己的脚步声',
      rev: '差半圈便圆，别急着提前离席，因为最后那一小段路，往往才最见真章与心意',
      pos: ['你曾走完一段很长的路，那份完成感至今还留在掌心。',
            '眼下只差最后一笔，不要因为累了便草草收尾。',
            '之后你会站在新的起点上，回头望去，整条路都亮着灯。'] }
  ];

  var SLOT_NAMES = ['往昔之因', '眼下之局', '将至之兆'];
  var SLOT_SHORT = ['往昔', '眼下', '将至'];

  var INTENTS = {
    career: { label: '前程与器业', short: '前程', whisperAsk: '你想亲手建成什么？', motif: '案上那张迟迟未落印的图纸' },
    love: { label: '故人与羁绊', short: '故人', whisperAsk: '那个名字，还在你舌尖吗？', motif: '旧信里那朵未肯褪尽颜色的花' },
    study: { label: '灯火与登科', short: '灯火', whisperAsk: '哪一页，你迟迟不肯翻过？', motif: '灯下那页翻不过去的书' },
    luck: { label: '流年与晴雨', short: '流年', whisperAsk: '你在等哪一场雨停？', motif: '窗外低垂不动的云脚' }
  };

  var SIGNS = {
    fire: { label: '火象', trait: '火象的人生来带着壁炉的脾气，一句话便能点燃整座沙龙，也最怕炉火空烧。' },
    earth: { label: '土象', trait: '土象的人像橡木吧台般沉稳，慢慢焙熟每一颗豆子，从不辜负时间的重量。' },
    air: { label: '风象', trait: '风象的人总在长桌两端传递新闻与诗句，心比门上的风铃还要轻快。' },
    water: { label: '水象', trait: '水象的人能从别人杯中的涟漪读出心事，温柔得像博斯普鲁斯的夜雾。' }
  };

  var TOTEMS = {
    owl: { name: '夜枭栖枝', el: 'air', luck: 4, item: '黄铜书签',
      gist: '一只夜枭在瓷壁上收拢了双翼',
      read: '残渣沿着温热的瓷壁慢慢收拢，成了一只栖在横枝上的夜枭，双眼静静朝着杯口。夜里的念头比白昼清醒，你早已看清某件事，只是一直没有说破。',
      intent: {
        career: '有一个机会会出现在不那么正式的场合，夜里想清楚的方案，比白天会议上的更靠得住。',
        love: '对方的心意你早有判断，不必再托人求证，第一眼的直觉便是答案。',
        study: '适合在安静的夜里复盘，薄弱之处会在独处时自己浮上来，像茶面上的一粒金屑。',
        luck: '今日先看后说，一句收住的话，能替你挡下一场无谓的口舌。' },
      zones: {
        rim: '杯沿的渣粒细碎而疏落，像檐角将停未停的雨。近七日会有一条不起眼的消息，值得你多看两眼，夜里的念头比白昼清醒。',
        wall: '杯壁左侧有一道向上的细纹，像一位沉默的长者在暗处看你，也替你说话；右侧那一小横，多半是你自己的犹豫。',
        bottom: '杯底沉着一枚小小的结：你怕说出口便不灵验。可枝再稳，鸟不飞，也只是一幅静物。' } },
    anchor: { name: '破浪铁锚', el: 'water', luck: 5, item: '深蓝丝巾',
      gist: '咖啡渣沉成一枚铁锚',
      read: '咖啡渣在杯底沉成一枚铁锚，弧形双臂向上托起，锚链没入深褐色的暗潮。远行的船票正在路上，而你真正需要的，不是更快，是更稳。',
      intent: {
        career: '别被新风口带着跑，守住手上的正业，旁的营生只拿小小的本钱去试水。',
        love: '这段牵连需要一个体面的名分，含糊得太久，两个人都会疲惫。',
        study: '稳住节奏比冲刺要紧，每日固定一段灯下的时辰，胜过一夜熬红的双眼。',
        luck: '今日宜收拾、宜做减法，送走一件旧物，会换回一小份清爽。' },
      zones: {
        rim: '杯沿一圈整齐的细渣，像码头边排好的缆绳。远行的船票正在路上，近七日的行程会被一一钉牢，反叫人安心。',
        wall: '杯壁两侧对称如天平，家中有人替你压住风浪，助力与阻力几乎持平，只看你选哪一边使力。',
        bottom: '杯底的结，是你舍不得那片旧港湾。抓得太紧的东西，正悄悄拖慢你的船。' } },
    key: { name: '双生铜钥', el: 'earth', luck: 2, item: '一把旧钥匙',
      gist: '两柄小小的铜钥交叠在金边之上',
      read: '两柄铜钥交叠在杯底的金边上，一柄朝左，一柄朝右，像一句未说完的誓言。同一扇门原有两种开法，你一直只试过其中一种。',
      intent: {
        career: '换个角度去谈合作，一位看似无关的旧识，会成为你的第二把钥匙。',
        love: '你与对方各握着一半真话，先开口的人，会拿到那一点温柔的主动。',
        study: '换一种读书的法子，把输入改成输出，卡住的那一处自会松动。',
        luck: '今日遇到的阻碍另有小路可走，不必在一条巷子里硬撞。' },
      zones: {
        rim: '杯沿的渣粒两两成对，像并排挂着的两把钥匙。近七日里，两扇门将同时向你敞开。',
        wall: '杯壁中段有交叉的细纹，有人握着另一半答案，两股力量正在你身上拉扯。',
        bottom: '杯底的结，是你怕选了一扇便失去另一扇。钥匙合不合锁，只有试了才知道。' } },
    stag: { name: '衔枝白鹿', el: 'fire', luck: 6, item: '白色小饰物',
      gist: '一头白鹿衔着橄榄枝走过瓷上的雪原',
      read: '细细的纹路勾出一头白鹿，衔着橄榄枝，踏过瓷壁上一片薄薄的雪原。鹿是林中的使者，衔枝是和解，好消息随晨光一同靠近。',
      intent: {
        career: '有贵人愿意递来橄榄枝，不必急着议价，先接住这份善意。',
        love: '冷下来的误会有机会破冰，肯先递台阶的人，会赢得整段情谊。',
        study: '师长或同窗会点拨一句关键的话，开口求教，比独自硬啃更快。',
        luck: '今日容易遇到顺手的小小好运，保持礼貌，好运会一件叠着一件。' },
      zones: {
        rim: '杯沿清亮，渣粒疏朗，像雪后第一缕晨光。和解的消息会随早晨而来，近七日心情明显轻盈。',
        wall: '杯壁有一道向着杯口扬起的纹路，是旧友在暗中替你说情，也是一位年长者持续不断的助力。',
        bottom: '杯底几乎没有死结，只留一句小小的提醒：你仍记着一句未曾道出的歉意，好运来时，别疑神疑鬼。' } },
    crescent: { name: '新月王冠', el: 'water', luck: 5, item: '银色小饰品',
      gist: '一弯新月托着小小的王冠浮在杯口',
      read: '杯口浮起一弯新月，月尖托着小小的王冠，细渣沿着瓷壁贴成一道银亮的弧。新月是从零开始的光，这一回起步，你有资格站在更高处。',
      intent: {
        career: '宜开新局、亮出自己的名号，起点虽小，格局要大。',
        love: '新的缘分始于一个小小的契机，莫拿旧日的经验去量新来的人。',
        study: '宜重新立下章程，新的阶段从今夜算起，不必追悔从前。',
        luck: '今夜适合许愿，写下来的心事，更容易落地成真。' },
      zones: {
        rim: '杯沿有一道弧形的亮边，像刚升起的月牙。新的名分正悄悄靠近，近七日会有一次小小的开端。',
        wall: '杯壁偏右一弯月牙状的细纹，是一位女性贵人在照看着你，情绪里的助力，值得你信任。',
        bottom: '杯底的结，是你怀疑自己配不上光亮。把王冠摘下来揣进口袋的人，永远等不到加冕。' } },
    serpent: { name: '衔尾金蛇', el: 'earth', luck: 3, item: '圆形戒指或手环',
      gist: '一圈金色的残渍首尾相衔，绕着杯壁如一枚古老的环',
      read: '一圈金色残渍首尾相衔，绕着杯壁，像一枚古老的环。衔尾蛇是循环，也是重生，说明你正重复着某种旧模样，也恰好站在跳出它的门口。',
      intent: {
        career: '同一类难题第三次出现，这回别再打补丁，从根上改一改章法。',
        love: '你们在重演同一场争执，把开头改掉，结局才会跟着改。',
        study: '同一类题目屡屡出错，是方法的事，不是勤奋的事，回到最初的概念。',
        luck: '今日会撞见熟悉的小麻烦，换一种与往常不同的做法，它便自行散去。' },
      zones: {
        rim: '杯沿的渣粒连成一圈，旧事将以新面目归来，近七日会有似曾相识的一幕重演。',
        wall: '杯壁的纹路首尾相接，循环本身在推着你，助力与阻力原是同一件事，换个角度便互换了位置。',
        bottom: '杯底的结，是你一直绕着同一个旧伤口走。旧习惯很舒服，却把你锁在圆圈里。' } }
  };
  var TOTEM_KEYS = ['owl', 'anchor', 'key', 'stag', 'crescent', 'serpent'];

  var ZONES = {
    rim: { label: '杯沿 · 近七日风向', r0: 118, r1: 142, tag: '杯沿' },
    wall: { label: '杯壁 · 暗处推手', r0: 86, r1: 118, tag: '杯壁' },
    bottom: { label: '杯底 · 潜藏心结', r0: 0, r1: 86, tag: '杯底' }
  };

  var CAL = {
    career: { yi: ['把拖着的那份报价轻轻寄出去', '整理作品集，选三处值得的门敲一敲', '约一位旧同事喝杯咖啡，不谈事'],
              ji: ['在群里说带着火气的话', '临时应下来路不明的合作', '深夜改动合同的任何一个字'] },
    love: { yi: ['先发一句不带目的的问候', '把心里话写成三行，再决定寄不寄', '独自坐半个钟头，再回那条消息'],
            ji: ['翻对方三个月前的旧动态', '借着酒意说出口', '拿第三个人来试探'] },
    study: { yi: ['番茄钟四轮，每轮末写一句小结', '把上周的错题重做一遍', '睡前十分钟，在心里默画一遍知识的骨架'],
             ji: ['通宵刷题', '拿自己去比别人的进度', '临阵更换复习的书目'] },
    luck: { yi: ['出门前摸一摸钥匙和充电线', '先喝一口水，再回消息', '把今日最难的事排在上午'],
            ji: ['一时冲动下单', '在评论区同人争辩', '把要紧的文件拖到最后一刻'] }
  };
  var HOURS = ['辰时 07:00 至 09:00', '巳时 09:00 至 11:00', '午时 11:00 至 13:00',
               '未时 13:00 至 15:00', '申时 15:00 至 17:00', '酉时 17:00 至 19:00', '戌时 19:00 至 21:00'];

  var RANKS = {
    SSR: { name: 'SSR · 群星归位', quotes: [
      '今夜所有的星都为你点灯，去吧，门是开着的。',
      '星轨已为你铺好，机会不会敲第二次门，所以第一次就请你推开它。'] },
    SR: { name: 'SR · 长风破浪', quotes: [
      '风已鼓满你的帆，只需把舵握得再稳一些。',
      '杯底有裂纹，牌面有出口，顺着光走，不必回头。'] },
    A: { name: 'A · 顺水行舟', quotes: [
      '不必用力划桨，河流认得回家的路。',
      '水不争先，却能到海，今夜做稳一件小事，胜过匆匆做成十件大事。'] },
    B: { name: 'B · 潜龙勿用', quotes: [
      '且在深水里多睡一季，鳞片正悄悄长成。',
      '牌在叫你停一停，停下来的人，反而最先看清路。'] }
  };

  /* ---------- state ---------- */
  var S = {
    act: 1, reached: 1, mode: 'daily', intent: 'career', sign: 'fire', sound: true, bgm: true,
    key: null, totemKey: null, points: null, particles: null, stains: null,
    settled: false, swirling: false, zone: null,
    fate: null, drawn: [], drawing: false, result: null, cardURL: null,
    cupProgress: 0, duoMode: false, companionName: '', companionElement: 'fire'
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
    return [S.mode, dateStr(), S.intent, S.sign, whisperText()].join('|') +
      (S.duoMode ? ('|duo|' + (S.companionName || '某位故人') + '|' + S.companionElement) : '');
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
  /* ---------- audio: Satie chamber BGM + acoustic foley ---------- */
  var actx = null, bgmGain = null, sfxBus = null, noiseBuf = null, bgmTimer = null, bgmStep = 0;
  var NOTE_IDX = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function nf(name) {
    var m = /^([A-G](?:#|b)?)(\d)$/.exec(name);
    var semis = NOTE_IDX[m[1]] + (parseInt(m[2], 10) + 1) * 12;
    return 440 * Math.pow(2, (semis - 69) / 12);
  }
  function chordOf(a) { return a.map(nf); }
  var SATIE = (function () {
    var seq = [];
    var gm = { bass: 'G2', ch: ['B3', 'D4', 'F#4'] }, dm = { bass: 'D2', ch: ['A3', 'C#4', 'F#4'] };
    var m1 = ['F#5', 'A5', 'G5', 'F#5', 'C#5', 'B4', 'C#5', 'D5', 'A4', 'F#4'], k = 0, b, i;
    for (b = 0; b < 5; b++) {
      var h = (b % 2 === 0) ? gm : dm;
      seq.push({ bass: h.bass });
      seq.push({ ch: h.ch, mel: m1[k++] });
      seq.push({ mel: m1[k++] });
    }
    var fm = { bass: 'F2', ch: ['Ab3', 'C4', 'F4'] };
    var m2 = ['F4', 'G4', 'Ab4', 'B4', 'C5', 'B4', 'Ab4', 'G4', 'F4'];
    k = 0;
    for (b = 0; b < 5; b++) {
      seq.push({ bass: fm.bass });
      seq.push({ ch: fm.ch, mel: m2[k++] });
      seq.push({ mel: m2[k++] });
    }
    return seq;
  })();

  /* Debussy, Clair de Lune: descending thirds over flowing arpeggios (half-beat steps, 66 BPM) */
  var DEBUSSY = (function () {
    var seq = [], i;
    for (i = 0; i < 24; i++) seq.push({});
    [[0, ['E5', 'C5'], ['C3', 'G3', 'E4']],
     [3, ['A4', 'F4'], ['F2', 'C3', 'A3']],
     [6, ['G4', 'E4', 'C4'], ['C3', 'G3', 'E4']],
     [9, ['D5', 'B4'], ['G2', 'D3', 'B3']],
     [12, ['C5', 'A4'], ['A2', 'E3', 'C4']],
     [15, ['G4', 'E4', 'C4'], ['C3', 'G3', 'E4']]].forEach(function (e) {
      seq[e[0]] = { ch: e[1], arp: e[2] };
    });
    return seq;
  })();
  /* Chopin, Raindrop Prelude: repeated G#4 pedal under a lyrical melody (half-beat steps, 60 BPM) */
  var CHOPIN = (function () {
    var seq = [], i;
    for (i = 0; i < 32; i++) seq.push({ drop: true });
    var bars = [
      { mel: [['C#5', 2], ['B4', 1], ['G#4', 1]], lo: ['C#3', 'G#3'] },
      { mel: [['F#4', 2], ['E4', 2]], lo: ['A2', 'E3'] },
      { mel: [['G#4', 1], ['B4', 1], ['C#5', 2]], lo: ['F#2', 'C#3'] },
      { mel: [['B4', 1], ['G#4', 1], ['E4', 2]], lo: ['E2', 'B2'] }
    ];
    bars.forEach(function (bar, b) {
      var at = b * 8;
      seq[at].lo = bar.lo;
      bar.mel.forEach(function (m) { seq[at].mel = m[0]; at += m[1] * 2; if (at < 32) seq[at].mel = undefined; });
    });
    return seq;
  })();
  var TRACKS = [
    { id: 'satie', label: '曲目 · 萨蒂《裸体歌舞》', ms: 900, seq: SATIE },
    { id: 'debussy', label: '曲目 · 德彪西《月光》', ms: 450, seq: DEBUSSY },
    { id: 'chopin', label: '曲目 · 肖邦《雨滴》', ms: 500, seq: CHOPIN }
  ];
  var trackIdx = 0;
  function startBgmLoop() {
    clearInterval(bgmTimer);
    bgmStep = 0;
    bgmTimer = setInterval(bgmTick, TRACKS[trackIdx].ms);
  }

  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      if (!actx) {
        actx = new AC();
        bgmGain = actx.createGain();
        bgmGain.gain.value = S.bgm ? 1 : 0;
        bgmGain.connect(actx.destination);
        sfxBus = actx.createGain();
        sfxBus.gain.value = 1;
        sfxBus.connect(actx.destination);
        var len = actx.sampleRate * 2;
        noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
        var d = noiseBuf.getChannelData(0), b0 = 0, b1 = 0, b2 = 0;
        for (var i = 0; i < len; i++) {
          var w = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + w * 0.099046;
          b1 = 0.963 * b1 + w * 0.2965164;
          b2 = 0.57 * b2 + w * 1.0526913;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25;
        }
        var rain = actx.createBufferSource();
        rain.buffer = noiseBuf; rain.loop = true;
        var bp = actx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = 0.6;
        var rg = actx.createGain();
        rg.gain.value = 0.025;
        rain.connect(bp); bp.connect(rg); rg.connect(bgmGain);
        rain.start();
        startBgmLoop();
      }
      if (actx.state === 'suspended') actx.resume();
      return true;
    } catch (e) { return false; }
  }
  function piano(freq, t, vol, shimmer) {
    var lp = actx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1600;
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    var o1 = actx.createOscillator(), o2 = actx.createOscillator(), g2 = actx.createGain();
    o1.type = 'triangle'; o1.frequency.value = freq;
    o2.type = 'sine'; o2.frequency.value = freq * 2;
    g2.gain.value = 0.35;
    o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(bgmGain);
    o1.start(t); o2.start(t); o1.stop(t + 2.5); o2.stop(t + 2.5);
    if (shimmer) {
      var o3 = actx.createOscillator(), g3 = actx.createGain();
      o3.type = 'sine'; o3.frequency.value = freq * 2;
      g3.gain.setValueAtTime(0.0001, t + 0.03);
      g3.gain.exponentialRampToValueAtTime(vol * 0.22, t + 0.05);
      g3.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o3.connect(g3); g3.connect(bgmGain);
      o3.start(t + 0.03); o3.stop(t + 1.2);
    }
  }
  function bgmTick() {
    if (!actx || !S.bgm || actx.state !== 'running') return;
    var seq = TRACKS[trackIdx].seq;
    var ev = seq[bgmStep % seq.length];
    bgmStep++;
    var t = actx.currentTime + 0.03;
    if (ev.drop) piano(nf('G#4'), t, 0.035, false);
    if (ev.lo) ev.lo.forEach(function (n, i) { piano(nf(n), t + i * 0.02, 0.06, false); });
    if (ev.arp) ev.arp.forEach(function (n, j) { piano(nf(n), t + j * 0.17, 0.035, false); });
    if (ev.bass) piano(nf(ev.bass), t, 0.07, false);
    if (ev.ch) chordOf(ev.ch).forEach(function (f, i) { piano(f, t + i * 0.012, 0.035, false); });
    if (ev.mel) piano(nf(ev.mel), t + (ev.ch ? 0.02 : 0), 0.06, true);
  }
  function setBgm(on) {
    S.bgm = on;
    var b = $('btn-bgm');
    b.textContent = on ? '雨夜琴声：开' : '雨夜琴声：关';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) ensureAudio();
    if (actx && bgmGain) bgmGain.gain.setTargetAtTime(on ? 1 : 0, actx.currentTime, 0.5);
  }
  function firstTouch() {
    document.removeEventListener('pointerdown', firstTouch, true);
    document.removeEventListener('keydown', firstTouch, true);
    ensureAudio();
  }
  document.addEventListener('pointerdown', firstTouch, true);
  document.addEventListener('keydown', firstTouch, true);

  function sfxReady() { return S.sound && ensureAudio(); }
  function pluck(f, t, vol, dur) {
    var lp = actx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3200;
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var o = actx.createOscillator(), o2 = actx.createOscillator(), g2 = actx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    o2.type = 'sine'; o2.frequency.value = f * 2; g2.gain.value = 0.25;
    o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(sfxBus);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function ring(f, t, vol, dur) {
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function grain(t, f0, f1, q, vol, dur) {
    var src = actx.createBufferSource();
    src.buffer = noiseBuf;
    var bp = actx.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) bp.frequency.linearRampToValueAtTime(f1, t + dur);
    var g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(sfxBus);
    src.start(t, Math.random() * 1.5, dur + 0.05);
  }
  function sfxDoor() {
    if (!sfxReady()) return;
    var t = actx.currentTime + 0.01;
    pluck(nf('A4'), t, 0.06, 1.2);
    pluck(nf('E5'), t + 0.05, 0.05, 1.2);
  }
  function sfxClink() {
    if (!sfxReady()) return;
    var t = actx.currentTime + 0.01;
    ring(2380, t, 0.035, 0.7);
    ring(3910, t + 0.004, 0.022, 0.45);
    ring(5620, t + 0.008, 0.012, 0.3);
  }
  function sfxSwirl() {
    if (!sfxReady()) return;
    var t = actx.currentTime + 0.05;
    grain(t, 500, 1400, 1.4, 0.05, 1.0);
    grain(t + 1.0, 1400, 600, 1.4, 0.04, 1.0);
  }
  function sfxShuffle() {
    if (!sfxReady()) return;
    var t = actx.currentTime + 0.01;
    for (var i = 0; i < 12; i++) grain(t + i * 0.028, 2800, 2800, 1.2, 0.05, 0.05);
  }
  function sfxFlip(slot) {
    if (!sfxReady()) return;
    grain(actx.currentTime + 0.01, 2400, 3200, 1.0, 0.04, 0.12);
    setTimeout(function () {
      if (!S.sound || !actx) return;
      var t = actx.currentTime + 0.01, k = slot || 0;
      pluck(nf('E5'), t, 0.05, 1.4);
      pluck(nf('B5'), t + 0.04, 0.04, 1.4);
      pluck(nf('E6') * (1 + k * 0.0), t + 0.08, 0.03, 1.4);
    }, 400);
  }
  function sfxSeal() {
    if (!sfxReady()) return;
    var t = actx.currentTime + 0.01;
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.15);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g); g.connect(sfxBus);
    o.start(t); o.stop(t + 0.6);
    ring(nf('D5'), t + 0.3, 0.04, 2.2);
    ring(nf('A5'), t + 0.34, 0.03, 2.0);
    ring(nf('F#6'), t + 0.38, 0.02, 1.8);
  }
  function sfxPen() {
    if (!sfxReady()) return;
    grain(actx.currentTime + 0.01, 3200, 3200, 6, 0.04, 0.085);
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
    daily: '每日一签：同一天、同一桩心事，三姊妹会写下同一封回信；明夜再来，雨声便不同了。',
    free: '夜夜重占：每一次都重新洗牌、重新轻旋杯碟，适合想换个角度再问一回的人。'
  };
  function selectInGroup(sel, attr, val) {
    $$(sel).forEach(function (b) {
      var on = b.getAttribute(attr) === val;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    });
  }
  function updateStartHint() {
    $('start-hint').textContent = '已推开：' + INTENTS[S.intent].label + ' · ' + SIGNS[S.sign].label +
      (S.duoMode ? ' · 与「' + (S.companionName || '某位故人') + ' · ' + SIGNS[S.companionElement].label + '」同占' : '') +
      (whisperText() ? ' · 杯底低语已留下' : '');
  }
  $$('.mode-btn[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.mode = b.getAttribute('data-mode');
      $$('.mode-btn[data-mode]').forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      $('mode-note').textContent = MODE_NOTES[S.mode];
      sfxDoor();
    });
  });
  $$('.intent-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.intent = b.getAttribute('data-intent');
      selectInGroup('.intent-btn', 'data-intent', S.intent);
      $('whisper-label').textContent = INTENTS[S.intent].whisperAsk + '（可在杯底留一句低语）';
      $('whisper-input').placeholder = INTENTS[S.intent].whisperAsk + '轻声写一句，也可以留白';
      updateStartHint();
      sfxDoor();
    });
  });
  $$('.sign-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      S.sign = b.getAttribute('data-sign');
      selectInGroup('.sign-btn', 'data-sign', S.sign);
      updateStartHint();
      sfxDoor();
    });
  });
  $('whisper-input').addEventListener('input', updateStartHint);
  ['btn-solo', 'btn-duo'].forEach(function (id) {
    var b = $(id);
    if (!b) return;
    b.addEventListener('click', function () {
      S.duoMode = (id === 'btn-duo');
      $('btn-solo').setAttribute('aria-pressed', S.duoMode ? 'false' : 'true');
      $('btn-solo').classList.toggle('is-on', !S.duoMode);
      $('btn-duo').setAttribute('aria-pressed', S.duoMode ? 'true' : 'false');
      $('btn-duo').classList.toggle('is-on', S.duoMode);
      $('duo-panel').hidden = !S.duoMode;
      updateStartHint();
      sfxDoor();
    });
  });
  if ($('companion-name')) {
    $('companion-name').addEventListener('input', function () {
      S.companionName = (this.value || '').trim();
      updateStartHint();
    });
  }
  $$('#companion-grid .element-pill').forEach(function (b) {
    b.addEventListener('click', function () {
      S.companionElement = b.getAttribute('data-comp-el');
      $$('#companion-grid .element-pill').forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-selected', on);
        x.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      updateStartHint();
      sfxDoor();
    });
  });

  $('btn-to-act2').addEventListener('click', function () {
    var k = seedKey();
    if (k !== S.key) { resetReading(); S.key = k; S.fate = makeFate(); }
    openStage(2);
    sfxDoor();
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
  var CUP_SC = 0.72, CUP_OX = C - 100 * CUP_SC, CUP_OY = C - 100 * CUP_SC;
  var cupTopImg = new Image();
  cupTopImg.src = './assets/cup-topdown-4e5f6a.jpg';
  cupTopImg.onload = function () { if (!S.swirling) drawCup(cupOpts()); };

  function drawCupBase(g) {
    g.clearRect(0, 0, CW, CW);
    if (cupTopImg.complete && cupTopImg.naturalWidth > 0) {
      g.save();
      g.beginPath(); g.arc(C, C, 244, 0, TAU); g.clip();
      g.drawImage(cupTopImg, C - 286, C - 286, 572, 572);
      g.lineWidth = 4;
      for (var vi = 1; vi <= 6; vi++) {
        g.strokeStyle = 'rgba(12, 9, 6, ' + (0.04 * vi).toFixed(2) + ')';
        g.beginPath(); g.arc(C, C, 222 + vi * 3.6, 0, TAU); g.stroke();
      }
      g.fillStyle = 'rgba(248, 241, 226, 0.22)';
      g.beginPath(); g.arc(C, C, 136, 0, TAU); g.fill();
      g.restore();
      return;
    }
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
      st.push({ a: Math.random() * TAU, r0: 134 - Math.random() * 6, len: 10 + Math.random() * 40,
                bend: (Math.random() - 0.5) * 0.14, w: 1.5 + Math.random() * 3.5, al: 0.1 + Math.random() * 0.2 });
    }
    return st;
  }
  function drawStains(g, st) {
    g.save();
    g.beginPath(); g.arc(C, C, 138, 0, TAU); g.clip();
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
    g.fillStyle = 'rgba(61,40,28,0.14)'; g.beginPath(); g.arc(C, C, 84, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(61,40,28,0.28)'; g.lineWidth = 2;
    g.beginPath(); g.arc(C, C, 88, 0, TAU); g.stroke();
  }
  function drawLiquid(g, amt) {
    if (amt <= 0) return;
    g.save();
    g.globalAlpha = Math.min(1, amt);
    var lg = g.createRadialGradient(C - 24, C - 24, 8, C, C, 138);
    lg.addColorStop(0, '#4a2c19'); lg.addColorStop(1, '#1d0f08');
    g.fillStyle = lg; g.beginPath(); g.arc(C, C, 138, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(201,162,75,0.28)'; g.lineWidth = 6;
    g.beginPath(); g.arc(C, C, 112, 0.3, 2.2); g.stroke();
    g.strokeStyle = 'rgba(255,230,180,0.16)'; g.lineWidth = 3;
    g.beginPath(); g.arc(C, C, 90, 3.4, 4.8); g.stroke();
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
    var ly = (zone === 'bottom') ? C + 62 : C - (z.r0 + z.r1) / 2;
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
  function drawConstellation(g, pts) {
    if (!pts.length) return;
    var n = 7 + (pts.length % 3), left = [], i;
    for (i = 0; i < n; i++) {
      var p = pts[Math.floor(i * pts.length / n)];
      left.push({ x: CUP_OX + p.x * CUP_SC, y: CUP_OY + p.y * CUP_SC });
    }
    var cur = left.shift(), path = [cur];
    while (left.length) {
      var bi = 0, bd = Infinity;
      for (i = 0; i < left.length; i++) {
        var d = Math.hypot(left[i].x - cur.x, left[i].y - cur.y);
        if (d < bd) { bd = d; bi = i; }
      }
      cur = left.splice(bi, 1)[0]; path.push(cur);
    }
    g.save();
    g.strokeStyle = 'rgba(201,162,75,0.42)'; g.lineWidth = 0.9; g.lineJoin = 'round';
    g.beginPath();
    path.forEach(function (q, k) { if (k === 0) g.moveTo(q.x, q.y); else g.lineTo(q.x, q.y); });
    g.stroke();
    g.fillStyle = 'rgba(201,162,75,0.7)';
    path.forEach(function (q) { g.beginPath(); g.arc(q.x, q.y, 2.2, 0, TAU); g.fill(); });
    g.restore();
  }
  function drawSteam(g) {
    g.save();
    g.strokeStyle = 'rgba(120,92,50,0.22)'; g.lineWidth = 2.5; g.lineCap = 'round';
    [-34, 0, 34].forEach(function (dx, k) {
      var x = C + dx, y = C - 130 - k % 2 * 8;
      g.beginPath();
      g.moveTo(x, y);
      g.bezierCurveTo(x - 16, y - 24, x + 16, y - 40, x, y - 66);
      g.stroke();
    });
    g.restore();
  }
  function drawCup(o) {
    var g = cg;
    drawCupBase(g);
    if (o.stains) drawStains(g, o.stains);
    drawLiquid(g, o.liquid);
    if (o.points) drawPoints(g, o.points, CUP_OX, CUP_OY, CUP_SC, 0.75, PAL_DARK);
    if (o.points) drawConstellation(g, o.points);
    if (o.particles) drawParticleSet(g, o.particles, 1);
    if (o.points) drawSteam(g);
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
        var a = Math.random() * TAU, r = 95 + Math.random() * 28;
        tx = C + Math.cos(a) * r; ty = C + Math.sin(a) * r;
      }
      var rnd = Math.random();
      var r0 = 16 + Math.random() * 110;
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
    sfxClink(); sfxSwirl();
    if (!reduced) cupCanvas.classList.add('cup-invert');
    cupCanvas.style.transform = '';
    var dur = reduced ? 600 : 2400;
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
    cupCanvas.classList.remove('cup-invert');
    S.stains = makeStains();
    drawCup(cupOpts());
    var t = TOTEMS[S.totemKey];
    var aff = (t.el === S.sign);
    $('totem-name').textContent = t.name;
    $('totem-read').textContent = t.read;
    $('totem-intent').textContent = '你叩的是「' + INTENTS[S.intent].label + '」之门：' + t.intent[S.intent];
    $('totem-luck').textContent = '杯底星轨加成 +' + t.luck + ' · 随身信物：' + t.item +
      (aff ? ' · 与你的' + SIGNS[S.sign].label + '同频，另添 +2' : '');
    $('zone-reading').innerHTML = '<h3>杯底已显影：' + esc(t.name) + '</h3><p>' + esc(t.gist) + '。轻点杯沿、杯壁、杯底，咖啡渣便在对应的圆环上亮起，一处一处说与你听。</p>';
    hudTotem.textContent = '杯底图腾 · ' + t.name;
    cupCanvas.setAttribute('aria-label', '杯底咖啡渣沉淀成「' + t.name + '」图腾');
    btnSwirl.disabled = false; btnReswirl.disabled = false; btnAct3.disabled = false;
    zoneBtns.forEach(function (b) { b.disabled = false; });
    openStage(3);
    sfxClink();
    setTimeout(sfxClink, 160);
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
  cupCanvas.addEventListener('pointermove', function (e) {
    if (reduced || S.swirling) return;
    var r = cupCanvas.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    cupCanvas.style.transform = 'perspective(900px) rotateX(' + (-py * 14).toFixed(2) + 'deg) rotateY(' + (px * 14).toFixed(2) + 'deg)';
  });
  cupCanvas.addEventListener('pointerleave', function () { cupCanvas.style.transform = ''; });
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
      sfxClink();
    });
  });
  btnAct3.addEventListener('click', function () {
    if (!S.settled) return;
    openStage(3);
    showAct(3);
    sfxDoor();
  });

  /* ---------- stage 3 ---------- */
  var deckEl = $('tarot-deck');
  var BACK_SVG =
    '<svg viewBox="0 0 120 200" width="100%" height="100%" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="3" width="114" height="194" rx="2" fill="#1b1109" stroke="#b08a3e" stroke-width="2"/>' +
    '<rect x="11" y="11" width="98" height="178" rx="1" fill="none" stroke="#b08a3e" stroke-width="1" opacity="0.7"/>' +
    '<circle cx="60" cy="100" r="40" fill="none" stroke="#b08a3e" stroke-width="1.5"/>' +
    '<circle cx="60" cy="100" r="30" fill="none" stroke="#b08a3e" stroke-width="0.8" stroke-dasharray="2 3"/>' +
    '<path d="M60 50 L66 94 L110 100 L66 106 L60 150 L54 106 L10 100 L54 94 Z" fill="#b08a3e" opacity="0.88"/>' +
    '<circle cx="60" cy="100" r="7" fill="#1b1109" stroke="#b08a3e" stroke-width="1.5"/>' +
    '<path d="M24 24 Q60 40 96 24" fill="none" stroke="#b08a3e" stroke-width="1.2"/>' +
    '<path d="M24 176 Q60 160 96 176" fill="none" stroke="#b08a3e" stroke-width="1.2"/>' +
    '<circle cx="20" cy="20" r="3" fill="#b08a3e"/><circle cx="100" cy="20" r="3" fill="#b08a3e"/>' +
    '<circle cx="20" cy="180" r="3" fill="#b08a3e"/><circle cx="100" cy="180" r="3" fill="#b08a3e"/>' +
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
      b.setAttribute('aria-label', '第 ' + (pos + 1) + ' 幅石版画牌背，点击翻开');
      b.innerHTML = '<span class="back">' + BACK_SVG + '</span>';
      deckEl.appendChild(b);
    });
  }
  function resetSlots() {
    [0, 1, 2].forEach(function (i) {
      $('slot-' + i).querySelector('.slot-inner').innerHTML = '<div class="slot-empty">此处静候一幅石版画</div>';
    });
    $('drawn-counter').textContent = '0 / 3';
    $('btn-to-act4').disabled = true;
    $('btn-draw-all').disabled = false;
    $('spread-banner').hidden = true;
    $('btn-to-act4').classList.remove('btn-ready-pulse');
  }
  function slotReading(slot, card, rev) {
    return card.scene + '。' + (rev ? card.rev : card.up) + '。' + card.pos[slot];
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
      '<div class="slot-card slot-in"><div class="img-wrap"><div class="card-3d">' +
      '<div class="card-face card-face-back">' + BACK_SVG + '</div>' +
      '<div class="card-face card-face-front"><img src="' + f.card.img + '" width="460" height="793" alt="1909莱德·伟特塔罗 ' +
      esc(f.card.name) + (f.rev ? '（逆位）' : '（正位）') + '"' + (f.rev ? ' class="is-rev"' : '') + '></div></div></div>' +
      '<h4>' + esc(f.card.n + ' ' + f.card.name) + '</h4>' +
      '<span class="orient">' + (f.rev ? '逆位' : '正位') + '</span>' +
      '<p>' + esc(slotReading(slot, f.card, f.rev)) + '</p></div>';
    $('drawn-counter').textContent = S.drawn.length + ' / 3';
    sfxFlip(slot);
    if (S.drawn.length === 3) {
      $('btn-to-act4').disabled = false;
      $('btn-draw-all').disabled = true;
      openStage(4);
      $('spread-banner').hidden = false;
      $('btn-to-act4').classList.add('btn-ready-pulse');
    }
  }
  deckEl.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.deck-card') : null;
    if (!b || b.disabled || S.drawn.length >= 3) return;
    drawNext(b);
  });
  var shuffling = false;
  $('btn-shuffle').addEventListener('click', function () {
    if (shuffling) return;
    shuffling = true;
    var cards = $$('.deck-card', deckEl);
    sfxShuffle();
    function setVars(fn) {
      cards.forEach(function (c, i) {
        var v = fn(c, i, cards.length);
        c.style.setProperty('--tx', v[0] + 'px');
        c.style.setProperty('--ty', v[1] + 'px');
        c.style.setProperty('--rot', v[2] + 'deg');
      });
    }
    function settle() {
      var live = $$('.deck-card', deckEl);
      shuffled(live, Math.random).forEach(function (c) { deckEl.appendChild(c); });
      setVars(function () { return [0, 0, 0]; });
      setTimeout(function () {
        deckEl.classList.remove('is-fanning');
        shuffling = false;
      }, reduced ? 0 : 280);
    }
    if (reduced) {
      settle();
    } else {
      var dr = deckEl.getBoundingClientRect();
      var dcx = dr.left + dr.width / 2, dcy = dr.top + dr.height / 2;
      var rects = cards.map(function (c) { var r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      deckEl.classList.add('is-fanning');
      setVars(function (c, i) { return [(dcx - rects[i][0]) * 0.92, (dcy - rects[i][1]) * 0.92, (i % 3 - 1) * 3]; });
      setTimeout(function () {
        setVars(function (c, i, n) {
          var u = n > 1 ? i / (n - 1) : 0.5;
          var tx = dcx + (u - 0.5) * dr.width * 0.8, ty = dcy - 36 * (1 - Math.pow(2 * u - 1, 2)) + 14;
          return [tx - rects[i][0], ty - rects[i][1], -24 + 48 * u];
        });
      }, 260);
      setTimeout(settle, 680);
    }
    if (S.mode === 'free' && S.drawn.length < 3) {
      var used = S.drawn.map(function (d) { return d.card.id; });
      var pool = shuffled(CARDS.filter(function (c) { return used.indexOf(c.id) < 0; }), Math.random);
      for (var i = S.drawn.length; i < 3; i++) {
        S.fate[i] = { card: pool[i - S.drawn.length], rev: Math.random() < 0.38 };
      }
    }
    var mn = document.querySelector('.mat-note');
    if (mn) mn.textContent = S.mode === 'daily' ? '牌已轻洗 · 每日一签的牌运不会更改，请从下方翻开三幅石版画。' : '牌已重新洗切 · 换一副心境，从下方翻开三幅石版画。';
  });
  $('btn-draw-all').addEventListener('click', function () {
    var left = 3 - S.drawn.length;
    if (left <= 0) return;
    for (var i = 0; i < left; i++) {
      (function (d) { setTimeout(function () { drawNext(null); }, d); })(reduced ? 0 : i * 320);
    }
  });
  ['btn-to-act4', 'btn-banner-oracle'].forEach(function (id) {
    var b = $(id);
    if (!b) return;
    b.addEventListener('click', function () {
      if (S.drawn.length < 3) return;
      openStage(4);
      showAct(4);
      sfxDoor();
    });
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
      whisper: whisperText(), intent: S.intent, sign: S.sign,
      duoMode: !!S.duoMode, compName: S.companionName || '某位故人', compEl: S.companionElement
    };
    var cipherCode = 'MR' + hashStr(seedKey() + res.score).toString(36).toUpperCase().slice(0, 5);
    res.cipher = '摩伊拉夜话笺【' + sr.code + '】' + t.name + ' + ' +
      res.cards.map(function (c) { return c.card.name + (c.rev ? '逆' : '正'); }).join(' / ') +
      '，今夜星轨契合度 ' + sr.score + '，来摩伊拉咖啡馆借一盏灯。暗号 ' + cipherCode;
    S.result = res;

    $('rank-card').setAttribute('data-rank', sr.code);
    $('rank-name').textContent = rank.name;
    countUp($('final-score'), sr.score);
    countUp(hudScore, sr.score, '星轨契合 ');

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
    inkReveal();
    saveHistory(res);
    renderHistory();
    sfxSeal();
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
    if (revs.length === 0) return '三幅画皆正位朝着你，杯底与桌布像两盏相对的灯，彼此照亮，今夜只管放手去做。';
    if (revs.length === 1) return '只有「' + revs[0].card.name + '」是倒悬着的，杯底图腾提起的那处盲点，多半就藏在这幅画里，先轻轻把它扶正。';
    if (revs.length === 2) return '两幅画倒悬着，逆风是有的，可杯底图腾仍替你留了一道缝隙，请把力气花在「' +
      cards.filter(function (c) { return !c.rev; })[0].card.name + '」所指的方向上。';
    return '三幅画都倒悬着，这不是判词，只是长夜替你按下的一枚慢板记号，杯底图腾给的那句话，正是逆风里最稳的一步。';
  }
  var WAX_SEAL = '<svg class="wax-seal stamp-ready" width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M32 3C40 2 44 6 50 9C57 13 60 20 61 28C62 38 58 46 52 52C46 58 38 62 30 61C20 60 12 55 8 47C3 39 3 28 7 20C11 11 22 4 32 3Z" fill="#a8281e"/>' +
    '<circle cx="32" cy="32" r="21" fill="none" stroke="#c9a24b" stroke-width="1.5" opacity="0.8"/>' +
    '<path d="M36 19A13 13 0 1 0 36 45A10 10 0 1 1 36 19Z" fill="#c9a24b"/>' +
    '<path d="M42 26L43.5 30.5L48 32L43.5 33.5L42 38L40.5 33.5L36 32L40.5 30.5Z" fill="#c9a24b"/></svg>';
  var DUO = {
    fire_fire: '两支火把在加拉塔桥头相遇，夜雾为之退让；同燃者亦需一隅暗处歇息。',
    fire_earth: '你点灯，他守炉；佩拉街石阶记得这份脚步，慢一些，火才烧得长久。',
    fire_air: '风替火传信，火替风取暖；独立大街的电车铃，正为你们报时。',
    fire_water: '沸水遇炭，满室蒸汽如雾中楼阁；各退半步，便是一壶好咖啡。',
    earth_earth: '两块老墙砖并肩百年，不言而固；莫让沉默长成青苔。',
    earth_air: '一人是根，一人是帆；系好缆绳，博斯普鲁斯的风只吹向肯等的人。',
    earth_water: '河床承接流水，流水润泽河床；你们的誓约比金角湾潮汐更准时。',
    air_air: '两封信在海峡上空交错，各自抵达；记得落款，免得只剩回声。',
    air_water: '雨落海面，涟漪替风写诗；温柔是你们的语言，也要学会说不。',
    water_water: '两只杯底的咖啡渣竟画出同一座岛；深情如此，也请为彼此留一盏灯。'
  };
  var DUO_ORD = ['fire', 'earth', 'air', 'water'];
  function duoProse(a, b, name, totemName, cardName) {
    var k = [a, b].sort(function (x, y) { return DUO_ORD.indexOf(x) - DUO_ORD.indexOf(y); }).join('_');
    return '双人星轨合参：你与' + name + '，' + DUO[k] + totemName + '在杯底作证，' + cardName + '为你们执灯。';
  }
  function oracleHTML(r) {
    var t = TOTEMS[r.totem];
    var I = INTENTS[r.intent];
    var S_ = SIGNS[r.sign];
    var aff = (t.el === r.sign);
    var c = r.cards;
    function cardLine(i) {
      return SLOT_SHORT[i] + '落下的是「' + c[i].card.name + '」' + (c[i].rev ? '倒悬' : '正立') + '，' + c[i].card.scene + '，' +
        c[i].card.pos[i];
    }
    var p1 = '致推门而入的夜航人：佩拉区的雨落了一整夜，我们在烛下把咖啡温了又温，才等到你。你推门时带进一阵潮湿的海风，也带进「' +
      I.label + '」这一桩心事，像' + I.motif + '。' + S_.trait +
      (r.whisper ? '你在杯底留的那句「' + r.whisper + '」，我们读过了，没有告诉任何人。' : '你没有在杯底留话，咖啡渣便照着你此刻的心念，自己静静成了形。');
    var p2 = '烛光里翻开骨瓷杯，' + t.read + t.intent[r.intent] +
      (aff ? '这图腾与你的' + S_.label + '同声相应，今夜的星轨，便向你又靠近了一些。' : '这图腾与你的' + S_.label + '并不同频，倒像是特意来补你缺着的那一角。');
    var p3 = '烛芯轻轻爆了一声，我们翻开亚麻桌布上的三幅石版画。' + cardLine(0) + cardLine(1) + cardLine(2) +
      synthLine(c) + r.quote;
    var paras = [p1, p2, p3];
    if (r.duoMode) paras.push(duoProse(r.sign, r.compEl, r.compName, t.name, c[1].card.name));
    return '<section><div class="dossier-header"><h3>《摩伊拉夜话笺》</h3><span id="oracle-meta">' +
      esc(r.rankName + ' · ' + r.score + ' / 100' + (r.duoMode ? ' · 与「' + r.compName + '」同占' : '')) + '</span>' +
      '<button type="button" class="btn-instant-read" id="btn-instant-read">即刻展读全文</button></div>' +
      '<div id="oracle-body">' + paras.map(function (p) { return '<p class="ink-line">' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<div class="sign-row stamp-ready" id="oracle-sign"><p class="sign-off">摩伊拉三姊妹 · 书于佩拉区雨夜</p>' + WAX_SEAL + '</div></section>' +
      '<section><h3>今夜行事笺</h3><dl>' +
      '<dt>今日宜</dt><dd>' + esc(r.yi) + '</dd>' +
      '<dt>今日忌</dt><dd>' + esc(r.ji) + '</dd>' +
      '<dt>吉时</dt><dd>' + esc(r.hour) + '</dd>' +
      '<dt>随身信物</dt><dd>' + esc(t.item) + '</dd></dl></section>';
  }

  var inkTimers = [];
  function inkClear() { inkTimers.forEach(clearTimeout); inkTimers = []; }
  function inkReveal() {
    inkClear();
    var lines = $$('#oracle-dossier .ink-line');
    var stamps = $$('#oracle-dossier .stamp-ready');
    lines.forEach(function (p, i) {
      inkTimers.push(setTimeout(function () { p.classList.add('on'); sfxPen(); }, i * 480));
    });
    inkTimers.push(setTimeout(function () {
      stamps.forEach(function (n) { n.classList.add('on'); });
      sfxSeal();
    }, 1900));
  }
  function inkDone() {
    if (!inkTimers.length) return;
    inkClear();
    $$('#oracle-dossier .ink-line').forEach(function (p) { p.classList.add('on'); });
    $$('#oracle-dossier .stamp-ready').forEach(function (n) { n.classList.add('on'); });
  }
  $('oracle-dossier').addEventListener('click', inkDone);

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
      g.textAlign = 'right'; g.fillText('星轨契合 ' + r.score + ' / 100', px + pw - 18, py + 28);
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
      g.fillText('「' + INTENTS[r.intent].label + '」 · ' + SIGNS[r.sign].label +
        (r.duoMode ? ' · 与「' + r.compName + '·' + SIGNS[r.compEl].label + '」同占' : ''), W / 2, 928, 620);
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
    $('modal-note').textContent = '正在为你洗印拍立得笺……';
    openModal();
    renderPoster().then(function () {
      $('modal-note').textContent = S.cardURL ? '拍立得笺已洗印，可以下载留念。' : '拍立得笺已洗印，当前浏览器限制了直接下载，请截图留念。';
      sfxClink();
    });
  });
  $('btn-download-card').addEventListener('click', function () {
    if (!S.cardURL) { toast('请截图留下这张拍立得笺'); return; }
    var a = document.createElement('a');
    a.href = S.cardURL;
    a.download = 'moirae-oracle-card-' + dateStr() + '.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('拍立得笺已开始下载');
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
    $('totem-read').textContent = '倾倒杯中残渣，或在杯面按住轻旋，等咖啡渣贴着温热的瓷壁慢慢成形。';
    $('totem-intent').textContent = '';
    $('totem-luck').textContent = '';
    $('zone-reading').innerHTML = '<h3>杯面絮语</h3><p>待残渣沉定，轻点上方三处，杯沿、杯壁与杯底便会依次亮起，说与你听。</p>';
    cupCanvas.setAttribute('aria-label', '俯视的土耳其骨瓷咖啡杯，杯底有咖啡渣');
    hudTotem.textContent = '杯底图腾 · 待显影';
    hudScore.textContent = '星轨契合 0';
    buildDeck();
    resetSlots();
    $('final-score').textContent = '0';
    inkClear();
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
    toast('杯碟已收，换一桩心事再问');
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
    this.textContent = S.sound ? '器物声效：开' : '器物声效：关';
    this.setAttribute('aria-pressed', S.sound ? 'true' : 'false');
    if (S.sound) sfxDoor();
  });
  $('btn-bgm').addEventListener('click', function () { setBgm(!S.bgm); });
  if ($('btn-bgm-track')) {
    $('btn-bgm-track').addEventListener('click', function () {
      trackIdx = (trackIdx + 1) % TRACKS.length;
      this.textContent = TRACKS[trackIdx].label;
      ensureAudio();
      if (!S.bgm) setBgm(true); else startBgmLoop();
      sfxClink();
    });
  }

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
