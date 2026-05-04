/* ==================== 工具函数 ==================== */
function showToast(msg){
  const t=document.createElement('div');t.textContent=msg;
  t.style.cssText='position:fixed;bottom:40px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 30px;border-radius:30px;z-index:99999;';
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

function scrollToSection(id){
  const el=document.getElementById(id);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ==================== 全屏轮播（无缝循环） ==================== */
let carouselOffset=0, carouselSpeed=2, carouselRAF=null;
function startCarousel(){
  const track=document.getElementById('hw-carousel-track');
  const sub=['国学','数学','洋文','物理','化学','生物'];
  const ids=['hw-guoxue','hw-math','hw-english','hw-physics','hw-chemistry','hw-biology'];
  let html='';
  for(let k=0;k<2;k++) sub.forEach((s,i)=>{ html+=`<div class="carousel-card"><div class="subject">${s}</div><div class="content">${document.getElementById(ids[i])?.innerHTML||'暂无'}</div></div>`; });
  track.innerHTML=html;
  const cards=document.querySelectorAll('#hw-carousel-track .carousel-card');
  const cardWidth=cards[0].offsetWidth + 40;
  const totalWidth=cardWidth*6;
  track.style.width=totalWidth*2+'px';
  carouselOffset=0;

  function animate(){
    carouselOffset+=carouselSpeed;
    if(carouselOffset>=totalWidth) carouselOffset-=totalWidth;
    track.style.transform=`translateX(${-carouselOffset}px)`;

    const center=window.innerWidth/2;
    cards.forEach(card=>{
      const rect=card.getBoundingClientRect();
      const x=rect.left+rect.width/2;
      const diff=(x-center)/center;
      const rotateY=diff*30;
      const scale=1-Math.abs(diff)*0.3;
      card.style.transform=`rotateY(${rotateY}deg) scale(${scale})`;
    });
    carouselRAF=requestAnimationFrame(animate);
  }
  carouselRAF=requestAnimationFrame(animate);
}

function openCarousel(){
  document.getElementById('hw-carousel-overlay').style.display='flex';
  startCarousel();
}
function closeCarousel(){
  document.getElementById('hw-carousel-overlay').style.display='none';
  if(carouselRAF) cancelAnimationFrame(carouselRAF);
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeCarousel(); });

/* ==================== 侧边栏滚动激活 ==================== */
function initScrollSpy(){
  const sections=document.querySelectorAll('.page-section');
  const btns=document.querySelectorAll('.sidebar-btn');
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        btns.forEach(b=>b.classList.toggle('active',b.dataset.target===entry.target.id));
      }
    });
  },{threshold:0.3,rootMargin:"-70px 0px 0px 0px"});
  sections.forEach(s=>observer.observe(s));
}

function initSidebarAndNav(){
  const sidebar=document.getElementById('sidebar'),toggle=document.getElementById('sidebarToggle');
  if(localStorage.getItem('sidebarCollapsed')==='true'){
    sidebar.classList.add('collapsed'); toggle.innerHTML='<i class="fas fa-chevron-right"></i>';
  }
  toggle.addEventListener('click',()=>{
    const c=sidebar.classList.toggle('collapsed');
    toggle.innerHTML=c?'<i class="fas fa-chevron-right"></i>':'<i class="fas fa-chevron-left"></i>';
    localStorage.setItem('sidebarCollapsed',c);
  });
  document.querySelectorAll('.sidebar-btn').forEach(btn=>{
    btn.addEventListener('click',()=>scrollToSection(btn.dataset.target));
  });
  document.querySelector('.sidebar-btn[data-target="section1"]')?.addEventListener('dblclick',openCarousel);
  document.querySelector('.sidebar-btn[data-target="section3"]')?.addEventListener('dblclick',()=>showToast('随机数字：'+(Math.floor(Math.random()*56)+1)));
  document.querySelector('.sidebar-btn[data-target="section5"]')?.addEventListener('dblclick',()=>window.open('https://ak.hypergryph.com/#index','_blank'));
}

