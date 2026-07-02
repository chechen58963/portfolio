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

const contactForm=document.querySelector("#contactForm");
const responseMessage=document.querySelector("#responseMessage");
const makeWebhookUrl="https://hook.eu1.make.com/7i1rdydbj2ex7umxgk04n8vdnj8aff41";

function showFormMessage(type,message){
  if(!responseMessage)return;
  responseMessage.hidden=false;
  responseMessage.className=`response-message ${type}`;
  responseMessage.textContent=message;
}

contactForm?.addEventListener("submit",async event=>{
  event.preventDefault();

  const submitButton=contactForm.querySelector("button[type='submit']");
  const buttonText=submitButton?.querySelector(".submit-button-text");
  const name=document.querySelector("#visitorName").value.trim();
  const email=document.querySelector("#visitorEmail").value.trim();
  const message=document.querySelector("#visitorMessage").value.trim();

  if(makeWebhookUrl.includes("your_unique_webhook_id")){
    showFormMessage("error","Webhook URL이 아직 설정되지 않았습니다. Make.com에서 발급받은 URL을 script.js에 입력해 주세요.");
    return;
  }

  submitButton.disabled=true;
  if(buttonText)buttonText.textContent="질문을 분석하고 있습니다...";
  showFormMessage("info","AI 에이전트가 질문을 분석 중입니다. 잠시만 기다려 주세요.");

  try{
    const response=await fetch(makeWebhookUrl,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        visitor_name:name,
        visitor_email:email,
        visitor_message:message
      })
    });

    if(!response.ok)throw new Error(`Webhook request failed: ${response.status}`);

    showFormMessage("success","✅ 질문이 성공적으로 접수되었습니다! 입력하신 이메일로 AI의 답변이 곧 발송됩니다.");
    contactForm.reset();
  }catch(error){
    console.error("AI survey submission failed",error);
    showFormMessage("error","❌ 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }finally{
    submitButton.disabled=false;
    if(buttonText)buttonText.textContent="AI 에이전트에게 질문하기";
  }
});
