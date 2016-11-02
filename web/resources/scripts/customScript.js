function ckBoxAllCheckedClick() {
    $('#select_all').change(function () {
        var checkboxes = $(this).closest('form').find(':checkbox');
        if ($(this).prop('checked')) {
            checkboxes.prop('checked', true);
        } else {
            checkboxes.prop('checked', false);
        }
    });
}