/* ==================== 适龄提示拖拽 ==================== */
function initDraggableAgeImage(){
  const img=document.getElementById('ageImg'); if(!img) return;
  let d=false,sx,sy,tx=0,ty=0;
  img.style.transform='translate(0px,0px)';
  img.addEventListener('mousedown',e=>{e.preventDefault();d=true;sx=e.clientX;sy=e.clientY;img.style.transition='none';});
  document.addEventListener('mousemove',e=>{if(!d)return;tx=e.clientX-sx;ty=e.clientY-sy;img.style.transform=`translate(${tx}px,${ty}px)`;});
  document.addEventListener('mouseup',()=>{if(!d)return;d=false;img.style.transition='transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';if(ty>20)window.scrollTo({top:0,behavior:'smooth'});img.style.transform='translate(0px,0px)';tx=ty=0;setTimeout(()=>img.style.transition='transform 0.3s ease',400);});
  img.addEventListener('dragstart',e=>e.preventDefault());
}

/* ==================== 基础时间、倒计时、主题 ==================== */
function initBasicFunctions(){
  const f=n=>n.toString().padStart(2,'0');
  function tick(){
    const n=new Date();
    document.getElementById('timeDisplay').textContent=`${f(n.getHours())}:${f(n.getMinutes())}:${f(n.getSeconds())}`;
    document.getElementById('hms').textContent=`${f(n.getHours())}:${f(n.getMinutes())}:${f(n.getSeconds())}`;
    document.getElementById('ymd').textContent=`${n.getFullYear()}-${f(n.getMonth()+1)}-${f(n.getDate())}`;
  }
  tick();setInterval(tick,1000);
  function cd(){
    const t=new Date(2027,5,7),d=Math.ceil((t-new Date())/86400000);
    document.getElementById('countdownDisplay').textContent=`距离2027年高考还有 ${d} 天`;
  }
  cd();setInterval(cd,86400000);
  document.getElementById('darkModeBtn').onclick=toggleDarkMode;
}

function initGlitchEffect(){
  const el=document.getElementById('countdownDisplay');
  if(!el)return;
  el.addEventListener('mouseenter',()=>{el.classList.add('glitch-active');setTimeout(()=>el.classList.remove('glitch-active'),500);});
  el.addEventListener('mouseleave',()=>el.classList.remove('glitch-active'));
}

/* ==================== 抽号 ==================== */
function initDrawFunctions(){
  const b=document.getElementById('randomBtn'),r=document.getElementById('resultDisplay');
  document.getElementById('drawControl').innerHTML=`<label><input type="checkbox" id="noRepeatCheck" checked> 禁止重复</label><button onclick="resetDrawPool()" style="padding:4px 12px;border:1px solid var(--border);border-radius:0;">重置</button>`;
  document.getElementById('noRepeatCheck').addEventListener('change',e=>noRepeatMode=e.target.checked);
  b.onclick=()=>{
    if(!rolling){
      rolling=true;b.textContent='停止';
      timer=setInterval(()=>{
        let p=Array.from({length:56},(_,i)=>i+1);
        if(noRepeatMode){p=p.filter(n=>!drawnNumbers.includes(n));if(!p.length){clearInterval(timer);r.textContent='完';rolling=false;b.textContent='开始';return;}}
        r.textContent=p[Math.floor(Math.random()*p.length)];
      },40);
    }else{
      rolling=false;b.textContent='开始';clearInterval(timer);
      const num=parseInt(r.textContent);
      if(noRepeatMode&&!drawnNumbers.includes(num)&&!isNaN(num)){drawnNumbers.push(num);updateDrawHistory();}
    }
  };
}
function updateDrawHistory(){ document.getElementById('drawHistory').textContent=drawnNumbers.length?`已抽：${drawnNumbers.sort((a,b)=>a-b).join(', ')}`:'已抽号码：无'; }
function resetDrawPool(){ drawnNumbers=[]; document.getElementById('resultDisplay').textContent=''; updateDrawHistory(); }

