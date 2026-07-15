// 데모 맛집 데이터: 서버 없이도 모든 기능을 체험할 수 있습니다.
const restaurants = [
  {id:1,name:"마라공방",category:"마라탕",emoji:"🍜",area:"학교 앞 · 도보 6분",rating:4.8,tag:"매운맛 끝판왕",desc:"토핑 왕창 담아도 만 원대! 맵기 조절 가능",color:"linear-gradient(145deg,#ffcb55,#ff705e)",wait:18},
  {id:2,name:"버거스테이지",category:"햄버거",emoji:"🍔",area:"중앙역 · 도보 3분",rating:4.7,tag:"육즙 폭발",desc:"수제 패티에 치즈 두 장, 감튀까지 완벽",color:"linear-gradient(145deg,#a8df69,#ffd85c)",wait:8},
  {id:3,name:"소복소복",category:"디저트",emoji:"🍧",area:"문화거리 · 도보 8분",rating:4.9,tag:"사진 맛집",desc:"산처럼 쌓인 딸기 빙수, 셋이 먹어도 충분",color:"linear-gradient(145deg,#ffb5ca,#f6d8ff)",wait:24},
  {id:4,name:"불꽃떡볶이",category:"분식",emoji:"🌶️",area:"학교 후문 · 도보 2분",rating:4.6,tag:"가성비 갑",desc:"떡볶이+튀김+순대 세트가 단돈 9,900원",color:"linear-gradient(145deg,#ff9a72,#ff5252)",wait:5},
  {id:5,name:"피자연구소",category:"양식",emoji:"🍕",area:"로데오거리 · 버스 10분",rating:4.8,tag:"치즈 미쳤다",desc:"한 조각이 얼굴만 한 뉴욕식 페퍼로니 피자",color:"linear-gradient(145deg,#f9d763,#ff9c42)",wait:12},
  {id:6,name:"카츠클럽",category:"일식",emoji:"🍱",area:"시청역 · 도보 5분",rating:4.7,tag:"겉바속촉",desc:"두툼한 등심카츠와 무한리필 밥·장국",color:"linear-gradient(145deg,#ffc46b,#e7a45c)",wait:31},
  {id:7,name:"청춘곱창",category:"곱창",emoji:"🥘",area:"중앙역 · 도보 7분",rating:4.8,tag:"볶음밥 필수",desc:"쫄깃한 곱창에 불향 가득, 마무리는 볶음밥",color:"linear-gradient(145deg,#ff9f62,#d84c3f)",wait:27},
  {id:8,name:"면의 온도",category:"파스타",emoji:"🍝",area:"문화거리 · 도보 4분",rating:4.9,tag:"데이트 성공각",desc:"꾸덕한 로제 파스타와 바삭한 마늘빵 한 세트",color:"linear-gradient(145deg,#ffd785,#ff9d8c)",wait:16},
  {id:9,name:"스시다이브",category:"일식",emoji:"🍣",area:"로데오거리 · 도보 6분",rating:4.8,tag:"한입에 행복",desc:"연어 초밥부터 우동까지 학생 세트로 든든하게",color:"linear-gradient(145deg,#82d3d0,#ffc2af)",wait:22},
  {id:10,name:"토스트.zip",category:"토스트",emoji:"🥪",area:"학교 앞 · 도보 1분",rating:4.7,tag:"등굣길 원픽",desc:"치즈 두 배, 계란 두 배! 단짠 토스트의 정석",color:"linear-gradient(145deg,#ffe07d,#f0a34a)",wait:3},
  {id:11,name:"엄마손 한상",category:"한식",emoji:"🍚",area:"학교 후문 · 도보 4분",rating:4.9,tag:"밥 무한리필",desc:"제육볶음에 계란말이까지 집밥보다 푸짐하게",color:"linear-gradient(145deg,#9ed477,#f6d37b)",wait:9}
];

// 거리(분), 가격대, 쿠폰 정보를 추천과 필터에 함께 사용합니다.
const foodDetails = [
  [6,2,"학생증 제시 10%"],[3,1,"감자튀김 무료"],[8,1,null],[2,1,"튀김 2개 무료"],[10,2,null],[5,2,"음료 무료"],
  [7,3,null],[4,2,"마늘빵 무료"],[6,2,"연어 2pcs 추가"],[1,1,"치즈 추가 무료"],[4,1,"음료 무료"]
];
restaurants.forEach((r,i)=>Object.assign(r,{distance:foodDetails[i][0],price:foodDetails[i][1],coupon:foodDetails[i][2]}));

