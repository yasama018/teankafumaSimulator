const COEF = 2*1.3*1.25, all = 0, allNotMe = 1, myCurAtk = "a", always = 100;
let comp = [], GLOBAL_TURN = 1;
let lastDmg = 0, lastAtvDmg = 0;
const priorityList = ["공고증"];
class Boss {
   constructor() {
      // this.hp = 10854389981;
      // this.maxHp = 10854389981;
      this.name = "타깃"
      this.hp = 5063653034;
      this.maxHp = 5063653034;
      this.turnBuff = []; this.nestBuff = []; this.actTurnBuff = []; this.actNestBuff = [];
      this.li = [];
   }
   hit() {
      const atbf = [...this.actTurnBuff], anbf = [...this.actNestBuff];
      for(const a of atbf) if (a.act == "피격") to_tbf(this, a);
      for(const a of anbf) if (a.act == "피격") to_nbf(this, a);
   }
   setBuff() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      this.li = getBossBuffSizeList(tbf, nbf);
   }
}

const boss = new Boss();
class Champ {
   // ex) constructor(10011, "바니카", 5005, 2222, 3, "풍속성", "딜러", 100, 500)
   constructor(id, name, hp, atk, cd, el, ro, atkMag, ultMag) {
      this.id = id; this.name = name; this.hp = hp; this.atk = atk;
      this.cd = cd; this.curCd = cd; this.element = el; this.role = ro;
      this.turnBuff = []; this.nestBuff = []; this.actTurnBuff = []; this.actNestBuff = [];
      this.curAtkAtv = 0; this.curUltAtv = 0;
      this.atkMag = atkMag; this.ultMag = ultMag;
      this.canCDChange = true; this.isLeader = false; this.isActed = false;
   }
// [0공퍼증, 1공고증, 2받뎀증, 3일뎀증, 4받일뎀, 5궁뎀증, 6받궁뎀, 7발뎀증, 8받발뎀, 9가뎀증, 10속뎀증, 11받속뎀
// 12평발동, 13궁발동, 14평추가, 15궁추가, 16발효증, 17받직뎀, 18받캐뎀]
   getCurAtk() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      const li = getBuffSizeList(tbf, nbf);
      return Math.floor(this.atk*(1+li[0])+li[1]);
   }
   getAtkDmg() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      const li = getBuffSizeList(tbf, nbf);
      return this.getCurAtk()*(1+li[2])*(this.atkMag/100+li[14])*(1+li[3]+li[4]+li[17]+li[18])*(1+li[9])*(1+li[10]+li[11]);
   }
   getUltDmg() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      const li = getBuffSizeList(tbf, nbf);
      return this.getCurAtk()*(1+li[2])*(this.ultMag/100+li[15])*(1+li[5]+li[6]+li[17]+li[18])*(1+li[9])*(1+li[10]+li[11]);
   }
   getAtkAtvDmg() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      const li = getBuffSizeList(tbf, nbf);
      return this.getCurAtk()*(1+li[2])*((this.curAtkAtv/100+li[12])*(1+li[16]))*(1+li[5]+li[6]+li[7]+li[8]+li[17]+li[18])*(1+li[9])*(1+li[10]+li[11]);
   }
   getUltAtvDmg() {
      const tbf = [...this.turnBuff], nbf = [...this.nestBuff];
      const li = getBuffSizeList(tbf, nbf);
      return this.getCurAtk()*(1+li[2])*((this.curUltAtv/100+li[13])*(1+li[16]))*(1+li[5]+li[6]+li[7]+li[8]+li[17]+li[18])*(1+li[9])*(1+li[10]+li[11]);
   }
   act_attack() {
      const atbf_tmp = [...this.actTurnBuff], anbf_tmp = [...this.actNestBuff];
      const atbf = atbf_tmp.filter(item => item.type != "공고증");
      const anbf = anbf_tmp.filter(item => item.type != "공고증");
      const tmp1 = atbf_tmp.filter(item => item.type == "공고증");
      const tmp2 = anbf_tmp.filter(item => item.type == "공고증");

      for(const a of atbf) {
         if (a.act == "평" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_tbf(this, a);
      }
      for(const a of anbf) {
         if (a.act == "평" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_nbf(this, a);
      }
      for(const a of tmp1) {
         if (a.act == "평" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_tbf(this, a);
      }
      for(const a of tmp2) {
         if (a.act == "평" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_nbf(this, a);
      }
      this.isActed = true;
   }
   act_ultimate() {
      const atbf_tmp = [...this.actTurnBuff], anbf_tmp = [...this.actNestBuff];
      const atbf = atbf_tmp.filter(item => item.type != "공고증");
      const anbf = anbf_tmp.filter(item => item.type != "공고증");
      const tmp1 = atbf_tmp.filter(item => item.type == "공고증");
      const tmp2 = anbf_tmp.filter(item => item.type == "공고증");
      for(const a of atbf) {
         if (a.act == "궁" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_tbf(this, a);
      }
      for(const a of anbf) {
         if (a.act == "궁" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_nbf(this, a);
      }
      for(const a of tmp1) {
         if (a.act == "궁" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_tbf(this, a);
      }
      for(const a of tmp2) {
         if (a.act == "궁" || a.act == "행동" || (a.act == "공격" && this.ultMag > 0)) to_nbf(this, a);
      }
      this.isActed = true;
   }
   heal() {
      const atbf = [...this.actTurnBuff], anbf = [...this.actNestBuff];
      for(const a of atbf) if (a.act == "힐") to_tbf(this, a);
      for(const a of anbf) if (a.act == "힐") to_nbf(this, a);
   }
   act_defense() {
      const atbf = [...this.actTurnBuff], anbf = [...this.actNestBuff];
      for(const a of atbf) if (a.act == "방" || a.act == "행동") to_tbf(this, a);
      for(const a of anbf) if (a.act == "방" || a.act == "행동") to_nbf(this, a);
      this.isActed = true;

      setLast0();
   }
}
function sortBuff(a, b) {
   const indexA = priorityList.indexOf(a.type);
   const indexB = priorityList.indexOf(b.type);
   const priorityA = indexA === -1 ? -Infinity : indexA;
   const priorityB = indexB === -1 ? -Infinity : indexB;
   return priorityA - priorityB;
}

function nextTurn() {
   GLOBAL_TURN += 1;
   for(let i = 0; i < comp.length; i++) {
      comp[i].curCd = comp[i].curCd <= 0 ? 0 : comp[i].curCd-1;
      comp[i].turnBuff = comp[i].turnBuff.filter(item => item.turn > GLOBAL_TURN)
      comp[i].actTurnBuff = comp[i].actTurnBuff.filter(item => item.ex > GLOBAL_TURN);
      comp[i].actNestBuff = comp[i].actNestBuff.filter(item => item.ex > GLOBAL_TURN);
      comp[i].isActed = false;
   }
   boss.turnBuff = boss.turnBuff.filter(item => item.turn > GLOBAL_TURN)
   boss.actTurnBuff = boss.actTurnBuff.filter(item => item.ex > GLOBAL_TURN);
   boss.actNestBuff = boss.actNestBuff.filter(item => item.ex > GLOBAL_TURN);
}

// turnBuff = {type: 버프종류, size: 버프량, name: name, turn:turn}
function tbf(me, ty, s, n, t) {
   if (me == all) {for(let c of comp) tbf(c, ty, s, n, t);}
   else me.turnBuff.push({type: ty, size: s, name: n, turn: GLOBAL_TURN + t});
}
// nestBuff = {type: 버프종류, size: 버프량, name: name, nest: 중첩, maxNest: 맥스중첩}
function nbf(me, ty, s, n, e, e2) {
   if (me == all) {for(let c of comp) nbf(c, ty, s, n, e, e2);}
   else {
      const exist = me.nestBuff.find(buf => buf.name == n);
      if (exist) {
         exist.nest += e;
         if (exist.nest > exist.maxNest) exist.nest = exist.maxNest;
      } else me.nestBuff.push({type: ty, size: s, name: n, nest: e, maxNest: e2});
   }
}
// 행동시 턴제 버프를 turnBuff에 추가
function to_tbf(me, tmp) {
   if (tmp.ex == GLOBAL_TURN) return;
   let size = tmp.size;
   if (typeof size == 'string') {
      if (size.charAt(0) == myCurAtk) size = Number(size.substring(1)) * me.getCurAtk();
   }
   if (tmp.type == "힐") {
      if (tmp.who == all) for(let c of comp) c.heal();
      else if (tmp.who == allNotMe) for(let c of comp) if (c.id != me.id) c.heal();
      else tmp.who.heal();
   } else {
      if (tmp.who == all) for(let c of comp) tbf(c, tmp.type, size, tmp.name, tmp.turn);
      else if (tmp.who == allNotMe) {
         for(let c of comp) if (c.id != me.id) tbf(c, tmp.type, size, tmp.name, tmp.turn);
      } else tbf(tmp.who, tmp.type, size, tmp.name, tmp.turn);
   }
}
// 행동시 중첩형 버프를 nestBuff에 추가
function to_nbf(me, tmp) {
   if (tmp.ex == GLOBAL_TURN) return;
   let size = tmp.size;
   if (typeof tmp.size == 'string') {
      if (tmp.size.charAt(0) == myCurAtk) size = Number(tmp.size.substring(1)) * me.getCurAtk();
   }
   if (tmp.who == all) for(let c of comp) nbf(c, tmp.type, size, tmp.name, tmp.nest, tmp.maxNest);
   if (tmp.who == allNotMe) {
      for(let c of comp) if (c.id != me.id) nbf(c, tmp.type, size, tmp.name, tmp.nest, tmp.maxNest);
   } else nbf(tmp.who, tmp.type, size, tmp.name, tmp.nest, tmp.maxNest);
}
// 행동 시 턴 버프 추가
// '누가' '무슨행동시' '누구에게' ~~ t턴 버프 부여 (trn턴)
function atbf(me, act, who, ty, s, n, t, trn) {
   if (me == all) {for(let c of comp) atbf(c, act, who, ty, s, n, t, trn);}
   else me.actTurnBuff.push({act:act, who:who, type: ty, size: s, name: n, turn: t, ex: GLOBAL_TURN + trn});
}
// 행동 시 중첩형 버프 추가
// '누가' '무슨행동시' '누구에게' ~~ 중첩 버프 부여 (trn턴)
function anbf(me, act, who, ty, s, n, e, e2, trn) {
   if (me == all) {for(let c of comp) anbf(c, act, who, ty, s, n, e, e2, trn);}
   else me.actNestBuff.push({act:act, who:who, type: ty, size: s, name: n, nest: e, maxNest: e2, ex: GLOBAL_TURN + trn});
}

function cdChange(me, size) {
   if (!me.canCDChange) return;
   me.curCd += size;
}

// buff들을 리스트에 버프량만큼 담아 리턴
function getBuffSizeList(tbf, nbf) {
   const res = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
   for(const bf of tbf) {
      if (bf.turn == GLOBAL_TURN) continue;
      switch(bf.type) {
         case "공퍼증": res[0] += bf.size/100; break;
         case "공고증": res[1] += bf.size/100; break;
         case "받뎀증": res[2] += bf.size/100; break;
         case "일뎀증": res[3] += bf.size/100; break;
         case "받일뎀": res[4] += bf.size/100; break;
         case "궁뎀증": res[5] += bf.size/100; break;
         case "받궁뎀": res[6] += bf.size/100; break;
         case "발뎀증": res[7] += bf.size/100; break;
         case "받발뎀": res[8] += bf.size/100; break;
         case "가뎀증": res[9] += bf.size/100; break;
         case "속뎀증": res[10] += bf.size/100; break;
         case "받속뎀": res[11] += bf.size/100; break;
         case "평발동": res[12] += bf.size/100; break;
         case "궁발동": res[13] += bf.size/100; break;
         case "평추가": res[14] += bf.size/100; break;
         case "궁추가": res[15] += bf.size/100; break;
         case "발효증": res[16] += bf.size/100; break;
         case "받직뎀": res[17] += bf.size/100; break;
         case "받캐뎀": res[18] += bf.size/100; break;
         default: console.log("버프 누락 : " + bf.type);
      }
   }
   for(const bf of nbf) {
      if (bf.nest > bf.maxNest) bf.nest = bf.maxNest;
      switch(bf.type) {
         case "공퍼증": res[0] += bf.size*bf.nest/100; break;
         case "공고증": res[1] += bf.size*bf.nest/100; break;
         case "받뎀증": res[2] += bf.size*bf.nest/100; break;
         case "일뎀증": res[3] += bf.size*bf.nest/100; break;
         case "받일뎀": res[4] += bf.size*bf.nest/100; break;
         case "궁뎀증": res[5] += bf.size*bf.nest/100; break;
         case "받궁뎀": res[6] += bf.size*bf.nest/100; break;
         case "발뎀증": res[7] += bf.size*bf.nest/100; break;
         case "받발뎀": res[8] += bf.size*bf.nest/100; break;
         case "가뎀증": res[9] += bf.size*bf.nest/100; break;
         case "속뎀증": res[10] += bf.size*bf.nest/100; break;
         case "받속뎀": res[11] += bf.size*bf.nest/100; break;
         case "평발동": res[12] += bf.size*bf.nest/100; break;
         case "궁발동": res[13] += bf.size*bf.nest/100; break;
         case "평추가": res[14] += bf.size*bf.nest/100; break;
         case "궁추가": res[15] += bf.size*bf.nest/100; break;
         case "발효증": res[16] += bf.size*bf.nest/100; break;
         case "받직뎀": res[17] += bf.size*bf.nest/100; break;
         case "받캐뎀": res[18] += bf.size*bf.nest/100; break;
         default: console.log("버프 누락 : " + bf.type);
      }
   }
   boss.setBuff();
   for(let i = 0; i < 17; i++) res[i] += boss.li[i];
   return res;
}

function getBossBuffSizeList(tbf, nbf) {
   const res = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
   for(const bf of tbf) {
      if (bf.turn == GLOBAL_TURN) continue;
      switch(bf.type) {
         case "공퍼증": res[0] += bf.size/100; break;
         case "공고증": res[1] += bf.size/100; break;
         case "받뎀증": res[2] += bf.size/100; break;
         case "일뎀증": res[3] += bf.size/100; break;
         case "받일뎀": res[4] += bf.size/100; break;
         case "궁뎀증": res[5] += bf.size/100; break;
         case "받궁뎀": res[6] += bf.size/100; break;
         case "발뎀증": res[7] += bf.size/100; break;
         case "받발뎀": res[8] += bf.size/100; break;
         case "가뎀증": res[9] += bf.size/100; break;
         case "속뎀증": res[10] += bf.size/100; break;
         case "받속뎀": res[11] += bf.size/100; break;
         case "평발동": res[12] += bf.size/100; break;
         case "궁발동": res[13] += bf.size/100; break;
         case "평추가": res[14] += bf.size/100; break;
         case "궁추가": res[15] += bf.size/100; break;
         case "발효증": res[16] += bf.size/100; break;
         case "받직뎀": res[17] += bf.size/100; break;
         case "받캐뎀": res[18] += bf.size/100; break;
         default: console.log("버프 누락 : " + bf.type);
      }
   }
   for(const bf of nbf) {
      if (bf.nest > bf.maxNest) bf.nest = bf.maxNest;
      switch(bf.type) {
         case "공퍼증": res[0] += bf.size*bf.nest/100; break;
         case "공고증": res[1] += bf.size*bf.nest/100; break;
         case "받뎀증": res[2] += bf.size*bf.nest/100; break;
         case "일뎀증": res[3] += bf.size*bf.nest/100; break;
         case "받일뎀": res[4] += bf.size*bf.nest/100; break;
         case "궁뎀증": res[5] += bf.size*bf.nest/100; break;
         case "받궁뎀": res[6] += bf.size*bf.nest/100; break;
         case "발뎀증": res[7] += bf.size*bf.nest/100; break;
         case "받발뎀": res[8] += bf.size*bf.nest/100; break;
         case "가뎀증": res[9] += bf.size*bf.nest/100; break;
         case "속뎀증": res[10] += bf.size*bf.nest/100; break;
         case "받속뎀": res[11] += bf.size*bf.nest/100; break;
         case "평발동": res[12] += bf.size*bf.nest/100; break;
         case "궁발동": res[13] += bf.size*bf.nest/100; break;
         case "평추가": res[14] += bf.size*bf.nest/100; break;
         case "궁추가": res[15] += bf.size*bf.nest/100; break;
         case "발효증": res[16] += bf.size*bf.nest/100; break;
         case "받직뎀": res[17] += bf.size*bf.nest/100; break;
         case "받캐뎀": res[18] += bf.size*bf.nest/100; break;
         default: console.log("버프 누락 : " + bf.type);
      }
   }
   return res;
}

function bossAttack(me) {
   const atkDmg = me.getAtkDmg();
   const atkAtvDmg = me.getAtkAtvDmg();
   boss.hp -= (lastDmg = atkDmg);
   boss.hp -= (lastAtvDmg = atkAtvDmg);
   if (boss.hp < 0) boss.hp = 0; 
   //console.log(`일반공격 데미지 : ${lastDmg}\n발동기 데미지 : ${lastAtvDmg}`);
   if (atkDmg > 0) boss.hit(me);
}
function bossUltAttack(me) {
   const ultDmg = me.getUltDmg();
   const ultAtvDmg = me.getUltAtvDmg();
   boss.hp -= (lastDmg = ultDmg);
   boss.hp -= (lastAtvDmg = ultAtvDmg);
   if (boss.hp < 0) boss.hp = 0; 
   //console.log(`궁극기 데미지 : ${lastDmg}\n발동기 데미지 : ${lastAtvDmg}`);
   if (ultDmg > 0) boss.hit(me);
   me.curCd = me.cd;
}
function setLast0() {
   lastDmg = 0;
   lastAtvDmg = 0;
}

function deleteBuff(me, name) {
   // turnBuff 배열에서 name이 일치하는 요소 제거
   for (let i = me.turnBuff.length - 1; i >= 0; i--) {
      if (me.turnBuff[i].name === name) me.turnBuff.splice(i, 1);
   }
   // nestBuff 배열에서 name이 일치하는 요소 제거
   for (let i = me.nestBuff.length - 1; i >= 0; i--) {
      if (me.nestBuff[i].name === name) me.nestBuff.splice(i, 1);
   }
}

function getElementCnt(el) {let res = 0; for(let c of comp) if (c.element == el) res++; return res;}
function getRoleCnt(ro) {let res = 0; for(let c of comp) if (c.role == ro) res++; return res;}
function getElementIdx() {
   let res = [];
   const args = Array.from(arguments);
   for(let i = 0; i < 5; i++) if (args.includes(comp[i].element)) res.push(i);
   return res;
}

function getRoleIdx() {
   let res = [];
   const args = Array.from(arguments);
   for(let i = 0; i < 5; i++) if (args.includes(comp[i].role)) res.push(i);
   return res;
}

function hpUpAll(amount) {for(let c of comp) c.hp *= (1 + amount/100);}


/* -------------------------------------------------------------------------------------- */
const characterData = [
   {id:10001, name:"바알", hp:962383, atk:254657, cd:4, el:"화", ro:"딜", atkMag:100, ultMag:422},
   {id:10002, name:"사탄", hp:1384007, atk:177152, cd:3, el:"암", ro:"탱", atkMag:50, ultMag:0},
   
   {id:10022, name:"놀라이티", hp:922524, atk:292745, cd:4, el:"화", ro:"딜", atkMag:100, ultMag:514},
   {id:10096, name:"로티아", hp:894179, atk:302045, cd:4, el:"암", ro:"섶", atkMag:0, ultMag:0},
   {id:10098, name:"크즈카", hp:941125, atk:286987, cd:4, el:"광", ro:"딜", atkMag:100, ultMag:514},
   {id:10128, name:"크이블", hp:956625, atk:282116, cd:4, el:"광", ro:"딜", atkMag:100, ultMag:514},
   {id:10042, name:"수이블", hp:956625, atk:282116, cd:4, el:"수", ro:"딜", atkMag:100, ultMag:514},
   
];

function setDefault(me) {
   switch(me.id) {
   case 10001: // 바알
      me.leader = function() {
         nbf(me, "공퍼증", 125, "마왕 바알의 꿍꿍이", 1, 1);
      }
      me.passive = function() {
         nbf(me, "공퍼증", 25, "마왕의 육체", 1, 1);
         nbf(me, "일뎀증", 10, "일반 공격 데미지+", 1, 1);
      }
      me.attack = function() {
         me.act_attack();
         bossAttack(me);
      };
      me.ultimate = function() {
         me.act_ultimate();
         me.turnBuff.push(tbf("공퍼증", 35, "맹렬한 불길", 3));
         bossUltAttack(me);
         cdChange(me, -1);
      };
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {};
      me.turnover = function() {};
      return me;
   case 10002: // 사탄
      me.leader = function() {
         nbf(me, "공퍼증", -25, "마왕 사탄의 호기", 1, 1);
      }
      me.passive = function() {}
      me.attack = function() {
         me.act_attack();
         bossAttack(me);
         me.act_defense();
      };
      me.ultimate = function() {
         me.act_ultimate();
         nbf(me, "공퍼증", 30, "마왕 사탄의 호기", 1, 1);
         bossUltAttack(me);
         me.act_defense();
      };
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {
         me.heal();
      };
      me.turnover = function() {};
      return me;
   case 0 :
      //TODO: 계속 할 것
      me.ultimate = function() {
         me.act_ultimate() // 모든 궁사용시 버프를 적용
         // 툴팁의 궁 이전 버프 적용
         bossUltAttack(me); // 궁 + 발동기
         // 툴팁의 궁 이후 버프 적용
      };
      me.attack = function() {
         me.act_attack() // 모든 공격시 버프를 적용
         // 툴팁의 공격 이전 버프 적용
         bossAttack(me); // 공격 + 발동기
         // 툴팁의 공격 이후 버프 적용
      };
      me.leader = function() {
      }
      me.passive = function() {
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {};
      me.turnover = function() {};
      return me;



      
// 10022 10096 10098 10128 10042
   case 10022 : // 놀라이티
      me.ultbefore = function() {
         // 궁사용시 타깃은 피격 시 놀라에게 받는 데미지 15% 증가 1중첩(추가타에 적용)
         nbf(me, "받캐뎀", 15, "배 가르기1", 1, 8);
      }
      me.ultafter = function() {
         deleteBuff(me, "배 가르기1"); // 패시브 극도의 흥분 : 궁 발동시 배가르기 제거
         deleteBuff(me, "극도의 흥분"); // 패시브 : 궁 발동시 극도의 흥분 제거
         
         // 타깃은 피격 시 놀라에게 받는 데미지 15% 증가 (8중첩)
         anbf(boss, "피격", me, "받캐뎀", 15, "배 가르기1", 1, 8, 4);
         // 타깃은 받는 데미지 30% 증가 (1중첩)
         nbf(boss, "받뎀증", 30, "배 가르기2", 1, 1);
      }
      me.ultimate = function() {ultLogic(me);};
      me.atkbefore = function() {}
      me.atkafter = function() {}
      me.attack = function() {atkLogic(me);};
      me.leader = function() {
         hpUpAll(20); // 아군 전체의 최대 hp 20% 증가
         for(let c of comp) tbf(c, "궁뎀증", 50, "전쟁의 광기1", always); // 아군 전체의 궁극기 데미지 50% 증가
         for(let idx of getRoleIdx("딜", "디", "탱")) {
            tbf(comp[idx], "공퍼증", 40, "전쟁의 광기2", always); // 아군 딜디탱은 공격 데미지 40% 증가
            tbf(comp[idx], "가뎀증", 25, "전쟁의 광기3", always); // 아군 딜디탱은 가하는 데미지 25% 증가
            if (idx != 0) {
               // 자신을 제외한 아군 딜디탱은 궁극기 사용 시 1번에게 공격 데미지 90%증가
               atbf(comp[idx], "궁", comp[0], "공퍼증", 90, "학살 시간이다!1", 1, always);
               // 자신을 제외한 아군 딜디탱은 궁극기 사용 시 1번에게 궁사용시 데미지 80% 추가
               atbf(comp[idx], "궁", comp[0], "궁추가", 80, "학살 시간이다!2", 1, always);
            }
         }
         // 매턴 아군전체 힐(50턴) -> turnstart에 추가됨
         // 궁발동시 아군 전체 현재공200만큼 치유
         atbf(me, "궁", all, "힐", myCurAtk+200, "전쟁의 광기4", 1, always);

      }
      me.passive = function() {
         // 극도의 흥분 : 방어시 자신의 공격 데미지 100% 증가
         anbf(me, "방", me, "공퍼증", 100, "극도의 흥분", 1, 1, always);
         // 물고 늘어지기 : 궁극기 발동 시 자신이 가하는 데미지 12% 증가(최대5)
         anbf(me, "궁", me, "가뎀증", 12, "물고 늘어지기", 1, 5, always);
         // 광견 : 일반 공격 시 궁극기 데미지 증가(2턴), 궁발동시 100% 추가데미지(2턴)
         atbf(me, "평", me, "궁뎀증", 50, "아드레날린1", 2, always);
         atbf(me, "평", me, "궁추가", 100, "아드레날린2", 2, always);
         // 궁극기 추격+ : 궁극기 발동 시 30% 추가데미지
         tbf(me, "궁추가", 30, "궁극기 추격+", always)
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {
         // 리더효과 매턴 아군 전체 힐(50턴)
         if (me.isLeader && GLOBAL_TURN == 2) for(let c of comp) c.heal();
      };
      me.turnover = function() {};
      return me;
   case 10096 : // 로티아
      me.ultbefore = function() {
         // 아군 전체는 자신의 현재 공40%만큼 공격력 증가 (1턴)
         for(let c of comp) tbf(c, "공고증", 40*me.getCurAtk(), "피로 물든 밤의 광기1", 1);
         // 딜디탱에게 공격 시 자신공 15%만큼 자신제외전부 공격력 증가 1턴 부여 (1턴)
         for(let idx of getRoleIdx("딜", "디", "탱")) {
            atbf(comp[idx], "공격", allNotMe, "공고증", `${myCurAtk}15`, "피로 물든 밤의 광기2", 1, 1);
         }
      }
      me.ultafter = function() {}
      me.ultimate = function() {ultLogic(me);};
      me.atkbefore = function() {
         // 평타 : 자신의 공격 데미지 30%만큼 아군 전체 공격 데미지 증가(1턴)
         for(let c of comp) tbf(c, "공고증", 30*me.getCurAtk(), "피의 축복", 1);
      }
      me.atkafter = function() {}
      me.attack = function() {
         atkLogic(me);
      };
      me.leader = function() {
         // 순결의 향연 : 아군 암속성 캐릭터는 공100%증가, 궁뎀증 50%;
         for(let idx of getElementIdx("암")) {
            nbf(comp[idx], "공퍼증", 100, "은혜1", 1, 1);
            nbf(comp[idx], "궁뎀증", 50, "은혜2", 1, 1);
         }
      }
      me.passive = function() {
         // 할로윈의 광기1 : 일반공격시 아군전체 평딜30%증가(1턴)
         atbf(me, "평", all, "일뎀증", 30, "할로윈의 광기1", 1, always);
         // 할로윈의 광기2 : 궁발동시 아군전체 궁뎀증10%(2턴)
         atbf(me, "궁", all, "궁뎀증", 10, "할로윈의 광기2", 2, always);
         // 여왕의 칠중주 : 첫턴 시작시 아군 전체가 소나타(1턴) 획득
         // 소나타 : 행동 시 아군 전체의 공격 데미지 증가 15% (50턴)
         for(let idx of getRoleIdx("딜", "디", "탱")){
            atbf(comp[idx], "행동", all, "공퍼증", 15, "소나타", 50, 1);
         }
         // 공격+
         tbf(me, "공퍼증", 10, "공격+", always);
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {
         // 패시브 피안개 : 4턴 지날 때마다 적군 전체가 받뎀증 30%(1턴)
         if ((GLOBAL_TURN-1)%4 == 0) tbf(boss, "받뎀증", 30, "피안개", 1);
      };
      me.turnover = function() {};
      return me;
   case 10128 : // 크이블
      me.ultbefore = function() {
         // 흔들리는 와인잔1 : 타깃이 받는 딜러의 데미지 50% 증가 (2중첩)
         // 받는 딜러 데미지가 ->  궁/평뎀증 판정
         for(let idx of getRoleIdx("딜")) nbf(comp[idx], "받직뎀", 50, "흔들리는 와인잔1", 1, 2);
         // 흔들리는 와인잔2 : 자신은 평타시 90% 데미지 추가 (4턴)
         tbf(me, "평추가", 90, "흔들리는 와인잔2", 4);
      }
      me.ultafter = function() {}
      me.ultimate = function() {ultLogic(me);};
      me.atkbefore = function() {}
      me.atkafter = function() {}
      me.attack = function() {atkLogic(me);};
      me.leader = function() {
         hpUpAll(20); // 아군 전체의 최대 hp 20% 증가
         nbf(all, "공퍼증", 40, "숨막히는 여왕", 1, 1); // 아군 전체 공퍼증40%
         let lightCnt = getElementCnt("광"), dealerCnt = getRoleCnt("딜");
         let lightPos = getElementIdx("광"), dealerPos = getRoleIdx("딜");
         // 팀에 최소 3명이 광속성이면 자신은
         if (lightCnt >= 3) {
            // 일반공격시 자신의 기본공30%만큼 아군딜러 공고증(4턴)
            for(const idx of dealerPos) {
               atbf(me, "평", comp[idx], "공고증", me.atk*30, "야릇한 음악1", 4, always);
            }
            // 일반공격시 광속뎀증 7% 증가(8중첩)
            for(const idx of lightPos) atbf(me, "평", comp[idx], "속뎀증", 7, "야릇한음악2", 1, 8, always);
         }
         // 팀에 최소 3명이 딜러이면
         if (dealerCnt >= 3) {
            // 딜러는
            for(const idx of dealerPos) {
               // 쿨 변경 무효
               comp[idx].canCDChange = false;
               // 자신 가뎀증 20%
               tbf(comp[idx], "가뎀증", 20, "무장방어1", always);
               // 일반공격시 공40% 추가뎀
               tbf(comp[idx], "평추가", 40, "무장방어2", always);
            }
         }
      }
      me.passive = function() {
         // 곡도 같은 눈썹 : 아군 딜러의 일뎀증 30%, 자신의 일뎀증 60%
         let dealerPos = getRoleIdx("딜");
         for(const idx of dealerPos) tbf(comp[idx], "일뎀증", 30, "곡도 같은 눈썹1", always);
         tbf(me, "일뎀증", 60, "곡도 같은 눈썹2", always);
         // 핏빛 입술 : 아군 딜러의 공퍼증 30%, 자신의 공퍼증 50%
         for(const idx of dealerPos) tbf(comp[idx], "공퍼증", 30, "핏빛 입술1", always);
         tbf(me, "공퍼증", 50, "핏빛 입술2", always);
         // 모든 것을 독점한 아름다움 : 아군 딜러 가뎀증 15%, 자신의 가뎀증 20%
         for(const idx of dealerPos) {
            tbf(comp[idx], "가뎀증", 15, "모든 것을 독점한 아름다움1", always);
         }
         tbf(me, "가뎀증", 20, "모든 것을 독점한 아름다움2", always);
         // 가하는 데미지+ : 자신이 가하는 데미지 7.5% 증가
         tbf(me, "가뎀증", 7.5, "가하는 데미지+", always);
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {};
      me.turnover = function() {};
      return me;
   case 10098 : // 크즈카
      me.ultbefore = function() {
         // 연쇄 트랩 : 타깃이 받는 궁극기 데미지 22.5%증가 (2중첩)
         nbf(boss, "받궁뎀", 22.5, "연쇄 트랩!", 1, 2);
      }
      me.ultafter = function() {}
      me.ultimate = function() {ultLogic(me);};
      me.atkbefore = function() {}
      me.atkafter = function() {}
      me.attack = function() {atkLogic(me);};
      me.leader = function() {
         // 함께 놀수록 재밌는 법~
         // 아군 전체의 공격 데미지 40% 증가
         tbf(all, "공퍼증", 40, "함께 놀수록 재밌는 법~1", always);
         // 아군 전체의 최대 hp 10% 증가
         hpUpAll(10);
         // 아군 전체가 크리스마스 최고! 획득
         // 크리스마스 최고!1 : 탱커가 있으면 아군 전체가 공퍼증 50%
         if (getRoleCnt("탱") > 0) tbf(all, "공퍼증", 50, "크리스마스 최고!1", always);
         // 크리스마스 최고!2 : 2명이상 광속성이면 아군 전체가 공퍼증 25%
         if (getElementCnt("광") >= 2) tbf(all, "공퍼증", 25, "크리스마스 최고!2", always);
         // 크리스마스 최고!3 : 화속성 있으면 아군 전체가 공퍼증 25%
         if (getElementCnt("화") > 0) tbf(all, "공퍼증", 25, "크리스마스 최고!3", always);
      }
      me.passive = function() {
         // 시험작 999호 : 자신의 가뎀증 35%
         tbf(me, "가뎀증", 35, "시험작 999호1", always);
         // 공격+ : 자신의 공퍼증 10%
         tbf(me, "공퍼증", 10, "공격+", always);
         // 패시브 : 궁사용시 다방구 시작~ 4중첩만큼 데미지 추가
         anbf(me, "궁", boss, "받뎀증", 5, "다방구 시작~", 4, 11, always);
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {
         if (me.isLeader) {
            // 리더 : 5번째 턴에서 아군전체 궁뎀증 30% (1중첩)
            if (GLOBAL_TURN == 5) nbf(all, "궁뎀증", 30, "함께 놀수록 재밌는 법~2", 1, 1);
            // 리더 : 9번째 턴에서 아군 천체 가뎀증 20% (1중첩)
            if (GLOBAL_TURN == 9) nbf(all, "가뎀증", 20, "함께 놀수록 재밌는 법~3", 1, 1);
         }
      };
      me.turnover = function() {
         // 패시브 다방구 시작~ : 1턴마다 받뎀증 5% (11중첩)
         nbf(boss, "받뎀증", 5, "다방구 시작~", 1, 11);
      };
      return me;
   case 10042 : // 수이블
      me.ultbefore = function() {
         // 소녀의 연심은 무적!1 : 아군 수, 화 공퍼증 40%(1턴)
         for(let idx of getElementIdx("화", "수")) tbf(comp[idx], "공퍼증", 40, "소녀의 연심은 무적!1", 1);
         // 소녀의 연심은 무적!2 : 아군 수, 화 받속뎀 15%(2중첩)
         for(let idx of getElementIdx("화", "수")) nbf(comp[idx], "받속뎀", 15, "소녀의 연심은 무적!2", 1, 2);
      }
      me.ultafter = function() {}
      me.ultimate = function() {ultLogic(me);};
      me.atkbefore = function() {}
      me.atkafter = function() {}
      me.attack = function() {atkLogic(me);};
      me.leader = function() {
         // 고품격 우아함! 이블리스의 초호화 리조트!
         // 아군 전체의 공퍼증 100%
         tbf(all, "공퍼증", 100, "이블리스의 초호화 리조트!", always);
         // 자신이 공격 시 아군 전체가 최대hp 25% 아머 획득

         // 아군 전체가 딜러이면 모두 여름 만끽 발동
         if (getRoleCnt("딜") == 5) {
            // 여름 만끽1 : 공격 시 아군 전체를 치유
            atbf(all, "공격", all, "힐", 1, "여름 만끽 1", 1, always);
            // 여름 만끽2 : 궁발동시 아군 전체 아머 부여(1턴)
            // 여름 만끽3 : 공격시 아군 전체의 궁뎀증 5% (10중첩)
            anbf(all, "공격", all, "궁뎀증", 5, "여름 만끽3", 1, 10, always);
            // 여름 만끽4 : 공격시 수/화받속뎀 3% (10중첩)
            for(let idx of getElementIdx("수")) anbf(all, "공격", comp[idx], "받속뎀", 3, "여름 만끽4", 1, 10, always);
            for(let idx of getElementIdx("화")) anbf(all, "공격", comp[idx], "받속뎀", 3, "여름 만끽4", 1, 10, always);
         }
      }
      me.passive = function() {
         // 여름 해변의 꽃1 : 방어 시 수/화 아군이 받는 치유량 50% 증가
         // 여름 해변의 꽃2 : 궁발동시 수/화 아군의 공퍼증 15% 증가 (2중첩)
         for(let idx of getElementIdx("수"))
            anbf(me, "궁", comp[idx], "공퍼증", 15, "여름 해변의 꽃2", 1, 2, always);
         for(let idx of getElementIdx("화"))
            anbf(me, "궁", comp[idx], "공퍼증", 15, "여름 해변의 꽃2", 1, 2, always);
         // 나에게 굴복하라 : 가뎀증 25% 증가
         tbf(me, "가뎀증", 25, "나에게 굴복하라!", always);
         // 공격력 증가 : 자신의 공퍼증 10%
         tbf(me, "공퍼증", 10, "공격력 증가", always);
      }
      me.defense = function() {
         me.act_defense();
      }
      me.turnstart = function() {
         // 패시브 오만하구나! : 4턴마다 타깃이 받는 수/화속뎀증 40% (1턴)
         if ((GLOBAL_TURN-1)%4 == 0) {
            for(let idx of getElementIdx("수", "화")) tbf(comp[idx], "받속뎀", 40, "오만하구나!", 1);
         }
      };
      me.turnover = function() {};
      return me;

   default: return null;
      
   }
}
function ultLogic(me) {
   me.ultbefore();
   bossUltAttack(me);
   me.ultafter();
   me.act_ultimate();
}
function atkLogic(me) {
   me.atkbefore();
   bossAttack(me);
   me.atkafter();
   me.act_attack();
}
function hpUpAll(amount) {for(let c of comp) c.hp *= (1+amount/100);}
function hpUpMe(me, amount) {me.hp *= (1+amount/100);}
function show_console(idx) {
   console.log(boss_tbfToString() + "\n" + boss_nbfToString());
   console.log(anbfToString(comp[idx]) + "\n" + atbfToString(comp[idx]));
   console.log(tbfToString(comp[idx]) + "\n" + nbfToString(comp[idx]));
   console.log(buffListToString(comp[idx]));
}
function boss_tbfToString() {
   const list = [...boss.turnBuff];
   const str = ["-----------------------------", `boss`];
   for(const l of list) str.push(`${l.name} : ${l.type} ${l.type == "공고증" ? Math.floor(l.size/100) : l.size} (${l.turn >= always ? "상시" : (l.turn - GLOBAL_TURN + "턴")})`);
   return str.join("\n");
}
function boss_nbfToString() {
   const list = [...boss.nestBuff];
   const str = [];
   for(const l of list) str.push(`${l.name} : ${l.type} ${l.size*l.nest} (${l.nest}중첩)`);
   return str.join("\n");
}

function anbfToString(me) {
   const list = [...me.actNestBuff];
   const str = ["-----------------------------", `${me.name}`];
   for(const l of list) {
      const who = l.who == all ? "아군전체" : l.who == allNotMe ? "자신제외아군" : l.who.name;
      const aaact = l.act == "평" ? "평타" : l.act == "방" ? "방어" : l.act;
      str.push(`${aaact}시 ${who}에게 ${l.type} ${l.size} ${l.nest}중첩 (최대 ${l.maxNest}중첩) 부여 (${l.ex >= always ? "상시" : ((l.ex - GLOBAL_TURN)+"턴")}) : ${l.name}`);
   }
   return str.join("\n");
}
function atbfToString(me) {
   const list = [...me.actTurnBuff];
   const str = [];
   for(const l of list) {
      const who = l.who == all ? "아군전체" : l.who == allNotMe ? "자신제외아군" : l.who.name;
      const aaact = l.act == "평" ? "평타" : l.act == "방" ? "방어" : l.act;
      str.push(`${aaact}시 ${who}에게 ${l.type} ${l.size} (${l.turn}턴) 부여 (${l.ex >= always ? "상시" : ((l.ex - GLOBAL_TURN)+"턴")}) : ${l.name}`);
   }
   return str.join("\n");
}
function tbfToString(me) {
   const list = [...me.turnBuff];
   const str = [];
   for(const l of list) {
      str.push(`${l.type} ${l.type == "공고증" ? Math.floor(l.size/100) : l.size} (${l.turn >= always ? "상시" : (l.turn - GLOBAL_TURN + "턴")}) : ${l.name}`);
   }
   return str.join("\n");
}
function nbfToString(me) {
   const list = [...me.nestBuff];
   const str = [];
   for(const l of list) {
      str.push(`${l.type} ${l.size*l.nest} (${l.nest}중첩) : ${l.name}`);
   }
   return str.join("\n");
}
function buffListToString(me) {
   const tbf = [...me.turnBuff], nbf = [...me.nestBuff];
   const li = getBuffSizeList(tbf, nbf);
   const tx = ["공퍼증", "공고증", "받뎀증", "일뎀증", "받일뎀", "궁뎀증", "받궁뎀", "발뎀증", "받발뎀", "가뎀증",
       "속뎀증", "받속뎀", "평발동", "궁발동", "평추가", "궁추가", "발효증", "받직뎀", "받캐뎀"];
   const strList = [`공격력 : ${me.getCurAtk().toFixed(0)}`];
   for(let i = 0; i < li.length; i++) {
      if (li[i] == 0) continue;
      let info = (li[i]*100)+"%";
      if (i == 1) info = Math.floor(li[1]);
      strList.push(tx[i] + " : " + info);
   }
   return strList.join("\n");
}