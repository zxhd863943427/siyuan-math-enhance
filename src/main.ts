import { createApp,ref,watch } from 'vue'
import App from './App.vue'
import TopButton from './components/TopButton.vue'
import sheet from './components/sheet.vue'
import { Plugin, Menu, clientApi } from 'siyuan'

import {settingList,getSetting} from "./utils/config"
import {debug} from "./utils/math"



export default class CardPlugin extends Plugin {
    public el: HTMLElement
    public sheet: HTMLElement
    public settingConfig : any

    constructor() {

        debug()

        super()
        this.el = document.createElement('div')
        this.el.classList.add('toolbar__item', 'b3-tooltips', 'b3-tooltips__se')
        this.el.setAttribute('aria-label', '右键打开菜单')
        this.sheet = document.createElement('div')
        this.settingConfig = null
    }

    async onload() {
        //加载本地配置
        let localConfig = await this.loadStorage("enhanceConfig.json")
        this.settingConfig = await getSetting(localConfig)
        console.log("数学增强当前配置：\n",settingList.getSetting())

        const button = createApp(TopButton)
        button.mount(this.el)
        // //添加左键一键制卡功能
        // this.el.addEventListener('click', (event) => {
        //     addCards(this.settingConfig.labFeature[0]["status"].value)
        //     event.stopPropagation()
        //     event.preventDefault()
        // })
        //添加右键打开菜单功能
        this.el.addEventListener('contextmenu', (event) => {
            const menu = document.createElement('div')
            const app = createApp(App,this.settingConfig)
            app.mount(menu)
            new Menu('CardPlugin').addItem({ element: menu }).showAtMouseEvent(event)
            event.stopPropagation()
        })
        clientApi.addToolbarLeft(this.el)

    //     //注册动态制卡快捷键
    //     this.registerCommand({
    //         command: "openDynamiMarkCard",
    //         shortcut: "alt+d",
    //         description: "根据菜单的选项，打开动态制卡功能",
    //         callback: () =>{openDynamiMarkCard(
    //           this.settingConfig.labFeature[2]["status"].value,
    //           this.settingConfig.labFeature[0]["status"].value)
    //             },
    // })

        //插入小型功能sheet
        const AppSheet = createApp(sheet,this.settingConfig)
        AppSheet.mount(this.sheet)
        let base = document.querySelector("head")
        base?.appendChild(this.sheet)

        watch(settingList.setList,()=>{this.writeConfig()})
    }

    async onunload() {
        this.el && this.el.remove();
        this.sheet && this.sheet.remove();
        this.writeConfig()
    }

    async writeConfig(){
      let configText = JSON.stringify(settingList.getSetting())
      await this.writeStorage("enhanceConfig.json",configText)
    }
}