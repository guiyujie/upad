let win,isOpening=false,hasData=false;
/*启动方法 */
function launch(){

    //监听系统空闲状态
    chrome.idle.onStateChanged.addListener(_idleHandle);

    //加载资源
    //fetchReasource();
    setTimeout(_open,1000);
    

}

/*获取设备IMEI,待做 */
function init(){

}

/*获取资源 */
function fetchReasource(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://gyj.urer.top/-api/pad/gg?imei=353114008096366', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var res = JSON.parse(xhr.responseText);
            hasData  = res.length;
            
            //保存数据
            chrome.storage.local.set({'datas': res}, function() {
                //done
                //打开窗口
                //setTimeout(_open,10000)
                _open();
            });
        }
    }
    let header = {
        "Content-Type":"application/json"
    }
    for(let i in header){
        xhr.setRequestHeader(i,header[i])
    }
    xhr.send();
}

/*处理msg */
function _msgHandle(request,sender,response){

    return false;
}

/*系统空闲状态变更 */
function _idleHandle(state){
    //空闲
    switch(state){
        case "idle":
            _open();
        break;
        case "active":
            _close();
        break;
    }
   
}


const _MOUSE_START = {
    x: null,
    y: null
};

function _onMouseMove(ev) {
    if (_MOUSE_START.x && _MOUSE_START.y) {
      const deltaX = Math.abs(ev.clientX - _MOUSE_START.x);
      const deltaY = Math.abs(ev.clientY - _MOUSE_START.y);

      if (Math.max(deltaX, deltaY) > 10) {
        // close after a minimum amount of mouse movement
        _close();
      }
    } else {
      // first move, set values
      _MOUSE_START.x = ev.clientX;
      _MOUSE_START.y = ev.clientY;
    }
  }

//使用标签打开
const winOpts = {
    url: '/html/index.html',
    focused: true,
    state: 'fullscreen',
    type: 'popup'
  };


function _open() {
    if(isOpening) return;
    //if(!hasData)  return;
    isOpening=true
    chrome.app.window.create('/html/index.html', {
        frame:"none",
        id: "mainwin",
        //type:"popup",
        resizable:false,
        state:"fullscreen",
        singleton:true,
        hidden:true,
        //一直最前
        alwaysOnTop:true,
        //获取焦点
        focused:true,
        innerBounds:{
            left:0,
            top:0,
            width:1,
            height:1
        }
    },function(createWindow){
        isOpening = false;
        win = createWindow;
        
       
        win.fullscreen(); 
        win.setAlwaysOnTop(true);
        win.show(true);
        win.focus();
        //避免离开全屏
        win.contentWindow.addEventListener('keydown', function(e) {
            if (e.keyCode == 27 ) { 
                e.preventDefault(); 
                e.stopPropagation(); 
            }
        });

        win.contentWindow.document.addEventListener('keydown', function(e) {
            _close();
            e.preventDefault();
        });
        win.contentWindow.document.addEventListener('click', function(e) {
            _close();
            e.preventDefault();
        });
        win.contentWindow.document.addEventListener('mousemove', _onMouseMove,false);
    
    });
}

function _close(){
    if(win){
        win.hide();
        win.restore();        
        win.close();
        win = "";
    }
}


//添加应用装载的处理
window.addEventListener('load', launch);