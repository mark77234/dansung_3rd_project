// 추천에 사용하는 예시 코디 데이터
const outfits = [
  { id:1, title:'캠퍼스 럭비 룩', desc:'스트라이프 티 + 와이드 데님', body:'natural', color:'winter', tags:['#학교','#편한','#꾸안꾸'], top:'#f4efe0', bottom:'#5772a8', bg:'#d9edff', icon:'🎧' },
  { id:2, title:'말랑 피치 데이트 룩', desc:'크롭 가디건 + 플리츠 스커트', body:'wave', color:'spring', tags:['#데이트','#러블리','#주말'], top:'#ffad96', bottom:'#f5e7ce', bg:'#ffe3dc', icon:'🍑' },
  { id:3, title:'쿨톤 하이틴 룩', desc:'스카이 셔츠 + 차콜 미니', body:'straight', color:'summer', tags:['#하이틴','#깔끔한','#학교'], top:'#a8d5eb', bottom:'#444751', bg:'#ded6f5', icon:'🫧' },
  { id:4, title:'톤온톤 카고 룩', desc:'브라운 후드 + 카키 카고', body:'natural', color:'autumn', tags:['#힙한','#주말','#편한'], top:'#8c654d', bottom:'#747358', bg:'#eee0bd', icon:'🛹' },
  { id:5, title:'상큼 바시티 룩', desc:'그린 바시티 + 아이보리 팬츠', body:'straight', color:'spring', tags:['#체육대회','#활동적인','#학교'], top:'#66a66d', bottom:'#f5eedc', bg:'#dcf4c6', icon:'⚾' },
  { id:6, title:'보랏빛 레이어드 룩', desc:'니트 베스트 + 화이트 셔츠', body:'wave', color:'winter', tags:['#도서관','#차분한','#꾸안꾸'], top:'#7662a8', bottom:'#292839', bg:'#e7dcf9', icon:'📚' },
  { id:7, title:'포근한 후드 셋업', desc:'오트밀 후드 + 조거 팬츠', body:'natural', color:'autumn', tags:['#학원','#편한','#주말'], top:'#d9c8ae', bottom:'#8f8576', bg:'#f2e6ce', icon:'☕' },
  { id:8, title:'청량 데님 레이어드', desc:'화이트 티 + 데님 뷔스티에', body:'wave', color:'summer', tags:['#청량한','#데이트','#사진'], top:'#d6ecfa', bottom:'#668eb4', bg:'#d8f3ed', icon:'📸' },
  { id:9, title:'시험 끝 영화관 룩', desc:'레드 맨투맨 + 흑청 데님', body:'straight', color:'winter', tags:['#영화관','#친구','#힙한'], top:'#bc3347', bottom:'#303946', bg:'#f4d4d9', icon:'🍿' },
  { id:10, title:'수학여행 트래블 룩', desc:'윈드브레이커 + 나일론 팬츠', body:'natural', color:'summer', tags:['#수학여행','#활동적인','#편한'], top:'#bedcec', bottom:'#38495b', bg:'#d8eef4', icon:'🚌' },
  { id:11, title:'봄날 피크닉 룩', desc:'옐로 카디건 + 연청 데님', body:'wave', color:'spring', tags:['#피크닉','#사진','#러블리'], top:'#f0d75e', bottom:'#9bc0da', bg:'#f5efb8', icon:'🌷' },
  { id:12, title:'가을 축제 룩', desc:'레더 재킷 + 체크 스커트', body:'straight', color:'autumn', tags:['#학교축제','#공연','#힙한'], top:'#5f4438', bottom:'#9a6248', bg:'#ead1b6', icon:'🎸' },
  { id:13, title:'비 오는 날 룩', desc:'네이비 바람막이 + 버뮤다 팬츠', body:'natural', color:'winter', tags:['#장마','#편한','#학교'], top:'#344e70', bottom:'#74869c', bg:'#cadce9', icon:'☂️' },
  { id:14, title:'학원 가는 꾸안꾸', desc:'집업 후드 + 와이드 스웨트팬츠', body:'natural', color:'summer', tags:['#학원','#꾸안꾸','#편한'], top:'#b8b5c3', bottom:'#6f7078', bg:'#e5e2ee', icon:'✏️' },
  { id:15, title:'생일 파티 포인트 룩', desc:'핑크 니트 + 블랙 미니', body:'wave', color:'winter', tags:['#생일','#파티','#사진'], top:'#ed77a6', bottom:'#27242d', bg:'#f7d3e4', icon:'🎂' },
  { id:16, title:'농구 직관 스트릿 룩', desc:'메시 저지 + 카고 데님', body:'straight', color:'spring', tags:['#농구','#스트릿','#친구'], top:'#ef7e36', bottom:'#6c8092', bg:'#ffe0bd', icon:'🏀' },
  { id:17, title:'벚꽃 셔츠 룩', desc:'라이트 핑크 셔츠 + 크림 팬츠', body:'straight', color:'spring', tags:['#벚꽃','#데이트','#깔끔한'], top:'#f1b5b8', bottom:'#e9dfc9', bg:'#fae3e1', icon:'🌸' },
  { id:18, title:'카페 공부 룩', desc:'아가일 베스트 + 코튼 팬츠', body:'wave', color:'autumn', tags:['#카페','#공부','#차분한'], top:'#a27b56', bottom:'#d9c9ad', bg:'#ede1cb', icon:'🥨' },
  { id:19, title:'여름 바다 룩', desc:'민트 반팔 셔츠 + 화이트 쇼츠', body:'natural', color:'summer', tags:['#바다','#여행','#청량한'], top:'#81cbbd', bottom:'#f5f4ed', bg:'#ccefeb', icon:'🌊' },
  { id:20, title:'겨울 붕어빵 룩', desc:'레드 머플러 + 더플 코트', body:'straight', color:'autumn', tags:['#겨울','#따뜻한','#데이트'], top:'#a77854', bottom:'#4b4039', bg:'#ead9c8', icon:'🧣' }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let favorites = JSON.parse(localStorage.getItem('todayWearFavorites') || '[]');
let profile = JSON.parse(localStorage.getItem('todayWearProfile') || '{"name":"오늘","body":"all","color":"all"}');
let dailyIndex = new Date().getDate() % outfits.length;
let selectedColor = 'all';

function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
}

