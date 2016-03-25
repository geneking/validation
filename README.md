## validation
---

### 1.怎么实现的
[1].插件基于jquery和requireJS
[2].代码结构：
```javascript
//一些公共调用方法
var action = {};
//jquery原型上添加相应校验方法
$.fn.extend({
	validNull: function(){},
	validCn: function(){},
	validPhone: function(){}
	//等等...
});
//外部调用方法
var valid = {
	init: function(){},//全局初始化
	register: function(){},//自定义注册事件
	hasError: function(){}//表单提交时调用，全局验证
};
```
<!--more-->
[3].解析data-valid的实现：

```javascript
var inputList = $('input[data-valid]');
inputList.map(function(index, ele) {
	var input = $(ele),
		data = eval('(' + input.data('valid') + ')'),
		validType = data.type,
		errorText = data.text || '';
	switch (validType) {
		case 'validLen':
			input.validLen(data.min, data.max);
			break;
		default:
			input[validType](errorText);
	}
});
```

### 2.怎么使用
```html
校验为空：<input type="text" data-valid="{type:'validNull'}">
校验中文：<input type="text" data-valid="{type:'validNull',text:'请输入中文'}">
校验电话：<input type="text" data-valid="{type:'phone',text:'请输入正确的手机号'}">
其他类似...
```
```javascript
require(['validation'],function(valid){
	//插件初始化
	valid.init();
	//自定义校验规则
	valid.register({
		reg:'^[1-9][0-9]{5,11}$',
		type:'validQQ'
	});
	//表单提交时验证，dom为表单jquery对象，dom可选，不传则默认所有表单
	if(valid.hasError(dom)) return;
});
```

### 3.有什么优点
> * 直接在dom元素中添加校验规则和错误提示信息，用起来比较方便
> * 可以通过register方法定制校验规则，有一定扩展性

### 4.缺点和不足
> * 依赖于第三方库
> * 提示信息位置制定在下方，不能自定义显示位置
> * 只实现了双层校验（先判断为空，再接着验证相应的规则），不能依次逐层校验
