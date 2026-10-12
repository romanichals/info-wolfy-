const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  navigation?.classList.remove('is-open');
}
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 741px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = document.querySelector('.video-dialog');
const videoFrame = document.querySelector('#video-frame');
const consent = document.querySelector('.video-consent');
let selectedVideo = null;
document.querySelectorAll('.video-launch').forEach(button => {
  button.addEventListener('click', () => {
    selectedVideo = button.dataset.video;
    document.querySelector('#video-title').textContent = button.dataset.title;
    document.querySelector('#video-external').href = `https://www.youtube.com/watch?v=${encodeURIComponent(selectedVideo)}`;
    consent.hidden = false;
    videoFrame.replaceChildren();
    dialog.showModal();
  });
});
document.querySelector('#load-video')?.addEventListener('click', () => {
  if (!selectedVideo || !/^[A-Za-z0-9_-]{11}$/.test(selectedVideo)) return;
  const iframe = document.createElement('iframe');
  iframe.title = document.querySelector('#video-title').textContent;
  iframe.src = `https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&rel=0`;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  videoFrame.replaceChildren(iframe);
  consent.hidden = true;
});
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('close', () => { videoFrame.replaceChildren(); selectedVideo = null; });
dialog?.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
