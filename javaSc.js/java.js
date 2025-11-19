const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function onReady(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

/* -----------------------
   Data: cakes, testimonials (simulate dynamic content)
   This is where you can add new cakes/images and they'll appear automatically.
   ----------------------- */
const CAKES = [
  { id:1, name:"Classic Chocolate", type:"Chocolate", img:"images/5.jpg", desc:"Rich chocolate sponge with ganache finish." },
  { id:2, name:"Vanilla Dream", type:"Vanilla", img:"images/1.jpg", desc:"Light vanilla sponge, buttercream filling." },
  { id:3, name:"Red Velvet", type:"Red Velvet", img:"images/15.jpg", desc:"Classic red velvet with cream cheese." },
  { id:4, name:"Carrot Celebration", type:"Carrot", img:"images/7.jpg", desc:"Moist carrot cake with cinnamon notes." },
  { id:5, name:"Fruit & Cream", type:"Fruit", img:"images/18.jpg", desc:"Seasonal fruit topping with whipped cream." },
  { id:6, name:"Luxe Raspberry", type:"Chocolate", img:"images/19.jpg", desc:"Chocolate base with raspberry compote." }
];

const TESTIMONIALS = [
  { name:"Nadia", text:"Best birthday cake — everyone loved it!" },
  { name:"Sipho", text:"Lovely service and delicious flavors." },
  { name:"Amelia", text:"Arrived on time and the design was perfect." }
];

/* -----------------------
   1) Dynamic content injection (home/services gallery + testimonials)
   ----------------------- */
function renderCakes(targetSelector){
  const container = document.querySelector(targetSelector);
  if(!container) return;
  container.innerHTML = ''; // clean slate

  CAKES.forEach(cake => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', cake.id);
    card.innerHTML = `
      <img src="${cake.img}" alt="${cake.name}">
      <h4>${cake.name}</h4>
      <p class="muted">${cake.desc}</p>
    `;
    // open in lightbox when clicked
    card.addEventListener('click', () => openLightbox(cake));
    container.appendChild(card);
  });
}

function renderTestimonials(){
  const t = $('#testimonials');
  if(!t) return;
  t.innerHTML = '';
  TESTIMONIALS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'testimonial';
    el.innerHTML = `<strong>${item.name}</strong><p>${item.text}</p>`;
    t.appendChild(el);
  });
}

/* -----------------------
   2) Lightbox / Modal (image viewer)
   Single modal used across site. Accessible-ish (aria-hidden toggling).
   ----------------------- */
function openLightbox(cake){
  const modal = $('#modal');
  const modalImg = $('#modalImage');
  const modalCaption = $('#modalCaption');

  modalImg.src = cake.img;
  modalImg.alt = cake.name;
  modalCaption.textContent = `${cake.name} — ${cake.desc}`;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden','false');
}

// close modal
function closeModal(){
  const modal = $('#modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
}

/* -----------------------
   3) Offer popup (small reusable popover)
   ----------------------- */
function showOfferPopup(){
  const p = $('#offerPopup');
  if(!p) return;
  p.style.display = 'block';
  p.setAttribute('aria-hidden','false');
  // hide automatically after 8s
  setTimeout(()=> {
    if(p) p.style.display = 'none';
  }, 8000);
}

/* -----------------------
   4) Search & Filter (for cakes)
   - simple case-insensitive filter on name & type
   ----------------------- */
function setupSearch(){
  const input = $('#searchInput');
  if(!input) return;
  input.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const cards = $$('#cakesGrid .card');
    cards.forEach(card => {
      const id = Number(card.dataset.id);
      const cake = CAKES.find(c => c.id === id);
      if(!cake) return;
      const match = cake.name.toLowerCase().includes(q) || cake.type.toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}

/* -----------------------
   5) Accordion (services page)
   - Simple open/close. Only one open at a time for cleanliness.
   ----------------------- */
function setupAccordion(){
  const accordions = $$('.accordion');
  accordions.forEach(ac => {
    const toggles = Array.from(ac.querySelectorAll('.accordion-toggle'));
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        // close others
        toggles.forEach(t => {
          if(t !== btn) {
            t.classList.remove('open');
            if(t.nextElementSibling) t.nextElementSibling.style.display = 'none';
          }
        });
        // toggle this
        const panel = btn.nextElementSibling;
        const isOpen = btn.classList.toggle('open');
        if(panel) panel.style.display = isOpen ? 'block' : 'none';
      });
    });
  });
}

/* -----------------------
   6) Tabs (About page)
   - Controlled by data-target attribute
   ----------------------- */
