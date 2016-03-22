/**
 * author: jinweigang
 * date: 2016-03-22
 * description 该控件主要给红包配置后台提供input校验
 * 使用规则：input标签添加 data-valid={type:Len, min:2, max:10}
 */

define(['../lib/jquery'], function($) {
  'use strict';

  //正则集合
  var REG = {
    en: /^[a-zA-Z]$/,
    num: /^[1-9]\d*$/,
    phone: /^1(3|4|5|7|8)[\d]{9}$/
  };

  //添加提示
  var addError = function(input, tip) {
    var parent = input.parent().css('position', 'relative').addClass('error');
    var html = '<div class="error-tip">' + tip +'</div>';
    var errorTip = parent.find('.error-tip');

    if(errorTip.length) {errorTip.remove();}
    input.addClass('error-border');
    parent.append(html);
  };

  //是否为空
  var isNull = function(self, errorText){
    var flag = false;
    var value = $.trim(self.val());
    if (value === '') {
      self.addClass('error-border');
      addError(self, errorText || '输入不能为空');
      flag = true;
    } else {
      self.parent().removeClass('error');
      self.siblings('.error-tip').remove();
    }
    return flag;
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
        isNull(self,errorText);
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
          len = $.trim(value).length;
        if (isNull(self)) return;
        if ((len > max) || (len < min)) {
          self.addClass('error-border');
          addError(self, '字符长度应为' + min + '-' + max);
        } else {
          self.parent().removeClass('error');
          self.siblings('.error-tip').remove();
        }
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
        var value = self.val();
        if (isNull(self)) return;
        if (!REG.en.test(value)) {
          self.addClass('error-border');
          addError(self, errorText || '请输入英文字母');
        } else {
          self.parent().removeClass('error');
          self.siblings('.error-tip').remove();
        }
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
        var value = self.val();
        if (isNull(self)) return;
        if (!REG.num.test(value)) {
          self.addClass('error-border');
          addError(self, errorText || '请输入数字');
        } else {
          self.parent().removeClass('error');
          self.siblings('.error-tip').remove();
        }
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
        var value = self.val();
        if (isNull(self)) return;
        if (!REG.phone.test(value)) {
          self.addClass('error-border');
          addError(self, errorText || '电话号码不合法');
        } else {
          self.parent().removeClass('error');
          self.siblings('.error-tip').remove();
        }
      });
    }
  });

  /**
   * @function register
   * @description 外部扩展，自定义注册校验规则
   * @param {option: validType} 校验类型
   * @param {option: reg} 校验规则
   */
  var register = function(option){
    var inputList = $('input[data-valid]');
    inputList.map(function(index, ele) {
      var self = $(ele),
          data = eval('(' + self.data('valid') + ')'),
          validType = data.type;

      if (option.type != validType) return;
      self.on('blur',function() {
        var value = self.val();
        if (isNull(self)) return;
        if (!option.reg.test(value)) {
          self.addClass('error-border');
          addError(self, data.text);
        } else {
          self.parent().removeClass('error');
          self.siblings('.error-tip').remove();
        }
      });
    });
  };

  /**
   * @function init
   * @description 所有input初始化
   */
  var init =  function() {
    var inputList = $('input[data-valid]');
    $('body').on('keyup','input[data-valid]',function(){
      //输入的时候移除红色警示
      var self = $(this);
      self.parent().removeClass('error');
      self.siblings('.error-tip').remove();
    });

    inputList.map(function(index, ele) {
      var input = $(ele),
        data = eval('(' + input.data('valid') + ')'),
        validType = data.type,
        errorText = data.text || '';

      switch (validType) {
        case 'Null':
          input.validNull(errorText);
          break;
        case 'En':
          input.validEn(errorText);
          break;
        case 'Num':
          input.validNum(errorText);
          break;
        case 'Phone':
          input.validPhone(errorText);
          break;
        case 'Len':
          input.validLen(data.min, data.max);
          break;
      }
    });
  };

  return {
    init: init,
    register: register
  }
});
