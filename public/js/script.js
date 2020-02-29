
$(() => {

  tooltip() // ENABLE TOOLTIPS 

  $('#submit-btn').click((e) => {
    if ($("#modalTpl").length > 0) {$("#modalTpl").remove();}
    if ($("#successModal").length > 0) {$("#successModal").remove();}

     
    e.preventDefault();
    if ($('#submit-btn.disabled').length) return;
    if ($('#url-input').val() == "") return $('#form-url').parsley().validate();
    $('#form-url .not-loading').addClass('d-none');
    $('#form-url .loading').removeClass('d-none');

    grecaptcha.ready(function () {
      grecaptcha.execute('6Lep6NoUAAAAABVg-Rt15HlXBohuCJK7QhggzQgT', { action: 'homepage' }).then(function (token) { // GOOGLE RECAPCHA V3
        $('#form-url').prepend('<input type="hidden" name="token" value="' + token + '">');
        let url = {
          token : token,
          url_input: $('#url-input').val()
        }
        $.post('/', url, (data) => { // POST NEW URL 
          $('#form-url .loading').addClass('d-none');
          $('#form-url .not-loading').removeClass('d-none');
          // console.log(data);
          $('html').append(data);
          
          $('#modalTpl').modal('toggle');
          tooltip() // ENABLE TOOLTIP ON MODAL
          // $('[data-copy-id]').click(function() { // COPY FUNCTION ON MODAL 
          //   let id = $(this).data('copyId');
          //   let text = $(`div[data-id=${id}]`).text().trim();
          //   let temp = $("<input style='opacity:0;'>");
          //   $("#modalTpl .modal-body").append(temp);
          //   temp.val(text).select();
          //   document.execCommand("copy");
          //   $(this).attr('data-original-title',text+ ' à été copié').tooltip('show');
          //   temp.remove();
          // })
          enablecopy()

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

  $(document).on('click', 'a[data-qr-id]', function (e) { // GET QRCODE FUNCTION
    e.preventDefault();
    let id = $(this).data('qrId');
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

  

  $('#try-now-cta').click(()=> $('#url-input').focus());

  $('.page-link').click(e =>{
    e.preventDefault();
    el = $(e.currentTarget);
    $('.page-link').each((i,e) => $(e).removeClass('bg-primary text-white'));
    el.addClass('bg-primary text-white')
    let url = el.attr('href');
    $.get(url, (data)=> {
      $('.latest-list').html(data)
      tooltip()
      enablecopy()
    })
  })

  enablecopy()
  $(document).ready($('.page-link.bg-primary').click());
})

function enablecopy() {
  $('[data-copy-id]').click(function() { // COPY FUNCTION
    let id = $(this).data('copyId');
    let text = $(`a[data-id=${id}]`).text().trim();
    console.log(text);
    let temp = $("<input style='opacity:0;'>");
    $("body").append(temp);
    temp.val(text).select();
    document.execCommand("copy");
    $(this).attr('data-original-title',text+ ' à été copié').tooltip('show');
    temp.remove();
  });
}

tooltip = () => $('[data-toggle="tooltip"]').tooltip(); // ENABLE TOOLTIPS 

