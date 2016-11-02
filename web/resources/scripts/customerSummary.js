$(document).ready(function () {
    var csvCustomerGeneralData = $('#csvCustomerGeneralData').text();
    var customerShortView1 = $('#customerShortView1').text();
    if (csvCustomerGeneralData != "" && customerShortView1 != "")
        $('#customerShortView1').hide();
    ;
});