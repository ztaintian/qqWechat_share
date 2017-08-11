$.extend($,{
   	ajaxFn: function(options){
		var defaults = {
			url: '',
			data:{},
			type: 'POST',
			contentType: 'application/json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('platform', 'h5app');   /// 手机 ， web 区分
			},
			success: function() {
				
			}
		};
	
		var settings = {};
		settings = $.extend(settings, defaults, options);
		
		
		var jsonData=null;
	
		if(typeof options.data == 'string' || settings.type.toLowerCase()=='get' ){
			jsonData=options.data;
		}
		else{
			jsonData=JSON.stringify(settings.data);
		}
		

		$.ajax({
			url: settings.url,
			data: jsonData,
			type: settings.type,
			contentType: settings.contentType,
			success: function(data, status, xhr){
			}
		});
		
		
	},
	getHref:function getDataFn(key){  //获取地址拦？后面的vue值
		var str=window.location.href;
		str=str.substring(str.indexOf('?')+1);
		var end=false;
	
		var arrHref=str.split('&');
		for(var i=0; i<arrHref.length;i++){
			var chilrenArr=arrHref[i].split('=');
			if(chilrenArr[0]==key)
			{
				end=chilrenArr[1];
				break ;
			}
		}
		return end
	},
	ajaxCom: function(options) {

		var defaults = {
			url: '',
			data:{},
			type: 'POST',
			async:true,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('platform', 'h5app');   /// 手机 ， web 区分
			},
			contentType: 'application/json',
			success: function() {
				
			}
		};
	
		var settings = {};
		settings = $.extend(settings, defaults, options);
		
		
		var jsonData=null;
	
		if(typeof options.data == 'string' || settings.type.toLowerCase()=='get' ){
			jsonData=options.data;
		}
		else{
			jsonData=JSON.stringify(settings.data);
		}
		
		$.ajax({
			url: settings.url,
			data: jsonData,
			type: settings.type,
			async:settings.async,
			contentType: settings.contentType,
			beforeSend: settings.beforeSend,
			success: function(data, status, xhr){
				/*var auth = xhr.getResponseHeader("Authorization");
				if(auth && window.localStorage){
					var tempKey = 'bailian-auth-key-' + new Date().getTime();
					$.setCookie('bailian-auth-key' + paths.HJ, tempKey);
					window.localStorage.setItem(tempKey, auth);
				} else if(auth) {
					$.setCookie('bailian-auth' + paths.HJ, auth);
				}*/
				settings.success(data, status,xhr);
			}
		});
	},
	hasApp: function(version, infoid,num) {
		var url={};
		if(num=='1'){
			url = {
				open: version + '://bldz?infoId=' + infoid,
				down: _BASE_URL + 'app/web/QR-code.html'
			};
		}else if(num=='2'){
			url = {
				open: version + '://business?memberId=' + infoid,
				down: _BASE_URL + 'app/web/QR-code.html'
			};
		}
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		var timer=null;
		$(document).on('visibilitychange webkitvisibilitychange', function() {
		    var tag = document.hidden || document.webkitHidden;
		    if (tag) {
		        clearTimeout(timer);
		    }
		})
		$(window).on('pagehide', function() {
		    clearTimeout(timer);
		})
		if(isAndroid){
			android();
		}else if(isiOS){
			ios();
		}
		//安卓
		function android(){
	        window.location.href = url.open; /***打开app的协议，有安卓同事提供***/
	        timer=setTimeout(function(){
	        	createDiv();
	        },500);
	    }
		//ios
		function ios(){
	        /*var ifr = document.createElement("iframe");
	        ifr.src = url.open; 
	        ifr.style.display = "none"; 
	        document.body.appendChild(ifr);*/
	        window.location.href = url.open;
	        timer=setTimeout(function(){
	            //document.body.removeChild(ifr);
	            createDiv();
	        },500);
	    }
		var urlAdd={
				trade:{
					android:['http://a.app.qq.com/o/simple.jsp?pkgname=com.bldz.transaction',_RES_URL + 'web/package/trade.apk'],
					ios:['https://itunes.apple.com/cn/app/id1215128819','itms-services://?action=download-manifest&url=' + _RES_URL + 'web/package/trade.plist']
				},
				opportunity:{
					android:['http://a.app.qq.com/o/simple.jsp?pkgname=com.bldz.chance',_RES_URL + 'web/package/opportunity.apk'],
					ios:['https://itunes.apple.com/cn/app/id1215130970','itms-services://?action=download-manifest&url=' + _RES_URL + 'web/package/opportunity.plist']
				}
			}
	 	function createDiv(){
	 		$('#downloadBox').remove();
 			var $div=$('<div id="downloadBox" class="downloadBox"><a class="downloadHref" href="javascript:;">安全下载</a><a class="downloadHref2" href="javascript:;">取 消</a></div>');
    		$('body').append($div);
    		if(isAndroid){  // 安卓
    			if($.getHref('version')=='trade'){  // 交易
    				if(_BASE_URL=='https://uat.bldz.com/' || _BASE_URL=='https://www.bldz.com/'){
    					$('.downloadHref').attr('href',urlAdd.trade.android[0]);
    				}else{
    					$('.downloadHref').attr('href',urlAdd.trade.android[1]);
    				}
    			}else{   // 商机
    				if(_BASE_URL=='https://uat.bldz.com/' || _BASE_URL=='https://www.bldz.com/'){
    					$('.downloadHref').attr('href',urlAdd.opportunity.android[0]);
    				}else{
    					$('.downloadHref').attr('href',urlAdd.opportunity.android[1]);
    				}
    			}
    		}else if(isiOS){  // ios
    			if($.getHref('version')=='trade'){  // 交易
    				if(_BASE_URL=='https://uat.bldz.com/' || _BASE_URL=='https://www.bldz.com/'){
    					$('.downloadHref').attr('href',urlAdd.trade.ios[0]);
    				}else{
    					//$('.downloadHref').attr('href',urlAdd.trade.ios[1]);
    					$('.downloadHref').attr('href',_BASE_URL + 'app/web/QR-code.html');
    				}
    			}else{   // 商机
    				if(_BASE_URL=='https://uat.bldz.com/' || _BASE_URL=='https://www.bldz.com/'){
    					$('.downloadHref').attr('href',urlAdd.opportunity.ios[0]);
    				}else{
    					//$('.downloadHref').attr('href',urlAdd.opportunity.ios[1]);
    					$('.downloadHref').attr('href',_BASE_URL + 'app/web/QR-code.html');
    				}
    			}
    		}
    		$('.downloadHref').on('touchstart',function(ev){
    			ev.stopPropagation();
    		});
    		$('.downloadHref2').on('touchstart',function(ev){
    			//$('.downloadHref').attr('href','');
    			$('.downloadHref').removeAttr('href');
    		});
        	$('#downloadBox').addClass('downopenUp');
        	$('.maskBg').show();
	 	}
		$('body').on('touchstart',function(){
			setTimeout(function(){
				if($('#downloadBox').hasClass('downopenUp')){
					 $('#downloadBox').addClass('downopenDown').removeClass('downopenUp');
					 $('.maskBg').hide();
				}
			},300)
			
		});
	}
 })