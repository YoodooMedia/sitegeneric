/**
 * Created by Adrian on 21/07/2015.
 */
if (yoodoo===undefined) yoodoo={};

yoodoo.search={
    searchableData:[],
    dialog:{},
    updateRequired:function(){
        return (this.searchableData.length == 0 || this.searchableData.length != yoodoo.bookcase.items.length)
    },
    clearCachedData:function(){
        this.searchableData=[];
    },
    updateSearchableData:function(){
        if(this.updateRequired()) {
            this.clearCachedData(); //empty array to avoid duplicates in case there was data already inside
            for (var x = 0; x < yoodoo.bookcase.items.length; x++) {
                if (yoodoo.bookcase.items[x].hasOwnProperty('visible')===true && yoodoo.bookcase.items[x].visible==true) {
                    var item = {};
                    item.id = (yoodoo.bookcase.items[x].hasOwnProperty('id') === true) ? yoodoo.bookcase.items[x].id : "";
                    item.title = (yoodoo.bookcase.items[x].hasOwnProperty('title') === true) ? yoodoo.bookcase.items[x].title : "";
                    item.type = (yoodoo.bookcase.items[x].hasOwnProperty('type') === true) ? yoodoo.bookcase.items[x].type : "";
                    item.thumbnail = (yoodoo.bookcase.items[x].hasOwnProperty('imageUrl') === true) ? yoodoo.bookcase.items[x].imageUrl : "";
                    item.shortDescription = (yoodoo.bookcase.items[x].hasOwnProperty('shortDescription') === true) ? yoodoo.bookcase.items[x].shortDescription : "";
                    item.file = (yoodoo.bookcase.items[x].hasOwnProperty('file') === true) ? yoodoo.bookcase.items[x].file : "";
                    //searchkeys is a string, split in arrays of words instead
                    item.keywords = (yoodoo.bookcase.items[x].hasOwnProperty('searchkeys') === true && yoodoo.bookcase.items[x].searchkeys !== "") ? yoodoo.bookcase.items[x].searchkeys.split(" ") : [];
                    this.searchableData.push(item);
                }
            }
            return true;
        }
        return false;
    },
    getKeywordsByContentId:function(id){
        if (id === undefined ) return false;
        if(this.updateRequired()) this.updateSearchableData();
        for(var x = 0; x < this.searchableData.length; x++){
            if(this.searchableData[x].id == id ) return this.searchableData[x].keywords;
        }
        return false;
    },
    matchItems:function(criteria,res,ignoreTitles) {
        if (typeof(criteria) == 'undefined') return false;
        if (res == "" || criteria =="") return res([]);
        if (ignoreTitles === undefined) ignoreTitles = false;
        if (this.updateRequired()) this.updateSearchableData();

        var str = criteria.replace(/^ /, '').replace(/ $/, '').replace(/  /g, ' ').split(' ');
        var regs = [];
        for (var s in str) {
            regs.push({regex: new RegExp('(\\b' + str[s] + ')', 'i'), score: 2});
            regs.push({regex: new RegExp('(' + str[s] + ')'), score: 1});
            regs.push({regex: new RegExp('(' + str[s] + ')', 'i'), score: 1});
        }
        var arr = [];
        if (regs.length > 0) {
            for (var x = 0; x < this.searchableData.length; x++) {
                var title = this.searchableData[x].title;
                var score = 0;
                var txt = ' ' + title;
                for (var r in regs) {
                    for (var k = 0; k < this.searchableData[x].keywords.length; k++) {
                        if (this.searchableData[x].keywords[k].match(regs[r].regex)) {
                            score += regs[r].score;
                        }
                    }
                    if (ignoreTitles === false) {
                        if (txt.match(regs[r].regex)) {
                            score += regs[r].score;
                        }
                    }
                }
                if (score > 0) {
                    arr.push({
                        label: title,
                        obj: this.searchableData[x],
                        score: score
                    });
                }
            }
        }
        arr.sort(function (a, b) {
            return (b.score) - (a.score);
        });
        while (arr.length > 10) arr.pop();
        //console.log(arr);
        res(arr);
    },
    renderResults:function(results, parent){
        if(parent === undefined) return false;
        parent.empty();
        var header = $(yoodoo.e("div"));
        if(results.length == 0 ){
            header.append("No matches found");
        }else{
            for(var r=0;r<results.length;r++) {
                header.append(
                    this.renderItem(results[r])
                );
            }
        }

        parent.append(header);
    },
    renderItem:function(item) {
        if(item === undefined || typeof item !=="object") return false;

        var but=yoodoo.e("div");
        var me = this;
        but.result=item;
        var url = '';
        var buttonText ='';
        if (item.obj.type !== undefined) {
            switch (item.obj.type) {
                case 'dooit':
                    url = 'playa_item_dooit.png';
                   // buttonText ='DOO-IT';
                    break;
                case 'book':
                    url = 'playa_item_episode.png';
                   // buttonText ='PLAY';
                    break;
                case 'document':
                    url = 'playa_item_doc.png';
                 //   buttonText = 'DOWNLOAD';
                    break;
            }
        }
        var src  = yoodoo.option.baseUrl + 'uploads/sitegeneric/image/' + url;

        var image = $(yoodoo.e('div')).addClass("contentTypeImage").css({"background":"url("+src+")", "background-size":"cover"});
        var thumbnail = $(yoodoo.e('div')).addClass("yoodooSearchThumbnail").css({"background":"url("+item.obj.thumbnail+")", "background-size":"cover" });
        var description = $(yoodoo.e('div')).addClass("description").text(item.obj.shortDescription).css({'display':'none'});
        var additionalInfo = $(yoodoo.e('div')).addClass("additionalInfo").append(thumbnail).append(description);
        var label = $(yoodoo.e("button")).addClass('itemLabel').append(image).append(item.label);
        var arrowExpander = $(yoodoo.e('div')).addClass('arrow').append(yoodoo.icons.get('next', 10, 10));
        var goButton = $(yoodoo.e("button")).addClass("goButton").html(buttonText).append(yoodoo.icons.get('next', 20, 20)).on("click",function(){
                me.closeDialog();
                if(item.obj.type=="dooit"){
                    yoodoo.showDooit(item.obj.id);
                }else if(item.obj.type=="book"){
                    yoodoo.hide();
                    yoodoo.startEpisode(item.obj.id);
                }else if(item.obj.type=="document") yoodoo.download(item.obj.id, item.obj.file)
            });

        $(but).addClass("yoodooSearchItem").append(label).append(goButton).append(((item.obj.type == 'book')? additionalInfo : "")).append(((item.obj.type == 'book')? arrowExpander : "")).on('click',function() {
            var me = this;

            if ($(this).hasClass("on") === true) {
                $(this).removeClass('on').find('.arrow').css({'transform': 'rotate(+90deg)'});
            } else {
                $(this).addClass('on');
                $(this).find('.arrow').css({'transform': 'rotate(-90deg)'});
            }
            additionalInfo.slideToggle('slow');
            description.slideDown('slow');
            $(this).siblings().removeClass('on').find('.additionalInfo').slideUp('slow');
            $(this).siblings().find('.description').slideUp('slow');
            $(this).siblings().find('.arrow').css({'transform': 'rotate(+90deg)'});
        });

        me.scroller(but);
       return but
    },
    scroller:function(target){

        $(target).on('click', function () {
            var pos =  $(this)[0].offsetTop;
            var itemHeight = $(this).height();
            var parentHeight = $('#yoodooSearchResultHolder').height();
            var scrollHeight = $('#yoodooSearchResultHolder')[0].scrollHeight;
            if( pos > parentHeight/2 && pos < (scrollHeight  - itemHeight) ){
                var posi =  ( pos - itemHeight/2 - parentHeight/2);

               $('#yoodooSearchResultHolder').animate({
                        scrollTop:posi
                },'slow');
            }

        });
    },
    renderDialog:function(){
        var me = this;
        var resultHolder = $(yoodoo.e("div")).attr("id","yoodooSearchResultHolder").css({"width":yoodoo.option.width*0.8, "height":yoodoo.option.height*0.6, "overflow-y":"auto"});
        var textbox =new yoodoo.ui.text({
            label:(yoodoo.w("search")!=="")?yoodoo.w("search"):"Search",
            onchange:function() {

                    yoodoo.search.matchItems(this.value,function(res){
                        yoodoo.search.renderResults(res,resultHolder);
                        yoodoo.ui.update();
                    });

            }
        });
        var but=$(yoodoo.e("button")).attr("type","button").addClass("ctaButton searchCloseButton").html(yoodoo.w("close"));
        this.dialog =new yoodoo.ui.dialog({
            html:$(yoodoo.e("div")).append(textbox.render(textbox.value)).append(resultHolder).append(but),
            closeButton:true,
            blockoutClickClose:true,
            className:"yoodooSearchCustomDialog"
        });
        this.dialog.render();
        but.click(function() {
            var source=me;
            source.dialog.close();
        });
        return true;
    },
    closeDialog:function(){
        if(!$.isEmptyObject(this.dialog)){
            this.dialog.close();
            this.dialog={};
            return true;
        }
        return false;
    }
};
