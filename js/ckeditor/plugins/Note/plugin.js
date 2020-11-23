CKEDITOR.plugins.add('Note',
{
    hidpi: true,
    init: function (editor) {
        var pluginName = 'Note';
        editor.ui.addButton('Note',
            {
                label: 'Create Note',
                command: 'comand_note',
                icon: CKEDITOR.plugins.getPath('Note') + 'icon.png'
            });
    }
});