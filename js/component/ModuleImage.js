import R from '../R';
import Fcore from '../dom/Fcore';
import '../../css/ModuleImage.css';


var _ = Fcore._;
var $ = Fcore.$;

export function descViewImagePreview(data=[],index = 0){
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
                            margin:"3px 10px 3px 14px"
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
                                    margin:"6px 10px"
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
                    height: "calc(100vh - 90px)",
                    margin: "5px"
                },
                child:[
                    {
                        tag:"div",
                        style:{
                            display:"flex",
                            padding:"15px 0px 0px 15px"
                        },
                        child:[
                            {
                                tag:"div",
                                class:"image-show__thumb__legend",
                                style:{
                                    height:"32px", 
                                    width: "120px",
                                    position: "absolute",
                                    zIndex: 10,
                                    top: "40px",
                                    left: "5px"
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
                                    margin:"0px 12px 15px"
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
                                            width: "12px",
                                            height: "12px",
                                            left: "6.5px",
                                            top: "calc(0% - 0px)"
                                        },
                                        child:[
                                            {
                                                tag:"div",
                                                class:"timeline-slider__tooltip",
                                                style:{
                                                    top: "-3px"
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
                                        tag:"img",
                                        class:["image-show__img", "z-fh", "fadeInImageShow"],
                                        attr:{
                                            draggable:"false",
                                            crossorigin:"Anonymous",

                                        },
                                        style:{
                                            cursor: "default", 
                                            transform: "rotate(0deg) translate(0px, 0px) scale(1)", 
                                            verticalAlign: "middle",
                                            display: "inline-block"
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
    
    self.containImage = $('div.flx.flx-al-e.image-show__list',temp);
    self.prevButton = $('i.btn.fa.fa-chevron-left',temp);
    self.nextButton = $('i.btn.fa.fa-chevron-right',temp);
    self.forwardButton = $('a#image-show-forward',temp);
    self.downloadButton = $('a#image-show-download',temp);
    self.rotateLeftButton = $('i.btn.fa.fa-rotate-left',temp);
    self.rotateRightButton = $('i.btn.fa.fa-rotate-right',temp);
    self.titleTimeLine = $('span#image-show__thumb__legend_title_content',temp);

    self.prevButton.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.nextElement().index);
    })

    self.nextButton.addEventListener("click",function(event){
        self.SelectImage(self.itemSelect.prevElement().index);
    })

    self.avatarImage = $('div.avatar-img',temp);
    self.userName = $('div.truncate.user-name',temp);
    self.dateSubmit = $('div.truncate.date-submit',temp);
    
    self.mainImage = $('div#mainImage>img',temp);
    
    
    self.renderItems(data,index);

    return self;
}

descViewImagePreview.prototype.activeScroller = function()
{
    self.containImage.addEventListener("scroll", function(){
        
    })
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
            self.containImage.appendChild(dayThumnail);
        }
        else
        dataCheck[format] = dataCheck[format].concat([data[i]]);

        var item = self.ItemTimeLine(data[i],i);
        item.dayElement = dayThumnail;
        self.containImage.appendChild(item);
    }

    self.SelectImage(index);
}

descViewImagePreview.prototype.SelectImage = function(index)
{
    if(this.itemSelect!==undefined)
    {
        this.itemSelect.classList.remove("selected");
    }
    this.itemSelect = $("div#thumb_"+index,this);
    this.itemSelect.classList.add("selected");

    this.titleTimeLine.innerText = this.itemSelect.dayElement.getDate();
    this.avatarImage.style.backgroundImage = "url("+this.itemSelect.data.avatar+")";
    this.userName.innerText = this.itemSelect.data.userName;
    this.dateSubmit.innerText = formatDate(this.itemSelect.data.date,true,true,true,true,true);
    this.mainImage.setAttribute("src",this.itemSelect.data.src);

    if(this.itemSelect.nextElement()===null)
    {
        if(!this.prevButton.classList.contains("unclickable"))
            this.prevButton.classList.add("unclickable");
    }else
    {
        if(this.prevButton.classList.contains("unclickable"))
        this.prevButton.classList.remove("unclickable");
    }
    if(this.itemSelect.prevElement()===null)
    {
        if(!this.nextButton.classList.contains("unclickable"))
            this.nextButton.classList.add("unclickable");
    }else
    {
        if(this.nextButton.classList.contains("unclickable"))
        this.nextButton.classList.remove("unclickable");
    }
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

function formatDate(date,isMinutes = false, isHours = false , isDay = true, isMonth = true, isYear = false) {
    var d = new Date(date);
    
    var resultTime = [];
    var resultDayMonth =[];
    if(isMinutes)
        resultTime.push('' + d.getMinutes());
    if(isHours)
        resultTime.push('' + d.getHours());

    if(isDay){
        var day = '' + d.getDate();
        if (day.length < 2) 
            day = '0' + day;
        resultDayMonth.push(day);
    }  
    if(isMonth)
    {
        var month = '' + (d.getMonth() + 1);
        if (month.length < 2) 
        month = '0' + month;
        resultDayMonth.push(month);
    }
        
    if(isYear)
        resultDayMonth.push('' + d.getFullYear());
    
    return resultTime.join(':')+" "+resultDayMonth.join('/');
}