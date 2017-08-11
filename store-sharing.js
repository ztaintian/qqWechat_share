$(function(){
	var model = avalon.define({
		$id: "storeSharing",
		dataList:{},
		contentList:{},
		imgList:{}
	})
	avalon.scan();
	function getHref(key) { //获取地址拦？后面的vue值  //  $.getHref('name')
		var str = window.location.href;
		str = str.substring(str.indexOf('?') + 1);
		var end = false;

		var arrHref = str.split('&');
		for(var i = 0; i < arrHref.length; i++) {
			var chilrenArr = arrHref[i].split('=');
			if(chilrenArr[0] == key) {
				end = chilrenArr[1];
				break;
			}
		}
		return end;
	}

	ryRem();
	window.addEventListener("orientationchange", ryRem);
		function ryRem() {
		    var html = document.querySelector("html");
		    var width = html.getBoundingClientRect().width;
		    html.style.fontSize = width / 16 + "px";
		}
		ajaxData();
		function ajaxData(){	
			$.ajax({
				type:'POST',
				contentType: 'application/json',
				url:_BASE_URL+'platform/platform/queryOneStoreAndMemberMsg',
				data:getHref('storeId'),
				success:function(data){
					if(data.success){
						model.dataList = data.data;
						model.dataList.shopLogo = _RES_URL+data.data.shopLogo;
					}
				},
				error:function(){}
			})
		}	
		ajaxData1();
		function ajaxData1(){
			var d = {
				"pageSize":4,
				"customerId":getHref('memberId')
			}	
			var jsonData = JSON.stringify(d);	
			$.ajax({
				type:'POST',
				contentType: 'application/json',
				url:_BASE_URL+'listing/searchLiteResource',
				data:jsonData,
				beforeSend: function(xhr){xhr.setRequestHeader("api-ver", '5.26');},
				success:function(data){
					if(data.success){
						model.imgList = data.data;
						$(data.data).each(function(index,value){
							model.imgList[index].coverImg = _RES_URL + value.coverImg;
						})
					}
				},
				error:function(){}
			})
		}

		ajaxData2();
		function ajaxData2(){
			var d = {
				"storeId":getHref('storeId'),
				"contentCode":'st00001',
			}	
			var jsonData = JSON.stringify(d);	
			$.ajax({
				type:'POST',
				contentType: 'application/json',
				url:_BASE_URL+'platform/platform/queryStoreTempContentList',
				data:jsonData,
				success:function(data){
					if(data.success){
						model.contentList = data.data;
						if(model.contentList[0] && model.contentList[0].contentHtml){
							model.contentList[0].contentHtml = _RES_URL+data.data[0].contentHtml;
							var url = 'url('+model.contentList[0].contentHtml+')';
							setTimeout(function(){
								var _height = $('.banner_bg').height();
								var _width = Number($('.banner_bg').height())/Number($('#hidden').height())*Number($('#hidden').width());
								$('#hidden').css({
									display: 'none'
								})
								$('.banner_bg').css({
									backgroundImage:url,
									backgroundSize:_width,_height,
									backgroundPosition:'center',
									backgroundColor:'#ccc'
								})	
							},100)
						}else{
							$('.banner_bg').css({
								background:'#ccc'
							})												
						}
					}
				},
				error:function(){}
			})
		}
setTimeout(function(){
	wxshare()
},2000)

function wxshare(_obj) {
	var _obj={};
	_obj={
		"title":$(".memberName").html(),
		"general":$(".center_text").html(),
		"imgurl":_BASE_URL + 'app/base/img/bllogo2.png'
	};
	//兼容IOS微信分享的图片分享
	$('#shawImg').attr('src',_obj.imgurl);
	$.ajaxCom({
		type: 'post',
		url: _BASE_URL + 'openapi/open/wechat/signature',
		data: window.location.href,
		success: function(data) {
			document.title = _obj.title;
			$('#description').attr('content',_obj.general);;
			$('#name').attr('content', _obj.title);
			$('#image').attr('content', _obj.imgurl);
			var obj1 = {};
			obj1 = data;
			try {
				wx.config({
					debug: false,
					appId: obj1.appId,
					timestamp: obj1.timestamp,
					nonceStr: obj1.nonceStr,
					signature: obj1.signature,
					jsApiList: [
						'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'onMenuShareQZone'
					]
				});
			} catch(e) {

			};
			try{
				setShareInfo({
	         title:_obj.title,
	         summary:_obj.general,
	         pic:_obj.imgurl,
	         url:location.href,
	         WXconfig:{
	          swapTitleInWX: true,
	          appId:obj1.appId,
	          timestamp: obj1.timestamp,
	          nonceStr: obj1.nonceStr,
	          signature: obj1.signature
	         }
	     });
			} catch(e){
			}
			try {
				wx.ready(function() {
					//分享到朋友圈
					wx.onMenuShareTimeline({
						title: _obj.title, // 分享标题							
						link: location.href, // 分享链接
						imgUrl: _obj.imgurl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享给朋友
					wx.onMenuShareAppMessage({
						title: _obj.title, // 分享标题
						desc: _obj.general, // 分享描述
						link: location.href, // 分享链接
						imgUrl: _obj.imgurl, // 分享图标
						type: '', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到QQ
					wx.onMenuShareQQ({
						title: _obj.title, // 分享标题
						desc: _obj.general, // 分享描述
						link: location.href, // 分享链接
						imgUrl: _obj.imgurl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到腾讯微博
					wx.onMenuShareWeibo({
						title: _obj.title, // 分享标题
						desc: _obj.general, //  分享描述
						link: location.href, // 分享链接
						imgUrl: _obj.imgurl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到QQ空间
					wx.onMenuShareQZone({
						title: _obj.title, // 分享标题
						desc: _obj.general, // 分享描述
						link: location.href, // 分享链接
						imgUrl: _obj.imgurl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
				});
			} catch(e) {}
		},
		error: function() {}

	})
}
})	