
//导入资源
// var script = document.createElement("script");
// script.type = "text/javascript";
// script.src = "//unpkg.com/mathlive";
// document.body.appendChild(script);

//微调样式

newFunction();





//载入块
function createMathInput() {
    var textBlock = document.querySelector(".block__popover--move")
    var latexBlock = document.querySelector(".block__popover--move > textarea")
    var dyBlock = document.createElement("div")
    var keyboardBlock = document.createElement("div")
    keyboardBlock.style.height = "auto"
    mathVirtualKeyboard.container = keyboardBlock


    var mathLiveBlock = document.createElement("math-field")



    mathLiveBlock.style.minWidth = latexBlock.style.width
    dyBlock.appendChild(mathLiveBlock)
    textBlock.appendChild(dyBlock)
    textBlock.appendChild(keyboardBlock)

    mathLiveBlock.value = latexBlock.value;

    mathLiveBlock.macros = {
        ...mathLiveBlock.macros,
        mark: {
            args: 1,
            def: "{\\color{#6495ed}#1}",
            captureSelection: false,
        },
    };

    var tempLatex = mathLiveBlock.value

    mathLiveBlock.addEventListener("input", (ev) => {
        latexBlock.value = mathLiveBlock.value;
        if (tempLatex === mathLiveBlock.value) {
            tempLatex = mathLiveBlock.value;
            console.log(tempLatex)
            return
        }
        tempLatex = mathLiveBlock.value;
        latexBlock.dispatchEvent(evt);
    });



    // // Listen for changes in the "latex" text field, and reflect its value in
    // // the mathfield.

    latexBlock.addEventListener("input", (ev) => {
        mathLiveBlock.setValue( ev.target.value, {suppressChangeNotifications: true})
    }
    );

}
