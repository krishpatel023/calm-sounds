export const changeMode = ()=>{
    viewMode(1)
    const element = document.body;
    element.classList.toggle("dark-mode-parent");
}
export const viewMode = (display)=>{
    var mode = false;
    if(display === 0){
        return mode;
    }
    if(display === 1){
        mode = !mode;
    }
}
