let checkElementN, checkRoleN, checkRarityN;
const curHeader = 6;

const selected = [];
const params = new URLSearchParams(window.location.search);
const ch_ids = params.get('list');
if (ch_ids != null) {
   const ch_idList = ch_ids.split(",").map(Number);
   for(let i of ch_idList) selected.push(i);
}

const chJsonList = chJSON.data.slice();
addAnyCh();
document.addEventListener("DOMContentLoaded", function() {
   const searchInput = document.getElementById('searchInput');
   searchInput.addEventListener('input', function() {
      getCharactersWithCondition(checkElementN, checkRoleN, checkRarityN, searchInput.value);
   })
   getCharactersWithCondition(null, null, checkRarityN = 3, "");
   updateSelected();
   

   // 구속 드랍박스
   for(let i = 0; i < 5; i++) {
      const dropdownBtn = document.getElementById(`btn${i}`);
      const dropdownContent = document.getElementById(`drop${i}`);
      dropdownBtn.addEventListener("click", function() {
         dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
      });
      const radios = document.querySelectorAll(`.dropdown-content input[name='b${i}']`);
      radios.forEach(function(option) {
         option.addEventListener("click", function() {
            dropdownBtn.innerText = `${this.value}`;
            const spanElement = document.createElement('span');
            spanElement.classList.add('absolute-right');
            spanElement.innerHTML = '▼'
            dropdownBtn.appendChild(spanElement);
            dropdownContent.style.display = "none";
         });
      });
   }
});

function getCharactersWithCondition(element, role, rarity, search) {
   const characterContainer = document.getElementById("characterContainer");
   characterContainer.innerHTML = "로드 중...";

   search = fixName(search);
   const dataArray = chJsonList;
   const filteredData = dataArray.filter(function(obj) { 
      let b1 = true, b2 = true, b3 = true, b4 = true;
      if (element != null) b1 = (obj.element === element); 
      if (role != null) b2 = (obj.role === role); 
      if (rarity != null) b3 = (obj.rarity === rarity); 
      if (search != "") b4 = (obj.name.includes(search) || obj.fullname.includes(search));
      return b1 && b2 && b3 && b4;
   });
   let innerArray = [];
   for(const champ of filteredData) {
      if (!champ.ok) continue;
      let id = champ.id, name = champ.name, element = champ.element, role = champ.role;
      let chk_option = "none", opacity = `style="opacity:1"`;
      let roleImg = `<img id="el_${id}" src="${address}/images/icons/ro_${role}.webp" class="el-icon z-2">`;
      if (selected.includes(id) && !isAny(id)) chk_option = "block";
      if (isAny(id)) {opacity = `style="opacity:0"`; roleImg = "";}
      innerArray.push(`
         <div class="character" onclick="clickedCh(${id})" style="margin:0.2rem;">
            <div style="margin:0.2rem;">
               <img id="img_${id}" src="${address}/images/characters/cs${id}_0_0.webp" class="img z-1" alt="">
               ${roleImg}
               ${liberationList.includes(name) ? `<img src="${address}/images/icons/liberation.webp" class="li-icon z-2">` : ""}
               <img id="chk_${id}" src="${address}/images/checkmark.png" class="chked z-3" style="display:${chk_option}">
               <div class="element${element} ch_img ch_border z-4"></div>
            </div>
            <div class="text-mini">${name}</div>
         </div>
      `);
   }
   characterContainer.innerHTML = innerArray.join("");
}

// 구속력 리스트 리턴
function getBondList() {
   const b_arr = [];
   for(let i = 0; i < 5; i++) {
      const selectedRadio = document.querySelector(`input[name="b${i}"]:checked`);
      b_arr.push(Number(selectedRadio.value));
   }
   return b_arr;
}

// 시작 버튼 누를시
function startSimulator() {
   if (selected.length != 5) return alert("5개의 캐릭터를 선택해주세요");
   location.href = `${address}/simulator/?list=${selected}&bond=${getBondList()}`
}

// 검색창에 선택된 캐릭터 이미지 띄우기
function updateSelected() {
   const div = document.getElementById("selectedCh");
   if (selected.length == 0) div.innerHTML = "캐릭터를 선택해 추가해 주세요";
   else {
      let innerArray = [];
      for(let chId of selected) {
         let champ = getCharacter(chId);
         let id = champ.id, name = champ.name, element = champ.element, role = champ.role;
         let roleImg = isAny(id) ? "" : `<img src="${address}/images/icons/ro_${role}.webp" class="el-icon z-2">`;
         innerArray.push(`
            <div class="character" onclick="clickedSel(this, ${id})" style="margin:0.2rem;">
               <div style="margin:0.2rem;">
                  <img src="${address}/images/characters/cs${id}_0_0.webp" class="img z-1" alt="">
                  ${roleImg}
                  ${liberationList.includes(name) ? `<img src="${address}/images/icons/liberation.webp" class="li-icon z-2">` : ""}
                  <div class="element${element} ch_img ch_border z-4"></div>
               </div>
               <div class="text-mini">${name}</div>
            </div>
         `);
      }
      div.innerHTML = innerArray.join("");
   }
}

// 클릭하면 체크표시 활성/비활성화, 리스트에 추가/제거
function clickedCh(id) {
   if (selected.length > 4 && !selected.includes(id)) return alert("5개까지 선택 가능합니다");
   if (selected.length > 4 && isAny(id)) return alert("5개까지 선택 가능합니다");

   if (isAny(id)) selected.push(id);
   else {
      if (selected.includes(id)) {
         let index = selected.indexOf(id);
         if (index !== -1) selected.splice(index, 1);
         document.getElementById(`chk_${id}`).style.display = "none";

      } else {
         selected.push(id);
         document.getElementById(`chk_${id}`).style.display = "block";
      }
   }
   updateSelected();
}

// 검색창의 캐릭 클릭시 제거
function clickedSel(div, id) {
   if (isAny(id)) {
      let position = Array.prototype.indexOf.call(div.parentNode.childNodes, div);
      selected.splice((position-1)/2, 1);
   } else {
      div.parentNode.removeChild(div);
      let index = selected.indexOf(id);
      if (index !== -1) selected.splice(index, 1);

      let chk = document.getElementById(`chk_${id}`);
      if (chk != null) chk.style.display = "none";
   }
   updateSelected()
}


/* input:radio 버튼해제 로직 --------------------------------------------------*/
function checkElement(num) {
   var obj = document.querySelectorAll('input[type="radio"][name="element"]');
   if (checkElementN === num) {
       obj[num].checked = false;
       checkElementN = null;
   } else checkElementN = num;
   getCharactersWithCondition(checkElementN, checkRoleN, checkRarityN, document.getElementById('searchInput').value);
}
function checkRole(num) {
   var obj = document.querySelectorAll('input[type="radio"][name="role"]');
   if (checkRoleN === num) {
       obj[num].checked = false;
       checkRoleN = null;
   } else checkRoleN = num;
   getCharactersWithCondition(checkElementN, checkRoleN, checkRarityN, document.getElementById('searchInput').value);
}

function checkRarity(num) {
   var obj = document.querySelectorAll('input[type="radio"][name="rarity"]');
   const reversedObj = Array.from(obj).reverse(); 
   if (checkRarityN === num) {
      reversedObj[num].checked = false;
      checkRarityN = null;
   } else checkRarityN = num;
   getCharactersWithCondition(checkElementN, checkRoleN, checkRarityN, document.getElementById('searchInput').value);
}
/*------------------------------------------------------------------------*/




