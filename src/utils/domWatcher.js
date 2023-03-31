export class DOM监听器 {
    constructor(option) {
      this.监听目标 = option.监听目标;
      this.监听选项 = option.监听选项 || {
        attributes: true,
        childList: true,
        subtree: true,
      };
      this.监听器回调 = option.监听器回调;
      this.监听器序列 = [];
      this.判定监听目标();
      this.开始监听();
      this.自动刷新监听目标();
    }
    开始监听() {
      if (this.监听目标序列 && this.监听目标序列[0]) {
        let 监听器 = new MutationObserver((mutationsList, observer) => {
          mutationsList.forEach((item) => {
            if (
              item &&
              Array.from(this.监听目标序列).indexOf(item.target) >= 0 &&
              this.监听选项[item.type]
            ) {
              this.监听器回调(item, observer);
            }
          });
        });
        监听器.observe(document, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        this.监听器= 监听器
      }
    }
    //如果是DOM序列就直接监听,如果不是就生成一个数据再监听
    判定监听目标() {
      if (typeof this.监听目标 == "string") {
        this.监听目标序列 = document.querySelectorAll(this.监听目标);
        if (this.监听目标 == "document") {
          this.监听目标序列 = [document];
        }
      } else if (this.是否DOM(this.监听目标)) {
        this.监听目标序列 = [this.监听目标];
      } else if (this.是否DOM序列(this.监听目标)) {
        this.监听目标序列 = this.监听目标;
      }
    }
    销毁旧监听器() {
      this.监听器.disconnect()
      this.监听器=undefined
    }
    自动刷新监听目标() {
      let 监听器 = new MutationObserver(() => {
        this.判定监听目标();
        this.开始监听();
        this.销毁旧监听器();
      });
      //监听整个文档的变化,然后刷新监听器序列
      监听器.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    是否DOM序列(判定目标) {
      return 判定目标 instanceof HTMLCollection;
    }
  
    是否DOM(判定目标) {
      if (typeof HTMLElement === "object") {
        return 判定目标 instanceof HTMLElement;
      } else {
        return (
          判定目标 &&
          typeof 判定目标 === "object" &&
          判定目标.nodeType === 1 &&
          typeof 判定目标.nodeName === "string"
        );
      }
    }
  }