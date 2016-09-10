/**
 * Created by Administrator on 2016/8/26.
 */

(function () {

    window.CHAT = {
        msgObj:$("#message"),
        userid:null,
        username:null,
        socket:null,

        //让浏览器滚动条保持在最低部
        scrollToBottom:function(){
            window.scrollTo(0, this.msgObj.height());
        },
        genUid:function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        },
        //更新用户登录登出信息
        updateSysMsg:function (action,loginInfo) {
            var onlineUsers = loginInfo.onlineUsers;
            var onlineCount = loginInfo.onlineCount;
            var loginUser = loginInfo.user;
            var userhtml='';
            var split='';
            for(var userid in onlineUsers){
                userhtml = userhtml + split + onlineUsers[userid];
                split = '、';
            };

            //更新聊天室状态
            $("#onlinecount").html('当前共有 '+onlineCount+' 人在线，在线列表：'+userhtml);

            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += loginUser.username;
            html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
            html += '</div>';
            var section = document.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.append(section);
            this.scrollToBottom();
        },
        //提交聊天消息内容
        submit:function(){
            var content = $("#content").val();
            if(content){
                var msg = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', msg);
                $("#content").val('');
            }
            return false;
        },

        submitUsername:function () {
            var username = $("#username").val();
            //如果用户名不为空，隐藏登录窗口，展示聊天窗口
            if(username){
                $("#loginbox").hide();

                //设置用户信息
                this.userid = this.genUid();
                this.username = username;
                //初始化聊天室
                this.init();
                $("#chatbox").show();
            }
            return false;
        },
        logout:function () {
            location.reload();
        },

        init:function () {
            //显示登录用户名
            $("#showusername").html(this.username);

            //连接websocket后端服务器
            this.socket = io.connect('ws://mychat.carp.mopaasapp.com/');
            //通知服务器用户登录 
            this.socket.emit('login',{userid:this.userid,username:this.username});
            //从服务器接收用户登录广播
            this.socket.on('login',function (loginInfo) {
                CHAT.updateSysMsg('login',loginInfo);
            });
            //从服务器接收用户登出广播
            this.socket.on('logout',function (logoutInfo) {
                CHAT.updateSysMsg('logout',logoutInfo);
            });
            //接收消息
            this.socket.on('message', function(msg){
                var isme = (msg.userid == CHAT.userid) ? true : false;
                var contentDiv = '<div>'+msg.content+'</div>';
                var usernameDiv = '<span>'+msg.username+'</span>';

                var section = document.createElement('section');
                if(isme){
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.append(section);
                CHAT.scrollToBottom();
            });
        }
    };
    //通过“回车”提交用户名
    document.getElementById("username").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submitUsername();
        }
    };
    //通过“回车”提交信息
    document.getElementById("content").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };
})();