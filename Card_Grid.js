function draw_grid(bgd_id,grid) {
    function Draw_line(card_id,x,y,x1,y1) {//利用div划线

        let para = document.getElementById(card_id);
        let node=document.createElement("div");
        node.style.backgroundColor="#444";
        node.style.position="absolute";
        node.style.left=x+"px";
        node.style.top=y+"px";
        node.style.height=y1+"px";
        node.style.width=x1+"px";


        para.appendChild(node);
    }


    let height=grid.h*grid.h_nums;
    let width=grid.w*grid.w_nums;

    let pos_x=0;
    let pos_y=0;
    for(let i=0;i<grid.w_nums+1;i++)
    {
        Draw_line(bgd_id,pos_x,0,1,height);
        pos_x+=grid.w;
    }
    for(let i=0;i<grid.h_nums+1;i++)
    {
        Draw_line(bgd_id,0,pos_y,width,1);
        pos_y+=grid.h;
    }
}






function Creat_card(card_bgd_id,card_item_class,set_card,move) {

    var mouse=move.mouse;

    function Creat_card_item(card_id,class_name) {
        this.status=new Object();
        this.status.onclick=0;
        this.status.ondown=0;
        this.status.onmove=0;
        this.status.index=0;

        let para = document.getElementById(card_id);
        var node=document.createElement("div");
        node.className=class_name;
        node.style.width=set_card.w+"px";
        node.style.height=set_card.h+"px";


        this.status.node=node;

        para.appendChild(node);

    }

    function add_event(status) {
        status.node.addEventListener("mousedown", on_down);
        status.node.addEventListener("mouseup", on_up);
        function on_down()
        {
            status.onclick=1;
            status.node.style.left=mouse.x-set_card.w/2+"px";
            status.node.style.top=mouse.y-set_card.h/2+"px";//这里不需要调用，因为已经有set对象可用
            //status.node.style.left=mouse.x-set_card.card_w/2+"px";
            //status.node.style.top=mouse.y-set_card.card_h/2+"px";
            status.node.style['z-index']="999";//将卡片放在最前面
            move.fresh_blank_index(mouse);
            //console.log(set_card.card_w);
            //blank_index=pos_index.pos_to_index(mouse);

        }
        function on_up() {
            move.set_pos_index(mouse,status);
            status.node.style['z-index']="1";//卡片放在最后面
            status.onclick=0;
        }


    }

    this.creat=function creat(card_set) {
        let card=new Array();
        console.log(card_set.nums)
        for(let i=0;i<card_set.nums;i++)
        {

            let temp=new Creat_card_item(card_bgd_id,card_item_class,i);
            temp.status.index=i;
            card.push(temp.status);
            //console.log(temp.status.node);
            add_event(temp.status);
        }
        return card;

    }

}



function Pos_index(set) {//包含pos于index相互转换，以及卡片位置的设定

    var set_card=set.card;
    var set_grid=set.grid;
    let that=this;

    this.index_to_pos=function (index) {
        let end=new Object();
        //console.log(set_grid);
        end.x=(index%set_grid.w_nums)*set_grid.w;
        end.y=set_grid.h*parseInt(index/set_grid.w_nums);

        //console.log(end);
        return end;
    }
    this.pos_to_index=function (pos) {
        let end=parseInt(pos.y/set_grid.h)*set_grid.w_nums+parseInt(pos.x/set_grid.w);
        //console.log(end);
        return end;


    }

    this.set_card_pos_no=function (ca,index) {//卡片移动控制函数

        var set=that.index_to_pos(index);
        if(set_card.pos_w==0)
        {
            set.x=set.x;
        }
        else if(set_card.pos_w==1){
            set.x+=(set_grid.w-set_card.w)/2;
        }
        else{
            set.x+=(set_grid.w-set_card.w);
        }
        if(set_card.pos_h==0)
        {
            set.y=set.y;
        }
        else if(set_card.pos_h==1)
        {

            set.y+=(set_grid.h-set_card.h)/2;

        }
        else{
            set.y+=(set_grid.h-set_card.h);
        }

        ca.style.left=set.x+"px";
        ca.style.top=set.y+"px";

    }


    this.set_card_pos=function (ca,index) {//卡片移动控制函数

        var set=that.index_to_pos(index);


        if(set_card.pos_w==0)
        {
            set.x=set.x;
        }
        else if(set_card.pos_w==1){
            set.x+=(set_grid.w-set_card.w)/2;
        }
        else{
            set.x+=(set_grid.w-set_card.w);
        }
        if(set_card.pos_h==0)
        {
            set.y=set.y;
        }
        else if(set_card.pos_h==1)
        {
            set.y+=(set_grid.h-set_card.h)/2;

        }
        else{
            set.y+=(set_grid.h-set_card.h);
        }

        var pp="left:"+set.x+"px;top:"+set.y+"px;";
        var style = document.createElement('style');
        var str="@keyframes myfirst"+index+"\n{100% {"+pp+"}\n} ";
        style.innerHTML =str;
        //console.log(str);

        //console.log(str);

        // 获取第一个脚本标记
        var ref = document.querySelector('script');

        // 在第一个脚本标签之前插入新样式
        ref.parentNode.insertBefore(style, ref);
        ca.style.animation="myfirst"+index+" 0.5s";
        setTimeout(function(){
            ca.style.left=set.x+"px";
            ca.style.top=set.y+"px";

        },500);

        //ca.style.left=set.x+20+"px";
        //ca.style.top=set.y+20+"px";
    }

    this.set_card_follow=function (node,mouse) {

        node.style.left=mouse.x-set_card.w/2+"px";
        node.style.top=mouse.y-set_card.h/2+"px";
    }

    this.fresh_pos=function(card,idx) {//根据index刷新卡片的位置

        for(let i=0;i<card.length;i++)
        {
            if(card[i].index!=idx)
            {
                that.set_card_pos(card[i].node,card[i].index);
            }

        }

    }

}


