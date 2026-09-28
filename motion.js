/* Ringan: hanya transform, satu rAF saat perlu, berhenti saat di luar layar. */
(function(){
  var st=document.querySelector('.stage'), ph=document.querySelector('.phone');
  if(!ph||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var vis=true, raf=0, tx=-18, ty=4, cx=-18, cy=4, t0=performance.now(), idle=true;
  new IntersectionObserver(function(e){ vis=e[0].isIntersecting; if(vis&&!raf) raf=requestAnimationFrame(loop); }).observe(st);
  window.addEventListener('pointermove',function(e){
    idle=false; tx=(e.clientX/innerWidth-.5)*46; ty=-(e.clientY/innerHeight-.5)*18;
  },{passive:true});
  window.addEventListener('pointerleave',function(){ idle=true; });
  function loop(now){
    raf=0; if(!vis) return;
    if(idle){ var s=(now-t0)/1000; tx=Math.sin(s*.7)*22; ty=4+Math.sin(s*.5)*3; }
    cx+=(tx-cx)*.08; cy+=(ty-cy)*.08;
    ph.style.transition='none';
    ph.style.transform='rotateX('+cy.toFixed(2)+'deg) rotateY('+cx.toFixed(2)+'deg)';
    raf=requestAnimationFrame(loop);
  }
  raf=requestAnimationFrame(loop);

  /* kartu: miring halus saat disentuh pointer, tanpa loop */
  if(matchMedia('(hover:hover)').matches) document.querySelectorAll('.duality-col,.bento-item').forEach(function(el){
    el.style.transition='transform .35s cubic-bezier(.32,.72,0,1)';
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.transform='perspective(900px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*6).toFixed(2)+'deg)';
    });
    el.addEventListener('pointerleave',function(){ el.style.transform=''; });
  });
})();
