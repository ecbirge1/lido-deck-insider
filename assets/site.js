const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.primary-nav');
if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded','false');
  }));
}

document.querySelectorAll('a[href$="ships/index.html"],a[href="index.html"]').forEach(a=>{
  if(a.href.includes('/ships/index.html'))a.href=a.href.replace('/ships/index.html','/ships/fleet.html');
});

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const nested=/\/(ships|guides|products|tools|downloads)\//.test(location.pathname);
const root=nested?'../':'';

document.querySelectorAll('[data-signup-form]').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const status=form.querySelector('.form-status');
    const email=form.querySelector('input[type="email"]');
    if(!email.checkValidity()){
      status.textContent='Please enter a valid email address.';
      email.focus();
      return;
    }
    localStorage.setItem('lidoDeckLead',email.value);
    status.innerHTML=`Your checklist is ready: <a href="${root}downloads/calm-embarkation-checklist.html"><strong>open the printable checklist</strong></a>. Your address is saved only on this device until secure email delivery is connected.`;
    form.reset();
  });
});

/*
  Affiliate link switchboard.
  Add approved Viator destination or category URLs here after the account is active.
  Keeping the links in one object lets us update every matching button without editing page copy.
*/
const affiliateLinks={
  beach:'',
  water:'',
  culture:'',
  adventure:'',
  food:'',
  private:''
};

document.querySelectorAll('[data-affiliate-key]').forEach(link=>{
  const key=link.dataset.affiliateKey;
  const destination=affiliateLinks[key];
  if(!destination)return;
  link.href=destination;
  link.target='_blank';
  link.rel='sponsored noopener';
  link.dataset.affiliateActive='true';
});

const extra=document.createElement('script');
extra.src=root+'assets/site-enhance.js';
extra.onload=()=>{
  const tools=document.createElement('script');
  tools.src=root+'assets/tool-links.js';
  document.body.appendChild(tools);
};
document.body.appendChild(extra);