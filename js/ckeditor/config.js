/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */


CKEDITOR.editorConfig = function(config) {
    config.extraPlugins = ['LinkDB', 'Note'];
    config.allowedContent = true;
    config.contentsCss = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    // config.cloudServices_uploadUrl = 'DDFFE2739B83A73DDF16AB641ECA2';
    // config.cloudServices_tokenUrl = 'https://lab.daithangminh.vn/hr_system_settings/php/uploadMedia.php';
    config.filebrowserBrowseUrl = 'ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = 'ckfinder/ckfinder.html?type=Images';
    config.filebrowserFlashBrowseUrl = 'ckfinder/ckfinder.html?type=Flash';
    config.filebrowserUploadUrl = 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';
    config.filebrowserFlashUploadUrl = 'ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';
    // config.extraPlugins = ['Attach_Activity','Attach'];
    // config.extraPlugins = 'Attach';
    config.toolbar = 'MyToolbar';
    config.toolbar = [
        { name: 'document', items: ['Source'] },
        { name: 'editing', items: ['Find', 'Replace'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor', 'LinkDB', 'Note'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
    ];
};


// CKEDITOR.addCss('figure[class*=easyimage-gradient]::before { content: ""; position: absolute; top: 0; bottom: 0; left: 0; right: 0; }' +
//     'figure[class*=easyimage-gradient] figcaption { position: relative; z-index: 2; }' +
//     '.easyimage-gradient-1::before { background-image: linear-gradient( 135deg, rgba( 115, 110, 254, 0 ) 0%, rgba( 66, 174, 234, .72 ) 100% ); }' +
//     '.easyimage-gradient-2::before { background-image: linear-gradient( 135deg, rgba( 115, 110, 254, 0 ) 0%, rgba( 228, 66, 234, .72 ) 100% ); }');