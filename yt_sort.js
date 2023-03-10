
// is the extension toggled on.
let isOn = 0;
// so that the guide-button will only add the listener once.
let addedListener = false;

let findButtonCounter = 0;


// listen for when the toggle switch is changed.
browser.storage.onChanged.addListener((changes, area) => {

    if(area === 'local' && changes.value.newValue > -1) {
        
        isOn = changes.value.newValue;
        sortList();
    }
});


window.addEventListener('load', (event) => {


    // since the div where the lists are only exists after the side panel is opend,
    // we need to know when it is opened.
    document.querySelector("#guide-button").addEventListener("click", (e)=>{


        console.log("#guid-button pressed");

        // once opend we still have to wait for the lists to be extended, so we add
        // a listener on the button that expands the lists.
        // addedListener is set so the listener isn't added every time the guide button is clicked.
        if(!addedListener){
            findButtonCounter = 0;
            waitForElement("#expander-item",(e)=>{
                console.log("found button #expander-item");
                if(!addedListener){
                    document.querySelector("#expander-item").addEventListener("click", (e)=>{
                        sortList();
                    });
                    addedListener = true;
                }
            });
        }
    });

   
    // needed since Youtube continues to load even after the load event has been
    // triggerd
    waitForElement("#expander-item",(e)=>{
        console.log("found button #expander-item");
        if(!addedListener){
            document.querySelector("#expander-item").addEventListener("click", (e)=>{
                sortList();
            });
            addedListener = true;
        }
    });

});

// wait for an element to be loaded
function waitForElement(elementSelector, callBack){
    let element = document.querySelector(elementSelector)
    window.setTimeout(() => {
      if(element){
        callBack();
      }else{
        console.log(elementSelector + " not found");
        findButtonCounter ++;
        if(findButtonCounter < 15){
            waitForElement(elementSelector, callBack);
        }
        else{
            console.log("stopped looking for "+elementSelector);
        }
      }
    },500)
}




// sorts the list of playlists in the side bar.
function sortList(){

    // only sort the list if the extension is toggled on.
    if(isOn < 1) return;

    let list = [];

    const sectionItems = document.querySelector("#section-items");
    const expandableItems = document.querySelector("#expandable-items");
    const expander = document.querySelector("YTD-GUIDE-COLLAPSIBLE-ENTRY-RENDERER");
    const downloader = document.querySelector("Ytd-guide-downloads-entry-renderer");

    const sectionItemList = ["HISTORY","YOUR VIDEOS","WATCH LATER"];
    

    // since youtube doesn't put all the lists into the same div, we first have to take the ones in the 
    // top div (the one visible even before clicking "show more"). We will leave the History, Your Videos, Watch Later
    // the rest will be added to the list that we will sort in the end.
    for(const child of sectionItems.children){
        
        if(child != expander && child != downloader){
            const title = child.querySelector(".title").innerHTML.toUpperCase();
            
            if(!sectionItemList.includes(title)){
                list.push([title, child]);
                sectionItems.removeChild(child);
            }
        }
    }

    // get all the playlists and add them to the list we will sort later.
    const childrenList = expandableItems.children;

    for(const child of childrenList){

        // add the title in the first part and the actual div in the second.
        // this way we can alphabeticaly sort them
        list.push([child.querySelector(".title").innerHTML, child]);

    }

    // sort the list
    list.sort(sortFunction);
    
    // empty the playlist holder in preperation of us adding the playlists again, this time sorted.
    expandableItems.innerHTML = "";

    // go through the sorted list and add them to the div
    for(let vector of list){

        // we want the Liked Videos in the same place that History, Watch Later, etc is.
        // Honestly YouTube, why isn't it there by default?
        if(vector[0].toUpperCase() == "LIKED VIDEOS"){
            sectionItems.insertBefore(vector[1], expander);
        }
        else{
            expandableItems.appendChild(vector[1]);
        }
    }
}

// sort by the first element of the list.
// sort it alphabetically 
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
