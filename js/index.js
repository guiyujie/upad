
let _TIMER = undefined;
//isVideo正则
let RE_VIDEO = /\.(mp4|ogg|swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb)$/i

attachTemplateToData = function(template, data) {
    var i = 0,
        len = data.length,
        fragment = '';

    // 遍历数据集合里的每一个项，做相应的替换
    function replace(obj) {
        var t, key, reg;
　　　　　　
　　　　　　　//遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
        for (key in obj) {
            reg = new RegExp('{{' + key + '}}', 'ig');
            t = (t || template).replace(reg, obj[key]);
        }

        return t;
    }

    for (; i < len; i++) {
        fragment += replace(data[i]);
    }

    return fragment;
};

function init(res){
    let app={
        el: document.getElementById("app"),
        videoTemplate:document.getElementById("videoTmplate").innerHTML,
        imgTemplate:document.getElementById("imgTmplate").innerHTML,
        config:{
            prefix:"https://p.gu321.com/",
            sideTime:10
        },
        data:{
            key:"h_id",  
            index:0,
            li:res
        },
        getCurrent:function(){
            let current = this.data.li[this.data.index]
            if(!current) return ""
            let key  = current[this.data.key]
            if(RE_VIDEO.test(key)){
                current.video = true
            }
            return current
        },
        getUrl:function(){
            let url = this.config.prefix+this.data.li[this.data.index][this.data.key];
            console.log(url);
            return new Promise((reslove,reject)=>{
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function(e) {
                    url = window.URL.createObjectURL(this.response);
                    reslove(url);
                };
                xhr.onerror = function(){
                    reject()
                }
                xhr.send();
            })
        },
        timeout(){
            let t=this;
            t.render();
            _timer = (time)=>{
                _TIMER = setTimeout(()=>t.next(),time*1000)
            }
            _timer(t.config.sideTime);
        },
        next(){
            let t=this;
            _TIMER && clearTimeout(_TIMER)
            next = t.data.index + 1
            if(next>=t.data.li.length){
                next = 0;
            }
            t.data.index = next;
            t.timeout()
        },     
        render:function(){
            let current  = this.getCurrent()
            if(current){
                this.getUrl().then((url)=>{
                    html = attachTemplateToData(current.video?this.videoTemplate:this.imgTemplate, [{
                        ...this.data,
                        url:url
                    }]);
                    this.el.innerHTML = html;
                    if(current.video){
                        let video = document.getElementById("video");
                        video.addEventListener('error', ()=>this.next());
                        video.addEventListener('ended',()=>this.next());
                    }
                })
            }
        },
        init:function(){
            
            this.timeout();
            delete this.init;
        }
    };
    app.init();
    window.app = app;  
}

function launch(){
    
    chrome.storage.local.get("datas", function(res) {
        init(res.datas);
    });

}

window.addEventListener('load', launch);

