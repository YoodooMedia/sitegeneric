
function buildSliders(ips,opts) {
	var op={minText:"bad",maxText:"good"};
	if(opts.minText) op.minText=opts.minText;
	if(opts.maxText) op.maxText=opts.maxText;
	if (typeof(ips)=="string") ips=$(ips).get();
	for(var i=0;i<ips.length;i++) {
		var slider=document.createElement("div");
		$(slider).addClass("slider");
		slider.dimensions=op.slideWidth;
		ips[i].parentNode.insertBefore(slider,ips[i]);
		slider.input=ips[i];
		slider.value=ips[i].value-1;
		slider.minText=document.createElement("div");
		$(slider.minText).addClass("minText");
		slider.minText.innerHTML=op.minText;
		slider.appendChild(slider.minText);
		slider.maxText=document.createElement("div");
		$(slider.maxText).addClass("maxText");
		slider.maxText.innerHTML=op.maxText;
		slider.appendChild(slider.maxText);
		slider.progress=document.createElement("div");
		$(slider.progress).addClass("value");
		$(slider.progress).css("width",(slider.value*30)+"px");
		slider.appendChild(slider.progress);
		slider.minLeft=$(slider.progress).position().left;
		slider.maxLeft=slider.minLeft+300;
		slider.slide=document.createElement("div");
		$(slider.slide).addClass("slide");
		slider.appendChild(slider.slide);
		slider.position=$(slider).position();
		/*slider.responder=document.createElement("div");
		$(slider.responder).addClass('responder');
		slider.appendChild(slider.responder);
		slider.responder.slider=slider;*/
		slider.setSlider=function() {
			$(this.progress).animate({width:((this.value+1)*30)});
		};
		/*$(slider.responder).bind('mouseover',function(e) {
			this.slider.position=$(this.slider).offset();
			$(this.slider.slide).fadeIn('fast');
			e.preventDefault();
			var l=e.pageX;
			l-=9;
			l-=$(this.slider).offset().left;
			var v=Math.floor(l/30);
			if (v>9) v=9;
			if (v<0) v=0;
			var n=v;
			v=v*30;
			var dl=v-l+15;
			v-=(dl/2);
			v+=6;
			$(this.slider.slide).css('left',v+"px");
		});*/
		/*$(slider).bind('mousemove',function(e) {
			var l=e.pageX;
			l-=9;
			l-=$(this).offset().left;
			var v=Math.floor(l/30);
			if (v>9) v=9;
			if (v<0) v=0;
			var n=v;
			v=v*30;
			var dl=v-l+15;
			v-=(dl/2);
			v+=6;
			$(this.slide).css('left',v+"px");
			
		});*/
		$(slider.input).css('display','none');
		/*$(slider.responder).bind('mouseout',function() {
			$(this.slider.slide).fadeOut('fast');
		});*/
		$(slider).bind("mouseup",function(e) {
			var l=e.pageX;
			l-=9;
			l-=$(this).offset().left;
			var v=Math.floor(l/30);
			if (v>9) v=9;
			if (v<0) v=0;
			var n=v;
			this.value=n;
			this.setSlider();
			this.input.value=n+1;
			if (typeof(yoodoo)!="undefined" && typeof(yoodoo.scrollTo)!="undefined") {
				yoodoo.scrollTo(this.parentNode.parentNode);
			}
		});
		slider.setSlider();
		for(var b=0;b<10;b++) {
			var box=document.createElement("div");
			$(box).addClass("boxes");
			slider.slide.appendChild(box);
			$(box).html("<div class='box'></div>");
		}
	}
}