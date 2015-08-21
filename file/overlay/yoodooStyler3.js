var yoodooStyler = {
    styleBuffer: {},
    created: [],
    shadow: function (obj, colour, x, y, distance) {
        var createStylesheet = true;
        if (arguments.length > 5) createStylesheet = arguments[5];
        var toBuffer = true;
        if (arguments.length > 6) toBuffer = arguments[6];
        var styles = {};
        styles.o = {
            '-o-box-shadow': x + 'px ' + y + 'px ' + distance + 'px ' + this.rgbToHex(colour)
        };
        styles.moz = {
            '-moz-box-shadow': x + 'px ' + y + 'px ' + distance + 'px ' + this.rgbToHex(colour)
        };
        styles.khtml = {
            '-khtml-box-shadow': x + 'px ' + y + 'px ' + distance + 'px ' + this.rgbToHex(colour)
        };
        styles.webkit = {
            '-webkit-box-shadow': x + 'px ' + y + 'px ' + distance + 'px ' + this.rgbToHex(colour)
        };
        styles.standard = {
            'box-shadow': x + 'px ' + y + 'px ' + distance + 'px ' + this.rgbToHex(colour)
        };
        var definitions = [];
        for (var s in styles) {
            for (var ss in styles[s]) {
                if (createStylesheet && typeof (obj) == "string") {
                    definitions.push(ss + ':' + styles[s][ss] + ';');
                } else {
                    $(obj).css(ss, styles[s][ss]);
                }
            }
        }
        if (toBuffer && typeof (obj) == "string") {
            var defs = {};
            defs[obj] = definitions.join('');
            this.addToBuffer(defs);
        } else if (createStylesheet && typeof (obj) == "string") {
            var ins = obj + '{' + definitions.join('') + '}';
            var so = document.createElement("style");
            so.type = 'text/css';
            so.innerHTML = ins;
            document.getElementsByTagName('head')[0].appendChild(so);
        }
        return styles;
    },
    gradient: function (obj, colour, lighten, brighten, horizontal, reversed, createStylesheet) {
        var toBuffer = true;
        if (arguments.length > 7) toBuffer = arguments[7];
        var fromColour = {
            r: colour.r,
            g: colour.g,
            b: colour.b
        };
        fromColour = this.tint(fromColour, lighten, brighten);
        if (colour.adjust != undefined) {
            if (colour.adjust.lightness != undefined && colour.adjust.brightness != undefined) fromColour = this.tint(fromColour, colour.adjust.lightness, colour.adjust.brightness);
        }
        var toColour = this.tint({
            r: fromColour.r,
            g: fromColour.g,
            b: fromColour.b
        }, colour.tint.lightness, colour.tint.brightness);
        //toColour=this.tint(toColour,lighten,brighten);
        var colours = {};
        if (reversed) {
            colours = {
                from: this.rgbToHex(toColour),
                to: this.rgbToHex(fromColour)
            };
        } else {
            colours = {
                from: this.rgbToHex(fromColour),
                to: this.rgbToHex(toColour)
            };
        }
        var styles = {};
        styles.old = {
            background: colours.from
        };
        styles.ff = {
            background: '-moz-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours.from + ' 0%, ' + colours.to + ' 100%)'
        };
        styles.chromeOld = {
            background: '-webkit-gradient(linear, ' + (horizontal ? 'left top, right top,' : 'left top, left bottom,') + ' color-stop(0%,' + colours.from + '), color-stop(100%,' + colours.to + '))'
        };
        styles.chrome = {
            background: '-webkit-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours.from + ', 0%, ' + colours.to + ',100%)'
        };
        styles.opera = {
            background: '-o-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours.from + ' 0%, ' + colours.to + '100%)'
        };
        styles.ms = {
            background: '-ms-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours.from + ' 0%, ' + colours.to + ' 100%)'
        };
        styles.w3c = {
            background: 'linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours.from + ' 0%, ' + colours.to + ' 100%)'
        };
        styles.ie = {
            filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + colours.from + "', endColorstr='" + colours.to + "',GradientType=" + (horizontal ? '1' : '0') + " )"
        };
        var definitions = [];
        for (var s in styles) {
            for (var ss in styles[s]) {
                if (createStylesheet && typeof (obj) == "string") {
                    definitions.push(ss + ':' + styles[s][ss] + ';');
                } else {
                    $(obj).css(ss, styles[s][ss]);
                }
            }
        }
        if (toBuffer && typeof (obj) == "string") {
            var defs = {};
            defs[obj] = definitions.join('');
            this.addToBuffer(defs);
        } else if (createStylesheet && typeof (obj) == "string") {
            var ins = obj + '{' + definitions.join('') + '}';
            var so = document.createElement("style");
            so.type = 'text/css';
            so.innerHTML = ins;
            document.getElementsByTagName('head')[0].appendChild(so);
        }
        return styles;
    },
    gradientGloss: function (obj, colour, lighten, brighten, horizontal, reversed, asCSS) {
        var toBuffer = true;
        if (arguments.length > 7) toBuffer = arguments[7];
        var l = [0.5, 0.4, 0.2, 0.1];
        var b = [0, 0, 0, 0];
        if (colour.tint != undefined) {
            if (colour.tint.l != undefined) l = colour.tint.l;
            if (colour.tint.b != undefined) b = colour.tint.b;
        }
        if (colour.adjust != undefined) {
            if (colour.adjust.lightness != undefined && colour.adjust.brightness != undefined) colour = this.tint(colour, colour.adjust.lightness, colour.adjust.brightness);
        }
        colour = this.tint(colour, lighten, brighten);
        var colours = [
            this.rgbToHex(this.tint(colour, l[0], b[0])),
            this.rgbToHex(this.tint(colour, l[1], b[1])),
            this.rgbToHex(this.tint(colour, l[2], b[2])),
            this.rgbToHex(this.tint(colour, l[3], b[3]))
        ];
        var styles = {};
        styles.old = {
            background: colours[2]
        };
        styles.ff = {
            background: '-moz-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours[0] + ' 0%, ' + colours[1] + ' 50%, ' + colours[2] + ' 51%, ' + colours[3] + ' 100%)'
        };
        styles.chromeOld = {
            background: '-webkit-gradient(linear, ' + (horizontal ? 'left top, right top,' : 'left top, left bottom,') + ' color-stop(0%,' + colours[0] + '), color-stop(50%,' + colours[1] + '), color-stop(51%,' + colours[2] + '), color-stop(100%,' + colours[3] + '))'
        };
        styles.chrome = {
            background: '-webkit-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours[0] + ', 0%, ' + colours[1] + ',50%, ' + colours[2] + ',51%, ' + colours[3] + ',100%)'
        };
        styles.opera = {
            background: '-o-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours[0] + ' 0%, ' + colours[1] + ' 50%, ' + colours[2] + ' 51%, ' + colours[3] + ' 100%)'
        };
        styles.ms = {
            background: '-ms-linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours[0] + ' 0%, ' + colours[1] + ' 50%, ' + colours[2] + ' 51%, ' + colours[3] + ' 100%)'
        };
        styles.w3c = {
            background: 'linear-gradient(' + (horizontal ? 'left' : 'top') + ', ' + colours[0] + ' 0%, ' + colours[1] + ' 50%, ' + colours[2] + ' 51%, ' + colours[3] + ' 100%)'
        };
        styles.ie = {
            filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + colours[0] + "', endColorstr='" + colours[3] + "',GradientType=" + (horizontal ? '1' : '0') + " )"
        };

        var definitions = [];
        for (var s in styles) {
            for (var ss in styles[s]) {
                if (asCSS && typeof (obj) == "string") {
                    definitions.push(ss + ':' + styles[s][ss] + ';');
                } else {
                    $(obj).css(ss, styles[s][ss]);
                }
            }
        }
        if (toBuffer && typeof (obj) == "string") {
            var defs = {};
            defs[obj] = definitions.join('');
            this.addToBuffer(defs);
        } else if (asCSS && typeof (obj) == "string") {
            var ins = obj + '{' + definitions.join('') + '}';
            var so = document.createElement("style");
            so.type = 'text/css';
            so.innerHTML = ins;
            document.getElementsByTagName('head')[0].appendChild(so);
        }
        return styles;
    },
    borderRadius: function (obj, r) {
        var createStylesheet = true;
        if (arguments.length > 2) createStylesheet = arguments[2];
        var toBuffer = true;
        if (arguments.length > 3) toBuffer = arguments[3];
        var styles = {};
        var rads = '';
        if (typeof (r) == "number") {
            rads = r + "px";
        } else {
            rads = r.join("px ") + "px";
        }
        styles.o = {
            '-o-border-radius': rads
        };
        styles.moz = {
            '-moz-border-radius': rads
        };
        styles.khtml = {
            '-khtml-border-radius': rads
        };
        styles.webkit = {
            '-webkit-border-radius': rads
        };
        styles.standard = {
            'border-radius': rads
        };
        var definitions = [];
        for (var s in styles) {
            for (var ss in styles[s]) {
                if (createStylesheet && typeof (obj) == "string") {
                    definitions.push(ss + ':' + styles[s][ss] + ';');
                } else {
                    $(obj).css(ss, styles[s][ss]);
                }
            }
        }
        if (toBuffer && typeof (obj) == "string") {
            var defs = {};
            defs[obj] = definitions.join('');
            this.addToBuffer(defs);
        } else if (createStylesheet && typeof (obj) == "string") {
            var ins = obj + '{' + definitions.join('') + '}';
            var so = document.createElement("style");
            so.type = 'text/css';
            so.innerHTML = ins;
            document.getElementsByTagName('head')[0].appendChild(so);
        }
        return styles;
    },
    addToBuffer: function (definitions) {
        for (var k in definitions) {
            var ins = '';
            if (typeof (definitions[k]) == "string") {
                ins += definitions[k];
            } else {
                for (var kk in definitions[k]) {
                    ins += kk + ':' + definitions[k][kk] + ';';
                }
            }
            if (this.styleBuffer[k] == undefined) {
                this.styleBuffer[k] = ins;
            } else {
                this.styleBuffer[k] += ins;
            }
        }

    },
    purgeBuffer: function () {
        var l = 0;
        for (var i in this.styleBuffer) l++;
        if (l > 0) {
            this.createStyleSheet(this.styleBuffer);
            this.styleBuffer = {};
        }
    },
    createStyleSheet: function (definitions) {
        var ins = '';
        for (var k in definitions) {
            ins += k + '{';
            if (typeof (definitions[k]) == "string") {
                ins += definitions[k];
            } else {
                for (var kk in definitions[k]) {
                    ins += kk + ':' + definitions[k][kk] + ';';
                }
            }
            ins += "}\n";
        }

        var so = document.createElement("style");
        this.created.push(so);
        so.type = 'text/css';
        if (so.styleSheet !== undefined && so.styleSheet.cssText !== undefined) {
            so.styleSheet.cssText = ins;
        } else {
            so.innerHTML = ins;
        }
        document.getElementsByTagName('head')[0].appendChild(so);

    },
    removeAll: function () {
        for (var s = 0; s < this.created.length; s++) {
            $(this.created[s]).remove();
        }
    },
    fromTo:function (from,to,proportion) {
    	var c={
    		r:Math.round(from.r+((to.r-from.r)*proportion)),
    		g:Math.round(from.g+((to.g-from.g)*proportion)),
    		b:Math.round(from.b+((to.b-from.b)*proportion))
    	};
    	if (c.r<0) c.r=0;
    	if (c.g<0) c.g=0;
    	if (c.b<0) c.b=0;
    	if (c.r>255) c.r=255;
    	if (c.g>255) c.g=255;
    	if (c.b>255) c.b=255;
    	return c;
    },
    invert:function (col) {
    	var c={
    		r:255-col.r,
    		g:255-col.g,
    		b:255-col.b
    	};
    	return c;
    },
    tint: function (colour, lighten, brighten) {
        var toColour = {
            r: colour.r,
            g: colour.g,
            b: colour.b
        };
        if (lighten > 0) {
            toColour = {
                r: toColour.r + (lighten * (255 - toColour.r)),
                g: toColour.g + (lighten * (255 - toColour.g)),
                b: toColour.b + (lighten * (255 - toColour.b))
            };
        } else if (lighten < 0) {
            toColour = {
                r: toColour.r - (-lighten * (toColour.r)),
                g: toColour.g - (-lighten * (toColour.g)),
                b: toColour.b - (-lighten * (toColour.b))
            };
        }
        if (brighten != 0) {
            toColour = {
                r: toColour.r + (brighten * toColour.r),
                g: toColour.g + (brighten * toColour.g),
                b: toColour.b + (brighten * toColour.b)
            };
        }
        toColour.r = Math.round(toColour.r);
        toColour.g = Math.round(toColour.g);
        toColour.b = Math.round(toColour.b);
        toColour.r = (toColour.r > 255) ? 255 : (toColour.r < 0) ? 0 : toColour.r;
        toColour.g = (toColour.g > 255) ? 255 : (toColour.g < 0) ? 0 : toColour.g;
        toColour.b = (toColour.b > 255) ? 255 : (toColour.b < 0) ? 0 : toColour.b;
        return toColour;
    },
    rgbToCSS: function (col) {
        var rgb = {
            r: '00',
            g: '00',
            b: '00'
        };
        if (col.a !== undefined) {
            rgb.r = col.r;
            rgb.g = col.g;
            rgb.b = col.b;
            rgb.a = col.a;
            return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
        } else {
            rgb.r = col.r.toString(16);
            rgb.g = col.g.toString(16);
            rgb.b = col.b.toString(16);
            while (rgb.r.length < 2) rgb.r = '0' + rgb.r;
            while (rgb.g.length < 2) rgb.g = '0' + rgb.g;
            while (rgb.b.length < 2) rgb.b = '0' + rgb.b;
            return '#' + rgb.r + rgb.g + rgb.b;
        }
    },
    rgbToHex: function (col) {
        var rgb = {
            r: '00',
            g: '00',
            b: '00'
        };
        rgb.r = col.r.toString(16);
        rgb.g = col.g.toString(16);
        rgb.b = col.b.toString(16);
        while (rgb.r.length < 2) rgb.r = '0' + rgb.r;
        while (rgb.g.length < 2) rgb.g = '0' + rgb.g;
        while (rgb.b.length < 2) rgb.b = '0' + rgb.b;
        return '#' + rgb.r + rgb.g + rgb.b;
    },
    hexToRGB: function (col) {
        col = col.replace('#', '');
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        if (col.length == 6) {
            rgb.r = parseInt(col.substring(0, 2), 16);
            rgb.g = parseInt(col.substring(2, 4), 16);
            rgb.b = parseInt(col.substring(4, 6), 16);
        }
        return rgb;
    },
    rgbToHSV: function (col) {
        var maxV = (col.r > col.g) ? col.r : col.g;
        maxV = (maxV > col.b) ? maxV : col.b;
        var minV = (col.r > col.g) ? col.g : col.r;
        minV = (minV > col.b) ? col.b : minV;
        var delta = maxV - minV;
        var hsv = {
            h: 0,
            s: Math.round(100 * delta / maxV),
            v: Math.round(100 * (maxV / 255))
        };
        if (delta == 0) {
            hsv.h = 0;
        } else if (col.r >= maxV) {
            hsv.h = (col.g - col.b) / delta;
        } else if (col.g >= maxV) {
            hsv.h = 2 + (col.b - col.r) / delta;
        } else {
            hsv.h = 4 + (col.r - col.g) / delta;
        }
        hsv.h *= 60;
        if (hsv.h < 0) hsv.h += 360;
        hsv.h = Math.round(hsv.h);
        return hsv;
    },
    hsvToRGB: function (hsv) {
        var rgb = {
            r: 0,
            g: 0,
            b: 0
        };
        var sect = Math.floor(hsv.h / 60);
        var rem = 255 * (hsv.h % 60) / 60;
        if (rem > 255) rem = 255;
        if (rem < 0) rem = 0;
        if (sect < 0) sect = 0;
        if (sect > 5) sect = 5;
        switch (sect) {
        case 0:
            rgb = {
                r: 255,
                g: rem,
                b: 0
            };
            break;
        case 1:
            rgb = {
                r: 255 - rem,
                g: 255,
                b: 0
            };
            break;
        case 2:
            rgb = {
                r: 0,
                g: 255,
                b: rem
            };
            break;
        case 3:
            rgb = {
                r: 0,
                g: 255 - rem,
                b: 255
            };
            break;
        case 4:
            rgb = {
                r: rem,
                g: 0,
                b: 255
            };
            break;
        case 5:
            rgb = {
                r: 255,
                g: 0,
                b: 255 - rem
            };
            break;
        }
        rgb.r *= hsv.v / 100;
        rgb.g *= hsv.v / 100;
        rgb.b *= hsv.v / 100;
        var maxV = hsv.v * 255 / 100;
        var delta = maxV * hsv.s / 100;
        var minV = maxV - delta;
        rgb.r = (delta * rgb.r / maxV) + minV;
        rgb.g = (delta * rgb.g / maxV) + minV;
        rgb.b = (delta * rgb.b / maxV) + minV;
        rgb.r = Math.round(rgb.r);
        rgb.g = Math.round(rgb.g);
        rgb.b = Math.round(rgb.b);
        rgb.r = (rgb.r > 255) ? 255 : (rgb.r < 0) ? 0 : rgb.r;
        rgb.g = (rgb.g > 255) ? 255 : (rgb.g < 0) ? 0 : rgb.g;
        rgb.b = (rgb.b > 255) ? 255 : (rgb.b < 0) ? 0 : rgb.b;
        return rgb;
    },
    isDark: function (col) {
        return ((col.r + col.g + col.b) / 3) < 100;
    },
    build_styles: function () {
    	if (this.built===true) return false;
    	this.built=true;
        if (yoodoo.styles.dooittext === undefined) yoodoo.styles.dooittext = {
            r: 50,
            g: 50,
            b: 50
        };
        var newcss = {};
        if (yoodoo.isApp) {
            newcss['.overlayFooter'] = {
                position: 'fixed',
                left: 0,
                right: 0,
                width: "100%"
            };
        }


        if (yoodoo.styles.icons.light) $(yoodoo.frame).addClass(yoodoo.class_prefix + "_light");
        if (yoodoo.styles.icons.dark) $(yoodoo.frame).addClass(yoodoo.class_prefix + "_dark");
        if (yoodoo.styles.backgroundImage !== undefined && yoodoo.styles.backgroundImage !== null && yoodoo.styles.backgroundImage != "") {
            //newcss['.'+yoodoo.class_prefix+'_bookcase_container, #yoodooContainerContent, #yoodooWidgetPortrait']={'background-image':'url('+yoodoo.styles.backgroundImage+')','background-size':'cover'};
            var bgStyle={'background-image': 'url(' + yoodoo.styles.backgroundImage + ') !important'};
            if (!(BrowserDetect.browser=='Explorer' && BrowserDetect.version==8)) bgStyle['background-size']='cover';
            newcss['.yoodooBackground'] = bgStyle;
        } else {
            //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_bookcase_container, #yoodooContainerContent, #yoodooWidgetPortrait',yoodoo.styles.base,0,0,false,false);
            //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('#yoodooWidget, #yoodooContainerContent',yoodoo.styles.base,0,0,false,false);
            //if (yoodoo.isApp) {
            //	yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('#yoodooWidget, #yoodooContainerContent',yoodoo.styles.base,0,0,false,false,true);
            //}else{
            yoodooStyler[yoodoo.styles.base.gloss ? 'gradientGloss' : 'gradient']('.yoodooBackground', yoodoo.styles.base, 0, 0, false, false, true);
            //}
        }
        newcss['.' + yoodoo.class_prefix + '_overlay, #yoodooWidget .welcome .tabs button.on'] = {
            'background-color': yoodooStyler.rgbToCSS(yoodoo.styles.overlay.background)
        };
        newcss['#yoodooWaitX'] = {
            //'background-color': yoodooStyler.rgbToCSS(yoodoo.styles.base)
        };
        //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('#yoodooWait',yoodoo.styles.base,0,0,false,true);
        if (!yoodoo.isApp) yoodooStyler.borderRadius('#yoodooContainerContent, #yoodooWidget, #yoodooWhiteout, #yoodooWaitX, .' + yoodoo.class_prefix + '_episode_container, .' + yoodoo.class_prefix + '_bookcase_container, .' + yoodoo.class_prefix + '_keypointDisplay', yoodoo.styles.boundary.radius);

        if (typeof (yoodooPlaya) != 'undefined') {
            yoodooStyler.borderRadius('#yoodooWidget #yoodooContainerContent #framed', yoodoo.styles.boundary.radius - 4);
        }
        yoodooStyler.borderRadius('#yoodooWidget .' + yoodoo.class_prefix + '_bookcase_viewport', yoodoo.styles.boundary.radius - 4);
        yoodooStyler.borderRadius('#yoodooWidget .overlayFooter', [0, 0, yoodoo.styles.boundary.radius - 4, yoodoo.styles.boundary.radius - 4]);
        yoodooStyler.borderRadius('#yoodooWidget .overlayFooter button.done', [0, 0, yoodoo.styles.boundary.radius - 4, 0]);
        yoodooStyler.borderRadius('#yoodooWidget .overlayFooter button.hide', [0, 0, 0, yoodoo.styles.boundary.radius - 4]);

        yoodooStyler[yoodoo.styles.base.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypointDisplay', yoodoo.styles.base, 0, 0, false, false, true);
        yoodooStyler[yoodoo.styles.keypoint.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypointDisplay>div', yoodoo.styles.keypoint.background, 0, 0, false, false, true);
        //newcss['.'+yoodoo.class_prefix+'_keypointDisplay']={color:yoodooStyler.rgbToHex(yoodoo.styles.keypoint.text)};
        newcss['#yoodooWidget .' + yoodoo.class_prefix + '_keypointDisplay p'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.keypoint.text)
        };


        //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_episode_container',yoodoo.styles.base,0,0,false,false,true);
        //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('#yoodooContainerContent',yoodoo.styles.base,0,0,false,false,true);

        if (!yoodoo.is_touch) {
            if (yoodoo.styles.button.colourHover.gloss === false && yoodoo.styles.button.colourHover.tint.lightness == 0 && yoodoo.styles.button.colourHover.tint.brightness == 0) {
                newcss['#yoodooWidget .login button:hover,#yoodooWidget .welcome center button:hover,#yoodooWidget .welcome button.logout:hover,#yoodooWidget button.green:hover,#yoodooWidget button.red:hover,#yoodooWidget a.green:hover,#yoodooWidget a.red:hover,#yoodooWidget button.medium:hover,#yoodooContainerContent a.medium:hover'] = {
                    background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourHover)
                };
            } else {
                yoodooStyler[yoodoo.styles.button.colourHover.gloss ? 'gradientGloss' : 'gradient']('#yoodooWidget .login button:hover,#yoodooWidget .welcome center button:hover,#yoodooWidget .welcome button.logout:hover,#yoodooWidget button.green:hover,#yoodooWidget button.red:hover,#yoodooWidget a.green:hover,#yoodooWidget a.red:hover,#yoodooWidget button.medium:hover,#yoodooContainerContent a.medium:hover', yoodoo.styles.button.colourHover, 0, 0, false, false, true);
            }
        }
        //if (!yoodoo.is_touch) yoodooStyler[yoodoo.styles.button.colourHover.gloss?'gradientGloss':'gradient']('#yoodooWidget .login button:hover,#yoodooWidget .welcome center button:hover,#yoodooWidget .welcome button.logout:hover,#yoodooWidget button.green:hover,#yoodooWidget button.red:hover,#yoodooWidget a.green:hover,#yoodooWidget a.red:hover,#yoodooWidget button.medium:hover,#yoodooContainerContent a.medium:hover',yoodoo.styles.button.colourHover,0,0,false,false,true);
        //if (!yoodoo.is_touch) newcss['#yoodooWidget .login button:hover,#yoodooWidget .welcome center button:hover,#yoodooWidget .welcome button.logout:hover,#yoodooWidget button.green:hover,#yoodooWidget button.red:hover,#yoodooWidget a.green:hover,#yoodooWidget a.red:hover,#yoodooWidget button.medium:hover,#yoodooContainerContent a.medium:hover']={background:yoodooStyler.rgbToHex(yoodoo.styles.button.colourHover)};

        if (yoodoo.styles.button.colour.gloss === false && yoodoo.styles.button.colour.tint.lightness == 0 && yoodoo.styles.button.colour.tint.brightness == 0) {
            newcss['#yoodooWidget .login button,#yoodooWidget .welcome center button,#yoodooWidget .welcome button.logout,#yoodooWidget button.green,#yoodooWidget button.red,#yoodooWidget a.green,#yoodooWidget a.red,#yoodooWidget button.medium,#yoodooContainerContent a.medium,#yoodooWidget .chapterItem .quizThumb'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colour)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colour.gloss ? 'gradientGloss' : 'gradient']('#yoodooWidget .login button,#yoodooWidget .welcome center button,#yoodooWidget .welcome button.logout,#yoodooWidget button.green,#yoodooWidget button.red,#yoodooWidget a.green,#yoodooWidget a.red,#yoodooWidget button.medium,#yoodooContainerContent a.medium,#yoodooWidget .chapterItem .quizThumb', yoodoo.styles.button.colour, 0, 0, false, false, true);
        }
        if (yoodoo.styles.button.colourOff.gloss === false && yoodoo.styles.button.colourOff.tint.lightness == 0 && yoodoo.styles.button.colourOff.tint.brightness == 0) {
            newcss['#yoodooWidget .login button.off'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourOff)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colourOff.gloss ? 'gradientGloss' : 'gradient']('#yoodooWidget .login button.off', yoodoo.styles.button.colourOff, 0, 0, false, false, true);
        }
        //yoodooStyler[yoodoo.styles.button.colour.gloss?'gradientGloss':'gradient']('#yoodooWidget .login button,#yoodooWidget .welcome center button,#yoodooWidget .welcome button.logout,#yoodooWidget button.green,#yoodooWidget button.red,#yoodooWidget a.green,#yoodooWidget a.red,#yoodooWidget button.medium,#yoodooContainerContent a.medium,#yoodooWidget .chapterItem .quizThumb',yoodoo.styles.button.colour,0,0,false,false,true);
        //newcss['#yoodooWidget .login button,#yoodooWidget .welcome center button,#yoodooWidget .welcome button.logout,#yoodooWidget button.green,#yoodooWidget button.red,#yoodooWidget a.green,#yoodooWidget a.red,#yoodooWidget button.medium,#yoodooContainerContent a.medium,#yoodooWidget .chapterItem .quizThumb']={background:yoodooStyler.rgbToHex(yoodoo.styles.button.colour)};
        //yoodooStyler[yoodoo.styles.button.colourOff.gloss?'gradientGloss':'gradient']('#yoodooWidget .login button.off',yoodoo.styles.button.colourOff,0,0,false,false,true);
        //newcss['#yoodooWidget .login button.off']={background:yoodooStyler.rgbToHex(yoodoo.styles.button.colourOff)};

        newcss['.' + yoodoo.class_prefix + '_toolbar,#yoodooWidget .overlayFooter,#yoodooWidget .overlayFooter .footerWarning'] = {
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.background),
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.text)
        };
        newcss['.' + yoodoo.class_prefix + '_toolbar, .' + yoodoo.class_prefix + '_toolbar a,#yoodooWidget .overlayFooter button.footerbutton'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.text),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.background)
        };
        newcss['.' + yoodoo.class_prefix + '_toolbar a:hover, #yoodooWidget .overlayFooter button.footerbutton:hover'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.textHover),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.hover)
        };
        newcss['.' + yoodoo.class_prefix + '_toolbar button,#yoodooWidget .overlayFooter button.done'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.text),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.background)
        };
		newcss['#yoodooWidget .overlayFooter button.asyncSave'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.text)
		};
		newcss['#yoodooWidget .overlayFooter button.done:hover+button.asyncSave'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.textHover),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.backgroundHover)
		};
        newcss['.' + yoodoo.class_prefix + '_toolbar button,#yoodooWidget .overlayFooter button.done:hover'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.textHover),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.done.backgroundHover)
        };
        newcss['.' + yoodoo.class_prefix + '_toolbar button,#yoodooWidget .overlayFooter>*>button.on'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.textOn),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.button.on)+' !important'
        };
        newcss['#yoodooWidget .overlayFooter .dialog'] = {
            'border-top': '1px solid ' + yoodooStyler.rgbToHex(yoodoo.styles.toolbar.background),
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.text),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.background)
        };
        newcss['#yoodooWidget .overlayFooter .dialog>div>button'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.buttontext),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.buttonbackground)
        };
        newcss['#yoodooWidget .overlayFooter .dialog>div>button:hover'] = {
            'color': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.buttontextHover),
            'background': yoodooStyler.rgbToHex(yoodoo.styles.toolbar.dialog.buttonbackgroundHover)
        };

        /*if (BrowserDetect.browser!="Explorer" || (BrowserDetect.browser=="Explorer" && BrowserDetect.version>9)) {
		yoodooStyler[yoodoo.styles.toolbar.background.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_toolbar,#yoodooWidget .overlayFooter',yoodoo.styles.toolbar.background,0,0,false,false,true);
		yoodooStyler[yoodoo.styles.toolbar.button.background.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_toolbar a, .'+yoodoo.class_prefix+'_toolbar button,#yoodooWidget .overlayFooter button.footerbutton',yoodoo.styles.toolbar.button.background,0,0,false,false,true);
		if (!yoodoo.is_touch) yoodooStyler[yoodoo.styles.toolbar.button.hover.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_toolbar a:hover, .'+yoodoo.class_prefix+'_toolbar button:hover,#yoodooWidget.isMouse .overlayFooter button.footerbutton:hover',yoodoo.styles.toolbar.button.hover,0,0,false,false,true);
		newcss['.'+yoodoo.class_prefix+'_toolbar, .'+yoodoo.class_prefix+'_toolbar a, .'+yoodoo.class_prefix+'_toolbar button,#yoodooWidget .overlayFooter button']={'color':yoodooStyler.rgbToHex(yoodoo.styles.toolbar.text)};
		if (!yoodoo.is_touch && yoodoo.styles.toolbar.textHover!==undefined) newcss['.'+yoodoo.class_prefix+'_toolbar, .'+yoodoo.class_prefix+'_toolbar a:hover, .'+yoodoo.class_prefix+'_toolbar button:hover,#yoodooWidget .overlayFooter button:hover']={'color':yoodooStyler.rgbToHex(yoodoo.styles.toolbar.textHover)};
	}*/


        //yoodooStyler[yoodoo.styles.button.colourHover.gloss?'gradientGloss':'gradient']('# yoodooWidget #yoodooContainerContent button:hover',yoodoo.styles.button.colourHover,0,0,false,false,true);
        //yoodooStyler[yoodoo.styles.base.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_buttons',yoodoo.styles.base,0,0,false,false,true);

        yoodooStyler[yoodoo.styles.widget.background.gloss ? 'gradientGloss' : 'gradient']('#yoodooWidget .widgetContainer>div', yoodoo.styles.widget.background, 0, 0, false, false, true);

        newcss['#yoodooWidget .widgetContainer>div'] = {
            color: yoodooStyler.rgbToCSS(yoodoo.styles.widget.text)
        };

        if (yoodoo.styles.button.colour.gloss === false && yoodoo.styles.button.colour.tint.lightness == 0 && yoodoo.styles.button.colour.tint.brightness == 0) {
            newcss['.' + yoodoo.class_prefix + '_buttons button'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colour)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colour.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons button', yoodoo.styles.button.colour, 0, 0, false, false, true);
        }

        if (yoodoo.styles.button.colourHover.gloss === false && yoodoo.styles.button.colourHover.tint.lightness == 0 && yoodoo.styles.button.colourHover.tint.brightness == 0) {
            newcss['.' + yoodoo.class_prefix + '_buttons button:hover'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourHover)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colour.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons button:hover', yoodoo.styles.button.colourHover, 0, 0, false, false, true);
        }

        if (yoodoo.styles.button.colourOn.gloss === false && yoodoo.styles.button.colourOn.tint.lightness == 0 && yoodoo.styles.button.colourOn.tint.brightness == 0) {
            newcss['.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourOn)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colourOn.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button', yoodoo.styles.button.colourOn, 0, 0, false, false, true);
        }

        if (yoodoo.styles.button.colourOff.gloss === false && yoodoo.styles.button.colourOff.tint.lightness == 0 && yoodoo.styles.button.colourOff.tint.brightness == 0) {
            newcss['.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button.off'] = {
                background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourOff)
            };
        } else {
            yoodooStyler[yoodoo.styles.button.colourOff.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button.off', yoodoo.styles.button.colourOff, 0, 0, false, false, true);
        }

        if (!yoodoo.is_touch) {
            if (yoodoo.styles.button.colourOnHover.gloss === false && yoodoo.styles.button.colourOnHover.tint.lightness == 0 && yoodoo.styles.button.colourOnHover.tint.brightness == 0) {
                newcss['.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button:hover'] = {
                    background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourOnHover)
                };
            } else {
                yoodooStyler[yoodoo.styles.button.colourOnHover.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button:hover', yoodoo.styles.button.colourOnHover, 0, 0, false, false, true);
            }
            if (yoodoo.styles.button.colourOffHover.gloss === false && yoodoo.styles.button.colourOffHover.tint.lightness == 0 && yoodoo.styles.button.colourOffHover.tint.brightness == 0) {
                newcss['.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button.off:hover'] = {
                    background: yoodooStyler.rgbToHex(yoodoo.styles.button.colourOffHover)
                };
            } else {
                yoodooStyler[yoodoo.styles.button.colourOffHover.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buttons .' + yoodoo.class_prefix + '_bookcaseButtons button.off:hover', yoodoo.styles.button.colourOffHover, 0, 0, false, false, true);

            }
        }
        //yoodooStyler[yoodoo.styles.button.colourOnHover.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_buttons .'+yoodoo.class_prefix+'_bookcaseButtons button:hover',yoodoo.styles.button.colourOnHover,0,0,false,false,true);
        //if (!yoodoo.is_touch) yoodooStyler[yoodoo.styles.button.colourOffHover.gloss?'gradientGloss':'gradient']('.'+yoodoo.class_prefix+'_buttons .'+yoodoo.class_prefix+'_bookcaseButtons button.off:hover',yoodoo.styles.button.colourOffHover,0,0,false,false,true);

        yoodooStyler.gradient('#yoodooWidget .tip .Notice>div', yoodoo.styles.base, 0.1, 0.2, true, true, true);
        yoodooStyler.gradient('#yoodooWidget .tip .warningNotice>div', yoodoo.styles.warning, 0.1, 0.2, true, true, true);
        yoodooStyler.gradient('#yoodooWidget .tip .scrollButton', yoodoo.styles.base, 0.05, 0.4, false, false, true);
        yoodoo.styles.highlight = yoodooStyler.tint(yoodoo.styles.base, yoodoo.styles.highlight.l, yoodoo.styles.highlight.b);
        newcss['#yoodooWidget .tip .scrollButton'] = {
            border: '1px solid ' + yoodooStyler.rgbToHex(yoodoo.styles.highlight)
        };
        yoodooStyler.shadow('#yoodooWidget .tip .Notice>div,#yoodooWidget .tip .scrollButton.scrolling', yoodoo.styles.highlight, 0, 0, 5);
        yoodooStyler.shadow('#yoodooWidget .tip .warningNotice>div', yoodooStyler.tint(yoodoo.styles.warning, 0.1, 1), 0, 0, 5);
        newcss['#yoodooWidget .tip .warningNotice>div'] = {
            color: yoodooStyler.rgbToHex(yoodooStyler.tint(yoodoo.styles.warning, 0.2, 1.5)),
            border: '1px solid ' + yoodooStyler.rgbToHex(yoodooStyler.tint(yoodoo.styles.warning, 0.0, 2))
        };
        if (typeof (yoodooPlaya) != 'undefined') {
            newcss['.yd_with_levels .yd_thumb'] = {
                height: Math.floor(yoodooPlaya.bookcase.slider.height / 2) + "px"
            };
            newcss['.yd_without_levels .yd_thumb'] = {
                height: yoodooPlaya.bookcase.slider.height + "px"
            };
            newcss['.yd_level'] = {
                height: Math.ceil(yoodooPlaya.bookcase.slider.height / 2) + "px",
                'line-height': Math.ceil(yoodooPlaya.bookcase.slider.height / 2) + "px",
                'font-size': Math.ceil(yoodooPlaya.bookcase.slider.height / 3) + "px"
            };
            newcss['.' + yoodoo.class_prefix + '_book_title'] = {
                'font-size': Math.round(yoodooPlaya.book.spineTextHeight * yoodooPlaya.book.spine) + 'px'
            };
        }
        if (!yoodoo.is_touch) newcss['.yd_thumb:hover div'] = {
            background: "#fff"
        };
        newcss['#yoodooWidget h2'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.h2)
        };
        newcss['#yoodooWidget #yoodooContainerContent h3'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.h3)
        };
        newcss['#yoodooWidget button.tab'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.text)
        };


        newcss['#yoodooContainerContent h3,#yoodooContainerContent .login,#yoodooContainerContent .welcome'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.text)
        };
        newcss['#yoodooContainerContent h3 a,#yoodooContainerContent .login a,#yoodooContainerContent .welcome a'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.link)
        };
        newcss['#yoodooContainerContent h3 a:hover,#yoodooContainerContent .login a:hover,#yoodooContainerContent .welcome a:hover'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.linkHover)
        };
        newcss['#yoodooContainerContent h3 a,#yoodooContainerContent .login a,#yoodooContainerContent .welcome a'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.link)
        };
        newcss['#yoodooContainerContent h3 a:hover,#yoodooContainerContent .login a:hover,#yoodooContainerContent .welcome a:hover'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.linkHover)
        };
        newcss['#yoodooContainerContent .' + yoodoo.class_prefix + '_overlay, #yoodooWidget .welcome .tabs button.on'] = {
            color: yoodooStyler.rgbToCSS(yoodoo.styles.overlay.text)
        };
        newcss['#yoodooContainerContent .' + yoodoo.class_prefix + '_overlay a'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.overlay.link)
        };
        newcss['#yoodooContainerContent .' + yoodoo.class_prefix + '_overlay a:hover'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.overlay.linkHover)
        };

        var baseDup = {
            r: yoodoo.styles.base.r,
            g: yoodoo.styles.base.g,
            b: yoodoo.styles.base.b
        };
        newcss['.yd_keypointHeader button'] = {
            background: yoodooStyler.rgbToHex(baseDup),
            color: yoodooStyler.rgbToHex(yoodoo.styles.text)
        };
        baseDup = {
            r: yoodoo.styles.base.r,
            g: yoodoo.styles.base.g,
            b: yoodoo.styles.base.b
        };
        newcss['.yd_keypointFooter button'] = {
            background: yoodooStyler.rgbToHex(yoodooStyler.tint(baseDup, yoodoo.styles.base.tint.lightness, yoodoo.styles.base.tint.brightness)),
            color: yoodooStyler.rgbToHex(yoodoo.styles.text)
        };
        //newcss['#exercise_content, #exercise_content p']={color:yoodooStyler.rgbToHex(yoodoo.styles.dooittext)};

        newcss['#yoodooWidget #yoodooContainerContent .dooitBox, #yoodooWidget #yoodooContainerContent .dooitBox p'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.dooittext)
        };

        var col = yoodooStyler.rgbToHex(yoodoo.styles.book.colour);
        if (yoodoo.styles.book.border.lightness !== undefined && yoodoo.styles.book.border.brightness !== undefined) col = yoodooStyler.rgbToHex(yoodooStyler.tint(yoodoo.styles.book.colour, yoodoo.styles.book.border.lightness, yoodoo.styles.book.border.brightness));
        if (yoodoo.gradientFill) {
            //var col=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodoo.styles.book.colour,yoodoo.styles.book.border.lightness,yoodoo.styles.book.border.brightness));
            newcss['.' + yoodoo.class_prefix + "_bookcaseItem"] = {
                'border': yoodoo.styles.book.border.width + 'px solid ' + col
            };
            yoodooStyler[yoodoo.styles.book.colour.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + "_bookcaseItem", yoodoo.styles.book.colour, 0, 0, true, false, true);
        } else {
            //var col=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodoo.styles.book.colour,yoodoo.styles.book.border.lightness,yoodoo.styles.book.border.brightness));
            newcss['.' + yoodoo.class_prefix + "_bookcaseItem"] = {
                'border': yoodoo.styles.book.border.width + 'px solid ' + col,
                'background': yoodooStyler.rgbToHex(yoodoo.styles.book.colour)
            };
        }

        yoodooStyler.borderRadius('.' + yoodoo.class_prefix + "_bookcaseItem", yoodoo.styles.book.radius);
        yoodooStyler.borderRadius('.' + yoodoo.class_prefix + "_bookcaseItem ." + yoodoo.class_prefix + "_book_colour", [0, 0, yoodoo.styles.book.radius, yoodoo.styles.book.radius]);
        yoodooStyler.borderRadius('.' + yoodoo.class_prefix + "_bookcaseItem ." + yoodoo.class_prefix + "_book_earmark", [yoodoo.styles.book.radius, 0, 0, 0]);

        yoodooStyler[yoodoo.styles.progress.buffer.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_buffer', yoodoo.styles.progress.buffer, 0, 0, false, false, true);
        yoodooStyler[yoodoo.styles.progress.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_timeline', yoodoo.styles.progress.background, 0, 0, false, false, true);
        yoodooStyler[yoodoo.styles.progress.bar.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_progress', yoodoo.styles.progress.bar, 0, 0, false, false, true);


        yoodooStyler[yoodoo.styles.keypoints.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypoint', yoodoo.styles.keypoints.background, 0, 0, false, false, true);
        newcss['.' + yoodoo.class_prefix + '_keypoint'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.keypoints.text)
        };
        yoodooStyler[yoodoo.styles.keypoints.past.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypoint.' + yoodoo.class_prefix + '_past_keypoint', yoodoo.styles.keypoints.past.background, 0, 0, false, false, true);
        newcss['.' + yoodoo.class_prefix + '_keypoint.' + yoodoo.class_prefix + '_past_keypoint'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.keypoints.past.text)
        };
        yoodooStyler[yoodoo.styles.keypoints.current.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypoint.' + yoodoo.class_prefix + '_current_keypoint', yoodoo.styles.keypoints.current.background, 0, 0, false, false, true);
        newcss['.' + yoodoo.class_prefix + '_keypoint.' + yoodoo.class_prefix + '_current_keypoint'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.keypoints.current.text)
        };
        yoodooStyler[yoodoo.styles.keypoints.options.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_keypoint .options', yoodoo.styles.keypoints.options, 0, 0, false, false, true);

        yoodooStyler[yoodoo.styles.episodeOverlay.background.gloss ? 'gradientGloss' : 'gradient']('.' + yoodoo.class_prefix + '_complete', yoodoo.styles.episodeOverlay.background, 0, 0, false, false, true);
        newcss['.' + yoodoo.class_prefix + '_complete,.' + yoodoo.class_prefix + '_complete button'] = {
            color: yoodooStyler.rgbToHex(yoodoo.styles.episodeOverlay.text)
        };

        yoodooStyler.addToBuffer(newcss);
        yoodooStyler.purgeBuffer();
    },
    colourScheme:function(params) {
    	var opts={
    		colours:6,
    		startAngle:30,
    		schemeAngle:360,
    		brightness:-0.1,
    		lightness:0.5
    	};
    	opts=$.extend(opts,params);
    	var colors=[];
    	var da=opts.schemeAngle/(opts.colours);
    	for(var c=0;c<opts.colours;c++) {
    		var a=opts.startAngle+(c*da);
    		while(a>360) a-=360;
    		while(a<0) a+=360;
    		var col={r:0,g:0,b:0};
    		col.r=Math.round(255*((a>=120 && a<=240)?0:((a>240)?a-240:120-a))/120);
    		col.g=Math.round(255*((a>0 && a<240)?120-Math.abs(a-120):0)/120);
    		col.b=Math.round(255*((a>120 && a<360)?120-Math.abs(a-240):0)/120);
    		colors.push(yoodooStyler.rgbToHex(this.tint(col,opts.lightness,opts.brightness)));
    	}
    	return colors;
    }
};

