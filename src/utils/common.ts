import Cookies from 'js-cookie';
import store from '@/store';
import { cloneDeep } from 'lodash';

export class commonClass {
  constructor() {}
  /**
   * 深拷贝
   * @param obj 拷贝的目标对象
   * @returns 
   */
  copy (obj:any):any {
    return cloneDeep(obj);
  }
  /**
   * 是否数组
   * @param arr 
   * @returns 
   */
  isArray (arr:any): arr is Array<any> {
    if (typeof arr === 'undefined') return false;
    if (Array.isArray) return Array.isArray(arr);
    return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
  }
  // 是否对象, 包含数组和json
  isObject (obj:any): obj is object {
    if (this.isArray(obj)) return true;
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
  }
  // 是json
  isJson (obj:any): obj is JSON {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
  }
  // 是否数字类型
  isNumber (num:any):num is number {
    return Object.prototype.toString.call(num).slice(8, -1) === 'Number';
  }
  // 是否字符串
  isString (str:any):str is string {
    return Object.prototype.toString.call(str).slice(8, -1) === 'String';
  }
  // 是否为空， 包括 空数组，空对象， null、空字符串、undefined、NaN
  isEmpty (val:any, type = false):val is null | undefined {
    if (['', null, 'undefined', undefined].includes(type && this.isString(val) ? val.trim() : val)) return true;
    if (this.isJson(val)) return Object.keys(val).length === 0;
    if (this.isArray(val)) return val.length === 0;
    if (this.isNumber(val) && isNaN(val)) return true;
    return false;
  }
  // 是否boolean
  isBoolean (val:any):val is boolean {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Boolean';
  }
  // 是否函数
  isFunction (fun:any):fun is void {
    return Object.prototype.toString.call(fun).slice(8, -1) === 'Function'
  }
  // 是否时间
  isDate (val:any):val is Date {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Date'
  }
  // 是否正则
  isRegExp (val:any):val is RegExp {
    return Object.prototype.toString.call(val).slice(8, -1) === 'RegExp'
  }
  isSymbol (val:any):val is symbol { // 是否Symbol函数
    return Object.prototype.toString.call(val).slice(8, -1) === 'Symbol'
  }
  // 是否Promise对象
  isPromise (val:any):val is Promise<any> {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Promise'
  }
  // 是否Set对象
  isSet (val:any):val is Set<any> {
    return Object.prototype.toString.call(val).slice(8, -1) === 'Set'
  }
  /**
   * 数组去重
   * @param arr 转换目标数组
   * @returns 
   */
  arrRemoveRepeat (arr:Array<any>):Array<any> {
    return Array.from(new Set(arr));
  }
    /**
   * 多维数组扁平化
   * @param arr 转换目标数组
   * @returns 
   */
  flat (arr:Array<any>):Array<any> {
    return arr.flat(Infinity);
  }
  /**
   * 移除对象中所有为字符串的值 2 端空格， 不影响原数据
   * @param target 需处理的数据对象
   * @param ruleOut 不处理的键名, 包括所在的所有子级, 可以指定对象数据链，如果是数组: a.b.c[3].d.g[2].key, 数组下所有元素则用 * 号代替数字: a.b.c[\*].d.g[\*].key
   * @returns 
   */
  trim (target:string | {[key:string]:any} | Array<any>, ruleOut?:string | Array<string>):string | {[key:string]:any} | Array<any> | undefined {
    if (!this.isString(target) && !this.isArray(target) && !this.isObject(target)) return target;
    const outKey = !this.isEmpty(ruleOut) ? (typeof ruleOut == 'string' ? [ruleOut] : this.isArray(ruleOut) ? ruleOut : []) : [];
    const hand = (obj:string | {[key:string]:any} | Array<any>, stackPointer?: string, stackPointerLike?:string) => {
      if (typeof obj === 'string') return obj.trim();
      if (!this.isObject(obj)) return obj;
      let backVal;
      if (this.isArray(obj)) {
        backVal = [];
        obj.forEach((item:any, index) => {
          const currentKey = `${this.isEmpty(stackPointer)?'':stackPointer}[${index}]`;
          const currentLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[*]`;
          if (!outKey.includes(currentKey) && !outKey.includes(currentLikeKey)) {
            if (this.isObject(item)) {
              backVal.push(hand(item, currentKey, currentLikeKey))
            } else {
              typeof item == 'string' ? backVal.push(item.trim()) : backVal.push(item);
            }
          } else {
            backVal.push(item);
          }
        })
      } else if (this.isJson(obj)) {
        backVal = {};
        Object.keys(obj).forEach((key:any) => {
          const currentKey = `${this.isEmpty(stackPointer) ? '' : `${stackPointer}.`}${key}`;
          const currentLikeKey = `${this.isEmpty(stackPointerLike) ? '' : `${stackPointerLike}.`}${key}`;
          if (!outKey.includes(key) && !outKey.includes(currentKey) && !outKey.includes(currentLikeKey)) {
            if ( this.isObject(obj[key])) {
              backVal[key] = hand(obj[key], currentKey, currentLikeKey);
            } else {
              backVal[key] = typeof obj[key] == 'string' ? obj[key].trim() : obj[key];
            }
          } else {
            backVal[key] = obj[key];
          }
        })
      }
      return backVal;
    }
    return hand(this.copy(target));
  }
  /**
   * 获取全部url参数,并转换成json对象
   * @param config 目标对象
   * @returns 
   */
  getUrlParams (config?:{url?:string, keys?: Array<string> | string} | string, key?:Array<string> | string):string | {[key:string]:string} | Array<{[key:string]:string}> {
    const newUrl = decodeURIComponent((this.isString(config) ? config : config ? config.url : window.location.href) || window.location.href);
    if (newUrl.indexOf('?') === -1) return {};
    const urlOption = newUrl.substring(newUrl.indexOf('?') + 1);
    const urlList = urlOption.split('&');
    let urlJson:{[key:string]:string} = {};
    const keysList = !this.isEmpty(key) ? key : this.isObject(config) && !this.isEmpty(config.keys) ? config.keys : '';
    urlList.forEach(item => {
      const pos = item.indexOf('=');
      urlJson[item.substring(0, pos)] = item.substring(pos + 1);
    });
    if (this.isString(keysList)) {
      return urlJson[keysList];
    } else if (this.isArray(keysList)) {
      let newVal = {};
      keysList.forEach((key:string) => {
        newVal[key] = urlJson[key];
      })
      return newVal;
    }
    return urlJson;
  }
  /**
   * 复制到粘贴板上
   * @param content 需要复制的字符串或JSON
   * @returns 
   */
  copyToClip (content:any): Promise<any> {
    const copyTxt = this.isObject(content) ? JSON.stringify(content) : content;
    return new Promise(resolve => {
      // execCommand 方法有可能弃用，，
      if (document.execCommand) {
        let staging = document.createElement('textarea');
        staging.innerHTML = copyTxt;
        document.body.appendChild(staging);
        staging.style.position = 'absolute';
        staging.style.maxHeight = '30vh';
        staging.style.maxWidth = '30vw';
        staging.style.top = '-1000vh';
        staging.style.left = '1000vw';
        staging.select();
        document.execCommand('copy');
        document.body.removeChild(staging);
        resolve(true);
      } else {
        console.error('浏览器不支持该操作');
        resolve(false);
      }
    })
  }
  /**
   * base64 转为文件格式
   * @param base64Data 需要转换的 base64
   * @param fileName 文件名
   * @param fileType 文件类型
   * @returns 
   */
  base64ToFile (base64Data:string, fileName:string, fileType?: string):File {
    const arr:Array<string> = base64Data.split(',');
    const match = arr[0].match(/:(.*?);/);
    const newFileType = arr[0] && match && match.length > 1 ? match[1] : fileType;
    let bstr = atob(arr.length > 1 ? arr[1] : base64Data);
    let leng = bstr.length;
    let UintArr = new Uint8Array(leng);
    while (leng--) {
      UintArr[leng] = bstr.charCodeAt(leng);
    }
    return !!newFileType ? new File([UintArr], fileName, {
      type: newFileType
    }) : new File([UintArr], fileName);
  }
  /**
   * 获取cookie, 支持数组和json
   * @param keys 需要获取 cookie 的key
   * @returns 
   */
  getCookie (keys:string | Array<string> | {[key:string]: string}):string | {[key:string]: string} {
    if (this.isObject(keys)) {
      let newVal:string | {[key:string]: string} = {};
      if (this.isJson(keys)) {
        Object.keys(keys).forEach((key:string) => {
          newVal[key] = Cookies.get(keys[key]) || '';
        })
      } else if (this.isArray(keys)) {
        keys.forEach((key:string) => {
          newVal[key] = Cookies.get(key) || '';
        })
      }
      return newVal;
    }
    return typeof keys === 'string' ? (Cookies.get(keys) || '') : '';
  }
  /**
   * 插入cookie，支持数组和json
   * @param key 插入cookie 的key，此处可以是数组，json
   * @param val cookie 的值(当 key 为数据或对象时，此参数会被忽略)
   * @param expires cookie 的过期时间和以前设置(当 key 为数据或对象时，此参数会被忽略)
   * @returns 
   */
  setCookie (
    key:string | Array<{
      key: string, value: string, expires?: {[key:string]: any}
    }> | {
      key: string, value: string, expires?: {[key:string]: any}
    }, val?:string, expires?: {[key:string]: any}
  ) {
    if (this.isEmpty(key)) return;
    if (this.isJson(key)) {
      Object.keys(key).forEach(item => {
        if(!this.isEmpty(key[item].key) && !this.isEmpty(key[item].value)) {
          Cookies.set(key[item].key, key[item].value, key[item].expires || {});
        }
      })
    } else if (this.isArray(key)) {
      key.forEach((item) => {
        if(!this.isEmpty(item.key) && !this.isEmpty(item.value)) {
          Cookies.set(item.key, item.value, item.expires || {});
        }
      })
    } else if(typeof key === 'string' && typeof val !== 'undefined'){
      Cookies.set(key, val, expires||{});
    }
  }
  /**
   * 移除,支持数组
   * @param keys 需要移除 cookie 的 key
   * @returns 
   */
  delCookie (keys:string | Array<string>) {
    if (this.isEmpty(keys)) return;
    if (typeof keys === 'string') {
      Cookies.remove(keys);
    } else if (this.isArray(keys)) {
      keys.forEach((item:any) => {
        this.delCookie(item);
      })
    }
  }
  /**
   * 移除对象空值
   * @param target 需要处理的目标对象
   * @param ruleOut 不处理的键名, 包括所在的所有子级, 可以指定对象数据链，如果是数组: a.b.c[3].d.g[2].key, 数组下所有元素则用 * 号代替数字: a.b.c[\*].d.g[\*].key
   * @param emptyAllClean 当子级为空时，递归清空父级, 默认为 false
   * @returns 
   */
  removeEmpty (target: Array<any>|{[key:string]: any}, ruleOut?:string | Array<string> | boolean, emptyAllClean?:boolean):Array<any>|{[key:string]: any} {
    let outKey:Array<string> = [];
    if (!this.isEmpty(ruleOut) && (typeof ruleOut == 'string' || this.isArray(ruleOut))) {
      outKey = typeof ruleOut == 'string' ? [ruleOut] : ruleOut;
    } else if (typeof ruleOut == 'boolean') {
      emptyAllClean = ruleOut;
    }
    const hand = (option:string | Array<any>|{[key:string]: any}, clean:boolean, stackPointer?:string, stackPointerLike?:string) => {
      if (this.isArray(option)) {
        let newObj:Array<any> = [];
        option.forEach((item:any, index) => {
          const currentKey = `${this.isEmpty(stackPointer)?'':stackPointer}[${index}]`;
          const currentLikeKey = `${this.isEmpty(stackPointerLike)?'':stackPointerLike}[*]`;
          if (!outKey.includes(currentKey) && !outKey.includes(currentLikeKey)) {
            if (!this.isEmpty(item)) {
              if (this.isObject(item)) {
                const newVal = hand(item, false, currentKey, currentLikeKey);
                if (!emptyAllClean && !clean) {
                  this.isEmpty(newVal) && this.isJson(item) ? newObj.push(item) : newObj.push(newVal);
                } else {
                  !this.isEmpty(newVal) && newObj.push(newVal);
                }
              } else {
                newObj.push(item);
              }
            }
          } else {
            newObj.push(item);
          }
        })
        return newObj;
      }
      if (this.isJson(option)) {
        let newObj = {};
        Object.keys(option).forEach((key:any) => {
          const currentKey = `${this.isEmpty(stackPointer) ? '' : `${stackPointer}.`}${key}`;
          const currentLikeKey = `${this.isEmpty(stackPointerLike) ? '' : `${stackPointerLike}.`}${key}`;
          if (!outKey.includes(key) && !outKey.includes(currentKey) && !outKey.includes(currentLikeKey)) {
            if (!this.isEmpty(option[key]) && option[key] !== 'web-null') {
              if (this.isObject(option[key])) {
                const newVal = hand(option[key], false, currentKey, currentLikeKey);
                if (!emptyAllClean && !clean) {
                  newObj[key] = newVal;
                } else {
                  !this.isEmpty(newVal) && (newObj[key] = newVal);
                }
              } else {
                newObj[key] = option[key];
              }
            }
          } else {
            newObj[key] = option[key];
          }
        })
        return newObj;
      }
      return option as Array<any>|{[key:string]: any};
    }
    return hand(this.copy(target), true);
  }
  /**
   * 将对象转换为 get 请求方式类型
   * @param obj 需要转换的对象
   * @param isDefault 是否带 ?
   * @returns 
   */
  changeParams (obj:{[key:string]: string}, isDefault?: boolean):string {
    if (this.isJson(obj)) {
      const keys = Object.keys(obj);
      let params = isDefault ? '?' : '';
      keys.forEach(key => {
        params += params.includes('=')?`&${key}=${obj[key] }`:`${key}=${obj[key] }`;
      })
      return params;
    }
    return ''
  }
  /**
   * 是有权限，支持 字符串、数组、json (当登录账号为 admin 时，全部返回 true)
   * @param keys 需要获取的 key
   * @returns 
   */
  getPower (keys:string|Array<string>|{[key:string]:string}):boolean | {[key:string]:boolean} {
    const userInfo = store.getters['layout/userInfo'];
    const isPass:boolean = userInfo.loginName && ['admin', 'admin@lapa.com'].includes(userInfo.loginName);
    const permissionsIds = store.getters['layout/permissionsIds'];
    if (this.isEmpty(keys, true)) return isPass || false;
    if (this.isObject(keys)) {
      let newVal:{[key:string]:boolean} = {};
      if (this.isJson(keys)) {
        Object.keys(keys).forEach(key => {
          newVal[key] = isPass || permissionsIds.includes(keys[key]);
        })
      } else if (this.isArray(keys)) {
        keys.forEach(key => {
          newVal[key] = isPass || permissionsIds.includes(key);
        })
      }
      return newVal;
    }
    return this.isString(keys) ? (isPass || permissionsIds.includes(keys)) : isPass;
  }
  /**
   * 获取html节点设置的样式值
   * @param element 目标节点或节点标识id,class等
   * @param styleName 需要获取的样式名---对应 css 键名
   * @param isNumber 是否返回数字，当值不支持 number 时，则原样返回
   * @returns 
   */
  getElementStyle (element:string | Element | null, styleName?:string, isNumber?:boolean):number|string|null {
    const newElement = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    if (!newElement || this.isEmpty(styleName)) return isNumber ? 0 : null;
    // const style = newElement.currentStyle ? newElement.currentStyle[styleName] : document.defaultView.getComputedStyle(newElement, null)[styleName];
    const style = newElement.currentStyle ? newElement.currentStyle[styleName] : window.getComputedStyle(newElement, null)[styleName];
    if (this.isEmpty(style)) return isNumber ? 0 : null;
    if (!isNumber || !style.includes('px')) return style;
    const styleArr = style.split(' ');
    let isPass = false;
    let backVal:Array<any> = [];
    styleArr.forEach((item:any) => {
      if (!item.includes('px') || isNaN(parseInt(style))) {
        isPass = true;
      }
      backVal.push(parseInt(item));
    })
    if (isPass) return style;
    return backVal.length === 1 ? backVal[0] : backVal;
  }
  /**
   * 获取元素坐标(元素的左上角为基点)
   * @param element 目标节点或节点标识id,class等标识
   * @returns 
   */
  getElementOffset (element:string | Element | null):{x:number, y:number} {
    const newElement = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    let offset = { x: 0, y: 0 }
    if (this.isEmpty(newElement)) return offset;
    let current = newElement.offsetParent as HTMLElement;
    offset.x += newElement.offsetLeft;
    offset.y += newElement.offsetTop;
    while (current !== null) {
      offset.x += current.offsetLeft || 0;
      offset.y += current.offsetTop || 0;
      current = current.offsetParent as HTMLElement;
    }
    return offset;
  }
  /**
   * 获取元素所在被滚动距离
   * @param element 目标节点或节点标识id,class等标识
   * @returns 
   */
  getElementScrollTop (element:string | Element | null):number {
    const newElement = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element as HTMLElement;
    if (!newElement) return 0;
    let top = 0;
    let current = newElement.parentNode as HTMLElement;
    while (current !== null) {
      top += current.scrollTop || 0;
      current = current.parentNode as HTMLElement;
    }
    return top;
  }
}

export default new commonClass();