import Fcore from '../dom/Fcore';
import '../../css/form_create_edit.css';
import '../../css/test_question.css';
import '../../css/test.css';
import {grayscale} from './FormatFunction';
import {descViewImagePreview} from './ModuleImage';
var _ = Fcore._;
var $ = Fcore.$;
var xmlModalDragManyFiles;
export default xmlModalDragManyFiles = {
  imgUrl:[],
  files:[],
  avatar:"",
  note:"",
  userName:"",
  enableClick:false,
  iconSrc:"https://lab.daithangminh.vn/vivid_exticons/",
  deleteAllTrash: function() {
  },
  functionFormat:function(data)
  {
    return data;
  },
  setProfile:function(profile = {})
  {
    if(profile.userName!==undefined)
    this.userName = profile.userName;
    if(profile.avatar!==undefined)
    this.avatar = profile.avatar;
    if(profile.note!==undefined)
    this.note = profile.note;
  },
  setFormatData:function(functionFormat)
  {
    this.functionFormat = functionFormat;
  },
  enableCheckBox:false,
  enableSelectbox:false,
  Image: function(srcImg) {
    var self = this;
    var temp;
    var img = _({
      tag: "img",
      class: ["full-size"],
      props: {
        src: srcImg
      },
      on: {
        click: function() {
          if(self.enableClick===false)
          return;
          var manyfiles = self.getFile();
          var arr = [];
          var index;
          for(var i = 0;i<manyfiles.length;i++)
          {
            if(typeof manyfiles[i]=="object"){
              var dataTemp = self.functionFormat(manyfiles[i]);
              if(manyfiles[i].ref!==undefined)
              dataTemp.src = manyfiles[i].ref+manyfiles[i].src;

              arr.push(dataTemp)
            }
            else
            arr.push({avatar:self.avatar, userName:self.userName, src:manyfiles[i],date:(new Date()).toISOString(), note:self.note});
            if(manyfiles[i]==temp.value)
            index = i;
          }
          document.body.appendChild(descViewImagePreview(arr,index));
        }
      }
    });
    temp = _({
      tag:"div",
      class:"grid-item",
      child:[
        img,
        {
          tag:"i",
          class:"material-icons",
          style:{
            overflow: "hidden",
            position: "absolute",
            right: "7px",
            top: "7px",
            cursor: "pointer",
            height: "fit-content",
            margin: 0,
            width: "fit-content",
            userSelect: "none",
            backgroundColor: "white",
            fontSize : "21px"
          },
          on:{
            click:function(event){
              this.parentNode.selfRemove();
            }
          },
          props:{
            innerHTML:"close"
          }
        }
      ]
    });
    if(self.enableCheckBox == true)
    {
      var checkboxButton = _({
        tag:"button",
        class:"pizo-container-icon-radiobutton",
        on:{
          click:function(event){
            if(self.gallery===undefined)
            {
              self.gallery = $(".gallery_c0ek499ts0",this.containGetImage);
            }
            var arr = self.gallery.getElementsByClassName("checked-pizo");
            if(arr.length>0)
            arr[0].classList.remove("checked-pizo");
            {
              temp.classList.add("checked-pizo");
            }
          
          }
        },
        child:[
          {
            tag:"i",
            class:"material-icons",
            style:{
              overflow: "hidden",
              cursor: "pointer",
              userSelect: "none",
              fontSize : "13px",
            },
           
            props:{
              innerHTML:"stop_circle"
            }
          }
        ]
      })
      temp.checkboxButton = checkboxButton
      temp.insertBefore(checkboxButton,temp.firstChild)
    }
    window.addEventListener("click", function(event) {
      if (
        event.target !== temp &&
        temp !== undefined &&
        temp.parentNode !== undefined
      ) {
        var el = temp;
        while (
          el.parentNode != undefined &&
          !el.classList.contains("image-autoresize-create")
        )
          el = el.parentNode;
        if (el !== document)
          if (el.classList.contains("hasFocus"))
            el.classList.remove("hasFocus");
      }
    });
    img.addEventListener("load",function()
    {
      temp.onload.bind(this)();
    })
    if(self.getFile().length == 0)
    {
      temp.classList.add("checked-pizo");
    }
    return temp;
  },
  containGetImage: function() {
    var self = this;
    var input = _({
      tag: "input",
      class: "modal-upload-XML-body-drop-area-main-form-input",
      attr:{
        multiple:"",
      },
      props: {
        type: "file",
        accept: "*/*",
        id: "fileElem"
      },
      on: {
        change: function() {
          self.handleFiles(this.files, self);
        }
      }
    });
    self.select = _({
      tag: "div",
      class: [
        "quantumWizButtonEl",
        "quantumWizButtonPaperbuttonEl",
        "quantumWizButtonPaperbuttonFlat",
        "quantumWizButtonPaperbuttonFlatColored",
        "quantumWizButtonPaperbutton2El2",
        "quantumWizDialogPaperdialogDialogButton",
        "disable"
      ],
      style: {
        backgroundColor: "#2196F3",
        border: "1px solid rgb(169, 169, 169)",
        width: "90px"
      },
      child: [
        {
          tag: "span",
          class: "quantumWizButtonPaperbuttonContent",
          child: [
            {
              tag: "span",
              class: "quantumWizButtonPaperbuttonLabel",
              style: {
                color: "white"
              },
              props: {
                innerHTML: "Chọn"
              }
            }
          ]
        }
      ],
      on: {
        click: function() {
          self.functionClickDone();
          if(self.modal!==undefined)
          self.modal.parentNode.removeChild(self.modal);
        }
      }
    });
    var temp = _({
      tag: "div",
      class: "modal-upload-XML-body-drop",
      child: [
        {
          tag: "div",
          class: "modal-upload-XML-body-drop-area",
          child: [
            {
              tag: "div",
              class: "modal-upload-XML-body-drop-area-main",
              child: [
                {
                  tag: "div",
                  class: [
                    "modal-upload-XML-body-drop-area-main-form",
                    "displayVisible",
                    "drop-area_c0ek499ts0"
                  ],
                  child: [
                    {
                      tag: "div",
                      class:
                        "modal-upload-XML-body-drop-area-main-form-content",
                      child: [
                        input,
                        {
                          tag: "button",
                          class:
                            "modal-upload-XML-body-drop-area-main-form-button",
                          props: {
                            innerHTML: "Chọn files để tải lên",
                            for: "fileElem"
                          },
                          on: {
                            click: function() {
                              input.click();
                            }
                          }
                        },
                        {
                          tag: "p",
                          class:
                            "modal-upload-XML-body-drop-area-main-form-tutorial",
                          props: {
                            innerHTML: "Kéo thả files vào đây"
                          }
                        },
                        {
                          tag: "div",
                          class:
                            ["modal-upload-XML-body-drop-area-main-gallery","grid","gallery_c0ek499ts0"],
                        },
                        {
                          tag: "progress",
                          class:[
                            "modal-upload-XML-body-drop-area-main-process-bar",
                            "progress-bar_c0ek499ts0"
                          ],
                          props: {
                            max: "100",
                            value: "0"
                          }
                        }
                      ]
                    },
                    {
                      tag: "div",
                      class: "modal-upload-XML-body-drop-save",
                      child: [
                        self.select,
                        {
                          tag: "div",
                          class: [
                            "quantumWizButtonEl",
                            "quantumWizButtonPaperbuttonEl",
                            "quantumWizButtonPaperbuttonFlat",
                            "quantumWizButtonPaperbuttonFlatColored",
                            "quantumWizButtonPaperbutton2El2",
                            "quantumWizDialogPaperdialogDialogButton"
                          ],
                          style: {
                            marginLeft: "10px",
                            border: "1px solid rgb(169, 169, 169)",
                            width: "90px"
                          },
                          child: [
                            {
                              tag: "span",
                              class: "quantumWizButtonPaperbuttonContent",
                              child: [
                                {
                                  tag: "span",
                                  class: "quantumWizButtonPaperbuttonLabel",
                                  props: {
                                    innerHTML: "Hủy"
                                  }
                                }
                              ]
                            }
                          ],
                          on: {
                            click: function() {
                              self.functionClickCancel();
                              self.resetFile();
                              if(self.modal!==undefined)
                              self.modal.parentNode.removeChild(self.modal);
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
    self.xnen = temp;

    self.containGetImage = temp;
    return temp;
  },
  createModal: function(DOMElement,functionClickDone=function(){},functionClickCancel=function(){}) {
    var self = this;
    var xnen = self.containGetImage();
    var pointControl = _({
      tag: "div",
      class: ["modal-upload-XML-body-navigation-bar", "selected-modal"],
      child: [
        {
          tag: "div",
          class: "modal-upload-XML-body-navigation-bar-button",
          props: {
            innerHTML: "Tải lên"
          }
        }
      ],
      on: {
        click: function() {
          if (self.me === this) return;
          if (self.me !== undefined)
            self.me.classList.remove("selected-modal");
          this.classList.add("selected-modal");
          self.me = this;
          xnen.setPage(0);
        }
      }
    });
    self.me = pointControl;

    self.modal = _({
      tag: "modal",
      child: [
        {
          tag: "div",
          class: "modal-upload-XML",
          child: [
            {
              tag: "div",
              class: "modal-upload-XML-header",
              child: [
                {
                  tag: "div",
                  class: "modal-upload-XML-header-text",
                  props: {
                    innerHTML: "Chèn Files"
                  }
                },
                {
                  tag: "i",
                  class: [
                    "modal-upload-XML-header-icon-close",
                    "material-icons"
                  ],
                  props: {
                    innerHTML: "close"
                  },
                  on: {
                    click: function() {
                      self.modal.parentNode.removeChild(self.modal);
                    }
                  }
                }
              ]
            },
            {
              tag: "div",
              class: "modal-upload-XML-body",
              child: [
                {
                  tag: "div",
                  class: "modal-upload-XML-body-navigation",
                  child: [pointControl]
                },
                xnen
              ]
            }
          ]
        }
      ]
    });
    DOMElement.appendChild(self.modal);
    self.functionClickDone = functionClickDone;
    self.functionClickCancel = functionClickCancel;
    self.createEvent();
    return self.modal;
  },
  createEvent: function() {
    var self = this;
    if(self.dropArea===undefined)
    {
      self.dropArea = $('.drop-area_c0ek499ts0',self.containGetImage);
    }
    // self.dropArea = document.getElementById("drop-area");
    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      self.dropArea.addEventListener(
        eventName,
        self.preventDefaults,
        false
      );
      document.body.addEventListener(
        eventName,
        self.preventDefaults,
        false
      );
    });

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach(eventName => {
      self.dropArea.addEventListener(eventName, self.highlight, false);
    });
    ["dragleave", "drop"].forEach(eventName => {
      self.dropArea.addEventListener(eventName, self.unhighlight, false);
    });
    // Handle dropped files
    self.dropArea.addEventListener(
      "drop",
      function(e) {
        self.handleDrop(e, self);
      },
      false
    );

    self.uploadProgress = [];

  },
  preventDefaults: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  highlight: function(e) {
    this.classList.add("highlight");
  },
  unhighlight: function(e) {
    this.classList.remove("active");
  },
  handleDrop: function(e, self) {
    var dt = e.dataTransfer;
    var files = dt.files;
    self.handleFiles(files, self);
  },
  initializeProgress: function(numFiles) {
    var self = this;
    if(self.progressBar===undefined)
    self.progressBar =  $('.progress-bar_c0ek499ts0',self.containGetImage);
    self.progressBar.value = 0;
    self.uploadProgress = [];

    for (var i = numFiles; i > 0; i--) {
      self.uploadProgress.push(0);
    }
  },
  updateProgress: function(fileNumber, percent, self) {
    self.uploadProgress[fileNumber] = percent;
    var total =
      self.uploadProgress.reduce((tot, curr) => tot + curr, 0) /
      self.uploadProgress.length;
    console.debug("update", fileNumber, percent, total);
    self.progressBar.value = total;
  },
  handleFiles: function(files) {
    var self = this;
    files = [...files];
    self.initializeProgress(files.length);
    for (var i = 0; i < files.length; i++) {
      self.uploadFile(files[i], i);
      self.previewFile(files[i]);
    }
  },
  marginAlign: function() {
    var temp = _({
      tag: "div",
      class: "max-width-image-resize"
    });
    temp.getValue = function() {
      var resultXML = "";
      for (var i = 0; i < temp.childNodes.length; i++) {
        resultXML += temp.childNodes[i].getValue();
      }
      return resultXML;
    };
    return temp;
  },
  previewFile: function(file) {
    var self = this;
    if(self.gallery===undefined)
    {
      self.gallery = $(".gallery_c0ek499ts0",self.containGetImage);
    }
    if(file.type.match("image.*"))
    {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        if(self.blackWhite===true)
        {
            grayscale(reader.result,true).then(function(value){
              var img =  self.Image(value);
              img.value = value;
              var parent = self.gallery;
              parent.appendChild(img);
              img.onload = function() {
                
              };
            })
        }else
        {
          var value = reader.result;
          var img =  self.Image(value);
          img.value = value;
          var parent = self.gallery;
          parent.appendChild(img);
          img.onload = function() {
            
          };
        }
        
      };
    }else
    {
      var img =  self.Image(this.iconSrc+file.name.substr((file.name.lastIndexOf('.') + 1))+".svg");
      img.value = file;
      var parent = self.gallery;
      parent.appendChild(img);

      img.onload = function() {
      };
    }
  },
  setBackWhite: function()
  {
    this.blackWhite = true;
  },
  addFile: function(data,ref = "") {
    if(this.gallery===undefined)
    {
      this.gallery = $(".gallery_c0ek499ts0",this.containGetImage);
    }
    var img =  this.Image(ref+data.src);
    if(this.enableCheckBox&&data.thumnail==1){
      img.checkboxButton.click();
    }
      
    data.ref = ref;
    img.value = data;
    var parent = this.gallery;
    parent.appendChild(img);

    img.onload = function() {
    };
  },
  resetFile:function(){
    var self = this;
    if(self.gallery===undefined)
    {
      self.gallery = $(".gallery_c0ek499ts0",self.containGetImage);
    }
    self.gallery.clearChild();
  },
  getFile:function(){
    var arr = [];
    if(this.gallery===undefined)
    {
      this.gallery = $(".gallery_c0ek499ts0",this.containGetImage);
    }
    for(var i=0;i<this.gallery.childNodes.length;i++)
    {
      arr.push(this.gallery.childNodes[i].value);
    }
    return arr;
  },
  getImportTant:function(){
    if(this.gallery===undefined)
    {
      this.gallery = $(".gallery_c0ek499ts0",this.containGetImage);
    }
    var arr = this.gallery.getElementsByClassName("checked-pizo");
    if(arr.length>0)
    return this.getFile().indexOf(arr[0].value);
  },
  uploadFile: function(file, i, self) {
    var self = this;
    self.updateProgress(i, 100, self);
      self.select.classList.remove("disable");
    if (!self.xnen.classList.contains("visible"))
      self.xnen.classList.add("visible");
    // var url = "./php/upload/handle_file_upload.php";
    // var name =
    //   ("img_" + Math.random() + Math.random()).replace(/\./g, "") +
    //   file.name.slice(file.name.lastIndexOf("."));

    // var xhr = new XMLHttpRequest();
    // var formData = new FormData();
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // // Update progress (can be used to show progress indicator)
    // xhr.upload.addEventListener("progress", function(e) {
    //   self.updateProgress(i, (e.loaded * 100.0) / e.total || 100, self);
    // });

    // xhr.addEventListener("readystatechange", function(e) {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     self.updateProgress(i, 100, self); // <- Add this
    //     // self.select.classList.remove("disable");
    //     if (!self.modal.classList.contains("visible"))
    //       self.modal.classList.add("visible");
    //     self.imgUrl.src = "./img/delete/" + name;
    //     self.imgAll.push("./img/delete/" + name);
    //     document.getElementById("gallery").style.position = "relative";
    //   } else if (xhr.readyState == 4 && xhr.status != 200) {
    //     // Error. Inform the user
    //   }
    // });

    // formData.append("upload_name", name);
    // formData.append("file", file);
    // xhr.send(formData);
  }
};