
let isOn = 0;
let addedListener = false;

browser.runtime.onMessage.addListener(message => {
    if (message.videoChanged) {
    }
});

browser.storage.onChanged.addListener((changes, area) => {
    console.log(area);
    console.log(changes.value.newValue);
    if(area === 'local' && changes.value.newValue > -1) {
        isOn = changes.value.newValue;
    }
    
    if(isOn == 1){
        sortList();
    }
});

document.querySelector("#guide-button").addEventListener("click", (e)=>{

    if(!addedListener){
        document.querySelector("#expander-item").addEventListener("click", (e)=>{
        
            sortList();

        });
        addedListener = true;
    }
});




function sortList(){


    if(isOn < 1) return;

    let list = [];

    const sectionItems = document.querySelector("#section-items");
    const expandableItems = document.querySelector("#expandable-items");
    const expander = document.querySelector("YTD-GUIDE-COLLAPSIBLE-ENTRY-RENDERER");
    const downloader = document.querySelector("Ytd-guide-downloads-entry-renderer");

    const sectionItemList = ["HISTORY","YOUR VIDEOS","WATCH LATER"];
    
    for(const child of sectionItems.children){

        // console.log(child);
        
        if(child != expander && child != downloader){
            const title = child.querySelector(".title").innerHTML.toUpperCase();
            
            if(!sectionItemList.includes(title)){
                list.push([title, child]);
                sectionItems.removeChild(child);
            }
        }
    }


    const childrenList = expandableItems.children;

    for(const child of childrenList){

        list.push([child.querySelector(".title").innerHTML, child]);

    }

    
    list.sort(sortFunction);
    
    // console.log(list);

    expandableItems.innerHTML = "";

    for(let vector of list){

        if(vector[0].toUpperCase() == "LIKED VIDEOS"){

            //console.log(sectionItems.lastElementChild);
            
            //sectionItems.appendChild(vector[1]);
            sectionItems.insertBefore(vector[1], expander);
        }
        else{
            expandableItems.appendChild(vector[1]);
        }
        
    }
    

}

// sort by the first element of the list
function sortFunction(a, b) {
    if (a[0].toUpperCase() === b[0].toUpperCase()) {
        return 0;
    }
    else {
        return (a[0].toUpperCase() < b[0].toUpperCase()) ? -1 : 1;
    }
}


async function init(){
    browser.storage.local.get('value',(e)=>{

        if(!e.value){
            e.value = 0;
        }

        isOn = e.value;
        sortList();

    });

}



init();

