exports.data = `<div id="errorModal" class="modal fade" tabindex="-1" role="dialog">
<div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header bg-danger">
            <h5 class="modal-title text-white">Erreur</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="container">
                <div class="row">
                    <%=data.message%>
                    <div id="qrcode" class="col-12 text-center">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>`