const $ = (selector) => document.querySelector(selector);
const storage = {
  get(key, fallback){ try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback} },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
};
let saved = storage.get("gago-saved", []);
let mapPlaces = storage.get("gago-map", [1,2,3]);
let waits = storage.get("gago-waits", Object.fromEntries(restaurants.map(r=>[r.id,r.wait])));
let category = "전체", companion = storage.get("gago-companion", "친구"), region = "", sortMode = "default", priceLevel = "all", couponOnly = false, currentIndex = 0, toastTimer;

// 짧은 안내 메시지
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800)}

function renderCategories(){
  const categories=["전체",...new Set(restaurants.map(r=>r.category))];
  $("#categoryFilters").innerHTML=categories.map(c=>`<button class="chip ${c===category?"active":""}" data-category="${c}">${c==="전체"?"✨ ":""}${c}</button>`).join("");
}
function renderCompanions(){
  const items=[{name:"혼자",icon:"🎧"},{name:"친구",icon:"😎"},{name:"썸",icon:"💗"},{name:"가족",icon:"🏠"},{name:"단체",icon:"🔥"}];
  $("#companionFilters").innerHTML=items.map(x=>`<button class="companion ${x.name===companion?"active":""}" data-companion="${x.name}">${x.icon} ${x.name}</button>`).join("");
}
function filtered(){
  let list=category==="전체"?[...restaurants]:restaurants.filter(r=>r.category===category);
  if(region.trim())list=list.filter(r=>r.area.replace(/\s/g,"").includes(region.trim().replace(/\s/g,"")));
  if(priceLevel!=="all")list=list.filter(r=>r.price===Number(priceLevel));
  if(couponOnly)list=list.filter(r=>r.coupon);
  if(sortMode==="distance")list.sort((a,b)=>a.distance-b.distance);
  return list;
}
function current(){const list=filtered();currentIndex%=list.length;return list[currentIndex]}
function renderRecommendation(){
  const list=filtered();if(!list.length){$("#recommendCard").style.display="none";return}$("#recommendCard").style.display="block";
  const r=current(), isSaved=saved.includes(r.id);
  $("#recommendPhoto").style.background=r.color;$("#recommendBadge").textContent=r.tag;$("#recommendEmoji").textContent=r.emoji;
  const prices=["","1만원 이하","1~2만원","2만원 이상"];
  $("#recommendMeta").textContent=`${companion}랑 · ${r.distance}분 거리 · ${prices[r.price]}${r.coupon?" · 🎟 "+r.coupon:""}`;$("#recommendName").textContent=r.name;$("#recommendDescription").textContent=r.desc;$("#recommendRating").textContent=`★ ${r.rating}`;
  $("#heartButton").textContent=isSaved?"♥":"♡";$("#heartButton").classList.toggle("saved",isSaved);$("#saveButton").textContent=isSaved?"저장 완료 ✓":"여기 가고! +";
}
function renderSaved(){
  const list=restaurants.filter(r=>saved.includes(r.id));
  $("#savedCount").textContent=list.length;$("#listSummary").textContent=`${list.length}곳 저장`;
  $("#savedList").innerHTML=list.length?list.map(r=>`<article class="saved-item"><span class="thumb">${r.emoji}</span><div><b>${r.name}</b><small>${r.category} · ${r.area}</small></div><button class="remove" data-remove="${r.id}" aria-label="${r.name} 삭제">×</button></article>`).join(""):`<div class="empty">아직 저장한 맛집이 없어.<br>위 카드에서 <b>여기 가고!</b>를 눌러봐 👀</div>`;
}
function toggleSave(){const id=current().id;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];storage.set("gago-saved",saved);renderRecommendation();renderSaved();toast(saved.includes(id)?"가고 싶은 곳에 저장했어! 💚":"목록에서 뺐어")}

