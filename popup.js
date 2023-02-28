

let input = document.querySelector('.onOff');


input.addEventListener('change', (e) => {
    setValue(e.target.value);
});


async function setValue(value){
    await browser.storage.local.set({ value });
}

async function init(){
    browser.storage.local.get('value',(e)=>{

        if(!e.value){
            e.value = 0;
        }

        input.value = e.value;
        setValue(e.value);

    });

}

init().catch( e => console.error(e));