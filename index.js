$(document).ready(() => {
    const addButton = $('#addQuestion');
    const addModal = $('#addModal');
    addButton.on('click', () => {
        // if (addModal.hasClass('show')) {
        //     addModal.hide();
        // } else {
        //     addModal.show();
        // }
        addModal.modal('show');
    });
});
