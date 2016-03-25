require.config({
  //baseUrl: "/another/path",
  paths: {
      "validation": "libs/validation",
      "jquery": "libs/jquery.min"
  }
  //waitSeconds: 15
});

require(['jquery','validation'],function($, valid){
  //初始化
  valid.init();

  $('.button').on('click',function(){
    //提交表单时校验
    if(valid.hasError()) return;
    //发送提交请求
  });
});
