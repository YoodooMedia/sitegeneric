/* --- dooit layout ---

 {
 dependencies:[
 ['dooits/pir.js',false],
 ['css/pir.css',false]
 ],
 loaded:function(){
 pir.init({});
 },
 saveValues:['pir.output'],
 orientation:'auto',
 options:{
 }
 }
 */

dooit.temporaries('pir');
var pir = {
    selectors : {
        container : '.dooitDisplay'
    },
    containers : {
        container : null
    },
    icons:{
        left:{
            img:'/uploads/sitespecific/yoodoo.siteFolder/image/back4D4D4D.png',svg:'<polygon fill="#4D4D4D" points="69.747,0.615 26.475,50.002 69.747,99.385 79.689,90.936 43.831,50.002 79.689,9.078 "/>'
        },
    },
    title:'PIR',
    //summary : null,
    value : null,
    //summarykey : null,
    //configkey:null,
    //inputs:{},
    //voiceoverkey:null,
    //voiceoverrecord:null,
    key : null,
    schema : {},
    fields : {},
    sAnswers:{},
    q1Answers:{},
    q2Answers:{},
    kloeTitle:null,
	responses:{},
    /*keyQuestions:{
    	SAFE:null,
    	EFFECTIVE:null,
    	CARING:null,
    	RESPONSIVE:null,
    	WELLLED:null
    },
    prompts:{
    	SAFE:null, // prompts:[]
    	EFFECTIVE:null,
    	CARING:null,
    	RESPONSIVE:null,
    	WELLLED:null
    },
    responses:{
    	SAFE:null, // responses:[]
    	EFFECTIVE:null,
    	CARING:null,
    	RESPONSIVE:null,
    	WELLLED:null
    },
    fieldName:{
        kloe_1:{title:'SAFE',intervention:204220},
        kloe_2:{title:'EFFECTIVE',intervention:204221},
        kloe_3:{title:'CARING',intervention:204223},
        kloe_4:{title:'RESPONSIVE',intervention:204224},
        kloe_5:{title:'WELL-LED',intervention:204222}
    },*/
    objectoptions:{
        //prompts:'kloe_prompt_object',
        //keyQuestions:'key_questions',
        //businessSector:'business_sector',
        responses:'kloe_response'
    },
    objects:{
       // prompts:null,
        //keyQuestions:null,
       // businessSector:null,
        responses:null
    },
    questions:[],
    //questionOneText:'Question one sample?',
    //questionTwoText:'Question two sample?',
    noAnswersText:'There are no suggested answers for this section',
    init : function() {
        var me = this;
        this.container = $('.dooitDisplay').addClass("pir");
        if (arguments.length > 0)
            this.transposeOptions([], arguments[0]);
        this.loadFields();
        this.containers.container = $(this.selectors.container).addClass("pir");
        if (this.key !== null && this.containers.container !== null) {
            if ( typeof (pir_schema) == "object") {
                this.schema = pir_schema;
            }
            if (this.value == '')
                this.value = {};
            var me = this;
			if (this.value.length==2) {
				this.q1Answers=this.value[0];
				this.q2Answers=this.value[1];
			}
        }
        this.loadObjects(
            function() {
                me.start();
            }
        );

    },
	getPrompts:function(callback) {
        var me=this;
		if (this.kloeTitle!==null) {
			if (this.schema[this.kloeTitle.Id]===undefined) {
				yoodoo.keyQuestion.getPromptsInKeyLines(function(list) {
					//for(var kqId in list) {
					//console.log(list);
					me.schema[me.kloeTitle.Id]=list;
						for(var kloe in me.schema[me.kloeTitle.Id]) {
							for(var p in me.schema[me.kloeTitle.Id][kloe].items) {
								var prompt=me.schema[me.kloeTitle.Id][kloe].items[p];
								me.promptsById[prompt.Id]=new me.prompt(prompt);
							}
						}
					callback();
				},this.kloeTitle.Id);
			}else{
				callback();
			}
		}
	},
    loadObjects:function(callback) {
        var me=this;
        var objIds=[];
        for(var k in this.objectoptions) {
            if (dooit.options[this.objectoptions[k]].object_id!==undefined) {
                objIds.push(dooit.options[this.objectoptions[k]].object_id);
            }else if (dooit.options[this.objectoptions[k]].value>0) {
                objIds.push(dooit.options[this.objectoptions[k]].value);
            }
        }
        yoodoo.object.get(objIds,function(objs) {
            for(var k in me.objects) {
                if (objs.length>0) me.objects[k]=objs.shift();
            }
            var failed=false;
            for(var k in me.objects) {
                if ( me.objects[k]===null) failed=true;
            }
            if (failed) {
                me.failed('Not all objects found');
            }else{
				me.keyQuestions=[];
				yoodoo.keyQuestion.get(function(list) {
					me.keyQuestions=[];
					for(var l in list) {
						if (list[l].value.lxmen===true) me.keyQuestions.push(list[l]);
					};
					if (me.kloeTitle===null) me.kloeTitle=me.keyQuestions[0];
            		callback();
					/*yoodoo.keyQuestion.getPromptsInKeyLines(function(list) {
						me.schema=list;
						for(var kqId in me.schema) {
							for(var kloe in me.schema[kqId]) {
								for(var p in me.schema[kqId][kloe].items) {
									var prompt=me.schema[kqId][kloe].items[p];
									me.promptsById[prompt.Id]=new me.prompt(prompt);
								}
							}
						}
            			callback();
					},true);*/
				});
            	/*me.objects.keyQuestions.get(
            		function(list){
            			for(var l in list) {
            				var title=list[l].displayName().toUpperCase().replace(/\W/g,'');
            				me.keyQuestions[title]=list[l];
            			}
            			callback();
            			
            		},
            		function(){},
            		0,
            		{}
            	);*/
            	/*
                if (dooit.options[me.objectoptions.businessSector].value>0) {
                    me.objects.businessSector.get(function(objs) {
                        if (objs.length>0) {
                            me.businessSector=objs.pop();
                           
                        }else{
                            me.failed('Business Sector not found');
                        }
                    },function() {
                        me.failed('Business Sector not found');
                    },0,{
                        recordIds:[dooit.options[me.objectoptions.businessSector].value]
                    });
                }else{
                    me.failed('Business Sector not defined');
                }
            */
           // callback();
           }
        },function() {
            me.failed('Failed to get objects');
        });
       
    },
    start : function() {
        var me=this;
        this.title='PIR';
        this.containers.h2 = $(yoodoo.e("h2")).html(this.title).append(this.pdfButton());
        this.buildNav();
        this.containers.mainContainer=$(yoodoo.e("div")).addClass('main').addClass("pirloading");
        this.update();

        this.containers.container.append(this.containers.navButtons).prepend(this.containers.mainContainer);
    },
    update: function(){
    	var kqId=this.kloeTitle.Id;
    	var me=this;
    	var callback=function() {
	       // me.containers.mainContainer.remove();
	       // me.containers.mainContainer=$(yoodoo.e("div")).addClass('main');
			me.containers.mainContainer.empty();
	        me.buildPirAnswers();
	        me.buildTransferButtons();
	        me.buildPirQuestions();
	       // me.containers.container.append(me.containers.mainContainer);
	         
			me.containers.mainContainer.removeClass("pirloading");
	        $(me.containers.pirQuestions.qTwoContent).css({'padding-top':$(me.containers.pirQuestions.questionTwo).outerHeight()});  
	        $(me.containers.pirQuestions.qOneContent).css({'padding-top':$(me.containers.pirQuestions.questionOne).outerHeight()});  
       };
		this.containers.mainContainer.addClass("pirloading");
		this.getPrompts(function() {
			if (me.responses[kqId]===undefined) {
				var filterR={};
				filterR[me.objects.responses.getParameterReferingToObjectId(yoodoo.keyQuestion.object.schema.Id)]=me.kloeTitle.Id;
				filterR[me.objects.responses.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id)]=yoodoo.businessSector.selectedBusinessSector;
				filterR.excludeReadOnly=true;
				me.objects.responses.get(function(list) {
					//console.log(list);
					me.responses[kqId]={};
					var responseToPrompt=me.objects.responses.getParameterReferingToObjectId(yoodoo.keyQuestion.promptsObject.schema.Id);
					for(var l in list) {
						var pid=list[l].value[responseToPrompt];
						if (me.promptsById[pid]!==undefined) me.promptsById[pid].addAnswer(list[l]);
					}
					/*var responseToPrompt=me.objects.responses.getParameterReferingToObjectId(me.objects.prompts.schema.Id);
					for(var l in list) {
						var pid=list[l].value[responseToPrompt];
						me.promptsById[pid].addAnswer(list[l]);
					}*/
					callback();
				},function(){},0,filterR);
			}else{
				callback();
			}
		});
        //this.containers.navButtons.remove();
        //this.start();
    },
    doSVG:(document.createElementNS!==undefined),
    icon:function() {
        if (this.doSVG) {
            if (typeof(arguments[0])=="object") arguments[0]=arguments[0].svg;
            return yoodoo.icons.drawSVG.apply(yoodoo.icons,arguments);
        }else{
            if (typeof(arguments[0])=="object") arguments[0]=arguments[0].img;
            var replacer={};
            if (typeof(arguments[arguments.length-1])=="object") replacer=arguments[arguments.length-1];
            var url=arguments[0];
            for(var k in replacer) url=url.replace(k,replacer[k]);
			var img=yoodoo.e("img");
            img.src=yoodoo.replaceDomain('domain:'+url);
            return img;
        }
    },
    buildNav : function(){
        var me=this;
        this.containers.navButtons=$(yoodoo.e("div")).addClass('navButtons').append(this.containers.h2);
        for(var k in this.keyQuestions) {
        	(function(kq) {
	        	var title=kq.displayName();
	        	if (me.kloeTitle===null) me.kloeTitle=kq;
	            var but=yoodoo.e("button");
	            if(me.keyQuestions[k]===me.kloeTitle) $(but).addClass('active');
	            $(but).attr("type","button").html(title).click(function() {
	                $('.navButtons button').each(function(){
	                    $(this).removeClass('active');
	                });
	                $(this).addClass('active');
	                me.kloeTitle=kq;
	                me.update();
	            });
	            me.containers.navButtons.append(but);
        	})(this.keyQuestions[k]);
        }
        /*for(var k in this.fieldName) {
            var but=yoodoo.e("button");
            but.key=k;
            if(this.fieldName[k].title==this.kloeTitle) $(but).addClass('active');
            $(but).attr("type","button").html(this.fieldName[k].title).click(function() {
                $('.navButtons button').each(function(){
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
                me.kloeTitle=me.fieldName[this.key].title;
                me.update();
            });
            this.containers.navButtons.append(but);
        }*/
    },
    buildPirAnswers : function(){
        var me=this;
        this.containers.pirAnswers=$(yoodoo.e("div")).addClass('pirAnswers');
        this.containers.pirAnswers.aScroll=$(yoodoo.e("div")).addClass('aScroll');
        this.containers.pirAnswers.answers=$(yoodoo.e("div")).addClass('answers');
        this.containers.pirAnswers.priorities=$(yoodoo.e("div")).addClass('priorities');
        this.containers.pirAnswers.moreresponses=$(yoodoo.e("div")).addClass('more');
        this.containers.pirAnswers.scrollButDown=$(yoodoo.e("button")).append(this.icon(this.icons.left.svg,16,16,100,100,{'4D4D4D':'4D4D4D'}));
        this.containers.pirAnswers.scrollButDown.attr("type","button").addClass('scrollButDown');
        this.containers.pirAnswers.scrollButUp=$(yoodoo.e("button")).append(this.icon(this.icons.left.svg,16,16,100,100,{'4D4D4D':'4D4D4D'}));
        this.containers.pirAnswers.scrollButUp.attr("type","button").addClass('scrollButUp');
        this.containers.pirAnswers.container=$(yoodoo.e("div")).addClass('aContainer');
        this.containers.pirAnswers.answersTitle=$(yoodoo.e("h3")).addClass('answersTitle').html('Suggested Answers');
        this.containers.pirAnswers.container.append(this.containers.pirAnswers.answersTitle);
        this.containers.pirAnswers.aScroll.append(this.containers.pirAnswers.scrollButUp);
        this.containers.pirAnswers.aScroll.append(this.containers.pirAnswers.answers.append(this.containers.pirAnswers.priorities).append(this.containers.pirAnswers.moreresponses));
        this.containers.pirAnswers.aScroll.append(this.containers.pirAnswers.scrollButDown);
        this.containers.pirAnswers.container.append(this.containers.pirAnswers.aScroll);

    	var key=this.kloeTitle.Id;
        var noAnswersText=$(yoodoo.e("p")).html(this.noAnswersText).css({padding:'20px'});
        var hasAnswer=false;
		var hasPriorities=false;
		var hasMore=false;
		for(var k in this.schema[key]) {
			for(var p in this.schema[key][k].items) {
				var pid=this.schema[key][k].items[p].Id;
				var prompt=this.promptsById[pid];
				if (prompt.answers.length>0) {
					var divItem=prompt.render(true);
					this.containers.pirAnswers.priorities.append(divItem);
					if (divItem!==null) hasPriorities=hasAnswer=true;
				}
			}
		}
		//console.log(key);
		for(var k in this.schema[key]) {
			for(var p in this.schema[key][k].items) {
				var pid=this.schema[key][k].items[p].Id;
				var prompt=this.promptsById[pid];
				if (prompt.answers.length>0) {
				//console.log(prompt);
					var divItem=prompt.render(false);
					this.containers.pirAnswers.moreresponses.append(divItem);
					if (divItem!==null) hasMore=hasAnswer=true;
				}
			}
		}
		if (hasPriorities && hasMore) {
			this.containers.pirAnswers.priorities.prepend($(yoodoo.e("h4")).html('Reserved:'));
			this.containers.pirAnswers.moreresponses.prepend($(yoodoo.e("h4")).html('Others:'));
		}
/*        for(var i in this.schemas[this.kloeTitle].sections){
            for(var j in this.schemas[this.kloeTitle].sections[i].obj.items){
                var item=this.schemas[this.kloeTitle].sections[i].obj.items[j];
                if(this.promptsById[item.id].answers.length>0){
                    var divItem=item.render();
                    if(divItem!==false) hasAnswer=true;
                }
                if(divItem!==undefined && hasAnswer) this.containers.pirAnswers.answers.append(divItem);
            }
        }*/
        if(!hasAnswer) this.containers.pirAnswers.answers.append(noAnswersText);
        this.containers.pirAnswers.scrollButUp.click(function(){
            $('.answers').animate({
                scrollTop:$('.answers').scrollTop()-130
            },600);
        });
        this.containers.pirAnswers.scrollButDown.click(function(){
            $('.answers').animate({
                scrollTop:$('.answers').scrollTop()+130
            },600);
        });
        this.containers.pirAnswers.answers.css('display','none');
        this.containers.pirAnswers.answers.fadeIn();
        this.containers.pirAnswers.append(this.containers.pirAnswers.container);
        this.containers.mainContainer.append(this.containers.pirAnswers);
    },
    updateAnswers: function(){
        this.q1Answers[this.kloeTitle]={
            question:$('.qOneContent .question').text(),
            answer:this.containers.pirQuestions.textareaQ1.value
        };
        this.q2Answers[this.kloeTitle]={
            question:$('.qTwoContent .question').text(),
            answer:this.containers.pirQuestions.textareaQ2.value
        };
        this.value=[this.q1Answers,this.q2Answers];
    },
    charCount: function(count,length,maxlength,charDiv){
        var totChar=length-count;
        var countText=length+'/'+count;
        charDiv.html(countText);
        if(length>=0 && length<2000)
            charDiv.css('color','#084d84');
        else if(length>=2000 && length<count)
            charDiv.css('color','rgb(0, 145, 0)');
        else if(length>count){
            charDiv.css('color','rgb(255, 0, 0)');
            charDiv.html(totChar+' too many');
        }

    },
    buildPirQuestions: function(){
        var me=this;
        this.countQ=2500;
        this.containers.pirQuestions=$(yoodoo.e("div")).addClass('pirQuestions');
        this.containers.pirQuestions.container=$(yoodoo.e("div")).addClass('qContainer');
        this.containers.pirQuestions.qOne=$(yoodoo.e("div")).addClass('qOne').css({transition:'height 1s'});
        
        var title=this.kloeTitle.Id;
        if(this.questions.length>0) this.questions=[];
        for (var i in this.kloeTitle.value){
        	if(typeof (this.kloeTitle.value[i]) == 'object'){
        		for(var j in this.kloeTitle.value[i]){
        			this.questions.push(this.kloeTitle.value[i][j]);
        		}
        	}
        }
        this.containers.pirQuestions.questionOne=$(yoodoo.e("h3")).addClass('question').html(this.questions[0]);
        this.containers.pirQuestions.questionTwo=$(yoodoo.e("h3")).addClass('question').html(this.questions[1]);
        this.containers.pirQuestions.qOneContent=$(yoodoo.e("div")).addClass('qOneContent');
        this.containers.pirQuestions.qTwo=$(yoodoo.e("div")).addClass('qTwo').css({transition:'height 1s'});
        this.containers.pirQuestions.qTwoContent=$(yoodoo.e("div")).addClass('qTwoContent').css({transition:'height 1s'});
        this.containers.pirQuestions.charCountQ1=$(yoodoo.e("div")).addClass('charCount').html(this.countQ);
        this.containers.pirQuestions.charCountQ2=$(yoodoo.e("div")).addClass('charCount').html(this.countQ);

        this.containers.pirQuestions.textareaQ1 = new yoodoo.ui.textarea({
            label : '',
            emptyText:'Insert your answer',
            maxlength:4000,
            //rows:5,
            emptyCombine:false,
            editableDiv:true,
            editableClass:'textarea1',
            //fixedHeightToRow:true,
            onchange : function() {
                this.value='<div>'+this.value+'</div>';
                $(this).html(this.value);
                me.charCount(me.countQ,$(this.value).text().length,this.settings.maxlength.value,me.containers.pirQuestions.charCountQ1);
                me.updateAnswers();
            },
            onfullscreenOut:function(){
               // $(me.containers.pirQuestions.charCountQ1).css({bottom:'-20px'});
            },
            onfullscreenIn:function(){
               // $(me.containers.pirQuestions.charCountQ1).css({bottom:'0px'});
            },
            onFocus:function(){
            	me.containers.pirQuestions.qOne.css({height:'70%'});
            	me.containers.pirQuestions.qTwo.css({height:'30%'});
            },
            onBlur:function(){
            	me.containers.pirQuestions.qOne.css({height:'50%'});
            	me.containers.pirQuestions.qTwo.css({height:'50%'});
            },
        });
        this.containers.pirQuestions.textareaQ2 = new yoodoo.ui.textarea({
            label : '',
            emptyText:'Insert your answer',
            maxlength:4000,
            //rows:5,
            emptyCombine:false,
            editableDiv:true,
            editableClass:'textarea2',
            //fixedHeightToRow:true,
            onchange : function() {
                this.value='<div>'+this.value+'</div>';
                $(this).html(this.value);
                me.charCount(me.countQ,$(this.value).text().length,this.settings.maxlength.value,me.containers.pirQuestions.charCountQ2);
                me.updateAnswers();
            },
            onfullscreenOut:function(){
                //$(me.containers.pirQuestions.charCountQ2).css({bottom:'-20px'});
            },
            onfullscreenIn:function(){
                //$(me.containers.pirQuestions.charCountQ2).css({bottom:'0px'});
            },
            onFocus:function(){
            	me.containers.pirQuestions.qTwo.css({height:'70%'});
            	me.containers.pirQuestions.qOne.css({height:'30%'});
            },
            onBlur:function(){
            	me.containers.pirQuestions.qOne.css({height:'50%'});
            	me.containers.pirQuestions.qTwo.css({height:'50%'});
            },
        });
        if(this.fields.pir!==undefined && this.fields.pir!==null && this.fields.pir!==''){
			if(this.fields.pir[0][this.kloeTitle]!==undefined && this.q1Answers[this.kloeTitle]===undefined) this.q1Answers[this.kloeTitle]=this.fields.pir[0][this.kloeTitle];
			if(this.fields.pir[1][this.kloeTitle]!==undefined && this.q2Answers[this.kloeTitle]===undefined) this.q2Answers[this.kloeTitle]=this.fields.pir[1][this.kloeTitle];
		}
		var v1 = /*this.containers.pirQuestions.textareaQ1.value=*/(this.q1Answers[this.kloeTitle]!==undefined)? this.q1Answers[this.kloeTitle].answer : '';
		this.charCount(this.countQ,$(/*this.containers.pirQuestions.textareaQ1.value*/v1).text().length,this.containers.pirQuestions.textareaQ1.settings.maxlength.value,this.containers.pirQuestions.charCountQ1);
		var v2 =/*this.containers.pirQuestions.textareaQ2.value=*/(this.q2Answers[this.kloeTitle]!==undefined)? this.q2Answers[this.kloeTitle].answer : '';
		this.charCount(this.countQ,$(/*this.containers.pirQuestions.textareaQ2.value*/v2).text().length,this.containers.pirQuestions.textareaQ2.settings.maxlength.value,this.containers.pirQuestions.charCountQ2);
		
		this.containers.pirQuestions.qOneContent.append(this.containers.pirQuestions.questionOne);
		this.containers.pirQuestions.qTwoContent.append(this.containers.pirQuestions.questionTwo);
		var textareaDiv1=this.containers.pirQuestions.textareaQ1.render(v1);
		var textareaDiv2=this.containers.pirQuestions.textareaQ2.render(v2);
		$(textareaDiv1).find('label').append(this.containers.pirQuestions.charCountQ1);
		$(textareaDiv2).find('label').append(this.containers.pirQuestions.charCountQ2);
		this.containers.pirQuestions.qOneContent.append(textareaDiv1);
		this.containers.pirQuestions.qTwoContent.append(textareaDiv2);
		this.containers.pirQuestions.qOne.append(this.containers.pirQuestions.qOneContent);
		this.containers.pirQuestions.qTwo.append(this.containers.pirQuestions.qTwoContent);
		this.containers.pirQuestions.container.append(this.containers.pirQuestions.qOne).append(this.containers.pirQuestions.qTwo);
		this.containers.pirQuestions.append(this.containers.pirQuestions.container);
		this.containers.mainContainer.append(this.containers.pirQuestions);
    },

    buildTransferButtons: function(){
        var me=this;
        var butQOne=$(yoodoo.e("button")).attr("type", "button").addClass('transfer').append(this.icon(this.icons.left.svg,20,20,100,100,{'4D4D4D':'4D4D4D'}));
        var butQTwo=$(yoodoo.e("button")).attr("type", "button").addClass('transfer').append(this.icon(this.icons.left.svg,20,20,100,100,{'4D4D4D':'4D4D4D'}));

        this.containers.transferButtons=$(yoodoo.e("div")).addClass('transferButtons');
        this.containers.transferButtons.addQOne=$(yoodoo.e("div")).addClass('addQOne');
        this.containers.transferButtons.addQTwo=$(yoodoo.e("div")).addClass('addQTwo');
        this.containers.transferButtons.addQOne.append(butQOne);
        this.containers.transferButtons.addQTwo.append(butQTwo);
        this.containers.transferButtons.append(this.containers.transferButtons.addQOne).append(this.containers.transferButtons.addQTwo);

        $(butQOne).attr("type","button").click(function() {
            var source=me;
            source.containers.pirQuestions.textareaQ1Text='';
            $('.selected').each(function(){
                var idAnswer='';
                source.containers.pirQuestions.textareaQ1Text+='<div><span '+idAnswer+'>'+$(this).text()+'</span></div>';
                $(this).removeClass('selected');
            });

            $('.textarea1').html($('.textarea1').html()+' '+me.containers.pirQuestions.textareaQ1Text);
            me.containers.pirQuestions.textareaQ1.value+=me.containers.pirQuestions.textareaQ1Text;
            me.charCount(me.countQ,$(me.containers.pirQuestions.textareaQ1.value).text().length,me.containers.pirQuestions.textareaQ1.settings.maxlength.value,me.containers.pirQuestions.charCountQ1);
            me.updateAnswers();
        }).hover(function(){
			if ($(me.containers.pirAnswers.answers).find(".selected").get().length>0)
				me.containers.mainContainer.addClass("transfer1");
            /*$(this).css('background-color','#fff6c4');
            me.containers.pirAnswers.container.css('background-color','#fff6c4');
            me.containers.pirQuestions.qOneContent.css('background-color','#fff6c4');*/
        },function(){
			me.containers.mainContainer.removeClass("transfer1");
            /*$(this).css('background-color','#ffffff');
            me.containers.pirAnswers.container.css('background-color','#ffffff');
            me.containers.pirQuestions.qOneContent.css('background-color','#ffffff');*/
        });
        $(butQTwo).attr("type","button").click(function() {
            var source=me;
            source.containers.pirQuestions.textareaQ2Text='';
            $('.selected').each(function(){
                var idAnswer='';
                source.containers.pirQuestions.textareaQ2Text+='<div><span '+idAnswer+'>'+$(this).text()+'</span></div>';
                $(this).removeClass('selected');
            });

            $('.textarea2').html($('.textarea2').html()+' '+me.containers.pirQuestions.textareaQ2Text);
            me.containers.pirQuestions.textareaQ2.value+=me.containers.pirQuestions.textareaQ2Text;
            me.charCount(me.countQ,$(me.containers.pirQuestions.textareaQ2.value).text().length,me.containers.pirQuestions.textareaQ2.settings.maxlength.value,me.containers.pirQuestions.charCountQ2);
            me.updateAnswers();
        }).hover(function(){
			if ($(me.containers.pirAnswers.answers).find(".selected").get().length>0)
				me.containers.mainContainer.addClass("transfer2");
            /*$(this).css('background-color','#fff6c4');
            me.containers.pirAnswers.container.css('background-color','#fff6c4');
            me.containers.pirQuestions.qTwoContent.css('background-color','#fff6c4');*/
        },function(){
			me.containers.mainContainer.removeClass("transfer2");
            /*$(this).css('background-color','#ffffff');
            me.containers.pirAnswers.container.css('background-color','#ffffff');
            me.containers.pirQuestions.qTwoContent.css('background-color','#ffffff');*/
        });

        this.containers.mainContainer.append(this.containers.transferButtons);
    },
    displayed:function() {
        // called when the dooit is fully revealed
        yoodoo.ui.update();
    },
    kloe_field_names:{
        'Safe':'kloe_1',
        'Effective':'kloe_2',
        'Caring':'kloe_3',
        'Responsive':'kloe_4',
        'Well-led':'kloe_5',
    },
    keyQuestion:function(obj) {
        this.obj=obj;
        this.sections=[];
        for(var s in this.obj.sections) this.sections.push(new pir.keyLineOfEnquiry(this.obj.sections[s],this));
    },
    keyLineOfEnquiry:function(obj,parent) {
        this.obj=obj;
        this.parent=parent;
        this.prompts=[];
        this.promptsById={};
        for(var s in this.obj.items) {
            var np=new pir.prompt(this.obj.items[s],this);
            this.prompts.push(np);
            this.promptsById[np.obj.id]=np;

            np.obj.render=function(){
                var answerDiv=$(yoodoo.e("div")).addClass('answer');
                var bKey=$(yoodoo.e("b")).append(this.title+' ');
                var qText=$(yoodoo.e("div")).addClass('qText').append(this.description);
                answerDiv.append(bKey).append(qText);
                var hasAnswers=false;
                var aCount=pir.promptsById[this.id].answers.length;
                var aTextDivTitle=$(yoodoo.e("h4")).html((pir.promptsById[this.id].answers.length>1)?'Answers':'Answer').css({margin:'0px 0px 0px 3px'});
                var aCountDiv=$(yoodoo.e("div")).css({
                    position:'absolute',
                    right:'10px',
                    top:'5px',
                    'font-weight':'bold'
                });

                var aDiv=$(yoodoo.e("div")).addClass('aDiv').append(aTextDivTitle);
                var aTextDiv=$(yoodoo.e("div")).css({display:'none'});
                $(aTextDivTitle).click(function() {
                    aTextDiv.slideToggle('slow');
                });
                for(var y in pir.promptsById[this.id].answers){
                    var answer=pir.promptsById[this.id].answers[y];
                    if(answer.obj.text!==''){
                        hasAnswers=true;
                        aTextDiv.append(answer.render());
                    }else if((answer.obj.text=='')){
                        aCount--;
                    }
                }
                aCountDiv.append(aCount);
                aDiv.append(aCountDiv).append(aTextDiv);
                answerDiv.append(aDiv);
                if(!hasAnswers) answerDiv=false;

                return answerDiv;
            };
        }

    },
    prompt:function(obj,parent) {
        var me=this;
        this.obj=obj;
        pir.promptsById[this.obj.id]=this;
        this.parent=parent;
        this.answers=[];
		this.priority=[];
        this.addAnswer=function(obj) {
			if (obj.value.drkdn===true) {
            	me.priority.push(new pir.answer(obj));
			}else{
            	me.answers.push(new pir.answer(obj));
			}
        };
		this.render=function(priority) {
			var list=(priority===true)?this.priority:this.answers;
			if (list.length==0) return null;
			var items=$(yoodoo.e("div")).addClass("responses").hide();
			var op=$(yoodoo.e("div")).addClass('response').append(
				$(yoodoo.e("div")).addClass("promptTitle").append(
					$(yoodoo.e("b")).html(this.obj.value.lvzfz)
				).append(
					$(yoodoo.e("div")).addClass("promptDescription").html(this.obj.value.zgsux.asccj)
				).click(function() {
                    items.slideToggle('slow');
                }).append($(yoodoo.e("span")).html(list.length))
			);
			op.append(items);
			for(var a in list) items.append(list[a].render());
			return op;
		};
		
    },
    promptsById:{},
    answer:function(obj) {
        this.obj=obj;
        this.render=function(){
            var aText=$(yoodoo.e("div")).addClass('aText').append(this.obj.displayName());
            if(aText.text()!==''){
                aText.click(function(){
                    $(this).toggleClass('selected');
                }).mousedown(function(e){
                    e.preventDefault();
                });
            }
            return aText;
        };

    },
	pdfFields:{
		q1:{
			Safe:"_1a_ How do you ensure the ser_HUBUNZ*0MP20llAbPCpDqw",
			Effective:"_2a_ What do you do to ensure _3n74K3xYNkR0HgHgHF8Xhg",
			Caring:"_3a_ What do you do to ensure _F1jpKp0DX-mM6u1SJQVBxA",
			Responsive:"_4a_ What do you do to ensure _OpvbSzHie1kI6xYX-fPKyQ",
			'Well-led':"_5a_ What do you do to ensure _DJFMA9ztPSIJre5*qs*5rQ"
		},
		q2:{
			Safe:"_1b_ What improvements do you _kVWhD1mp*HM8eNOp7kCw3g",
			Effective:"_2b_ What improvements do you _wmnX3PRF6TPHkyyUMyCZsQ",
			Caring:"_3b_ What improvements do you _aUgw4fQ*wxHq1Trf*EM58g",
			Responsive:"_4b_ What improvements do you _NOECnnfqYprRfAB--3Oy7Q",
			'Well-led':"_5b_ What improvements do you _o94gG9biXBY7UkDmzToJJw"
		},
		location:"_00_A_02_GYKSlT3G*SYDqvKVDG1kPw",
		name:"Your name:",
		email:"Your Email address_U0Tyaur4xahh6-0zzK5WEw"
	},
	getFormFields : function() {
		var params={
			cmd:'pdf_form_fields',
			pdffilename:'/uploads/sitegeneric/file/pdf/compliance/pir_editable.pdf',
			context:this,
			callback:'pir.gotPDFFields'
		};
		yoodoo.sendPost(null,params);
	},
	gotPDFFields : function(reply) {
		console.log(reply);
	},
	buildPDF:function() {
		var fields={};
		fields[this.pdfFields.location]=dooit.decode(yoodoo.replaceMeta('__yourService|'+yoodoo.user.managerType.name+'__'));
		fields[this.pdfFields.name]=yoodoo.user.getName();
		fields[this.pdfFields.email]=yoodoo.user.emailaddress;
		for(var kq in this.q1Answers) {
			if (typeof(this.q1Answers[kq].answer)=="string" && this.q1Answers[kq].answer!="" && this.pdfFields.q1[kq]!==undefined) fields[this.pdfFields.q1[kq]]=this.q1Answers[kq].answer.replace(/\<[^\>]+\>/g,'');
			if (typeof(this.q2Answers[kq].answer)=="string" && this.q2Answers[kq].answer!="" && this.pdfFields.q2[kq]!==undefined) fields[this.pdfFields.q2[kq]]=this.q2Answers[kq].answer.replace(/\<[^\>]+\>/g,'');
		}
		yoodoo.toPDFForm('/uploads/sitegeneric/file/pdf/compliance/pir_editable.pdf',fields);
	},
	pdfButton:function() {
		var me=this;
		var but=$(yoodoo.e("button")).attr("type","button").addClass("getpdf").click(function() {
			yoodoo.alert('Building your PIR report',[],4);
			me.buildPDF();
		});
		return but;
	},
    loadFields : function() {
        /*		this.schemas={};
         for(var k in array_of_global_fields) {
         var newKloe=new pir.keyQuestion($.parseJSON(Base64.decode(array_of_fields[array_of_global_fields[k]][1])));
         this.schemas[newKloe.obj.title]=newKloe;
         }*//*

         if (this.configkey !== null) {
         try {
         eval('this.schema=' + Base64.decode(array_of_fields[this.configkey][1]) + ';');
         } catch(e) {
         this.schema = Base64.decode(array_of_fields[this.configkey][1]);
         }
         this.schema = dooit.decode(this.schema);
         }*/
		if (array_of_default_fields.length==1) this.key=array_of_default_fields[0];
         if (this.key !== null) {
			 try {
			 eval('this.value=' + array_of_fields[this.key][1] + ';');
			 } catch(e) {
			 this.value = array_of_fields[this.key][1];
			 }
         }
         this.value = dooit.decode(this.value);
         /*for (var k in array_of_fields) {
         if (k != this.key && k != this.summarykey) {
			 try {
			 eval('this.fields["' + k + '"]=' + array_of_fields[k][1] + ';');
			 } catch(e) {
			 this.fields[k] = array_of_fields[k][1];
			 }
         }
         }
         this.value = dooit.decode(this.value);
         this.fields = dooit.decode(this.fields);
         for(var i in this.kloe_field_names){
         for(x in this.fields[this.kloe_field_names[i]]){
         if(x!=='title' && x!=='structure'){
         for(k in this.fields[this.kloe_field_names[i]][x]){
         if(this.promptsById[x]!==undefined)
         this.promptsById[x].addAnswer(this.fields[this.kloe_field_names[i]][x][k]);
         }
         }
         }
         }*/
    },
	failed:function(msg) {
        console.log(msg);
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
    finishable:function() {
        var ok=true;
        return ok;
    },
    output : function() {
        var op = (dooit.json(this.value));
        array_of_fields[this.key][1] = op;
        var reply = {};
        eval('reply.EF' + array_of_fields['PIR'][0] + '=op;');

        return reply;
    }

};
