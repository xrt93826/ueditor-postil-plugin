/**
 * Ueditor 新建批注
 */
'use strict';

UE.registerUI('newPostil',function(editor,uiName){
	var me = this;

	//创建dialog
	var dialog = new UE.ui.Dialog({
		//指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
		iframeUrl:editor.options.UEDITOR_HOME_URL+'postilPlugin/postilDialogPage.html',
		//需要指定当前的编辑器实例
		editor:editor,
		//指定dialog的名字
		name:'postilDialog',
		//dialog的标题
		title:"批注",

		//指定dialog的外围样式
		cssRules:"width:422px;height:150px;",

		//如果给出了buttons就代表dialog有确定和取消
		buttons:[
			{
				className:'edui-okbutton',
				label:'确定',
				onclick:function () {
					dialog.close(true);
				}
			},
			{
				className:'edui-cancelbutton',
				label:'取消',
				onclick:function () {
					dialog.close(false);
				}
			}
		]});

	// dialog塞到全局下
	me.ui._dialogs.postilDialog = dialog;

	//参考addCustomizeButton.js
	var btn = new UE.ui.Button({
		name:'新建批注',
		title:'新建批注',
		cssRules :'background: url('+editor.options.UEDITOR_HOME_URL+'postilPlugin/newPostil.png) no-repeat 3px 2px / 74% !important',
		onclick:function () {
			// 判断是否选中一块区域
			var range = me.selection.getRange();
			if(!range.collapsed){
				//渲染dialog
				dialog.render();
				dialog.open();
			}else{
				alert('请选择需要添加批注的内容！');
				return;
			}



		}
	});


	return btn;
});
