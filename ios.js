/* iOS behaviours: theme-color mengikuti tema, swipe-down untuk menutup sheet */
(function(){
  var root=document.documentElement, m=document.querySelector('meta[name=theme-color]');
  if(!m){ m=document.createElement('meta'); m.name='theme-color'; document.head.appendChild(m); }
  function sync(){ m.content=root.classList.contains('dark')?'#000000':'#F2F2F7'; }
  sync(); new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class']});
  var card=document.querySelector('.project-modal-card'); if(!card) return;
  var body=card.querySelector('.project-modal-body'), y0=null, dy=0;
  card.addEventListener('touchstart',function(e){ if(body&&body.scrollTop>0) return; y0=e.touches[0].clientY; dy=0; card.style.transition='none'; },{passive:true});
  card.addEventListener('touchmove',function(e){ if(y0===null) return; dy=Math.max(0,e.touches[0].clientY-y0); card.style.transform='translateY('+dy+'px)'; },{passive:true});
  card.addEventListener('touchend',function(){ if(y0===null) return; card.style.transition=''; card.style.transform=''; if(dy>110){ var c=card.querySelector('.project-modal-close'); if(c) c.click(); } y0=null; });
})();