function setupTabs(){
  const tabs = $$('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // visual
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // panels
      const targetId = tab.dataset.target;
      const panels = $$('.tab-panel');
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(targetId);
      if(targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* -----------------------
   7) Forms: contact & order (basic client-side handling)
   - No backend here: we simulate sending and show confirmation.
   - Add friendly messages and clear form on success.
   ----------------------- */
function setupForms(){
  const contactForm = $('#contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#contactName').value.trim();
      const email = $('#contactEmail').value.trim();
      const message = $('#contactMessage').value.trim();
      // Basic client validation:
      if(!name || !email || !message){
        alert('Please fill in all fields.');
        return;
      }
      // Simulate send
      $('#contactResponse').classList.remove('hidden');
      $('#contactResponse').textContent = 'Thanks ' + name + '! Your message has been received. We will reply to ' + email + ' shortly.';
      contactForm.reset();
      setTimeout(()=> $('#contactResponse').classList.add('hidden'), 7000);
    });
  }

  const orderForm = $('#orderForm');
  if(orderForm){
    orderForm.addEventListener('submit', e => {
      e.preventDefault();
      const first = $('#firstName').value.trim();
      const last = $('#lastName').value.trim();
      if(!first || !last){
        alert('Please give your name for the order.');
        return;
      }
      const success = `Thanks ${first}! Your order has been received. We will contact you shortly on the number provided.`;
      $('#orderResult').classList.remove('hidden');
      $('#orderResult').textContent = success;
      orderForm.reset();
      setTimeout(()=> $('#orderResult').classList.add('hidden'), 8000);
    });
  }
}

/* -----------------------
   8) Small UI niceties
   - Modal close handlers, ESC to close modal, open offer button.
   ----------------------- */
function setupUI(){
  // modal close
  const modalClose = $('#modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  const modal = $('#modal');
  if(modal){
    modal.addEventListener('click', (ev) => {
      // close when clicking outside inner content
      if(ev.target === modal) closeModal();
    });
  }
  // close with ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      closeModal();
      const p = $('#offerPopup');
      if(p) p.style.display = 'none';
    }
  });

  // open offer
  const openOffer = $('#openOffer');
  if(openOffer) openOffer.addEventListener('click', showOfferPopup);
  const offerClose = $('#offerClose');
  if(offerClose) offerClose.addEventListener('click', () => {
    const p = $('#offerPopup');
    if(p) p.style.display = 'none';
  })
}

/* -----------------------
   9) Accessibility helpers & progressive enhancement
   - Add descriptive alt text, aria-hidden toggles already used for modal.
   ----------------------- */

/* -----------------------
   Boot everything on DOM ready
   ----------------------- */
onReady(() => {
  // render cakes on pages that have cakes grid(s)
  renderCakes('#cakesGrid');       // homepage
  renderCakes('#servicesGallery'); // services page
  renderTestimonials();            // home testimonials

  // setup interactive pieces
  setupSearch();
  setupAccordion();
  setupTabs();
  setupForms();
  setupUI();

  // show a small offer popup after user has been on page for a few seconds (friendly nudge)
  setTimeout(() => {
    // only show on home page
    if(location.pathname.endsWith('index.html') || location.pathname === '/' ){
      showOfferPopup();
    }
  }, 4000);
});
// ENQUIRY FORM
const enquiryForm = $('#enquiryForm');
if(enquiryForm){
    enquiryForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = $('#ename').value.trim();
        const email = $('#eemail').value.trim();
        const service = $('#eservice').value;
        const message = $('#emessage').value.trim();

        // JavaScript validation
        if(!name || !email || !service || !message){
            alert("Please fill in all fields.");
            return;
        }

        // AJAX simulation
        setTimeout(() => {
            $('#enquiryResponse').classList.remove('hidden');
            $('#enquiryResponse').textContent =
        `Thank you ${name}! Your enquiry about "${service}" has been received. We will reply to ${email}`;
        }, 600);

        enquiryForm.reset();
        setTimeout(() => $('#enquiryResponse').classList.add('hidden'), 7000);
    });
}

// CONTACT FORM (AJAX + VALIDATION)
const contactForm = $('#contactForm');
if(contactForm){
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = $('#contactName').value.trim();
        const email = $('#contactEmail').value.trim();
        const msg = $('#contactMessage').value.trim();

        if(msg.length < 10){
            alert("Message must be at least 10 characters.");
            return;
        }

        // AJAX simulation
        setTimeout(() => {
            $('#contactResponse').classList.remove('hidden');
            $('#contactResponse').textContent =
                `Thanks ${name}! Your message has been received. We will reply to ${email}`;
        }, 500);

        contactForm.reset();
        setTimeout(() => $('#contactResponse').classList.add('hidden'), 7000);
    });
}