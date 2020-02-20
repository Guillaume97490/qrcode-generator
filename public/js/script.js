
$(() => {

    $(document).on('click', '[data-id]', function(e){
        e.preventDefault()
        let id = $(this).data('id')
        console.log(id)
        $.get(`/qrcode/${id}`, (data) => {
            let image = new Image();
            image.src = data;
            $('#qrcode').append(image);
            // $('$qrcode img').css('width','50%')
            $('#myModal').modal('toggle');
        });
      });

      $('#myModal').on('hidden.bs.modal', function (e) {
        $('#qrcode').html('')
      })
})
