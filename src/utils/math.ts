export {renderMathLive,initMathLive,removeMathLive}


import {currentLayout} from "./listener"


declare global {
    var mathVirtualKeyboard: any;
    var MathfieldElement:any;
  }

var dyBlock = document.createElement("div")

function renderMathLive(naiveDom:boolean,originMathBlock:HTMLDivElement,debug:boolean=false){
    // console.log("click!")
    //初始化获得输入框元素
    initVitrualKeyboard()
    var textBlock = document.querySelector(".block__popover--move")
    var latexBlock:HTMLTextAreaElement|null = document.querySelector(".block__popover--move > textarea")

    if (!textBlock ||  !latexBlock){
        console.log("renderMathLive 初始化获得输入框元素错误！")
        console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)
        return;
    }

    if (debug===true){

        console.log("renderMathLive 初始化获得输入框元素成功！")
        console.log(`textBlock ${textBlock} ||  latexBlock ${latexBlock} `)
    }



    
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
            def: "\\textcolor{#6495ed}{#1}",
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

function initMathLive(){
    initStyle()
    currentLayout.on('mouseup', '[data-subtype="math"]', initMathLiveRender);
    // setTimeout(initVitrualKeyboard,2000)
    
}


function initMathLiveRender(event: any) {
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
    <li class='MLK__keycap MLK__tex' data-latex='\exponentialE' data-variants='ee'>e</li>
    <li class='MLK__keycap MLK__tex' data-latex='\imaginaryI' data-variants='ii'>i</li>
    <li class='MLK__keycap MLK__tex' data-latex='\pi' data-variants='numeric-pi'></li>
  </ul>
  <ul>
    <li class='MLK__keycap MLK__tex' data-key='<' data-variants='<'>&lt;</li>
    <li class='MLK__keycap MLK__tex' data-key='>' data-variants='>'>&gt;</li>
    <li class='separator w5'></li>
    <row name='numpad-2'/>
    <li class='separator w5'></li>
    <li class='MLK__keycap MLK__tex' data-latex='#@^{2}' data-latex='x^2'></li>
    <li class='MLK__keycap MLK__tex' data-variants='^' data-insert='#@^{#?}' data-latex='x^\placeholder'></li>
    <li class='MLK__keycap MLK__tex small' data-insert='\sqrt{#0}' data-latex='\sqrt{#0}'></li>
  </ul>
  <ul>
    <li class='MLK__keycap MLK__tex' data-variants='(' >(</li>
    <li class='MLK__keycap MLK__tex' data-variants=')' >)</li>
    <li class='separator w5'></li>
    <row name='numpad-3'/>
    <li class='separator w5'></li>
    <li class='MLK__keycap small' data-variants='int' data-latex='\int_0^\infty'></li>
    <li class='MLK__keycap' data-latex='\forall' data-variants='logic' ></li>
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

    dyBlock.remove()
}