/* ==================== 富文本编辑 ==================== */
function applyStyleToSelection(s,v){
  const sel=window.getSelection(); if(!sel.rangeCount) return;
  const range=sel.getRangeAt(0);
  if(range.collapsed&&!['justifyLeft','justifyCenter','justifyRight'].includes(s)) return;
  if(s==='bold')document.execCommand('bold');
  else if(s==='italic')document.execCommand('italic');
  else if(s==='underline')document.execCommand('underline');
  else if(s.startsWith('justify'))document.execCommand(s);
  else if(s==='fontSize'){const sp=document.createElement('span');sp.style.fontSize=v;range.surroundContents(sp);sel.removeAllRanges();sel.addRange(range);}
  else if(s==='fontFamily')document.execCommand('fontName',false,v);
  else if(s==='color')document.execCommand('foreColor',false,v);
}
function insertImage(){
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
  inp.onchange=e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>document.execCommand('insertImage',false,ev.target.result);r.readAsDataURL(f);}};
  inp.click();
}
function getCurrentFormat(){
  const sel=window.getSelection();if(!sel.rangeCount)return null;
  let n=sel.getRangeAt(0).startContainer;while(n&&n.nodeType!==1)n=n.parentNode;
  if(!n)return null;const s=window.getComputedStyle(n);
  return{fontFamily:s.fontFamily,fontSize:s.fontSize,color:s.color,fontWeight:s.fontWeight,fontStyle:s.fontStyle,textDecoration:s.textDecoration,textAlign:s.textAlign};
}
function applyFormatToTarget(fmt){
  const cell=document.activeElement;if(!cell||cell.getAttribute('contenteditable')!=='true')return;
  const sel=window.getSelection();
  if(sel.rangeCount&&sel.getRangeAt(0).collapsed){const r=document.createRange();r.selectNodeContents(cell);sel.removeAllRanges();sel.addRange(r);}
  applyStyleToSelection('fontFamily',fmt.fontFamily);applyStyleToSelection('fontSize',fmt.fontSize);
  if(fmt.color&&fmt.color!=='rgb(0,0,0)')applyStyleToSelection('color',fmt.color);
  if(fmt.fontWeight==='bold'||parseInt(fmt.fontWeight)>=600)document.execCommand('bold');
  if(fmt.fontStyle==='italic')document.execCommand('italic');
  if(fmt.textDecoration.includes('underline'))document.execCommand('underline');
  if(fmt.textAlign==='left')document.execCommand('justifyLeft');
  else if(fmt.textAlign==='center')document.execCommand('justifyCenter');
  else if(fmt.textAlign==='right')document.execCommand('justifyRight');
}