// 날짜에 맞춰 오늘의 코디를 표시한다.
function renderDaily() {
  const item = outfits[dailyIndex];
  $('#outfitVisual').style.setProperty('--top', item.top);
  $('#outfitVisual').style.setProperty('--bottom', item.bottom);
  $('#outfitVisual').style.backgroundColor = item.bg;
  $('#outfitVisual').dataset.icon = item.icon;
  $('#dailyTitle').textContent = item.title;
  $('#dailyDescription').textContent = item.desc;
  $('#dailyTags').innerHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  const saved = favorites.includes(item.id);
  $('#saveDaily').textContent = saved ? '♥ 옷장에 저장됨' : '♡ 옷장에 저장';
  $('#saveDaily').dataset.id = item.id;
}

function cardTemplate(item) {
  const saved = favorites.includes(item.id);
  return `<article class="style-card" data-outfit="${item.id}" tabindex="0" role="button" aria-label="${item.title} 착장 상세 보기">
    <div class="style-thumb" style="--bg:${item.bg};--top:${item.top};--bottom:${item.bottom}">
      <button class="heart ${saved ? 'saved' : ''}" data-favorite="${item.id}" aria-label="${item.title} ${saved ? '저장 취소' : '저장'}">${saved ? '♥' : '♡'}</button>
    </div>
    <div class="style-info"><small>${item.tags[0]}</small><h3>${item.title}</h3><p>${item.desc}</p></div>
  </article>`;
}

function renderResults() {
  const body = $('#bodyType').value;
  const keyword = $('#keywordInput').value.trim().replace('#','').toLowerCase();
  const filtered = outfits.filter(item => (body === 'all' || item.body === body) && (selectedColor === 'all' || item.color === selectedColor) && (!keyword || `${item.title} ${item.desc} ${item.tags.join(' ')}`.toLowerCase().includes(keyword)));
  $('#resultCount').textContent = filtered.length;
  $('#outfitGrid').innerHTML = filtered.length ? filtered.map(cardTemplate).join('') : '<p class="notice">딱 맞는 코디가 없어요. 조건을 조금 바꿔볼까요?</p>';
}

function renderSaved() {
  const savedItems = outfits.filter(item => favorites.includes(item.id));
  $('#savedGrid').innerHTML = savedItems.map(cardTemplate).join('');
  $('#emptySaved').style.display = savedItems.length ? 'none' : 'block';
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(savedId => savedId !== id) : [...favorites, id];
  localStorage.setItem('todayWearFavorites', JSON.stringify(favorites));
  renderDaily(); renderResults(); renderSaved();
  toast(favorites.includes(id) ? '내 옷장에 저장했어! ♥' : '저장을 취소했어');
}

