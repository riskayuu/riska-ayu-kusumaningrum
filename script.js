function downloadCV() {
  window.open("assets/cv-riska.pdf", "_blank");
}

/* ===== CUSTOM CURSOR ===== */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
});
(function animateRing() {
  ringX += (mouseX - ringX) * .45;
  ringY += (mouseY - ringY) * .45;
  ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll('a,button,.tl-card,.skill-item,.project-card,.doc-card,.ach-card,.about-chip,.footer-social-btn,.footer-contact-item,.footer-links a,.cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));


/* ===== ACTIVE NAV ===== */
const navLinks = document.querySelectorAll('.nav-links a');
const allSections = document.querySelectorAll('section[id],header[id]');
function activateLink() {
  let current = '';
  allSections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', activateLink, { passive: true });
activateLink();


/* ===== SCROLL REVEAL ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));


/* ===== FORCE DOWNLOAD CV ===== */
function forceDownloadCV(url, filename) {
  fetch(url, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error('network');
      return res.arrayBuffer();
    })
    .then(buffer => {
      const blobUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/octet-stream' }));
      const a = document.createElement('a');
      a.style.cssText = 'position:fixed;top:-999px;left:-999px';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 5000);
    })
    .catch(() => {
      const a = document.createElement('a');
      a.style.cssText = 'position:fixed;top:-999px;left:-999px';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 2000);
    });
}
document.querySelectorAll('.btn-nav-cv, .btn-cv-icon').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    forceDownloadCV(this.getAttribute('href'), this.getAttribute('download') || 'CV Riska Ayu Kusumaningrum.pdf');
  });
});


/* ===== CERTIFICATES CAROUSEL (SCROLLBAR) ===== */
(function () {
  const scroll = document.getElementById('certScroll');
  const thumb = document.getElementById('certThumb');
  if (!scroll || !thumb) return;

  function updateThumb() {
    const ratio = scroll.scrollLeft / (scroll.scrollWidth - scroll.clientWidth);
    const trackWidth = scroll.parentElement.clientWidth;
    const thumbWidth = Math.max(40, (scroll.clientWidth / scroll.scrollWidth) * trackWidth);
    const maxLeft = trackWidth - thumbWidth;
    const left = ratio * maxLeft;
    thumb.style.width = thumbWidth + 'px';
    thumb.style.left = left + 'px';
  }

  scroll.addEventListener('scroll', updateThumb, { passive: true });
  window.addEventListener('resize', updateThumb);
  updateThumb();

  // Drag to scroll (desktop)
  let isDragging = false, startX = 0, startScroll = 0;
  scroll.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX;
    startScroll = scroll.scrollLeft;
    scroll.classList.add('dragging');
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    scroll.classList.remove('dragging');
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    scroll.scrollLeft = startScroll - (e.pageX - startX);
    updateThumb();
  });

  // Klik pada track untuk scroll
  document.querySelector('.cert-scrollbar-track')?.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    scroll.scrollLeft = clickRatio * (scroll.scrollWidth - scroll.clientWidth);
  });
})();


/* ===== LIGHTBOX ===== */
function clbOpen(src, title, type) {
  const lb = document.getElementById('clb');
  document.getElementById('clbTitle').textContent = title;
  document.getElementById('clbOpenLink').href = src;
  const body = document.getElementById('clbBody');

  if (type === 'img') {
    body.innerHTML = '<img src="' + src + '" alt="' + title + '">';
  } else {
    const absoluteUrl = new URL(src, window.location.href).href;
    const googleViewer = 'https://docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(absoluteUrl);

    body.innerHTML =
      '<div id="pdfWrap" style="width:100%;height:60vh;min-height:480px;position:relative;">' +
        '<iframe id="pdfNative" src="' + src + '" ' +
          'style="width:100%;height:100%;border:none;border-radius:10px;display:block;" ' +
          'title="' + title + '"></iframe>' +
        '<div id="pdfFallback" style="display:none;position:absolute;inset:0;' +
          'background:linear-gradient(135deg,#0c1829,#111e35);border-radius:10px;' +
          'flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:32px;text-align:center;">' +
          '<i class="fas fa-file-pdf" style="font-size:3rem;color:rgba(56,189,248,.4)"></i>' +
          '<p style="color:#94a3b8;font-size:.85rem;line-height:1.7;">Browser tidak bisa menampilkan PDF.<br>Pilih salah satu opsi di bawah:</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">' +
            '<a href="' + googleViewer + '" target="_blank" ' +
              'style="display:inline-flex;align-items:center;gap:7px;padding:10px 20px;' +
              'background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);' +
              'border-radius:100px;color:#38bdf8;text-decoration:none;font-size:.78rem;font-weight:700;">' +
              '<i class="fas fa-external-link-alt"></i> Buka di Google Viewer</a>' +
            '<a href="' + src + '" target="_blank" ' +
              'style="display:inline-flex;align-items:center;gap:7px;padding:10px 20px;' +
              'background:rgba(129,140,248,.1);border:1px solid rgba(129,140,248,.25);' +
              'border-radius:100px;color:#818cf8;text-decoration:none;font-size:.78rem;font-weight:700;">' +
              '<i class="fas fa-download"></i> Download PDF</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    const iframe = document.getElementById('pdfNative');
    const fallback = document.getElementById('pdfFallback');
    let loaded = false;

    function showFallback() {
      iframe.style.display = 'none';
      fallback.style.display = 'flex';
    }

    iframe.onload = function () {
      loaded = true;
      try {
        if (iframe.contentDocument && iframe.contentDocument.body) {
          if ((iframe.contentDocument.body.innerText || '').length < 10) showFallback();
        }
      } catch (e) { /* cross-origin = PDF native, sukses */ }
    };
    iframe.onerror = function () { showFallback(); };
    setTimeout(function () { if (!loaded) showFallback(); }, 2500);
  }

  lb.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function clbClose() {
  document.getElementById('clb').classList.remove('on');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('clbBody').innerHTML = ''; }, 300);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') clbClose(); });