/* ==================== 作业工具栏 ==================== */
function initHomeworkFunctions(){
  const save=()=>{const d={};['guoxue','math','english','physics','chemistry','biology','note'].forEach(k=>d[k]=document.getElementById('hw-'+k).innerHTML);localStorage.setItem('dt2027_homework',JSON.stringify(d));};
  const load=()=>{const s=localStorage.getItem('dt2027_homework');if(s){const d=JSON.parse(s);Object.keys(d).forEach(k=>{const el=document.getElementById('hw-'+k);if(el)el.innerHTML=d[k]||'';});}};
  document.getElementById('homeworkStyleTop').innerHTML=`
    <button class="control-btn" id="hwBtnUndo" title="撤销"><i class="fas fa-undo"></i></button>
    <button class="control-btn" id="hwBtnRedo" title="重做"><i class="fas fa-redo"></i></button>
    <button class="control-btn" id="hwBtnBold" title="加粗"><b>B</b></button>
    <button class="control-btn" id="hwBtnItalic" title="斜体"><i>I</i></button>
    <button class="control-btn" id="hwBtnUnderline" title="下划线"><u>U</u></button>
    <button class="control-btn" id="hwBtnJustifyLeft" title="左对齐"><svg width="18" height="14"><line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    <button class="control-btn" id="hwBtnJustifyCenter" title="居中"><svg width="18" height="14"><line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    <button class="control-btn" id="hwBtnJustifyRight" title="右对齐"><svg width="18" height="14"><line x1="0" y1="2" x2="18" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    <select id="hwSelectFontFamily">
      <option value="">默认字体</option>
      <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
      <option value="'黑体', SimHei, sans-serif">黑体</option>
      <option value="'楷体', KaiTi, serif">楷体</option>
      <option value="'SSGYSJ', '苏新诗古印宋简', serif">苏新诗古印宋简</option>
      <option value="'MaoTi', '毛体', cursive">毛体</option>
      <option value="'Consolas', monospace">Consolas</option>
    </select>
    <select id="hwSelectFontSize"><option value="12px">12</option><option value="14px">14</option><option value="16px">16</option><option value="18px">18</option><option value="20px">20</option><option value="24px">24</option><option value="28px">28</option><option value="32px" selected>32</option><option value="36px">36</option><option value="48px">48</option><option value="64px">64</option><option value="96px">96</option></select>
    <button class="control-btn" id="hwBtnInsertImage" title="插入图片"><i class="fas fa-image"></i></button>
    <button class="control-btn" id="hwBtnFormatBrush" title="格式刷"><i class="fas fa-paint-brush"></i></button>`;
  const colorRow=document.getElementById('colorRow');
  [{n:'红',c:'#FF0000'},{n:'橙',c:'#FF7F00'},{n:'黄',c:'#FFFF00'},{n:'绿',c:'#00FF00'},{n:'青',c:'#00FFFF'},{n:'蓝',c:'#0000FF'},{n:'紫',c:'#8B00FF'},{n:'粉',c:'#FF69B4'},{n:'棕',c:'#8B4513'},{n:'灰',c:'#808080'},{n:'黑',c:'#000000'},{n:'白',c:'#FFFFFF'}].forEach(c=>{const btn=document.createElement('button');btn.className='color-btn';btn.innerHTML=`<span class="color-swatch" style="background:${c.c};"></span> ${c.n}`;btn.addEventListener('click',()=>applyStyleToSelection('color',c.c));colorRow.appendChild(btn);});
  document.getElementById('hwBtnUndo').onclick=()=>document.execCommand('undo');
  document.getElementById('hwBtnRedo').onclick=()=>document.execCommand('redo');
  document.getElementById('hwBtnBold').onclick=()=>applyStyleToSelection('bold');
  document.getElementById('hwBtnItalic').onclick=()=>applyStyleToSelection('italic');
  document.getElementById('hwBtnUnderline').onclick=()=>applyStyleToSelection('underline');
  document.getElementById('hwBtnJustifyLeft').onclick=()=>applyStyleToSelection('justifyLeft');
  document.getElementById('hwBtnJustifyCenter').onclick=()=>applyStyleToSelection('justifyCenter');
  document.getElementById('hwBtnJustifyRight').onclick=()=>applyStyleToSelection('justifyRight');
  document.getElementById('hwBtnInsertImage').onclick=insertImage;
  document.getElementById('hwSelectFontSize').onchange=e=>{syncingToolbar=true;applyStyleToSelection('fontSize',e.target.value);setTimeout(()=>syncingToolbar=false,10);};
  document.getElementById('hwSelectFontFamily').onchange=e=>applyStyleToSelection('fontFamily',e.target.value);
  const brush=document.getElementById('hwBtnFormatBrush');
  brush.onclick=()=>{
    if(!formatBrushActive){const f=getCurrentFormat();if(!f)return showToast('请先点击作业单元格');formatBrushStyle=f;formatBrushActive=true;brush.style.color='var(--accent)';document.body.classList.add('format-brush-active');}
    else{formatBrushActive=false;brush.style.color='';document.body.classList.remove('format-brush-active');}
  };
  document.addEventListener('mouseup',e=>{
    if(!formatBrushActive||!formatBrushStyle)return;
    const cell=e.target.closest('[contenteditable="true"][id^="hw-"]');if(!cell)return;
    setTimeout(()=>{if(formatBrushActive){applyFormatToTarget(formatBrushStyle);formatBrushActive=false;brush.style.color='';document.body.classList.remove('format-brush-active');}},10);
  });
  document.getElementById('section1').insertAdjacentHTML('beforeend','<div style="text-align:center;margin-top:16px;"><button style="background:#DC2626;color:white;border:none;padding:8px 24px;border-radius:0;cursor:pointer;" onclick="if(confirm(\'确定清空？\')){[\'guoxue\',\'math\',\'english\',\'physics\',\'chemistry\',\'biology\',\'note\'].forEach(id=>document.getElementById(\'hw-\'+id).innerHTML=\'\');localStorage.removeItem(\'dt2027_homework\');}">一键清空</button></div>');
  document.querySelectorAll('[id^="hw-"]').forEach(el=>{el.addEventListener('input',()=>{clearTimeout(el._saveTimer);el._saveTimer=setTimeout(save,1000);});el.addEventListener('blur',save);});
  load();
  document.addEventListener('selectionchange',()=>{
    if(syncingToolbar)return;
    const el=document.activeElement;if(!el||el.getAttribute('contenteditable')!=='true')return;
    const sel=window.getSelection();if(!sel.rangeCount)return;
    let n=sel.getRangeAt(0).startContainer;while(n&&n.nodeType!==1)n=n.parentNode;
    if(!n)return;const fs=window.getComputedStyle(n).fontSize;
    const selEl=document.getElementById('hwSelectFontSize');
    for(const o of selEl.options)if(o.value===fs){selEl.value=fs;break;}
  });
}

