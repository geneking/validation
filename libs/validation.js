/*******************************************************************************
 * author: jinweigang | 798757301@qq.com
 * date: 2016-03-22
 * description 该控件主要提供input校验
 * *****************************************************************************
 * eg: input标签添加 data-valid={type:'validNull', text:'xxx不能为空'} | 校验是否为空
 * eg: input标签添加 data-valid={type:'validLen', min:2, max:10} | 校验长度
 */

define(['jquery'],function($) {
  'use strict';

  //正则集合
  var REG = {
    en:    /^[A-Za-z]+$/,
    cn:    /^[\u4E00-\u9FA5]+$/,
    num:   /^[1-9][0-9]*$/,
    qq:    /^[1-9][0-9]{4,11}$/,
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)[\d]{9}$/
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
      var value = $.trim(self.val());
      if (action.isNull(self)) return;
      if (!reg.test(value)) {
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
     * @param {errorText} 报错文案
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
     */
    validLen: function(min, max) {
      var self = $(this);
      self.on('blur',function() {
        var value = self.val(),
            reg = ['^\\S{', min, ',', max,'}$'].join(''),
            pattern = new RegExp(reg);
        action.common(self, pattern, false, '字符长度应为' + min + '~' + max)
      });
    },

    /**
     * @function validEn
     * @description 校验英文字母输入
     * @param {errorText} 报错文案
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
     * @param {errorText} 报错文案
     */
    validCn: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.cn, errorText, '请输入中文');
      });
    },

    /**
     * @function validNum
     * @description 校验输入的是否位数字
     * @param {errorText} 报错文案
     */
    validNum: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.num, errorText, '请输入数字');
      });
    },

    /**
     * @function validQQ
     * @description 校验输入的qq，5-12位
     * @param {errorText} 报错文案
     */
    validQQ: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.qq, errorText, '请输入正确的qq号');
      });
    },

    /**
     * @function validEmail
     * @description 校验输入的是否位数字
     * @param {errorText} 报错文案
     */
    validEmail: function(errorText) {
      var self = $(this);
      self.on('blur',function() {
        action.common(self, REG.email, errorText, '请输入正确的邮箱');
      });
    },


    /**
     * @function validPhone
     * @description 校验输入的是否位数字
     * @param {errorText} 报错文案
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
     * @param {form} 在哪个表单对象下校验
     */
    hasError: function(form) {
      var input = form ? form.find('input[data-valid]') : $('input[data-valid]');
      input.blur();
      var error = form ? form.find('.valid-error') : $('.valid-error');
      return error.length;
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
