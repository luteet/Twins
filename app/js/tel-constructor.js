function telConstructor(){function e(e){let t=e.getBoundingClientRect();return{top:t.top+window.pageYOffset,right:t.right+window.pageXOffset,bottom:t.bottom+window.pageYOffset,left:t.left+window.pageXOffset}}let t=document.querySelectorAll(".tel-constructor-input"),l=[];t.forEach(t=>{let s=t.dataset.tcCountryCode,n=t.dataset.tcSample,r="true"==t.dataset.tcStartOnInit,o=t.closest("form"),a=(o.querySelector('[type="submit"]'),t.dataset.tcErrorClass?t.dataset.tcErrorClass:"_error"),u=t.dataset.tcErrorMessageText,c=[],i=n.replace(/[^a-z]/g,"").length,f,p="false"!=t.dataset.tcPlus?"+":"",g=`${p}${s}${n}`.indexOf("x"),d=/[^0-9]/g;c=n.split("");let v="",h=g;function $(e){let t="";for(let l=0,n=0;n<i;l++)void 0!==e[n]?"x"!=c[l]?t+=`${c[l]}`:(t+=`${e[n]}`,n++,h=l+1+s.length+p.length):"x"!=c[l]?t+=`${c[l]}`:(t+="_",n++);return void 0==e[0]&&(h=g),t}r&&(t.value=`${p}${s}${$("")}`),t.oninput=function(e){let l=t.value.replace(d,"");l=l.substr(s.length),t.value=`${p}${s}${t.value.substr(s.length+1)}`,"insertText"==e.inputType||(e.inputType="deleteContentBackward",v&&(l=(l=v.replace(d,"")).substr(s.length)),l=l.substring(0,l.length-1)),t.value=`${p}${s}${$(l)}`,t.setSelectionRange(h,h),v=t.value},t.onfocus=function(e){let l=t.value.replace(d,"");l=l.substr(s.length),t.value=`${p}${s}${t.value.substr(s.length+1)}`,t.value=`${p}${s}${$(l)}`,setTimeout(()=>{t.setSelectionRange(h,h)},50)},t.onclick=function(e){setTimeout(()=>{t.setSelectionRange(h,h)},0)},t.onkeyup=function(e){setTimeout(()=>{t.setSelectionRange(h,h)},0)},o&&o.addEventListener("submit",function(n){if(t.value.replace(d,"").length<i+s.length){n.preventDefault(),t.classList.add(a);let r=document.createElement("div");u&&(document.querySelector(".tel-constructor-error-message")&&document.querySelector(".tel-constructor-error-message").remove(),r.classList.add("tel-constructor-error-message"),r.textContent=u,r.style.left=e(t).left+t.offsetWidth/2+"px",r.style.top=e(t).top+"px",l.push([r,t]),document.body.append(r),setTimeout(()=>{r.classList.add("_visible")},0)),window.addEventListener("resize",function(){for(let t=0;t<l.length;t++)l[t][0]&&l[t][1]&&(l[t][0].style.left=e(l[t][1]).left+l[t][1].offsetWidth/2+"px",l[t][0].style.top=e(l[t][1]).top+"px")}),t.onblur=function(){u&&(r.classList.remove("_visible"),setTimeout(()=>{r.remove()},400)),t.classList.remove(a)}}})})}telConstructor();