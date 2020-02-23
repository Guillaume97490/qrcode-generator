
$(() => {
  $('[data-toggle="tooltip"]').tooltip();

  $('#submit-btn').click((e) => {
    e.preventDefault();
    if ($('#submit-btn.disabled').length) return;
    if ($('#url-input').val() == "") return $('#form-url').parsley().validate();
    $('#form-url .not-loading').addClass('d-none');
    $('#form-url .loading').removeClass('d-none');

    grecaptcha.ready(function () {
      grecaptcha.execute('6Lep6NoUAAAAABVg-Rt15HlXBohuCJK7QhggzQgT', { action: 'homepage' }).then(function (token) {
        $('#form-url').prepend('<input type="hidden" name="token" value="' + token + '">');
        // $('#form-url').submit();
        let url = {
          token : token,
          url_input: $('#url-input').val()
        }
        $.post('/', url, (data) => {
          console.log(data);
        })
      });
    });

  })

  $('#url-input').on('keyup', e => {
    $('#submit-btn').addClass('disabled');
    if ($('#form-url').parsley().validate()) {
      $('#submit-btn').removeClass('disabled');
    }
  })

  $(document).on('click', '[data-id]', function (e) {
    e.preventDefault();
    let id = $(this).data('id');
    $.get(`/qrcode/${id}`, (data) => {
      let image = new Image();
      image.src = data;
      $('#qrcode').append(image);
      $('#myModal').modal('toggle');
    });
  });

  $('#myModal').on('hidden.bs.modal', function (e) {
    $('#qrcode').html('');
  })

  $('[data-copy-id]').click(function() {
      let id = $(this).data('copyId');
      let text = $(`a[data-id=${id}]`).text().trim();
      let temp = $("<input style='opacity:0;'>");
      $("body").append(temp);
      temp.val(text).select();
      document.execCommand("copy");
      $(this).attr('data-original-title',text+ ' à été copié').tooltip('show');
      temp.remove();
  });
  
})
