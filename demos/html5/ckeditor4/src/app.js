// Load scripts.
import '@wiris/mathtype-ckeditor4/plugin';

// Load styles.
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';


// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKEditor';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
CKEDITOR.tools.enableHtml5Elements( document );

// Add wiris plugin.
CKEDITOR.plugins.addExternal('ckeditor_wiris', `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`, 'plugin.js'); //eslint-disable-line

// KB-5603: 1. Add some CSS to hide the drag handler for dynamic image resizing and positioning for math formulas.
CKEDITOR.addCss('img.Wirisformula + span.cke_widget_drag_handler_container { display:none  !important; } img.Wirisformula + span.cke_image_resizer, img.Wirisformula + span.cke_widget_drag_handler_container + span.cke_image_resizer { display:none !important; }');

// Initialize plugin.
CKEDITOR.replace('editor', { //eslint-disable-line
  // KB-5603: 2. Add the 'Enhanced Image' and 'Justify' plugins
  // while removing the 'image' plugin to avoid collision warning.
  extraPlugins: 'ckeditor_wiris, image2, justify',
  removePlugins: 'image',
  allowedContent: true,
  toolbar: [
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike'] },
    {
      name: 'paragraph',
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']
    },
    // KB-5603: Add the justify commands to allow alignment of math formulas.
    { name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},

    { name: 'clipboard', items: ['Undo', 'Redo'] },

    { name: 'wirisplugins', items: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_formulaEditorChemistry'] },

    {
      name: 'insert',
      items: ['Image', 'Table']
    },
    {
      name: 'editing',
      items: ['Scayt']
    }
  ],
  removeDialogTabs: 'image:advanced;link:advanced'
});

// Handle on editor ready event.
CKEDITOR.on('instanceReady', function(evt) {                     //eslint-disable-line
  // Get and set the editor and wiris versions in this order.
  Generic.setEditorAndWirisVersion(CKEDITOR.version, WirisPlugin.currentInstance.version);          //eslint-disable-line


  // KB-5603: on('enter') keystroke behavior when an image is selected.
  // Avoid using Image2 dialog when clicking 'Enter' keystroke
  // when a Rendered Formula image is currently the selection. 
  CKEDITOR.on('dialogDefinition', function(evt) {
    let dialogName = evt.data.name;
    let dialog = evt.data.dialog;

    if (dialogName == 'image2') {
      dialog.on('show', function () {
        editor = evt.data.dialog.getParentEditor();
        var element = editor.getSelection().getSelectedElement();
        // Check if there's a Rendered Image formula from MathType
        var formula = element.$.getElementsByClassName('Wirisformula');
        if (formula.length > 0) {
          let mathml = formula[0].getAttribute('data-mathml');
          // Don't show the Enhanced Image plugin dialog.
          this.hide();        
          return false;
        }
      });
    }
  });

  // KB-5603: Remove 'image2' contextMenu item for Mathematical formulas rendered with MathType.
  if (evt.editor.contextMenu) {
    evt.editor.contextMenu.addListener(function(element, selection) {  
      if (element.hasClass('cke_widget_image')) {
        // Check if there's a Rendered Image formula from MathType
        var formula = element.$.getElementsByClassName('Wirisformula');
        if (formula.length > 0) {
            // Then, disable the Context menu for Image2.
            // First, save the items on a variable.
            var items = evt.editor.contextMenu.items;
            // Then, remove all context menu items.
            evt.editor.contextMenu.removeAll();
            // Finally, add them all again, except the 'image' context menu item.
            for (var i=0; i < items.length; i++) {
              if (items[i].command !== 'image') {
                evt.editor.contextMenu.add(items[i]);
              }
            } 
        }        
      }
    });
  }

  // KB-5603: Control 'Enhanced Image' drag&drop behavior to mitigate errors using 'addUpcastCallback'.
  //      On an already edited image format math formula,
  //      the first attempt to drag works, the second raises an error. :shrug:
  //      It works fine and as expected with 'normal' and with, not previously edited MathType, formula images.
  //      @see: https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_plugins_widget_repository.html#method-addUpcastCallback
  CKEDITOR.instances.editor.widgets.addUpcastCallback( function( element ) {    
    // Check whether a MathType generated formula is present.    
    var e = element;
    do {
      if (e.children) e = e.children[0]; 
      if (e.name == 'img' && e.hasClass('Wirisformula')) {
        // So, image elements with the "Wirisformula" class will not be upcasted (e.g. to the Image2 widget).
        return false;
      }
    } while (e.children && e.children.length > 0) 
  });

});


// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(CKEDITOR.instances.editor.getData(), 'transform_content');                  //eslint-disable-line
});