function Card_move(pos_index,card_bgd_id) {
    var blank_index=0;//记录空位的index
    var mouse=new Object();
    mouse.x=0;
    mouse.y=0;
    var that=this;

    this.mouse=mouse;
    function card_move() {//卡片移动算法
        let idx=pos_index.pos_to_index(mouse);//当前鼠标所在的index
        var card=that.card;
        for(let i=0;i<card.length;i++)
        {

            if(card[i].onclick==1)//遍历查找出被点击的卡片
            {

                if(blank_index!=idx)//如果鼠标移动到另一个网格中触发
                {

                    if(idx<blank_index)
                    {
                        for(let id=0;id<card.length;id++)
                        {
                            if(card[id].index>=idx&&card[id].index<blank_index)
                            {
                                card[id].index++;
                            }
                            //console.log(card[id].index);
                        }


                    }
                    else{
                        for(let id=0;id<card.length;id++)
                        {
                            if(card[id].index>blank_index&&card[id].index<=idx)
                            {
                                card[id].index--;
                            }

                        }


                    }
                    blank_index=idx;
                    card[i].index=idx;//复原被移动的index

                    pos_index.fresh_pos(card,card[i].index);//不要移动被点击的卡片

                }

                pos_index.set_card_follow(card[i].node,mouse);

                //console.log( event.pageX + ".." + event.pageY);
            }

        }
    }


    var c = document.getElementById(card_bgd_id);
    var ps=c.getBoundingClientRect();

    mouse.x=0;
    mouse.y=0;
    c.onmousemove = function (event) {//鼠标移动事件,坐标是相对于一个div而言的
        var event = event || window.event;  //标准化事件对象
        if (event.pageX || event.pageY) {
            mouse.x=event.pageX-ps.left;
            mouse.y=event.pageY-ps.top;
            card_move();
        }
    }


    this.fresh_blank_index=function (mouse) {//刷新空白的位置
        blank_index=pos_index.pos_to_index(mouse);

    }


    this.set_pos_index=function(mouse,status) {

        let index=pos_index.pos_to_index(mouse);

        pos_index.set_card_pos_no(status.node,index);
        status.index=index;

    }


}


function Card(card_bgd_id,card_item_class,set) {

    function init() {
        if(set.card.h>set.grid.h-10)
        {
            set.card.h=set.grid.h-10;
        }
        if(set.card.w>set.grid.w-10)
        {
            set.card.w=set.grid.w-10;
        }

        let bgd = document.getElementById(card_bgd_id);
        bgd.style.width=set.grid.w*set.grid.w_nums+"px";
        bgd.style.height=set.grid.h*set.grid.h_nums+"px";

    }

    init();

    var pos_index=new Pos_index(set);
    var move=new Card_move(pos_index,card_bgd_id);
    var mouse=move.mouse;
    var creat_card=new Creat_card(card_bgd_id,card_item_class,set.card,move);
    var card=creat_card.creat(set.card);

    move.card=card;

    pos_index.fresh_pos(card);

    if(set.grid.display==1)
    {
        draw_grid(card_bgd_id,set.grid);
    }

    return card;





}


function Creat_set() {

    var grid=new Object();
    var card=new Object();

    grid.w=150;
    grid.h=200;
    grid.w_nums=8;
    grid.h_nums=4;
    grid.display=0;

    card.w=100;
    card.h=150;
    card.nums=15;
    card.pos_w=0;
    card.pos_h=0;

    this.grid=grid;
    this.card=card;
    var that=this;

    this.card_set=function (w,h,pos_w,pos_h,nums) {
        that.card.w=w;
        that.card.h=h;
        that.card.pos_w=pos_w;
        that.card.pos_h=pos_h;
        that.card.nums=nums;
    }

    this.grid_set=function (w,h,w_nums,h_nums,display) {
        that.grid.w=w;
        that.grid.h=h;
        that.grid.w_nums=w_nums;
        that.grid.h_nums=h_nums;
        that.grid.display=display;
    }

}