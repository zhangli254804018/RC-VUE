// import _ from 'lodash'
import { format_time , getQueryString  } from './filters.js'
import * as Util from 'src/api/util'
import Vue from 'vue'
export const hasClass = (obj, cls) => {
    var obj_class = obj.className, //获取 class 内容.
        obj_class_lst = obj_class.split(/\s+/); //通过split空字符将cls转换成数组.
    var x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) { //循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}

export const addClass = (obj, cls) => {
    var obj_class = obj.className, //获取 class 内容.
        blank = (obj_class != '') ? ' ' : ''; //判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    var added = obj_class + blank + cls; //组合原来的 class 和需要添加的 class.
    obj.className = added; //替换原来的 class.
}

export const removeClass = (obj, cls) => {
    var obj_class = ' ' + obj.className + ' '; //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '); //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    var removed = obj_class.replace(' ' + cls + ' ', ' '); //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, ''); //去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed; //替换原来的 class.
}

export const TransferString = (content) => {
    var string = content;
    try {
        string = string.replace(/\r\n/ig, "<br>")
        string = string.replace(/\n/ig, "<br>");
        string = string.replace(/\\n/ig, "<br>");
    } catch (e) {
        // alert(e.message);  
    }
    return string;
}

export const facebook = () => {
    var parames = this.params;
    window.fbAsyncInit = function() {
        FB.init({
            appId: 1382678158693829,
            xfbml: true,
            version: 'v2.3'
        });
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/zh_TW/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

export const sharefacebook = (url, picture, source, title, description) => {
    var vm = this;
    var href = url || window.location.href || 'http://rcshow.tv/activity/events/Funny/index.php?from=share';
    var redirect_uri = href + '&callback';
    if (conf.token) {
        redirect_uri = href + '&callback&type=' + conf.type + '&kind=' + conf.kind + '&uid=' + conf.uid + '&singerUid=' + conf.suid + '&token=' + conf.token + '&nstat=' + conf.nstat;
    }
    var link = 'http://rcshow.tv/appNew/share/fb.php?href=' + encodeURIComponent(href) + '&redirect_uri=' + encodeURIComponent(redirect_uri);
    return new Promise(function(resolve,reject){
        FB.ui({
            method: 'share',
            href: href,
            layout: 'box_count',
            mobile_iframe: true,
            picture: picture || require('assets/img/550-300.jpg'),
            source: picture || source,
            title: title,
            description: description
            // caption: caption,
            // title: title
        }, function (response) {
            if (response !== undefined) {
                rca('app', 'Funny', 'share', '拎北的N種《搞笑短片》', link, function () {
                    resolve('分享成功');
                });
            } else {
                reject('分享失敗');
            }
        })
    })
   
}

export const alertDialogCommpent = (dialogcompont,data) => {
    if (!dialogcompont) return false;
    var dialogComponts = new Vue(dialogcompont)
    dialogComponts.dialogData = data
    var component = dialogComponts.$mount()
    document.getElementsByTagName('body')[0].appendChild(component.$el)
    //document.getElementById('pageDialog').appendChild(component.$el)
}


export const rca = (category, cvar, value, label, link, callback) => {
    var argsObj = {
        utc: category,
        utv: cvar,
        utt: value,
        utl: label || '',
        dl: link || '',
        vendor: getQueryString('vendor')
    };
    argsObj.z = new Date().getTime();

    var argsArr = [];
    for (var key in argsObj) {
        argsArr.push(key + '=' + encodeURIComponent(argsObj[key]));
    }

    var url = 'https://rcshow.tv/data_img.php?' + argsArr.join('&');

    var img = new Image();
    img.onload = img.onerror = function() {
        if (typeof callback == 'function') {
            callback();
        }
    };
    img.src = url;
}


//新增浏览器平台正则对象返回
export const browserPlatform = function() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent.toLowerCase(),
                app = navigator.appVersion;
            return {
                trident: u.indexOf('trident') > -1, //IE内核
                presto: u.indexOf('presto') > -1, //opera内核
                webKit: u.indexOf('applewebkit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('gecko') > -1 && u.indexOf('khtml') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/ig), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/ig), //ios终端
                android: u.match(/android/i) || u.indexOf('adr') > -1, //android终端
                iPhone: u.indexOf('iphone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('ipad') > -1, //是否iPad
                webApp: u.indexOf('safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.match(/MicroMessenger/i) == "micromessenger", //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/ig) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    return browser.versions
}

export const  download =  function() {
    var browserPlatform = Util.browserPlatform()
    var img = new Image();
    img.src = 'https://rcshow.tv/apps/download/download.php?source=RCPUBG';
    if (browserPlatform.ios || browserPlatform.iPhone || browserPlatform.iPad) {
        location.href = 'https://rcshow.tv/apps/download/getApp.php?type=ios&source=RCPUBG'
    } else if (browserPlatform.mobile || browserPlatform.android) {
        location.href = 'https://rcshow.tv/apps/download/getApp.php?type=android&source=RCPUBG'
    }
    else {
        location.href = 'https://rcshow.tv/apps/download/getApp.php?type=pc&source=RCPUBG'
    }
}

export const checkFile = (file,type,size)=>{
    const typeSL = {
        video: ['mp4', 'flv', 'avi', 'mov', 'wmv', 'mkv', 'rmvb', 'm4v','3gp'] //常見的視頻格式
    };
    const sizeM = size*1024;
    const _type = file.type;
    const _size = file.size;
    const typeM = typeSL[type];
    if (_size > sizeM){
        return {
            msg:`視頻文件大於${size}M,請重新上傳`,
            code:-1
        }
    }
    if (!typeM || typeM.indexOf(_type) < 0 ){
        return {
            masg: `請上傳以下支持的視頻格式：${typeSL.video.join(',')}`,
            code: -2
        }
    }
    return {
        msg:'成功',
        code:0
    }
}