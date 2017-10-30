# ngDateTimePicker
一个适用于Angular1.X的dateTimePicker 

![](public/images/screen1.png)


Usage
-------------

```
//引入css文件

  <link src='dist/tpl-ngDateTimePicker.css'></link>
....  

//在引入angular.js后引入 tpl-ngDateTimePicker.js

  <script src='dist/tpl-ngDateTimePicker.js'></script>
```
## ngDateTimePicker
```
<ng-date-time-picker ng-model='datetime' format='yyyy-MM-dd HH:mm:ss' selected='selected()'></ng-date-time-picker>
angular.module('myApp',['ngDateTimePicker'])
.controller('myCtrl',function($scope){
  $scope.selected = function(){
    console.log('选择 完毕 可以自行选择 移除或隐藏')
  }
})

//ng-model 若值转换成时间为 Invalid Date 转为此刻时间
//format 属性可选 若无datetime值为时间戳
```
## ngDateTimePicker-popup
```
angular.module('myApp',['ngDateTimePicker'])
.controller('myCtrl',function($scope, ngDateTimePicker){
  $scope.show = function(ev){
	ngDateTimePicker.open({
	  $scope : $scope,
	  ngModel : 'datetime',   //双向数据绑定
	  position : ev.target,    //显示在某元素的位置下
	  format : 'yyyy-MM-dd HH:mm:ss' //绑定元素输出的格式  若无该属性，格式为时间戳
	                                 //所支持的格式 见 angular 内置date 过滤器
	})
  }
})
```