/* ==================== 课表高亮 ==================== */
function initCourseHighlight(){
  const cols=6;
  function buildGrid(t){
    const rows=t.rows;const grid=Array.from({length:rows.length},()=>Array(cols).fill(null));
    for(let r=0;r<rows.length;r++){
      let c=0;const cells=rows[r].cells;
      for(let i=0;i<cells.length;i++){
        while(c<cols&&grid[r][c]!==null)c++;
        if(c>=cols)break;
        const cell=cells[i];const rs=parseInt(cell.rowSpan)||1,cs=parseInt(cell.colSpan)||1;
        for(let dr=0;dr<rs;dr++)for(let dc=0;dc<cs;dc++){if(r+dr<rows.length&&c+dc<cols)grid[r+dr][c+dc]={cell,row:r+dr,col:c+dc};}
        c+=cs;
      }
    }
    return grid;
  }
  function highlight(){
    const today=new Date().getDay();if(today<1||today>5)return;
    const table=document.getElementById('course-table');if(!table)return;
    const grid=buildGrid(table);
    document.querySelectorAll('#course-table td').forEach(td=>td.classList.remove('today-course'));
    for(let r=0;r<grid.length;r++){const entry=grid[r][today];if(entry&&entry.cell)entry.cell.classList.add('today-course');}
  }
  highlight();setInterval(highlight,3600000);
}

function openFullscreen(){document.getElementById('fullScreenClock').classList.add('show');}
function closeFullscreen(){document.getElementById('fullScreenClock').classList.remove('show');}

/* 主题切换 */
const FLASH_TRIGGER_COUNT=10,FLASH_TRIGGER_TIME=5000,FLASH_DURATION=3000;
let rolling=false,timer=null,clickRecords=[],drawnNumbers=[],noRepeatMode=true,
    formatBrushActive=false,formatBrushStyle=null,syncingToolbar=false;
function toggleDarkMode(){
  const now=Date.now();clickRecords.push(now);clickRecords=clickRecords.filter(t=>now-t<FLASH_TRIGGER_TIME);
  if(clickRecords.length>=FLASH_TRIGGER_COUNT){triggerRainbowFlash();clickRecords=[];}
  document.body.classList.toggle('dark');
  document.getElementById('darkModeBtn').innerHTML=document.body.classList.contains('dark')?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
  localStorage.setItem('darkMode',document.body.classList.contains('dark'));
}
function triggerRainbowFlash(){
  const wasDark=document.body.classList.contains('dark');
  document.body.classList.add('rainbow-flash');document.body.classList.remove('dark');
  setTimeout(()=>{document.body.classList.remove('rainbow-flash');if(wasDark)document.body.classList.add('dark');},FLASH_DURATION);
}

/* 菜单 */
function initLinkMenu(){
  const t=document.getElementById('linkMenuTrigger'),d=document.getElementById('linkDropdown');
  t.onclick=e=>{e.stopPropagation();d.style.display=d.style.display==='flex'?'none':'flex';};
  document.addEventListener('click',()=>d.style.display='none');
}
function openSSZX(){window.open('https://www.sszx.cn','_blank');}
function open12306(){window.open('https://www.12306.cn/index/','_blank');}
function openRecentWork(){window.open('https://delldai-art.github.io','_blank');}
function hideLinkMenu(){document.getElementById('linkDropdown').style.display='none';}

/* 下滑入场 */
function initScrollAnimation(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');}});},{threshold:0.1});
  document.querySelectorAll('.page-section').forEach(s=>obs.observe(s));
}

/* 开屏 */
function initSplash(){
  const bar=document.getElementById('progressBar'),pct=document.getElementById('percentDisplay');
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.floor(Math.random()*15)+5;if(p>100)p=100;
    bar.style.width=p+'%';pct.textContent=p+'%';
    if(p>=100){
      clearInterval(iv);
      document.getElementById('splash').classList.add('fall-down');
      document.getElementById('splash').addEventListener('animationend',function(){this.remove();});
    }
  },150);
}

