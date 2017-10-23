angular.module('myApp',[])
.controller('myCtrl', function($scope){
	$scope.datetime = 'Sun Oct 22 2017 14:15:29 GMT+0800'

	$scope.selected =function(){
		console.log('selected', $scope.datetime)
	}

})
.directive('ngDateTimePicker', function($filter){
	return {
		restrict:'E',
		templateUrl:'tpls/dateTimePicker.html',
		replace:true,
		require:'ngModel',
		scope:{
			selected:"&"
		},
		link:function(scope, ele, attr, ctrl){
			ctrl.$render = function(){
                _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                scope.value = _initContent //双向绑定

                // 格式化 传入的 时间 
                Number(scope.value)|| Number(scope.value) == 0?scope.value=Number(scope.value):scope.value;

                var date = new Date(scope.value) ;
             
                if(date == 'Invalid Date'){
                	// 使用 此刻时间
                	date = new Date();
                };
                dealDate(date)
            }
            ctrl.$render();
            function dealDate(date){
            	scope.year = date.getFullYear();
                scope.month = date.getMonth() + 1;
                scope.day = date.getDate();
                scope.hour = date.getHours();
                scope.minute = date.getMinutes();
                scope.second = date.getSeconds();
            }
			scope.selectedDate = function(){
				var str = scope.year +'/'+scope.month+'/'+scope.day+' '+scope.hour+':'+scope.minute+':'+scope.second;
				if(attr.format){

					var value = $filter('date')(new Date(str), attr.format);
				}else{
					var value = new Date(str).getTime()
				}
				ctrl.$setViewValue(value);
				scope.selected()

			}
			scope.nowDate = function(){
				dealDate(new Date())
			}
			var yearCol = [];
			for(var i = 1990; i < 2021; i ++){
				yearCol.push(i)
			}
			scope.yearCol = yearCol;
			var monthCol = [];
			for(var i = 1; i < 13; i ++){
				monthCol.push(i)
			}
			scope.monthCol = monthCol;
			scope.change = function(){
				var str = scope.year + '/' + scope.month + '/1'
				var f_day = new Date(str).getDay();  //第一天 是星期几 
				var days = getDaysInMonth(scope.year, scope.month); //每月 有多少天 
				//创建一个二维数组  
				var dataCol = [];
				var arr = [];
				for(var i = 0; i < 7; i ++){
					if(i >= f_day){
						arr[i] = i - f_day + 1;
					}else{
						arr[i] = ""
					}
				}
				var arr_last_num = arr[arr.length-1];
				dataCol.push(arr);
				while(arr_last_num + 7 < days){
					var arr = [];
					for(var i = 0; i < 7; i++){
						arr[i] = arr_last_num + 1;
						arr_last_num ++ ;
					}
					dataCol.push(arr);
				}
				var arr = [];
				for(var i = 0; i < 7; i++){
					arr[i] = arr_last_num + 1;
					arr_last_num ++;
					if(arr_last_num > days){
						arr[i] = ""
					}
				}
				dataCol.push(arr);
				scope.dataCol = dataCol;
			}
			scope.change();
			scope.selectDay = function(day){
				if(typeof(day) == 'number'){

					scope.day = day
				}
			}
			scope.range = function(n){
				return new Array(n)
			}
		
			function getDaysInMonth(year,month){ 
				var date = new Date(year, month, 1);  
					return new Date(date.getTime() - 864e5).getDate();
			} 
		
		}
	}
})
.directive('dtSelect', function(){
	return {
		restrict:'E',
		templateUrl:"tpls/dtSelect.html",
		require:'ngModel',
		replace:true,
		transclude : true,
		scope:{},
		controller:function($scope, $element){
			this.select = function(value, label){
				$scope.show = false;
				$scope.value = value;
				$scope.label = label
			}
			$scope.vlObj = [];
			this.collectObj = function(value, label){
				$scope.vlObj.push({value:value, label:label})
			}
			//获取 元素   
            //滚动框  
            var $scroller_wrapper = angular.element($element[0].querySelector('.dt_scroller_wrapper'));
			var height; //内容框 高度 
			var scroller_height;
			var scroller_top;

			//内容框ul 
            var content_ul = $element.find('ul')[0];
            //内容框 margin-top;
            var content_range = parseInt(window.getComputedStyle(content_ul)['margin-top']);

            //滚筒条  
            var scroller = angular.element($element[0].querySelector('.dt_scroller'))[0];


            $scroller_wrapper.bind('click', function(ev){
            	ev.stopPropagation();
            })
        

            $scroller_wrapper.bind('mousewheel', function(ev){
            	//滚动距离  
            	console.log(ev)
            	// ev.stopPropagation()
            	var wheel_range = ev.wheelDeltaY?ev.wheelDeltaY:ev.originalEvent.wheelDeltaY;
            	// console.log(ev)
            	move(wheel_range)
            	ev.preventDefault()  //阻止默认事件
				ev.stopPropagation()
            	
            })
            var mouseon_scroller_top;
            var mouseon_content_range;
            var mouse_position
            // 滚动条 mousedown
            angular.element(scroller).on('mousedown', function(ev){
            	ev.stopPropagation()
            	mouse_position = ev.pageY;
            	mouseon_content_range = content_range;
            	mouseon_scroller_top  = parseInt(window.getComputedStyle(scroller)['margin-top']);;


            	angular.element(document.body).on('mousemove', mousemove)
            	angular.element(document.body).on('mouseup', mouseup)
            })
            function mousemove(ev){
            	var range = ev.pageY - mouse_position;
            	var c_m_t = mouseon_content_range - range/200*height;
            	if(c_m_t > 0){
            		c_m_t = 0
            	}else if(c_m_t < -height +200){
            		c_m_t = -height+200
            	}
            	content_ul.style.marginTop = c_m_t + 'px'
            	var s_m_t = mouseon_scroller_top + range;
            	if(s_m_t  > 200-scroller_height ){
            		s_m_t = 200-scroller_height
            	}else if(s_m_t < 0){
            		s_m_t = 0;
            	}
            	scroller.style.marginTop = s_m_t + 'px'
          
            }
            function mouseup(ev){
            	ev.stopPropagation()
            	angular.element(document.body).off('mousemove', mousemove)
            	angular.element(document.body).off('mouseup', mouseup)
            }
            
            function move(range){
            	content_range += range;
            	if(content_range > 0){
            		content_range = 0
            	}else if(content_range < -height +200){
            		content_range = -height+200
            	}
            	content_ul.style.marginTop = content_range +'px'

            	//获取 滚动条 的 margin-top;
            	scroller_top = parseInt(window.getComputedStyle(scroller)['margin-top']);

            	scroller_top -= range/height * 200;
            	if(scroller_top  > 200-scroller_height ){
            		scroller_top = 200-scroller_height
            	}else if(scroller_top < 0){
            		scroller_top = 0;
            	}


            	scroller.style.marginTop = scroller_top +'px'
            }

			this.repeatDone = function(){
				// console.log(content_ul)
				height = parseInt(window.getComputedStyle(content_ul)['height']);
				console.log(height)
     	    	//计算 滚动条 长度  
     	    	scroller_height = 200/height * 200;
     	    	scroller.style.height = scroller_height + 'px';
     	    	$scope.show = false
     	    	$scope.match();
			}

			$scope.match = function(){
				//根据  scope.value  匹配 scope.label;
				this.label = '';
				for(var i = 0 ; i < this.vlObj.length; i++){
					if(this.vlObj[i].value == this.value){
						this.label = this.vlObj[i].label
					}
				}
			}

		},
		link:function(scope, ele, attr, ctrl){
			//判断 方向  
			// console.log('eleh', window.getComputedStyle(ele[0]).height)
			attr.direction=='top'?scope.top=true:scope.top=false;
			scope.show = true;
			scope.toggle = function(){
				scope.show = !scope.show
			}
			ctrl.$render = function(){
                _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
                scope.value = _initContent //双向绑定
                
            }
            ctrl.$render();
            scope.$watch('value', function(){
            	ctrl.$setViewValue( scope.value);
            	scope.match();
			})

			//-----------------DOM 操作 ---------------------
            angular.element(document.body).bind('mousedown', function(event){
            	var event = event || window.event; //浏览器兼容性 
				var elem = event.target || event.srcElement; 
				while (elem) { //循环判断至跟节点，防止点击的是div子元素 
					if (elem == ele[0]) { 
						return; 
					} 
					elem = elem.parentNode; 
				} 
            	scope.$apply(function(){
            		scope.show = false;
            	})

            })
		}
	}
})
.directive('dtOption', function(){
	return {
		restrict:'E',
		template:"<li class='one_option' ng-click='select(value, label)'>{{label}}</li>",
		replace:true,
		require:"^dtSelect",
		link:function(scope, ele, attr, ctrl){
			scope.label = attr.label;
			scope.value = attr.value;
			scope.select = ctrl.select;
			ctrl.collectObj(scope.value, scope.label)


			if(scope.$last){
				ctrl.repeatDone()
			}
		}
	}
})
.filter('addZero', function(){
	return function(value){
		if(String(value).length == 1){
			return '0' + value
		}else{
			return value
		}
	}

})