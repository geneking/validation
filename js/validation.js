/***********************************************************************
 * author: 798757301@qq.com
 * date: 2016-03-22
 * description 该控件主要提供input校验
 * *********************************************************************
 * eg: input标签添加 data-valid={type:'validNull', text:'xxx不能为空'} | 校验是否为空
 * eg: input标签添加 data-valid={type:'validLen', min:2, max:10} | 校验长度
 */

define(function() {
  'use strict';

  //正则集合
  var REG = {
    num:   '/^[1-9]\d*$/',
    en:    '/^[A-Za-z]+$/',
    cn:    '/^[\u4e00-\u9fa5]{0,}$/',
    phone: '/^1(3|4|5|7|8)[\d]{9}$/'
  };

  //操作函数
  var action = {
    /**
     * @function addError
     * @description 给input添加错误提示
     */
    addError: function(input, tip) {
      var parent = input.parent().css('position', 'relative').addClass('valid-error');
      var html = '<div class="error-tip">' + tip +'</div>';
      var errorTip = parent.find('.error-tip');

      if(errorTip.length) {errorTip.remove();}
      input.addClass('error-border');
      parent.append(html);
    },
    /**
     * @function isNull
     * @description 判断input值是否为空
     */
    isNull: function(self, errorText){
      var flag = false;
      var value = $.trim(self.val());
      if (value === '') {
        self.addClass('error-border');
        action.addError(self, errorText || '输入不能为空');
        flag = true;
      } else {
        self.parent().removeClass('valid-error');
        self.siblings('.error-tip').remove();
      }
      return flag;
    },
    /**
     * @function common
     * @description 各种类型校验公共函数
     * @param {self} input对象
     * @param {reg} 校验规则
     * @param {errorText} 错误文案
     * @param {defaultText} 默认文案
     */
    common: function(self, reg, errorText, defaultText){
      var value = $.trim(self.val()),
          pattern = new RegExp(reg);
      if (action.isNull(self)) return;
      if (!pattern.test(value)) {
        self.addClass('error-border');
        action.addError(self, errorText || defaultText);
      } else {
        self.parent().removeClass('valid-error');
        self.siblings('.error-tip').remove();
      }
    }
  };

  $.fn.extend({
    /**
     * @function validNull
     * @description 校验输入为空的情况
     * @param {text} 报错文案
     */
    validNull: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.isNull(self,errorText);
      });
    },

    /**
     * @function validLen
     * @description 校验输入特定长度
     * @param {start} 最少输入字符
     * @param {end} 最多输入字符
     * @param {text} 报错文案
     */
    validLen: function(min, max) {
      var self = $(this);
      self.on('blur',function() {
        var value = self.val(),
            reg = ['/^\S{', min, ',', max,'}$/'].join('');
        action.common(self, reg, false, '字符长度应为' + min + '~' + max)
      });
    },

    /**
     * @function validEn
     * @description 校验英文字母输入
     * @param {text} 报错文案
     */
    validEn: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.en, errorText, '请输入英文字母');
      });
    },

    /**
     * @function validCn
     * @description 校验英文字母输入
     * @param {text} 报错文案
     */
    validCn: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.en, errorText, '请输入中文');
      });
    },

    /**
     * @function validNull
     * @description 校验输入的是否位数字
     * @param {text} 报错文案
     */
    validNum: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.num, errorText, '请输入数字');
      });
    },

    /**
     * @function validPhone
     * @description 校验输入的是否位数字
     * @param {text} 报错文案
     */
    validPhone: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.phone, errorText, '电话号码不合法');
      });
    }
  });

  //暴露外部调用方法
  var valid = {
    /**
     * @function register
     * @description 外部扩展，自定义注册校验规则
     * @param {option: validType} 校验类型
     * @param {option: reg} 校验规则
     */
    register: function(option){
      var inputList = $('input[data-valid]');
      inputList.map(function(index, ele) {
        var self = $(ele),
            data = eval('(' + self.data('valid') + ')'),
            validType = data.type;

        if (option.type != validType) return;
        self.on('blur',function() {
          action.common(self, option.reg, false, data.text);
        });
      });
    },

    /**
     * @function hasError
     * @description 失焦后校验所有input，一般用在form提交时
     */
    hasError: function() {
      $('input[data-valid]').blur();
      return $('.valid-error').length;
    },

    /**
     * @function init
     * @description 所有input初始化
     */
    init: function() {
      var inputList = $('input[data-valid]');
      $('body').on('keyup','input[data-valid]',function(){
        //输入的时候移除红色警示
        var self = $(this);
        self.parent().removeClass('valid-error');
        self.siblings('.error-tip').remove();
      });

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
    }
  };

  return valid;
});
