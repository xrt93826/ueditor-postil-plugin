/**
 * Ueditor 批注插件
 */
'use strict';

UE.plugins["postil"] = function () {
	var me = this;
	var domUtils = UE.dom.domUtils;
	// 批注的标签
	var tag = 'mark';

	function optimize( range ) {
        var start = range.startContainer,end = range.endContainer;

        if ( start = domUtils.findParentByTagName( start, tag, true ) ) {
            range.setStartBefore( start );
        }
        if ( end = domUtils.findParentByTagName( end, tag, true ) ) {
            range.setEndAfter( end );
        }
    }

    function getPreviousNode(range){
    	var start = range.startContainer,end = range.endContainer;
    	console.log(start);
    	console.log(end);
    }

	// postil命令
	me.commands['postil'] = {
		// 添加批注
		execCommand:function (cmdName, opt) {
        
			//获取当前选区
			var range = me.selection.getRange();

			// 判断是否选中一个批注
			var postil = range.collapsed ? me.queryCommandValue( "postil" ) : me.selection.getStart();
	        if(postil && postil.tagName.toLowerCase() == tag.toLowerCase() && postil.getAttribute('plugins') == 'postil'){
	        	postil.setAttribute('content',opt.content);
	        	postil.setAttribute('author',opt.author);
	        	postil.setAttribute('date',opt.date);
	        }else{
	        	var contents = range.cloneContents();
	        	// 将选取用mark标签包起来，并赋予属性 
				var markRange = range.applyInlineStyle( tag, {
					style:'background-color: rgb(255, 255, 0) !important;font-style: normal;',
					plugins:'postil',
					content:opt.content,
					author:opt.author,
					date:opt.date
				});
	        }

	        range.collapse().select(true);
			

				
		},

		// 返回当前选中的第一个批注节点
		queryCommandValue:function(){
			var range = this.selection.getRange(),
				node;
				node = range.startContainer;
				node = node.nodeType == 1 ? node : node.parentNode;
				if ( node && (node = domUtils.findParentByTagName( node, tag, true )) 
					&& ! domUtils.isInNodeEndBoundary(range,node)) {
					return node;
				}
		}
	};


	// unpostil命令
	me.commands['unpostil'] = {
		// 删除批注
		execCommand:function(){
			//获取当前选区
			var range = this.selection.getRange(),
                bookmark;
            if(range.collapsed && !domUtils.findParentByTagName( range.startContainer, tag, true )){
                return;
            }

            getPreviousNode(range);

            bookmark = range.createBookmark();
            optimize( range );
            console.log(range);
            range.removeInlineStyle( tag ).moveToBookmark( bookmark ).select();
		}
	}

	var popup = new baidu.editor.ui.Popup( {  
		editor:this,  
		content: '',
		className: 'edui-bubble',
		_edittext: function () {
			me.ui._dialogs.postilDialog.open();
			this.hide();
		},
		_delete:function(){
			if( window.confirm('确认删除该批注吗？') ) {
				console.log(this.anchorEl);
				me.execCommand('unpostil');
			}
			this.hide();
		}
	} );
	popup.render();
	me.addListener( 'click', function( t, evt ) {
		evt = evt || window.event;
		var el = evt.target || evt.srcElement;
		
		domUtils.findParent(el,function(node){
			if(eval('/'+tag+'/ig').test( node.tagName ) && node.getAttribute('plugins') == 'postil'){
				var content = node.getAttribute('content'); 
				var author = node.getAttribute('author'); 
				var date = node.getAttribute('date');

				// 判断是批改试卷还是查看批改 用以判断是否显示编辑删除按钮
				var pathname = parent.location.pathname;
				var pagename = pathname.slice(pathname.lastIndexOf('/')+1);
				var html;
				if(pagename == "correctExam.html"){
					html = popup.formatHtml(
						'<div style="width:200px;">'+date+'&nbsp;'+author+': <p>'+content+'</p><div style="text-align:right;"><span onclick=$$._edittext() class="edui-clickable">编辑</span>&nbsp;<span onclick=$$._delete() class="edui-clickable">删除</span></div></div>' 
					);
				}else if(pagename == "previewCorrectExam.html"){
					html = popup.formatHtml(
						'<div style="width:200px;">'+date+'&nbsp;'+author+': <p>'+content+'</p></div>' 
					);
				}

				if ( html ) {
					popup.getDom( 'content' ).innerHTML = html;
					popup.anchorEl = node;
					popup.showAnchor( popup.anchorEl );
				} else {
					popup.hide();
				}
			}
		},true);
	});
};