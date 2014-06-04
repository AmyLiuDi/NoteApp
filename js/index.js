$(function(){
	//max id
	var id_max = new Number;
	// 当前id
	var id_now;
	// 当前要处理的p
	var p_count = "0";

	if(localStorage["id_max"]){
		id_max = Number(localStorage["id_max"]);
		localStorage["id_max"] = id_max;
	}
		else {id_max = -1;}

	// 获取当前时间
	function getTime() {
		var theDate = new Date();
		var theDay = theDate.toLocaleDateString();
		var theTime = theDate.toLocaleTimeString();
		return (theDay + theTime);
	}

	// 主页生成一个预览
	function loadNoteToIndex(id) {
		$("#index-section ul li:last").clone(true)
			.insertAfter($(".add").parent());
		$("#index-section ul li:eq(1) a span")
			.html(localStorage[id+"_time"]);
		$("#index-section ul li:eq(1) a p:first")
			.html(localStorage[id+"_0"]);
		$("#index-section ul li:eq(1)").css("display","block").attr("name", id);
	}

	// 主页生成所有预览
	function loadNotesToIndex() {
		$("#index-section ul li:gt(0)").not(":last").remove();
		for (var i = 0; i <= Number(id_max); i++) {
			var id = "id"+i;
			if(localStorage[id]){
				loadNoteToIndex(id);
			}
		}
	}
	loadNotesToIndex();

	// 加载一篇记事信息至导航列表
	function loadNoteToList(id) {
		$("#list ul li:last")
		.clone(true).prependTo($("#list ul:first"));
		var theTime = localStorage[id+"_time"];
		$("#list ul li:first a p:last span").html(theTime);
		var pText = localStorage[id+"_0"];
		$("#list ul li:first a p:first").html(pText);
		$("#list ul li:first").css("display","block").attr('name', id);
	}

	// 加载一个记事全文
	function loadNoteToText(id) {
		initGroupArticle();
		$("article:visible form .text").attr('name', id);//设置id
		$("article:visible").attr('name', id);
		var theTime = localStorage[id+"_time"];//修改时间
		$("article>header>span").html(theTime);
		var tag = localStorage[id+"_tag"];//分类标签
		if(tag === "temp"){
			$(".tag [value=temp]").attr("selected",true);
			$(".tag [value=life]").attr("selected",false);
			$(".tag [value=job]").attr("selected",false);
		}
		else if(tag === "life"){
			$(".tag [value=temp]").attr("selected",false);
			$(".tag [value=life]").attr("selected",true);
			$(".tag [value=job]").attr("selected",false);
		}
		else if(tag === "job"){
			$(".tag [value=temp]").attr("selected",false);
			$(".tag [value=life]").attr("selected",false);
			$(".tag [value=job]").attr("selected",true);
		}
		$("article:visible form .text p").remove();
		for(i=0;;i+=1){//加载文章段落
			if(localStorage[id+"_"+i]){
				var pText = localStorage[id+"_"+i];
				$("article:visible form .text").append("<p>"+pText+"</p>");
			}
			else {break;}
		}
	}

	// 加载所有记事信息至导航列表及展示最后一篇记事
	function loadNotesToList() {
		$("#list ul li").not(":last").remove();
		for (var i = 0; i <= Number(id_max); i++) {
			var id = "id"+i;
			if(localStorage[id]){
				loadNoteToList(id);
			}
		}
		id_now = "id" + Number(id_max);
		$("#list ul li:first").addClass("selected");
		$("#list ul li:not(:first)").removeClass("selected");
		loadNoteToText(id_now);
		$("#groups li:first a").addClass("selected");
		$("#groups li:not(:first) a").removeClass("selected");
	}
	loadNotesToList();

	// 从导航列表中选择记事加载
	$("#list ul li").click(function(){
		id_now = $(this).attr("name");
		$(this).children("a").addClass("selected");
		$(this).siblings("li").children("a").removeClass("selected");
		initGroupArticle();
		loadNoteToText(id_now);
	}) 

	// 跳转至主页
	function toIndex() {
		$("#nav-index").addClass("selected");
		$("#nav-groups").removeClass("selected");
		$("#index-section").css("display", "block");
		$("#groups-section").css("display", "none");
		$(".note").css("display", "none");
		$("#div-import").css("display", "none");
	}
	$("#nav-index").click(toIndex);

	// 跳转至分组
	function toGroup() {
		$("#nav-groups").addClass("selected");
		$("#nav-index").removeClass("selected");
		$("#groups-section").css("display", "block");
		$(".note").css("display", "none");
		$("#index-section").css("display", "none");
		$(".note1").css("display", "block");
		$("#div-import").css("display", "none");
		loadLastNote();
	}
	// 加载最后一篇记事
	function loadLastNote(){
		initGroupArticle()
		var id = $("#list li:eq(0)").attr("name");
		loadNoteToText(id);
		$("#list li:eq(0)").children("a").addClass("selected");
		$("#list li:eq(0)").siblings("li").children("a").removeClass("selected");
	}
	$("#nav-groups").click(toGroup);

	// 主页跳转至新建记事
	$(".add").click(function(){
		initNewFile();
		var theTime = getTime();
		$("#nav-index").removeClass("selected");
		$("#nav-groups").removeClass("selected");
		$(".note").css("display", "none");
		$("#index-section").css("display", "none");
		$("#groups-section").css("display", "none");
		$(".note3").css("display", "block");
		$("#div-import").css("display", "none");
		$("article:visible>header>span.time").html(theTime);
		id_now = "id" + (Number(id_max)+1);
	});

	// 主页跳转至文章全文
	function indexViewText() {
		$(".note").css("display", "block");
		$(".note3").css("display", "none");
		$("#index-section").css("display", "none");
		$("#groups-section").css("display", "none");
		$("#div-import").css("display", "none");
		id_now = $(this).attr("name");
		initIndexArticle();
		loadNoteToText(id_now);
	}
	$("#index-section ul li:gt(0)").click(indexViewText);

	// 附件
	// 添加图片
	function addImageToNote(fileName) {
		var $pImage = $("<p><img></p>");
		$(".text:visible").append($pImage);
		$(".text:visible p:last img")
			.attr("src", "image/upload/"+fileName)
			.attr("controls", "controls");
	}
	// 添加音乐
	function addMusicToNote(fileName) {
		var $pMusic = $("<p><span></span><audio></audio></p>");
		$(".text:visible").append($pMusic);
		$(".text:visible p:last audio")
			.attr("src", "music/upload/"+fileName)
			.attr("controls", "controls");
		$(".text:visible p:last span").html(fileName);
	}
	// 添加视频
	function addVideoToNote(fileName) {
		var $pVideo = $("<p><video></video></p>");
		$(".text:visible").append($pVideo);
		$(".text:visible p:last video")
			.attr("src", "video/upload/"+fileName)
			.attr("controls", "controls");
	}


	var imageExtList = ["jpg","jpeg","png","gif"];
	var musicExtList = ["mp3","wav","ogg"];
	var videoExtList = ["mp4","ogg"];
	$(".import a").click(function() {
		$("#div-import").css("display", "block");
		$("#upload-file").val("");
	})
	$("#upload-file").change(function(){
		var fileURL = $("input#upload-file").val();
		var fileNameTemp = fileURL.split("\\");
		var fileName = fileNameTemp[fileNameTemp.length - 1];
		var fileExtTemp = fileName.split(".");
		var fileExt = fileExtTemp[fileExtTemp.length - 1];
		for(var i in imageExtList){
			if(imageExtList[i] === fileExt){
				addImageToNote(fileName);
				break;
			}
		}
		for(var i in musicExtList){
			if(musicExtList[i] === fileExt){
				addMusicToNote(fileName);
				break;
			}
		}
		for(var i in videoExtList){
			if(videoExtList[i] === fileExt){
				addVideoToNote(fileName);
				break;
			}
		}
		$("#div-import").css("display", "none");
	})
	$("#up-no").click(function() {
		$("#div-import").css("display", "none");
	})

	// 在分组页跳转至新建
	$(".gm-new").click(function() {
		initNewFile();
		$(".note2").css("display", "block");
		$(".note1").css("display", "none");
		$("#div-import").css("display", "none");
		var theTime = getTime();
		$("article:visible>header>span.time").html(theTime);
		id_now = "id" + (Number(id_max)+1);
	})

	// 取消新建
	$(".gb-cancel").click(toGroup);
	$(".in-cancel").click(toIndex);
	$(".i-cancel").click(toIndex);
	$(".gm-cancel").click(loadNoteToText(id_now));

	// 保存修改或新建
	function saveNewFile(id) {
		localStorage[id] = 1;
		var theTime = $("article:visible>header>span.time").html();
		localStorage[id+"_time"] = theTime;
		localStorage[id+"_tag"] = $("article:visible .tag option:selected").val();
		var $p_count = $("article:visible form div.text p");
		var $temp = $("article:visible form div.text p:first");
		for (var i = 0; i < $p_count.length; i++) {
			localStorage[id+"_"+i] = $temp.html();
			$temp = $temp.next();
		}
	}
	// 初始化新建窗口
	function initNewFile() {
		$(".note2 header span, .note3 header span").empty();
		$(".note2>div>form>div.text p, .note3>div>form>div.text p")
			.remove();
		$(".note2>div>form>div.text, .note3>div>form>div.text")
			.append("<p><br></p>");
	}
	// 初始化主页全文窗口
	function initIndexArticle() {
		$(".note4 header span").empty();
		$(".note4>div>form>div.text p")
			.remove();
	}
	// 初始化分组页全文窗口
	function initGroupArticle() {
		$(".note1 header span").empty();
		$(".note1>div>form>div.text p")
			.remove();
	}


	// 主页保存修改
	$(".i-save").click(function(){
		id_now = $("article:visible").attr("name");
		for (var i = 0; i < 50; i++) {
			localStorage.removeItem(id_now+"_"+i);
			}
		saveNewFile(id_now);
		alert("已保存");
		initIndexArticle();
		loadNotesToIndex();
		loadNotesToList();
		toIndex();
	})
	// 分组页保存修改
	$(".gm-save").click(function(){
		id_now = $("article:visible").attr("name");
		for (var i = 0; i < 50; i++) {
			localStorage.removeItem(id_now+"_"+i);
			}
		saveNewFile(id_now);
		alert("已保存");
		initGroupArticle();
		loadNotesToIndex();
		loadNotesToList();
		toGroup();
	})
	// 主页保存新建
	$(".in-save").click(function(){
		id_now = "id"+(Number(id_max)+1);
		saveNewFile(id_now);
		initNewFile();
		alert("已保存");
		id_max+=1;
		localStorage["id_max"] = id_max;
		toIndex();
		loadNotesToIndex();
		loadNotesToList();
	})
	// 分组保存新建
	$(".gb-save").click(function(){
		id_now = "id"+(Number(id_max)+1);
		saveNewFile(id_now);
		initNewFile();
		alert("已保存");
		id_max+=1;
		localStorage["id_max"] = id_max;
		loadNotesToIndex();
		loadNotesToList();
		toGroup();
	})

	// 主页删除一篇记事
	function deleteNote() {
		var id = $("article:visible").attr("name");
		localStorage.removeItem(id);
		localStorage.removeItem(id+"_tag");
		localStorage.removeItem(id+"_time");
		for (var i = 0; i < 50; i++) {
			localStorage.removeItem(id+"_"+i);
			}
		loadNotesToIndex();
		loadNotesToList();
	}
	$(".note4 header a.i-delete").click(deleteNote);
	$(".note4 header a.i-delete").click(toIndex);
	$(".note1 header a.gm-delete").click(deleteNote);
	$(".note1 header a.gm-delete").click(toGroup);
	

	//分类导航
	// 全部
	$("#groups>li>a[name=all]").click(function(){
		$("#list ul li").not(":last").remove();
		loadNotesToList();
		loadLastNote();
		$("#div-import").css("display", "none");
		$(this).addClass("selected");
		$(this).parent().siblings().children("a").removeClass("selected");
	})
	// 临时
	$("#groups>li>a[name=temp]").click(function(){
		$("#list ul li").not(":last").remove();
		for (var i = 0; i <= Number(id_max); i++) {
			var id = "id"+i;
			if(localStorage[id]){
				if(localStorage[id+"_tag"] === "temp"){
					loadNoteToList(id);
				}
			}
		};
		loadLastNote();
		$("#div-import").css("display", "none");
		$(this).addClass("selected");
		$(this).parent().siblings().children("a").removeClass("selected");
	})
	// 生活
	$("#groups>li>a[name=life]").click(function(){
		$("#list ul li").not(":last").remove();
		for (var i = 0; i <= Number(id_max); i++) {
			var id = "id"+i;
			if(localStorage[id]){
				if(localStorage[id+"_tag"] === "life"){
					loadNoteToList(id);
				}
			}
		};
		loadLastNote();
		$("#div-import").css("display", "none");
		$(this).addClass("selected");
		$(this).parent().siblings().children("a").removeClass("selected");
	})
	// 工作
	$("#groups>li>a[name=job]").click(function(){
		$("#list ul li").not(":last").remove();
		for (var i = 0; i <= Number(id_max); i++) {
			var id = "id"+i;
			if(localStorage[id]){
				if(localStorage[id+"_tag"] === "job"){
					loadNoteToList(id);
				}
			}
		};
		loadLastNote();
		$("#div-import").css("display", "none");
		$(this).addClass("selected");
		$(this).parent().siblings().children("a").removeClass("selected");
	})
})