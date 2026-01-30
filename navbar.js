

const mainPage_name="Home";

//===============================


let container=document.querySelector('.container');
if(!container){
container=document.createElement('div');
container.classList.add("container");
document.body.appendChild(container);
}

const topbar=document.createElement("div");

const topbar_labels=[mainPage_name,"Analysis"];
topbar_labels.forEach(label=>{
    const div=document.createElement('div');
    div.classList.add(label.toLowerCase());
    div.textContent=label;
    div.onclick=()=>{
        if(label=="Home"){window.location.href="/ais";}
        else
        {window.location.href=`${label.toLowerCase()}.html`}
    }
    topbar.appendChild(div);
})
topbar.classList.add("topbar");
container.appendChild(topbar);

function highlightCurrentTab(){
const label_obj=document.querySelector('.label')
let label_to_highlight=label_obj.textContent.toLowerCase();
label_obj.style.display="none";

    if(label_obj)
        document.querySelector(`.${label_to_highlight}`).classList.add("navbar-select");


}
highlightCurrentTab();


