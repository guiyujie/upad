
let _TIMER = undefined;
//isVideo正则
let RE_VIDEO = /\.(mp4|ogg|swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb)$/i



function init(){
    let vm = new Vue({
        el:"#app",
        data: {
            config:{
                prefix:"https://p.gu321.com/",
                sideTime:3
            },
            key:"h_id",  
            index:0,
            li:[] 
        },
        computed: {
            current: function () {
                let current = this.li[this.index]
                if(!current) return {}
                let key  = current[this.key]
                if(RE_VIDEO.test(key)){
                    current.video = true
                }
                return current
            },
            url: function(){
                return this.config.prefix+this.current[this.key]
            }
        },
        methods:{
            timeout(){
                let t=this;
                _timer = (time)=>{
                    _TIMER = setTimeout(t.next,time*1000)
                }
                _timer(t.config.sideTime);
            },
            next(){
                let t=this;
                _TIMER && clearTimeout(_TIMER)
                next = t.index + 1
                if(next>=t.li.length){
                    next = 0;
                }
                t.index = next;
                t.timeout()
            }     
        },
      
        mounted(){
            let t=this;
            /*
            t.li = [
                {
                    "id": 2,
                    "time": 1551082455,
                    "h_id": "FjkhCbCgBqS9P0v6a61pZ4z_zRUI.jpg",
                    "v_id": "FkagaVtKsC9KwdlIYag0c3FQLzM7.jpg",
                    "name": "素材demo2-1",
                    "user_id": 4
                },
                {
                    "id": 3,
                    "time": 1551082455,
                    "h_id": "Fm6A-Qe3ZxLpQBzpde05dlSGAcxB.jpg",
                    "v_id": "FuGOQCHZiiRKgMzjI4sDEeGu82IK.jpg",
                    "name": "素材demo2-2",
                    "user_id": 4
                },
                {
                    "id": 4,
                    "time": 1551355663,
                    "h_id": "Fr4LjQdjiyuIN-AIqJkKN7OQixqu.mp4",
                    "v_id": "",
                    "name": "测试素材-1",
                    "user_id": 2
                }
            ]
            t.timeout()
            */
            chrome.storage.local.get("datas", function(res) {
                t.li = res.datas;
                t.timeout()
            });
        }

    })  
}

function launch(){
    // let div = document.createElement("div");
    // div.setAttribute("id","app");
    // document.body.appendChild(div);
    
    // chrome.storage.local.get("datas", function(res) {
    //     init();
    // });
    // window.contentWindow.document.addEventListener('keydown', function(e) {
    //     e.preventDefault();
    // });
    // window.contentWindow.document.addEventListener('keyup', function(e) {
    //     e.preventDefault();
    // });
}

window.addEventListener('load', launch);