// 화면 전환과 하단 내비게이션
document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".page,.nav-item").forEach(el=>el.classList.remove("active"));
  $("#"+button.dataset.page).classList.add("active");button.classList.add("active");window.scrollTo({top:0,behavior:"smooth"});
}));
$("#categoryFilters").addEventListener("click",e=>{if(!e.target.dataset.category)return;category=e.target.dataset.category;currentIndex=0;renderCategories();renderRecommendation()});
$("#companionFilters").addEventListener("click",e=>{if(!e.target.dataset.companion)return;companion=e.target.dataset.companion;storage.set("gago-companion",companion);currentIndex=0;renderCompanions();renderRecommendation();toast(`${companion}랑 가기 좋은 곳으로 골랐어!`)});
$("#regionSearch").addEventListener("input",e=>{region=e.target.value;currentIndex=0;renderRecommendation();if(!filtered().length)toast("그 지역의 맛집은 아직 없어 😢")});
$("#clearRegion").addEventListener("click",()=>{region="";$("#regionSearch").value="";renderRecommendation();$("#regionSearch").focus()});
$("#sortFilter").addEventListener("change",e=>{sortMode=e.target.value;currentIndex=0;renderRecommendation();toast(sortMode==="distance"?"가까운 맛집부터 정렬했어":"추천순으로 정렬했어")});
$("#priceFilter").addEventListener("change",e=>{priceLevel=e.target.value;currentIndex=0;renderRecommendation();if(!filtered().length)toast("이 가격대의 맛집이 아직 없어")});
$("#couponFilter").addEventListener("change",e=>{couponOnly=e.target.checked;currentIndex=0;renderRecommendation();if(!filtered().length)toast("현재 조건에 맞는 쿠폰이 없어")});
$("#nextButton").addEventListener("click",()=>{currentIndex=(currentIndex+1)%filtered().length;renderRecommendation()});
$("#saveButton").addEventListener("click",toggleSave);$("#heartButton").addEventListener("click",toggleSave);
$("#savedList").addEventListener("click",e=>{const id=Number(e.target.dataset.remove);if(!id)return;saved=saved.filter(x=>x!==id);storage.set("gago-saved",saved);renderSaved();renderRecommendation()});
$("#savedButton").addEventListener("click",()=>$("#savedList").scrollIntoView({behavior:"smooth"}));

// 모바일 공유 시트를 우선 사용하고, 미지원 환경에서는 문구를 복사합니다.
function shareText(){const r=current();return `${companion}랑 여기 어때? ${r.emoji} ${r.name}\n${r.category} · ${r.area}\n#어디가고 #맛집추천`}
async function copyShare(channel){try{await navigator.clipboard.writeText(shareText());toast(`${channel}에 붙여넣을 문구를 복사했어!`)}catch{toast("공유 문구 복사가 필요해")}}
$("#shareButton").addEventListener("click",async()=>{if(navigator.share){try{await navigator.share({title:"어디가고 맛집 추천",text:shareText(),url:location.href});return}catch(e){if(e.name==="AbortError")return}}copyShare("SNS")});
$("#instagramButton").addEventListener("click",()=>copyShare("인스타그램"));$("#kakaoButton").addEventListener("click",()=>copyShare("카카오톡"));

// 선택한 조건과 평점, 거리, 쿠폰을 점수화하는 기기 내 AI 추천 엔진입니다.
$("#aiRecommendButton").addEventListener("click",()=>{
  const pool=filtered();if(!pool.length)return toast("조건을 조금 넓혀줘!");
  const scored=pool.map(r=>({r,score:r.rating*10-r.distance+(r.coupon?5:0)+(saved.includes(r.id)?2:0)+Math.random()*3})).sort((a,b)=>b.score-a.score);
  const pick=scored[0].r;currentIndex=pool.findIndex(r=>r.id===pick.id);renderRecommendation();
  $("#aiMessage").innerHTML=`<b>${pick.emoji} ${pick.name}</b> 추천! ${companion}랑 가기 좋고, ${pick.distance}분 거리${pick.coupon?", 쿠폰까지 있어서":"에 평점도 높아서"} 골랐어.`;
  $("#recommendCard").scrollIntoView({behavior:"smooth",block:"center"});toast("가고봇이 최적의 맛집을 찾았어 ✦");
});