// 코디를 누르면 상품별 링크가 있는 하단 착장 박스를 연다.
function openOutfitSheet(id) {
  const item = outfits.find(outfit => outfit.id === id); if (!item) return;
  $('#sheetVisual').style.cssText = `--bg:${item.bg};--top:${item.top};--bottom:${item.bottom}`;
  $('#sheetTags').innerHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  $('#sheetTitle').textContent = item.title; $('#sheetDesc').textContent = item.desc;
  const parts = item.desc.split(' + ');
  $('#sheetItems').innerHTML = parts.map((part, index) => `<div><span>${index ? 'BOTTOM' : 'TOP'} · ${part}</span><a href="https://www.musinsa.com/search/musinsa/integration?q=${encodeURIComponent(part)}" target="_blank" rel="noopener">찾기 ↗</a></div>`).join('');
  $('#sheetShop').href = `https://www.musinsa.com/search/musinsa/integration?q=${encodeURIComponent(item.title)}`;
  $('#sheetSave').dataset.id = item.id; $('#sheetSave').textContent = favorites.includes(item.id) ? '♥ 저장됨' : '♡ 저장';
  $('#outfitSheet').classList.add('show'); $('#sheetBackdrop').classList.add('show'); $('#outfitSheet').setAttribute('aria-hidden','false');
}
function closeOutfitSheet() { $('#outfitSheet').classList.remove('show'); $('#sheetBackdrop').classList.remove('show'); $('#outfitSheet').setAttribute('aria-hidden','true'); }

// 하단 메뉴와 빠른 카드가 같은 화면 전환 함수를 사용한다.
function navigate(page) {
  $$('.page').forEach(section => section.classList.toggle('active', section.id === page));
  $$('.bottom-nav a').forEach(link => link.classList.toggle('active', link.dataset.page === page));
  if (page === 'saved') renderSaved();
  history.replaceState(null, '', `#${page}`);
  window.scrollTo({ top:0, behavior:'smooth' });
}

document.addEventListener('click', event => {
  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) { event.stopPropagation(); toggleFavorite(Number(favoriteButton.dataset.favorite)); }
  const outfitCard = event.target.closest('[data-outfit]');
  if (outfitCard && !favoriteButton && !event.target.closest('a')) openOutfitSheet(Number(outfitCard.dataset.outfit));
  const goButton = event.target.closest('[data-go]');
  if (goButton) {
    navigate(goButton.dataset.go);
    const focus = goButton.dataset.focus;
    if (focus) setTimeout(() => $(`#${focus}Filter`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 100);
  }
});
document.addEventListener('keydown', event => { const card = event.target.closest?.('[data-outfit]'); if (card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openOutfitSheet(Number(card.dataset.outfit)); } });
$('#closeSheet').addEventListener('click', closeOutfitSheet); $('#sheetBackdrop').addEventListener('click', closeOutfitSheet);
$('#sheetSave').addEventListener('click', event => { toggleFavorite(Number(event.currentTarget.dataset.id)); event.currentTarget.textContent = favorites.includes(Number(event.currentTarget.dataset.id)) ? '♥ 저장됨' : '♡ 저장'; });

