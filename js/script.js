const menuButton=document.querySelector(".menu-button");
const navigation=document.querySelector(".navigation");
const themeButton=document.querySelector(".theme-button");
const themeIcon=themeButton?.querySelector(".material-symbols-rounded");

menuButton?.addEventListener("click",()=>{
  const isOpen=navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(isOpen));
});

navigation?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  navigation.classList.remove("open");
  menuButton?.setAttribute("aria-expanded","false");
}));

if(localStorage.getItem("portfolio-theme")==="dark") document.body.classList.add("dark-theme");

function updateThemeButton(){
  if(!themeButton||!themeIcon)return;
  const isDark=document.body.classList.contains("dark-theme");
  themeIcon.textContent=isDark?"light_mode":"dark_mode";
  themeButton.setAttribute("aria-label",isDark?"라이트 모드로 전환":"다크 모드로 전환");
}

updateThemeButton();
themeButton?.addEventListener("click",()=>{
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("portfolio-theme",document.body.classList.contains("dark-theme")?"dark":"light");
  updateThemeButton();
});

document.querySelectorAll(".current-year").forEach(el=>el.textContent=new Date().getFullYear());

const filters=document.querySelectorAll(".filter-button");
const cards=document.querySelectorAll(".activity-card");
filters.forEach(button=>button.addEventListener("click",()=>{
  filters.forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  cards.forEach(card=>card.classList.toggle("hidden",button.dataset.filter!=="all"&&card.dataset.category!==button.dataset.filter));
}));
