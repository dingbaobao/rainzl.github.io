
//重写------------start------------------------
const device = mobilecheck(); 
var $body = $(document.body);
var $wrap = $('#wrap');
var hat = new drawHat('hat',move.css($('#logo')[0],'height')/2+30);
var shoesTop = window.innerHeight - $('#navConvas').offset().top - $('#navConvas').outerHeight()/2;
var shoes = new drawHat('shoes',shoesTop);
var lastHatstatus = 'loading';


if (device) {
	(function(){
		var html = document.documentElement;
		var r = 20; 
		html.style.fontsize = html.clientWidth/16;
		
		$('#hint')[0].style.padding = 5/r+'rem 0';
		$('#hint')[0].style.minHeight = 39/r+'rem';
		$('#hint')[0].style.font = 16/r+'rem/'+20/r+'rem helvetica';
		//$('#hint').find('.showText').find('i')[0].style.height = 18/r+'rem';
		
		/*$('#hint').find('.smallSwitch')[0].style.marginTop = 15/r + 'rem';
		$('#hint').find('.smallSwitch')[0].style.width = 120/r + 'rem';
		$('#hint').find('.smallSwitch')[0].style.height = 9/r + 'rem';*/
		
		$('#hint').find('.hintBtn')[0].style.marginTop = 15/r + 'rem';
		$('#hint').find('.hintBtn')[0].style.width = 92/r + 'rem';
		$('#hint').find('.hintBtn')[0].style.height = 32/r + 'rem';
		$('#hint').find('.hintBtn')[0].style.lineHeight = 30/r + 'rem';
		
		$('#footer').find('.blogroll').hide();
	})()
}

