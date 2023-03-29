export {renderMathLive,debug}


import {currentLayout} from "./listener"


declare global {
    var mathVirtualKeyboard: any;
  }

function renderMathLive(naiveDom:boolean,originMathBlock:HTMLDivElement){
    console.log("click!")
    //初始化获得输入框元素
    var textBlock = document.querySelector(".block__popover--move")
    var latexBlock:HTMLTextAreaElement|null = document.querySelector(".block__popover--move > textarea")

    if (!textBlock ||  !latexBlock){
        console.log("renderMathLive 初始化获得输入框元素错误！")
        console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)
        return;
    }
    console.log("renderMathLive 初始化获得输入框元素成功！")
    console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)

    var dyBlock = document.createElement("div")
    var keyboardBlock = initkeyboardBlock()
    var MathLiveBlock = initMathLiveBlock(latexBlock)

    if (naiveDom === true){
        console.log("启动原生渲染！")
        dyBlock.appendChild(MathLiveBlock)
    }
    else{
        dyBlock.appendChild(MathLiveBlock) 
    }
    textBlock.appendChild(dyBlock)
    textBlock.appendChild(keyboardBlock)

    addMathLiveListener(latexBlock,MathLiveBlock);
}

function addMathLiveListener(latexBlock:HTMLTextAreaElement,MathLiveBlock:any){
    var tempLatex = MathLiveBlock.value;
    var liveCall:boolean = false;
    //初始化输入事件
    let evt =  new Event('input', {
        bubbles: true,
        cancelable: true
      })
    MathLiveBlock.addEventListener("input", () => {
        //替换标记宏
        var expendLatex = MathLiveBlock.getValue("latex-expanded");
        
        latexBlock.value = expendLatex.replace(/\{\\textcolor\{#6495ed\}\{(.+?)\}\}/g, "\\mark{$1}");
        if (tempLatex === MathLiveBlock.value) {
            tempLatex = MathLiveBlock.value;
            console.log(tempLatex)
            return
        }
        tempLatex = MathLiveBlock.value;
        liveCall = true;
        latexBlock.dispatchEvent(evt);
    });

    latexBlock.addEventListener("input", (ev) => {
        if (liveCall === true){
            liveCall = false;
            return;
        }
        MathLiveBlock.setValue(latexBlock.value, {suppressChangeNotifications: true})
    }
    );
}

function initMathLiveBlock(latexBlock:HTMLTextAreaElement):HTMLTextAreaElement{

    var mathLiveBlock:any = document.createElement("math-field")
    mathLiveBlock.style.minWidth = latexBlock.style.width
    mathLiveBlock.value = latexBlock.value;
    mathLiveBlock.macros = {
        ...mathLiveBlock.macros,
        mark: {
            args: 1,
            def: "{\\color{#6495ed}#1}",
            captureSelection: false,
        },
    };
    return mathLiveBlock;
}

function initkeyboardBlock():HTMLElement{
    var keyboardBlock = document.createElement("div");
    keyboardBlock.style.height = "auto";
    mathVirtualKeyboard.container = keyboardBlock;
    return keyboardBlock
}

function initStyle() {
    var mathlive_css = document.createElement("style");
    mathlive_css.innerHTML = `
#mathlive-popover-panel{
    z-index: 200;
}
.ML__keyboard.is-visible{
    height: calc(var(--keyboard-height) + 10px);
}
`;
    document.body.appendChild(mathlive_css);
    document.body.style.setProperty("--keycap-height", "3em");
    document.body.style.setProperty("--keycap-font-size", "1.2em");
}

function debug(){
    console.log(currentLayout)

    initStyle()

    currentLayout.on('mouseup', '[data-subtype="math"]', function(event:any) {
        var originMathBlock = event.target;
        setTimeout(()=>{renderMathLive(false,originMathBlock)},10);
    });
    
    
}