

let button = document.querySelector('.toggle-button');
let bar = button.querySelector('.bar');
let buttonValue = 0;


button.addEventListener('click', (e) => {
    if(buttonValue == 0){
        buttonOn();
    }
    else{
        buttonOff();
    }
});


async function setValue(value){
    await browser.storage.local.set({ value });
}

async function init(){
    browser.storage.local.get('value',(e)=>{

        if(!e.value){
            e.value = 0;
        }

        setValue(e.value);
        buttonValue = e.value;

        if(buttonValue == 1){
            buttonOn();
        }
        else{
            buttonOff();
        }

    });

}

function buttonOn(){
    setValue(1);
    buttonValue = 1;
    button.classList.remove('off');
    button.classList.add('on');
}

function buttonOff(){
    setValue(0);
    buttonValue = 0;
    button.classList.remove('on');
    button.classList.add('off');
}

init().catch( e => console.error(e));