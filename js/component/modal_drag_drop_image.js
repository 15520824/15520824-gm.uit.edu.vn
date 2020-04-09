import Fcore from '../dom/Fcore';
import '../../css/form_create_edit.css';
import '../../css/test_question.css';
import '../../css/test.css';
var _ = Fcore._;
var $ = Fcore.$;
var xmlModalDragImage;
export default xmlModalDragImage = {
  imgAll: [],
  imgDelete: [],
  deleteAllTrash: function() {
    var self = this;
    for (var i = 0; i < self.imgAll.length; i++) {
      data_module.img.delete(self.imgAll[i]);
    }
    for (var i = 0; i < self.imgDelete.length; i++) {
      data_module.img.delete(self.imgDelete[i]);
    }
  },
  Image: function(srcImg) {
    var temp = _({
      tag: "img",
      class: "full-size",
      props: {
        src: srcImg
      },
      on: {
        click: function() {
          var el = this;
          while (
            !el.classList.contains("image-autoresize-create") &&
            !el !== document.body
          )
            el = el.parentNode;

          if (
            el.classList.contains("hasFocus") ||
            el.classList.contains("image-autoresize-preview")
          )
            mViewer.pickImageElement(this, this.src);
          else if (el !== document.body) el.classList.add("hasFocus");
        }
      }
    });
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
    return temp;
  },
  containGetImage: function() {
    var self = this;
    var input = _({
      tag: "input",
      class: "modal-upload-XML-body-drop-area-main-form-input",
      props: {
        type: "file",
        multiple: "",
        accept: "image/*",
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
                    "displayVisiable"
                  ],
                  props: {
                    id: "drop-area"
                  },
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
                            innerHTML: "Chọn một hình ảnh để tải lên",
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
                            innerHTML: "Kéo thả hình ảnh vào đây"
                          }
                        },
                        {
                          tag: "div",
                          class:
                            "modal-upload-XML-body-drop-area-main-gallery",
                          props: {
                            id: "gallery"
                          }
                        },
                        {
                          tag: "progress",
                          class:
                            "modal-upload-XML-body-drop-area-main-process-bar",
                          props: {
                            id: "progress-bar",
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
                    innerHTML: "Chèn ảnh"
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
    self.dropArea = document.getElementById("drop-area");
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
    self.progressBar = document.getElementById("progress-bar");
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
  handleFiles: function(files, self) {
    files = [...files];
    self.initializeProgress(files.length);
    for (var i = 0; i < files.length; i++) {
      self.uploadFile(files[i], i, self);
      self.previewFile(files[i], self);
    }
  },
  elementCreateByObject: function(el, object, mode = 0) {
    var self = this;
    var marginAlign;
    var url, width, height, align;
    if (object.childNodes === undefined) {
      url = object.url;
      width = object.width + "px";
      height = object.height + "px";
      align = object.align;
    } else {
      url = self.getDataformObject(object, "value");
      for (var i = 0; i < object.childNodes.length; i++) {
        if (object.childNodes[i].tagName === "style") {
          width = xmlComponent.getDataformObject(
            object.childNodes[i],
            "width"
          );
          height = xmlComponent.getDataformObject(
            object.childNodes[i],
            "height"
          );
          align = xmlComponent.getDataformObject(
            object.childNodes[i],
            "align"
          );
          break;
        }
      }
    }
    if (el.getElementsByClassName("max-width-image-resize").length === 0) {
      marginAlign = self.marginAlign();
      if (mode == 0) {
        marginAlign.classList.add("max-width-image-resize-edit");
        marginAlign.style.width = "100%";
      } else if (mode == 1) {
        marginAlign.classList.add("max-width-image-resize-padding");
        marginAlign.classList.add("max-width-image-resize-edit");
      } else if (mode == 2) {
        marginAlign.classList.add("max-width-image-resize-edit");
      } else if (mode == 3) {
        marginAlign.classList.add("margin-align-padding");
        marginAlign.classList.add("max-width-image-resize-edit");
      } else if (mode == 4) {
        marginAlign.classList.add("margin-align");
        marginAlign.classList.add("max-width-image-resize-edit");
      }
      el.appendChild(marginAlign);
    } else if (
      el.getElementsByClassName("max-width-image-resize").length === 1
    )
      marginAlign = el.getElementsByClassName("max-width-image-resize")[0];

    var menuProps = {
      items: [
        {
          text: "Canh trái",
          icon: "span.mdi.mdi-format-align-left",
          cmd: "align_left"
        },
        {
          text: "Canh giữa",
          icon: "span.mdi.mdi-format-align-center",
          cmd: "align_center"
        },
        {
          text: "Canh phải",
          icon: "span.mdi.mdi-format-align-right",
          cmd: "align_right"
        },
        {
          text: "Xóa",
          icon: "span.mdi.mdi-delete",
          cmd: "delete"
        }
      ]
    };
    var button = _({
      tag: "div",
      class: ["freebirdFormeditorViewMediaEditMenuButton"],
      child: [
        {
          tag: "i",
          class: [
            "freebirdFormeditorViewMediaEditMenuButtonContent",
            "material-icons",
            "icon-ceneter"
          ],
          props: {
            innerHTML: "more_vert"
          }
        }
      ]
    });
    var imgUrl = self.Image(url);
    var img = _({
      tag: "widthheightresizer",
      class: ["image-autoresize-create"],
      child: [button, imgUrl],
      on: {
        sizechange: function(event) {}
      }
    });

    img.style.width = width;
    img.style.height = height;
    marginAlign.style.textAlign = align;

    absol.QuickMenu.showWhenClick(button, menuProps, [2], function(
      menuItem
    ) {
      if (menuItem.cmd === "align_left") {
        img.parentNode.style.textAlign = "left";
      } else if (menuItem.cmd === "align_center") {
        img.parentNode.style.textAlign = "center";
      } else if (menuItem.cmd === "align_right") {
        img.parentNode.style.textAlign = "right";
      } else if (menuItem.cmd === "delete") {
        var parent = img.parentNode;
        img.parentNode.removeChild(img);
        if (parent.childNodes.length === 0)
          parent.parentNode.removeChild(parent);
        self.imgDelete.push(imgUrl.getAttribute("src"));
      }
      var el = img;
      while (!el.classList.contains("true-dame")) el = el.parentNode;
      el.click();
    });
    img.getValue = function() {
      var resultXML = "<content>";
      resultXML += "<type>image</type>";
      resultXML +=
        "<style><width>" +
        img.style.width +
        "</width><height>" +
        img.style.height +
        "</height><align>" +
        img.parentNode.style.textAlign +
        "</align></style>";
      resultXML += "<value>" + imgUrl.getAttribute("src") + "</value>";
      resultXML += "</content>";
      return resultXML;
    };
    marginAlign.appendChild(img);
    return marginAlign;
  },
  elementPreviewByObject: function(el, object, mode = 0) {
    var self = this;
    var marginAlign;
    if (el.getElementsByClassName("max-width-image-resize").length === 0) {
      marginAlign = self.marginAlign();
      if (mode == 0) {
        marginAlign.classList.add("max-width-image-resize-edit");
        marginAlign.style.width = "100%";
      } else if (mode == 1) {
        marginAlign.classList.add("max-width-image-resize-padding");
        marginAlign.classList.add("max-width-image-resize-edit");
      } else if (mode == 2) {
      } else if (mode == 3) {
        marginAlign.classList.add("margin-align-padding");
      } else if (mode == 4) {
        marginAlign.classList.add("margin-align");
      }
      el.appendChild(marginAlign);
    } else if (
      el.getElementsByClassName("max-width-image-resize").length === 1
    )
      marginAlign = el.getElementsByClassName("max-width-image-resize")[0];

    var imgUrl = xmlComponent.Image(
      xmlComponent.getDataformObject(object, "value")
    );
    var img = _({
      tag: "widthheightresizer",
      class: ["image-autoresize-create"],
      child: [imgUrl],
      on: {
        sizechange: function(event) {}
      }
    });
    img.getElementsByClassName(
      "absol-width-height-resizer-anchor-bot-right"
    )[0].style.display = "none";
    img.getElementsByClassName(
      "absol-width-height-resizer-anchor-bot-left"
    )[0].style.display = "none";
    img.getElementsByClassName(
      "absol-width-height-resizer-anchor-top-right"
    )[0].style.display = "none";
    img.getElementsByClassName(
      "absol-width-height-resizer-anchor-top-left"
    )[0].style.display = "none";
    img.classList.add("image-autoresize-preview");
    for (var i = 0; i < object.childNodes.length; i++) {
      if (object.childNodes[i].tagName === "style") {
        img.style.width = xmlComponent.getDataformObject(
          object.childNodes[i],
          "width"
        );
        img.style.height = xmlComponent.getDataformObject(
          object.childNodes[i],
          "height"
        );
        marginAlign.style.textAlign = xmlComponent.getDataformObject(
          object.childNodes[i],
          "align"
        );
        break;
      }
    }
    marginAlign.appendChild(img);
    marginAlign.getValue = function() {
      var resultXML = "<content>";
      resultXML += "<type>image</type>";
      resultXML +=
        "<style><width>" +
        img.style.width +
        "</width><height>" +
        img.style.height +
        "</height><align>" +
        img.parentNode.style.textAlign +
        "</align></style>";
      resultXML += "<value>" + imgUrl.getAttribute("src") + "</value>";
      resultXML += "</content>";
      return resultXML;
    };
    return marginAlign;
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
  previewFile: function(file, self) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      self.imgUrl = self.Image(reader.result);
      var img = _({
        tag: "div",
        class: "image-autoresize",
        style: {
          pointerEvents: "none",
          textAlign: "left"
        },
        child: [
          self.imgUrl
        ],
        on: {
          sizechange: function(event) {}
        }
      });
      var parent = document.getElementById("gallery");
      parent.style.position = "relative";
      var value;
      var srcURL;
      for (var i = 0; i < parent.childNodes.length; i++) {
        srcURL = parent.childNodes[i]
          .getElementsByClassName("full-size")[0]
          .getAttribute("src");
        value = self.imgAll.indexOf(srcURL);
        if (i != -1) {
          self.imgAll.splice(value, 1);
        }
      }
      parent.clearChild();
      parent.appendChild(img);

      self.imgUrl.onload = function() {
        img.style.width =
          self.imgUrl.naturalWidth *
            (img.clientHeight / self.imgUrl.naturalHeight) +
          "px";
      };
    };
  },
  uploadFile: function(file, i, self) {
    self.updateProgress(i, 100, self);
      self.select.classList.remove("disable");
    if (!self.modal.classList.contains("visiable"))
      self.modal.classList.add("visiable");
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
    //     if (!self.modal.classList.contains("visiable"))
    //       self.modal.classList.add("visiable");
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