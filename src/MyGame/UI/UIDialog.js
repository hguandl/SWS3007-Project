/** When using this class, do not create new instance but use the dialog
 *
 */
class UIDialog {
    constructor() {
        this._ele = document.getElementById(_C.DialogWrapper);
    }
}

let dialog = new UIDialog();
