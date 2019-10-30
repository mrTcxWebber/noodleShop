// var DOMAIN_HOST = {
//     dev: '',
// }



// 工具类
/*
 *  use $util.xxx()
 */
var $util = (function(window) {
    var u = {};
        /*
         * 打印到控制台
         * @param any 内容
         * @param [color] 日志颜色
         */
    u.print = function() {
            // if(!api.debug) return
            var str = '',
                strArr = [];
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'object') {
                    strArr.push(JSON.stringify(arguments[i]))
                } else {
                    strArr.push(arguments[i])
                }
            }
            console.log(strArr.join());
        }

        /*
         * @param fmt 'yyyy-MM-dd hh:mm:ss'
         * @param date new Date()
         */
    u.format_date = function(fmt, date) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    /**
     * caculate the great circle distance
     * @param {Number} lat1
     * @param {Number} lng1
     * @param {Number} lat2
     * @param {Number} lng2
     * @retrun number km
     */
    u.getGreatCircleDistance = function(lat1,lng1,lat2,lng2) {
        function getRad(d){
            return d*Math.PI/180.0;
        }
        var radLat1 = getRad(lat1);
        var radLat2 = getRad(lat2);
        var a = radLat1 - radLat2;
        var b = getRad(lng1) - getRad(lng2);
        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s*6378137.0;
        s = Math.round(s*10000)/10000.0;
        var res = s < 1000 ? s.toFixed(0) + 'm' : (s/1000).toFixed(1) + 'km'
        return res;
    }
    /*
     * @description 防止固定在底部跟随固定在键盘上面
    */
    u.setResizeHide = function(fn) {
      var docHeight = document.body.clientHeight;
      window.onresize = function() {
          var $bodyH = document.body.clientHeight;
          // docHeight > $bodyH ? footer.style.display = 'none' :  footer.style.display = 'block';
          fn && fn(docHeight, $bodyH)
      }
    }
    /*
     * @description 打开弹出层防止body可滑动的穿透问题
     * @use  打开弹出层  再$util.modalHandler().afterOpen
    */
    u.modalHandler = function() {
        if(!document.querySelector('style')) {
            var style = document.createElement('style')
            document.querySelector('head').appendChild(style)
        }
        return {
            afterOpen: function() {
                if(document.querySelector('style').innerHTML.search(/\.bodyFixed\s?{/g) === -1) {
                    document.querySelector('style').innerHTML += '.bodyFixed{position:fixed;width:100%;}'
                }
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                document.body.classList.add('bodyFixed')
                document.body.style.top = -scrollTop + 'px';
            },
            beforeClose: function() {
                var offsetTop = document.body.style.top
                document.body.classList.remove('bodyFixed')
                document.body.scrollTop = parseInt(offsetTop.slice(1,offsetTop.length-2));
            }
        };
    },
    /*
     * @description 节流
     * @use  window.addEventListener('scroll', $util.throttle(cb, time))
    */
    u.throttle = function(cb, time) {
        var timer = null
        return function() {
            var context = this;
            var args = arguments;
            if(timer) return
            timer = setTimeout(function() {
                cb.apply(context, args)
                clearTimeout(timer)
                timer = null
            }, time || 800)
        }
    },
    /*
     * @description 设置localStorage, value可以为任何类型
     *
    */
    u.setStorage = function(key, value) {
        var v = value
        var typestring = Object.prototype.toString.call(value)
        var type = typestring.replace(/\[object |\]/gi, '')
        if(type === 'Object' || type === 'Array') {
            v = 'o-' + JSON.stringify(v)
        }else if(type === 'Number' || type === 'Boolean' ||type === 'Null') {
            v = 'n-' + v
        }else {
            v = 's-' + v
        }
        window.localStorage.setItem(key, v)
    },
    /*
     * @description 获取localStorage 可以获取存储时的类型
     *
    */
    u.getStorage = function(key) {
        var v = window.localStorage.getItem(key)
        var vPrefix = v.slice(0, 2)
        v = v.slice(2)
        if(vPrefix === 's-') {
            return v
        }else {
            return JSON.parse(v)
        }
    }

    return u;
})(window)