// 랜덤 뽑기 애니메이션
$("#randomButton").addEventListener("click",()=>{const slot=$("#randomSlot");slot.classList.add("spin");let ticks=0;const timer=setInterval(()=>{const r=restaurants[Math.floor(Math.random()*restaurants.length)];slot.innerHTML=`<span>${r.emoji}</span><strong>${r.name}</strong><small>${r.category} · ${r.area}</small>`;if(++ticks>11){clearInterval(timer);slot.classList.remove("spin");toast("오늘은 여기다! 결정 완료 🔥")}},90)});

const drinkGames=[
  ["눈치 게임","1부터 차례 없이 외쳐! 겹친 사람은 음료 한 모금"],["훈민정음","외래어를 말한 사람은 음료 한 모금"],["딸기 게임","박자에 맞춰 딸기를 외치고 틀리면 한 모금"],["손병호 게임","해당되는 사람은 손가락 접기! 먼저 다 접으면 미션"],["초성 퀴즈","랜덤 음식 초성을 맞힐 때까지 도전"],["금지어 게임","3분 동안 '진짜'를 말하면 음료 한 모금"]
];
$("#gameButton").addEventListener("click",()=>{const box=$("#gameResult");box.classList.add("spin");let count=0;const timer=setInterval(()=>{const g=drinkGames[Math.floor(Math.random()*drinkGames.length)];box.innerHTML=`<b>${g[0]}</b><p>${g[1]}</p>`;if(++count>9){clearInterval(timer);box.classList.remove("spin");toast("게임 시작! 음료 준비 🥤")}},80)});

function renderGroups(){const groups=["🏫 2학년 3반","🏀 농구부","👯 찐친즈"];$("#groupRow").innerHTML=groups.map((g,i)=>`<button class="group ${i===0?"active":""}">${g}</button>`).join("")}
function renderMap(){const positions=[[24,28],[72,34],[48,68],[80,76],[22,78],[60,18],[35,48],[68,58],[15,58],[86,22],[54,84]];$("#mapSurface").innerHTML=mapPlaces.map(id=>{const r=restaurants.find(x=>x.id===id),p=positions[id-1];return `<button class="pin" style="left:${p[0]}%;top:${p[1]}%" title="${r.name}"><span>${r.emoji}</span></button>`}).join("")}
$("#groupRow").addEventListener("click",e=>{if(!e.target.classList.contains("group"))return;document.querySelectorAll(".group").forEach(x=>x.classList.remove("active"));e.target.classList.add("active");toast(`${e.target.textContent.trim()} 지도를 열었어`)});
$("#mapAddButton").addEventListener("click",()=>{const candidates=restaurants.filter(r=>!mapPlaces.includes(r.id));if(!candidates.length)return toast("모든 맛집을 지도에 담았어!");const pick=candidates[Math.floor(Math.random()*candidates.length)];mapPlaces.push(pick.id);storage.set("gago-map",mapPlaces);renderMap();toast(`${pick.name} 지도에 추가 완료!`)});
$("#copyButton").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("#inviteCode").textContent);toast("초대 코드 복사 완료!")}catch{toast("초대 코드: "+$("#inviteCode").textContent)}});

function renderWaiting(){
  $("#waitingList").innerHTML=restaurants.slice(0,5).map(r=>{const min=Number(waits[r.id]??r.wait);return `<article class="waiting-item"><span class="thumb">${r.emoji}</span><div class="waiting-info"><b>${r.name}</b><small>${r.area} · 방금 업데이트</small></div><div class="wait-time"><strong>${min?min+"분":"바로 입장"}</strong><span>${min<10?"● 여유":min<25?"● 보통":"● 붐빔"}</span></div></article>`}).join("");
}
$("#refreshWaiting").addEventListener("click",()=>{renderWaiting();toast("최신 현장 정보로 새로고침했어")});
$("#reportForm").addEventListener("submit",e=>{e.preventDefault();const id=Number($("#reportPlace").value),min=Number($("#reportMinutes").value);waits[id]=min;storage.set("gago-waits",waits);renderWaiting();e.target.reset();toast("제보 완료! 완전 고마워 🙌")});

// 첫 화면 그리기
renderCategories();renderCompanions();renderRecommendation();renderSaved();renderGroups();renderMap();renderWaiting();
$("#reportPlace").innerHTML=restaurants.map(r=>`<option value="${r.id}">${r.name}</option>`).join("");
