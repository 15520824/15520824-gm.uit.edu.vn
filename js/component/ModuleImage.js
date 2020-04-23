import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/ModuleImage.css';
import { formatDate } from './FormatFunction';

var _ = Fcore._;
var $ = Fcore.$;

export function descViewImagePreview(data=[],index = 0,promiseLazyLoad){
    var temp = _({
        tag:"div",
        class:"image-show",
        child:[
            {
                tag:"div",
                class:"image-show__title",
                child:[
                    {
                        tag:"div",
                        class:"fl-l",
                        style:{
                            margin:"0.2143rem 0.7143rem 0.2143rem 1rem"
                        }
                    },
                    {
                        tag:"div",
                        class:["fl-r", "image-show__close"],
                        props:{
                            id:"image-show__close",
                            title:"Đóng"
                        },
                        child:[
                            {
                                tag:"i",
                                class:["btn", "dark", "btn--m","fa", "fa-close"],
                                style:{
                                    margin:"0.4286rem 0.7143rem"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag:"div",
                style:{
                    display: "flex",
                    height: "calc(100vh - 6.42857142857rem)",
                    margin: "0.3571rem"
                },
                child:[
                    {
                        tag:"div",
                        class:"timeLineContainerCheck",
                        child:[
                            {
                                tag:"div",
                                class:"image-show__thumb__legend",
                                style:{
                                    height:"2.2857rem", 
                                    width: "8.5714rem",
                                    position: "absolute",
                                    zIndex: 10,
                                    top: "2.8571rem",
                                    left: "0.3571rem"
                                },
                                child:[
                                    {
                                        tag:"span",
                                        props:{
                                            id:"image-show__thumb__legend_title_content"
                                        },
                                        attr:{
                                            dataTranslateInner:"STR_DATE_TIME",
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"flx",
                                style:{
                                    height:"100%",
                                    overflowX: "hidden"
                                },
                                child:[
                                    {
                                        tag:"div",
                                        class:["flx", "flx-al-e", "image-show__list"],
                                        child:[
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"timeline-slider",
                                style:{
                                    margin:"0rem 0.8571rem 1.0714rem"
                                },
                                child:[
                                    {
                                        tag:"div",
                                        class:"timeline-slider__track",
                                        child:[
                                            {
                                                tag:"div",
                                                class:["timeline-slider__track__progress", "hover-track"]
                                            }
                                        ]
                                    },
                                    {
                                        tag:"div",
                                        class:["timeline-slider__pivot", "timeline-slider__pivot--left"]
                                    },
                                    {
                                        tag:"div",
                                        class:["timeline-slider__pivot", "timeline-slider__pivot--right"]
                                    },
                                    {
                                        tag:"div",
                                        class:["timeline-slider__handle"],
                                        style:{
                                            width: "0.8571rem",
                                            height: "0.8571rem",
                                            left: "0.4643rem",
                                            top: "calc(0% - 0rem)"
                                        },
                                        child:[
                                            {
                                                tag:"div",
                                                class:"timeline-slider__tooltip",
                                                style:{
                                                    top: "-0.2143rem"
                                                }
                                            }
                                        ]
                                    },
                                    
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:["image-show__body", "content"],
                        props:{
                            id:"image-show"
                        },
                        child:[
                            {
                                tag:"div",
                                class:["image-show__btnc", "image-show__btnc__left"],
                                child:[
                                    {
                                        tag:"div",
                                        class:["flx-fix", "image-show__btn", "clickable"],
                                        child:[
                                            {
                                                tag:"div",
                                                class:"image-show__btn__inside",
                                                child:[
                                                    {
                                                        tag:"i",
                                                        class:["fa", "fa-chevron-left"],
                                                        attr:{
                                                            dataTranslateTitle:"STR_NAVIGATE_PHOTO_PREV",
                                                            title:"Ảnh cũ hơn"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"image-show__wrapper__img",
                                props:{
                                    id:"mainImage"
                                },
                                child:[
                                    {
                                        tag:"div",
                                        class:"image-show__meta-wrapper",
                                        props:{
                                            id:"imageTitle"
                                        },
                                        child:[
                                            {
                                                tag:"div",
                                                class:"image-show__caption"
                                            }
                                        ]
                                    },
                                    {
                                        tag:"img",
                                        class:["image-show__img", "z-fh", "fadeInImageShow"],
                                        attr:{
                                            draggable:"false",
                                            crossorigin:"Anonymous",

                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:["image-show__btnc", "image-show__btnc__right"],
                                child:[
                                    {
                                        tag:"div",
                                        class:["flx-fix", "image-show__btn", "clickable"],
                                        child:[
                                            {
                                                tag:"div",
                                                class:"image-show__btn__inside",
                                                child:[
                                                    {
                                                        tag:"i",
                                                        class:["fa", "fa-chevron-right"],
                                                        attr:{
                                                            dataTranslateTitle:"STR_NAVIGATE_PHOTO_NEXT",
                                                            title:"Ảnh mới hơn"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"image-show__btnc__fullscreen",
                                child:[
                                    {
                                        tag:"i",
                                        class:["image-show__icon-fullscreen", "fa", "fa-fullscreen-icon"]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                tag:"div",
                class:"image-show__bottom",
                child:[
                    {
                        tag:"div",
                        class:"image-show__bottom__sender",
                        child:[
                            {
                                tag:"div",
                                class:["avatar", "avatar--xs"],
                                child:[
                                    {
                                        tag:"div",
                                        class:"avatar-img",
                                        style:{
                                            
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"div",
                                class:"image-show__bottom__sender__info",
                                child:[
                                    {
                                        tag:"div",
                                        class:["truncate","user-name"],
                                        style:{
                                            fontSize: "1rem",
                                            fontWeight: 400
                                        }
                                    },
                                    {
                                        tag:"div",
                                        class:["truncate","date-submit"],
                                        child:[
                                            {
                                                tag:"span",
                                                attr:{
                                                    dataTranslateInner:"STR_DATE_TIME",
                                                },
                                                props:{
                                                    innerHTML:"10:06  14/02/2020"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag:"div",
                        class:"image-show__bottom__ctrl",
                        child:[
                            {
                                tag:"i",
                                class:["btn", "fa", "fa-chevron-left"],
                                attr:{
                                    dataTranslateTitle:"STR_NAVIGATE_PHOTO_PREV",
                                    title:"Ảnh cũ hơn"
                                }
                            },
                            {
                                tag:"i",
                                class:["btn", "fa", "fa-chevron-right"],
                                attr:{
                                    dataTranslateTitle:"STR_NAVIGATE_PHOTO_NEXT",
                                    title:"Ảnh mới hơn"
                                }
                            },
                            {
                                tag:"a",
                                class:["btn", "dark"],
                                attr:{
                                    download:"",
                                    title:"Chia sẻ"
                                },
                                props:{
                                    id:"image-show-forward"
                                },
                                child:[
                                    {
                                        tag:"i",
                                        class:["fa", "fa-share-photoview", "btn"],
                                        attr:{
                                            dataTranslateTitle:"STR_FORWARD_MSG",
                                            title:"Chia sẻ"
                                        }
                                    }
                                ]
                            },
                            {
                                tag:"a",
                                class:["btn", "dark"],
                                child:[
                                    {
                                        tag:"i",
                                        class:["fa", "fa-download", "btn"],
                                        attr:{
                                            dataTranslateTitle:"STR_SAVE_PHOTO_AS",
                                            title:"Lưu về máy"
                                        }
                                    }
                                ],
                                props:{
                                    id:"image-show-download"
                                },
                                attr:{
                                    href:"#",
                                    target:"_blank",
                                    rel:"noopener noreferrer",
                                    download:"",
                                    title:"Lưu về máy",
                                }
                            },
                            {
                                tag:"i",
                                class:["btn", "fa", "fa-rotate-left"],
                                props:{
                                    dataTranslateTitle:"STR_ROTATE_LEFT",
                                    title:"Xoay trái"
                                }
                            },
                            {
                                tag:"i",
                                class:["btn", "fa", "fa-rotate-right"],
                                props:{
                                    dataTranslateTitle:"STR_ROTATE_RIGHT",
                                    title:"Xoay phải"
                                }
                            },
                            // {
                            //     tag:"i",
                            //     class:["btn", "fa", "fa-more-option"],
                            //     props:{
                            //         dataTranslateTitle:"STR_MORE_OPTION",
                            //     }
                            // }
                        ]
                    }
                ]
            }
        ]
    })

    var container = _({
        tag:"modal",
        child:[
            temp
        ]
    });
    Object.assign(container,descViewImagePreview.prototype);
    var self = container;
    
    self.closeButton = $('div#image-show__close.fl-r.image-show__close',temp);
    self.containImage = $('div.flx.flx-al-e.image-show__list',temp);
    self.prevButton = $('i.btn.fa.fa-chevron-left',temp);
    self.nextButton = $('i.btn.fa.fa-chevron-right',temp);
    self.prevButtonTop = $('div.image-show__btnc.image-show__btnc__left div.flx-fix.image-show__btn',temp);
    self.nextButtonTop = $('div.image-show__btnc.image-show__btnc__right div.flx-fix.image-show__btn',temp);
    self.forwardButton = $('a#image-show-forward',temp);
    self.downloadButton = $('a#image-show-download',temp);
    self.rotateLeftButton = $('i.btn.fa.fa-rotate-left',temp);
    self.rotateRightButton = $('i.btn.fa.fa-rotate-right',temp);
    self.titleTimeLine = $('span#image-show__thumb__legend_title_content',temp);
    self.avatarImage = $('div.avatar-img',temp);
    self.userName = $('div.truncate.user-name',temp);
    self.dateSubmit = $('div.truncate.date-submit',temp);

    self.noteImage = $('div#imageTitle.image-show__meta-wrapper  div.image-show__caption',temp);
    self.mainImage = $('div#mainImage>img.image-show__img.z-fh.fadeInImageShow',temp);
    self.openCloseTimeLine = $('div.image-show__btnc__fullscreen',temp);

    self.containerTimeLine = $('div.timeLineContainerCheck',temp);
    self.containerMainImage = $('div.#image-show.image-show__body.content',temp);

    self.timeLineMarker = $('div.timeline-slider__handle',temp);

    var supportsPassive = false;
    try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; } 
    }));
    } catch(e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    self.prevButton.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.nextElement().index);
    });

    self.nextButton.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.prevElement().index);
    });

    self.prevButtonTop.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.nextElement().index);
    });

    self.nextButtonTop.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.prevElement().index);
    });

    self.rotateLeftButton.addEventListener("click",function(event){
        self.setRoation(-90);
    });
    
    self.rotateRightButton.addEventListener("click",function(event){
        self.setRoation(90);
    });

    self.closeButton.addEventListener("click",function(event){
        self.selfRemove();
    });

    self.containImage.addEventListener(wheelEvent,function(event){
        event.preventDefault();
    },wheelOpt)
    var deltaYcontainImage = 0;
    var deltaYcontainerMainImage = 0;
    self.containImage.addEventListener("wheel",function(event){
        if(Math.abs(deltaYcontainImage)<200)
        {
            if(deltaYcontainImage*event.deltaY<0)
                deltaYcontainImage = event.deltaY;
            else
                deltaYcontainImage+=event.deltaY;
        }else
        {
            if(deltaYcontainImage<0){
                var next = self.itemSelect.prevElement();
                if(next!==null)
                self.SelectImage(next.index);
            }      
            else
            {
                var next = self.itemSelect.nextElement();
                if(next!==null)
                self.SelectImage(next.index);
            } 
            deltaYcontainImage = 0;
        }   
    })

    self.containerMainImage.addEventListener("wheel",function(event){
        if(Math.abs(deltaYcontainerMainImage)<50)
        {
            if(deltaYcontainerMainImage*event.deltaY<0)
                deltaYcontainerMainImage = 0;
            else
                deltaYcontainerMainImage+=event.deltaY;
        }else
        {
            if(deltaYcontainerMainImage<0){
                self.setScale(-0.125);
            }else
            {
                self.setScale(0.125);
            }
            deltaYcontainerMainImage = 0;
        }
    })

    self.openCloseTimeLine.addEventListener("click",function(event){
        if(self.containerTimeLine.classList.contains("displayNone")){
            self.containerTimeLine.classList.remove("displayNone");
        }
        else{
            self.containerTimeLine.classList.add("displayNone");
        }
    });
    
    self.containImage.indexDay = -1;
    self.containImage.indexElement = -1;
    self.renderItems(data,index);
    if(promiseLazyLoad!==undefined)
    {
        self.addFunctionLazyLoad(promiseLazyLoad);
    }
    return self;
}

descViewImagePreview.prototype.renderItems = function(data,index)
{
    var self = this;
    var dataCheck = [];
    data.sort(function(a,b){
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        if(dateA<dateB)
            return 1;
        if(dateA>dateB)
            return -1;
            return 0;
    })

    var dayThumnail,day,format,date;
    var today = new Date();

    for(var i = 0;i<data.length;i++)
    {
        date = new Date(data[i].date);
        if(today.getFullYear() === date.getFullYear())
        format = formatDate(date);
        else
        format = formatDate(date,undefined,undefined,undefined,undefined,true);

        if(dataCheck[format]===undefined)
        {
            
            dataCheck[format] = [data[i]];
            day = _({
                tag:"span",
                attr:{
                    dataTranslateInner:"STR_DATE_TIME"
                }
            });
            dayThumnail =_({
                tag:"div",
                class:"image-show__thumb__legend",
                child:[
                    day
                ]
            });
            
            if(date.getDay() === today.getDay()&&date.getMonth() === today.getMonth())
            {
                format = "Hôm nay";
                
            }

            day.addChild(_({text:format}));

            dayThumnail.getDate = function(formatDate)
            {
                return function()
                {
                    return formatDate;
                }
            }(format);
            dayThumnail.getValue = function(mDate)
            {
                return function()
                {
                    return mDate;
                }
            }(date)
            
            self.containImage.indexDay++;
            dayThumnail.indexDay = self.containImage.indexDay;

            self.containImage.appendChild(dayThumnail);
        }
        else
        dataCheck[format] = dataCheck[format].concat([data[i]]);
        self.containImage.indexElement++;
        var item = self.ItemTimeLine(data[i],self.containImage.indexElement);
        item.dayElement = dayThumnail;
        self.containImage.appendChild(item);
    }
    if(index!==undefined)
    self.SelectImage(index);
}

descViewImagePreview.prototype.resetImage = function(data)
{
    var self = this;
    var newMainImage = _({
        tag:"img",
        class:["image-show__img", "z-fh", "fadeInImageShow"],
        attr:{
            draggable:"false",
            crossorigin:"Anonymous",
            src:data.src
        }
    })

    newMainImage.rotateRadius = 0;
    newMainImage.scaleUnit = 1;
    newMainImage.style.transform = "rotate("+newMainImage.rotateRadius+"deg) translate(0rem, 0rem) scale("+newMainImage.scaleUnit+")";

    newMainImage.addEventListener("click",function(){
        if(self.noteImage.parentNode.classList.contains("displayNone"))
            self.noteImage.parentNode.classList.remove("displayNone");
        else
            self.noteImage.parentNode.classList.add("displayNone");
    });

    this.downloadButton.setAttribute("href",data.src);
    this.mainImage.parentNode.replaceChild(newMainImage,this.mainImage);
    this.mainImage = newMainImage;


    this.noteImage.innerText = data.note;
    this.avatarImage.style.backgroundImage = "url("+data.avatar+")";
    this.userName.innerText = data.userName;
    this.dateSubmit.innerText = formatDate(data.date,true,true,true,true,true);
}

descViewImagePreview.prototype.setRoation = function(radius)
{
    this.mainImage.rotateRadius += radius;
    this.mainImage.style.transform = "rotate("+this.mainImage.rotateRadius+"deg) translate(0rem, 0rem) scale("+this.mainImage.scaleUnit+")";
}

descViewImagePreview.prototype.setScale = function(scale)
{
    if(this.mainImage.scaleUnit + scale <1)
        return;
    this.mainImage.scaleUnit += scale;
    this.mainImage.style.transform = "rotate("+this.mainImage.rotateRadius+"deg) translate(0rem, 0rem) scale("+this.mainImage.scaleUnit+")";
}

descViewImagePreview.prototype.SelectImage = function(index)
{
    if(this.itemSelect!==undefined)
        this.itemSelect.classList.remove("selected");

    this.itemSelect = $("div#thumb_"+index,this);
    this.itemSelect.classList.add("selected");
    
    this.resetImage(this.itemSelect.data)
    this.titleTimeLine.innerText = this.itemSelect.dayElement.getDate();

    if(this.itemSelect.nextElement()===null)
    {
        if(!this.prevButton.classList.contains("unclickable"))
            this.prevButton.classList.add("unclickable");
        if(this.prevButtonTop.classList.contains("clickable"))
            this.prevButtonTop.classList.remove("clickable");
    }else
    {
        if(this.prevButton.classList.contains("unclickable"))
            this.prevButton.classList.remove("unclickable");
        if(!this.prevButtonTop.classList.contains("clickable"))
            this.prevButtonTop.classList.add("clickable");
    }
    if(this.itemSelect.prevElement()===null)
    {
        if(!this.nextButton.classList.contains("unclickable"))
            this.nextButton.classList.add("unclickable");
        if(this.nextButtonTop.classList.contains("clickable"))
            this.nextButtonTop.classList.remove("clickable");
    }else
    {
        if(this.nextButton.classList.contains("unclickable"))
            this.nextButton.classList.remove("unclickable");
        if(!this.nextButtonTop.classList.contains("clickable"))
            this.nextButtonTop.classList.add("clickable");
    }

    this.scrollView()
} 

descViewImagePreview.prototype.scrollView = function()
{
    var self = this;
    this.containImage.scrollTop = this.itemSelect.offsetTop - this.containImage.offsetHeight/2;
    this.timeLineMarker.style.top = "calc("+(this.itemSelect.dayElement.indexDay/this.containImage.indexDay)*100+"% - 0rem)";
    if(this.promiseLazyLoad!==undefined)
    if(this.itemSelect.dayElement.indexDay === this.containImage.indexDay)
    this.promiseLazyLoad.then(function(result){
        self.renderItems(result);
        self.scrollView();
        self.promiseLazyLoad = undefined;
    })
}

descViewImagePreview.prototype.addFunctionLazyLoad = function(promiseLazyLoad)
{
    this.promiseLazyLoad = promiseLazyLoad;
}

descViewImagePreview.prototype.ItemTimeLine = function(data,i)
{
    var self = this;
    var temp = _(
        {
            tag:"div",
            class:"image-show__thumb-container",
            props:{
                id:"thumb_"+i
            },
            on:{
                click: function(event){
                    self.SelectImage(i);
                }
            },
            child:[
                {
                    tag:"img",
                    class:["image-show__thumb", "clickable"],
                    attr:{
                        crossorigin:"Anonymous"
                    },
                    props:{
                        src:data.src
                    }
                }
            ]
        }
    )
    temp.data = data;
    temp.index = i;

    temp.imageElement = $('div.image-show__thumb-container img.image-show__thumb',temp);
    
    temp.nextElement = function()
    {
        var indexElement = temp;
        do{
            indexElement = indexElement.nextSibling;
        }while(indexElement!==null&&!indexElement.classList.contains("image-show__thumb-container"))
        return indexElement;
    }
    temp.prevElement = function()
    {
        var indexElement = temp;
        do{
            indexElement = indexElement.previousSibling;
        }while(indexElement!==null&&!indexElement.classList.contains("image-show__thumb-container"))
        return indexElement;
    }
    return temp;
}