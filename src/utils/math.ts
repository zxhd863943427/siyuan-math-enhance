export {renderMathLive,initMathLive,removeMathLive}


import {currentLayout} from "./listener"
import {DOM监听器} from "./domWatcher"


declare global {
    var mathVirtualKeyboard: any;
    var MathfieldElement:any;
    var siyuan:any;
  }


function renderMathLive(naiveDom:boolean,originMathBlock:HTMLDivElement,debug:boolean=false){
    // console.log("click!")
    //初始化获得输入框元素
    initVitrualKeyboard()
    //获取当前屏幕
    let currentScreen:any = document.querySelector(".layout__wnd--active");
    //获取当前页面
    let currentPage = currentScreen.querySelector(
        ".fn__flex-1.protyle:not(.fn__none)"
    );
    var textBlock = currentPage.querySelector(".block__popover--move")
    var latexBlock:HTMLTextAreaElement|null = currentPage.querySelector(".block__popover--move > textarea")

    if (!textBlock ||  !latexBlock){
        console.log("renderMathLive 初始化获得输入框元素错误！")
        console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)
        return;
    }

    if (debug===true){

        console.log("renderMathLive 初始化获得输入框元素成功！")
        console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)
    }



    var dyBlock = document.createElement("div")
    dyBlock.id = "mathEnhanceDyBlock"
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
        
        latexBlock.value = expendLatex.replace(/\{\\textcolor\{#6495ed\}\{(.+?)\}\}/g, "\\mark{$1}").replace(/\\textcolor\{#6495ed\}\{(.+?)\}/g, "\\mark{$1}");
        if (tempLatex === MathLiveBlock.value) {
            tempLatex = MathLiveBlock.value;
            // console.log(tempLatex)
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
    // 初始化样式
    mathLiveBlock.style.cssText = `
    width: -webkit-fill-available; 
    font-size: 1.25em; 
    color: var(--b3-protyle-inline-strong-color); 
    background-color: var(--b3-theme-background);
    `
    // mathLiveBlock.style.fontSize = "1.25em";
    
    mathLiveBlock.value = latexBlock.value;
    mathLiveBlock.macros = {
        ...mathLiveBlock.macros,
        mark: {
            args: 1,
            def: "{\\color{#6495ed}#1}",
            captureSelection: false,
        },
    };
    var tempMacro = JSON.parse(window.siyuan.config.editor.katexMacros || "{}");
    tempMacro["\\placeholder"] = "\\phantom";
    tempMacro["\\ensuremath"] = "#1"
    window.siyuan.config.editor.katexMacros = JSON.stringify(tempMacro);
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
    --keyboard-background: var(--b3-theme-background-light);
    --keyboard-toolbar-text-active: var(--b3-theme-primary);
    --keyboard-toolbar-text: var(--b3-theme-on-background);
}
.bigfnbutton {
    margin-bottom: 3px;
}
.MLK__keycap {
    margin-bottom: 3px;
}
.MLK__backdrop {
    height: calc(var(--keyboard-height) + 10px);
}
`;
    document.body.appendChild(mathlive_css);
    // document.body.style.setProperty("--keycap-height", "3em");
    document.body.style.setProperty("--keycap-font-size", "1.2em");
}

function initMathLive(){
    initStyle()
    // currentLayout.on('mouseup', '[data-subtype="math"]', initMathLiveRender);
    const testDomwatcher =new DOM监听器({
        监听选项:{childList: true},
        监听目标:'.protyle-util',
        监听器回调:(mutationRecord:any, observer:any)=>{
            console.log("捕获点击事件")
            var innerText = mutationRecord.target.querySelector("div.block__icons").innerText
            if (innerText === siyuan.languages["inline-math"] || innerText === siyuan.languages["math"]){
                console.log("捕获点击数学公式事件")
                console.log(mutationRecord)
                initMathLiveRender(mutationRecord)
            }
        }
      })
    // setTimeout(initVitrualKeyboard,2000)
    MathfieldElement.soundsDirectory=null;
}


function initMathLiveRender(event: any) {
        console.log("initMathLiveRender: ",event);
        var originMathBlock = event.target;
        setTimeout(() => { renderMathLive(false, originMathBlock); }, 10);
    };


function initVitrualKeyboard() {
    mathVirtualKeyboard.layouts[0].layers[0].markup =`
    <div class='MLK__rows'>
    <ul>
      <li class='MLK__keycap MLK__tex' data-variants='x-var'><i>x</i></li>
      <li class='MLK__keycap MLK__tex' data-variants='n-var'><i>n</i></li>
      <li class='separator w5'></li>
      <row name='numpad-1'/>
      <li class='separator w5'></li>
      <li class='MLK__keycap MLK__tex' data-latex='\\exponentialE' data-variants='ee'>e</li>
      <li class='MLK__keycap MLK__tex' data-latex='\\imaginaryI' data-variants='ii'>i</li>
      <li class='MLK__keycap MLK__tex' data-latex='\\pi' data-variants='numeric-pi'></li>
    </ul>
    <ul>
      <li class='MLK__keycap MLK__tex' data-key='<' data-variants='<'>&lt;</li>
      <li class='MLK__keycap MLK__tex' data-key='>' data-variants='>'>&gt;</li>
      <li class='separator w5'></li>
      <row name='numpad-2'/>
      <li class='separator w5'></li>
      <li class='MLK__keycap MLK__tex' data-latex='#@^{2}' data-latex='x^2'></li>
      <li class='MLK__keycap MLK__tex' data-variants='^' data-insert='#@^{#?}' data-latex='x^\\placeholder'></li>
      <li class='MLK__keycap MLK__tex small' data-insert='\\sqrt{#0}' data-latex='\\sqrt{#0}'></li>
    </ul>
    <ul>
      <li class='MLK__keycap MLK__tex' data-variants='(' >(</li>
      <li class='MLK__keycap MLK__tex' data-variants=')' >)</li>
      <li class='separator w5'></li>
      <row name='numpad-3'/>
      <li class='separator w5'></li>
      <li class='MLK__keycap small' data-variants='int' data-latex='\\int_0^\\infty'></li>
      <li class='MLK__keycap' data-latex='\\forall' data-variants='logic' ></li>
      <li class='action font-glyph bottom right' data-variants='delete' data-command='["performWithFeedback","deleteBackward"]'><svg class="svg-glyph"><use xlink:href="#svg-delete-backward" /></svg></li></ul>
    </ul>
    <ul>
      <li class='MLK__keycap' data-variants='foreground-color' data-command='["applyStyle",{"color":"#6495ed"}]'><span style='color:#6495ed'>[...]</span></li>
      <li class='MLK__keycap' data-variants='background-color' data-command='["applyStyle",{"backgroundColor":"yellow"}]'><span style='border-radius: 50%;width:22px;height:22px; background:#fff590; box-sizing: border-box'></span></li>
      <li class='separator w5'></li>
      <row name='numpad-4'/>
      <li class='separator w5'></li>
      <arrows/>
    </ul>
  </div>
    `
}

function removeMathLive() {
    currentLayout.off('mouseup', '[data-subtype="math"]', initMathLiveRender);
    var dyBlock:HTMLElement|null = document.querySelector("#mathEnhanceDyBlock")
    dyBlock?.remove()
}