$$('.bottom-nav a').forEach(link => link.addEventListener('click', event => { event.preventDefault(); navigate(link.dataset.page); }));
$('#shuffleDaily').addEventListener('click', () => { dailyIndex = (dailyIndex + 1) % outfits.length; renderDaily(); toast('새 코디를 골랐어!'); });
$('#saveDaily').addEventListener('click', event => toggleFavorite(Number(event.currentTarget.dataset.id)));
$('#bodyType').addEventListener('change', renderResults);
$$('.color-chip').forEach(button => button.addEventListener('click', () => { $$('.color-chip').forEach(chip => chip.classList.remove('active')); button.classList.add('active'); selectedColor = button.dataset.color; renderResults(); }));
$('#searchKeyword').addEventListener('click', renderResults);
$('#keywordInput').addEventListener('keydown', event => { if (event.key === 'Enter') renderResults(); });
$$('.suggestions button').forEach(button => button.addEventListener('click', () => { $('#keywordInput').value = button.textContent; renderResults(); }));
$('#resetFilters').addEventListener('click', () => { $('#bodyType').value = 'all'; $('#keywordInput').value = ''; selectedColor = 'all'; $$('.color-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.color === 'all')); renderResults(); });

// 업로드된 사진은 서버 전송 없이 브라우저에서만 미리 보여준다.
function handlePhoto(event) {
  const file = event.target.files[0]; if (!file) return;
  if (file.size > 10 * 1024 * 1024) { toast('10MB 이하 사진을 골라줘!'); return; }
  const reader = new FileReader();
  reader.onload = () => { $('#photoPreview').src = reader.result; $('#photoPreview').style.display = 'block'; $('#uploadPlaceholder').style.display = 'none'; $('#analyzePhoto').disabled = false; $('#analysisResult').classList.remove('show'); };
  reader.readAsDataURL(file);
}
$('#photoInput').addEventListener('change', handlePhoto); $('#cameraInput').addEventListener('change', handlePhoto);

// 캔버스로 사진의 평균 색상을 구해 어울리는 톤과 코디를 추천한다.
function analyzeUploadedPhoto() {
  const image = $('#photoPreview'), canvas = document.createElement('canvas'), context = canvas.getContext('2d', { willReadFrequently:true });
  canvas.width = canvas.height = 64; context.drawImage(image, 0, 0, 64, 64);
  const pixels = context.getImageData(0,0,64,64).data; let r=0,g=0,b=0,count=0;
  for (let i=0;i<pixels.length;i+=16) { if (pixels[i+3] > 100) { r+=pixels[i]; g+=pixels[i+1]; b+=pixels[i+2]; count++; } }
  r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
  const brightness=(r+g+b)/3, warm=r-b; let tone;
  if (warm > 12) tone = brightness > 145 ? 'spring' : 'autumn'; else tone = brightness > 145 ? 'summer' : 'winter';
  const names={spring:'봄 웜톤',summer:'여름 쿨톤',autumn:'가을 웜톤',winter:'겨울 쿨톤'};
  const advice={spring:'아이보리·코랄·연두처럼 맑고 따뜻한 색과 잘 어울려요.',summer:'소프트 블루·라벤더·회색처럼 차분한 색을 매치해 봐요.',autumn:'카키·브라운·베이지처럼 깊고 따뜻한 색이 조화로워요.',winter:'블랙·화이트·선명한 블루처럼 대비가 강한 색이 좋아요.'};
  $('#toneSwatch').style.background=`rgb(${r},${g},${b})`; $('#toneName').textContent=`${names[tone]} 계열 추천`; $('#toneAdvice').textContent=advice[tone];
  const similar=outfits.filter(item=>item.color===tone).slice(0,3);
  $('#similarProducts').innerHTML=similar.map((item,index)=>`<article class="product-card" data-outfit="${item.id}" role="button" tabindex="0"><div class="product-thumb" style="background:${item.bg}">${item.icon}</div><div><small>${94-index*3}% 비슷한 분위기</small><h3>${item.title}</h3><p>${item.desc}</p><a href="https://www.musinsa.com/search/musinsa/integration?q=${encodeURIComponent(item.desc)}" target="_blank" rel="noopener">판매 사이트에서 찾기 →</a></div></article>`).join('');
}
$('#analyzePhoto').addEventListener('click', () => { $('#analysisLoading').classList.add('show'); $('#analysisResult').classList.remove('show'); $('#analyzePhoto').disabled = true; setTimeout(() => { analyzeUploadedPhoto(); $('#analysisLoading').classList.remove('show'); $('#analysisResult').classList.add('show'); $('#analyzePhoto').disabled = false; $('#analysisResult').scrollIntoView({ behavior:'smooth' }); }, 1000); });

// 프로필은 localStorage에 저장해 다시 방문해도 유지한다.
$('#openSettings').addEventListener('click', () => { $('#nameInput').value = profile.name === '오늘' ? '' : profile.name; $('#settingBody').value = profile.body; $('#settingColor').value = profile.color; $('#settingsDialog').showModal(); });
$('#settingsForm').addEventListener('submit', event => { if (event.submitter?.id !== 'saveSettings') return; profile = { name:$('#nameInput').value.trim() || '오늘', body:$('#settingBody').value, color:$('#settingColor').value }; localStorage.setItem('todayWearProfile', JSON.stringify(profile)); $('#userName').textContent = profile.name; $('#bodyType').value = profile.body; selectedColor = profile.color; $$('.color-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.color === selectedColor)); renderResults(); toast('내 취향을 저장했어!'); });

const today = new Date();
$('#todayDate').textContent = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(today).replaceAll(' ', ' · ');
$('#userName').textContent = profile.name;
$('#bodyType').value = profile.body;
selectedColor = profile.color;
$$('.color-chip').forEach(chip => chip.classList.toggle('active', chip.dataset.color === selectedColor));
renderDaily(); renderResults(); renderSaved();
navigate(location.hash.slice(1) || 'home');
