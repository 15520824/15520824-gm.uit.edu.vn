CKEDITOR.plugins.add('Attach_Activity',
{
    hidpi: true,
    init: function (editor) {
        var pluginName = 'Attach_Activity';
        editor.ui.addButton('Attach_Activity',
            {
                label: 'Attach activity',
                command: 'comand_attach_activity',
                icon: CKEDITOR.plugins.getPath('Attach_Activity') + 'icon.png'
            });
    }
});