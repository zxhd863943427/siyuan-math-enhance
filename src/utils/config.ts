export { SettingList, settingList, getSetting }


import { ref } from 'vue'

//////////////////////    设置选项      ///////////////////////

const labFeatureList = [
    "原生替换",
]

////////////////////    工具类      ////////////////////////
class SettingList {
    setList!: any[]
    SetDict!: any
    constructor() {
        //setList是为了方便watch
        this.setList = []
        //SetDict是为了方便读取保存的配置
        this.SetDict = {}
    }
    setting(init: any, name: string) {
        this.setList.push(init)
        this.SetDict[name] = init
        return init
    }
    //返回读取结果后的dict字典，方便保存
    getSetting() {
        let settingKey = Object.keys(this.SetDict)
        let returnDict: any = {}
        for (let item of settingKey) {
            returnDict[item] = this.SetDict[item].value;
        }
        return returnDict
    }
}

let settingList = new SettingList()


////////////////////    工具函数       ////////////////////

//辅助添加菜单，并将选项状态保存到 settingList
function addSetting(settingKey: string, setDict: any) {
    return {
        content: settingKey, status: settingList.setting(
            ref(setDict[settingKey])
            , settingKey)
    }
}


function loadSetting(settingDict: any) {


    let labFeature: any = []

    for (let item of labFeatureList) {
        labFeature.push(addSetting(item, settingDict))
    }


    let settingConfig = {
        labFeature: labFeature,
    }
    return settingConfig
}

function initSetting() {
    let setDict: any = {}
    for (let item of labFeatureList) {
        setDict[item] = false
    }
    let settingConfig = loadSetting(setDict)
    return settingConfig
}

async function getSetting(localConfig: null | any) {
    //没有本地配置，那就初始化状态
    if (!localConfig) {
        return initSetting()
    }
    let setDictText = await localConfig.text()
    let setDict = JSON.parse(setDictText)
    
    return loadSetting(setDict)
    // return initSetting()
}