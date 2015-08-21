/* --- dooit layout ---

 <div class='hotspot'></div>
 <script type='text/javascript'>
 function initThis() {
 var params={};
 params.dependencies=[
 ['dooits/thisfilename.js',true],       - sitegeneric file
 ['dooits/otherrequiredfile.js',false],        - sitespecific file
 ['css/otherrequiredfile.ccs',false]        - sitespecific file
 ];
 params.loaded=function(){
 hotspot.init({selectors:{container:'.hotspot'}});      - options to override in the dooit class
 };
 params.saveValues=['hotspot.output'];
 params.finished='hotspot.finishable';
 dooit.init(params);
 }
 </script>
 */



dooit.temporaries('hotspot');
var hotspot={
    selectors:{
        container:'.hotspot'
    },
    containers:{
        container:null
    },
    value:null,
    structure:null,
    key:null,
    valuekey:null,
    finished:false,
    pageIndex:-1,
    pageKeyIndex:{},
    init:function() {
        if (arguments.length>0) this.transposeOptions([],arguments[0]);
        this.loadFields();
        this.containers.container=$(this.selectors.container);
        if (this.key!==null && this.containers.container!==null) {
            if (this.value===null || this.value=='') this.renewValue();
            // start rendering the dooit
            this.start();
            for(var p=0;p<this.structure.pages.length;p++) this.pageKeyIndex[this.structure.pages[p].id]=p;
        }
    },
    start:function() {
        // add the content to this.containers.container
        var h2=yoodoo.e("h2");
        $(h2).html(yoodoo.dooittitle);
        this.containers.display=yoodoo.e("div");
        $(this.containers.display).addClass("displayArea").css({opacity:0});
        $(this.containers.container).empty().append(h2).append(this.containers.display);
    },
    loaded:function() {
        var h=$('#yoodooScrolledArea').height();
        var h2h=$(this.containers.container).find("h2").height();
        $(this.containers.display).css({height:h-h2h-8});
        if (this.value.pageIndex!==null) {
            if (this.value.pageIndex=='end') {
                this.displayEnd();
            }else{
                this.pageIndex=this.value.pageIndex-1;
                this.displayPage();
            }
        }else{
            this.displayStart();
        }
    },
    loadFields:function() {
        if (typeof(array_of_default_fields)=="object" && array_of_default_fields.length==2
            && typeof(array_of_global_fields)=="object" && array_of_global_fields.length>0) {
            for(var g=0;g<array_of_global_fields.length;g++) {
                for(var k=0;k<array_of_default_fields.length;k++) {
                    if (array_of_global_fields[g]==array_of_default_fields[k] && this.key===null) {
                        this.key=array_of_global_fields[g];
                    }
                }
            }
            if (this.key!==null) {
                for(var k=0;k<array_of_default_fields.length;k++) {
                    if (array_of_default_fields[k]!=this.key) this.valuekey=array_of_default_fields[k];
                }
            }

        }
        if (this.key===null && array_of_default_fields.length>0) {
            for(var f=0;f<array_of_default_fields.length;f++) {
                if (/^global_Quizit/.test(array_of_default_fields[f])) this.key=array_of_default_fields[f];
            }
        }
        if (this.valuekey===null && array_of_default_fields.length>0) {
            for(var f=0;f<array_of_default_fields.length;f++) {
                if (/^quizit/.test(array_of_default_fields[f])) this.valuekey=array_of_default_fields[f];
            }
        }

        if(this.key!==null) {
            try{
                this.structure=$.parseJSON(Base64.decode(array_of_fields[this.key][1]));
            }catch(e){
                this.structure=array_of_fields[this.key][1];
            }
        }
        if(this.valuekey!==null) {
            try{
                this.value=$.parseJSON(array_of_fields[this.valuekey][1]);
            }catch(e){
                this.value=array_of_fields[this.valuekey][1];
            }
        }

        this.value=dooit.decode(this.value);
        this.structure=dooit.decode(this.structure);
    },
    transposeOptions:function(keys,obj) {
        for(var k in obj) {
            if(typeof(obj[k])=="object") {
                var thiskeys=keys.slice();
                thiskeys.push(k);
                this.transposeOptions(thiskeys,obj[k]);
            }else{
                this.setOption(keys,k,obj[k]);
            }
        }
    },
    setOption:function(keys,key,val) {
        try{
            var e=keys.join('.');
            if(e!='') {
                e='this.'+e;
            }else{
                e='this';
            }
            if(isNaN(key)) {
                e+='.'+key+"=val;";
            }else{
                e+='['+key+']=val;';
            }
            eval(e);

        }catch(e){}
    },
    displayStart:function() {
        $(this.containers.display).animate({opacity:0},200,function() {
            var dv=yoodoo.e("div");
            $(dv).css({position:'absolute',top:'100%',width:'100%'});
            var but=yoodoo.e("button");
            $(but).attr("type","button").html(hotspot.structure.starttext).addClass("hotspot_cta").click(function() {yoodoo.stopVoiceover();hotspot.displayPage();});
            $(this).empty().append($(dv).html(hotspot.structure.text.replace(/\n/g,'<br />')+'<br />').append(but)).animate({opacity:1},200);
            var t=Math.round(($(this).height()-$(dv).height())/2);
            $(dv).animate({top:t},200);
        }).css({'font-size':hotspot.structure.fontSize+'px','line-height':Math.round(1.25*hotspot.structure.fontSize)+'px'});
    },
    displayEnd:function() {
        this.value.pageIndex='end';
        $(this.containers.display).animate({opacity:0},200,function() {
            var dv=yoodoo.e("div");
            $(dv).css({position:'absolute',top:'100%',width:'100%'});
            $(dv).html(hotspot.structure.endtext.replace(/\n/g,'<br />')+'<br />');
            if (hotspot.structure.restart===true) {
                var but=yoodoo.e("button");
                $(but).attr("type","button").html(hotspot.structure.restarttext).addClass("hotspot_cta").click(function() {hotspot.restart();});
                $(dv).append(but);
            }
            $(this).empty().append(dv).animate({opacity:1},200);
            var t=Math.round(($(this).height()-$(dv).height())/2);
            $(dv).animate({top:t},200);
        }).css({'font-size':hotspot.structure.fontSize+'px','line-height':Math.round(1.25*hotspot.structure.fontSize)+'px'});
    },
    restart:function() {
        this.pageIndex=-1;
        this.renewValue();
        yoodoo.stopVoiceover();
        this.displayStart();
    },
    renewValue:function() {
        this.value={
            pageIndex:null,
        };
    },
    displayPage:function() {
        yoodoo.stopSound();
        if (arguments.length>0) {
            if (arguments[0]==0) {
                this.pageIndex++;
            }else{
                this.pageIndex=this.pageKeyIndex[arguments[0]];
            }
        }else{
            this.pageIndex++;
        }
        if (this.pageIndex===undefined || this.pageIndex>=this.structure.pages.length) {
            this.value.pageIndex='end';
            this.displayEnd();
        }else{
            this.value.pageIndex=this.pageIndex;
            $(this.containers.display).animate({opacity:0},200,function() {
                hotspot.renderPage();
                $(this).animate({opacity:1},200);
            });
        }
    },
    renderPage:function() {
        yoodoo.stopSound();
        var base=yoodoo.e("div");
        var page=this.structure.pages[this.pageIndex];
        $(base).css({
            width:page.width,
            height:page.height,
            background:'url('+yoodoo.option.baseUrl+page.image+')',
            margin:'0px auto',
            position:'relative'
        });
        $(this.containers.display).empty().append(base);
        if (page.response!='') {
            base.response=page.response;
            base.nextPage=page.nextpage;
            $(base).click(function(e) {
                if (e.target==this) {
                    hotspot.nextPage=this.nextPage;
                    hotspot.respond(this.response);
                }
            }).addClass("baseImage");
        }
        for(var s=0;s<page.spots.length;s++) {
            var spot=yoodoo.e("div");
            $(spot).css({
                top:page.spots[s].top,
                left:page.spots[s].left,
                width:page.spots[s].width,
                height:page.spots[s].height,
                'background-position':'-'+page.spots[s].left+'px -'+page.spots[s].top+'px'
            }).addClass("spot");
            spot.backgroundImage=yoodoo.option.baseUrl+page.rollover;
            spot.response=page.spots[s].response;
            spot.nextPage=page.spots[s].nextpage;
            if (page.spots[s].rollover && page.rollover!="") $(spot).bind('mouseover',function() {
                $(this).css({'background-image':'url('+this.backgroundImage+')'});
            }).bind("mouseleave",function() {
                $(this).css({'background-image':'none'});
            }).click(function() {
                hotspot.nextPage=this.nextPage;
                hotspot.respond(this.response);
            });
            if (page.spots[s].cursor) $(spot).addClass("withPointer");
            $(base).append(spot);
        }
        var endSound=function(){};
        if (page.text!='') {
            this.explanation=yoodoo.e("div");
            var dv=yoodoo.e("div");
            $(dv).html(page.text).css({
                width:page.width
            });
            $(this.explanation).addClass("explanation").append(dv).css({'font-size':this.structure.infoSize+'px','line-height':Math.round(1.25*this.structure.infoSize)+'px'});
            $(this.containers.display).append(this.explanation);
            switch (this.structure.explanatoryReveal) {
                case '0':
                    var explanatoryHeight=$(this.explanation).height();
                    $(this.containers.display).bind('mousemove',function(e) {
                        var fromTop=e.pageY-$(this).offset().top;
                        var topOffset=fromTop-explanatoryHeight-20;
                        if (topOffset>0) topOffset=0;
                        $(hotspot.explanation).css({top:topOffset});
                    })
                        /*.bind('mouseleave',function() {
                         $(hotspot.explanation).animate({top:0});
                         })*/;
                    break;
                case '1':
                    this.infoButton=yoodoo.e("button");
                    $(this.infoButton).addClass("infoButton").attr("type","text").click(function(){
                        if ($(hotspot.explanation).hasClass("closed")) {
                            $(hotspot.explanation).animate({
                                top:0
                            }).removeClass('closed');
                        }else{
                            $(hotspot.explanation).animate({
                                top:'-'+this.explanatoryHeight
                            }).addClass('closed');
                        }
                    }).html('info');
                    $(this.containers.container).prepend(this.infoButton);
                    var explanatoryHeight=$(this.explanation).height();
                    $(this.explanation).click(function() {
                        $(this).animate({
                            top:'-'+explanatoryHeight
                        }).addClass('closed');
                    });
                    this.infoButton.explanatoryHeight=explanatoryHeight;
                    endSound=function() {
                        if (hotspot!==undefined) {
                            $(hotspot.explanation).animate({
                                top:'-'+explanatoryHeight
                            }).addClass('closed');
                        }
                    };
                    break;
            }
        }
        if (page.sound!==undefined && page.sound.url!==undefined) {
            yoodoo.playSound(page.sound.url,endSound);
        }else{
            setTimeout(endSound,1000*this.structure.responseWait);
        }
    },
    nextPage:null,
    respond:function(id) {
        $(this.infoButton).remove();
        var r=this.getResponse(id);
        if (r.sound!==undefined && r.sound.url!==undefined) yoodoo.playSound(r.sound.url);
        for(var t=0;t<r.optionTags.length;t++) {
            if (r.optionTags[t].remove) {
                dooit.removeTag(r.optionTags[t].tag);
            }else{
                dooit.addTag(r.optionTags[t].tag);
            }
        }
        var res=yoodoo.e("div");
        var resText=yoodoo.e("div");
        $(resText).html(r.text.replace(/\n/g,'<br />')+'<br />').css({color:'#'+r.colour,'font-size':this.structure.responseSize+'px','line-height':Math.round(1.25*this.structure.responseSize)+'px'});
        if (this.structure.responseShadow) $(resText).css({
            'text-shadow':'0px 1px 5px #'+this.structure.responseShadowColour
        });
        var but=yoodoo.e("button");
        $(but).attr("type","button").html(this.structure.nextPageButton).click(function(){
            hotspot.displayPage(hotspot.nextPage);
        }).addClass("hotspot_cta");
        $(res).addClass("response").append($(resText).append(but)).hide();
        $(this.containers.display).append(res);
        $(res).fadeIn();
        $(resText).animate({top:'40%'});
    },
    getResponse:function(id) {
        for(var r=0;r<this.structure.responses.length;r++) {
            if (this.structure.responses[r].id==id) return this.structure.responses[r];
        }
        return null;
    },
    finishable:function() {
        var ok=(this.value.pageIndex=='end');
        return ok;
    },
    output:function() {
        var op=(dooit.json(this.value));
        array_of_fields[this.valuekey][1]=op;
        var reply={};
        eval('reply.EF'+array_of_fields[this.valuekey][0]+'=op;');
        return reply;
    }
};