randLoad(introductionData);
function randLoad(data) {
	var arrObj = [];
	var div = document.createElement('div');
	$body[0].appendChild(div);
	
	for ( var i=0; i<data.length; i++ ) {
		p = document.createElement('p');
		arrObj.push(div.appendChild(p));
	}
	

;(function(global,factory){
	var htmlName = 'home';
	
	
	//画导航背景
	drawNav('navConvas');
	
	//点击底部导航执行的动画
	navRound('nav');
	
	//页面切换,执行的操作
	factory(global,htmlName);
	
	//点击导航,导航旋转
	function navRound(id) {
		var $nav = $('#'+id);
		var $navBase = $nav.find('.navBase');
		var $navBg = $nav.find('.navBg');
		var $navList = $nav.find('.navList');
		var $a = $nav.find('.navList').find('a');
		var lastIndex = 0;
		
		move.css($navBase[0],'rotate',45);
		move.css($navList[0],'rotate',45);
		for ( var i=0; i<$a.length; i++ ) {
			move.css($a[i],'rotate',-45);
		}
		
		$a.off('click').on('click',function(){
			if ( !$(this).hasClass('active') ) {
				var index = $(this).index();
				var className = $(this).attr('class');
				var disIndex = Math.abs(lastIndex-index);
				
				$(this).addClass('active').siblings().removeClass('active');
				move.mTween($navBase[0],{'rotate':-(index*90-45)},disIndex*400,'linear',function(){
					//画导航背景
					drawNav('navConvas',-index*90);
					$body.removeClass(htmlName).addClass(className);//替换body上的class
					if ( className === 'home' || className === 'works' ) {
						lastHatstatus = 'loading';
						$('#logo').css({'transition':'','-webkit-transition':''});
						$('#hint').css({
							'width':'0',
							'height':'0',
							'top': '40%'
						});
						$body.addClass('loading').removeClass('loaded');//替换body上的class
					}
					$wrap.find('.tBody').attr('id',className);//替换tBody上的id
					htmlName = className;
					//页面切换,执行的操作
					factory(global,htmlName);
				});
				move.mTween($navBg[0],{'rotate':-index*90},disIndex*400,'linear');
				move.mTween($navList[0],{'rotate':-(index*90-45)},disIndex*400,'linear');
				for ( var i=0; i<$a.length; i++ ) {
					move.mTween($a[i],{'rotate':(index*90+45)-90},disIndex*400,'linear');
				}
				lastIndex = index;
			}
		})
	}
	
	
})(window,function(global,htmlName){
	
	
	
	//页面进来加载: 上下两个canvas的变化，页面透明度的变化
	loading();
	
	//画头部和底部的canvas
	htmlName === 'home'? drawHatShose('loadedData','#fff'):drawHatShose('activeData','#1e1e1e');
	
	//画logo
	htmlName === 'home'? drawLogo('logo'):drawLogo('logo','#fff');
	
	//设置底部的链接列表top
	setBlogroll ((htmlName==='home'?false:true));
	
	//
	showHtml();
	
	function showHtml() {
		if ( htmlName === 'home' ) {
			fnHome();
		} else if ( htmlName === 'works') {
			fnHome = null;
			fnWorks();
		} else if ( htmlName === 'about') {
			fnAbout();
		} else if ( htmlName === 'contact') {
			fnContact();
		}
	}
	
	
	
//------页面主体内容的操作开始---------------------
	//home页面操作
	function fnHome() {
		var $tabHome = $('#home');
		//渲染页面
		rander(data,$tabHome);
		
		var imgTab = new TabImg('home');
		//图片切换
		imgTab.init({
			data: data,
			imgParObj: $tabHome.find('.productList')[0],
			subParCode: $tabHome.find('.subCode')[0],
			nextBtn: $tabHome.find('.next')[0],
			prevBtn: $tabHome.find('.prev')[0],
			callBack: fnProductHid
		})
		imgTab.extend({
			addEvent:function(obj) {
				var startX, disX, num = 0;
				var _this = this;
				obj.off('touchstart').on('touchstart',function(ev){
					var ev = ev || event;
					
					if (ImgEvent(obj[0],ev.changedTouches[0].pageX,ev.changedTouches[0].pageY)){
						startX = _this.touchStart(ev);
					}
				});
				obj.off('touchmove').on('touchmove',function(ev){
					var ev = ev || event;
					disX = _this.touchsMove(ev,disX,startX);
				});
				obj.off('touchend').on('touchend',function(){
					var ev = ev || event;
					_this.touchsEnd(disX);
				});
			}
		})
		imgTab.addEvent($('#hat'));
		imgTab.addEvent($('#shoes'));
		
		//点击图片，弹出/隐藏详情框
		;(function(factory) {
			var $productList = $('#home').find('.productList').find('li');
			$productList[0].parentNode.onOff = true;
			$productList.on('click',function(ev){
				var fileId = $(this).attr('fileId');
				factory($productList,fileId);
			})
			$('#hat').off('click').click(function(ev){
				var ev = ev || event;
				if (ImgEvent(this,ev.pageX,ev.pageY)) {
					var li = findEle($productList,ev.pageX,ev.pageY);
					var fileId = $(li).attr('fileId');
					factory($productList,fileId);
				}
			})
			$('#shoes').off('click').click(function(ev){
				var ev = ev || event;
				if (ImgEvent(this,ev.pageX,ev.pageY)) {
					
					var li = findEle($productList,ev.pageX,ev.pageY);
					var fileId = $(li).attr('fileId');
					
					factory($productList,fileId);
				}
			})
		})(function($productList,fileId){
			if ( $productList[0].parentNode.onOff ) {
				
				fnProductShow(fileId);
			} else {
				fnProductHid();
			}
		});
		//弹出详情框
		function fnProductShow(fileId) {
			if (!$('#home')[0]) return;
			var index = tools.arrIndexOf(fileId,data);
			hat.init({now:'activeData',last:'loadedData'},{time:500});
			shoes.init({now:'activeData',last:'loadedData'},{onOff:true,time:500});
			
			
			fnShowHint(data[index],true,false);
			
			$('#home').find('.productList')[0].onOff = false;
			$('#footer').find('.blogroll').addClass('top');
		}
		//隐藏详情框
		function fnProductHid() {
			if ($('#home').find('.productList')[0] && !$('#home').find('.productList')[0].onOff) {
				hat.init({now:'loadedData',last:'activeData'},{time:500});
				shoes.init({now:'loadedData',last:'activeData'},{onOff:true,time:500});
				
				//这里用jq的animate之后会先变大，后width、height减小
				move.mTween($('#hint')[0],{
					'width':0,
					'height':0,
					'top': Math.round($body.innerHeight()*.4),
					'opacity': 0
				},500,'linear');
				
				$('#home').find('.productList')[0].onOff = true;
				$('#footer').find('.blogroll').removeClass('top');
			}
		}
		
		
		function rander(data,obj) {
			var str = '';
			
			str += '<span class="prev"></span>'+
					'<span class="next"></span><ul class="productList">';
			str +=	'<li fileId="'+data[0].id+'"><img src="'+data[0].img+'"/></li><li fileId="'+data[1].id+'"><img src="'+data[1].img+'"/></li>'	
			str +=	'</ul><p class="subCode"></p>';
			
			$tabHome.html(str);
		}
	}
	//works页面操作
	function fnWorks() {
		var $tabWorks = $('#works');
		
		var listWheel = new Scroll('works');
		listWheel.init();
		listWheel.extend({
			a: function(obj){
				var _this = this;
				//obj.addEventListener('touchstart',function(ev){
					//var ev = ev || event;
					
					//if (ImgEvent(obj,ev.changedTouches[0].pageX,ev.changedTouches[0].pageY)){
						_this.touchFn(obj);
					//}
				//});
			}
		})
		listWheel.a($('#hat')[0]);
		listWheel.a($('#shoes')[0]);
		
		
		
		
		rander(worksData,$tabWorks);
		var $aAs = $tabWorks.find('a');
		
		$aAs.on('mouseover',function(){
			$(this).css({'transform':'scale(1.3)','-webkit-transform':'scale(1.3)'});
		});
		$aAs.on('mouseout',function(){
			$(this).css({'transform':'scale(1)','-webkit-transform':'scale(1)'});
		});
		
		canvasClick();
		//点击上下canvas操作
		function canvasClick(obj) {
			$('#hat').off('click').click(function(ev){
				var ev = ev || event;
				if (ImgEvent(this,ev.pageX,ev.pageY)) {
					
					var a = findEle($tabWorks.find('a'),ev.pageX,ev.pageY);
					window.location.href = a.href;
				}
			})
			$('#shoes').off('click').click(function(ev){
				var ev = ev || event;
				if (ImgEvent(this,ev.pageX,ev.pageY)) {
					
					var a = findEle($tabWorks.find('a'),ev.pageX,ev.pageY);
					window.location.href = a.href;
				}
			})
		}
		
		
		function rander(data,obj) {
			var str = '';
			for ( var i=0; i<worksData.length; i++ ) {
				str += '<div class="imgList">'+
							'<a href="'+data[i].href+'">'+
								'<img src="'+data[i].img+'" />'+
							'</a>'+
						'</div>';
			}
			obj.html(str);
		}
	}
	
	//about页面操作
	function fnAbout() {
		var $tabAbout = $('#about');
		
		$tabAbout.html('');
		fnShowHint(aboutData,false,true);
	}
	
	//contact页面操作
	function fnContact() {
		var $tabContact = $('#contact');
		$tabContact.html('');
		fnShowHint(aboutData,false,true);
	}
	
	//页面hint的相关操作
	function fnShowHint(data,isObjAnimat,isTextAnimat) {
		
		if (isObjAnimat) {
			$('#hint').animate({
				'opacity': '1',
				'width':$('#hint').prop('width'),
				'height':$('#hint').prop('width'),
				'top': $('#hint').prop('top')
			},500);
		} else {
			$('#hint').css({
				'opacity': '1',
				'width':$('#hint').prop('width'),
				'height':$('#hint').prop('width'),
				'top': $('#hint').prop('top')
			});
		}
		
		$('#hint').find('a').attr('href',data.href)
		creatText(data.info,$('#hint').find('.showText')[0],isTextAnimat);
	}
	
	
	//页面进来加载: 有loading，需要执行loading动画，没有loading直接获取logo的位置
	function loading() {
		
		move.css($wrap.find('.tBody')[0],'translateY','0');
		
		if ( $body.hasClass('loading') ) {//前两个页面有loading
			var num = 0;
			$(data).each(function(i,e){
				var $img = $('<img src="'+e.img+'"/>');
				$img.off().on('load',function(){
					num ++;
					if ( num === data.length ) {
						$('#logo').css({'transition':'top .7s ease','-webkit-transition':'top .7s ease',})
						$body.removeClass('loading').addClass('loaded');
						//setTimeout(setSquareHeight,800);
					}
				})
			})
		}
		
		setSquareHeight();
	}
	//设置详情展框的位置和宽高，只是标记
	function setSquareHeight(){
		
		//获取顶部的logo
		var $top = $('#logo').offset().top;
		//logo斜边的长度
		var $logoC = $('#logo').outerWidth();
		//logo的边长
		var $logoA = Math.round(Math.sqrt($logoC*$logoC/2));
		//logo顶点到document顶部的距离
		var disTop = 30-((Math.sqrt(2*$logoA*$logoA)-$logoA)/2);
		
		//获取底部的nav列表
		var $NavObj = $('#nav').find('.navList');
		var $NavTop = $NavObj.offset().top;
		var $NavHeight = $NavObj.outerHeight()/2;
		
		var c = $NavTop+$NavHeight-(30-disTop);
		
		var a = Math.sqrt(Math.pow(c,2)/2);
		
		var hintTop = (c-a)/2 + disTop;
		
		$('#hint').css({
					'transition': '',
					'-webkit-transition': ''
				});
		$('#hint').css({'width':a,'height':a});
		//$('#hint').offset({'top':$top});
		$('#hint').prop('width',a);
		$('#hint').prop('top',hintTop);
		$('#hint').css({'width':0,'height':0,'top':'40%'});
	}
	
	
	
	//画头部和底部的canvas
	function drawHatShose(nowStatus,color) {
		//console.log(nowStatus,lastHatstatus)
		color = color || '#fff';
		hat.init({now:nowStatus,last:lastHatstatus},{time:700,color:color});
		shoes.init({now:nowStatus,last:lastHatstatus},{time:700,onOff:true});
		lastHatstatus = nowStatus;
	}
	
	//查找对应位置的元素
	function findEle(targetList,pageX,pageY) {
		var eleRect,t,b,l,r,s;
		for ( var i=0; i<targetList.length; i++ ) {
			eleRect = targetList[i].getBoundingClientRect();
			s = targetList[i].scrollTop;
			t = eleRect.top;
			b = eleRect.bottom;
			l = eleRect.left;
			r = eleRect.right;
			if ( s+t<pageY && s+b>pageY && l<pageX && r>pageX) {
				return targetList[i];
			}
		}
		return null;
	}
	//设置底部的链接列表top
	function setBlogroll (falg) {
		if (falg) {
			$('#footer').find('.blogroll').addClass('top');
		} else {
			$('#footer').find('.blogroll').removeClass('top');
		}
	}
	
	//打字式创建文字
	function creatText(data,obj,isAnimat) {
		if(!Array.isArray(data) || data.length===0) return;
		var num = 0;
		var arrObj = [];
		var p;
		obj.innerHTML = '';
		
		if ( isAnimat ) {
			for ( var i=0; i<data.length; i++ ) {
				p = document.createElement('p');
				arrObj.push(obj.appendChild(p));
			}
			randText(0,arrObj[0]);
			function randText(n,p){
				var index = 0,timer= null,curTimer=null ;
				//var p = document.createElement('p');
				var i = document.createElement('i');
				p.appendChild(i);
				//obj.appendChild(p);
				timer = setInterval(function(){
					var txt = document.createTextNode(data[n].charAt(index));
					p.insertBefore(txt,i);
					
					if ( index === data[n].length-1 ) {
						
						clearInterval(timer);
						if ( n<data.length-1 ) {
							n++;
							p.removeChild(i);
							randText(n,arrObj[n]);
						}
					}
					index++;
				},200);
				curTimer = setInterval(function(){
					if (!i || !obj.getElementsByTagName('p')) {
						clearInterval(curTimer);
					} else {
						i.style.opacity = (!i.onOff?'100':'0');
						i.onOff = !i.onOff;
					}
				},200)
			}
		} else {
			p = document.createElement('p');
			p.innerHTML = data.join('<br/>');
			obj.appendChild(p);
		}
	}
});


function mobilecheck() {
    var check = false;
    (function (a) {
        if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

//重写------------end------------------------


/*(function(){
	var $body = $(document.body);
	
	//页面进来图片加载
	loading();
	
	
	
	//canvas动画设置开始
	var hat = new drawHat('hat',move.css($('#logo')[0],'height')/2+30);
	var shoesTop = window.innerHeight - $('#navConvas').offset().top - $('#navConvas').outerHeight()/2;
	var shoes = new drawHat('shoes',shoesTop);
	
	//绘制页面中所有的canvas效果
	allCanvas();
	
	
	navRound('nav');
	
	
	//首页个性化方法
	var $tabHome = $('#home');
	if ( $tabHome[0] ) {
		void function (w,d){
		
			var imgTab = new TabImg('home');
			//图片切换
			imgTab.init({
				data: ['img/16.jpg','img/17.jpg','img/18.jpg','img/3.jpg','img/4.jpg'],
				imgParObj: $tabHome.find('.productList')[0],
				subParCode: $tabHome.find('.subCode')[0],
				nextBtn: $tabHome.find('.next')[0],
				prevBtn: $tabHome.find('.prev')[0],
				callBack: fnProductHid
			})
			imgTab.extend({
				a:function(obj) {
					var startX, disX, num = 0;
					var _this = this;
					obj.addEventListener('touchstart',function(ev){
						var ev = ev || event;
						
						if (ImgEvent(obj,ev.changedTouches[0].pageX,ev.changedTouches[0].pageY)){
							startX = _this.touchStart(ev);
						}
					});
					obj.addEventListener('touchmove',function(ev){
						var ev = ev || event;
						disX = _this.touchsMove(ev,disX,startX);
					});
					obj.addEventListener('touchend',function(){
						var ev = ev || event;
						_this.touchsEnd(disX);
					});
				}
			})
			imgTab.a($('#hat')[0]);
			imgTab.a($('#shoes')[0]);
			
			//点击图片，弹出/隐藏详情框
			;(function(factory) {
				var $productList = $('#home').find('.productList');
				$productList[0].onOff = true;
				$productList.on('click',function(ev){
					factory($productList);
				})
				$('#hat').click(function(ev){
					var ev = ev || event;
					if (ImgEvent(this,ev.pageX,ev.pageY)) {
						factory($productList);
					}
				})
				$('#shoes').click(function(ev){
					var ev = ev || event;
					if (ImgEvent(this,ev.pageX,ev.pageY)) {
						factory($productList);
					}
				})
			})(function($productList){
				if ( $productList[0].onOff ) {
					fnProductShow();
				} else {
					fnProductHid();
				}
			});
			//弹出详情框
			function fnProductShow() {
				hat.init({now:'activeData',last:'loadedData'},{time:500});
				shoes.init({now:'activeData',last:'loadedData'},{onOff:true,time:500});
				$('#hint').css({
					'transition': 'all .5s',
					'-webkit-transition': 'all .5s',
					'opacity': '1',
					'width':$('#hint').prop('width'),
					'height':$('#hint').prop('width'),
					'top': $('#hint').prop('top')
				});
				//creatText(aboutData,$('#hint').find('.showText')[0]);
				$('#home').find('.productList')[0].onOff = false;
				$('#footer').find('.blogroll').addClass('top');
			}
			//隐藏详情框
			function fnProductHid() {
				if (!$('#home').find('.productList')[0].onOff) {
					hat.init({now:'loadedData',last:'activeData'},{time:500});
					shoes.init({now:'loadedData',last:'activeData'},{onOff:true,time:500});
					$('#hint').css({
						'width':'0',
						'height':'0',
						'top': '40%',
						'opacity': '0'
					});
					$('#home').find('.productList')[0].onOff = true;
					$('#footer').find('.blogroll').removeClass('top');
				}
			}
		}(window,document);
	}
	
	
	
	//works页面个性化方法
	void function (w,d) {
		var $tabWorks = $('#works');
		if ( $tabWorks[0] ) {
			var $aAs = $tabWorks.find('a');
			$aAs.on('mouseover',function(){
				$(this).css({'transform':'scale(1.3)','-webkit-transform':'scale(1.3)'});
			});
			$aAs.on('mouseout',function(){
				$(this).css({'transform':'scale(1)','-webkit-transform':'scale(1)'});
			});
			;
			(function(){
				var listWheel = new Scroll('works');
				listWheel.init();
			})()
		}
	}(window,document);
	
	
	//about、contact页面个性化方法
	void function (w,d,factory) {
		var $tabAbout = $('#about');
		var $tabContact = $('#contact');
		
		factory(w,d,$tabAbout,aboutData);
		factory(w,d,$tabContact,aboutData);
		
	}(window,document,function(w,d,$obj,data){
		if ( $obj[0] ) {
			$('#hint').css({
				'width':$('#hint').prop('width'),
				'height':$('#hint').prop('width'),
				'top': $('#hint').prop('top')
			});
			creatText(data,$('#hint').find('.showText')[0]);
		}
	});
	
	
	function allCanvas() {	
		if ( $body.hasClass('home') ) {
			drawLogo('logo');
			
			hat.init({now:'loadedData',last:'loading'},{time:700});
			shoes.init({now:'loadedData',last:'loading'},{onOff:true,time:700});
		} else if ($body.hasClass('works') ) {
			drawLogo('logo','#fff');
			
			hat.init({now:'activeData',last:'loading'},{time:700,color:'#1e1e1e'});
			shoes.init({now:'activeData',last:'loading'},{onOff:true,time:700});
		} else if ( $body.hasClass('about') || $body.hasClass('contact') ) {
			drawLogo('logo','#fff');
			
			hat.init({now:'activeData'},{color:'#1e1e1e'});
			shoes.init({now:'activeData'},{onOff:true});
		}
		drawNav('navConvas');
	}
	
	
	//点击导航,导航旋转
	function navRound(id) {
		var $nav = $('#'+id);
		var $navBase = $nav.find('.navBase');
		var $navBg = $nav.find('.navBg');
		var $navList = $nav.find('.navList');
		var $a = $nav.find('.navList').find('a');
		
		move.css($navBase[0],'rotate',45);
		move.css($navList[0],'rotate',45);
		for ( var i=0; i<$a.length; i++ ) {
			move.css($a[i],'rotate',-45);
		}
		
		$a.off('click').on('click',function(){
			if ( !$(this).hasClass('active') ) {
				var index = $(this).index();
				var className = $(this).attr('class');
				$(this).addClass('active').siblings().removeClass('active');
				
				move.mTween($navBase[0],{'rotate':-(index*90-45)},index*200,'linear',function(){
					if ( $body.hasClass('about') || $body.hasClass('contact')) {
						openWin(className);
					} else {
						$body.removeClass('loaded').addClass('loading');
						setTimeout(function(){
							openWin(className);
						},700);
					}
					
				});
				move.mTween($navBg[0],{'rotate':-index*90},index*200,'linear');
				move.mTween($navList[0],{'rotate':-(index*90-45)},index*200,'linear');
				for ( var i=0; i<$a.length; i++ ) {
					move.mTween($a[i],{'rotate':(index*90+45)-90},index*200,'linear');
				}
			}
		})
	}
	
	
	//打开一个新的页面
	function openWin(name) {
		name = name === 'home'? 'index': name;
		window.location.href = name + '.html';
	}
	
	
	
	//设置详情展框的位置和宽高
	function setSquareHeight(){
		//设置导航按钮的位置
		//获取顶部的logo
		var $top = $('#logo').offset().top;
		//获取底部的nav列表
		var $NavObj = $('#nav').find('.navList');
		var $NavTop = $NavObj.offset().top;
		var $NavHeight = $NavObj.outerHeight()/2;
		
		var c = $NavTop+$NavHeight-$top;
		
		var a = Math.sqrt(Math.pow(c,2)/2);
		$('#hint').css({
					'transition': '',
					'-webkit-transition': ''
				});
		$('#hint').css({'width':a,'height':a});
		$('#hint').offset({'top':$top});
		$('#hint').prop('width',a);
		$('#hint').prop('top',$('#hint').css('top'));
		$('#hint').css({'width':0,'height':0,'top':'40%'});
	}
	//页面进来图片加载
	function loading() {
		if ( $body.hasClass('loading') ) {
			var num = 0;
			$(data).each(function(i,e){
				var $img = $('<img src="'+e+'"/>');
				$img.off().on('load',function(){
					num ++;
					if ( num === data.length ) {
						$body.removeClass('loading').addClass('loaded');
						setTimeout(setSquareHeight,800);
					}
				})
			})
		} else {
			setSquareHeight();
		}
		
	}
	
	function creatText(data,obj) {
		if(!Array.isArray(data) || data.length===0) return;
		var num = 0;
		var arrObj = [];
		obj.innerHTML = '';
		for ( var i=0; i<data.length; i++ ) {
			var p = document.createElement('p');
			arrObj.push(obj.appendChild(p));
		}
		randText(0,arrObj[0]);
		function randText(n,p){
			var index = 0,timer= null,curTimer=null ;
			//var p = document.createElement('p');
			var i = document.createElement('i');
			p.appendChild(i);
			//obj.appendChild(p);
			timer = setInterval(function(){
				var txt = document.createTextNode(data[n].charAt(index));
				p.insertBefore(txt,i);
				
				if ( index === data[n].length-1 ) {
					
					clearInterval(timer);
					if ( n<data.length-1 ) {
						n++;
						p.removeChild(i);
						randText(n,arrObj[n]);
					}
				}
				index++;
			},200);
			curTimer = setInterval(function(){
				if (!i) {
					clearInterval(curTimer);
				} else {
					i.style.opacity = (!i.onOff?'100':'0');
					i.onOff = !i.onOff;
				}
			},200)
		}
	}
	
})()*/


