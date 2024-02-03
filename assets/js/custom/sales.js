$(function() {
    // Inisialisasi tanggal awal dan akhir
    var start = moment().startOf('month');
    var end = moment().endOf('month');

    // Fungsi untuk mendapatkan nilai parameter dari URL
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Fungsi untuk mengatur tanggal berdasarkan parameter URL
    function setDatesFromUrl() {
        var startDateParam = getParameterByName('start_date');
        var endDateParam = getParameterByName('end_date');

        if (startDateParam !== null && endDateParam !== null) {
            var startDate = moment(startDateParam);
            var endDate = moment(endDateParam);

            $('#reportrange span').html(startDate.format('DD MMMM, YYYY') + ' - ' + endDate.format('D MMMM, YYYY'));
            $('#selectedStartDate').val(startDate.format('YYYY-MM-DD'));
            $('#selectedEndDate').val(endDate.format('YYYY-MM-DD'));
        }
    }

    // Inisialisasi tanggal dan panggil setDatesFromUrl untuk penanganan parameter URL
    $('#reportrange span').html(start.format('DD MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY'));
    $('#selectedStartDate').val(start.format('YYYY-MM-DD'));
    $('#selectedEndDate').val(end.format('YYYY-MM-DD'));
    setDatesFromUrl();

    // Callback untuk Date Range Picker
    function cb(start, end) {
        const formattedDateRange = start.format('DD MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY');
        $('#reportrange span').html(formattedDateRange);
        $('#selectedStartDate').val(start.format('YYYY-MM-DD'));
        $('#selectedEndDate').val(end.format('YYYY-MM-DD'));
        
        $('ul#dateRanges li').removeClass('active');
        
        const selectedRange = formattedDateRange.trim();
        
        $('ul#dateRanges li').each(function() {
            const rangeKey = $(this).data('range-key');
            
            if (rangeKey === selectedRange || (rangeKey === 'Bulan ini' && selectedRange.includes('Hari ini'))) {
                $(this).addClass('active');
                return false;
            }
        });
        
        fetchData();
    }

    // Inisialisasi Date Range Picker
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Hari ini': [moment(), moment()],
            'Kemarin': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 Hari yang lalu': [moment().subtract(6, 'days'), moment()],
            'Bulan ini': [moment().startOf('month'), moment().endOf('month')],
            'Bulan Lalu': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    // Fungsi untuk mengirim permintaan AJAX
    function fetchData() {
        var startDate = $('#selectedStartDate').val();
        var endDate = $('#selectedEndDate').val();
        window.location.replace(baseurl + 'laporan?start_date=' + startDate + '&end_date=' + endDate);
    }
});