/* ==================== 2048 小游戏 ==================== */
let gameBoard=[];
function initGame(){
  gameBoard=Array(4).fill().map(()=>Array(4).fill(0));
  addRandomTile();
  addRandomTile();
  renderGame();
  document.getElementById('game2048').style.display='block';
}
function closeGame(){
  document.getElementById('game2048').style.display='none';
}
function addRandomTile(){
  const empty=[];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(gameBoard[r][c]===0)empty.push([r,c]);
  if(empty.length===0) return;
  const [r,c]=empty[Math.floor(Math.random()*empty.length)];
  gameBoard[r][c]=Math.random()<0.9?2:4;
}
function renderGame(){
  const grid=document.getElementById('gameGrid');
  grid.innerHTML='';
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const cell=document.createElement('div');
      cell.className='cell';
      const val=gameBoard[r][c];
      cell.textContent=val||'';
      if(val) cell.setAttribute('data-value',val);
      grid.appendChild(cell);
    }
  }
}
function move(dir){
  let moved=false;
  const old=gameBoard.map(r=>[...r]);
  if(dir==='left'){ for(let r=0;r<4;r++){ let row=gameBoard[r].filter(v=>v); for(let i=0;i<row.length-1;i++){ if(row[i]===row[i+1]){ row[i]*=2; row.splice(i+1,1); } } while(row.length<4) row.push(0); gameBoard[r]=row; } }
  else if(dir==='right'){ for(let r=0;r<4;r++){ let row=gameBoard[r].filter(v=>v); for(let i=row.length-1;i>0;i--){ if(row[i]===row[i-1]){ row[i]*=2; row.splice(i-1,1); i--; } } while(row.length<4) row.unshift(0); gameBoard[r]=row; } }
  else if(dir==='up'){ for(let c=0;c<4;c++){ let col=[]; for(let r=0;r<4;r++)if(gameBoard[r][c])col.push(gameBoard[r][c]); for(let i=0;i<col.length-1;i++){ if(col[i]===col[i+1]){ col[i]*=2; col.splice(i+1,1); } } while(col.length<4) col.push(0); for(let r=0;r<4;r++) gameBoard[r][c]=col[r]; } }
  else if(dir==='down'){ for(let c=0;c<4;c++){ let col=[]; for(let r=0;r<4;r++)if(gameBoard[r][c])col.push(gameBoard[r][c]); for(let i=col.length-1;i>0;i--){ if(col[i]===col[i-1]){ col[i]*=2; col.splice(i-1,1); i--; } } while(col.length<4) col.unshift(0); for(let r=0;r<4;r++) gameBoard[r][c]=col[r]; } }
  for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(gameBoard[r][c]!==old[r][c]) moved=true;
  if(moved){ addRandomTile(); renderGame(); }
}
document.addEventListener('keydown',function(e){
  if(document.getElementById('game2048').style.display!=='block') return;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
    e.preventDefault();
    move(e.key.replace('Arrow','').toLowerCase());
  }
});

/* 右下角双击打开游戏 */
document.addEventListener('dblclick',function(e){
  if(document.getElementById('game2048').style.display==='block') return;
  if(e.clientX>window.innerWidth-60 && e.clientY>window.innerHeight-60){
    initGame();
  }
});

/* 页面初始化 */
window.addEventListener('load',()=>{
  initSplash();
  initBasicFunctions();
  initDrawFunctions();
  initHomeworkFunctions();
  initCourseHighlight();
  initSidebarAndNav();
  initDraggableAgeImage();
  initLinkMenu();
  initScrollAnimation();
  initGlitchEffect();
  initScrollSpy();
  if(localStorage.getItem('darkMode')==='true'){document.body.classList.add('dark');document.getElementById('darkModeBtn').innerHTML='<i class="fas fa-sun"></i>';}
  document.querySelector('.hero-title').addEventListener('click',()=>showToast('六百六十六，这都被你发现了'));
  document.getElementById('timeDisplay').addEventListener('click', openFullscreen);
  document.getElementById('fullScreenClock').addEventListener('click', closeFullscreen);
  updateVisitCount();
});

function updateVisitCount(){
  let c=parseInt(localStorage.getItem('dt2027_visit_count')||0)+1;
  localStorage.setItem('dt2027_visit_count',c);
  document.getElementById('visitCount').textContent=`本页已被访问 ${c} 次`;
}
(function(){const t=document.title;document.addEventListener('visibilitychange',()=>{document.title=document.hidden?'哈哈哈哈哈':t;});})();